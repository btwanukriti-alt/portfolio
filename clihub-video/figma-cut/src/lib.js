// Timing helpers and tokens. Every frame is a pure function of the clock t (seconds).

export const DURATION = 11.6

// Scene windows overlap slightly for the zoom-through hand-offs.
export const SCENES = { hub: [0, 3.4], connect: [3.2, 7.0], features: [6.8, 11.6] }

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const lerp = (a, b, p) => a + (b - a) * p
// Progress of t through [start, start + dur], 0..1.
export const prog = (t, start, dur) => clamp((t - start) / dur)

export const ease = {
  out: (p) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p)),
  pop: (p) => {
    const c = 1.4
    return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2)
  },
  inOut: (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
  outCubic: (p) => 1 - Math.pow(1 - p, 3),
  in: (p) => p * p * p,
}

export const at = (t, start, dur, fn = ease.out) => fn(prog(t, start, dur))

// Canvas: built on Anu's grey-blue swatch (#B9C7DB).
export const BG = { mid: '#C3CFE0', edge: '#A9B8CF', hi: '#E3E9F2' }
export const INK = '#0E1424'
export const SUB = '#47526B'

// Product UI (dark desktop app, from the Figma file)
export const UI = {
  app: '#16161B',
  side: '#0F0F13',
  card: '#1D1D24',
  cardHi: '#23232B',
  line: '#2A2A33',
  text: '#ECECF2',
  sub: '#9A9AA8',
  dim: '#6B6B78',
  purple: '#8B3DFF',
  violet: '#B9A2FF',
  tagBg: '#2A2346',
  tag: '#C7B4FF',
  green: '#4CC38A',
  cyan: '#3BB6F5',
  amber: '#F5A524',
  ubuntu: '#E95420',
  font: "'Outfit', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
}
