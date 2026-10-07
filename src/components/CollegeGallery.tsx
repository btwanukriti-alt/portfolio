import { Reveal } from './Reveal'
import { COLLEGE_GALLERY, type Mockup, type Pin } from '@/data/collegeGallery'

// Long vertical gallery for the college ERP case study. The project's colour (peach) is the stage
// family; the hero stage is navy, the colour of the ERP itself. Screens are rendered from the
// approved designs and show sample data.

const STAGE = 'rounded-[clamp(18px,2.4vw,32px)] p-[clamp(14px,3.4vw,56px)]'
const peach = `${STAGE} bg-[linear-gradient(135deg,#ffeadb_0%,#ffd9c0_100%)]`
const navy = `${STAGE} bg-[linear-gradient(135deg,#0b1733_0%,#16336f_100%)]`
const FRAME = 'block w-full rounded-[clamp(8px,1vw,14px)] shadow-[0_30px_60px_-24px_rgba(8,21,58,0.45),0_0_0_1px_rgba(8,21,58,0.06)]'

function PinMark({ n, pin }: { n: number; pin: Pin }) {
  return (
    <b
      aria-hidden
      className="pointer-events-none absolute z-10 grid h-[clamp(20px,2vw,28px)] w-[clamp(20px,2vw,28px)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#12326e] text-[clamp(11px,1vw,14px)] font-semibold text-white shadow-[0_0_0_3px_#fff,0_8px_20px_rgba(8,21,58,0.35)]"
      style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
    >
      {n}
    </b>
  )
}

function Pinned({ src, alt, pins, className = FRAME }: { src: string; alt: string; pins: Pin[]; className?: string }) {
  return (
    <div className="relative">
      <img className={className} src={src} alt={alt} loading="lazy" />
      {pins.map((p, i) => (
        <PinMark key={p.text} n={i + 1} pin={p} />
      ))}
    </div>
  )
}

function Caption({ children, pins }: { children: string; pins?: Pin[] }) {
  return (
    <figcaption className="mt-4 flex flex-col gap-3">
      <p className="m-0 text-[15px] leading-[1.4] font-medium text-muted">{children}</p>
      {pins && pins.length > 0 && (
        <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-[14px] text-ink">
          {pins.map((p, i) => (
            <li key={p.text} className="flex items-center gap-2">
              <b className="grid h-5 w-5 place-items-center rounded-full bg-[#12326e] text-[11px] font-semibold text-white">{i + 1}</b>
              {p.text}
            </li>
          ))}
        </ul>
      )}
    </figcaption>
  )
}

function Board() {
  const swatch = (c: string, name: string) => (
    <div className="flex flex-col gap-2">
      <div className="h-[clamp(56px,7vw,96px)] rounded-[12px]" style={{ background: c }} />
      <span className="text-[13px] font-medium text-ink">{name}</span>
      <span className="text-[12px] text-muted">{c}</span>
    </div>
  )
  const chip = (cls: string, label: string) => (
    <span className={`inline-flex items-center gap-[6px] rounded-full px-[10px] py-[3px] text-[13px] font-semibold ${cls}`}>
      <i className="h-[6px] w-[6px] rounded-full bg-current" />
      {label}
    </span>
  )
  const bar = (pct: number, color: string, label: string) => (
    <div className="flex items-center gap-3">
      <span className="w-[78px] text-[13px] font-medium text-ink">{label}</span>
      <div className="relative h-2 flex-1 rounded-full bg-[#eceff4]">
        <b className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${pct}%`, background: color }} />
        <u className="absolute -top-[3px] -bottom-[3px] left-[80%] w-[2px] rounded-sm bg-ink/55 no-underline" />
      </div>
      <span className="w-[44px] text-right text-[13px] font-semibold tabular-nums text-ink">{pct}%</span>
    </div>
  )
  return (
    <div className="grid grid-cols-1 gap-[clamp(20px,3vw,40px)] rounded-[14px] bg-white p-[clamp(20px,3.4vw,56px)] shadow-[0_30px_60px_-24px_rgba(8,21,58,0.35)] min-[901px]:grid-cols-[1.1fr_1fr]">
      <div className="flex flex-col gap-5">
        <p className="m-0 text-[13px] font-medium text-faint">Colour</p>
        <div className="grid grid-cols-4 gap-3">
          {swatch('#08153A', 'Navy 900')}
          {swatch('#12326E', 'Navy 700')}
          {swatch('#4F86E8', 'Blue 400')}
          {swatch('#F5F6F9', 'Canvas')}
        </div>
        <p className="m-0 mt-2 text-[13px] font-medium text-faint">Status</p>
        <div className="grid grid-cols-3 gap-3">
          {swatch('#12805C', 'On target')}
          {swatch('#D9910A', 'Near target')}
          {swatch('#D92D20', 'Below target')}
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <p className="m-0 text-[13px] font-medium text-faint">Collection chip</p>
        <div className="flex flex-wrap gap-3">
          {chip('bg-[#e3f5ec] text-[#12805c]', '83.8%')}
          {chip('bg-[#fdf1d8] text-[#a15c07]', '72.7%')}
          {chip('bg-[#fde8e6] text-[#b42318]', '55.9%')}
        </div>
        <p className="m-0 mt-2 text-[13px] font-medium text-faint">Progress against 80% target</p>
        <div className="flex flex-col gap-4">
          {bar(84, '#12805c', 'On target')}
          {bar(73, '#d9910a', 'Near')}
          {bar(56, '#d92d20', 'Below')}
        </div>
        <p className="m-0 mt-2 text-[13px] leading-[1.5] text-muted">Green at 80% and above, amber from 70%, red below. Used the same way on every screen.</p>
      </div>
    </div>
  )
}

function Block({ m }: { m: Mockup }) {
  switch (m.type) {
    case 'hero':
      return (
        <figure className="m-0">
          <div className={navy}><Pinned src={m.src} alt={m.alt} pins={m.pins} /></div>
          <Caption pins={m.pins}>{m.caption}</Caption>
        </figure>
      )
    case 'screen':
      return (
        <figure className="m-0">
          <div className={`${peach} min-[901px]:px-[clamp(48px,9vw,160px)]`}><Pinned src={m.src} alt={m.alt} pins={m.pins} /></div>
          <Caption pins={m.pins}>{m.caption}</Caption>
        </figure>
      )
    case 'flow':
      return (
        <figure className="m-0">
          <div className={peach}>
            <ol className="m-0 grid list-none grid-cols-1 items-start gap-6 p-0 min-[901px]:grid-cols-[1fr_auto_1fr_auto_1fr] min-[901px]:gap-4">
              {m.steps.flatMap((s, i) => [
                <li key={s.label} className="flex flex-col gap-3">
                  <div className={s.crop ? 'aspect-[3/2] overflow-hidden rounded-[clamp(8px,1vw,14px)] shadow-[0_30px_60px_-24px_rgba(8,21,58,0.45)]' : ''}>
                    <img className={s.crop ? 'block w-full' : FRAME} src={s.src} alt={s.alt} loading="lazy" />
                  </div>
                  <span className="text-[14px] font-semibold text-ink">{s.label}</span>
                </li>,
                i < m.steps.length - 1 ? (
                  <li key={`a${i}`} aria-hidden className="hidden self-center pb-7 text-[28px] leading-none text-[#12326e] min-[901px]:block">→</li>
                ) : null,
              ])}
            </ol>
          </div>
          <Caption>{m.caption}</Caption>
        </figure>
      )
    case 'detail':
      return (
        <figure className="m-0">
          <div className={`${m.tone === 'peach' ? peach : navy} min-[901px]:px-[clamp(40px,8vw,140px)] min-[901px]:py-[clamp(40px,6vw,96px)]`}>
            <p className={`m-0 mb-5 text-[13px] font-medium ${m.tone === 'peach' ? 'text-[#12326e]' : 'text-white/60'}`}>{m.note}</p>
            <Pinned src={m.src} alt={m.alt} pins={m.pins} className="block w-full rounded-[14px] shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)]" />
          </div>
          <Caption pins={m.pins}>{m.caption}</Caption>
        </figure>
      )
    case 'compare':
      return (
        <figure className="m-0">
          <div className={peach}>
            <div className="grid grid-cols-1 gap-6 min-[901px]:grid-cols-2">
              {[['Earlier version', m.before], ['Redesign', m.after]].map(([label, img]) => {
                const i = img as { src: string; alt: string }
                return (
                  <div key={label as string} className="flex flex-col gap-3">
                    <span className="text-[13px] font-semibold text-[#12326e]">{label as string}</span>
                    <div className={m.cropTop ? 'aspect-[100/95] overflow-hidden rounded-[14px] bg-white shadow-[0_30px_60px_-24px_rgba(8,21,58,0.45)]' : ''}>
                      <img className={m.cropTop ? 'block w-full' : FRAME} src={i.src} alt={i.alt} loading="lazy" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <Caption>{m.caption}</Caption>
        </figure>
      )
    case 'board':
      return (
        <figure className="m-0">
          <div className={peach}><Board /></div>
          <Caption>{m.caption}</Caption>
        </figure>
      )
  }
}

export default function CollegeGallery() {
  return (
    <div className="mt-[clamp(56px,9vh,104px)] flex flex-col gap-[clamp(40px,7vw,96px)]">
      {COLLEGE_GALLERY.map((m, i) => (
        <Reveal key={i}>
          <Block m={m} />
        </Reveal>
      ))}
      <p className="m-0 text-[13px] leading-[1.5] text-faint">All figures in these screens are sample data from the design. College names are placeholders.</p>
    </div>
  )
}
