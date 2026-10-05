// Every chapter of the story is a "formation": a target position, colour and size for each
// of the N dots. The GPU morphs between neighbouring formations as the page scrolls.
//
// Coordinates are CSS pixels with the origin at the centre of the viewport and y pointing up,
// so a formation at z = 0 lines up exactly with DOM elements placed over the canvas.

export type Formation = {
  /** x, y, z, size (px) */
  pos: Float32Array
  /** r, g, b, a (sRGB 0..1) */
  col: Float32Array
  /** Streaming along a segment: dir x, dir y, length, cycles per second. Length 0 = still. */
  flow: Float32Array
  /** Noise displacement, px. */
  turb: number
  /** How strongly dots shy away from the cursor, 0..1. */
  mouse: number
  /** Per-dot size variation, 0..1. */
  vary: number
}

export type Rect = { x: number; y: number; w: number; h: number }
export type Point = { x: number; y: number }

export type StoryLayout = {
  mobile: boolean
  w: number
  h: number
  screen: Rect
  clusters: (Point & { r: number; label: string })[]
  nodes: (Point & { label: string })[]
  edges: [number, number][]
  nodeRadius: number
}

const INK = [0.07, 0.07, 0.09]
const ACCENT = [0.36, 0.24, 0.96]

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

const gauss = (rand: Rand) => {
  const u = Math.max(1e-6, rand())
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand())
}

/** Writes dots into shuffled slots, so dot i lands somewhere unrelated in each chapter. */
class Builder {
  readonly f: Formation
  private slot: Uint32Array
  private i = 0
  readonly n: number

  constructor(n: number, rand: Rand, opts: Pick<Formation, 'turb' | 'mouse' | 'vary'>) {
    this.n = n
    this.f = {
      pos: new Float32Array(n * 4),
      col: new Float32Array(n * 4),
      flow: new Float32Array(n * 4),
      ...opts,
    }
    this.slot = new Uint32Array(n)
    for (let k = 0; k < n; k++) this.slot[k] = k
    for (let k = n - 1; k > 0; k--) {
      const j = Math.floor(rand() * (k + 1))
      const t = this.slot[k]
      this.slot[k] = this.slot[j]
      this.slot[j] = t
    }
  }

  get left() {
    return this.n - this.i
  }

  put(x: number, y: number, z: number, size: number, rgb: number[], a: number, flow?: [number, number, number, number]) {
    if (this.i >= this.n) return
    const s = this.slot[this.i++] * 4
    const { pos, col } = this.f
    pos[s] = x
    pos[s + 1] = y
    pos[s + 2] = z
    pos[s + 3] = size
    col[s] = rgb[0]
    col[s + 1] = rgb[1]
    col[s + 2] = rgb[2]
    col[s + 3] = a
    if (flow) this.f.flow.set(flow, s)
  }

  /** Remaining dots become a faint, still texture across the screen. */
  haze(L: StoryLayout, rand: Rand, alpha = 0.16) {
    while (this.left > 0) {
      this.put((rand() - 0.5) * L.w * 1.1, (rand() - 0.5) * L.h * 1.1, (rand() - 0.5) * 200, 0.9, INK, alpha * (0.5 + rand()))
    }
  }
}

// ---------------------------------------------------------------------------- layout

export const SCREEN_ASPECT = 1256 / 856

export function storyLayout(w: number, h: number): StoryLayout {
  const mobile = w < 760
  const sw = mobile ? w * 0.92 : Math.min(w * 0.62, h * 0.6 * SCREEN_ASPECT)
  const sh = sw / SCREEN_ASPECT
  const screen = { x: mobile ? 0 : w * 0.06, y: mobile ? h * 0.1 : h * 0.06, w: sw, h: sh }

  const cw = mobile ? w * 0.4 : w * 0.38
  const ch = mobile ? h * 0.2 : h * 0.3
  const cy = mobile ? h * 0.12 : h * 0.07
  const clusterSpots: [number, number, number, string][] = [
    [-0.78, 0.55, 1.0, 'Interviews'],
    [-0.12, 0.85, 0.75, 'Analytics'],
    [0.62, 0.6, 1.1, 'Support tickets'],
    [0.85, -0.35, 0.7, 'Competitors'],
    [0.08, -0.15, 0.9, 'Stakeholders'],
    [-0.6, -0.55, 0.8, 'Edge cases'],
  ]
  const baseR = mobile ? 30 : 64
  const clusters = clusterSpots.map(([x, y, r, label]) => ({ x: x * cw, y: cy + y * ch, r: baseR * r, label }))

  // A main path left to right, with a detour that rejoins it.
  const fx = mobile ? w * 0.38 : w * 0.36
  const fy = mobile ? h * 0.12 : h * 0.08
  const dy = mobile ? h * 0.14 : h * 0.17
  const nodes = mobile
    ? [
        { x: -fx, y: fy + dy, label: 'Land' },
        { x: 0, y: fy + dy, label: 'Explore' },
        { x: fx, y: fy + dy, label: 'Compare' },
        { x: fx, y: fy - dy * 0.6, label: 'Decide' },
        { x: 0, y: fy - dy * 0.6, label: 'Done' },
        { x: -fx * 0.7, y: fy - dy * 1.6, label: 'Ask for help' },
      ]
    : [
        { x: -fx, y: fy + dy * 0.4, label: 'Land' },
        { x: -fx * 0.5, y: fy + dy * 0.75, label: 'Explore' },
        { x: 0, y: fy + dy * 0.35, label: 'Compare' },
        { x: fx * 0.5, y: fy + dy * 0.7, label: 'Decide' },
        { x: fx, y: fy + dy * 0.2, label: 'Done' },
        { x: -fx * 0.05, y: fy - dy * 0.9, label: 'Ask for help' },
      ]
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [1, 5],
    [5, 3],
  ]
  return { mobile, w, h, screen, clusters, nodes, edges, nodeRadius: mobile ? 16 : 26 }
}

// ---------------------------------------------------------------------------- chapters

/** 0. Everything starts as a single bright point. */
function singularity(n: number, L: StoryLayout, rand: Rand) {
  const b = new Builder(n, rand, { turb: 0, mouse: 0, vary: 0.5 })
  while (b.left > 0) b.put(gauss(rand) * 3, gauss(rand) * 3, gauss(rand) * 3, 1.2, INK, 0.8)
  void L
  return b.f
}

/** 1. Noise: a deep, restless cloud. */
function noise(n: number, L: StoryLayout, rand: Rand) {
  const b = new Builder(n, rand, { turb: 110, mouse: 1, vary: 1 })
  while (b.left > 0) {
    const accent = rand() < 0.025
    b.put(
      gauss(rand) * L.w * 0.22,
      gauss(rand) * L.h * 0.26,
      gauss(rand) * 320,
      1.2 + rand() * 1.1,
      accent ? ACCENT : INK,
      0.35 + rand() * 0.6,
    )
  }
  return b.f
}

/** 2. Listening: the noise gathers into clusters, one per source. */
function clusters(n: number, L: StoryLayout, rand: Rand) {
  const b = new Builder(n, rand, { turb: 9, mouse: 1, vary: 0.8 })
  const total = Math.floor(n * 0.72)
  const weights = L.clusters.map((c) => c.r * c.r)
  const sum = weights.reduce((a, v) => a + v, 0)
  L.clusters.forEach((c, i) => {
    const count = Math.floor((total * weights[i]) / sum)
    for (let k = 0; k < count; k++) {
      // Denser core, softer edge.
      const r = c.r * Math.pow(rand(), 0.6)
      const th = rand() * Math.PI * 2
      const ph = Math.acos(2 * rand() - 1)
      b.put(
        c.x + r * Math.sin(ph) * Math.cos(th),
        c.y + r * Math.sin(ph) * Math.sin(th),
        r * Math.cos(ph),
        1.15 + rand() * 0.5,
        rand() < 0.04 ? ACCENT : INK,
        0.55 + rand() * 0.4,
      )
    }
  })
  b.haze(L, rand)
  return b.f
}

/** 3. Patterns become paths: nodes joined by streams of dots. */
function flow(n: number, L: StoryLayout, rand: Rand) {
  const b = new Builder(n, rand, { turb: 2.5, mouse: 0.6, vary: 0.4 })
  const R = L.nodeRadius

  const nodeDots = Math.floor(n * 0.24)
  const per = Math.floor(nodeDots / L.nodes.length)
  L.nodes.forEach((node, i) => {
    const hue = i === L.nodes.length - 2 ? ACCENT : INK
    for (let k = 0; k < per; k++) {
      if (k < per * 0.55) {
        const a = (k / (per * 0.55)) * Math.PI * 2
        b.put(node.x + Math.cos(a) * R, node.y + Math.sin(a) * R, 0, 1.4, hue, 0.95)
      } else {
        const a = rand() * Math.PI * 2
        const r = R * 0.75 * Math.sqrt(rand())
        b.put(node.x + Math.cos(a) * r, node.y + Math.sin(a) * r, 0, 1.1, hue, 0.22)
      }
    }
  })

  const segs = L.edges.map(([a, c]) => {
    const p = L.nodes[a]
    const q = L.nodes[c]
    const dx = q.x - p.x
    const dy = q.y - p.y
    const len = Math.hypot(dx, dy)
    const ux = dx / len
    const uy = dy / len
    const inner = len - R * 2 - 10
    return { mx: (p.x + q.x) / 2, my: (p.y + q.y) / 2, ux, uy, inner }
  })
  const edgeDots = Math.floor(n * 0.5)
  const lenSum = segs.reduce((a, s) => a + s.inner, 0)
  segs.forEach((s, i) => {
    const count = Math.floor((edgeDots * s.inner) / lenSum)
    const detour = i >= 4
    for (let k = 0; k < count; k++) {
      // Each dot loops along its edge; random phases fill the line evenly.
      b.put(s.mx, s.my, 0, detour ? 1.3 : 1.7, detour ? ACCENT : INK, detour ? 0.6 : 0.9, [s.ux, s.uy, s.inner, 55 / s.inner])
    }
  })
  b.haze(L, rand, 0.12)
  return b.f
}

/** 4. Structure: the wireframe of the dashboard that appears next. */
function wireframe(n: number, L: StoryLayout, rand: Rand) {
  const b = new Builder(n, rand, { turb: 1, mouse: 0.3, vary: 0.2 })
  const S = L.screen
  // Image fractions (x right, y down) -> world.
  const X = (fx: number) => S.x + (fx - 0.5) * S.w
  const Y = (fy: number) => S.y - (fy - 0.5) * S.h

  const lines: [number, number, number, number, number][] = [] // x1 y1 x2 y2 weight
  const rect = (x1: number, y1: number, x2: number, y2: number, wgt = 1) => {
    lines.push([x1, y1, x2, y1, wgt], [x2, y1, x2, y2, wgt], [x2, y2, x1, y2, wgt], [x1, y2, x1, y1, wgt])
  }
  rect(0.055, 0.085, 0.945, 0.91, 1.3) // app frame
  lines.push([0.07, 0.16, 0.93, 0.16, 0.7]) // header rule
  rect(0.075, 0.105, 0.17, 0.135, 0.8) // logo
  rect(0.73, 0.11, 0.8, 0.14, 0.6) // header buttons
  rect(0.84, 0.11, 0.925, 0.14, 0.6)
  for (let k = 0; k < 5; k++) rect(0.067, 0.18 + k * 0.06, 0.085, 0.205 + k * 0.06, 0.6) // sidebar icons
  rect(0.125, 0.25, 0.68, 0.72) // main chart
  rect(0.125, 0.75, 0.68, 0.895, 0.8) // bottom chart
  rect(0.705, 0.185, 0.925, 0.38) // cards
  rect(0.705, 0.395, 0.925, 0.53)
  rect(0.705, 0.555, 0.925, 0.7)
  rect(0.705, 0.72, 0.925, 0.895)
  lines.push([0.125, 0.19, 0.24, 0.19, 1.6], [0.27, 0.19, 0.34, 0.19, 1.6]) // ticker
  // Candles in the chart
  const r2 = mulberry32(5)
  for (let k = 0; k < 26; k++) {
    const x = 0.15 + k * 0.02
    const mid = 0.48 + Math.sin(k * 0.7) * 0.06 + (r2() - 0.5) * 0.05
    const hgt = 0.04 + r2() * 0.07
    lines.push([x, mid - hgt, x, mid + hgt, 1.4])
  }
  // Rows in the side cards
  for (let k = 0; k < 4; k++) lines.push([0.72, 0.6 + k * 0.025, 0.9, 0.6 + k * 0.025, 0.35])
  for (let k = 0; k < 4; k++) lines.push([0.72, 0.77 + k * 0.03, 0.9, 0.77 + k * 0.03, 0.35])
  // Gauge
  const gx = 0.815
  const gy = 0.48
  for (let k = 0; k < 18; k++) {
    const a1 = Math.PI + (k / 18) * Math.PI
    const a2 = Math.PI + ((k + 1) / 18) * Math.PI
    lines.push([gx + Math.cos(a1) * 0.05, gy + Math.sin(a1) * 0.07, gx + Math.cos(a2) * 0.05, gy + Math.sin(a2) * 0.07, 1.5])
  }

  const world = lines.map(([x1, y1, x2, y2, wgt]) => {
    const ax = X(x1)
    const ay = Y(y1)
    const bx = X(x2)
    const by = Y(y2)
    return { ax, ay, bx, by, len: Math.hypot(bx - ax, by - ay) * wgt, wgt }
  })
  const lineDots = Math.floor(n * 0.62)
  const lenSum = world.reduce((a, l) => a + l.len, 0)
  for (const l of world) {
    const count = Math.max(2, Math.floor((lineDots * l.len) / lenSum))
    for (let k = 0; k < count; k++) {
      const t = (k + rand() * 0.3) / count
      b.put(l.ax + (l.bx - l.ax) * t, l.ay + (l.by - l.ay) * t, 0, 1.25, INK, 0.5 + 0.4 * Math.min(1, l.wgt))
    }
  }
  // A faint tone over the whole surface, so it reads as a screen.
  const tone = Math.floor(n * 0.16)
  for (let k = 0; k < tone; k++) {
    b.put(X(0.055 + rand() * 0.89), Y(0.085 + rand() * 0.825), 0, 0.9, ACCENT, 0.12)
  }
  b.haze(L, rand, 0.1)
  return b.f
}

/** 5. Alive: the real screenshot, sampled into a grid of coloured dots. */
function screen(n: number, L: StoryLayout, rand: Rand, pixels: ImageData | null) {
  const b = new Builder(n, rand, { turb: 0, mouse: 0, vary: 0 })
  const S = L.screen
  const grid = Math.floor(n * 0.97)
  const cols = Math.round(Math.sqrt(grid * SCREEN_ASPECT))
  const rows = Math.floor(grid / cols)
  const step = S.w / cols
  const img = pixels ? sampleGrid(pixels, cols, rows) : null
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const o = (r * cols + c) * 4
      const rgb = img ? [img[o] / 255, img[o + 1] / 255, img[o + 2] / 255] : INK
      b.put(S.x - S.w / 2 + (c + 0.5) * step, S.y + S.h / 2 - (r + 0.5) * step, 0, step * 1.12, rgb, 1)
    }
  }
  b.haze(L, rand, 0.08)
  return b.f
}

function sampleGrid(src: ImageData, cols: number, rows: number) {
  const canvas = document.createElement('canvas')
  canvas.width = src.width
  canvas.height = src.height
  canvas.getContext('2d')!.putImageData(src, 0, 0)
  const small = document.createElement('canvas')
  small.width = cols
  small.height = rows
  const ctx = small.getContext('2d', { willReadFrequently: true })!
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(canvas, 0, 0, cols, rows)
  return ctx.getImageData(0, 0, cols, rows).data
}

/** 6. The work: dots release into a wide orbit around what comes next. */
function orbit(n: number, L: StoryLayout, rand: Rand) {
  const b = new Builder(n, rand, { turb: 16, mouse: 1, vary: 1 })
  const rx = L.w * (L.mobile ? 0.48 : 0.42)
  const ry = L.h * (L.mobile ? 0.16 : 0.2)
  const ring = Math.floor(n * 0.7)
  for (let k = 0; k < ring; k++) {
    const a = rand() * Math.PI * 2
    const spread = 1 + gauss(rand) * 0.06
    b.put(
      Math.cos(a) * rx * spread,
      Math.sin(a) * ry * spread + L.h * 0.02,
      Math.sin(a) * 240,
      1 + rand() * 0.7,
      rand() < 0.04 ? ACCENT : INK,
      0.3 + rand() * 0.45,
    )
  }
  b.haze(L, rand, 0.12)
  return b.f
}

export function buildFormations(n: number, L: StoryLayout, pixels: ImageData | null): Formation[] {
  return [
    singularity(n, L, mulberry32(1)),
    noise(n, L, mulberry32(2)),
    clusters(n, L, mulberry32(3)),
    flow(n, L, mulberry32(4)),
    wireframe(n, L, mulberry32(5)),
    screen(n, L, mulberry32(6), pixels),
    orbit(n, L, mulberry32(7)),
  ]
}
