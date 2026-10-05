// The three scenes of the 10s cut, each a pure function of the clock `t` and the layout
// (`land` 1920 × 1080 or `port` 1080 × 1920). Values come from the Pulsefit Figma frames.
//   1 · Intro: says what the product is. A frame is drawn on the canvas and fills with the
//       Pulsefit Members dashboard; teammates drag product components in around it.
//   2 · Leads: the lead card → Convert to Member → Assign Plan flow, with selections,
//       a prototype noodle and the total counting up.
//   3 · Close: the seven modules snap into an auto-layout grid.
import { Cursor, Noodle, Selection, Spacing, Toolbar } from './fig.jsx'
import { C, E, P, SCENES, UI_FONT, clamp, kf, lerp, press, ripple, sway } from './lib.js'
import { ASSIGN, AssignCard, KpiCard, LEAD, LeadCard, MODULES, MWIN, MembersWindow, ModuleTile, PlanMini, ScoreCard, ScoreChip } from './ui.jsx'

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
// The drawn frame holds the Members dashboard (1440 × 664) at k = frame width / 1440.
export const HOOK_FRAME = { land: { x: 500, y: 330, w: 920, h: 424 }, port: { x: 90, y: 600, w: 900, h: 415 } }
const CS = 1.15
const CARDS = {
  land: [
    { kind: 'score', name: 'Apurva Jha', label: 'Lead Score', w: 320, h: 152, to: { x: 110, y: 300 }, from: { x: -520, y: 220 }, rot: -6, grab: { x: 330, y: 160 } },
    { kind: 'kpi', name: 'Shikhar Tiwari', label: 'KPI Card', w: 300, h: 128, to: { x: 1450, y: 290 }, from: { x: 2100, y: 200 }, rot: 5, grab: { x: 40, y: 130 } },
    { kind: 'plan', name: 'Neha Singh', label: 'Plan Card', w: 280, h: 178, to: { x: 1480, y: 650 }, from: { x: 2100, y: 900 }, rot: -4, grab: { x: 40, y: 190 } },
  ],
  port: [
    { kind: 'score', name: 'Apurva Jha', label: 'Lead Score', w: 320, h: 152, to: { x: 70, y: 1110 }, from: { x: -520, y: 1200 }, rot: -5, grab: { x: 330, y: 160 } },
    { kind: 'kpi', name: 'Shikhar Tiwari', label: 'KPI Card', w: 300, h: 128, to: { x: 640, y: 1150 }, from: { x: 1300, y: 1250 }, rot: 5, grab: { x: 40, y: 130 } },
    { kind: 'plan', name: 'Neha Singh', label: 'Plan Card', w: 280, h: 178, to: { x: 330, y: 1400 }, from: { x: 330, y: 2100 }, rot: -3, grab: { x: 260, y: 190 } },
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
      <Title L={L} W={W} u={u - 0.1} out={exit} eyebrow="Pulsefit · gym management software" lines={port ? ['Run your whole gym', 'from one place.'] : ['Run your whole gym from one place.']} />
      <Toolbar x={W / 2} y={port ? 1810 : 990} o={P(u, 0.05, 0.4) * (1 - exit)} active={u > 0.3 && u < 1.15 ? 1 : 0} />
      {u > 0.35 && (
        <div style={{ position: 'absolute', left: fr.x, top: fr.y, width: fr.w, height: fr.h, borderRadius: 16 * fill, background: '#fff', overflow: 'hidden', boxShadow: `0 40px 90px -40px rgba(40,30,110,${0.55 * fill})` }}>
          <div style={{ opacity: fill, transform: `scale(${k})`, transformOrigin: '0 0' }}>
            <MembersWindow k={P(u, 1.2, 2.2)} />
          </div>
        </div>
      )}
      {u > 0.35 && <div style={{ position: 'absolute', left: F.x, top: F.y - 34, font: `500 ${port ? 22 : 16}px/1 ${UI_FONT}`, color: '#3D3A5C', opacity: 0.8 * (1 - exit), whiteSpace: 'nowrap' }}>Pulsefit — Members</div>}
      <Selection x={fr.x} y={fr.y} w={fr.w} h={fr.h} o={u > 0.35 ? 1 - P(u, 1.3, 1.55) : 0} size={`${Math.round(fr.w)} × ${Math.round(fr.h)}`} k={port ? 1.4 : 1} />
      {CARDS[L].map((c, i) => {
        const a = 1.45 + i * 0.22
        const fly = P(u, a, a + 0.75, E.expo)
        const cw = c.w * CS
        const ch = c.h * CS
        const pos = { x: lerp(c.from.x, c.to.x, fly), y: lerp(c.from.y, c.to.y, fly) - 30 * exit }
        const rot = c.rot * (0.4 + 0.6 * fly) + (1 - fly) * 12
        const sel = u > a ? 1 - P(u, a + 0.85, a + 1.1) : 0
        const sw = sway(u, i * 2.1, 4)
        const cur = { x: pos.x + c.grab.x * CS + (u > a + 0.9 ? sw.x : 0), y: pos.y + c.grab.y * CS + (u > a + 0.9 ? sw.y : 0) }
        return (
          <div key={c.kind}>
            <Abs x={pos.x} y={pos.y} style={{ transform: `rotate(${rot}deg)`, opacity: clamp((u - a) / 0.15) * (1 - exit), zIndex: 10 }}>
              <div style={{ transform: `scale(${CS})`, transformOrigin: '0 0' }}>
                {c.kind === 'score' ? <ScoreCard p={P(u, a + 0.6, a + 1.4)} /> : c.kind === 'kpi' ? <KpiCard p={P(u, a + 0.6, a + 1.4)} /> : <PlanMini />}
              </div>
              <Selection x={0} y={0} w={cw} h={ch} o={sel} label={c.label} comp k={port ? 1.3 : 1.05} />
            </Abs>
            <Cursor x={cur.x} y={cur.y} name={c.name} o={P(u, a - 0.25, a) * (1 - exit)} s={port ? 2 : 1.5} />
          </div>
        )
      })}
      <Cursor x={anu.x + asw.x} y={anu.y + asw.y} name="Anu" o={1 - exit} s={port ? 2 : 1.5} />
    </>
  )
}

// =====================================================================================
// 2 · LEADS
// =====================================================================================
const LEADS = {
  land: { K: 1.45, c0: { x: 960, y: 650 }, c1: { x: 580, y: 650 }, a: { x: 1350, y: 650 }, vertical: false, curFrom: { x: 1700, y: 1060 }, curRest: { x: 980, y: 930 } },
  port: { K: 1.6, c0: { x: 540, y: 1060 }, c1: { x: 540, y: 880 }, a: { x: 540, y: 1500 }, vertical: true, curFrom: { x: 1080, y: 1880 }, curRest: { x: 920, y: 1220 } },
}
export function Leads({ t, L, W }) {
  const u = local(t, 'leads')
  if (u === null) return null
  const port = L === 'port'
  const D = LEADS[L]
  const K = D.K
  const exit = P(u, 3.25, 3.6, E.inOut)
  const lw = LEAD.w * K
  const lh = LEAD.h * K
  const move = P(u, 1.75, 2.35, E.inOut)
  const c = { x: lerp(D.c0.x, D.c1.x, move), y: lerp(D.c0.y, D.c1.y, move) }
  const tl = { x: c.x - lw / 2, y: c.y - lh / 2 }
  const pop = E.back(clamp((u - 0.2) / 0.55))
  const btn = { x: tl.x + LEAD.btn.x * K, y: tl.y + LEAD.btn.y * K }
  const aw = ASSIGN.w * K
  const ah = ASSIGN.h * K
  const atl = { x: D.a.x - aw / 2, y: D.a.y - ah / 2 }
  const apop = E.back(clamp((u - 2.3) / 0.55))
  const tc = 1.55
  const cur = kf(u, [[0.7, D.curFrom], [1.4, btn], [1.7, btn], [2.5, D.curRest]])
  const cs = sway(u, 3, u > 2.5 ? 6 : 0)
  const n1 = D.vertical ? { x: c.x, y: tl.y + lh + 14 } : { x: tl.x + LEAD.btn.r * K + 16, y: btn.y }
  const n2 = D.vertical ? { x: D.a.x, y: atl.y - 16 } : { x: atl.x - 16, y: D.a.y }
  const sk = port ? 1.35 : 1.15
  return (
    <>
      <Title L={L} W={W} u={u - 0.1} out={exit} eyebrow="Leads" lines={port ? ['Turn every lead', 'into a member.'] : ['Turn every lead into a member.']} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - exit, transform: `translateY(${-30 * E.inOut(exit)}px)` }}>
        <Noodle x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} u={P(u, 1.95, 2.5, E.inOut)} vertical={D.vertical} label="On click" />
        <Abs x={tl.x} y={tl.y} style={{ width: lw, height: lh, opacity: clamp((u - 0.2) / 0.2), transform: `scale(${0.85 + 0.15 * pop})`, zIndex: 10 }}>
          <div style={{ transform: `scale(${K})`, transformOrigin: '0 0' }}>
            <LeadCard pr={press(u, tc)} />
          </div>
          <Selection x={0} y={0} w={lw} h={lh} o={u > 0.4 ? P(u, 0.4, 0.55) * (1 - P(u, 1.65, 1.8)) : 0} label="Lead Card" comp size="400 × 294" k={sk} />
          <Abs x={lw / 2} y={-30 - 48 * K} style={{ transform: `translateX(-50%) scale(${K * (0.7 + 0.3 * E.back(clamp((u - 0.5) / 0.45)))})`, transformOrigin: '50% 0', opacity: clamp((u - 0.5) / 0.2) }}>
            <ScoreChip p={P(u, 0.6, 1.4)} />
          </Abs>
        </Abs>
        {u > 2.25 && (
          <Abs x={atl.x} y={atl.y} style={{ width: aw, height: ah, opacity: clamp((u - 2.3) / 0.2), transform: `scale(${0.82 + 0.18 * apop})`, zIndex: 10 }}>
            <div style={{ transform: `scale(${K})`, transformOrigin: '0 0' }}>
              <AssignCard rows={P(u, 2.5, 2.95, E.out)} p={P(u, 2.6, 3.25, E.out)} />
            </div>
            <Selection x={0} y={0} w={aw} h={ah} o={P(u, 2.45, 2.6)} label="Assign Plan" comp k={sk} />
          </Abs>
        )}
      </div>
      <Cursor x={cur.x + cs.x} y={cur.y + cs.y} name="Apurva Jha" o={P(u, 0.7, 0.95) * (1 - exit)} pr={press(u, tc)} rp={ripple(u, tc)} s={port ? 2 : 1.5} />
    </>
  )
}

// =====================================================================================
// 3 · CLOSE: the seven modules snap into auto layout
// =====================================================================================
const MODS = {
  land: {
    tw: 300,
    slot: (i) => (i < 4 ? { x: 324 + i * 324, y: 450 } : { x: 486 + (i - 4) * 324, y: 586 }),
    scatter: [[150, 400, -14], [1560, 360, 12], [240, 800, 10], [1500, 820, -10], [720, 880, 8], [1100, 330, -6], [1080, 880, 14]],
    box: { x: 292, y: 418, w: 1336, h: 312 },
    gaps: [[624, 648], [948, 972], [1272, 1296]].map(([a, b]) => ({ x1: a, x2: b, y: 450 })),
    people: [['Anu', { x: 300, y: 770 }], ['Apurva Jha', { x: 1660, y: 400 }], ['Shikhar Tiwari', { x: 1600, y: 770 }], ['Neha Singh', { x: 230, y: 390 }]],
    from: [{ x: -100, y: 1100 }, { x: 2050, y: 200 }, { x: 2050, y: 1150 }, { x: -120, y: 200 }],
  },
  port: {
    tw: 440,
    slot: (i) => (i < 6 ? { x: 88 + (i % 2) * 464, y: 640 + Math.floor(i / 2) * 136 } : { x: 320, y: 640 + 3 * 136 }),
    scatter: [[60, 580, -12], [580, 540, 10], [40, 920, 8], [600, 880, -9], [80, 1260, 10], [560, 1220, -8], [300, 1400, 12]],
    box: { x: 56, y: 608, w: 968, h: 584 },
    gaps: [0, 1, 2].map((r) => ({ x1: 528, x2: 552, y: 640 + r * 136 })),
    people: [['Anu', { x: 120, y: 1280 }], ['Apurva Jha', { x: 960, y: 580 }], ['Shikhar Tiwari', { x: 900, y: 1270 }], ['Neha Singh', { x: 60, y: 560 }]],
    from: [{ x: -100, y: 1700 }, { x: 1200, y: 300 }, { x: 1200, y: 1800 }, { x: -120, y: 300 }],
  },
}
export function Modules({ t, L, W }) {
  const u = local(t, 'modules')
  if (u === null) return null
  const port = L === 'port'
  const D = MODS[L]
  const exit = P(u, 1.55, 1.75, E.inOut)
  const snap = (i) => P(u, 0.45 + i * 0.03, 0.95 + i * 0.03, E.inOut)
  const sel = P(u, 0.95, 1.1)
  const gap = P(u, 1.0, 1.15)
  return (
    <>
      <Title L={L} W={W} u={u - 0.05} out={exit} eyebrow="All in one" lines={port ? ['Everything your', 'gym runs on.'] : ['Everything your gym runs on.']} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - exit, transform: `scale(${1 - 0.04 * exit})`, transformOrigin: '50% 55%' }}>
        {MODULES.map(([name, icon, tint], i) => {
          const a = 0.05 + i * 0.05
          const pp = E.back(clamp((u - a) / 0.4))
          const s = snap(i)
          const [sx, sy, sr] = D.scatter[i]
          const to = D.slot(i)
          return (
            <Abs key={name} x={lerp(sx, to.x, s)} y={lerp(sy, to.y, s)} style={{ transform: `rotate(${sr * (1 - s)}deg) scale(${pp})`, opacity: clamp((u - a) / 0.15), zIndex: 10 }}>
              <ModuleTile name={name} icon={icon} tint={tint} w={D.tw} />
            </Abs>
          )
        })}
        <Selection {...D.box} o={sel} label="Modules · Auto layout" size="Hug × Hug" k={port ? 1.4 : 1.2} />
        {D.gaps.map((g, i) => (
          <Spacing key={i} x1={g.x1} x2={g.x2} y={g.y} h={112} o={gap} value="24" />
        ))}
        {D.people.map(([name, at], i) => {
          const p = P(u, 0.7 + i * 0.08, 1.25 + i * 0.08, E.expo)
          const sw = sway(u, i * 2.4, 5)
          return <Cursor key={name} name={name} x={lerp(D.from[i].x, at.x, p) + sw.x} y={lerp(D.from[i].y, at.y, p) + sw.y} o={p} s={port ? 2 : 1.5} />
        })}
      </div>
    </>
  )
}
