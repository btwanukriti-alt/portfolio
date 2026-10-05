// Supporting infographic built from the Pulsefit designs, drawn in the product's own style.
import { C, E, HEAD_FONT, P, clamp, fmt } from './lib.js'

// Membership plans by monthly price (Plans screen: Monthly ₹2,000 / Quarterly ₹5,400 /
// Half-Yearly ₹9,600 / Annual ₹16,800, divided by their months). 520 × 330.
const PRICES = [['Monthly', 2000], ['Quarterly', 1800], ['Half-Yearly', 1600], ['Annual', 1400]]
export const PRICE_CARD = { w: 520, h: 330 }
export function PlanPrices({ u, pick = 'Quarterly' }) {
  const g = P(u, 0.2, 1.2, E.out)
  return (
    <div style={{ width: PRICE_CARD.w, height: PRICE_CARD.h, borderRadius: 22, background: '#fff', padding: '26px 28px', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif', color: C.ink, boxShadow: '0 1px 0 rgba(20,30,80,.05), 0 40px 80px -40px rgba(20,30,80,.4)' }}>
      <div style={{ font: `600 20px/1 ${HEAD_FONT}`, letterSpacing: '-0.02em' }}>Price per month</div>
      <div style={{ fontSize: 13, color: C.sub, marginTop: 6 }}>Membership plans</div>
      <div style={{ display: 'grid', gap: 14, marginTop: 24 }}>
        {PRICES.map(([n, v], i) => {
          const on = n === pick
          const w = (v / 2000) * clamp(g * 1.25 - i * 0.08)
          return (
            <div key={n} style={{ display: 'grid', gridTemplateColumns: '104px 1fr 76px', alignItems: 'center', gap: 12, height: 40 }}>
              <span style={{ fontSize: 14, fontWeight: on ? 600 : 400, color: on ? C.ink : C.t2 }}>{n}</span>
              <div style={{ height: 14, borderRadius: 7, background: '#F1F3F8' }}><div style={{ width: `${w * 100}%`, height: '100%', borderRadius: 7, background: on ? C.primary : '#C8D2F4' }} /></div>
              <span style={{ fontSize: 14, fontWeight: on ? 600 : 500, color: on ? C.primary : C.t2, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>₹{fmt(v * clamp(g * 1.25 - i * 0.08))}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- supporting cards (360 wide)
const cardStyle = (h) => ({ width: 360, height: h, borderRadius: 20, background: '#fff', padding: '20px 22px', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif', color: C.ink, boxShadow: '0 1px 0 rgba(20,30,80,.05), 0 40px 80px -36px rgba(20,30,80,.45)' })
const Label = ({ children, color = C.sub }) => <div style={{ fontSize: 13, fontWeight: 500, color }}>{children}</div>
const Big = ({ children, color = C.ink, size = 40 }) => <div style={{ font: `600 ${size}px/1.1 ${HEAD_FONT}`, letterSpacing: '-0.035em', color, fontVariantNumeric: 'tabular-nums' }}>{children}</div>

// Missed Follow-ups count (the card's badge: 4), oldest first.
export function MissedStat({ u }) {
  return (
    <div style={cardStyle(150)}>
      <Label color="#D6383F">Missed follow-ups</Label>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}><Big>{Math.round(4 * P(u, 0.1, 0.8))}</Big><span style={{ fontSize: 14, color: C.sub }}>leads waiting on a call</span></div>
      <div style={{ fontSize: 13, color: C.t2, marginTop: 10 }}>Longest wait: <b style={{ fontWeight: 600 }}>Neha Singh</b>, 5 days</div>
    </div>
  )
}
// Days since Neha's follow-up was due (Missed by 5 days).
export function ContactDays({ u }) {
  const g = P(u, 0.2, 1.2, E.inOut)
  return (
    <div style={cardStyle(150)}>
      <Label>Neha Singh · follow-up due</Label>
      <div style={{ position: 'relative', height: 40, marginTop: 22 }}>
        <div style={{ position: 'absolute', left: 6, right: 6, top: 9, height: 4, borderRadius: 2, background: '#EEF0F5' }} />
        <div style={{ position: 'absolute', left: 6, width: `calc((100% - 12px) * ${g})`, top: 9, height: 4, borderRadius: 2, background: 'linear-gradient(90deg,#FFB4B4,#D6383F)' }} />
        {[0, 1, 2, 3, 4, 5].map((d) => (
          <div key={d} style={{ position: 'absolute', left: `calc(6px + (100% - 12px) * ${d / 5})`, top: 0, transform: 'translateX(-50%)', textAlign: 'center' }}>
            <div style={{ width: d === 5 ? 22 : 12, height: d === 5 ? 22 : 12, margin: d === 5 ? '0 auto' : '5px auto', borderRadius: 11, background: g * 5 >= d ? (d === 5 ? '#D6383F' : '#FFB4B4') : '#E3E6EE', boxShadow: d === 5 ? '0 0 0 5px rgba(214,56,63,.15)' : 'none' }} />
            <div style={{ fontSize: 11.5, color: d === 5 ? '#D6383F' : C.faint, marginTop: d === 5 ? 6 : 6, fontWeight: d === 5 ? 600 : 400 }}>{d === 0 ? 'Due' : `${d}d`}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
// Lead Status Breakdown (Leads Dashboard): Cold 100%, Warm 60%, Hot 30%, In Progress 10%, Converted 5%.
const FUN = [['Cold', 100, '#9DB4FF'], ['Warm', 60, '#FFD27A'], ['Hot', 30, '#FF9C9C'], ['In progress', 10, '#B9A8FF'], ['Converted', 5, '#3DBE7A']]
export function StatusFunnel({ u }) {
  return (
    <div style={cardStyle(232)}>
      <Label>Lead status breakdown</Label>
      <div style={{ display: 'grid', gap: 9, marginTop: 14 }}>
        {FUN.map(([n, v, col], i) => {
          const g = P(u, 0.15 + i * 0.1, 0.9 + i * 0.1, E.out)
          return (
            <div key={n} style={{ display: 'grid', gridTemplateColumns: '86px 1fr 40px', alignItems: 'center', gap: 10, fontSize: 12.5 }}>
              <span style={{ color: n === 'Converted' ? C.green : C.t2, fontWeight: n === 'Converted' ? 600 : 400 }}>{n}</span>
              <div style={{ height: 12, borderRadius: 6, background: '#F1F3F8' }}><div style={{ width: `${Math.max(v, 4) * g}%`, height: '100%', borderRadius: 6, background: col }} /></div>
              <span style={{ textAlign: 'right', color: C.t2, fontVariantNumeric: 'tabular-nums' }}>{Math.round(v * g)}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
// Neha's status changing Hot → Converted.
export function StatusFlip({ u }) {
  const g = P(u, 0.3, 0.9, E.inOut)
  return (
    <div style={{ ...cardStyle(112), display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: 20, background: 'hsl(330 70% 90%)', color: 'hsl(330 45% 33%)', display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: 15 }}>NS</div>
      <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 600 }}>Neha Singh</div><div style={{ fontSize: 12.5, color: C.sub }}>Lead #3051</div></div>
      <div style={{ position: 'relative', width: 108, height: 30 }}>
        <span style={{ position: 'absolute', inset: 0, borderRadius: 8, background: '#FFDCDC', color: '#D6383F', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 500, opacity: 1 - g }}>Hot</span>
        <span style={{ position: 'absolute', inset: 0, borderRadius: 8, background: '#D7F3E3', color: C.green, display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 600, opacity: g, transform: `scale(${0.85 + 0.15 * E.back(g)})` }}>✓ Converted</span>
      </div>
    </div>
  )
}
// Quarterly total: ₹5,400 subscription + ₹486 tax = ₹5,886.
export function TotalRing({ u }) {
  const g = P(u, 0.2, 1.3, E.inOut)
  const r = 44
  const L = 2 * Math.PI * r
  const sub = 5400 / 5886
  return (
    <div style={{ ...cardStyle(170), display: 'flex', alignItems: 'center', gap: 20 }}>
      <svg width="116" height="116" viewBox="0 0 116 116">
        <circle cx="58" cy="58" r={r} fill="none" stroke="#F1F3F8" strokeWidth="14" />
        <circle cx="58" cy="58" r={r} fill="none" stroke={C.primary} strokeWidth="14" strokeDasharray={`${L * sub * g} ${L}`} transform="rotate(-90 58 58)" strokeLinecap="butt" />
        <circle cx="58" cy="58" r={r} fill="none" stroke="#F5B82E" strokeWidth="14" strokeDasharray={`${L * (1 - sub) * clamp(g * 1.2 - 0.2)} ${L}`} strokeDashoffset={-L * sub} transform="rotate(-90 58 58)" />
      </svg>
      <div style={{ flex: 1 }}>
        <Label>Quarterly total</Label>
        <Big size={32}>₹{fmt(5886 * g)}</Big>
        <div style={{ display: 'grid', gap: 3, marginTop: 8, fontSize: 12.5, color: C.t2 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><i style={{ width: 8, height: 8, borderRadius: 4, background: C.primary }} />Plan ₹5,400</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><i style={{ width: 8, height: 8, borderRadius: 4, background: '#F5B82E' }} />Tax ₹486</span>
        </div>
      </div>
    </div>
  )
}
// Members dashboard KPIs as one chart.
const MK = [['Active', 234, C.primary], ['Pending payments', 42, C.amber], ['Biometrics missing', 34, C.violet], ['Frozen', 26, C.red], ['New joinees', 12, C.green]]
export function MemberBars({ u }) {
  return (
    <div style={cardStyle(232)}>
      <Label>Members at a glance</Label>
      <div style={{ display: 'grid', gap: 9, marginTop: 14 }}>
        {MK.map(([n, v, col], i) => {
          const g = P(u, 0.15 + i * 0.08, 0.9 + i * 0.08, E.out)
          return (
            <div key={n} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 36px', alignItems: 'center', gap: 10, fontSize: 12.5 }}>
              <span style={{ color: C.t2 }}>{n}</span>
              <div style={{ height: 12, borderRadius: 6, background: '#F1F3F8' }}><div style={{ width: `${(v / 234) * 100 * g}%`, minWidth: g > 0 ? 6 : 0, height: '100%', borderRadius: 6, background: col }} /></div>
              <span style={{ textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{Math.round(v * g)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
// Expiring Subscription badge: 8 expiring, the first five members shown.
export function Expiring({ u }) {
  const names = [['RF', 18], ['NS', 330], ['AJ', 200], ['C', 150], ['AJ', 45]]
  return (
    <div style={cardStyle(130)}>
      <Label color={C.red}>Expiring subscriptions</Label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12 }}>
        <Big color={C.ink}>{Math.round(8 * P(u, 0.1, 0.8))}</Big>
        <div style={{ display: 'flex' }}>
          {names.map(([ini, h], i) => (
            <div key={i} style={{ width: 34, height: 34, borderRadius: 17, marginLeft: i ? -9 : 0, background: `hsl(${h} 70% 90%)`, color: `hsl(${h} 45% 33%)`, display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600, boxShadow: '0 0 0 2.5px #fff', opacity: clamp((u - 0.2 - i * 0.08) / 0.2) }}>{ini}</div>
          ))}
          <div style={{ width: 34, height: 34, borderRadius: 17, marginLeft: -9, background: '#EEF0F5', color: C.sub, display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600, boxShadow: '0 0 0 2.5px #fff' }}>+3</div>
        </div>
      </div>
    </div>
  )
}
