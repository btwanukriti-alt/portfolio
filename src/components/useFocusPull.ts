'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import { createDebugLog } from './debugLog'
import { RADIUS, TILES, TILE_H, TILE_W } from './ScreenSphere'

// "Focus pull" from the Figma storyboard (Hero — focus pull, 342:143576).
// Clicking the glasses plays 01 -> 03 and rests on "03 — Cleared" (338:144084):
//   01 At rest     blurred screens seen through the lenses (-3.25 D)
//   02 Mid-pull    glasses rush toward the viewer, screens sharpening (-0.90 D)
//   03 Cleared     glasses gone, screens sharp all around  <- resting state
// Once cleared, the screens line a sphere around the viewer:
//   drag / swipe / scroll / arrow keys  look around (with a little glide on release)
//   pinch (trackpad or touch; + / - on keyboard)  widen or narrow the view
//   click a screen  open it (Lightbox)
// No motion data exists in the file, so timings here are our own.

const PULL_MS = 900
const REST_BLUR_PX = 13
const GLASSES_EXIT_SCALE = 6.5 // storyboard glasses grow ~1.9x by 02, then rush past the viewer
const REST_CLOSENESS = 1.35 // the view starts this much closer in and settles back as it clears
const PULL_SPIN_DEG = 24 // the sphere turns into place during the pull
const WIDEST_VIEW = 0.45 // fully pinched out, the view is this much wider
const PITCH_LIMIT = 42
const FRICTION = 0.93 // glide kept per 16ms after a drag is released
const ZOOM_SMOOTHING = 0.2 // per 16ms, eases the view toward the requested zoom
const HOME_SMOOTHING = 0.08 // per 16ms, turns the sphere back to the start on close
const TRACKPAD_PINCH_STEP = 0.01 // zoom progress per ctrl+wheel delta (how browsers report trackpad pinch)
const SCROLL_TURN = 0.6 // share of the drag rate a two-finger scroll turns the view
const KEY_STEP = 0.15
const KEY_SPIN = 0.06 // deg/ms push from an arrow key, about a 15 degree glide
const MAX_STEP = 0.2 // cap per event so coarse Ctrl+wheel notches don't jump the whole range
const CLICK_SLOP_PX = 6
const DEG = Math.PI / 180

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const clamp01 = (v: number) => clamp(v, 0, 1)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
// Smoothstep between two points of the pull, so every part starts and stops without a jolt.
const smooth = (p: number, start: number, end: number) => {
  const t = clamp01((p - start) / (end - start))
  return t * t * (3 - 2 * t)
}
const wrapDeg = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export type FocusPullRefs = {
  stage: RefObject<HTMLElement | null>
  canvas: RefObject<HTMLElement | null>
  rig: RefObject<HTMLElement | null>
  lens: RefObject<HTMLElement | null>
  curtain: RefObject<HTMLElement | null>
  layer: RefObject<HTMLElement | null>
  viewport: RefObject<HTMLElement | null>
  world: RefObject<HTMLElement | null>
}

// Everything that changes per frame lives outside React state and is written straight to the
// few elements that need it, so a frame never re-renders or re-lays out the page.
function createEngine(refs: FocusPullRefs) {
  const state = {
    pull: 0, // 0 = at rest, 1 = cleared
    pullTarget: 0,
    yaw: 0,
    pitch: 0,
    vYaw: 0, // deg/ms
    vPitch: 0,
    zoom: 0, // 0 = cleared view, 1 = widest
    zoomTarget: 0,
    dragging: false,
    perspective: 1,
    viewYaw: 0, // yaw as drawn, including the pull's spin
    frame: 0,
    last: 0,
    shown: TILES.map(() => true),
  }

  // Tiles span ~a quarter of the width on desktop, half on phones.
  const basePerspective = () => {
    const w = window.innerWidth
    return ((w <= 640 ? 0.5 : 0.24) * w * RADIUS) / TILE_W
  }

  // Cut the lens-shaped hole where the lenses sit at normal size. During the pull the whole
  // curtain scales about the glasses' centre with them, which the GPU does without redrawing
  // the mask every frame.
  const measureLens = () => {
    const stage = refs.stage.current
    const lens = refs.lens.current
    const rig = refs.rig.current
    const curtain = refs.curtain.current
    if (!stage || !lens || !rig || !curtain || state.pull > 0) return
    const s = stage.getBoundingClientRect()
    const l = lens.getBoundingClientRect()
    const r = rig.getBoundingClientRect()
    curtain.style.setProperty('--hole-x', `${l.left - s.left}px`)
    curtain.style.setProperty('--hole-y', `${l.top - s.top}px`)
    curtain.style.setProperty('--hole-w', `${l.width}px`)
    curtain.style.setProperty('--hole-h', `${l.height}px`)
    curtain.style.transformOrigin = `${r.left + r.width / 2 - s.left}px ${r.top + r.height / 2 - s.top}px`
  }

  // Hide tiles outside the view (and behind the viewer) so the browser only draws what's visible.
  const cull = (yaw: number, pitch: number, perspective: number) => {
    const tiles = refs.world.current?.children
    if (!tiles) return
    const cy = Math.cos(yaw * DEG)
    const sy = Math.sin(yaw * DEG)
    const cp = Math.cos(pitch * DEG)
    const sp = Math.sin(pitch * DEG)
    const reach = Math.atan(Math.hypot(window.innerWidth, window.innerHeight) / 2 / perspective) + 0.35
    const minFacing = Math.cos(Math.min(Math.PI, reach))
    TILES.forEach((t, i) => {
      const z = -t.x * sy + t.z * cy
      const facing = -(t.y * sp + z * cp) / RADIUS
      const show = facing > minFacing
      if (show === state.shown[i]) return
      state.shown[i] = show
      ;(tiles[i] as HTMLElement).style.visibility = show ? '' : 'hidden'
    })
  }

  // The tile under a point on screen. Browsers don't reliably hit-test inside a 3D scene, so this
  // casts a ray from the viewer (at the sphere's centre) through the point and finds what it meets.
  const pick = (clientX: number, clientY: number) => {
    const viewport = refs.viewport.current
    const tiles = refs.world.current?.children
    if (!viewport || !tiles) return null
    const box = viewport.getBoundingClientRect()
    // Ray in view space, then turned back by the camera's pitch and yaw into sphere space.
    const vx = clientX - (box.left + box.width / 2)
    const vy0 = clientY - (box.top + box.height / 2)
    const vz0 = -state.perspective
    const b = -state.pitch * DEG
    const vy = vy0 * Math.cos(b) - vz0 * Math.sin(b)
    const vz1 = vy0 * Math.sin(b) + vz0 * Math.cos(b)
    const a = -state.viewYaw * DEG
    const ray = [vx * Math.cos(a) + vz1 * Math.sin(a), vy, -vx * Math.sin(a) + vz1 * Math.cos(a)]

    let best: HTMLElement | null = null
    let bestT = Infinity
    TILES.forEach((t, i) => {
      if (!state.shown[i]) return
      const facing = (ray[0] * t.x + ray[1] * t.y + ray[2] * t.z) / RADIUS
      if (facing <= 0) return
      const hit = RADIUS / facing // distance along the ray to the tile's plane
      if (hit >= bestT) return
      const off = [ray[0] * hit - t.x, ray[1] * hit - t.y, ray[2] * hit - t.z]
      const across = off[0] * t.right[0] + off[1] * t.right[1] + off[2] * t.right[2]
      const along = off[0] * t.down[0] + off[1] * t.down[1] + off[2] * t.down[2]
      if (Math.abs(across) > TILE_W / 2 || Math.abs(along) > TILE_H / 2) return
      best = tiles[i] as HTMLElement
      bestT = hit
    })
    return best as HTMLElement | null
  }

  const draw = () => {
    const canvas = refs.canvas.current
    const rig = refs.rig.current
    const curtain = refs.curtain.current
    const layer = refs.layer.current
    const viewport = refs.viewport.current
    const world = refs.world.current
    if (!canvas || !rig || !curtain || !layer || !viewport || !world) return

    const p = state.pull
    const still = reducedMotion()
    const rush = clamp01((p - 0.05) / 0.95)
    const glassesScale = still ? 1 : Math.pow(GLASSES_EXIT_SCALE, rush * rush)
    const curtainOpacity = 1 - smooth(p, 0.5, 0.85)
    const blur = REST_BLUR_PX * (1 - smooth(p, 0.05, 0.75))

    canvas.style.setProperty('--text-opacity', String(1 - smooth(p, 0, 0.2)))
    rig.style.setProperty('--glasses-scale', String(glassesScale))
    rig.style.setProperty('--glasses-opacity', String(1 - smooth(p, 0.6, 0.9)))
    layer.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none'

    curtain.style.visibility = curtainOpacity > 0 ? '' : 'hidden'
    curtain.style.opacity = String(curtainOpacity)
    curtain.style.transform = `scale(${glassesScale})`

    const settle = still ? 1 : smooth(p, 0.1, 1)
    const perspective = basePerspective() * Math.pow(WIDEST_VIEW, state.zoom) * lerp(REST_CLOSENESS, 1, settle)
    const yaw = state.yaw + (still ? 0 : PULL_SPIN_DEG * (1 - smooth(p, 0, 1)))
    state.perspective = perspective
    state.viewYaw = yaw
    viewport.style.perspective = `${perspective}px`
    world.style.transform = `translateZ(${perspective}px) rotateX(${state.pitch}deg) rotateY(${yaw}deg)`
    cull(yaw, state.pitch, perspective)
  }

  const tick = (now: number) => {
    const dt = state.last ? Math.min(50, now - state.last) : 16
    state.last = now
    const still = reducedMotion()
    let moving = false

    if (state.pull !== state.pullTarget) {
      const step = still ? 1 : dt / PULL_MS
      state.pull =
        state.pullTarget > state.pull
          ? Math.min(state.pullTarget, state.pull + step)
          : Math.max(state.pullTarget, state.pull - step)
      moving = true
    }

    if (state.pullTarget === 0) {
      // Closing: turn back to where the pull started.
      const k = still ? 1 : 1 - Math.pow(1 - HOME_SMOOTHING, dt / 16)
      state.yaw -= state.yaw * k
      state.pitch -= state.pitch * k
      if (Math.abs(state.yaw) + Math.abs(state.pitch) > 0.01) moving = true
      else state.yaw = state.pitch = 0
    } else if (!state.dragging && (Math.abs(state.vYaw) > 0.0005 || Math.abs(state.vPitch) > 0.0005)) {
      state.yaw += state.vYaw * dt
      state.pitch += state.vPitch * dt
      const f = Math.pow(FRICTION, dt / 16)
      state.vYaw *= f
      state.vPitch *= f
      moving = true
    } else if (!state.dragging) {
      state.vYaw = state.vPitch = 0
    }
    if (Math.abs(state.pitch) > PITCH_LIMIT) {
      state.pitch = clamp(state.pitch, -PITCH_LIMIT, PITCH_LIMIT)
      state.vPitch = 0
    }

    const dz = state.zoomTarget - state.zoom
    if (Math.abs(dz) > 0.0005) {
      state.zoom += dz * (still ? 1 : 1 - Math.pow(1 - ZOOM_SMOOTHING, dt / 16))
      moving = true
    } else {
      state.zoom = state.zoomTarget
    }

    draw()
    state.frame = moving || state.dragging ? requestAnimationFrame(tick) : 0
    if (!state.frame) state.last = 0
  }

  // Runs the frame loop until everything has settled, then stops.
  const kick = () => {
    if (!state.frame) state.frame = requestAnimationFrame(tick)
  }

  const stop = () => {
    cancelAnimationFrame(state.frame)
    state.frame = 0
    state.last = 0
  }

  // Start the pull toward cleared (open) or back to rest; closing also turns the sphere home.
  const pullTo = (open: boolean) => {
    if (open) measureLens()
    else {
      state.zoomTarget = 0
      state.vYaw = state.vPitch = 0
      state.yaw = wrapDeg(state.yaw) // turn home the short way
    }
    state.pullTarget = open ? 1 : 0
    kick()
  }

  return { state, draw, kick, stop, measureLens, pick, pullTo }
}

export function useFocusPull(refs: FocusPullRefs) {
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState<HTMLImageElement | null>(null)
  const [engine] = useState(() => createEngine(refs))
  const focusedRef = useRef(focused)

  useEffect(() => {
    focusedRef.current = focused
  }, [focused])

  // Play the pull toward cleared (open) or back to rest (closed).
  useEffect(() => {
    engine.pullTo(open)
  }, [open, engine])

  // Keep the resting frame correct on resize and once web fonts shift the layout.
  useEffect(() => {
    const refresh = () => {
      engine.measureLens()
      engine.draw()
    }
    refresh()
    window.addEventListener('resize', refresh)
    document.fonts?.ready.then(refresh)
    return () => {
      window.removeEventListener('resize', refresh)
      engine.stop()
    }
  }, [engine])

  // While open: look around, pinch to widen the view, click a screen to open it.
  useEffect(() => {
    const stage = refs.stage.current
    if (!open || !stage) return
    const s = engine.state
    const log = createDebugLog()
    const zoomRange = Math.log(1 / WIDEST_VIEW) // one "full" pinch covers the whole zoom range
    const ready = () => focusedRef.current === null && s.pull > 0.9
    const degPerPx = () => 1 / DEG / s.perspective // turns so the screen under the pointer follows it
    const nudgeZoom = (amount: number) => {
      s.zoomTarget = clamp01(s.zoomTarget + clamp(amount, -MAX_STEP, MAX_STEP))
      engine.kick()
    }

    // Drag (mouse, pen, one finger). A second finger turns it into a pinch instead.
    const pointers = new Set<number>()
    let drag: null | { id: number; x: number; y: number; t: number; travel: number } = null
    const endDrag = () => {
      drag = null
      s.dragging = false
      stage.removeAttribute('data-dragging')
      engine.kick()
    }
    const onDown = (e: PointerEvent) => {
      if (!ready() || (e.pointerType === 'mouse' && e.button !== 0)) return
      if ((e.target as Element).closest('button')) return
      pointers.add(e.pointerId)
      if (pointers.size > 1) {
        if (drag) endDrag()
        return
      }
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, t: e.timeStamp, travel: 0 }
      s.dragging = true
      s.vYaw = s.vPitch = 0
      stage.setPointerCapture(e.pointerId)
      stage.setAttribute('data-dragging', '')
      engine.kick()
    }
    const onMove = (e: PointerEvent) => {
      if (!drag && e.pointerType === 'mouse') {
        stage.toggleAttribute('data-over-tile', ready() && engine.pick(e.clientX, e.clientY) !== null)
      }
      if (!drag || e.pointerId !== drag.id) return
      const dx = e.clientX - drag.x
      const dy = e.clientY - drag.y
      const dt = Math.max(1, e.timeStamp - drag.t)
      const k = degPerPx()
      s.yaw -= dx * k
      s.pitch = clamp(s.pitch + dy * k, -PITCH_LIMIT, PITCH_LIMIT)
      s.vYaw = lerp(s.vYaw, (-dx * k) / dt, 0.35)
      s.vPitch = lerp(s.vPitch, (dy * k) / dt, 0.35)
      drag.travel += Math.abs(dx) + Math.abs(dy)
      drag.x = e.clientX
      drag.y = e.clientY
      drag.t = e.timeStamp
    }
    const onUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId)
      if (!drag || e.pointerId !== drag.id) return
      const click = drag.travel < CLICK_SLOP_PX
      // No glide after a tap, after holding still before letting go, or with reduced motion.
      if (click || e.timeStamp - drag.t > 90 || reducedMotion()) s.vYaw = s.vPitch = 0
      endDrag()
      if (click && e.type === 'pointerup') {
        const tile = engine.pick(e.clientX, e.clientY)
        if (tile instanceof HTMLImageElement) setFocused(tile)
      }
    }

    // Two-finger scroll turns the view; Chrome, Edge and Firefox report a trackpad pinch as a
    // wheel event with ctrlKey set (some Windows touchpads send Ctrl + mouse-wheel steps).
    const onWheel = (e: WheelEvent) => {
      e.preventDefault() // keep the page (and the browser's own zoom) still
      log(`wheel dX=${e.deltaX.toFixed(1)} dY=${e.deltaY.toFixed(1)} mode=${e.deltaMode} ctrl=${e.ctrlKey}`)
      if (!ready()) return
      const unit = e.deltaMode === 1 ? 16 : 1
      if (e.ctrlKey) {
        nudgeZoom(e.deltaY * unit * TRACKPAD_PINCH_STEP)
        return
      }
      const k = degPerPx() * SCROLL_TURN
      s.yaw += e.deltaX * unit * k
      s.pitch = clamp(s.pitch - e.deltaY * unit * k, -PITCH_LIMIT, PITCH_LIMIT)
      s.vYaw = s.vPitch = 0
      engine.kick()
    }

    // Safari (Mac trackpad) sends proprietary gesture events with a running scale.
    let lastScale = 1
    const onGestureStart = (e: Event) => {
      e.preventDefault()
      lastScale = 1
      log('gesturestart')
    }
    const onGestureChange = (e: Event) => {
      e.preventDefault()
      const scale = (e as Event & { scale: number }).scale
      log(`gesturechange scale=${scale.toFixed(3)}`)
      if (ready()) nudgeZoom(Math.log(lastScale / scale) / zoomRange)
      lastScale = scale
    }

    // Touchscreens: two-finger pinch. Fingers closing widens the view.
    let lastPinch = 0
    const pinchDistance = (t: TouchList) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY)
    const onTouchStart = (e: TouchEvent) => {
      lastPinch = e.touches.length === 2 ? pinchDistance(e.touches) : 0
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2) return
      e.preventDefault()
      const d = pinchDistance(e.touches)
      log(`touch pinch d=${d.toFixed(0)}`)
      if (lastPinch && ready()) nudgeZoom(Math.log(lastPinch / d) / zoomRange)
      lastPinch = d
    }

    const spin: Record<string, [number, number]> = {
      ArrowLeft: [-KEY_SPIN, 0],
      ArrowRight: [KEY_SPIN, 0],
      ArrowUp: [0, KEY_SPIN],
      ArrowDown: [0, -KEY_SPIN],
    }
    const onKey = (e: KeyboardEvent) => {
      if (focusedRef.current) return // the open screen handles its own Esc
      if (e.key === 'Escape') setOpen(false)
      else if (e.key in spin) {
        ;[s.vYaw, s.vPitch] = spin[e.key]
        engine.kick()
      } else if (e.key === '-' || e.key === '_') nudgeZoom(KEY_STEP)
      else if (e.key === '+' || e.key === '=') nudgeZoom(-KEY_STEP)
      else return
      e.preventDefault()
    }

    const active = { passive: false } as const
    stage.addEventListener('pointerdown', onDown)
    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerup', onUp)
    stage.addEventListener('pointercancel', onUp)
    window.addEventListener('wheel', onWheel, active)
    window.addEventListener('gesturestart', onGestureStart, active)
    window.addEventListener('gesturechange', onGestureChange, active)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, active)
    window.addEventListener('keydown', onKey)
    return () => {
      stage.removeEventListener('pointerdown', onDown)
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerup', onUp)
      stage.removeEventListener('pointercancel', onUp)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('gesturestart', onGestureStart)
      window.removeEventListener('gesturechange', onGestureChange)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKey)
      if (drag) endDrag()
      stage.removeAttribute('data-over-tile')
      log.remove()
    }
  }, [open, engine, refs])

  return { open, setOpen, focused, setFocused }
}
