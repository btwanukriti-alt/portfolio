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

// Pulsefit UI tokens (sampled from the Figma frames).
export const C = {
  ink: '#0F1222',
  t2: '#2B2F42',
  sub: '#6B7084',
  faint: '#9A9EB0',
  page: '#F5F6FA',
  line: '#E7E9F0',
  line2: '#F0F1F5',
  primary: '#1F4FF4',
  pSoft: '#ECF1FF',
  green: '#139B55',
  gSoft: '#E6F6EE',
  amber: '#D9820B',
  aSoft: '#FFF3DF',
  red: '#E0444A',
  rSoft: '#FDECEC',
  violet: '#7358F5',
  vSoft: '#F0ECFF',
  pink: '#E0457F',
  teal: '#0FB5A5',
  yellow: '#F2B21B',
}

// Figma editor colours (selection, components, spacing, prototype noodles).
export const FIG = { sel: '#0D99FF', comp: '#9747FF', spacing: '#F24822', proto: '#0D99FF' }

// Multiplayer cursors: one colour per person.
export const PEOPLE = {
  Anu: '#F76B15',
  'Apurva Jha': '#12A150',
  'Shikhar Tiwari': '#E5397A',
  'Neha Singh': '#0B8AD9',
}

export const UI_FONT = "'Poppins', ui-sans-serif, system-ui, sans-serif"
export const HEAD_FONT = "'Inter Tight', 'Poppins', ui-sans-serif, system-ui, sans-serif"

// Beats: each has an eyebrow and a headline (landscape lines / portrait lines). The camera
// flies between the screens on the canvas over the 1.2s around each beat change.
export const BEATS = [
  { id: 'overview', a: 0, b: 5.0, eyebrow: 'Gym management', land: [['Run', 'the', 'whole', 'gym', 'from', 'one\u00a0place.']], port: [['Run', 'the', 'whole', 'gym'], ['from', 'one\u00a0place.']] },
  { id: 'leads', a: 5.0, b: 11.0, eyebrow: 'Leads', land: [['Turn', 'every', 'lead', 'into', 'a', 'member.']], port: [['Turn', 'every', 'lead'], ['into', 'a', 'member.']] },
  { id: 'performance', a: 11.0, b: 16.6, eyebrow: 'Lead performance', land: [['Know', 'which', 'leads', 'convert.']], port: [['Know', 'which'], ['leads', 'convert.']] },
  { id: 'members', a: 16.6, b: 22.2, eyebrow: 'Members', land: [['Every', 'member,', 'at', 'a', 'glance.']], port: [['Every', 'member,'], ['at', 'a', 'glance.']] },
  { id: 'plans', a: 22.2, b: 27.4, eyebrow: 'Plans', land: [['A', 'plan', 'for', 'every', 'member.']], port: [['A', 'plan', 'for'], ['every', 'member.']] },
  { id: 'more', a: 27.4, b: 30.4, eyebrow: 'Staff · Workouts · Equipment', land: [['And', 'the', 'rest', 'of', 'the', 'gym.']], port: [['And', 'the', 'rest'], ['of', 'the', 'gym.']] },
  { id: 'outro', a: 30.4, b: 33.4, eyebrow: 'All in one', land: [['Everything', 'your', 'gym', 'runs', 'on.']], port: [['Everything', 'your'], ['gym', 'runs', 'on.']] },
]
export const DURATION = 33.4
// Paused poster frame (embed before it first plays, and reduced motion).
export const POSTER = 2.6

// Stage sizes: landscape and portrait compositions, each scaled to fit the viewport.
// VIEW is the area the canvas camera frames (below the headline).
export const STAGES = {
  land: { W: 1920, H: 1080, VIEW: { x: 70, y: 250, w: 1780, h: 790 } },
  port: { W: 1080, H: 1920, VIEW: { x: 40, y: 500, w: 1000, h: 1360 } },
}
