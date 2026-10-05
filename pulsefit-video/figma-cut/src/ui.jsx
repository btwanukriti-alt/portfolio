// Pulsefit UI primitives and the app shell, rebuilt as vector React from the Figma frames
// (section "Pulsefit", 317:129218) and refined to one spec: 8pt grid, 12-16px card radius,
// 8px controls, Poppins type ramp, initials avatars instead of photos.
import { C, UI_FONT } from './lib.js'

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
  chevR: (c = C.sub, s = 14) => <Ic c={c} s={s} d="M9.5 6.5l5 5.5-5 5.5" />,
  plus: (c = '#fff', s = 16) => <Ic c={c} s={s} w={2.2} d="M12 5v14M5 12h14" />,
  check: (c = '#fff', s = 14) => <Ic c={c} s={s} w={2.6} d="M5 12.5l4.5 4.5L19 7.5" />,
  userPlus: (c = '#fff', s = 20) => <Ic c={c} s={s} w={2}><circle cx="10" cy="8" r="3.5" /><path d="M3.5 19.5c.7-3.6 3.3-5.6 6.5-5.6 1.4 0 2.6.3 3.7 1M18 13v6M15 16h6" /></Ic>,
  clock: (c, s) => <Ic c={c} s={s}><circle cx="12" cy="12" r="8" /><path d="M12 7.5V12l3 2" /></Ic>,
  alert: (c, s) => <Ic c={c} s={s}><path d="M12 4l9 15.5H3z" /><path d="M12 10v4M12 16.8h.01" /></Ic>,
  trend: (c, s = 14) => <Ic c={c} s={s} w={2.4} d="M4 16l5.5-5.5 3.5 3.5L20 7M15 7h5v5" />,
  up: (c, s = 12) => <Ic c={c} s={s} w={2.6} d="M12 19V5M6 11l6-6 6 6" />,
  dots: (c = C.t2, s = 18) => <Ic c={c} s={s} w={3} d="M5.5 12h.01M12 12h.01M18.5 12h.01" />,
  vdots: (c = C.sub, s = 16) => <Ic c={c} s={s} w={3} d="M12 5.5v.01M12 12v.01M12 18.5v.01" />,
  pencil: (c = C.violet, s = 16) => <Ic c={c} s={s} d="M15 5l4 4L8.5 19.5H4.5v-4z" />,
  search: (c = C.faint, s = 16) => <Ic c={c} s={s}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></Ic>,
  bell: (c = C.sub, s = 20) => <Ic c={c} s={s} d="M6 16.5V11a6 6 0 0112 0v5.5l1.5 1.5h-15zM10 20.5h4" />,
  gear: (c = C.sub, s = 20) => <Ic c={c} s={s}><circle cx="12" cy="12" r="3" /><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" /></Ic>,
  cal: (c = C.primary, s = 16) => <Ic c={c} s={s}><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></Ic>,
  upload: (c = C.t2, s = 16) => <Ic c={c} s={s} d="M12 16V4M7 9l5-5 5 5M4 16v3.5h16V16" />,
  filter: (c = C.t2, s = 16) => <Ic c={c} s={s} d="M4 7h16M7 12h10M10 17h4" />,
  userPlusLine: (c, s) => <Ic c={c} s={s}><circle cx="10" cy="8" r="3.5" /><path d="M3.5 19.5c.7-3.6 3.3-5.6 6.5-5.6M18 13v6M15 16h6" /></Ic>,
  pin: (c, s) => <Ic c={c} s={s}><path d="M12 21s-6-5.6-6-11a6 6 0 0112 0c0 5.4-6 11-6 11z" /><circle cx="12" cy="10" r="2.2" /></Ic>,
  trash: (c, s) => <Ic c={c} s={s} d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" />,
  flag: (c, s) => <Ic c={c} s={s} d="M5 21V4M5 4h11l-2 4 2 4H5" />,
  bellFill: (c, s) => <Ic c={c} s={s} d="M6 16.5V11a6 6 0 0112 0v5.5l1.5 1.5h-15zM10 20.5h4" />,
  calX: (c, s) => <Ic c={c} s={s}><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4M10 13l4 4M14 13l-4 4" /></Ic>,
  calSmall: (c = C.sub, s = 14) => <Ic c={c} s={s}><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17" /></Ic>,
  file: (c, s) => <Ic c={c} s={s} d="M7 3.5h7l4 4V20.5H7zM14 3.5v4h4" />,
}

const HUES = {
  'Robert Fox': 18, 'Neha Singh': 330, 'Alex John': 200, Cameron: 150, 'Aaron J.': 45, 'Apurva Jha': 150, 'Shikhar Tiwari': 330,
  'Abhishek M': 100, 'Abhishek Menon': 100, 'Ritesh Jha': 20, 'Anukriti Mishra': 25, 'Nithya Menon': 280, 'Aaron Joseph': 45,
  'Priya Raman': 300, 'Kabir Shah': 190, 'Meera Iyer': 260, 'Farida Sheikh': 120, 'Sneha Kulkarni': 350, 'Vikram Rao': 230,
}
export const Avatar = ({ name, s = 28, ring = '#fff' }) => {
  const h = HUES[name] ?? 220
  const ini = name.replace('.', '').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
  return <div style={{ width: s, height: s, borderRadius: s / 2, flex: 'none', background: `hsl(${h} 70% 90%)`, color: `hsl(${h} 45% 33%)`, display: 'grid', placeItems: 'center', fontSize: s * 0.38, fontWeight: 600, letterSpacing: '-0.02em', boxShadow: `0 0 0 2px ${ring}` }}>{ini}</div>
}
export const Chip = ({ children, fg, bg, h = 24, w, style }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: h, width: w, padding: w ? 0 : '0 10px', borderRadius: 6, background: bg, color: fg, fontSize: 12.5, fontWeight: 500, whiteSpace: 'nowrap', boxSizing: 'border-box', ...style }}>{children}</span>
)
export const Btn = ({ children, kind = 'primary', h = 36, pr = 0, style }) => {
  const k = {
    primary: { background: C.primary, color: '#fff' },
    ghost: { background: '#fff', color: C.t2, boxShadow: `inset 0 0 0 1px ${C.line}` },
    soft: { background: C.pSoft, color: C.primary },
    off: { background: '#E4E6EC', color: '#fff' },
  }[kind]
  return <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: h, padding: `0 ${h > 32 ? 16 : 12}px`, borderRadius: 8, fontSize: h > 32 ? 14 : 12.5, fontWeight: 500, whiteSpace: 'nowrap', boxSizing: 'border-box', transform: `scale(${1 - 0.05 * pr})`, flex: 'none', ...k, ...style }}>{children}</div>
}
export const card = (extra) => ({ position: 'absolute', background: '#fff', borderRadius: 14, boxShadow: `0 0 0 1px ${C.line}`, boxSizing: 'border-box', ...extra })
export const Abs = ({ x, y, w, h, children, style }) => <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, ...style }}>{children}</div>

export const Mark = ({ s = 26 }) => (
  <svg width={s} height={s} viewBox="0 0 26 26"><path d="M6 23.5L9.8 3h7.7a5.6 5.6 0 015.3 7l-.3 1.1a6 6 0 01-5.8 4.4H12.4L10.9 23.5z" fill={C.primary} /><path d="M13.7 7.6h3.4c1 0 1.8 1 1.5 2l-.3 1.2a2 2 0 01-1.9 1.4h-3.6z" fill={C.yellow} /></svg>
)
const NAV = [['Dashboard', IC.grid], ['Members', IC.users], ['Leads', IC.star], ['Staff', IC.staff], ['Plans', IC.plans], ['Communication', IC.mail], ['Equipments', IC.dumbbell], ['Workouts', IC.heart]]

// App shell: 1440 wide. Sidebar 256, top bar 76; page content runs x 320..1376.
export function Shell({ active, h, sub, children }) {
  return (
    <div style={{ position: 'relative', width: 1440, height: h, background: '#F4F5F8', overflow: 'hidden', fontFamily: UI_FONT, color: C.ink }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 256, background: '#fff', borderRight: `1px solid ${C.line}`, padding: '24px 20px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36, padding: '0 6px' }}><Mark /><span style={{ fontSize: 21, fontWeight: 600, letterSpacing: '-0.02em' }}>Pulsefit</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 46, padding: '0 12px', borderRadius: 10, background: '#F1F2F6', margin: '20px 0 16px' }}>
          <Avatar name="Anukriti Mishra" s={28} /><span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: C.t2 }}>My workspace</span>{IC.chev(C.t2)}
        </div>
        {NAV.map(([n, ic]) => {
          const on = n === active
          return (
            <div key={n}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 42, padding: '0 12px', borderRadius: 10, background: on ? C.pSoft : 'transparent', color: on ? C.primary : C.t2, fontSize: 14, fontWeight: on ? 600 : 400, marginBottom: 4 }}>
                {ic(on ? C.primary : '#3A3F55', 18)}<span style={{ flex: 1 }}>{n}</span>{n !== 'Dashboard' && IC.chev(on ? C.primary : C.faint, 15)}
              </div>
              {on && sub && (
                <div style={{ margin: '0 0 8px 30px', borderLeft: `1.5px solid ${C.line}` }}>
                  {sub.map(([s, act]) => (
                    <div key={s} style={{ height: 34, display: 'flex', alignItems: 'center', paddingLeft: 18, fontSize: 13, color: act ? C.ink : C.sub, fontWeight: act ? 600 : 400, borderLeft: act ? `2px solid ${C.primary}` : 'none', marginLeft: -1.5 }}>{s}</div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div style={{ position: 'absolute', left: 256, right: 0, top: 0, height: 76, background: '#fff', borderBottom: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 22, paddingRight: 40 }}>
        {IC.gear()}
        <div style={{ position: 'relative' }}>{IC.bell()}<span style={{ position: 'absolute', right: 1, top: 1, width: 7, height: 7, borderRadius: 4, background: C.red }} /></div>
        <Avatar name="Anukriti Mishra" s={38} />
      </div>
      {children}
    </div>
  )
}
