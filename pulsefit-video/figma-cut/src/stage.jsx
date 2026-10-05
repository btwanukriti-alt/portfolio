// Stage colour: each chapter has its own solid pastel, always filling the viewport. A new
// chapter opens with a Figma-style frame wipe: a frame in the next pastel is dragged out from
// the centre (selection handles and a teammate's cursor on its corner) until it fills the screen.
import { Cursor } from './fig.jsx'
import { CHAPTERS, E, FIG, P, clamp, lerp } from './lib.js'

const at = (t) => Math.max(0, CHAPTERS.findIndex((c) => t >= c.a && t < c.b))

export function Backdrop({ t }) {
  return <div style={{ position: 'absolute', inset: 0, background: CHAPTERS[at(t)].bg }} />
}

const WIPE = 0.65
const DRAGGER = { follow: 'Apurva Jha', convert: 'Apurva Jha', onboard: 'Anu', renew: 'Apurva Jha', outro: 'Anu' }
export function Wipe({ t, vw, vh, st }) {
  const i = at(t)
  const next = CHAPTERS[i + 1]
  if (!next || t < next.a - WIPE) return null
  const u = E.inOut(clamp((t - (next.a - WIPE)) / WIPE))
  const cx = st.ox + (st.W / 2) * st.s
  const cy = st.oy + (st.H / 2) * st.s
  const r = { x: lerp(cx, -4, u), y: lerp(cy, -4, u), w: lerp(0, vw + 8, u), h: lerp(0, vh + 8, u) }
  const hand = 1 - P(u, 0.75, 0.95)
  const hs = 13 * st.s
  const handle = (x, y) => <div key={`${x}-${y}`} style={{ position: 'absolute', left: x - hs / 2, top: y - hs / 2, width: hs, height: hs, background: '#fff', border: `${2 * st.s}px solid ${FIG.sel}`, boxSizing: 'border-box', borderRadius: 2 }} />
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 60 }}>
      <div style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: 36 * st.s * (1 - u), background: next.bg }} />
      {hand > 0 && (
        <div style={{ opacity: hand }}>
          <div style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, border: `${2.5 * st.s}px solid ${FIG.sel}`, boxSizing: 'border-box' }} />
          {handle(r.x, r.y)}
          {handle(r.x + r.w, r.y)}
          {handle(r.x, r.y + r.h)}
          {handle(r.x + r.w, r.y + r.h)}
        </div>
      )}
      <Cursor x={r.x + r.w} y={r.y + r.h} name={DRAGGER[next.id]} s={1.5 * st.s} o={1 - P(u, 0.8, 1)} />
    </div>
  )
}
