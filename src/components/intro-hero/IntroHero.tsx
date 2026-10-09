'use client'

import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import Link from 'next/link'
import { caseStudyHref } from '@/data/projects'
import { gsap, useGSAP, reducedMotion } from '@/lib/gsap'
import { getLenis, pageScroll } from '../SmoothScroll'
import NavBar from '../NavBar'
import { EMAIL as CONTACT_EMAIL, LINKEDIN } from '@/data/site'
import {
  Spring,
  clamp,
  computeLayout,
  mixPose,
  orbitPose,
  ringPose,
  scatterPose,
  scatterSpots,
  smooth,
  lerp,
  type Layout,
  type Origin,
  type Spot,
} from './scene'
import { TILES } from './tiles'
import { DISCIPLINES, disciplinesTimeline } from './disciplines'

// The hero, staged like a Figma canvas. "Hello, I am Anukriti." is typed in; Anukriti's
// multiplayer cursor draws a text box below it (with a spacing guide) and types "Experience
// Designer" into it. The first line fades, and the cursor drags the text box, in place, into a
// card; two quick duplicates (⌘D) snap out either side of it (above and below on a phone held
// upright). The three cards draw UX, branding and motion, then lift off in 3D, turning over to UI
// screenshots as they fly, onto the front of a 3D ring of screenshots that appears around them;
// the ring turns and settles. Then "Let's build something" fades in. A floating Figma toolbar follows along (Text, Frame, Move).
// The whole intro plays by itself on load. Scrolling (the hero stays pinned) then gathers the
// screens into a ring around the headline, then scatters them at different depths around a short
// About paragraph.

const EMAIL = `mailto:${CONTACT_EMAIL}`

// The screens' drawn width (scene.ts tileW), for picking the image size.
const TILE_SIZES = '(max-width: 719px) 124px, 236px'

const LINE_1 = 'Hello, I am Anukriti.'
const LINE_2 = 'Experience Designer'
const HEADLINE = 'The app. The website. The brand. The motion. One designer.'
const ABOUT =
  "I'm Anukriti, an experience designer for SaaS. I've designed products for traders, gyms, colleges and engineers, and everything users see around them."

// Canvas colours: a black selection system, a violet collaborator, Figma's pink spacing guides.
const INK = '#111111'
const CURSOR = '#7B61FF'
const GUIDE = '#FF2D78'

// The discipline cards, left to right (top to bottom when stacked): UX, branding, motion. The
// middle one is the card the text box becomes. Each lifts into the ring as screenshot k: the three
// land side by side on its front, the left one leading, with the rest of the ring behind them.
const FLIP = 0.75 // seconds each card takes to turn over to its screenshot, in place
const LIFT = 1.2 // seconds each card then takes to fly into the ring
// The card drawings play at this speed (1 = as authored, 2.8s).
const ART_SPEED = 0.85

// Screenshot orbit (unchanged from the previous hero).
const N = TILES.length
const CHAIN_GAP = 0.2 // radians between screenshots while they stream out
const SPREAD_GAP = (Math.PI * 2) / N
const IDLE_SPEED = 0.14
// Scroll: the hero is pinned for 1.8 extra screens. Stage 1 (ring + headline) takes the first,
// stage 2 (scatter + About) the rest, then a short hold.
const SCROLL_STAGES = 1.8
const HERO_HEIGHT = `${(1 + SCROLL_STAGES) * 100}svh`
// Where the ring's angle starts as the cards lift: screenshot 1 (the middle card) faces the viewer
// and 0 and 2 sit either side of it; whole turns ahead keep every angle positive.
const LIFT_ANGLE = Math.PI / 2 - (N - 2) * SPREAD_GAP + Math.PI * 4

// An underdamped spring (about 5% overshoot) as a 0..1 ease, for the text box -> frame reshape.
const springEase = (t: number) => {
  if (t >= 1) return 1
  const zeta = 0.68
  const omega = 6 / zeta
  const wd = omega * Math.sqrt(1 - zeta * zeta)
  return 1 - Math.exp(-zeta * omega * t) * (Math.cos(wd * t) + ((zeta * omega) / wd) * Math.sin(wd * t))
}

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
  const cards = useRef<(HTMLDivElement | null)[]>([])
  const shortcut = useRef<HTMLSpanElement>(null)
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
    const chip = shortcut.current
    const deck = cards.current.filter((c): c is HTMLDivElement => !!c)
    if (
      !root || !space || !introEl || !aboutEl || !hintEl || !centreEl || !l1 || !l2 || !finaleEl ||
      !sel || !guideEl || !cur || !bar || !chromeEl || !chip || deck.length !== 3
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
    const selLabel = sel.querySelector<HTMLElement>('[data-label]')!
    const selSize = sel.querySelector<HTMLElement>('[data-size]')!
    const selHandles = [...sel.querySelectorAll<HTMLElement>('[data-handle]')]
    const guideLabel = guideEl.querySelector<HTMLElement>('[data-gap]')!
    const toolButtons = [...bar.querySelectorAll<HTMLElement>('[data-tool]')]

    // Animated values: the intro timeline tweens these; the ticker reads them every frame.
    // show: the orbit's screenshots stay hidden until the frame hands over.
    // spin: the ring's turn during the intro (scrubbed); fly: the cards are in the air.
    const st = { gap: CHAIN_GAP, amp: 1, hint: 0, show: 0, front: 0, spin: 0, fly: 0 }
    let lastAngle = LIFT_ANGLE
    let baseAngle = LIFT_ANGLE
    let idle = 0 // the slow drift once the intro is complete
    let wasFlying = false
    // The card drawings run on their own timeline, started when the intro reaches them.
    let seq: { drawAt: number; art: gsap.core.Timeline } | null = null
    let artOn = false
    let origin: Origin | undefined
    // The cards turn over in place (turn: 0 drawing, 1 screenshot), then fly into the ring
    // (flight: 0 on the canvas, 1 landed, the screenshot takes over).
    const turn = [{ v: 0 }, { v: 0 }, { v: 0 }]
    const flight = [{ v: 0 }, { v: 0 }, { v: 0 }]
    let cardSlot: { x: number; y: number; w: number; h: number }[] = []
    const hover = TILES.map(() => new Spring(0, 0, 220, 22))
    let layout: Layout | null = null
    let spots: Spot[] = []
    let visible = true
    let scroll = 0
    let ringTurn = 0
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    const t0 = performance.now()
    let lastText = ''

    // The pinned section's place on the page, measured on resize rather than every frame.
    let rootTop = 0
    let rootH = 0
    const measureRoot = () => {
      rootTop = root.getBoundingClientRect().top + window.scrollY
      rootH = root.offsetHeight
    }
    // Last values written to each tile, so a frame only touches what changed.
    const last = TILES.map(() => ({ t: '', o: '', z: '', on: -1 }))
    const relayout = () => {
      measureRoot()
      layout = computeLayout(space.clientWidth, space.clientHeight)
      spots = scatterSpots(layout.mobile ? N / 2 : N, layout.mobile)
      for (const el of tiles.current) {
        if (!el) continue
        el.style.width = `${layout.tileW}px`
        el.style.height = `${layout.tileH}px`
      }
    }
    const resize = new ResizeObserver(relayout)
    resize.observe(space)
    resize.observe(root)
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
      for (const s of hover) s.step(dt)

      // Scroll progress through the pinned hero, in screens. The page scroll is already smoothed
      // (Lenis), so this follows it directly; easing it again made the screens trail the scroll.
      const span = rootH - window.innerHeight
      scroll = span > 0 ? clamp((pageScroll() - rootTop) / span) * SCROLL_STAGES : 0
      // The card drawings start once the cards are out.
      if (tl && seq && !artOn && tl.time() >= seq.drawAt) {
        artOn = true
        seq.art.play(0)
      }
      if (!reduce && (!tl || tl.progress() >= 1)) idle += IDLE_SPEED * dt
      lastAngle = baseAngle + st.spin + idle
      const flying = st.fly > 0.5
      const a = smooth(scroll)
      const b = smooth((scroll - 0.95) / 0.75)

      mouse.x += (mouse.tx - mouse.x) * Math.min(1, dt * 3)
      mouse.y += (mouse.ty - mouse.y) * Math.min(1, dt * 3)
      if (!reduce) ringTurn += dt * 0.045
      const now = reduce ? 0 : performance.now() - t0

      tiles.current.forEach((el, i) => {
        if (!el) return
        const theta = lastAngle + (N - 1 - i) * st.gap
        const orbit = orbitPose(L, theta, st.amp, origin)
        // The first three screens are the cards: each shows once its card has landed. The rest of
        // the ring builds from the back forward, so nothing appears half-faded in front of the
        // cards while they fly.
        // The near side waits until the cards have landed, then follows quickly.
        const near = (Math.sin(theta) + 1) / 2
        const reveal = lerp(clamp(st.show * 1.8 - near * 0.8), st.front, smooth((near - 0.5) / 0.2))
        orbit.o *= i < 3 && flying ? (flight[i].v >= 1 ? 1 : 0) : reveal
        // On a phone the ring and the scatter hold half the screens (every other one, the rest fade
        // out as the ring forms), so they have room around the text instead of piling up.
        const ri = L.mobile ? i >> 1 : i
        const ring = ringPose(L, ri, L.mobile ? N / 2 : N, ringTurn)
        ring.x += mouse.x * 10
        ring.y += mouse.y * 8
        let p = mixPose(mixPose(orbit, ring, a), scatterPose(L, spots[ri], now, mouse.x, mouse.y), b)
        if (L.mobile && i % 2) p = { ...p, o: p.o * (1 - smooth(a * 1.6)) }
        const h = hover[i].value
        if (h > 0.001) p = { ...p, s: p.s * (1 + 0.08 * h), o: p.o + (1 - p.o) * h }
        // Depth reads through size, opacity and stacking only: a per-frame blur() repainted every
        // screen on every frame and was the main cause of scroll lag.
        const w = last[i]
        const t = `translate3d(${(p.x - L.tileW / 2).toFixed(1)}px,${(p.y - L.tileH / 2).toFixed(1)}px,0) scale(${p.s.toFixed(4)})`
        if (t !== w.t) el.style.transform = w.t = t
        const o = p.o.toFixed(3)
        if (o !== w.o) el.style.opacity = w.o = o
        const z = String(h > 0.3 ? 390 : Math.round(200 + p.z / 8 + (p.z >= 0 ? 1 : -1)))
        if (z !== w.z) el.style.zIndex = w.z = z
        const on = p.o > 0.3 ? 1 : 0
        if (on !== w.on) {
          w.on = on
          el.style.pointerEvents = on ? '' : 'none'
          el.tabIndex = on ? 0 : -1
        }
      })

      // The cards in flight: from their place on the canvas to screenshot k's place in the
      // moving ring, scaling to its size, turning over (with a little tilt) to the screenshot on
      // their back, and stacking by depth among the screens.
      if (flying) {
        wasFlying = true
        deck.forEach((card, k) => {
          const f = flight[k].v
          if (f >= 1) {
            card.style.visibility = 'hidden'
            return
          }
          card.style.visibility = 'inherit'
          const c = cardSlot[k]
          const to = orbitPose(L, lastAngle + (N - 1 - k) * st.gap, st.amp)
          const from = { x: c.x + c.w / 2, y: c.y + c.h / 2, s: c.w / L.tileW, o: 1, blur: 0, z: 0 }
          const m = mixPose(from, to, f)
          const scale = (m.s * L.tileW) / c.w
          card.style.transform = `translate3d(${m.x - c.w / 2}px,${m.y - c.h / 2}px,0) scale(${scale})`
          card.style.zIndex = String(Math.round(200 + (to.z * f) / 8 + 1))
          const flip = card.firstElementChild?.nextElementSibling as HTMLElement | null
          const u = turn[k].v
          // Turning over lifts the card a touch toward the viewer.
          if (flip) flip.style.transform = `rotateY(${180 * u}deg) scale(${1 + 0.06 * Math.sin(Math.PI * u)})`
        })
      } else if (wasFlying) {
        // Scrolled back to before the lift: the cards return to their places on the canvas.
        wasFlying = false
        deck.forEach((card, k) => {
          const c = cardSlot[k]
          gsap.set(card, { x: c.x, y: c.y, scale: 1, zIndex: 198 })
          card.style.visibility = card.style.opacity === '0' ? 'hidden' : 'inherit'
          const flip = card.firstElementChild?.nextElementSibling as HTMLElement | null
          if (flip) flip.style.transform = ''
          turn[k].v = 0
        })
      }

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

    // Layout depends on the font, so wait for it before measuring, and for the hero to have a real
    // size (an embedded preview can report none while it loads).
    const begin = () => {
      if (!alive || !layout) return
      if (layout.w < 200 || layout.h < 200) return void setTimeout(begin, 100)
      const L = layout

      if (reduce) {
        // Reduced motion: the finished state, screens waiting around the centre.
        Object.assign(st, { gap: SPREAD_GAP, amp: 0.42, hint: 1, show: 1, front: 1 })
        baseAngle = 0
        gsap.set([l1, l2], { autoAlpha: 0 })
        gsap.set(finaleEl, { autoAlpha: 1 })
        return
      }

      const r1 = rel(l1)
      const r2 = rel(l2)
      const padX = L.mobile ? 10 : 14
      const padY = L.mobile ? 4 : 6
      // The text box: drawn around "Experience Designer" only, below the first line.
      const textBox = { x: r2.x - padX, y: r2.y - padY, w: r2.w + padX * 2, h: r2.h + padY * 2 }
      // The card it becomes: screen-shaped (3:2), centred where the text box was, with room for a
      // copy either side of it, or above and below it on a portrait screen.
      const fcx = textBox.x + textBox.w / 2
      const fcy = textBox.y + textBox.h / 2
      const stacked = L.h > L.w
      const gapC = stacked ? 34 : Math.max(18, L.w * 0.02)
      let cw = stacked ? Math.min(L.w * 0.8, 420) : Math.min((L.w * 0.86 - 2 * gapC) / 3, 420)
      let ch = cw / 1.5
      const maxH = stacked ? (L.h * 0.74 - 2 * gapC) / 3 : L.h * 0.6
      if (ch > maxH) {
        ch = maxH
        cw = ch * 1.5
      }
      const frame = { x: fcx - cw / 2, y: fcy - ch / 2, w: cw, h: ch }
      const step = stacked ? { x: 0, y: ch + gapC } : { x: cw + gapC, y: 0 }
      const slots = [-1, 0, 1].map((d) => ({ x: frame.x + d * step.x, y: frame.y + d * step.y }))
      cardSlot = slots.map((sl) => ({ x: sl.x, y: sl.y, w: cw, h: ch }))
      const names = deck.map((c) => c.querySelector<HTMLElement>('[data-card-name]')!)
      const rings = deck.map((c) => c.querySelector<HTMLElement>('[data-ring]')!)
      // The backs are rounded like the screenshots they hand over (8px at tile size, scaled up).
      for (const c of deck) c.querySelector<HTMLElement>('[data-back]')!.style.borderRadius = `${(8 * cw) / L.tileW}px`

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
      const RESHAPE = 0.95
      const dupAt = reshapeAt + RESHAPE - 0.2 // ⌘D: the copies snap out
      const drawAt = dupAt + 0.25 // the cards draw their disciplines
      const liftAt = drawAt + 2.8 / ART_SPEED + 0.7 // the drawings play, a hold, then they turn over
      const moveAt = liftAt + FLIP + 0.24 + 0.25 // all three show their screenshots, then rearrange
      const landed = moveAt + 0.24 + LIFT // the last card lands
      const settleAt = landed + 1.1

      const followCorner = () => {
        drawBox()
        pointer.x = box.x + box.w
        pointer.y = box.y + box.h
        drawCursor()
      }

      gsap.set(sel, { autoAlpha: 0, zIndex: 300 })
      gsap.set(selHandles, { scale: 0 })
      gsap.set([selSize, selLabel, selFrame, guideEl], { autoAlpha: 0 })
      // The cards wait, stacked on the middle slot, hidden; their drawings are built hidden too.
      gsap.set(deck, { autoAlpha: 0, x: frame.x, y: frame.y, width: cw, height: ch })
      gsap.set(names, { autoAlpha: 0, y: 4 })
      gsap.set(chip, { autoAlpha: 0 })
      const art = disciplinesTimeline(chromeEl).timeScale(ART_SPEED) // plays by time (see the tick)
      gsap.set(bar, { autoAlpha: 1, y: 0 })
      gsap.set(caret1, { visibility: 'visible' })
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

      // The tool in use, read from the playhead so it is right in either direction.
      const toolAt = (t: number) => (t < reshapeAt - 0.6 ? 'text' : t < dupAt + 0.4 ? 'frame' : 'move')
      let tool = 'text'
      tl = gsap.timeline({
        paused: true,
        onUpdate: () => {
          const next = toolAt(tl!.time())
          if (next !== tool) setTool((tool = next))
        },
      })
      tl
        // 1. "Hello, I am Anukriti." types in (the caret stops blinking while it types).
        .set(caret1, { animation: 'none' }, typeStart - 0.15)
        .to(chars, { a: LINE_1.length, duration: LINE_1.length * keyRate1, ease: 'none', onUpdate: () => type1(chars.a) }, typeStart)
        .set(caret1, { animation: '' }, typeEnd)

        // 2. Anukriti's cursor draws a text box below it...
        .to(cur, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, cursorIn)
        .to(pointer, { x: textBox.x, y: textBox.y, duration: 0.8, ease: 'power3.inOut', onUpdate: drawCursor }, cursorIn)
        .to(pointer, { s: 0.88, duration: 0.08, ease: 'power2.out', onUpdate: drawCursor }, press)
        .set(caret1, { visibility: 'hidden' }, press)
        .set(box, { x: textBox.x, y: textBox.y, w: 0, h: 0 }, drag)
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
        // ...and types "Experience Designer", while the cursor eases out of the way.
        .to(pointer, { x: textBox.x - 30, y: textBox.y + textBox.h + 34, duration: 0.7, ease: 'power2.out', onUpdate: drawCursor }, release + 0.12)
        .to(chars, { b: LINE_2.length, duration: LINE_2.length * keyRate2, ease: 'none', onUpdate: () => type2(chars.b) }, type2Start)
        .set(caret2, { animation: '' }, type2End)

        // 3. Frame tool. The first line fades; the cursor grabs the corner and drags the text box,
        //    in place, into a card.
        .set(caret2, { visibility: 'hidden' }, reshapeAt - 0.3)
        .to(l1, { autoAlpha: 0, y: -10, duration: 0.55, ease: 'power2.out' }, reshapeAt - 0.45)
        .to(pointer, { x: textBox.x + textBox.w, y: textBox.y + textBox.h, duration: 0.45, ease: 'power3.inOut', onUpdate: drawCursor }, reshapeAt - 0.5)
        .to(pointer, { s: 0.88, duration: 0.08, ease: 'power2.out', onUpdate: drawCursor }, reshapeAt - 0.06)
        .to(l2, { autoAlpha: 0, scale: 0.96, duration: 0.3, ease: 'power2.in' }, reshapeAt)
        .to(box, { ...frame, duration: RESHAPE, ease: springEase, onUpdate: followCorner }, reshapeAt)
        .to(selFrame, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' }, reshapeAt + 0.2)

        // 4. ⌘D, twice: copies of the card snap out either side of it, and the three cards draw
        //    UX, branding and motion.
        .fromTo(chip, { autoAlpha: 0, scale: 0.85, x: frame.x + cw + 12, y: frame.y + ch - 34 }, { autoAlpha: 1, scale: 1, duration: 0.16, ease: 'back.out(2.5)' }, dupAt - 0.14)
        .to(pointer, { s: 1, duration: 0.12, ease: 'power2.out', onUpdate: drawCursor }, dupAt - 0.1)
        .set(deck, { autoAlpha: 1 }, dupAt)
        .set(sel, { autoAlpha: 0 }, dupAt)
        .to(deck[0], { x: slots[0].x, y: slots[0].y, duration: 0.5, ease: 'expo.out' }, dupAt)
        .to(deck[2], { x: slots[2].x, y: slots[2].y, duration: 0.5, ease: 'expo.out' }, dupAt + 0.09)
        .to(chip, { autoAlpha: 0, duration: 0.22, ease: 'power1.out' }, dupAt + 0.42)
        .to(names, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.05 }, dupAt + 0.3)
        .to(pointer, { x: '+=150', y: '+=120', duration: 0.8, ease: 'power2.in', onUpdate: drawCursor }, dupAt + 0.5)
        .to(cur, { autoAlpha: 0, duration: 0.5, ease: 'power1.in' }, dupAt + 0.75)

        // 5. The cards turn over, in place and one after another, to their screenshots; then
        //    they rearrange, flying into a 3D ring, the left one first, landing on its front
        //    while the rest of the ring appears around and behind them and starts to turn.
        .to([...names, ...rings], { autoAlpha: 0, duration: 0.3, ease: 'power1.out' }, liftAt - 0.15)
        .set(st, { fly: 1, gap: SPREAD_GAP }, liftAt)
        .to(turn[0], { v: 1, duration: FLIP, ease: 'power2.inOut' }, liftAt)
        .to(turn[1], { v: 1, duration: FLIP, ease: 'power2.inOut' }, liftAt + 0.12)
        .to(turn[2], { v: 1, duration: FLIP, ease: 'power2.inOut' }, liftAt + 0.24)
        .to(flight[0], { v: 1, duration: LIFT, ease: 'power3.inOut' }, moveAt)
        .to(flight[1], { v: 1, duration: LIFT, ease: 'power3.inOut' }, moveAt + 0.12)
        .to(flight[2], { v: 1, duration: LIFT, ease: 'power3.inOut' }, moveAt + 0.24)
        .to(st, { show: 1, duration: 1.4, ease: 'power2.inOut' }, moveAt + 0.2)
        .to(st, { front: 1, duration: 0.45, ease: 'power2.out' }, landed)
        // The ring turns as they fly, briskly at first...
        .to(st, { spin: 3.4, duration: settleAt + 2.6 - (moveAt + 0.1), ease: 'power2.inOut' }, moveAt + 0.1)
        // ...and calms down.
        .to(st, { amp: 0.42, duration: 2.8, ease: 'power2.out' }, settleAt - 0.2)
        .to(bar, { autoAlpha: 0, y: 16, duration: 0.6, ease: 'power2.in' }, settleAt + 0.6)

        // 5. Once the screens have settled: the call to action.
        .fromTo(finaleEl, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out' }, settleAt + 1.2)

        // ...and the scroll cue.
        .to(st, { hint: 1, duration: 1, ease: 'power1.out' }, settleAt + 1.9)

      // The whole intro plays by itself.
      seq = { drawAt, art }
      tl.play()
    }
    document.fonts.ready.then(begin)

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
          {/* "Experience Designer" sits at the centre of the screen (so the frame it becomes does
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
              Anukriti Mishra · Experience Designer
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
            <div data-frame className="absolute inset-0 border border-line bg-paper" />
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

          {/* The three discipline cards (placed by the intro). Front: the drawing; back: the
              screenshot it hands to the chain. */}
          {DISCIPLINES.map(({ id, name, Art }, k) => (
            <div
              key={id}
              ref={(el) => {
                cards.current[k] = el
              }}
              aria-hidden
              className="invisible absolute top-0 left-0 opacity-0 [perspective:1600px]"
              style={{ zIndex: 198 }}
            >
              <span
                data-card-name
                className="absolute bottom-full left-0 mb-1.5 font-hero-mono text-[10.5px] leading-none tracking-[0.08em] whitespace-nowrap text-muted uppercase"
              >
                {name}
              </span>
              <div data-flip className="relative h-full w-full [transform-style:preserve-3d]">
                <div data-front className="absolute inset-0 overflow-hidden border border-line bg-paper [backface-visibility:hidden]">
                  <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="block h-full w-full">
                    <Art />
                  </svg>
                </div>
                <div
                  data-back
                  className="absolute inset-0 overflow-hidden bg-soft shadow-[0_0_0_1px_rgba(0,0,0,.06),0_22px_44px_-20px_rgba(20,20,10,.35)] [backface-visibility:hidden] [transform:rotateY(180deg)]"
                >
                  <img src={TILES[k].src} alt="" draggable={false} className="block h-full w-full max-w-none object-cover" />
                </div>
              </div>
              {/* Selected: a black border and handles, kept until the card lifts off. */}
              <div data-ring className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 border" style={{ borderColor: INK }} />
                {HANDLES.map(([x, y]) => (
                  <span
                    key={`${x}-${y}`}
                    className="absolute size-[7px] -translate-x-1/2 -translate-y-1/2 border bg-white"
                    style={{ left: `${x}%`, top: `${y}%`, borderColor: INK }}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* The duplicate shortcut, flashed by the cursor as the copies snap out. */}
          <span
            ref={shortcut}
            aria-hidden
            className="invisible absolute top-0 left-0 rounded-[6px] px-2 py-[5px] font-hero-mono text-[11px] leading-none whitespace-nowrap text-white opacity-0"
            style={{ background: INK, zIndex: 451 }}
          >
            ⌘ D
          </span>

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
            <img src={tile.src} srcSet={`${tile.small} 420w, ${tile.src} 840w`} sizes={TILE_SIZES} alt="" draggable={false} decoding="async" className="block h-full w-full max-w-none object-cover" />
          </Link>
        ))}
      </div>

      {/* Headline (ring stage) and About (scatter stage), centred over the screenshots. */}
      <div className="pointer-events-none absolute inset-0 z-[400] flex items-center justify-center px-6">
        <div ref={intro} className="invisible absolute flex max-w-[min(560px,64vw)] flex-col items-center text-center max-[719px]:max-w-[72vw]">
          <p data-fade="0" className="m-0 mb-5 font-hero-mono text-[11px] tracking-[0.12em] text-muted uppercase opacity-0">
            Anukriti Mishra · Experience Designer
          </p>
          <p className="m-0 font-hero text-[clamp(28px,3.9vw,58px)] leading-[1.06] [@media(max-height:500px)]:text-[26px] font-medium tracking-[-0.035em] text-ink">
            {words(HEADLINE).map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom -mb-[0.1em]">
                <span data-word className="inline-block will-change-transform" style={{ transform: 'translateY(110%)' }}>
                  {w}
                </span>
                {' '}
              </span>
            ))}
          </p>
          <div data-fade="0.55" className="mt-8 [@media(max-height:500px)]:mt-5 flex flex-wrap items-center justify-center gap-2.5 opacity-0">
            <a
              href="#work"
              className="rounded-full bg-ink px-5 py-3 font-hero text-[14px] leading-none font-medium text-white transition-colors hover:bg-[#2a2a2d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              See my work
            </a>
            <a
              href={EMAIL}
              className="rounded-full border border-[#0d0d0c26] px-5 py-3 font-hero text-[14px] leading-none font-medium text-ink transition-colors hover:border-ink/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Email me
            </a>
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#0d0d0c26] px-5 py-3 font-hero text-[14px] leading-none font-medium text-ink transition-colors hover:border-ink/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div ref={about} className="invisible absolute max-w-[min(720px,52vw)] text-center max-[719px]:max-w-[86vw] [@media(max-height:500px)]:max-w-[62vw]">
          <p data-fade className="m-0 mb-5 font-hero-mono text-[11px] tracking-[0.12em] text-muted uppercase">
            About
          </p>
          <p className="m-0 font-hero text-[clamp(20px,2.1vw,32px)] leading-[1.3] [@media(max-height:500px)]:text-[17px] font-medium tracking-[-0.02em] text-ink">
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
        className="pointer-events-none absolute bottom-[92px] left-1/2 z-[400] flex -translate-x-1/2 flex-col items-center gap-2 font-hero-mono text-[10px] tracking-[0.16em] text-muted uppercase opacity-0"
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
    <section ref={section} id="welcome" aria-label="Introduction" className="relative bg-paper" style={{ height: HERO_HEIGHT }}>
      <h1 className="sr-only">Anukriti Mishra, experience designer</h1>
      <div className="sticky top-0 h-svh min-h-[320px] overflow-hidden">
        <header ref={header} className="invisible absolute inset-x-0 top-0 z-[500]">
          <NavBar home onReplay={replay} />
        </header>

        <Scene key={run} scrollRoot={section} />
      </div>
    </section>
  )
}
