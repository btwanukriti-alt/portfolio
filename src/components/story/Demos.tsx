'use client'

import type { ReactNode } from 'react'
import type { Demo } from '@/data/stories'

// Code-rendered parts of the Jaadu case study: the illustrative overnight shortlist (the export repeats one card
// three times) and the key to the footprint chart's cells.

/* ---------------- Jaadu ---------------- */

const SHORTLIST = [
  { title: 'MeanRev-VAL', type: 'Mean reversion', win: '58%', trades: '100', winners: '58', losers: '42' },
  { title: 'Breakout-ORB', type: 'Opening-range breakout', win: '52%', trades: '100', winners: '52', losers: '48' },
  { title: 'Trend-Pullback', type: 'Trend continuation', win: '61%', trades: '100', winners: '61', losers: '39' },
]

function JaaduShortlist() {
  return (
    <div className="font-body">
      <p className="m-0 mb-2 text-[14px] font-semibold text-ink">Illustrative shortlist</p>
      <div className="rounded-2xl p-4 md:p-6" style={{ background: 'linear-gradient(180deg,#0A1340,#00022B)', color: '#F1F4FF' }}>
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
          {SHORTLIST.map((c) => (
            <li key={c.title} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)', boxShadow: 'inset 0 0 0 1px #4A5A9A' }}>
              <p className="m-0 text-[17px] font-semibold">{c.title}</p>
              <p className="m-0 mt-1 text-[13px]" style={{ color: '#B9C4EE' }}>Type: {c.type}</p>
              <dl className="m-0 mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
                {[['Win rate', c.win], ['Trades', c.trades], ['Winners', c.winners], ['Losers', c.losers]].map(([k, v]) => (
                  <div key={k}>
                    <dt style={{ color: '#B9C4EE' }}>{k}</dt>
                    <dd className="m-0 mt-1 text-[18px] font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
        <p className="m-0 mt-4 text-[14px] leading-[1.5]" style={{ color: '#D5DCF7' }}>Illustrative candidates. Win rate alone does not describe risk or profitability.</p>
      </div>
    </div>
  )
}

function FootprintLegend() {
  const items: [string, string][] = [
    ['#3157E0', 'Blue cell: more volume bought than sold at that price'],
    ['#D2384F', 'Red cell: more volume sold than bought at that price'],
    ['#DE9C2E', 'Yellow cell: the price with the most volume in the candle'],
  ]
  return (
    <div className="max-w-[680px] font-body">
      <p className="m-0 text-[14px] font-semibold text-ink">Reading the cells</p>
      <ul className="m-0 mt-2 flex list-none flex-col gap-2 p-0 text-[15px] leading-[1.5] text-ink">
        {items.map(([c, t]) => (
          <li key={t} className="flex items-start gap-3">
            <span aria-hidden="true" className="mt-[4px] size-4 shrink-0 rounded-[4px]" style={{ background: c }} />
            {t}
          </li>
        ))}
        <li className="pl-7">In each pair, the left number is volume sold and the right is volume bought. Time runs along the bottom; price is on the right.</li>
      </ul>
    </div>
  )
}

const DEMOS: Record<Demo, () => ReactNode> = {
  'jaadu-shortlist': JaaduShortlist,
  'footprint-legend': FootprintLegend,
}

export function StoryDemo({ kind }: { kind: Demo }) {
  const Demo = DEMOS[kind]
  return <Demo />
}
