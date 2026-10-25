import type { ReactNode } from 'react'

// Zync components rebuilt for the bento page. Each one fills its bento card: the card is the
// component's surface, so nothing here draws its own card background. Every figure is sample data
// from the design.

const ink = 'text-[#12101C]'
const sub = 'text-[#6B6880]'

function Head({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h4 className={`m-0 text-[clamp(17px,1.4vw,22px)] font-semibold tracking-[-0.01em] ${ink}`}>{title}</h4>
      {right}
    </div>
  )
}

function Toggle({ items, active = 0 }: { items: [string, string]; active?: 0 | 1 }) {
  return (
    <div className="flex rounded-full bg-[#E4E4EC] p-1 text-[13px] font-medium">
      {items.map((item, i) => (
        <span
          key={item}
          className={i === active ? `rounded-full bg-white px-3.5 py-1.5 shadow-[0_1px_3px_rgba(18,16,28,0.08)] ${ink}` : `px-3.5 py-1.5 ${sub}`}
        >
          {item}
        </span>
      ))}
    </div>
  )
}

// A ring of coloured arcs, each with a small gap, on a light track.
function Ring({
  parts,
  total,
  size = 200,
  stroke = 18,
  children,
}: {
  parts: [number, string][]
  total: number
  size?: number
  stroke?: number
  children: ReactNode
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const arcs = parts.map(([value, color], i) => ({
    color,
    len: (value / total) * c,
    start: parts.slice(0, i).reduce((sum, [v]) => sum + (v / total) * c, 0),
  }))
  return (
    <div className="relative mx-auto aspect-square w-full" style={{ maxWidth: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="block h-full w-full -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E2E2EB" strokeWidth={stroke} />
        {arcs.map(({ color, len, start }) => (
          <circle
            key={color + start}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${Math.max(len - stroke * 0.9, 0)} ${c}`}
            strokeDashoffset={-start}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  )
}

export function Palette() {
  const swatches: [string, string, string, string][] = [
    ['Primary', '#644ACD', '#644ACD', '#fff'],
    ['Deep', '#3E2B94', '#3E2B94', '#fff'],
    ['Accent', '#F5577D', '#F5577D', '#fff'],
    ['Blush', '#FFE8EE', '#FFE8EE', '#7A2C42'],
    ['Lilac', '#ECE8FA', '#ECE8FA', '#3E2B94'],
    ['Ink', '#12101C', '#12101C', '#fff'],
    ['Water', '#4F8BFF', '#4F8BFF', '#fff'],
    ['Sleep', '#7B3FE4', '#7B3FE4', '#fff'],
    ['Growth', '#2DC6A0', '#2DC6A0', '#06463A'],
  ]
  return (
    <div className="grid h-full grid-cols-3 gap-2.5 font-slides">
      {swatches.map(([name, hex, bg, fg]) => (
        <div key={name} className="flex min-h-[84px] flex-col justify-end rounded-[20px] p-4" style={{ background: bg, color: fg }}>
          <span className="text-[15px] font-semibold">{name}</span>
          <span className="text-[12px] opacity-80">{hex}</span>
        </div>
      ))}
    </div>
  )
}

export function Calories() {
  const parts: [string, number, string][] = [
    ['Swimming', 300, '#C46BF2'],
    ['Badminton', 300, '#F5577D'],
    ['Walking', 150, '#644ACD'],
    ['Yoga', 150, '#4F8BFF'],
  ]
  return (
    <div className="flex h-full flex-col font-slides">
      <Head title="Calories" right={<Toggle items={['Burned', 'Consumed']} />} />
      <div className="flex flex-1 items-center justify-center py-3">
        <div className="w-[min(50%,180px)]">
          <Ring parts={parts.map(([, v, c]) => [v, c] as [number, string])} total={1200}>
            <span className={`text-[clamp(28px,2.6vw,40px)] leading-none font-semibold ${ink}`}>900</span>
            <span className={`mt-1 text-[12px] ${sub}`}>of 1,200 cal</span>
            <span className="mt-2 rounded-full bg-[#ECE8FA] px-2.5 py-1 text-[11px] font-semibold text-[#644ACD]">300 to go</span>
          </Ring>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-[#DFDFE8] pt-3">
        {parts.map(([name, v, color]) => (
          <div key={name} className="flex items-center gap-2.5">
            <span className="h-7 w-1.5 rounded-full" style={{ background: color }} />
            <span className="flex flex-col leading-tight">
              <span className={`text-[14px] font-semibold ${ink}`}>{name}</span>
              <span className={`text-[12px] ${sub}`}>{v} cal</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// The Consumed side of the calorie card: 1,385 cal eaten, split by each macro's share of calories.
export function Consumed() {
  const parts: [string, string, number, string][] = [
    ['Carbs', '239 g', 68, '#2DC6A0'],
    ['Fat', '35 g', 22, '#F5B01D'],
    ['Protein', '35 g', 10, '#F5577D'],
  ]
  return (
    <div className="flex h-full flex-col font-slides">
      <Head title="Calories" right={<Toggle items={['Burned', 'Consumed']} active={1} />} />
      <div className="grid flex-1 grid-cols-1 items-center gap-8 pt-5 min-[701px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="mx-auto w-[min(70%,220px)]">
          <Ring parts={parts.map(([, , pct, c]) => [(pct / 100) * 1385, c] as [number, string])} total={2250}>
            <span className={`text-[clamp(26px,2.4vw,36px)] leading-none font-semibold ${ink}`}>1,385</span>
            <span className={`mt-1 text-[12px] ${sub}`}>of 2,250 cal</span>
            <span className="mt-2 rounded-full bg-[#FFE8EE] px-2.5 py-1 text-[11px] font-semibold text-[#D63B63]">865 left</span>
          </Ring>
        </div>
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {parts.map(([name, grams, pct, color]) => (
            <li key={name} className="flex items-center gap-4 rounded-[18px] bg-white shadow-[0_8px_24px_-14px_rgba(30,20,80,0.18)] px-4 py-3.5">
              <span className="h-8 w-1.5 rounded-full" style={{ background: color }} />
              <span className="flex flex-1 flex-col leading-tight">
                <span className={`text-[15px] font-semibold ${ink}`}>{name}</span>
                <span className={`text-[12px] ${sub}`}>{grams}</span>
              </span>
              <span className={`text-[15px] font-semibold ${ink}`}>{pct}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// A fixed pseudo-random QR pattern with the three finder squares (decorative, encodes nothing).
const QR_SIZE = 25
const QR = (() => {
  const n = QR_SIZE
  let seed = 7
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  const m = Array.from({ length: n }, () => Array.from({ length: n }, () => rand() > 0.5))
  const finder = (ox: number, oy: number) => {
    for (let y = -1; y < 8; y++)
      for (let x = -1; x < 8; x++) {
        const px = ox + x
        const py = oy + y
        if (px < 0 || py < 0 || px >= n || py >= n) continue
        const inside = x >= 0 && y >= 0 && x <= 6 && y <= 6
        m[py][px] = inside && (x === 0 || y === 0 || x === 6 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4))
      }
  }
  finder(0, 0)
  finder(n - 7, 0)
  finder(0, n - 7)
  return m
})()

function Qr() {
  const n = QR_SIZE
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className="block h-full w-full" aria-hidden="true">
      {QR.flatMap((row, y) => row.map((on, x) => (on ? <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" rx=".2" fill="#1B1830" /> : null)))}
    </svg>
  )
}

export function CheckIn() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center font-slides">
      <div className="aspect-square w-[min(58%,220px)]">
        <Qr />
      </div>
      <p className={`m-0 mt-6 text-[clamp(20px,1.8vw,26px)] font-semibold tracking-[-0.02em] ${ink}`}>Check in now</p>
      <p className={`m-0 mt-1 text-[14px] ${sub}`}>Show your QR at the desk</p>
    </div>
  )
}

export function Classes() {
  const rows: [string, string, string, number, string, 'book' | 'wait' | 'booked'][] = [
    ['12:30', 'Kick Box', 'Alex John · 60 min', 0.4, '10 spots left', 'book'],
    ['2:30', 'BodyPump', 'Alex John · 45 min', 1, 'Full · 4 waiting', 'wait'],
    ['6:00', 'TRX Training', 'Maya Rao · 60 min', 0.7, '4 spots left', 'booked'],
  ]
  return (
    <div className="flex h-full flex-col font-slides">
      <Head title="Thursday, 20 Feb" right={<span className={`text-[13px] ${sub}`}>3 classes</span>} />
      <ul className="m-0 mt-4 flex flex-1 list-none flex-col justify-between gap-3 p-0">
        {rows.map(([time, name, meta, fill, spots, state]) => (
          <li key={name} className="flex items-center gap-4 rounded-[20px] bg-white shadow-[0_8px_24px_-14px_rgba(30,20,80,0.18)] p-3 pr-5">
            <span className="flex size-14 shrink-0 flex-col items-center justify-center rounded-[14px] bg-[#F6F5FA] leading-tight">
              <span className={`text-[15px] font-semibold ${ink}`}>{time}</span>
              <span className={`text-[10px] ${sub}`}>PM</span>
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="flex items-center justify-between gap-3">
                <span className={`truncate text-[15px] font-semibold ${ink}`}>{name}</span>
                {state === 'book' && <span className="rounded-full bg-[#644ACD] px-3.5 py-1 text-[12px] font-semibold text-white">Book</span>}
                {state === 'wait' && (
                  <span className="rounded-full px-3 py-1 text-[12px] font-semibold text-[#644ACD] ring-[1.5px] ring-[#644ACD]">Join waitlist</span>
                )}
                {state === 'booked' && <span className="rounded-full bg-[#DDF6EE] px-3 py-1 text-[12px] font-semibold text-[#14946F]">✓ Booked</span>}
              </span>
              <span className={`text-[12px] ${sub}`}>{meta}</span>
              <span className="flex items-center gap-3">
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#DFDFE8]">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${fill * 100}%`,
                      background: state === 'wait' ? '#F5577D' : '#644ACD',
                    }}
                  />
                </span>
                <span className={`text-[11px] font-semibold ${ink}`}>{spots}</span>
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Hydration() {
  return (
    <div className="flex h-full flex-col font-slides">
      <Head title="Hydration" right={<span className="rounded-full bg-[#E4EEFF] px-2.5 py-1 text-[11px] font-semibold text-[#2F6BE0]">1,400 ml to go</span>} />
      <div className="flex flex-1 items-center gap-6 py-4">
        <div className="w-[44%] max-w-[170px]">
          <Ring parts={[[1600, '#4F8BFF']]} total={3000} stroke={16} size={170}>
            <span className={`text-[clamp(18px,1.6vw,24px)] leading-none font-semibold ${ink}`}>1,600 ml</span>
            <span className={`mt-1 text-[11px] ${sub}`}>of 3,000 ml</span>
          </Ring>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          {['+ 150 ml', '+ 250 ml', '+ 500 ml'].map((t, i) => (
            <span key={t} className={`rounded-full px-4 py-2 text-[13px] font-semibold ${i === 1 ? 'bg-[#4F8BFF] text-white' : 'bg-[#E4EEFF] text-[#2F6BE0]'}`}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between rounded-full bg-white shadow-[0_8px_24px_-14px_rgba(30,20,80,0.18)] p-1.5">
        <span className="flex size-10 items-center justify-center rounded-full bg-[#E4EEFF] text-[20px] text-[#4F8BFF]">−</span>
        <span className="flex flex-col items-center leading-tight">
          <span className={`text-[16px] font-semibold ${ink}`}>250 ml</span>
          <span className={`text-[11px] ${sub}`}>1 glass</span>
        </span>
        <span className="flex size-10 items-center justify-center rounded-full bg-[#4F8BFF] text-[20px] text-white">+</span>
      </div>
    </div>
  )
}

export function Plans() {
  const plans: [string, string, string?][] = [
    ['Core Plus', 'core-plus', 'Beginner'],
    ['Game Changer', 'game-changer'],
    ['Stretching', 'stretching'],
  ]
  return (
    <div className="flex h-full flex-col font-slides">
      <p className="m-0 text-[12px] font-semibold tracking-[0.1em] text-[#644ACD] uppercase">Workouts</p>
      <p className={`m-0 mt-3 max-w-[18ch] text-[clamp(26px,2.6vw,40px)] leading-[1.1] font-medium tracking-[-0.025em] ${ink}`}>
        Level and length, before the tap
      </p>
      <p className={`m-0 mt-3 max-w-[40ch] text-[15px] leading-[1.55] ${sub}`}>
        Every plan card shows weeks, session time and focus, so a member picks one without opening it.
      </p>
      <div className="mt-auto pt-8">
        <Head title="Suggested for you" right={<span className="text-[13px] font-medium text-[#644ACD]">View all</span>} />
        <ul className="m-0 mt-5 flex list-none flex-col gap-3 p-0">
          {plans.map(([name, img, level]) => (
            <li key={name} className="flex items-center gap-4 rounded-[22px] bg-white shadow-[0_8px_24px_-14px_rgba(30,20,80,0.18)] p-3">
              <img
                src={`/case-studies/zync/ui/${img}.webp`}
                alt=""
                className="h-[clamp(72px,7.5vw,112px)] w-[clamp(108px,11vw,168px)] shrink-0 rounded-[16px] object-cover"
              />
              <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className={`text-[clamp(15px,1.3vw,18px)] font-semibold ${ink}`}>{name}</span>
                <span className={`text-[13px] ${sub}`}>5 weeks · 60 min</span>
                <span className="flex flex-wrap gap-1.5">
                  {level && <span className="rounded-full bg-[#DDF6EE] px-2.5 py-0.5 text-[11px] font-semibold text-[#14946F]">{level}</span>}
                  <span className="rounded-full bg-[#E4EEFF] px-2.5 py-0.5 text-[11px] font-semibold text-[#2F6BE0]">Strength</span>
                  <span className="rounded-full bg-[#FFE8EE] px-2.5 py-0.5 text-[11px] font-semibold text-[#D63B63]">Cardio</span>
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function Food() {
  const macros: [string, number, string, string][] = [
    ['Protein', 31, '35 / 112 g', '#F5577D'],
    ['Carbs', 47, '239 / 281 g', '#2DC6A0'],
    ['Fat', 47, '35 / 75 g', '#F5B01D'],
    ['Fibre', 87, '26 / 30 g', '#C46BF2'],
  ]
  const meals: [string, string, string][] = [
    ['Pomegranate', '1 piece', '114 cal'],
    ['Coffee', '100 ml', '234 cal'],
  ]
  // A half gauge: 1,385 of 2,250 cal.
  const r = 80
  const half = Math.PI * r
  return (
    <div className="grid h-full grid-cols-1 gap-8 font-slides min-[901px]:grid-cols-[1fr_1.2fr_1.3fr] min-[901px]:gap-10">
      <div className="flex flex-col">
        <Head title="Food log" />
        <div className="flex flex-1 flex-col items-center justify-center pt-4">
          <div className="relative w-full max-w-[240px]">
            <svg viewBox="0 0 200 110" className="block w-full">
              <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="#FFE3EA" strokeWidth="16" strokeLinecap="round" />
              <path
                d="M20 100 A80 80 0 0 1 180 100"
                fill="none"
                stroke="#F5577D"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={`${(1385 / 2250) * half} ${half}`}
              />
            </svg>
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center leading-tight">
              <span className={`text-[clamp(22px,2vw,30px)] font-semibold tracking-[-0.02em] ${ink}`}>1,385 cal</span>
              <span className={`text-[12px] ${sub}`}>of 2,250 cal</span>
            </div>
          </div>
          <span className="mt-4 rounded-full bg-[#FFE8EE] px-3 py-1 text-[12px] font-semibold text-[#D63B63]">865 cal left today</span>
        </div>
      </div>
      <div className="grid grid-cols-2 content-center gap-x-6 gap-y-6 min-[901px]:border-x min-[901px]:border-[#DFDFE8] min-[901px]:px-10">
        {macros.map(([name, pct, grams, color]) => (
          <div key={name} className="flex flex-col gap-2">
            <span className="flex justify-between text-[14px]">
              <span className={`font-semibold ${ink}`}>{name}</span>
              <span className={sub}>{pct}%</span>
            </span>
            <span className="h-2 overflow-hidden rounded-full bg-[#DFDFE8]">
              <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
            </span>
            <span className={`text-[12px] ${sub}`}>{grams}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-center gap-3">
        <div className="flex items-center justify-between">
          <span className="flex flex-col leading-tight">
            <span className={`text-[16px] font-semibold ${ink}`}>Breakfast</span>
            <span className={`text-[12px] ${sub}`}>8:00 am · 348 of 562 cal</span>
          </span>
          <span className="flex size-9 items-center justify-center rounded-full bg-[#FFE8EE] text-[18px] text-[#F5577D]">+</span>
        </div>
        {meals.map(([name, qty, cal]) => (
          <div key={name} className="flex items-center justify-between rounded-[16px] bg-white shadow-[0_8px_24px_-14px_rgba(30,20,80,0.18)] px-4 py-3">
            <span className="flex flex-col leading-tight">
              <span className={`text-[14px] font-semibold ${ink}`}>{name}</span>
              <span className={`text-[12px] ${sub}`}>{qty}</span>
            </span>
            <span className={`text-[14px] font-semibold ${ink}`}>{cal}</span>
          </div>
        ))}
        <div className="flex items-center justify-between rounded-[16px] px-4 py-3 ring-1 ring-[#DCDCE6] ring-inset">
          <span className="flex flex-col leading-tight">
            <span className={`text-[14px] font-semibold ${ink}`}>Lunch</span>
            <span className={`text-[12px] ${sub}`}>Not logged · 700 cal suggested</span>
          </span>
          <span className="flex size-8 items-center justify-center rounded-full bg-[#FFE8EE] text-[16px] text-[#F5577D]">+</span>
        </div>
      </div>
    </div>
  )
}

export const ZYNC_BLOCKS: Record<string, () => ReactNode> = {
  palette: Palette,
  calories: Calories,
  consumed: Consumed,
  checkin: CheckIn,
  classes: Classes,
  hydration: Hydration,
  food: Food,
  plans: Plans,
}
