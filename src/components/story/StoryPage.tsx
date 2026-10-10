import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { STORIES, type Shot, type Story, type StorySection } from '@/data/stories'
import { PROJECTS, projectBySlug } from '@/data/projects'
import { caseStudyByKey } from '@/data/caseStudies'
import SiteHeader from '../SiteHeader'
import ShowcaseVideo from '../ShowcaseVideo'
import Contact from '../Contact'
import { ViewButton, ViewerProvider } from './Viewer'
import { StoryDemo } from './Demos'

// The case-study template shared by all five projects, in the earlier bento style: the project's own colours as CSS
// variables, a large title with the summary beside it, a facts row, the looping showcase, then each numbered section
// as bento cards on a 12-column grid: a deep text card (number, heading, caption), its screen in the largest card,
// and close-ups on tinted cards with the caption beside the image. Below 1024px every card takes the full width.
// No reveal animations: every image shows as soon as it loads.

const focus = 'focus-visible:rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]'
const GRID = 'grid grid-cols-1 gap-[clamp(12px,1.4vw,20px)] lg:grid-cols-12'
const CARD = 'min-w-0 rounded-[clamp(22px,2.4vw,36px)]'
const PAD = 'p-[clamp(18px,2.6vw,40px)]'
// Card grounds of the earlier bento pages.
const SURFACE = {
  plate: 'bg-[linear-gradient(180deg,#F8F9FC,#ECEDF3)] shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.95)]',
  tint: 'bg-[var(--c-soft)]',
  deep: 'bg-[radial-gradient(120%_140%_at_85%_0%,var(--c-accent)_0%,var(--c-deep)_70%)] text-white',
  night: 'bg-[radial-gradient(90%_70%_at_100%_0%,rgba(124,92,255,0.16),transparent_70%),linear-gradient(180deg,#121218,#0B0B0F)] ring-1 ring-white/[0.06] text-white',
}
// Dark screens on a dark card need an edge.
const FRAME = 'ring-1 ring-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.45)]'

export default function StoryPage({ story }: { story: Story }) {
  const project = projectBySlug(story.slug)
  // The two project paragraphs of the first version (src/data/caseStudies.ts).
  const paragraphs = caseStudyByKey(story.slug === 'gym-crm' ? 'pulsefit-crm' : story.slug)?.paragraphs ?? []
  const vars = {
    '--accent': story.accent,
    '--c-accent': story.brand.accent,
    '--c-deep': story.brand.deep,
    '--c-soft': story.brand.soft,
    '--c-tint': story.brand.tint,
    '--c-pop': story.brand.pop,
  } as CSSProperties
  const contents: [string, string][] = [
    ['Overview', 'overview'],
    ['Key flows', 'key-flows'],
    ...(story.more ? ([[story.more.heading, 'more-screens']] as [string, string][]) : []),
    ...(story.visualSystem ? ([[story.visualSystem.heading, 'visual-system']] as [string, string][]) : []),
  ]
  const order = PROJECTS.map((p) => p.slug)
  const related = [...story.related].sort((a, b) => order.indexOf(a) - order.indexOf(b))

  return (
    <div className="min-h-screen overflow-x-clip bg-paper" style={vars}>
      <SiteHeader />
      <ViewerProvider>
        <main className="mx-auto max-w-[var(--max)] px-[var(--gutter)] pt-[120px] pb-[clamp(80px,12vh,140px)]">
          <Link
            href="/#work"
            className={`inline-flex min-h-11 items-center text-[15px] leading-none font-medium text-muted no-underline transition-colors duration-200 hover:text-ink ${focus}`}
          >
            ← All work
          </Link>

          <header id="overview" className="mt-[clamp(20px,4vh,48px)] grid scroll-mt-24 grid-cols-1 gap-y-8 min-[901px]:grid-cols-[3fr_2fr] min-[901px]:items-end min-[901px]:gap-x-16">
            <div>
              <p className="m-0 inline-flex rounded-full bg-[var(--c-soft)] px-4 py-[7px] text-[13px] leading-none font-semibold text-[var(--accent)]">{story.category}</p>
              <h1 className="m-0 mt-6 font-title text-[clamp(40px,5.5vw,84px)] leading-[1] font-bold tracking-[-0.035em] text-ink">{story.title}</h1>
            </div>
            <p className="m-0 max-w-[24ch] text-[clamp(20px,2.4vw,36px)] leading-[1.25] font-medium tracking-[-0.02em] text-ink">{story.summary}</p>
          </header>

          <div className="mt-[clamp(36px,6vh,64px)] grid grid-cols-1 gap-x-10 gap-y-6 border-t border-line pt-7 min-[701px]:grid-cols-2 min-[1101px]:grid-cols-4">
            {story.facts.map(([term, value]) => (
              <dl key={term} className="m-0 flex flex-col gap-2">
                <dt className="text-[12px] leading-none font-semibold tracking-[0.08em] text-[var(--accent)] uppercase">{term}</dt>
                <dd className="m-0 max-w-[34ch] text-[15px] leading-[1.5] font-medium text-ink">{value}</dd>
              </dl>
            ))}
          </div>

          {/* The project's showcase, full window width at 16:9; on a portrait screen 9:16, centred. */}
          {project?.showcase && (
            <div className="relative isolate mx-[calc(50%-50vw)] mt-[clamp(48px,8vh,88px)] aspect-video w-screen overflow-hidden bg-[var(--c-tint)] portrait:mx-[calc(50%-min(50vw,24.1875svh))] portrait:aspect-[9/16] portrait:w-[min(100vw,48.375svh)]">
              <ShowcaseVideo className="pointer-events-none absolute inset-0 h-full w-full border-0" src={project.showcase} title={`${story.title} showcase`} />
            </div>
          )}

          {paragraphs.length > 0 && (
            <div className="mt-[clamp(56px,9vh,104px)] grid grid-cols-1 gap-4 min-[901px]:grid-cols-[minmax(160px,1fr)_3fr]">
              <p className="m-0 text-[15px] leading-[1.4] font-medium text-muted">The project</p>
              <div className="flex max-w-[44ch] flex-col gap-6 text-[clamp(19px,1.7vw,26px)] leading-[1.5] font-normal text-ink">
                {paragraphs.map((text) => (
                  <p key={text.slice(0, 24)} className="m-0">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          )}

          <p className="m-0 mt-[clamp(48px,8vh,88px)] max-w-[680px] text-[14px] leading-[1.5] text-muted">{story.disclosure}</p>

          <nav aria-label="On this page" className="mt-4">
            <ul className="m-0 flex list-none flex-wrap gap-x-2 gap-y-1 p-0">
              {contents.map(([label, id]) => (
                <li key={id}>
                  <a href={`#${id}`} className={`inline-flex min-h-11 items-center rounded-full bg-[var(--c-soft)] px-4 text-[14px] font-medium text-[var(--accent)] no-underline hover:bg-[var(--c-tint)] ${focus}`}>
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
            <section aria-labelledby="closing" className={`${CARD} ${SURFACE.deep} ${PAD} mt-[clamp(48px,7vw,96px)]`}>
              <h2 id="closing" className="m-0 text-[clamp(28px,2.7vw,44px)] leading-[1.08] font-light tracking-[-0.025em]">{story.closing.heading}</h2>
              <p className="m-0 mt-4 max-w-[680px] text-[clamp(16px,1.2vw,18px)] leading-[1.6] text-white/90">{story.closing.copy}</p>
            </section>
          )}

          <nav aria-labelledby="more-work" className="mt-[clamp(48px,7vw,96px)] border-t border-line pt-8">
            <h2 id="more-work" className="m-0 text-[15px] leading-[1.4] font-medium text-muted">More work</h2>
            <ul className={`${GRID} m-0 mt-5 list-none p-0`}>
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

// One numbered section as a bento group. The first section's screen is the page's hero: the largest card, full
// width. Later screens sit beside their text card.
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
      <div className={`${CARD} ${SURFACE.deep} ${PAD} flex flex-col justify-end ${besideText ? 'lg:col-span-4' : 'lg:col-span-12'}`}>
        <p aria-hidden="true" className="m-0 text-[12px] leading-none font-semibold tracking-[0.1em] text-white/75 uppercase">{num}</p>
        <div className={besideText ? '' : 'lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-end lg:gap-12'}>
          <h2 id={`${section.id}-h`} className="m-0 mt-4 text-[clamp(28px,2.7vw,44px)] leading-[1.08] font-light tracking-[-0.025em]">
            <span className="sr-only">{num}. </span>
            {section.heading}
          </h2>
          {section.caption && <p className="m-0 mt-4 max-w-[44ch] text-[clamp(16px,1.15vw,17px)] leading-[1.55] text-white/90">{section.caption}</p>}
        </div>
      </div>

      {section.primary && <ShotCard shot={section.primary} span={first ? 'lg:col-span-12' : 'lg:col-span-8'} eager={first} />}

      {before.map((shot) => (
        <ShotCard key={shot.src} shot={shot} span={before.length > 1 ? 'lg:col-span-6' : 'lg:col-span-12'} labelled eager={first} />
      ))}
      {rest.map((shot) => (
        <ShotCard key={shot.src} shot={shot} span={setSpan} labelled eager={first} />
      ))}

      {details.map((shot) => (
        <DetailCard key={shot.src} shot={shot} />
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

// A screen on its own card, at its natural ratio (never cropped by CSS), with the full-size control.
function ShotCard({ shot, span, eager = false, labelled = false }: { shot: Shot; span: string; eager?: boolean; labelled?: boolean }) {
  return (
    <figure className={`${CARD} ${shot.dark ? SURFACE.night : SURFACE.plate} ${PAD} m-0 flex min-h-[clamp(240px,24vw,380px)] flex-col ${span}`}>
      {labelled && shot.label && (
        <figcaption className={`mb-3 text-[12px] leading-none font-semibold tracking-[0.1em] uppercase ${shot.dark ? 'text-white/75' : 'text-[var(--accent)]'}`}>
          {shot.label}
        </figcaption>
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

// A close-up on a tinted card with its caption beside it (under it on phones).
function DetailCard({ shot }: { shot: Shot }) {
  return (
    <figure
      className={`${CARD} ${shot.dark ? SURFACE.night : SURFACE.tint} ${PAD} m-0 grid grid-cols-1 items-center gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(180px,300px)] sm:gap-8 lg:col-span-12`}
    >
      <div className="mx-auto w-full max-w-[860px]">
        <Img shot={shot} />
      </div>
      <div>
        <figcaption className={`text-[14px] leading-[1.55] ${shot.dark ? 'text-white' : 'text-ink'}`}>
          {shot.label && <strong className="block text-[15px] font-semibold">{shot.label}</strong>}
          {shot.caption && <span className="mt-1 block text-[15px] leading-[1.55]">{shot.caption}</span>}
        </figcaption>
        <div className="mt-1 -ml-2">
          <ViewButton shot={shot} dark={shot.dark} />
        </div>
      </div>
    </figure>
  )
}

function Img({ shot, eager = false }: { shot: Shot; eager?: boolean }) {
  return (
     
    <img
      className={`mx-auto block h-auto w-full rounded-[clamp(8px,1vw,14px)] object-contain ${shot.dark ? FRAME : 'shadow-[0_18px_40px_-24px_rgba(20,12,60,0.35)]'}`}
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
      <h2 id={`${id}-h`} className="m-0 text-[clamp(28px,2.7vw,44px)] leading-[1.08] font-light tracking-[-0.025em] text-ink">{heading}</h2>
      <details className="group mt-4">
        <summary className={`inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full bg-[var(--c-soft)] px-4 text-[15px] font-medium text-[var(--accent)] hover:bg-[var(--c-tint)] [&::-webkit-details-marker]:hidden ${focus}`}>
          <span aria-hidden="true" className="transition-transform group-open:rotate-90 motion-reduce:transition-none">›</span>
          {summary}
        </summary>
        <div className={`${GRID} mt-6`}>
          {shots.map((shot) => (
            <ShotCard key={shot.src} shot={shot} span="lg:col-span-12" labelled />
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
    <Link href={`/work/${slug}`} className={`${CARD} group block p-3 text-ink no-underline ${focus}`} style={{ background: story.brand.soft }}>
      {thumb && (
        <div className="aspect-[16/10] overflow-hidden rounded-[clamp(14px,1.6vw,24px)]" style={{ background: thumb.dark ? '#0B0B10' : story.brand.tint }}>
          { }
          <img src={thumb.src} alt="" width={thumb.width} height={thumb.height} loading="lazy" decoding="async" className="block h-full w-full object-contain p-3" />
        </div>
      )}
      <p className="m-0 mt-4 px-2 text-[14px] font-semibold" style={{ color: story.accent }}>
        {story.category}
      </p>
      <p className="m-0 mt-1 px-2 pb-2 text-[20px] leading-[1.3] font-semibold tracking-[-0.01em] group-hover:underline">{story.title}</p>
    </Link>
  )
}
