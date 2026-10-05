// The stage: one warm gradient background for the whole piece (plain, no shapes), and the black
// Figma-style selection frame (corner handles) that the canvas sits inside.
import { BG } from './lib.js'
import WARM from './assets/bg-warm.jpg'

// eslint-disable-next-line no-unused-vars
const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>')}")`

// The warm grainy gradient (a portrait image). In landscape it is turned 90° so the whole
// gradient still fills the canvas instead of being cropped to a thin band.
export function Backdrop({ w, h }) {
  const land = w >= h
  const img = { position: 'absolute', backgroundImage: `url(${WARM})`, backgroundSize: 'cover', backgroundPosition: 'center' }
  return (
    <div style={{ position: 'absolute', inset: 0, background: BG, overflow: 'hidden' }}>
      {land ? <div style={{ ...img, left: (w - h) / 2, top: (h - w) / 2, width: h, height: w, transform: 'rotate(90deg)' }} /> : <div style={{ ...img, inset: 0 }} />}
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
