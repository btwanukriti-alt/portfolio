import Link from 'next/link'
import type { CSSProperties } from 'react'
import type { Project } from '@/data/projects'
import SiteHeader from './SiteHeader'
import SlideCarousel from './SlideCarousel'
import ShowcaseVideo from './ShowcaseVideo'
import Contact from './Contact'
import { Reveal, SplitReveal } from './Reveal'
import { COLLEGE_BRAND, COLLEGE_IMAGES } from '@/data/collegeGallery'
import { caseStudyByKey } from '@/data/caseStudies'

// Case study page (content layout from Figma 125:2): title block, the project's showcase video
// as the hero (or its still), the problem, then the presentation slides.
export default function CaseStudy({ project, slides }: { project: Project; slides: string[] }) {
  if (project.slug === 'college-management') return <CollegeCaseStudy />
  return (
    // overflow-x clip: the full-width video hero spans 100vw, which includes the scrollbar.
    <div className="min-h-screen overflow-x-clip bg-paper">
      <SiteHeader />

      <main className="mx-auto max-w-[var(--max)] px-[var(--gutter)] pt-[120px] pb-[clamp(80px,12vh,140px)]">
        <Link
          href="/#work"
          className="inline-block text-[15px] leading-none font-medium text-muted no-underline transition-colors duration-200 ease-[ease] hover:text-ink focus-visible:rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          ← All work
        </Link>

        <div className="mt-[clamp(32px,6vh,64px)] grid grid-cols-1 gap-6 min-[901px]:grid-cols-[3fr_2fr] min-[901px]:items-end min-[901px]:gap-x-16">
          <SplitReveal
            as="h1"
            className="m-0 max-w-[14ch] text-[clamp(36px,4.8vw,76px)] leading-[1] font-medium tracking-[-0.045em] text-ink min-[901px]:row-span-2"
            text={project.title}
          />
          <Reveal as="p" className="m-0 max-w-[46ch] text-[clamp(17px,1.3vw,20px)] leading-[1.55] font-normal text-muted" delay={150}>
            {project.description}
          </Reveal>
          <Reveal delay={250}>
            <dl className="m-0 flex gap-10">
              {[
                ['Role', project.role],
                ['Timeline', project.timeline],
              ].map(([term, value]) => (
                <div key={term} className="flex flex-col gap-[6px]">
                  <dt className="text-[13px] leading-none font-medium text-faint">{term}</dt>
                  <dd className="m-0 text-[17px] leading-[1.2] font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* The project's showcase video is the hero, full window width at its own 16:9; on a
            portrait screen it's 9:16 (the showcase switches to its portrait cut), as wide as fits
            within 86% of the screen height, centred. Projects without one show their still. */}
        {project.showcase ? (
          <Reveal
            className="relative isolate mx-[calc(50%-50vw)] mt-[clamp(48px,8vh,88px)] aspect-video w-screen overflow-hidden bg-soft portrait:mx-[calc(50%-min(50vw,24.1875svh))] portrait:aspect-[9/16] portrait:w-[min(100vw,48.375svh)]"
            delay={200}
          >
            <ShowcaseVideo
              className="pointer-events-none absolute inset-0 h-full w-full border-0"
              src={project.showcase}
              title={`${project.title} showcase`}
            />
          </Reveal>
        ) : (
          <Reveal
            className="mt-[clamp(48px,8vh,88px)] aspect-[1211/630] overflow-hidden rounded-[24px] bg-soft shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
            delay={200}
          >
            <img className="h-full w-full object-cover" src={project.hero} alt={`${project.title} screens`} />
          </Reveal>
        )}

        <Reveal className="mt-[clamp(64px,10vh,120px)] grid grid-cols-1 gap-4 border-t border-line pt-7 min-[901px]:grid-cols-[minmax(160px,1fr)_3fr]">
          <p className="m-0 text-[15px] leading-[1.4] font-medium text-muted">The problem</p>
          <p className="m-0 max-w-[34ch] text-[clamp(22px,2.4vw,36px)] leading-[1.3] font-medium tracking-[-0.02em] text-ink">
            {project.problem}
          </p>
        </Reveal>

        {slides.length > 0 && (
          <Reveal className="mt-[clamp(64px,10vh,120px)]">
            <SlideCarousel slides={slides} title={project.title} />
          </Reveal>
        )}
      </main>

      <Contact current={project.slug} />
    </div>
  )
}

// Visual-first layout (mockup-showcase): the description is short and sits on top, the mockup
// modules run in one long gallery below. The project's colours come in as CSS variables.
function CollegeCaseStudy() {
  const cs = caseStudyByKey('college-erp')!
  const vars = {
    '--c-accent': COLLEGE_BRAND.accent,
    '--c-deep': COLLEGE_BRAND.deep,
    '--c-soft': COLLEGE_BRAND.soft,
    '--c-tint': COLLEGE_BRAND.tint,
    '--c-pop': COLLEGE_BRAND.pop,
  } as CSSProperties
  // Team and outcome stay off the page until they are confirmed.
  const facts = [
    ['Role', 'Sole designer'],
    ['Timeline', cs.timeline],
    ['Scope', 'Finance, staff and settlements screens of an existing ERP'],
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
              {cs.label}
            </Reveal>
            <SplitReveal
              as="h1"
              className="m-0 mt-6 max-w-[14ch] text-[clamp(40px,5.5vw,84px)] leading-[1] font-medium tracking-[-0.045em] text-ink"
              text={cs.title ?? ''}
            />
          </div>
          <Reveal as="p" className="m-0 max-w-[24ch] text-[clamp(22px,2.4vw,36px)] leading-[1.25] font-medium tracking-[-0.02em] text-ink" delay={150}>
            {cs.hook}
          </Reveal>
        </header>

        <Reveal className="mt-[clamp(40px,7vh,72px)] grid grid-cols-1 gap-x-10 gap-y-6 border-t border-line pt-7 min-[701px]:grid-cols-3">
          {facts.map(([term, value]) => (
            <dl key={term} className="m-0 flex flex-col gap-2">
              <dt className="text-[12px] leading-none font-semibold tracking-[0.08em] text-[var(--c-accent)] uppercase">{term}</dt>
              <dd className="m-0 max-w-[34ch] text-[15px] leading-[1.5] font-medium text-ink">{value}</dd>
            </dl>
          ))}
        </Reveal>

        <Reveal className="mt-[clamp(56px,9vh,104px)] grid grid-cols-1 gap-4 min-[901px]:grid-cols-[minmax(160px,1fr)_3fr]">
          <p className="m-0 text-[15px] leading-[1.4] font-medium text-muted">The project</p>
          <div className="flex max-w-[44ch] flex-col gap-6 text-[clamp(19px,1.7vw,26px)] leading-[1.5] font-normal text-ink">
            {cs.paragraphs.map((text) => (
              <p key={text.slice(0, 24)} className="m-0">
                {text}
              </p>
            ))}
          </div>
        </Reveal>


        <p className="mx-auto mt-[clamp(56px,9vh,104px)] mb-0 max-w-[var(--max)] text-[14px] leading-[1.5] text-faint">
          Screens are redesigned for this portfolio, and the figures in them are sample data. College names are placeholders. The last image shows earlier layouts next to the redesign.
        </p>

        <ol className="m-0 mt-6 flex list-none flex-col gap-[clamp(12px,1.6vw,24px)] p-0">
          {COLLEGE_IMAGES.map((image, i) => (
            <li key={image.src}>
              <Reveal as="figure" className="m-0 overflow-hidden rounded-[clamp(18px,2.4vw,36px)] bg-[#eef0f5]">
                <img
                  className="block h-auto w-full"
                  src={image.src}
                  width={image.width}
                  height={image.height}
                  alt={image.alt}
                  loading={i < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal className="mt-[clamp(72px,12vh,140px)] grid grid-cols-1 gap-10 border-t border-line pt-8 min-[901px]:grid-cols-2 min-[901px]:gap-16">
          <div>
            <h2 className="m-0 text-[15px] leading-[1.4] font-medium text-muted">What I delivered</h2>
            <ul className="m-0 mt-5 flex list-none flex-wrap gap-2 p-0">
              {cs.delivered.map((item) => (
                <li key={item} className="rounded-full bg-[var(--c-soft)] px-4 py-[9px] text-[15px] leading-none font-medium text-[var(--c-deep)]">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="m-0 text-[15px] leading-[1.4] font-medium text-muted">Next</h2>
            <ul className="m-0 mt-5 flex list-none flex-col gap-3 p-0">
              {cs.next.map((item) => (
                <li key={item} className="flex items-baseline gap-3 text-[16px] leading-[1.5] text-ink">
                  <span aria-hidden="true" className="mt-[0.5em] size-[7px] shrink-0 rounded-full bg-[var(--c-pop)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </main>
      <Contact current="college-management" />
    </div>
  )
}
