// The seven Pulsefit screens on the canvas, rebuilt from the Figma frames. Each is a memoised
// pure component: its props only change while its own beat is playing. Geometry the scenes
// aim at (cursor targets, row boxes) is exported in frame coordinates.
import { memo } from 'react'
import { C, E, clamp, fmt } from './lib.js'
import { Abs, Avatar, Btn, Chip, IC, Shell, card } from './ui.jsx'

const STATUS = {
  Cold: ['#3B5BDB', '#DCE4FF'],
  Warm: ['#B7791F', '#FDF0C8'],
  Hot: ['#D6383F', '#FFDCDC'],
  Converted: [C.green, '#D7F3E3'],
}

// Shared table toolbar + pagination (Leads Table, Staff Table).
function TableCard({ x, y, w, h, cols, head, rows, renderRow, rowH = 54, checked = 1 }) {
  return (
    <div style={card({ left: x, top: y, width: w, height: h })}>
      <div style={{ position: 'absolute', left: 20, right: 20, top: 20, height: 40, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', width: 300, height: 40, borderRadius: 8, boxShadow: `inset 0 0 0 1px ${C.line}`, fontSize: 14, color: C.faint }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, paddingLeft: 12 }}>{IC.search(C.sub)}Search</span>
          <span style={{ width: 40, height: 40, display: 'grid', placeItems: 'center', borderLeft: `1px solid ${C.line}` }}>{IC.chev(C.sub)}</span>
        </div>
        <span style={{ flex: 1 }} />
        <Btn kind="ghost" h={36}>{IC.upload()}Export</Btn>
        <Btn kind="ghost" h={36}>Configure Table{IC.chev(C.t2, 14)}</Btn>
        <Btn kind="ghost" h={36}>{IC.cal()}4th Sep 2024 - 7th Oct 2024</Btn>
        <Btn kind="off" h={36}>{IC.gear('#fff', 15)}Bulk Actions</Btn>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 80, height: 52, display: 'grid', gridTemplateColumns: cols, alignItems: 'center', borderBottom: `1px solid ${C.line}`, fontSize: 13.5, fontWeight: 600, color: C.t2 }}>
        <span style={{ display: 'grid', placeItems: 'center' }}><Box /></span>
        {head.map((hd) => <span key={hd}>{hd}</span>)}
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: 132 + i * rowH, height: rowH, display: 'grid', gridTemplateColumns: cols, alignItems: 'center', borderBottom: `1px solid ${C.line2}`, fontSize: 13.5, color: C.t2, background: i === checked ? '#F7F8FC' : 'transparent' }}>
          <span style={{ display: 'grid', placeItems: 'center' }}><Box on={i === checked} /></span>
          {renderRow(r, i)}
        </div>
      ))}
      <div style={{ position: 'absolute', left: 20, width: 700, top: 132 + rows.length * rowH + 14, height: 6, borderRadius: 3, background: '#EEF0F4' }}><div style={{ width: 260, height: 6, borderRadius: 3, background: '#C9CDD8' }} /></div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 22, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, fontSize: 12.5, color: C.t2 }}>
        <span style={{ color: C.faint, marginRight: 4 }}>Prev</span>
        {['1', '2', '3', '…', '10'].map((p) => <span key={p} style={{ minWidth: 26, height: 26, borderRadius: 6, display: 'grid', placeItems: 'center', background: p === '1' ? C.primary : '#F1F2F6', color: p === '1' ? '#fff' : C.t2, fontWeight: 500 }}>{p}</span>)}
        <span style={{ fontWeight: 600, marginLeft: 4 }}>Next</span>
      </div>
      <div style={{ position: 'absolute', right: 24, bottom: 24, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: C.t2 }}>Rows Per Page:<span style={{ display: 'flex', alignItems: 'center', gap: 4, height: 24, padding: '0 8px', borderRadius: 6, background: '#F1F2F6' }}>8{IC.chev(C.sub, 12)}</span></div>
    </div>
  )
}
const Box = ({ on }) => (
  <span style={{ width: 18, height: 18, borderRadius: 4, display: 'grid', placeItems: 'center', background: on ? C.primary : '#fff', boxShadow: on ? 'none' : `inset 0 0 0 1.5px #B9BECB` }}>{on && IC.check('#fff', 12)}</span>
)
const When = ({ d, t }) => <div><div style={{ fontSize: 13.5, color: C.t2 }}>{d}</div><div style={{ fontSize: 12, color: C.faint, marginTop: 2 }}>{t}</div></div>

// ---------------------------------------------------------------------------------- Leads Table
const LEADS = [
  [2314, 'Robert Fox', '+91 98450 21134', 'Cold', 'Anukriti Mishra', '02 Oct, 2024', 'at 09:12:40 am'],
  [2789, 'Nithya Menon', '+91 78798 63288', 'Warm', 'Shikhar Tiwari', '02 Oct, 2024', 'at 10:05:18 am'],
  [3051, 'Neha Singh', '+91 99021 44870', 'Hot', 'Apurva Jha', '03 Oct, 2024', 'at 11:40:02 am'],
  [3168, 'Alex John', '+91 90876 33215', 'Cold', 'Anukriti Mishra', '03 Oct, 2024', 'at 02:26:55 pm'],
  [3294, 'Aaron Joseph', '+91 80455 19023', 'Warm', 'Abhishek Menon', '04 Oct, 2024', 'at 09:48:31 am'],
  [3407, 'Priya Raman', '+91 97411 56208', 'Cold', 'Ritesh Jha', '04 Oct, 2024', 'at 01:15:09 pm'],
  [3512, 'Kabir Shah', '+91 93450 77612', 'Hot', 'Shikhar Tiwari', '05 Oct, 2024', 'at 10:33:47 am'],
  [3688, 'Meera Iyer', '+91 76690 28341', 'Warm', 'Anukriti Mishra', '05 Oct, 2024', 'at 04:02:12 pm'],
]
const LT_COLS = '56px 80px 160px 96px 170px 140px 190px 164px'
// Frame 1440 × 860. Neha Singh is row 2.
export const LT = {
  w: 1440, h: 860,
  dots: { x: 641, y: 391 },
  item: { x: 712, y: 436 },
  status: { x: 922, y: 391 },
  row: { x: 320, y: 364, w: 1056, h: 54 },
}
// menu 0..1 (open), hover 0..1 (on "Mark as Converted"), conv 0..1 (status becomes Converted)
export const LeadsTable = memo(function LeadsTable({ menu = 0, hover = 0, conv = 0, rowHi = 0 }) {
  return (
    <Shell active="Leads" h={LT.h}>
      <TableCard
        x={320} y={124} w={1056} h={680} cols={LT_COLS}
        head={['ID', 'Name', 'Action', 'Contact', <span key="s" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>Status{IC.filter(C.primary, 14)}</span>, <span key="a" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>Assigned to{IC.filter(C.primary, 14)}</span>, 'Created At']}
        rows={LEADS}
        renderRow={([id, name, ph, st, as, d, tm], i) => {
          const s = i === 2 && conv > 0.5 ? 'Converted' : st
          const pop = i === 2 ? 1 + 0.12 * Math.sin(Math.PI * clamp((conv - 0.5) * 2)) : 1
          return (
            <>
              <span>{id}</span>
              <span style={{ fontWeight: 500, color: C.ink }}>{name}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 14 }}>{IC.dots()}{IC.pencil()}</span>
              <span>{ph}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 12 }}>
                <Chip fg={STATUS[s][0]} bg={STATUS[s][1]} w={s === 'Converted' ? 92 : 64} style={{ transform: `scale(${pop})` }}>{s === 'Converted' && IC.check(C.green, 12)}{s}</Chip>{IC.chev(C.t2, 14)}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{as}{IC.chev(C.t2, 14)}</span>
              <When d={d} t={tm} />
            </>
          )
        }}
      />
      <div style={{ position: 'absolute', left: LT.row.x, top: LT.row.y, width: LT.row.w, height: LT.row.h, background: `rgba(19,155,85,${0.07 * rowHi})`, pointerEvents: 'none' }} />
      {menu > 0 && (
        <div style={{ position: 'absolute', left: 628, top: 412, width: 212, padding: 6, borderRadius: 12, background: '#fff', boxShadow: '0 0 0 1px rgba(15,18,34,.06), 0 18px 40px -12px rgba(15,18,34,.28)', opacity: clamp(menu * 2), transform: `translateY(${-8 * (1 - E.out(menu))}px) scale(${0.96 + 0.04 * E.out(menu)})`, transformOrigin: '20px 0', zIndex: 5 }}>
          {[['Mark as Converted', IC.userPlusLine], ['Mark as Lost', IC.pin], ['Delete', IC.trash]].map(([l, ic], i) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36, padding: '0 10px', borderRadius: 8, fontSize: 13.5, color: i === 0 && hover > 0.5 ? C.primary : C.t2, background: i === 0 ? `rgba(31,79,244,${0.08 * hover})` : 'transparent', fontWeight: i === 0 && hover > 0.5 ? 500 : 400 }}>
              {ic(i === 0 && hover > 0.5 ? C.primary : C.sub, 16)}{l}
            </div>
          ))}
        </div>
      )}
    </Shell>
  )
})

// ------------------------------------------------------------------------------ Leads Dashboard
const TASKS = [
  ['Stale Leads Alert', '#E8590C', IC.bellFill, 4, [['Kabir Shah', 'Hot', 'No activity for 22 days'], ['Priya Raman', 'Hot', 'No activity for 18 days'], ['Alex John', 'Hot', 'No activity for 16 days'], ['Meera Iyer', 'Hot', 'No activity for 15 days']], 'follow'],
  ['Missed Follow-ups', '#D6383F', IC.calX, 4, [['Neha Singh', 'Hot', 'Missed by 5 days'], ['Aaron Joseph', 'Cold', 'Missed by 4 days'], ['Robert Fox', 'Hot', 'Missed by 3 days'], ['Nithya Menon', 'Hot', 'Missed by 2 days']], 'follow'],
  ['Low Quality Lead Flags', '#7048E8', IC.flag, 4, [['Meera Iyer', 'Hot', 'Phone Number Missing'], ['Kabir Shah', 'Cold', 'Objective Missing'], ['Priya Raman', 'Hot', 'Lead Source Missing'], ['Aaron Joseph', 'Hot', 'Email Missing']], 'edit'],
]
const KPI = [['New Leads', 234, '', '#3B5BDB', IC.userPlusLine, '#E5EBFF'], ['Conversion Rate', 34, '%', '#E8A10C', IC.trend, '#FFF4D6'], ['Demo Booking Rate', 23, '%', '#139B55', IC.cal, '#E3F6EC'], ['Lost Leads', 65, '', '#D6383F', IC.alert, '#FFE3E3']]
// Lead Flow Trend, weeks 1-4 (week 3 = the design's tooltip values).
const FLOW = [
  ['New Leads', '#F0B429', [63, 91, 67, 90]],
  ['Demo Booked', '#3DB37E', [40, 63, 45, 65]],
  ['Converted', '#5B5BD6', [15, 45, 27, 42]],
  ['Drop-offs', '#E5484D', [6, 22, 12, 32]],
]
const SOURCES = [['Social Media', 8, 5.8], ['Website', 6.2, 4.2], ['Walk-ins', 5.4, 3], ['Referrals', 5, 4.6], ['Ads', 8, 5.4]]
// Frame 1440 × 1130. Chart plot: x0 384, top 758, 250 tall; weeks at 424 + i·153.3.
export const LD = {
  w: 1440, h: 1130,
  week3: { x: 731, y: 758 + 250 * (1 - 67 / 100) },
  // Missed Follow-ups, first item (Neha Singh): box and its Follow-up button.
  item: { x: 691, y: 224, w: 313, h: 60 },
  follow: { x: 927, y: 254 },
  perf: { x: 300, y: 500, w: 1100, h: 610 },
}
// One task row (Stale / Missed / Low quality cards): 313 × 60. Used in the dashboard and lifted
// out on its own. `hi` rings it (selected), `pr` presses its Follow-up button.
export function TaskItem({ nm, st, note, col, act = 'follow', pr = 0, hi = 0, w = 313 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: w, height: 60, padding: '0 12px', boxSizing: 'border-box', borderRadius: 10, background: '#fff', boxShadow: `inset 0 0 0 ${1 + hi}px ${hi > 0.5 ? col : C.line}`, fontFamily: 'Poppins, sans-serif', color: C.ink }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 500 }}>{nm}<Chip fg={STATUS[st][0]} bg={STATUS[st][1]} h={20} style={{ fontSize: 11, padding: '0 6px' }}>{st}</Chip></div>
        <div style={{ fontSize: 12, color: col, marginTop: 3 }}>{note}</div>
      </div>
      {act === 'follow' ? <Btn h={28} pr={pr} style={{ fontSize: 12 }}>Follow-up</Btn> : IC.pencil(C.violet, 15)}
      {IC.dots(C.t2, 16)}
    </div>
  )
}
export const MISSED = { nm: 'Neha Singh', st: 'Hot', note: 'Missed by 5 days', col: '#D6383F' }
const wx = (i) => 424 + i * 153.3
const wy = (v) => 758 + 250 * (1 - v / 100)
export const LeadsDash = memo(function LeadsDash({ k = 1, draw = 1, bars = 1, tip = 0, fpr = 0, hi = 0 }) {
  return (
    <Shell active="Leads" h={LD.h} sub={[['Leads Dashboard', true], ['Create New Lead'], ['Leads Table']]}>
      <Abs x={320} y={92} style={{ fontSize: 12.5, color: C.sub, display: 'flex', gap: 6, alignItems: 'center' }}>Leads{IC.chevR(C.sub, 12)}<span style={{ color: C.primary }}>Leads Tasks</span></Abs>
      <Abs x={320} y={114} style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em' }}>Leads Tasks</Abs>
      <Abs x={1240} y={110}><Btn h={38}>{IC.plus()}New Lead</Btn></Abs>
      {TASKS.map(([title, col, ic, n, items, act], ci) => (
        <div key={title} style={card({ left: 320 + ci * 357, top: 172, width: 341, height: 312, padding: 14 })}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 30, color: col, fontSize: 14, fontWeight: 500 }}>
            {ic(col, 16)}<span style={{ flex: 1 }}>{title}</span>
            <span style={{ width: 20, height: 20, borderRadius: 10, background: col, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600 }}>{n}</span>
          </div>
          {items.map(([nm, st, note], ii) => (
            <div key={nm + note} style={{ marginTop: 8 }}>
              <TaskItem nm={nm} st={st} note={note} col={col} act={act} pr={ci === 1 && ii === 0 ? fpr : 0} hi={ci === 1 && ii === 0 ? hi : 0} />
            </div>
          ))}
        </div>
      ))}
      <Abs x={320} y={516} style={{ fontSize: 21, fontWeight: 600, letterSpacing: '-0.02em' }}>Lead Performance</Abs>
      <Abs x={1150} y={512}><Chip fg={C.primary} bg={C.pSoft} h={32} style={{ padding: '0 12px', boxShadow: `inset 0 0 0 1px #C9D5FF` }}>{IC.cal(C.primary, 14)}4th Sep 2024 - 7th Oct 2024</Chip></Abs>
      {KPI.map(([label, v, suf, col, ic, bg], i) => (
        <div key={label} style={card({ left: 320 + i * 268, top: 560, width: 252, height: 108, padding: '16px 18px 0 22px', overflow: 'hidden' })}>
          <div style={{ position: 'absolute', left: 0, top: 16, bottom: 16, width: 3, borderRadius: 2, background: col }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, color: C.sub }}>{label}</div>
              <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', lineHeight: 1.25 }}>{fmt(v * k)}{suf}</div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: 'grid', placeItems: 'center' }}>{ic(col, 20)}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: C.sub, marginTop: 4 }}><span style={{ display: 'inline-flex', alignItems: 'center', color: C.green, fontWeight: 600 }}>{IC.up(C.green, 12)}+21%</span>Since last week</div>
        </div>
      ))}
      <div style={card({ left: 320, top: 688, width: 640, height: 410, padding: 22 })}>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Lead Flow Trend</div>
      </div>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width="1" height="1">
        {[0, 20, 40, 60, 80, 100].map((v) => (
          <g key={v}>
            <line x1={384} x2={924} y1={wy(v)} y2={wy(v)} stroke={C.line2} strokeWidth="1" />
            <text x={370} y={wy(v) + 4} textAnchor="end" fontSize="12" fill={C.faint} fontFamily="Poppins">{v}</text>
          </g>
        ))}
        {[0, 1, 2, 3].map((i) => <text key={i} x={wx(i)} y={1036} textAnchor="middle" fontSize="12.5" fill={C.sub} fontFamily="Poppins">Week {i + 1}</text>)}
        {tip > 0 && <line x1={wx(2)} x2={wx(2)} y1={wy(100)} y2={wy(0)} stroke="#C7CBD6" strokeDasharray="4 4" opacity={tip} />}
        {FLOW.map(([name, col, vals], li) => {
          const d = vals.map((v, i) => `${i ? 'L' : 'M'}${wx(i)} ${wy(v)}`).join(' ')
          const u = clamp(draw * 1.25 - li * 0.08)
          return (
            <g key={name}>
              <path d={d} fill="none" stroke={col} strokeWidth="2.5" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - u} />
              {vals.map((v, i) => <circle key={i} cx={wx(i)} cy={wy(v)} r={i === 2 && tip > 0.5 ? 6 : 4.5} fill="#fff" stroke={col} strokeWidth="2.5" opacity={clamp(u * 4 - i)} />)}
            </g>
          )
        })}
        {FLOW.map(([name, col], i) => (
          <g key={name} transform={`translate(${430 + i * 125} 1066)`}>
            <rect width="10" height="10" rx="2" fill={col} y="-9" />
            <text x="16" fontSize="12" fill={C.t2} fontFamily="Poppins">{name}</text>
          </g>
        ))}
      </svg>
      {tip > 0 && (
        <div style={{ position: 'absolute', left: wx(2) + 18, top: wy(100) - 30, width: 160, padding: '10px 12px', borderRadius: 10, background: '#fff', boxShadow: '0 0 0 1px rgba(15,18,34,.06), 0 14px 30px -10px rgba(15,18,34,.3)', fontSize: 12.5, color: C.t2, display: 'grid', gap: 5, opacity: tip, transform: `translateY(${6 * (1 - tip)}px)` }}>
          {FLOW.map(([name, col, vals]) => <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: col }} /><b style={{ fontWeight: 600, color: C.ink }}>{vals[2]}</b>{name}</div>)}
        </div>
      )}
      <div style={card({ left: 976, top: 688, width: 400, height: 410, padding: 22 })}>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Lead Source Conversion</div>
        <Chip fg="#5B5BD6" bg="#ECEBFF" h={26} style={{ marginTop: 14 }}>38%</Chip>
        <div style={{ position: 'absolute', left: 40, right: 22, top: 126, height: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: `1px solid ${C.line}` }}>
          {SOURCES.map(([n, a, b], i) => {
            const g = clamp(bars * 1.3 - i * 0.07)
            return (
              <div key={n} style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: '100%' }}>
                <div style={{ width: 18, height: `${a * 10 * g}%`, background: '#F26D6D', borderRadius: '3px 3px 0 0' }} />
                <div style={{ width: 18, height: `${b * 10 * g}%`, background: '#7C83F5', borderRadius: '3px 3px 0 0' }} />
              </div>
            )
          })}
        </div>
        <div style={{ position: 'absolute', left: 26, right: 8, top: 334, display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: C.sub }}>{SOURCES.map(([n]) => <span key={n} style={{ width: 66, textAlign: 'center' }}>{n}</span>)}</div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 368, display: 'flex', justifyContent: 'center', gap: 20, fontSize: 12, color: C.t2 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><i style={{ width: 10, height: 10, borderRadius: 2, background: '#F26D6D' }} />Leads</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><i style={{ width: 10, height: 10, borderRadius: 2, background: '#7C83F5' }} />Conversion</span>
        </div>
      </div>
    </Shell>
  )
})

// ---------------------------------------------------------------------------- Members Dashboard
// Refined: the design's placeholder "Plan A-E" become real plans from the Plans screen, and
// Neha Singh's row carries her phone number and trainer from the Leads Table.
const EXP = [
  ['Robert Fox', '+91 98450 21134', 'Anukriti Mishra', 'Monthly', 'Today'],
  ['Neha Singh', '+91 99021 44870', 'Apurva Jha', 'Quarterly', '2 days'],
  ['Alex John', '+91 90876 33215', 'Anukriti Mishra', 'Half-Yearly', '5 days'],
  ['Cameron', '+91 78556 54916', 'Ritesh Jha', 'Annual', '6 days'],
  ['Aaron Joseph', '+91 80455 19023', 'Abhishek Menon', 'PT Starter', '7 days'],
]
const PLAN_C = { Monthly: ['#4F46E5', '#ECEBFF'], Quarterly: [C.primary, C.pSoft], 'Half-Yearly': [C.violet, C.vSoft], Annual: [C.teal, '#E3F7F4'], 'PT Starter': ['#C27410', '#FFF1DA'] }
const MKPI = [
  ['Active Members', 234, IC.users, C.primary, C.pSoft, '+21', true],
  ['New Joinees', 12, IC.userPlusLine, C.green, C.gSoft, '+21', true],
  ['Pending Payments', 42, IC.clock, C.amber, C.aSoft, '+21', true],
  ['Frozen Accounts', 26, IC.alert, C.red, C.rSoft, '+21', true],
  ['Biometrics Missing', 34, IC.staff, C.violet, C.vSoft, '+2', false],
]
const EXP_COLS = '144px 150px 96px 76px 1fr'
// Frame 1440 × 720. Neha Singh is row 1 of Expiring Subscription.
export const MD = {
  w: 1440, h: 720,
  row: { x: 340, y: 445, w: 640, h: 51 },
  renew: { x: 855, y: 470 },
}
export const Members = memo(function Members({ k = 1, rowHi = 0, rpr = 0 }) {
  return (
    <Shell active="Members" h={MD.h}>
      <Abs x={320} y={104} style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>Members</Abs>
      <Abs x={936} y={102} style={{ display: 'flex', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 260, height: 40, padding: '0 12px', borderRadius: 8, background: '#fff', boxShadow: `inset 0 0 0 1px ${C.line}`, boxSizing: 'border-box', fontSize: 14, color: C.faint }}>{IC.search()}Search</div>
        <Btn h={40}>{IC.plus()}Add Member</Btn>
      </Abs>
      {MKPI.map(([label, v, ic, tint, bg, tr, good], i) => (
        <div key={label} style={card({ left: 320 + i * 214, top: 168, width: 198, height: 116, padding: 16 })}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, color: C.sub }}>{label}</div>
              <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{fmt(v * k)}</div>
            </div>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: 'grid', placeItems: 'center' }}>{ic(tint, 18)}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.sub, marginTop: 4 }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color: good ? C.green : C.red, fontWeight: 600 }}>{IC.trend(good ? C.green : C.red, 13)}{tr}</span>since last week</div>
        </div>
      ))}
      <div style={card({ left: 320, top: 300, width: 680, height: 380, padding: 20 })}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 32, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 16, fontWeight: 600 }}>Expiring Subscription</span><Chip fg={C.red} bg={C.rSoft}>8 expiring</Chip></div>
          <span style={{ fontSize: 13, color: C.primary, fontWeight: 500 }}>View all</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: EXP_COLS, fontSize: 11.5, color: C.faint, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '0 8px', height: 30, borderBottom: `1px solid ${C.line2}`, boxSizing: 'border-box' }}>
          <span>Name</span><span>Assigned to</span><span>Plan</span><span>Expires in</span><span style={{ textAlign: 'right' }}>Actions</span>
        </div>
        {EXP.map(([n, ph, as, pl, ex], i) => (
          <div key={n} style={{ display: 'grid', gridTemplateColumns: EXP_COLS, alignItems: 'center', height: 51, padding: '0 8px', borderBottom: i < 4 ? `1px solid ${C.line2}` : 'none', background: i === 1 ? `rgba(31,79,244,${0.07 * rowHi})` : 'transparent', borderRadius: 8 }}>
            <div><div style={{ fontSize: 13.5, fontWeight: 500 }}>{n}</div><div style={{ fontSize: 11.5, color: C.faint }}>{ph}</div></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: C.t2 }}><Avatar name={as} s={22} />{as}</div>
            <div><Chip fg={PLAN_C[pl][0]} bg={PLAN_C[pl][1]} h={22}>{pl}</Chip></div>
            <div style={{ fontSize: 13, fontWeight: 500, color: ex === 'Today' ? C.red : ex === '2 days' ? C.amber : C.sub }}>{ex}</div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}><Btn h={28} pr={i === 1 ? rpr : 0}>Renew</Btn><Btn h={28} kind="ghost">Reminder</Btn></div>
          </div>
        ))}
      </div>
      <div style={card({ left: 1016, top: 300, width: 360, height: 380, padding: 20 })}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 32, marginBottom: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>Incomplete Profile</span>
          <span style={{ fontSize: 13, color: C.primary, fontWeight: 500 }}>View all</span>
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          {[['Robert Fox', 'Biometrics missing'], ['Neha Singh', 'Phone number missing'], ['Alex John', 'Email missing'], ['Cameron', 'Plan not assigned']].map(([n, issue]) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12, height: 64, padding: '0 14px', borderRadius: 12, boxShadow: `inset 0 0 0 1px ${C.line}` }}>
              <Avatar name={n} s={32} />
              <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 500 }}>{n}</div><div style={{ fontSize: 12, color: C.red, marginTop: 2 }}>{issue}</div></div>
              <Btn h={28} kind="soft">Reminder</Btn>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
})

// --------------------------------------------------------------------------- Convert to Member
// The design's "Convert to Member" modal (Add Member 9), refined: real lead data, a plan
// picker with real plans, no placeholder helper text, billing copy that matches the plan.
const PLAN_OPTS = [['Monthly', '1 month', '2,000'], ['Quarterly', '3 months', '5,400'], ['Half-Yearly', '6 months', '9,600'], ['Annual', '12 months', '16,800']]
const Toggle = ({ on }) => (
  <div style={{ width: 40, height: 22, borderRadius: 11, background: on ? C.primary : '#D5D8E2', position: 'relative', flex: 'none' }}>
    <div style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 16, height: 16, borderRadius: 8, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
  </div>
)
const typed = (s, u) => s.slice(0, Math.round(s.length * clamp(u)))
function Field({ x, y, w = 280, label, value, u = 1, ph, active, children }) {
  const v = value ? typed(value, u) : ''
  return (
    <Abs x={x} y={y - 19}>
      <div style={{ fontSize: 13, color: C.t2, marginBottom: 6 }}>{label}</div>
      <div style={{ width: w, height: 42, borderRadius: 8, boxSizing: 'border-box', padding: '0 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: v ? C.ink : C.faint, background: '#fff', boxShadow: `inset 0 0 0 ${active ? 2 : 1}px ${active ? C.primary : '#CDD1DB'}` }}>
        {children}{v || ph}{active && <span style={{ width: 1.5, height: 18, background: C.primary, marginLeft: -6 }} />}
      </div>
    </Abs>
  )
}
// Billing total box (584 × 200). p counts the amounts up.
function TotalBox({ p = 1, w = 584 }) {
  const rows = [['Subscription Amount', 5400], ['Joining Fee (waived)', 0], ['Discount', 0], ['Tax', 486]]
  return (
    <div style={{ width: w, height: 200, boxSizing: 'border-box', padding: '18px 24px', borderRadius: 12, background: '#F6F7FA', fontFamily: 'Poppins, sans-serif', color: C.ink }}>
      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Total</div>
      {rows.map(([k, v]) => <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.sub, height: 23, alignItems: 'center' }}><span>{k}</span><span style={{ color: C.t2, fontVariantNumeric: 'tabular-nums' }}>₹{fmt(v * p, 2)}</span></div>)}
      <div style={{ height: 1, background: C.line, margin: '8px 0 10px' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 20, height: 20, borderRadius: 10, background: '#F5B82E', color: '#8A5A00', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>₹</span>
        <span style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>Total Amount</span>
        <span style={{ fontSize: 19, fontWeight: 600, color: C.primary, fontVariantNumeric: 'tabular-nums' }}>₹{fmt(5886 * p, 2)}</span>
      </div>
    </div>
  )
}
// Frame 1440 × 1200: Leads Table dimmed under the modal (modal at 384, 44; 672 × 1112).
export const CV = {
  w: 1440, h: 1200, mx: 384, my: 44,
  select: { x: 560, y: 573 },
  option: (i) => ({ x: 560, y: 630 + i * 44 }),
  total: { x: 428, y: 840, w: 584, h: 200 },
  add: { x: 966, y: 1120 },
}
// fill 0..1 types the member details; open / hover (option index) / picked drive the plan picker;
// p counts the total; apr presses Add Member.
export const ConvertModal = memo(function ConvertModal({ fill = 1, open = 0, hover = -1, picked = 1, p = 1, apr = 0 }) {
  const f = (i) => clamp(fill * 4 - i)
  const sec = (y, h, title) => (
    <div style={{ position: 'absolute', left: 24, top: y, width: 624, height: h, borderRadius: 12, boxShadow: `inset 0 0 0 1px ${C.line}` }}>
      <div style={{ height: 48, display: 'flex', alignItems: 'center', padding: '0 24px', background: '#FAFAFC', borderRadius: '12px 12px 0 0', borderBottom: `1px solid ${C.line}`, fontSize: 15, fontWeight: 600 }}>{title}</div>
    </div>
  )
  return (
      <div style={{ position: 'relative', width: 672, height: 1112, background: '#fff', borderRadius: 16, fontFamily: 'Poppins, sans-serif', color: C.ink }}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: `1px solid ${C.line}` }}>
          <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em' }}>Convert to Member</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.t2} strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </div>
        {sec(88, 317, 'Member Details')}
        <Field x={48} y={175} label="First Name" value="Neha" u={f(0)} ph="First name" active={fill > 0 && fill < 0.25} />
        <Field x={344} y={175} label="Last Name" value="Singh" u={f(1)} ph="Last name" active={fill >= 0.25 && fill < 0.5} />
        <Field x={48} y={250} label="Email" ph="name@email.com" />
        <Field x={344} y={250} label="Phone Number" value="+91 99021 44870" u={f(2)} ph="+91" active={fill >= 0.5 && fill < 0.75} />
        <Field x={48} y={325} label="Assign To" value={fill >= 0.75 ? 'Apurva Jha' : ''} ph="Select staff">{fill >= 0.75 && <Avatar name="Apurva Jha" s={24} />}</Field>
        {sec(421, 595, 'Plan Info')}
        <Field x={48} y={508} label="Select Plan" value={picked ? 'Quarterly' : ''} ph="Select plan" active={open > 0.5} />
        {picked > 0 && <Abs x={150} y={519}><Chip fg="#6D3FE0" bg="#EEE7FF" h={22} style={{ fontSize: 11.5 }}>Recurring</Chip></Abs>}
        <Abs x={300} y={518}>{IC.chev(C.t2, 18)}</Abs>
        <Field x={344} y={508} label="Starting Date" ph="Select date" />
        <Abs x={592} y={518}>{IC.calSmall(C.t2, 18)}</Abs>
        <Abs x={24} y={570} w={624} h={1} style={{ background: C.line }} />
        <Abs x={48} y={594} style={{ fontSize: 16, fontWeight: 600 }}>Billing Information</Abs>
        {[['Waive off joining fee', true, 632], ['Apply discount', false, 668]].map(([l, on, y]) => (
          <Abs key={l} x={48} y={y} w={576} h={30} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14, fontWeight: 500 }}>{l}<Toggle on={on} /></Abs>
        ))}
        <Abs x={44} y={716} w={584} h={64} style={{ borderRadius: 10, background: '#FFF6DA', padding: '12px 16px', boxSizing: 'border-box', fontSize: 12.5, color: '#8A6100' }}>
          <div style={{ fontWeight: 600 }}>Billing Information</div>
          <div style={{ marginTop: 2 }}>Billed every 3 months, starting from the selected start date.</div>
        </Abs>
        <Abs x={44} y={796}><TotalBox p={p} /></Abs>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 72, borderTop: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: C.t2, padding: '0 8px' }}>Cancel</span>
          <Btn h={42} pr={apr}>Add Member</Btn>
        </div>
        {open > 0 && (
          <Abs x={48} y={556} w={280} style={{ padding: 6, borderRadius: 12, background: '#fff', boxShadow: '0 0 0 1px rgba(15,18,34,.06), 0 18px 40px -12px rgba(15,18,34,.3)', opacity: clamp(open * 2), transform: `translateY(${-8 * (1 - E.out(open))}px)`, zIndex: 3 }}>
            {PLAN_OPTS.map(([n, d, a], i) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', height: 44, padding: '0 10px', borderRadius: 8, background: i === hover ? C.pSoft : 'transparent', fontSize: 13.5 }}>
                <span style={{ flex: 1, fontWeight: 500, color: i === hover ? C.primary : C.ink }}>{n}<span style={{ display: 'block', fontSize: 11.5, color: C.faint, fontWeight: 400 }}>{d}</span></span>
                <span style={{ color: C.t2 }}>₹{a}</span>
              </div>
            ))}
          </Abs>
        )}
      </div>
  )
})

// The modal over the dimmed Leads Table, as the full 1440 × 1200 frame.
export const ConvertFrame = memo(function ConvertFrame(props) {
  return (
    <div style={{ position: 'relative', width: CV.w, height: CV.h, background: '#F4F5F8', overflow: 'hidden' }}>
      <LeadsTable conv={1} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,18,34,.42)' }} />
      <div style={{ position: 'absolute', left: CV.mx, top: CV.my, borderRadius: 16, boxShadow: '0 40px 100px -30px rgba(10,14,40,.6)' }}>
        <ConvertModal {...props} />
      </div>
    </div>
  )
})
