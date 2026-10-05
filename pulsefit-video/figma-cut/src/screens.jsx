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
const TYPE = { Permanent: ['#6D3FE0', '#EEE7FF'], Freelancer: ['#C27410', '#FFF1DA'], Consultant: ['#D2491E', '#FFE6DD'] }

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
  perf: { x: 300, y: 500, w: 1100, h: 610 },
}
const wx = (i) => 424 + i * 153.3
const wy = (v) => 758 + 250 * (1 - v / 100)
export const LeadsDash = memo(function LeadsDash({ k = 1, draw = 1, bars = 1, tip = 0 }) {
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
          {items.map(([nm, st, note]) => (
            <div key={nm + note} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 60, marginTop: 8, padding: '0 12px', borderRadius: 10, boxShadow: `inset 0 0 0 1px ${C.line}` }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 500 }}>{nm}<Chip fg={STATUS[st][0]} bg={STATUS[st][1]} h={20} style={{ fontSize: 11, padding: '0 6px' }}>{st}</Chip></div>
                <div style={{ fontSize: 12, color: col, marginTop: 3 }}>{note}</div>
              </div>
              {act === 'follow' ? <Btn h={28} style={{ fontSize: 12 }}>Follow-up</Btn> : IC.pencil(C.violet, 15)}
              {IC.dots(C.t2, 16)}
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
const EXP = [
  ['Robert Fox', '+91 98886 23443', 'Apurva Jha', 'Plan A', 'Today'],
  ['Neha Singh', '+91 98676 23562', 'Shikhar Tiwari', 'Plan B', '2 days'],
  ['Alex John', '+91 98568 96512', 'Abhishek M', 'Plan C', '5 days'],
  ['Cameron', '+91 78556 54916', 'Ritesh Jha', 'Plan D', '6 days'],
  ['Aaron J.', '+91 78556 54916', 'Shikhar Tiwari', 'Plan E', '7 days'],
]
const PLAN_C = { 'Plan A': [C.primary, C.pSoft], 'Plan B': [C.amber, C.aSoft], 'Plan C': [C.violet, C.vSoft], 'Plan D': [C.teal, '#E3F7F4'], 'Plan E': [C.pink, '#FDE9F1'] }
const MKPI = [
  ['Active Members', 234, IC.users, C.primary, C.pSoft, '+21', true],
  ['New Joinees', 12, IC.userPlusLine, C.green, C.gSoft, '+21', true],
  ['Pending Payments', 42, IC.clock, C.amber, C.aSoft, '+21', true],
  ['Frozen Accounts', 26, IC.alert, C.red, C.rSoft, '+21', true],
  ['Biometrics Missing', 34, IC.staff, C.violet, C.vSoft, '+2', false],
]
const EXP_COLS = '150px 144px 76px 80px 1fr'
// Frame 1440 × 720. Row 0 = Robert Fox; ROW0 is its "Expires in" cell.
export const MD = {
  w: 1440, h: 720,
  row0: { x: 734, y: 421 },
  row: { x: 337, y: 396, w: 646, h: 51 },
}
export const Members = memo(function Members({ k = 1, rowHi = 0 }) {
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
          <div key={n} style={{ display: 'grid', gridTemplateColumns: EXP_COLS, alignItems: 'center', height: 51, padding: '0 8px', borderBottom: i < 4 ? `1px solid ${C.line2}` : 'none', background: i === 0 ? `rgba(31,79,244,${0.07 * rowHi})` : 'transparent', borderRadius: 8 }}>
            <div><div style={{ fontSize: 13.5, fontWeight: 500 }}>{n}</div><div style={{ fontSize: 11.5, color: C.faint }}>{ph}</div></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: C.t2 }}><Avatar name={as} s={22} />{as}</div>
            <div><Chip fg={PLAN_C[pl][0]} bg={PLAN_C[pl][1]} h={22}>{pl}</Chip></div>
            <div style={{ fontSize: 13, fontWeight: 500, color: ex === 'Today' ? C.red : ex === '2 days' ? C.amber : C.sub }}>{ex}</div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}><Btn h={28}>Renew</Btn><Btn h={28} kind="ghost">Reminder</Btn></div>
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

// ------------------------------------------------------------------------------------- Plans
const CAT = { Membership: '#4F46E5', Training: '#D97706', Classes: '#0D9488', Student: '#16A34A' }
const PLANS = [
  ['Membership', 'Monthly', '1 month', '2,000', '180', '15 Days', '1 Week', 128],
  ['Membership', 'Quarterly', '3 months', '5,400', '486', '1 Month', '2 Weeks', 94],
  ['Membership', 'Half-Yearly', '6 months', '9,600', '864', '1 Month', '3 Weeks', 61],
  ['Membership', 'Annual', '12 months', '16,800', '1,512', '2 Months', '1 Month', 143],
  ['Training', 'PT Starter', '1 month', '6,000', '540', '15 Days', '1 Week', 38],
  ['Training', 'PT Pro', '3 months', '16,500', '1,485', '1 Month', '2 Weeks', 22],
  ['Classes', 'Yoga Monthly', '1 month', '1,800', '162', '15 Days', '1 Week', 76],
  ['Classes', 'Zumba Monthly', '1 month', '1,600', '144', '15 Days', '1 Week', 54],
]
// Frame 1440 × 800. Cards 249 × 262 at x 320 + i·269, rows y 216 / 494. Quarterly = card 1.
export const PL = {
  w: 1440, h: 800,
  cardAt: (i) => ({ x: 320 + (i % 4) * 269, y: 216 + Math.floor(i / 4) * 278, w: 249, h: 262 }),
}
function PlanCard({ p, lift = 0, users = 1 }) {
  const [cat, name, dur, amt, tax, ext, pause, n] = p
  const Row = ({ k, v }) => <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.sub, height: 20, alignItems: 'center' }}><span>{k}</span><span style={{ color: C.t2, width: 70 }}>{v}</span></div>
  return (
    <div style={{ position: 'relative', width: 249, height: 262, background: '#fff', borderRadius: 12, boxShadow: `0 0 0 1px ${C.line}, 0 ${24 * lift}px ${40 * lift}px -${18 * lift}px rgba(20,30,90,.35)`, transform: `translateY(${-8 * lift}px)`, fontSize: 13 }}>
      <div style={{ position: 'absolute', left: -6, top: 16, height: 22, padding: '0 12px 0 16px', display: 'flex', alignItems: 'center', background: CAT[cat], color: '#fff', fontSize: 11.5, fontWeight: 600, borderRadius: '2px 4px 4px 0' }}>{cat}</div>
      <div style={{ position: 'absolute', right: 12, top: 18 }}>{IC.vdots()}</div>
      <div style={{ position: 'absolute', left: 20, right: 18, top: 52 }}>
        <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>{name}</div>
        <div style={{ display: 'flex', marginTop: 10 }}>
          <div style={{ flex: 1 }}><div style={{ fontSize: 11.5, color: C.sub }}>Duration:</div><div style={{ fontWeight: 500, marginTop: 2 }}>{dur}</div></div>
          <div style={{ width: 92 }}><div style={{ fontSize: 11.5, color: C.sub }}>Subscription Amt:</div><div style={{ fontWeight: 500, marginTop: 2 }}>₹ {amt}</div></div>
        </div>
        <div style={{ marginTop: 10 }}><Row k="Taxes:" v={`₹ ${tax}`} /><Row k="Extended Days:" v={ext} /><Row k="Pause Days:" v={pause} /></div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 52, borderTop: `1px solid ${C.line2}`, display: 'flex', alignItems: 'center', padding: '0 14px 0 18px', gap: 8 }}>
        <div style={{ display: 'flex' }}><Avatar name="Robert Fox" s={22} /><div style={{ marginLeft: -7 }}><Avatar name="Neha Singh" s={22} /></div></div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 10.5, color: C.faint }}>Active Users</div><div style={{ fontSize: 12.5, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{Math.round(n * users)}</div></div>
        <Btn h={28} kind="soft" style={{ fontSize: 12 }}>View Plan</Btn>
      </div>
    </div>
  )
}
export const Plans = memo(function Plans({ hover = -1, lift = 0, users = 1 }) {
  return (
    <Shell active="Plans" h={PL.h}>
      <Abs x={320} y={100} style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>Plans</Abs>
      <Abs x={320} y={150} style={{ display: 'flex', gap: 28, fontSize: 14.5, height: 40, alignItems: 'center', borderBottom: `1px solid ${C.line}`, paddingRight: 12 }}>
        <span style={{ color: C.primary, fontWeight: 500, boxShadow: `0 2px 0 ${C.primary}`, height: 40, display: 'flex', alignItems: 'center', padding: '0 12px', marginBottom: -1 }}>Active Plans</span>
        <span style={{ color: C.sub }}>Deleted Plans</span>
      </Abs>
      <Abs x={868} y={150} style={{ display: 'flex', gap: 10 }}>
        <Btn kind="ghost" h={38} style={{ width: 120, justifyContent: 'space-between' }}>All{IC.chev(C.t2, 14)}</Btn>
        <Btn kind="ghost" h={38}>{IC.filter()}Filter</Btn>
        <Btn kind="ghost" h={38}>{IC.plus(C.t2)}Add Category</Btn>
        <Btn h={38}>{IC.plus()}Add Plan</Btn>
      </Abs>
      {PLANS.map((p, i) => {
        const c = PL.cardAt(i)
        return (
          <Abs key={p[1]} x={c.x} y={c.y} style={{ zIndex: i === hover ? 2 : 1 }}>
            <PlanCard p={p} lift={i === hover ? lift : 0} users={i === hover ? users : 1} />
          </Abs>
        )
      })}
    </Shell>
  )
})

// ------------------------------------------------------------------------------------- Staff
const STAFF = [
  [2314, 'Anukriti Mishra', '+91 98450 60127', 'anukriti.mishra@puls…', 'Permanent', 'Gym Manager'],
  [2789, 'Shikhar Tiwari', '+91 78798 63288', 'shikhar.tiwari@pulsefit.in', 'Permanent', 'Assistant Manager'],
  [3051, 'Apurva Jha', '+91 99021 87450', 'apurva.jha@pulsefit.in', 'Freelancer', 'Personal Trainer'],
  [3168, 'Ritesh Jha', '+91 90876 21094', 'ritesh.jha@pulsefit.in', 'Consultant', 'Gym Consultant'],
  [3294, 'Abhishek Menon', '+91 80455 34760', 'abhishek.menon@pu…', 'Permanent', 'Gym Manager'],
  [3407, 'Farida Sheikh', '+91 97411 09832', 'farida.sheikh@pulsefi…', 'Permanent', 'Housekeeping'],
  [3512, 'Sneha Kulkarni', '+91 93450 55018', 'sneha.kulkarni@puls…', 'Freelancer', 'Personal Trainer'],
  [3688, 'Vikram Rao', '+91 76690 71243', 'vikram.rao@pulsefit.in', 'Consultant', 'Gym Consultant'],
]
export const ST = { w: 1440, h: 860 }
export const Staff = memo(function Staff() {
  return (
    <Shell active="Staff" h={ST.h}>
      <TableCard
        x={320} y={124} w={1056} h={680} cols="56px 76px 168px 88px 168px 218px 134px 148px"
        head={['ID', 'Employee', 'Action', 'Contact', 'Email', 'Employment Type', 'Designation']}
        rows={STAFF}
        renderRow={([id, n, ph, em, ty, de]) => (
          <>
            <span>{id}</span>
            <span style={{ fontWeight: 500, color: C.ink }}>{n}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 10 }}>{IC.dots()}{IC.pencil()}</span>
            <span>{ph}</span>
            <span>{em}</span>
            <span><Chip fg={TYPE[ty][0]} bg={TYPE[ty][1]} w={92}>{ty}</Chip></span>
            <span>{de}</span>
          </>
        )}
      />
    </Shell>
  )
})

// ----------------------------------------------------------------------------------- Workouts
const LEVEL = { Beginner: ['#139B55', '#E3F6EC'], Intermediate: ['#C27410', '#FFF1DA'], Advance: ['#D6383F', '#FFE3E3'] }
const GOAL = { 'Weight Loss': ['#3B5BDB', '#E5EBFF'], 'Weight Gain': ['#D2491E', '#FFE9E1'], 'Muscle Gain': ['#C2255C', '#FFE3EF'], 'Strength Training': ['#0C8599', '#DDF6FA'], 'Cardio Health': ['#D6383F', '#FFE3E3'] }
const WORKOUTS = [['Beginner', 'Weight Loss'], ['Intermediate', 'Weight Gain'], ['Advance', 'Muscle Gain'], ['Beginner', 'Strength Training'], ['Beginner', 'Strength Training'], ['Advance', 'Weight Loss'], ['Intermediate', 'Cardio Health'], ['Intermediate', 'Weight Gain']]
export const WO = { w: 1440, h: 760 }
export const Workouts = memo(function Workouts() {
  return (
    <Shell active="Workouts" h={WO.h} sub={[['Add Workout'], ['Workout List', true], ['Add Exercise']]}>
      <Abs x={320} y={108} style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em' }}>Workout Plan</Abs>
      <Abs x={1100} y={104} style={{ display: 'flex', gap: 10 }}><Btn kind="ghost" h={38}>{IC.filter()}Filter</Btn><Btn h={38}>{IC.plus()}Add Workout Plan</Btn></Abs>
      {WORKOUTS.map(([lvl, goal], i) => (
        <div key={i} style={card({ left: 320 + (i % 4) * 269, top: 168 + Math.floor(i / 4) * 254, width: 249, height: 236, padding: 18 })}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><Chip fg={LEVEL[lvl][0]} bg={LEVEL[lvl][1]}>{lvl}</Chip>{IC.vdots()}</div>
          <div style={{ fontSize: 16.5, fontWeight: 600, marginTop: 12, letterSpacing: '-0.01em' }}>{goal}</div>
          <div style={{ fontSize: 12, color: C.t2, marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>Goals:<Chip fg={GOAL[goal][0]} bg={GOAL[goal][1]} h={20} style={{ fontSize: 11 }}>{goal}</Chip></div>
          <div style={{ display: 'flex', marginTop: 14, fontSize: 12 }}>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 500 }}>Active Days</div><div style={{ display: 'flex', alignItems: 'center', gap: 5, color: C.sub, marginTop: 3 }}>{IC.calSmall()}6 days/ week</div></div>
            <div style={{ width: 80 }}><div style={{ fontWeight: 500 }}>Duration</div><div style={{ color: C.sub, marginTop: 3 }}>2 Months</div></div>
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 50, borderTop: `1px solid ${C.line2}`, display: 'flex', alignItems: 'center', padding: '0 14px 0 18px', gap: 8 }}>
            <div style={{ display: 'flex' }}><Avatar name="Apurva Jha" s={22} /><div style={{ marginLeft: -7 }}><Avatar name="Sneha Kulkarni" s={22} /></div></div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 10.5, color: C.faint }}>Active Users</div><div style={{ fontSize: 12.5, fontWeight: 600 }}>50</div></div>
            <Btn h={28} kind="soft" style={{ fontSize: 12 }}>View{IC.chevR(C.primary, 12)}</Btn>
          </div>
        </div>
      ))}
      <Abs x={320} y={690} w={1056} style={{ display: 'flex', justifyContent: 'center', gap: 6, fontSize: 12.5 }}>
        <span style={{ color: C.faint, marginRight: 4 }}>Prev</span>
        {['1', '2', '3', '…', '10'].map((p) => <span key={p} style={{ minWidth: 26, height: 26, borderRadius: 6, display: 'grid', placeItems: 'center', background: p === '1' ? C.primary : '#EBEDF2', color: p === '1' ? '#fff' : C.t2 }}>{p}</span>)}
        <span style={{ fontWeight: 600, marginLeft: 4 }}>Next</span>
      </Abs>
    </Shell>
  )
})

// ------------------------------------------------------------------------------ Add Equipment
export const EQ = { w: 1440, h: 1000 }
const Field = ({ label, w = 300, children, h = 40 }) => (
  <div style={{ marginTop: 14 }}>
    <div style={{ fontSize: 12.5, color: C.t2, marginBottom: 6 }}>{label}</div>
    <div style={{ width: w, height: h, borderRadius: 8, boxShadow: `inset 0 0 0 1px #CDD1DB`, display: 'flex', alignItems: 'center', padding: '0 12px', boxSizing: 'border-box', fontSize: 13, color: C.faint, justifyContent: 'space-between' }}>{children}</div>
  </div>
)
const Section = ({ y, h, title, children }) => (
  <div style={card({ left: 566, top: y, width: 810, height: h, overflow: 'hidden' })}>
    <div style={{ height: 52, display: 'flex', alignItems: 'center', padding: '0 28px', background: '#FAFAFC', borderBottom: `1px solid ${C.line}`, fontSize: 15, fontWeight: 600 }}>{title}<span style={{ color: C.red, marginLeft: 2 }}>*</span></div>
    <div style={{ padding: '4px 40px' }}>{children}</div>
  </div>
)
export const Equipment = memo(function Equipment() {
  return (
    <Shell active="Equipments" h={EQ.h}>
      <div style={card({ left: 320, top: 100, width: 230, height: 300, padding: 22 })}>
        <div style={{ fontSize: 17, fontWeight: 600 }}>Add Equipment</div>
        <div style={{ fontSize: 11.5, color: C.sub, marginTop: 6 }}>Follow these steps to add equipment</div>
        {['Equipment Info', 'Purchase Details', 'Invoice', 'Repair Schedule'].map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 34, marginTop: i ? 0 : 16, fontSize: 12.5, color: i ? C.sub : C.ink }}>
            <span style={{ width: 14, height: 14, borderRadius: 7, boxSizing: 'border-box', border: `1.5px solid ${i ? '#B9BECB' : C.primary}`, display: 'grid', placeItems: 'center' }}>{!i && <span style={{ width: 6, height: 6, borderRadius: 3, background: C.primary }} />}</span>{s}
          </div>
        ))}
      </div>
      <Abs x={566} y={96} style={{ fontSize: 18, fontWeight: 600 }}>Equipment</Abs>
      <Section y={132} h={258} title="Equipment Info">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}><Field label="Category">{IC.chev(C.t2)}</Field><span style={{ width: 30, height: 30, borderRadius: 15, background: C.primary, display: 'grid', placeItems: 'center', marginBottom: 5 }}>{IC.plus('#fff', 16)}</span></div>
        <Field label="Model Name"><i>Enter model name</i></Field>
        <div style={{ marginTop: 14, fontSize: 12.5, color: C.t2 }}>Quantity</div>
        <div style={{ display: 'flex', marginTop: 6, width: 150, height: 32, borderRadius: 8, boxShadow: `inset 0 0 0 1px #CDD1DB`, overflow: 'hidden', fontSize: 13 }}><span style={{ width: 36, display: 'grid', placeItems: 'center', background: '#F1F2F6' }}>−</span><span style={{ flex: 1, display: 'grid', placeItems: 'center' }}>1</span><span style={{ width: 36, display: 'grid', placeItems: 'center', background: '#F1F2F6' }}>+</span></div>
      </Section>
      <Section y={406} h={210} title="Purchase Details">
        <Field label="Date of Purchase">{IC.calSmall(C.t2, 16)}</Field>
        <Field label="Cost of Purchase"><span style={{ color: C.t2 }}>INR (₹)</span></Field>
      </Section>
      <Section y={632} h={150} title="Invoice">
        <div style={{ fontSize: 12.5, color: C.t2, marginTop: 14 }}>Upload Invoice</div>
        <div style={{ marginTop: 8, height: 40, borderRadius: 8, border: '1.5px dashed #C3C8D4', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13, color: C.t2 }}><span style={{ width: 20, height: 20, borderRadius: 10, background: C.primary, display: 'grid', placeItems: 'center' }}>{IC.plus('#fff', 12)}</span>Add Files</div>
      </Section>
      <Section y={798} h={230} title="Repair Schedule">
        <div style={{ fontSize: 12.5, color: C.t2, marginTop: 14 }}>Repair Reminder:</div>
        <div style={{ display: 'flex', gap: 18, marginTop: 8, fontSize: 12.5, color: C.t2 }}>
          {['Dashboard', 'SMS', 'Email'].map((s, i) => <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Box on={!i} />{s}</span>)}
        </div>
        <div style={{ fontSize: 12.5, color: C.t2, marginTop: 16 }}>Frequency:</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8, fontSize: 12.5 }}><Chip fg={C.primary} bg={C.pSoft} h={28}>Monthly</Chip><Chip fg={C.t2} bg="#F1F2F6" h={28}>Yearly</Chip></div>
      </Section>
    </Shell>
  )
})

