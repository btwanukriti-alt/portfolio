'use client'

import { useRef } from 'react'
import { gsap, useGSAP, reducedMotion } from '@/lib/gsap'

// UX, branding and motion as three Figma frames of line illustration, drawn in one pass the
// first time they scroll into view:
// - UX: a wireframe window draws in, the cursor clicks a card and it's selected.
// - Branding: golden-ratio construction circles, the mark inked over them, type and swatches.
// - Motion: an ease-in-out curve with its handles, then a ball eases along a track with onion skins.
// Everything has landed by 2.9s. Strokes are drawn with pathLength=1 dash offsets. Reduced motion shows the finished frames.

const INK = '#0b0b0c'
const FAINT = '#c9c9c6'
const ACCENT = '#2f4bff'
const CURSOR = '#7B61FF'

// The motion frame's curve, as a cubic Bezier (ease-in-out: value against time).
const P = [
  [40, 190],
  [150, 190],
  [174, 50],
  [284, 50],
] as const
const bezier = (u: number) => {
  const a = (1 - u) ** 3
  const b = 3 * (1 - u) ** 2 * u
  const c = 3 * (1 - u) * u ** 2
  const d = u ** 3
  return [a * P[0][0] + b * P[1][0] + c * P[2][0] + d * P[3][0], a * P[0][1] + b * P[1][1] + c * P[2][1] + d * P[3][1]]
}
// The ball's track: its x follows the curve's value.
const TRACK = { x0: 52, x1: 272, y: 228 }
const trackX = (u: number) => TRACK.x0 + ((TRACK.x1 - TRACK.x0) * (P[0][1] - bezier(u)[1])) / (P[0][1] - P[3][1])
const GHOSTS = [1, 2, 3, 4, 5, 6, 7].map((k) => ({ u: k / 8, x: trackX(k / 8) }))

const stroke = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round', pathLength: 1 } as const

const FRAMES = [
  { id: 'ux', name: 'UX / Interface' },
  { id: 'brand', name: 'Branding / Identity' },
  { id: 'motion', name: 'Motion / Easing' },
] as const

function UxFrame() {
  return (
    <>
      <rect data-draw="ux-shell" x="40" y="36" width="240" height="188" rx="10" stroke={INK} strokeWidth="1.5" {...stroke} />
      <line data-draw="ux-shell" x1="40" y1="60" x2="280" y2="60" stroke={INK} strokeWidth="1.25" {...stroke} />
      {[54, 64, 74].map((cx) => (
        <circle key={cx} data-pop="ux-dots" cx={cx} cy="48" r="2.5" fill={INK} />
      ))}
      <line data-draw="ux-side" x1="100" y1="60" x2="100" y2="224" stroke={INK} strokeWidth="1.25" {...stroke} />
      {[
        [54, 82, 86],
        [54, 98, 80],
        [54, 114, 84],
      ].map(([x1, y, x2]) => (
        <line key={y} data-draw="ux-side" x1={x1} y1={y} x2={x2} y2={y} stroke={FAINT} strokeWidth="4" {...stroke} />
      ))}
      <line data-draw="ux-body" x1="116" y1="84" x2="196" y2="84" stroke={INK} strokeWidth="5" {...stroke} />
      <line data-draw="ux-body" x1="116" y1="99" x2="168" y2="99" stroke={FAINT} strokeWidth="4" {...stroke} />
      <rect data-draw="ux-body" x="116" y="114" width="74" height="64" rx="6" stroke={INK} strokeWidth="1.25" {...stroke} />
      <rect data-draw="ux-body" x="198" y="114" width="66" height="64" rx="6" stroke={INK} strokeWidth="1.25" {...stroke} />
      <circle data-draw="ux-body" cx="132" cy="132" r="7" stroke={INK} strokeWidth="1.25" {...stroke} />
      <line data-draw="ux-body" x1="126" y1="164" x2="170" y2="164" stroke={FAINT} strokeWidth="4" {...stroke} />
      <line data-draw="ux-body" x1="208" y1="164" x2="240" y2="164" stroke={FAINT} strokeWidth="4" {...stroke} />
      <rect data-draw="ux-body" x="208" y="194" width="56" height="18" rx="9" stroke={INK} strokeWidth="1.25" {...stroke} />

      {/* Selection on the first card, with Figma's size tag. */}
      <rect data-draw="ux-select" x="113" y="111" width="80" height="70" stroke={ACCENT} strokeWidth="1.25" {...stroke} />
      {[
        [113, 111],
        [193, 111],
        [193, 181],
        [113, 181],
      ].map(([x, y]) => (
        <rect key={`${x}${y}`} data-pop="ux-handles" x={x - 3} y={y - 3} width="6" height="6" fill="#fff" stroke={ACCENT} strokeWidth="1.25" />
      ))}
      <g data-pop="ux-tag">
        <rect x="131" y="188" width="44" height="14" rx="3" fill={ACCENT} />
        <text x="153" y="198" textAnchor="middle" fill="#fff" fontSize="8" style={{ fontFamily: 'var(--font-hero-mono)' }}>
          74 × 64
        </text>
      </g>

      <g data-cursor>
        <path
          d="M0 0 L0 15.4 L4.2 11.5 L7.1 17.6 L9.6 16.5 L6.8 10.5 L12.3 10.5 Z"
          fill={CURSOR}
          stroke="#fff"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
      </g>
    </>
  )
}

function BrandFrame() {
  // Four circles, each 1/phi of the last, tangent at the bottom point.
  const circles = [
    { cy: 124, r: 60 },
    { cy: 147, r: 37 },
    { cy: 161, r: 23 },
    { cy: 170, r: 14 },
  ]
  return (
    <>
      <rect data-draw="brand-guides" x="40" y="64" width="120" height="120" stroke={FAINT} strokeWidth="0.75" {...stroke} />
      <line data-draw="brand-guides" x1="24" y1="124" x2="176" y2="124" stroke={FAINT} strokeWidth="0.75" {...stroke} />
      <line data-draw="brand-guides" x1="100" y1="48" x2="100" y2="200" stroke={FAINT} strokeWidth="0.75" {...stroke} />
      <line data-draw="brand-guides" x1="40" y1="64" x2="160" y2="184" stroke={FAINT} strokeWidth="0.75" {...stroke} />
      {circles.map((c) => (
        <circle key={c.r} data-draw="brand-construct" cx="100" cy={c.cy} r={c.r} stroke={FAINT} strokeWidth="0.75" {...stroke} />
      ))}

      {/* The mark: two rings inked over the construction, the third filled. */}
      <circle data-draw="brand-mark" cx="100" cy="124" r="60" stroke={INK} strokeWidth="1.75" transform="rotate(90 100 124)" {...stroke} />
      <circle data-draw="brand-mark" cx="100" cy="147" r="37" stroke={INK} strokeWidth="1.75" transform="rotate(90 100 147)" {...stroke} />
      <circle data-pop="brand-fill" cx="100" cy="161" r="23" fill={ACCENT} />

      <text
        data-rise="brand-type"
        x="204"
        y="128"
        fill={INK}
        fontSize="50"
        letterSpacing="-2"
        style={{ fontFamily: 'var(--font-hero)' }}
      >
        Aa
      </text>
      {[
        { cx: 214, fill: INK },
        { cx: 238, fill: ACCENT },
        { cx: 262, fill: '#f4f4f2' },
      ].map((s) => (
        <circle key={s.cx} data-pop="brand-swatch" cx={s.cx} cy="160" r="9" fill={s.fill} stroke={s.fill === INK ? 'none' : '#e7e7e5'} strokeWidth="1" />
      ))}
    </>
  )
}

function MotionFrame() {
  const d = `M${P[0]} C${P[1]} ${P[2]} ${P[3]}`
  return (
    <>
      <path data-draw="motion-axes" d="M40 40 V190 H284" stroke={FAINT} strokeWidth="1" {...stroke} />
      <text data-rise="motion-label" x="284" y="30" textAnchor="end" fill="#a1a1a6" fontSize="9" letterSpacing="0.6" style={{ fontFamily: 'var(--font-hero-mono)' }}>
        EASE-IN-OUT
      </text>
      <path data-draw="motion-curve" d={d} stroke={INK} strokeWidth="1.75" {...stroke} />

      <line data-draw="motion-handles" x1={P[0][0]} y1={P[0][1]} x2={P[1][0]} y2={P[1][1]} stroke={ACCENT} strokeWidth="1" {...stroke} />
      <line data-draw="motion-handles" x1={P[3][0]} y1={P[3][1]} x2={P[2][0]} y2={P[2][1]} stroke={ACCENT} strokeWidth="1" {...stroke} />
      {[P[1], P[2]].map(([cx, cy]) => (
        <circle key={cx} data-pop="motion-knobs" cx={cx} cy={cy} r="4" fill="#fff" stroke={ACCENT} strokeWidth="1.25" />
      ))}
      {[P[0], P[3]].map(([x, y]) => (
        <rect key={x} data-pop="motion-knobs" x={x - 3.5} y={y - 3.5} width="7" height="7" fill={INK} />
      ))}

      <line data-draw="motion-track" x1={TRACK.x0} y1={TRACK.y} x2={TRACK.x1} y2={TRACK.y} stroke={FAINT} strokeWidth="1" {...stroke} />
      {GHOSTS.map((g) => (
        <circle key={g.u} data-ghost={g.u} cx={g.x} cy={TRACK.y} r="7" fill="none" stroke={INK} strokeWidth="1" opacity="0.22" />
      ))}
      <circle data-curve-dot data-pop="motion-dot" cx={P[0][0]} cy={P[0][1]} r="4.5" fill={ACCENT} />
      <circle data-ball data-pop="motion-ball" cx={TRACK.x0} cy={TRACK.y} r="7" fill={INK} />
    </>
  )
}

const ART = { ux: UxFrame, brand: BrandFrame, motion: MotionFrame }

export default function Disciplines({ className = '' }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const all = (key: string, attr = 'draw') => q(`[data-${attr}="${key}"]`)
      const draws = q('[data-draw]')
      const pops = q('[data-pop]')
      const rises = q('[data-rise]')
      const ghosts = q('[data-ghost]')
      const cursor = q('[data-cursor]')
      const curveDot = q('[data-curve-dot]')
      const ball = q('[data-ball]')
      const [bx, by] = bezier(1)

      const finish = () => {
        gsap.set(draws, { strokeDasharray: 1, strokeDashoffset: 0, autoAlpha: 1 })
        gsap.set([...pops, ...rises, ...ghosts], { autoAlpha: 1, scale: 1, y: 0 })
        gsap.set(ghosts, { autoAlpha: 0.22 })
        gsap.set(all('brand-construct'), { autoAlpha: 0.55 })
        gsap.set(cursor, { autoAlpha: 1, x: 176, y: 156 })
        gsap.set(curveDot, { attr: { cx: bx, cy: by }, autoAlpha: 0 })
        gsap.set(ball, { attr: { cx: TRACK.x1 } })
        gsap.set(root.current, { autoAlpha: 1 })
      }
      if (reducedMotion()) return finish()

      gsap.set(draws, { strokeDasharray: 1, strokeDashoffset: 1, autoAlpha: 0 })
      gsap.set(pops, { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' })
      gsap.set(rises, { autoAlpha: 0, y: 10 })
      gsap.set(ghosts, { autoAlpha: 0 })
      gsap.set(cursor, { autoAlpha: 0, x: 262, y: 232 })
      gsap.set(root.current, { autoAlpha: 1 })

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: root.current, start: 'top 80%', once: true, onEnter: () => tl.play() },
      })
      const draw = (key: string, at: number, duration: number, stagger = 0.06) =>
        tl.to(all(key), { strokeDashoffset: 0, autoAlpha: 1, duration, stagger }, at)
      const pop = (key: string, at: number, stagger = 0.05) =>
        tl.to(all(key, 'pop'), { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'expo.out', stagger }, at)

      // Frame labels.
      tl.fromTo(q('[data-frame-name]'), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.12 }, 0)

      // UX: 0 – 1.55s
      draw('ux-shell', 0, 0.6, 0.12)
      pop('ux-dots', 0.35)
      draw('ux-side', 0.35, 0.45)
      draw('ux-body', 0.5, 0.5, 0.05)
      tl.to(cursor, { autoAlpha: 1, duration: 0.2 }, 0.8)
      tl.to(cursor, { x: 176, y: 156, duration: 0.5, ease: 'power2.inOut' }, 0.8)
      tl.to(cursor, { scale: 0.86, duration: 0.08, yoyo: true, repeat: 1, ease: 'power1.inOut', transformOrigin: '0 0' }, 1.3)
      draw('ux-select', 1.34, 0.3)
      pop('ux-handles', 1.4, 0.03)
      pop('ux-tag', 1.48)

      // Branding: 0.45 – 2.1s
      draw('brand-guides', 0.45, 0.6, 0.06)
      draw('brand-construct', 0.6, 0.6, 0.08)
      draw('brand-mark', 1.05, 0.55, 0.1)
      pop('brand-fill', 1.5)
      tl.to(all('brand-construct'), { autoAlpha: 0.55, duration: 0.5, ease: 'power1.out' }, 1.6)
      tl.to(all('brand-type', 'rise'), { autoAlpha: 1, y: 0, duration: 0.5, ease: 'expo.out' }, 1.4)
      pop('brand-swatch', 1.6, 0.07)

      // Motion: 0.9 – 2.9s
      draw('motion-axes', 0.9, 0.45)
      tl.to(all('motion-label', 'rise'), { autoAlpha: 1, y: 0, duration: 0.4 }, 1.05)
      draw('motion-curve', 1.15, 0.6)
      draw('motion-handles', 1.5, 0.3)
      pop('motion-knobs', 1.6, 0.04)
      draw('motion-track', 1.7, 0.3)
      pop('motion-dot', 1.15)
      pop('motion-ball', 1.75)
      const travel = { u: 0 }
      tl.to(
        travel,
        {
          u: 1,
          duration: 0.8,
          ease: 'none',
          onUpdate: () => {
            const [x, y] = bezier(travel.u)
            gsap.set(curveDot, { attr: { cx: x, cy: y } })
            gsap.set(ball, { attr: { cx: trackX(travel.u) } })
            ghosts.forEach((g) => {
              if (travel.u >= Number(g.getAttribute('data-ghost'))) gsap.set(g, { autoAlpha: 0.22 })
            })
          },
        },
        1.9,
      )
      // The dot hands over to the end anchor it lands on.
      tl.to(curveDot, { autoAlpha: 0, scale: 0, duration: 0.2, ease: 'power2.in' }, 2.7)

      return () => tl.scrollTrigger?.kill()
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      role="img"
      aria-label="Three line illustrations: a UX wireframe with a selected card, a brand mark built on golden-ratio circles with type and colour swatches, and an ease-in-out motion curve moving a ball."
      className={`invisible grid grid-cols-1 gap-x-6 gap-y-10 min-[720px]:grid-cols-3 ${className}`}
    >
      {FRAMES.map(({ id, name }) => {
        const Art = ART[id]
        return (
          <div key={id} className="min-w-0">
            <p data-frame-name className="m-0 mb-2.5 font-hero-mono text-[11px] leading-none tracking-[0.08em] text-faint uppercase">
              {name}
            </p>
            <div className="border border-line bg-paper">
              <svg viewBox="0 0 320 260" className="block h-auto w-full overflow-visible" aria-hidden>
                <Art />
              </svg>
            </div>
          </div>
        )
      })}
    </div>
  )
}
