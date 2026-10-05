// AI trading platform UI, rebuilt as vector React from the Figma frames ("Desktop" section
// 2804:259012: Trading Terminal OHLC, Alerts / Create Alert, Notifications, Chatbot and
// Quantlab Overnight Discoveries) and refined to one spec: dark navy panels, 14-16px card
// radius, 8px controls, Geist type. The product's logo and wordmark are left out. Fixed sizes
// are explicit so the scenes can aim the cursor and noodle. One consistent data set: BTC/USDT
// trades at 116,280.6 everywhere (chart, ticker, watchlist, alert, notification).
import { APP_FONT, C, MONO, clamp, fmt, lerp } from './lib.js'

const Ic = ({ s = 18, c = 'currentColor', w = 1.8, children, d }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', display: 'block' }}>
    {d ? <path d={d} /> : children}
  </svg>
)
export const IC = {
  grid: (c, s) => <Ic c={c} s={s}><rect x="3.5" y="3.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.6" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.6" /></Ic>,
  chat: (c, s) => <Ic c={c} s={s}><path d="M20 11.5a8 8 0 01-11.6 7.1L4 20l1.4-4A8 8 0 1120 11.5z" /><path d="M16.5 3.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" /></Ic>,
  book: (c, s) => <Ic c={c} s={s}><rect x="5" y="3.5" width="14" height="17" rx="2" /><path d="M9 8h6M9 11.5h6M5 16.5h14" /></Ic>,
  lab: (c, s) => <Ic c={c} s={s}><path d="M9.5 18.5h5M10 21h4M12 3.5a6 6 0 00-3.5 10.9V16h7v-1.6A6 6 0 0012 3.5z" /><path d="M18.5 2.5l.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5z" /></Ic>,
  alarm: (c, s) => <Ic c={c} s={s}><circle cx="12" cy="13" r="7" /><path d="M12 10v6M9 13h6M4 5l3-2M20 5l-3-2" /></Ic>,
  bell: (c = C.t2, s = 18) => <Ic c={c} s={s} d="M6 16.5V11a6 6 0 0112 0v5.5l1.5 1.5h-15zM10 20.5h4" />,
  sun: (c, s) => <Ic c={c} s={s}><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></Ic>,
  chev: (c = C.sub, s = 16) => <Ic c={c} s={s} d="M7 10l5 5 5-5" />,
  chevR: (c = C.sub, s = 16) => <Ic c={c} s={s} w={2.2} d="M9.5 6l6 6-6 6" />,
  close: (c = C.t2, s = 18) => <Ic c={c} s={s} w={2} d="M6 6l12 12M18 6L6 18" />,
  sliders: (c = C.sub, s = 18) => <Ic c={c} s={s}><path d="M4 8h10M18 8h2M4 16h3M11 16h9" /><circle cx="16" cy="8" r="2" /><circle cx="9" cy="16" r="2" /></Ic>,
  plus: (c = C.t2, s = 16) => <Ic c={c} s={s} w={2.2} d="M12 5v14M5 12h14" />,
  chart: (c, s) => <Ic c={c} s={s} d="M4 19.5h16M6 15l4-4 3 3 5-6" />,
  send: (c, s) => <svg width={s} height={s} viewBox="0 0 24 24" style={{ display: 'block', flex: 'none' }}><path d="M3.5 4.5l17 7.5-17 7.5 2.5-7.5z" fill={c} /></svg>,
  check: (c, s) => <Ic c={c} s={s} w={2.6} d="M5 12.5l4.5 4.5L19 7.5" />,
  fork: (c, s) => <Ic c={c} s={s}><circle cx="7" cy="5.5" r="2" /><circle cx="17" cy="5.5" r="2" /><circle cx="12" cy="18.5" r="2" /><path d="M7 7.5v1.5a3 3 0 003 3h4a3 3 0 003-3V7.5M12 12v4.5" /></Ic>,
  bulb: (c, s) => <Ic c={c} s={s}><path d="M9.5 18.5h5M10 21h4M12 3.5a6 6 0 00-3.5 10.9V16h7v-1.6A6 6 0 0012 3.5z" /></Ic>,
  draw: (c, s) => <Ic c={c} s={s} d="M5 19L19 5" />,
  curve: (c, s) => <Ic c={c} s={s} d="M5 19c4 0 4-14 9-14" />,
  text: (c, s) => <Ic c={c} s={s} d="M6 5h12M12 5v14" />,
  cross: (c, s) => <Ic c={c} s={s} d="M12 3v7M12 14v7M3 12h7M14 12h7" />,
  zoom: (c, s) => <Ic c={c} s={s}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5M11 8.5v5M8.5 11h5" /></Ic>,
  lock: (c, s) => <Ic c={c} s={s}><rect x="5.5" y="10.5" width="13" height="10" rx="2" /><path d="M8.5 10.5V8a3.5 3.5 0 017 0v2.5" /></Ic>,
  gear: (c, s) => <Ic c={c} s={s}><circle cx="12" cy="12" r="3" /><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" /></Ic>,
}

// Coin marks: plain lettered discs in the coin's colour (no brand artwork).
const COIN = { BTC: [C.btc, '₿'], ETH: ['#627EEA', 'Ξ'], SOL: ['#9945FF', 'S'], AVAX: ['#E84142', 'A'] }
export const Coin = ({ sym, s = 28 }) => {
  const [bg, g] = COIN[sym]
  return <div style={{ width: s, height: s, borderRadius: s / 2, flex: 'none', background: bg, color: '#fff', display: 'grid', placeItems: 'center', fontSize: s * 0.56, fontWeight: 600, fontFamily: APP_FONT, lineHeight: 1 }}>{g}</div>
}
export const Chip = ({ children, fg = C.t2, bg = C.panel2, h = 26, style }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: h, padding: '0 10px', borderRadius: 7, background: bg, color: fg, fontSize: h > 24 ? 13 : 12, fontWeight: 500, whiteSpace: 'nowrap', boxSizing: 'border-box', ...style }}>{children}</span>
)
const lift = '0 1px 0 rgba(255,255,255,.06) inset, 0 34px 70px -30px rgba(8,10,60,.75)'
const card = (extra) => ({ background: `linear-gradient(180deg, #0E1452 0%, ${C.panel} 60%)`, border: `1px solid ${C.line}`, borderRadius: 16, boxSizing: 'border-box', fontFamily: APP_FONT, color: C.ink, boxShadow: lift, ...extra })
const num = { fontVariantNumeric: 'tabular-nums' }

// =====================================================================================
// Market regime (one data set: Sideways 40 · Breakout 35 · Volatile 13 · Reversal 12 = 100)
// =====================================================================================
export const REGIMES = [
  ['Sideways', 40, C.primary],
  ['Breakout', 35, C.red],
  ['Volatile', 13, C.amber],
  ['Reversal', 12, C.violet],
]
const polar = (cx, cy, r, a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)]
const arc = (cx, cy, r, a0, a1) => {
  const [x0, y0] = polar(cx, cy, r, a0)
  const [x1, y1] = polar(cx, cy, r, a1)
  return `M${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`
}
// Gauge arc: 240° open at the bottom. seg[i] (0..1) draws segment i.
function GaugeArc({ size = 300, seg = [1, 1, 1, 1], sw = 18 }) {
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - sw
  const A0 = 150
  const SW = 240
  const gap = 4
  let acc = 0
  return (
    <svg width={size} height={size * 0.8} viewBox={`0 0 ${size} ${size * 0.8}`} style={{ display: 'block', overflow: 'visible' }}>
      <path d={arc(cx, cy, r, A0, A0 + SW)} fill="none" stroke="rgba(132,150,255,.12)" strokeWidth={sw} strokeLinecap="round" />
      {REGIMES.map(([n, v, c], i) => {
        const a0 = A0 + (acc / 100) * SW + gap / 2
        acc += v
        const a1 = A0 + (acc / 100) * SW - gap / 2
        const p = clamp(seg[i])
        if (p <= 0.001) return null
        return <path key={n} d={arc(cx, cy, r, a0, a0 + (a1 - a0) * p)} fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${c}66)` }} />
      })}
    </svg>
  )
}
// One regime as a legend chip (188 × 40); used scattered in the opening and docked in the gauge.
export const RCHIP = { w: 188, h: 40 }
export function RegimeChip({ i, p = 1, float = 0 }) {
  const [n, v, c] = REGIMES[i]
  return (
    <div style={{ width: RCHIP.w, height: RCHIP.h, borderRadius: 10, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', background: C.panel2, border: `1px solid ${C.line}`, fontFamily: APP_FONT, color: C.ink, boxShadow: float ? `0 ${18 * float}px ${36 * float}px -16px rgba(8,10,60,.6)` : 'none' }}>
      <span style={{ width: 10, height: 10, borderRadius: 5, background: c, boxShadow: `0 0 10px ${c}` }} />
      <span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{n}</span>
      <span style={{ fontSize: 15, fontWeight: 600, color: C.t2, ...num }}>{Math.round(v * p)}%</span>
    </div>
  )
}
// Regime gauge card (440 × 368). Legend slots LEG[i] are where the chips dock.
export const GAUGE = { w: 440, h: 368 }
export const LEG = [{ x: 24, y: 256 }, { x: 228, y: 256 }, { x: 24, y: 306 }, { x: 228, y: 306 }]
export function RegimeGauge({ seg = [1, 1, 1, 1], k = 1, pr = 0 }) {
  return (
    <div style={card({ position: 'relative', width: GAUGE.w, height: GAUGE.h, padding: '20px 24px', transform: `scale(${1 - 0.02 * pr})` })}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 17, fontWeight: 600 }}>Market regime</div>
        <Chip h={28}><Coin sym="BTC" s={16} />BTC/USDT · 4H</Chip>
      </div>
      <div style={{ position: 'absolute', left: (GAUGE.w - 260) / 2, top: 66 }}>
        <GaugeArc size={260} seg={seg} sw={16} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 78, textAlign: 'center' }}>
          <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-0.03em', ...num }}>{Math.round(40 * k)}%</div>
          <div style={{ fontSize: 16, color: C.t2, marginTop: 2 }}>Sideways</div>
          <div style={{ fontSize: 11, color: C.faint, letterSpacing: '0.14em', marginTop: 4 }}>REGIME</div>
        </div>
      </div>
      {LEG.map((l, i) => (
        <div key={i} style={{ position: 'absolute', left: l.x, top: l.y, width: RCHIP.w, height: RCHIP.h, borderRadius: 10, border: `1px dashed ${C.line}` }} />
      ))}
    </div>
  )
}

// =====================================================================================
// Trading terminal (1440 × 664 native, scaled into the drawn frame)
// =====================================================================================
const rnd = (i) => {
  const t = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return t - Math.floor(t)
}
// 64 candles: a sideways dip, then the breakout run up to the last close of 116,280.56.
export const LAST = 116280.56
const CANDLES = (() => {
  const n = 64
  const out = []
  let prev = 106200
  for (let i = 0; i < n; i++) {
    const base = i < 30 ? 106400 - 2100 * Math.sin((i / 30) * Math.PI) : 104600 + Math.pow((i - 30) / 33, 1.1) * 11400
    let c = base + (rnd(i) - 0.5) * 1400
    if (i === n - 1) c = LAST
    const o = prev
    const h = Math.max(o, c) + rnd(i + 99) * 700
    const l = Math.min(o, c) - rnd(i + 199) * 700
    out.push([o, h, l, c])
    prev = c
  }
  return out
})()
const PMIN = 101250
const PMAX = 118750
export function Chart({ w, h, k = 1 }) {
  const y = (v) => h - ((v - PMIN) / (PMAX - PMIN)) * h
  const cw = w / CANDLES.length
  const shown = k * CANDLES.length
  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <line key={i} x1="0" x2={w} y1={(h / 7) * (i + 0.5)} y2={(h / 7) * (i + 0.5)} stroke="rgba(132,150,255,.08)" />)}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => <line key={i} y1="0" y2={h} x1={(w / 10) * (i + 0.5)} x2={(w / 10) * (i + 0.5)} stroke="rgba(132,150,255,.06)" />)}
      {CANDLES.map(([o, hi, lo, c], i) => {
        const v = clamp(shown - i)
        if (v <= 0) return null
        const up = c >= o
        const col = up ? C.green : C.red
        const x = i * cw + cw / 2
        const top = y(Math.max(o, c))
        const bh = Math.max(2, Math.abs(y(o) - y(c)))
        return (
          <g key={i} opacity={v}>
            <line x1={x} x2={x} y1={y(hi)} y2={y(lo)} stroke={col} strokeWidth="1.4" />
            <rect x={x - cw * 0.32} y={top} width={cw * 0.64} height={bh} rx="1" fill={col} />
          </g>
        )
      })}
      {k > 0.98 && <line x1="0" x2={w} y1={y(LAST)} y2={y(LAST)} stroke={C.primary} strokeDasharray="4 5" opacity=".7" />}
    </svg>
  )
}
const priceY = (v, h) => h - ((v - PMIN) / (PMAX - PMIN)) * h

export const TICKER = { w: 300, h: 222 }
export function TickerCard({ w = TICKER.w, k = 1, plain = false }) {
  const rows = [['Mark price', '116,274.20'], ['Index price', '116,268.90'], ['Open interest', '84,215.6 BTC'], ['24h volume (USDT)', '6,167,144,953.95']]
  return (
    <div style={card({ width: w, height: TICKER.h, padding: '16px 18px', boxShadow: plain ? 'none' : lift })}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Coin sym="BTC" s={32} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 600 }}>BTC</div>
          <div style={{ fontSize: 11.5, color: C.sub }}>Bitcoin / Tether</div>
        </div>
        <Chip fg={C.green} bg={C.gSoft} h={26}>+2.18%</Chip>
      </div>
      <div style={{ height: 1, background: C.line, margin: '12px 0 8px' }} />
      {rows.map(([l, v]) => (
        <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, height: 22, alignItems: 'center' }}>
          <span style={{ color: C.sub, textTransform: 'uppercase', fontSize: 10.5, letterSpacing: '.04em' }}>{l}</span>
          <span style={{ ...num, opacity: k }}>{v}</span>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, height: 22, alignItems: 'center' }}>
        <span style={{ color: C.sub, textTransform: 'uppercase', fontSize: 10.5, letterSpacing: '.04em' }}>Funding (8h)</span>
        <span style={{ color: C.red, ...num }}>−0.00064% <span style={{ color: C.faint }}>· 00:54:02</span></span>
      </div>
    </div>
  )
}
const WATCH = [['BTC', '116,280.6', '+2.18%', true], ['ETH', '4,486.20', '+1.42%', true], ['SOL', '212.84', '−0.86%', false], ['AVAX', '31.07', '−3.12%', false]]
function Spark({ up, w = 54, h = 18, seed = 1 }) {
  const pts = Array.from({ length: 12 }, (_, i) => [i * (w / 11), h - (up ? i / 11 : 1 - i / 11) * h * 0.7 - rnd(i + seed * 13) * h * 0.3])
  return <svg width={w} height={h} style={{ display: 'block' }}><polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={up ? C.green : C.red} strokeWidth="1.6" /></svg>
}
function Watchlist({ w }) {
  return (
    <div style={card({ width: w, height: 196, padding: '14px 18px', boxShadow: 'none' })}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 600 }}>Watchlist</span>{IC.plus(C.t2, 16)}
      </div>
      {WATCH.map(([s, p, ch, up], i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36, fontSize: 13 }}>
          <Coin sym={s} s={20} />
          <span style={{ width: 48, fontWeight: 500 }}>{s}</span>
          <span style={{ flex: 1, ...num }}>{p}</span>
          <Spark up={up} seed={i + 1} />
          <span style={{ width: 58, textAlign: 'right', color: up ? C.green : C.red, fontFamily: MONO, fontSize: 12 }}>{ch}</span>
        </div>
      ))}
    </div>
  )
}
function MiniRegime({ w, k = 1 }) {
  return (
    <div style={card({ width: w, height: 166, padding: '12px 18px', boxShadow: 'none', position: 'relative' })}>
      <div style={{ position: 'absolute', left: (w - 170) / 2, top: 6 }}>
        <GaugeArc size={170} seg={[k, k, k, k]} sw={11} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 50, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 600, ...num }}>{Math.round(40 * k)}%</div>
          <div style={{ fontSize: 12, color: C.t2 }}>Sideways</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 14, display: 'flex', justifyContent: 'center', gap: 12, fontSize: 11.5, color: C.t2 }}>
        {REGIMES.slice(1).map(([n, v, c]) => <span key={n} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 7, height: 7, borderRadius: 4, background: c }} />{n} {v}%</span>)}
      </div>
    </div>
  )
}
export const TERM = { w: 1440, h: 664 }
export function Terminal({ k = 1 }) {
  const CH = { x: 140, y: 196, w: 820, h: 400 }
  const tag = priceY(LAST, CH.h)
  return (
    <div style={{ position: 'relative', width: TERM.w, height: TERM.h, background: `radial-gradient(60% 50% at 45% 0%, #172080 0%, transparent 70%), ${C.app}`, fontFamily: APP_FONT, color: C.ink, overflow: 'hidden' }}>
      {/* top bar */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 56, borderBottom: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px 0 84px' }}>
        <span style={{ fontSize: 14, color: C.sub }}>Trading terminal</span>
        <span style={{ flex: 1 }} />
        {IC.bell(C.t2, 20)}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 34, padding: '0 14px', borderRadius: 8, border: `1px solid ${C.line}`, fontSize: 13.5 }}>{IC.alarm(C.ink, 16)}Add Alert</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 34, padding: '0 14px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.panel2, fontSize: 13.5 }}>{IC.sun(C.amber, 16)}Morning Brief</span>
      </div>
      {/* left rail */}
      <div style={{ position: 'absolute', left: 0, top: 56, bottom: 0, width: 64, borderRight: `1px solid ${C.line}` }}>
        {[IC.grid, IC.chat, IC.book, IC.lab, IC.alarm].map((f, i) => (
          <div key={i} style={{ position: 'absolute', left: 12, top: 16 + i * 52, width: 40, height: 40, borderRadius: 10, display: 'grid', placeItems: 'center', background: i === 0 ? C.pSoft : 'transparent', border: i === 0 ? `1px solid ${C.line}` : 'none' }}>{f(i === 0 ? C.link : C.sub, 20)}</div>
        ))}
      </div>
      {/* pair header */}
      <div style={{ position: 'absolute', left: 84, top: 70, width: 972, height: 48, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Coin sym="BTC" s={34} />
        <span style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>BTCUSDT</span>{IC.chev(C.sub, 16)}
        <div style={{ marginLeft: 28 }}>
          <div style={{ fontSize: 24, fontWeight: 600, ...num }}>{fmt(lerp(113797, 116280.6, k), 1)}</div>
          <div style={{ fontSize: 13, color: C.green, ...num }}>+2,483.6 &nbsp;+2.18%</div>
        </div>
        <span style={{ flex: 1 }} />
        {[['24h High', '116,912.0'], ['24h Low', '113,402.5'], ['24h Vol', '61,344.8']].map(([l, v]) => (
          <div key={l} style={{ textAlign: 'right', marginLeft: 26 }}><div style={{ fontSize: 12, color: C.sub }}>{l}</div><div style={{ fontSize: 15, fontWeight: 500, marginTop: 3, ...num }}>{v}</div></div>
        ))}
      </div>
      {/* toolbar */}
      <div style={{ position: 'absolute', left: 140, top: 132, width: 916, height: 44, borderRadius: 10, border: `1px solid ${C.line}`, background: C.panel, display: 'flex', alignItems: 'center', gap: 16, padding: '0 14px', boxSizing: 'border-box', fontSize: 14 }}>
        {['TL', '15m', '30m', '1H', '4H', '1D', '1W'].map((t) => <span key={t} style={{ padding: '3px 6px', borderRadius: 5, background: t === '15m' ? C.primary : 'transparent', color: t === '15m' ? '#fff' : C.t2 }}>{t}</span>)}
        <span style={{ flex: 1 }} />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 12px', borderRadius: 7, border: `1px solid ${C.line}`, fontSize: 13 }}>{IC.chart(C.t2, 15)}Indicators</span>
        <span style={{ display: 'inline-flex', height: 30, borderRadius: 7, border: `1px solid ${C.line}`, overflow: 'hidden', fontSize: 13 }}>
          <span style={{ padding: '0 18px', display: 'grid', placeItems: 'center', background: C.primary }}>OHLC</span>
          <span style={{ padding: '0 18px', display: 'grid', placeItems: 'center', color: C.t2 }}>Footprint</span>
        </span>
        {IC.gear(C.t2, 18)}
      </div>
      {/* tool column */}
      <div style={{ position: 'absolute', left: 84, top: 132, width: 44, height: 516, borderRadius: 10, border: `1px solid ${C.line}`, background: C.panel, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, paddingTop: 14, boxSizing: 'border-box' }}>
        {[IC.cross, IC.draw, IC.curve, IC.text, IC.zoom, IC.lock].map((f, i) => <span key={i}>{f(C.t2, 18)}</span>)}
      </div>
      {/* chart */}
      <div style={{ position: 'absolute', left: CH.x, top: CH.y, width: CH.w, height: CH.h }}>
        <Chart w={CH.w} h={CH.h} k={k} />
        <div style={{ position: 'absolute', left: 8, top: 4, fontFamily: MONO, fontSize: 11, color: C.t2, padding: '3px 8px', borderRadius: 5, background: 'rgba(14,21,80,.8)' }}>O 116,012.4 · H 116,512.0 · L 115,940.2 · C 116,280.6 · Vol 55.4M</div>
        <div style={{ position: 'absolute', right: 10, top: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, opacity: clamp((k - 0.6) / 0.4) }}>
          <Chip h={28} bg="rgba(14,21,80,.92)" style={{ border: `1px solid ${C.line}` }}>Doji · Shooting Star · Hammer</Chip>
          <Chip h={28} bg="rgba(14,21,80,.92)" style={{ border: `1px solid ${C.line}` }}><span style={{ width: 7, height: 7, borderRadius: 4, background: C.primary }} />Breakout: 35%</Chip>
        </div>
      </div>
      {/* price axis */}
      <div style={{ position: 'absolute', left: 970, top: CH.y, width: 86, height: CH.h, fontSize: 11.5, color: C.faint, ...num }}>
        {[117500, 115000, 112500, 110000, 107500, 105000, 102500].map((v) => <div key={v} style={{ position: 'absolute', top: priceY(v, CH.h) - 7 }}>{fmt(v, 0)}</div>)}
        {k > 0.98 && <div style={{ position: 'absolute', left: -4, top: tag - 12, padding: '4px 6px', borderRadius: 4, background: C.primary, color: '#fff', fontSize: 11 }}>116,280.56</div>}
      </div>
      <div style={{ position: 'absolute', left: CH.x, top: 612, width: CH.w, display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: C.faint }}>
        {['13:00', '15:00', '17:00', '19:00', '21:00', '23:00', '01:00', '03:00', '05:00', '07:00', '09:00', '11:00'].map((t) => <span key={t}>{t}</span>)}
      </div>
      {/* right panel */}
      <div style={{ position: 'absolute', left: 1072, top: 70 }}><TickerCard w={352} k={1} plain /></div>
      <div style={{ position: 'absolute', left: 1072, top: 302 }}><MiniRegime w={352} k={k} /></div>
      <div style={{ position: 'absolute', left: 1072, top: 480 }}>
        <div style={{ height: 172, overflow: 'hidden', borderRadius: 16 }}><Watchlist w={352} /></div>
      </div>
    </div>
  )
}

// ---------- Dashboard component cards ----------
// Pattern detection (330 × 150), from the chart overlays.
export function PatternCard({ p = 1 }) {
  return (
    <div style={card({ width: 330, height: 150, padding: '16px 18px' })}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 15, fontWeight: 600 }}>Patterns detected</span>
        <Chip h={24}>BTCUSDT · 15m</Chip>
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
        {['Doji', 'Shooting Star', 'Hammer'].map((n, i) => <Chip key={n} h={28} bg={C.pSoft} fg={C.ink} style={{ opacity: clamp(p * 3 - i) }}>{n}</Chip>)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: C.sub, marginTop: 14 }}>
        <span>Breakout probability</span><span style={{ color: C.ink, fontWeight: 600, ...num }}>{Math.round(35 * p)}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: 'rgba(132,150,255,.14)', marginTop: 7, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${35 * p}%`, borderRadius: 3, background: `linear-gradient(90deg, ${C.primary}, ${C.cyan})` }} />
      </div>
    </div>
  )
}
// Recent trades (300 × 196).
const TRADES = [['116,280.6', '0.352', '19:15:44', true], ['116,278.1', '0.120', '19:15:43', false], ['116,279.4', '1.064', '19:15:41', true], ['116,276.0', '0.048', '19:15:40', false], ['116,277.5', '0.415', '19:15:38', true]]
export function TradesCard({ p = 1 }) {
  return (
    <div style={card({ width: 300, height: 196, padding: '14px 18px' })}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 15, fontWeight: 600 }}>Trades</span>{IC.sliders(C.sub, 16)}</div>
      <div style={{ display: 'flex', fontSize: 11, color: C.faint, marginTop: 10 }}><span style={{ flex: 1 }}>Price</span><span style={{ width: 70, textAlign: 'right' }}>Size</span><span style={{ width: 80, textAlign: 'right' }}>Time</span></div>
      {TRADES.map(([pr, sz, t, up], i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', height: 25, fontFamily: MONO, fontSize: 12.5, opacity: clamp(p * 5 - i), transform: `translateY(${(1 - clamp(p * 5 - i)) * 8}px)` }}>
          <span style={{ flex: 1, color: up ? C.green : C.red }}>{pr}</span>
          <span style={{ width: 70, textAlign: 'right', color: C.t2 }}>{sz}</span>
          <span style={{ width: 80, textAlign: 'right', color: C.faint }}>{t}</span>
        </div>
      ))}
    </div>
  )
}
// AI analyst prompt (340 × 188), from the chatbot.
export function AnalystCard({ p = 1 }) {
  const q = "Break down this week's ETH movement"
  return (
    <div style={card({ width: 340, height: 188, padding: '16px 18px' })}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 15, background: `conic-gradient(from 0deg, ${C.cyan}, ${C.primary}, ${C.violet}, ${C.cyan})`, display: 'grid', placeItems: 'center' }}><div style={{ width: 22, height: 22, borderRadius: 11, background: C.panel }} /></div>
        <span style={{ fontSize: 15, fontWeight: 600, color: C.link }}>Ask anything. Trade smarter.</span>
      </div>
      <div style={{ marginTop: 12, padding: '9px 12px', borderRadius: 10, border: `1px solid ${C.line}`, background: C.field }}>
        <div style={{ fontSize: 11.5, color: C.link }}>Thesis</div>
        <div style={{ fontSize: 13, marginTop: 2 }}>{q.slice(0, Math.round(q.length * clamp(p)))}</div>
      </div>
      <div style={{ marginTop: 10, height: 40, borderRadius: 20, border: `1.5px solid ${C.primary}`, display: 'flex', alignItems: 'center', gap: 8, padding: '0 6px 0 14px', fontSize: 13, color: C.faint }}>
        <span style={{ flex: 1 }}>Ask anything…</span>
        <span style={{ width: 30, height: 30, borderRadius: 15, background: C.primary, display: 'grid', placeItems: 'center' }}>{IC.send('#fff', 15)}</span>
      </div>
    </div>
  )
}

// =====================================================================================
// Alerts flow: the Create Alert form and the Notifications panel
// =====================================================================================
export const FORM = { w: 520, h: 548 }
// Native geometry the scenes aim at: the condition value field and the Create Alert button.
export const VALUE = { x: 336, y: 178, w: 160, h: 40 }
export const CREATE = { x: 360, y: 488, w: 136, h: 40 }
const Field = ({ children, w, h = 40, active = 0, muted = false }) => (
  <div style={{ width: w, height: h, borderRadius: 8, boxSizing: 'border-box', background: C.field, border: `1px solid ${active ? `rgba(76,125,255,${0.4 + 0.6 * active})` : C.line}`, boxShadow: active ? `0 0 0 ${3 * active}px rgba(76,125,255,.22)` : 'none', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 14, color: muted ? C.faint : C.ink, gap: 8 }}>
    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>{children}</span>{IC.chev(C.t2, 15)}
  </div>
)
export function AlertForm({ typed = 1, focus = 0, pr = 0, done = 0 }) {
  const v = '116,000'
  const shown = v.slice(0, Math.round(v.length * clamp(typed)))
  const rows = [['Tool', <Field key="t" w={320}>Price</Field>], ['Trigger', <Field key="g" w={320}>Once only</Field>], ['Expiration', <Field key="e" w={320}>Jul 27, 2026 · 15:42</Field>], ['Message', <Field key="m" w={320} muted>Custom message…</Field>], ['Notification', <Field key="n" w={320}>Toasts, Email</Field>]]
  return (
    <div style={card({ position: 'relative', width: FORM.w, height: FORM.h })}>
      <div style={{ height: 60, display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px', borderBottom: `1px solid ${C.line}` }}>
        <span style={{ fontSize: 17, fontWeight: 500 }}>Create alert on</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 34, padding: '0 10px', borderRadius: 8, border: `1px solid ${C.line}`, fontSize: 15, fontWeight: 600 }}><Coin sym="BTC" s={20} />BTCUSDT</span>
        <span style={{ flex: 1 }} />{IC.close(C.t2, 18)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 44, padding: '0 24px' }}>
        <span style={{ fontSize: 14, color: C.link, borderBottom: `2px solid ${C.link}`, paddingBottom: 6, marginTop: 8 }}>Alert 1</span>
        <span style={{ width: 26, height: 26, borderRadius: 6, background: C.panel2, display: 'grid', placeItems: 'center' }}>{IC.plus(C.t2, 14)}</span>
      </div>
      <div style={{ position: 'absolute', left: 24, top: 126, right: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 52 }}>
          <span style={{ width: 128, fontSize: 14, color: C.t2 }}>Tool</span>{rows[0][1]}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', height: 52, borderTop: `1px solid ${C.line2}` }}>
          <span style={{ width: 128, fontSize: 14, color: C.t2 }}>Condition</span>
          <Field w={152}>Crossing</Field>
          <span style={{ width: 8 }} />
          <Field w={160} active={focus} muted={!shown}>{shown || 'Price'}{focus > 0.5 && typed < 1 && <span style={{ display: 'inline-block', width: 1.5, height: 16, background: C.ink, marginLeft: 1, verticalAlign: -3 }} />}</Field>
        </div>
        {rows.slice(1).map(([l, f], i) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', height: 52, borderTop: i === 0 ? `1px solid ${C.line2}` : 'none' }}>
            <span style={{ width: 128, fontSize: 14, color: C.t2 }}>{l}</span>{f}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 72, borderTop: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 14 }}>
        <span style={{ color: C.t2 }}>Cancel</span><span style={{ flex: 1 }} />
        <span style={{ width: CREATE.w, height: CREATE.h, borderRadius: 8, display: 'grid', placeItems: 'center', background: done > 0.5 ? C.green : C.primary, color: done > 0.5 ? '#04140E' : '#fff', fontWeight: 500, transform: `scale(${1 - 0.05 * pr})` }}>
          {done > 0.5 ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>{IC.check('#04140E', 15)}Created</span> : 'Create Alert'}
        </span>
      </div>
    </div>
  )
}
export const NOTE = { w: 400, h: 492, row0: 158, rowH: 66 }
const NOTES = [
  ['ETH', 'ETH / USDC above $4,450.00', 'Footprint alert · candle 1h', '18m', true],
  ['SOL', 'SOL / USDT entered Breakout', 'Regime alert · sustained 2h', '1h', true],
  ['AVAX', 'AVAX / USDT RSI below 30', 'Indicator alert · RSI(14) 28.4', '3h', false],
]
function NoteRow({ sym, title, sub, time, unread, glow = 0 }) {
  return (
    <div style={{ height: 58, borderRadius: 10, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 12, padding: '0 12px', background: unread ? `rgba(20,32,110,${0.7 + 0.3 * glow})` : 'transparent', border: `1px solid ${unread ? (glow ? `rgba(76,125,255,${0.3 + 0.6 * glow})` : C.line) : 'transparent'}`, boxShadow: glow ? `0 0 ${24 * glow}px rgba(76,125,255,${0.35 * glow})` : 'none' }}>
      <Coin sym={sym} s={30} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap' }}>{title}</div>
        <div style={{ fontSize: 11.5, color: C.sub, marginTop: 3, whiteSpace: 'nowrap' }}>{sub}</div>
      </div>
      <div style={{ display: 'grid', justifyItems: 'end', gap: 8 }}>
        <span style={{ fontSize: 12, color: C.t2 }}>{time}</span>
        <span style={{ width: 7, height: 7, borderRadius: 4, background: unread ? C.primary : 'transparent' }} />
      </div>
    </div>
  )
}
// `arrive` (0..1) slides the new BTC alert in at the top and pushes the list down.
export function Notifications({ arrive = 0 }) {
  const a = clamp(arrive)
  const unread = a > 0.5 ? 3 : 2
  return (
    <div style={card({ position: 'relative', width: NOTE.w, height: NOTE.h, padding: '20px 20px', overflow: 'hidden' })}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 17, fontWeight: 500 }}>Notifications</span>
        <span style={{ minWidth: 22, height: 22, borderRadius: 6, background: C.primary, display: 'grid', placeItems: 'center', fontSize: 12.5, fontWeight: 600, transform: `scale(${1 + 0.25 * Math.sin(Math.PI * clamp((a - 0.45) / 0.3))})` }}>{unread}</span>
        <span style={{ flex: 1 }} />{IC.sliders(C.sub, 18)}<span style={{ width: 8 }} />{IC.close(C.t2, 18)}
      </div>
      <div style={{ display: 'flex', height: 40, marginTop: 16, borderRadius: 10, border: `1px solid ${C.line}`, padding: 3, boxSizing: 'border-box', fontSize: 13 }}>
        <span style={{ flex: 1, borderRadius: 7, background: '#1A2E8F', display: 'grid', placeItems: 'center' }}>All · {a > 0.5 ? 4 : 3}</span>
        <span style={{ flex: 1, display: 'grid', placeItems: 'center', color: C.t2 }}>Unread · {unread}</span>
      </div>
      <div style={{ fontSize: 11.5, color: C.sub, letterSpacing: '.08em', marginTop: 18 }}>TODAY</div>
      <div style={{ position: 'absolute', left: 20, right: 20, top: NOTE.row0 }}>
        <div style={{ height: NOTE.rowH * E2(a), overflow: 'hidden', opacity: clamp((a - 0.2) / 0.5), transform: `translateX(${(1 - E2(a)) * 40}px)` }}>
          <NoteRow sym="BTC" title="BTC / USDT crossed $116,000" sub="Price alert · now $116,040" time="now" unread glow={a > 0.3 ? 1 - clamp((a - 0.75) / 0.25) * 0.6 : 0} />
        </div>
        {NOTES.map(([s, t, sb, tm, u]) => <div key={s} style={{ height: NOTE.rowH }}><NoteRow sym={s} title={t} sub={sb} time={tm} unread={u} /></div>)}
      </div>
      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 0, height: 56, borderTop: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', fontSize: 13, color: C.t2 }}>
        <span style={{ flex: 1 }}>Mark all as read</span><span style={{ color: C.link }}>Open Alerts →</span>
      </div>
    </div>
  )
}
const E2 = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

// =====================================================================================
// Quant lab: Overnight Discoveries (falsification funnel + surviving strategies)
// =====================================================================================
export const FUNNEL = { w: 1004, h: 236 }
const STAGES = [['Generated', 642], ['Passed fast filter', 128], ['Passed regime test', 31], ['Passed CPCV + PBO + DSR', 3]]
export function FunnelCard({ p = 1, banner = 1 }) {
  const W = 940
  const H = 120
  const hs = [120, 76, 40, 8, 4]
  const xs = [0, 0.25, 0.5, 0.75, 1].map((f) => f * W)
  const mid = H / 2
  let top = `M0 ${mid - hs[0] / 2}`
  for (let i = 0; i < 4; i++) top += ` C${xs[i] + 90} ${mid - hs[i] / 2} ${xs[i + 1] - 90} ${mid - hs[i + 1] / 2} ${xs[i + 1]} ${mid - hs[i + 1] / 2}`
  let bot = ` L${W} ${mid + hs[4] / 2}`
  for (let i = 4; i > 0; i--) bot += ` C${xs[i] - 90} ${mid + hs[i] / 2} ${xs[i - 1] + 90} ${mid + hs[i - 1] / 2} ${xs[i - 1]} ${mid + hs[i - 1] / 2}`
  return (
    <div style={card({ position: 'relative', width: FUNNEL.w, height: FUNNEL.h, padding: '18px 24px' })}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${C.line}`, display: 'grid', placeItems: 'center' }}>{IC.bulb(C.link, 18)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Overnight discoveries</div>
          <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>Falsification funnel · last night</div>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 32, padding: '0 12px', borderRadius: 8, border: `1px solid rgba(76,125,255,.5)`, background: C.pSoft, fontSize: 13, opacity: banner }}>
          {fmt(642)} candidates <span style={{ color: C.sub }}>→</span> <b style={{ color: C.link, fontWeight: 600 }}>3 survived</b>
        </span>
      </div>
      <div style={{ position: 'absolute', left: 32, top: 72, width: W, display: 'flex' }}>
        {STAGES.map(([l, n], i) => (
          <div key={l} style={{ width: W / 4, opacity: clamp(p * 4 - i + 0.4) }}>
            <div style={{ fontSize: 11.5, color: C.sub }}>{l}</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginTop: 2, color: i === 3 ? C.link : C.ink, ...num }}>{Math.round(n * clamp(p * 4 - i + 0.4))}</div>
          </div>
        ))}
      </div>
      <svg width={W} height={H} style={{ position: 'absolute', left: 32, top: 114, overflow: 'visible' }}>
        <defs>
          <linearGradient id="fg" x1="0" x2="1">
            <stop offset="0" stopColor="#2A4FD8" /><stop offset=".55" stopColor="#5C8BFF" /><stop offset=".74" stopColor="#8CB0FF" /><stop offset=".76" stopColor={C.red} /><stop offset="1" stopColor={C.violet} />
          </linearGradient>
          <clipPath id="fc"><rect x="0" y="-10" width={W * clamp(p)} height={H + 20} /></clipPath>
        </defs>
        {[1, 2, 3].map((i) => <line key={i} x1={xs[i]} x2={xs[i]} y1="-46" y2={H} stroke="rgba(132,150,255,.22)" strokeDasharray="3 4" />)}
        <path d={top + bot + ' Z'} fill="url(#fg)" clipPath="url(#fc)" opacity=".95" />
      </svg>
    </div>
  )
}
export const SCARD = { w: 320, h: 300 }
export const SAVE = { x: 178, y: 252, w: 122, h: 32 }
export const STRATS = [
  { name: 'MeanRev-VAL', regime: 'Sideways', rc: C.primary, kind: 'Long spot', win: 58, dd: '−12.6%', pf: '1.74', sh: '2.14', seed: 3 },
  { name: 'ReversalFade-4h', regime: 'Reversal', rc: C.violet, kind: 'Short perp', win: 54, dd: '−9.8%', pf: '1.52', sh: '1.86', seed: 7 },
  { name: 'Absorption-Put', regime: 'Volatile', rc: C.amber, kind: 'Options', win: 61, dd: '−14.2%', pf: '1.91', sh: '2.31', seed: 11 },
]
export function StrategyCard({ i, p = 1, hover = 0, saved = 0, pr = 0 }) {
  const S = STRATS[i]
  const W = 280
  const pts = Array.from({ length: 24 }, (_, j) => [j * (W / 23), 50 - (j / 23) * 30 - Math.sin(j * 0.9 + S.seed) * 6 - rnd(j + S.seed * 31) * 6])
  const line = pts.map((q) => q.join(',')).join(' ')
  return (
    <div style={card({ position: 'relative', width: SCARD.w, height: SCARD.h, padding: '18px 20px', border: `1px solid ${hover ? `rgba(76,125,255,${0.3 + 0.5 * hover})` : C.line}` })}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 17, fontWeight: 600 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: C.green }} />{S.name}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <Chip h={24} bg={`${S.rc}2A`} fg={C.ink}>{S.regime}</Chip><Chip h={24}>{S.kind}</Chip>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}><div style={{ fontSize: 20, fontWeight: 600, ...num }}>{Math.round(S.win * p)}%</div><div style={{ fontSize: 11, color: C.sub }}>Win rate</div></div>
      </div>
      <div style={{ display: 'flex', gap: 18, marginTop: 16 }}>
        {[['Max DD', S.dd], ['Profit factor', S.pf], ['Sharpe', S.sh]].map(([l, v]) => (
          <div key={l}><div style={{ fontSize: 10.5, color: C.sub, textTransform: 'uppercase', letterSpacing: '.04em' }}>{l}</div><div style={{ fontSize: 17, fontWeight: 600, marginTop: 3, ...num }}>{v}</div></div>
        ))}
      </div>
      <div style={{ marginTop: 14, height: 76, borderRadius: 10, border: `1px solid ${C.line2}`, background: 'rgba(5,7,48,.5)', padding: '8px 10px', boxSizing: 'border-box', position: 'relative' }}>
        <div style={{ fontSize: 10.5, color: C.sub }}>Equity curve</div>
        <svg width={W - 20} height="48" viewBox={`0 0 ${W} 60`} preserveAspectRatio="none" style={{ position: 'absolute', left: 10, bottom: 4 }}>
          <defs><clipPath id={`ec${i}`}><rect width={W * clamp(p)} height="60" /></clipPath></defs>
          <g clipPath={`url(#ec${i})`}>
            <polygon points={`0,60 ${line} ${W},60`} fill="rgba(34,211,238,.12)" />
            <polyline points={line} fill="none" stroke={C.cyan} strokeWidth="2" />
          </g>
        </svg>
      </div>
      <div style={{ position: 'absolute', left: 20, right: 20, top: SAVE.y, height: SAVE.h, display: 'flex', justifyContent: 'flex-end', gap: 8, fontSize: 13 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 12px', borderRadius: 7, border: `1px solid ${C.line}`, color: C.t2 }}>{IC.fork(C.t2, 14)}Fork</span>
        <span style={{ width: SAVE.w, display: 'grid', placeItems: 'center', borderRadius: 7, border: `1px solid ${saved > 0.5 ? C.green : 'rgba(76,125,255,.6)'}`, background: saved > 0.5 ? C.gSoft : 'transparent', color: saved > 0.5 ? C.green : C.link, transform: `scale(${1 - 0.06 * pr})` }}>
          {saved > 0.5 ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>{IC.check(C.green, 14)}Saved</span> : 'Save to Library'}
        </span>
      </div>
    </div>
  )
}
