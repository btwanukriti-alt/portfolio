// The four scenes of the ~18.5s cut (slowed by SLOW), each a pure function of the clock `t` and
// the layout (`land` 1920 × 1080 or `port` 1080 × 1920). Values come from the trading platform
// Figma frames ("Desktop" section 2804:259012), made into one consistent data set.
//   0 · Opening: the four market regimes fly in and dock into the Regime gauge (the core idea:
//       read what the market is doing).
//   1 · Dashboard: a frame is drawn on the canvas and fills with the trading terminal; the
//       product's components (AI analyst, pattern detection, trades) land around it.
//   2 · Flow: set a price alert. The value is typed, Create Alert is clicked, and a prototype
//       noodle leads to the Notifications panel, where the triggered alert arrives.
//   3 · Quant lab: the overnight falsification funnel narrows 642 candidates to 3 survivors; one
//       is saved to the library.
import { Cursor, Noodle, Selection } from './fig.jsx'
import { C, E, FIG, P, SCENES, SLOW, UI_FONT, clamp, kf, lerp, press, ripple, sway } from './lib.js'
import { AlertForm, AnalystCard, CREATE, FORM, FUNNEL, FunnelCard, GAUGE, LEG, NOTE, Notifications, PatternCard, RegimeChip, RegimeGauge, SAVE, SCARD, STRATS, StrategyCard, TERM, Terminal, TradesCard, VALUE } from './ui.jsx'

const S = Object.fromEntries(SCENES.map((s) => [s.id, s]))
// Scene-local time, slowed by SLOW (every timing inside a scene is in these local seconds).
const local = (t, id) => (t >= S[id].a - 0.02 && t < S[id].b + 0.02 ? (t - S[id].a) / SLOW : null)
const Abs = ({ x, y, children, style }) => <div style={{ position: 'absolute', left: x, top: y, ...style }}>{children}</div>

// Eyebrow + title on top of every scene: words rise out of a mask, then lift away.
function Title({ L, W, u, out, eyebrow, lines }) {
  const port = L === 'port'
  const e = P(u, 0, 0.5)
  return (
    <div style={{ position: 'absolute', left: 0, width: W, top: port ? 150 : 70, textAlign: 'center', opacity: 1 - out, transform: `translateY(${-14 * E.inOut(out)}px)`, zIndex: 40, fontFamily: UI_FONT }}>
      <div style={{ font: `500 ${port ? 26 : 19}px/1 ${UI_FONT}`, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#3D3A5C', opacity: e * 0.85, transform: `translateY(${(1 - e) * 14}px)`, marginBottom: port ? 22 : 16 }}>{eyebrow}</div>
      {lines.map((line, i) => {
        const h = P(u, 0.1 + i * 0.1, 0.8 + i * 0.1, E.expo)
        return (
          <div key={i} style={{ overflow: 'hidden', paddingBottom: 8, marginBottom: -8 }}>
            <div style={{ font: `500 ${port ? 76 : 62}px/1.12 ${UI_FONT}`, letterSpacing: '-0.035em', color: C.title, whiteSpace: 'nowrap', transform: `translateY(${(1 - h) * 105}%)` }}>{line}</div>
          </div>
        )
      })}
    </div>
  )
}

// Prototype hotspot: the clicked control outlines in blue with an "On click → …" pill.
function Hotspot({ b, o, label, k = 1 }) {
  if (o <= 0) return null
  return (
    <div style={{ position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, opacity: o, zIndex: 30, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: -4, border: `2.5px solid ${FIG.proto}`, borderRadius: 12 }} />
      <div style={{ position: 'absolute', right: 0, bottom: '100%', marginBottom: 12, transform: `scale(${k})`, transformOrigin: '100% 100%', display: 'flex', alignItems: 'center', gap: 6, background: FIG.proto, color: '#fff', font: `600 15px/1 ${UI_FONT}`, padding: '8px 12px', borderRadius: 8, whiteSpace: 'nowrap' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11V5.5a2 2 0 014 0V11M13 9.5a2 2 0 014 0V12M17 11a2 2 0 014 0v3.5a6.5 6.5 0 01-6.5 6.5H13a6 6 0 01-4.6-2.2L5 14.5a2 2 0 013-2.6L9 13" /></svg>
        {label}
      </div>
    </div>
  )
}

// =====================================================================================
// 0 · OPENING: the four regimes, scattered on the canvas, dock into the Regime gauge
// =====================================================================================
const OPEN = {
  land: {
    K: 1.45, x: 641, y: 372,
    scatter: [[110, 360, -8], [1440, 330, 7], [80, 780, 6], [1460, 800, -6]],
    curFrom: { x: 1980, y: 1120 }, curRest: { x: 1560, y: 980 },
  },
  port: {
    K: 2.1, x: 78, y: 740,
    scatter: [[50, 520, -6], [640, 560, 6], [60, 1620, 5], [600, 1700, -5]],
    curFrom: { x: 1150, y: 1950 }, curRest: { x: 920, y: 1820 },
  },
}
export function Opening({ t, L, W }) {
  const u = local(t, 'open')
  if (u === null) return null
  const port = L === 'port'
  const D = OPEN[L]
  const K = D.K
  const exit = P(u, 2.3, 2.7, E.inOut)
  const tc = 0.9
  const pop = E.back(clamp((u - 0.1) / 0.5))
  const dockAt = (i) => tc + 0.05 + i * 0.1
  const docks = [0, 1, 2, 3].map((i) => P(u, dockAt(i), dockAt(i) + 0.55, E.inOut))
  const centre = { x: D.x + K * GAUGE.w * 0.5, y: D.y + K * 150 }
  const cur = kf(u, [[0.35, D.curFrom], [0.8, centre], [tc + 0.2, centre], [1.9, D.curRest]])
  const cs = sway(u, 1, u > 1.9 ? 5 : 0)
  const sel = u > 1.75 ? P(u, 1.75, 1.9) * (1 - P(u, 2.2, 2.3)) : 0
  return (
    <>
      <Title L={L} W={W} u={u - 0.05} out={exit} eyebrow="AI trading platform" lines={port ? ['Read the market', 'before you trade.'] : ['Read the market before you trade.']} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - exit, transform: `translateY(${-30 * E.inOut(exit)}px)` }}>
        <Abs x={D.x} y={D.y} style={{ opacity: clamp((u - 0.1) / 0.2), transform: `scale(${0.85 + 0.15 * pop})`, transformOrigin: '50% 50%', zIndex: 9 }}>
          <div style={{ transform: `scale(${K})`, transformOrigin: '0 0' }}>
            <RegimeGauge seg={docks.map((d) => clamp((d - 0.4) / 0.6))} k={docks[0]} pr={press(u, tc)} />
          </div>
        </Abs>
        {[0, 1, 2, 3].map((i) => {
          const a = 0.15 + i * 0.07
          const pp = E.back(clamp((u - a) / 0.45))
          const dock = docks[i]
          const [sx, sy, sr] = D.scatter[i]
          const to = { x: D.x + K * LEG[i].x, y: D.y + K * LEG[i].y }
          const sc = lerp(0.9, 1, dock)
          return (
            <Abs key={i} x={lerp(sx, to.x, dock)} y={lerp(sy, to.y, dock)} style={{ opacity: clamp((u - a) / 0.15), transform: `rotate(${sr * (1 - dock)}deg) scale(${K * sc * (0.8 + 0.2 * pp)})`, transformOrigin: '0 0', zIndex: dock > 0.5 ? 10 : 14 }}>
              <RegimeChip i={i} p={P(u, a + 0.2, a + 0.9)} float={1 - dock} />
            </Abs>
          )
        })}
        <Selection x={D.x} y={D.y} w={K * GAUGE.w} h={K * GAUGE.h} o={sel} label="Regime Gauge" comp size={`${GAUGE.w} × ${GAUGE.h}`} k={port ? 1.35 : 1.1} />
      </div>
      <Cursor x={cur.x + cs.x} y={cur.y + cs.y} o={P(u, 0.35, 0.6) * (1 - exit)} pr={press(u, tc)} rp={ripple(u, tc)} s={port ? 2 : 1.5} />
    </>
  )
}

// =====================================================================================
// 1 · DASHBOARD: a frame is drawn and fills with the trading terminal
// =====================================================================================
// The drawn frame holds the terminal (1440 × 664) at k = frame width / 1440.
export const HOOK_FRAME = { land: { x: 340, y: 310, w: 1240, h: 572 }, port: { x: 30, y: 650, w: 1020, h: 470 } }
const CS = { land: 1.1, port: 1.2 }
const CARDS = {
  land: [
    { kind: 'ai', label: 'AI Analyst', w: 340, h: 188, to: { x: 44, y: 690 }, from: { x: -520, y: 800 }, rot: -6 },
    { kind: 'pattern', label: 'Pattern Card', w: 330, h: 150, to: { x: 1515, y: 262 }, from: { x: 2100, y: 200 }, rot: 5 },
    { kind: 'trades', label: 'Trades', w: 300, h: 196, to: { x: 1545, y: 700 }, from: { x: 2100, y: 960 }, rot: -4 },
  ],
  port: [
    { kind: 'ai', label: 'AI Analyst', w: 340, h: 188, to: { x: 40, y: 1210 }, from: { x: -520, y: 1350 }, rot: -5 },
    { kind: 'pattern', label: 'Pattern Card', w: 330, h: 150, to: { x: 620, y: 1250 }, from: { x: 1300, y: 1400 }, rot: 5 },
    { kind: 'trades', label: 'Trades', w: 300, h: 196, to: { x: 350, y: 1530 }, from: { x: 350, y: 2100 }, rot: -3 },
  ],
}
export function Hook({ t, L, W, H }) {
  const u = local(t, 'hook')
  if (u === null) return null
  const port = L === 'port'
  const F = HOOK_FRAME[L]
  const k = F.w / TERM.w
  const draw = P(u, 0.35, 1.1, E.inOut)
  const fr = { x: F.x, y: F.y, w: F.w * draw, h: F.h * draw }
  const fill = P(u, 1.05, 1.45)
  const exit = P(u, 2.95, 3.35, E.inOut)
  const anu = kf(u, [[0, { x: W + 60, y: H - 60 }], [0.3, { x: F.x, y: F.y }], [0.35, { x: F.x, y: F.y }], [1.1, { x: F.x + F.w, y: F.y + F.h }], [1.25, { x: F.x + F.w, y: F.y + F.h }], [1.9, { x: F.x + F.w * 0.42, y: F.y + F.h + 90 }]])
  const asw = sway(u, 1, u > 1.9 ? 6 : 0)
  return (
    <>
      <Title L={L} W={W} u={u - 0.1} out={exit} eyebrow="Trading terminal" lines={port ? ['Charts, signals and AI', 'in one terminal.'] : ['Charts, signals and AI in one terminal.']} />
      {u > 0.35 && (
        <div style={{ position: 'absolute', left: fr.x, top: fr.y, width: fr.w, height: fr.h, borderRadius: 16 * fill, background: C.app, overflow: 'hidden', boxShadow: `0 40px 90px -40px rgba(20,20,90,${0.7 * fill})`, opacity: 1 - exit, transform: `translateY(${-30 * exit}px) scale(${1 - 0.03 * exit})` }}>
          <div style={{ opacity: fill, transform: `scale(${k})`, transformOrigin: '0 0' }}>
            <Terminal k={P(u, 1.2, 2.3, E.inOut)} />
          </div>
        </div>
      )}
      {u > 0.35 && <div style={{ position: 'absolute', left: F.x, top: F.y - 34, font: `500 ${port ? 22 : 16}px/1 ${UI_FONT}`, color: '#3D3A5C', opacity: 0.8 * (1 - exit), whiteSpace: 'nowrap' }}>Trading terminal</div>}
      <Selection x={fr.x} y={fr.y} w={fr.w} h={fr.h} o={u > 0.35 ? 1 - P(u, 1.3, 1.55) : 0} size={`${Math.round(fr.w)} × ${Math.round(fr.h)}`} k={port ? 1.4 : 1} />
      {CARDS[L].map((c, i) => {
        const a = 1.45 + i * 0.22
        const fly = P(u, a, a + 0.75, E.expo)
        const pos = { x: lerp(c.from.x, c.to.x, fly), y: lerp(c.from.y, c.to.y, fly) - 30 * exit }
        const rot = c.rot * (0.4 + 0.6 * fly) + (1 - fly) * 12
        const sel = u > a ? 1 - P(u, a + 0.85, a + 1.1) : 0
        const p = P(u, a + 0.4, a + 1.1)
        return (
          <Abs key={c.kind} x={pos.x} y={pos.y} style={{ transform: `rotate(${rot}deg)`, opacity: clamp((u - a) / 0.15) * (1 - exit), zIndex: 10 }}>
            <div style={{ transform: `scale(${CS[L]})`, transformOrigin: '0 0' }}>
              {c.kind === 'ai' ? <AnalystCard p={p} /> : c.kind === 'pattern' ? <PatternCard p={p} /> : <TradesCard p={p} />}
            </div>
            <Selection x={0} y={0} w={c.w * CS[L]} h={c.h * CS[L]} o={sel} label={c.label} comp k={port ? 1.3 : 1.05} />
          </Abs>
        )
      })}
      <Cursor x={anu.x + asw.x} y={anu.y + asw.y} o={1 - exit} s={port ? 2 : 1.5} />
    </>
  )
}

// =====================================================================================
// 2 · FLOW: set a price alert → it triggers in Notifications
// =====================================================================================
const AL = {
  land: { K: 1.3, form: { x: 292, y: 288 }, note: { x: 1108, y: 322 }, vertical: false, curFrom: { x: 1980, y: 1120 }, curRest: { x: 1000, y: 1020 } },
  port: { K: 1.3, form: { x: 202, y: 420 }, note: { x: 280, y: 1210 }, vertical: true, curFrom: { x: 1150, y: 1950 }, curRest: { x: 160, y: 1700 } },
}
const TC1 = 1.05
const TC2 = 2.25
export function Flow({ t, L, W }) {
  const u = local(t, 'flow')
  if (u === null) return null
  const port = L === 'port'
  const D = AL[L]
  const K = D.K
  const exit = P(u, 3.8, 4.2, E.inOut)
  const fpop = E.back(clamp((u - 0.1) / 0.55))
  const npop = E.back(clamp((u - 0.3) / 0.55))
  const val = { x: D.form.x + K * VALUE.x, y: D.form.y + K * VALUE.y, w: K * VALUE.w, h: K * VALUE.h }
  const btn = { x: D.form.x + K * CREATE.x, y: D.form.y + K * CREATE.y, w: K * CREATE.w, h: K * CREATE.h }
  const at = (b) => ({ x: b.x + b.w * 0.45, y: b.y + b.h * 0.55 })
  const cur = kf(u, [[0.5, D.curFrom], [0.95, at(val)], [TC1 + 0.2, at(val)], [1.75, at(val)], [2.1, at(btn)], [TC2 + 0.2, at(btn)], [3.0, D.curRest]])
  const cs = sway(u, 3, u > 3.0 ? 5 : 0)
  const focus = P(u, TC1, TC1 + 0.15) * (1 - P(u, 1.85, 2.0))
  const typed = P(u, 1.15, 1.75, (x) => x)
  const done = u > TC2 + 0.08 ? 1 : 0
  const noodle = P(u, 2.35, 2.95, E.inOut)
  const arrive = P(u, 2.85, 3.45, (x) => x)
  const rowY = D.note.y + K * (NOTE.row0 + 29)
  const n0 = port ? { x: btn.x + btn.w / 2, y: btn.y + btn.h + 6 } : { x: btn.x + btn.w + 6, y: btn.y + btn.h / 2 }
  const n1 = port ? { x: D.note.x + K * NOTE.w / 2, y: D.note.y - 8 } : { x: D.note.x - 10, y: rowY }
  const selForm = u > 0.45 ? P(u, 0.45, 0.6) * (1 - P(u, 0.85, 1.0)) : 0
  const selRow = u > 3.3 ? P(u, 3.3, 3.45) * (1 - P(u, 3.65, 3.8)) : 0
  const sk = port ? 1.35 : 1.1
  return (
    <>
      <Title L={L} W={W} u={u - 0.1} out={exit} eyebrow="Alerts" lines={port ? ['Set an alert.', 'Get notified when it hits.'] : ['Set an alert. Get notified when it hits.']} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - exit, transform: `translateY(${-30 * E.inOut(exit)}px)` }}>
        <Abs x={D.form.x} y={D.form.y} style={{ opacity: clamp((u - 0.1) / 0.2), transform: `translateY(${(1 - fpop) * 30}px) scale(${0.94 + 0.06 * fpop})`, transformOrigin: '50% 50%', zIndex: 10 }}>
          <div style={{ transform: `scale(${K})`, transformOrigin: '0 0' }}>
            <AlertForm typed={typed} focus={focus} pr={press(u, TC2)} done={done} />
          </div>
        </Abs>
        <Abs x={D.note.x} y={D.note.y} style={{ opacity: clamp((u - 0.3) / 0.2), transform: `translateY(${(1 - npop) * 30}px) scale(${0.94 + 0.06 * npop})`, transformOrigin: '50% 50%', zIndex: 10 }}>
          <div style={{ transform: `scale(${K})`, transformOrigin: '0 0' }}>
            <Notifications arrive={arrive} />
          </div>
        </Abs>
        <Selection x={D.form.x} y={D.form.y} w={K * FORM.w} h={K * FORM.h} o={selForm} label="Create Alert" comp size={`${FORM.w} × ${FORM.h}`} k={sk} />
        <Hotspot b={btn} o={clamp((u - (TC2 - 0.4)) / 0.2) * (1 - clamp((u - TC2 - 0.1) / 0.15))} label="On click → Create alert" k={port ? 1.3 : 1} />
        <Noodle x1={n0.x} y1={n0.y} x2={n1.x} y2={n1.y} u={noodle * (1 - P(u, 3.5, 3.7))} vertical={D.vertical} label="On trigger" />
        <Selection x={D.note.x + K * 20} y={D.note.y + K * NOTE.row0} w={K * (NOTE.w - 40)} h={K * 58} o={selRow} label="Notification" comp k={sk} />
      </div>
      <Cursor x={cur.x + cs.x} y={cur.y + cs.y} o={P(u, 0.5, 0.75) * (1 - exit)} pr={press(u, TC1) + press(u, TC2)} rp={ripple(u, TC1) + ripple(u, TC2)} s={port ? 2 : 1.5} />
    </>
  )
}

// =====================================================================================
// 3 · QUANT LAB: overnight falsification funnel → three survivors; one is saved
// =====================================================================================
const LAB = {
  land: { fK: 1.2, f: { x: 358, y: 296 }, cK: 1.2, cols: 3, gap: 26, cards: { y: 640 }, curFrom: { x: 1980, y: 1120 }, curRest: { x: 1780, y: 1030 } },
  port: { fK: 1.0, f: { x: 38, y: 540 }, cK: 1.5, cols: 2, gap: 40, cards: { y: 834 }, curFrom: { x: 1150, y: 1950 }, curRest: { x: 960, y: 1860 } },
}
export function Lab({ t, L, W }) {
  const u = local(t, 'lab')
  if (u === null) return null
  const port = L === 'port'
  const D = LAB[L]
  const exit = P(u, 3.5, 3.9, E.inOut)
  const fpop = E.back(clamp((u - 0.1) / 0.55))
  const cw = SCARD.w * D.cK
  const ch = SCARD.h * D.cK
  const slot = (i) => {
    const r = Math.floor(i / D.cols)
    const inRow = Math.min(D.cols, STRATS.length - r * D.cols)
    const x0 = (W - (inRow * cw + (inRow - 1) * D.gap)) / 2
    return { x: x0 + (i % D.cols) * (cw + D.gap), y: D.cards.y + r * (ch + D.gap) }
  }
  const tc = 2.6
  const c0 = slot(0)
  const save = { x: c0.x + D.cK * SAVE.x, y: c0.y + D.cK * SAVE.y, w: D.cK * SAVE.w, h: D.cK * SAVE.h }
  const target = { x: save.x + save.w * 0.4, y: save.y + save.h * 0.55 }
  const cur = kf(u, [[1.6, D.curFrom], [2.25, target], [tc + 0.2, target], [3.2, D.curRest]])
  const cs = sway(u, 5, u > 3.2 ? 5 : 0)
  const hover = P(u, 2.0, 2.2)
  const selCard = u > 2.0 ? P(u, 2.0, 2.15) * (1 - P(u, 2.45, 2.6)) : 0
  const selF = u > 0.4 ? P(u, 0.4, 0.55) * (1 - P(u, 1.2, 1.35)) : 0
  return (
    <>
      <Title L={L} W={W} u={u - 0.05} out={exit} eyebrow="Quant lab" lines={port ? ['642 strategies tested', 'overnight. 3 survived.'] : ['642 strategies tested overnight. 3 survived.']} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - exit, transform: `translateY(${-30 * E.inOut(exit)}px)` }}>
        <Abs x={D.f.x} y={D.f.y} style={{ opacity: clamp((u - 0.1) / 0.2), transform: `translateY(${(1 - fpop) * 30}px) scale(${0.94 + 0.06 * fpop})`, transformOrigin: '50% 50%', zIndex: 10 }}>
          <div style={{ transform: `scale(${D.fK})`, transformOrigin: '0 0' }}>
            <FunnelCard p={P(u, 0.35, 1.45, E.inOut)} banner={P(u, 1.3, 1.6)} />
          </div>
        </Abs>
        <Selection x={D.f.x} y={D.f.y} w={D.fK * FUNNEL.w} h={D.fK * FUNNEL.h} o={selF} label="Falsification Funnel" comp size={`${FUNNEL.w} × ${FUNNEL.h}`} k={port ? 1.35 : 1.1} />
        {STRATS.map((_, i) => {
          const a = 1.35 + i * 0.15
          const pp = E.back(clamp((u - a) / 0.5))
          const s0 = slot(i)
          const lift0 = i === 0 ? hover : 0
          return (
            <Abs key={i} x={s0.x} y={s0.y - 8 * lift0} style={{ opacity: clamp((u - a) / 0.15), transform: `translateY(${(1 - pp) * 50}px) scale(${0.86 + 0.14 * pp})`, transformOrigin: '50% 50%', zIndex: 10 + (i === 0 ? 1 : 0) }}>
              <div style={{ transform: `scale(${D.cK})`, transformOrigin: '0 0' }}>
                <StrategyCard i={i} p={P(u, a + 0.2, a + 1.0)} hover={lift0} saved={i === 0 && u > tc + 0.08 ? 1 : 0} pr={i === 0 ? press(u, tc) : 0} />
              </div>
              <Selection x={0} y={0} w={cw} h={ch} o={i === 0 ? selCard : 0} label="Strategy Card" comp size={`${SCARD.w} × ${SCARD.h}`} k={port ? 1.35 : 1.1} />
            </Abs>
          )
        })}
      </div>
      <Cursor x={cur.x + cs.x} y={cur.y + cs.y} o={P(u, 1.6, 1.85) * (1 - exit)} pr={press(u, tc)} rp={ripple(u, tc)} s={port ? 2 : 1.5} />
    </>
  )
}
