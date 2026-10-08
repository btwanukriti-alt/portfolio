import type { ReactNode } from 'react'

// College ERP components rebuilt for the bento page. Each one fills its bento card, so nothing here
// draws its own card background. Every figure is sample data from the design.

const ink = 'text-[#101828]'
const sub = 'text-[#667085]'
const OK = '#12805C'
const WARN = '#D9910A'
const BAD = '#D92D20'
const tone = (p: number) => (p >= 80 ? OK : p >= 70 ? WARN : BAD)
const chipCls = (p: number) => (p >= 80 ? 'bg-[#E3F5EC] text-[#12805C]' : p >= 70 ? 'bg-[#FDF1D8] text-[#A15C07]' : 'bg-[#FDE8E6] text-[#B42318]')
const pct = (r: number, e: number) => Math.round((r / e) * 1000) / 10

function Head({ title, note, right }: { title: string; note?: string; right?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h4 className={`m-0 text-[clamp(16px,1.3vw,20px)] font-semibold tracking-[-0.01em] ${ink}`}>{title}</h4>
        {note && <p className={`m-0 mt-1 text-[13px] ${sub}`}>{note}</p>}
      </div>
      {right}
    </div>
  )
}

function Chip({ p }: { p: number }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold tabular-nums ${chipCls(p)}`}>
      <i className="size-1.5 rounded-full bg-current" />
      {p.toFixed(1)}%
    </span>
  )
}

// Received against expected, with a black tick at the 80% target.
function TargetBar({ p }: { p: number }) {
  return (
    <span className="relative block h-2 rounded-full bg-[#E6E9EF]">
      <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${Math.min(p, 100)}%`, background: tone(p) }} />
      <span className="absolute -top-1 -bottom-1 w-[2px] rounded-full bg-[#344054]" style={{ left: '80%' }} />
    </span>
  )
}

function Warn({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-5 shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path d="M12 3l10 18H2z" />
      <path d="M12 10v5M12 18v.1" />
    </svg>
  )
}

// The four levels as they stack: each drawer opens over the last, offset like the spines.
export function DrillPath() {
  const levels: [string, string, string, number][] = [
    ['Group', 'All 5 colleges', '₹80.55 Cr', 71.9],
    ['College', 'Engineering College', '₹28.50 Cr', 83.8],
    ['Programme', 'B.Tech', '₹15.00 Cr', 75.0],
    ['Batch', 'Batch 2029', '₹2.80 Cr', 56.0],
  ]
  const shades = ['#D5DDED', '#E3E9F5', '#EEF2FA', '#FFFFFF']
  return (
    <div className="flex h-full flex-col">
      <Head title="Four levels, one path" note="Each drawer opens over the last" />
      <div className="mt-5 flex flex-1 flex-col justify-center gap-2.5">
        {levels.map(([level, name, value, p], i) => (
          <div
            key={level}
            className="flex items-center justify-between gap-3 rounded-[16px] px-4 py-3 shadow-[0_8px_20px_-14px_rgba(16,24,40,0.3)]"
            style={{ marginLeft: `${i * 7}%`, background: shades[i] }}
          >
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="text-[11px] font-semibold tracking-[0.08em] text-[#12326E] uppercase">{level}</span>
              <span className={`truncate text-[14px] font-semibold ${ink}`}>{name}</span>
            </span>
            <span className="flex items-center gap-2.5">
              <span className={`hidden text-[13px] tabular-nums min-[1101px]:inline ${sub}`}>{value}</span>
              <Chip p={p} />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BatchTable() {
  const rows: [string, number, number][] = [
    ['Batch 2029', 2.8, 5],
    ['Batch 2028', 3.6, 5],
    ['Batch 2027', 4.0, 5],
    ['Batch 2026', 4.6, 5],
  ]
  return (
    <div className="flex h-full flex-col">
      <Head
        title="B.Tech, by batch"
        note="Same columns as the group and college levels"
        right={<span className="text-[13px] font-medium text-[#12326E]">Fee breakdown</span>}
      />
      <div className="mt-5 flex flex-1 flex-col justify-center">
        <div className={`grid grid-cols-[1.1fr_1.6fr_0.8fr_0.8fr] gap-4 border-b border-[#DDE1E8] pb-2.5 text-[12px] font-medium ${sub}`}>
          <span>Batch</span>
          <span>Received vs expected</span>
          <span className="text-right">Collection</span>
          <span className="text-right">Gap to 80%</span>
        </div>
        {rows.map(([name, r, e]) => {
          const p = pct(r, e)
          const gap = p - 80
          return (
            <div key={name} className="grid grid-cols-[1.1fr_1.6fr_0.8fr_0.8fr] items-center gap-4 border-b border-[#E6E9EF] py-3.5 last:border-0">
              <span className="flex items-center gap-2.5">
                <i className="h-6 w-1 rounded-full" style={{ background: tone(p) }} />
                <span className={`text-[14px] font-semibold ${ink}`}>{name}</span>
              </span>
              <span className="flex flex-col gap-1.5">
                <TargetBar p={p} />
                <span className={`text-[11px] tabular-nums ${sub}`}>
                  ₹{r.toFixed(2)} Cr of ₹{e.toFixed(2)} Cr
                </span>
              </span>
              <span className="text-right">
                <Chip p={p} />
              </span>
              <span className="text-right text-[14px] font-semibold tabular-nums" style={{ color: gap >= 0 ? OK : BAD }}>
                {gap >= 0 ? '+' : '−'}
                {Math.abs(gap).toFixed(1)} pts
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// The lowest-collection line, as it reads at each level.
export function LowestLine() {
  const lines: [string, string, string][] = [
    ['Group', 'Science College is lowest at 55.9%', '₹7.50 Cr pending · 24.1 pts below target'],
    ['College', 'Lowest collection · B.Tech', '₹5.00 Cr pending · 5.0 pts below target'],
    ['Programme', 'Lowest collection · Batch 2029', '₹2.20 Cr pending · 24.0 pts below target'],
  ]
  return (
    <div className="flex h-full flex-col">
      <Head title="The weakest row, named" note="The same line opens every level" />
      <div className="mt-5 flex flex-1 flex-col justify-center gap-3">
        {lines.map(([level, title, detail], i) => (
          <div
            key={level}
            className={`flex items-start gap-3 rounded-[16px] bg-white p-4 shadow-[0_8px_20px_-14px_rgba(16,24,40,0.3)] ${i === 0 ? 'ring-1 ring-[#F7C9C4]' : ''}`}
          >
            <Warn className={i === 0 ? 'text-[#D92D20]' : 'text-[#D9910A]'} />
            <span className="flex min-w-0 flex-col gap-0.5 leading-snug">
              <span className="text-[11px] font-semibold tracking-[0.08em] text-[#12326E] uppercase">{level}</span>
              <span className={`text-[14px] font-semibold ${ink}`}>{title}</span>
              <span className={`text-[12px] tabular-nums ${sub}`}>{detail}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Dark surface: the bento card supplies the navy, this fills it. Wide layout: figure and bar on
// top, the four stats in one row below.
export function Target() {
  const stats: [string, string][] = [
    ['Pending', '₹31.45 Cr'],
    ['Fines collected', '₹12.40 Cr'],
    ['Colleges', '5'],
    ['Behind target', '−8.1 pts'],
  ]
  return (
    <div className="flex h-full flex-col justify-between gap-8 text-white">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
        <div>
          <p className="m-0 text-[12px] font-semibold tracking-[0.1em] text-white/60 uppercase">Total received</p>
          <p className="m-0 mt-2 text-[clamp(34px,3.4vw,52px)] leading-none font-semibold tracking-[-0.02em] tabular-nums">₹80.55 Cr</p>
        </div>
        <p className="m-0 text-[14px] text-white/70 tabular-nums">of ₹112.00 Cr expected · 71.9% collected</p>
      </div>
      <div>
        <div className="relative h-2.5 rounded-full bg-white/15">
          <span className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#4F86E8,#5FD3B0)]" style={{ width: '71.9%' }} />
          <span className="absolute -top-1.5 -bottom-1.5 w-[2px] rounded-full bg-white" style={{ left: '80%' }} />
        </div>
        <div className="mt-2 flex text-[12px] text-white/60">
          <span>₹0</span>
          <span className="mr-[14%] ml-auto">Target 80%</span>
          <span>₹112 Cr</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/15 pt-5 min-[701px]:grid-cols-4">
        {stats.map(([label, value]) => (
          <span key={label} className="flex flex-col gap-1">
            <span className="text-[12px] text-white/60">{label}</span>
            <span className="text-[18px] font-semibold tabular-nums">{value}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// Each college's collection against the 80% target, lowest first, with the gap spelled out.
export function Ranked() {
  const rows: [string, number, number][] = [
    ['Science', 9.5, 17.0],
    ['Law', 14.0, 21.0],
    ['Arts & Mgmt', 12.55, 18.0],
    ['Medical', 16.0, 22.0],
    ['Engineering', 28.5, 34.0],
  ]
  return (
    <div className="flex h-full flex-col">
      <Head
        title="Collection by college"
        note="Lowest first. The tick is the 80% target."
        right={<span className="rounded-full bg-[#FDE8E6] px-3 py-1 text-[12px] font-semibold text-[#B42318]">4 of 5 below target</span>}
      />
      <div className="mt-6 flex flex-col gap-4">
        {rows.map(([name, r, e]) => {
          const p = pct(r, e)
          const gap = p - 80
          return (
            <div key={name} className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_3.5rem_4.5rem] items-center gap-4">
              <span className={`truncate text-[14px] font-semibold ${ink}`}>{name}</span>
              <TargetBar p={p} />
              <span className={`text-right text-[14px] font-semibold tabular-nums ${ink}`}>{p.toFixed(1)}%</span>
              <span className="text-right text-[13px] font-semibold tabular-nums" style={{ color: gap >= 0 ? OK : BAD }}>
                {gap >= 0 ? '+' : '−'}
                {Math.abs(gap).toFixed(1)} pts
              </span>
            </div>
          )
        })}
      </div>
      <div className="mt-auto flex items-center justify-between gap-4 border-t border-[#E6E9EF] pt-5">
        <span className={`text-[13px] ${sub}`}>Group, all 5 colleges</span>
        <span className="flex items-center gap-3">
          <span className={`text-[14px] font-semibold tabular-nums ${ink}`}>71.9%</span>
          <span className="text-[13px] font-semibold tabular-nums" style={{ color: BAD }}>
            −8.1 pts
          </span>
        </span>
      </div>
    </div>
  )
}

// Cumulative collection against the fee schedule, April to December.
export function Schedule() {
  const W = 420
  const H = 200
  const L = 30
  const R = 8
  const T = 12
  const B = 26
  const max = 120
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const received = [14, 27, 38, 47, 55, 63, 70, 76, 80.55]
  const due = [20, 36, 52, 68, 80, 92, 102, 108, 112]
  const x = (i: number) => L + (i * (W - L - R)) / 8
  const y = (v: number) => T + (1 - v / max) * (H - T - B)
  const line = (a: number[]) => a.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join('')
  return (
    <div className="flex h-full flex-col">
      <Head title="Collection against schedule" note="Cumulative, ₹ Cr" />
      <div className={`mt-3 flex gap-4 text-[12px] ${sub}`}>
        <span className="flex items-center gap-1.5">
          <i className="h-[3px] w-4 rounded-full bg-[#12326E]" />
          Received
        </span>
        <span className="flex items-center gap-1.5">
          <i className="h-0 w-4 border-t-2 border-dashed border-[#98A2B3]" />
          Due
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 block w-full" role="img" aria-label="Received ₹80.55 Cr by December against ₹112 Cr due">
        <defs>
          <linearGradient id="college-schedule" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#4F86E8" stopOpacity=".28" />
            <stop offset="1" stopColor="#4F86E8" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 40, 80, 120].map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="#E6E9EF" />
            <text x={L - 6} y={y(v) + 4} textAnchor="end" fontSize="10" fill="#667085">
              {v}
            </text>
          </g>
        ))}
        {months.map((m, i) => (
          <text key={m} x={x(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#667085">
            {m}
          </text>
        ))}
        <path d={`${line(received)}L${x(8)} ${y(0)}L${x(0)} ${y(0)}Z`} fill="url(#college-schedule)" />
        <path d={line(due)} fill="none" stroke="#98A2B3" strokeWidth="1.6" strokeDasharray="4 4" />
        <path d={line(received)} fill="none" stroke="#12326E" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={x(8)} cy={y(80.55)} r="4.5" fill="#12326E" stroke="#fff" strokeWidth="2" />
        <text x={x(8) - 8} y={y(80.55) + 18} textAnchor="end" fontSize="11" fontWeight="700" fill="#12326E">
          ₹80.55 Cr
        </text>
        <text x={x(8) - 8} y={y(112) - 6} textAnchor="end" fontSize="10" fill="#667085">
          Due by Dec ₹112 Cr
        </text>
      </svg>
    </div>
  )
}

export function Attendance() {
  const rows: [string, number, number, number][] = [
    ['Engineering', 512, 28, 31],
    ['Medical', 231, 10, 17],
    ['Arts & Mgmt', 148, 7, 11],
    ['Science', 130, 6, 12],
    ['Law', 94, 5, 8],
  ]
  const legend: [string, string][] = [
    ['Present', OK],
    ['Absent', BAD],
    ['On leave', '#F2B53A'],
  ]
  return (
    <div className="flex h-full flex-col">
      <Head title="Staff attendance today" note="Share of staff present, by college" />
      <div className="mt-6 flex flex-col gap-4">
        {rows.map(([name, present, absent, leave]) => {
          const t = present + absent + leave
          return (
            <div key={name} className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_3.5rem] items-center gap-4">
              <span className={`truncate text-[14px] font-semibold ${ink}`}>{name}</span>
              <span className="flex h-2.5 gap-[3px]">
                <i className="rounded-full" style={{ width: `${(present / t) * 100}%`, background: OK }} />
                <i className="rounded-full" style={{ width: `${(absent / t) * 100}%`, background: BAD }} />
                <i className="rounded-full" style={{ width: `${(leave / t) * 100}%`, background: '#F2B53A' }} />
              </span>
              <span className={`text-right text-[14px] font-semibold tabular-nums ${ink}`}>{((present / t) * 100).toFixed(1)}%</span>
            </div>
          )
        })}
      </div>
      <div className={`mt-auto flex gap-4 pt-6 text-[12px] ${sub}`}>
        {legend.map(([l, c]) => (
          <span key={l} className="flex items-center gap-1.5">
            <i className="size-2 rounded-full" style={{ background: c }} />
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Alerts() {
  const alerts: [string, 'bad' | 'warn', string, string][] = [
    ['Receipt cancelled', 'bad', 'Receipt #RCP-08432', 'Incorrect amount · ₹11,000 · Engineering'],
    ['Fee updated', 'warn', 'Concession approved', '₹20,000 to ₹17,000 · Engineering'],
    ['Receipt cancelled', 'bad', 'Receipt #RCP-08433', 'Duplicate entry · Law'],
  ]
  return (
    <div className="flex h-full flex-col">
      <Head
        title="Finance alerts"
        note="Receipts and fee changes to review"
        right={
          <span className="flex rounded-full bg-[#E4E7EE] p-1 text-[12px] font-medium">
            <span className={`rounded-full bg-white px-3 py-1 shadow-[0_1px_3px_rgba(16,24,40,0.08)] ${ink}`}>All</span>
            <span className={`px-3 py-1 ${sub}`}>Unread</span>
          </span>
        }
      />
      <div className="mt-6 flex flex-col gap-2.5">
        {alerts.map(([tag, t, title, detail]) => (
          <div key={title} className="flex items-center justify-between gap-4 rounded-[16px] bg-white px-4 py-3 shadow-[0_8px_20px_-14px_rgba(16,24,40,0.3)]">
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className={`text-[14px] font-semibold ${ink}`}>{title}</span>
              <span className={`truncate text-[12px] tabular-nums ${sub}`}>{detail}</span>
            </span>
            <span
              className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${t === 'bad' ? 'bg-[#FDE8E6] text-[#B42318]' : 'bg-[#FDF1D8] text-[#A15C07]'}`}
            >
              {tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const COLLEGE_BLOCKS: Record<string, () => ReactNode> = {
  'drill-path': DrillPath,
  'batch-table': BatchTable,
  'lowest-line': LowestLine,
  target: Target,
  ranked: Ranked,
  schedule: Schedule,
  attendance: Attendance,
  alerts: Alerts,
}
