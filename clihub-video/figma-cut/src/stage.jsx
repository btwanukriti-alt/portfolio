// The canvas: one lilac pastel, soft drifting shapes, a key light and grain, clipped inside a
// black Figma selection frame inset from the viewport edges. Settled look; don't restyle per product.
import { BG, MARGIN, FIG, DURATION } from './lib.js'

// Frame inset: about 2.2% of the short side, clamped to 10-28px.
export const frameInset = (w, h) => Math.round(Math.min(28, Math.max(10, Math.min(w, h) * 0.022)))

const loop = (t) => (t / DURATION) * Math.PI * 2

function Star({ size, color }) {
  const pts = []
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? size * 0.24 : size / 2
    const a = (Math.PI / 5) * i - Math.PI / 2
    pts.push(`${size / 2 + r * Math.cos(a)},${size / 2 + r * Math.sin(a)}`)
  }
  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      <polygon points={pts.join(' ')} fill={color} strokeLinejoin="round" stroke={color} strokeWidth={size * 0.06} />
    </svg>
  )
}

export function Background({ t, w, h }) {
  const u = Math.min(w, h)
  const a = loop(t)
  // Each shape drifts on a slow closed path, so the loop has no jump.
  const drift = (k, r) => [Math.cos(a + k) * r * u, Math.sin(a * 1 + k * 1.7) * r * u]
  const shapes = [
    { x: 0.07, y: 0.2, k: 0, el: <div style={{ width: u * 0.2, height: u * 0.2, borderRadius: '50%', background: '#FFC2DD' }} /> },
    { x: 0.88, y: 0.8, k: 2, el: <div style={{ width: u * 0.3, height: u * 0.11, borderRadius: u, background: '#FFE07A', transform: 'rotate(-18deg)' }} /> },
    { x: 0.93, y: 0.16, k: 4, el: <Star size={u * 0.12} color="#A48CFF" /> },
    { x: 0.1, y: 0.86, k: 1, el: <div style={{ width: u * 0.15, height: u * 0.15, borderRadius: '50%', border: `${u * 0.022}px solid #fff`, boxSizing: 'border-box', opacity: 0.85 }} /> },
  ]
  return (
    <div style={{ position: 'absolute', inset: 0, background: BG, overflow: 'hidden' }}>
      {shapes.map((s, i) => {
        const [dx, dy] = drift(s.k, 0.012)
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: s.x * w + dx,
              top: s.y * h + dy,
              transform: `translate(-50%,-50%) rotate(${Math.sin(a + s.k) * 6}deg)`,
              opacity: 0.9,
            }}
          >
            {s.el}
          </div>
        )
      })}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 55% 50% at 50% 48%, rgba(255,255,255,0.5), rgba(255,255,255,0) 70%)',
        }}
      />
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.12, mixBlendMode: 'overlay' }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  )
}

// The whole video shown as a selected Figma frame: 1.5px #111 border and white corner handles.
export function CanvasFrame({ w, h, d }) {
  const hs = 8
  const corners = [
    [d, d],
    [w - d, d],
    [d, h - d],
    [w - d, h - d],
  ]
  return (
    <>
      <div style={{ position: 'absolute', left: d, top: d, width: w - 2 * d, height: h - 2 * d, boxSizing: 'border-box', border: `1.5px solid ${FIG.frame}`, pointerEvents: 'none' }} />
      {corners.map(([x, y], i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x - hs / 2,
            top: y - hs / 2,
            width: hs,
            height: hs,
            boxSizing: 'border-box',
            background: '#fff',
            border: `1.5px solid ${FIG.frame}`,
          }}
        />
      ))}
    </>
  )
}

export { MARGIN }
