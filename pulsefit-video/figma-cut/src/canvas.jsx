// The whole piece is one Figma canvas holding the seven Pulsefit screens. A camera flies
// between them; teammates' cursors work inside each screen; the headline changes per beat.
import { Comment, Cursor, Headline, Selection, Tag, Toolbar } from './fig.jsx'
import { BEATS, C, DURATION, E, P, STAGES, clamp, kf, lerp, press, ripple, sway } from './lib.js'
import { EQ, Equipment, LD, LT, LeadsDash, LeadsTable, MD, Members, PL, Plans, ST, Staff, WO, Workouts } from './screens.jsx'

// Frames on the canvas (world coordinates), per layout.
const SIZE = { lt: [LT.w, LT.h], ld: [LD.w, LD.h], md: [MD.w, MD.h], pl: [PL.w, PL.h], st: [ST.w, ST.h], wo: [WO.w, WO.h], eq: [EQ.w, EQ.h] }
const NAME = { lt: 'Leads Table', ld: 'Leads Dashboard', md: 'Members Dashboard', pl: 'Plans', st: 'Staff Table', wo: 'Workout Plan', eq: 'Add Equipment' }
const POS = {
  land: { ld: [0, 0], lt: [1600, 0], md: [3200, 0], pl: [4800, 0], st: [800, 1290], wo: [2400, 1290], eq: [4000, 1290] },
  port: { lt: [0, 0], ld: [1600, 0], md: [0, 1290], pl: [1600, 1290], st: [0, 2250], wo: [1600, 2250], eq: [800, 3270] },
}
const frame = (L, id) => ({ x: POS[L][id][0], y: POS[L][id][1], w: SIZE[id][0], h: SIZE[id][1] })
const wp = (L, id, p) => ({ x: POS[L][id][0] + p.x, y: POS[L][id][1] + p.y })
const sub = (L, id, r) => ({ x: POS[L][id][0] + r.x, y: POS[L][id][1] + r.y, w: r.w, h: r.h })

// Camera targets: world rects fitted into the stage's VIEW.
const RECTS = {
  land: (L) => ({
    over: { x: -120, y: -160, w: 6480, h: 2600 },
    leads: sub(L, 'lt', { x: 250, y: 90, w: 1240, h: 760 }),
    perf: sub(L, 'ld', LD.perf),
    members: frame(L, 'md'),
    plans: frame(L, 'pl'),
    moreA: { x: 800, y: 1250, w: 3040, h: 1040 },
    moreB: { x: 2400, y: 1250, w: 3040, h: 1040 },
  }),
  port: (L) => ({
    over: { x: -80, y: -120, w: 3200, h: 4510 },
    leads: sub(L, 'lt', { x: 300, y: 100, w: 760, h: 720 }),
    perf: sub(L, 'ld', { x: 300, y: 500, w: 680, h: 610 }),
    members: sub(L, 'md', { x: 300, y: 90, w: 720, h: 620 }),
    plans: sub(L, 'pl', { x: 300, y: 90, w: 580, h: 720 }),
    moreA: frame(L, 'st'),
    moreB: frame(L, 'wo'),
    moreC: frame(L, 'eq'),
  }),
}
const KEYS = {
  land: [[0, 'over'], [4.6, 'over', 1.05], [5.8, 'leads'], [10.6, 'leads'], [11.8, 'perf'], [16.2, 'perf'], [17.4, 'members'], [21.8, 'members'], [23.0, 'plans'], [27.0, 'plans'], [28.1, 'moreA'], [29.5, 'moreB'], [31.2, 'over'], [DURATION, 'over']],
  port: [[0, 'over'], [4.6, 'over', 1.05], [5.8, 'leads'], [10.6, 'leads'], [11.8, 'perf'], [16.2, 'perf'], [17.4, 'members'], [21.8, 'members'], [23.0, 'plans'], [27.0, 'plans'], [28.0, 'moreA'], [28.9, 'moreB'], [29.8, 'moreC'], [31.2, 'over'], [DURATION, 'over']],
}

export function camera(t, L) {
  const V = STAGES[L].VIEW
  const R = RECTS[L](L)
  const fit = ([, id, zoom = 1]) => {
    const r = R[id]
    return { x: r.x + r.w / 2, y: r.y + r.h / 2, z: Math.min(V.w / r.w, V.h / r.h) * zoom }
  }
  const keys = KEYS[L]
  let i = 0
  while (i < keys.length - 2 && t > keys[i + 1][0]) i++
  const a = fit(keys[i])
  const b = fit(keys[i + 1])
  const raw = clamp((t - keys[i][0]) / (keys[i + 1][0] - keys[i][0]))
  // A slow overview drift is linear; flights between screens ease in-out and dip out a
  // little in zoom when they travel far, like Figma's zoom-to-frame.
  const e = keys[i][1] === keys[i + 1][1] ? raw : E.inOut(raw)
  const dist = Math.hypot(b.x - a.x, b.y - a.y) * Math.min(a.z, b.z)
  const dip = clamp(dist / 2400) * 0.4
  const z = Math.exp(lerp(Math.log(a.z), Math.log(b.z), e)) * (1 - dip * Math.sin(Math.PI * e))
  return { x: lerp(a.x, b.x, e), y: lerp(a.y, b.y, e), z, V }
}
const toStage = (cam, p) => ({ x: cam.V.x + cam.V.w / 2 + (p.x - cam.x) * cam.z, y: cam.V.y + cam.V.h / 2 + (p.y - cam.y) * cam.z })
const rectStage = (cam, r) => ({ ...toStage(cam, r), w: r.w * cam.z, h: r.h * cam.z })

// Cursor tracks: [time, frame, {x, y}] in frame coordinates, plus opacity keys and clicks.
const TRACKS = {
  'Apurva Jha': {
    path: [[0, 'lt', { x: 560, y: 300 }], [2.2, 'lt', { x: 900, y: 540 }], [3.3, 'lt', { x: 740, y: 460 }], [5.9, 'lt', { x: 1180, y: 660 }], [6.9, 'lt', LT.dots], [7.25, 'lt', LT.dots], [8.2, 'lt', LT.item], [8.6, 'lt', LT.item], [9.6, 'lt', { x: 1140, y: 610 }], [31.4, 'lt', { x: 560, y: 300 }]],
    o: [[0, 1], [10.6, 1], [11.0, 0], [30.6, 0], [31.2, 1]],
    clicks: [3.5, 7.05, 8.45],
  },
  'Shikhar Tiwari': {
    path: [[0, 'md', { x: 620, y: 330 }], [2.4, 'md', { x: 1000, y: 520 }], [4.4, 'md', { x: 780, y: 430 }], [11.6, 'ld', { x: 1250, y: 1000 }], [13.5, 'ld', { x: LD.week3.x + 4, y: LD.week3.y + 4 }], [16.2, 'ld', { x: LD.week3.x + 4, y: LD.week3.y + 4 }], [17.6, 'md', { x: 1150, y: 640 }], [19.0, 'md', { x: MD.row0.x + 26, y: MD.row0.y + 4 }], [21.8, 'md', { x: MD.row0.x + 26, y: MD.row0.y + 4 }], [31.4, 'md', { x: 620, y: 330 }]],
    o: [[0, 1], [5.0, 1], [5.4, 0], [11.4, 0], [11.8, 1], [21.8, 1], [22.2, 0], [30.6, 0], [31.2, 1]],
    clicks: [19.15],
  },
  'Neha Singh': {
    path: [[0, 'pl', { x: 520, y: 320 }], [2.6, 'pl', { x: 860, y: 580 }], [4.6, 'pl', { x: 640, y: 420 }], [22.8, 'pl', { x: 1150, y: 700 }], [23.9, 'pl', { x: 760, y: 360 }], [26.9, 'pl', { x: 760, y: 360 }], [31.4, 'pl', { x: 520, y: 320 }]],
    o: [[0, 1], [5.0, 1], [5.4, 0], [22.6, 0], [23.0, 1], [27.0, 1], [27.4, 0], [30.6, 0], [31.2, 1]],
    clicks: [],
  },
  Anu: {
    path: [[0, 'ld', { x: 720, y: 620 }], [2.2, 'ld', { x: 1000, y: 330 }], [4.4, 'ld', { x: 840, y: 760 }], [27.6, 'st', { x: 900, y: 520 }], [28.8, 'wo', { x: 720, y: 420 }], [29.8, 'eq', { x: 900, y: 460 }], [31.4, 'ld', { x: 720, y: 620 }]],
    o: [[0, 1], [5.0, 1], [5.4, 0], [27.4, 0], [27.8, 1]],
    clicks: [],
  },
}

function Cursors({ t, L, cam, scale }) {
  return Object.entries(TRACKS).map(([name, tr], i) => {
    const o = kf(t, tr.o, (x) => x)
    if (o <= 0.001) return null
    const w = kf(t, tr.path.map(([tt, id, p]) => [tt, wp(L, id, p)]))
    const p = toStage(cam, w)
    const sw = sway(t, i * 2.3, 5)
    const pr = Math.max(0, ...tr.clicks.map((c) => press(t, c)))
    const rp = Math.max(0, ...tr.clicks.map((c) => ripple(t, c)))
    return <Cursor key={name} name={name} x={p.x + sw.x} y={p.y + sw.y} o={o} pr={pr} rp={rp} s={scale} />
  })
}

export function Canvas({ t, L, W }) {
  const cam = camera(t, L)
  const port = L === 'port'
  const ui = port ? 1.9 : 1.35 // editor chrome (labels, cursors) scale on the stage
  // Screen state over time (constant outside each beat, so the memoised screens stay put).
  const lt = {
    menu: P(t, 7.15, 7.45) * (1 - P(t, 8.5, 8.75)),
    hover: P(t, 7.9, 8.05),
    conv: P(t, 8.6, 9.0),
    rowHi: P(t, 8.6, 8.9) * (1 - P(t, 10.4, 10.9)),
  }
  const ld = { k: t < 8 ? 1 : P(t, 11.9, 12.9), draw: t < 8 ? 1 : P(t, 12.0, 13.4, E.inOut), bars: t < 8 ? 1 : P(t, 12.2, 13.2), tip: P(t, 13.9, 14.2) * (1 - P(t, 16.1, 16.4)) }
  const md = { k: t < 14 ? 1 : P(t, 17.6, 18.6), rowHi: P(t, 19.2, 19.45) * (1 - P(t, 21.9, 22.3)) }
  const pl = { lift: P(t, 23.9, 24.3) * (1 - P(t, 26.8, 27.2)) }
  const screens = {
    lt: <LeadsTable {...lt} />,
    ld: <LeadsDash {...ld} />,
    md: <Members {...md} />,
    pl: <Plans hover={1} lift={pl.lift} />,
    st: <Staff />,
    wo: <Workouts />,
    eq: <Equipment />,
  }
  const labelO = 1 - P(cam.z, 0.45, 0.7, (x) => x)
  const sel = (r) => rectStage(cam, r)
  const ltSel = sel(frame(L, 'lt'))
  const rowSel = sel(sub(L, 'md', MD.row))
  const q = PL.cardAt(1)
  const cardSel = sel(sub(L, 'pl', { x: q.x, y: q.y - 8, w: q.w, h: q.h }))
  const rowPt = toStage(cam, wp(L, 'md', MD.row0))
  const allSel = sel(RECTS[L](L).over)
  const fade = (a, b) => P(t, a, a + 0.2) * (1 - P(t, b, b + 0.3))
  return (
    <>
      {/* the canvas */}
      <div style={{ position: 'absolute', left: 0, top: 0, willChange: 'transform', transformOrigin: '0 0', transform: `translate(${cam.V.x + cam.V.w / 2 - cam.x * cam.z}px, ${cam.V.y + cam.V.h / 2 - cam.y * cam.z}px) scale(${cam.z})` }}>
        {Object.keys(POS[L]).map((id) => (
          <div key={id} style={{ position: 'absolute', left: POS[L][id][0], top: POS[L][id][1], boxShadow: '0 0 0 1px rgba(20,28,60,.06), 0 40px 90px -40px rgba(20,28,70,.35)' }}>
            {screens[id]}
          </div>
        ))}
      </div>
      {/* keeps the headline clear of screens that run up under it */}
      <div style={{ position: 'absolute', left: -400, right: -400, top: -600, height: cam.V.y + 600, background: `linear-gradient(#E9EBF0 ${cam.V.y + 600 - 56}px, rgba(233,235,240,0))`, opacity: P(cam.z, 0.4, 0.6, (x) => x) }} />
      {/* frame names, constant size like Figma's */}
      {labelO > 0 &&
        Object.keys(POS[L]).map((id) => {
          const p = toStage(cam, wp(L, id, { x: 0, y: 0 }))
          return (
            <div key={id} style={{ position: 'absolute', left: p.x, top: p.y - 12 * ui - 8, opacity: labelO, font: `500 ${12 * ui}px/1 'Poppins', sans-serif`, color: '#6B7084', whiteSpace: 'nowrap' }}>
              {NAME[id]}
            </div>
          )
        })}
      <Selection {...ltSel} o={fade(3.55, 5.0)} label="Leads Table" size="1440 × 860" k={ui * 0.8} />
      <Selection {...rowSel} o={fade(19.2, 21.8)} k={ui * 0.8} />
      <Selection {...cardSel} o={fade(23.95, 26.8)} label="Plan Card" comp k={ui * 0.8} />
      <Selection {...allSel} o={fade(31.7, 32.9)} k={ui * 0.8} />
      <div style={{ opacity: 1 - P(t, 21.8, 22.1) }}>
        <Comment x={port ? 60 : rowPt.x + 70} y={rowPt.y - (port ? 90 : 40)} name="Apurva Jha" text="Robert Fox · Plan A expires today" u={t - 19.6} k={ui} />
      </div>
      <div style={{ opacity: 1 - P(t, 26.8, 27.1) }}>
        <Comment x={port ? cardSel.x : cardSel.x + cardSel.w + 16} y={port ? cardSel.y + cardSel.h + 130 : cardSel.y + 70} name="Neha Singh" text="Quarterly · 94 active users" u={t - 24.5} k={ui} />
      </div>
      <Toolbar x={W / 2} y={port ? 1842 : 1006} o={clamp(1 - P(t, 4.6, 5.2) + P(t, 30.8, 31.4))} active={0} />
      <Cursors t={t} L={L} cam={cam} scale={ui} />
      <Captions t={t} L={L} W={W} />
    </>
  )
}

// Eyebrow + headline for each beat.
function Captions({ t, L, W }) {
  const port = L === 'port'
  return BEATS.map((b) => {
    if (t < b.a - 0.05 || t > b.b + 0.05) return null
    const u = t - b.a - 0.15
    const out = P(t, b.b - 0.45, b.b - 0.05, E.inOut)
    return (
      <div key={b.id}>
        <Tag x={W / 2} y={port ? 160 : 56} text={b.eyebrow} u={u} out={out} icon={<span style={{ width: 8, height: 8, borderRadius: 4, background: C.primary }} />} />
        <Headline lines={port ? b.port : b.land} u={u - 0.1} out={out} size={port ? 92 : 76} color={C.ink} x={0} w={W} y={port ? 236 : 116} hi={{ 'one place.': { bg: '#DCE4FF', fg: C.primary } }} />
      </div>
    )
  })
}

