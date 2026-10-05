// Pulsefit UI, rebuilt as vector React from the Figma frames (section "Pulsefit", 317:129218)
// and refined to one spec: 8pt grid, 14-16px card radius, 8px controls, Poppins type ramp.
// Fixed sizes are explicit so the scenes can aim the cursors and noodles exactly.
import { C, UI_FONT, clamp, fmt } from './lib.js'

const Ic = ({ s = 18, c = 'currentColor', w = 1.8, children, d }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', display: 'block' }}>
    {d ? <path d={d} /> : children}
  </svg>
)
export const IC = {
  grid: (c, s) => <Ic c={c} s={s}><rect x="3.5" y="3.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.6" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.6" /></Ic>,
  users: (c, s) => <Ic c={c} s={s}><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" /><path d="M15.5 5.2a3 3 0 010 5.6M17.5 14.4c1.7.6 2.7 2.2 3 4.6" /></Ic>,
  star: (c, s) => <Ic c={c} s={s} d="M12 3.5l2.5 5.2 5.7.8-4.1 4 1 5.6L12 16.4 6.9 19.1l1-5.6-4.1-4 5.7-.8z" />,
  staff: (c, s) => <Ic c={c} s={s}><circle cx="12" cy="7.5" r="3.5" /><path d="M5 20c.8-3.8 3.6-6 7-6s6.2 2.2 7 6" /></Ic>,
  plans: (c, s) => <Ic c={c} s={s}><rect x="3.5" y="4" width="17" height="5" rx="1.4" /><path d="M5 9v9.5a1.5 1.5 0 001.5 1.5h11a1.5 1.5 0 001.5-1.5V9M10 13h4" /></Ic>,
  mail: (c, s) => <Ic c={c} s={s}><rect x="3" y="5" width="18" height="14" rx="2.2" /><path d="M3.8 6.5l8.2 6 8.2-6" /></Ic>,
  dumbbell: (c, s) => <Ic c={c} s={s} w={2} d="M6.5 7v10M4 9.5v5M17.5 7v10M20 9.5v5M6.5 12h11" />,
  heart: (c, s) => <Ic c={c} s={s} d="M12 19.5s-7.5-4.4-7.5-10A4.2 4.2 0 0112 7a4.2 4.2 0 017.5 2.5c0 5.6-7.5 10-7.5 10z" />,
  chev: (c = C.sub, s = 16) => <Ic c={c} s={s} d="M7 10l5 5 5-5" />,
  plus: (c = '#fff', s = 16) => <Ic c={c} s={s} w={2.2} d="M12 5v14M5 12h14" />,
  check: (c = '#fff', s = 14) => <Ic c={c} s={s} w={2.6} d="M5 12.5l4.5 4.5L19 7.5" />,
  userPlus: (c = '#fff', s = 20) => <Ic c={c} s={s} w={2}><circle cx="10" cy="8" r="3.5" /><path d="M3.5 19.5c.7-3.6 3.3-5.6 6.5-5.6 1.4 0 2.6.3 3.7 1M18 13v6M15 16h6" /></Ic>,
  clock: (c, s) => <Ic c={c} s={s}><circle cx="12" cy="12" r="8" /><path d="M12 7.5V12l3 2" /></Ic>,
  alert: (c, s) => <Ic c={c} s={s}><path d="M12 4l9 15.5H3z" /><path d="M12 10v4M12 16.8h.01" /></Ic>,
  trend: (c, s = 14) => <Ic c={c} s={s} w={2.4} d="M4 16l5.5-5.5 3.5 3.5L20 7M15 7h5v5" />,
  dots: (c = C.faint) => <Ic c={c} s={18} w={2.8} d="M5.5 12h.01M12 12h.01M18.5 12h.01" />,
  search: (c = C.faint, s = 16) => <Ic c={c} s={s}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></Ic>,
  bell: (c = C.sub, s = 18) => <Ic c={c} s={s} d="M6 16.5V11a6 6 0 0112 0v5.5l1.5 1.5h-15zM10 20.5h4" />,
}
export const coin = (s = 20) => (
  <svg width={s} height={s} viewBox="0 0 20 20" style={{ flex: 'none' }}>
    <circle cx="10" cy="10" r="9" fill="#F5B82E" /><circle cx="10" cy="10" r="6.5" fill="#FFCD4D" />
    <text x="10" y="13.6" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#B7791F" fontFamily="Poppins">₹</text>
  </svg>
)

// Initials avatars (no stock photos).
const HUES = { 'Robert Fox': 18, 'Neha Singh': 330, 'Alex John': 200, Cameron: 150, 'Aaron J.': 45, 'Apurva Jha': 150, 'Shikhar Tiwari': 330, 'Abhishek M': 100, 'Ritesh Jha': 20, 'Alex Johnson': 215, Anu: 25 }
export const Avatar = ({ name, s = 28 }) => {
  const h = HUES[name] ?? 220
  const ini = name.replace('.', '').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
  return <div style={{ width: s, height: s, borderRadius: s / 2, flex: 'none', background: `hsl(${h} 72% 91%)`, color: `hsl(${h} 46% 34%)`, display: 'grid', placeItems: 'center', fontSize: s * 0.38, fontWeight: 600, letterSpacing: '-0.02em', boxShadow: '0 0 0 2px #fff' }}>{ini}</div>
}
export const Chip = ({ children, fg, bg, h = 26, style }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: h, padding: '0 11px', borderRadius: h / 2, background: bg, color: fg, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', ...style }}>{children}</span>
)
const Btn = ({ children, kind = 'primary', h = 36, pr = 0, style }) => {
  const k = {
    primary: { background: C.primary, color: '#fff' },
    ghost: { background: '#fff', color: C.t2, boxShadow: `inset 0 0 0 1px ${C.line}` },
    soft: { background: C.pSoft, color: C.primary },
  }[kind]
  return <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: h, padding: `0 ${h > 32 ? 16 : 12}px`, borderRadius: 8, fontSize: h > 32 ? 14 : 12.5, fontWeight: 500, whiteSpace: 'nowrap', boxSizing: 'border-box', transform: `scale(${1 - 0.05 * pr})`, ...k, ...style }}>{children}</div>
}
const card = (extra) => ({ background: '#fff', borderRadius: 16, boxSizing: 'border-box', fontFamily: UI_FONT, color: C.ink, ...extra })
const lift = '0 1px 0 rgba(15,18,34,.04), 0 30px 60px -28px rgba(10,20,80,.45)'

// ---------- Leads ----------
// Lead card: 400 × 294. Convert button centre at (200, 243), right edge x = 376.
export const LEAD = { w: 400, h: 294, btn: { x: 200, y: 243, r: 376 } }
export function LeadCard({ pr = 0 }) {
  return (
    <div style={card({ width: LEAD.w, height: LEAD.h, padding: 24, boxShadow: lift })}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 48 }}>
        <Avatar name="Alex Johnson" s={48} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em' }}>Alex Johnson</div>
          <div style={{ fontSize: 13, color: C.sub, marginTop: 2 }}>New lead</div>
        </div>
        {IC.dots()}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 16, height: 28 }}>
        <Chip fg={C.primary} bg={C.pSoft}><span style={{ width: 15, height: 15, borderRadius: 8, background: C.primary, display: 'grid', placeItems: 'center' }}>{IC.check('#fff', 10)}</span>Trial</Chip>
        <Chip fg={C.primary} bg={C.pSoft}><span style={{ width: 15, height: 15, borderRadius: 8, background: C.primary, display: 'grid', placeItems: 'center' }}>{IC.check('#fff', 10)}</span>Follow-Up</Chip>
        <Chip fg={C.red} bg={C.rSoft}>Hot</Chip>
      </div>
      <div style={{ marginTop: 16, height: 64, padding: '0 16px', borderRadius: 12, background: '#F4F2FF', display: 'grid', alignContent: 'center', gap: 10, boxSizing: 'border-box' }}>
        <div style={{ height: 8, width: '78%', borderRadius: 4, background: '#D6D0F7' }} />
        <div style={{ height: 8, width: '48%', borderRadius: 4, background: '#D6D0F7' }} />
      </div>
      <div style={{ marginTop: 20, height: 54, borderRadius: 12, background: 'linear-gradient(90deg,#6A55F2,#8C6BF6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 17, fontWeight: 500, transform: `scale(${1 - 0.04 * pr})`, filter: `brightness(${1 - 0.08 * pr})`, boxShadow: '0 14px 26px -12px rgba(106,85,242,.85)' }}>
        {IC.userPlus('#fff', 20)}Convert to Member
      </div>
    </div>
  )
}

// Assign Plan card: 380 × 258. Rows reveal with `rows` 0..1, the total counts with `p` 0..1.
export const ASSIGN = { w: 380, h: 258 }
export function AssignCard({ rows = 1, p = 1 }) {
  const R = [['Plan', 'Plan A'], ['Duration', '1 month'], ['Subscription', '₹1,000']]
  return (
    <div style={card({ width: ASSIGN.w, height: ASSIGN.h, padding: 24, boxShadow: lift })}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 28 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: C.vSoft, display: 'grid', placeItems: 'center' }}>{IC.plans(C.violet, 16)}</div>
        <span style={{ fontSize: 19, fontWeight: 600 }}>Assign Plan</span>
      </div>
      <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
        {R.map(([k, v], i) => {
          const r = clamp(rows * 3 - i)
          return (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', height: 24, alignItems: 'center', fontSize: 15, opacity: r, transform: `translateY(${10 * (1 - r)}px)` }}>
              <span style={{ color: C.sub }}>{k}</span>
              <span style={{ fontWeight: 500 }}>{v}</span>
            </div>
          )
        })}
      </div>
      <div style={{ marginTop: 18, height: 56, padding: '0 16px', borderRadius: 12, background: '#F4F2FF', display: 'flex', alignItems: 'center', gap: 10, boxSizing: 'border-box' }}>
        {coin(22)}
        <span style={{ fontSize: 15, fontWeight: 500, color: C.t2, flex: 1 }}>Total Amount</span>
        <span style={{ fontSize: 22, fontWeight: 600, color: C.violet, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>₹{fmt(1100 * p)}</span>
      </div>
    </div>
  )
}

// Lead Score chip (above the lead card).
export function ScoreChip({ p }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, height: 48, padding: '0 18px 0 14px', borderRadius: 14, background: '#fff', fontFamily: UI_FONT, fontSize: 16, fontWeight: 500, color: C.t2, whiteSpace: 'nowrap', boxShadow: lift }}>
      <svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 3.5l2.5 5.2 5.7.8-4.1 4 1 5.6L12 16.4 6.9 19.1l1-5.6-4.1-4 5.7-.8z" fill={C.violet} /></svg>
      Lead Score
      <span style={{ color: C.violet, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{Math.round(92 * p)}/100</span>
    </div>
  )
}

// ---------- Hook component cards ----------
// Score card 320 × 152: lead with a filling ring.
export function ScoreCard({ p }) {
  const r = 26
  const L = 2 * Math.PI * r
  return (
    <div style={card({ width: 320, height: 152, padding: 20, boxShadow: lift })}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name="Alex Johnson" s={36} />
        <div style={{ fontSize: 16, fontWeight: 600, flex: 1 }}>Alex Johnson</div>
        <Chip fg={C.red} bg={C.rSoft}>Hot</Chip>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
        <div>
          <div style={{ fontSize: 13, color: C.sub }}>Lead Score</div>
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{Math.round(92 * p)}<span style={{ fontSize: 16, color: C.faint, fontWeight: 500 }}>/100</span></div>
        </div>
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke={C.vSoft} strokeWidth="8" />
          <circle cx="32" cy="32" r={r} fill="none" stroke={C.violet} strokeWidth="8" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - 0.92 * p)} transform="rotate(-90 32 32)" />
        </svg>
      </div>
    </div>
  )
}
// KPI card 300 × 128.
export function KpiCard({ label = 'Active Members', value = 234, p, icon = IC.users, tint = C.primary, bg = C.pSoft, w = 300, h = 128, trend = '+21', good = true }) {
  return (
    <div style={card({ width: w, height: h, padding: 20, boxShadow: lift })}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 14, color: C.sub }}>{label}</div>
          <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{fmt(value * p)}</div>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'grid', placeItems: 'center' }}>{icon(tint, 20)}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: C.sub, marginTop: 6 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: good ? C.green : C.red, fontWeight: 600 }}>{IC.trend(good ? C.green : C.red)}{trend}</span>since last week
      </div>
    </div>
  )
}
// Plan card 280 × 178.
export function PlanMini() {
  const Row = ({ k, v }) => <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, height: 26, alignItems: 'center' }}><span style={{ color: C.sub }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span></div>
  return (
    <div style={card({ width: 280, height: 178, padding: 20, boxShadow: lift })}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Chip fg="#fff" bg={C.violet}>Body Building</Chip>{IC.dots()}</div>
      <div style={{ fontSize: 21, fontWeight: 600, marginTop: 12, letterSpacing: '-0.01em' }}>Plan A</div>
      <div style={{ marginTop: 8 }}><Row k="Duration" v="1 month" /><Row k="Subscription" v="₹1,000" /></div>
    </div>
  )
}

// ---------- Members window ----------
const NAV = [['Dashboard', IC.grid], ['Members', IC.users], ['Leads', IC.star], ['Staff', IC.staff], ['Plans', IC.plans], ['Communication', IC.mail], ['Equipments', IC.dumbbell], ['Workouts', IC.heart]]
const Mark = ({ s = 26 }) => (
  <svg width={s} height={s} viewBox="0 0 26 26"><path d="M6 23.5L9.8 3h7.7a5.6 5.6 0 015.3 7l-.3 1.1a6 6 0 01-5.8 4.4H12.4L10.9 23.5z" fill={C.primary} /><path d="M13.7 7.6h3.4c1 0 1.8 1 1.5 2l-.3 1.2a2 2 0 01-1.9 1.4h-3.6z" fill={C.yellow} /></svg>
)
const EXP = [
  ['Robert Fox', '+91 98886 23443', 'Apurva Jha', 'Plan A', 'Today'],
  ['Neha Singh', '+91 98676 23562', 'Shikhar Tiwari', 'Plan B', '2 days'],
  ['Alex John', '+91 98568 96512', 'Abhishek M', 'Plan C', '5 days'],
  ['Cameron', '+91 78556 54916', 'Ritesh Jha', 'Plan D', '6 days'],
  ['Aaron J.', '+91 78556 54916', 'Shikhar Tiwari', 'Plan E', '7 days'],
]
const PLAN_C = { 'Plan A': [C.primary, C.pSoft], 'Plan B': [C.amber, C.aSoft], 'Plan C': [C.violet, C.vSoft], 'Plan D': [C.teal, '#E3F7F4'], 'Plan E': [C.pink, '#FDE9F1'] }
const KPIS = [
  ['Active Members', 234, IC.users, C.primary, C.pSoft, '+21', true],
  ['New Joinees', 12, IC.userPlus, C.green, C.gSoft, '+21', true],
  ['Pending Payments', 42, IC.clock, C.amber, C.aSoft, '+21', true],
  ['Frozen Accounts', 26, IC.alert, C.red, C.rSoft, '+21', true],
  ['Biometrics Missing', 34, IC.staff, C.violet, C.vSoft, '+2', false],
]

// Window geometry (native px). wide: 1440 × 664 with sidebar; narrow: 940 × 788 without.
// ROW0 is the centre of the first "Expiring Subscription" row's "Expires in" cell.
export const MWIN = {
  wide: { w: 1440, h: 664, row0: { x: 722, y: 392 }, rowBox: { x: 285, y: 367, w: 694, h: 51 } },
  narrow: { w: 940, h: 788, row0: { x: 793, y: 520 }, rowBox: { x: 49, y: 495, w: 842, h: 51 } },
}
export function MembersWindow({ narrow = false, k = 1, rowHi = 0 }) {
  const G = narrow ? MWIN.narrow : MWIN.wide
  const kpis = narrow ? KPIS.slice(0, 4) : KPIS
  const cols = narrow ? '1fr 110px 110px' : '170px 150px 90px 96px 1fr'
  return (
    <div style={{ width: G.w, height: G.h, borderRadius: 20, overflow: 'hidden', background: C.page, fontFamily: UI_FONT, color: C.ink, boxShadow: '0 0 0 1px rgba(255,255,255,.6), 0 60px 120px -40px rgba(20,24,60,.55)' }}>
      <div style={{ height: 44, display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px', background: '#fff', borderBottom: `1px solid ${C.line}` }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />)}
      </div>
      <div style={{ display: 'flex', height: G.h - 44 }}>
        {!narrow && (
          <div style={{ width: 232, flex: 'none', background: '#fff', borderRight: `1px solid ${C.line}`, padding: '20px 16px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36, padding: '0 8px', marginBottom: 20 }}><Mark /><span style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }}>Pulsefit</span></div>
            {NAV.map(([n, ic]) => {
              const on = n === 'Members'
              return (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12, height: 44, padding: '0 12px', borderRadius: 10, background: on ? C.pSoft : 'transparent', color: on ? C.primary : C.t2, fontSize: 14, fontWeight: on ? 600 : 400, marginBottom: 4 }}>
                  {ic(on ? C.primary : C.sub, 18)}{n}
                </div>
              )
            })}
          </div>
        )}
        <div style={{ flex: 1, padding: narrow ? '28px 28px' : '32px 32px', boxSizing: 'border-box', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 40 }}>
            <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>Members</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {!narrow && <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 220, height: 40, padding: '0 12px', borderRadius: 8, background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}`, boxSizing: 'border-box', fontSize: 14, color: C.faint }}>{IC.search()}Search</div>}
              <Btn h={40}>{IC.plus()}Add Member</Btn>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${narrow ? 2 : 5}, 1fr)`, gap: 16, marginTop: 24 }}>
            {kpis.map(([label, v, ic, tint, bg, tr, good]) => (
              <KpiCard key={label} label={label} value={v} p={k} icon={ic} tint={tint} bg={bg} trend={tr} good={good} w="auto" h={116} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            <div style={card({ width: narrow ? '100%' : 736, height: 360, padding: 20, border: `1px solid ${C.line}` })}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 32, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 16, fontWeight: 600 }}>Expiring Subscription</span><Chip fg={C.red} bg={C.rSoft} h={24}>8 expiring</Chip></div>
                <span style={{ fontSize: 13, color: C.primary, fontWeight: 500 }}>View all</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: cols, fontSize: 12, color: C.faint, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '0 8px', height: 30, borderBottom: `1px solid ${C.line2}`, boxSizing: 'border-box' }}>
                <span>Name</span>{!narrow && <span>Assigned to</span>}<span>Plan</span><span>Expires in</span>{!narrow && <span style={{ textAlign: 'right' }}>Actions</span>}
              </div>
              {EXP.map(([n, ph, as, pl, ex], i) => (
                <div key={n} style={{ display: 'grid', gridTemplateColumns: cols, alignItems: 'center', height: 51, padding: '0 8px', borderBottom: i < 4 ? `1px solid ${C.line2}` : 'none', background: i === 0 ? `rgba(31,79,244,${0.07 * rowHi})` : 'transparent', borderRadius: 8 }}>
                  <div><div style={{ fontSize: 14, fontWeight: 500 }}>{n}</div><div style={{ fontSize: 12, color: C.faint }}>{ph}</div></div>
                  {!narrow && <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.t2 }}><Avatar name={as} s={24} />{as}</div>}
                  <div><Chip fg={PLAN_C[pl][0]} bg={PLAN_C[pl][1]} h={24}>{pl}</Chip></div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: ex === 'Today' ? C.red : ex === '2 days' ? C.amber : C.sub }}>{ex}</div>
                  {!narrow && <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}><Btn h={30}>Renew</Btn><Btn h={30} kind="ghost">Reminder</Btn></div>}
                </div>
              ))}
            </div>
            {!narrow && (
              <div style={card({ flex: 1, height: 360, padding: 20, border: `1px solid ${C.line}` })}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 32, marginBottom: 12 }}>
                  <span style={{ fontSize: 16, fontWeight: 600 }}>Incomplete Profile</span>
                  <span style={{ fontSize: 13, color: C.primary, fontWeight: 500 }}>View all</span>
                </div>
                <div style={{ display: 'grid', gap: 10 }}>
                  {[['Robert Fox', 'Biometrics missing'], ['Neha Singh', 'Phone number missing'], ['Alex John', 'Email missing'], ['Cameron', 'Plan not assigned']].map(([n, issue]) => (
                    <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12, height: 62, padding: '0 14px', border: `1px solid ${C.line}`, borderRadius: 12 }}>
                      <Avatar name={n} s={32} />
                      <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 500 }}>{n}</div><div style={{ fontSize: 12, color: C.red, marginTop: 2 }}>{issue}</div></div>
                      <Btn h={30} kind="soft">Reminder</Btn>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------- Module tiles ----------
export const MODULES = [
  ['Members', IC.users, C.primary],
  ['Leads', IC.star, C.violet],
  ['Staff', IC.staff, C.green],
  ['Plans', IC.plans, C.amber],
  ['Communication', IC.mail, C.pink],
  ['Equipments', IC.dumbbell, C.teal],
  ['Workouts', IC.heart, C.red],
]
export function ModuleTile({ name, icon, tint, w, h = 112 }) {
  return (
    <div style={card({ width: w, height: h, padding: '0 24px', display: 'flex', alignItems: 'center', gap: 18, boxShadow: lift })}>
      <div style={{ width: 60, height: 60, borderRadius: 16, background: tint, display: 'grid', placeItems: 'center', flex: 'none' }}>{icon('#fff', 28)}</div>
      <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{name}</div>
    </div>
  )
}
