// Hook → middle → end, with a camera.
// Hook: product overview. The camera starts close on a module, pulls back to the dashboard hub
// with all seven modules, then pushes into the hub, which becomes the first screen.
// Middle: Neha Singh's lead-to-member flow. Each screen opens whole, the camera zooms into the
// feature being used and back out, and supporting infographic cards pop up beside it. Chapters
// are joined by match cuts: the camera dives into an element and comes out of the same element
// in the next screen.
// End: the screens settle into a deck under the Pulsefit sign-off. Text sits on top only.
import { Cursor } from './fig.jsx'
import { ContactDays, Expiring, MemberBars, MissedStat, PRICE_CARD, PlanPrices, StatusFlip, StatusFunnel, TotalRing } from './infographics.jsx'
import { C, CHAPTERS, E, HEAD_FONT, P, UI_FONT, clamp, kf, lerp, press, ripple, sway } from './lib.js'
import { CV, ConvertFrame, LD, LT, LeadsDash, LeadsTable, MD, Members } from './screens.jsx'
import { IC, Mark } from './ui.jsx'

const LAY = {
  land: { V: { x: 100, y: 250, w: 1720, h: 790 }, clip: 214, capY: 64, size: 60, sub: 22, slots: [{ x: 60, y: 600 }, { x: 1860 - 360 * 1.75, y: 560 }], ps: 1.75, cur: 1.5 },
  port: { V: { x: 30, y: 470, w: 1020, h: 1400 }, clip: 420, capY: 150, size: 80, sub: 30, slots: [{ x: 30, y: 1470 }, { x: 1050 - 360 * 1.36, y: 1470 }], ps: 1.36, cur: 2.1 },
}
const CH = Object.fromEntries(CHAPTERS.map((c) => [c.id, c]))

// ------------------------------------------------------------------------------------- camera
// keys: [[time, rect]] in frame (or world) coordinates; each rect is fitted into V. Zoom is
// interpolated in log space so pushes and pulls feel even.
function camera(keys, u, V) {
  const fitR = (r) => ({ k: Math.min(V.w / r.w, V.h / r.h), x: r.x + r.w / 2, y: r.y + r.h / 2 })
  let i = 0
  while (i < keys.length - 2 && u > keys[i + 1][0]) i++
  const a = fitR(keys[i][1])
  const b = fitR(keys[i + 1][1])
  const e = E.inOut(clamp((u - keys[i][0]) / (keys[i + 1][0] - keys[i][0] || 1)))
  const k = Math.exp(lerp(Math.log(a.k), Math.log(b.k), e))
  const cx = lerp(a.x, b.x, e)
  const cy = lerp(a.y, b.y, e)
  return { k, tx: V.x + V.w / 2 - cx * k, ty: V.y + V.h / 2 - cy * k }
}
const whole = (fw, fh) => ({ x: 0, y: 0, w: fw, h: fh })
const pad = (r, p) => ({ x: r.x - p, y: r.y - p, w: r.w + 2 * p, h: r.h + 2 * p })

// ------------------------------------------------------------------------------------ caption
function Caption({ L, W, lines, sub, u, out }) {
  const { capY, size, sub: ss } = LAY[L]
  let n = 0
  return (
    <div style={{ position: 'absolute', left: 0, top: capY, width: W, textAlign: 'center', opacity: 1 - out, transform: `translateY(${-18 * E.inOut(out)}px)`, zIndex: 40 }}>
      {lines.map((line, li) => (
        <div key={li} style={{ font: `600 ${size}px/1.06 ${HEAD_FONT}`, letterSpacing: '-0.04em', color: C.ink, whiteSpace: 'nowrap' }}>
          {line.split(' ').map((w, wi) => {
            const p = P(u, n * 0.05, n++ * 0.05 + 0.8, E.expo)
            return (
              <span key={wi} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', padding: '0.04em 0.02em 0.1em', margin: '-0.04em 0 -0.1em' }}>
                <span style={{ display: 'inline-block', transform: `translateY(${(1 - p) * 105}%)` }}>{w}</span>{' '}
              </span>
            )
          })}
        </div>
      ))}
      {sub && <div style={{ font: `400 ${ss}px/1.4 ${UI_FONT}`, color: '#5B6178', marginTop: L === 'port' ? 18 : 12, opacity: P(u, 0.4, 0.9) }}>{sub}</div>}
    </div>
  )
}

// A supporting card popping up in a slot.
function Pop({ L, slot, u, until, children }) {
  if (u < 0 || u > until + 0.5) return null
  const { slots, ps } = LAY[L]
  const s = slots[slot]
  const e = E.back(clamp(u / 0.6))
  const out = P(u, until, until + 0.45, E.inOut)
  return (
    <div style={{ position: 'absolute', left: s.x, top: s.y, transformOrigin: '0 0', transform: `translateY(${(1 - E.out(clamp(u / 0.6))) * 40 + out * 20}px) scale(${ps * (0.86 + 0.14 * e)})`, opacity: clamp(u / 0.25) * (1 - out), zIndex: 30 }}>
      {children}
    </div>
  )
}

// A screen under the camera: clipped below the caption, rounded corners kept on screen.
function CamScreen({ L, W, H, fw, fh, cam, o, children, cursor, u }) {
  const { clip } = LAY[L]
  let cur = null
  if (cursor) {
    const c = kf(u, cursor.track)
    const sw = sway(u, 2, 3)
    cur = <Cursor x={cam.tx + c.x * cam.k + sw.x} y={cam.ty + c.y * cam.k + sw.y} o={P(u, cursor.track[0][0], cursor.track[0][0] + 0.3) * (cursor.o ?? 1) * o} pr={Math.max(0, ...cursor.clicks.map((t) => press(u, t)))} rp={Math.max(0, ...cursor.clicks.map((t) => ripple(u, t)))} s={LAY[L].cur} />
  }
  return (
    <>
      <div style={{ position: 'absolute', left: 0, top: clip, width: W, height: H - clip, overflow: 'hidden', opacity: o, WebkitMaskImage: 'linear-gradient(transparent, #000 48px)', maskImage: 'linear-gradient(transparent, #000 48px)' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${cam.tx}px, ${cam.ty - clip}px) scale(${cam.k})`, willChange: 'transform' }}>
          <div style={{ width: fw, height: fh, borderRadius: 16 / cam.k, overflow: 'hidden', boxShadow: `0 ${50 / cam.k}px ${100 / cam.k}px -${50 / cam.k}px rgba(20,30,80,.45), 0 0 0 ${1 / cam.k}px rgba(20,30,80,.05)` }}>{children}</div>
        </div>
      </div>
      {cur}
    </>
  )
}

// ----------------------------------------------------------------------------------- the hook
const MODULES = [
  ['Leads', IC.star, '#3B5BDB', '#E5EBFF', '234 new leads'],
  ['Members', IC.users, C.primary, C.pSoft, '234 active members'],
  ['Plans', IC.plans, '#6D3FE0', '#EEE7FF', '12 active plans'],
  ['Staff', IC.staff, C.green, C.gSoft, 'Managers and trainers'],
  ['Communication', IC.mail, C.pink, '#FDE9F1', 'Email campaigns'],
  ['Equipments', IC.dumbbell, C.teal, '#E3F7F4', 'Repair schedules'],
  ['Workouts', IC.heart, C.red, C.rSoft, 'Workout plans'],
]
const HUB = { land: 600, port: 560 }
const modPos = (L, i) => {
  if (L === 'port') return [[-165, -480], [165, -480], [-165, -360], [165, -360], [-165, 360], [165, 360], [0, 480]][i]
  const ang = -Math.PI / 2 + (i * 2 * Math.PI) / MODULES.length
  return [640 * Math.cos(ang), 380 * Math.sin(ang)]
}
function Hook({ t, L, W, H }) {
  const port = L === 'port'
  const { V } = LAY[L]
  const hw = HUB[L]
  const hh = (hw * LD.h) / LD.w
  const hubR = { x: -hw / 2, y: -hh / 2, w: hw, h: hh }
  const keys = port
    ? [[0, { x: -340, y: -560, w: 680, h: 240 }], [2.2, { x: -500, y: -560, w: 1000, h: 1120 }], [4.5, { x: -480, y: -540, w: 960, h: 1080 }], [6.0, hubR]]
    : [[0, { x: -300, y: -470, w: 600, h: 220 }], [2.2, { x: -800, y: -450, w: 1600, h: 900 }], [4.5, { x: -770, y: -430, w: 1540, h: 860 }], [6.0, hubR]]
  const cam = camera(keys, t, V)
  const modOut = P(t, 4.6, 5.4, E.inOut)
  const map = (x, y) => ({ x: cam.tx + x * cam.k, y: cam.ty + y * cam.k })
  const c = map(0, 0)
  return (
    <>
      <Caption L={L} W={W} lines={port ? ['Run your whole gym', 'from one place.'] : ['Run your whole gym from one place.']} sub="Leads, members, plans and staff, in one product." u={t - 0.2} out={P(t, 5.2, 5.7, E.inOut)} />
      <div style={{ position: 'absolute', left: 0, top: LAY[L].clip, width: W, height: H - LAY[L].clip, overflow: 'hidden', WebkitMaskImage: 'linear-gradient(transparent, #000 48px)', maskImage: 'linear-gradient(transparent, #000 48px)' }}>
        <div style={{ position: 'absolute', left: 0, top: -LAY[L].clip, width: W, height: H }}>
          <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width="1" height="1">
            {MODULES.map((m, i) => {
              const [x, y] = modPos(L, i)
              const d = P(t, 1.2 + i * 0.08, 2.0 + i * 0.08, E.inOut)
              const q = map(x * d, y * d)
              return <line key={m[0]} x1={c.x} y1={c.y} x2={q.x} y2={q.y} stroke="#B8C3E8" strokeWidth={2} opacity={1 - modOut} />
            })}
          </svg>
          <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${cam.tx}px, ${cam.ty}px) scale(${cam.k})` }}>
            <div style={{ position: 'absolute', left: hubR.x, top: hubR.y, width: hw, height: hh, borderRadius: 16 / cam.k, overflow: 'hidden', boxShadow: `0 ${50 / cam.k}px ${100 / cam.k}px -${50 / cam.k}px rgba(20,30,80,.45)`, opacity: P(t, 0.9, 1.6) }}>
              <div style={{ transform: `scale(${hw / LD.w})`, transformOrigin: '0 0' }}><LeadsDash /></div>
            </div>
            {MODULES.map(([name, icon, tint, bg, note], i) => {
              const [x, y] = modPos(L, i)
              const a = i === 0 ? 0.1 : 1.5 + i * 0.1
              const pop = E.back(clamp((t - a) / 0.55))
              return (
                <div key={name} style={{ position: 'absolute', left: x - 150, top: y - 48, width: 300, height: 96, opacity: clamp((t - a) / 0.25) * (1 - modOut), transform: `scale(${(0.7 + 0.3 * pop) * (1 + 0.2 * modOut)}) translate(${x * 0.3 * modOut}px, ${y * 0.3 * modOut}px)` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: '100%', padding: '0 18px', borderRadius: 20, background: '#fff', boxShadow: '0 1px 0 rgba(20,30,80,.05), 0 24px 50px -26px rgba(20,30,80,.4)', fontFamily: UI_FONT, boxSizing: 'border-box' }}>
                    <span style={{ width: 52, height: 52, borderRadius: 14, background: bg, display: 'grid', placeItems: 'center', flex: 'none' }}>{icon(tint, 24)}</span>
                    <span>
                      <span style={{ display: 'block', fontSize: 19, fontWeight: 600, color: C.ink, letterSpacing: '-0.01em' }}>{name}</span>
                      <span style={{ display: 'block', fontSize: 14, color: C.sub, marginTop: 2 }}>{note}</span>
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

// ----------------------------------------------------------------------------- the chapters
// Feature rects (frame coordinates) the camera visits.
const R = {
  dashTasks: { x: 300, y: 70, w: 1100, h: 440 },
  dashMissed: { x: 660, y: 150, w: 380, h: 350 },
  dashItem: pad(LD.item, 14),
  rowDeep: { x: 420, y: 335, w: 620, h: 112 },
  rowAction: { x: 360, y: 290, w: 720, h: 300 },
  formName: { x: 410, y: 120, w: 640, h: 170 },
  formDetails: { x: 384, y: 44, w: 672, h: 420 },
  formPlan: { x: 384, y: 450, w: 672, h: 380 },
  formTotal: { x: 384, y: 780, w: 672, h: 380 },
  formAdd: { x: 870, y: 1088, w: 200, h: 64 },
  memRow: { x: 340, y: 430, w: 640, h: 82 },
  memExpiring: { x: 320, y: 290, w: 690, h: 400 },
}
const CAPS = {
  follow: { land: ['Never miss a follow-up.'], port: ['Never miss', 'a follow-up.'], sub: 'Missed and stale leads surface on their own.' },
  convert: { land: ['Convert a lead in two clicks.'], port: ['Convert a lead', 'in two clicks.'], sub: 'Mark it converted right from the table.' },
  onboard: { land: ['Plan and billing in one step.'], port: ['Plan and billing', 'in one step.'], sub: 'Pick a plan. Tax and total work themselves out.' },
  retain: { land: ['Keep members coming back.'], port: ['Keep members', 'coming back.'], sub: 'Expiring plans surface before they lapse.' },
}

function Chapter({ id, t, L, W, H, fw, fh, keys, screen, cursor, pops }) {
  const c = CH[id]
  const u = t - c.a
  const len = c.b - c.a
  const port = L === 'port'
  const cam0 = camera(keys, u, LAY[L].V)
  // match cut: the next chapter dissolves in on top over 0.22s, pushing in slightly
  const inn = P(u, -0.22, 0, (x) => x)
  const push = 1 + 0.06 * (1 - E.out(inn))
  const V = LAY[L].V
  const cx = V.x + V.w / 2
  const cy = V.y + V.h / 2
  const cam = { k: cam0.k * push, tx: cx + (cam0.tx - cx) * push, ty: cy + (cam0.ty - cy) * push }
  const o = id === 'retain' ? inn * (1 - P(u, len - 0.6, len, (x) => x)) : inn
  return (
    <>
      <CamScreen L={L} W={W} H={H} fw={fw} fh={fh} cam={cam} o={o} u={u} cursor={cursor}>{screen(u)}</CamScreen>
      {pops.map((p, i) => (
        <Pop key={i} L={L} slot={p.slot} u={u - p.at} until={p.until - p.at}>{p.el(u - p.at)}</Pop>
      ))}
      <Caption L={L} W={W} lines={port ? CAPS[id].port : CAPS[id].land} sub={CAPS[id].sub} u={u - 0.25} out={P(u, len - 0.6, len - 0.15, E.inOut)} />
    </>
  )
}

export function Story({ t, L, W, H }) {
  const port = L === 'port'
  const els = []
  const near = (id) => t >= CH[id].a - 0.23 && t < CH[id].b + (id === 'retain' ? 0.02 : 0.23)

  if (t < CH.hook.b + 0.02) els.push(<Hook key="hook" t={t} L={L} W={W} H={H} />)

  if (near('follow')) {
    els.push(
      <Chapter key="follow" id="follow" t={t} L={L} W={W} H={H} fw={LD.w} fh={LD.h}
        keys={[[0, whole(LD.w, LD.h)], [0.8, whole(LD.w, LD.h)], [1.8, R.dashTasks], [2.8, R.dashMissed], [5.8, R.dashMissed], [6.9, R.dashItem]]}
        screen={(u) => <LeadsDash fpr={press(u, 3.6)} hi={P(u, 3.65, 3.85)} />}
        cursor={{ track: [[2.6, { x: 1010, y: 470 }], [3.4, LD.follow], [5.6, LD.follow]], clicks: [3.6], o: 1 - P(t - CH.follow.a, 5.6, 6.0) }}
        pops={[
          { slot: 0, at: 3.0, until: 5.8, el: (u) => <MissedStat u={u} /> },
          { slot: 1, at: 3.4, until: 5.8, el: (u) => <ContactDays u={u} /> },
        ]}
      />,
    )
  }
  if (near('convert')) {
    els.push(
      <Chapter key="convert" id="convert" t={t} L={L} W={W} H={H} fw={LT.w} fh={LT.h}
        keys={[[0, R.rowDeep], [1.0, R.rowAction], [3.4, R.rowAction], [4.4, whole(LT.w, LT.h)], [6.0, whole(LT.w, LT.h)], [6.95, R.rowDeep]]}
        screen={(u) => <LeadsTable menu={P(u, 1.5, 1.75) * (1 - P(u, 2.8, 3.0))} hover={P(u, 2.2, 2.3)} conv={P(u, 2.9, 3.3)} rowHi={P(u, 2.9, 3.2)} />}
        cursor={{ track: [[0.9, { x: 900, y: 560 }], [1.3, LT.dots], [1.6, LT.dots], [2.35, LT.item], [2.8, LT.item], [3.6, { x: 1100, y: 600 }]], clicks: [1.4, 2.75], o: 1 - P(t - CH.convert.a, 4.0, 4.4) }}
        pops={[
          { slot: 1, at: 3.1, until: 5.9, el: (u) => <StatusFlip u={u} /> },
          { slot: 0, at: 4.0, until: 5.9, el: (u) => <StatusFunnel u={u} /> },
        ]}
      />,
    )
  }
  if (near('onboard')) {
    els.push(
      <Chapter key="onboard" id="onboard" t={t} L={L} W={W} H={H} fw={CV.w} fh={CV.h}
        keys={[[0, R.formName], [1.6, R.formName], [2.4, R.formDetails], [3.0, R.formPlan], [4.4, R.formPlan], [5.1, R.formTotal], [6.4, R.formTotal], [7.2, whole(CV.w, CV.h)], [7.6, whole(CV.w, CV.h)], [8.45, R.formAdd]]}
        screen={(u) => <ConvertFrame fill={P(u, 0.2, 1.6, (x) => x)} open={P(u, 3.25, 3.45) * (1 - P(u, 4.05, 4.2))} hover={u > 3.65 ? 1 : -1} picked={u > 4.05 ? 1 : 0} p={P(u, 5.0, 6.0)} apr={press(u, 7.5)} />}
        cursor={{ track: [[2.6, { x: 900, y: 640 }], [3.0, CV.select], [3.25, CV.select], [3.7, CV.option(1)], [4.05, CV.option(1)], [6.8, { x: 1000, y: 1060 }], [7.35, CV.add], [8.5, CV.add]], clicks: [3.2, 4.0, 7.5] }}
        pops={[
          { slot: 0, at: 4.6, until: 7.0, el: (u) => <div style={{ transform: `scale(${360 / PRICE_CARD.w})`, transformOrigin: '0 0', width: 360, height: (PRICE_CARD.h * 360) / PRICE_CARD.w }}><PlanPrices u={u} /></div> },
          { slot: 1, at: 5.0, until: 7.0, el: (u) => <TotalRing u={u} /> },
        ]}
      />,
    )
  }
  if (near('retain')) {
    const W2 = whole(MD.w, MD.h)
    els.push(
      <Chapter key="retain" id="retain" t={t} L={L} W={W} H={H} fw={MD.w} fh={MD.h}
        keys={[[0, R.memRow], [1.0, R.memExpiring], [2.6, R.memExpiring], [3.6, W2], [5.6, W2], [6.5, pad(W2, 500)]]}
        screen={(u) => <Members k={u < 2.6 ? 1 : P(u, 3.4, 4.4)} rowHi={P(u, 1.9, 2.1)} rpr={press(u, 1.9)} />}
        cursor={{ track: [[0.8, { x: 1000, y: 620 }], [1.6, MD.renew], [3.0, MD.renew]], clicks: [1.9], o: 1 - P(t - CH.retain.a, 2.8, 3.2) }}
        pops={[
          { slot: 1, at: 1.4, until: 3.2, el: (u) => <Expiring u={u} /> },
          { slot: 0, at: 3.8, until: 5.9, el: (u) => <MemberBars u={u} /> },
        ]}
      />,
    )
  }
  if (t >= CH.end.a - 0.3) els.push(<End key="end" t={t} L={L} W={W} H={H} />)
  return els
}

// ------------------------------------------------------------------------------------- the end
function End({ t, L, W }) {
  const port = L === 'port'
  const u = t - CH.end.a
  const out = P(u, 3.9, 4.45, E.inOut)
  const screens = [
    [<LeadsDash key="d" />, LD.w, LD.h],
    [<LeadsTable key="t" conv={1} />, LT.w, LT.h],
    [<ConvertFrame key="f" />, CV.w, CV.h],
    [<Members key="m" />, MD.w, MD.h],
  ]
  const tw = port ? 640 : 640
  const pos = (i) => (port ? { x: 170 + i * 40, y: 640 + i * 200 } : { x: 520 + i * 150, y: 330 + i * 110 })
  return (
    <div style={{ opacity: 1 - out }}>
      <div style={{ position: 'absolute', inset: 0, perspective: 2600 }}>
        <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateX(${port ? 16 : 22}deg) rotateZ(${port ? -6 : -8}deg)`, transformOrigin: '50% 60%' }}>
          {screens.map(([el, fw, fh], i) => {
            const k = tw / fw
            const a = 0.05 + i * 0.14
            const p = P(u, a, a + 1.0, E.expo)
            const q = pos(i)
            return (
              <div key={i} style={{ position: 'absolute', left: q.x, top: q.y, width: tw, height: fh * k, borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 0 rgba(20,30,80,.05), 0 60px 90px -40px rgba(20,30,80,.5)', opacity: clamp((u - a) / 0.3), transform: `translateY(${(1 - p) * 160}px)` }}>
                <div style={{ transform: `scale(${k})`, transformOrigin: '0 0' }}>{el}</div>
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, width: W, top: LAY[L].capY, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: P(u, 0.3, 0.9), transform: `translateY(${(1 - P(u, 0.3, 1.2, E.expo)) * 20}px)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: port ? 20 : 14 }}>
          <Mark s={port ? 76 : 56} />
          <span style={{ font: `700 ${port ? 96 : 68}px/1 ${HEAD_FONT}`, letterSpacing: '-0.045em', color: C.ink }}>Pulsefit</span>
        </div>
        <div style={{ font: `400 ${LAY[L].sub}px/1.4 ${UI_FONT}`, color: '#5B6178', marginTop: port ? 20 : 14, opacity: P(u, 0.7, 1.3) }}>From first lead to loyal member.</div>
      </div>
    </div>
  )
}
