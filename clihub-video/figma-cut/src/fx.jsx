// Motion effects shared by the scenes. All take progress or t; nothing keeps state.
import { clamp, ease, prog, INK, SUB, UI } from './lib.js'

// Headline: a small pill label, then the words rise out of a blur one by one.
export function Headline({ t, start, end, label, text, top, width, size, align = 'center' }) {
  const out = ease.inOut(prog(t, end - 0.4, 0.4))
  if (t < start || out >= 1) return null
  const words = text.split(' ')
  const pill = ease.out(prog(t, start, 0.5))
  return (
    <div style={{ position: 'absolute', left: 0, top, width, textAlign: align, opacity: 1 - out, transform: `translateY(${-18 * out}px)`, filter: out > 0 ? `blur(${8 * out}px)` : 'none' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 18px 8px 14px',
          borderRadius: 40,
          background: 'rgba(255,255,255,0.55)',
          border: '1px solid rgba(255,255,255,0.8)',
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 500,
          fontSize: 18,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: SUB,
          opacity: pill,
          transform: `translateY(${10 * (1 - pill)}px)`,
          boxShadow: '0 6px 20px rgba(40,50,90,0.08)',
        }}
      >
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: UI.purple, boxShadow: `0 0 0 4px rgba(139,61,255,0.18)` }} />
        {label}
      </div>
      <div
        style={{
          marginTop: 18,
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 600,
          fontSize: size,
          lineHeight: 1.08,
          letterSpacing: '-0.04em',
          color: INK,
        }}
      >
        {words.map((w, i) => {
          if (w === '/') return <br key={i} />
          const p = ease.outCubic(prog(t, start + 0.15 + i * 0.08, 0.55))
          return (
            <span key={i} style={{ display: 'inline-block', marginRight: '0.26em', opacity: p, transform: `translateY(${(1 - p) * 0.45}em)`, filter: p < 1 ? `blur(${(1 - p) * 10}px)` : 'none' }}>
              {w}
            </span>
          )
        })}
      </div>
    </div>
  )
}

// A diagonal light band passing over a card (put inside an overflow-hidden, rounded box).
export function Sweep({ p, r = 16 }) {
  if (p <= 0 || p >= 1) return null
  return (
    <div style={{ position: 'absolute', inset: 0, borderRadius: r, overflow: 'hidden', pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          bottom: '-50%',
          width: '40%',
          left: `${-50 + 170 * p}%`,
          transform: 'rotate(18deg)',
          background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.16), rgba(255,255,255,0))',
        }}
      />
    </div>
  )
}

// Progress ring with a centred value.
export function Ring({ size, p, value, label, color = UI.purple }) {
  const sw = size * 0.09
  const r = (size - sw) / 2
  const c = 2 * Math.PI * r
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2C2C36" strokeWidth={sw} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - clamp(p))} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: UI.font }}>
        <div style={{ color: UI.text, fontSize: size * 0.24, fontWeight: 600, lineHeight: 1 }}>{value}</div>
        <div style={{ color: UI.sub, fontSize: size * 0.11, marginTop: size * 0.04 }}>{label}</div>
      </div>
    </div>
  )
}

// Cubic between two points with horizontal ('h') or vertical ('v') tangents.
export function curve(a, b, dir = 'h') {
  const k = dir === 'h' ? (b[0] - a[0]) * 0.5 : (b[1] - a[1]) * 0.5
  const c1 = dir === 'h' ? [a[0] + k, a[1]] : [a[0], a[1] + k]
  const c2 = dir === 'h' ? [b[0] - k, b[1]] : [b[0], b[1] - k]
  const pt = (s) => {
    const m = 1 - s
    return [0, 1].map((i) => m * m * m * a[i] + 3 * m * m * s * c1[i] + 3 * m * s * s * c2[i] + s * s * s * b[i])
  }
  let len = 0
  let prev = a
  for (let i = 1; i <= 40; i++) {
    const q = pt(i / 40)
    len += Math.hypot(q[0] - prev[0], q[1] - prev[1])
    prev = q
  }
  return { d: `M${a[0]} ${a[1]}C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${b[0]} ${b[1]}`, pt, len }
}

// A connector drawn by length (p), with glowing pulses travelling along it once drawn.
export function Beam({ c, p, pulses = [], color = UI.purple, width = 3, opacity = 1 }) {
  if (p <= 0 || opacity <= 0) return null
  return (
    <g opacity={opacity}>
      <path d={c.d} fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth={width + 4} strokeLinecap="round" strokeDasharray={c.len} strokeDashoffset={c.len * (1 - clamp(p))} />
      <path d={c.d} fill="none" stroke={color} strokeOpacity={0.55} strokeWidth={width} strokeLinecap="round" strokeDasharray={c.len} strokeDashoffset={c.len * (1 - clamp(p))} />
      {p >= 1 &&
        pulses.map((q, i) => {
          if (q <= 0 || q >= 1) return null
          const [x, y] = c.pt(q)
          const o = Math.sin(Math.PI * q)
          return (
            <g key={i} opacity={o}>
              <circle cx={x} cy={y} r={14} fill={color} opacity={0.22} />
              <circle cx={x} cy={y} r={6} fill="#fff" stroke={color} strokeWidth={3} />
            </g>
          )
        })}
    </g>
  )
}

// One dark cursor. press 0..1 scales it; ripple 0..1 is the click ring.
export function Cursor({ x, y, press = 0, ripple = 0, opacity = 1 }) {
  if (opacity <= 0.001) return null
  const s = 1 - 0.14 * Math.sin(Math.PI * clamp(press))
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity, pointerEvents: 'none', zIndex: 50 }}>
      {ripple > 0 && ripple < 1 && (
        <div
          style={{
            position: 'absolute',
            width: 90,
            height: 90,
            borderRadius: '50%',
            border: `3px solid ${UI.purple}`,
            transform: `translate(-50%,-50%) scale(${0.2 + 0.8 * ripple})`,
            opacity: 1 - ripple,
          }}
        />
      )}
      <svg width={40} height={47} viewBox="0 0 17 20" style={{ position: 'absolute', left: -4, top: -3, transform: `scale(${s})`, transformOrigin: '4px 3px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
        <path d="M2 1.5 L2 16.5 L6 12.8 L8.6 18.5 L11.2 17.4 L8.7 11.8 L14 11.6 Z" fill="#111" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

// Entrance: rise from depth with a blur, a little tilt that settles.
export const enter = (p, { y = 40, tilt = 10, scale = 0.9 } = {}) => {
  const e = ease.out(p)
  return {
    opacity: clamp(p * 2.2),
    transform: `perspective(1400px) translateY(${(1 - e) * y}px) rotateX(${(1 - e) * tilt}deg) scale(${scale + (1 - scale) * ease.pop(p)})`,
    filter: p < 1 ? `blur(${(1 - e) * 10}px)` : 'none',
  }
}
