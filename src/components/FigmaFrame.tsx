import type { ReactNode } from 'react'

// A Figma-style selection frame, as on the home page's work cards: a thin ink border with
// corner and edge handles, the layer name above and the frame's size below.
const HANDLES = [
  [0, 0], [50, 0], [100, 0],
  [0, 50], [100, 50],
  [0, 100], [50, 100], [100, 100],
]

// '03-alerts-search.jpg' -> 'Alerts search'
export const layerName = (src: string) => {
  const stem = src.split('/').pop()!.replace(/\.[a-z]+$/i, '').replace(/^\d+-/, '').replace(/-/g, ' ')
  return stem.charAt(0).toUpperCase() + stem.slice(1)
}

export default function FigmaFrame({
  index,
  name,
  size,
  children,
}: {
  index: number
  name: string
  size: string
  children: ReactNode
}) {
  return (
    <div className="relative mt-7 mb-10">
      <div aria-hidden="true" className="absolute bottom-full left-0 mb-2 flex items-center gap-2 font-hero text-[12px] leading-none font-medium whitespace-nowrap text-ink">
        <span className="text-faint tabular-nums">{String(index).padStart(2, '0')}</span>
        <span>{name}</span>
        <span className="rounded-[3px] bg-[#7B61FF]/10 px-[5px] py-[3px] text-[10px] text-[#7B61FF]">Frame</span>
      </div>
      <div className="relative">
        {children}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 border border-ink" />
        {HANDLES.map(([x, y]) => (
          <span
            key={`${x}-${y}`}
            aria-hidden="true"
            className="pointer-events-none absolute size-[7px] -translate-x-1/2 -translate-y-1/2 border border-ink bg-white"
            style={{ left: `${x}%`, top: `${y}%` }}
          />
        ))}
      </div>
      <div aria-hidden="true" className="absolute top-full left-1/2 mt-2.5 -translate-x-1/2 rounded-[4px] bg-ink px-[6px] py-[3px] font-hero text-[11px] leading-none font-medium whitespace-nowrap text-white tabular-nums">
        {size}
      </div>
    </div>
  )
}
