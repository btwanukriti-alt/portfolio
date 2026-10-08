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

// The employee attendance register: status tabs with counts, and one row per person.
export function AttendanceTable() {
  const tabs: [string, number, string][] = [
    ['All', 1000, 'bg-[#344054] text-white'],
    ['Present', 800, 'bg-[#12805C] text-white'],
    ['Absent', 80, 'bg-[#B42318] text-white'],
    ['On leave', 120, 'bg-[#F2B53A] text-white'],
    ['Late', 2, 'bg-[#FDE8E6] text-[#B42318]'],
    ['Early check-out', 4, 'bg-[#FDF1D8] text-[#A15C07]'],
  ]
  const division: Record<string, string> = {
    Teaching: 'bg-[#E6EDF9] text-[#12326E]',
    'Non-teaching': 'bg-[#FDE8E6] text-[#B42318]',
    Management: 'bg-[#FDF1D8] text-[#A15C07]',
  }
  type Row = [string, string, string, string, string, string | null, string | null, string, boolean?, boolean?]
  const rows: Row[] = [
    ['Aarav Patel', 'Professor', 'Teaching', 'Computer Science', 'EMP-1012', '08:50 AM', '05:00 PM', 'Present'],
    ['Neha Rao', 'Lab Assistant', 'Non-teaching', 'Chemistry Lab', 'EMP-1047', '08:50 AM', '04:00 PM', 'Present', false, true],
    ['Vikram Shah', 'Admin', 'Management', 'AI/ML', 'EMP-1103', null, null, 'Absent'],
    ['Priya Menon', 'Professor', 'Teaching', 'Mechanical', 'EMP-1121', '10:50 AM', '05:00 PM', 'Present', true],
    ['Rohan Iyer', 'Professor', 'Teaching', 'CSE', 'EMP-1158', null, null, 'On leave (CL)'],
  ]
  const time = (t: string, flag?: boolean) => (
    <span className={`rounded-md px-2 py-1 text-[12px] font-medium tabular-nums ${flag ? 'bg-[#FDE8E6] text-[#B42318]' : 'bg-[#E6EDF9] text-[#12326E]'}`}>
      {t}
    </span>
  )
  return (
    <div className="flex h-full flex-col">
      <Head title="Employee attendance" note="Engineering College · today" />
      <div className="mt-5 flex gap-1 overflow-x-auto border-b border-[#E6E9EF] pb-3">
        {tabs.map(([label, n, cls], i) => (
          <span
            key={label}
            className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[13px] ${i === 0 ? `bg-[#F2F4F7] font-semibold ${ink}` : sub}`}
          >
            {label}
            <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${cls}`}>{n.toLocaleString('en-IN')}</span>
          </span>
        ))}
      </div>
      <div className="mt-3 overflow-x-auto">
        <div className="min-w-[760px]">
          <div className={`grid grid-cols-[1.5fr_1fr_1.3fr_0.9fr_0.9fr_1fr] gap-4 px-3 py-2.5 text-[12px] font-medium ${sub}`}>
            <span>Name</span>
            <span>Division</span>
            <span>Department</span>
            <span>Check in</span>
            <span>Check out</span>
            <span className="text-right">Status</span>
          </div>
          {rows.map(([name, role, div, dept, id, cin, cout, status, late, early]) => (
            <div key={id} className="grid grid-cols-[1.5fr_1fr_1.3fr_0.9fr_0.9fr_1fr] items-center gap-4 border-t border-[#EEF0F4] px-3 py-3">
              <span className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#E6EDF9] text-[12px] font-semibold text-[#12326E]">
                  {name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')}
                </span>
                <span className="flex min-w-0 flex-col leading-tight">
                  <span className={`truncate text-[14px] font-semibold ${ink}`}>{name}</span>
                  <span className={`text-[12px] ${sub}`}>{role}</span>
                </span>
              </span>
              <span>
                <span className={`rounded-md px-2 py-1 text-[12px] font-medium ${division[div]}`}>{div}</span>
              </span>
              <span className="flex flex-col leading-tight">
                <span className={`text-[13px] ${ink}`}>Engineering College</span>
                <span className={`text-[12px] ${sub}`}>{dept}</span>
              </span>
              {cin && cout ? (
                <>
                  <span>{time(cin, late)}</span>
                  <span>{time(cout, early)}</span>
                  <span className="text-right">
                    <span className="rounded-md bg-[#E3F5EC] px-2 py-1 text-[12px] font-semibold text-[#12805C]">{status}</span>
                  </span>
                </>
              ) : (
                <span
                  className={`col-span-3 rounded-md px-3 py-1.5 text-right text-[12px] font-semibold ${
                    status === 'Absent'
                      ? 'bg-[linear-gradient(90deg,transparent,#FDE8E6)] text-[#B42318]'
                      : 'bg-[linear-gradient(90deg,transparent,#FDF1D8)] text-[#A15C07]'
                  }`}
                >
                  {status}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// One employee's record: identity on top, tabs, then work experience and education.
export function Profile() {
  const tabs = ['Identity', 'Background & credentials', 'Research', 'Workshops & FDP', 'Achievements']
  const work: [string, string, string][] = [
    ['Professor', 'State University of Technology', 'May 2023 – present'],
    ['Assistant Professor', 'State University of Technology', 'May 2020 – Jul 2023'],
    ['Lecturer', 'City Engineering College', 'May 2019 – Jul 2020'],
  ]
  const edu: [string, string, string][] = [
    ['PhD, Electronics and Communication', 'National Institute of Science', '2020 – 2022'],
    ['BE, Electronics and Communication', 'National Institute of Science', '2014 – 2017'],
    ['Higher Secondary, PCMB', 'Central PU College', '2012 – 2014'],
  ]
  const list = (title: string, items: [string, string, string][]) => (
    <div className="rounded-[18px] bg-white p-5 shadow-[0_8px_20px_-14px_rgba(16,24,40,0.3)]">
      <p className="m-0 text-[14px] font-semibold text-[#12326E]">{title}</p>
      <ol className="m-0 mt-4 flex list-none flex-col gap-4 p-0">
        {items.map(([a, b, c], i) => (
          <li key={a} className="relative flex gap-3">
            <span className="mt-1 flex flex-col items-center">
              <i className={`size-2.5 rounded-full ${i === 0 ? 'bg-[#12326E]' : 'bg-[#C7D2E6]'}`} />
              {i < items.length - 1 && <i className="mt-1 w-px flex-1 bg-[#DDE3EE]" />}
            </span>
            <span className="flex flex-col leading-snug">
              <span className={`text-[14px] font-semibold ${ink}`}>{a}</span>
              <span className={`text-[13px] ${sub}`}>{b}</span>
              <span className="text-[12px] text-[#98A2B3]">{c}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-4">
        <span className="flex size-14 items-center justify-center rounded-full bg-[#12326E] text-[18px] font-semibold text-white">MC</span>
        <span className="flex flex-col gap-1.5">
          <span className={`text-[clamp(18px,1.6vw,24px)] font-semibold tracking-[-0.01em] ${ink}`}>Mireya Conner</span>
          <span className="flex flex-wrap gap-2 text-[12px]">
            <span className={`rounded-full bg-white px-2.5 py-1 ${sub}`}>
              Employee ID <b className={`font-semibold ${ink}`}>EMP-101234</b>
            </span>
            <span className={`rounded-full bg-white px-2.5 py-1 ${sub}`}>
              Professor <b className={`font-semibold ${ink}`}>· ECE</b>
            </span>
          </span>
        </span>
      </div>
      <div className="mt-5 flex gap-5 overflow-x-auto border-b border-[#CBD5E6] text-[13px]">
        {tabs.map((t, i) => (
          <span key={t} className={`shrink-0 pb-2.5 ${i === 1 ? `border-b-2 border-[#12326E] font-semibold ${ink}` : sub}`}>
            {t}
          </span>
        ))}
      </div>
      <div className="mt-5 grid flex-1 grid-cols-1 gap-3 min-[701px]:grid-cols-2">
        {list('Work experience', work)}
        {list('Education', edu)}
      </div>
    </div>
  )
}

export const COLLEGE_BLOCKS: Record<string, () => ReactNode> = {
  'drill-path': DrillPath,
  'batch-table': BatchTable,
  'lowest-line': LowestLine,
  target: Target,
  'attendance-table': AttendanceTable,
  profile: Profile,
}
