import { CloudBuilder, mulberry32, type Cloud } from './cloud'
import type { Beat, Layout } from './beats'

// Ink, gold and violet: the only three colours in the sky.
const HUES = ['34, 30, 74', '184, 140, 62', '118, 98, 226']
const LEVELS = 6
const TAU = Math.PI * 2

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

type Pose = { cosY: number; sinY: number; cosX: number; sinX: number; cosZ: number; sinZ: number }

export type FieldOptions = { count: number; reducedMotion: boolean }

export class Field {
  readonly count: number
  private clouds: Cloud[]
  private layouts: Layout[] = []
  private ctx: CanvasRenderingContext2D
  private w = 0
  private h = 0
  private dpr = 1
  private mobile = false
  private reduced: boolean

  // Per particle, fixed
  private delay: Float32Array
  private curl: Float32Array
  private phase: Float32Array
  private twinkle: Float32Array
  private size: Float32Array
  private dustX: Float32Array
  private dustY: Float32Array
  private dustSpeed: Float32Array
  private dustHue: Uint8Array

  // Per particle, live
  private px: Float32Array
  private py: Float32Array
  private placed = false

  // Draw buckets (hue x opacity level)
  private bucket: Int32Array[]
  private bucketLen: Int32Array
  private sx: Float32Array
  private sy: Float32Array
  private sr: Float32Array

  private canvas: HTMLCanvasElement
  private beats: Beat[]

  constructor(canvas: HTMLCanvasElement, beats: Beat[], options: FieldOptions) {
    this.canvas = canvas
    this.beats = beats
    this.count = options.count
    this.reduced = options.reducedMotion
    this.ctx = canvas.getContext('2d')!
    const n = this.count
    const rand = mulberry32(7)

    // Each illustration claims ~85% of the dots; the rest drift as stardust.
    const budget = Math.round(n * 0.85)
    this.clouds = beats.map((beat, i) => {
      const b = new CloudBuilder()
      beat.build(b, mulberry32(100 + i), budget)
      return b.build(mulberry32(200 + i), n)
    })

    this.delay = new Float32Array(n)
    this.curl = new Float32Array(n)
    this.phase = new Float32Array(n)
    this.twinkle = new Float32Array(n)
    this.size = new Float32Array(n)
    this.dustX = new Float32Array(n)
    this.dustY = new Float32Array(n)
    this.dustSpeed = new Float32Array(n)
    this.dustHue = new Uint8Array(n)
    for (let i = 0; i < n; i++) {
      this.delay[i] = rand()
      this.curl[i] = (rand() - 0.5) * 1.6
      this.phase[i] = rand() * TAU
      this.twinkle[i] = 0.6 + rand() * 2.2
      this.size[i] = 0.8 + rand() * 0.4
      this.dustX[i] = rand()
      this.dustY[i] = rand()
      this.dustSpeed[i] = 0.3 + rand() * 1.2
      const h = rand()
      this.dustHue[i] = h < 0.9 ? 0 : h < 0.96 ? 1 : 2
    }
    this.px = new Float32Array(n)
    this.py = new Float32Array(n)
    this.sx = new Float32Array(n)
    this.sy = new Float32Array(n)
    this.sr = new Float32Array(n)
    this.bucket = Array.from({ length: HUES.length * LEVELS }, () => new Int32Array(n))
    this.bucketLen = new Int32Array(HUES.length * LEVELS)
  }

  resize(w: number, h: number, dpr: number, mobile: boolean) {
    this.w = w
    this.h = h
    this.dpr = dpr
    this.mobile = mobile
    this.canvas.width = Math.round(w * dpr)
    this.canvas.height = Math.round(h * dpr)
    this.layouts = this.beats.map((beat) => beat.layout(w, h, mobile))
  }

  layout(i: number) {
    return this.layouts[i]
  }

  private pose(beat: Beat, t: number): Pose {
    const m = beat.motion
    let ry = m.spin * t
    let rx = m.tilt
    if (m.sway) {
      ry = Math.sin(t * 0.45) * 0.17
      rx = Math.sin(t * 0.33) * 0.06
    }
    if (this.reduced) ry = m.sway ? 0 : 0.6
    const rz = m.roll ?? 0
    return {
      cosY: Math.cos(ry),
      sinY: Math.sin(ry),
      cosX: Math.cos(rx),
      sinX: Math.sin(rx),
      cosZ: Math.cos(rz),
      sinZ: Math.sin(rz),
    }
  }

  /**
   * @param q   story position: integer = resting on that beat, fraction = mid-morph
   * @param t   seconds since start
   * @param dt  seconds since last frame
   * @param intro 0..1 ramp while the first constellation gathers
   */
  frame(q: number, t: number, dt: number, intro: number) {
    const { ctx, w, h, count: n } = this
    const last = this.beats.length - 1
    const a = Math.max(0, Math.min(last, Math.floor(q)))
    const b = Math.min(last, a + 1)
    const m = clamp01(q - a)
    const ca = this.clouds[a]
    const cb = this.clouds[b]
    const la = this.layouts[a]
    const lb = this.layouts[b]
    const pa = this.pose(this.beats[a], t)
    const pb = this.pose(this.beats[b], t)
    const bob = this.reduced ? 0 : Math.sin(t * 0.6) * 0.008

    const follow = 1 - Math.exp(-dt * (this.reduced ? 30 : 2 + 12 * intro))
    const baseR = this.mobile ? 1.15 : 1.35
    const live = !this.reduced

    this.bucketLen.fill(0)
    let ox = 0
    let oy = 0
    let oz = 0
    let ow = 0
    let oh = 0

    // Position of particle i within cloud c, written to ox/oy/oz/ow/oh.
    const place = (c: Cloud, l: Layout, p: Pose, i: number) => {
      if (i < c.n) {
        let x = c.x[i]
        let y = c.y[i]
        let z = c.z[i]
        // spin (Y), tilt (X), roll (Z)
        const x1 = x * p.cosY + z * p.sinY
        const z1 = -x * p.sinY + z * p.cosY
        const y1 = y * p.cosX - z1 * p.sinX
        const z2 = y * p.sinX + z1 * p.cosX
        x = c.bx[i] + x1 * p.cosZ - y1 * p.sinZ
        y = c.by[i] + x1 * p.sinZ + y1 * p.cosZ
        z = z2
        const persp = 1 + z * 0.35
        ox = l.cx + (c.bx[i] + (x - c.bx[i]) * persp) * l.s
        oy = l.cy + (c.by[i] + (y - c.by[i]) * persp + bob) * l.s
        oz = z
        ow = c.w[i]
        oh = c.hue[i]
      } else {
        // Spare dots settle into the page texture: tiny, faint, barely breathing.
        const sp = this.dustSpeed[i]
        ox = this.dustX[i] * w + Math.sin(t * 0.08 * sp + this.phase[i]) * 1.5
        oy = this.dustY[i] * h + Math.cos(t * 0.07 * sp + this.phase[i]) * 1.5
        oz = 0
        ow = 0
        oh = this.dustHue[i]
      }
    }

    for (let i = 0; i < n; i++) {
      place(ca, la, pa, i)
      const xa = ox
      const ya = oy
      const za = oz
      const wa = ow
      const ha = oh
      let x = xa
      let y = ya
      let z = za
      let wt = wa
      let hue = ha
      if (m > 0 && a !== b) {
        place(cb, lb, pb, i)
        const local = clamp01((m - this.delay[i] * 0.35) / 0.65)
        const e = ease(local)
        const dx = ox - xa
        const dy = oy - ya
        x = xa + dx * e
        y = ya + dy * e
        if (live) {
          // Arc sideways in flight so the swarm swirls instead of sliding.
          const s = Math.sin(Math.PI * e) * this.curl[i] * 0.32
          x += -dy * s
          y += dx * s
        }
        z = za + (oz - za) * e
        wt = wa + (ow - wa) * e
        hue = e < 0.5 ? ha : oh
      }
      if (live) {
        x += Math.sin(t * 0.7 + this.phase[i]) * 0.6
        y += Math.cos(t * 0.6 + this.phase[i] * 1.3) * 0.6
      }

      if (!this.placed) {
        // First frame: start as texture so the planet gathers itself out of the page.
        this.px[i] = this.dustX[i] * w
        this.py[i] = this.dustY[i] * h
      }
      this.px[i] += (x - this.px[i]) * follow
      this.py[i] += (y - this.py[i]) * follow

      const tw = live ? 0.78 + 0.22 * Math.sin(t * this.twinkle[i] + this.phase[i]) : 1
      const depth = 0.62 + 0.38 * clamp01(z + 0.55)
      const alpha = (0.24 + 0.82 * wt) * depth * tw
      const level = Math.min(LEVELS - 1, Math.floor(alpha * LEVELS))
      const k = hue * LEVELS + level
      this.bucket[k][this.bucketLen[k]++] = i
      this.sx[i] = this.px[i]
      this.sy[i] = this.py[i]
      // Texture dots are a fraction of a pixel; they swell to full size as they join an illustration.
      const full = baseR * (0.6 + 0.4 * wt) * (0.85 + z * 0.4) * this.size[i]
      this.sr[i] = 0.42 + (full - 0.42) * clamp01(wt / 0.55)
    }
    this.placed = true

    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)
    this.drawChart(q, t)
    for (let hueI = 0; hueI < HUES.length; hueI++) {
      for (let level = 0; level < LEVELS; level++) {
        const k = hueI * LEVELS + level
        const len = this.bucketLen[k]
        if (!len) continue
        const list = this.bucket[k]
        ctx.fillStyle = `rgba(${HUES[hueI]}, ${((level + 0.6) / LEVELS).toFixed(3)})`
        ctx.beginPath()
        for (let j = 0; j < len; j++) {
          const i = list[j]
          const r = this.sr[i]
          ctx.moveTo(this.sx[i] + r, this.sy[i])
          ctx.arc(this.sx[i], this.sy[i], r, 0, TAU)
        }
        ctx.fill()
      }
    }
  }

  /** A faint astrolabe ring around the current illustration. */
  private drawChart(q: number, t: number) {
    const { ctx } = this
    const last = this.beats.length - 1
    const a = Math.max(0, Math.min(last, Math.floor(q)))
    const b = Math.min(last, a + 1)
    const e = ease(clamp01(q - a))
    const la = this.layouts[a]
    const lb = this.layouts[b]
    const alpha = this.beats[a].chart + (this.beats[b].chart - this.beats[a].chart) * e
    if (alpha < 0.01) return
    const cx = la.cx + (lb.cx - la.cx) * e
    const cy = la.cy + (lb.cy - la.cy) * e
    const r = (la.s + (lb.s - la.s) * e) * 0.56
    const spin = this.reduced ? 0 : t * 0.015

    ctx.save()
    ctx.translate(cx, cy)
    ctx.strokeStyle = `rgba(${HUES[0]}, ${(0.09 * alpha).toFixed(3)})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(0, 0, r, 0, TAU)
    ctx.stroke()
    ctx.setLineDash([2, 6])
    ctx.beginPath()
    ctx.arc(0, 0, r * 1.12, 0, TAU)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.rotate(spin)
    ctx.beginPath()
    for (let k = 0; k < 120; k++) {
      const ang = (k / 120) * TAU
      const len = k % 10 === 0 ? 10 : 4
      ctx.moveTo(Math.cos(ang) * r, Math.sin(ang) * r)
      ctx.lineTo(Math.cos(ang) * (r - len), Math.sin(ang) * (r - len))
    }
    ctx.stroke()
    // A small gold marker riding the ring.
    ctx.fillStyle = `rgba(${HUES[1]}, ${(0.7 * alpha).toFixed(3)})`
    ctx.beginPath()
    ctx.arc(Math.cos(-spin * 6) * r, Math.sin(-spin * 6) * r, 2.5, 0, TAU)
    ctx.fill()
    ctx.restore()
  }
}
