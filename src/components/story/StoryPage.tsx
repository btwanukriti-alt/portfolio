import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { PROPOSED_DISCLOSURE, STORIES, type Shot, type Story, type StorySection } from '@/data/stories'
import { PROJECTS } from '@/data/projects'
import SiteHeader from '../SiteHeader'
import Contact from '../Contact'
import { ViewButton, ViewerProvider } from './Viewer'
import { StoryDemo } from './Demos'

// The case-study template shared by all five projects: a light editorial page (1160px wide, a 680px text column),
// a short header with confirmed facts, a contents list, then 4-6 numbered sections. Each section has one primary
// screen and, where needed, a few close-ups with live-text captions. No reveal animations: every image is visible
// as soon as it loads.

const TEXT = 'max-w-[680px]'
const focus = 'focus-visible:rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]'

export default function StoryPage({ story }: { story: Story }) {
  const recovery = story.sections.find((s) => s.proposed)
  const contents: [string, string][] = [
    ['Overview', 'overview'],
    ['Key flows', 'key-flows'],
    ...(recovery ? ([['Recovery states', recovery.id]] as [string, string][]) : []),
    ...(story.more ? ([[story.more.heading, 'more-screens']] as [string, string][]) : []),
    ...(story.visualSystem ? ([[story.visualSystem.heading, 'visual-system']] as [string, string][]) : []),
  ]
  const order = PROJECTS.map((p) => p.slug)
  const related = [...story.related].sort((a, b) => order.indexOf(a) - order.indexOf(b))

  return (
    <div className="min-h-screen overflow-x-clip bg-paper" style={{ '--accent': story.accent } as CSSProperties}>
      <SiteHeader />
      <ViewerProvider>
        <main className="mx-auto max-w-[1160px] px-5 pt-[104px] pb-14 max-[359px]:px-4 md:px-12 md:pt-[120px] md:pb-24">
          <header id="overview" className={`${TEXT} scroll-mt-24`}>
            <Link href="/#work" className={`inline-flex min-h-11 items-center text-[15px] font-medium text-muted no-underline hover:text-ink ${focus}`}>
              <span aria-hidden="true" className="mr-2">←</span>All work
            </Link>
            <p className="m-0 mt-4 text-[14px] leading-[1.4] font-semibold tracking-[0.02em] text-[var(--accent)]">{story.category}</p>
            <h1 className="m-0 mt-2 font-title text-[32px] leading-[1.1] font-semibold tracking-[-0.025em] text-ink md:text-[48px]">{story.title}</h1>
            <p className="m-0 mt-4 text-[18px] leading-[1.5] text-ink md:text-[20px]">{story.summary}</p>
            <dl className="m-0 mt-8 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-line pt-6 md:grid-cols-[112px_1fr]">
              {story.facts.map(([term, value]) => (
                <div key={term} className="contents">
                  <dt className="text-[14px] leading-[1.6] font-semibold text-muted">{term}</dt>
                  <dd className="m-0 -mt-3 text-[16px] leading-[1.6] text-ink md:mt-0">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="m-0 mt-6 rounded-xl bg-soft px-4 py-3 text-[14px] leading-[1.5] text-[#4a4a4f]">{story.disclosure}</p>
          </header>

          <nav aria-label="On this page" className="mt-8">
            <ul className="m-0 flex list-none flex-wrap gap-x-2 gap-y-1 p-0">
              {contents.map(([label, id]) => (
                <li key={id}>
                  <a href={`#${id}`} className={`inline-flex min-h-11 items-center rounded-full border border-line px-4 text-[14px] font-medium text-ink no-underline hover:border-ink ${focus}`}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div id="key-flows" className="scroll-mt-24">
            {story.sections.map((section, i) => (
              <Section key={section.id} section={section} n={i + 1} eager={i === 0} />
            ))}
          </div>

          {story.more && (
            <Collapsed id="more-screens" heading={story.more.heading} shots={story.more.shots} summary="Show more screens" />
          )}
          {story.visualSystem && (
            <Collapsed id="visual-system" heading={story.visualSystem.heading} shots={story.visualSystem.shots} summary="Show the logo construction" />
          )}

          {story.closing && (
            <section aria-labelledby="closing" className={`${TEXT} mt-14 border-t border-line pt-10 md:mt-24`}>
              <h2 id="closing" className="m-0 text-[24px] leading-[1.25] font-semibold tracking-[-0.015em] text-ink md:text-[28px]">{story.closing.heading}</h2>
              <p className="m-0 mt-4 text-[16px] leading-[1.6] text-ink md:text-[18px]">{story.closing.copy}</p>
            </section>
          )}

          <nav aria-labelledby="more-work" className="mt-14 border-t border-line pt-10 md:mt-24">
            <h2 id="more-work" className="m-0 text-[24px] leading-[1.25] font-semibold tracking-[-0.015em] text-ink md:text-[28px]">More work</h2>
            <ul className="m-0 mt-6 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2">
              {related.map((slug) => (
                <li key={slug}>
                  <RelatedCard slug={slug} />
                </li>
              ))}
            </ul>
          </nav>
        </main>
      </ViewerProvider>
      <Contact />
    </div>
  )
}

function Section({ section, n, eager }: { section: StorySection; n: number; eager: boolean }) {
  const num = String(n).padStart(2, '0')
  return (
    <section id={section.id} aria-labelledby={`${section.id}-h`} className="mt-14 scroll-mt-24 md:mt-24">
      <div className={TEXT}>
        <p aria-hidden="true" className="m-0 font-title text-[14px] leading-none font-semibold tracking-[0.06em] text-[var(--accent)]">{num}</p>
        <h2 id={`${section.id}-h`} className="m-0 mt-3 text-[24px] leading-[1.25] font-semibold tracking-[-0.015em] text-ink md:text-[32px]">
          <span className="sr-only">{num}. </span>
          {section.heading}
        </h2>
        {section.proposed && (
          <p className="m-0 mt-4 rounded-xl border border-dashed border-[var(--accent)] px-4 py-3 text-[15px] leading-[1.55] text-ink">
            <strong className="font-semibold">Proposed recovery states.</strong> {PROPOSED_DISCLOSURE}
          </p>
        )}
      </div>

      {section.primary && (
        <figure className="m-0 mt-6">
          <Media shot={section.primary} eager={eager} />
          <Caption shot={section.primary} text={section.caption} />
        </figure>
      )}

      {section.set && (
        <figure className="m-0 mt-6">
          <div className={section.setLayout === 'row' ? 'grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6' : 'flex flex-col gap-8'}>
            {section.set.map((shot, k) => (
              <figure key={shot.src} className="m-0" style={shot.maxWidth ? { maxWidth: shot.maxWidth } : undefined}>
                <figcaption className="mb-2 text-[14px] leading-[1.4] font-semibold text-ink">{shot.label}</figcaption>
                <Media shot={shot} eager={eager && k === 0} />
                <div className="mt-1 flex justify-end">
                  <ViewButton shot={shot} />
                </div>
              </figure>
            ))}
          </div>
          {section.caption && <figcaption className={`${TEXT} mt-3 text-[16px] leading-[1.6] text-ink`}>{section.caption}</figcaption>}
        </figure>
      )}

      {section.demo && !section.demoAfter && (
        <div className="mt-6" role="group" aria-label={section.proposed ? 'Proposed recovery states' : undefined}>
          <StoryDemo kind={section.demo} />
          {section.caption && !section.primary && !section.set && <p className={`${TEXT} m-0 mt-3 text-[16px] leading-[1.6] text-ink`}>{section.caption}</p>}
        </div>
      )}

      {section.details && <Details shots={section.details} caption={section.detailCaption} />}

      {section.demo && section.demoAfter && (
        <div className="mt-8">
          <StoryDemo kind={section.demo} />
        </div>
      )}
    </section>
  )
}

// The image area: the screen at its natural ratio, never cropped by CSS. Dark UI keeps a dark ground.
function Media({ shot, eager = false }: { shot: Shot; eager?: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-[12px] border md:rounded-[14px] ${shot.dark ? 'border-[#2a2a31] bg-[#0B0B10]' : 'border-line bg-[#F7F8FA]'}`}
      style={shot.maxWidth ? { maxWidth: shot.maxWidth } : undefined}
    >
      { }
      <img
        className="block h-auto w-full object-contain"
        src={shot.src}
        width={shot.width}
        height={shot.height}
        alt={shot.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  )
}

function Caption({ shot, text }: { shot: Shot; text?: string }) {
  return (
    <div className="mt-2 flex flex-col gap-1 md:flex-row md:items-start md:justify-between md:gap-6">
      {text ? <figcaption className={`${TEXT} pt-2 text-[16px] leading-[1.6] text-ink`}>{text}</figcaption> : <span />}
      <ViewButton shot={shot} />
    </div>
  )
}

// Close-ups: one beside a caption column on desktop, or two balanced cards. A shared caption sits under them.
function Details({ shots, caption }: { shots: Shot[]; caption?: string }) {
  const single = shots.length === 1
  return (
    <figure className="m-0 mt-8">
      <div className={single ? '' : 'grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6'}>
        {shots.map((shot) => (
          <figure
            key={shot.src}
            className={`m-0 ${single ? 'grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,var(--w))_minmax(280px,320px)] md:items-start md:gap-8' : ''}`}
            style={{ '--w': shot.maxWidth ? `${shot.maxWidth}px` : '1fr', ...(!single && shot.maxWidth ? { maxWidth: shot.maxWidth } : {}) } as CSSProperties}
          >
            <Media shot={shot} />
            <div className={single ? 'md:pt-1' : 'mt-2'}>
              <figcaption className="text-[14px] leading-[1.55] text-ink">
                {shot.label && <strong className="block font-semibold">{shot.label}</strong>}
                {shot.caption && <span className="mt-1 block text-[15px] leading-[1.55]">{shot.caption}</span>}
                {single && caption && <span className="mt-1 block text-[15px] leading-[1.55]">{caption}</span>}
              </figcaption>
              <ViewButton shot={shot} />
            </div>
          </figure>
        ))}
      </div>
      {!single && caption && <figcaption className={`${TEXT} mt-4 text-[16px] leading-[1.6] text-ink`}>{caption}</figcaption>}
    </figure>
  )
}

function Collapsed({ id, heading, shots, summary }: { id: string; heading: string; shots: Shot[]; summary: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="mt-14 scroll-mt-24 border-t border-line pt-10 md:mt-24">
      <h2 id={`${id}-h`} className="m-0 text-[24px] leading-[1.25] font-semibold tracking-[-0.015em] text-ink md:text-[28px]">{heading}</h2>
      <details className="group mt-4">
        <summary className={`inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-line px-4 text-[15px] font-medium text-ink hover:border-ink [&::-webkit-details-marker]:hidden ${focus}`}>
          <span aria-hidden="true" className="transition-transform group-open:rotate-90 motion-reduce:transition-none">›</span>
          {summary}
        </summary>
        <div className="mt-6 flex flex-col gap-8">
          {shots.map((shot) => (
            <figure key={shot.src} className="m-0">
              <figcaption className="mb-2 text-[14px] leading-[1.4] font-semibold text-ink">{shot.label}</figcaption>
              <Media shot={shot} />
              <div className="mt-1 flex justify-end">
                <ViewButton shot={shot} />
              </div>
            </figure>
          ))}
        </div>
      </details>
    </section>
  )
}

function RelatedCard({ slug }: { slug: string }): ReactNode {
  const story = STORIES.find((s) => s.slug === slug)
  if (!story) return null
  const first = story.sections[0]
  // The redesigned screen, never a Before image.
  const thumb = first.primary ?? first.set?.[first.set.length - 1]
  return (
    <Link href={`/work/${slug}`} className={`group block rounded-[14px] border border-line p-3 text-ink no-underline hover:border-ink ${focus}`}>
      {thumb && (
        <div className={`aspect-[16/10] overflow-hidden rounded-[10px] ${thumb.dark ? 'bg-[#0B0B10]' : 'bg-[#F7F8FA]'}`}>
          { }
          <img src={thumb.src} alt="" width={thumb.width} height={thumb.height} loading="lazy" decoding="async" className="block h-full w-full object-contain" />
        </div>
      )}
      <p className="m-0 mt-4 px-1 text-[14px] font-semibold text-[var(--accent)]">{story.category}</p>
      <p className="m-0 mt-1 px-1 pb-1 text-[20px] leading-[1.3] font-semibold tracking-[-0.01em] group-hover:underline">{story.title}</p>
    </Link>
  )
}
