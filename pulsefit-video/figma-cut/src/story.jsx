// One flow, no captions: Neha Singh goes from a missed follow-up to a member who renews.
// 1. the flow as four cards, 2. Leads Table (Mark as Converted), 3. the Convert to Member form,
// 4. Members (Renew). Every screen is shown whole, fitted to the stage.
import { Cursor } from './fig.jsx'
import { C, CHAPTERS, E, P, clamp, fmt, kf, press, ripple, sway } from './lib.js'
import { CV, ConvertFrame, ConvertModal, LT, LeadsTable, MD, Members } from './screens.jsx'
import { Avatar, Btn, Chip, IC } from './ui.jsx'

const CH = Object.fromEntries(CHAPTERS.map((c) => [c.id, c]))
const local = (t, id) => (t >= CH[id].a - 0.02 && t < CH[id].b + 0.02 ? t - CH[id].a : null)
const CUR = { land: 1.5, port: 2.1 }

// ------------------------------------------------------------------------------- flow cards
// 380 × 150 each: a small labelled header, then the step. Button centre at (316, 104).
const BTN = { x: 316, y: 104 }
function FlowCard({ icon, tint, bg, label, children }) {
  return (
    <div style={{ position: 'relative', width: 380, height: 150, boxSizing: 'border-box', padding: '18px 22px', borderRadius: 18, background: '#fff', fontFamily: 'Poppins, sans-serif', color: C.ink, boxShadow: '0 1px 0 rgba(20,30,80,.04), 0 24px 50px -28px rgba(20,30,80,.35)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: C.sub, fontWeight: 500 }}>
        <span style={{ width: 28, height: 28, borderRadius: 8, background: bg, display: 'grid', placeItems: 'center' }}>{icon(tint, 15)}</span>
        {label}
      </div>
      <div style={{ position: 'absolute', left: 22, right: 22, top: 70, height: 64, display: 'flex', alignItems: 'center', gap: 12 }}>{children}</div>
    </div>
  )
}
const Who = ({ sub, subColor = C.sub, chip }) => (
  <>
    <Avatar name="Neha Singh" s={38} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600 }}>Neha Singh{chip}</div>
      <div style={{ fontSize: 12.5, color: subColor, marginTop: 2 }}>{sub}</div>
    </div>
  </>
)
const CARDS = [
  ({ pr }) => (
    <FlowCard icon={IC.calX} tint="#D6383F" bg="#FFE3E3" label="Missed follow-up">
      <Who sub="Missed by 5 days" subColor="#D6383F" chip={<Chip fg="#D6383F" bg="#FFDCDC" h={20} style={{ fontSize: 11 }}>Hot</Chip>} />
      <Btn h={34} pr={pr} style={{ fontSize: 13 }}>Follow-up</Btn>
    </FlowCard>
  ),
  ({ u }) => (
    <FlowCard icon={IC.star} tint={C.primary} bg={C.pSoft} label="Lead status">
      <Who sub="Lead #3051" />
      <div style={{ position: 'relative', width: 104, height: 26 }}>
        <Chip fg="#D6383F" bg="#FFDCDC" w={104} h={26} style={{ position: 'absolute', opacity: 1 - u }}>Hot</Chip>
        <Chip fg={C.green} bg="#D7F3E3" w={104} h={26} style={{ position: 'absolute', opacity: u, transform: `scale(${0.85 + 0.15 * E.back(u)})` }}>{IC.check(C.green, 12)}Converted</Chip>
      </div>
    </FlowCard>
  ),
  ({ u }) => (
    <FlowCard icon={IC.plans} tint="#6D3FE0" bg="#EEE7FF" label="Plan">
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600 }}>Quarterly<Chip fg="#6D3FE0" bg="#EEE7FF" h={20} style={{ fontSize: 11 }}>Recurring</Chip></div>
        <div style={{ fontSize: 12.5, color: C.sub, marginTop: 2 }}>3 months · incl. tax</div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>₹{fmt(5886 * u)}</div>
    </FlowCard>
  ),
  ({ pr }) => (
    <FlowCard icon={IC.clock} tint={C.amber} bg={C.aSoft} label="Renewal">
      <Who sub="Quarterly · expires in 2 days" subColor={C.amber} />
      <Btn h={34} pr={pr} style={{ fontSize: 13 }}>Renew</Btn>
    </FlowCard>
  ),
]

function Cards({ u, L, W, H }) {
  const port = L === 'port'
  // portrait: one column; landscape: a 2 × 2 grid read left to right, top to bottom
  const k = port ? 2.2 : 1.6
  const cw = 380 * k
  const ch = 150 * k
  const gap = port ? 30 : 36
  const pos = (i) =>
    port
      ? { x: (W - cw) / 2, y: (H - (4 * ch + 3 * gap)) / 2 + i * (ch + gap) }
      : { x: (W - (2 * cw + gap)) / 2 + (i % 2) * (cw + gap), y: (H - (2 * ch + gap)) / 2 + Math.floor(i / 2) * (ch + gap) }
  const at = (i, p) => ({ x: pos(i).x + p.x * k, y: pos(i).y + p.y * k })
  const cur = kf(u, [[1.3, { x: W * 0.7, y: H * 0.9 }], [2.1, at(0, BTN)], [2.5, at(0, BTN)], [4.3, at(3, { x: 200, y: 120 })], [4.8, at(3, BTN)], [6.5, at(3, BTN)]])
  const sw = sway(u, 1, 3)
  const clicks = [2.3, 4.95]
  return (
    <>
      {CARDS.map((Card, i) => {
        const a = 0.3 + i * 0.3
        const inn = P(u, a, a + 0.8, E.expo)
        const out = P(u, 5.8 + i * 0.06, 6.3 + i * 0.06, E.inOut)
        const p = pos(i)
        return (
          <div key={i} style={{ position: 'absolute', left: p.x, top: p.y, width: cw, height: ch, opacity: clamp((u - a) / 0.35) * (1 - out), transform: `translateY(${(1 - inn) * 60 - out * 30}px)` }}>
            <div style={{ width: 380, height: 150, transform: `scale(${k})`, transformOrigin: '0 0' }}>
              <Card pr={i === 0 ? press(u, 2.3) : press(u, 4.95)} u={i === 1 ? P(u, 2.7, 3.2) : P(u, 3.4, 4.3)} />
            </div>
          </div>
        )
      })}
      <Cursor x={cur.x + sw.x} y={cur.y + sw.y} o={P(u, 1.3, 1.6) * (1 - P(u, 5.8, 6.2))} pr={Math.max(...clicks.map((c) => press(u, c)))} rp={Math.max(...clicks.map((c) => ripple(u, c)))} s={CUR[L]} />
    </>
  )
}

// ----------------------------------------------------------------------------- whole screens
// Fits a frame (fw × fh) into the stage with a margin, whole and centred. `track` and `clicks`
// drive the cursor in frame coordinates.
function Screen({ u, len, L, W, H, fw, fh, children, track, clicks }) {
  const M = L === 'port' ? { x: 40, y: 120 } : { x: 80, y: 60 }
  const k = Math.min((W - 2 * M.x) / fw, (H - 2 * M.y) / fh)
  const x = (W - fw * k) / 2
  const y = (H - fh * k) / 2
  const inn = P(u, 0.05, 0.85, E.expo)
  const out = P(u, len - 0.55, len - 0.05, E.inOut)
  const c = kf(u, track)
  const sw = sway(u, 2, 3)
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: clamp(u / 0.4) * (1 - out), transform: `translateY(${(1 - inn) * 50 - out * 30}px)` }}>
      <div style={{ position: 'absolute', left: x, top: y, width: fw * k, height: fh * k, borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 0 rgba(20,30,80,.05), 0 50px 100px -50px rgba(20,30,80,.45)', transform: `scale(${0.97 + 0.03 * inn})` }}>
        <div style={{ transform: `scale(${k})`, transformOrigin: '0 0' }}>{children}</div>
      </div>
      <Cursor x={x + c.x * k + sw.x} y={y + c.y * k + sw.y} o={P(u, track[0][0], track[0][0] + 0.3)} pr={Math.max(...clicks.map((t) => press(u, t)))} rp={Math.max(...clicks.map((t) => ripple(u, t)))} s={CUR[L]} />
    </div>
  )
}

export function Story({ t, L, W, H }) {
  const port = L === 'port'
  const parts = []
  let u
  if ((u = local(t, 'cards')) !== null) parts.push(<Cards key="cards" u={u} L={L} W={W} H={H} />)
  if ((u = local(t, 'table')) !== null) {
    parts.push(
      <Screen key="table" u={u} len={6.5} L={L} W={W} H={H} fw={LT.w} fh={LT.h}
        track={[[0.8, { x: 1200, y: 760 }], [1.6, LT.dots], [1.95, LT.dots], [2.7, LT.item], [3.1, LT.item], [4.0, { x: 1120, y: 560 }]]}
        clicks={[1.75, 3.05]}>
        <LeadsTable menu={P(u, 1.85, 2.1) * (1 - P(u, 3.1, 3.3))} hover={P(u, 2.5, 2.6)} conv={P(u, 3.2, 3.6)} rowHi={P(u, 3.2, 3.5)} />
      </Screen>,
    )
  }
  if ((u = local(t, 'form')) !== null) {
    const o = port ? { x: CV.mx, y: CV.my } : { x: 0, y: 0 }
    const m = (p) => ({ x: p.x - o.x, y: p.y - o.y })
    const props = { fill: P(u, 1.0, 2.6, (x) => x), open: P(u, 3.4, 3.6) * (1 - P(u, 4.3, 4.45)), hover: u > 3.85 ? 1 : -1, picked: u > 4.3 ? 1 : 0, p: P(u, 4.6, 5.6), apr: press(u, 6.6) }
    parts.push(
      <Screen key="form" u={u} len={8.5} L={L} W={W} H={H} fw={port ? 672 : CV.w} fh={port ? 1112 : CV.h}
        track={[[1.0, m({ x: 940, y: 420 })], [3.1, m(CV.select)], [3.5, m(CV.select)], [3.9, m(CV.option(1))], [4.3, m(CV.option(1))], [5.8, m({ x: 1010, y: 1000 })], [6.4, m(CV.add)], [8.5, m(CV.add)]]}
        clicks={[3.35, 4.25, 6.6]}>
        {port ? <ConvertModal {...props} /> : <ConvertFrame {...props} />}
      </Screen>,
    )
  }
  if ((u = local(t, 'members')) !== null) {
    parts.push(
      <Screen key="members" u={u} len={6.5} L={L} W={W} H={H} fw={MD.w} fh={MD.h}
        track={[[1.2, { x: 1150, y: 660 }], [2.5, MD.renew], [6.5, MD.renew]]}
        clicks={[2.8]}>
        <Members k={P(u, 0.8, 1.8)} rowHi={P(u, 2.75, 2.95)} rpr={press(u, 2.8)} />
      </Screen>,
    )
  }
  return parts
}
