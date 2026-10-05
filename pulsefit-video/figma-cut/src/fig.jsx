// Figma editor vocabulary, drawn in stage coordinates: multiplayer cursors, selection boxes,
// component labels, comment pins and the canvas toolbar, plus the headline and its eyebrow.
import { E, FIG, HEAD_FONT, P, PEOPLE, UI_FONT, clamp } from './lib.js'

const abs = (x, y, extra) => ({ position: 'absolute', left: x, top: y, ...extra })

// Multiplayer cursor: a coloured arrow with a white edge and its owner's name tag.
// (x, y) is the arrow tip. `pr` = press 0..1, `rp` = click ripple 0..1.
export function Cursor({ x, y, name, o = 1, pr = 0, rp = 0, s = 1.5 }) {
  const c = PEOPLE[name]
  if (o <= 0.001) return null
  return (
    <div style={abs(x, y, { opacity: o, zIndex: 50, pointerEvents: 'none' })}>
      {rp > 0 && (
        <div
          style={abs(0, 0, {
            width: 90 * s,
            height: 90 * s,
            marginLeft: -45 * s,
            marginTop: -45 * s,
            borderRadius: '50%',
            border: `${3 * s}px solid ${c}`,
            transform: `scale(${0.15 + 0.85 * E.out(rp)})`,
            opacity: 0.9 * (1 - rp),
          })}
        />
      )}
      <div style={{ transform: `scale(${s * (1 - 0.16 * pr)})`, transformOrigin: '0 0' }}>
        <svg width="26" height="28" viewBox="0 0 26 28" style={{ display: 'block', overflow: 'visible', filter: 'drop-shadow(0 3px 6px rgba(10,14,40,.28))' }}>
          <path d="M2 1.5 L2 22 L7.6 16.9 L11.4 25.4 L15 23.8 L11.3 15.5 L19 15.2 Z" fill={c} stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
        <div
          style={abs(16, 24, {
            background: c,
            color: '#fff',
            font: `600 12.5px/1 ${UI_FONT}`,
            padding: '5px 9px 6px',
            borderRadius: 7,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 10px -4px rgba(10,14,40,.4)',
          })}
        >
          {name}
        </div>
      </div>
    </div>
  )
}

// Selection box with corner handles. `label` sits above (component name), `size` below.
export function Selection({ x, y, w, h, o = 1, label, comp = false, size, k = 1, color = FIG.sel }) {
  if (o <= 0.001) return null
  const hs = 10 * k
  const handle = (hx, hy) => (
    <div key={`${hx}${hy}`} style={abs(hx - hs / 2, hy - hs / 2, { width: hs, height: hs, background: '#fff', border: `${1.6 * k}px solid ${color}`, boxSizing: 'border-box', borderRadius: 2 })} />
  )
  return (
    <div style={abs(x, y, { width: w, height: h, opacity: o, pointerEvents: 'none', zIndex: 40 })}>
      <div style={{ position: 'absolute', inset: 0, border: `${2 * k}px solid ${color}` }} />
      {handle(0, 0)}
      {handle(w, 0)}
      {handle(0, h)}
      {handle(w, h)}
      {label && (
        <div style={abs(0, -26 * k, { display: 'flex', alignItems: 'center', gap: 6 * k, color: comp ? FIG.comp : color, font: `600 ${14 * k}px/1 ${UI_FONT}`, whiteSpace: 'nowrap' })}>
          {comp && (
            <svg width={13 * k} height={13 * k} viewBox="0 0 12 12">
              <path d="M6 .8 8.1 3 6 5.1 3.9 3zM6 6.9 8.1 9 6 11.2 3.9 9zM3 3.9 5.1 6 3 8.1.8 6zM9 3.9 11.2 6 9 8.1 6.9 6z" fill={FIG.comp} />
            </svg>
          )}
          {label}
        </div>
      )}
      {size && (
        <div style={abs(w / 2, h + 10 * k, { transform: 'translateX(-50%)', background: color, color: '#fff', font: `600 ${13 * k}px/1 ${UI_FONT}`, padding: `${5 * k}px ${8 * k}px`, borderRadius: 5 * k, whiteSpace: 'nowrap' })}>
          {size}
        </div>
      )}
    </div>
  )
}

// Figma comment: a pin (avatar in a speech-drop) that opens into a bubble.
export function Comment({ x, y, name, text, u, k = 1 }) {
  if (u <= 0) return null
  const c = PEOPLE[name] || '#555'
  const ini = name.split(' ').map((p) => p[0]).join('').slice(0, 2)
  const pop = E.back(clamp(u / 0.5))
  const open = E.out(clamp((u - 0.35) / 0.5))
  return (
    <div style={abs(x, y, { transform: `scale(${(0.4 + 0.6 * pop) * k})`, transformOrigin: '0 100%', opacity: clamp(u / 0.2), zIndex: 45 })}>
      <div style={{ position: 'absolute', left: 0, bottom: 0, display: 'flex', alignItems: 'flex-start', gap: 12, background: '#fff', padding: 10, paddingRight: 10 + 18 * open, borderRadius: '24px 24px 24px 4px', boxShadow: '0 18px 40px -14px rgba(10,14,40,.45)', whiteSpace: 'nowrap' }}>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: c, color: '#fff', display: 'grid', placeItems: 'center', font: `600 14px/1 ${UI_FONT}`, flex: 'none' }}>{ini}</div>
        <div style={{ maxWidth: 420 * open, overflow: 'hidden', opacity: open, paddingTop: 1 }}>
          <div style={{ font: `600 14px/1.2 ${UI_FONT}`, color: '#0F1222' }}>
            {name} <span style={{ color: '#9A9EB0', fontWeight: 400, marginLeft: 6 }}>now</span>
          </div>
          <div style={{ font: `400 16px/1.35 ${UI_FONT}`, color: '#2B2F42', marginTop: 4 }}>{text}</div>
        </div>
      </div>
    </div>
  )
}

// Canvas toolbar (bottom of the editor). `active` is the tool index.
export function Toolbar({ x, y, o, active }) {
  if (o <= 0) return null
  const st = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const tools = [
    <path key="m" {...st} d="M6 4l12 7-5.4 1.4L10 18z" />,
    <path key="f" {...st} d="M8 3v18M16 3v18M3 8h18M3 16h18" />,
    <rect key="r" {...st} x="4.5" y="4.5" width="15" height="15" rx="1.5" />,
    <path key="p" {...st} d="M12 3l6 9-6 9-6-9zM12 3v8" />,
    <path key="t" {...st} d="M5 5h14M12 5v14" />,
    <path key="c" {...st} d="M5 18.5V7.5A3.5 3.5 0 018.5 4h7A3.5 3.5 0 0119 7.5v4a3.5 3.5 0 01-3.5 3.5H9z" />,
  ]
  return (
    <div style={abs(x, y, { transform: `translate(-50%, ${(1 - o) * 30}px)`, opacity: o, display: 'flex', gap: 6, padding: 8, background: '#fff', borderRadius: 16, boxShadow: '0 1px 0 rgba(0,0,0,.04), 0 18px 40px -16px rgba(10,14,40,.35)', zIndex: 20 })}>
      {tools.map((p, i) => (
        <div key={i} style={{ width: 48, height: 48, borderRadius: 11, display: 'grid', placeItems: 'center', color: i === active ? '#fff' : '#2B2F42', background: i === active ? FIG.sel : 'transparent' }}>
          <svg width="24" height="24" viewBox="0 0 24 24">{p}</svg>
        </div>
      ))}
    </div>
  )
}

// Headline: words rise out of a mask, staggered; `hi` marks words set on a highlight pill.
// lines = [[word, word], ...]; u = time since the headline starts; out = 0..1 exit.
export function Headline({ lines, u, out = 0, size, color, hi = {}, align = 'center', x, y, w, lh = 1.02 }) {
  let n = 0
  return (
    <div style={abs(x, y, { width: w, textAlign: align, font: `700 ${size}px/${lh} ${HEAD_FONT}`, letterSpacing: '-0.045em', color, opacity: 1 - out, transform: `translateY(${-30 * E.inOut(out)}px)` })}>
      {lines.map((line, li) => (
        <div key={li} style={{ whiteSpace: 'nowrap' }}>
          {line.map((word, wi) => {
            const i = n++
            const p = P(u, i * 0.07, i * 0.07 + 0.75, E.expo)
            const h = hi[word]
            const pill = h ? E.back(clamp((u - 0.35 - i * 0.07) / 0.5)) : 0
            return (
              <span key={wi} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', padding: '0.06em 0.04em 0.12em', margin: '-0.06em 0 -0.12em' }}>
                <span style={{ display: 'inline-block', position: 'relative', transform: `translateY(${(1 - p) * 110}%) rotate(${(1 - p) * 6}deg)`, transformOrigin: '0 100%' }}>
                  {h && (
                    <span style={{ position: 'absolute', left: 0, right: 0, top: '0.1em', bottom: '0.02em', background: h.bg, borderRadius: '0.2em', transform: `scaleX(${pill})`, transformOrigin: '0 50%' }} />
                  )}
                  <span style={{ color: h && pill > 0.5 ? h.fg : undefined, position: 'relative', padding: h ? '0 0.16em' : 0 }}>{word}</span>
                </span>
                {wi < line.length - 1 ? ' ' : ''}
              </span>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// Eyebrow: a small pill tag above the headline.
export function Tag({ x, y, text, u, out = 0, icon }) {
  const p = E.back(clamp(u / 0.5))
  return (
    <div style={abs(x, y, { transform: `translateX(-50%) scale(${1.35 * (0.6 + 0.4 * p)})`, transformOrigin: '50% 0', opacity: clamp(u / 0.25) * (1 - out), display: 'flex', alignItems: 'center', gap: 10, height: 40, padding: '0 18px 0 12px', borderRadius: 22, background: 'rgba(255,255,255,.85)', boxShadow: '0 0 0 1px rgba(20,28,60,.07), 0 8px 20px -12px rgba(20,28,70,.3)', color: '#3A3F55', font: `600 15px/1 ${UI_FONT}`, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' })}>
      <span style={{ width: 20, height: 20, display: 'grid', placeItems: 'center' }}>{icon}</span>
      {text}
    </div>
  )
}
