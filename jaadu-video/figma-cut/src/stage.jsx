// The stage: one light, muted abstract background for the whole piece, and the black
// Figma-style selection frame (corner handles) that the canvas sits inside.
import { BG, DURATION } from './lib.js'

const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>')}")`

// Soft abstract mesh behind the canvas: a few large, heavily blurred blobs in muted blues and
// lavender on a light dull base, like a Figma cover. They drift very slowly, once per loop, so
// the loop stays seamless. Kept light so the dark product UI stays the focus.
const BLOBS = [
  { c: '#BCC9F0', x: 0.12, y: 0.18, r: 0.62, ax: 0.05, ay: 0.04, ph: 0 },
  { c: '#E2DBF2', x: 0.88, y: 0.3, r: 0.55, ax: 0.04, ay: 0.05, ph: 1.7 },
  { c: '#CBDDEC', x: 0.62, y: 0.95, r: 0.6, ax: 0.05, ay: 0.03, ph: 3.1 },
  { c: '#F2F4FB', x: 0.45, y: 0.42, r: 0.5, ax: 0.03, ay: 0.04, ph: 4.4 },
]
export function Backdrop({ t = 0, w = 1920, h = 1080 }) {
  const m = Math.max(w, h)
  const a = (t / DURATION) * Math.PI * 2
  return (
    <div style={{ position: 'absolute', inset: 0, background: BG, overflow: 'hidden' }}>
      {BLOBS.map((b, i) => {
        const d = b.r * m
        const x = (b.x + b.ax * Math.sin(a + b.ph)) * w - d / 2
        const y = (b.y + b.ay * Math.cos(a + b.ph)) * h - d / 2
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: d, height: d * 0.8, borderRadius: '50%', background: b.c, filter: `blur(${m * 0.08}px)`, opacity: 0.9 }} />
      })}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: GRAIN, opacity: 0.1, mixBlendMode: 'overlay' }} />
    </div>
  )
}

// Inset of the black selection frame from the viewport edges.
export const frameInset = (vw, vh) => Math.round(Math.max(10, Math.min(28, Math.min(vw, vh) * 0.022)))

// Black selection frame around the canvas, inset from the edges, with corner handles. The canvas
// itself is clipped to the inside of this frame (see App).
export function CanvasFrame({ vw, vh }) {
  const m = frameInset(vw, vh)
  const hs = Math.round(Math.max(7, Math.min(11, Math.min(vw, vh) * 0.009)))
  const handle = (left, top) => <div key={`${left}${top}`} style={{ position: 'absolute', left: left - hs / 2, top: top - hs / 2, width: hs, height: hs, background: '#fff', border: '1.5px solid #111', boxSizing: 'border-box' }} />
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 90 }}>
      <div style={{ position: 'absolute', left: m, top: m, right: m, bottom: m, border: '1.5px solid #111' }} />
      {handle(m, m)}
      {handle(vw - m, m)}
      {handle(m, vh - m)}
      {handle(vw - m, vh - m)}
    </div>
  )
}
