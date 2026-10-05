// One flow, told as a story: Neha Singh goes from a missed follow-up to a converted lead, is
// onboarded on the Quarterly plan, and renews three months later. Intro and outro show the
// flow as an infographic of its four components; each chapter shows the real screen with the
// cursor doing the step, and lifts the key component out beside it.
import { Cursor, Headline, Selection, Tag } from './fig.jsx'
import { C, CHAPTERS, E, FIG, P, clamp, fmt, kf, lerp, press, ripple, sway } from './lib.js'
import { CV, ConvertFrame, LD, LT, LeadsDash, LeadsTable, MD, MISSED, Members, StatusSwap, TaskItem } from './screens.jsx'
import { Avatar, Btn, Chip, IC } from './ui.jsx'

const CH = Object.fromEntries(CHAPTERS.map((c) => [c.id, c]))
const local = (t, id) => (t >= CH[id].a - 0.02 && t < CH[id].b + 0.02 ? t - CH[id].a : null)

// Screen window and caption positions per layout.
const LAY = {
  land: { S: { x: 110, y: 236, w: 1240, h: 790 }, tagY: 58, headY: 108, size: 72, ui: 1.35 },
  port: { S: { x: 50, y: 480, w: 980, h: 800 }, tagY: 150, headY: 220, size: 88, ui: 1.9 },
}

// The four flow nodes (340 × 120): shown together in the intro and outro, and each lifted out
// of its screen in its own chapter.
function PlanPick({ p = 1 }) {
  return (
    <div style={{ width: 340, height: 120, boxSizing: 'border-box', padding: '18px 22px', borderRadius: 16, background: '#fff', fontFamily: 'Poppins, sans-serif', color: C.ink }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 30, height: 30, borderRadius: 8, background: C.pSoft, display: 'grid', placeItems: 'center' }}>{IC.plans(C.primary, 16)}</span>
        <span style={{ fontSize: 15, fontWeight: 600, flex: 1 }}>Quarterly</span>
        <Chip fg="#6D3FE0" bg="#EEE7FF" h={22} style={{ fontSize: 11.5 }}>Recurring</Chip>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 14 }}>
        <span style={{ fontSize: 12.5, color: C.sub }}>3 months · Total</span>
        <span style={{ fontSize: 24, fontWeight: 600, color: C.primary, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>₹{fmt(5886 * p)}</span>
      </div>
    </div>
  )
}
function RenewMini() {
  return (
    <div style={{ width: 340, height: 120, boxSizing: 'border-box', padding: '18px 22px', borderRadius: 16, background: '#fff', fontFamily: 'Poppins, sans-serif', color: C.ink }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600 }}><Avatar name="Neha Singh" s={28} />Neha Singh</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
        <span style={{ fontSize: 13, color: C.amber, fontWeight: 500 }}>Expires in 2 days</span>
        <Btn h={32}>Renew</Btn>
      </div>
    </div>
  )
}
const FollowNode = () => (
  <div style={{ width: 340, height: 120, boxSizing: 'border-box', padding: '16px 14px', borderRadius: 16, background: '#fff' }}>
    <div style={{ font: "600 12px/1 'Poppins', sans-serif", color: MISSED.col, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>{IC.calX(MISSED.col, 14)}Missed Follow-ups</div>
    <TaskItem {...MISSED} w={312} />
  </div>
)
const NODES = [
  ['01', 'Follow up', <FollowNode key="f" />],
  ['02', 'Convert', <StatusSwap key="c" />],
  ['03', 'Onboard', <PlanPick key="o" />],
  ['04', 'Renew', <RenewMini key="r" />],
]

// ---------------------------------------------------------------------------- flow infographic
function Flow({ u, L, W, done = false, out = 0 }) {
  const port = L === 'port'
  const k = port ? 1.45 : 1.2
  const cw = 340 * k
  const ch = 120 * k
  const pos = (i) => (port ? { x: W / 2, y: 760 + i * 270 } : { x: W / 2 + (i - 1.5) * 462, y: 690 })
  const step = done ? 0.22 : 0.55
  const t0 = done ? 0.3 : 1.0
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - out, transform: `translateY(${-30 * E.inOut(out)}px)` }}>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width="1" height="1">
        {NODES.slice(0, 3).map((_, i) => {
          const a = pos(i)
          const b = pos(i + 1)
          const d = port ? `M${a.x} ${a.y + ch / 2 + 14} L${b.x} ${b.y - ch / 2 - 58}` : `M${a.x + cw / 2 + 14} ${a.y} L${b.x - cw / 2 - 14} ${b.y}`
          const g = P(u, t0 + i * step + 0.3, t0 + i * step + 0.3 + step, E.inOut)
          return (
            <path key={i} d={d} fill="none" stroke={FIG.comp} strokeWidth="3" strokeLinecap="round" strokeDasharray="6 10" opacity={g} />
          )
        })}
      </svg>
      {NODES.map(([n, label, comp], i) => {
        const a = t0 + i * step
        const pop = E.back(clamp((u - a) / 0.5))
        const p = pos(i)
        const check = done ? E.back(clamp((u - a - 0.35) / 0.4)) : 0
        return (
          <div key={n} style={{ position: 'absolute', left: p.x - cw / 2, top: p.y - ch / 2, width: cw, height: ch, opacity: clamp((u - a) / 0.2), transform: `scale(${0.6 + 0.4 * pop})` }}>
            <div style={{ position: 'absolute', left: 0, top: -40 * k, display: 'flex', alignItems: 'center', gap: 10 * k, font: `600 ${16 * k}px/1 'Poppins', sans-serif`, color: C.ink }}>
              <span style={{ width: 28 * k, height: 28 * k, borderRadius: 14 * k, background: C.ink, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12 * k }}>{n}</span>
              {label}
            </div>
            <div style={{ width: 340, height: 120, transform: `scale(${k})`, transformOrigin: '0 0', boxShadow: '0 30px 60px -30px rgba(40,30,110,.35)', borderRadius: 16 }}>{comp}</div>
            {check > 0 && (
              <div style={{ position: 'absolute', right: -12 * k, top: -12 * k, width: 32 * k, height: 32 * k, borderRadius: 16 * k, background: C.green, display: 'grid', placeItems: 'center', transform: `scale(${check})`, boxShadow: '0 0 0 4px #fff' }}>{IC.check('#fff', 16 * k)}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ------------------------------------------------------------------------------ chapter frame
// Renders `screen` (frame coords) cropped to `crop` inside the stage window S, plus the cursor,
// a lifted component with its dashed connector, and the caption.
function Chapter({ id, u, L, W, screen, crop, cursor, lift }) {
  const { S, ui } = LAY[L]
  const c = CH[id]
  const len = c.b - c.a
  const k = S.w / crop.w
  const out = P(u, len - 0.55, len - 0.1, E.inOut)
  const enter = P(u, 0.25, 1.15, E.out)
  const map = (p) => ({ x: S.x + (p.x - crop.x) * k, y: S.y + (p.y - crop.y) * k })
  const cur = cursor && kf(u, cursor.track)
  const cp = cur && map(cur)
  const cs = sway(u, 1.7, 4)
  const pr = cursor ? Math.max(0, ...cursor.clicks.map((x) => press(u, x))) : 0
  const rp = cursor ? Math.max(0, ...cursor.clicks.map((x) => ripple(u, x))) : 0
  // lifted component: from its place in the screen to the side, scaling up
  const lp = lift ? P(u, lift.at, lift.at + 0.75, E.inOut) : 0
  let liftEl = null
  if (lift && lp > 0) {
    const src = map({ x: lift.src.x + lift.src.w / 2, y: lift.src.y + lift.src.h / 2 })
    const s0 = (lift.src.w * k) / lift.w
    const to = lift.to[L]
    const sc = lerp(s0, to.s, lp)
    const cx = lerp(src.x, to.x, lp)
    const cy = lerp(src.y, to.y, lp)
    const line = P(u, lift.at + 0.5, lift.at + 1.0, E.inOut)
    const lw = lift.w * to.s
    const lh = lift.h * to.s
    liftEl = (
      <>
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', zIndex: 29 }} width="1" height="1">
          <path d={`M${src.x} ${src.y} L${to.x} ${to.y}`} fill="none" stroke={FIG.comp} strokeWidth="3" strokeDasharray="6 9" strokeLinecap="round" opacity={line} />
          <circle cx={src.x} cy={src.y} r={7 * line} fill="#fff" stroke={FIG.comp} strokeWidth="3" />
        </svg>
        <div style={{ position: 'absolute', left: cx - (lift.w * sc) / 2, top: cy - (lift.h * sc) / 2, width: lift.w * sc, height: lift.h * sc, zIndex: 30 }}>
          <div style={{ width: lift.w, height: lift.h, transform: `scale(${sc}) rotate(${-1.5 * lp}deg)`, transformOrigin: '0 0', borderRadius: 16, boxShadow: `0 ${40 * lp}px ${80 * lp}px -${30 * lp}px rgba(30,30,80,.45)` }}>{lift.el(u)}</div>
        </div>
        <Selection x={to.x - lw / 2} y={to.y - lh / 2} w={lw} h={lh} o={line * (1 - out)} label={lift.label} comp k={ui * 0.8} color={FIG.comp} />
      </>
    )
  }
  const port = L === 'port'
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - out }}>
      <Tag x={W / 2} y={LAY[L].tagY} text={c.eyebrow} u={u - 0.1} icon={<span style={{ width: 8, height: 8, borderRadius: 4, background: C.ink }} />} />
      <Headline lines={port ? c.port : c.land} u={u - 0.2} size={LAY[L].size} color={C.ink} x={0} w={W} y={LAY[L].headY} />
      <div style={{ position: 'absolute', left: S.x, top: S.y, width: S.w, height: S.h, perspective: 2400 }}>
        <div style={{ width: '100%', height: '100%', borderRadius: 22, overflow: 'hidden', background: '#F4F5F8', boxShadow: '0 0 0 1px rgba(20,20,60,.06), 0 60px 120px -50px rgba(30,30,80,.5)', opacity: clamp((u - 0.25) / 0.3), transform: `translateY(${120 * (1 - enter)}px) rotateX(${18 * (1 - enter)}deg)`, transformOrigin: '50% 100%' }}>
          <div style={{ transformOrigin: '0 0', transform: `translate(${-crop.x * k}px, ${-crop.y * k}px) scale(${k})` }}>{screen}</div>
        </div>
      </div>
      {liftEl}
      {cp && <Cursor x={cp.x + cs.x} y={cp.y + cs.y} name={cursor.name} o={P(u, cursor.track[0][0], cursor.track[0][0] + 0.3)} pr={pr} rp={rp} s={ui} />}
    </div>
  )
}

// Crop rects (frame coords; height follows the window's aspect).
const crop = (L, x, y, w) => ({ x, y, w, h: (LAY[L].S.h * w) / LAY[L].S.w })

export function Story({ t, L, W }) {
  const port = L === 'port'
  let u
  const parts = []

  if ((u = local(t, 'intro')) !== null) {
    const out = P(u, 4.85, 5.3, E.inOut)
    const anu = kf(u, [[0.9, { x: W + 40, y: port ? 1700 : 980 }], [1.6, port ? { x: 760, y: 820 } : { x: 360, y: 780 }], [2.2, port ? { x: 760, y: 1090 } : { x: 830, y: 780 }], [2.8, port ? { x: 760, y: 1360 } : { x: 1300, y: 780 }], [3.4, port ? { x: 760, y: 1630 } : { x: 1760, y: 780 }]])
    parts.push(
      <div key="intro">
        <div style={{ opacity: 1 - out }}>
          <Tag x={W / 2} y={150} text={CH.intro.eyebrow} u={u - 0.1} icon={<span style={{ width: 8, height: 8, borderRadius: 4, background: C.ink }} />} />
          <Headline lines={port ? CH.intro.port : CH.intro.land} u={u - 0.2} out={out} size={port ? 110 : 104} color={C.ink} x={0} w={W} y={port ? 230 : 226} hi={{ 'member.': { bg: '#FFFFFF', fg: C.primary } }} />
        </div>
        <Flow u={u} L={L} W={W} out={out} />
        <Cursor x={anu.x} y={anu.y} name="Anu" o={P(u, 0.9, 1.2) * (1 - out)} s={LAY[L].ui} />
      </div>,
    )
  }

  if ((u = local(t, 'follow')) !== null) {
    parts.push(
      <Chapter key="follow" id="follow" u={u} L={L} W={W}
        screen={<LeadsDash fpr={press(u, 2.6)} hi={P(u, 2.65, 2.85)} />}
        crop={port ? crop(L, 560, 110, 520) : crop(L, 300, 70, 1100)}
        cursor={{ name: 'Apurva Jha', track: [[1.3, { x: 1200, y: 520 }], [2.4, LD.follow], [6.5, LD.follow]], clicks: [2.6] }}
        lift={{ at: 3.0, src: LD.item, w: 340, h: 120, label: 'Follow-up alert', el: () => <FollowNode />, to: { land: { x: 1620, y: 560, s: 1.4 }, port: { x: 540, y: 1520, s: 2.3 } } }}
      />,
    )
  }

  if ((u = local(t, 'convert')) !== null) {
    parts.push(
      <Chapter key="convert" id="convert" u={u} L={L} W={W}
        screen={<LeadsTable menu={P(u, 1.75, 2.0) * (1 - P(u, 3.0, 3.2))} hover={P(u, 2.4, 2.5)} conv={P(u, 3.1, 3.5)} rowHi={P(u, 3.1, 3.4)} />}
        crop={port ? crop(L, 300, 110, 720) : crop(L, 280, 100, 1140)}
        cursor={{ name: 'Apurva Jha', track: [[1.0, { x: 1100, y: 640 }], [1.5, LT.dots], [1.85, LT.dots], [2.6, LT.item], [3.0, LT.item], [3.8, { x: 1080, y: 560 }]], clicks: [1.6, 2.95] }}
        lift={{ at: 3.5, src: { x: LT.status.x - 32, y: LT.status.y - 12, w: 64, h: 24 }, w: 340, h: 120, label: 'Lead status', el: (uu) => <StatusSwap u={P(uu, 4.1, 4.7)} />, to: { land: { x: 1620, y: 560, s: 1.4 }, port: { x: 540, y: 1520, s: 2.3 } } }}
      />,
    )
  }

  if ((u = local(t, 'onboard')) !== null) {
    const cy = kf(u, port ? [[0, 20], [2.5, 20], [3.2, 380], [4.6, 380], [5.2, 590]] : [[0, -10], [2.5, -10], [3.2, 300], [4.6, 300], [5.2, 470]])
    parts.push(
      <Chapter key="onboard" id="onboard" u={u} L={L} W={W}
        screen={<ConvertFrame fill={P(u, 1.0, 2.4, (x) => x)} open={P(u, 3.5, 3.7) * (1 - P(u, 4.35, 4.5))} hover={u > 3.9 ? 1 : -1} picked={u > 4.35 ? 1 : 0} p={P(u, 5.0, 5.8)} apr={press(u, 6.4)} />}
        crop={port ? crop(L, 364, cy, 712) : crop(L, 170, cy, 1100)}
        cursor={{ name: 'Anu', track: [[1.0, { x: 900, y: 420 }], [3.0, { x: 760, y: 640 }], [3.4, CV.select], [3.6, CV.select], [4.0, CV.option(1)], [4.35, CV.option(1)], [5.6, { x: 1100, y: 1080 }], [6.2, CV.add], [7.5, CV.add]], clicks: [3.45, 4.3, 6.4] }}
        lift={{ at: 5.1, src: CV.total, w: 340, h: 120, label: 'Plan & total', el: (uu) => <PlanPick p={P(uu, 5.2, 6.0)} />, to: { land: { x: 1620, y: 600, s: 1.4 }, port: { x: 540, y: 1520, s: 2.3 } } }}
      />,
    )
  }

  if ((u = local(t, 'renew')) !== null) {
    parts.push(
      <Chapter key="renew" id="renew" u={u} L={L} W={W}
        screen={<Members k={P(u, 0.9, 1.9)} rowHi={P(u, 2.75, 2.95)} rpr={press(u, 2.8)} />}
        crop={port ? crop(L, 300, 150, 720) : crop(L, 300, 80, 1100)}
        cursor={{ name: 'Apurva Jha', track: [[1.4, { x: 1150, y: 640 }], [2.5, MD.renew], [6.5, MD.renew]], clicks: [2.8] }}
        lift={{ at: 3.2, src: MD.row, w: 340, h: 120, label: 'Expiring member', el: () => <RenewMini />, to: { land: { x: 1620, y: 600, s: 1.4 }, port: { x: 540, y: 1520, s: 2.3 } } }}
      />,
    )
  }

  if ((u = local(t, 'outro')) !== null) {
    const out = P(u, 3.9, 4.45, E.inOut)
    parts.push(
      <div key="outro" style={{ opacity: 1 - out }}>
        <Tag x={W / 2} y={150} text={CH.outro.eyebrow} u={u - 0.1} icon={<span style={{ width: 8, height: 8, borderRadius: 4, background: C.ink }} />} />
        <Headline lines={port ? CH.outro.port : CH.outro.land} u={u - 0.2} size={port ? 110 : 104} color={C.ink} x={0} w={W} y={port ? 230 : 226} hi={{ 'place.': { bg: '#FFFFFF', fg: C.primary } }} />
        <Flow u={u} L={L} W={W} done />
      </div>,
    )
  }
  return parts
}
