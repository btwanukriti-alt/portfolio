// Figma editor vocabulary, drawn in stage coordinates: the cursor, selection boxes, component
// labels, prototype noodles and auto-layout spacing.
import { E, FIG, UI_FONT, clamp } from './lib.js'

const abs = (x, y, extra) => ({ position: 'absolute', left: x, top: y, ...extra })

// Cursor: a dark arrow with a white edge (one designer, so no name tag).
// (x, y) is the arrow tip. `pr` = press 0..1, `rp` = click ripple 0..1.
export function Cursor({ x, y, o = 1, pr = 0, rp = 0, s = 1.5 }) {
  if (o <= 0.001) return null
  return (
    <div style={abs(x, y, { opacity: o, zIndex: 50, pointerEvents: 'none' })}>
      {rp > 0 && <div style={abs(0, 0, { width: 80 * s, height: 80 * s, marginLeft: -40 * s, marginTop: -40 * s, borderRadius: '50%', background: 'rgba(17,17,17,.12)', transform: `scale(${0.15 + 0.85 * E.out(rp)})`, opacity: 1 - rp })} />}
      <div style={{ transform: `scale(${s * (1 - 0.16 * pr)})`, transformOrigin: '0 0' }}>
        <svg width="26" height="28" viewBox="0 0 26 28" style={{ display: 'block', overflow: 'visible', filter: 'drop-shadow(0 3px 6px rgba(10,14,40,.28))' }}>
          <path d="M2 1.5 L2 22 L7.6 16.9 L11.4 25.4 L15 23.8 L11.3 15.5 L19 15.2 Z" fill="#111" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
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
