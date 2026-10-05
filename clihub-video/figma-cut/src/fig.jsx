// Figma editor vocabulary drawn inside the canvas, in stage coordinates.
// Settled look: blue selections, purple component labels, prototype noodle, pink auto-layout
// gaps and a single unnamed dark cursor.
import { FIG, clamp } from './lib.js'

const LABEL = { fontFamily: "'Inter', 'Outfit', system-ui, sans-serif", fontWeight: 500 }

function Handle({ x, y, s = 10 }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x - s / 2,
        top: y - s / 2,
        width: s,
        height: s,
        boxSizing: 'border-box',
        background: '#fff',
        border: `1.5px solid ${FIG.blue}`,
      }}
    />
  )
}

function ComponentIcon({ size = 14, color = FIG.purple }) {
  const d = size / 4.4
  const c = size / 2
  const diamond = (x, y) => `M${x} ${y - d}L${x + d} ${y}L${x} ${y + d}L${x - d} ${y}Z`
  return (
    <svg width={size} height={size} style={{ display: 'block', flex: 'none' }}>
      <path d={[diamond(c, c - d * 1.05), diamond(c + d * 1.05, c), diamond(c, c + d * 1.05), diamond(c - d * 1.05, c)].join('')} fill={color} />
    </svg>
  )
}

// A blue selection box with corner handles, an optional size pill below and an optional
// purple component label (or grey frame name) above.
export function Selection({ x, y, w, h, opacity = 1, size, component, frameName }) {
  if (opacity <= 0.001) return null
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, boxSizing: 'border-box', border: `2px solid ${FIG.blue}` }} />
      {[
        [x, y],
        [x + w, y],
        [x, y + h],
        [x + w, y + h],
      ].map(([hx, hy], i) => (
        <Handle key={i} x={hx} y={hy} />
      ))}
      {component && (
        <div style={{ ...LABEL, position: 'absolute', left: x, top: y - 30, display: 'flex', alignItems: 'center', gap: 6, color: FIG.purple, fontSize: 17, whiteSpace: 'nowrap' }}>
          <ComponentIcon size={15} />
          {component}
        </div>
      )}
      {frameName && <FrameLabel x={x} y={y} name={frameName} />}
      {size && (
        <div
          style={{
            ...LABEL,
            position: 'absolute',
            left: x + w / 2,
            top: y + h + 12,
            transform: 'translateX(-50%)',
            background: FIG.blue,
            color: '#fff',
            fontSize: 15,
            lineHeight: '24px',
            padding: '0 8px',
            borderRadius: 5,
            whiteSpace: 'nowrap',
          }}
        >
          {size}
        </div>
      )}
    </div>
  )
}

export function FrameLabel({ x, y, name, opacity = 1 }) {
  return (
    <div style={{ ...LABEL, position: 'absolute', left: x, top: y - 28, color: '#5B5675', fontSize: 16, opacity, whiteSpace: 'nowrap' }}>{name}</div>
  )
}

// Cubic point and tangent.
const bez = (p0, p1, p2, p3, s) => {
  const m = 1 - s
  return [
    m * m * m * p0[0] + 3 * m * m * s * p1[0] + 3 * m * s * s * p2[0] + s * s * s * p3[0],
    m * m * m * p0[1] + 3 * m * m * s * p1[1] + 3 * m * s * s * p2[1] + s * s * s * p3[1],
  ]
}

// Prototype noodle from a to b, drawn by path length (p 0..1). dir: 'h' or 'v' exits.
export function Noodle({ a, b, p, opacity = 1, dir = 'h', label = 'On click' }) {
  if (opacity <= 0.001 || p <= 0) return null
  const k = dir === 'h' ? Math.abs(b[0] - a[0]) * 0.5 : Math.abs(b[1] - a[1]) * 0.5
  const c1 = dir === 'h' ? [a[0] + k, a[1]] : [a[0], a[1] + k]
  const c2 = dir === 'h' ? [b[0] - k, b[1]] : [b[0], b[1] - k]
  const N = 60
  const pts = Array.from({ length: N + 1 }, (_, i) => bez(a, c1, c2, b, i / N))
  let len = 0
  for (let i = 1; i <= N; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
  const d = `M${a[0]} ${a[1]}C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${b[0]} ${b[1]}`
  const tip = bez(a, c1, c2, b, clamp(p))
  const prev = bez(a, c1, c2, b, clamp(p - 0.02))
  const ang = Math.atan2(tip[1] - prev[1], tip[0] - prev[0])
  const mid = pts[N / 2]
  const lp = clamp((p - 0.45) / 0.25)
  const L = 14
  const head = [
    [tip[0], tip[1]],
    [tip[0] - L * Math.cos(ang - 0.45), tip[1] - L * Math.sin(ang - 0.45)],
    [tip[0] - L * Math.cos(ang + 0.45), tip[1] - L * Math.sin(ang + 0.45)],
  ]
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity, pointerEvents: 'none' }}>
      <svg width={1920} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <path d={d} fill="none" stroke={FIG.blue} strokeWidth={3} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - clamp(p))} />
        <polygon points={head.map((q) => q.join(',')).join(' ')} fill={FIG.blue} opacity={clamp(p * 6)} />
        <circle cx={a[0]} cy={a[1]} r={7} fill="#fff" stroke={FIG.blue} strokeWidth={3} />
      </svg>
      <div
        style={{
          ...LABEL,
          position: 'absolute',
          left: mid[0],
          top: mid[1],
          transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * lp})`,
          opacity: lp,
          background: FIG.blue,
          color: '#fff',
          fontSize: 16,
          lineHeight: '28px',
          padding: '0 12px',
          borderRadius: 14,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(13,153,255,0.25)',
        }}
      >
        {label}
      </div>
    </div>
  )
}

// Auto-layout gap marker: pink hatched band with its value.
export function Spacing({ x, y, w, h, value = 24, opacity = 1 }) {
  if (opacity <= 0.001) return null
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, opacity, pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `repeating-linear-gradient(-45deg, rgba(242,72,34,0.55) 0 2px, rgba(242,72,34,0.12) 2px 7px)`,
        }}
      />
      <div
        style={{
          ...LABEL,
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%,-50%)',
          background: FIG.pink,
          color: '#fff',
          fontSize: 14,
          lineHeight: '22px',
          padding: '0 7px',
          borderRadius: 4,
        }}
      >
        {value}
      </div>
    </div>
  )
}

// One dark cursor, no name tag. press 0..1 scales it slightly; ripple 0..1 is the click ring.
export function Cursor({ x, y, press = 0, ripple = 0, opacity = 1 }) {
  if (opacity <= 0.001) return null
  const s = 1 - 0.12 * Math.sin(Math.PI * clamp(press))
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity, pointerEvents: 'none', zIndex: 50 }}>
      {ripple > 0 && ripple < 1 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: 'rgba(60,60,70,0.28)',
            transform: `translate(-50%,-50%) scale(${0.2 + 0.8 * ripple})`,
            opacity: 1 - ripple,
          }}
        />
      )}
      <svg width={34} height={40} viewBox="0 0 17 20" style={{ position: 'absolute', left: -3, top: -2, transform: `scale(${s})`, transformOrigin: '3px 2px', filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.25))' }}>
        <path d="M2 1.5 L2 16.5 L6 12.8 L8.6 18.5 L11.2 17.4 L8.7 11.8 L14 11.6 Z" fill="#111" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
