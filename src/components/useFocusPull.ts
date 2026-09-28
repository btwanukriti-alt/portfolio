import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { createDebugLog } from './debugLog'

// "Focus pull" from the Figma storyboard (Hero — focus pull, 342:143576).
// Clicking the glasses plays 01 -> 03 and rests on "03 — Cleared" (338:144084):
//   01 At rest     blurred mosaic seen through the lenses (-3.25 D)
//   02 Mid-pull    glasses rush toward the viewer, mosaic sharpening (-0.90 D)
//   03 Cleared     glasses gone, mosaic sharp at its zoomed-in scale  <- resting state
// From there the viewer pinches (trackpad or touch; + / - on keyboard) to zoom out toward
//   04 Pulled back mosaic zoomed out to show the whole board
// No motion data exists in the file, so timings here are our own.

const PULL_MS = 1500
const REST_BLUR_PX = 13
const MID_PULL_SCALE = 1.9 // storyboard glasses grow 899 -> 1709 wide between 01 and 02
const EXIT_SCALE = 3.4
const TRACKPAD_PINCH_STEP = 0.01 // zoom progress per ctrl+wheel delta (how browsers report trackpad pinch)
const KEY_STEP = 0.15
const MAX_STEP = 0.2 // cap per event so coarse Ctrl+wheel notches don't jump the whole range
const ZOOM_SMOOTHING = 0.18 // per frame, eases the board toward the requested zoom

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const range = (p: number, start: number, end: number) => clamp01((p - start) / (end - start))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeIn = (t: number) => t * t * t

type Refs = {
  stage: RefObject<HTMLElement | null>
  lens: RefObject<HTMLElement | null>
  board: RefObject<HTMLElement | null>
}

export function useFocusPull(refs: Refs, boardZoom: number) {
  const [open, setOpen] = useState(false)
  const pull = useRef(0) // 0 = at rest, 1 = cleared
  const zoom = useRef(0) // 0 = cleared (boardZoom x), 1 = pulled back (whole board)
  const zoomTarget = useRef(0)
  const pullFrame = useRef(0)
  const zoomFrame = useRef(0)

  const render = useCallback(() => {
    const stage = refs.stage.current
    const lens = refs.lens.current
    const board = refs.board.current
    if (!stage || !lens || !board) return

    const p = pull.current
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const text = 1 - range(p, 0, 0.2)
    const glassesScale = still
      ? 1
      : lerp(1, MID_PULL_SCALE, easeIn(range(p, 0.08, 0.65))) * lerp(1, EXIT_SCALE, easeIn(range(p, 0.65, 1)))
    const glassesOpacity = 1 - range(p, 0.8, 1)
    const curtain = 1 - range(p, 0.72, 0.95)
    const blur = REST_BLUR_PX * (1 - range(p, 0.08, 0.9))

    const fit = Math.min((window.innerWidth * 0.9) / board.offsetWidth, (window.innerHeight * 0.8) / board.offsetHeight)
    // Geometric interpolation so each scroll step feels like the same amount of zoom.
    const boardScale = fit * Math.pow(boardZoom, 1 - zoom.current)

    const s = stage.style
    s.setProperty('--text-opacity', String(text))
    s.setProperty('--glasses-scale', String(glassesScale))
    s.setProperty('--glasses-opacity', String(glassesOpacity))
    s.setProperty('--curtain-opacity', String(curtain))
    s.setProperty('--mosaic-blur', `${blur}px`)
    s.setProperty('--board-scale', String(boardScale))

    // Cut the lens-shaped hole in the curtain exactly where the (scaled) lenses are.
    const stageRect = stage.getBoundingClientRect()
    const lensRect = lens.getBoundingClientRect()
    s.setProperty('--hole-x', `${lensRect.left - stageRect.left}px`)
    s.setProperty('--hole-y', `${lensRect.top - stageRect.top}px`)
    s.setProperty('--hole-w', `${lensRect.width}px`)
    s.setProperty('--hole-h', `${lensRect.height}px`)
  }, [refs, boardZoom])

  // Ease the board toward the zoom the viewer asked for.
  const requestZoom = useCallback(
    (value: number) => {
      zoomTarget.current = clamp01(value)
      if (zoomFrame.current) return
      const tick = () => {
        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const delta = zoomTarget.current - zoom.current
        zoom.current = still || Math.abs(delta) < 0.001 ? zoomTarget.current : zoom.current + delta * ZOOM_SMOOTHING
        render()
        zoomFrame.current = zoom.current === zoomTarget.current ? 0 : requestAnimationFrame(tick)
      }
      zoomFrame.current = requestAnimationFrame(tick)
    },
    [render],
  )

  // Play the pull toward cleared (open) or back to rest (closed).
  useEffect(() => {
    const target = open ? 1 : 0
    const from = pull.current
    const duration = Math.abs(target - from) * PULL_MS
    const start = performance.now()
    if (!open) requestZoom(0)

    const tick = (now: number) => {
      const t = duration > 0 ? clamp01((now - start) / duration) : 1
      pull.current = lerp(from, target, t)
      render()
      if (t < 1) pullFrame.current = requestAnimationFrame(tick)
    }

    cancelAnimationFrame(pullFrame.current)
    pullFrame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(pullFrame.current)
  }, [open, render, requestZoom])

  // Keep the current frame correct on resize and once web fonts shift the layout.
  useEffect(() => {
    render()
    window.addEventListener('resize', render)
    document.fonts?.ready.then(render)
    return () => window.removeEventListener('resize', render)
  }, [render])

  // While focused in, pinching zooms the board: pinch in to see more screens, spread to go back.
  // Plain scrolling and one-finger swipes are ignored. + / - is the keyboard equivalent.
  useEffect(() => {
    if (!open) return
    const log = createDebugLog()
    // Zoom progress per "full" pinch, so every input below covers the same range.
    const logZoom = Math.log(boardZoom)
    const nudge = (amount: number) => requestZoom(zoomTarget.current + Math.max(-MAX_STEP, Math.min(MAX_STEP, amount)))

    // Chrome, Edge and Firefox report a trackpad pinch as a wheel event with ctrlKey set
    // (some Windows touchpad drivers also send it as a Ctrl + mouse-wheel with large steps).
    const onWheel = (e: WheelEvent) => {
      log(`wheel dY=${e.deltaY.toFixed(1)} mode=${e.deltaMode} ctrl=${e.ctrlKey}`)
      if (!e.ctrlKey) return
      e.preventDefault() // keep the pinch from zooming the whole page
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
      nudge(delta * TRACKPAD_PINCH_STEP)
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
      nudge(Math.log(lastScale / scale) / logZoom)
      lastScale = scale
    }

    // Touchscreens: two-finger pinch. Fingers closing zooms out.
    let lastPinch = 0
    const pinchDistance = (t: TouchList) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY)
    const onTouchStart = (e: TouchEvent) => {
      lastPinch = e.touches.length === 2 ? pinchDistance(e.touches) : 0
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2) return
      e.preventDefault() // keep the pinch from zooming the whole page
      const d = pinchDistance(e.touches)
      log(`touch pinch d=${d.toFixed(0)}`)
      if (lastPinch) nudge(Math.log(lastPinch / d) / logZoom)
      lastPinch = d
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      else if (e.key === '-' || e.key === '_') requestZoom(zoomTarget.current + KEY_STEP)
      else if (e.key === '+' || e.key === '=') requestZoom(zoomTarget.current - KEY_STEP)
      else return
      e.preventDefault()
    }

    // On window so the gesture is caught wherever the pointer is.
    const active = { passive: false } as const
    window.addEventListener('wheel', onWheel, active)
    window.addEventListener('gesturestart', onGestureStart, active)
    window.addEventListener('gesturechange', onGestureChange, active)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, active)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('gesturestart', onGestureStart)
      window.removeEventListener('gesturechange', onGestureChange)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKey)
      log.remove()
    }
  }, [open, requestZoom, boardZoom])

  useEffect(
    () => () => {
      cancelAnimationFrame(zoomFrame.current)
      zoomFrame.current = 0 // so a later requestZoom starts a fresh loop
    },
    [],
  )

  return { open, setOpen }
}
