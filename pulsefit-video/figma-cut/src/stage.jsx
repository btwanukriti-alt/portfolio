// Viewport layers: the full-bleed stage colour with its big shapes (always edge to edge, at any
// aspect ratio) and the frame wipe that opens each scene, drawn above the content.
import { Cursor } from './fig.jsx'
import { DURATION, E, FIG, P, SCENES, clamp, lerp } from './lib.js'
import { HOOK_FRAME } from './scenes.jsx'

// Big background shapes per scene, in viewport units: cx/cy as fractions, size as a fraction
// of the viewport's longer side (M). They pop in after the wipe and drift slowly.
const SHAPES = {
  hook: [
    { k: 'glow', cx: 0.02, cy: 0.05, d: 0.55, c: 'rgba(31,79,244,.20)' },
    { k: 'glow', cx: 1.0, cy: 1.0, d: 0.6, c: 'rgba(245,189,37,.26)' },
    { k: 'glow', cx: 0.98, cy: 0.02, d: 0.4, c: 'rgba(115,88,245,.16)' },
  ],
  leads: [
    { k: 'circle', cx: 0.5, cy: 0.62, d: 1.0, c: 'rgba(255,255,255,.07)' },
    { k: 'circle', cx: 0.94, cy: 1.02, d: 0.46, c: '#F5BD25' },
    { k: 'pill', cx: 0.05, cy: 0.12, w: 0.36, h: 0.12, r: -28, c: '#7358F5' },
    { k: 'ring', cx: 0.08, cy: 0.9, d: 0.22, c: 'rgba(255,255,255,.22)' },
    { k: 'circle', cx: 0.9, cy: 0.1, d: 0.07, c: '#FF7AB0' },
  ],
  members: [
    { k: 'half', cx: 0.0, cy: 0.22, pcy: 0.66, d: 0.42, r: 90, c: '#1F4FF4' },
    { k: 'circle', cx: 0.97, cy: 0.92, d: 0.34, c: '#FFFFFF' },
    { k: 'star', cx: 0.9, cy: 0.13, pcy: 0.08, d: 0.13, c: '#E0457F' },
    { k: 'ring', cx: 0.12, cy: 0.95, d: 0.2, c: 'rgba(15,18,34,.14)' },
  ],
  modules: [
    { k: 'circle', cx: 0.5, cy: 0.58, d: 0.95, c: 'rgba(255,255,255,.07)' },
    { k: 'pill', cx: 0.92, cy: 0.12, w: 0.32, h: 0.11, r: 24, c: '#F5BD25' },
    { k: 'circle', cx: 0.06, cy: 0.94, d: 0.38, c: '#1F4FF4' },
    { k: 'squiggle', cx: 0.07, cy: 0.52, d: 0.13, c: '#FFFFFF' },
    { k: 'circle', cx: 0.96, cy: 0.86, d: 0.08, c: '#FF7AB0' },
  ],
}

function Shape({ s, M, vw, vh, u, i }) {
  const p = E.back(clamp((u - 0.05 - i * 0.07) / 0.7))
  if (p <= 0) return null
  const dx = Math.sin(u * 0.35 + i * 1.9) * M * 0.012
  const dy = Math.cos(u * 0.3 + i * 1.3) * M * 0.012
  // pcx / pcy: position override for portrait viewports.
  const port = vw / vh < 0.9
  const x = (port && s.pcx != null ? s.pcx : s.cx) * vw + dx
  const y = (port && s.pcy != null ? s.pcy : s.cy) * vh + dy
  const base = { position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${(s.r || 0) + u * (i % 2 ? 2 : -2)}deg) scale(${p})` }
  const d = (s.d || 0) * M
  if (s.k === 'glow') return <div style={{ ...base, transform: 'translate(-50%,-50%)', width: d, height: d, borderRadius: '50%', background: `radial-gradient(closest-side, ${s.c}, transparent)` }} />
  if (s.k === 'circle') return <div style={{ ...base, width: d, height: d, borderRadius: '50%', background: s.c }} />
  if (s.k === 'ring') return <div style={{ ...base, width: d, height: d, borderRadius: '50%', border: `${d * 0.12}px solid ${s.c}`, boxSizing: 'border-box' }} />
  if (s.k === 'pill') return <div style={{ ...base, width: s.w * M, height: s.h * M, borderRadius: s.h * M, background: s.c }} />
  if (s.k === 'half') return <div style={{ ...base, width: d, height: d / 2, borderRadius: `${d}px ${d}px 0 0`, background: s.c, transformOrigin: '50% 100%' }} />
  const path = {
    star: 'M50 2 61 34 96 36 68 57 79 92 50 71 21 92 32 57 4 36 39 34z',
    squiggle: 'M6 60 C 20 20, 34 20, 40 50 S 62 80, 70 44 S 90 14, 96 40',
  }[s.k]
  const line = s.k === 'squiggle'
  return (
    <svg width={d} height={d} viewBox="0 0 100 100" style={{ ...base, overflow: 'visible' }}>
      <path d={path} fill={line ? 'none' : s.c} stroke={line ? s.c : 'none'} strokeWidth="9" strokeLinecap="round" />
    </svg>
  )
}

const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>')}")`

const sceneAt = (t) => SCENES.findIndex((s) => t >= s.a && t < s.b)

export function Backdrop({ t, vw, vh, st }) {
  const M = Math.max(vw, vh)
  const i = Math.max(0, sceneAt(t))
  const sc = SCENES[i]
  const u = t - sc.a
  const shapes = SHAPES[sc.id] || []
  const light = sc.id === 'hook' || sc.id === 'members'
  return (
    <div style={{ position: 'absolute', inset: 0, background: sc.bg, overflow: 'hidden' }}>
      {/* soft key light so the flat colour has depth */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(70% 60% at 50% 38%, rgba(255,255,255,${light ? 0.55 : 0.16}), transparent 70%)` }} />
      {sc.id === 'hook' && (
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(60,70,100,.22) 1.4px, transparent 1.5px)', backgroundSize: `${28 * st.s}px ${28 * st.s}px`, backgroundPosition: `${st.ox}px ${st.oy}px` }} />
      )}
      {shapes.map((s, j) => (
        <Shape key={j} s={s} M={M} vw={vw} vh={vh} u={u} i={j} />
      ))}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: GRAIN, opacity: light ? 0.18 : 0.22, mixBlendMode: 'overlay' }} />
    </div>
  )
}

// The frame wipe into the next scene: a frame grows from a rect to cover the viewport, with
// Figma selection handles while it's small. Runs over the last 0.65s of each scene.
const WIPE = 0.65
const DRAGGER = { members: 'Anu', modules: 'Apurva Jha', hook: 'Anu' }
export function Wipe({ t, vw, vh, st, L }) {
  const i = sceneAt(t)
  if (i < 0) return null
  const next = SCENES[(i + 1) % SCENES.length]
  const T = i + 1 < SCENES.length ? SCENES[i + 1].a : DURATION
  if (t < T - WIPE) return null
  const u = E.inOut(clamp((t - (T - WIPE)) / WIPE))
  const toVp = (r) => ({ x: st.ox + r.x * st.s, y: st.oy + r.y * st.s, w: r.w * st.s, h: r.h * st.s })
  const fromFrame = next.id === 'leads'
  const o = fromFrame ? toVp(HOOK_FRAME[L]) : { x: st.ox + (st.W / 2) * st.s, y: st.oy + (st.H / 2) * st.s, w: 0, h: 0 }
  const full = { x: -4, y: -4, w: vw + 8, h: vh + 8 }
  const r = { x: lerp(o.x, full.x, u), y: lerp(o.y, full.y, u), w: lerp(o.w, full.w, u), h: lerp(o.h, full.h, u) }
  const rad = (fromFrame ? 28 : 36) * st.s * (1 - u)
  const hand = 1 - P(u, 0.75, 0.95)
  const hs = 10 * st.s * 1.3
  const handle = (x, y) => <div key={`${x}-${y}`} style={{ position: 'absolute', left: x - hs / 2, top: y - hs / 2, width: hs, height: hs, background: '#fff', border: `${2 * st.s}px solid ${FIG.sel}`, boxSizing: 'border-box', borderRadius: 2 }} />
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: rad, background: next.bg, boxShadow: `0 ${40 * st.s}px ${100 * st.s}px -${30 * st.s}px rgba(10,14,40,${0.45 * (1 - u)})` }} />
      {hand > 0 && (
        <div style={{ opacity: hand }}>
          <div style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, border: `${2.5 * st.s}px solid ${FIG.sel}`, boxSizing: 'border-box' }} />
          {handle(r.x, r.y)}
          {handle(r.x + r.w, r.y)}
          {handle(r.x, r.y + r.h)}
          {handle(r.x + r.w, r.y + r.h)}
        </div>
      )}
      {!fromFrame && <Cursor x={r.x + r.w} y={r.y + r.h} name={DRAGGER[next.id]} s={1.5 * st.s} o={1 - P(u, 0.8, 1)} />}
    </div>
  )
}
