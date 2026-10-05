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
  Number(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })

// Trading platform UI tokens (sampled from the Figma frames, "Desktop" section 2804:259012:
// Trading Terminal, Alerts, Notifications, Chatbot and Quantlab). A dark navy product UI
// sitting on the light Figma canvas.
export const C = {
  title: '#0F1222',
  app: '#050730',
  panel: '#0A0F3E',
  panel2: '#0E1550',
  field: '#0B1146',
  line: 'rgba(132,150,255,.16)',
  line2: 'rgba(132,150,255,.09)',
  ink: '#EEF1FF',
  t2: '#C5CBF0',
  sub: '#8C95C6',
  faint: '#5D6699',
  primary: '#4C7DFF',
  pSoft: 'rgba(76,125,255,.18)',
  link: '#5AA2FF',
  green: '#2BD9A0',
  gSoft: 'rgba(43,217,160,.14)',
  red: '#FF5470',
  rSoft: 'rgba(255,84,112,.16)',
  amber: '#F6A623',
  violet: '#8B5CF6',
  cyan: '#22D3EE',
  btc: '#F7931A',
}

// Figma editor colours (selection, components, spacing, prototype noodles).
export const FIG = { sel: '#0D99FF', comp: '#9747FF', spacing: '#F24822', proto: '#0D99FF' }

export const UI_FONT = "'Poppins', ui-sans-serif, system-ui, sans-serif"
// The product's own type (Geist), used inside the rebuilt UI only.
export const APP_FONT = "'Geist Sans', 'Geist', ui-sans-serif, system-ui, sans-serif"
export const MONO = "'Geist Mono', ui-monospace, monospace"

// Scenes and their stage colours. A frame wipe in the next colour opens each scene.
// One soft blue background for the whole piece.
export const BG = '#CFDDFF'
// Scene lengths are written in scene-local seconds; SLOW stretches every scene uniformly so the
// piece reads calmly for a first-time viewer (motion and holds both get longer).
export const SLOW = 1.2
const LEN = [['research', 5.0], ['alert', 3.2], ['notify', 3.0], ['disc', 4.3], ['library', 3.3]]
export const SCENES = LEN.reduce((acc, [id, d]) => {
  const a = acc.length ? acc[acc.length - 1].b : 0
  return [...acc, { id, a, b: +(a + d * SLOW).toFixed(3) }]
}, [])
export const DURATION = SCENES[SCENES.length - 1].b
// Paused poster frame (embed before it first plays, and reduced motion).
export const POSTER = 5.2

// Stage sizes: landscape and portrait compositions, each scaled to fit the viewport.
export const STAGES = { land: { W: 1920, H: 1080 }, port: { W: 1080, H: 1920 } }
