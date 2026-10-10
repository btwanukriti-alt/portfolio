import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { STORIES, type Shot, type Story, type StorySection } from '@/data/stories'
import { PROJECTS } from '@/data/projects'
import SiteHeader from '../SiteHeader'
import Contact from '../Contact'
import { ViewButton, ViewerProvider } from './Viewer'
import { StoryDemo } from './Demos'

// The case-study template shared by all five projects, laid out as a bento grid (the earlier project-page style):
// rounded tiles on a 12-column grid. Each numbered section has a text tile (number, heading, caption), its screen in
// the largest tile, and close-ups in their own tiles with the caption beside the image. Below 1024px every tile
// takes the full width, one under another. No reveal animations: every image shows as soon as it loads.

const focus = 'focus-visible:rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]'
const GRID = 'grid grid-cols-1 gap-[clamp(12px,1.4vw,20px)] lg:grid-cols-12'
const TILE = 'min-w-0 rounded-[clamp(20px,2.2vw,32px)]'
// Light tiles: the soft plate of the earlier bento pages. Dark tiles keep dark product UI on a dark ground.
const plate = (dark?: boolean) =>
  dark
    ? 'bg-[linear-gradient(180deg,#15151B,#0B0B10)] ring-1 ring-white/[0.08]'
    : 'bg-[linear-gradient(180deg,#F8F9FC,#ECEDF3)] shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.95)]'
const PAD = 'p-[clamp(14px,2vw,28px)]'

export default function StoryPage({ story }: { story: Story }) {
  const contents: [string, string][] = [
    ['Overview', 'overview'],
    ['Key flows', 'key-flows'],
    ...(story.more ? ([[story.more.heading, 'more-screens']] as [string, string][]) : []),
    ...(story.visualSystem ? ([[story.visualSystem.heading, 'visual-system']] as [string, string][]) : []),
  ]
  const order = PROJECTS.map((p) => p.slug)
  const related = [...story.related].sort((a, b) => order.indexOf(a) - order.indexOf(b))

  return (
    <div className="min-h-screen overflow-x-clip bg-paper" style={{ '--accent': story.accent } as CSSProperties}>
      <SiteHeader />
      <ViewerProvider>
        <main className="mx-auto max-w-[1440px] px-4 pt-[104px] pb-14 min-[360px]:px-5 md:px-[clamp(24px,4vw,64px)] md:pt-[120px] md:pb-24">
          <Link href="/#work" className={`inline-flex min-h-11 items-center text-[15px] font-medium text-muted no-underline hover:text-ink ${focus}`}>
            <span aria-hidden="true" className="mr-2">←</span>All work
          </Link>

          <header id="overview" className={`${GRID} mt-4 scroll-mt-24`}>
            <div className={`${TILE} ${plate()} ${PAD} flex flex-col justify-end lg:col-span-7`}>
              <p className="m-0 text-[14px] leading-[1.4] font-semibold tracking-[0.02em] text-[var(--accent)]">{story.category}</p>
              <h1 className="m-0 mt-2 font-title text-[32px] leading-[1.1] font-semibold tracking-[-0.025em] text-ink md:text-[48px]">{story.title}</h1>
              <p className="m-0 mt-4 max-w-[34ch] text-[18px] leading-[1.5] text-ink md:text-[20px]">{story.summary}</p>
            </div>
            <div className={`${TILE} ${plate()} ${PAD} lg:col-span-5`}>
              <dl className="m-0 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-[96px_1fr]">
                {story.facts.map(([term, value]) => (
                  <div key={term} className="contents">
                    <dt className="text-[14px] leading-[1.6] font-semibold text-muted">{term}</dt>
                    <dd className="m-0 -mt-3 text-[16px] leading-[1.6] text-ink md:mt-0">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="m-0 mt-5 rounded-xl bg-white/80 px-4 py-3 text-[14px] leading-[1.5] text-[#4a4a4f]">{story.disclosure}</p>
            </div>
          </header>

          <nav aria-label="On this page" className="mt-6">
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
              <Section key={section.id} section={section} n={i + 1} first={i === 0} />
            ))}
          </div>

          {story.more && <Collapsed id="more-screens" heading={story.more.heading} shots={story.more.shots} summary="Show more screens" />}
          {story.visualSystem && (
            <Collapsed id="visual-system" heading={story.visualSystem.heading} shots={story.visualSystem.shots} summary="Show the logo construction" />
          )}

          {story.closing && (
            <section aria-labelledby="closing" className={`${TILE} mt-[clamp(48px,7vw,96px)] bg-[var(--accent)] ${PAD} text-white`}>
              <h2 id="closing" className="m-0 text-[24px] leading-[1.25] font-semibold tracking-[-0.015em] md:text-[28px]">{story.closing.heading}</h2>
              <p className="m-0 mt-4 max-w-[680px] text-[16px] leading-[1.6] md:text-[18px]">{story.closing.copy}</p>
            </section>
          )}

          <nav aria-labelledby="more-work" className="mt-[clamp(48px,7vw,96px)]">
            <h2 id="more-work" className="m-0 text-[24px] leading-[1.25] font-semibold tracking-[-0.015em] text-ink md:text-[28px]">More work</h2>
            <ul className={`${GRID} m-0 mt-6 list-none p-0`}>
              {related.map((slug) => (
                <li key={slug} className="lg:col-span-6">
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

// One numbered section as a bento group. The first section's screen is the page's hero: the largest tile, full
// width. Later screens sit beside their text tile.
function Section({ section, n, first }: { section: StorySection; n: number; first: boolean }) {
  const num = String(n).padStart(2, '0')
  const besideText = !!section.primary && !first
  const before = section.set?.filter((s) => s.label === 'Before') ?? []
  const rest = section.set?.filter((s) => s.label !== 'Before') ?? []
  const details = section.details ?? []
  // Steps of a flow and narrow components (class cards, phones) share a row; wide screens take the full width.
  const sideBySide = section.setLayout === 'row' || (rest.length > 1 && rest.every((s) => s.maxWidth))
  const setSpan = !sideBySide ? 'lg:col-span-12' : rest.length === 2 ? 'lg:col-span-6' : 'lg:col-span-4'
  return (
    <section id={section.id} aria-labelledby={`${section.id}-h`} className={`${GRID} mt-[clamp(48px,7vw,96px)] scroll-mt-24`}>
      <div className={`${TILE} flex flex-col justify-end bg-[var(--accent)] ${PAD} text-white ${besideText ? 'lg:col-span-4' : 'lg:col-span-12'}`}>
        <p aria-hidden="true" className="m-0 font-title text-[14px] leading-none font-semibold tracking-[0.08em] text-white/80">{num}</p>
        <div className={besideText ? '' : 'lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-end lg:gap-12'}>
          <h2 id={`${section.id}-h`} className="m-0 mt-3 text-[24px] leading-[1.2] font-semibold tracking-[-0.015em] md:text-[32px]">
            <span className="sr-only">{num}. </span>
            {section.heading}
          </h2>
          {section.caption && <p className="m-0 mt-4 max-w-[680px] text-[16px] leading-[1.6] text-white">{section.caption}</p>}
        </div>
      </div>

      {section.primary && (
        <ShotTile shot={section.primary} span={first ? 'lg:col-span-12' : 'lg:col-span-8'} eager={first} />
      )}

      {before.map((shot) => (
        <ShotTile key={shot.src} shot={shot} span={before.length > 1 ? 'lg:col-span-6' : 'lg:col-span-12'} labelled eager={first} />
      ))}
      {rest.map((shot) => (
        <ShotTile key={shot.src} shot={shot} span={setSpan} labelled eager={first} />
      ))}

      {details.map((shot) => (
        <DetailTile key={shot.src} shot={shot} />
      ))}
      {section.detailCaption && (
        <p className="m-0 max-w-[680px] px-1 text-[16px] leading-[1.6] text-ink lg:col-span-12">{section.detailCaption}</p>
      )}

      {section.demo && (
        <div className="lg:col-span-12">
          <StoryDemo kind={section.demo} />
        </div>
      )}
    </section>
  )
}

// A screen in its own tile, at its natural ratio (never cropped by CSS), with the full-size control.
function ShotTile({ shot, span, eager = false, labelled = false }: { shot: Shot; span: string; eager?: boolean; labelled?: boolean }) {
  return (
    <figure className={`${TILE} ${plate(shot.dark)} ${PAD} m-0 flex flex-col ${span}`}>
      {labelled && shot.label && (
        <figcaption className={`mb-3 text-[14px] leading-[1.4] font-semibold ${shot.dark ? 'text-white' : 'text-ink'}`}>{shot.label}</figcaption>
      )}
      <div className="flex flex-1 items-center justify-center">
        <Img shot={shot} eager={eager} />
      </div>
      <div className="mt-2 flex justify-end">
        <ViewButton shot={shot} dark={shot.dark} />
      </div>
    </figure>
  )
}

// A close-up with its caption beside it (under it on phones). Each close-up has a full-width tile, so the crop stays
// large enough to read; the caption column sits to its right.
function DetailTile({ shot }: { shot: Shot }) {
  return (
    <figure className={`${TILE} ${plate(shot.dark)} ${PAD} m-0 grid grid-cols-1 items-center gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(180px,300px)] sm:gap-8 lg:col-span-12`}>
      <div className="mx-auto w-full max-w-[860px]">
        <Img shot={shot} />
      </div>
      <div>
        <figcaption className={`text-[14px] leading-[1.55] ${shot.dark ? 'text-white' : 'text-ink'}`}>
          {shot.label && <strong className="block text-[15px] font-semibold">{shot.label}</strong>}
          {shot.caption && <span className="mt-1 block text-[15px] leading-[1.55]">{shot.caption}</span>}
        </figcaption>
        <div className="-ml-2 mt-1">
          <ViewButton shot={shot} dark={shot.dark} />
        </div>
      </div>
    </figure>
  )
}

function Img({ shot, eager = false }: { shot: Shot; eager?: boolean }) {
  return (
     
    <img
      className={`mx-auto block h-auto w-full rounded-[10px] object-contain ${shot.dark ? 'ring-1 ring-white/10' : 'ring-1 ring-black/[0.06]'}`}
      style={shot.maxWidth ? { maxWidth: shot.maxWidth } : undefined}
      src={shot.src}
      width={shot.width}
      height={shot.height}
      alt={shot.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}

function Collapsed({ id, heading, shots, summary }: { id: string; heading: string; shots: Shot[]; summary: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="mt-[clamp(48px,7vw,96px)] scroll-mt-24">
      <h2 id={`${id}-h`} className="m-0 text-[24px] leading-[1.25] font-semibold tracking-[-0.015em] text-ink md:text-[28px]">{heading}</h2>
      <details className="group mt-4">
        <summary className={`inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-line px-4 text-[15px] font-medium text-ink hover:border-ink [&::-webkit-details-marker]:hidden ${focus}`}>
          <span aria-hidden="true" className="transition-transform group-open:rotate-90 motion-reduce:transition-none">›</span>
          {summary}
        </summary>
        <div className={`${GRID} mt-6`}>
          {shots.map((shot) => (
            <ShotTile key={shot.src} shot={shot} span="lg:col-span-12" labelled />
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
    <Link href={`/work/${slug}`} className={`${TILE} ${plate()} group block p-3 text-ink no-underline ${focus}`}>
      {thumb && (
        <div className={`aspect-[16/10] overflow-hidden rounded-[14px] ${thumb.dark ? 'bg-[#0B0B10]' : 'bg-white'}`}>
          { }
          <img src={thumb.src} alt="" width={thumb.width} height={thumb.height} loading="lazy" decoding="async" className="block h-full w-full object-contain" />
        </div>
      )}
      <p className="m-0 mt-4 px-2 text-[14px] font-semibold text-[var(--accent)]">{story.category}</p>
      <p className="m-0 mt-1 px-2 pb-2 text-[20px] leading-[1.3] font-semibold tracking-[-0.01em] group-hover:underline">{story.title}</p>
    </Link>
  )
}
