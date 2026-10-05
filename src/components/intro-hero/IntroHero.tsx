'use client'

import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import Link from 'next/link'
import { caseStudyHref } from '@/data/projects'
import { gsap, useGSAP, reducedMotion } from '@/lib/gsap'
import { getLenis } from '../SmoothScroll'
import {
  EMERGE,
  Spring,
  clamp,
  computeLayout,
  mixPose,
  orbitPose,
  ringPose,
  scatterPose,
  scatterSpots,
  smooth,
  type Layout,
  type Origin,
  type Spot,
} from './scene'
import { TILES } from './tiles'

// The hero, staged like a Figma canvas. "Hello, I am Anukriti." is typed in; Anukriti's
// multiplayer cursor draws a text box below it (with a spacing guide) and types "Experienced
// Designer" into it. The first line fades, and the text box reshapes in place, with a spring, into
// a frame; a UI screen appears inside it, and the screens deal out of the frame in a chain onto a
// 3D circle and settle. Then "Let's build something" fades in. A floating Figma toolbar follows
// along (Text, Frame, Move).
// Scrolling (the hero stays pinned) gathers the screens into a ring around the headline, then
// scatters them at different depths around a short About paragraph.

const EMAIL = 'mailto:designwithanukriti@gmail.com'

const NAV = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: EMAIL },
]

const LINE_1 = 'Hello, I am Anukriti.'
const LINE_2 = 'Experienced Designer'
const HEADLINE = "I spot what's confusing and design it clear."
const ABOUT =
  "I'm Anukriti, a UI/UX designer in Bengaluru. I design end‑to‑end digital products — consumer apps, dashboards and enterprise tools — taking each one from first sketch to a polished, shipped interface."

// Canvas colours: a black selection system, a violet collaborator, Figma's pink spacing guides,
// and the logo's purple-coral-yellow for the frame.
const INK = '#111111'
const CURSOR = '#7B61FF'
const GUIDE = '#FF2D78'
const FRAME_FILL = 'linear-gradient(135deg, #A259FF 0%, #FF7262 55%, #FFC700 100%)'

// Screenshot orbit (unchanged from the previous hero).
const N = TILES.length
const CHAIN_GAP = 0.2 // radians between screenshots while they stream out
const SPREAD_GAP = (Math.PI * 2) / N
const ORBIT_SPEED = (Math.PI * 2) / 3.4 // rad/s during the pass
const IDLE_SPEED = 0.14
// Scroll: the hero is pinned for 2.3 extra screens. Stage 1 (ring + headline) takes the first,
// stage 2 (scatter + About) the second, then a short hold.
const SCROLL_STAGES = 2.3

// An underdamped spring (about 5% overshoot) as a 0..1 ease, for the text box -> frame reshape.
const springEase = (t: number) => {
  if (t >= 1) return 1
  const zeta = 0.68
  const omega = 6 / zeta
  const wd = omega * Math.sqrt(1 - zeta * zeta)
  return 1 - Math.exp(-zeta * omega * t) * (Math.cos(wd * t) + ((zeta * omega) / wd) * Math.sin(wd * t))
}

const pill =
  'rounded-full border border-[#0d0d0c1f] px-3.5 py-2 font-hero-mono text-[11px] tracking-[0.08em] uppercase transition-colors hover:border-ink/35 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

const lineType =
  'font-hero text-[clamp(34px,4.8vw,72px)] max-[719px]:text-[7.6vw] leading-[1.12] font-normal tracking-[-0.035em] whitespace-nowrap text-ink'

// Selection handles: corners and edge midpoints (x%, y%).
const HANDLES = [
  [0, 0],
  [50, 0],
  [100, 0],
  [100, 50],
  [100, 100],
  [50, 100],
  [0, 100],
  [0, 50],
]

// Figma's floating toolbar (UI3). The intro switches the active tool as it goes.
const icon = (path: ReactNode) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
)
const TOOLS: { id: string; label: string; icon: ReactNode }[] = [
  { id: 'move', label: 'Move', icon: icon(<path d="M4.5 3 L4.5 14 L7.5 11.2 L9.6 15.6 L11.4 14.8 L9.4 10.5 L13.3 10.5 Z" fill="currentColor" stroke="none" />) },
  { id: 'frame', label: 'Frame', icon: icon(<path d="M6 2.5v13M12 2.5v13M2.5 6h13M2.5 12h13" />) },
  { id: 'rect', label: 'Rectangle', icon: icon(<rect x="3.5" y="3.5" width="11" height="11" rx="1" />) },
  { id: 'pen', label: 'Pen', icon: icon(<path d="M9 2.5 L13.5 9.5 L9 15.5 L4.5 9.5 Z M9 2.5v6.2" />) },
  { id: 'text', label: 'Text', icon: icon(<path d="M4 4h10M9 4v10.5M7.2 14.5h3.6" />) },
  { id: 'comment', label: 'Comment', icon: icon(<path d="M4 13.5 L3.2 15.6 L6 14.6 A6 6 0 1 0 4 13.5 Z" />) },
]

type Engine = { hover: (index: number, on: boolean) => void }

// A text layer: an invisible copy reserves the full width so typing grows from the left without
// shifting the layout; the typed text and caret sit on top.
function TypedLine({ text, lineRef }: { text: string; lineRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={lineRef} className={`relative ${lineType}`}>
      <span className="invisible" aria-hidden>
        {text}
      </span>
      <span className="absolute inset-0 text-left" aria-hidden>
        <span data-typed />
        <i
          data-caret
          className="invisible ml-[0.03em] inline-block h-[0.9em] w-[2px] translate-y-[0.12em] animate-[caret-blink_1.06s_steps(1)_infinite] bg-ink align-baseline"
        />
      </span>
    </div>
  )
}

function Scene({ scrollRoot }: { scrollRoot: RefObject<HTMLElement | null> }) {
  const stage = useRef<HTMLDivElement>(null)
  const tiles = useRef<(HTMLAnchorElement | null)[]>([])
  const intro = useRef<HTMLDivElement>(null)
  const about = useRef<HTMLDivElement>(null)
  const hint = useRef<HTMLDivElement>(null)
  const centre = useRef<HTMLDivElement>(null)
  const line1 = useRef<HTMLDivElement>(null)
  const line2 = useRef<HTMLDivElement>(null)
  const finale = useRef<HTMLDivElement>(null)
  const selection = useRef<HTMLDivElement>(null)
  const guide = useRef<HTMLDivElement>(null)
  const cursor = useRef<HTMLDivElement>(null)
  const toolbar = useRef<HTMLDivElement>(null)
  const chrome = useRef<HTMLDivElement>(null)
  const engine = useRef<Engine | null>(null)

  useEffect(() => {
    const root = scrollRoot.current
    const space = stage.current
    const introEl = intro.current
    const aboutEl = about.current
    const hintEl = hint.current
    const centreEl = centre.current
    const l1 = line1.current
    const l2 = line2.current
    const finaleEl = finale.current
    const sel = selection.current
    const guideEl = guide.current
    const cur = cursor.current
    const bar = toolbar.current
    const chromeEl = chrome.current
    if (
      !root || !space || !introEl || !aboutEl || !hintEl || !centreEl || !l1 || !l2 || !finaleEl ||
      !sel || !guideEl || !cur || !bar || !chromeEl
    )
      return
    const reduce = reducedMotion()
    const headWords = [...introEl.querySelectorAll<HTMLElement>('[data-word]')]
    const introBits = [...introEl.querySelectorAll<HTMLElement>('[data-fade]')]
    const aboutWords = [...aboutEl.querySelectorAll<HTMLElement>('[data-word]')]
    const aboutLabel = aboutEl.querySelector<HTMLElement>('[data-fade]')
    const typed1 = l1.querySelector<HTMLElement>('[data-typed]')!
    const caret1 = l1.querySelector<HTMLElement>('[data-caret]')!
    const typed2 = l2.querySelector<HTMLElement>('[data-typed]')!
    const caret2 = l2.querySelector<HTMLElement>('[data-caret]')!
    const selFill = sel.querySelector<HTMLElement>('[data-fill]')!
    const selFrame = sel.querySelector<HTMLElement>('[data-frame]')!
    const selShot = sel.querySelector<HTMLElement>('[data-shot]')!
    const selBorder = sel.querySelector<HTMLElement>('[data-border]')!
    const selLabel = sel.querySelector<HTMLElement>('[data-label]')!
    const selSize = sel.querySelector<HTMLElement>('[data-size]')!
    const selHandles = [...sel.querySelectorAll<HTMLElement>('[data-handle]')]
    const guideLabel = guideEl.querySelector<HTMLElement>('[data-gap]')!
    const toolButtons = [...bar.querySelectorAll<HTMLElement>('[data-tool]')]

    // Animated values: the intro timeline tweens these; the ticker reads them every frame.
    // show: the orbit's screenshots stay hidden until the frame hands over.
    const st = { omega: 0, gap: CHAIN_GAP, amp: 1, hint: 0, show: 0 }
    // The leader starts just inside the frame, so the first screen is there at the handoff.
    let lastAngle = -(N - 1) * CHAIN_GAP - EMERGE * 0.88
    let origin: Origin | undefined
    const hover = TILES.map(() => new Spring(0, 0, 220, 22))
    let layout: Layout | null = null
    let spots: Spot[] = []
    let visible = true
    let scroll = 0
    let ringTurn = 0
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    const t0 = performance.now()
    let lastText = ''

    const relayout = () => {
      layout = computeLayout(space.clientWidth, space.clientHeight)
      spots = scatterSpots(N, layout.mobile)
      for (const el of tiles.current) {
        if (!el) continue
        el.style.width = `${layout.tileW}px`
        el.style.height = `${layout.tileH}px`
      }
    }
    const resize = new ResizeObserver(relayout)
    resize.observe(space)
    relayout()

    // Skip the per-frame work while the hero is out of view.
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
    io.observe(space)

    const onPointer = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    const renderText = (a: number, b: number, hintOn: number) => {
      const key = `${a.toFixed(4)}|${b.toFixed(4)}|${hintOn.toFixed(3)}`
      if (key === lastText) return
      lastText = key
      // The intro (text, Figma UI, button) makes way for the scroll stages. Left unset at rest so
      // the wrappers don't form stacking contexts: the frame must interleave with the screens.
      const away = smooth(a * 1.8)
      for (const el of [centreEl, chromeEl]) {
        el.style.opacity = away > 0 ? String(1 - away) : ''
        el.style.visibility = away > 0.99 ? 'hidden' : ''
      }
      // Headline: words rise from behind a mask as the ring forms; it lifts away for the About.
      headWords.forEach((w, i) => {
        const p = smooth((a * 1.35 - i * 0.07) / 0.45)
        w.style.transform = `translateY(${(1 - p) * 110}%)`
      })
      introBits.forEach((el) => {
        const p = smooth((a - Number(el.dataset.fade)) / 0.3)
        el.style.opacity = String(p)
        el.style.transform = `translateY(${(1 - p) * 14}px)`
      })
      const out = smooth(b * 2.2)
      introEl.style.opacity = String(1 - out)
      introEl.style.transform = `translateY(${-out * 40}px)`
      introEl.style.visibility = a > 0.01 && out < 0.99 ? 'visible' : 'hidden'
      introEl.style.pointerEvents = a > 0.7 && out < 0.3 ? 'auto' : 'none'
      // About: fades up, then reads in word by word, light grey to ink.
      const inn = smooth(b * 2.5)
      aboutEl.style.opacity = String(inn)
      aboutEl.style.transform = `translateY(${(1 - inn) * 30}px)`
      aboutEl.style.visibility = b > 0.01 ? 'visible' : 'hidden'
      if (aboutLabel) aboutLabel.style.opacity = String(inn)
      aboutWords.forEach((w, i) => {
        const p = clamp((b * 1.2 - 0.12 - (i / aboutWords.length) * 0.75) / 0.18)
        w.style.opacity = String(0.16 + 0.84 * p)
      })
      hintEl.style.opacity = String(hintOn)
    }

    const tick = (_time: number, deltaMs: number) => {
      if (!visible || !layout) return
      const L = layout
      const dt = deltaMs / 1000
      lastAngle += st.omega * dt
      for (const s of hover) s.step(dt)

      // Scroll progress through the pinned hero, eased a touch for a smoother feel.
      const r = root.getBoundingClientRect()
      const span = r.height - window.innerHeight
      const target = span > 0 ? clamp(-r.top / span) * SCROLL_STAGES : 0
      scroll = reduce ? target : scroll + (target - scroll) * Math.min(1, dt * 7)
      const a = smooth(scroll)
      const b = smooth((scroll - 1.15) / 0.95)

      mouse.x += (mouse.tx - mouse.x) * Math.min(1, dt * 3)
      mouse.y += (mouse.ty - mouse.y) * Math.min(1, dt * 3)
      if (!reduce) ringTurn += dt * 0.045
      const now = reduce ? 0 : performance.now() - t0

      tiles.current.forEach((el, i) => {
        if (!el) return
        const theta = lastAngle + (N - 1 - i) * st.gap
        const orbit = orbitPose(L, theta, st.amp, origin)
        orbit.o *= st.show
        const ring = ringPose(L, i, N, ringTurn)
        ring.x += mouse.x * 10
        ring.y += mouse.y * 8
        let p = mixPose(mixPose(orbit, ring, a), scatterPose(L, spots[i], now, mouse.x, mouse.y), b)
        const h = hover[i].value
        if (h > 0.001) p = { ...p, s: p.s * (1 + 0.08 * h), o: p.o + (1 - p.o) * h, blur: p.blur * (1 - h) }
        el.style.transform = `translate3d(${p.x - L.tileW / 2}px,${p.y - L.tileH / 2}px,0) scale(${p.s})`
        el.style.opacity = String(p.o)
        el.style.filter = p.blur > 0.25 ? `blur(${p.blur.toFixed(2)}px)` : 'none'
        el.style.zIndex = String(h > 0.3 ? 390 : Math.round(200 + p.z / 8 + (p.z >= 0 ? 1 : -1)))
        el.style.pointerEvents = p.o > 0.3 ? '' : 'none'
        el.tabIndex = p.o > 0.3 ? 0 : -1
      })

      renderText(a, b, st.hint * (1 - smooth(scroll * 5)))
    }
    gsap.ticker.add(tick)

    engine.current = {
      hover(index, on) {
        hover[index].target = on ? 1 : 0
      },
    }

    // --- Figma intro -------------------------------------------------------------------------

    const box = { x: 0, y: 0, w: 0, h: 0 }
    const drawBox = () => {
      sel.style.transform = `translate3d(${box.x}px,${box.y}px,0)`
      sel.style.width = `${Math.max(0, box.w)}px`
      sel.style.height = `${Math.max(0, box.h)}px`
      selSize.textContent = `${Math.round(Math.abs(box.w))} × ${Math.round(Math.abs(box.h))}`
    }
    const pointer = { x: 0, y: 0, s: 1 }
    const drawCursor = () => {
      cur.style.transform = `translate3d(${pointer.x - 3}px,${pointer.y - 2}px,0) scale(${pointer.s})`
    }
    const setTool = (id: string) => {
      for (const b of toolButtons) b.dataset.active = b.dataset.tool === id ? 'true' : 'false'
    }
    const typeInto = (el: HTMLElement, text: string) => {
      let shown = -1
      return (n: number) => {
        const count = Math.round(n)
        if (count === shown) return
        shown = count
        el.textContent = text.slice(0, count)
      }
    }
    const rel = (el: HTMLElement) => {
      const r = el.getBoundingClientRect()
      const s = space.getBoundingClientRect()
      return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height }
    }

    let tl: gsap.core.Timeline | null = null
    let alive = true

    // Layout depends on the font, so wait for it before measuring.
    document.fonts.ready.then(() => {
      if (!alive || !layout) return
      const L = layout

      if (reduce) {
        // Reduced motion: the finished state, screens waiting around the centre.
        Object.assign(st, { omega: 0, gap: SPREAD_GAP, amp: 0.42, hint: 1, show: 1 })
        lastAngle = 0
        gsap.set([l1, l2], { autoAlpha: 0 })
        gsap.set(finaleEl, { autoAlpha: 1 })
        return
      }

      const r1 = rel(l1)
      const r2 = rel(l2)
      const padX = L.mobile ? 10 : 14
      const padY = L.mobile ? 4 : 6
      // The text box: drawn around "Experienced Designer" only, below the first line.
      const textBox = { x: r2.x - padX, y: r2.y - padY, w: r2.w + padX * 2, h: r2.h + padY * 2 }
      // The frame it becomes: screen-shaped, centred where the text box was.
      const fw = L.mobile ? L.w * 0.64 : Math.min(L.w * 0.3, 440)
      const fh = fw / 1.5
      const fcx = textBox.x + textBox.w / 2
      const fcy = textBox.y + textBox.h / 2
      const frame = { x: fcx - fw / 2, y: fcy - fh / 2, w: fw, h: fh }
      // Round the frame like the screenshots that fill it (8px at tile size, scaled up).
      selFrame.style.borderRadius = `${(8 * fw) / L.tileW}px`

      const type1 = typeInto(typed1, LINE_1)
      const type2 = typeInto(typed2, LINE_2)
      const chars = { a: 0, b: 0 }
      const keyRate1 = 0.06
      const keyRate2 = 0.055

      // Timings (seconds).
      const typeStart = 0.45
      const typeEnd = typeStart + LINE_1.length * keyRate1
      const cursorIn = typeEnd + 0.15
      const press = cursorIn + 0.82
      const drag = press + 0.06
      const DRAG = 0.6
      const release = drag + DRAG + 0.04
      const type2Start = release + 0.18
      const type2End = type2Start + LINE_2.length * keyRate2
      const reshapeAt = type2End + 0.55
      const RESHAPE = 1.1
      const shotIn = reshapeAt + RESHAPE - 0.35 // the first UI screen appears in the frame
      const handoff = shotIn + 0.6 // ...and the screens deal out
      const spreadAt = handoff + 0.25 + ((N - 1) * CHAIN_GAP + EMERGE * 0.88) / ORBIT_SPEED
      const settleAt = spreadAt + Math.PI / 2 / ORBIT_SPEED

      const followCorner = () => {
        drawBox()
        pointer.x = box.x + box.w
        pointer.y = box.y + box.h
        drawCursor()
      }

      gsap.set(sel, { autoAlpha: 0, zIndex: 300 })
      gsap.set(selHandles, { scale: 0 })
      gsap.set([selSize, selLabel, selFrame, selShot, guideEl], { autoAlpha: 0 })
      gsap.set(bar, { autoAlpha: 0, y: 16 })
      setTool('text')
      pointer.x = L.w * (L.mobile ? 0.82 : 0.72)
      pointer.y = L.h * 0.88
      drawCursor()
      // Spacing guide between the two layers: a pink line from the first line down to the box.
      const gap = Math.max(0, Math.round(textBox.y - (r1.y + r1.h)))
      Object.assign(guideEl.style, {
        left: `${fcx}px`,
        top: `${r1.y + r1.h}px`,
        height: `${Math.max(1, textBox.y - (r1.y + r1.h))}px`,
      })
      guideLabel.textContent = String(gap)

      tl = gsap.timeline()
      tl
        // The canvas: Figma's toolbar rises in with the Text tool picked.
        .to(bar, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 0.15)

        // 1. "Hello, I am Anukriti." types in.
        .set(caret1, { visibility: 'visible', animation: 'none' }, typeStart - 0.15)
        .to(chars, { a: LINE_1.length, duration: LINE_1.length * keyRate1, ease: 'none', onUpdate: () => type1(chars.a) }, typeStart)
        .set(caret1, { animation: '' }, typeEnd)

        // 2. Anukriti's cursor draws a text box below it...
        .to(cur, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, cursorIn)
        .to(pointer, { x: textBox.x, y: textBox.y, duration: 0.8, ease: 'power3.inOut', onUpdate: drawCursor }, cursorIn)
        .to(pointer, { s: 0.88, duration: 0.08, ease: 'power2.out', onUpdate: drawCursor }, press)
        .set(caret1, { visibility: 'hidden' }, press)
        .call(
          () => {
            Object.assign(box, { x: textBox.x, y: textBox.y, w: 0, h: 0 })
            drawBox()
          },
          [],
          drag,
        )
        .set(sel, { autoAlpha: 1 }, drag)
        .to(guideEl, { autoAlpha: 1, duration: 0.15, ease: 'none' }, drag + 0.05)
        .to(box, { w: textBox.w, h: textBox.h, duration: DRAG, ease: 'power2.inOut', onUpdate: followCorner }, drag)
        // ...releases: handles, size tag; the guide goes; the caret lands in the new box...
        .to(pointer, { s: 1, duration: 0.12, ease: 'power2.out', onUpdate: drawCursor }, release)
        .to(guideEl, { autoAlpha: 0, duration: 0.25, ease: 'power1.out' }, release + 0.1)
        .to(selFill, { autoAlpha: 0, duration: 0.2, ease: 'power1.out' }, release)
        .to(selHandles, { scale: 1, duration: 0.28, ease: 'back.out(2.2)', stagger: 0.015 }, release)
        .to(selSize, { autoAlpha: 1, duration: 0.2, ease: 'power1.out' }, release + 0.05)
        .set(caret2, { visibility: 'visible', animation: 'none' }, release + 0.05)
        // ...and types "Experienced Designer", while the cursor eases out of the way.
        .to(pointer, { x: textBox.x - 30, y: textBox.y + textBox.h + 34, duration: 0.7, ease: 'power2.out', onUpdate: drawCursor }, release + 0.12)
        .to(chars, { b: LINE_2.length, duration: LINE_2.length * keyRate2, ease: 'none', onUpdate: () => type2(chars.b) }, type2Start)
        .set(caret2, { animation: '' }, type2End)

        // 3. Frame tool. The first line fades; the cursor grabs the corner and the text box
        //    springs, in place, into a frame.
        .call(() => setTool('frame'), [], reshapeAt - 0.6)
        .set(caret2, { visibility: 'hidden' }, reshapeAt - 0.3)
        .to(l1, { autoAlpha: 0, y: -10, duration: 0.55, ease: 'power2.out' }, reshapeAt - 0.45)
        .to(pointer, { x: textBox.x + textBox.w, y: textBox.y + textBox.h, duration: 0.45, ease: 'power3.inOut', onUpdate: drawCursor }, reshapeAt - 0.5)
        .to(pointer, { s: 0.88, duration: 0.08, ease: 'power2.out', onUpdate: drawCursor }, reshapeAt - 0.06)
        .to(l2, { autoAlpha: 0, scale: 0.96, duration: 0.35, ease: 'power2.in' }, reshapeAt)
        .to(box, { ...frame, duration: RESHAPE, ease: springEase, onUpdate: followCorner }, reshapeAt)
        .to(selLabel, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, reshapeAt + 0.3)
        .to(selFrame, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, reshapeAt + 0.45)
        .set(sel, { zIndex: 198 }, reshapeAt + 0.5) // under the screens from here on
        .to(pointer, { s: 1, duration: 0.12, ease: 'power2.out', onUpdate: drawCursor }, reshapeAt + RESHAPE - 0.15)

        // 4. Your UI comes into the picture inside the frame...
        .fromTo(selShot, { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, shotIn)
        .call(() => setTool('move'), [], shotIn + 0.2)
        .to(pointer, { x: '+=150', y: '+=120', duration: 0.8, ease: 'power2.in', onUpdate: drawCursor }, shotIn + 0.2)
        .to(cur, { autoAlpha: 0, duration: 0.5, ease: 'power1.in' }, shotIn + 0.45)
        // ...and the screens deal out of it into the chain (orbit unchanged from here).
        .call(
          () => {
            origin = { x: fcx, y: fcy, s: fw / L.tileW }
            st.show = 1
          },
          [],
          handoff,
        )
        .set(selShot, { autoAlpha: 0 }, handoff + 0.02)
        .to([selBorder, selLabel, selSize, ...selHandles], { autoAlpha: 0, duration: 0.3, ease: 'power1.out' }, handoff + 0.1)
        .to(selFrame, { autoAlpha: 0, duration: 0.5, ease: 'power1.inOut' }, handoff + 0.9)
        // The chain sets off...
        .to(st, { omega: ORBIT_SPEED, duration: 0.5, ease: 'power2.out' }, handoff)
        // ...loosens into an even circle once it's all out...
        .to(st, { gap: SPREAD_GAP, duration: 2.4, ease: 'power2.inOut' }, spreadAt)
        // ...and as the last one passes in front, the orbit calms down.
        .to(st, { omega: IDLE_SPEED, amp: 0.42, duration: 2.8, ease: 'power2.out' }, settleAt - 0.2)
        .to(bar, { autoAlpha: 0, y: 16, duration: 0.6, ease: 'power2.in' }, settleAt + 0.6)

        // 5. Once the screens have settled: the call to action.
        .fromTo(finaleEl, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out' }, settleAt + 1.2)
        .to(st, { hint: 1, duration: 1, ease: 'power1.out' }, settleAt + 1.9)
    })

    return () => {
      alive = false
      tl?.kill()
      gsap.ticker.remove(tick)
      resize.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onPointer)
      engine.current = null
    }
  }, [scrollRoot])

  const words = (text: string) => text.split(' ')

  return (
    <>
      <div ref={stage} className="absolute inset-0 isolate">
        {/* Intro text layers and the closing button. Under the screens that pass in front. */}
        <div ref={centre} className="pointer-events-none absolute inset-0" style={{ zIndex: 199 }}>
          {/* "Experienced Designer" sits at the centre of the screen (so the frame it becomes does
              too); the greeting sits above it. */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="relative text-[clamp(34px,4.8vw,72px)] max-[719px]:text-[7.6vw]">
              <div className="absolute bottom-full left-1/2 mb-[0.3em] -translate-x-1/2">
                <TypedLine text={LINE_1} lineRef={line1} />
              </div>
              <TypedLine text={LINE_2} lineRef={line2} />
            </div>
          </div>
          <div ref={finale} className="invisible absolute inset-0 flex flex-col items-center justify-center gap-5 opacity-0">
            <p className="m-0 font-hero-mono text-[11px] tracking-[0.14em] text-muted uppercase">
              Anukriti Mishra · Experienced Designer
            </p>
            <a
              href={EMAIL}
              className="pointer-events-auto inline-flex items-center gap-2.5 rounded-[12px] bg-ink px-6 py-[15px] font-hero text-[17px] leading-none font-normal tracking-[-0.01em] whitespace-nowrap text-white transition-[background-color,translate] duration-300 hover:-translate-y-px hover:bg-[#2a2a2d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7B61FF]"
            >
              Let&apos;s build something
              <span aria-hidden className="text-[15px]">
                →
              </span>
            </a>
          </div>
        </div>
        <h2 className="sr-only">
          {LINE_1} {LINE_2}
        </h2>

        {/* Figma UI: selection, spacing guide, cursor and toolbar. */}
        <div ref={chrome} className="pointer-events-none absolute inset-0">
          {/* Selection: marquee while drawing, then handles and a size tag; reshapes into the frame. */}
          <div ref={selection} aria-hidden className="pointer-events-none invisible absolute top-0 left-0 opacity-0">
            <div data-fill className="absolute inset-0 bg-[#1111110d]" />
            <div data-frame className="absolute inset-0 overflow-hidden rounded-[3px]" style={{ background: FRAME_FILL }}>
              <img data-shot src={TILES[0].src} alt="" draggable={false} className="block h-full w-full max-w-none object-cover" />
            </div>
            <div data-border className="absolute inset-0 border" style={{ borderColor: INK }} />
            {HANDLES.map(([x, y]) => (
              <span
                key={`${x}-${y}`}
                data-handle
                className="absolute size-[7px] -translate-x-1/2 -translate-y-1/2 border bg-white"
                style={{ left: `${x}%`, top: `${y}%`, borderColor: INK }}
              />
            ))}
            <span
              data-label
              className="absolute bottom-full left-0 mb-1.5 font-hero text-[11px] leading-none font-medium whitespace-nowrap"
              style={{ color: INK }}
            >
              Frame 1
            </span>
            <span
              data-size
              className="absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded-[4px] px-[6px] py-[3px] font-hero text-[11px] leading-none font-medium whitespace-nowrap text-white tabular-nums"
              style={{ background: INK }}
            />
          </div>

          {/* Spacing guide between the layers (positioned by the intro). */}
          <div ref={guide} aria-hidden className="invisible absolute w-px opacity-0" style={{ background: GUIDE, zIndex: 310 }}>
            <span className="absolute top-0 -left-[3px] h-px w-[7px]" style={{ background: GUIDE }} />
            <span className="absolute bottom-0 -left-[3px] h-px w-[7px]" style={{ background: GUIDE }} />
            <span
              data-gap
              className="absolute top-1/2 left-2 -translate-y-1/2 rounded-[3px] px-[4px] py-[2px] font-hero text-[10px] leading-none font-medium text-white tabular-nums"
              style={{ background: GUIDE }}
            />
          </div>

          {/* Anukriti's multiplayer cursor. */}
          <div ref={cursor} aria-hidden className="invisible absolute top-0 left-0 origin-top-left opacity-0" style={{ zIndex: 450 }}>
            <svg width="20" height="22" viewBox="0 0 20 22" className="block drop-shadow-[0_1px_2px_rgba(0,0,0,.2)]">
              <path
                d="M3 2.2 L3 17.6 L7.2 13.6 L10.1 20 L12.9 18.8 L10.1 12.5 L15.9 12.5 Z"
                fill={CURSOR}
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="absolute top-[19px] left-[13px] rounded-[6px] rounded-tl-[2px] px-2 py-[4px] font-hero text-[12px] leading-none font-medium whitespace-nowrap text-white shadow-[0_2px_8px_rgba(123,97,255,.35)]"
              style={{ background: CURSOR }}
            >
              Anukriti
            </span>
          </div>

          {/* Figma's floating toolbar. */}
          <div
            ref={toolbar}
            aria-hidden
            className="invisible absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-[14px] bg-white p-1.5 opacity-0 shadow-[0_0_0_1px_rgba(0,0,0,.06),0_6px_24px_-6px_rgba(0,0,0,.18)]"
            style={{ zIndex: 450 }}
          >
            {TOOLS.map((tool, i) => (
              <span key={tool.id} className="contents">
                {i === 4 && <span className="mx-1 h-5 w-px bg-[#0000001a]" />}
                <span
                  data-tool={tool.id}
                  data-active="false"
                  title={tool.label}
                  className="grid size-8 place-items-center rounded-[8px] text-[#1e1e1e] transition-colors duration-200 data-[active=true]:bg-[#111] data-[active=true]:text-white"
                >
                  {tool.icon}
                </span>
              </span>
            ))}
          </div>
        </div>

        {TILES.map((tile, i) => (
          <Link
            key={tile.src}
            ref={(el) => {
              tiles.current[i] = el
            }}
            href={tile.slug ? caseStudyHref(tile.slug) : '#work'}
            aria-label={tile.label}
            tabIndex={-1}
            onPointerEnter={() => engine.current?.hover(i, true)}
            onPointerLeave={() => engine.current?.hover(i, false)}
            onFocus={() => engine.current?.hover(i, true)}
            onBlur={() => engine.current?.hover(i, false)}
            className="pointer-events-none absolute top-0 left-0 block origin-center overflow-hidden rounded-[8px] bg-soft opacity-0 shadow-[0_0_0_1px_rgba(0,0,0,.06),0_22px_44px_-20px_rgba(20,20,10,.35)] will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <img src={tile.src} alt="" draggable={false} className="block h-full w-full max-w-none object-cover" />
          </Link>
        ))}
      </div>

      {/* Headline (ring stage) and About (scatter stage), centred over the screenshots. */}
      <div className="pointer-events-none absolute inset-0 z-[400] flex items-center justify-center px-6">
        <div ref={intro} className="invisible absolute flex max-w-[min(560px,64vw)] flex-col items-center text-center max-[719px]:max-w-[72vw]">
          <p data-fade="0" className="m-0 mb-5 font-hero-mono text-[11px] tracking-[0.12em] text-muted uppercase opacity-0">
            Anukriti Mishra · UI/UX Designer
          </p>
          <p className="m-0 font-hero text-[clamp(28px,3.9vw,58px)] leading-[1.06] font-medium tracking-[-0.035em] text-ink">
            {words(HEADLINE).map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom -mb-[0.1em]">
                <span data-word className="inline-block will-change-transform" style={{ transform: 'translateY(110%)' }}>
                  {w}
                </span>
                {' '}
              </span>
            ))}
          </p>
          <div data-fade="0.55" className="mt-8 flex flex-wrap items-center justify-center gap-2.5 opacity-0">
            <a
              href="#work"
              className="rounded-full bg-ink px-5 py-3 font-hero text-[14px] leading-none font-medium text-white transition-colors hover:bg-[#2a2a2d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              View work
            </a>
            <a
              href={EMAIL}
              className="rounded-full border border-[#0d0d0c26] px-5 py-3 font-hero text-[14px] leading-none font-medium text-ink transition-colors hover:border-ink/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Get in touch
            </a>
          </div>
        </div>

        <div ref={about} className="invisible absolute max-w-[min(720px,52vw)] text-center max-[719px]:max-w-[86vw]">
          <p data-fade className="m-0 mb-5 font-hero-mono text-[11px] tracking-[0.12em] text-muted uppercase">
            About
          </p>
          <p className="m-0 font-hero text-[clamp(20px,2.1vw,32px)] leading-[1.3] font-medium tracking-[-0.02em] text-ink">
            {words(ABOUT).map((w, i) => (
              <span key={i} data-word className="opacity-[0.16]">
                {w}{' '}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div
        ref={hint}
        aria-hidden
        className="pointer-events-none absolute bottom-7 left-1/2 z-[400] flex -translate-x-1/2 flex-col items-center gap-2 font-hero-mono text-[10px] tracking-[0.16em] text-muted uppercase opacity-0"
      >
        Scroll
        <span className="relative block h-7 w-px overflow-hidden bg-[#0d0d0c1a]">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_1.8s_var(--ease-out-expo)_infinite] bg-ink motion-reduce:animate-none" />
        </span>
      </div>
    </>
  )
}

export default function IntroHero() {
  const [run, setRun] = useState(0)
  const section = useRef<HTMLElement>(null)
  const header = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.fromTo(
      header.current,
      { autoAlpha: 0, y: -10 },
      { autoAlpha: 1, y: 0, duration: reducedMotion() ? 0 : 1, delay: 0.4, ease: 'expo.out' },
    )
  })

  // Replay from the top.
  const replay = () => {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    else window.scrollTo(0, 0)
    setRun((r) => r + 1)
  }

  return (
    <section ref={section} id="welcome" aria-label="Introduction" className="relative h-[330svh] bg-paper">
      <h1 className="sr-only">Anukriti Mishra, UI/UX designer</h1>
      <div className="sticky top-0 h-svh min-h-[560px] overflow-hidden">
        <header
          ref={header}
          className="invisible absolute inset-x-0 top-0 z-[500] grid grid-cols-[1fr_auto] items-center px-4 py-5 font-hero text-[13px] text-ink sm:px-10 md:grid-cols-[1fr_auto_1fr]"
        >
          <a href="#welcome" className="inline-flex items-center gap-2.5 text-[15px] font-medium">
            <span className="size-[9px] rounded-full bg-ink shadow-[0_0_0_3px_rgba(13,13,12,.1)]" />
            Anukriti
          </a>
          <nav className="hidden gap-7 text-muted md:flex" aria-label="Primary">
            {NAV.map(({ label, href }) => (
              <a key={label} href={href} className="group relative transition-colors hover:text-ink">
                {label}
                <span className="absolute inset-x-0 -bottom-1 h-px origin-right scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(.2,.7,.1,1)] group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </nav>
          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={replay} className={`${pill} text-muted`}>
              Replay
            </button>
          </div>
        </header>

        <Scene key={run} scrollRoot={section} />
      </div>
    </section>
  )
}
