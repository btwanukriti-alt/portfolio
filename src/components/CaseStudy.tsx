import Link from 'next/link'
import type { Project } from '@/data/projects'
import SiteHeader from './SiteHeader'
import SlideCarousel from './SlideCarousel'
import ShowcaseVideo from './ShowcaseVideo'
import Contact from './Contact'
import { Reveal, SplitReveal } from './Reveal'
import CollegeGallery from './CollegeGallery'
import { COLLEGE_INFO } from '@/data/collegeGallery'
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
            className="m-0 max-w-[14ch] text-[clamp(44px,6.6vw,112px)] leading-[0.98] font-medium tracking-[-0.045em] text-ink min-[901px]:row-span-2"
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

      <Contact />
    </div>
  )
}

// Visual-first layout: the description at the top, the mockup gallery below (mockup-showcase skill).
function CollegeCaseStudy() {
  const cs = caseStudyByKey('college-erp')!
  return (
    <div className="min-h-screen overflow-x-clip bg-paper">
      <SiteHeader />
      <main className="mx-auto max-w-[var(--max)] px-[var(--gutter)] pt-[120px] pb-[clamp(80px,12vh,140px)]">
        <Link
          href="/#work"
          className="inline-block text-[15px] leading-none font-medium text-muted no-underline transition-colors duration-200 ease-[ease] hover:text-ink focus-visible:rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          ← All work
        </Link>

        <div className="mt-[clamp(32px,6vh,64px)] grid grid-cols-1 gap-x-16 gap-y-8 min-[901px]:grid-cols-[3fr_2fr]">
          <div className="flex flex-col gap-6">
            <SplitReveal
              as="h1"
              className="m-0 max-w-[12ch] text-[clamp(44px,6.6vw,112px)] leading-[0.98] font-medium tracking-[-0.045em] text-ink"
              text={cs.title ?? ''}
            />
            <Reveal as="p" className="m-0 max-w-[40ch] text-[clamp(20px,1.8vw,28px)] leading-[1.35] font-medium tracking-[-0.01em] text-ink" delay={150}>
              {cs.hook}
            </Reveal>
          </div>
          <Reveal delay={250} className="flex flex-col gap-8 min-[901px]:pt-4">
            <dl className="m-0 grid grid-cols-2 gap-x-8 gap-y-5">
              {COLLEGE_INFO.map(([term, value]) => (
                <div key={term} className="flex flex-col gap-[6px]">
                  <dt className="text-[13px] leading-none font-medium text-faint">{term}</dt>
                  <dd className="m-0 text-[17px] leading-[1.25] font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
            {cs.paragraphs.map((t) => (
              <p key={t} className="m-0 max-w-[52ch] text-[clamp(16px,1.2vw,18px)] leading-[1.6] text-muted">{t}</p>
            ))}
          </Reveal>
        </div>

        <Reveal className="mt-[clamp(40px,6vh,72px)] grid grid-cols-1 gap-4 border-t border-line pt-7 min-[901px]:grid-cols-[minmax(160px,1fr)_3fr]">
          <p className="m-0 text-[15px] leading-[1.4] font-medium text-muted">The standout idea</p>
          <p className="m-0 max-w-[30ch] text-[clamp(22px,2.4vw,36px)] leading-[1.3] font-medium tracking-[-0.02em] text-ink">{cs.standout}</p>
        </Reveal>

        <CollegeGallery />
      </main>
      <Contact />
    </div>
  )
}
