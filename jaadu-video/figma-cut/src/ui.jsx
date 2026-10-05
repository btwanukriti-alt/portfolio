// AI trading platform UI, rebuilt as vector React from the Figma frames ("Desktop" section
// 2804:259012: Trading Terminal OHLC, Alerts / Create Alert, Notifications, Chatbot and
// Quantlab Overnight Discoveries) and refined to one spec: dark navy panels, 14-16px card
// radius, 8px controls, Geist type. The product's logo and wordmark are left out. Fixed sizes
// are explicit so the scenes can aim the cursor and noodle. One consistent data set: BTC/USDT
// trades at 116,280.6 everywhere (chart, ticker, watchlist, alert, notification).
import { APP_FONT, C, clamp, fmt } from './lib.js'

const rnd = (i) => {
  const t = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return t - Math.floor(t)
}

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
  up: (c, s) => <Ic c={c} s={s} w={2.4} d="M12 19V5M6 11l6-6 6 6" />,
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
export function NoteRow({ sym, title, sub, time, unread, glow = 0 }) {
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
export function Notifications({ arrive = 0, docked = 1 }) {
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
        <div style={{ height: NOTE.rowH * E2(a), overflow: 'hidden', opacity: docked }}>
          <NoteRow sym="BTC" title="BTC / USDT crossed $116,000" sub="Price alert · now $116,040" time="now" unread glow={a > 0.3 ? 0.4 + 0.6 * docked : 0} />
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
// Quant lab: Overnight Discoveries (falsification funnel, discoveries per night)
// =====================================================================================
const STAGES = [['Generated', 642], ['Passed fast filter', 128], ['Passed regime test', 31], ['Passed CPCV + PBO + DSR', 3]]
export const FUNNEL = { w: 760, h: 340 }
// The "642 → 3 survived" chip in the header (native, from the card's top-left): the click target.
export const FCHIP = { w: 196, h: 34, y: 22 }
const funnelPath = (W, H, hs) => {
  const xs = [0, 0.25, 0.5, 0.75, 1].map((f) => f * W)
  const mid = H / 2
  const k = W / 10
  let d = `M0 ${mid - hs[0] / 2}`
  for (let i = 0; i < 4; i++) d += ` C${xs[i] + k} ${mid - hs[i] / 2} ${xs[i + 1] - k} ${mid - hs[i + 1] / 2} ${xs[i + 1]} ${mid - hs[i + 1] / 2}`
  d += ` L${W} ${mid + hs[4] / 2}`
  for (let i = 4; i > 0; i--) d += ` C${xs[i] - k} ${mid + hs[i] / 2} ${xs[i - 1] + k} ${mid + hs[i - 1] / 2} ${xs[i - 1]} ${mid + hs[i - 1] / 2}`
  return d + ' Z'
}
export function FunnelCard({ w = FUNNEL.w, p = 1, chip = 1, hi = 0, pr = 0 }) {
  const PAD = 28
  const W = w - PAD * 2
  const H = 150
  const hs = [H, 0.6 * H, 0.32 * H, 0.1 * H, 0.06 * H]
  return (
    <div style={card({ position: 'relative', width: w, height: FUNNEL.h, padding: `22px ${PAD}px` })}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: FCHIP.h }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${C.line}`, display: 'grid', placeItems: 'center' }}>{IC.bulb(C.link, 18)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Falsification funnel</div>
          <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>Last night · three-stage falsification</div>
        </div>
      </div>
      <span style={{ position: 'absolute', right: PAD, top: FCHIP.y, width: FCHIP.w, height: FCHIP.h, boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 8, border: `1px solid rgba(76,125,255,${0.5 + 0.5 * hi})`, background: `rgba(76,125,255,${0.16 + 0.2 * hi})`, fontSize: 13, opacity: chip, transform: `scale(${1 - 0.05 * pr})` }}>
        {fmt(642)} <span style={{ color: C.sub }}>→</span> <b style={{ color: C.link, fontWeight: 600 }}>3 survived</b>{IC.chevR(C.link, 14)}
      </span>
      <div style={{ position: 'absolute', left: PAD, top: 82, width: W, display: 'flex' }}>
        {STAGES.map(([l, n], i) => {
          const v = clamp(p * 4 - i + 0.3)
          return (
            <div key={l} style={{ width: W / 4, paddingLeft: i ? 10 : 0, boxSizing: 'border-box', opacity: v }}>
              <div style={{ fontSize: 11.5, color: C.sub, whiteSpace: 'nowrap' }}>{l}</div>
              <div style={{ fontSize: 20, fontWeight: 600, marginTop: 3, color: i === 3 ? C.link : C.ink, ...num }}>{Math.round(n * v)}</div>
            </div>
          )
        })}
      </div>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', left: PAD, top: 150, display: 'block' }}>
        <defs>
          <linearGradient id="fg" x1="0" x2="1">
            <stop offset="0" stopColor="#2A4FD8" /><stop offset=".5" stopColor="#5C8BFF" /><stop offset=".74" stopColor="#9CB8FF" /><stop offset=".76" stopColor={C.red} /><stop offset="1" stopColor={C.violet} />
          </linearGradient>
          <clipPath id="fc"><rect x="0" y="0" width={W * clamp(p)} height={H} /></clipPath>
        </defs>
        {[1, 2, 3].map((i) => <line key={i} x1={(W / 4) * i} x2={(W / 4) * i} y1="0" y2={H} stroke="rgba(132,150,255,.22)" strokeDasharray="3 4" />)}
        <path d={funnelPath(W, H, hs)} fill="url(#fg)" clipPath="url(#fc)" />
      </svg>
    </div>
  )
}
// Survivors per night over the last 30 nights; last night (3) is the brightest.
const NIGHTS = [1, 0, 2, 1, 1, 0, 2, 1, 0, 1, 2, 1, 1, 0, 1, 2, 0, 1, 1, 2, 1, 0, 1, 1, 2, 1, 0, 2, 1, 3]
export function NightsCard({ w = 440, h = FUNNEL.h, p = 1 }) {
  const PAD = 24
  const W = w - PAD * 2
  const CH = h - 150
  const bw = W / NIGHTS.length
  return (
    <div style={card({ position: 'relative', width: w, height: h, padding: `22px ${PAD}px` })}>
      <div style={{ fontSize: 16, fontWeight: 600, lineHeight: '20px' }}>Discoveries per night</div>
      <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>Last 30 nights</div>
      <svg width={W} height={CH} viewBox={`0 0 ${W} ${CH}`} style={{ position: 'absolute', left: PAD, top: 92, display: 'block' }}>
        {[1, 2, 3].map((v) => <line key={v} x1="0" x2={W} y1={CH - (v / 3) * (CH - 6)} y2={CH - (v / 3) * (CH - 6)} stroke="rgba(132,150,255,.1)" />)}
        {NIGHTS.map((n, i) => {
          const g = clamp(p * NIGHTS.length * 0.9 - i * 0.8 + 1)
          const bh = Math.max(3, (n / 3) * (CH - 6)) * g
          const last = i === NIGHTS.length - 1
          return <rect key={i} x={i * bw + bw * 0.18} y={CH - bh} width={bw * 0.64} height={bh} rx="2" fill={last ? C.primary : '#2238A8'} />
        })}
      </svg>
      <div style={{ position: 'absolute', left: PAD, right: PAD, bottom: 20, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.sub }}>
        <span>Survivors per night · most nights yield 0–2</span><span style={{ color: C.link }}>Last night: 3</span>
      </div>
    </div>
  )
}

// =====================================================================================
// Quant lab: Research (prompt box, then the agent's analysis)
// =====================================================================================
export const PROMPT = { h: 132 }
export const SEND = { s: 40, top: 58 }
export const QUESTION = 'Distribution of funding rate before 5%+ drops on BTC 4h, last year.'
export function PromptBox({ w = 900, typed = 0, focus = 0, pr = 0, sent = 0 }) {
  const text = QUESTION.slice(0, Math.round(QUESTION.length * clamp(typed)))
  const live = typed > 0 && sent < 0.5
  return (
    <div style={{ width: w, height: PROMPT.h, fontFamily: APP_FONT, color: C.ink, position: 'relative' }}>
      <div style={{ display: 'inline-flex', height: 36, padding: 3, borderRadius: 9, border: `1px solid ${C.line}`, background: C.panel, boxSizing: 'border-box', fontSize: 13 }}>
        <span style={{ width: 82, display: 'grid', placeItems: 'center', borderRadius: 6, background: '#2148D8' }}>Research</span>
        <span style={{ width: 82, display: 'grid', placeItems: 'center', color: C.t2 }}>Build</span>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 46, height: 64, borderRadius: 14, boxSizing: 'border-box', background: C.panel, border: `1px solid ${focus ? `rgba(76,125,255,${0.4 + 0.6 * focus})` : C.line}`, boxShadow: `0 0 0 ${4 * focus}px rgba(76,125,255,.2), 0 30px 60px -30px rgba(8,10,60,.8)`, display: 'flex', alignItems: 'center', padding: '0 12px 0 18px', fontSize: 15 }}>
        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', color: live ? C.ink : C.faint }}>
          {live ? text : 'Ask the lab anything: describe a strategy, request research or run a backtest…'}
          {live && typed < 1 && <span style={{ display: 'inline-block', width: 1.5, height: 18, background: C.ink, marginLeft: 1, verticalAlign: -3 }} />}
        </span>
        <span style={{ width: SEND.s, height: SEND.s, borderRadius: 10, background: C.primary, display: 'grid', placeItems: 'center', transform: `scale(${1 - 0.1 * pr})`, opacity: 0.55 + 0.45 * clamp(typed * 3) }}>{IC.up('#fff', 20)}</span>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 118, textAlign: 'center', fontSize: 11.5, color: C.sub }}>Quantlab can make mistakes. Verify before trading.</div>
    </div>
  )
}
const HIST = [5, 14, 20, 40, 42, 62, 100, 70, 80, 54, 36, 26]
const ROWS = [['14-11-2025', '−6.2', '+0.108%', '94', '+3.1%'], ['02-09-2025', '−5.4', '+0.071%', '81', '+1.8%'], ['19-06-2025', '−7.1', '+0.133%', '97', '+4.6%']]
// Heights of the stacked results (native): question line, distribution card, output table.
export const RES = { q: 40, gap: 26, dist: { land: 240, port: 372 }, table: 156 }
export const resH = (narrow) => RES.q + RES.dist[narrow ? 'port' : 'land'] + RES.table + RES.gap * 2
export function ResearchResults({ w = 900, narrow = false, p = 1 }) {
  const step = (a) => clamp((p - a) / 0.3)
  const enter = (a) => ({ opacity: step(a), transform: `translateY(${(1 - E2(step(a))) * 26}px)` })
  const bars = clamp((p - 0.3) / 0.45)
  const CW = narrow ? w - 48 : w - 48 - 260 - 20
  const CHh = narrow ? 150 : 118
  const stat = (l, v) => (
    <div key={l} style={{ flex: 1, height: 52, borderRadius: 10, border: `1px solid ${C.line}`, background: C.field, padding: '8px 12px', boxSizing: 'border-box' }}>
      <div style={{ fontSize: 11, color: C.sub }}>{l}</div>
      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 2, ...num }}>{v}</div>
    </div>
  )
  return (
    <div style={{ width: w, display: 'flex', flexDirection: 'column', gap: RES.gap, fontFamily: APP_FONT, color: C.ink }}>
      <div style={{ height: RES.q, display: 'flex', alignItems: 'center', gap: 12, ...enter(0) }}>
        <span style={{ width: 30, height: 30, borderRadius: 15, background: C.primary, display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 600 }}>A</span>
        <span style={{ fontSize: 15, fontWeight: 500, color: C.title }}>{QUESTION}</span>
      </div>
      <div style={card({ position: 'relative', height: RES.dist[narrow ? 'port' : 'land'], padding: '18px 24px', ...enter(0.12) })}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>Distribution</span>
          <Chip h={24}>Funding rate · 14 pre-drop windows</Chip>
        </div>
        <svg width={CW} height={CHh} viewBox={`0 0 ${CW} ${CHh}`} style={{ position: 'absolute', left: 24, top: 56, display: 'block' }}>
          {HIST.map((v, i) => {
            const bw = CW / HIST.length
            const g = clamp(bars * 1.6 - i * 0.05)
            const bh = (v / 100) * (CHh - 4) * g
            return <rect key={i} x={i * bw + 3} y={CHh - bh} width={bw - 6} height={bh} rx="2" fill={i === 6 || i === 7 ? '#5C8BFF' : '#1E35A3'} />
          })}
        </svg>
        <div style={{ position: 'absolute', ...(narrow ? { left: 24, right: 24, top: 222, flexDirection: 'row' } : { right: 24, top: 56, width: 260, flexDirection: 'column' }), display: 'flex', gap: 10, opacity: clamp((p - 0.45) / 0.2) }}>
          {stat('Median funding', '+0.041%')}{stat('90th percentile', '+0.118%')}
        </div>
        <div style={{ position: 'absolute', left: 24, right: 24, bottom: 16, display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 14px', borderRadius: 10, border: `1px solid ${C.line}`, background: 'rgba(76,125,255,.08)', fontSize: 12.5, lineHeight: 1.45, color: C.t2, opacity: clamp((p - 0.55) / 0.2) }}>
          <span style={{ color: C.link, fontSize: 15, lineHeight: 1 }}>✦</span>
          <span>Funding ran rich (above the 85th percentile) in 11 of the 14 pre-drop windows. The sample is small, so treat it as a prior, not a signal.</span>
        </div>
      </div>
      <div style={card({ height: RES.table, padding: '16px 24px', ...enter(0.3) })}>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Output table</div>
        <div style={{ display: 'flex', fontSize: 10.5, color: C.faint, letterSpacing: '.06em', marginTop: 12, paddingBottom: 6, borderBottom: `1px solid ${C.line}` }}>
          {['DATE', 'DROP %', 'FUNDING', 'PCTILE', 'OI Δ'].map((h, i) => <span key={h} style={{ flex: 1, textAlign: i ? 'right' : 'left' }}>{h}</span>)}
        </div>
        {ROWS.map((r, j) => (
          <div key={j} style={{ display: 'flex', fontSize: 13, height: 26, alignItems: 'center', ...num, opacity: clamp((p - 0.5 - j * 0.08) / 0.15) }}>
            {r.map((c, i) => <span key={i} style={{ flex: 1, textAlign: i ? 'right' : 'left', color: i === 1 ? C.red : C.ink }}>{c}</span>)}
          </div>
        ))}
      </div>
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
        <svg width={W - 20} height="48" viewBox={`0 0 ${W} 60`} preserveAspectRatio="none" style={{ position: 'absolute', left: 10, bottom: 6, overflow: 'visible' }}>
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
