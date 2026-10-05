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

// ---------- Flow: the stacked-drawer prototype ----------
// One consistent data set (see the storyboard's data notes): five colleges add up to the
// design's ₹94.30 Cr received; each level of the drill-down adds up to its parent.
const COLLEGES = [
  ['Engineering College', 28.5, 32.0],
  ['Medical College', 22.4, 27.5],
  ['Science College', 18.2, 21.0],
  ['Law College', 12.8, 18.0],
  ['Arts & Management College', 12.4, 16.3],
]
const PROGRAMMES = [['B.Tech', 14.0, 16.0], ['M.Tech', 6.2, 6.8], ['MBA', 5.1, 5.7], ['PhD', 3.2, 3.5]]
const FEES = [['Tuition Fee', 11.2, 12.8], ['Lab Fee', 1.4, 1.6], ['Exam Fee', 0.8, 0.9], ['Hostel Fee', 0.6, 0.7]]
const BATCHES = [['2022–26 batch', 2.4, 2.8], ['2023–27 batch', 3.1, 3.5], ['2024–28 batch', 2.9, 3.3], ['2025–29 batch', 2.8, 3.2]]

// Each drill-down level is one sheet (native SHEET size). Rows: top = ROW0 + i * ROWH.
export const SHEET = { w: 520, h: 544 }
export const ROW0 = 244
export const ROWH = 60
// Row geometry inside a sheet (native px): the name sits at x = 82.
export const ROW = { x: 24, w: 472, h: 52, nameX: 82 }

const pctOf = (r, e) => (r / e) * 100
export const LEVELS = [
  { crumb: 'All colleges', icon: IC.bank, tint: C.primary, bg: C.pSoft, title: 'Revenue Contribution', sub: 'Academic year 2025–26 (YTD)', rec: 94.3, exp: 114.8, list: 'Colleges', rows: COLLEGES, rowIcon: IC.bank, rowTint: C.primary, rowBg: C.pSoft },
  { crumb: 'Engineering College', icon: IC.bank, tint: C.primary, bg: C.pSoft, title: 'Engineering College', sub: 'Academic year 2025–26 (YTD)', rec: 28.5, exp: 32.0, list: 'Programmes', rows: PROGRAMMES, rowIcon: IC.cap, rowTint: C.green, rowBg: C.gSoft },
  { crumb: 'B.Tech', icon: IC.cap, tint: C.green, bg: C.gSoft, title: 'B.Tech', sub: 'Engineering College · 2025–26', rec: 14.0, exp: 16.0, list: 'Fee types', rows: FEES, rowIcon: IC.receipt, rowTint: C.teal, rowBg: '#E2F6F5' },
  { crumb: 'Tuition Fee', icon: IC.receipt, tint: C.teal, bg: '#E2F6F5', title: 'Tuition Fee', sub: 'B.Tech · Engineering College', rec: 11.2, exp: 12.8, list: 'Batches', rows: BATCHES, rowIcon: IC.calendar, rowTint: C.amber, rowBg: C.aSoft },
]

// One level as a sheet: header, a navy summary that counts with k, then the rows, which
// stagger in with `rows` and fill their bars with k. `hi` (0..1) lights the first row (clicked).
export function SheetCard({ level, k = 1, rows = 1, hi = 0 }) {
  const L = LEVELS[level]
  const rate = L.rec / L.exp
  return (
    <div style={card({ position: 'relative', width: SHEET.w, height: SHEET.h, padding: '22px 24px', boxShadow: lift, overflow: 'hidden' })}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 48 }}>
        <IconTile icon={L.icon} tint={L.tint} bg={L.bg} s={44} i={22} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{L.title}</div>
          <div style={{ fontSize: 12.5, color: C.sub, marginTop: 2 }}>{L.sub}</div>
        </div>
        {level === 0 ? <Chip fg={C.navy} bg={C.page} h={30}>{IC.bank(C.navy, 15)}5 colleges</Chip> : <Ic c={C.t2} s={22} w={2} d="M6 6l12 12M18 6L6 18" />}
      </div>
      <div style={{ position: 'relative', marginTop: 14, height: 108, borderRadius: 14, overflow: 'hidden', background: `linear-gradient(115deg, ${C.navy} 0%, #0F2C5C 60%, #12396F 100%)`, color: '#fff', padding: '16px 20px', boxSizing: 'border-box', display: 'flex', gap: 18 }}>
        <div style={{ position: 'absolute', right: 60, top: -100, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,.3), transparent 65%)' }} />
        <div style={{ position: 'relative', flex: 1 }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Total received</div>
          <div style={{ fontSize: 27, fontWeight: 600, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', lineHeight: 1.2 }}>{cr(L.rec * k)}</div>
          <div style={{ marginTop: 10 }}><Bar f={rate * k} h={6} fill="linear-gradient(90deg,#16A34A,#5EE0A1)" track="rgba(255,255,255,.14)" /></div>
        </div>
        <div style={{ position: 'relative', display: 'grid', gap: 6, alignContent: 'center', width: 110 }}>
          {[['Pending', L.exp - L.rec], ['Expected', L.exp]].map(([l, v]) => (
            <div key={l}><div style={{ fontSize: 11.5, opacity: 0.65 }}>{l}</div><div style={{ fontSize: 15, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{cr(v * k)}</div></div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 24, marginTop: 14, fontSize: 12.5, color: C.sub, padding: '0 4px' }}>
        <span style={{ fontWeight: 500, color: C.t2 }}>{L.list}</span><span>Received · Collected</span>
      </div>
      {L.rows.map(([n, rec, exp], i) => {
        const r = clamp(rows * L.rows.length - i)
        const pct = pctOf(rec, exp)
        const on = i === 0 ? hi : 0
        return (
          <div key={n} style={{ position: 'absolute', left: ROW.x, top: ROW0 + i * ROWH, width: ROW.w, height: ROW.h, display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', boxSizing: 'border-box', borderRadius: 12, background: on ? `rgba(232,238,252,${on})` : '#fff', boxShadow: `inset 0 0 0 1px ${on ? `rgba(29,78,216,${0.45 * on})` : C.line}`, opacity: r, transform: `translateY(${14 * (1 - r)}px)` }}>
            <IconTile icon={L.rowIcon} tint={L.rowTint} bg={L.rowBg} s={32} i={17} r={9} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.link, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n}</div>
              <div style={{ marginTop: 5, width: 150 }}><Bar f={(pct / 100) * k} h={4} fill={pct >= 85 ? C.green : C.amber} /></div>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{cr(rec)}</span>
            <span style={{ width: 60, textAlign: 'right' }}><Chip fg={pct >= 85 ? C.green : '#B26A00'} bg={pct >= 85 ? C.gSoft : C.aSoft} h={26}>{fmt(pct, 1)}%</Chip></span>
          </div>
        )
      })}
      {L.rows.length === 4 && (
        <div style={{ position: 'absolute', left: ROW.x, top: ROW0 + 4 * ROWH, width: ROW.w, height: ROW.h, display: 'flex', alignItems: 'center', padding: '0 16px', boxSizing: 'border-box', borderRadius: 12, background: C.page, fontSize: 13.5, color: C.t2, opacity: clamp(rows * 4 - 3) }}>
          <span style={{ flex: 1 }}>Total · {L.rows.length} {L.list.toLowerCase()}</span>
          <span style={{ fontWeight: 600, color: C.navy, fontVariantNumeric: 'tabular-nums' }}>{cr(L.rec * k)} <span style={{ color: C.faint, fontWeight: 500 }}>of {cr(L.exp)}</span></span>
        </div>
      )}
    </div>
  )
}

// Breadcrumb trail of the drawer stack: segment i shows with vis[i] (0..1); the last one is
// the current level.
export function Breadcrumb({ vis, scale = 1 }) {
  const cur = vis.reduce((a, v, i) => (v > 0.5 ? i : a), 0)
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', height: 48, padding: '0 8px', borderRadius: 14, background: 'rgba(255,255,255,.92)', boxShadow: '0 18px 40px -22px rgba(40,30,110,.55)', fontFamily: UI_FONT, transform: `scale(${scale})`, transformOrigin: '50% 50%' }}>
      {LEVELS.map((L, i) => {
        const v = vis[i]
        if (v <= 0.001) return null
        const on = i === cur
        return (
          <div key={L.crumb} style={{ display: 'flex', alignItems: 'center', maxWidth: 260 * v, overflow: 'hidden', opacity: v }}>
            {i > 0 && <span style={{ padding: '0 2px' }}>{IC.chevR(C.faint, 16)}</span>}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 34, padding: '0 12px', borderRadius: 10, background: on ? C.pSoft : 'transparent', color: on ? C.navy : C.sub, fontSize: 15, fontWeight: on ? 600 : 500, whiteSpace: 'nowrap', transform: `translateY(${(1 - v) * 10}px)` }}>
              {L.icon(on ? L.tint : C.faint, 16)}{L.crumb}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// Floating stat chip (300 × 96): collected ring and pending amount for the current level.
export function StatChip({ rate, pending }) {
  const r = 26
  const Lc = 2 * Math.PI * r
  return (
    <div style={card({ width: 300, height: 96, padding: '0 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: lift })}>
      <div style={{ position: 'relative', width: 64, height: 64 }}>
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke={C.gSoft} strokeWidth="8" />
          <circle cx="32" cy="32" r={r} fill="none" stroke={C.green} strokeWidth="8" strokeLinecap="round" strokeDasharray={Lc} strokeDashoffset={Lc * (1 - rate / 100)} transform="rotate(-90 32 32)" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{Math.round(rate)}%</div>
      </div>
      <div>
        <div style={{ fontSize: 13, color: C.sub }}>Pending</div>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: C.red, fontVariantNumeric: 'tabular-nums' }}>{cr(pending)}</div>
      </div>
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
  const received = 94.3
  const expected = 114.8
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
                {[['Total pending', expected - received], ['Total expected', expected]].map(([l, v]) => (
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
