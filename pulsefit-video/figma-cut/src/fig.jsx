// Figma editor vocabulary, drawn in stage coordinates: multiplayer cursors, selection boxes,
// component labels, prototype noodles, comment pins, auto-layout spacing, the canvas toolbar,
// plus the headline and the sticker shapes.
import { E, FIG, HEAD_FONT, P, PEOPLE, UI_FONT, clamp, lerp } from './lib.js'

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

// Prototype connection: blue noodle from (x1,y1) to (x2,y2) drawn by u (0..1), with a start dot
// and an arrowhead once it lands. `vertical` bends the curve top-to-bottom instead of sideways.
export function Noodle({ x1, y1, x2, y2, u, vertical = false, label }) {
  if (u <= 0) return null
  const d = vertical
    ? `M${x1} ${y1} C${x1} ${(y1 + y2) / 2} ${x2} ${(y1 + y2) / 2} ${x2} ${y2}`
    : `M${x1} ${y1} C${(x1 + x2) / 2} ${y1} ${(x1 + x2) / 2} ${y2} ${x2} ${y2}`
  const head = clamp((u - 0.85) / 0.15)
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  return (
    <>
      <svg style={abs(0, 0, { overflow: 'visible', zIndex: 30 })} width="1" height="1">
        <path d={d} fill="none" stroke={FIG.proto} strokeWidth="4" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - u} />
        <circle cx={x1} cy={y1} r="8" fill="#fff" stroke={FIG.proto} strokeWidth="4" />
        <g opacity={head} transform={`translate(${x2} ${y2}) rotate(${vertical ? 90 : 0})`}>
          <path d="M-16 -10 L0 0 L-16 10" fill="none" stroke={FIG.proto} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
      {label && (
        <div style={abs(mx, my, { transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * E.back(clamp((u - 0.4) / 0.4))})`, opacity: clamp((u - 0.4) / 0.3), background: FIG.proto, color: '#fff', font: `600 15px/1 ${UI_FONT}`, padding: '8px 12px', borderRadius: 8, whiteSpace: 'nowrap', zIndex: 31, display: 'flex', alignItems: 'center', gap: 6 })}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11V5.5a2 2 0 014 0V11M13 9.5a2 2 0 014 0V12M17 11a2 2 0 014 0v3.5a6.5 6.5 0 01-6.5 6.5H13a6 6 0 01-4.6-2.2L5 14.5a2 2 0 013-2.6L9 13" /></svg>
          {label}
        </div>
      )}
    </>
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

// Auto-layout spacing marker (Figma's pink gap indicator) between two edges at x1..x2.
export function Spacing({ x1, x2, y, h, o, value }) {
  if (o <= 0) return null
  return (
    <div style={abs(x1, y, { width: x2 - x1, height: h, opacity: o, zIndex: 35 })}>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, rgba(242,72,34,.28) 0 3px, transparent 3px 7px)' }} />
      <div style={abs((x2 - x1) / 2, h / 2, { transform: 'translate(-50%,-50%)', background: FIG.spacing, color: '#fff', font: `600 13px/1 ${UI_FONT}`, padding: '4px 6px', borderRadius: 4 })}>{value}</div>
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

// Headline: words rise out of a mask, staggered; `hi` marks words set in a sticker pill.
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
export function Tag({ x, y, text, u, out = 0, dark = false, icon }) {
  const p = E.back(clamp(u / 0.5))
  return (
    <div style={abs(x, y, { transform: `translateX(-50%) scale(${1.35 * (0.6 + 0.4 * p)})`, transformOrigin: '50% 0', opacity: clamp(u / 0.25) * (1 - out), display: 'flex', alignItems: 'center', gap: 10, height: 44, padding: '0 18px 0 12px', borderRadius: 22, background: dark ? 'rgba(15,18,34,.9)' : 'rgba(255,255,255,.18)', border: dark ? 'none' : '1.5px solid rgba(255,255,255,.35)', color: '#fff', font: `600 17px/1 ${UI_FONT}`, letterSpacing: '0.12em', textTransform: 'uppercase', backdropFilter: 'blur(8px)', whiteSpace: 'nowrap' })}>
      <span style={{ width: 24, height: 24, borderRadius: 12, background: '#fff', display: 'grid', placeItems: 'center' }}>{icon}</span>
      {text}
    </div>
  )
}

// Sticker shapes for the canvas.
export function Sticker({ kind, x, y, s, color, u, rot = 0 }) {
  if (u <= 0) return null
  const p = E.back(clamp(u / 0.6))
  const shape = {
    star: <path d="M50 2 61 34 96 36 68 57 79 92 50 71 21 92 32 57 4 36 39 34z" fill={color} />,
    burst: <path d="M50 0 58 22 80 10 74 34 98 38 78 52 96 70 72 70 74 96 54 80 44 100 36 76 12 88 20 64 0 52 22 40 8 18 32 22z" fill={color} />,
    squiggle: <path d="M6 60 C 20 20, 34 20, 40 50 S 62 80, 70 44 S 90 14, 96 40" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />,
    pill: <rect x="2" y="30" width="96" height="40" rx="20" fill={color} />,
  }[kind]
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" style={abs(x - s / 2, y - s / 2, { transform: `scale(${p}) rotate(${rot + (1 - p) * -40}deg)`, overflow: 'visible', zIndex: 5 })}>
      {shape}
    </svg>
  )
}

export const lerpRect = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), w: lerp(a.w, b.w, u), h: lerp(a.h, b.h, u) })
