import Link from 'next/link'
import type { CSSProperties } from 'react'
import type { Project } from '@/data/projects'
import type { CaseStudy } from '@/data/caseStudies'
import type { BentoCard, Brand, GalleryImage, GallerySection } from '@/data/galleries'
import SiteHeader from './SiteHeader'
import ShowcaseVideo from './ShowcaseVideo'
import Contact from './Contact'
import { Reveal, SplitReveal } from './Reveal'

// Visual-first case study page (the mockup-showcase layout): the description is short and sits on
// top, the mockups run in one long gallery below. The project's own colours come in as CSS
// variables, so the page keeps the portfolio's white theme and only the accents change.
export default function GalleryCaseStudy({
  project,
  study,
  brand,
  note,
  images,
  sections,
}: {
  project: Project
  study: CaseStudy
  brand: Brand
  note: string
  images: GalleryImage[]
  sections?: GallerySection[]
}) {
  const vars = {
    '--c-accent': brand.accent,
    '--c-deep': brand.deep,
    '--c-soft': brand.soft,
    '--c-tint': brand.tint,
    '--c-pop': brand.pop,
    ...(brand.font ? { '--c-font': brand.font } : {}),
  } as CSSProperties
  const title = study.title ?? project.title
  const meta = [study.label, study.company, study.dates].filter(Boolean).join(' · ')
  const facts = [
    ['Role', study.role],
    ['Team', study.team],
    ['Timeline', study.timeline],
    ['Outcome', study.outcome],
  ]

  return (
    <div className="min-h-screen overflow-x-clip bg-paper" style={vars}>
      <SiteHeader />

      <main className="mx-auto max-w-[var(--max)] px-[var(--gutter)] pt-[120px] pb-[clamp(80px,12vh,140px)]">
        <Link
          href="/#work"
          className="inline-block text-[15px] leading-none font-medium text-muted no-underline transition-colors duration-200 ease-[ease] hover:text-ink focus-visible:rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          ← All work
        </Link>

        <header className="mt-[clamp(28px,5vh,56px)] grid grid-cols-1 gap-y-8 min-[901px]:grid-cols-[3fr_2fr] min-[901px]:items-end min-[901px]:gap-x-16">
          <div>
            <Reveal as="p" className="m-0 inline-flex rounded-full bg-[var(--c-soft)] px-4 py-[7px] text-[13px] leading-none font-semibold text-[var(--c-accent)]">
              {meta}
            </Reveal>
            <SplitReveal
              as="h1"
              className={`m-0 mt-6 ${brand.font ? '[font-family:var(--c-font)]' : 'font-wordmark-zync'} text-[clamp(40px,5.5vw,84px)] leading-[1] font-bold tracking-[-0.035em] text-ink`}
              text={title}
            />
          </div>
          <Reveal as="p" className="m-0 max-w-[24ch] text-[clamp(22px,2.4vw,36px)] leading-[1.25] font-medium tracking-[-0.02em] text-ink" delay={150}>
            {study.hook}
          </Reveal>
        </header>

        <Reveal className="mt-[clamp(40px,7vh,72px)] grid grid-cols-1 gap-x-10 gap-y-6 border-t border-line pt-7 min-[701px]:grid-cols-2 min-[1101px]:grid-cols-4">
          {facts.map(([term, value]) => (
            <dl key={term} className="m-0 flex flex-col gap-2">
              <dt className="text-[12px] leading-none font-semibold tracking-[0.08em] text-[var(--c-accent)] uppercase">{term}</dt>
              <dd className="m-0 max-w-[34ch] text-[15px] leading-[1.5] font-medium text-ink">{value}</dd>
            </dl>
          ))}
        </Reveal>

        {/* The project's showcase video is the hero, full window width at its own 16:9; on a
            portrait screen it's 9:16, as wide as fits within 86% of the screen height, centred. */}
        {project.showcase && (
          <Reveal
            className="relative isolate mx-[calc(50%-50vw)] mt-[clamp(48px,8vh,88px)] aspect-video w-screen overflow-hidden bg-[var(--c-tint)] portrait:mx-[calc(50%-min(50vw,24.1875svh))] portrait:aspect-[9/16] portrait:w-[min(100vw,48.375svh)]"
            delay={200}
          >
            <ShowcaseVideo className="pointer-events-none absolute inset-0 h-full w-full border-0" src={project.showcase} title={`${title} showcase`} />
          </Reveal>
        )}

        <Reveal className="mt-[clamp(56px,9vh,104px)] grid grid-cols-1 gap-4 min-[901px]:grid-cols-[minmax(160px,1fr)_3fr]">
          <p className="m-0 text-[15px] leading-[1.4] font-medium text-muted">The project</p>
          <div className="flex max-w-[44ch] flex-col gap-6 text-[clamp(19px,1.7vw,26px)] leading-[1.5] font-normal text-ink">
            {study.paragraphs.map((text) => (
              <p key={text.slice(0, 24)} className="m-0">
                {text}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-[clamp(40px,7vh,80px)] rounded-[28px] bg-[var(--c-tint)] px-[clamp(24px,5vw,72px)] py-[clamp(32px,6vw,72px)]">
          <p className="m-0 text-[13px] leading-none font-semibold tracking-[0.08em] text-[var(--c-pop)] uppercase">The idea</p>
          <p className="m-0 mt-4 max-w-[34ch] text-[clamp(20px,2vw,28px)] leading-[1.3] font-semibold tracking-[-0.02em] text-[var(--c-deep)]">
            {study.standout}
          </p>
        </Reveal>

        <p className="mx-auto mt-[clamp(56px,9vh,104px)] mb-0 max-w-[var(--max)] text-[14px] leading-[1.5] text-faint">
          {note}
        </p>

        {sections ? (
          <div className="mt-6 flex flex-col gap-[clamp(40px,7vh,88px)]">
            {sections.map((section, i) => (
              <section
                key={section.label}
                aria-label={section.label}
                className="grid grid-cols-1 gap-[clamp(12px,1.4vw,20px)] min-[901px]:grid-cols-12 min-[901px]:grid-rows-[repeat(2,clamp(300px,28vw,420px))]"
              >
                {section.cards.map((card, j) => (
                  <Bento key={j} card={card} eager={i === 0 && j < 2} />
                ))}
              </section>
            ))}
          </div>
        ) : (
          <ol className="m-0 mt-6 flex list-none flex-col gap-[clamp(12px,1.6vw,24px)] p-0">
            {images.map((img, i) => (
              <li key={img.src}>
                <Reveal as="figure" className="m-0 overflow-hidden rounded-[clamp(18px,2.4vw,36px)] bg-[#eef0f5]">
                  <img
                    className="block h-auto w-full"
                    src={img.src}
                    width={img.width}
                    height={img.height}
                    alt={img.alt}
                    loading={i < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </Reveal>
              </li>
            ))}
          </ol>
        )}

        <Reveal className="mt-[clamp(72px,12vh,140px)] grid grid-cols-1 gap-10 border-t border-line pt-8 min-[901px]:grid-cols-2 min-[901px]:gap-16">
          <div>
            <h2 className="m-0 text-[15px] leading-[1.4] font-medium text-muted">What I delivered</h2>
            <ul className="m-0 mt-5 flex list-none flex-wrap gap-2 p-0">
              {study.delivered.map((item) => (
                <li key={item} className="rounded-full bg-[var(--c-soft)] px-4 py-[9px] text-[15px] leading-none font-medium text-[var(--c-deep)]">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="m-0 text-[15px] leading-[1.4] font-medium text-muted">Next</h2>
            <ul className="m-0 mt-5 flex list-none flex-col gap-3 p-0">
              {study.next.map((item) => (
                <li key={item} className="flex items-baseline gap-3 text-[16px] leading-[1.5] text-ink">
                  <span aria-hidden="true" className="mt-[0.5em] size-[7px] shrink-0 rounded-full bg-[var(--c-pop)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </main>

      <Contact current={project.slug} />
    </div>
  )
}

// One bento card: a UI component on a soft plate with room around it, or the feature's text box.
function Bento({ card, eager }: { card: BentoCard; eager: boolean }) {
  if (card.kind === 'text') {
    return (
      <Reveal className={`${card.span} flex flex-col justify-end rounded-[clamp(22px,2.4vw,36px)] bg-[var(--c-accent)] p-[clamp(28px,3.2vw,52px)] text-white`}>
        <p className="m-0 text-[12px] leading-none font-semibold tracking-[0.1em] text-white/70 uppercase">{card.kicker}</p>
        <h3 className="m-0 mt-4 text-[clamp(28px,2.7vw,44px)] leading-[1.08] font-light tracking-[-0.025em]">{card.title}</h3>
        <p className="m-0 mt-4 max-w-[36ch] text-[clamp(15px,1.1vw,17px)] leading-[1.55] text-white/85">{card.text}</p>
      </Reveal>
    )
  }
  const tall = card.span.includes('row-span-2')
  return (
    <Reveal
      as="figure"
      className={`${card.span} relative m-0 overflow-hidden rounded-[clamp(22px,2.4vw,36px)] bg-[linear-gradient(180deg,#F8F9FC,#ECEDF3)] shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.95)] ${
        tall ? 'aspect-[4/5]' : 'aspect-[4/3]'
      } min-[901px]:aspect-auto`}
    >
      {card.fit === 'top' ? (
        <img
          className="absolute top-[12%] left-1/2 block h-auto w-[min(62%,300px)] -translate-x-1/2"
          src={card.src}
          width={card.width}
          height={card.height}
          alt={card.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      ) : (
        <div className={`absolute inset-0 m-auto flex items-center justify-center ${tall ? 'h-[86%] w-[86%]' : card.size ? `h-[84%] ${card.size} w-full` : 'h-[80%] w-[80%]'}`}>
          <img
            className="block h-auto max-h-full w-auto max-w-full object-contain"
            src={card.src}
            width={card.width}
            height={card.height}
            alt={card.alt}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
          />
        </div>
      )}
    </Reveal>
  )
}
