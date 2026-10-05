// Hook → middle → end, on one background.
// Hook: a product overview, the dashboard as a hub with the seven modules around it, beside
// "Every lead. Every member. One place."
// Middle: one lead (Neha Singh) through the real screens, each shown whole, joined by
// transitions: a clip reveal, her alert card travelling into her table row, the row growing
// into the Convert to Member form, and a push into Members.
// End: the four screens settle into a deck beside the Pulsefit sign-off.
import { Cursor } from './fig.jsx'
import { PRICE_CARD, PlanPrices } from './infographics.jsx'
import { C, E, HEAD_FONT, P, UI_FONT, clamp, kf, lerp, press, ripple, sway } from './lib.js'
import { CV, ConvertFrame, LD, LT, LeadsDash, LeadsTable, MD, Members } from './screens.jsx'
import { Avatar, Chip, IC, Mark } from './ui.jsx'

// The product's modules (sidebar) with a fact from each module's screens.
const MODULES = [
  ['Leads', IC.star, '#3B5BDB', '#E5EBFF', '234 new leads'],
  ['Members', IC.users, C.primary, C.pSoft, '234 active members'],
  ['Plans', IC.plans, '#6D3FE0', '#EEE7FF', '12 active plans'],
  ['Staff', IC.staff, C.green, C.gSoft, 'Managers and trainers'],
  ['Communication', IC.mail, C.pink, '#FDE9F1', 'Email campaigns'],
  ['Equipments', IC.dumbbell, C.teal, '#E3F7F4', 'Repair schedules'],
  ['Workouts', IC.heart, C.red, C.rSoft, 'Workout plans'],
]

// Layout: captions in a left column (landscape) or on top (portrait); screens in AREA.
const LAY = {
  land: { cap: { x: 120, w: 540 }, area: { x: 720, y: 80, w: 1120, h: 920 }, size: 64, cur: 1.5 },
  port: { cap: { x: 70, w: 940 }, area: { x: 40, y: 600, w: 1000, h: 1240 }, size: 84, cur: 2.1 },
}
const fit = (a, fw, fh) => {
  const k = Math.min(a.w / fw, a.h / fh)
  return { k, x: a.x + (a.w - fw * k) / 2, y: a.y + (a.h - fh * k) / 2, w: fw * k, h: fh * k }
}
const onScreen = (f, r) => ({ x: f.x + r.x * f.k, y: f.y + r.y * f.k, w: r.w * f.k, h: r.h * f.k })
const shadow = '0 1px 0 rgba(20,30,80,.05), 0 50px 100px -50px rgba(20,30,80,.45)'

// ------------------------------------------------------------------------------------ caption
// Lines rise out of a mask one after another; the sub line fades in; out lifts it all away.
function Caption({ L, y, lines, sub, u, out = 0, size }) {
  const { cap } = LAY[L]
  const fs = size || LAY[L].size
  return (
    <div style={{ position: 'absolute', left: cap.x, top: y, width: cap.w, opacity: 1 - out, transform: `translateY(${-24 * E.inOut(out)}px)` }}>
      {lines.map((line, i) => {
        const p = P(u, i * 0.09, i * 0.09 + 0.9, E.expo)
        return (
          <div key={i} style={{ overflow: 'hidden', padding: '0.04em 0 0.1em', marginBottom: '-0.12em' }}>
            <div style={{ font: `600 ${fs}px/1.04 ${HEAD_FONT}`, letterSpacing: '-0.04em', color: C.ink, transform: `translateY(${(1 - p) * 105}%)`, whiteSpace: 'nowrap' }}>{line}</div>
          </div>
        )
      })}
      {sub && (
        <div style={{ font: `400 ${L === 'port' ? 30 : 21}px/1.45 ${UI_FONT}`, color: '#5B6178', marginTop: L === 'port' ? 26 : 22, maxWidth: L === 'port' ? 860 : 440, opacity: P(u, 0.45, 1.0), transform: `translateY(${(1 - P(u, 0.45, 1.1, E.expo)) * 14}px)` }}>{sub}</div>
      )}
    </div>
  )
}

// A whole screen at f, with optional entrance style and a cursor in frame coordinates.
function Shot({ f, children, style, cursor, u, L }) {
  let cur = null
  if (cursor) {
    const c = kf(u, cursor.track)
    const sw = sway(u, 2, 3)
    cur = <Cursor x={f.x + c.x * f.k + sw.x} y={f.y + c.y * f.k + sw.y} o={P(u, cursor.track[0][0], cursor.track[0][0] + 0.3) * (cursor.o ?? 1)} pr={Math.max(0, ...cursor.clicks.map((t) => press(u, t)))} rp={Math.max(0, ...cursor.clicks.map((t) => ripple(u, t)))} s={LAY[L].cur} />
  }
  return (
    <>
      <div style={{ position: 'absolute', left: f.x, top: f.y, width: f.w, height: f.h, borderRadius: 16, overflow: 'hidden', boxShadow: shadow, ...style }}>
        <div style={{ transform: `scale(${f.k})`, transformOrigin: '0 0' }}>{children}</div>
      </div>
      {cur}
    </>
  )
}

// Shared-element ghost: a white card travelling from rect a to rect b.
function Ghost({ a, b, p, o, children }) {
  const r = { x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), w: lerp(a.w, b.w, p), h: lerp(a.h, b.h, p) }
  return (
    <div style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: lerp(10, 16, p), background: '#fff', opacity: o, boxShadow: `0 ${30 + 30 * Math.sin(Math.PI * p)}px ${80}px -30px rgba(20,30,80,${0.25 + 0.25 * Math.sin(Math.PI * p)})`, overflow: 'hidden', zIndex: 20 }}>
      {children}
    </div>
  )
}

const CAPS = {
  follow: { lines: ['Never miss', 'a follow-up.'], sub: 'Stale and missed leads surface on their own, ready to act on.' },
  convert: { lines: ['Convert a lead', 'in two clicks.'], sub: 'Mark a lead converted straight from the table.' },
  onboard: { lines: ['Plan and billing', 'in one step.'], sub: 'Pick a plan. Tax and totals work themselves out.' },
  retain: { lines: ['Keep members', 'coming back.'], sub: 'Expiring plans surface early, so renewals never slip.' },
}

export function Story({ t, L, W, H }) {
  const port = L === 'port'
  const { area } = LAY[L]
  const capY = (tall) => (port ? 150 : tall ? 220 : 360)
  const els = []
  const between = (a, b) => t >= a && t < b

  // ------------------------------------------------------------------------- FOLLOW 5.5–11.5
  const fDash = fit(area, LD.w, LD.h)
  const fTable = fit(area, LT.w, LT.h)
  const fForm = fit(area, CV.w, CV.h)
  const fMem = fit(area, MD.w, MD.h)
  // ---------------------------------------------------------------------------- HOOK 0–5.5
  // Product overview: the Leads Dashboard as a hub with the seven modules around it. The hub
  // then grows into the first chapter's screen.
  if (between(0, 5.55)) {
    const u = t
    const out = P(u, 4.4, 5.0, E.inOut)
    const c = port ? { x: 540, y: 1260 } : { x: 1290, y: 545 }
    const R = port ? { x: 395, y: 500 } : { x: 450, y: 380 }
    const hw = port ? 440 : 470
    const hub0 = { x: c.x - hw / 2, y: c.y - (hw * LD.h) / LD.w / 2, w: hw, h: (hw * LD.h) / LD.w }
    const grow = P(u, 4.6, 5.5, E.inOut)
    const hub = { x: lerp(hub0.x, fDash.x, grow), y: lerp(hub0.y, fDash.y, grow), w: lerp(hub0.w, fDash.w, grow), h: lerp(hub0.h, fDash.h, grow) }
    const hin = P(u, 0.2, 1.1, E.expo)
    const pt = (i) => {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / MODULES.length
      return { x: c.x + R.x * Math.cos(ang), y: c.y + R.y * Math.sin(ang) }
    }
    els.push(
      <div key="hook">
        <Caption L={L} y={port ? 170 : 330} lines={['Every lead.', 'Every member.', 'One place.']} sub="Pulsefit runs a gym from first enquiry to renewal." u={u - 0.15} out={P(u, 4.3, 4.8, E.inOut)} size={port ? 104 : 76} />
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width="1" height="1">
          {MODULES.map((m, i) => {
            const q = pt(i)
            const d = P(u, 0.9 + i * 0.1, 1.6 + i * 0.1, E.inOut)
            return <line key={m[0]} x1={c.x} y1={c.y} x2={lerp(c.x, q.x, d)} y2={lerp(c.y, q.y, d)} stroke="#B8C3E8" strokeWidth={port ? 3 : 2} opacity={1 - out} />
          })}
        </svg>
        <div style={{ position: 'absolute', left: hub.x, top: hub.y, width: hub.w, height: hub.h, borderRadius: 16, overflow: 'hidden', boxShadow: shadow, opacity: clamp(u / 0.4), transform: `scale(${0.9 + 0.1 * hin})`, zIndex: 5 }}>
          <div style={{ transform: `scale(${hub.w / LD.w})`, transformOrigin: '0 0' }}><LeadsDash /></div>
        </div>
        {MODULES.map(([name, icon, tint, bg, note], i) => {
          const q = pt(i)
          const a = 1.0 + i * 0.12
          const pop = E.back(clamp((u - a) / 0.55))
          const away = { x: (q.x - c.x) * 0.35 * out, y: (q.y - c.y) * 0.35 * out }
          const cw = port ? 280 : 250
          return (
            <div key={name} style={{ position: 'absolute', left: q.x - cw / 2 + away.x, top: q.y - (port ? 50 : 42) + away.y, width: cw, opacity: clamp((u - a) / 0.25) * (1 - out), transform: `scale(${0.7 + 0.3 * pop})`, zIndex: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: port ? 16 : 13, height: port ? 100 : 84, padding: `0 ${port ? 20 : 16}px`, borderRadius: 18, background: '#fff', boxShadow: '0 1px 0 rgba(20,30,80,.05), 0 24px 50px -26px rgba(20,30,80,.4)', fontFamily: UI_FONT }}>
                <span style={{ width: port ? 54 : 44, height: port ? 54 : 44, borderRadius: 12, background: bg, display: 'grid', placeItems: 'center', flex: 'none' }}>{icon(tint, port ? 26 : 21)}</span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: port ? 21 : 16.5, fontWeight: 600, color: C.ink, letterSpacing: '-0.01em' }}>{name}</span>
                  <span style={{ display: 'block', fontSize: port ? 16 : 13, color: C.sub, marginTop: 2, whiteSpace: 'nowrap' }}>{note}</span>
                </span>
              </div>
            </div>
          )
        })}
      </div>,
    )
  }

  if (between(5.5, 11.6)) {
    const u = t - 5.5
    const out = P(u, 4.9, 5.4, E.inOut)
    els.push(
      <div key="follow">
        <Caption L={L} y={capY()} {...CAPS.follow} u={u - 0.3} out={P(u, 5.0, 5.5, E.inOut)} />
        <Shot f={fDash} u={u} L={L}
          style={{ opacity: 1 - out }}
          cursor={{ track: [[1.0, { x: 1250, y: 760 }], [1.9, LD.follow], [4.6, LD.follow]], clicks: [2.1], o: 1 - P(u, 4.4, 4.8) }}>
          <LeadsDash fpr={press(u, 2.1)} hi={P(u, 2.15, 2.35)} />
        </Shot>
      </div>,
    )
  }
  // ghost: Neha's alert card → her row in the Leads Table
  if (between(10.3, 11.7)) {
    const p = P(t, 10.4, 11.3, E.inOut)
    const a = onScreen(fDash, LD.item)
    const b = onScreen(fTable, LT.row)
    const k = lerp(fDash.k, fTable.k, p)
    els.push(
      <Ghost key="g1" a={a} b={b} p={p} o={1 - P(t, 11.35, 11.6)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 * k, height: '100%', padding: `0 ${14 * k}px`, font: `500 ${14 * k}px/1 ${UI_FONT}`, color: C.ink }}>
          <Avatar name="Neha Singh" s={30 * k} />Neha Singh<Chip fg="#D6383F" bg="#FFDCDC" h={22 * k} style={{ fontSize: 11.5 * k, padding: `0 ${8 * k}px` }}>Hot</Chip>
        </div>
      </Ghost>,
    )
  }

  // ------------------------------------------------------------------------ CONVERT 11.5–17.5
  if (between(10.9, 17.6)) {
    const u = t - 11.5
    const inn = P(t, 10.9, 11.5, E.out)
    const out = P(u, 4.9, 5.5, E.inOut)
    els.push(
      <div key="convert">
        <Caption L={L} y={capY()} {...CAPS.convert} u={u - 0.1} out={P(u, 5.5, 6.0, E.inOut)} />
        <Shot f={fTable} u={u} L={L} style={{ opacity: inn * (1 - out) }}
          cursor={{ track: [[0.4, { x: 1200, y: 700 }], [1.1, LT.dots], [1.4, LT.dots], [2.2, LT.item], [2.6, LT.item], [3.4, { x: 1150, y: 600 }]], clicks: [1.25, 2.55], o: 1 - P(u, 4.4, 4.8) }}>
          <LeadsTable menu={P(u, 1.35, 1.6) * (1 - P(u, 2.6, 2.8))} hover={P(u, 2.0, 2.1)} conv={P(u, 2.7, 3.1)} rowHi={P(u, 2.7, 3.0)} />
        </Shot>
      </div>,
    )
  }
  // ghost: the converted row grows into the Convert to Member modal
  if (between(16.3, 17.9)) {
    const p = P(t, 16.4, 17.4, E.inOut)
    const a = onScreen(fTable, LT.row)
    const b = onScreen(fForm, { x: CV.mx, y: CV.my, w: 672, h: 1112 })
    const k = lerp(fTable.k, fForm.k, p)
    els.push(
      <Ghost key="g2" a={a} b={b} p={p} o={1 - P(t, 17.5, 17.8)}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 10 * k, padding: `0 ${16 * k}px`, font: `500 ${14 * k}px/1 ${UI_FONT}`, color: C.ink, opacity: 1 - P(p, 0, 0.35, (x) => x) }}>
          <Avatar name="Neha Singh" s={30 * k} />Neha Singh<Chip fg={C.green} bg="#D7F3E3" h={22 * k} style={{ fontSize: 11.5 * k, padding: `0 ${8 * k}px` }}>Converted</Chip>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 64 * k, display: 'flex', alignItems: 'center', padding: `0 ${24 * k}px`, font: `600 ${20 * k}px/1 ${UI_FONT}`, color: C.ink, borderBottom: `1px solid ${C.line}`, opacity: P(p, 0.6, 1, (x) => x) }}>Convert to Member</div>
      </Ghost>,
    )
  }

  // ------------------------------------------------------------------------ ONBOARD 17.5–25
  if (between(16.8, 25.1)) {
    const u = t - 17.5
    const inn = P(t, 16.8, 17.4, E.out)
    const push = P(u, 6.9, 7.5, E.inOut)
    const pa = port ? { x: (W - PRICE_CARD.w * 1.4) / 2, y: 1450, s: 1.4 } : { x: 120, y: 600, s: 1.04 }
    const pIn = P(u, 4.4, 5.2, E.expo)
    els.push(
      <div key="onboard">
        <Caption L={L} y={capY(true)} {...CAPS.onboard} u={u - 0.1} out={P(u, 6.9, 7.4, E.inOut)} />
        <Shot f={fForm} u={u} L={L} style={{ opacity: inn * (1 - push), transform: `translateX(${-160 * push}px) scale(${1 - 0.05 * push})` }}
          cursor={{ track: [[0.6, { x: 940, y: 420 }], [2.5, CV.select], [2.8, CV.select], [3.25, CV.option(1)], [3.6, CV.option(1)], [5.4, { x: 1010, y: 1000 }], [5.9, CV.add], [7.5, CV.add]], clicks: [2.75, 3.6, 6.1], o: 1 - push }}>
          <ConvertFrame fill={P(u, 0.6, 2.0, (x) => x)} open={P(u, 2.8, 3.0) * (1 - P(u, 3.6, 3.75))} hover={u > 3.2 ? 1 : -1} picked={u > 3.6 ? 1 : 0} p={P(u, 3.9, 4.9)} apr={press(u, 6.1)} />
        </Shot>
        {(!port || u < 7.5) && (
          <div style={{ position: 'absolute', left: pa.x, top: pa.y, width: PRICE_CARD.w * pa.s, height: PRICE_CARD.h * pa.s, opacity: clamp((u - 4.4) / 0.3) * (1 - push), transform: `translateY(${(1 - pIn) * 50}px)`, zIndex: 25 }}>
            <div style={{ transform: `scale(${pa.s})`, transformOrigin: '0 0' }}><PlanPrices u={u - 4.5} /></div>
          </div>
        )}
      </div>,
    )
  }

  // ------------------------------------------------------------------------- RETAIN 25–31
  if (between(24.4, 31.1)) {
    const u = t - 25
    const inn = P(t, 24.5, 25.4, E.expo)
    const out = P(u, 5.2, 6.0, E.inOut)
    els.push(
      <div key="retain">
        <Caption L={L} y={capY()} {...CAPS.retain} u={u - 0.1} out={P(u, 5.2, 5.7, E.inOut)} />
        <Shot f={fMem} u={u} L={L} style={{ opacity: clamp(inn * 1.5) * (1 - out), transform: `translateX(${(1 - inn) * 220}px) scale(${1 - 0.08 * out})` }}
          cursor={{ track: [[0.9, { x: 1150, y: 660 }], [2.0, MD.renew], [4.6, MD.renew]], clicks: [2.3], o: 1 - P(u, 4.4, 4.8) }}>
          <Members k={P(u, 0.5, 1.6)} rowHi={P(u, 2.3, 2.5)} rpr={press(u, 2.3)} />
        </Shot>
      </div>,
    )
  }

  // ---------------------------------------------------------------------------- END 31–35.5
  if (between(31, 35.5)) {
    const u = t - 31
    const out = P(u, 3.9, 4.45, E.inOut)
    const screens = [
      [<LeadsDash key="d" />, LD.w, LD.h],
      [<LeadsTable key="t" conv={1} />, LT.w, LT.h],
      [<ConvertFrame key="f" />, CV.w, CV.h],
      [<Members key="m" />, MD.w, MD.h],
    ]
    const tw = port ? 680 : 700
    const pos = (i) => (port ? { x: 170 + i * 30, y: 760 + i * 180 } : { x: 760 + i * 110, y: 100 + i * 120 })
    els.push(
      <div key="end" style={{ opacity: 1 - out }}>
        <div style={{ position: 'absolute', inset: 0, perspective: 2600 }}>
          <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateX(${port ? 14 : 10}deg) rotateY(${port ? -10 : -20}deg) rotateZ(${port ? 4 : 3}deg)`, transformOrigin: port ? '55% 70%' : '70% 50%' }}>
            {screens.map(([el, fw, fh], i) => {
              const k = tw / fw
              const a = 0.1 + i * 0.16
              const p = P(u, a, a + 1.0, E.expo)
              const q = pos(i)
              return (
                <div key={i} style={{ position: 'absolute', left: q.x, top: q.y, width: tw, height: fh * k, borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 0 rgba(20,30,80,.05), 0 60px 90px -40px rgba(20,30,80,.5)', opacity: clamp((u - a) / 0.3), transform: `translateY(${(1 - p) * 120}px)` }}>
                  <div style={{ transform: `scale(${k})`, transformOrigin: '0 0' }}>{el}</div>
                </div>
              )
            })}
          </div>
        </div>
        <div style={{ position: 'absolute', left: LAY[L].cap.x, top: port ? 220 : 400, opacity: P(u, 0.5, 1.1), transform: `translateY(${(1 - P(u, 0.5, 1.4, E.expo)) * 20}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: port ? 22 : 16 }}>
            <Mark s={port ? 84 : 60} />
            <span style={{ font: `700 ${port ? 104 : 76}px/1 ${HEAD_FONT}`, letterSpacing: '-0.045em', color: C.ink }}>Pulsefit</span>
          </div>
          <div style={{ font: `400 ${port ? 32 : 23}px/1.4 ${UI_FONT}`, color: '#5B6178', marginTop: port ? 24 : 18, opacity: P(u, 0.9, 1.5) }}>From first lead to loyal member.</div>
        </div>
      </div>,
    )
  }
  return els
}

