// College management UI, rebuilt as vector React from the Figma frames (section "Dhondi",
// 267:97221: Finance Dashboard, Staff Dashboard, Attendance, Revenue Contribution and the
// college drawer) and refined to one spec: 8pt grid, 14-16px card radius, 8px controls,
// Poppins type ramp. The product's logo and the group's name are left out; colleges are named
// by discipline only. Fixed sizes are explicit so the scenes can aim the cursor and noodle.
import { C, UI_FONT, clamp, fmt } from './lib.js'

const Ic = ({ s = 18, c = 'currentColor', w = 1.8, children, d }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', display: 'block' }}>
    {d ? <path d={d} /> : children}
  </svg>
)
export const IC = {
  grid: (c, s) => <Ic c={c} s={s}><rect x="3.5" y="3.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.6" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.6" /></Ic>,
  rupee: (c, s) => <Ic c={c} s={s}><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M8.5 7.5h7M8.5 10.5h7M10 7.5c3.4 0 3.4 6-.8 6l5 3.5" /></Ic>,
  income: (c, s) => <Ic c={c} s={s}><path d="M4 19.5h16" /><path d="M7 16v-4M12 16V8M17 16v-6" /></Ic>,
  receipt: (c, s) => <Ic c={c} s={s}><path d="M6 3.5h12v17l-3-1.8-3 1.8-3-1.8-3 1.8z" /><path d="M9 8.5h6M9 12h6M9 15.5h3" /></Ic>,
  users: (c, s) => <Ic c={c} s={s}><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" /><path d="M15.5 5.2a3 3 0 010 5.6M17.5 14.4c1.7.6 2.7 2.2 3 4.6" /></Ic>,
  calendar: (c, s) => <Ic c={c} s={s}><rect x="3.5" y="5" width="17" height="15.5" rx="2.4" /><path d="M3.5 10h17M8 3v4M16 3v4M9 14.5l2 2 4-4" /></Ic>,
  bank: (c, s) => <Ic c={c} s={s}><path d="M3.5 9.5L12 4l8.5 5.5z" /><path d="M5.5 10v7M9.8 10v7M14.2 10v7M18.5 10v7M3.5 20h17" /></Ic>,
  report: (c, s) => <Ic c={c} s={s}><path d="M6.5 3.5h7.5l4.5 4.5v12.5h-12z" /><path d="M13.5 3.5V8.5h5M9.5 13h5M9.5 16.5h5" /></Ic>,
  cap: (c, s) => <Ic c={c} s={s}><path d="M2.5 9.5L12 5l9.5 4.5L12 14z" /><path d="M6.5 11.5v4c1.5 1.4 3.4 2 5.5 2s4-.6 5.5-2v-4M21.5 9.5v5" /></Ic>,
  chev: (c = C.sub, s = 16) => <Ic c={c} s={s} d="M7 10l5 5 5-5" />,
  chevR: (c = C.sub, s = 16) => <Ic c={c} s={s} w={2.2} d="M9.5 6l6 6-6 6" />,
  filter: (c = C.t2, s = 15) => <Ic c={c} s={s} w={2} d="M4 5h16l-6.2 7.4V19l-3.6-1.8v-4.8z" />,
  search: (c = C.sub, s = 17) => <Ic c={c} s={s}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></Ic>,
  bell: (c = C.sub, s = 18) => <Ic c={c} s={s} d="M6 16.5V11a6 6 0 0112 0v5.5l1.5 1.5h-15zM10 20.5h4" />,
  alert: (c, s) => <svg width={s} height={s} viewBox="0 0 24 24" style={{ flex: 'none', display: 'block' }}><path d="M12 3.2l9.6 16.6H2.4z" fill={c} /><path d="M12 9.5v4.5M12 16.6h.01" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" /></svg>,
  up: (c, s = 13) => <Ic c={c} s={s} w={2.6} d="M5 15l7-7 7 7" />,
  arrow: (c, s = 14) => <Ic c={c} s={s} w={2.2} d="M5 12h14M13 6l6 6-6 6" />,
}

// Initials avatars (no stock photos).
export const Avatar = ({ name, s = 28, h = 220 }) => {
  const ini = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
  return <div style={{ width: s, height: s, borderRadius: s / 2, flex: 'none', background: `hsl(${h} 72% 91%)`, color: `hsl(${h} 46% 34%)`, display: 'grid', placeItems: 'center', fontSize: s * 0.38, fontWeight: 600, letterSpacing: '-0.02em' }}>{ini}</div>
}
export const Chip = ({ children, fg, bg, h = 26, style }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: h, padding: '0 10px', borderRadius: 7, background: bg, color: fg, fontSize: h > 24 ? 13 : 12, fontWeight: 500, whiteSpace: 'nowrap', boxSizing: 'border-box', ...style }}>{children}</span>
)
const card = (extra) => ({ background: '#fff', borderRadius: 16, boxSizing: 'border-box', fontFamily: UI_FONT, color: C.ink, ...extra })
const lift = '0 1px 0 rgba(15,18,34,.04), 0 30px 60px -28px rgba(10,20,80,.45)'
const IconTile = ({ icon, tint = C.primary, bg = C.pSoft, s = 44, i = 22, r = 12 }) => (
  <div style={{ width: s, height: s, borderRadius: r, background: bg, display: 'grid', placeItems: 'center', flex: 'none' }}>{icon(tint, i)}</div>
)
const cr = (v, d = 2) => `₹${fmt(v, d)} Cr`
const Bar = ({ f, h = 8, fill = C.green, track = C.line2, r }) => (
  <div style={{ height: h, borderRadius: r ?? h / 2, background: track, overflow: 'hidden' }}>
    <div style={{ height: '100%', width: `${clamp(f) * 100}%`, borderRadius: r ?? h / 2, background: fill }} />
  </div>
)

// Engineering College's fee figures (one consistent set; see the storyboard's data notes).
export const COLLEGE = { name: 'Engineering College', received: 28.5, expected: 32.0, pending: 3.5, rate: 89.1 }
export const PROGRAMMES = [
  ['B.Tech', 14.0, 16.0],
  ['M.Tech', 6.2, 6.8],
  ['MBA', 5.1, 5.7],
  ['PhD', 3.2, 3.5],
]

// ---------- Flow ----------
// College card: 400 × 294. "View breakdown" button centre at (200, 243), right edge x = 376.
export const COLL = { w: 400, h: 294, btn: { x: 200, y: 243, r: 376 } }
export function CollegeCard({ pr = 0, p = 1 }) {
  const S = [['Received', COLLEGE.received], ['Expected', COLLEGE.expected], ['Pending', COLLEGE.pending]]
  return (
    <div style={card({ width: COLL.w, height: COLL.h, padding: 24, boxShadow: lift })}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 48 }}>
        <IconTile icon={IC.bank} s={48} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', color: C.link }}>{COLLEGE.name}</div>
          <div style={{ fontSize: 13, color: C.sub, marginTop: 2 }}>Academic year 2025–26</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginTop: 18, height: 50 }}>
        {S.map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: 12.5, color: C.sub }}>{k}</div>
            <div style={{ fontSize: 17, fontWeight: 600, marginTop: 4, letterSpacing: '-0.01em', color: k === 'Pending' ? C.red : C.ink }}>{cr(v)}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, height: 34 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: C.sub, height: 20 }}>
          <span>Collected</span>
          <span style={{ color: C.green, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmt(COLLEGE.rate * p, 1)}%</span>
        </div>
        <div style={{ marginTop: 6 }}><Bar f={(COLLEGE.rate / 100) * p} fill="linear-gradient(90deg,#16A34A,#5EE0A1)" /></div>
      </div>
      <div style={{ marginTop: 24, height: 54, borderRadius: 12, background: `linear-gradient(90deg,${C.navy},${C.navy2})`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 16, fontWeight: 500, transform: `scale(${1 - 0.04 * pr})`, filter: `brightness(${1 + 0.15 * pr})`, boxShadow: '0 14px 26px -12px rgba(11,31,68,.8)' }}>
        View fee breakdown{IC.arrow('#fff', 18)}
      </div>
    </div>
  )
}

// Programme breakdown card: 400 × 294. Rows reveal with `rows` 0..1, bars and total with `p`.
export const BREAK = { w: 400, h: 294 }
export function BreakdownCard({ rows = 1, p = 1 }) {
  return (
    <div style={card({ width: BREAK.w, height: BREAK.h, padding: '22px 24px', boxShadow: lift })}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 32 }}>
        <IconTile icon={IC.cap} tint={C.green} bg={C.gSoft} s={32} i={18} r={9} />
        <span style={{ fontSize: 17, fontWeight: 600, flex: 1 }}>Collection by programme</span>
      </div>
      <div style={{ marginTop: 12, display: 'grid', gap: 4 }}>
        {PROGRAMMES.map(([n, rec, exp], i) => {
          const r = clamp(rows * 4 - i)
          const pct = (rec / exp) * 100
          return (
            <div key={n} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 88px 52px', alignItems: 'center', gap: 10, height: 34, fontSize: 14, opacity: r, transform: `translateY(${10 * (1 - r)}px)` }}>
              <span style={{ fontWeight: 500, color: C.link }}>{n}</span>
              <Bar f={(pct / 100) * p} h={6} fill={C.green} />
              <span style={{ fontWeight: 500, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{cr(rec)}</span>
              <span style={{ textAlign: 'right', fontSize: 12.5, fontWeight: 600, color: C.green }}>{fmt(pct, 1)}%</span>
            </div>
          )
        })}
      </div>
      <div style={{ marginTop: 14, height: 54, padding: '0 16px', borderRadius: 12, background: C.page, display: 'flex', alignItems: 'center', gap: 10, boxSizing: 'border-box' }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: C.t2, flex: 1 }}>Total received</span>
        <span style={{ fontSize: 21, fontWeight: 600, color: C.navy, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{cr(COLLEGE.received * p)}</span>
      </div>
    </div>
  )
}

// Pending chip (above the college card).
export function PendingChip({ p }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, height: 48, padding: '0 18px 0 14px', borderRadius: 14, background: '#fff', fontFamily: UI_FONT, fontSize: 16, fontWeight: 500, color: C.t2, whiteSpace: 'nowrap', boxShadow: lift }}>
      {IC.alert(C.amber, 22)}
      Lowest collection: B.Tech
      <span style={{ color: C.red, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{cr(2 * p)} pending</span>
    </div>
  )
}

// ---------- Intro component cards ----------
const MiniBars = ({ c = C.green, p = 1 }) => (
  <svg width="44" height="30" viewBox="0 0 44 30">
    {[12, 20, 15, 26, 18, 23, 28].map((h, i) => <rect key={i} x={i * 6.4} y={30 - h * p} width="3.6" height={h * p} rx="1.6" fill={c} />)}
  </svg>
)
// KPI card 300 × 128.
export function KpiCard({ label = 'Present Staff', value = 1415, p = 1, w = 300, h = 128, trend = '8.2%', note = 'vs yesterday', good = true }) {
  return (
    <div style={card({ width: w, height: h, padding: 20, boxShadow: lift })}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 14, color: C.sub }}>{label}</div>
          <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{fmt(value * p)}</div>
        </div>
        <div style={{ marginTop: 14 }}><MiniBars p={0.4 + 0.6 * p} /></div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.sub, marginTop: 6 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: good ? C.green : C.red, fontWeight: 600 }}>{IC.up(good ? C.green : C.red)}{trend}</span>{note}
      </div>
    </div>
  )
}
// Leave type card 300 × 178: donut that fills with p.
const LEAVE = [['CL', 52, C.green], ['CCL', 26, C.amber], ['On Duty', 22, C.red], ['LOP', 28, '#3B82F6']]
export function LeaveCard({ p = 1 }) {
  const r = 38
  const L = 2 * Math.PI * r
  const total = LEAVE.reduce((a, l) => a + l[1], 0)
  let acc = 0
  return (
    <div style={card({ width: 300, height: 178, padding: 20, boxShadow: lift })}>
      <div style={{ fontSize: 16, fontWeight: 600 }}>Leave Type</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 10 }}>
        <div style={{ position: 'relative', width: 104, height: 104, flex: 'none' }}>
          <svg width="104" height="104" viewBox="0 0 104 104">
            <circle cx="52" cy="52" r={r} fill="none" stroke={C.line2} strokeWidth="14" />
            {LEAVE.map(([n, v, c]) => {
              const f = v / total
              const seg = Math.max(0, Math.min(f, p - acc))
              const off = acc
              acc += f
              return <circle key={n} cx="52" cy="52" r={r} fill="none" stroke={c} strokeWidth="14" strokeDasharray={`${Math.max(0, seg * L - 2)} ${L}`} strokeDashoffset={-off * L} transform="rotate(-90 52 52)" />
            })}
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeContent: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: 10.5, color: C.sub }}>On Leave</div>
            <div style={{ fontSize: 20, fontWeight: 600, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{Math.round(total * p)}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gap: 7, flex: 1 }}>
          {LEAVE.map(([n, v, c]) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.t2 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: c }} /><span style={{ flex: 1 }}>{n}</span><span style={{ fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
// Alert card 320 × 152.
export function AlertCard() {
  return (
    <div style={card({ width: 320, height: 152, padding: 20, boxShadow: lift })}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Chip fg="#B26A00" bg={C.aSoft} h={24}>Fee updated</Chip>
        <span style={{ fontSize: 12, color: C.faint }}>Today, 12:00</span>
      </div>
      <div style={{ fontSize: 17, fontWeight: 600, marginTop: 12 }}>Fee reduced</div>
      <div style={{ fontSize: 13, color: C.sub, marginTop: 4 }}>₹20,000 → ₹17,000 after concession</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 12.5, color: C.t2 }}>
        <Avatar name="Ananya K" s={22} h={330} />Ananya K · B.Tech 2023
      </div>
    </div>
  )
}

// ---------- Financial overview window ----------
const NAV = [
  ['Dashboard', IC.grid],
  ['Finance', IC.rupee, ['Financial Overview', 'Income Breakdown', 'Settlements']],
  ['Staff', IC.users],
  ['Banking', IC.bank],
  ['Reports', IC.report],
]
// Monthly collection (₹ Cr), Jan–Dec, read off the design's Collection Progress chart.
const CURVE = [12, 12, 15, 24, 42, 56, 60, 66, 80, 90, 84, 56]
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function CollectionChart({ k, w, h }) {
  const L = 34
  const B = 26
  const cw = w - L - 8
  const ch = h - B - 8
  const pts = CURVE.map((v, i) => [L + (i / 11) * cw, 8 + ch * (1 - v / 100)])
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    const mx = (x0 + x1) / 2
    d += ` C${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`
  }
  const area = `${d} L${pts[11][0]} ${8 + ch} L${pts[0][0]} ${8 + ch} Z`
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="cg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={C.green} stopOpacity=".18" /><stop offset="1" stopColor={C.green} stopOpacity="0" /></linearGradient>
        <clipPath id="cc"><rect x="0" y="0" width={L + cw * k} height={h} /></clipPath>
      </defs>
      {[0, 20, 40, 60, 80, 100].map((v) => {
        const y = 8 + ch * (1 - v / 100)
        return (
          <g key={v}>
            <line x1={L} x2={L + cw} y1={y} y2={y} stroke={C.line2} />
            <text x={L - 10} y={y + 4} textAnchor="end" fontSize="11" fill={C.faint} fontFamily="Poppins">{v}</text>
          </g>
        )
      })}
      {MONTHS.map((m, i) => <text key={m} x={L + (i / 11) * cw} y={h - 6} textAnchor="middle" fontSize="11" fill={C.faint} fontFamily="Poppins">{m}</text>)}
      <g clipPath="url(#cc)">
        <path d={area} fill="url(#cg)" />
        <path d={d} fill="none" stroke={C.green} strokeWidth="2.6" />
      </g>
    </svg>
  )
}
const ALERTS = [
  ['Receipt cancelled', C.red, C.rSoft, 'Receipt #RCP-08432 cancelled', 'Cancelled after an incorrect amount entry', 'Engineering College'],
  ['Fee updated', '#B26A00', C.aSoft, 'Fee reduced', '₹20,000 → ₹17,000 after concession approval', 'Engineering College'],
]

// Window geometry (native px): 1440 × 664 with the sidebar.
export const MWIN = { wide: { w: 1440, h: 664 } }
export function OverviewWindow({ k = 1 }) {
  const G = MWIN.wide
  const received = 80.55
  const expected = 112
  const rate = received / expected
  return (
    <div style={{ width: G.w, height: G.h, borderRadius: 20, overflow: 'hidden', background: C.page, fontFamily: UI_FONT, color: C.ink, boxShadow: '0 0 0 1px rgba(255,255,255,.6), 0 60px 120px -40px rgba(20,24,60,.55)' }}>
      <div style={{ height: 44, display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px', background: '#fff', borderBottom: `1px solid ${C.line}` }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />)}
      </div>
      <div style={{ display: 'flex', height: G.h - 44 }}>
        <div style={{ width: 232, flex: 'none', background: '#fff', borderRight: `1px solid ${C.line}`, padding: '20px 16px', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 44, padding: '0 10px', marginBottom: 16, borderRadius: 10, background: C.page, fontSize: 14, fontWeight: 500, color: C.t2 }}>
            <IconTile icon={IC.bank} s={26} i={15} r={7} /><span style={{ flex: 1 }}>All Colleges</span>{IC.chev(C.sub)}
          </div>
          {NAV.map(([n, ic, sub]) => (
            <div key={n}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 42, padding: '0 12px', borderRadius: 10, background: sub ? '#E4E9F2' : 'transparent', color: sub ? C.navy : C.t2, fontSize: 14, fontWeight: sub ? 600 : 400, marginBottom: 4 }}>
                {ic(sub ? C.navy : C.sub, 18)}<span style={{ flex: 1 }}>{n}</span>{n !== 'Dashboard' && (sub ? IC.chev(C.navy, 15) : IC.chevR(C.faint, 14))}
              </div>
              {sub && (
                <div style={{ margin: '0 0 6px 21px', paddingLeft: 12, borderLeft: `1.5px solid ${C.line}` }}>
                  {sub.map((s, i) => (
                    <div key={s} style={{ height: 34, display: 'flex', alignItems: 'center', padding: '0 10px', borderRadius: 8, fontSize: 13, background: i === 0 ? C.page : 'transparent', color: i === 0 ? C.ink : C.sub, fontWeight: i === 0 ? 500 : 400 }}>{s}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: '24px 32px', boxSizing: 'border-box', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 40 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1 }}>Financial Overview</div>
              <div style={{ fontSize: 12.5, color: C.sub, marginTop: 3 }}>Academic year 2025–26 (YTD)</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}`, display: 'grid', placeItems: 'center' }}>{IC.search()}</div>
              <div style={{ position: 'relative', width: 38, height: 38, borderRadius: 9, background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}`, display: 'grid', placeItems: 'center' }}>{IC.bell()}<span style={{ position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: 4, background: C.red }} /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 38, padding: '0 14px', borderRadius: 9, background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}`, fontSize: 13.5, fontWeight: 500, color: C.t2 }}>{IC.filter()}Filters</div>
            </div>
          </div>
          <div style={{ position: 'relative', marginTop: 18, height: 164, borderRadius: 16, overflow: 'hidden', background: `linear-gradient(115deg, ${C.navy} 0%, #0F2C5C 55%, #12396F 100%)`, color: '#fff', padding: '22px 28px', boxSizing: 'border-box', display: 'flex' }}>
            <div style={{ position: 'absolute', right: 300, top: -80, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,.28), transparent 65%)' }} />
            <div style={{ position: 'absolute', right: -60, bottom: -120, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(94,224,161,.18), transparent 65%)' }} />
            <div style={{ position: 'relative', flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 600 }}>Welcome back</div>
              <div style={{ fontSize: 12.5, opacity: 0.65, marginTop: 2 }}>Consolidated finance across 5 colleges</div>
              <div style={{ fontSize: 12.5, opacity: 0.7, marginTop: 10 }}>Received</div>
              <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', lineHeight: 1.15 }}>{cr(received * k)}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8, width: 560 }}>
                <div style={{ flex: 1 }}><Bar f={rate * k} h={6} fill="linear-gradient(90deg,#60A5FA,#5EE0A1)" track="rgba(255,255,255,.14)" /></div>
                <span style={{ fontSize: 12.5, opacity: 0.8, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{Math.round(rate * 100 * k)}% collected</span>
              </div>
            </div>
            <div style={{ position: 'relative', width: 230, display: 'grid', alignContent: 'space-between' }}>
              <div style={{ justifySelf: 'end', display: 'inline-flex', alignItems: 'center', gap: 8, height: 30, padding: '0 12px', borderRadius: 8, background: '#fff', color: C.navy, fontSize: 12.5, fontWeight: 600 }}>{IC.bank(C.navy, 15)}5 Colleges</div>
              <div style={{ display: 'grid', gap: 10 }}>
                {[['Total pending', 31.45], ['Total expected', expected]].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontSize: 12, opacity: 0.65 }}>{l}</div>
                    <div style={{ fontSize: 17, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{cr(v * k)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            <div style={card({ width: 700, height: 330, padding: '18px 20px', border: `1px solid ${C.line}` })}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 32, marginBottom: 10 }}>
                <span style={{ fontSize: 16, fontWeight: 600 }}>Collection Progress</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 10px', borderRadius: 8, boxShadow: `inset 0 0 0 1px ${C.line}`, fontSize: 12.5, fontWeight: 500, color: C.t2 }}>AY 2025–26{IC.chev(C.sub, 14)}</div>
              </div>
              <div style={{ fontSize: 11, color: C.faint, marginBottom: 2 }}>₹ Cr</div>
              <CollectionChart k={k} w={658} h={244} />
            </div>
            <div style={card({ flex: 1, height: 330, padding: '18px 20px', border: `1px solid ${C.line}` })}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{IC.alert(C.amber, 18)}<span style={{ fontSize: 16, fontWeight: 600 }}>Alerts</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 32, padding: '0 10px', borderRadius: 8, boxShadow: `inset 0 0 0 1px ${C.line}`, fontSize: 12.5, fontWeight: 500, color: C.t2 }}>All colleges{IC.chev(C.sub, 14)}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginTop: 12, height: 34, padding: 3, borderRadius: 9, background: C.page, boxSizing: 'border-box', fontSize: 12.5, color: C.sub, textAlign: 'center' }}>
                {['All', 'Read', 'Unread'].map((x, i) => <div key={x} style={{ display: 'grid', placeItems: 'center', borderRadius: 7, background: i === 0 ? '#fff' : 'transparent', color: i === 0 ? C.ink : C.sub, fontWeight: i === 0 ? 500 : 400, boxShadow: i === 0 ? '0 1px 2px rgba(15,18,34,.08)' : 'none' }}>{x}</div>)}
              </div>
              {ALERTS.map(([tag, fg, bg, title, body, who], i) => (
                <div key={tag} style={{ padding: '9px 0', borderBottom: i === 0 ? `1px solid ${C.line2}` : 'none', marginTop: i === 0 ? 4 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Chip fg={fg} bg={bg} h={22}>{tag}</Chip><span style={{ fontSize: 11.5, color: C.faint }}>Today, 12:00</span></div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 8 }}>{title}</div>
                  <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>{body}</div>
                  <div style={{ marginTop: 8 }}><Chip fg={C.t2} bg={C.page} h={22}>{who}</Chip></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------- Module tiles ----------
export const MODULES = [
  ['Dashboard', IC.grid, C.primary],
  ['Finance', IC.rupee, C.navy2],
  ['Income', IC.income, C.green],
  ['Settlements', IC.receipt, C.teal],
  ['Staff', IC.users, C.violet],
  ['Attendance', IC.calendar, C.amber],
  ['Banking', IC.bank, '#3B82F6'],
  ['Reports', IC.report, C.red],
]
export function ModuleTile({ name, icon, tint, w, h = 112 }) {
  return (
    <div style={card({ width: w, height: h, padding: '0 24px', display: 'flex', alignItems: 'center', gap: 18, boxShadow: lift })}>
      <div style={{ width: 60, height: 60, borderRadius: 16, background: tint, display: 'grid', placeItems: 'center', flex: 'none' }}>{icon('#fff', 28)}</div>
      <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{name}</div>
    </div>
  )
}
