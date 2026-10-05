// Product UI pieces rebuilt as vector React from the Figma file (Portfolio, section 250:32492):
// icons, provider marks and the Host Card. No product logo or wordmark.
import { UI } from './lib.js'

const ink = (c = UI.text) => ({ color: c, fontFamily: UI.font })

/* ---------- icons ---------- */
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }
export const Icon = {
  home: (p) => (
    <svg viewBox="0 0 24 24" {...p}><path d="M4 11 12 4l8 7v8.5a.5.5 0 0 1-.5.5H15v-6H9v6H4.5a.5.5 0 0 1-.5-.5z" fill="currentColor" /></svg>
  ),
  monitor: (p) => (
    <svg viewBox="0 0 24 24" {...p}><g {...S}><rect x="3.5" y="4.5" width="17" height="11.5" rx="1.5" /><path d="M9 20h6M12 16v4" /></g></svg>
  ),
  terminal: (p) => (
    <svg viewBox="0 0 24 24" {...p}><g {...S}><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><path d="m7.5 9.5 2.5 2.5-2.5 2.5M12 15h4.5" /></g></svg>
  ),
  ports: (p) => (
    <svg viewBox="0 0 24 24" {...p}><g {...S}><path d="M5 8h12.5M14.5 5l3 3-3 3M19 16H6.5M9.5 13l-3 3 3 3" /></g></svg>
  ),
  folder: (p) => (
    <svg viewBox="0 0 24 24" {...p}><g {...S}><path d="M3.5 7.5a1.5 1.5 0 0 1 1.5-1.5h4.2l2 2H19a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5z" /></g></svg>
  ),
  grid: (p) => (
    <svg viewBox="0 0 24 24" {...p}>{[5, 12, 19].flatMap((x) => [5, 12, 19].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r="1.7" fill="currentColor" />))}</svg>
  ),
  bell: (p) => (
    <svg viewBox="0 0 24 24" {...p}><g {...S}><path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5H5zM10 20.5h4" /></g></svg>
  ),
  gear: (p) => (
    <svg viewBox="0 0 24 24" {...p}><path fill="currentColor" fillRule="evenodd" d="M10.3 2.5h3.4l.5 2.6 1.6.9 2.5-.9 1.7 2.9-2 1.7v1.9l2 1.7-1.7 2.9-2.5-.9-1.6.9-.5 2.6h-3.4l-.5-2.6-1.6-.9-2.5.9-1.7-2.9 2-1.7v-1.9l-2-1.7 1.7-2.9 2.5.9 1.6-.9zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" /></svg>
  ),
  search: (p) => (
    <svg viewBox="0 0 24 24" {...p}><g {...S}><circle cx="11" cy="11" r="5.5" /><path d="m15.5 15.5 4 4" /></g></svg>
  ),
  arrowL: (p) => (
    <svg viewBox="0 0 24 24" {...p}><g {...S}><path d="M19 12H5m5-5-5 5 5 5" /></g></svg>
  ),
  arrowR: (p) => (
    <svg viewBox="0 0 24 24" {...p}><g {...S}><path d="M5 12h14m-5-5 5 5-5 5" /></g></svg>
  ),
  plus: (p) => (
    <svg viewBox="0 0 24 24" {...p}><g {...S} strokeWidth={2}><path d="M12 5v14M5 12h14" /></g></svg>
  ),
  chevron: (p) => (
    <svg viewBox="0 0 24 24" {...p}><g {...S}><path d="m7 10 5 5 5-5" /></g></svg>
  ),
  dots: (p) => (
    <svg viewBox="0 0 24 24" {...p}>{[5, 12, 19].map((y) => <circle key={y} cx="12" cy={y} r="1.9" fill="currentColor" />)}</svg>
  ),
  pin: (p) => (
    <svg viewBox="0 0 24 24" {...p}><g {...S}><path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z" /><circle cx="12" cy="10.5" r="2" /></g></svg>
  ),
  bars: (p) => (
    <svg viewBox="0 0 24 24" {...p}><path fill="currentColor" d="M6 13h3v6H6zM10.5 9h3v10h-3zM15 5h3v14h-3z" /></svg>
  ),
  file: (p) => (
    <svg viewBox="0 0 24 24" {...p}><path fill="currentColor" d="M6 3h8l4 4v14H6zm2 8v1.5h8V11zm0 3.5V16h8v-1.5zM13.5 4v4h4z" /></svg>
  ),
  key: (p) => (
    <svg viewBox="0 0 24 24" {...p}><g {...S}><circle cx="8" cy="15" r="4" /><path d="m11 12 8-8M16 7l2.5 2.5M14 9l2 2" /></g></svg>
  ),
  shield: (p) => (
    <svg viewBox="0 0 24 24" {...p}><g {...S}><path d="M12 3.5 19 6v5.5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="m9 12 2 2 4-4" /></g></svg>
  ),
  layout: (p) => (
    <svg viewBox="0 0 24 24" {...p}><path fill="currentColor" d="M4 4h7v9H4zM13 4h7v5h-7zM13 11h7v9h-7zM4 15h7v5H4z" /></svg>
  ),
  list: (p) => (
    <svg viewBox="0 0 24 24" {...p}><g {...S}><path d="M9 6h11M9 12h11M9 18h11M5 6h.01M5 12h.01M5 18h.01" strokeWidth={2} /></g></svg>
  ),
  sliders: (p) => (
    <svg viewBox="0 0 24 24" {...p}><g {...S} strokeWidth={2}><path d="M4 8h6M14 8h6M4 16h6M14 16h6" /><circle cx="12" cy="8" r="0.6" /><circle cx="12" cy="16" r="0.6" /></g></svg>
  ),
  info: (p) => (
    <svg viewBox="0 0 24 24" {...p}><g {...S}><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 8h.01" strokeWidth={2} /></g></svg>
  ),
}

// Provider marks, drawn simply in the file's style.
export const Mark = {
  ubuntu: ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="9" fill="none" stroke={UI.ubuntu} strokeWidth="3.4" />
      {[-90, 30, 150].map((a) => (
        <circle key={a} cx={16 + 11.5 * Math.cos((a * Math.PI) / 180)} cy={16 + 11.5 * Math.sin((a * Math.PI) / 180)} r="3.6" fill={UI.ubuntu} stroke={UI.card} strokeWidth="1.6" />
      ))}
    </svg>
  ),
  group: ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 4.5 15.5 10h-7z" fill="#C9C9D4" />
      <rect x="5" y="12.5" width="6" height="6" rx="1" fill="#C9C9D4" />
      <circle cx="16" cy="15.5" r="3.2" fill="#C9C9D4" />
    </svg>
  ),
  aws: ({ size = 28 }) => (
    <svg width={size * 1.3} height={size} viewBox="0 0 36 28">
      <text x="18" y="15" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="13" fill="#fff">aws</text>
      <path d="M7 19.5c6 3.2 16 3.2 22 0" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      <path d="m26.5 17.6 3 1.7-1.6 2.6" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  azure: ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M10.6 4h4.2L9 19.5H3.5zM15.6 8.2l5 11.3H8.2l7.2-1.6-3.2-3.6z" fill="#fff" />
    </svg>
  ),
  ocean: ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 19.5v-3.4a4.1 4.1 0 1 0-4.1-4.1H4.5A7.5 7.5 0 1 1 12 19.5z" fill="#fff" />
      <path d="M8.6 16.2h3.4v-3.4H8.6zM6 18.8h2.6v-2.6H6zM4.2 16.2H6v-1.8H4.2z" fill="#fff" />
    </svg>
  ),
  db: ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <g fill="none" stroke="#C9C9D4" strokeWidth="1.7">
        <ellipse cx="12" cy="6.5" rx="6.5" ry="2.5" />
        <path d="M5.5 6.5v11c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-11M5.5 12c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5" />
      </g>
    </svg>
  ),
}

const Dot = ({ c = UI.green, s = 9 }) => <span style={{ display: 'inline-block', width: s, height: s, borderRadius: '50%', background: c, flex: 'none' }} />

/* ---------- Host Card (250:36130) ---------- */
export const HOST_CARD = { w: 320, h: 152 }

export function HostCard({ connected = false, press = 0, glow = 0 }) {
  return (
    <div style={{ width: HOST_CARD.w, height: HOST_CARD.h, boxSizing: 'border-box', background: UI.card, borderRadius: 10, boxShadow: '0 18px 40px rgba(40,20,90,0.22)', position: 'relative', fontFamily: UI.font }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 14px 0 16px' }}>
        <div style={{ width: 52, height: 52, background: UI.app, borderRadius: 4, display: 'grid', placeItems: 'center' }}>
          <Mark.ubuntu size={30} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ ...ink(), fontSize: 17, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
            API Gateway <Dot c={connected ? UI.green : '#55555F'} />
          </div>
          <div style={{ ...ink(UI.sub), fontSize: 14, marginTop: 4 }}>192.168.1.100</div>
        </div>
        <Icon.dots width={22} height={22} style={{ color: '#fff', alignSelf: 'flex-start', marginTop: 2 }} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 88, borderTop: `1px solid ${UI.line}` }} />
      <div style={{ position: 'absolute', left: '50%', top: 80, width: 16, height: 16, marginLeft: -8, borderRadius: '50%', background: '#2E2E38', display: 'grid', placeItems: 'center', color: '#fff' }}>
        <Icon.chevron width={12} height={12} />
      </div>
      <div style={{ position: 'absolute', left: 16, right: 16, bottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        {['bars', 'terminal', 'file'].map((k) => {
          const I = Icon[k]
          return (
            <div key={k} style={{ width: 28, height: 28, borderRadius: 4, background: '#26262E', display: 'grid', placeItems: 'center', color: '#fff' }}>
              <I width={15} height={15} />
            </div>
          )
        })}
        <div style={{ flex: 1 }} />
        <div
          style={{
            ...ink(),
            fontSize: 14,
            height: 30,
            padding: '0 18px',
            borderRadius: 5,
            display: 'grid',
            placeItems: 'center',
            background: connected ? '#3A3A46' : press > 0 ? '#3D2A73' : '#26262E',
            boxShadow: glow > 0 ? `0 0 0 ${2 * glow}px rgba(139,61,255,0.7)` : 'none',
            transform: `scale(${1 - 0.06 * Math.sin(Math.PI * press)})`,
          }}
        >
          {connected ? 'Disconnect' : 'Connect'}
        </div>
      </div>
    </div>
  )
}
// Centre of the Connect button inside the card, for the cursor.
export const CONNECT_AT = { x: 268, y: 123 }
