'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { PROJECTS, caseStudyHref } from '@/data/projects'
import { Reveal, SplitReveal } from './Reveal'
import { useCardMagnet } from './useCardMagnet'
import { ScrollTrigger, useGSAP } from '@/lib/gsap'

// Work: a section header, then stacked edge-to-edge video cards, each exactly one screen, no
// corners or gaps. Each card is position: sticky at the top of the window, so it pins while the
// next slides up over it; useCardMagnet pulls scrolling to whole cards, one per gesture. Each
// card is the project's looping showcase video (or its cover still), covering the card, with a
// small caption linking to the case study.

// How much a card fades once the next one fully covers it.
const COVERED_DIM = 0.5
// A card's video plays only while it's on screen and not mostly hidden under the next card.
const PLAYING_COVERAGE = 0.6

export default function Work() {
  const section = useRef<HTMLElement>(null)
  const cards = useRef<(HTMLElement | null)[]>([])
  const videos = useRef<(HTMLIFrameElement | null)[]>([])
  const playing = useRef<boolean[]>([])
  const stack = useRef<HTMLDivElement>(null)
  useCardMagnet(stack, PROJECTS.length)

  // Driven by ScrollTrigger (in step with the smooth scroll): fade each card as the next one
  // slides over it, and play only the videos that can actually be seen.
  useGSAP(
    () => {
      const update = () => {
        const els = cards.current
        els.forEach((card, i) => {
          const next = els[i + 1]
          if (!card) return
          const a = card.getBoundingClientRect()
          let covered = 0
          if (next) {
            const b = next.getBoundingClientRect()
            covered = Math.min(1, Math.max(0, (a.bottom - b.top) / a.height))
          }
          card.style.setProperty('--covered-dim', String(COVERED_DIM * covered))

          const video = videos.current[i]
          const visible = a.bottom > 0 && a.top < window.innerHeight && covered < PLAYING_COVERAGE
          if (video && visible !== playing.current[i]) {
            playing.current[i] = visible
            video.contentWindow?.postMessage(visible ? 'showcase:play' : 'showcase:pause', '*')
          }
        })
      }
      update()
      ScrollTrigger.create({
        trigger: stack.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: update,
        onToggle: update,
        onRefresh: update,
      })
    },
    { scope: section },
  )

  // A video that finishes loading picks up its card's current play state.
  const onVideoLoad = (i: number) => {
    if (playing.current[i]) videos.current[i]?.contentWindow?.postMessage('showcase:play', '*')
  }

  return (
    <section
      ref={section}
      id="work"
      aria-labelledby="work-heading"
      className="relative flex flex-col items-center bg-paper pt-[clamp(80px,14vh,160px)]"
    >
      <header className="mb-[clamp(48px,8vh,96px)] w-[min(100%-2*var(--gutter),var(--max)-2*var(--gutter))]">
        <Reveal as="p" className="m-0 text-[15px] leading-none font-medium text-muted">
          Selected work <span className="text-faint">({String(PROJECTS.length).padStart(2, '0')})</span>
        </Reveal>
        <SplitReveal
          as="h2"
          id="work-heading"
          className="mt-5 mb-0 max-w-[16ch] text-[clamp(36px,5vw,76px)] leading-[1.02] font-medium tracking-[-0.04em] text-ink"
          text="Products I've designed, end to end."
        />
      </header>

      {/* The videos own the screen: the site header stays away while they fill it. */}
      <div ref={stack} className="w-full" data-fullscreen>
        {PROJECTS.map((project, i) => (
          <article
            key={project.slug}
            ref={(el) => {
              cards.current[i] = el
            }}
            className="sticky top-0 isolate h-screen h-svh w-full overflow-hidden bg-soft [--covered-dim:0]"
          >
            <Link
              href={caseStudyHref(project.slug)}
              tabIndex={-1}
              aria-hidden="true"
              className="absolute inset-0 block focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent"
            >
              {project.showcase ? (
                // The video is purely visual: clicks go to the card's link, scrolling stays with the page.
                <iframe
                  ref={(el) => {
                    videos.current[i] = el
                  }}
                  className="pointer-events-none h-full w-full border-0"
                  src={project.showcase}
                  title={`${project.title} showcase`}
                  loading="lazy"
                  tabIndex={-1}
                  onLoad={() => onVideoLoad(i)}
                />
              ) : (
                <img className="h-full w-full object-cover" src={project.card} alt="" loading="lazy" />
              )}
            </Link>

            {/* Small white caption in the bottom-left corner, clear of the videos' centred headlines. */}
            <div className="absolute bottom-[clamp(12px,2.2%,28px)] left-[clamp(12px,2.2%,28px)] z-[1] flex max-w-[calc(100%-24px)] items-center gap-[14px] rounded-full bg-white/92 py-[7px] pr-[7px] pl-[18px] shadow-[0_16px_40px_-16px_rgba(0,0,0,0.45)] backdrop-blur-[14px] max-[640px]:gap-[10px] max-[640px]:py-[5px] max-[640px]:pr-[5px] max-[640px]:pl-[14px]">
              <span className="text-[13px] leading-none font-medium text-faint tabular-nums max-[640px]:hidden">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="m-0 truncate text-[17px] leading-[1.2] font-semibold tracking-[-0.02em] text-ink max-[640px]:text-[14px]">
                {project.title}
              </h3>
              <Link
                href={caseStudyHref(project.slug)}
                className="group/btn inline-flex flex-none items-center gap-2 rounded-full bg-ink px-4 py-[11px] text-[14px] leading-none font-medium whitespace-nowrap text-white no-underline transition-[background-color] duration-200 ease-[ease] hover:bg-[#2a2a2d] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent motion-reduce:transition-none max-[640px]:px-3 max-[640px]:py-2 max-[640px]:text-[13px]"
              >
                Open project
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  aria-hidden="true"
                  className="[transition:transform_400ms_var(--ease-out-expo)] group-hover/btn:[transform:translate(2px,-2px)] motion-reduce:transition-none"
                >
                  <path d="M3 11L11 3M5 3h6v6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                </svg>
              </Link>
            </div>

            {/* Fades a card as the next one covers it. */}
            <div className="pointer-events-none absolute inset-0 z-[2] bg-white opacity-[var(--covered-dim)]" aria-hidden="true" />
          </article>
        ))}
      </div>
    </section>
  )
}
