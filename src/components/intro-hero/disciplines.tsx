import type { ReactNode } from 'react'
import { gsap } from '@/lib/gsap'

// The hero's three discipline cards: UX, branding and motion as flat greyscale illustrations that
// run off the edges of their frames, each built in front of the viewer. The art is drawn on a
// 400 x 300 board; the hero shows it in 3:2 cards (sliced top and bottom), the screenshots' shape.
// - UX: a dashboard window forms, then its sidebar and cards, then the charts move.
// - Branding: rulers are drawn, then guides and concentric rings, then the circular mark forms.
// - Motion: a motion path with keyframes and handles, then a circle travels it on an ease while a
//   playhead runs the timeline underneath.
// Lines are drawn with pathLength=1 dash offsets. Everything has landed by 2s: the timeline is
// written over 2.8s and played 1.4x.

// Each card is its own colour world: a soft tinted ground, lines and fills in tones of one hue,
// and one strong shade for what matters (the highlighted data, the mark, the moving layer). The
// three hues (blue, violet, coral) sit together as a set.
type Tone = {
  ground: string // the card's tinted background
  paper: string // surfaces on it (windows, panels, pills)
  ink: string // lines and text
  label: string // small labels
  soft: string // guides, rings, dividers
  mid: string // secondary marks
  fill: string // card fills
  strong: string // the one strong shade
  pop: string // a second, small accent
}
const UX: Tone = {
  ground: '#E9EFFF',
  paper: '#FFFFFF',
  ink: '#1C2A55',
  label: '#7484B0',
  soft: '#DCE4FA',
  mid: '#B8C7F2',
  fill: '#F1F5FF',
  strong: '#3461FF',
  pop: '#7FA0FF',
}
const BRAND: Tone = {
  ground: '#F1EDFF',
  paper: '#FFFFFF',
  ink: '#2B2160',
  label: '#8578B8',
  soft: '#D4CAFA',
  mid: '#B9AAF5',
  fill: '#E5DEFF',
  strong: '#6A4DF4',
  pop: '#FF7A59',
}
const MOTION_TONE: Tone = {
  ground: '#FFF0EA',
  paper: '#FFFFFF',
  ink: '#4A2418',
  label: '#B07E6E',
  soft: '#F7D9CE',
  mid: '#FFAE94',
  fill: '#FFF8F5',
  strong: '#FF5E3A',
  pop: '#FFD2C4',
}
const LIGHTS = ['#FF5F57', '#FEBC2E', '#28C840']
// Green, where it means something: growth in the dashboard, and the palette's third colour.
const GREEN = '#17A35B'
const GREEN_SOFT = '#DCF5E7'
/** The card's ground, behind everything (bleeds past the 3:2 crop). */
const Ground = ({ c }: { c: string }) => <rect x="-60" y="-60" width="520" height="420" fill={c} />
const HERO = { fontFamily: 'var(--font-hero)' }
const MONO = { fontFamily: 'var(--font-hero-mono)' }
const draw = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round', pathLength: 1 } as const

// ---------- UX: a dashboard ----------

const BARS = [40, 62, 48, 80, 58, 96, 70, 52]
const SPARK = [0, 2, -1, 1, -14, 12, -3, 0, 1, -16, 13, -2, 0, 1]

function UxArt() {
  const c = UX
  const spark = SPARK.map((v, k) => `${286 + k * 11} ${146 + v}`).join(' L')
  return (
    <>
      <Ground c={c.ground} />
      <rect data-draw="ux-window" x="40" y="34" width="420" height="320" rx="12" fill={c.paper} stroke={c.ink} strokeWidth="1.4" pathLength="1" />
      <path data-fade="ux-bar" d="M40.7 62 V46 a11.3 11.3 0 0 1 11.3 -11.3 H460 V62 Z" fill={c.fill} />
      <line data-draw="ux-window" x1="40" y1="62" x2="460" y2="62" stroke={c.ink} strokeWidth="1.2" {...draw} />
      {LIGHTS.map((l, k) => (
        <circle key={l} data-pop="ux-dots" cx={58 + k * 12} cy="48" r="3.6" fill={l} />
      ))}

      {/* Sidebar, with the selected item highlighted */}
      <line data-draw="ux-side" x1="148" y1="62" x2="148" y2="300" stroke={c.soft} strokeWidth="1.2" {...draw} />
      <text data-rise="ux-label" x="58" y="92" fontSize="13" fill={c.ink} style={HERO}>
        Welcome
      </text>
      <rect data-rise="ux-label" x="50" y="108" width="90" height="20" rx="6" fill={c.soft} />
      {['Overview', 'Projects', 'Reports', 'Settings'].map((label, k) => (
        <g key={label} data-rise="ux-label">
          <text x="58" y={122 + k * 30} fontSize="11" fill={k === 0 ? c.strong : c.ink} style={HERO}>
            {label}
          </text>
          {k > 0 && <line x1="58" y1={132 + k * 30} x2="134" y2={132 + k * 30} stroke={c.soft} />}
        </g>
      ))}
      <circle data-pop="ux-dots" cx="130" cy="118" r="2.6" fill={c.strong} />

      {/* Cards */}
      <text data-rise="ux-label" x="164" y="92" fontSize="13" fill={c.ink} style={HERO}>
        Dashboard
      </text>
      <g data-rise="ux-card">
        <rect x="164" y="104" width="104" height="58" rx="8" fill={c.strong} />
        <text x="175" y="123" fontSize="9" fill="#C9D6FF" style={HERO}>
          Revenue
        </text>
        <text data-count="48.2" x="175" y="148" fontSize="17" fill="#FFFFFF" style={HERO}>
          $48.2k
        </text>
      </g>
      <g data-rise="ux-card">
        <rect x="276" y="104" width="160" height="58" rx="8" fill={c.fill} />
        <text x="287" y="123" fontSize="9" fill={c.label} style={HERO}>
          Active users
        </text>
        {/* growth, in green */}
        <rect x="344" y="114" width="32" height="13" rx="6.5" fill={GREEN_SOFT} />
        <text x="360" y="123.5" textAnchor="middle" fontSize="7.5" fontWeight="600" fill={GREEN} style={HERO}>
          +12%
        </text>
      </g>
      <path data-draw="ux-chart" d={`M${spark}`} stroke={GREEN} strokeWidth="1.5" {...draw} />
      <g data-rise="ux-card">
        <rect x="164" y="172" width="270" height="150" rx="8" fill={c.fill} />
        <text x="176" y="191" fontSize="9" fill={c.label} style={HERO}>
          This week
        </text>
      </g>
      {BARS.map((h, i) => (
        <rect key={i} data-bar x={180 + i * 24} y={300 - h} width="14" height={h + 10} rx="3" fill={i === 5 ? c.strong : c.mid} />
      ))}
    </>
  )
}

// ---------- Branding: rulers, rings, the mark ----------

function BrandArt() {
  const c = BRAND
  const ticksTop: ReactNode[] = []
  const ticksLeft: ReactNode[] = []
  for (let x = 30; x <= 400; x += 10) {
    const major = (x - 20) % 50 === 0
    ticksTop.push(<line key={`t${x}`} data-draw="br-scale" x1={x} y1="20" x2={x} y2={major ? 10 : 15} stroke={c.ink} strokeWidth="0.9" {...draw} />)
    if (major) ticksTop.push(<text key={`tl${x}`} data-rise="br-num" x={x + 2} y="9" fontSize="6.5" fill={c.label} style={MONO}>{x - 20}</text>)
  }
  for (let y = 30; y <= 300; y += 10) {
    const major = (y - 20) % 50 === 0
    ticksLeft.push(<line key={`l${y}`} data-draw="br-scale" x1="20" y1={y} x2={major ? 10 : 15} y2={y} stroke={c.ink} strokeWidth="0.9" {...draw} />)
  }
  return (
    <>
      <Ground c={c.ground} />
      {/* Rings and guides sit under the rulers. */}
      <line data-fade="br-guide" x1="200" y1="20" x2="200" y2="300" stroke={c.mid} strokeDasharray="3 3" />
      <line data-fade="br-guide" x1="20" y1="150" x2="400" y2="150" stroke={c.mid} strokeDasharray="3 3" />
      {[134, 106, 80].map((r) => (
        <circle key={r} data-draw="br-ring" cx="200" cy="150" r={r} stroke={c.soft} strokeWidth="1" transform="rotate(90 200 150)" {...draw} />
      ))}
      <rect x="0" y="0" width="400" height="20" fill={c.fill} data-fade="br-band" />
      <rect x="0" y="0" width="20" height="300" fill={c.fill} data-fade="br-band" />
      <rect x="0" y="0" width="20" height="20" fill={c.soft} data-fade="br-band" />
      <line data-draw="br-scale" x1="20" y1="20" x2="400" y2="20" stroke={c.ink} strokeWidth="1" {...draw} />
      <line data-draw="br-scale" x1="20" y1="20" x2="20" y2="300" stroke={c.ink} strokeWidth="1" {...draw} />
      {ticksTop}
      {ticksLeft}

      {/* The mark: a ring, a disc, and a crescent cut from it, with a coral dot. */}
      <circle data-draw="br-mark" cx="200" cy="150" r="52" stroke={c.strong} strokeWidth="1.5" transform="rotate(-90 200 150)" {...draw} />
      <circle data-pop="br-disc" cx="200" cy="150" r="36" fill={c.strong} />
      <circle data-cut cx="214" cy="136" r="0" fill={c.ground} />
      <circle data-pop="br-dot" cx="214" cy="136" r="5" fill={c.pop} />

      {/* A dimension line over the mark. */}
      <g data-rise="br-dim">
        <line x1="148" y1="84" x2="252" y2="84" stroke={c.ink} strokeWidth="0.9" />
        <line x1="148" y1="80" x2="148" y2="88" stroke={c.ink} strokeWidth="0.9" />
        <line x1="252" y1="80" x2="252" y2="88" stroke={c.ink} strokeWidth="0.9" />
        <rect x="186" y="77" width="28" height="14" rx="7" fill={c.ink} />
        <text x="200" y="87" textAnchor="middle" fontSize="7.5" fill="#FFFFFF" style={MONO}>
          104
        </text>
      </g>

      {/* The palette, in the corner: the mark's violet and coral, and a green. */}
      {[c.strong, c.pop, GREEN].map((fill, k) => (
        <circle key={fill} data-pop="br-swatch" cx={330 + k * 20} cy="262" r="7" fill={fill} stroke="#FFFFFF" strokeWidth="2" />
      ))}
    </>
  )
}

// ---------- Motion: a path, keyframes, a timeline ----------

const MOTION = (() => {
  type Pt = [number, number]
  const K: Pt[] = [
    [56, 150],
    [205, 104],
    [350, 76],
  ]
  const H: [Pt, Pt] = [
    [168, 52],
    [242, 156],
  ]
  const cubic = (a: Pt, b: Pt, c: Pt, d: Pt, t: number): Pt => {
    const m = 1 - t
    return [0, 1].map((i) => m ** 3 * a[i] + 3 * m * m * t * b[i] + 3 * m * t * t * c[i] + t ** 3 * d[i]) as Pt
  }
  const pts: Pt[] = []
  for (let k = 0; k <= 40; k++) pts.push(cubic(K[0], [100, 70], H[0], K[1], k / 40))
  for (let k = 1; k <= 40; k++) pts.push(cubic(K[1], H[1], [300, 150], K[2], k / 40))
  const cum = [0]
  for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]))
  const total = cum[cum.length - 1]
  const along = (s: number): Pt => {
    const d = Math.min(Math.max(s, 0), 1) * total
    let k = 1
    while (k < cum.length - 1 && cum[k] < d) k++
    const u = (d - cum[k - 1]) / (cum[k] - cum[k - 1] || 1)
    return [pts[k - 1][0] + (pts[k][0] - pts[k - 1][0]) * u, pts[k - 1][1] + (pts[k][1] - pts[k - 1][1]) * u]
  }
  const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) ** 2) // power2.inOut
  const radius = (t: number) => 13 + 5 * Math.sin(Math.PI * t)
  // When the eased circle reaches the middle keyframe.
  const fK1 = cum[40] / total
  let lo = 0
  let hi = 1
  for (let k = 0; k < 30; k++) {
    const m = (lo + hi) / 2
    if (ease(m) < fK1) lo = m
    else hi = m
  }
  const X0 = 112
  const X1 = 352
  const tx = (t: number) => X0 + t * (X1 - X0)
  const ghosts = [1, 2, 3, 4, 5].map((k) => {
    const t = k / 6
    return { t, p: along(ease(t)), r: radius(t) }
  })
  const path = `M${pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join('L')}`
  return { K, H, path, along, ease, radius, tK1: lo, tx, ghosts }
})()

const ROWS: { label: string; keys: number[] }[] = [
  { label: 'Position', keys: [0, MOTION.tK1, 1] },
  { label: 'Scale', keys: [0, 0.5, 1] },
  { label: 'Opacity', keys: [0, 0.15] },
]
const diamond = (x: number, y: number, s = 4.5) => `M${x} ${y - s}L${x + s} ${y}L${x} ${y + s}L${x - s} ${y}Z`

function MotionArt() {
  const c = MOTION_TONE
  const { K, H, path, tx, ghosts } = MOTION
  return (
    <>
      <Ground c={c.ground} />
      <path data-draw="mo-path" d={path} stroke={c.mid} strokeWidth="1.5" strokeDasharray="0" {...draw} />
      {ghosts.map((g) => (
        <circle key={g.t} data-ghost={g.t} cx={g.p[0]} cy={g.p[1]} r={g.r} fill={c.pop} fillOpacity="0.35" stroke={c.mid} strokeWidth="1" />
      ))}
      <line data-draw="mo-handle" x1={H[0][0]} y1={H[0][1]} x2={H[1][0]} y2={H[1][1]} stroke={c.ink} strokeWidth="0.9" {...draw} />
      {H.map(([x, y]) => (
        <rect key={x} data-pop="mo-knob" x={x - 3} y={y - 3} width="6" height="6" fill={c.paper} stroke={c.ink} strokeWidth="1" />
      ))}
      {K.map(([x, y]) => (
        <path key={x} data-pop="mo-key" d={diamond(x, y)} fill={c.paper} stroke={c.strong} strokeWidth="1.4" />
      ))}
      <circle data-mover cx={K[0][0]} cy={K[0][1]} r="13" fill={c.strong} />

      {/* Timeline */}
      <g data-rise="mo-panel">
        <rect x="24" y="196" width="400" height="130" rx="12" fill={c.paper} />
        <line x1="104" y1="196" x2="104" y2="300" stroke={c.soft} />
        {Array.from({ length: 13 }, (_, k) => tx(k / 10)).map((x, k) => (
          <line key={x} x1={x} y1="206" x2={x} y2={k % 5 === 0 ? 216 : 212} stroke={c.mid} />
        ))}
        {['0s', '1s', '2s'].map((s, k) => (
          <text key={s} x={tx(k / 2) + 3} y="214" fontSize="7" fill={c.label} style={MONO}>
            {s}
          </text>
        ))}
        {ROWS.map((row, k) => (
          <g key={row.label}>
            <text x="38" y={240 + k * 22} fontSize="10" fill={c.ink} style={HERO}>
              {row.label}
            </text>
            <line x1={tx(0)} y1={236 + k * 22} x2="424" y2={236 + k * 22} stroke={c.soft} />
          </g>
        ))}
      </g>
      {ROWS.flatMap((row, k) =>
        row.keys.map((t) => <path key={`${row.label}${t}`} data-pop="mo-tkey" d={diamond(tx(t), 236 + k * 22, 4)} fill={c.strong} />),
      )}
      <g data-head>
        <line data-stem x1={tx(0)} y1="222" x2={tx(0)} y2="300" stroke={c.ink} strokeWidth="1.2" />
        <rect data-cap x={tx(0) - 17} y="200" width="34" height="14" rx="7" fill={c.ink} />
        <text data-time x={tx(0)} y="210" textAnchor="middle" fontSize="7.5" fill="#FFFFFF" style={MONO}>
          0.00s
        </text>
      </g>
    </>
  )
}

export const DISCIPLINES: { id: string; name: string; Art: () => ReactNode }[] = [
  { id: 'ux', name: 'UX / Interface', Art: UxArt },
  { id: 'brand', name: 'Branding / Identity', Art: BrandArt },
  { id: 'motion', name: 'Motion / Keyframes', Art: MotionArt },
]

/** The cards' drawing, as a paused timeline over everything inside root (about 2s long). It hides
 *  every part first, so build it before the cards show. */
export function disciplinesTimeline(root: HTMLElement) {
  const q = gsap.utils.selector(root)
  const all = (key: string, attr = 'draw') => q(`[data-${attr}="${key}"]`)
  const draws = q('[data-draw]')
  const pops = q('[data-pop]')
  const rises = q('[data-rise]')
  const fades = q('[data-fade]')
  const bars = q('[data-bar]')
  const ghosts = q('[data-ghost]')
  const count = q('[data-count]')[0]
  const cut = q('[data-cut]')[0]
  const mover = q('[data-mover]')[0]
  const stem = q('[data-stem]')[0]
  const cap = q('[data-cap]')[0]
  const time = q('[data-time]')[0]

  const motionAt = (t: number) => {
    const [x, y] = MOTION.along(MOTION.ease(t))
    mover?.setAttribute('cx', x.toFixed(2))
    mover?.setAttribute('cy', y.toFixed(2))
    mover?.setAttribute('r', MOTION.radius(t).toFixed(2))
    const hx = MOTION.tx(t)
    stem?.setAttribute('x1', String(hx))
    stem?.setAttribute('x2', String(hx))
    cap?.setAttribute('x', String(hx - 17))
    time?.setAttribute('x', String(hx))
    if (time) time.textContent = `${(t * 2).toFixed(2)}s`
    ghosts.forEach((g) => gsap.set(g, { autoAlpha: t >= Number(g.getAttribute('data-ghost')) ? 1 : 0 }))
  }

  gsap.set(draws, { strokeDasharray: 1, strokeDashoffset: 1, autoAlpha: 0 })
  gsap.set(pops, { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' })
  gsap.set(rises, { autoAlpha: 0, y: 8 })
  const head = q('[data-head]')[0]
  gsap.set([...fades, ...ghosts, mover, head], { autoAlpha: 0 })
  gsap.set(bars, { scaleY: 0, transformOrigin: '50% 100%' })
  if (count) count.textContent = '$0.0k'
  motionAt(0)

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
  const line = (key: string, at: number, duration: number, stagger = 0.05) =>
    tl.to(all(key), { strokeDashoffset: 0, autoAlpha: 1, duration, stagger }, at)
  const pop = (key: string, at: number, stagger = 0.05) =>
    tl.to(all(key, 'pop'), { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'expo.out', stagger }, at)
  const rise = (key: string, at: number, stagger = 0.06) =>
    tl.to(all(key, 'rise'), { autoAlpha: 1, y: 0, duration: 0.5, ease: 'expo.out', stagger }, at)
  const fade = (key: string, at: number, stagger = 0.05) =>
    tl.to(all(key, 'fade'), { autoAlpha: 1, duration: 0.4, ease: 'power1.out', stagger }, at)

  // UX: the window, then the sidebar and cards, then the charts move. 0 – 2.5s
  line('ux-window', 0, 0.75, 0.15)
  fade('ux-bar', 0.35)
  pop('ux-dots', 0.45, 0.06)
  line('ux-side', 0.6, 0.5)
  rise('ux-label', 0.7, 0.05)
  rise('ux-card', 1.0, 0.1)
  tl.to(bars, { scaleY: 1, duration: 0.8, stagger: 0.06 }, 1.4)
  line('ux-chart', 1.45, 0.9)
  const n = { v: 0 }
  tl.to(n, { v: 48.2, duration: 1, ease: 'power2.out', onUpdate: () => { if (count) count.textContent = `$${n.v.toFixed(1)}k` } }, 1.4)

  // Branding: rulers, then guides and rings, then the mark. 0 – 2.6s
  fade('br-band', 0.1)
  line('br-scale', 0.2, 0.3, 0.008)
  rise('br-num', 0.5, 0.03)
  fade('br-guide', 0.8, 0.1)
  line('br-ring', 0.9, 0.7, 0.1)
  line('br-mark', 1.4, 0.55)
  pop('br-disc', 1.75)
  tl.to(cut ?? {}, { attr: { r: 22 }, duration: 0.5, ease: 'power3.inOut' }, 1.95)
  pop('br-dot', 2.3)
  pop('br-swatch', 2.35, 0.08)
  rise('br-dim', 2.1)

  // Motion: path, keyframes and handles, then the circle travels while the playhead runs. 0 – 2.8s
  rise('mo-panel', 0.15)
  tl.to(head ?? {}, { autoAlpha: 1, duration: 0.4, ease: 'power1.out' }, 0.45)
  line('mo-path', 0.35, 0.7)
  pop('mo-key', 0.85, 0.08)
  pop('mo-tkey', 0.9, 0.04)
  line('mo-handle', 1.05, 0.3)
  pop('mo-knob', 1.2)
  tl.to(mover ?? {}, { autoAlpha: 1, duration: 0.25 }, 1.2)
  const run = { t: 0 }
  tl.to(run, { t: 1, duration: 1.3, ease: 'none', onUpdate: () => motionAt(run.t) }, 1.5)

  tl.timeScale(1.4)
  return tl
}
