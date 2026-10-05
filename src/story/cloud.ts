// Point clouds the particle field morphs between.
// Everything lives in a normalized box: x and y in [-0.5, 0.5], z for 3D bodies.

export const INK = 0
export const GOLD = 1
export const VIOLET = 2
export type Hue = typeof INK | typeof GOLD | typeof VIOLET

export type Cloud = {
  n: number
  x: Float32Array
  y: Float32Array
  z: Float32Array
  /** Body centre (spheres spin about their own centre). */
  bx: Float32Array
  by: Float32Array
  /** 1 = line work, ~0.55 = tonal fill. */
  w: Float32Array
  hue: Uint8Array
}

export type Rand = () => number

export function mulberry32(seed: number): Rand {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export class CloudBuilder {
  private xs: number[] = []
  private ys: number[] = []
  private zs: number[] = []
  private bxs: number[] = []
  private bys: number[] = []
  private ws: number[] = []
  private hues: number[] = []

  get size() {
    return this.xs.length
  }

  push(x: number, y: number, z = 0, w = 1, hue: Hue = INK, bx = 0, by = 0) {
    this.xs.push(x)
    this.ys.push(y)
    this.zs.push(z)
    this.ws.push(w)
    this.hues.push(hue)
    this.bxs.push(bx)
    this.bys.push(by)
  }

  /** Shuffled so particle i lands on a random point: morphs read as a swarm, not a sweep. */
  build(rand: Rand, cap: number): Cloud {
    const order = this.xs.map((_, i) => i)
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    const n = Math.min(cap, order.length)
    const cloud: Cloud = {
      n,
      x: new Float32Array(n),
      y: new Float32Array(n),
      z: new Float32Array(n),
      bx: new Float32Array(n),
      by: new Float32Array(n),
      w: new Float32Array(n),
      hue: new Uint8Array(n),
    }
    for (let k = 0; k < n; k++) {
      const i = order[k]
      cloud.x[k] = this.xs[i]
      cloud.y[k] = this.ys[i]
      cloud.z[k] = this.zs[i]
      cloud.bx[k] = this.bxs[i]
      cloud.by[k] = this.bys[i]
      cloud.w[k] = this.ws[i]
      cloud.hue[k] = this.hues[i] as Hue
    }
    return cloud
  }
}

// ---------------------------------------------------------------------------
// 3D bodies

const GOLDEN = Math.PI * (3 - Math.sqrt(5))

export function sphere(b: CloudBuilder, count: number, r: number, cx = 0, cy = 0, hue: Hue = INK, w = 1) {
  for (let k = 0; k < count; k++) {
    const y = 1 - (2 * (k + 0.5)) / count
    const rad = Math.sqrt(1 - y * y)
    const phi = k * GOLDEN
    b.push(Math.cos(phi) * rad * r, y * r, Math.sin(phi) * rad * r, w, hue, cx, cy)
  }
}

/** A flat band in the xz plane: reads as an ellipse once the body is tilted. */
export function ring(b: CloudBuilder, rand: Rand, count: number, r0: number, r1: number, hue: Hue = INK, w = 1, cx = 0, cy = 0) {
  for (let k = 0; k < count; k++) {
    const a = ((k + rand() * 0.6) / count) * Math.PI * 2
    const r = r0 + (r1 - r0) * Math.sqrt(rand())
    b.push(Math.cos(a) * r, (rand() - 0.5) * 0.004, Math.sin(a) * r, w, hue, cx, cy)
  }
}

// ---------------------------------------------------------------------------
// Raster illustrations, stippled with blue noise so every dot sits an even distance apart.

const RES = 720
// Pure colours the illustration is drawn in; each pixel is tagged by the nearest one.
export const PEN = {
  line: 'rgb(255,0,0)',
  tone: 'rgb(0,0,255)',
  gold: 'rgb(0,255,0)',
  violet: 'rgb(255,255,0)',
}

export type Draw = (ctx: CanvasRenderingContext2D, px: (v: number) => number) => void

export function stipple(b: CloudBuilder, rand: Rand, budget: number, draw: Draw) {
  const canvas = document.createElement('canvas')
  canvas.width = RES
  canvas.height = RES
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  // Draw in normalized units: (0,0) is the centre, 1 unit = RES px.
  ctx.setTransform(RES, 0, 0, RES, RES / 2, RES / 2)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  draw(ctx, (v) => v / RES)

  const data = ctx.getImageData(0, 0, RES, RES).data
  const cx: number[] = []
  const cy: number[] = []
  const tag: number[] = []
  for (let y = 0; y < RES; y++) {
    for (let x = 0; x < RES; x++) {
      const o = (y * RES + x) * 4
      const a = data[o + 3]
      // Alpha is density, so a semi-transparent fill renders as a lighter tone.
      if (a < 10 || rand() * 255 > a) continue
      const r = data[o]
      const g = data[o + 1]
      const bl = data[o + 2]
      cx.push(x + rand() - 0.5)
      cy.push(y + rand() - 0.5)
      tag.push(r > 128 && g > 128 ? 3 : g > r && g > bl ? 2 : bl > r ? 1 : 0)
    }
  }

  const picked = blueNoise(cx, cy, budget, rand)
  for (const i of picked) {
    const t = tag[i]
    const w = t === 1 ? 0.55 : 1
    const hue: Hue = t === 2 ? GOLD : t === 3 ? VIOLET : INK
    b.push(cx[i] / RES - 0.5, cy[i] / RES - 0.5, 0, w, hue)
  }
}

/** Dart throwing at the largest spacing that still yields `budget` dots. */
function blueNoise(xs: number[], ys: number[], budget: number, rand: Rand): number[] {
  const n = xs.length
  const order = new Int32Array(n)
  for (let i = 0; i < n; i++) order[i] = i
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    const t = order[i]
    order[i] = order[j]
    order[j] = t
  }
  if (n <= budget) return Array.from(order)

  const next = new Int32Array(n)
  const accepted: number[] = []
  const run = (r: number, limit: number) => {
    const gw = Math.ceil(RES / r) + 1
    const head = new Int32Array(gw * gw).fill(-1)
    const r2 = r * r
    accepted.length = 0
    for (let k = 0; k < n; k++) {
      const i = order[k]
      const gx = Math.floor(xs[i] / r)
      const gy = Math.floor(ys[i] / r)
      let ok = true
      for (let oy = -1; oy <= 1 && ok; oy++) {
        const yy = gy + oy
        if (yy < 0 || yy >= gw) continue
        for (let ox = -1; ox <= 1 && ok; ox++) {
          const xx = gx + ox
          if (xx < 0 || xx >= gw) continue
          for (let j = head[yy * gw + xx]; j !== -1; j = next[j]) {
            const dx = xs[j] - xs[i]
            const dy = ys[j] - ys[i]
            if (dx * dx + dy * dy < r2) {
              ok = false
              break
            }
          }
        }
      }
      if (!ok || gx < 0 || gy < 0 || gx >= gw || gy >= gw) continue
      next[i] = head[gy * gw + gx]
      head[gy * gw + gx] = i
      accepted.push(i)
      if (accepted.length >= limit) return true
    }
    return false
  }

  let lo = 0.5
  let hi = 40
  for (let it = 0; it < 14; it++) {
    const mid = (lo + hi) / 2
    if (run(mid, budget)) lo = mid
    else hi = mid
  }
  run(lo, budget)
  return accepted.slice()
}

/** Text drawn at a fitted size. Fonts misbehave under a scale transform, so this works in pixels. */
export function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  font: (px: number) => string,
  cx: number,
  cy: number,
  width: number,
  mode: 'fill' | 'stroke' = 'fill',
  lineWidth = 2,
) {
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  const probe = 200
  ctx.font = font(probe)
  const measured = ctx.measureText(text).width
  const size = (probe * width * RES) / measured
  ctx.font = font(size)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const x = (cx + 0.5) * RES
  const y = (cy + 0.5) * RES
  if (mode === 'fill') ctx.fillText(text, x, y)
  else {
    ctx.lineWidth = lineWidth
    ctx.strokeText(text, x, y)
  }
  ctx.restore()
}
