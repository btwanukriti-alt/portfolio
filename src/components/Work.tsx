'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { PROJECTS, caseStudyHref } from '@/data/projects'
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from '@/lib/gsap'
import { getLenis, setScrollInterceptor } from './SmoothScroll'

// Work: the projects as a Figma auto-layout row. One card is set to "fill" and takes the room;
// the others are thin strips of solid colour (each showcase's background) on either side. The
// section pins for a stretch of scrolling per project, and each scroll gesture moves one project:
// the fill moves over on its own, the next card widening to fill while the one before compacts
// back to a strip. The fill card carries the black selection
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

const WORK_TITLE = "What I've designed."

const N = PROJECTS.length
// Scrolling per project, as a share of the window height.
const SEGMENT = 0.7
// While a scroll keeps going, the next project after this long.
const REPEAT_MS = 650

// The showcases' stage sizes. A landscape window gets 16:9 cards; a portrait one (phones,
// tablets held upright) gets 9:16 cards, and the showcases inside switch to their portrait cut.
const stageSize = (portrait: boolean) => (portrait ? { w: 1080, h: 1920 } : { w: 1920, h: 1080 })

// Row geometry for a window size: strip thickness, auto-layout gap, the fill card's size and the
// frame's. On a phone held upright the auto layout is vertical: the fill card spans the width,
// and the strips are thin bars stacked above and below it.
type Row = {
  strip: number
  gap: number
  fillW: number
  fillH: number
  w: number
  h: number
  portrait: boolean
  vertical: boolean
}
// Room kept above the frame for the section heading (px).
const TITLE_SPACE = 80
function rowFor(vw: number, vh: number): Row {
  const portrait = vh > vw
  const vertical = portrait && vw < 720
  const ratio = portrait ? 9 / 16 : 16 / 9 // fill card width / height
  const small = vw < 720
  const strip = small ? 10 : Math.min(26, Math.max(16, vw * 0.015))
  const gap = small ? 4 : 8
  const padX = Math.min(56, Math.max(16, vw * 0.035))
  const padY = Math.min(88, Math.max(48, vh * (portrait ? 0.07 : 0.08)))
  const rest = (N - 1) * (strip + gap)
  const head = small ? 72 : TITLE_SPACE
  if (vertical) {
    const fillH = Math.max(200, Math.min(vh - 2 * padY - head - rest, (vw - 2 * padX) / ratio))
    return { strip, gap, fillW: fillH * ratio, fillH, w: fillH * ratio, h: fillH + rest, portrait, vertical }
  }
  const fillW = Math.max(120, Math.min(vw - 2 * padX - rest, (vh - 2 * padY - head) * ratio))
  return { strip, gap, fillW, fillH: fillW / ratio, w: fillW + rest, h: fillW / ratio, portrait, vertical }
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

// Holds the page still (no wheel, touch or key scrolling) while the frame draws.
function lockScroll(on: boolean) {
  const lenis = getLenis()
  document.documentElement.style.overflow = on ? 'hidden' : ''
  if (on) lenis?.stop()
  else lenis?.start()
}

// Puts the page at project i's stretch of the pinned section, instantly (stopping any momentum):
// the stage doesn't move, so only the fill animates. With glide, the page eases there instead
// (for arriving from just outside the section, where the move can be seen).
function jumpTo(track: HTMLElement, i: number, glide = false) {
  const y = track.getBoundingClientRect().top + window.scrollY + i * SEGMENT * window.innerHeight
  const lenis = getLenis()
  if (lenis && glide) lenis.scrollTo(y, { duration: 0.6, easing: (x) => 1 - Math.pow(1 - x, 3), force: true })
  else if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
  else window.scrollTo({ top: y, behavior: 'instant' })
}

export default function Work() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const heading = useRef<HTMLDivElement>(null)
  const cards = useRef<(HTMLDivElement | null)[]>([])
  const videos = useRef<(HTMLIFrameElement | null)[]>([])
  const playing = useRef<boolean[]>([])
  const activeRef = useRef(0)
  const openBtn = useRef<HTMLAnchorElement>(null)
  const caption = useRef<HTMLDivElement>(null)
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
    jumpTo(track.current, i)
  }

  // Driven by ScrollTrigger (in step with the smooth scroll): the fill passes along the row with
  // the scroll, and only the fill card's video plays.
  useGSAP(
    () => {
      let row = rowFor(window.innerWidth, window.innerHeight)
      const drawn = true

      const layout = () => {
        row = rowFor(window.innerWidth, window.innerHeight)
        const f = frame.current
        if (!f) return
        f.style.width = `${row.w}px`
        if (heading.current) heading.current.style.width = `${row.w}px`
        f.style.height = `${row.h}px`
        f.style.setProperty('--fill-w', `${row.fillW}px`)
        f.style.setProperty('--fill-h', `${row.fillH}px`)
        f.style.setProperty('--gap', `${row.gap}px`)
        f.dataset.vertical = String(row.vertical)
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
          const full = row.vertical ? row.fillH : row.fillW
          const extent = row.strip + fill * (full - row.strip)
          card.style.width = row.vertical ? '100%' : `${extent}px`
          card.style.height = row.vertical ? `${extent}px` : '100%'
          card.style.setProperty('--strip', String(clamp01((1 - fill) * 1.8)))
          card.style.setProperty('--sel', String(clamp01((fill - 0.7) / 0.3)))
          const size = card.querySelector<HTMLElement>('[data-size]')
          if (size) {
            const stage = stageSize(row.portrait)
            const grown = fill > 0.99 ? 1 : extent / full
            size.textContent = row.vertical
              ? `${stage.w} × ${Math.round(stage.h * grown)}`
              : `${Math.round(stage.w * grown)} × ${stage.h}`
          }

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
        const cap = caption.current
        if (cap) {
          cap.querySelector('[data-cap-num]')!.textContent = String(i + 1).padStart(2, '0')
          cap.querySelector('[data-cap-title]')!.textContent = p.title
        }
      }
      setOpen(0)

      let prevTop = Infinity

      const update = (): void => {
        const t = track.current
        if (!t) return
        let r = t.getBoundingClientRect()
        const vh = window.innerHeight
        if (!vh) return // a window with no height yet (an embedded preview while it loads)


        // Arriving with momentum (a flick from above or below) lands on the first or last
        // project instead of sailing past the ones in between. The stage is pinned throughout,
        // so the correction can't be seen. (Read the position again after a jump: this runs
        // inside ScrollTrigger's update, so the jump doesn't call it back.)
        const span = (N - 1) * SEGMENT * vh
        const pinned = r.top <= 0 && -r.top <= span
        // (A couple of pixels of slack: positions land on sub-pixels.)
        if (pinned && prevTop > 2 && -r.top > 2) jumpTo(t, 0)
        else if (pinned && prevTop < -span - 2 && -r.top < span - 2) jumpTo(t, N - 1)
        r = t.getBoundingClientRect()
        prevTop = r.top
        // Scroll progress in projects (0 = the first project's stretch).
        const pos = -r.top / (SEGMENT * vh)
        onScreen = r.bottom > 0 && r.top < vh
        // The pointer can be left "over" a card that has scrolled away: drop the Open label.
        if (!onScreen && hovered.current >= 0) {
          hovered.current = -1
          setCursor(false)
        }

        // Each project owns a stretch of scroll (one scroll gesture moves one stretch, below);
        // the fill moves over on its own.
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

      // One scroll, one project. While the stage is pinned, each wheel or swipe gesture moves
      // the fill exactly one project (the page jumps straight to that project's stretch, so the
      // cards answer at once) and the rest of the gesture, trackpad momentum included, is
      // swallowed. Past the first or last project, the page scrolls on as usual.
      let lastEvent = 0
      let lastStep = -Infinity
      let stepped = false
      const releaseInterceptor = setScrollInterceptor(({ event, deltaY }) => {
        const t = track.current
        if (!t) return true
        // Held still by the intro.
        if (document.documentElement.style.overflow === 'hidden') return false
        if (event.type !== 'wheel' && event.type !== 'touchmove') return true
        const top = t.getBoundingClientRect().top
        const vh = window.innerHeight
        const span = (N - 1) * SEGMENT * vh
        const dir = Math.sign(deltaY)
        const now = event.timeStamp
        const newGesture = now - lastEvent > 200
        const step = (i: number, glide = false) => {
          if (event.cancelable) event.preventDefault()
          lastEvent = now
          stepped = true
          lastStep = now
          jumpTo(t, i, glide)
          return false
        }

        // Scrolling back in from just outside glides onto the nearest end project in one go.
        if (newGesture && drawn && dir > 0 && top > 2 && top < vh * 0.6) return step(0, true)
        if (newGesture && dir < 0 && -top > span + 2 && -top < span + vh * 0.6) return step(N - 1, true)
        if (top > 2 || -top > span + 2) return true

        lastEvent = now
        if (newGesture) stepped = false
        // Scrolling that keeps going (a spinning wheel, a long trackpad drag) carries on through
        // the projects, one every REPEAT_MS, and out the far end, so passing through never feels
        // stuck. A single flick's fading momentum (small deltas) still moves just one.
        if (stepped && now - lastStep > REPEAT_MS && Math.abs(deltaY) > 25) stepped = false
        if (stepped) {
          if (event.cancelable) event.preventDefault()
          return false
        }
        const target = activeRef.current + dir
        if (!dir || target < 0 || target > N - 1) return true
        if (now - lastStep < 550) {
          if (event.cancelable) event.preventDefault()
          return false
        }
        return step(target)
      })

      return () => {
        releaseInterceptor()
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
      {/* The visible heading sits above the frame (aria-hidden there). */}
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
        <div ref={stage} className="sticky top-0 flex h-screen h-svh w-full flex-col items-center justify-center overflow-hidden">
          {/* The section heading, top left of the frame (its width follows the frame). */}
          <div ref={heading} aria-hidden="true" className="mb-[clamp(28px,4vh,44px)] flex max-w-full items-end justify-between gap-4">
            <p className="m-0 text-[clamp(26px,2.6vw,40px)] leading-[1.05] font-medium tracking-[-0.035em] text-ink">{WORK_TITLE}</p>
            <p className="m-0 text-[15px] leading-none font-medium text-muted">
              Selected work <span className="text-faint">({String(N).padStart(2, '0')})</span>
            </p>
          </div>
          {/* The auto-layout frame (sized by layout()). */}
          <div ref={frame} className="group/row relative">
            <div data-draw-content className="flex h-full w-full gap-[var(--gap)] group-data-[vertical=true]/row:flex-col">
              {PROJECTS.map((project, i) => (
                <div
                  key={project.slug}
                  ref={(el) => {
                    cards.current[i] = el
                  }}
                  data-card
                  className="relative flex-none [contain:layout_style] [--fill:0] [--sel:0] [--strip:1]"
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
                        className="pointer-events-none absolute top-0 left-1/2 h-full w-[var(--fill-w)] max-w-none -translate-x-1/2 group-data-[vertical=true]/row:top-1/2 group-data-[vertical=true]/row:left-0 group-data-[vertical=true]/row:h-[var(--fill-h)] group-data-[vertical=true]/row:w-full group-data-[vertical=true]/row:translate-x-0 group-data-[vertical=true]/row:-translate-y-1/2 border-0"
                        src={project.showcase}
                        title={`${project.title} showcase`}
                        loading="lazy"
                        tabIndex={-1}
                        onLoad={() => onVideoLoad(i)}
                      />
                    ) : (
                      <img
                        className="absolute top-0 left-1/2 h-full w-[var(--fill-w)] max-w-none -translate-x-1/2 group-data-[vertical=true]/row:top-1/2 group-data-[vertical=true]/row:left-0 group-data-[vertical=true]/row:h-[var(--fill-h)] group-data-[vertical=true]/row:w-full group-data-[vertical=true]/row:translate-x-0 group-data-[vertical=true]/row:-translate-y-1/2 object-cover"
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
                    <div className="absolute bottom-full left-0 mb-2 flex items-center gap-2 font-hero text-[12px] leading-none font-medium whitespace-nowrap text-ink group-data-[vertical=true]/row:hidden">
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
                      className="absolute top-full left-1/2 mt-2.5 -translate-x-1/2 rounded-[4px] group-data-[vertical=true]/row:hidden bg-ink px-[6px] py-[3px] font-hero text-[11px] leading-none font-medium whitespace-nowrap text-white tabular-nums"
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

            {/* Vertical rows: the fill card's name sits under the row (strips are above and below
                the card, so there's no room for it on the card itself). */}
            <div
              ref={caption}
              data-fade
              aria-hidden="true"
              className="absolute top-full left-0 mt-2.5 hidden h-[29px] max-w-[calc(100%-136px)] items-center gap-2 font-hero text-[12px] leading-none font-medium whitespace-nowrap text-ink group-data-[vertical=true]/row:flex"
            >
              <span data-cap-num className="text-faint tabular-nums">
                01
              </span>
              <span data-cap-title className="min-w-0 truncate">{PROJECTS[0].title}</span>
              <span className="flex-none rounded-[3px] bg-[#7B61FF]/10 px-[5px] py-[3px] text-[10px] text-[#7B61FF]">Fill</span>
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
