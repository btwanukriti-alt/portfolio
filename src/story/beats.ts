import { CloudBuilder, GOLD, INK, PEN, VIOLET, fitText, ring, sphere, stipple, type Rand } from './cloud'

export type Layout = { cx: number; cy: number; s: number }

export type Motion = {
  /** Tilt toward the viewer, radians. */
  tilt: number
  /** Spin about the vertical axis, radians per second. */
  spin: number
  /** Rotation in the picture plane, radians. */
  roll?: number
  /** Flat illustrations sway gently instead of spinning. */
  sway?: boolean
}

export type Beat = {
  key: string
  build: (b: CloudBuilder, rand: Rand, budget: number) => void
  motion: Motion
  layout: (w: number, h: number, mobile: boolean) => Layout
  /** Opacity of the faint star-chart ring drawn around the illustration. */
  chart: number
}

const TAU = Math.PI * 2
const SERIF = (px: number) => `italic 400 ${px}px "Instrument Serif", Georgia, serif`

// Illustrations sit beside the copy on desktop and above it on phones.
const aside = (scale = 1) => (w: number, h: number, mobile: boolean): Layout =>
  mobile
    ? { cx: w * 0.5, cy: h * 0.33, s: Math.min(w * 0.94, h * 0.5) * scale }
    : { cx: w * 0.66, cy: h * 0.52, s: Math.min(w * 0.44, h * 0.76) * scale }

export const ORB_CENTRES: [number, number][] = [
  [-0.36, 0.06],
  [0, -0.137],
  [0.36, 0.06],
]
export const ORB_RADIUS = 0.115

function arrow(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, size = 0.022) {
  ctx.beginPath()
  ctx.moveTo(x + Math.cos(angle + 2.6) * size, y + Math.sin(angle + 2.6) * size)
  ctx.lineTo(x, y)
  ctx.lineTo(x + Math.cos(angle - 2.6) * size, y + Math.sin(angle - 2.6) * size)
  ctx.stroke()
}

function seg(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

export const BEATS: Beat[] = [
  {
    // A ringed planet with two moons riding the spin.
    key: 'hello',
    chart: 1,
    motion: { tilt: 0.42, spin: 0.22, roll: -0.32 },
    layout: aside(0.92),
    build(b, rand, budget) {
      sphere(b, Math.round(budget * 0.5), 0.25)
      ring(b, rand, Math.round(budget * 0.38), 0.33, 0.47, INK, 0.55)
      const moons: [number, number, number, typeof GOLD | typeof VIOLET][] = [
        [0.58, 0.4, 0.028, GOLD],
        [-0.55, -1.9, 0.02, VIOLET],
      ]
      const per = Math.round(budget * 0.04)
      for (const [r, a, size, hue] of moons) {
        for (let k = 0; k < per; k++) {
          const y = 1 - (2 * (k + 0.5)) / per
          const rad = Math.sqrt(1 - y * y)
          const phi = k * 2.39996
          b.push(Math.cos(a) * r + Math.cos(phi) * rad * size, y * size, Math.sin(a) * r + Math.sin(phi) * rad * size, 1, hue)
        }
      }
    },
  },
  {
    // "designer." in engraved type, finishing the sentence in the copy.
    key: 'designer',
    chart: 0,
    motion: { tilt: 0, spin: 0, sway: true },
    layout: (w, h, mobile) =>
      mobile ? { cx: w * 0.5, cy: h * 0.44, s: w * 0.98 } : { cx: w * 0.5, cy: h * 0.6, s: Math.min(w * 0.84, h * 1.3) },
    build(b, rand, budget) {
      stipple(b, rand, budget, (ctx, px) => {
        ctx.globalAlpha = 0.5
        ctx.fillStyle = PEN.tone
        fitText(ctx, 'designer.', SERIF, 0, -0.02, 0.94)
        ctx.globalAlpha = 1
        ctx.strokeStyle = PEN.line
        fitText(ctx, 'designer.', SERIF, 0, -0.02, 0.94, 'stroke', 2.6)
        // A gold swash underneath.
        ctx.strokeStyle = PEN.gold
        ctx.lineWidth = px(2.4)
        ctx.beginPath()
        ctx.moveTo(-0.36, 0.14)
        ctx.bezierCurveTo(-0.1, 0.1, 0.18, 0.17, 0.4, 0.11)
        ctx.stroke()
      })
    },
  },
  {
    // The word splits into three crafts orbiting one path.
    key: 'crafts',
    chart: 0.6,
    motion: { tilt: 0.35, spin: 0.35 },
    layout: (w, h, mobile) =>
      mobile ? { cx: w * 0.5, cy: h * 0.34, s: w * 0.84 } : { cx: w * 0.67, cy: h * 0.5, s: Math.min(w * 0.5, h * 0.9) },
    build(b, rand, budget) {
      const hues = [INK, VIOLET, INK] as const
      ORB_CENTRES.forEach(([x, y], i) => {
        sphere(b, Math.round(budget * 0.28), ORB_RADIUS, x, y, INK)
        // A few accent dots so each craft has its own glint.
        sphere(b, Math.round(budget * 0.02), ORB_RADIUS * 1.01, x, y, i === 1 ? GOLD : hues[i] === INK ? VIOLET : GOLD)
      })
      ring(b, rand, Math.round(budget * 0.1), 0.395, 0.405, GOLD, 0.55)
    },
  },
  {
    // UX: a user flow. Start, screen, decision, two outcomes, and the loop back.
    key: 'ux',
    chart: 1,
    motion: { tilt: 0, spin: 0, sway: true },
    layout: aside(),
    build(b, rand, budget) {
      stipple(b, rand, budget, (ctx, px) => {
        ctx.lineWidth = px(2.4)
        ctx.strokeStyle = PEN.line
        ctx.beginPath()
        ctx.arc(-0.43, 0, 0.04, 0, TAU)
        ctx.stroke()
        ctx.fillStyle = PEN.gold
        ctx.beginPath()
        ctx.arc(-0.43, 0, 0.016, 0, TAU)
        ctx.fill()
        seg(ctx, -0.385, 0, -0.32, 0)
        arrow(ctx, -0.32, 0, 0)

        // Screen
        rr(ctx, -0.3, -0.19, 0.2, 0.38, 0.03)
        ctx.stroke()
        ctx.fillStyle = PEN.tone
        ctx.globalAlpha = 0.6
        rr(ctx, -0.28, -0.165, 0.16, 0.09, 0.014)
        ctx.fill()
        ctx.globalAlpha = 1
        seg(ctx, -0.28, -0.03, -0.14, -0.03)
        seg(ctx, -0.28, 0.005, -0.17, 0.005)
        seg(ctx, -0.28, 0.04, -0.2, 0.04)
        rr(ctx, -0.28, 0.105, 0.16, 0.045, 0.0225)
        ctx.stroke()
        ctx.globalAlpha = 0.5
        ctx.fill()
        ctx.globalAlpha = 1

        seg(ctx, -0.085, 0, 0.0, 0)
        arrow(ctx, 0.0, 0, 0)

        // Decision
        ctx.beginPath()
        ctx.moveTo(0.08, -0.07)
        ctx.lineTo(0.15, 0)
        ctx.lineTo(0.08, 0.07)
        ctx.lineTo(0.01, 0)
        ctx.closePath()
        ctx.stroke()
        ctx.fillStyle = PEN.violet
        ctx.beginPath()
        ctx.arc(0.08, 0, 0.014, 0, TAU)
        ctx.fill()

        // Branches
        ctx.beginPath()
        ctx.moveTo(0.08, -0.08)
        ctx.bezierCurveTo(0.08, -0.2, 0.12, -0.22, 0.215, -0.22)
        ctx.stroke()
        arrow(ctx, 0.215, -0.22, 0)
        ctx.beginPath()
        ctx.moveTo(0.08, 0.08)
        ctx.bezierCurveTo(0.08, 0.2, 0.12, 0.22, 0.215, 0.22)
        ctx.stroke()
        arrow(ctx, 0.215, 0.22, 0)

        // Outcome A: profile
        rr(ctx, 0.235, -0.32, 0.19, 0.2, 0.025)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(0.33, -0.26, 0.03, 0, TAU)
        ctx.stroke()
        seg(ctx, 0.28, -0.195, 0.38, -0.195)
        ctx.strokeStyle = PEN.tone
        seg(ctx, 0.295, -0.165, 0.365, -0.165)

        // Outcome B: success
        ctx.strokeStyle = PEN.line
        rr(ctx, 0.235, 0.12, 0.19, 0.2, 0.025)
        ctx.stroke()
        ctx.strokeStyle = PEN.gold
        ctx.beginPath()
        ctx.arc(0.33, 0.22, 0.05, 0, TAU)
        ctx.stroke()
        ctx.lineWidth = px(3)
        ctx.beginPath()
        ctx.moveTo(0.305, 0.222)
        ctx.lineTo(0.323, 0.24)
        ctx.lineTo(0.357, 0.2)
        ctx.stroke()

        // Iterate: the dashed loop back to the start
        ctx.lineWidth = px(2.2)
        ctx.strokeStyle = PEN.tone
        ctx.setLineDash([px(7), px(9)])
        ctx.beginPath()
        ctx.moveTo(0.33, 0.33)
        ctx.bezierCurveTo(0.33, 0.44, 0.2, 0.44, 0, 0.44)
        ctx.lineTo(-0.33, 0.44)
        ctx.bezierCurveTo(-0.43, 0.44, -0.43, 0.3, -0.43, 0.06)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.strokeStyle = PEN.line
        arrow(ctx, -0.43, 0.06, -Math.PI / 2, 0.018)
      })
    },
  },
  {
    // Branding: a monogram seal, a spark and a palette.
    key: 'brand',
    chart: 1,
    motion: { tilt: 0, spin: 0, sway: true },
    layout: aside(),
    build(b, rand, budget) {
      stipple(b, rand, budget, (ctx, px) => {
        const cx = -0.05
        ctx.lineWidth = px(2.4)
        ctx.strokeStyle = PEN.line
        ctx.beginPath()
        ctx.arc(cx, 0, 0.37, 0, TAU)
        ctx.stroke()
        for (let k = 0; k < 48; k++) {
          const a = (k / 48) * TAU
          const r0 = k % 4 === 0 ? 0.385 : 0.392
          seg(ctx, cx + Math.cos(a) * r0, Math.sin(a) * r0, cx + Math.cos(a) * 0.405, Math.sin(a) * 0.405)
        }
        ctx.strokeStyle = PEN.tone
        ctx.setLineDash([px(4), px(8)])
        ctx.beginPath()
        ctx.arc(cx, 0, 0.325, 0, TAU)
        ctx.stroke()
        ctx.setLineDash([])

        ctx.fillStyle = PEN.tone
        ctx.globalAlpha = 0.55
        fitText(ctx, 'A', SERIF, cx - 0.01, 0.035, 0.34)
        ctx.globalAlpha = 1
        ctx.strokeStyle = PEN.line
        fitText(ctx, 'A', SERIF, cx - 0.01, 0.035, 0.34, 'stroke', 2.6)

        // Four-point spark
        const sx = 0.3
        const sy = -0.31
        ctx.fillStyle = PEN.gold
        ctx.beginPath()
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * TAU - Math.PI / 2
          const r = k % 2 === 0 ? 0.075 : 0.014
          ctx.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r)
        }
        ctx.closePath()
        ctx.fill()

        // Palette
        const swatches: [string, number][] = [
          [PEN.line, 0.85],
          [PEN.gold, 0.9],
          [PEN.violet, 0.9],
          [PEN.tone, 0.5],
        ]
        swatches.forEach(([pen, alpha], i) => {
          ctx.fillStyle = pen
          ctx.globalAlpha = alpha
          ctx.beginPath()
          ctx.arc(0.43, -0.09 + i * 0.09, 0.03, 0, TAU)
          ctx.fill()
        })
        ctx.globalAlpha = 1
      })
    },
  },
  {
    // UI: a card and a handful of controls.
    key: 'ui',
    chart: 1,
    motion: { tilt: 0, spin: 0, sway: true },
    layout: aside(),
    build(b, rand, budget) {
      stipple(b, rand, budget, (ctx, px) => {
        ctx.lineWidth = px(2.4)
        ctx.strokeStyle = PEN.line
        rr(ctx, -0.44, -0.41, 0.5, 0.82, 0.04)
        ctx.stroke()

        // Image with mountains and a sun
        ctx.fillStyle = PEN.tone
        ctx.globalAlpha = 0.45
        rr(ctx, -0.41, -0.38, 0.44, 0.34, 0.025)
        ctx.fill()
        ctx.globalAlpha = 0.9
        ctx.fillStyle = PEN.line
        ctx.save()
        rr(ctx, -0.41, -0.38, 0.44, 0.34, 0.025)
        ctx.clip()
        ctx.beginPath()
        ctx.moveTo(-0.41, -0.04)
        ctx.lineTo(-0.3, -0.17)
        ctx.lineTo(-0.23, -0.11)
        ctx.lineTo(-0.12, -0.23)
        ctx.lineTo(0.03, -0.06)
        ctx.lineTo(0.03, -0.04)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
        ctx.globalAlpha = 1
        ctx.fillStyle = PEN.gold
        ctx.beginPath()
        ctx.arc(-0.06, -0.29, 0.035, 0, TAU)
        ctx.fill()

        // Title and body copy
        ctx.fillStyle = PEN.line
        rr(ctx, -0.41, 0.0, 0.27, 0.024, 0.012)
        ctx.fill()
        ctx.strokeStyle = PEN.tone
        seg(ctx, -0.41, 0.07, 0.0, 0.07)
        seg(ctx, -0.41, 0.105, -0.06, 0.105)

        // Chips
        ctx.strokeStyle = PEN.line
        rr(ctx, -0.41, 0.15, 0.11, 0.045, 0.0225)
        ctx.stroke()
        rr(ctx, -0.28, 0.15, 0.13, 0.045, 0.0225)
        ctx.stroke()

        // Primary button
        ctx.fillStyle = PEN.violet
        ctx.globalAlpha = 0.85
        rr(ctx, -0.41, 0.28, 0.44, 0.08, 0.04)
        ctx.fill()
        ctx.globalAlpha = 1

        // Toggle
        ctx.strokeStyle = PEN.line
        rr(ctx, 0.14, -0.31, 0.16, 0.08, 0.04)
        ctx.stroke()
        ctx.fillStyle = PEN.gold
        ctx.beginPath()
        ctx.arc(0.26, -0.27, 0.027, 0, TAU)
        ctx.fill()

        // Slider
        ctx.strokeStyle = PEN.tone
        seg(ctx, 0.14, -0.12, 0.44, -0.12)
        ctx.strokeStyle = PEN.line
        ctx.lineWidth = px(3.2)
        seg(ctx, 0.14, -0.12, 0.33, -0.12)
        ctx.lineWidth = px(2.4)
        ctx.beginPath()
        ctx.arc(0.33, -0.12, 0.022, 0, TAU)
        ctx.stroke()

        // Checklist
        rr(ctx, 0.14, 0.03, 0.05, 0.05, 0.01)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(0.152, 0.056)
        ctx.lineTo(0.163, 0.067)
        ctx.lineTo(0.18, 0.043)
        ctx.stroke()
        seg(ctx, 0.22, 0.055, 0.42, 0.055)
        rr(ctx, 0.14, 0.12, 0.05, 0.05, 0.01)
        ctx.stroke()
        ctx.strokeStyle = PEN.tone
        seg(ctx, 0.22, 0.145, 0.38, 0.145)

        // Pointer, mid-click on the button
        ctx.fillStyle = PEN.line
        ctx.beginPath()
        ctx.moveTo(0.0, 0.31)
        ctx.lineTo(0.0, 0.42)
        ctx.lineTo(0.026, 0.395)
        ctx.lineTo(0.045, 0.435)
        ctx.lineTo(0.06, 0.428)
        ctx.lineTo(0.041, 0.39)
        ctx.lineTo(0.075, 0.386)
        ctx.closePath()
        ctx.fill()
      })
    },
  },
  {
    // Everything gathers into one slow spiral galaxy.
    key: 'together',
    chart: 0,
    motion: { tilt: 0.5, spin: 0.06, roll: 0.12 },
    layout: (w, h, mobile) =>
      mobile ? { cx: w * 0.5, cy: h * 0.46, s: w * 1.35 } : { cx: w * 0.5, cy: h * 0.53, s: Math.min(w * 0.95, h * 1.5) },
    build(b, rand, budget) {
      const gauss = () => (rand() + rand() + rand() - 1.5) / 1.5
      const arms = Math.round(budget * 0.86)
      for (let k = 0; k < arms; k++) {
        const arm = k % 3
        const t = rand()
        const r = 0.15 + 0.35 * Math.pow(t, 0.85)
        const a = (arm * TAU) / 3 + r * 7 + gauss() * 0.3 * (1.1 - t * 0.5)
        const rr2 = r + gauss() * 0.015
        const hue = r < 0.19 ? GOLD : rand() < 0.07 ? VIOLET : INK
        b.push(Math.cos(a) * rr2, gauss() * 0.01, Math.sin(a) * rr2, rand() < 0.55 ? 1 : 0.55, hue)
      }
      ring(b, rand, Math.round(budget * 0.08), 0.52, 0.56, INK, 0.55)
    },
  },
]
