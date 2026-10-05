// The stage: a light, muted Figma-style abstract background for the whole piece, and the black
// Figma-style selection frame (corner handles) that the canvas sits inside.
import { BG, DURATION } from './lib.js'

const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>')}")`

// Figma-style abstract background: a light, dull base with a few funky, textured forms kept to
// the edges (a wavy-striped blob, a halftone dot field, a thick grainy ribbon, a patch of plus
// marks) in muted periwinkle, lavender and slate that match the UI's blues. Everything is
// low contrast so the dark product UI stays the focus, and drifts once per loop.
const TONE = { base: '#E2E7F5', peri: '#C2CCEE', lav: '#D6CDEC', slate: '#A9B4D8', mist: '#CCDCE6' }
export function Backdrop({ t = 0, w = 1920, h = 1080 }) {
  const m = Math.min(w, h)
  const M = Math.max(w, h)
  const a = (t / DURATION) * Math.PI * 2
  const dr = (ph, amp = 0.012) => `translate(${Math.sin(a + ph) * amp * M} ${Math.cos(a + ph) * amp * M})`
  const port = h > w
  // Anchor points (fractions of the canvas), mirrored a little for portrait.
  const P = port
    ? { blob: [0.02, 0.06], dots: [0.98, 0.94], plus: [0.62, 0.02], rib: 0.8 }
    : { blob: [0.04, 0.1], dots: [0.95, 0.9], plus: [0.8, 0.04], rib: 0.72 }
  const br = 0.42 * m
  const dr2 = 0.5 * m
  const sw = 0.07 * m
  const ribbon = `M ${-0.1 * w} ${P.rib * h} C ${0.12 * w} ${(P.rib - 0.14) * h}, ${0.2 * w} ${(P.rib + 0.22) * h}, ${0.42 * w} ${(P.rib + 0.12) * h} S ${0.62 * w} ${1.05 * h}, ${0.7 * w} ${1.2 * h}`
  return (
    <div style={{ position: 'absolute', inset: 0, background: TONE.base, overflow: 'hidden' }}>
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0, display: 'block' }}>
        <defs>
          <pattern id="bg-wave" width="56" height="18" patternUnits="userSpaceOnUse">
            <path d="M0 9 C 14 1, 14 17, 28 9 S 42 1, 56 9" fill="none" stroke={TONE.peri} strokeWidth="3.2" />
          </pattern>
          <pattern id="bg-dot" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="3" fill={TONE.slate} />
          </pattern>
          <pattern id="bg-plus" width="34" height="34" patternUnits="userSpaceOnUse">
            <path d="M17 11v12M11 17h12" stroke={TONE.slate} strokeWidth="2" strokeLinecap="round" />
          </pattern>
          <radialGradient id="bg-fade">
            <stop offset="0" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="bg-dotmask"><circle cx="0" cy="0" r={dr2} fill="url(#bg-fade)" /></mask>
          <linearGradient id="bg-plusfade" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".9" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="bg-plusmask"><rect x="0" y="0" width={0.26 * M} height={0.26 * M} fill="url(#bg-plusfade)" /></mask>
          <filter id="bg-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0" />
            <feComposite operator="in" in2="SourceGraphic" />
          </filter>
          <filter id="bg-soft"><feGaussianBlur stdDeviation={0.09 * m} /></filter>
        </defs>
        {/* soft light, for depth */}
        <ellipse cx={0.55 * w} cy={0.45 * h} rx={0.45 * M} ry={0.32 * M} fill="#F3F5FB" filter="url(#bg-soft)" />
        <ellipse cx={0.85 * w} cy={0.2 * h} rx={0.25 * M} ry={0.2 * M} fill={TONE.mist} opacity=".7" filter="url(#bg-soft)" />
        {/* wavy-striped blob */}
        <g transform={`${dr(0)} translate(${P.blob[0] * w} ${P.blob[1] * h}) rotate(${-14 + 4 * Math.sin(a)})`}>
          <path d={`M ${-br} 0 C ${-br} ${-br * 0.9}, ${br * 0.7} ${-br}, ${br} ${-br * 0.2} S ${br * 0.5} ${br}, ${-br * 0.2} ${br * 0.8} S ${-br} ${br * 0.5}, ${-br} 0 Z`} fill={TONE.lav} opacity=".55" />
          <path d={`M ${-br} 0 C ${-br} ${-br * 0.9}, ${br * 0.7} ${-br}, ${br} ${-br * 0.2} S ${br * 0.5} ${br}, ${-br * 0.2} ${br * 0.8} S ${-br} ${br * 0.5}, ${-br} 0 Z`} fill="url(#bg-wave)" />
        </g>
        {/* halftone dot field */}
        <g transform={`${dr(2.1)} translate(${P.dots[0] * w} ${P.dots[1] * h})`}>
          <g mask="url(#bg-dotmask)" opacity=".55"><rect x={-dr2} y={-dr2} width={dr2 * 2} height={dr2 * 2} fill="url(#bg-dot)" /></g>
        </g>
        {/* thick grainy ribbon */}
        <g transform={dr(4.2, 0.008)}>
          <path d={ribbon} fill="none" stroke={TONE.peri} strokeWidth={sw} strokeLinecap="round" opacity=".7" />
          <path d={ribbon} fill="none" stroke="#000" strokeWidth={sw} strokeLinecap="round" filter="url(#bg-grain)" opacity=".25" />
        </g>
        {/* plus marks */}
        <g transform={`${dr(5.3, 0.006)} translate(${P.plus[0] * w} ${P.plus[1] * h})`} opacity=".6">
          <g mask="url(#bg-plusmask)"><rect width={0.26 * M} height={0.26 * M} fill="url(#bg-plus)" /></g>
        </g>
      </svg>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: GRAIN, opacity: 0.14, mixBlendMode: 'overlay' }} />
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
