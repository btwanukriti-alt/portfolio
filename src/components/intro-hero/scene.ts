// Geometry for the intro hero. The UX screenshots ("tiles") always face the viewer, flat; all
// the 3D is depth (size, softness, stacking). Each tile's pose is a blend of three layouts:
//
//   orbit   - a tilted 3D circle around the centre. Tiles stream out of the intro's frame (on the
//             right), sweep across the front, round the far side and back.
//   ring    - first scroll: an even circle around the headline.
//   scatter - second scroll: spread around the About paragraph at different depths, drifting.

// The formation was laid out around a 1600 x 837 face illustration (the earlier hero); its
// proportions still set the circle's size and centre line, so the motion stays the same.
const FACE_W = 1600
const FACE_H = 837
const FACE = {
  eyes: [
    { x: 422, y: 484 },
    { x: 1178, y: 466 },
  ],
  lens: [{ x: 402, y: 490 }],
}

export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const smooth = (t: number) => {
  const x = clamp(t)
  return x * x * (3 - 2 * x)
}

export type Layout = {
  w: number
  h: number
  mobile: boolean
  face: { x: number; y: number; w: number; h: number }
  cell: number // dot spacing, CSS px
  eyes: [[number, number], [number, number]]
  cx: number
  cy: number // the eye line
  tileW: number
  tileH: number
}

export const TILE_RATIO = 1.5

export function computeLayout(w: number, h: number): Layout {
  const ratio = FACE_W / FACE_H
  const mobile = w < 720
  const faceW = mobile ? w : Math.min(w * 0.6, h * 0.48 * ratio, 1100)
  const faceH = faceW / ratio
  const face = { x: (w - faceW) / 2, y: h * 0.5 - faceH / 2, w: faceW, h: faceH }
  const toScreen = (p: { x: number; y: number }): [number, number] => [
    face.x + (p.x / FACE_W) * faceW,
    face.y + (p.y / FACE_H) * faceH,
  ]
  const tileW = mobile ? clamp(w * 0.26, 84, 124) : clamp(w * 0.145, 150, 236)
  return {
    w,
    h,
    mobile,
    face,
    cell: clamp(faceW / 430, mobile ? 1.6 : 1.9, 2.8),
    eyes: [toScreen(FACE.eyes[0]), toScreen(FACE.eyes[1])],
    cx: w / 2,
    cy: face.y + (FACE.lens[0].y / FACE_H) * faceH,
    tileW,
    tileH: tileW / TILE_RATIO,
  }
}

export type Pose = { x: number; y: number; s: number; o: number; blur: number; z: number }

export const mixPose = (a: Pose, b: Pose, t: number): Pose =>
  t <= 0
    ? a
    : t >= 1
      ? b
      : {
          x: lerp(a.x, b.x, t),
          y: lerp(a.y, b.y, t),
          s: lerp(a.s, b.s, t),
          o: lerp(a.o, b.o, t),
          blur: lerp(a.blur, b.blur, t),
          z: lerp(a.z, b.z, t),
        }

const PERSPECTIVE = 1000
// Radians of travel spent getting from the intro frame onto the circle.
export const EMERGE = 0.8

const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

// Where the screenshots come from: the intro's frame (its centre, and the scale that makes a
// screenshot fill it).
export type Origin = { x: number; y: number; s: number }

// theta: 0 = right, pi/2 = front (nearest), pi = left, 3pi/2 = behind. amp scales the depth: 1
// during the pass, smaller once it idles. Below 0, a screenshot is still on its way out of the
// frame (origin) to the start of the circle.
export function orbitPose(L: Layout, theta: number, amp: number, origin?: Origin): Pose {
  if (theta < 0) {
    const start = orbitPose(L, 0, amp)
    const o = origin ?? { x: start.x, y: start.y, s: start.s * 0.94 }
    const from: Pose = { x: o.x, y: o.y, s: o.s, o: 0, blur: 0, z: 0 }
    if (theta <= -EMERGE) return from
    // Appears in the frame (quick fade), then glides out onto the circle.
    const k = (theta + EMERGE) / EMERGE
    const p = mixPose({ ...from, o: 1 }, start, easeInOutCubic(k))
    return { ...p, o: p.o * Math.min(1, k / 0.12) }
  }
  const rx = L.mobile ? L.w * 0.36 : Math.min(L.w * 0.44, L.face.w * 0.9)
  // Tilt: nearly edge-on during the pass (so the front of the circle runs across the eyes), more
  // open once it idles so it reads as a ring. Front low, back high.
  const calm = clamp((1 - amp) / 0.58)
  // On a phone the circle stays open even mid-pass, so the screens don't pile up on each other.
  const ry = L.h * lerp(L.mobile ? 0.11 : 0.04, L.mobile ? 0.3 : 0.27, calm)
  const depth = (L.mobile ? 300 : 690) * amp
  const sin = Math.sin(theta)
  const z = sin * depth
  const persp = PERSPECTIVE / (PERSPECTIVE - z)
  const near = (sin + 1) / 2
  return {
    x: L.cx + Math.cos(theta) * rx,
    y: L.cy + sin * ry,
    s: persp * lerp(1, 0.64, calm),
    o: 0.5 + 0.5 * near,
    blur: Math.max(0, -sin) * 2.4 * amp,
    z,
  }
}

// Even ellipse around the centre of the screen, slowly turning. Where the headline would collide
// with it, the ring leaves gaps and the tiles run along two arcs, fading out at an arc's end and
// back in across the gap: on a portrait screen (headline nearly full width) the gaps are at the
// sides; on a short landscape one (a phone on its side) they're above and below.
const GAP = 0.6 // radians kept clear either side of each gap's axis
export function ringPose(L: Layout, i: number, n: number, turn: number): Pose {
  const tall = L.h > L.w
  const short = !tall && L.h < 560
  const u = (((i / n + turn / (Math.PI * 2)) % 1) + 1) % 1
  let a = -Math.PI / 2 + u * Math.PI * 2
  let o = 1
  if (tall || short) {
    const first = u < 0.5
    const k = (first ? u : u - 0.5) / 0.5
    const axis = tall ? 0 : -Math.PI / 2
    a = axis + (first ? Math.PI : 0) + GAP + k * (Math.PI - 2 * GAP)
    o = smooth(Math.min(k, 1 - k) / 0.08)
  }
  // Wide enough that tiles passing the headline's ends clear it (it's up to 560 px or 64vw wide).
  const tileHalf = (L.tileW * 0.6) / 2
  const clearOfHeadline = Math.min(560, L.w * 0.64) / 2 + tileHalf + 16
  const rx =
    tall || short
      ? L.w * (short ? 0.43 : 0.4)
      : L.mobile
        ? L.w * 0.39
        : Math.min(Math.max(Math.min(L.w * 0.3, L.h * 0.52), clearOfHeadline), L.w / 2 - tileHalf - 12)
  const ry = short ? L.h * 0.4 : L.mobile ? L.h * 0.33 : L.h * 0.37
  return { x: L.cx + Math.cos(a) * rx, y: L.h / 2 + Math.sin(a) * ry, s: L.mobile ? 0.58 : 0.6, o, blur: 0, z: 0 }
}

export type Spot = { x: number; y: number; d: number; seed: number }

// Scatter positions (normalised 0..1), clear of the paragraph in the middle. Seeded, so the
// layout is the same on every visit.
export function scatterSpots(n: number, mobile: boolean): Spot[] {
  // mulberry32
  let seed = mobile ? 7 : 3
  const rand = () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const spots: Spot[] = []
  const clearX = mobile ? 0.5 : 0.33
  const clearY = mobile ? 0.17 : 0.22
  const aspect = mobile ? 0.5 : 1.6
  let minDist = mobile ? 0.15 : 0.16
  // Rejection sampling, loosening the spacing until everything fits.
  for (let tries = 1; spots.length < n; tries++) {
    if (tries % 800 === 0) minDist *= 0.9
    const x = 0.06 + rand() * 0.88
    const y = 0.11 + rand() * 0.8
    if (Math.abs(x - 0.5) < clearX && Math.abs(y - 0.5) < clearY) continue
    if (minDist > 0.02 && spots.some((s) => Math.hypot((s.x - x) * aspect, s.y - y) < minDist)) continue
    spots.push({ x, y, d: rand(), seed: rand() * 10 })
  }
  return spots
}

export function scatterPose(L: Layout, spot: Spot, time: number, mx: number, my: number): Pose {
  const t = time / 1000
  const drift = 0.5 + spot.d
  return {
    x: spot.x * L.w + Math.sin(t * 0.35 + spot.seed) * 12 * drift + mx * 26 * drift,
    y: spot.y * L.h + Math.cos(t * 0.29 + spot.seed * 1.3) * 10 * drift + my * 18 * drift,
    s: (L.mobile ? 0.5 : 0.48) + spot.d * 0.7,
    o: 0.6 + spot.d * 0.4,
    blur: (1 - spot.d) * 1.3,
    z: spot.d * 100 - 50,
  }
}

// Damped spring (unit mass), stepped with the frame time.
export class Spring {
  velocity = 0
  constructor(
    public value: number,
    public target: number,
    private stiffness: number,
    private damping: number,
  ) {}

  step(dt: number) {
    let left = Math.min(dt, 0.064)
    while (left > 0) {
      const h = Math.min(left, 1 / 240)
      const accel = -this.stiffness * (this.value - this.target) - this.damping * this.velocity
      this.velocity += accel * h
      this.value += this.velocity * h
      left -= h
    }
    if (Math.abs(this.velocity) < 1e-4 && Math.abs(this.value - this.target) < 1e-4) {
      this.value = this.target
      this.velocity = 0
    }
  }
}
