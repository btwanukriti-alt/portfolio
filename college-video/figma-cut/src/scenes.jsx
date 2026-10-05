// The four scenes of the 15s cut, each a pure function of the clock `t` and the layout
// (`land` 1920 × 1080 or `port` 1080 × 1920). Values come from the college management Figma
// frames (section 267:97221).
//   0 · Opening: the five colleges fly into the All Colleges switcher (one workspace).
//   1 · Dashboard: says what the product does. A frame is drawn on the canvas and fills with the
//       Financial Overview dashboard; product components land around it.
//   2 · Flow: drill down through stacked drawers. Each click opens the next level as a sheet
//       that pushes the earlier ones back; a breadcrumb trail and a stat chip follow along.
//   3 · Staff: the staff directory; a card opens the person's profile.
import { Cursor, Selection } from './fig.jsx'
import { C, E, FIG, P, SCENES, UI_FONT, clamp, kf, lerp, press, ripple, sway } from './lib.js'
import { AlertCard, KpiCard, LeaveCard, MWIN, OverviewWindow, Breadcrumb, LEVELS, ROW, ROW0, SHEET, SheetCard, StatChip, SWITCH, SwitcherPill, SwitcherList, CollegeRow, switchRowY, STAFF, SCARD, StaffCard, DirectoryHeader, PROFILE, StaffProfile } from './ui.jsx'

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
// 0 · OPENING: the five colleges, scattered on the canvas, dock into the All Colleges switcher
// =====================================================================================
const OPEN = {
  land: {
    K: 1.6, x: 624, y: 282,
    scatter: [[60, 330, -9], [1380, 300, 7], [40, 640, 6], [1400, 620, -6], [120, 900, -4]],
    curFrom: { x: 1980, y: 1120 }, curRest: { x: 1560, y: 960 },
  },
  port: {
    K: 2.2, x: 78, y: 520,
    scatter: [[40, 1260, -7], [370, 1410, 6], [60, 1560, 5], [380, 1700, -6], [100, 1820, 4]],
    curFrom: { x: 1150, y: 1950 }, curRest: { x: 940, y: 1700 },
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
  const pillPop = E.back(clamp((u - 0.1) / 0.5))
  const o = P(u, tc + 0.05, tc + 0.4, E.expo)
  const listY = D.y + K * (SWITCH.pill + SWITCH.gap)
  const pillC = { x: D.x + K * (SWITCH.w - 60), y: D.y + K * SWITCH.pill / 2 }
  const allRow = { x: D.x + K * 230, y: listY + K * (SWITCH.pad + SWITCH.all / 2) }
  const cur = kf(u, [[0.35, D.curFrom], [0.8, pillC], [tc + 0.15, pillC], [1.75, allRow], [1.95, allRow], [2.3, D.curRest]])
  const cs = sway(u, 1, 0)
  const sel = u > 1.75 ? P(u, 1.75, 1.9) * (1 - P(u, 2.2, 2.3)) : 0
  return (
    <>
      <Title L={L} W={W} u={u - 0.05} out={exit} eyebrow="College management software" lines={port ? ['One workspace for', 'all your colleges.'] : ['One workspace for all your colleges.']} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - exit, transform: `translateY(${-30 * E.inOut(exit)}px)` }}>
        {o > 0 && (
          <Abs x={D.x} y={listY} style={{ zIndex: 9 }}>
            <div style={{ transform: `scale(${K})`, transformOrigin: '0 0' }}>
              <SwitcherList o={o} check={E.back(clamp((u - 1.85) / 0.3))} hi={P(u, 1.65, 1.85)} />
            </div>
          </Abs>
        )}
        <Abs x={D.x} y={D.y} style={{ opacity: clamp((u - 0.1) / 0.2), transform: `scale(${0.85 + 0.15 * pillPop})`, transformOrigin: '50% 50%', zIndex: 12 }}>
          <div style={{ transform: `scale(${K})`, transformOrigin: '0 0' }}>
            <SwitcherPill open={o} pr={press(u, tc)} />
          </div>
        </Abs>
        {[0, 1, 2, 3, 4].map((i) => {
          const a = 0.15 + i * 0.07
          const pp = E.back(clamp((u - a) / 0.45))
          const dock = P(u, tc + 0.05 + i * 0.07, tc + 0.6 + i * 0.07, E.inOut)
          const [sx, sy, sr] = D.scatter[i]
          const to = { x: D.x + K * SWITCH.pad, y: D.y + K * switchRowY(i) }
          const sc = lerp(0.75, 1, dock)
          return (
            <Abs key={i} x={lerp(sx, to.x, dock)} y={lerp(sy, to.y, dock)} style={{ opacity: clamp((u - a) / 0.15), transform: `rotate(${sr * (1 - dock)}deg) scale(${K * sc * (0.8 + 0.2 * pp)})`, transformOrigin: '0 0', zIndex: dock > 0.5 ? 10 : 14 }}>
              <CollegeRow i={i} p={P(u, a + 0.2, a + 0.9)} float={1 - dock} />
            </Abs>
          )
        })}
        <Selection x={D.x} y={D.y} w={K * SWITCH.w} h={K * (SWITCH.pill + SWITCH.gap + SWITCH.list)} o={sel} label="College Switcher" comp size={`${SWITCH.w} × ${SWITCH.pill + SWITCH.gap + SWITCH.list}`} k={port ? 1.35 : 1.1} />
      </div>
      <Cursor x={cur.x + cs.x} y={cur.y + cs.y} o={P(u, 0.35, 0.6) * (1 - exit)} pr={press(u, tc) + press(u, 1.9)} rp={ripple(u, tc) + ripple(u, 1.9)} s={port ? 2 : 1.5} />
    </>
  )
}

// =====================================================================================
// 1 · INTRO
// =====================================================================================
// The drawn frame holds the Financial Overview dashboard (1440 × 664) at k = frame width / 1440.
export const HOOK_FRAME = { land: { x: 290, y: 300, w: 1340, h: 618 }, port: { x: 30, y: 620, w: 1020, h: 470 } }
const CS = 1.2
const CARDS = {
  land: [
    { kind: 'alert', label: 'Alert Card', w: 320, h: 152, to: { x: 40, y: 700 }, from: { x: -520, y: 800 }, rot: -6 },
    { kind: 'kpi', label: 'KPI Card', w: 300, h: 128, to: { x: 1500, y: 290 }, from: { x: 2100, y: 200 }, rot: 5 },
    { kind: 'leave', label: 'Leave Type', w: 300, h: 178, to: { x: 1500, y: 720 }, from: { x: 2100, y: 960 }, rot: -4 },
  ],
  port: [
    { kind: 'alert', label: 'Alert Card', w: 320, h: 152, to: { x: 50, y: 1180 }, from: { x: -520, y: 1290 }, rot: -5 },
    { kind: 'kpi', label: 'KPI Card', w: 300, h: 128, to: { x: 640, y: 1220 }, from: { x: 1300, y: 1340 }, rot: 5 },
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
      <Title L={L} W={W} u={u - 0.1} out={exit} eyebrow="Dashboard" lines={port ? ['Track fees and staff', 'across your colleges.'] : ['Track fees and staff across your colleges.']} />
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
// 2 · FLOW: drill down through stacked drawers (college → programme → fee → batches)
// =====================================================================================
// Each level is a sheet. Opening the next one slides it in and pushes the earlier sheets back
// (smaller, dimmer, shifted aside) so the stack builds up in depth; the whole stack re-centres
// as it grows. Landscape stacks sideways, portrait stacks upwards like sheets.
const FL = {
  land: { K: 1.3, step: 200, top: 312, crumb: { y: 226, s: 1.2 }, curFrom: { x: 1980, y: 1120 }, curRest: { x: 1720, y: 1010 } },
  port: { K: 1.6, step: 96, area: [500, 1860], crumb: { y: 410, s: 1.3 }, curFrom: { x: 1120, y: 1950 }, curRest: { x: 940, y: 1840 } },
}
const CLICKS = [1.05, 2.3, 3.55]
const levelsOpen = (u) => [1, ...CLICKS.map((c) => P(u, c + 0.08, c + 0.7, E.expo))]
// Stage rect, scale and dim of every sheet at scene time u.
function sheetLayout(u, L, W) {
  const D = FL[L]
  const p = levelsOpen(u)
  const n = p[1] + p[2] + p[3]
  const w = SHEET.w * D.K
  const h = SHEET.h * D.K
  return p.map((pi, i) => {
    const d = p.slice(i + 1).reduce((a, v) => a + v, 0)
    const sc = 1 - 0.07 * d
    if (L === 'land') {
      const A = (W - (n * D.step + w)) / 2 + n * D.step
      const x = A - D.step * d + (1 - pi) * 260
      return { x, y: D.top + (h * (1 - sc)) / 2 + (1 - pi) * 30, s: sc, w, h, p: pi, d, rot: -1.6 * d + (1 - pi) * 3 }
    }
    const [a0, a1] = D.area
    const T = a0 + (a1 - a0 - (n * D.step + h)) / 2 + n * D.step
    return { x: (W - w * sc) / 2, y: T - D.step * d + (1 - pi) * 260, s: sc, w, h, p: pi, d, rot: (1 - pi) * 2 }
  })
}
const rowPoint = (R, K) => ({ x: R.x + R.s * K * (ROW.nameX + 90), y: R.y + R.s * K * (ROW0 + ROW.h / 2) })
const rowBox = (R, K) => ({ x: R.x + R.s * K * ROW.x, y: R.y + R.s * K * ROW0, w: R.s * K * ROW.w, h: R.s * K * ROW.h })
// Levels' collected % and pending (₹ Cr) for the floating stat chip.
const STAT = LEVELS.map((L) => [(L.rec / L.exp) * 100, L.exp - L.rec])

export function Flow({ t, L, W }) {
  const u = local(t, 'flow')
  if (u === null) return null
  const port = L === 'port'
  const D = FL[L]
  const K = D.K
  const exit = P(u, 4.8, 5.2, E.inOut)
  const S = sheetLayout(u, L, W)
  const p = S.map((r) => r.p)
  const pop0 = E.back(clamp((u - 0.15) / 0.55))
  const k = [P(u, 0.35, 1.0), ...CLICKS.map((c) => P(u, c + 0.2, c + 0.95))]
  const rows = [P(u, 0.3, 0.9), ...CLICKS.map((c) => P(u, c + 0.15, c + 0.7))]
  // Cursor: aims at the first row of the current sheet, where it rests when clicked.
  const at = (c) => rowPoint(sheetLayout(c, L, W)[CLICKS.indexOf(c)], K)
  const cur = kf(u, [
    [0.55, D.curFrom], [0.95, at(CLICKS[0])], [CLICKS[0] + 0.2, at(CLICKS[0])],
    [CLICKS[1] - 0.2, at(CLICKS[1])], [CLICKS[1] + 0.2, at(CLICKS[1])],
    [CLICKS[2] - 0.2, at(CLICKS[2])], [CLICKS[2] + 0.25, at(CLICKS[2])], [4.4, D.curRest],
  ])
  const cs = sway(u, 3, u > 4.4 ? 5 : 0)
  const hi = (i) => (i < 3 ? clamp(1 - Math.abs(u - CLICKS[i]) / 0.3) * (u < CLICKS[i] + 0.6 ? 1 : 0) : 0)
  // Stat chip values move between levels as each drawer lands.
  const lv = (j) => STAT[0][j] + [1, 2, 3].reduce((a, i) => a + p[i] * (STAT[i][j] - STAT[i - 1][j]), 0)
  const top = S[3].p > 0.5 ? 3 : S[2].p > 0.5 ? 2 : S[1].p > 0.5 ? 1 : 0
  // The chip hands over from the previous sheet to the new one as it lands.
  const anchor = (R) => (port ? { x: 70, y: R.y + R.h * R.s - 60 } : { x: R.x + R.w * R.s - 90, y: R.y - 44 })
  const j = p[3] > 0 ? 3 : p[2] > 0 ? 2 : p[1] > 0 ? 1 : 0
  const ca = anchor(S[Math.max(0, j - 1)])
  const cb = anchor(S[j])
  const hand = j === 0 ? 1 : E.inOut(p[j])
  const chip = { x: lerp(ca.x, cb.x, hand), y: lerp(ca.y, cb.y, hand) }
  const chipIn = E.back(clamp((u - 0.7) / 0.5))
  const sk = port ? 1.35 : 1.1
  return (
    <>
      <Title L={L} W={W} u={u - 0.1} out={exit} eyebrow="Finance" lines={port ? ['Drill down from', 'college to fee.'] : ['Drill down from college to fee.']} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - exit, transform: `translateY(${-30 * E.inOut(exit)}px)` }}>
        <Abs x={0} y={D.crumb.y} style={{ width: W, display: 'flex', justifyContent: 'center', opacity: clamp((u - 0.25) / 0.3), zIndex: 20 }}>
          <Breadcrumb vis={p.map((v, i) => (i === 0 ? clamp((u - 0.25) / 0.3) : clamp((v - 0.3) / 0.6)))} scale={D.crumb.s} />
        </Abs>
        {S.map((R, i) => {
          if (R.p <= 0.001) return null
          const enter = i === 0 ? { o: clamp((u - 0.15) / 0.25), s: 0.88 + 0.12 * pop0 } : { o: clamp(R.p * 2.5), s: 0.92 + 0.08 * E.back(clamp((u - CLICKS[i - 1] - 0.08) / 0.55)) }
          return (
            <Abs key={i} x={R.x} y={R.y} style={{ width: R.w, height: R.h, opacity: enter.o, transform: `rotate(${R.rot}deg) scale(${R.s * enter.s})`, transformOrigin: i === 0 && u < 1 ? '50% 50%' : '0 0', zIndex: 10 + i }}>
              <div style={{ transform: `scale(${K})`, transformOrigin: '0 0', filter: `saturate(${1 - 0.2 * Math.min(R.d, 2)})` }}>
                <SheetCard level={i} k={k[i]} rows={rows[i]} hi={hi(i)} />
              </div>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 16 * K, background: `rgba(207,221,255,${0.22 * Math.min(R.d, 2)})`, pointerEvents: 'none' }} />
            </Abs>
          )
        })}
        {/* prototype hotspot on the clicked row */}
        {CLICKS.map((c, i) => {
          const o = clamp((u - (c - 0.35)) / 0.2) * (1 - clamp((u - c) / 0.1))
          if (o <= 0) return null
          const b = rowBox(S[i], K)
          return (
            <div key={i} style={{ position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, opacity: o, zIndex: 30, pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', inset: -3, border: `2.5px solid ${FIG.proto}`, borderRadius: 14 }} />
              <div style={{ position: 'absolute', right: 0, bottom: '100%', marginBottom: 10, transform: `scale(${port ? 1.3 : 1})`, transformOrigin: '100% 100%', display: 'flex', alignItems: 'center', gap: 6, background: FIG.proto, color: '#fff', font: `600 15px/1 ${UI_FONT}`, padding: '8px 12px', borderRadius: 8, whiteSpace: 'nowrap' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11V5.5a2 2 0 014 0V11M13 9.5a2 2 0 014 0V12M17 11a2 2 0 014 0v3.5a6.5 6.5 0 01-6.5 6.5H13a6 6 0 01-4.6-2.2L5 14.5a2 2 0 013-2.6L9 13" /></svg>
                On click → Open drawer
              </div>
            </div>
          )
        })}
        {/* the sheet on top is selected as it lands */}
        {S.map((R, i) => {
          const a = i === 0 ? 0.6 : CLICKS[i - 1] + 0.75
          const b = i < 3 ? CLICKS[i] - 0.45 : 4.5
          const o = u > a ? P(u, a, a + 0.15) * (1 - P(u, b, b + 0.15)) : 0
          return <Selection key={i} x={R.x} y={R.y} w={R.w * R.s} h={R.h * R.s} o={o} label={i === 0 ? 'Revenue Contribution' : `Drawer · Level ${i}`} comp size={`${SHEET.w} × ${SHEET.h}`} k={sk} />
        })}
        <Abs x={chip.x} y={chip.y} style={{ zIndex: 25, opacity: clamp((u - 0.7) / 0.2), transform: `scale(${(port ? 1.5 : 1.15) * (0.7 + 0.3 * chipIn)}) rotate(${top % 2 ? 2 : -2}deg)`, transformOrigin: '0 0' }}>
          <StatChip rate={lv(0) * P(u, 0.7, 1.3)} pending={lv(1) * P(u, 0.7, 1.3)} />
        </Abs>
      </div>
      <Cursor x={cur.x + cs.x} y={cur.y + cs.y} o={P(u, 0.55, 0.8) * (1 - exit)} pr={press(u, CLICKS[0]) + press(u, CLICKS[1]) + press(u, CLICKS[2])} rp={ripple(u, CLICKS[0]) + ripple(u, CLICKS[1]) + ripple(u, CLICKS[2])} s={port ? 2 : 1.5} />
    </>
  )
}

// =====================================================================================
// 3 · STAFF: the staff directory. Cards pop into the grid; the cursor opens a profile.
// =====================================================================================
const DIR = {
  land: { K: 1.3, x: 349, y: 290, cols: 3, gap: 20, hh: 72, curFrom: { x: 1980, y: 1120 }, curRest: { x: 1760, y: 1010 } },
  port: { K: 1.6, x: 44, y: 460, cols: 2, gap: 20, hh: 128, curFrom: { x: 1150, y: 1950 }, curRest: { x: 980, y: 1860 } },
}
export function Staff({ t, L, W }) {
  const u = local(t, 'staff')
  if (u === null) return null
  const port = L === 'port'
  const D = DIR[L]
  const K = D.K
  const gw = D.cols * SCARD.w + (D.cols - 1) * D.gap
  const exit = P(u, 3.35, 3.75, E.inOut)
  const gridY = D.y + K * (D.hh + 22)
  const slot = (i) => ({ x: D.x + K * ((i % D.cols) * (SCARD.w + D.gap)), y: gridY + K * (Math.floor(i / D.cols) * (SCARD.h + D.gap)) })
  const tc = 1.55
  const c0 = slot(0)
  const target = { x: c0.x + K * 150, y: c0.y + K * 110 }
  const cur = kf(u, [[0.6, D.curFrom], [1.2, target], [tc + 0.2, target], [2.5, D.curRest]])
  const cs = sway(u, 5, u > 2.5 ? 5 : 0)
  const hover = P(u, 1.1, 1.3) * (1 - P(u, tc + 0.3, tc + 0.45))
  const open = P(u, tc + 0.05, tc + 0.6, E.expo)
  const hpop = E.back(clamp((u - 0.1) / 0.5))
  // Profile panel: slides in from the right (landscape) or up from the bottom (portrait).
  const pw = (port ? 620 : PROFILE.w) * K
  const ph = PROFILE.h * K
  const pfx = port ? D.x + (K * gw - pw) / 2 : D.x + K * gw - pw + 40
  const pfy = port ? 1920 - ph - 60 : D.y - 6
  const pos = port ? { x: pfx, y: pfy + (1 - open) * 900 } : { x: pfx + (1 - open) * 700, y: pfy }
  const selCard = u > 1.2 ? P(u, 1.2, 1.3) * (1 - P(u, tc + 0.1, tc + 0.2)) : 0
  const selPro = u > tc + 0.75 ? P(u, tc + 0.75, tc + 0.9) * (1 - P(u, 3.1, 3.25)) : 0
  return (
    <>
      <Title L={L} W={W} u={u - 0.05} out={exit} eyebrow="Staff" lines={port ? ['Find anyone across', 'your colleges.'] : ['Find anyone across your colleges.']} />
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - exit, transform: `translateY(${-30 * E.inOut(exit)}px)` }}>
        <Abs x={D.x} y={D.y} style={{ opacity: clamp((u - 0.1) / 0.2), transform: `translateY(${(1 - hpop) * 20}px)`, zIndex: 11 }}>
          <div style={{ transform: `scale(${K})`, transformOrigin: '0 0' }}>
            <DirectoryHeader w={gw} narrow={port} k={P(u, 0.25, 1.0)} />
          </div>
        </Abs>
        {STAFF.map((_, i) => {
          const a = 0.25 + i * 0.07
          const pp = E.back(clamp((u - a) / 0.45))
          const s0 = slot(i)
          const lift0 = i === 0 ? hover : 0
          return (
            <Abs key={i} x={s0.x} y={s0.y - 10 * lift0} style={{ opacity: clamp((u - a) / 0.15), transform: `translateY(${(1 - pp) * 40}px) scale(${0.85 + 0.15 * pp + 0.03 * lift0})`, transformOrigin: '50% 50%', zIndex: 10 + (i === 0 ? 1 : 0) }}>
              <div style={{ transform: `scale(${K})`, transformOrigin: '0 0' }}>
                <StaffCard i={i} hover={lift0} />
              </div>
              <Selection x={0} y={0} w={SCARD.w * K} h={SCARD.h * K} o={i === 0 ? selCard : 0} label="Staff Card" comp size={`${SCARD.w} × ${SCARD.h}`} k={port ? 1.35 : 1.1} />
            </Abs>
          )
        })}
        {open > 0 && <div style={{ position: 'absolute', left: D.x - 20, top: gridY - 20, width: K * gw + 40, height: K * (Math.ceil(STAFF.length / D.cols) * (SCARD.h + D.gap)) + 20, borderRadius: 24, background: `rgba(207,221,255,${0.55 * open})`, zIndex: 15 }} />}
        {open > 0 && (
          <Abs x={pos.x} y={pos.y} style={{ opacity: clamp(open * 3), zIndex: 16 }}>
            <div style={{ transform: `scale(${K})`, transformOrigin: '0 0' }}>
              <StaffProfile narrow={port} k={P(u, tc + 0.35, tc + 1.2)} />
            </div>
            <Selection x={0} y={0} w={pw} h={ph} o={selPro} label="Staff Profile" comp size={`${port ? 620 : PROFILE.w} × ${PROFILE.h}`} k={port ? 1.35 : 1.1} />
          </Abs>
        )}
      </div>
      <Cursor x={cur.x + cs.x} y={cur.y + cs.y} o={P(u, 0.6, 0.85) * (1 - exit)} pr={press(u, tc)} rp={ripple(u, tc)} s={port ? 2 : 1.5} />
    </>
  )
}

