// The cursor: a dark arrow with a white edge. (x, y) is the tip; `pr` = press 0..1,
// `rp` = click ripple 0..1.
import { E } from './lib.js'

export function Cursor({ x, y, o = 1, pr = 0, rp = 0, s = 1.5 }) {
  if (o <= 0.001) return null
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity: o, zIndex: 50, pointerEvents: 'none' }}>
      {rp > 0 && (
        <div style={{ position: 'absolute', width: 70 * s, height: 70 * s, left: -35 * s, top: -35 * s, borderRadius: '50%', background: 'rgba(15,18,34,.12)', transform: `scale(${0.2 + 0.8 * E.out(rp)})`, opacity: 1 - rp }} />
      )}
      <svg width={26 * s} height={28 * s} viewBox="0 0 26 28" style={{ display: 'block', overflow: 'visible', transform: `scale(${1 - 0.14 * pr})`, transformOrigin: '2px 2px', filter: 'drop-shadow(0 3px 6px rgba(10,14,40,.25))' }}>
        <path d="M2 1.5 L2 22 L7.6 16.9 L11.4 25.4 L15 23.8 L11.3 15.5 L19 15.2 Z" fill="#0F1222" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
