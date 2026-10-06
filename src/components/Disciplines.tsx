'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP, reducedMotion } from '@/lib/gsap'

// UX, branding and motion as three isometric line drawings, each built in front of the viewer the
// first time it scrolls into view. Everything has landed by 2.8s.
// - UX: the dashboard's canvas forms, then its panels, then the charts move (bars rise, lines run).
// - Branding: rulers and guides are drawn, then construction circles, then the circular mark is
//   extruded from them tier by tier.
// - Motion: a motion path with its keyframes and Bezier handles, then a block travels it on an
//   ease-in-out while a playhead runs the timeline below, leaving onion skins.
// Static lines are drawn with pathLength=1 dash offsets; solids that grow or move are re-projected
// every frame. Reduced motion shows the finished drawings.

const INK = '#111114'
const MID = '#4a4a52'
const GUIDE = '#8f8f97'
const ACCENT = '#2f4bff'
const PAPER = '#ffffff'

// ---------- a small isometric kit (2:1 view, the same camera as the Hairline figures) ----------

type Pt = [number, number]
type V3 = [number, number, number]
type Proj = (x: number, y: number, z?: number) => Pt

const CS = Math.SQRT1_2
const ZF = Math.sqrt(3) / 2
const r2 = (n: number) => Math.round(n * 100) / 100
const raw = (S: number, ox: number, oy: number): Proj => (x, y, z = 0) => [
  r2(ox + (x - y) * CS * S),
  r2(oy + ((x + y) * CS * 0.5 - z * ZF) * S),
]
/** A projection at scale S whose drawing of `pts` is centred on the frame. */
function fitProj(S: number, pts: V3[], cx = 200, cy = 150): Proj {
  const p = pts.map(([x, y, z]) => raw(S, 0, 0)(x, y, z))
  const xs = p.map((q) => q[0])
  const ys = p.map((q) => q[1])
  return raw(S, cx - (Math.min(...xs) + Math.max(...xs)) / 2, cy - (Math.min(...ys) + Math.max(...ys)) / 2)
}
/** A rounded rectangle on the ground, as a ring of points. */
function rr(x0: number, y0: number, x1: number, y1: number, r: number, n = 5): Pt[] {
  const out: Pt[] = []
  const corners: [number, number, number][] = [
    [x1 - r, y0 + r, -90],
    [x1 - r, y1 - r, 0],
    [x0 + r, y1 - r, 90],
    [x0 + r, y0 + r, 180],
  ]
  for (const [cx, cy, a0] of corners)
    for (let k = 0; k <= n; k++) {
      const a = ((a0 + (90 * k) / n) * Math.PI) / 180
      out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
    }
  return out
}
const circ = (cx: number, cy: number, R: number, n = 48, a0 = 0, sweep = 1): Pt[] =>
  Array.from({ length: sweep === 1 ? n : n + 1 }, (_, k) => {
    const a = a0 + (2 * Math.PI * sweep * k) / n
    return [cx + R * Math.cos(a), cy + R * Math.sin(a)] as Pt
  })
/** Convex hull of screen points (monotone chain). */
function hull(pts: Pt[]): Pt[] {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lower: Pt[] = []
  const upper: Pt[] = []
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop()
    lower.push(q)
  }
  for (const q of [...p].reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop()
    upper.push(q)
  }
  return lower.slice(0, -1).concat(upper.slice(0, -1))
}
const closed = (pts: Pt[]) => `M${pts.map((q) => q.join(' ')).join('L')}Z`
const line = (pts: Pt[]) => `M${pts.map((q) => q.join(' ')).join('L')}`
const flat = (P: Proj, ring: Pt[], z: number) => ring.map(([x, y]) => P(x, y, z))
/** A solid standing on `ring` from z0 to z1: its silhouette and its top edge. */
const prism = (P: Proj, ring: Pt[], z0: number, z1: number) => ({
  sil: closed(hull([...flat(P, ring, z0), ...flat(P, ring, z1)])),
  top: closed(flat(P, ring, z1)),
})

// Line styles. Every static stroke is drawn on with a dash offset, so each carries pathLength=1.
const solidSil = { fill: PAPER, stroke: INK, strokeWidth: 1.6, strokeLinejoin: 'round', pathLength: 1 } as const
const crease = { fill: 'none', stroke: MID, strokeWidth: 1, strokeLinejoin: 'round', strokeLinecap: 'round', pathLength: 1 } as const
const guide = { fill: 'none', stroke: GUIDE, strokeWidth: 0.9, strokeDasharray: '3 3' } as const

// ---------- UX: a dashboard ----------

const UX = (() => {
  const BARS = [12, 21, 15, 27, 19, 32].map((h, i) => ({ ring: rr(48 + i * 11, 98, 55 + i * 11, 106, 1.5, 3), h }))
  const P = fitProj(1.32, [[0, 0, -6], [180, 130, -6], [180, 0, -6], [0, 130, -6], [70, 98, 34], [110, 98, 34]])
  const slab = prism(P, rr(0, 0, 180, 130, 10), -6, 0)
  // Panels, back to front.
  const boxes: [number, number, number, number, number][] = [
    [6, 6, 34, 124, 4], // sidebar
    [40, 6, 174, 18, 3], // header
    [40, 24, 82, 46, 3], // KPI tiles
    [86, 24, 128, 46, 3],
    [132, 24, 174, 46, 3],
    [40, 52, 118, 124, 4], // bar chart
    [124, 52, 174, 124, 4], // donut
  ]
  const panels = boxes
    .map((b) => ({ b, p: prism(P, rr(...b), 0, 2) }))
    .sort((a, c) => a.b[0] + a.b[1] - (c.b[0] + c.b[1]))
  const seg = (a: Pt, b: Pt) => line([P(a[0], a[1], 2), P(b[0], b[1], 2)])
  const details = [
    ...[30, 42, 54, 66].map((y) => seg([12, y], [y === 30 ? 28 : 24, y])),
    seg([46, 12], [80, 12]),
    seg([150, 12], [168, 12]),
    seg([46, 58], [74, 58]),
    seg([46, 112], [112, 112]),
    seg([130, 58], [150, 58]),
    closed(flat(P, circ(149, 90, 17), 2)),
    closed(flat(P, circ(149, 90, 10), 2)),
  ]
  const spark = (x0: number, y0: number, x1: number, y1: number, v: number[]) =>
    line(v.map((t, k) => P(x0 + 4 + ((x1 - x0 - 8) * k) / (v.length - 1), y1 - 4 - t * (y1 - y0 - 10), 2)))
  const sparks = [
    spark(40, 24, 82, 46, [0.2, 0.45, 0.3, 0.65, 0.5, 0.9]),
    spark(86, 24, 128, 46, [0.7, 0.5, 0.6, 0.35, 0.45, 0.25]),
    spark(132, 24, 174, 46, [0.3, 0.35, 0.6, 0.5, 0.8, 0.75]),
  ]
  const donutArc = line(flat(P, circ(149, 90, 13.5, 40, (-135 * Math.PI) / 180, 0.72), 2))
  const logo = closed(flat(P, circ(20, 16, 3.5, 20), 2))
  return { P, BARS, slab, panels, details, sparks, donutArc, logo }
})()

function UxArt() {
  return (
    <>
      <path data-draw="ux-canvas" d={UX.slab.sil} {...solidSil} />
      <path data-draw="ux-canvas" d={UX.slab.top} {...crease} />
      {UX.panels.map(({ b, p }) => (
        <g key={b.join()}>
          <path data-draw="ux-panel" d={p.sil} {...solidSil} strokeWidth={1.3} />
          <path data-draw="ux-panel" d={p.top} {...crease} />
        </g>
      ))}
      {UX.details.map((d, k) => (
        <path key={k} data-draw="ux-detail" d={d} {...crease} />
      ))}
      <path data-draw="ux-detail" d={UX.logo} {...crease} fill={INK} stroke={INK} />
      {UX.sparks.map((d, k) => (
        <path key={k} data-draw="ux-chart" d={d} {...crease} stroke={k === 0 ? ACCENT : INK} strokeWidth={1.4} />
      ))}
      <path data-draw="ux-chart" d={UX.donutArc} {...crease} stroke={ACCENT} strokeWidth={5} strokeLinecap="butt" />
      {UX.BARS.map((_, i) => (
        <g key={i} data-bar={i}>
          <path data-sil fill={PAPER} stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
          <path data-top fill={i === UX.BARS.length - 1 ? ACCENT : 'none'} stroke={i === UX.BARS.length - 1 ? ACCENT : MID} strokeWidth={1} strokeLinejoin="round" />
        </g>
      ))}
    </>
  )
}

// ---------- Branding: rulers, construction circles, a circular mark ----------

const BRAND = (() => {
  // Three circles, each 1/phi of the last, tangent at the back; the mark is them stacked.
  const R = [44, 27.2, 16.8]
  const T: Pt = [80 - 44 * CS, 80 - 44 * CS]
  const centres = R.map((r) => [T[0] + r * CS, T[1] + r * CS] as Pt)
  const tiers = R.map((r, i) => ({ ring: circ(centres[i][0], centres[i][1], r, 56), z0: i * 6, h: 6 }))
  const P = fitProj(1.36, [[0, 0, -4], [150, 150, -4], [150, 0, -4], [0, 150, -4], [80, 80, 30]])
  const board = prism(P, rr(0, 0, 150, 150, 8), -4, 0)
  const seg = (a: V3, b: V3) => line([P(...a), P(...b)])
  const ticks: string[] = [seg([18, 5, 0], [144, 5, 0]), seg([5, 18, 0], [5, 144, 0])]
  for (let k = 1; k <= 22; k++) {
    const t = 12 + k * 6
    const len = k % 5 === 0 ? 6 : 3
    ticks.push(seg([t, 5, 0], [t, 5 + len, 0]), seg([5, t, 0], [5 + len, t, 0]))
  }
  const guides = [seg([16, 80, 0], [146, 80, 0]), seg([80, 16, 0], [80, 146, 0]), seg([16, 16, 0], [146, 146, 0])]
  const construct = centres.map((c, i) => closed(flat(P, circ(c[0], c[1], R[i], 56), 0)))
  return { P, tiers, board, ticks, guides, construct }
})()

function BrandArt() {
  return (
    <>
      <path data-draw="br-board" d={BRAND.board.sil} {...solidSil} />
      <path data-draw="br-board" d={BRAND.board.top} {...crease} />
      {BRAND.ticks.map((d, k) => (
        <path key={k} data-draw="br-scale" d={d} {...crease} stroke={INK} />
      ))}
      {BRAND.guides.map((d, k) => (
        <path key={k} data-fade="br-guide" d={d} {...guide} />
      ))}
      {BRAND.construct.map((d, k) => (
        <path key={k} data-draw="br-construct" d={d} {...crease} stroke={GUIDE} />
      ))}
      {BRAND.tiers.map((_, i) => (
        <g key={i} data-tier={i}>
          <path data-sil fill={PAPER} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
          <path
            data-top
            fill={i === BRAND.tiers.length - 1 ? ACCENT : 'none'}
            stroke={i === BRAND.tiers.length - 1 ? ACCENT : MID}
            strokeWidth={1}
          />
        </g>
      ))}
    </>
  )
}

// ---------- Motion: a block on a motion path, keyframes, handles and a timeline ----------

const MOTION = (() => {
  const K: Pt[] = [
    [18, 74],
    [84, 40],
    [152, 58],
  ]
  const H1: [Pt, Pt] = [
    [62, 28],
    [106, 52],
  ]
  const cubic = (a: Pt, b: Pt, c: Pt, d: Pt, t: number): Pt => {
    const m = 1 - t
    return [
      m ** 3 * a[0] + 3 * m * m * t * b[0] + 3 * m * t * t * c[0] + t ** 3 * d[0],
      m ** 3 * a[1] + 3 * m * m * t * b[1] + 3 * m * t * t * c[1] + t ** 3 * d[1],
    ]
  }
  const pts: Pt[] = []
  for (let k = 0; k <= 40; k++) pts.push(cubic(K[0], [26, 36], H1[0], K[1], k / 40))
  for (let k = 1; k <= 40; k++) pts.push(cubic(K[1], H1[1], [130, 80], K[2], k / 40))
  const cum = [0]
  for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]))
  const total = cum[cum.length - 1]
  /** The point a share s of the way along the path. */
  const along = (s: number): Pt => {
    const d = Math.min(Math.max(s, 0), 1) * total
    let k = 1
    while (k < cum.length - 1 && cum[k] < d) k++
    const u = (d - cum[k - 1]) / (cum[k] - cum[k - 1] || 1)
    return [pts[k - 1][0] + (pts[k][0] - pts[k - 1][0]) * u, pts[k - 1][1] + (pts[k][1] - pts[k - 1][1]) * u]
  }
  const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) ** 2) // power2.inOut
  // The middle keyframe's time: when the eased block reaches it.
  const fK1 = cum[40] / total
  let lo = 0
  let hi = 1
  for (let k = 0; k < 30; k++) {
    const mid = (lo + hi) / 2
    if (ease(mid) < fK1) lo = mid
    else hi = mid
  }
  const tK1 = lo
  const TRACK = { x0: 18, x1: 152, y: 107 }
  const B = 7
  const P = fitProj(1.42, [[0, 0, -4], [170, 124, -4], [170, 0, -4], [0, 124, -4], [84, 40, 22], [30, 70, 22]])
  const board = prism(P, rr(0, 0, 170, 124, 8), -4, 0)
  const track = prism(P, rr(10, 100, 160, 114, 4), 0, 2)
  const seg = (a: V3, b: V3) => line([P(...a), P(...b)])
  const trackTicks = Array.from({ length: 14 }, (_, k) => {
    const x = TRACK.x0 + (k * (TRACK.x1 - TRACK.x0)) / 13
    return seg([x, 103, 2], [x, 105, 2])
  })
  const path = line(flat(P, pts, 0))
  const handles = [seg([...H1[0], 0], [...K[1], 0]), seg([...K[1], 0], [...H1[1], 0])]
  const knobs = H1.map((h) => closed(flat(P, circ(h[0], h[1], 2.6, 20), 0)))
  const diamond = (x: number, y: number, z: number, s = 4) => closed([P(x - s, y, z), P(x, y - s, z), P(x + s, y, z), P(x, y + s, z)])
  const keys = [...K.map(([x, y]) => diamond(x, y, 0)), ...[0, tK1, 1].map((t) => diamond(TRACK.x0 + t * (TRACK.x1 - TRACK.x0), TRACK.y, 2, 3.5))]
  const GHOSTS = [1, 2, 3, 4, 5].map((k) => {
    const t = k / 6
    const [x, y] = along(ease(t))
    return { t, d: closed(flat(P, rr(x - B, y - B, x + B, y + B, 3), 0)) }
  })
  const box = (s: number) => {
    const [x, y] = along(s)
    return prism(P, rr(x - B, y - B, x + B, y + B, 3), 0, 12)
  }
  const head = (t: number) => {
    const x = TRACK.x0 + t * (TRACK.x1 - TRACK.x0)
    return { stem: seg([x, TRACK.y, 2], [x, TRACK.y, 20]), cap: diamond(x, TRACK.y, 20, 3) }
  }
  return { P, board, track, trackTicks, path, handles, knobs, keys, GHOSTS, box, head, ease }
})()

function MotionArt() {
  return (
    <>
      <path data-draw="mo-board" d={MOTION.board.sil} {...solidSil} />
      <path data-draw="mo-board" d={MOTION.board.top} {...crease} />
      <path data-draw="mo-track" d={MOTION.track.sil} {...solidSil} strokeWidth={1.3} />
      <path data-draw="mo-track" d={MOTION.track.top} {...crease} />
      {MOTION.trackTicks.map((d, k) => (
        <path key={k} data-draw="mo-track" d={d} {...crease} />
      ))}
      <path data-draw="mo-path" d={MOTION.path} {...crease} stroke={INK} strokeWidth={1.3} />
      {MOTION.GHOSTS.map((g) => (
        <path key={g.t} data-ghost={g.t} d={g.d} fill="none" stroke={MID} strokeWidth={1} strokeDasharray="2.5 2" />
      ))}
      {MOTION.handles.map((d, k) => (
        <path key={k} data-draw="mo-handle" d={d} {...crease} stroke={ACCENT} />
      ))}
      {MOTION.knobs.map((d, k) => (
        <path key={k} data-pop="mo-knob" d={d} fill={PAPER} stroke={ACCENT} strokeWidth={1.2} />
      ))}
      {MOTION.keys.map((d, k) => (
        <path key={k} data-pop="mo-key" d={d} fill={k === 1 || k === 4 ? ACCENT : INK} />
      ))}
      <g data-box>
        <path data-sil fill={PAPER} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
        <path data-top fill="none" stroke={ACCENT} strokeWidth={1.2} strokeLinejoin="round" />
      </g>
      <g data-head>
        <path data-stem fill="none" stroke={ACCENT} strokeWidth={1.4} strokeLinecap="round" />
        <path data-cap fill={ACCENT} />
      </g>
    </>
  )
}

const FRAMES: { id: string; name: string; Art: () => ReactNode }[] = [
  { id: 'ux', name: 'UX / Interface', Art: UxArt },
  { id: 'brand', name: 'Branding / Identity', Art: BrandArt },
  { id: 'motion', name: 'Motion / Keyframes', Art: MotionArt },
]

export default function Disciplines({ className = '' }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const all = (key: string, attr = 'draw') => q(`[data-${attr}="${key}"]`)
      const one = (sel: string): Element | undefined => q(sel)[0]
      const setD = (el: Element | null | undefined, d: string) => el?.setAttribute('d', d)

      // The solids that grow or move, drawn from a value.
      const bars = UX.BARS.map((b, i) => {
        const g = one(`[data-bar="${i}"]`)
        return (h: number) => {
          const p = prism(UX.P, b.ring, 2, 2 + Math.max(h, 0.3))
          setD(g?.querySelector('[data-sil]'), p.sil)
          setD(g?.querySelector('[data-top]'), p.top)
        }
      })
      const tiers = BRAND.tiers.map((t, i) => {
        const g = one(`[data-tier="${i}"]`)
        return (h: number) => {
          const p = prism(BRAND.P, t.ring, t.z0, t.z0 + Math.max(h, 0.2))
          setD(g?.querySelector('[data-sil]'), p.sil)
          setD(g?.querySelector('[data-top]'), p.top)
        }
      })
      const boxEl = one('[data-box]')
      const headEl = one('[data-head]')
      const ghosts = q('[data-ghost]')
      const motionAt = (t: number) => {
        const p = MOTION.box(MOTION.ease(t))
        setD(boxEl?.querySelector('[data-sil]'), p.sil)
        setD(boxEl?.querySelector('[data-top]'), p.top)
        const h = MOTION.head(t)
        setD(headEl?.querySelector('[data-stem]'), h.stem)
        setD(headEl?.querySelector('[data-cap]'), h.cap)
        ghosts.forEach((g) => gsap.set(g, { autoAlpha: t >= Number(g.getAttribute('data-ghost')) ? 1 : 0 }))
      }

      const draws = q('[data-draw]')
      const pops = q('[data-pop]')
      const fades = q('[data-fade]')
      const growing = [...q('[data-bar]'), ...q('[data-tier]'), boxEl, headEl].filter(Boolean)

      if (reducedMotion()) {
        UX.BARS.forEach((b, i) => bars[i](b.h))
        BRAND.tiers.forEach((t, i) => tiers[i](t.h))
        motionAt(1)
        gsap.set(draws, { strokeDasharray: 1, strokeDashoffset: 0 })
        gsap.set(all('br-construct'), { autoAlpha: 0.45 })
        gsap.set(root.current, { autoAlpha: 1 })
        return
      }

      gsap.set(draws, { strokeDasharray: 1, strokeDashoffset: 1, autoAlpha: 0 })
      gsap.set(pops, { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' })
      gsap.set([...fades, ...growing, ...ghosts], { autoAlpha: 0 })
      UX.BARS.forEach((_, i) => bars[i](0))
      BRAND.tiers.forEach((_, i) => tiers[i](0))
      motionAt(0)
      gsap.set(ghosts, { autoAlpha: 0 })
      gsap.set(root.current, { autoAlpha: 1 })

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: root.current, start: 'top 80%', once: true, onEnter: () => tl.play() },
      })
      const draw = (key: string, at: number, duration: number, stagger = 0.05) =>
        tl.to(all(key), { strokeDashoffset: 0, autoAlpha: 1, duration, stagger }, at)
      const pop = (key: string, at: number, stagger = 0.05) =>
        tl.to(all(key, 'pop'), { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'expo.out', stagger }, at)
      const grow = (fn: (v: number) => void, el: Element | undefined, to: number, at: number, duration: number) => {
        const v = { h: 0 }
        tl.set(el ?? {}, { autoAlpha: 1 }, at)
        tl.to(v, { h: to, duration, ease: 'power3.out', onUpdate: () => fn(v.h) }, at)
      }

      tl.fromTo(q('[data-frame-name]'), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.12 }, 0)

      // UX: the canvas, then the panels, then the charts move. 0 – 2.5s
      draw('ux-canvas', 0, 0.7, 0.1)
      draw('ux-panel', 0.55, 0.5, 0.06)
      draw('ux-detail', 1.0, 0.4, 0.025)
      UX.BARS.forEach((b, i) => grow(bars[i], q(`[data-bar="${i}"]`)[0], b.h, 1.35 + i * 0.08, 0.7))
      draw('ux-chart', 1.45, 0.8, 0.1)

      // Branding: rulers and guides, construction circles, then the mark rises tier by tier. 0 – 2.6s
      draw('br-board', 0.1, 0.6, 0.1)
      draw('br-scale', 0.35, 0.3, 0.012)
      tl.to(all('br-guide', 'fade'), { autoAlpha: 1, duration: 0.4, stagger: 0.08 }, 0.8)
      draw('br-construct', 1.0, 0.55, 0.12)
      BRAND.tiers.forEach((t, i) => grow(tiers[i], q(`[data-tier="${i}"]`)[0], t.h, 1.6 + i * 0.3, 0.45))
      tl.to(all('br-construct'), { autoAlpha: 0.45, duration: 0.5, ease: 'power1.out' }, 2.1)

      // Motion: path, keyframes and handles, then the block travels while the playhead runs. 0 – 2.8s
      draw('mo-board', 0.2, 0.55, 0.1)
      draw('mo-track', 0.4, 0.4, 0.02)
      draw('mo-path', 0.6, 0.6)
      pop('mo-key', 0.95, 0.06)
      draw('mo-handle', 1.1, 0.3)
      pop('mo-knob', 1.25)
      tl.to([boxEl, headEl], { autoAlpha: 1, duration: 0.25 }, 1.2)
      const run = { t: 0 }
      tl.to(run, { t: 1, duration: 1.3, ease: 'none', onUpdate: () => motionAt(run.t) }, 1.5)

      return () => tl.scrollTrigger?.kill()
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      role="img"
      aria-label="Three isometric line drawings: a dashboard whose charts rise, a circular brand mark built on rulers and construction circles, and a block moving along a motion path with keyframes and a timeline."
      className={`invisible grid grid-cols-1 gap-x-6 gap-y-10 min-[720px]:grid-cols-3 ${className}`}
    >
      {FRAMES.map(({ id, name, Art }) => (
        <div key={id} className="min-w-0">
          <p data-frame-name className="m-0 mb-2.5 font-hero-mono text-[11px] leading-none tracking-[0.08em] text-muted uppercase">
            {name}
          </p>
          <div className="border border-line bg-paper">
            <svg viewBox="0 0 400 300" className="block h-auto w-full overflow-visible" aria-hidden>
              <Art />
            </svg>
          </div>
        </div>
      ))}
    </div>
  )
}
