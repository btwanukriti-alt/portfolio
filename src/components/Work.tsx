'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { PROJECTS, caseStudyHref } from '@/data/projects'
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from '@/lib/gsap'
import { getLenis, pageScroll } from './SmoothScroll'

// Work: the projects as a Figma auto-layout row. One card is set to "fill" and takes the room;
// the others are thin strips of solid colour (each showcase's background) on either side. The
// section pins while you scroll through it, and the fill follows the scroll continuously: the next
// card widens as the one before compacts back to a strip, like a horizontal swipe. When the scroll
// comes to rest, the nearest project eases fully into place. The fill card carries the black
// selection (border and handles), plays its looping showcase once settled, and over it the
// pointer becomes a black "Open" label. One click on any card, fill or strip, opens its project.

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
const SEGMENT = 0.55
// After the scroll rests this long, the nearest project eases into place.
const SETTLE_MS = 140

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
const TITLE_SPACE = 120
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
  const head = small ? 96 : TITLE_SPACE
  if (vertical) {
    const fillH = Math.max(200, Math.min(vh - 2 * padY - head - rest, (vw - 2 * padX) / ratio))
    return { strip, gap, fillW: fillH * ratio, fillH, w: fillH * ratio, h: fillH + rest, portrait, vertical }
  }
  const fillW = Math.max(120, Math.min(vw - 2 * padX - rest, (vh - 2 * padY - head) * ratio))
  return { strip, gap, fillW, fillH: fillW / ratio, w: fillW + rest, h: fillW / ratio, portrait, vertical }
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

// Scrolls the page to project i's place in the pinned section.
function scrollToProject(track: HTMLElement, i: number, duration = 0.6) {
  const y = track.getBoundingClientRect().top + window.scrollY + i * SEGMENT * window.innerHeight
  const lenis = getLenis()
  if (lenis) lenis.scrollTo(y, { duration, easing: (x) => 1 - Math.pow(1 - x, 3), force: true })
  else window.scrollTo({ top: y, behavior: 'smooth' })
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
  const caption = useRef<HTMLDivElement>(null)
  const cursor = useRef<HTMLDivElement>(null)
  const hovered = useRef(-1)
  const follow = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null)

  // The showcase videos are heavy (several hundred KB each): they load only once the section is
  // within about a screen and a half, not with the page.
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = section.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        setNear(true)
        io.disconnect()
      },
      { rootMargin: '150% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

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
    setCursor(true)
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

  // Driven by ScrollTrigger (in step with the smooth scroll): the fill follows the scroll along the
  // row, and only the settled fill card's video plays.
  useGSAP(
    () => {
      let row = rowFor(window.innerWidth, window.innerHeight)

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

      // The fill's position along the row (0 = first project filling), read from the scroll.
      const shown = { pos: 0 }
      let onScreen = false
      let moving = false

      const render = () => {
        cards.current.forEach((card, i) => {
          if (!card) return
          // How much this card fills: 1 for the fill card, 0 for a strip, in between mid-move.
          const fill = clamp01(1 - Math.abs(shown.pos - i))
          const full = row.vertical ? row.fillH : row.fillW
          const extent = row.strip + fill * (full - row.strip)
          const w = row.vertical ? '100%' : `${extent.toFixed(1)}px`
          const h = row.vertical ? `${extent.toFixed(1)}px` : '100%'
          if (card.style.width !== w) card.style.width = w
          if (card.style.height !== h) card.style.height = h
          const strip = clamp01((1 - fill) * 1.8).toFixed(3)
          const sel = clamp01((fill - 0.7) / 0.3).toFixed(3)
          if (card.style.getPropertyValue('--strip') !== strip) card.style.setProperty('--strip', strip)
          if (card.style.getPropertyValue('--sel') !== sel) card.style.setProperty('--sel', sel)

          const video = videos.current[i]
          // A fully collapsed strip is solid colour on top: its video isn't drawn at all.
          if (video) {
            const vis = fill > 0.005 ? '' : 'hidden'
            if (video.style.visibility !== vis) video.style.visibility = vis
          }
          // Only the settled fill card plays: the one leaving pauses at once, the one arriving
          // starts once it has opened, so nothing heavy runs while the cards move.
          const play = onScreen && !moving && i === activeRef.current
          if (video && play !== playing.current[i]) {
            playing.current[i] = play
            video.contentWindow?.postMessage(play ? 'showcase:play' : 'showcase:pause', '*')
          }
        })
      }

      // The cards' cursors and the caption follow the fill card (set directly, so switching never
      // re-renders the section mid-move).
      const setOpen = (i: number) => {
        const p = PROJECTS[i]
        cards.current.forEach((card, j) => card?.setAttribute('data-active', String(j === i)))
        const cap = caption.current
        if (cap) {
          cap.querySelector('[data-cap-num]')!.textContent = String(i + 1).padStart(2, '0')
          cap.querySelector('[data-cap-title]')!.textContent = p.name
        }
      }
      setOpen(0)

      let settle = 0
      let lastPos = 0
      let dir = 0 // the way the scroll was last heading through the row: 1 on, -1 back
      const settleNow = () => {
        settle = 0
        const t = track.current
        if (!t) return
        const vh = window.innerHeight
        const at = -t.getBoundingClientRect().top / (SEGMENT * vh)
        // Only inside the pinned stretch, and only if it isn't already in place.
        if (at <= 0.01 || at >= N - 1.01) return
        // A swipe that has started toward the next project finishes there; one that barely moved
        // eases back.
        const base = Math.floor(at)
        const frac = at - base
        const target = dir > 0 ? (frac > 0.12 ? base + 1 : base) : dir < 0 ? (frac < 0.88 ? base : base + 1) : Math.round(at)
        if (Math.abs(at - target) > 0.01) scrollToProject(t, target, 0.45)
      }

      // The track's place on the page, measured on layout changes rather than every frame.
      let trackTop = 0
      let trackH = 0
      const measure = () => {
        const t = track.current
        if (!t) return
        trackTop = t.getBoundingClientRect().top + window.scrollY
        trackH = t.offsetHeight
      }

      const update = (): void => {
        const t = track.current
        if (!t) return
        const top = trackTop - pageScroll()
        const r = { top, bottom: top + trackH }
        const vh = window.innerHeight
        if (!vh) return // a window with no height yet (an embedded preview while it loads)
        // Scroll progress in projects, followed directly (the page scroll is already smoothed).
        const pos = Math.min(N - 1, Math.max(0, -r.top / (SEGMENT * vh)))
        onScreen = r.bottom > 0 && r.top < vh
        // Off screen, the stage (a fixed, viewport-sized box) skips rendering altogether, so its
        // cards and videos cost nothing while the rest of the page scrolls.
        const st = stage.current
        if (st) st.style.contentVisibility = onScreen ? '' : 'hidden'
        // The pointer can be left "over" a card that has scrolled away: drop the Open label.
        if (!onScreen && hovered.current >= 0) {
          hovered.current = -1
          setCursor(false)
        }
        if (Math.abs(pos - lastPos) > 0.001) dir = pos > lastPos ? 1 : -1
        lastPos = pos
        shown.pos = pos
        moving = Math.abs(pos - Math.round(pos)) > 0.02
        const next = Math.round(pos)
        if (next !== activeRef.current) {
          activeRef.current = next
          setOpen(next)
        }
        render()
        // When the scroll rests between two projects, ease the nearest one into place.
        clearTimeout(settle)
        if (onScreen && moving && !reducedMotion()) settle = window.setTimeout(settleNow, SETTLE_MS)
      }

      layout()
      measure()
      update()
      const onResize = () => {
        layout()
        measure()
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
        clearTimeout(settle)
        window.removeEventListener('resize', onResize)
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
          <div ref={heading} aria-hidden="true" className="mb-[clamp(44px,7vh,80px)] flex max-w-full items-end justify-between gap-4">
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
                    aria-label={`Open ${project.name}`}
                    onPointerEnter={(e) => enterCard(e, i)}
                    onPointerMove={moveCursor}
                    onPointerLeave={leaveCard}
                    style={{ background: project.color }}
                    className="absolute inset-0 block cursor-pointer overflow-hidden [@media(hover:hover)]:cursor-none"
                  >
                    {project.showcase ? (
                      // The video keeps the fill card's size, centred, so a strip shows a slice of it.
                      // It's purely visual: clicks go to the card's link, scrolling stays with the page.
                      <iframe
                        ref={(el) => {
                          videos.current[i] = el
                        }}
                        className="pointer-events-none absolute top-0 left-1/2 h-full w-[var(--fill-w)] max-w-none -translate-x-1/2 group-data-[vertical=true]/row:top-1/2 group-data-[vertical=true]/row:left-0 group-data-[vertical=true]/row:h-[var(--fill-h)] group-data-[vertical=true]/row:w-full group-data-[vertical=true]/row:translate-x-0 group-data-[vertical=true]/row:-translate-y-1/2 border-0"
                        src={near ? project.showcase : undefined}
                        title={`${project.name} showcase`}
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

                  {/* The fill card's selection: name above, black border, handles. */}
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[var(--sel)]">
                    <div className="absolute bottom-full left-0 mb-2 flex items-center gap-2 font-hero text-[12px] leading-none font-medium whitespace-nowrap text-ink group-data-[vertical=true]/row:hidden">
                      <span className="text-faint tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                      <span>{project.name}</span>
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
              className="absolute top-full left-0 mt-2.5 hidden h-[29px] max-w-full items-center gap-2 font-hero text-[12px] leading-none font-medium whitespace-nowrap text-ink group-data-[vertical=true]/row:flex"
            >
              <span data-cap-num className="text-faint tabular-nums">
                01
              </span>
              <span data-cap-title className="min-w-0 truncate">{PROJECTS[0].name}</span>
              <span className="flex-none rounded-[3px] bg-[#7B61FF]/10 px-[5px] py-[3px] text-[10px] text-[#7B61FF]">Fill</span>
            </div>

          </div>

        </div>
      </div>

      {/* The "Open" cursor (fixed; positioned by GSAP). */}
      <div
        ref={cursor}
        aria-hidden="true"
        className="pointer-events-none invisible fixed top-0 left-0 z-[60] flex items-center gap-2 bg-ink px-5 py-3 text-[14px] leading-none font-medium tracking-[0.01em] text-white opacity-0 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]"
      >
        Open
        <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M3 11L11 3M5 3h6v6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  )
}
