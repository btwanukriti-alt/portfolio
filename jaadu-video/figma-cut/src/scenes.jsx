// The five scenes of the ~22s cut (slowed by SLOW), each a pure function of the clock `t` and
// the layout (`land` 1920 × 1080 or `port` 1080 × 1920). Values come from the trading platform
// Figma frames ("Desktop" section 2804:259012), made into one consistent data set.
//   0 · Research: a close-up of the Quant Lab prompt box. A question is typed and sent; the
//       camera pulls back to the full Research screen, the prompt docks at the bottom and the
//       agent's analysis (distribution + output table) fills in above it.
//   1 · Alert: the Create Alert form on its own. The value is typed and Create Alert is clicked.
//   2 · Notifications: a separate screen. The triggered alert pops in as a toast and docks as
//       the top row of the Notifications panel.
//   3 · Overnight discoveries: the falsification funnel and discoveries-per-night chart side by
//       side; clicking "3 survived" brings up the three survivors; one is saved to the library.
//   4 · Library: the Library screen; the saved strategy flies into its first slot.
import { Cursor, Selection } from './fig.jsx'
import { E, FIG, P, SCENES, SLOW, UI_FONT, C, clamp, kf, lerp, press, ripple, sway } from './lib.js'
import { AlertForm, CREATE, FCHIP, FORM, FUNNEL, FunnelCard, IC, LIB, LIBS, LibCard, LibraryHead, NOTE, NightsCard, NoteRow, Notifications, PROMPT, PageHead, PromptBox, ResearchResults, SAVE, SCARD, SEND, SHELL, STRATS, Shell, StrategyCard, VALUE, libCW, libCols } from './ui.jsx'

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

// =====================================================================================
// 0 · RESEARCH: a close-up of the prompt box → typed, sent → the camera pulls back to the
//     full Quant Lab Research screen, where the prompt docks at the bottom and results fill in
// =====================================================================================
// The window (Shell) sits at WIN[L] scaled by k; the prompt starts zoomed at scale Z.
export const WIN = { land: { x: 276, y: 256, k: 0.95 }, port: { x: 40, y: 650, k: 1.0 } }
const RZ = { land: { Z: 1.85, curFrom: { x: 1980, y: 1120 }, curRest: { x: 1720, y: 1030 } }, port: { Z: 1.15, curFrom: { x: 1150, y: 1950 }, curRest: { x: 960, y: 1860 } } }
export function Research({ t, L, W, H }) {
  const u = local(t, 'research')
  if (u === null) return null
  const port = L === 'port'
  const G = SHELL[L]
  const Wn = WIN[L]
  const k = Wn.k
  const Z = RZ[L].Z
  const exit = P(u, 4.6, 5.0, E.inOut)
  const tc1 = 0.95
  const tc2 = 2.4
  const pop = E.back(clamp((u - 0.1) / 0.5))
  // Prompt's final top-left (stage) inside the window, and its zoomed start position.
  const pf = { x: Wn.x + k * G.x, y: Wn.y + k * (G.h - PROMPT.h - 22) }
  const ps = { x: (W - Z * G.mw) / 2, y: (port ? 1150 : 650) - (Z * PROMPT.h) / 2 }
  const z = P(u, 2.5, 3.3, E.inOut)
  const input = { x: ps.x + Z * 320, y: ps.y + Z * 80 }
  const send = { x: ps.x + Z * (G.mw - 12 - SEND.s / 2), y: ps.y + Z * SEND.top }
  const cur = kf(u, [[0.4, RZ[L].curFrom], [0.85, input], [tc1 + 0.2, input], [2.05, input], [2.3, send], [tc2 + 0.12, send], [3.2, RZ[L].curRest]])
  const cs = sway(u, 2, u > 3.2 ? 5 : 0)
  const rp = P(u, 3.05, 4.2, (x) => x)
  const win = clamp((z - 0.15) / 0.6)
  const sel = u > 0.45 ? P(u, 0.45, 0.6) * (1 - P(u, 0.8, 0.95)) : 0
  const winSel = u > 3.35 ? P(u, 3.35, 3.5) * (1 - P(u, 3.9, 4.05)) : 0
  return (
    <>
      <Title L={L} W={W} u={u - 0.05} out={exit} eyebrow="AI trading platform" lines={port ? ['Ask the lab.', 'Get the analysis.'] : ['Ask the lab. Get the analysis.']} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - exit, transform: `translateY(${-30 * E.inOut(exit)}px)` }}>
        {win > 0 && (
          <Abs x={Wn.x} y={Wn.y} style={{ width: k * G.w, height: k * G.h, opacity: win, zIndex: 8, transform: `scale(${lerp(1.06, 1, E.out(win))})`, transformOrigin: '50% 100%', boxShadow: `0 50px 100px -40px rgba(20,20,90,${0.7 * win})`, borderRadius: 16 * k }}>
            <div style={{ transform: `scale(${k})`, transformOrigin: '0 0' }}>
              <Shell L={L} active="research">
                <div style={{ position: 'absolute', left: G.x, top: 92, width: G.mw, opacity: clamp((u - 2.9) / 0.3) }}>
                  <PageHead icon={IC.search} title="Research" sub="Sandboxed Python analysis · the agent writes and runs code to answer ad-hoc questions" />
                </div>
                {rp > 0 && (
                  <div style={{ position: 'absolute', left: G.x, top: 160 }}>
                    <ResearchResults w={G.mw} narrow={port} p={rp} gap={12} />
                  </div>
                )}
              </Shell>
            </div>
          </Abs>
        )}
        <Abs x={lerp(ps.x, pf.x, z)} y={lerp(ps.y, pf.y, z)} style={{ opacity: clamp((u - 0.1) / 0.2), zIndex: 12 }}>
          <div style={{ transform: `scale(${lerp(Z, k, z)})`, transformOrigin: '0 0' }}>
            <div style={{ transform: `scale(${0.94 + 0.06 * pop})`, transformOrigin: '50% 50%' }}>
              <PromptBox w={G.mw} typed={P(u, 1.05, 2.05, (x) => x)} focus={P(u, tc1, tc1 + 0.15) * (1 - P(u, 2.45, 2.6))} pr={press(u, tc2)} sent={u > tc2 + 0.05 ? 1 : 0} />
            </div>
          </div>
        </Abs>
        {win > 0.5 && <div style={{ position: 'absolute', left: Wn.x, top: Wn.y - 32, font: `500 ${port ? 22 : 16}px/1 ${UI_FONT}`, color: '#3D3A5C', opacity: 0.8 * clamp((win - 0.5) * 2) }}>Quant Lab · Research</div>}
        <Selection x={ps.x} y={ps.y} w={Z * G.mw} h={Z * PROMPT.h} o={sel} label="Prompt" comp size={`${G.mw} × ${PROMPT.h}`} k={port ? 1.35 : 1.2} />
        <Selection x={Wn.x} y={Wn.y} w={k * G.w} h={k * G.h} o={winSel} size={`${G.w} × ${G.h}`} k={port ? 1.35 : 1.1} />
      </div>
      <Cursor x={cur.x + cs.x} y={cur.y + cs.y} o={P(u, 0.4, 0.65) * (1 - exit)} pr={press(u, tc1) + press(u, tc2)} rp={ripple(u, tc1) + ripple(u, tc2)} s={port ? 2 : 1.5} />
    </>
  )
}

// =====================================================================================
// 1 · ALERT: the Create Alert form on its own
// =====================================================================================
const AL = {
  land: { K: 1.35, x: 609, y: 290, curFrom: { x: 1980, y: 1120 }, curRest: { x: 1480, y: 1000 } },
  port: { K: 1.6, x: 124, y: 700, curFrom: { x: 1150, y: 1950 }, curRest: { x: 900, y: 1820 } },
}
export function Alert({ t, L, W }) {
  const u = local(t, 'alert')
  if (u === null) return null
  const port = L === 'port'
  const D = AL[L]
  const K = D.K
  const exit = P(u, 2.8, 3.2, E.inOut)
  const tc1 = 1.0
  const tc2 = 2.2
  const pop = E.back(clamp((u - 0.1) / 0.55))
  const val = { x: D.x + K * VALUE.x, y: D.y + K * VALUE.y, w: K * VALUE.w, h: K * VALUE.h }
  const btn = { x: D.x + K * CREATE.x, y: D.y + K * CREATE.y, w: K * CREATE.w, h: K * CREATE.h }
  const at = (b) => ({ x: b.x + b.w * 0.45, y: b.y + b.h * 0.55 })
  const cur = kf(u, [[0.45, D.curFrom], [0.9, at(val)], [tc1 + 0.2, at(val)], [1.7, at(val)], [2.05, at(btn)], [tc2 + 0.2, at(btn)], [2.8, D.curRest]])
  const cs = sway(u, 3, u > 2.8 ? 5 : 0)
  const sk = port ? 1.35 : 1.1
  return (
    <>
      <Title L={L} W={W} u={u - 0.05} out={exit} eyebrow="Alerts" lines={port ? ['Set an alert', 'on any price.'] : ['Set an alert on any price.']} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - exit, transform: `translateY(${-30 * E.inOut(exit)}px)` }}>
        <Abs x={D.x} y={D.y} style={{ opacity: clamp((u - 0.1) / 0.2), transform: `translateY(${(1 - pop) * 30}px) scale(${0.94 + 0.06 * pop})`, transformOrigin: '50% 50%', zIndex: 10 }}>
          <div style={{ transform: `scale(${K})`, transformOrigin: '0 0' }}>
            <AlertForm typed={P(u, 1.1, 1.7, (x) => x)} focus={P(u, tc1, tc1 + 0.15) * (1 - P(u, 1.8, 1.95))} pr={press(u, tc2)} done={u > tc2 + 0.08 ? 1 : 0} />
          </div>
        </Abs>
        <Selection x={D.x} y={D.y} w={K * FORM.w} h={K * FORM.h} o={u > 0.4 ? P(u, 0.4, 0.55) * (1 - P(u, 0.75, 0.9)) : 0} label="Create Alert" comp size={`${FORM.w} × ${FORM.h}`} k={sk} />
      </div>
      <Cursor x={cur.x + cs.x} y={cur.y + cs.y} o={P(u, 0.45, 0.7) * (1 - exit)} pr={press(u, tc1) + press(u, tc2)} rp={ripple(u, tc1) + ripple(u, tc2)} s={port ? 2 : 1.5} />
    </>
  )
}

// =====================================================================================
// 2 · NOTIFICATIONS: the alert triggers; its toast docks into the panel
// =====================================================================================
const NT = {
  land: { K: 1.45, x: 670, y: 300, toast: { x: 1250, y: 330, s: 1.1, r: -4 }, curFrom: { x: 1980, y: 1120 }, curRest: { x: 1500, y: 1000 } },
  port: { K: 2.0, x: 140, y: 650, toast: { x: 150, y: 1690, s: 1.0, r: 3 }, curFrom: { x: 1150, y: 1950 }, curRest: { x: 940, y: 1850 } },
}
export function Notify({ t, L, W }) {
  const u = local(t, 'notify')
  if (u === null) return null
  const port = L === 'port'
  const D = NT[L]
  const K = D.K
  const exit = P(u, 2.6, 3.0, E.inOut)
  const pop = E.back(clamp((u - 0.1) / 0.55))
  const tpop = E.back(clamp((u - 0.45) / 0.45))
  const dock = P(u, 1.15, 1.75, E.inOut)
  const docked = dock > 0.985 ? 1 : 0
  const to = { x: D.x + K * 20, y: D.y + K * NOTE.row0 }
  const tx = lerp(D.toast.x, to.x, dock)
  const ty = lerp(D.toast.y, to.y, dock)
  const ts = K * lerp(D.toast.s, 1, dock)
  const row = { x: to.x, y: to.y, w: K * (NOTE.w - 40), h: K * 58 }
  const cur = kf(u, [[1.5, D.curFrom], [2.0, { x: row.x + row.w * 0.7, y: row.y + row.h * 0.6 }], [2.6, D.curRest]])
  const sel = u > 1.95 ? P(u, 1.95, 2.1) * (1 - P(u, 2.35, 2.5)) : 0
  return (
    <>
      <Title L={L} W={W} u={u - 0.05} out={exit} eyebrow="Notifications" lines={port ? ['Know the moment', 'it triggers.'] : ['Know the moment it triggers.']} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - exit, transform: `translateY(${-30 * E.inOut(exit)}px)` }}>
        <Abs x={D.x} y={D.y} style={{ opacity: clamp((u - 0.1) / 0.2), transform: `translateY(${(1 - pop) * 30}px) scale(${0.94 + 0.06 * pop})`, transformOrigin: '50% 50%', zIndex: 10 }}>
          <div style={{ transform: `scale(${K})`, transformOrigin: '0 0' }}>
            <Notifications arrive={P(u, 1.05, 1.6, (x) => x)} docked={docked} />
          </div>
        </Abs>
        {!docked && u > 0.45 && (
          <Abs x={tx} y={ty} style={{ opacity: clamp((u - 0.45) / 0.15), transform: `rotate(${D.toast.r * (1 - dock)}deg) scale(${ts * (0.85 + 0.15 * tpop)})`, transformOrigin: '0 0', zIndex: 14 }}>
            <div style={{ width: NOTE.w - 40, borderRadius: 10, background: C.panel, boxShadow: `0 ${30 * (1 - dock) + 6}px ${60 * (1 - dock) + 12}px -20px rgba(8,10,60,.7)` }}>
              <NoteRow sym="BTC" title="BTC / USDT crossed $116,000" sub="Price alert · now $116,040" time="now" unread glow={1} />
            </div>
          </Abs>
        )}
        <Selection x={row.x} y={row.y} w={row.w} h={row.h} o={sel} label="Notification" comp k={port ? 1.35 : 1.1} />
      </div>
      <Cursor x={cur.x} y={cur.y} o={P(u, 1.5, 1.75) * (1 - exit)} s={port ? 2 : 1.5} />
    </>
  )
}

// =====================================================================================
// 3 · OVERNIGHT DISCOVERIES: funnel + nightly chart, then the three survivors
// =====================================================================================
const DS = {
  land: { K: 1.25, x: 198, y: 330, fw: 760, nw: 550, nh: FUNNEL.h, gap: 20, stack: false, cK: 1.4, cols: 3, cgap: 32, cy: 360, curFrom: { x: 1980, y: 1120 }, curRest: { x: 1780, y: 1030 } },
  port: { K: 1.3, x: 46, y: 719, fw: 760, nw: 760, nh: 300, gap: 23, stack: true, cK: 1.55, cols: 2, cgap: 26, cy: 672, curFrom: { x: 1150, y: 1950 }, curRest: { x: 960, y: 1860 } },
}
export function Discoveries({ t, L, W }) {
  const u = local(t, 'disc')
  if (u === null) return null
  const port = L === 'port'
  const D = DS[L]
  const K = D.K
  const exit = P(u, 3.9, 4.3, E.inOut)
  const tc = 2.1
  const tc2 = 3.2
  const fpop = E.back(clamp((u - 0.1) / 0.55))
  const npop = E.back(clamp((u - 0.25) / 0.55))
  const recede = P(u, tc + 0.05, tc + 0.5, E.inOut)
  const nx = D.stack ? D.x : D.x + K * (D.fw + D.gap)
  const ny = D.stack ? D.y + K * (FUNNEL.h + D.gap) : D.y
  const chip = { x: D.x + K * (D.fw - 28 - FCHIP.w), y: D.y + K * FCHIP.y, w: K * FCHIP.w, h: K * FCHIP.h }
  const target = { x: chip.x + chip.w * 0.55, y: chip.y + chip.h * 0.6 }
  const cw = SCARD.w * D.cK
  const ch = SCARD.h * D.cK
  const slot = (i) => {
    const r = Math.floor(i / D.cols)
    const inRow = Math.min(D.cols, STRATS.length - r * D.cols)
    const x0 = (W - (inRow * cw + (inRow - 1) * D.cgap)) / 2
    return { x: x0 + (i % D.cols) * (cw + D.cgap), y: D.cy + r * (ch + D.cgap) }
  }
  const c0 = slot(0)
  const save = { x: c0.x + D.cK * SAVE.x, y: c0.y + D.cK * SAVE.y, w: D.cK * SAVE.w, h: D.cK * SAVE.h }
  const saveAt = { x: save.x + save.w * 0.45, y: save.y + save.h * 0.6 }
  const cur = kf(u, [[1.4, D.curFrom], [1.95, target], [tc + 0.2, target], [2.95, saveAt], [tc2 + 0.15, saveAt], [3.8, D.curRest]])
  const cs = sway(u, 5, u > 3.8 ? 5 : 0)
  const back = { opacity: 1 - recede, transform: `translateY(${-40 * recede}px) scale(${1 - 0.05 * recede})`, transformOrigin: '50% 0' }
  const selF = u > 0.55 ? P(u, 0.55, 0.7) * (1 - P(u, 1.1, 1.25)) : 0
  const selC = u > 2.6 ? P(u, 2.6, 2.75) * (1 - P(u, 2.95, 3.1)) : 0
  const sk = port ? 1.35 : 1.1
  return (
    <>
      <Title L={L} W={W} u={u - 0.05} out={exit} eyebrow="Overnight discoveries" lines={port ? ['642 strategies tested', 'overnight. 3 survived.'] : ['642 strategies tested overnight. 3 survived.']} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - exit, transform: `translateY(${-30 * E.inOut(exit)}px)` }}>
        {recede < 1 && (
          <div style={{ position: 'absolute', inset: 0, ...back }}>
            <Abs x={D.x} y={D.y} style={{ opacity: clamp((u - 0.1) / 0.2), transform: `translateY(${(1 - fpop) * 30}px) scale(${0.94 + 0.06 * fpop})`, transformOrigin: '50% 50%', zIndex: 10 }}>
              <div style={{ transform: `scale(${K})`, transformOrigin: '0 0' }}>
                <FunnelCard w={D.fw} p={P(u, 0.35, 1.45, E.inOut)} chip={P(u, 1.3, 1.55)} pr={press(u, tc)} />
              </div>
            </Abs>
            <Abs x={nx} y={ny} style={{ opacity: clamp((u - 0.25) / 0.2), transform: `translateY(${(1 - npop) * 30}px) scale(${0.94 + 0.06 * npop})`, transformOrigin: '50% 50%', zIndex: 10 }}>
              <div style={{ transform: `scale(${K})`, transformOrigin: '0 0' }}>
                <NightsCard w={D.nw} h={D.nh} p={P(u, 0.5, 1.4)} />
              </div>
            </Abs>
            <Selection x={D.x} y={D.y} w={K * D.fw} h={K * FUNNEL.h} o={selF} label="Falsification Funnel" comp size={`${D.fw} × ${FUNNEL.h}`} k={sk} />
          </div>
        )}
        {STRATS.map((_, i) => {
          const a = 2.4 + i * 0.15
          if (u < a) return null
          const pp = E.back(clamp((u - a) / 0.5))
          const s0 = slot(i)
          return (
            <Abs key={i} x={s0.x} y={s0.y} style={{ opacity: clamp((u - a) / 0.15), transform: `translateY(${(1 - pp) * 60}px) scale(${0.86 + 0.14 * pp})`, transformOrigin: '50% 50%', zIndex: 11 }}>
              <div style={{ transform: `scale(${D.cK})`, transformOrigin: '0 0' }}>
                <StrategyCard i={i} p={P(u, a + 0.2, a + 1.0)} saved={i === 0 && u > tc2 + 0.08 ? 1 : 0} pr={i === 0 ? press(u, tc2) : 0} />
              </div>
              <Selection x={0} y={0} w={cw} h={ch} o={i === 0 ? selC : 0} label="Strategy Card" comp size={`${SCARD.w} × ${SCARD.h}`} k={sk} />
            </Abs>
          )
        })}
      </div>
      <Cursor x={cur.x + cs.x} y={cur.y + cs.y} o={P(u, 1.4, 1.65) * (1 - exit)} pr={press(u, tc) + press(u, tc2)} rp={ripple(u, tc) + ripple(u, tc2)} s={port ? 2 : 1.5} />
    </>
  )
}

// =====================================================================================
// 4 · LIBRARY: the Library screen; the strategy just saved flies into the first slot
// =====================================================================================
const LB = { land: { from: { x: 700, y: 420 }, fs: 1.5, curFrom: { x: 1980, y: 1120 }, curRest: { x: 1720, y: 1030 } }, port: { from: { x: 200, y: 900 }, fs: 1.6, curFrom: { x: 1150, y: 1950 }, curRest: { x: 960, y: 1860 } } }
export function Library({ t, L, W }) {
  const u = local(t, 'library')
  if (u === null) return null
  const port = L === 'port'
  const G = SHELL[L]
  const Wn = WIN[L]
  const k = Wn.k
  const D = LB[L]
  const exit = P(u, 2.9, 3.3, E.inOut)
  const pop = E.back(clamp((u - 0.1) / 0.55))
  const cols = libCols(L)
  const cw = libCW(L)
  const slot = (i) => ({ x: G.x + (i % cols) * (cw + LIB.gap), y: LIB.top + Math.floor(i / cols) * (LIB.ch + LIB.gap) })
  const s0 = slot(0)
  const to = { x: Wn.x + k * s0.x, y: Wn.y + k * s0.y }
  const fly = P(u, 0.55, 1.25, E.inOut)
  const fx = lerp(D.from.x, to.x, fly)
  const fy = lerp(D.from.y, to.y, fly)
  const fs = k * lerp(D.fs, 1, fly)
  const glow = P(u, 1.2, 1.45) * (1 - 0.5 * P(u, 2.4, 2.8))
  const sel = u > 1.45 ? P(u, 1.45, 1.6) * (1 - P(u, 2.2, 2.35)) : 0
  const cur = kf(u, [[1.3, D.curFrom], [1.8, { x: to.x + k * cw * 0.6, y: to.y + k * LIB.ch * 0.45 }], [2.6, D.curRest]])
  return (
    <>
      <Title L={L} W={W} u={u - 0.05} out={exit} eyebrow="Library" lines={port ? ['Saved strategies,', 'sorted by regime.'] : ['Saved strategies, sorted by regime.']} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - exit, transform: `translateY(${-30 * E.inOut(exit)}px)` }}>
        <Abs x={Wn.x} y={Wn.y} style={{ width: k * G.w, height: k * G.h, opacity: clamp((u - 0.1) / 0.2), transform: `translateY(${(1 - pop) * 30}px) scale(${0.96 + 0.04 * pop})`, transformOrigin: '50% 50%', zIndex: 8, boxShadow: '0 50px 100px -40px rgba(20,20,90,.7)', borderRadius: 16 * k }}>
          <div style={{ transform: `scale(${k})`, transformOrigin: '0 0' }}>
            <Shell L={L} active="library">
              <div style={{ position: 'absolute', left: G.x, top: 92, width: G.mw, opacity: clamp((u - 0.25) / 0.25) }}>
                <LibraryHead chips={clamp((u - 0.35) / 0.25)} />
              </div>
              {LIBS.map((_, i) => {
                if (i === 0) return null
                const a = 0.45 + i * 0.07
                const pp = E.back(clamp((u - a) / 0.45))
                const sl = slot(i)
                return (
                  <div key={i} style={{ position: 'absolute', left: sl.x, top: sl.y, opacity: clamp((u - a) / 0.15), transform: `translateY(${(1 - pp) * 30}px) scale(${0.92 + 0.08 * pp})`, transformOrigin: '50% 50%' }}>
                    <LibCard i={i} w={cw} />
                  </div>
                )
              })}
              <div style={{ position: 'absolute', left: s0.x, top: s0.y, width: cw, height: LIB.ch, borderRadius: 16, border: `1.5px dashed ${C.line}`, opacity: 1 - fly }} />
            </Shell>
          </div>
        </Abs>
        {u > 0.5 && (
          <Abs x={fx} y={fy} style={{ opacity: clamp((u - 0.5) / 0.15), transform: `rotate(${-4 * (1 - fly)}deg) scale(${fs})`, transformOrigin: '0 0', zIndex: 14 }}>
            <LibCard i={0} w={cw} glow={glow} />
          </Abs>
        )}
        <Selection x={to.x} y={to.y} w={k * cw} h={k * LIB.ch} o={sel} label="Strategy Card · saved" comp k={port ? 1.35 : 1.1} />
        {u > 0.3 && <div style={{ position: 'absolute', left: Wn.x, top: Wn.y - 32, font: `500 ${port ? 22 : 16}px/1 ${UI_FONT}`, color: '#3D3A5C', opacity: 0.8 * clamp((u - 0.3) / 0.3) }}>Quant Lab · Library</div>}
      </div>
      <Cursor x={cur.x} y={cur.y} o={P(u, 1.3, 1.55) * (1 - exit)} s={port ? 2 : 1.5} />
    </>
  )
}
