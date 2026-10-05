// Timing helpers and tokens. Every frame is a pure function of the clock t (seconds).

export const DURATION = 10

// Scene windows: intro, feature, close.
export const SCENES = { intro: [0, 3.6], feature: [3.6, 7.6], close: [7.6, 10] }

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const lerp = (a, b, p) => a + (b - a) * p
// Progress of t through [start, start + dur], 0..1.
export const prog = (t, start, dur) => clamp((t - start) / dur)

export const ease = {
  // Entrances: snappy expo out.
  out: (p) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p)),
  // Landings: a small back pop.
  pop: (p) => {
    const c = 1.25
    return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2)
  },
  // Moves: smooth in-out.
  inOut: (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
  outCubic: (p) => 1 - Math.pow(1 - p, 3),
}

export const at = (t, start, dur, fn = ease.out) => fn(prog(t, start, dur))

// Scene envelope: fades and lifts in at the start, everything leaves together at the end.
export function sceneEnvelope(t, [a, b], { fadeIn = 0.4, fadeOut = 0.45 } = {}) {
  if (t < a || t > b) return { on: false, opacity: 0, y: 0 }
  const i = at(t, a, fadeIn, ease.outCubic)
  const o = ease.inOut(prog(t, b - fadeOut, fadeOut))
  return { on: true, opacity: Math.min(i, 1 - o), y: (1 - i) * 14 - o * 22 }
}

// Canvas
export const BG = '#B9C7DB' // grey-blue, chosen by Anu for this cut (default lilac #DCCFFF)
export const MARGIN = '#F4F2FA'
export const INK = '#0F1222'
export const EYEBROW = '#3D3A5C'

// Figma editor
export const FIG = { blue: '#0D99FF', purple: '#9747FF', pink: '#F24822', frame: '#111' }

// Product UI (dark desktop app, from the Figma file)
export const UI = {
  app: '#16161B',
  side: '#0F0F13',
  top: '#121217',
  card: '#1D1D24',
  cardHi: '#23232B',
  line: '#2A2A33',
  text: '#ECECF2',
  sub: '#9A9AA8',
  dim: '#6B6B78',
  purple: '#8B3DFF',
  tagBg: '#2A2346',
  tag: '#C7B4FF',
  green: '#4CC38A',
  cyan: '#3BB6F5',
  amber: '#F5A524',
  ubuntu: '#E95420',
  btn: '#34343E',
  font: "'Outfit', system-ui, sans-serif",
}
