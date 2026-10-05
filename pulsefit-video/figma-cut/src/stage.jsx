// The stage: one lilac background for the whole piece with a few soft pastel shapes drifting,
// and the black Figma-style selection frame (corner handles) that the canvas sits inside.
import { BG } from './lib.js'

// Shapes in viewport units: cx/cy as fractions, size as a fraction of the longer side (M).
// pcy: position override for portrait viewports.
const SHAPES = [
  { k: 'circle', cx: 0.05, cy: 0.92, d: 0.3, c: '#FFC2DD' },
  { k: 'pill', cx: 0.94, cy: 0.13, w: 0.26, h: 0.09, r: 22, c: '#FFE07A' },
  { k: 'star', cx: 0.93, cy: 0.86, pcy: 0.9, d: 0.1, c: '#A48CFF' },
  { k: 'ring', cx: 0.07, cy: 0.12, pcy: 0.07, d: 0.13, c: 'rgba(255,255,255,.7)' },
]
function Shape({ s, M, vw, vh, t, i }) {
  const port = vw / vh < 0.9
  const x = s.cx * vw + Math.sin(t * 0.35 + i * 1.9) * M * 0.01
  const y = (port && s.pcy != null ? s.pcy : s.cy) * vh + Math.cos(t * 0.3 + i * 1.3) * M * 0.01
  const base = { position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${(s.r || 0) + Math.sin(t * 0.4 + i) * 4}deg)` }
  const d = (s.d || 0) * M
  if (s.k === 'circle') return <div style={{ ...base, width: d, height: d, borderRadius: '50%', background: s.c }} />
  if (s.k === 'ring') return <div style={{ ...base, width: d, height: d, borderRadius: '50%', border: `${d * 0.12}px solid ${s.c}`, boxSizing: 'border-box' }} />
  if (s.k === 'pill') return <div style={{ ...base, width: s.w * M, height: s.h * M, borderRadius: s.h * M, background: s.c }} />
  return (
    <svg width={d} height={d} viewBox="0 0 100 100" style={{ ...base, overflow: 'visible' }}>
      <path d="M50 2 61 34 96 36 68 57 79 92 50 71 21 92 32 57 4 36 39 34z" fill={s.c} />
    </svg>
  )
}

const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>')}")`

export function Backdrop({ t, vw, vh }) {
  const M = Math.max(vw, vh)
  return (
    <div style={{ position: 'absolute', inset: 0, background: BG, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(70% 60% at 50% 40%, rgba(255,255,255,.35), transparent 70%)' }} />
      {SHAPES.map((s, i) => (
        <Shape key={i} s={s} M={M} vw={vw} vh={vh} t={t} i={i} />
      ))}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: GRAIN, opacity: 0.12, mixBlendMode: 'overlay' }} />
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
