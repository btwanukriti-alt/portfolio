// The four scenes. Each is a pure function of the global clock `t` and the layout
// (`land` 1920 × 1080 or `port` 1080 × 1920 stage). Values on screen come from the Pulsefit
// Figma frames (see data notes in the storyboard).
import { Comment, Cursor, Headline, Noodle, Selection, Spacing, Sticker, Tag, Toolbar } from './fig.jsx'
import { C, E, P, SCENES, clamp, kf, lerp, press, ripple, sway } from './lib.js'
import { ASSIGN, AssignCard, IC, KpiCard, LEAD, LeadCard, MODULES, MWIN, MembersWindow, ModuleTile, PlanMini, ScoreCard, ScoreChip } from './ui.jsx'

const S = Object.fromEntries(SCENES.map((s) => [s.id, s]))
const local = (t, id) => {
  const s = S[id]
  return t >= s.a - 0.02 && t < s.b + 0.02 ? t - s.a : null
}
const Abs = ({ x, y, children, style }) => <div style={{ position: 'absolute', left: x, top: y, ...style }}>{children}</div>

// =====================================================================================
// 1 · HOOK: a frame is drawn on the canvas, the headline lands in it, and component cards
// are dragged in by teammates. The frame then grows into the next scene (the wipe).
// =====================================================================================
export const HOOK_FRAME = { land: { x: 500, y: 270, w: 920, h: 540 }, port: { x: 110, y: 540, w: 860, h: 700 } }
// Hook component cards are shown at this scale.
const CS = 1.3
const HOOK = {
  land: {
    lines: [['Run', 'the', 'whole', 'gym'], ['from', 'one place.']],
    size: 92,
    cards: [
      { kind: 'score', name: 'Apurva Jha', label: 'Lead Score', w: 320, h: 152, to: { x: 100, y: 110 }, from: { x: -560, y: 40 }, rot: -6, grab: { x: 330, y: 160 } },
      { kind: 'kpi', name: 'Shikhar Tiwari', label: 'KPI Card', w: 300, h: 128, to: { x: 1450, y: 200 }, from: { x: 2120, y: -80 }, rot: 5, grab: { x: 50, y: 130 } },
      { kind: 'plan', name: 'Neha Singh', label: 'Plan Card', w: 280, h: 178, to: { x: 160, y: 690 }, from: { x: 60, y: 1240 }, rot: 4, grab: { x: 290, y: 200 } },
    ],
    stickers: [
      { kind: 'burst', x: 1420, y: 270, s: 130, color: C.yellow, at: 3.0, rot: 10 },
      { kind: 'star', x: 1650, y: 800, s: 104, color: C.violet, at: 3.25, rot: -8 },
      { kind: 'squiggle', x: 400, y: 560, s: 120, color: C.pink, at: 3.4, rot: 0 },
    ],
    toolbar: { x: 960, y: 980 },
    anuRest: { x: 1500, y: 880 },
  },
  port: {
    lines: [['Run', 'the', 'whole'], ['gym', 'from'], ['one place.']],
    size: 104,
    cards: [
      { kind: 'score', name: 'Apurva Jha', label: 'Lead Score', w: 320, h: 152, to: { x: 60, y: 150 }, from: { x: -560, y: 80 }, rot: -5, grab: { x: 330, y: 160 } },
      { kind: 'kpi', name: 'Shikhar Tiwari', label: 'KPI Card', w: 300, h: 128, to: { x: 630, y: 330 }, from: { x: 1240, y: 20 }, rot: 5, grab: { x: 50, y: 130 } },
      { kind: 'plan', name: 'Neha Singh', label: 'Plan Card', w: 280, h: 178, to: { x: 100, y: 1310 }, from: { x: 40, y: 2100 }, rot: 4, grab: { x: 290, y: 200 } },
    ],
    stickers: [
      { kind: 'burst', x: 970, y: 540, s: 140, color: C.yellow, at: 3.0, rot: 10 },
      { kind: 'star', x: 850, y: 1440, s: 120, color: C.violet, at: 3.25, rot: -8 },
      { kind: 'squiggle', x: 830, y: 210, s: 120, color: C.pink, at: 3.4, rot: 0 },
    ],
    toolbar: { x: 540, y: 1770 },
    anuRest: { x: 880, y: 1640 },
  },
}

export function Hook({ t, L, W, H }) {
  const u = local(t, 'hook')
  if (u === null) return null
  const F = HOOK_FRAME[L]
  const D = HOOK[L]
  const draw = P(u, 0.6, 1.45, E.inOut)
  const fr = { x: F.x, y: F.y, w: F.w * draw, h: F.h * draw }
  const fill = P(u, 1.5, 1.85)
  const radius = 28 * P(u, 1.6, 1.95)
  const exit = P(u, 5.4, 5.85, E.inOut)
  const anu = kf(u, [
    [0, { x: W + 60, y: H - 40 }],
    [0.55, { x: F.x, y: F.y }],
    [0.6, { x: F.x, y: F.y }],
    [1.45, { x: F.x + F.w, y: F.y + F.h }],
    [1.6, { x: F.x + F.w, y: F.y + F.h }],
    [2.4, D.anuRest],
  ])
  const anuSw = sway(u, 1, u > 2.4 ? 8 : 0)
  return (
    <>
      <Toolbar x={D.toolbar.x} y={D.toolbar.y} o={P(u, 0.05, 0.5) * (1 - exit)} active={u > 0.5 && u < 1.55 ? 1 : 0} />
      {u > 0.6 && (
        <div style={{ position: 'absolute', left: fr.x, top: fr.y, width: fr.w, height: fr.h, borderRadius: radius, background: '#fff', boxShadow: `0 40px 80px -40px rgba(20,40,140,${0.5 * fill})`, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: C.primary, opacity: fill }} />
          <div style={{ position: 'absolute', inset: 0, opacity: fill * 0.9, background: 'radial-gradient(120% 90% at 85% 110%, rgba(242,178,27,.55), transparent 55%), radial-gradient(80% 70% at 0% 0%, rgba(115,88,245,.6), transparent 60%)' }} />
        </div>
      )}
      <Selection x={fr.x} y={fr.y} w={fr.w} h={fr.h} o={u > 0.6 ? 1 - P(u, 1.6, 1.85) : 0} label="Frame 1" size={`${Math.round(fr.w)} × ${Math.round(fr.h)}`} />
      {u > 1.8 && (
        <Headline lines={D.lines} u={u - 1.85} out={exit} size={D.size} color="#fff" x={F.x} w={F.w} y={F.y + F.h / 2 - (D.lines.length * D.size * 1.02) / 2} hi={{ 'one place.': { bg: C.yellow, fg: C.ink } }} />
      )}
      {D.stickers.map((s, i) => (
        <Sticker key={i} {...s} u={(u - s.at) * (1 - exit)} />
      ))}
      {D.cards.map((c, i) => {
        const a = 2.1 + i * 0.22
        const fly = P(u, a, a + 0.85, E.expo)
        const sw = sway(u, i * 2.1, 5)
        const out = P(u, 5.3 + i * 0.05, 5.8 + i * 0.05, E.inOut)
        const cw = c.w * CS
        const ch = c.h * CS
        const dir = { x: c.to.x + cw / 2 - W / 2, y: c.to.y + ch / 2 - H / 2 }
        const len = Math.hypot(dir.x, dir.y) || 1
        const pos = {
          x: lerp(c.from.x, c.to.x, fly) + (dir.x / len) * 160 * out,
          y: lerp(c.from.y, c.to.y, fly) + (dir.y / len) * 160 * out,
        }
        const rot = c.rot * (0.4 + 0.6 * fly) + (1 - fly) * 14
        const sel = u > a ? 1 - P(u, a + 1.0, a + 1.25) : 0
        const p = P(u, a + 0.8, a + 1.8, E.out)
        const cur = { x: pos.x + c.grab.x + (u > a + 1 ? sw.x : 0), y: pos.y + c.grab.y + (u > a + 1 ? sw.y : 0) }
        return (
          <div key={c.kind}>
            <Abs x={pos.x} y={pos.y} style={{ transform: `rotate(${rot}deg)`, opacity: clamp((u - a) / 0.15) * (1 - out), zIndex: 10 }}>
              <div style={{ transform: `scale(${CS})`, transformOrigin: '0 0' }}>
                {c.kind === 'score' ? <ScoreCard p={p} /> : c.kind === 'kpi' ? <KpiCard p={p} /> : <PlanMini />}
              </div>
              <Selection x={0} y={0} w={cw} h={ch} o={sel} label={c.label} comp k={1.2} />
            </Abs>
            <Cursor x={cur.x} y={cur.y} name={c.name} o={P(u, a - 0.3, a) * (1 - out)} />
          </div>
        )
      })}
      <Cursor x={anu.x + anuSw.x} y={anu.y + anuSw.y} name="Anu" o={1 - exit} />
    </>
  )
}

// =====================================================================================
// 2 · LEADS: Alex Johnson's lead card, the cursor clicks Convert to Member, a prototype
// noodle links it to Assign Plan and the total counts up to ₹1,100.
// =====================================================================================
const LEADS = {
  land: { K: 1.55, tag: { x: 960, y: 92 }, head: { y: 176, size: 84, lines: [['Turn', 'every', 'lead', 'into', 'a', 'member.']] }, c0: { x: 960, y: 670 }, c1: { x: 560, y: 670 }, a: { x: 1370, y: 670 }, vertical: false, curFrom: { x: 1760, y: 1100 }, curRest: { x: 980, y: 960 } },
  port: { K: 1.7, tag: { x: 540, y: 170 }, head: { y: 260, size: 96, lines: [['Turn', 'every', 'lead'], ['into', 'a', 'member.']] }, c0: { x: 540, y: 1010 }, c1: { x: 540, y: 850 }, a: { x: 540, y: 1490 }, vertical: true, curFrom: { x: 1100, y: 1900 }, curRest: { x: 930, y: 1180 } },
}
export function Leads({ t, L }) {
  const u = local(t, 'leads')
  if (u === null) return null
  const D = LEADS[L]
  const K = D.K
  const exit = P(u, 6.0, 6.45, E.inOut)
  const lw = LEAD.w * K
  const lh = LEAD.h * K
  const move = P(u, 2.75, 3.45, E.inOut)
  const c = { x: lerp(D.c0.x, D.c1.x, move), y: lerp(D.c0.y, D.c1.y, move) }
  const tl = { x: c.x - lw / 2, y: c.y - lh / 2 }
  const pop = E.back(clamp((u - 0.5) / 0.6))
  const btn = { x: tl.x + LEAD.btn.x * K, y: tl.y + LEAD.btn.y * K }
  const aw = ASSIGN.w * K
  const ah = ASSIGN.h * K
  const atl = { x: D.a.x - aw / 2, y: D.a.y - ah / 2 }
  const apop = E.back(clamp((u - 3.5) / 0.6))
  const tc = 2.45
  const cur = kf(u, [
    [1.2, D.curFrom],
    [2.25, btn],
    [2.7, btn],
    [3.6, D.curRest],
  ])
  const cs = sway(u, 3, u > 3.6 ? 7 : 0)
  // Noodle from the lead card to Assign Plan.
  const n1 = D.vertical ? { x: c.x, y: tl.y + lh + 14 } : { x: tl.x + LEAD.btn.r * K + 16, y: btn.y }
  const n2 = D.vertical ? { x: D.a.x, y: atl.y - 16 } : { x: atl.x - 16, y: D.a.y }
  const lift = (o) => ({ opacity: o * (1 - exit), transform: `translateY(${-40 * E.inOut(exit)}px)` })
  return (
    <>
      <Tag x={D.tag.x} y={D.tag.y} text="Leads" u={u - 0.15} out={exit} icon={IC.star(C.primary, 14)} />
      <Headline lines={D.head.lines} u={u - 0.25} out={exit} size={D.head.size} color="#fff" x={0} w={L === 'land' ? 1920 : 1080} y={D.head.y} />
      <div style={{ position: 'absolute', inset: 0, ...lift(1) }}>
        <Noodle x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} u={P(u, 3.1, 3.8, E.inOut)} vertical={D.vertical} label="On click" />
        <Abs x={tl.x} y={tl.y} style={{ width: lw, height: lh, opacity: clamp((u - 0.5) / 0.25), transform: `scale(${0.85 + 0.15 * pop})`, zIndex: 10 }}>
          <div style={{ transform: `scale(${K})`, transformOrigin: '0 0' }}>
            <LeadCard pr={press(u, tc)} />
          </div>
          <Selection x={0} y={0} w={lw} h={lh} o={u > 0.8 ? P(u, 0.8, 1.0) * (1 - P(u, 2.5, 2.7)) : 0} label="Lead Card" comp size="400 × 294" k={1.3} />
          <Abs x={lw / 2} y={-32 - 48 * K} style={{ transform: `translateX(-50%) scale(${K * (0.7 + 0.3 * E.back(clamp((u - 0.95) / 0.5)))})`, transformOrigin: '50% 0', opacity: clamp((u - 0.95) / 0.2) }}>
            <ScoreChip p={P(u, 1.1, 2.1)} />
          </Abs>
        </Abs>
        {u > 3.45 && (
          <Abs x={atl.x} y={atl.y} style={{ width: aw, height: ah, opacity: clamp((u - 3.5) / 0.2), transform: `scale(${0.8 + 0.2 * apop})`, zIndex: 10 }}>
            <div style={{ transform: `scale(${K})`, transformOrigin: '0 0' }}>
              <AssignCard rows={P(u, 3.9, 4.6, E.out)} p={P(u, 4.3, 5.1, E.out)} />
            </div>
            <Selection x={0} y={0} w={aw} h={ah} o={P(u, 3.7, 3.9) * (1 - P(u, 4.9, 5.1))} label="Assign Plan" comp k={1.3} />
          </Abs>
        )}
      </div>
      <Cursor x={cur.x + cs.x} y={cur.y + cs.y} name="Apurva Jha" o={P(u, 1.2, 1.5) * (1 - exit)} pr={press(u, tc)} rp={ripple(u, tc)} />
    </>
  )
}

// =====================================================================================
// 3 · MEMBERS: the Members dashboard tilts up into place, KPIs count up, the camera dives
// into Expiring Subscription and a teammate comments on the plan that expires today.
// =====================================================================================
const MEM = {
  land: { tag: { x: 960, y: 92 }, head: { y: 168, size: 84, lines: [['Every', 'member,', 'at', 'a', 'glance.']] }, k0: 0.95, top: 320, k1: 1.3, A: { x: 1010, y: 640 }, curFrom: { x: 1780, y: 1120 }, comment: { dx: 90, dy: -40 } },
  port: { tag: { x: 540, y: 170 }, head: { y: 260, size: 96, lines: [['Every', 'member,'], ['at', 'a', 'glance.']] }, k0: 1.0, top: 560, k1: 1.12, A: { x: 901, y: 1000 }, curFrom: { x: 1100, y: 1900 }, comment: { dx: -760, dy: -70 } },
}
export function Members({ t, L, W }) {
  const u = local(t, 'members')
  if (u === null) return null
  const D = MEM[L]
  const G = L === 'land' ? MWIN.wide : MWIN.narrow
  const exit = P(u, 6.0, 6.45, E.inOut)
  const enter = P(u, 0.3, 1.4, E.out)
  const zoom = P(u, 2.3, 3.4, E.inOut)
  const O0 = { x: W / 2 - (G.w * D.k0) / 2, y: D.top }
  const O1 = { x: D.A.x - G.row0.x * D.k1, y: D.A.y - G.row0.y * D.k1 }
  const k = lerp(D.k0, D.k1, zoom)
  const O = { x: lerp(O0.x, O1.x, zoom), y: lerp(O0.y, O1.y, zoom) }
  const scr = (p) => ({ x: O.x + p.x * k, y: O.y + p.y * k })
  const row = scr(G.row0)
  const rb = { x: O.x + G.rowBox.x * k, y: O.y + G.rowBox.y * k, w: G.rowBox.w * k, h: G.rowBox.h * k }
  const tc = 3.95
  const cur = kf(u, [
    [2.9, D.curFrom],
    [3.75, { x: row.x + (L === 'land' ? 34 : -4), y: row.y + 4 }],
  ])
  const cs = sway(u, 5, u > 4.2 ? 6 : 0)
  const headOut = Math.max(exit, P(u, 2.2, 2.6, E.inOut))
  return (
    <>
      <Tag x={D.tag.x} y={D.tag.y} text="Members" u={u - 0.15} out={headOut} dark icon={IC.users(C.primary, 14)} />
      <Headline lines={D.head.lines} u={u - 0.25} out={headOut} size={D.head.size} color={C.ink} x={0} w={W} y={D.head.y} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - exit, perspective: 2400, perspectiveOrigin: '50% 0%' }}>
        <div style={{ position: 'absolute', left: O.x, top: O.y + 140 * (1 - enter) - 40 * exit, transformOrigin: '0 0', transform: `scale(${k * (1 - 0.04 * exit)})`, opacity: clamp((u - 0.3) / 0.4) }}>
          <div style={{ transformOrigin: '50% 100%', transform: `rotateX(${26 * (1 - enter)}deg)` }}>
            <MembersWindow narrow={L === 'port'} k={P(u, 0.9, 2.0)} rowHi={P(u, tc, tc + 0.25)} />
          </div>
        </div>
        <Selection x={rb.x} y={rb.y} w={rb.w} h={rb.h} o={P(u, tc, tc + 0.15)} k={1.2} />
        <Comment x={row.x + D.comment.dx} y={row.y + D.comment.dy} name="Apurva Jha" text="Robert Fox · Plan A expires today" u={u - 4.3} k={1.35} />
      </div>
      <Cursor x={cur.x + cs.x} y={cur.y + cs.y} name="Shikhar Tiwari" o={P(u, 2.9, 3.2) * (1 - exit)} pr={press(u, tc)} rp={ripple(u, tc)} />
    </>
  )
}

// =====================================================================================
// 4 · MODULES: the seven modules drop onto the canvas as component instances and snap into
// an auto-layout grid while the whole team gathers round. Then the canvas wipes back (loop).
// =====================================================================================
const MODS = {
  land: {
    tag: { x: 960, y: 92 },
    head: { y: 176, size: 84, lines: [['Everything', 'your', 'gym', 'runs', 'on.']] },
    tw: 300,
    slot: (i) => (i < 4 ? { x: 324 + i * 324, y: 470 } : { x: 486 + (i - 4) * 324, y: 606 }),
    scatter: [[120, 400, -14], [1540, 360, 12], [220, 820, 10], [1480, 840, -10], [700, 900, 8], [1080, 340, -6], [1060, 900, 14]],
    box: { x: 292, y: 438, w: 1336, h: 312 },
    gaps: [[624, 648], [948, 972], [1272, 1296]].map(([a, b]) => ({ x1: a, x2: b, y: 470 })),
    people: [['Anu', { x: 300, y: 790 }], ['Apurva Jha', { x: 1660, y: 420 }], ['Shikhar Tiwari', { x: 1600, y: 790 }], ['Neha Singh', { x: 230, y: 410 }]],
    peopleFrom: [{ x: -100, y: 1100 }, { x: 2050, y: 200 }, { x: 2050, y: 1150 }, { x: -120, y: 200 }],
  },
  port: {
    tag: { x: 540, y: 170 },
    head: { y: 260, size: 96, lines: [['Everything', 'your'], ['gym', 'runs', 'on.']] },
    tw: 440,
    slot: (i) => (i < 6 ? { x: 88 + (i % 2) * 464, y: 620 + Math.floor(i / 2) * 136 } : { x: 320, y: 620 + 3 * 136 }),
    scatter: [[60, 560, -12], [580, 520, 10], [40, 900, 8], [600, 860, -9], [80, 1240, 10], [560, 1200, -8], [300, 1380, 12]],
    box: { x: 56, y: 588, w: 968, h: 584 },
    gaps: [0, 1, 2].map((r) => ({ x1: 528, x2: 552, y: 620 + r * 136 })),
    people: [['Anu', { x: 120, y: 1260 }], ['Apurva Jha', { x: 960, y: 560 }], ['Shikhar Tiwari', { x: 900, y: 1250 }], ['Neha Singh', { x: 60, y: 540 }]],
    peopleFrom: [{ x: -100, y: 1700 }, { x: 1200, y: 300 }, { x: 1200, y: 1800 }, { x: -120, y: 300 }],
  },
}
export function Modules({ t, L, W }) {
  const u = local(t, 'modules')
  if (u === null) return null
  const D = MODS[L]
  const exit = P(u, 4.9, 5.4, E.inOut)
  const snap = (i) => P(u, 1.7 + i * 0.05, 2.45 + i * 0.05, E.inOut)
  const sel = P(u, 2.6, 2.8) * (1 - P(u, 4.4, 4.7))
  const gap = P(u, 2.75, 2.95) * (1 - P(u, 3.9, 4.2))
  return (
    <>
      <Tag x={D.tag.x} y={D.tag.y} text="All in one" u={u - 0.15} out={exit} icon={IC.grid(C.violet, 14)} />
      <Headline lines={D.head.lines} u={u - 0.25} out={exit} size={D.head.size} color="#fff" x={0} w={W} y={D.head.y} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - exit, transform: `scale(${1 - 0.05 * exit})`, transformOrigin: '50% 55%' }}>
        {MODULES.map(([name, icon, tint], i) => {
          const a = 0.5 + i * 0.08
          const pop = E.back(clamp((u - a) / 0.5))
          const s = snap(i)
          const [sx, sy, sr] = D.scatter[i]
          const to = D.slot(i)
          const x = lerp(sx, to.x, s)
          const y = lerp(sy, to.y, s)
          const fl = sway(u, i * 1.7, 6 * (1 - s))
          return (
            <Abs key={name} x={x + fl.x} y={y + fl.y} style={{ transform: `rotate(${sr * (1 - s)}deg) scale(${pop})`, opacity: clamp((u - a) / 0.2), zIndex: 10 }}>
              <ModuleTile name={name} icon={icon} tint={tint} w={D.tw} />
            </Abs>
          )
        })}
        <Selection {...D.box} o={sel} label="Modules" size="Hug × Hug" k={1.2} />
        {D.gaps.map((g, i) => (
          <Spacing key={i} x1={g.x1} x2={g.x2} y={g.y} h={112} o={gap} value="24" />
        ))}
        {D.people.map(([name, at], i) => {
          const p = P(u, 3.1 + i * 0.12, 3.9 + i * 0.12, E.expo)
          const sw = sway(u, i * 2.4, 7)
          return <Cursor key={name} name={name} x={lerp(D.peopleFrom[i].x, at.x, p) + sw.x} y={lerp(D.peopleFrom[i].y, at.y, p) + sw.y} o={p} />
        })}
      </div>
    </>
  )
}
