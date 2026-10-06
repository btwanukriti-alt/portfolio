'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { PROJECTS, caseStudyHref } from '@/data/projects'
import { Reveal, SplitReveal } from './Reveal'
import { useCardMagnet } from './useCardMagnet'
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from '@/lib/gsap'

// Work: a section header, then stacked edge-to-edge video cards, each exactly one screen, no
// corners or gaps. Each card is position: sticky at the top of the window, so it pins while the
// next slides up over it; useCardMagnet pulls scrolling to whole cards, one per gesture. Each
// card is the project's looping showcase video (or its cover still), covering the card, with a
// small caption linking to the case study. Over a card, the mouse pointer becomes a black "Open"
// label that trails it.

// Selection handles: corners and edge midpoints (x%, y%).
const HANDLES = [
  [0, 0],
  [50, 0],
  [100, 0],
  [100, 50],
  [100, 100],
  [50, 100],
  [0, 100],
  [0, 50],
]

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
  const cursor = useRef<HTMLDivElement>(null)
  const follow = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null)
  useCardMagnet(stack, PROJECTS.length)

  // The "Open" cursor: eased toward the pointer, shown while it's over a card.
  useGSAP(() => {
    const el = cursor.current
    if (!el) return
    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0 })
    const lag = reducedMotion() ? 0 : 0.35
    follow.current = {
      x: gsap.quickTo(el, 'x', { duration: lag, ease: 'power3' }),
      y: gsap.quickTo(el, 'y', { duration: lag, ease: 'power3' }),
    }
  })
  const showCursor = (e: React.PointerEvent, on: boolean) => {
    if (e.pointerType !== 'mouse' || !cursor.current) return
    if (on) {
      // Start at the pointer, so the label doesn't slide in from where it last left.
      gsap.set(cursor.current, { x: e.clientX, y: e.clientY })
      follow.current?.x(e.clientX)
      follow.current?.y(e.clientY)
    }
    gsap.to(cursor.current, {
      scale: on ? 1 : 0.6,
      autoAlpha: on ? 1 : 0,
      duration: 0.3,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }
  const moveCursor = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    follow.current?.x(e.clientX)
    follow.current?.y(e.clientY)
  }

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
            className="sticky top-0 isolate flex h-screen h-svh w-full items-center justify-center overflow-hidden bg-paper [--covered-dim:0]"
          >
            {/* Every video sits in the same 16:9 frame, inset from all sides, with a black Figma
                selection around it (border, handles, frame name and size tag). */}
            <div className="relative aspect-video w-[min(100%-2*clamp(20px,6vw,96px),(100svh-2*clamp(72px,12vh,128px))*16/9)]">
              <div className="absolute bottom-full left-0 mb-2 flex items-center gap-2 font-hero text-[12px] leading-none font-medium whitespace-nowrap text-ink">
                <span className="text-faint tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="m-0 text-[12px] leading-none font-medium">{project.title}</h3>
              </div>
              <Link
                href={caseStudyHref(project.slug)}
                tabIndex={-1}
                aria-hidden="true"
                onPointerEnter={(e) => showCursor(e, true)}
                onPointerMove={moveCursor}
                onPointerLeave={(e) => showCursor(e, false)}
                className="absolute inset-0 block overflow-hidden bg-soft [@media(hover:hover)]:cursor-none"
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
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 border border-ink" />
              {HANDLES.map(([x, y]) => (
                <span
                  key={`${x}-${y}`}
                  aria-hidden="true"
                  className="pointer-events-none absolute size-[7px] -translate-x-1/2 -translate-y-1/2 border border-ink bg-white"
                  style={{ left: `${x}%`, top: `${y}%` }}
                />
              ))}
              <span
                aria-hidden="true"
                className="absolute top-full left-1/2 mt-2.5 -translate-x-1/2 rounded-[4px] bg-ink px-[6px] py-[3px] font-hero text-[11px] leading-none font-medium text-white tabular-nums"
              >
                1920 × 1080
              </span>

              {/* "Open project" under the frame's bottom-right corner (also for keyboard and touch). */}
              <Link
                href={caseStudyHref(project.slug)}
                className="group/btn absolute top-full right-0 z-[1] mt-2.5 inline-flex flex-none items-center gap-2 rounded-full bg-ink px-4 py-[9px] text-[13px] leading-none font-medium whitespace-nowrap text-white no-underline transition-[background-color] duration-200 ease-[ease] hover:bg-[#2a2a2d] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent motion-reduce:transition-none max-[640px]:px-3 max-[640px]:py-2 max-[640px]:text-[13px]"
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

      {/* The "Open" cursor (fixed; positioned by GSAP). */}
      <div
        ref={cursor}
        aria-hidden="true"
        className="pointer-events-none invisible fixed top-0 left-0 z-[60] flex items-center gap-2 rounded-[2px] bg-ink px-5 py-3 text-[14px] leading-none font-medium tracking-[0.01em] text-white opacity-0 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]"
      >
        Open
        <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M3 11L11 3M5 3h6v6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  )
}
