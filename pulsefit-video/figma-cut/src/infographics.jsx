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
