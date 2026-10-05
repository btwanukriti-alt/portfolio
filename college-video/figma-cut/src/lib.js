// Timing, easing and shared tokens. Everything on screen is a pure function of the clock `t`
// (seconds), so the piece can be seeked, paused and frame-captured exactly.

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
export const lerp = (a, b, u) => a + (b - a) * u

// Figma-style motion: snappy ease-outs for entrances, a small spring pop for objects landing,
// smooth in-out for camera moves and frame wipes.
export const E = {
  inOut: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  out: (x) => 1 - Math.pow(1 - x, 4),
  expo: (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
  back: (x) => {
    const s = 1.55
    return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2)
  },
}

// Progress of `t` through [a, b], eased.
export const P = (t, a, b, e = E.out) => e(clamp((t - a) / (b - a)))

// Keyframed point / number: keys = [[time, value], ...], values are numbers or {x, y}.
export const kf = (t, keys, e = E.inOut) => {
  const mix = (a, b, u) => {
    if (typeof a === 'number') return lerp(a, b, u)
    const o = {}
    for (const k in a) o[k] = lerp(a[k], b[k], u)
    return o
  }
  if (t <= keys[0][0]) return keys[0][1]
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i]
    const [t1, v1] = keys[i + 1]
    if (t <= t1) return mix(v0, v1, e((t - t0) / (t1 - t0 || 1)))
  }
  return keys[keys.length - 1][1]
}

// A click at time tc: press is 0..1 (1 = fully pressed), ripple is 0..1 (0 = not running).
export const press = (t, tc) => (t < tc - 0.1 || t > tc + 0.22 ? 0 : t < tc ? (t - tc + 0.1) / 0.1 : 1 - (t - tc) / 0.22)
export const ripple = (t, tc) => (t < tc || t > tc + 0.6 ? 0 : (t - tc) / 0.6)

// Small idle sway so resting cursors feel alive.
export const sway = (t, seed, amp = 6) => ({
  x: Math.sin(t * 1.3 + seed) * amp,
  y: Math.cos(t * 1.1 + seed * 1.7) * amp * 0.7,
})

export const fmt = (v, d = 0) =>
  Number(v).toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d })

// College management UI tokens (sampled from the Figma frames, section "Dhondi" 267:97221).
export const C = {
  ink: '#0F1729',
  t2: '#2A3247',
  sub: '#667085',
  faint: '#98A2B3',
  page: '#F4F6F9',
  line: '#E6E9EF',
  line2: '#F0F2F5',
  primary: '#1D4ED8',
  link: '#1E3A8A',
  pSoft: '#E8EEFC',
  navy: '#0B1F44',
  navy2: '#163A73',
  green: '#16A34A',
  gSoft: '#E5F6EC',
  mint: '#5EE0A1',
  amber: '#F5A524',
  aSoft: '#FFF4DE',
  red: '#F0532D',
  rSoft: '#FDECE7',
  violet: '#6D5BF5',
  vSoft: '#EFECFF',
  pink: '#E0457F',
  teal: '#0FA6A0',
  sky: '#60A5FA',
}

// Figma editor colours (selection, components, spacing, prototype noodles).
export const FIG = { sel: '#0D99FF', comp: '#9747FF', spacing: '#F24822', proto: '#0D99FF' }

export const UI_FONT = "'Poppins', ui-sans-serif, system-ui, sans-serif"

// Scenes and their stage colours. A frame wipe in the next colour opens each scene.
// One lilac background for the whole piece.
export const BG = '#DCCFFF'
export const SCENES = [
  { id: 'hook', a: 0, b: 3.6 },
  { id: 'flow', a: 3.6, b: 7.6 },
  { id: 'modules', a: 7.6, b: 10.0 },
]
export const DURATION = 10.0
// Paused poster frame (embed before it first plays, and reduced motion).
export const POSTER = 2.8

// Stage sizes: landscape and portrait compositions, each scaled to fit the viewport.
export const STAGES = { land: { W: 1920, H: 1080 }, port: { W: 1080, H: 1920 } }
