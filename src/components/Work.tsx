'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { PROJECTS, caseStudyHref } from '@/data/projects'
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from '@/lib/gsap'
import { getLenis } from './SmoothScroll'

// Work: the projects as a Figma auto-layout row. One card is set to "fill" and takes the room;
// the others are thin strips of solid colour (each showcase's background) on either side. The
// section pins for a stretch of scrolling per project. The page scrolls freely (no snapping); on
// reaching the next project's stretch, the fill moves over on its own: the next card widens to
// fill while the one before compacts back to a strip. The fill card carries the black selection
// (border, handles, live size), plays its looping showcase, and over it the pointer becomes a
// black "Open" label; clicking a strip scrolls to that project.
//
// The first time the section arrives, the page is held still while its heading types in at the
// centre and a Figma cursor drags the row's frame out from the top-left corner.

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

// The multiplayer cursor that draws the frame (same as the hero's).
const DRAW_CURSOR = '#7B61FF'

const WORK_TITLE = "Products I've designed, end to end."

const N = PROJECTS.length
// Scrolling per project, as a share of the window height.
const SEGMENT = 0.7

// Row geometry for a window size: strip width, auto-layout gap, and the fill card's 16:9 size.
type Row = { strip: number; gap: number; fillW: number; h: number; w: number }
function rowFor(vw: number, vh: number): Row {
  const mobile = vw < 720
  const strip = mobile ? 10 : Math.min(26, Math.max(16, vw * 0.015))
  const gap = mobile ? 4 : 8
  const padX = Math.min(96, Math.max(16, vw * 0.06))
  const padY = Math.min(140, Math.max(84, vh * 0.14))
  const rest = (N - 1) * (strip + gap)
  const fillW = Math.max(160, Math.min(vw - 2 * padX - rest, ((vh - 2 * padY) * 16) / 9))
  return { strip, gap, fillW, h: (fillW * 9) / 16, w: fillW + rest }
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

// The intro's pieces, found by data attribute: the drawn box (border, handles, size tag), the row
// it reveals, the button that settles in after, and the cursor that draws it.
const parts = (f: HTMLElement) => {
  const q = gsap.utils.selector(f)
  return {
    box: q('[data-draw-box]')[0] as HTMLElement,
    content: q('[data-draw-content]')[0] as HTMLElement,
    size: q('[data-draw-size]')[0] as HTMLElement,
    cursor: q('[data-cursor]')[0] as HTMLElement,
    handles: q('[data-draw-handle]'),
    fades: q('[data-fade]'),
  }
}

function hideFrame(f: HTMLElement) {
  const { box, content, size, cursor, handles, fades } = parts(f)
  gsap.set(box, { width: 0, height: 0, autoAlpha: 1 })
  gsap.set(content, { clipPath: 'inset(0 100% 100% 0)' })
  gsap.set([size, cursor, ...handles], { autoAlpha: 0 })
  gsap.set(handles, { scale: 0 })
  gsap.set(fades, { autoAlpha: 0, y: 6 })
}

// Holds the page still (no wheel, touch or key scrolling) while the frame draws.
function lockScroll(on: boolean) {
  const lenis = getLenis()
  document.documentElement.style.overflow = on ? 'hidden' : ''
  if (on) lenis?.stop()
  else lenis?.start()
}

// The section intro: the heading types in at the centre of the screen, lifts away, and the cursor
// draws the row's frame. The page is held still until the frame is drawn.
function intro(stage: HTMLElement, frame: HTMLElement, trackTop: number) {
  const q = gsap.utils.selector(stage)
  const title = q('[data-title]')[0] as HTMLElement
  const label = q('[data-title-label]')[0] as HTMLElement
  const typed = q('[data-typed]')[0] as HTMLElement
  const caret = q('[data-caret]')[0] as HTMLElement
  lockScroll(true)
  // Settle the section exactly on screen first.
  getLenis()?.scrollTo(trackTop, { duration: 0.7, easing: (x) => 1 - Math.pow(1 - x, 3), force: true })

  const chars = { n: 0 }
  const typeAt = 0.7
  const typeFor = WORK_TITLE.length * 0.045
  const leave = typeAt + typeFor + 0.7
  gsap
    .timeline()
    .set(title, { autoAlpha: 1 }, 0)
    .fromTo(label, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.35)
    .set(caret, { visibility: 'visible', animation: 'none' }, typeAt - 0.15)
    .to(
      chars,
      {
        n: WORK_TITLE.length,
        duration: typeFor,
        ease: 'none',
        onUpdate: () => void (typed.textContent = WORK_TITLE.slice(0, Math.round(chars.n))),
      },
      typeAt,
    )
    .set(caret, { animation: '' }, typeAt + typeFor)
    // The heading lifts away, and the frame is drawn in its place.
    .to(title, { autoAlpha: 0, y: -28, duration: 0.55, ease: 'power3.in' }, leave)
    .add(() => drawFrame(frame, () => lockScroll(false)), leave + 0.35)
}

function drawFrame(f: HTMLElement, onDrawn?: () => void) {
  const { box, content, size, cursor, handles, fades } = parts(f)
  const W = f.offsetWidth
  const H = f.offsetHeight
  // The frame's size in the showcase's units (the fill card is 1920 wide).
  const fill = f.querySelector<HTMLElement>('[data-card]')?.offsetWidth || W
  const fw = Math.round((1920 * W) / fill)
  const p = { w: 0, h: 0 }
  const render = () => {
    box.style.width = `${p.w * 100}%`
    box.style.height = `${p.h * 100}%`
    content.style.clipPath = `inset(0 ${(1 - p.w) * 100}% ${(1 - p.h) * 100}% 0)`
    size.textContent = `${Math.round(fw * p.w)} × ${Math.round(1080 * p.h)}`
    gsap.set(cursor, { x: p.w * W, y: p.h * H })
  }
  const press = 0.65
  const drag = press + 0.12
  const release = drag + 1.15
  gsap
    .timeline({ onComplete: () => void (content.style.clipPath = '') })
    // The cursor glides in to the frame's top-left corner and presses...
    .set(cursor, { x: -W * 0.08, y: H * 0.3, scale: 1 }, 0)
    .to(cursor, { autoAlpha: 1, duration: 0.25, ease: 'power1.out' }, 0)
    .to(cursor, { x: 0, y: 0, duration: 0.6, ease: 'power3.inOut' }, 0)
    .to(cursor, { scale: 0.86, duration: 0.1, ease: 'power2.out' }, press)
    // ...drags the frame out to full size, its dimensions counting up beneath it...
    .set(size, { autoAlpha: 1 }, drag)
    .to(p, { w: 1, duration: 1.15, ease: 'power3.inOut', onUpdate: render }, drag)
    .to(p, { h: 1, duration: 1.15, ease: 'power2.inOut', onUpdate: render }, drag)
    // ...and lets go: handles pop on, then the selection passes to the fill card, the button
    // settles, and the cursor drifts off.
    .to(cursor, { scale: 1, duration: 0.2, ease: 'back.out(3)' }, release)
    .call(() => onDrawn?.(), [], release)
    .to(handles, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(3)', stagger: 0.03 }, release)
    .to(box, { autoAlpha: 0, duration: 0.45, ease: 'power2.out' }, release + 0.7)
    .to(fades, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, release + 0.3)
    .to(cursor, { x: W + 40, y: H + 30, duration: 0.8, ease: 'power2.in' }, release + 0.3)
    .to(cursor, { autoAlpha: 0, duration: 0.3 }, release + 0.8)
}

export default function Work() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const cards = useRef<(HTMLDivElement | null)[]>([])
  const videos = useRef<(HTMLIFrameElement | null)[]>([])
  const playing = useRef<boolean[]>([])
  const activeRef = useRef(0)
  const openBtn = useRef<HTMLAnchorElement>(null)
  const cursor = useRef<HTMLDivElement>(null)
  const hovered = useRef(-1)
  const follow = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null)

  // The "Open" cursor: eased toward the pointer, shown while it's over the fill card.
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
  const setCursor = (on: boolean) => {
    if (!cursor.current) return
    gsap.to(cursor.current, {
      scale: on ? 1 : 0.6,
      autoAlpha: on ? 1 : 0,
      duration: 0.3,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }
  const enterCard = (e: React.PointerEvent, i: number) => {
    if (e.pointerType !== 'mouse' || !cursor.current) return
    hovered.current = i
    // Start at the pointer, so the label doesn't slide in from where it last left.
    gsap.set(cursor.current, { x: e.clientX, y: e.clientY })
    follow.current?.x(e.clientX)
    follow.current?.y(e.clientY)
    setCursor(i === activeRef.current)
  }
  const leaveCard = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    hovered.current = -1
    setCursor(false)
  }
  const moveCursor = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    follow.current?.x(e.clientX)
    follow.current?.y(e.clientY)
  }

  // A strip glides the page to its project instead of opening it.
  const goTo = (e: React.MouseEvent, i: number) => {
    if (i === activeRef.current || !track.current) return
    e.preventDefault()
    const y = track.current.getBoundingClientRect().top + window.scrollY + (i + 0.1) * SEGMENT * window.innerHeight
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(y, { duration: 0.9, easing: (x) => 1 - Math.pow(1 - x, 3) })
    else window.scrollTo({ top: y, behavior: 'instant' })
  }

  // Driven by ScrollTrigger (in step with the smooth scroll): the fill passes along the row with
  // the scroll, and only the fill card's video plays.
  useGSAP(
    () => {
      let row = rowFor(window.innerWidth, window.innerHeight)
      let drawn = reducedMotion()
      if (!drawn && frame.current) hideFrame(frame.current)

      const layout = () => {
        row = rowFor(window.innerWidth, window.innerHeight)
        const f = frame.current
        if (!f) return
        f.style.width = `${row.w}px`
        f.style.height = `${row.h}px`
        f.style.setProperty('--fill-w', `${row.fillW}px`)
        f.style.setProperty('--gap', `${row.gap}px`)
      }

      // The fill's position along the row (0 = first project filling). It isn't scrubbed by the
      // scroll: once a scroll heads for the next project, the fill moves there on its own, quickly
      // and smoothly, and the card it leaves compacts back to a strip.
      const shown = { pos: 0 }
      let onScreen = false
      let fillTween: gsap.core.Tween | null = null
      let moving = false

      const render = () => {
        cards.current.forEach((card, i) => {
          if (!card) return
          // How much this card fills: 1 for the fill card, 0 for a strip, in between mid-move.
          const fill = clamp01(1 - Math.abs(shown.pos - i))
          const width = row.strip + fill * (row.fillW - row.strip)
          card.style.width = `${width}px`
          card.style.setProperty('--strip', String(clamp01((1 - fill) * 1.8)))
          card.style.setProperty('--sel', String(clamp01((fill - 0.7) / 0.3)))
          const size = card.querySelector<HTMLElement>('[data-size]')
          if (size) size.textContent = `${fill > 0.99 ? 1920 : Math.round((1920 * width) / row.fillW)} × 1080`

          const video = videos.current[i]
          // Only the settled fill card plays: the one leaving pauses at once, the one arriving
          // starts once it has opened, so nothing heavy runs while the cards move.
          const play = onScreen && !moving && i === activeRef.current
          if (video && play !== playing.current[i]) {
            playing.current[i] = play
            video.contentWindow?.postMessage(play ? 'showcase:play' : 'showcase:pause', '*')
          }
        })
      }

      // The "Open project" button and the cards' cursors follow the fill card (set directly, so
      // switching never re-renders the section mid-move).
      const setOpen = (i: number) => {
        const p = PROJECTS[i]
        const btn = openBtn.current
        if (btn) {
          btn.href = caseStudyHref(p.slug)
          btn.setAttribute('aria-label', `Open project: ${p.title}`)
        }
        cards.current.forEach((card, j) => card?.setAttribute('data-active', String(j === i)))
      }
      setOpen(0)

      const update = () => {
        const t = track.current
        if (!t) return
        const r = t.getBoundingClientRect()
        const vh = window.innerHeight
        // Scroll progress in projects (0 = the first project's stretch).
        const pos = -r.top / (SEGMENT * vh)
        onScreen = r.bottom > 0 && r.top < vh

        if (!drawn && stage.current && frame.current && r.top < vh * 0.4 && r.bottom > vh) {
          drawn = true
          intro(stage.current, frame.current, r.top + window.scrollY)
        }

        // Each project owns a stretch of scroll; a third of the way into the next stretch, the
        // fill moves over on its own. The page itself just keeps scrolling (no snapping).
        const next = Math.min(N - 1, Math.max(0, Math.floor(pos + 0.65)))
        if (next !== activeRef.current) {
          activeRef.current = next
          setOpen(next)
          if (hovered.current >= 0) setCursor(hovered.current === next)
          fillTween?.kill()
          moving = true
          fillTween = gsap.to(shown, {
            pos: next,
            duration: reducedMotion() ? 0 : Math.min(1.1, 0.8 + 0.1 * (Math.abs(next - shown.pos) - 1)),
            ease: 'power3.inOut',
            onUpdate: render,
            onComplete: () => {
              moving = false
              render()
            },
          })
        }
        render()
      }

      layout()
      update()
      const onResize = () => {
        layout()
        update()
      }
      window.addEventListener('resize', onResize)
      ScrollTrigger.create({
        trigger: track.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: update,
        onToggle: update,
        onRefresh: onResize,
      })
      return () => {
        window.removeEventListener('resize', onResize)
        lockScroll(false)
      }
    },
    { scope: section },
  )

  // A video that finishes loading picks up its card's current play state.
  const onVideoLoad = (i: number) => {
    if (playing.current[i]) videos.current[i]?.contentWindow?.postMessage('showcase:play', '*')
  }

  return (
    <section ref={section} id="work" aria-labelledby="work-heading" className="relative bg-paper">
      {/* The heading is shown by the intro (typed in at the centre). */}
      <h2 id="work-heading" className="sr-only">
        Selected work: {WORK_TITLE}
      </h2>

      {/* A stretch of scrolling per project; the stage stays pinned while the fill moves. The
          videos own the screen: the site header stays away while they fill it. */}
      <div
        ref={track}
        className="relative w-full"
        style={{ height: `calc(${(N - 1) * SEGMENT * 100}svh + 100svh)` }}
        data-fullscreen
      >
        <div ref={stage} className="sticky top-0 flex h-screen h-svh w-full items-center justify-center overflow-hidden">
          {/* The auto-layout frame (sized by layout()). */}
          <div ref={frame} className="relative">
            <div data-draw-content className="flex h-full w-full gap-[var(--gap)]">
              {PROJECTS.map((project, i) => (
                <div
                  key={project.slug}
                  ref={(el) => {
                    cards.current[i] = el
                  }}
                  data-card
                  className="relative h-full flex-none [contain:layout_style] [--fill:0] [--sel:0] [--strip:1]"
                >
                  <Link
                    href={caseStudyHref(project.slug)}
                    aria-label={`Open ${project.title}`}
                    onClick={(e) => goTo(e, i)}
                    onPointerEnter={(e) => enterCard(e, i)}
                    onPointerMove={moveCursor}
                    onPointerLeave={leaveCard}
                    style={{ background: project.color }}
                    className="absolute inset-0 block cursor-pointer overflow-hidden [@media(hover:hover)]:in-data-[active=true]:cursor-none"
                  >
                    {project.showcase ? (
                      // The video keeps the fill card's size, centred, so a strip shows a slice of it.
                      // It's purely visual: clicks go to the card's link, scrolling stays with the page.
                      <iframe
                        ref={(el) => {
                          videos.current[i] = el
                        }}
                        className="pointer-events-none absolute top-0 left-1/2 h-full w-[var(--fill-w)] max-w-none -translate-x-1/2 border-0"
                        src={project.showcase}
                        title={`${project.title} showcase`}
                        loading="lazy"
                        tabIndex={-1}
                        onLoad={() => onVideoLoad(i)}
                      />
                    ) : (
                      <img
                        className="absolute top-0 left-1/2 h-full w-[var(--fill-w)] max-w-none -translate-x-1/2 object-cover"
                        src={project.card}
                        alt=""
                        loading="lazy"
                      />
                    )}
                    {/* A collapsed card is a solid strip of the showcase's background colour. */}
                    <div aria-hidden="true" className="absolute inset-0 opacity-[var(--strip)]" style={{ background: project.color }} />
                  </Link>

                  {/* The fill card's selection: name above, black border, handles, live size. */}
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[var(--sel)]">
                    <div className="absolute bottom-full left-0 mb-2 flex items-center gap-2 font-hero text-[12px] leading-none font-medium whitespace-nowrap text-ink">
                      <span className="text-faint tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                      <span>{project.title}</span>
                      <span className="rounded-[3px] bg-[#7B61FF]/10 px-[5px] py-[3px] text-[10px] text-[#7B61FF]">Fill</span>
                    </div>
                    <div className="absolute inset-0 border border-ink" />
                    {HANDLES.map(([x, y]) => (
                      <span
                        key={`${x}-${y}`}
                        className="absolute size-[7px] -translate-x-1/2 -translate-y-1/2 border border-ink bg-white"
                        style={{ left: `${x}%`, top: `${y}%` }}
                      />
                    ))}
                    <span
                      data-size
                      className="absolute top-full left-1/2 mt-2.5 -translate-x-1/2 rounded-[4px] bg-ink px-[6px] py-[3px] font-hero text-[11px] leading-none font-medium whitespace-nowrap text-white tabular-nums"
                    >
                      1920 × 1080
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* The box the intro's cursor drags out over the whole row. */}
            <div data-draw-box aria-hidden="true" className="pointer-events-none invisible absolute top-0 left-0 size-full">
              <div className="absolute inset-0 border border-ink" />
              {HANDLES.map(([x, y]) => (
                <span
                  key={`${x}-${y}`}
                  data-draw-handle
                  className="absolute size-[7px] -translate-x-1/2 -translate-y-1/2 border border-ink bg-white"
                  style={{ left: `${x}%`, top: `${y}%` }}
                />
              ))}
              <span
                data-draw-size
                className="absolute top-full left-1/2 mt-2.5 -translate-x-1/2 rounded-[4px] bg-ink px-[6px] py-[3px] font-hero text-[11px] leading-none font-medium whitespace-nowrap text-white tabular-nums"
              />
            </div>

            {/* Anukriti's multiplayer cursor, which draws the frame. */}
            <div
              data-cursor
              aria-hidden="true"
              className="pointer-events-none invisible absolute top-0 left-0 z-[3] origin-top-left opacity-0"
            >
              <svg width="20" height="22" viewBox="0 0 20 22" className="-mt-[2px] -ml-[3px] block drop-shadow-[0_1px_2px_rgba(0,0,0,.2)]">
                <path
                  d="M3 2.2 L3 17.6 L7.2 13.6 L10.1 20 L12.9 18.8 L10.1 12.5 L15.9 12.5 Z"
                  fill={DRAW_CURSOR}
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className="absolute top-[17px] left-[10px] rounded-[6px] rounded-tl-[2px] px-2 py-[4px] font-hero text-[12px] leading-none font-medium whitespace-nowrap text-white shadow-[0_2px_8px_rgba(123,97,255,.35)]"
                style={{ background: DRAW_CURSOR }}
              >
                Anukriti
              </span>
            </div>

            {/* "Open project" for the fill card, under the row's bottom-right corner (also for
                keyboard and touch). */}
            <Link
              data-fade
              ref={openBtn}
              href={caseStudyHref(PROJECTS[0].slug)}
              aria-label={`Open project: ${PROJECTS[0].title}`}
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

          {/* The section heading, typed in at the centre by the intro. */}
          <div
            data-title
            aria-hidden="true"
            className="pointer-events-none invisible absolute inset-0 z-[3] flex flex-col items-center justify-center gap-5 px-6 text-center opacity-0"
          >
            <p data-title-label className="m-0 text-[15px] leading-none font-medium text-muted">
              Selected work <span className="text-faint">({String(N).padStart(2, '0')})</span>
            </p>
            {/* An invisible copy holds the full size, so the typed line grows in place. */}
            <p className="relative m-0 max-w-[16ch] text-[clamp(36px,5vw,76px)] leading-[1.02] font-medium tracking-[-0.04em] text-ink">
              <span className="invisible">{WORK_TITLE}</span>
              <span className="absolute inset-0">
                <span data-typed />
                <i
                  data-caret
                  className="invisible ml-[0.04em] inline-block h-[0.85em] w-[3px] translate-y-[0.1em] animate-[caret-blink_1.06s_steps(1)_infinite] bg-ink align-baseline"
                />
              </span>
            </p>
          </div>
        </div>
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
