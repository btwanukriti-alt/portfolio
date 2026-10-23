'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PROJECTS, caseStudyHref } from '@/data/projects'
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from '@/lib/gsap'
import { getLenis, pageScroll, setScrollInterceptor } from './SmoothScroll'

// Work: the projects as a Figma auto-layout row. One card is set to "fill" and takes the room;
// the others are thin strips of solid colour (each showcase's background) on either side. The
// section pins while you scroll through it and works as a carousel: each scroll gesture moves the
// fill exactly one card on (or back), the next card widening as the one before compacts back to a
// strip, like a horizontal swipe. The fill card carries the black
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
// Carousel steps: one card per gesture. Seconds per step, and quicker going back up after
// returning from About.
const STEP = 0.7
const STEP_BACK = 0.45
// Wheel input after a pause this long (ms) starts a new gesture; a swipe must travel this far (px).
const GESTURE_GAP = 220
const TOUCH_STEP = 28

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
// The row spans the same content width as the other sections (--max less the --gutter each side);
// pageW is the page's width without the scrollbar, head the heading's height with its margin.
function rowFor(vw: number, vh: number, pageW = vw, head = TITLE_SPACE): Row {
  const portrait = vh > vw
  const vertical = portrait && vw < 720
  const ratio = portrait ? 9 / 16 : 16 / 9 // fill card width / height
  const small = vw < 720
  const strip = small ? 10 : Math.min(26, Math.max(16, vw * 0.015))
  const gap = small ? 4 : 8
  const gutter = Math.min(64, Math.max(20, vw * 0.04))
  const contentW = Math.min(pageW, 1440) - 2 * gutter
  const padY = Math.min(72, Math.max(32, vh * (portrait ? 0.07 : 0.06)))
  const rest = (N - 1) * (strip + gap)
  if (vertical) {
    const fillH = Math.max(200, Math.min(vh - 2 * padY - head - rest, contentW / ratio))
    return { strip, gap, fillW: fillH * ratio, fillH, w: fillH * ratio, h: fillH + rest, portrait, vertical }
  }
  const fillW = Math.max(120, Math.min(contentW - rest, (vh - 2 * padY - head) * ratio))
  return { strip, gap, fillW, fillH: fillW / ratio, w: fillW + rest, h: fillW / ratio, portrait, vertical }
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

// Bump when the videos or stills in public/showcase/ are re-rendered (they're cached for a day).
const VIDEO_VERSION = 4
// Plays a card video; with reduced motion it stays on its opening frame.
const playVideo = (v: HTMLVideoElement) => {
  if (reducedMotion() || !v.getAttribute('src')) return
  // React doesn't always set the muted property, and browsers only autoplay muted video.
  v.muted = true
  v.play().catch(() => {})
}

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
  const videos = useRef<(HTMLVideoElement | null)[]>([])
  const playing = useRef<boolean[]>([])
  const activeRef = useRef(0)
  const caption = useRef<HTMLDivElement>(null)
  const cursor = useRef<HTMLDivElement>(null)
  const hovered = useRef(-1)
  const follow = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null)

  // The showcases are real video files (public/showcase/video/, rendered frame by frame with Remotion in
  // showcase-video/), so the browser decodes them off the main thread and scrolling stays smooth. Each
  // card shows a still of its video's opening frame straight away; the videos load one at a time
  // once the section is within about a screen and a half: the open card's first, then the cards on
  // either side of it. Cards further along load as the row reaches them. A video fades in over its
  // still once its first frame is ready. Sources are set directly on the videos, so loading never
  // re-renders the section. Phones held upright get the portrait cut.
  const near = useRef(false)
  const requested = useRef<boolean[]>([])
  const loading = useRef(false)
  const loadNext = useRef(() => {})
  useEffect(() => {
    loadNext.current = () => {
      if (!near.current || loading.current) return
      const at = activeRef.current
      // The open card, then its neighbours (the one ahead first).
      const i = [at, at + 1, at - 1].find((j) => j >= 0 && j < N && !requested.current[j])
      const frame = i === undefined ? null : videos.current[i]
      if (i === undefined || !frame) return
      requested.current[i] = true
      loading.current = true
      const cut = matchMedia('(orientation: portrait) and (max-width: 719px)').matches ? 'port' : 'land'
      frame.src = `/showcase/video/${PROJECTS[i].slug}-${cut}.mp4?v=${VIDEO_VERSION}`
    }
  }, [])
  useEffect(() => {
    const el = section.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        near.current = true
        loadNext.current()
        io.disconnect()
      },
      { rootMargin: '150% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Case studies are fetched ahead when the pointer comes onto their card, not when the row comes
  // on screen (that pulled five pages' images in while the videos were loading).
  const router = useRouter()

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
    router.prefetch(caseStudyHref(PROJECTS[i].slug))
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
      const rowNow = () => {
        const h = heading.current
        const head = h ? h.offsetHeight + parseFloat(getComputedStyle(h).marginBottom) : undefined
        return rowFor(window.innerWidth, window.innerHeight, stage.current?.clientWidth || window.innerWidth, head)
      }
      let row = rowNow()

      const layout = () => {
        row = rowNow()
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
            if (play) playVideo(video)
            else video.pause()
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
      // Where the last gesture began: a card's index, -1 above the row or N below it. A phone swipe
      // that has started scrolling can't be held back, so the row is put right when it comes to rest:
      // on the first or last card if the swipe came in from outside, else at most one card on.
      let anchor = 0
      // The card the current gesture has already moved to: the rest of that gesture stays there.
      let landed = -1
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
        const aimed = dir > 0 ? (frac > 0.12 ? base + 1 : base) : dir < 0 ? (frac < 0.88 ? base : base + 1) : Math.round(at)
        const target = landed >= 0 ? landed : anchor < 0 ? 0 : anchor > N - 1 ? N - 1 : Math.min(anchor + 1, Math.max(anchor - 1, aimed))
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
          loadNext.current()
        }
        render()
        // When the scroll rests between two projects, ease the nearest one into place.
        clearTimeout(settle)
        if (onScreen && moving && !stepping && !reducedMotion()) settle = window.setTimeout(settleNow, SETTLE_MS)
      }

      // Carousel: inside the row, one scroll gesture (a wheel flick, a trackpad or finger swipe, an
      // arrow key) moves exactly one card, and input that arrives while a card is moving is let go,
      // so no card is ever skipped. Past the last card the next gesture carries on down to About;
      // before the first, back up to the hero. Coming back up from About lands on the last card, and
      // from there each step back up is quicker.
      const startY = () => trackTop
      const yOf = (i: number) => trackTop + i * SEGMENT * window.innerHeight
      const at = () => Math.round((pageScroll() - trackTop) / (SEGMENT * window.innerHeight))
      let stepping = false
      let stepTimer = 0
      let gestureUsed = false
      let lastInput = 0
      let touchTravel = 0
      let fromBelow = false
      const go = (i: number, duration: number) => {
        const lenis = getLenis()
        if (!lenis) return
        stepping = true
        window.clearTimeout(stepTimer)
        const done = () => {
          stepping = false
          window.clearTimeout(stepTimer)
          anchor = i
          landed = i
          // If a phone's swipe kept the page moving past the card, this puts it right.
          update()
        }
        // A fallback in case the glide is cut short and never reports back.
        stepTimer = window.setTimeout(done, duration * 1000 + 200)
        lenis.scrollTo(yOf(i), { duration, easing: (x) => 1 - Math.pow(1 - x, 3), force: true, onComplete: done })
      }
      // Moves one card in direction d (1 on, -1 back) if the row has one there; false at either end.
      const step = (d: number) => {
        const next = at() + d
        if (next < 0 || next > N - 1) return false
        if (d > 0) fromBelow = false
        go(next, d < 0 && fromBelow ? STEP_BACK : STEP)
        if (next === 0) fromBelow = false
        return true
      }

      const unintercept = setScrollInterceptor((data) => {
        const e = data.event
        const touch = e.type.startsWith('touch')
        // A new gesture: a touch that has just begun, or wheel input after a pause.
        const now = performance.now()
        if (e.type === 'touchstart' || (!touch && now - lastInput > GESTURE_GAP)) {
          gestureUsed = false
          touchTravel = 0
          const y0 = pageScroll()
          anchor = y0 < startY() - 2 ? -1 : y0 > yOf(N - 1) + 2 ? N : at()
          landed = -1
        }
        lastInput = now
        if (e.type !== 'wheel' && e.type !== 'touchmove') return true
        const dy = data.deltaY
        if (!dy) return true
        const y = pageScroll()
        const target = getLenis()?.targetScroll ?? y
        const block = () => {
          if (e.cancelable) e.preventDefault()
          return false
        }
        const inside = y > startY() - 2 && y < yOf(N - 1) + 2
        if (!inside) {
          // Arriving from above: the gesture stops on the first card instead of running on into the row.
          if (dy > 0 && y < startY() && target + dy > startY()) {
            if (!stepping) go(0, 0.5)
            gestureUsed = true
            fromBelow = false
            return block()
          }
          // Arriving from About: it lands on the last card, a little quicker.
          if (dy < 0 && y > yOf(N - 1) && target + dy < yOf(N - 1)) {
            if (!stepping) go(N - 1, STEP_BACK)
            gestureUsed = true
            fromBelow = true
            return block()
          }
          return true
        }
        // The rest of a gesture that has already moved a card, or input during a move, goes nowhere.
        if (stepping || gestureUsed) return block()
        // A swipe has to travel a little before it counts, so a tap or a wobble doesn't change cards.
        if (touch) {
          touchTravel += dy
          if (Math.abs(touchTravel) < TOUCH_STEP) return block()
        }
        const d = (touch ? touchTravel : dy) > 0 ? 1 : -1
        // At either end of the row the gesture leaves the section as normal scrolling.
        if (!step(d)) {
          if (d < 0) fromBelow = false
          return true
        }
        gestureUsed = true
        return block()
      })

      // Keys move one card too, while the row is pinned.
      const onKey = (e: KeyboardEvent) => {
        if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return
        const el = e.target as HTMLElement | null
        if (el?.closest('input, textarea, select, [contenteditable="true"]')) return
        const y = pageScroll()
        if (!(y > startY() - 2 && y < yOf(N - 1) + 2)) return
        const d = ['ArrowDown', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey) ? 1 : ['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey) ? -1 : 0
        if (!d) return
        if (stepping) return e.preventDefault()
        if (step(d)) e.preventDefault()
      }
      window.addEventListener('keydown', onKey)

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
        window.clearTimeout(stepTimer)
        unintercept()
        window.removeEventListener('keydown', onKey)
        window.removeEventListener('resize', onResize)
      }
    },
    { scope: section },
  )

  // A video that fails to load leaves its still in place; the queue moves on.
  const onVideoError = (i: number) => {
    if (!videos.current[i]?.getAttribute('src')) return
    loading.current = false
    loadNext.current()
  }

  // A video whose first frame is ready fades in over its still, picks up its card's current play
  // state and hands over to the next video in the queue.
  const onVideoLoad = (i: number) => {
    const frame = videos.current[i]
    if (!frame) return
    frame.style.opacity = '1'
    if (playing.current[i]) playVideo(frame)
    loading.current = false
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300))
    idle(() => loadNext.current(), { timeout: 2000 })
  }

  return (
    // Margin above and below keeps a gap from the hero and from About (margin, not padding, so
    // #work links still land on the frame).
    <section ref={section} id="work" aria-labelledby="work-heading" className="relative my-[clamp(96px,16vh,200px)] bg-paper">
      {/* The visible heading sits above the frame (aria-hidden there). */}
      <h2 id="work-heading" className="sr-only">
        Selected work: {WORK_TITLE}
      </h2>

      {/* A stretch of scrolling per project; the stage stays pinned while the fill moves. The
          videos own the screen: the site header stays away while they fill it. */}
      <div ref={track} className="relative w-full" style={{ height: `calc(${(N - 1) * SEGMENT * 100}svh + 100svh)` }} data-fullscreen>
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
                    prefetch={false}
                    aria-label={`Open ${project.name}`}
                    onPointerEnter={(e) => enterCard(e, i)}
                    onPointerMove={moveCursor}
                    onPointerLeave={leaveCard}
                    style={{ background: project.color }}
                    className="absolute inset-0 block cursor-pointer overflow-hidden [@media(hover:hover)]:cursor-none"
                  >
                    {project.showcase ? (
                      <>
                        {/* The video's opening frame, shown until the video itself has loaded. */}
                        <picture>
                          <source
                            media="(orientation: portrait) and (max-width: 719px)"
                            srcSet={`/showcase/posters/${project.slug}-port.jpg?v=${VIDEO_VERSION}`}
                          />
                          <img
                            className="absolute top-0 left-1/2 h-full w-[var(--fill-w)] max-w-none -translate-x-1/2 object-cover group-data-[vertical=true]/row:top-1/2 group-data-[vertical=true]/row:left-0 group-data-[vertical=true]/row:h-[var(--fill-h)] group-data-[vertical=true]/row:w-full group-data-[vertical=true]/row:translate-x-0 group-data-[vertical=true]/row:-translate-y-1/2"
                            src={`/showcase/posters/${project.slug}-land.jpg?v=${VIDEO_VERSION}`}
                            alt=""
                            decoding="async"
                          />
                        </picture>
                        {/* The video keeps the fill card's size, centred, so a strip shows a slice of it.
                          It's purely visual: clicks go to the card's link, scrolling stays with the page. */}
                        <video
                          ref={(el) => {
                            videos.current[i] = el
                          }}
                          className="pointer-events-none absolute top-0 left-1/2 h-full w-[var(--fill-w)] max-w-none -translate-x-1/2 group-data-[vertical=true]/row:top-1/2 group-data-[vertical=true]/row:left-0 group-data-[vertical=true]/row:h-[var(--fill-h)] group-data-[vertical=true]/row:w-full group-data-[vertical=true]/row:translate-x-0 group-data-[vertical=true]/row:-translate-y-1/2 object-cover opacity-0 transition-opacity duration-500 ease-out"
                          muted
                          loop
                          playsInline
                          preload="auto"
                          disablePictureInPicture
                          aria-hidden="true"
                          onLoadedData={() => onVideoLoad(i)}
                          onError={() => onVideoError(i)}
                        />
                      </>
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
              <span data-cap-title className="min-w-0 truncate">
                {PROJECTS[0].name}
              </span>
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
