// The product UI, rebuilt as vector React from the Figma file (Portfolio, section 250:32492).
// No product logo or wordmark: the sidebar keeps the home button and the top bar keeps the
// "Personal Vault" switcher. Refinements against the file are listed in the storyboard.
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

/* ---------- app chrome ---------- */
const NAV = [
  ['monitor', 'Hosts'],
  ['terminal', 'Terminal'],
  ['ports', 'Port\nMapping'],
  ['folder', 'SFTP'],
  ['grid', 'More'],
]

function Sidebar({ active = 'Hosts', h }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 94, height: h, background: UI.side, borderRight: `1px solid ${UI.line}` }}>
      <div style={{ height: 40, display: 'grid', placeItems: 'center', color: UI.purple, borderBottom: `1px solid ${UI.line}` }}>
        <Icon.home width={20} height={20} />
      </div>
      <div style={{ position: 'absolute', top: Math.max(110, h * 0.27), left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        {NAV.map(([ic, label]) => {
          const I = Icon[ic]
          const on = label === active
          return (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', display: 'grid', placeItems: 'center', background: on ? '#2B1F4D' : 'transparent', color: on ? '#fff' : '#C9C9D4' }}>
                <I width={21} height={21} />
              </div>
              <div style={{ ...ink(on ? '#fff' : '#C9C9D4'), fontSize: 14, fontWeight: on ? 600 : 400, textAlign: 'center', whiteSpace: 'pre-line', lineHeight: 1.3 }}>{label}</div>
            </div>
          )
        })}
      </div>
      <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, color: '#C9C9D4' }}>
        <Icon.bell width={21} height={21} />
        <Icon.gear width={21} height={21} />
      </div>
    </div>
  )
}

function TopBar({ w, compact }) {
  return (
    <div style={{ position: 'absolute', left: 94, top: 0, width: w - 94 }}>
      <div style={{ height: 36, borderBottom: `1px solid ${UI.line}`, display: 'flex', alignItems: 'stretch' }}>
        <div style={{ ...ink(), fontSize: 14, display: 'flex', alignItems: 'center', gap: 34, padding: '0 14px', borderRight: `1px solid ${UI.line}` }}>
          Tab 1 <span style={{ color: UI.sub, fontSize: 13 }}>✕</span>
        </div>
      </div>
      <div style={{ height: 62, display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px', borderBottom: `1px solid ${UI.line}`, color: UI.sub }}>
        <Icon.arrowL width={22} height={22} />
        <Icon.arrowR width={22} height={22} />
        <div style={{ ...ink(UI.sub), flex: compact ? 1 : 'none', width: compact ? undefined : 312, height: 32, marginLeft: 14, background: '#1B1B21', border: `1px solid ${UI.line}`, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', fontSize: 14, boxSizing: 'border-box' }}>
          <Icon.search width={14} height={14} /> Search
        </div>
        <div style={{ flex: compact ? 'none' : 1 }} />
        {!compact && (
          <div style={{ display: 'flex', gap: 2, background: '#1B1B21', borderRadius: 6, padding: 2 }}>
            <div style={{ width: 30, height: 30, borderRadius: 4, background: '#3A3A46', display: 'grid', placeItems: 'center', color: '#fff' }}><Icon.layout width={16} height={16} /></div>
            <div style={{ width: 30, height: 30, display: 'grid', placeItems: 'center' }}><Icon.list width={16} height={16} /></div>
          </div>
        )}
        {!compact && <Icon.sliders width={20} height={20} style={{ margin: '0 10px' }} />}
        <div style={{ ...ink(), height: 36, display: 'flex', alignItems: 'center', gap: 9, padding: '0 10px', border: `1px solid ${UI.line}`, borderRadius: 6, fontSize: 14 }}>
          <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#3BB6F5', display: 'grid', placeItems: 'center', fontSize: 11, color: '#06283D', fontWeight: 600 }}>A</span>
          Personal Vault
          <Icon.chevron width={16} height={16} style={{ color: UI.sub }} />
        </div>
        <div style={{ height: 36, width: 76, borderRadius: 6, background: UI.purple, display: 'flex', alignItems: 'center', justifyContent: 'space-around', color: '#fff' }}>
          <Icon.plus width={20} height={20} />
          <Icon.chevron width={14} height={14} />
        </div>
      </div>
    </div>
  )
}

/* ---------- Hosts dashboard (250:32498) ---------- */
export const GROUPS = [
  { name: 'Production Servers', hosts: 16, tag: 'Parent Group', mark: 'group' },
  { name: 'AWS Infrastructure', hosts: 12, tag: 'AWS', mark: 'aws' },
  { name: 'Azure Resources', hosts: 9, tag: 'Azure', mark: 'azure' },
  { name: 'DigitalOcean Droplets', hosts: 8, tag: 'DigitalOcean', mark: 'ocean' },
  { name: 'Staging Servers', hosts: 6, tag: 'Parent Group', mark: 'group' },
  { name: 'Database Cluster', hosts: 4, tag: 'Database', mark: 'db' },
]

function GroupRow({ g, count, w }) {
  const M = Mark[g.mark]
  return (
    <div style={{ width: w, height: 74, boxSizing: 'border-box', background: UI.card, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 13, padding: '0 12px' }}>
      <div style={{ width: 50, height: 50, borderRadius: 4, background: '#2A2A33', display: 'grid', placeItems: 'center', flex: 'none' }}>
        <M size={26} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...ink(), fontSize: 16, fontWeight: 500, whiteSpace: 'nowrap' }}>{g.name}</div>
        <div style={{ ...ink(UI.sub), fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, whiteSpace: 'nowrap' }}>
          {Math.round(count)} Hosts <Dot c={UI.sub} s={5} /> <Icon.pin width={13} height={13} /> Bangalore, India
        </div>
      </div>
      <div style={{ ...ink(UI.tag), fontSize: 12, background: UI.tagBg, borderRadius: 4, padding: '3px 8px', whiteSpace: 'nowrap' }}>{g.tag}</div>
      <Icon.dots width={20} height={20} style={{ color: '#fff', flex: 'none' }} />
    </div>
  )
}

// Rendered at design px (dw wide) and scaled into a w x h frame. k: KPI count-up 0..1.
export function Dashboard({ w, h, dw = 1280, cols = 2, k = 1 }) {
  const s = w / dw
  const dh = h / s
  const pad = cols === 2 ? 118 : 56
  const inner = dw - 94 - pad * 2
  const gap = cols === 2 ? 24 : 0
  const cw = (inner - gap) / cols
  return (
    <div style={{ width: w, height: h, overflow: 'hidden', position: 'relative', background: UI.app }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: dw, height: dh, transform: `scale(${s})`, transformOrigin: '0 0' }}>
        <Sidebar h={dh} />
        <TopBar w={dw} compact={cols === 1} />
        <div style={{ position: 'absolute', left: 94 + pad, top: 98 + (cols === 2 ? 60 : 50), width: inner }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
            <div style={{ ...ink(), fontSize: 24, fontWeight: 500 }}>Hosts</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, border: `1px solid ${UI.line}`, borderRadius: 6, padding: 4 }}>
              {[
                ['All', null],
                ['Group', 'grp'],
                ['Connected', 'dot'],
                ['Favourite', 'star'],
              ].map(([l, ic], i) => (
                <div key={l} style={{ ...ink(), fontSize: 14, display: 'flex', alignItems: 'center', gap: 7, padding: '6px 10px', borderRadius: 4, background: i === 1 ? '#26262E' : 'transparent' }}>
                  {ic === null && <Icon.list width={15} height={15} />}
                  {ic === 'grp' && <Mark.group size={16} />}
                  {ic === 'dot' && <Dot c="#4BE3A5" />}
                  {ic === 'star' && <span style={{ color: '#FFC83D', fontSize: 15 }}>★</span>}
                  {l}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cw}px)`, gap: `16px ${gap}px` }}>
            {GROUPS.map((g) => (
              <GroupRow key={g.name} g={g} w={cw} count={g.hosts * k} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

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

/* ---------- Port Mapping card (250:38685) ---------- */
export const PORT_CARD = { w: 300, h: 144 }

export function PortCard() {
  return (
    <div style={{ width: PORT_CARD.w, height: PORT_CARD.h, boxSizing: 'border-box', background: UI.card, border: `1px solid ${UI.line}`, borderRadius: 10, boxShadow: '0 18px 40px rgba(40,20,90,0.22)', position: 'relative', fontFamily: UI.font }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 14px 0 14px' }}>
        <div style={{ width: 42, height: 42, background: '#26262E', borderRadius: 4, display: 'grid', placeItems: 'center', color: '#B9A2FF' }}>
          <svg width="22" height="22" viewBox="0 0 24 24"><path d="M5 18v-5a4 4 0 0 1 4-4h10m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ ...ink(), fontSize: 16, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 7 }}>
            PostgreSQL Database <Dot />
          </div>
          <div style={{ ...ink(UI.sub), fontSize: 14, marginTop: 3 }}>Local</div>
        </div>
        <Icon.dots width={20} height={20} style={{ color: '#fff', alignSelf: 'flex-start' }} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 80, borderTop: `1px solid ${UI.line}` }} />
      <div style={{ position: 'absolute', left: '50%', top: 73, width: 15, height: 15, marginLeft: -7.5, borderRadius: '50%', background: '#2E2E38', display: 'grid', placeItems: 'center', color: '#fff' }}>
        <Icon.chevron width={11} height={11} />
      </div>
      <div style={{ position: 'absolute', left: 14, right: 14, bottom: 14, display: 'flex', alignItems: 'center', gap: 8, color: '#C9C9D4' }}>
        {[0, 1].map((i) => (
          <div key={i} style={{ width: 26, height: 26, borderRadius: 4, background: '#26262E', display: 'grid', placeItems: 'center' }}>
            {i === 0 ? (
              <svg width="13" height="13" viewBox="0 0 24 24"><path d="m4 20 1-5L16 4l4 4L9 19z" fill="currentColor" /></svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24"><path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
            )}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ ...ink(), fontSize: 13, height: 26, padding: '0 10px', borderRadius: 4, display: 'grid', placeItems: 'center', background: '#3A3A46' }}>Disconnect</div>
      </div>
    </div>
  )
}

/* ---------- Security Insights (from the host Overview, 250:34295) ---------- */
export const SECURITY_CARD = { w: 410, h: 196 }
const INSIGHTS = [
  ['INFO', 'SSH configured with key-based authentication'],
  ['INFO', 'Firewall active with 3 rules configured'],
  ['WARN', 'Disk usage above 80% on /dev/sda1'],
]

export function SecurityCard() {
  return (
    <div style={{ width: SECURITY_CARD.w, height: SECURITY_CARD.h, boxSizing: 'border-box', background: UI.card, border: `1px solid ${UI.line}`, borderRadius: 10, boxShadow: '0 18px 40px rgba(40,20,90,0.22)', padding: '16px 18px', fontFamily: UI.font }}>
      <div style={{ ...ink(), fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Security Insights</div>
      {INSIGHTS.map(([lvl, txt], i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: i < 2 ? `1px solid ${UI.line}` : 'none' }}>
          <div style={{ ...ink(lvl === 'WARN' ? UI.amber : UI.cyan), fontSize: 12, width: 52, textAlign: 'center', padding: '3px 0', borderRadius: 3, background: '#26262E', flex: 'none' }}>{lvl}</div>
          <div style={{ ...ink(), fontSize: 13, whiteSpace: 'nowrap' }}>{txt}</div>
        </div>
      ))}
    </div>
  )
}

/* ---------- Host Info (250:34295, Overview tab) ---------- */
export const HOST_INFO = { w: 420, h: 232 }

// k: count-up 0..1 for sessions and uptime; on: status has switched to Connected.
export function HostInfoCard({ k = 1, on = true }) {
  const days = Math.round(15 * k)
  const hours = Math.round(6 * k)
  const cells = [
    ['OS', 'Ubuntu 22.04 LTS'],
    ['IP Address', '192.168.1.100'],
    ['Active Sessions', String(Math.round(3 * k))],
    ['Port', '22'],
    ['Uptime', `${days} days, ${hours} hours`, UI.green],
    ['Status', on ? 'Connected' : 'Connecting', null, true],
  ]
  return (
    <div style={{ width: HOST_INFO.w, height: HOST_INFO.h, boxSizing: 'border-box', background: UI.card, border: `1px solid ${UI.line}`, borderRadius: 10, boxShadow: '0 18px 40px rgba(40,20,90,0.22)', padding: '18px 22px', fontFamily: UI.font }}>
      <div style={{ ...ink(), fontSize: 16, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
        <Icon.info width={18} height={18} style={{ color: '#C9C9D4' }} /> Host Info
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', rowGap: 14 }}>
        {cells.map(([l, v, c, dot]) => (
          <div key={l}>
            <div style={{ ...ink(UI.sub), fontSize: 13 }}>{l}</div>
            <div style={{ ...ink(c || UI.text), fontSize: 16, marginTop: 3, display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap' }}>
              {dot && <Dot c={on ? UI.green : UI.amber} s={8} />}
              {v}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Module tiles (sidebar and More) ---------- */
export const MODULES = [
  ['monitor', 'Hosts', 'Groups, vaults and favourites'],
  ['terminal', 'Terminal', 'Packages, history and Ask AI'],
  ['ports', 'Port Mapping', 'Local, remote and dynamic'],
  ['folder', 'SFTP', 'File explorer for every host'],
  ['key', 'Key Manager', 'Generate and import keys'],
  ['shield', 'Known Hosts', 'Trusted host fingerprints'],
]

export function ModuleTile({ m, w, h }) {
  const [ic, name, sub] = m
  const I = Icon[ic]
  const big = h > 140
  return (
    <div style={{ width: w, height: h, boxSizing: 'border-box', background: UI.card, border: `1px solid ${UI.line}`, borderRadius: 12, boxShadow: '0 14px 32px rgba(40,20,90,0.2)', display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', fontFamily: UI.font }}>
      <div style={{ width: big ? 60 : 54, height: big ? 60 : 54, borderRadius: '50%', background: '#2B1F4D', color: '#D9CCFF', display: 'grid', placeItems: 'center', flex: 'none' }}>
        <I width={big ? 28 : 26} height={big ? 28 : 26} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ ...ink(), fontSize: big ? 24 : 21, fontWeight: 500 }}>{name}</div>
        <div style={{ ...ink(UI.sub), fontSize: big ? 16 : 14, marginTop: 4 }}>{sub}</div>
      </div>
    </div>
  )
}
