// The three scenes of the 10s cut, each a pure function of the clock `t` and the layout
// (`land` 1920 × 1080 or `port` 1080 × 1920). Values come from the college management Figma
// frames (section 267:97221).
//   1 · Intro: says what the product is. A frame is drawn on the canvas and fills with the
//       Financial Overview dashboard; product components land around it.
//   2 · Flow: the stacked-drawer prototype. A college row opens its drawer, a programme
//       opens a second drawer on top, a fee opens a third; each level keeps a spine tab.
//   3 · Close: the eight modules snap into an auto-layout grid.
import { Cursor, Selection, Spacing } from './fig.jsx'
import { C, E, FIG, P, SCENES, UI_FONT, clamp, kf, lerp, press, ripple, sway } from './lib.js'
import { AlertCard, KpiCard, LeaveCard, MODULES, MWIN, ModuleTile, OverviewWindow, ROW0, STACK, StackWindow, drawerLeft, levelBox } from './ui.jsx'

const S = Object.fromEntries(SCENES.map((s) => [s.id, s]))
const local = (t, id) => (t >= S[id].a - 0.02 && t < S[id].b + 0.02 ? t - S[id].a : null)
const Abs = ({ x, y, children, style }) => <div style={{ position: 'absolute', left: x, top: y, ...style }}>{children}</div>

// Eyebrow + title on top of every scene: words rise out of a mask, then lift away.
function Title({ L, W, u, out, eyebrow, lines }) {
  const port = L === 'port'
  const e = P(u, 0, 0.5)
  return (
    <div style={{ position: 'absolute', left: 0, width: W, top: port ? 150 : 70, textAlign: 'center', opacity: 1 - out, transform: `translateY(${-14 * E.inOut(out)}px)`, zIndex: 40 }}>
      <div style={{ font: `500 ${port ? 26 : 19}px/1 ${UI_FONT}`, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#3D3A5C', opacity: e * 0.85, transform: `translateY(${(1 - e) * 14}px)`, marginBottom: port ? 22 : 16 }}>{eyebrow}</div>
      {lines.map((line, i) => {
        const h = P(u, 0.1 + i * 0.1, 0.8 + i * 0.1, E.expo)
        return (
          <div key={i} style={{ overflow: 'hidden', paddingBottom: 8, marginBottom: -8 }}>
            <div style={{ font: `500 ${port ? 76 : 62}px/1.12 ${UI_FONT}`, letterSpacing: '-0.035em', color: C.ink, whiteSpace: 'nowrap', transform: `translateY(${(1 - h) * 105}%)` }}>{line}</div>
          </div>
        )
      })}
    </div>
  )
}

// =====================================================================================
// 1 · INTRO
// =====================================================================================
// The drawn frame holds the Financial Overview dashboard (1440 × 664) at k = frame width / 1440.
export const HOOK_FRAME = { land: { x: 440, y: 370, w: 1040, h: 480 }, port: { x: 70, y: 660, w: 940, h: 433 } }
const CS = 1.2
const CARDS = {
  land: [
    { kind: 'alert', label: 'Alert Card', w: 320, h: 152, to: { x: 70, y: 420 }, from: { x: -520, y: 320 }, rot: -6 },
    { kind: 'kpi', label: 'KPI Card', w: 300, h: 128, to: { x: 1500, y: 360 }, from: { x: 2100, y: 260 }, rot: 5 },
    { kind: 'leave', label: 'Leave Type', w: 300, h: 178, to: { x: 1480, y: 650 }, from: { x: 2100, y: 940 }, rot: -4 },
  ],
  port: [
    { kind: 'alert', label: 'Alert Card', w: 320, h: 152, to: { x: 60, y: 1200 }, from: { x: -520, y: 1290 }, rot: -5 },
    { kind: 'kpi', label: 'KPI Card', w: 300, h: 128, to: { x: 620, y: 1240 }, from: { x: 1300, y: 1340 }, rot: 5 },
    { kind: 'leave', label: 'Leave Type', w: 300, h: 178, to: { x: 330, y: 1480 }, from: { x: 330, y: 2100 }, rot: -3 },
  ],
}
export function Hook({ t, L, W, H }) {
  const u = local(t, 'hook')
  if (u === null) return null
  const port = L === 'port'
  const F = HOOK_FRAME[L]
  const k = F.w / MWIN.wide.w
  const draw = P(u, 0.35, 1.1, E.inOut)
  const fr = { x: F.x, y: F.y, w: F.w * draw, h: F.h * draw }
  const fill = P(u, 1.05, 1.45)
  const exit = P(u, 2.95, 3.35, E.inOut)
  const anu = kf(u, [[0, { x: W + 60, y: H - 60 }], [0.3, { x: F.x, y: F.y }], [0.35, { x: F.x, y: F.y }], [1.1, { x: F.x + F.w, y: F.y + F.h }], [1.25, { x: F.x + F.w, y: F.y + F.h }], [1.9, { x: F.x + F.w * 0.42, y: F.y + F.h + 90 }]])
  const asw = sway(u, 1, u > 1.9 ? 6 : 0)
  return (
    <>
      <Title L={L} W={W} u={u - 0.1} out={exit} eyebrow="College management software" lines={port ? ['Track fees and staff', 'across your colleges.'] : ['Track fees and staff across your colleges.']} />
      {u > 0.35 && (
        <div style={{ position: 'absolute', left: fr.x, top: fr.y, width: fr.w, height: fr.h, borderRadius: 16 * fill, background: '#fff', overflow: 'hidden', boxShadow: `0 40px 90px -40px rgba(40,30,110,${0.55 * fill})`, opacity: 1 - exit, transform: `translateY(${-30 * exit}px) scale(${1 - 0.03 * exit})` }}>
          <div style={{ opacity: fill, transform: `scale(${k})`, transformOrigin: '0 0' }}>
            <OverviewWindow k={P(u, 1.2, 2.2)} />
          </div>
        </div>
      )}
      {u > 0.35 && <div style={{ position: 'absolute', left: F.x, top: F.y - 34, font: `500 ${port ? 22 : 16}px/1 ${UI_FONT}`, color: '#3D3A5C', opacity: 0.8 * (1 - exit), whiteSpace: 'nowrap' }}>Financial overview</div>}
      <Selection x={fr.x} y={fr.y} w={fr.w} h={fr.h} o={u > 0.35 ? 1 - P(u, 1.3, 1.55) : 0} size={`${Math.round(fr.w)} × ${Math.round(fr.h)}`} k={port ? 1.4 : 1} />
      {CARDS[L].map((c, i) => {
        const a = 1.45 + i * 0.22
        const fly = P(u, a, a + 0.75, E.expo)
        const cw = c.w * CS
        const ch = c.h * CS
        const pos = { x: lerp(c.from.x, c.to.x, fly), y: lerp(c.from.y, c.to.y, fly) - 30 * exit }
        const rot = c.rot * (0.4 + 0.6 * fly) + (1 - fly) * 12
        const sel = u > a ? 1 - P(u, a + 0.85, a + 1.1) : 0
        return (
          <div key={c.kind}>
            <Abs x={pos.x} y={pos.y} style={{ transform: `rotate(${rot}deg)`, opacity: clamp((u - a) / 0.15) * (1 - exit), zIndex: 10 }}>
              <div style={{ transform: `scale(${CS})`, transformOrigin: '0 0' }}>
                {c.kind === 'alert' ? <AlertCard /> : c.kind === 'kpi' ? <KpiCard p={P(u, a + 0.4, a + 1.1)} /> : <LeaveCard p={P(u, a + 0.4, a + 1.0)} />}
              </div>
              <Selection x={0} y={0} w={cw} h={ch} o={sel} label={c.label} comp k={port ? 1.3 : 1.05} />
            </Abs>
          </div>
        )
      })}
      <Cursor x={anu.x + asw.x} y={anu.y + asw.y} o={1 - exit} s={port ? 2 : 1.5} />
    </>
  )
}

// =====================================================================================
// 2 · FLOW: the stacked-drawer prototype (college → programme → fee → batches)
// =====================================================================================
// The window (native STACK size) sits at (x, y) on the stage at scale K.
const FLOWW = {
  land: { K: 1.15, x: 270, y: 272, curFrom: { x: 1960, y: 1120 }, curRest: { x: 1700, y: 1000 } },
  port: { K: 1.65, x: 45, y: 610, curFrom: { x: 1120, y: 1900 }, curRest: { x: 930, y: 1770 } },
}
// Click times (scene-local) for level 0, 1 and 2's first row; drawer i opens after click i.
const CLICKS = [1.05, 2.3, 3.55]
export function Flow({ t, L, W }) {
  const u = local(t, 'flow')
  if (u === null) return null
  const port = L === 'port'
  const D = FLOWW[L]
  const G = STACK[L]
  const K = D.K
  const exit = P(u, 4.8, 5.2, E.inOut)
  const win = E.back(clamp((u - 0.1) / 0.55))
  const open = CLICKS.map((c) => P(u, c + 0.1, c + 0.7, E.expo))
  const k = [P(u, 0.3, 1.0), ...CLICKS.map((c) => P(u, c + 0.4, c + 1.1))]
  // Stage point of a level's first row (name column) and its row box.
  const rowAt = (lv) => {
    const b = levelBox(G, lv)
    return { x: D.x + K * (b.x + (port ? 150 : 170)), y: D.y + K * (ROW0 + 27), box: { x: D.x + K * b.x, y: D.y + K * ROW0, w: K * b.w, h: K * 54 } }
  }
  const R = [0, 1, 2].map(rowAt)
  const cur = kf(u, [
    [0.45, D.curFrom], [0.95, R[0]], [CLICKS[0] + 0.25, R[0]],
    [CLICKS[1] - 0.15, R[1]], [CLICKS[1] + 0.25, R[1]],
    [CLICKS[2] - 0.15, R[2]], [CLICKS[2] + 0.3, R[2]], [4.4, D.curRest],
  ])
  const cs = sway(u, 3, u > 4.4 ? 5 : 0)
  // Pressed row: the most recent click within its window.
  let pr = [-1, 0, 0]
  CLICKS.forEach((c, i) => {
    const h = u > c - 0.25 && u < c + 0.35 ? clamp(1 - Math.abs(u - c) / 0.3) : 0
    if (h > 0) pr = [i, 0, h]
  })
  const sk = port ? 1.35 : 1.1
  return (
    <>
      <Title L={L} W={W} u={u - 0.1} out={exit} eyebrow="Finance" lines={port ? ['Drill down from', 'college to fee.'] : ['Drill down from college to fee.']} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - exit, transform: `translateY(${-30 * E.inOut(exit)}px)` }}>
        <div style={{ position: 'absolute', left: D.x, top: D.y - 34, font: `500 ${port ? 22 : 16}px/1 ${UI_FONT}`, color: '#3D3A5C', opacity: 0.8 * clamp((u - 0.3) / 0.3) * (1 - open[0]), whiteSpace: 'nowrap' }}>Revenue contribution · Prototype</div>
        <Abs x={D.x} y={D.y} style={{ width: G.W * K, height: G.H * K, opacity: clamp((u - 0.1) / 0.25), transform: `scale(${0.9 + 0.1 * win})`, transformOrigin: '50% 60%', zIndex: 10 }}>
          <div style={{ transform: `scale(${K})`, transformOrigin: '0 0' }}>
            <StackWindow L={L} open={open} k={k} press={pr} />
          </div>
        </Abs>
        {/* prototype hotspots: the clicked row outlines in blue with its interaction */}
        {CLICKS.map((c, i) => {
          const o = clamp((u - (c - 0.35)) / 0.2) * (1 - clamp((u - (c + 0.08)) / 0.14))
          if (o <= 0) return null
          const b = R[i].box
          return (
            <div key={i} style={{ position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, opacity: o, zIndex: 30, pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', inset: -3, border: `2.5px solid ${FIG.proto}`, borderRadius: 14, background: 'rgba(13,153,255,.06)' }} />
              <div style={{ position: 'absolute', right: 0, top: -44 * (port ? 1.3 : 1), transform: `scale(${port ? 1.3 : 1})`, transformOrigin: '100% 100%', display: 'flex', alignItems: 'center', gap: 6, background: FIG.proto, color: '#fff', font: `600 15px/1 ${UI_FONT}`, padding: '8px 12px', borderRadius: 8, whiteSpace: 'nowrap' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11V5.5a2 2 0 014 0V11M13 9.5a2 2 0 014 0V12M17 11a2 2 0 014 0v3.5a6.5 6.5 0 01-6.5 6.5H13a6 6 0 01-4.6-2.2L5 14.5a2 2 0 013-2.6L9 13" /></svg>
                On click → Open overlay
              </div>
            </div>
          )
        })}
        {/* each drawer is selected as it lands */}
        {CLICKS.map((c, i) => {
          const left = drawerLeft(G, i + 1)
          const o = u > c + 0.55 ? P(u, c + 0.55, c + 0.7) * (1 - P(u, i < 2 ? CLICKS[i + 1] - 0.4 : 4.55, i < 2 ? CLICKS[i + 1] - 0.25 : 4.75)) : 0
          return <Selection key={i} x={D.x + K * left} y={D.y} w={K * (G.W - left)} h={K * G.H} o={o} label={`Drawer · Level ${i + 1}`} comp size={`${G.W - left} × ${G.H}`} k={sk} />
        })}
      </div>
      <Cursor x={cur.x + cs.x} y={cur.y + cs.y} o={P(u, 0.45, 0.7) * (1 - exit)} pr={press(u, CLICKS[0]) + press(u, CLICKS[1]) + press(u, CLICKS[2])} rp={ripple(u, CLICKS[0]) + ripple(u, CLICKS[1]) + ripple(u, CLICKS[2])} s={port ? 2 : 1.5} />
    </>
  )
}

// =====================================================================================
// 3 · CLOSE: the eight modules snap into auto layout
// =====================================================================================
const MODS = {
  land: {
    tw: 340,
    th: 124,
    slot: (i) => ({ x: 244 + (i % 4) * 364, y: i < 4 ? 540 : 688 }),
    scatter: [[150, 420, -14], [700, 380, -6], [1100, 360, 8], [1540, 400, 12], [220, 820, 10], [660, 900, 8], [1080, 900, 14], [1480, 840, -10]],
    box: { x: 212, y: 508, w: 1496, h: 336 },
    gaps: [[584, 608], [948, 972], [1312, 1336]].map(([a, b]) => ({ x1: a, x2: b, y: 540 })),
    cursor: { from: { x: 2050, y: 1150 }, to: { x: 1690, y: 910 } },
  },
  port: {
    tw: 440,
    th: 160,
    slot: (i) => ({ x: 88 + (i % 2) * 464, y: 760 + Math.floor(i / 2) * 184 }),
    scatter: [[60, 640, -12], [580, 600, 10], [40, 1000, 8], [600, 960, -9], [80, 1360, 10], [560, 1320, -8], [60, 1600, 12], [600, 1640, -10]],
    box: { x: 56, y: 728, w: 968, h: 776 },
    gaps: [0, 1, 2, 3].map((r) => ({ x1: 528, x2: 552, y: 760 + r * 184 })),
    cursor: { from: { x: 1200, y: 1800 }, to: { x: 920, y: 1580 } },
  },
}
export function Modules({ t, L, W }) {
  const u = local(t, 'modules')
  if (u === null) return null
  const port = L === 'port'
  const D = MODS[L]
  const exit = P(u, 1.95, 2.35, E.inOut)
  const snap = (i) => P(u, 0.45 + i * 0.03, 0.95 + i * 0.03, E.inOut)
  const sel = P(u, 0.95, 1.1)
  const gap = P(u, 1.0, 1.15)
  const cp = P(u, 0.7, 1.3, E.expo)
  const csw = sway(u, 2, 5)
  return (
    <>
      <Title L={L} W={W} u={u - 0.05} out={exit} eyebrow="All in one" lines={port ? ['Finance, staff,', 'banking and reports.'] : ['Finance, staff, banking and reports.']} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - exit, transform: `scale(${1 - 0.04 * exit})`, transformOrigin: '50% 55%' }}>
        {MODULES.map(([name, icon, tint], i) => {
          const a = 0.05 + i * 0.05
          const pp = E.back(clamp((u - a) / 0.4))
          const s = snap(i)
          const [sx, sy, sr] = D.scatter[i]
          const to = D.slot(i)
          return (
            <Abs key={name} x={lerp(sx, to.x, s)} y={lerp(sy, to.y, s)} style={{ transform: `rotate(${sr * (1 - s)}deg) scale(${pp})`, opacity: clamp((u - a) / 0.15), zIndex: 10 }}>
              <ModuleTile name={name} icon={icon} tint={tint} w={D.tw} h={D.th} />
            </Abs>
          )
        })}
        <Selection {...D.box} o={sel} label="Modules · Auto layout" size="Hug × Hug" k={port ? 1.4 : 1.2} />
        {D.gaps.map((g, i) => (
          <Spacing key={i} x1={g.x1} x2={g.x2} y={g.y} h={D.th} o={gap} value="24" />
        ))}
        <Cursor x={lerp(D.cursor.from.x, D.cursor.to.x, cp) + csw.x} y={lerp(D.cursor.from.y, D.cursor.to.y, cp) + csw.y} o={P(u, 0.7, 1.0)} s={port ? 2 : 1.5} />
      </div>
    </>
  )
}
