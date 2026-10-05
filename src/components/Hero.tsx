'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import Glasses, { LENS_MASK_URL } from './Glasses'
import ScreenSphere from './ScreenSphere'
import Lightbox, { type LightboxHandle } from './Lightbox'
import { SplitReveal } from './Reveal'
import { getLenis } from './SmoothScroll'
import { useFocusPull } from './useFocusPull'
import { gsap, useGSAP, reducedMotion } from '@/lib/gsap'

// Figma "Hero" (376:174249) in the white theme: wordmark + nav pill, the glasses with the
// handwritten note, and the tagline. Mobile-first flow layout; from 901px up the hero is the
// 1440 x 725 Figma frame scaled by --px, every element at its Figma coordinates.
// Layers: the screen sphere (blurred), the white curtain with a lens-shaped hole, then the
// content. The glasses drive the focus pull into the sphere (useFocusPull).
//
// Motion: GSAP fades the content in (CSS variables --in-*), and fades it as you scroll away
// (--hp, scrubbed by ScrollTrigger). Opacity always comes from one formula per element, so the
// entrance, the scroll fade and the focus pull (--text-opacity, --glasses-opacity) compose.

const NAV = [
  { href: '#welcome', label: 'Welcome' },
  { href: '#work', label: 'Work' },
  { href: '#reach-out', label: 'Reach Out' },
  { href: '#resume', label: 'Resume' },
]

// Text opacity: focus pull x scroll fade x entrance.
const fades = (entrance: string) =>
  ({ opacity: `calc(var(--text-opacity) * (1 - var(--hp) * 1.6) * var(${entrance}))` }) as CSSProperties

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export default function Hero() {
  const stage = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const rig = useRef<HTMLButtonElement>(null)
  const lens = useRef<HTMLDivElement>(null)
  const curtain = useRef<HTMLDivElement>(null)
  const layer = useRef<HTMLDivElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const world = useRef<HTMLDivElement>(null)
  const lightbox = useRef<LightboxHandle>(null)
  const refs = useMemo(() => ({ stage, canvas, rig, lens, curtain, layer, viewport, world }), [])
  const [activeLink, setActiveLink] = useState('#welcome')

  const { open, setOpen, focused, setFocused } = useFocusPull(refs)
  const closeScreen = useCallback(() => setFocused(null), [setFocused])

  // While the glasses are on, the page below mustn't scroll away and the site header steps aside.
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    root.style.overflow = 'hidden'
    root.setAttribute('data-glasses', '')
    getLenis()?.stop()
    return () => {
      root.style.overflow = ''
      root.removeAttribute('data-glasses')
      getLenis()?.start()
    }
  }, [open])

  // Hand focus back to the glasses once the page is interactive again (click or Esc).
  const wasOpen = useRef(false)
  useEffect(() => {
    if (wasOpen.current && !open) rig.current?.focus()
    wasOpen.current = open
  }, [open])

  useGSAP(
    () => {
      const el = canvas.current
      if (!el) return
      const entrance = ['--in-header', '--in-glasses', '--in-note', '--in-arrow']
      if (reducedMotion()) {
        gsap.set(el, Object.fromEntries(entrance.map((v) => [v, 1])))
      } else {
        // Fade-only entrance: the lens-shaped hole is measured from where the glasses sit, so
        // nothing moves.
        gsap
          .timeline({ defaults: { ease: 'expo.out' } })
          .to(el, { '--in-header': 1, duration: 1 }, 0)
          .to(el, { '--in-glasses': 1, duration: 1.2 }, 0.2)
          .to(el, { '--in-note': 1, duration: 1 }, 0.7)
          .to(el, { '--in-arrow': 1, duration: 1 }, 0.9)
      }
      // The hero's text fades as you scroll away from it.
      gsap.to(el, {
        '--hp': 1,
        ease: 'none',
        scrollTrigger: { trigger: stage.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    },
    { scope: stage },
  )

  const putOn = () => {
    const top = stage.current?.offsetTop ?? 0
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(top, { immediate: true, force: true })
    else window.scrollTo({ top, behavior: 'instant' })
    setOpen(true)
  }

  return (
    <section
      id="welcome"
      ref={stage}
      data-open={open || undefined}
      data-focused={focused ? '' : undefined}
      className="group/hero relative h-svh min-h-[600px] overflow-hidden bg-paper [--curtain-opacity:1] [--glasses-opacity:1] [--glasses-scale:1] [--hole-h:0px] [--hole-w:0px] [--hole-x:0px] [--hole-y:0px] [--text-opacity:1] data-[open]:touch-none min-[901px]:flex min-[901px]:items-center min-[901px]:justify-center"
      style={{ '--hole-image': `url("${LENS_MASK_URL}")` } as CSSProperties}
    >
      {/* Layer 1: the screen sphere, always full screen. useFocusPull sets the blur here, in
          screen px, and drops it once the view has cleared. */}
      <div
        ref={layer}
        className="absolute inset-0 bg-[#f1f1ef] [filter:blur(13px)] group-data-[open]/hero:cursor-grab group-data-[open]/hero:group-data-[over-tile]/hero:cursor-zoom-in group-data-[open]/hero:group-data-[dragging]/hero:!cursor-grabbing"
      >
        <ScreenSphere viewportRef={viewport} worldRef={world} />
      </div>

      {/* Layer 2: the white page with a lens-shaped hole. During the pull it scales about the
          glasses' centre with them. Once open, pointer input goes straight through. */}
      <div
        ref={curtain}
        className="hero-curtain absolute inset-0 will-change-[transform,opacity] group-data-[open]/hero:pointer-events-none"
      />

      {/* Layer 3: the content. */}
      <div
        ref={canvas}
        inert={open}
        className="pointer-events-none relative z-[1] flex h-full flex-col px-4 pt-8 pb-10 [--hp:0] [--in-arrow:0] [--in-glasses:0] [--in-header:0] [--in-note:0] [&_a]:pointer-events-auto [&_button]:pointer-events-auto min-[901px]:block min-[901px]:h-[calc(725*var(--px))] min-[901px]:w-[calc(1440*var(--px))] min-[901px]:flex-none min-[901px]:p-0"
      >
        {/* Name at (66, 56.5); nav pill ends at x = 1393.5 */}
        <header
          className="flex items-start justify-between gap-6 max-[640px]:flex-col max-[640px]:gap-5 min-[901px]:absolute min-[901px]:top-[calc(56*var(--px))] min-[901px]:right-[calc(46.5*var(--px))] min-[901px]:left-[calc(66*var(--px))]"
          style={fades('--in-header')}
        >
          <a
            href="#welcome"
            className={`font-wordmark text-[calc(24*var(--px))] leading-[1.191] font-normal text-ink uppercase no-underline max-[640px]:text-[20px] min-[901px]:mt-[calc(0.5*var(--px))] ${focusRing}`}
          >
            Anukriti
            <br />
            Mishra
          </a>
          {/* Nav pill (Figma: 366 x 39, 4/5 padding, 10 gap), inverted for the white page. */}
          <nav
            aria-label="Primary"
            className="flex items-center gap-[calc(10*var(--px))] rounded-[calc(9*var(--px))] border border-line bg-white px-[calc(5*var(--px))] py-[calc(4*var(--px))] shadow-[0_6px_20px_-10px_rgba(0,0,0,0.18)] max-[640px]:gap-[2px]"
          >
            {NAV.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                aria-current={activeLink === href ? 'page' : undefined}
                onClick={() => setActiveLink(href)}
                className={`min-w-[calc(82*var(--px))] rounded-[calc(6*var(--px))] px-[calc(10*var(--px))] py-[calc(7*var(--px))] text-center font-body text-[calc(14*var(--px))] leading-[1.191] font-medium whitespace-nowrap text-ink no-underline transition-[background-color,color] duration-150 ease-[ease] hover:bg-black/6 aria-[current=page]:min-w-0 aria-[current=page]:bg-ink aria-[current=page]:text-white aria-[current=page]:hover:bg-ink max-[640px]:min-w-0 max-[640px]:px-2 max-[640px]:py-[7px] max-[640px]:text-[13px] ${focusRing}`}
              >
                {label}
              </a>
            ))}
          </nav>
        </header>

        {/* Glasses group: 654.064 x 265.168 at (392.54, 244.83) */}
        <div className="-mx-4 flex justify-center pt-[140px] min-[901px]:absolute min-[901px]:top-[calc(244.83*var(--px))] min-[901px]:left-[calc(392.54*var(--px))] min-[901px]:m-0 min-[901px]:block min-[901px]:w-[calc(654.064*var(--px))] min-[901px]:p-0">
          <div className="relative w-[min(654px,calc(100vw-32px))] min-[901px]:w-full">
            {/* Note at (810.77, 170) in the frame = (418.24, -74.83) from the glasses */}
            <p
              className="absolute right-0 bottom-[calc(100%+58px)] m-0 font-hand text-[16px] leading-[1.25] font-normal whitespace-nowrap text-ink max-[640px]:text-[14px] min-[901px]:top-[calc(-74.83*var(--px))] min-[901px]:right-auto min-[901px]:bottom-auto min-[901px]:left-[calc(418.24*var(--px))] min-[901px]:text-[calc(18*var(--px))] min-[901px]:leading-[1.44] min-[901px]:tracking-[0.097em]"
              style={fades('--in-note')}
            >
              Borrow my glasses.
              <br />
              <span className="text-hand">See what I&apos;ve been designing</span>
            </p>
            {/* Arrow SVG box at (751.14, 191.4) in the frame = (358.6, -53.43) from the glasses */}
            <img
              className="absolute top-[-53.4px] left-[54.83%] h-[66.3139px] w-[52.4944px] max-w-none max-[640px]:left-[40%] min-[901px]:top-[calc(-53.43*var(--px))] min-[901px]:left-[calc(358.6*var(--px))] min-[901px]:h-[calc(66.3139*var(--px))] min-[901px]:w-[calc(52.4944*var(--px))]"
              style={fades('--in-arrow')}
              src="/hero/arrow.svg"
              width={52.4944}
              height={66.3139}
              alt=""
            />
            {/* The glasses are the trigger: clicking them plays the focus pull. */}
            <button
              ref={rig}
              type="button"
              aria-label="Borrow my glasses: see what I've been designing"
              aria-expanded={open}
              onClick={putOn}
              className="pointer-events-auto block w-full cursor-zoom-in border-0 bg-transparent p-0 transition-[filter] duration-300 ease-[ease] [opacity:calc(var(--glasses-opacity)*var(--in-glasses))] [transform:scale(var(--glasses-scale))] group-data-[open]/hero:pointer-events-none hover:drop-shadow-[0_18px_30px_rgba(0,0,0,0.14)] focus-visible:rounded-[24px] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent"
            >
              <Glasses lensRef={lens} />
            </button>
          </div>
        </div>

        {/* Tagline at (87.32, 582.2), 478.15 wide */}
        <div
          className="mt-auto min-[901px]:absolute min-[901px]:top-[calc(582.2*var(--px))] min-[901px]:left-[calc(87.32*var(--px))] min-[901px]:m-0 min-[901px]:w-[calc(478.15*var(--px))]"
          style={{ opacity: 'calc(var(--text-opacity) * (1 - var(--hp) * 1.6))' }}
        >
          <SplitReveal
            as="h1"
            className="m-0 max-w-[478px] text-[26px] leading-[1.158] font-bold tracking-[-0.01em] text-ink min-[901px]:max-w-none min-[901px]:text-[calc(32*var(--px))]"
            text="I spot what's confusing and design it clear."
            delay={300}
          />
        </div>
      </div>

      <p
        aria-hidden={!open}
        className="pointer-events-none absolute bottom-6 left-1/2 z-[3] m-0 w-max max-w-[calc(100vw-32px)] rounded-full bg-[rgba(11,11,12,0.86)] px-4 py-[10px] text-center text-[13px] leading-[1.2] font-medium text-white opacity-0 transition-opacity duration-300 ease-[ease] [transform:translateX(-50%)] group-data-[open]/hero:opacity-100 group-data-[open]/hero:delay-700 group-data-[focused]/hero:!opacity-0 group-data-[focused]/hero:!delay-0"
      >
        Drag to look around · Pinch to zoom out · Click a screen to open it
      </p>

      {focused && <Lightbox ref={lightbox} tile={focused} onClosed={closeScreen} />}

      {open && (
        // Top-centre pill: takes the glasses off (Esc does too); with a screen open, it goes back.
        <button
          type="button"
          onClick={() => (focused ? lightbox.current?.close() : setOpen(false))}
          autoFocus
          className="absolute top-6 left-1/2 z-[3] inline-flex animate-close-in cursor-pointer items-center gap-2 rounded-full border-0 bg-ink px-[18px] py-[11px] text-[14px] leading-none font-medium text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] transition-[background-color] duration-150 ease-[ease] [transform:translateX(-50%)] hover:bg-[#2a2a2d] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent motion-reduce:animate-none"
        >
          {focused ? (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M7.5 1.5L3 6l4.5 4.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          )}
          {focused ? 'Back' : 'Close'}
        </button>
      )}
    </section>
  )
}
