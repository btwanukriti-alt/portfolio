// The canvas: a soft gradient built on the grey-blue swatch, a slow drifting light, a purple
// glow that follows the focal point, and faint grain. Full bleed, no frame.
import { BG, DURATION } from './lib.js'

export function Background({ t, w, h, glow }) {
  const a = (t / DURATION) * Math.PI * 2
  const u = Math.min(w, h)
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: `radial-gradient(ellipse 80% 75% at 50% 45%, ${BG.mid}, ${BG.edge})` }}>
      {/* Drifting white light (closed path, so the loop has no jump). */}
      <div
        style={{
          position: 'absolute',
          left: w * (0.5 + 0.18 * Math.cos(a)),
          top: h * (0.42 + 0.1 * Math.sin(a)),
          width: u * 1.3,
          height: u * 1.0,
          transform: 'translate(-50%,-50%)',
          background: `radial-gradient(closest-side, ${BG.hi}, rgba(227,233,242,0))`,
          opacity: 0.75,
        }}
      />
      {/* Product-purple glow behind the focal element. */}
      {glow && (
        <div
          style={{
            position: 'absolute',
            left: glow.x,
            top: glow.y,
            width: glow.r * 2,
            height: glow.r * 2,
            transform: 'translate(-50%,-50%)',
            background: 'radial-gradient(closest-side, rgba(139,61,255,0.28), rgba(139,61,255,0))',
            opacity: glow.o,
          }}
        />
      )}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.1, mixBlendMode: 'overlay' }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  )
}
