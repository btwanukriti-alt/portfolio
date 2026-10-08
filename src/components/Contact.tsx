'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { Reveal } from './Reveal'
import { getLenis } from './SmoothScroll'
import { gsap, useGSAP, reducedMotion } from '@/lib/gsap'
import { PROJECTS, caseStudyHref } from '@/data/projects'
import { EMAIL, LINKEDIN } from '@/data/site'

// Contact footer: a black frame, selected like a Figma layer, that says "Let's BUILD". The D is
// drawn with the pen tool, its curve dragged out by a handle, then let go so it shakes back.
const SELECT = '#7B61FF'
const HANDLES = [
  [0, 0],
  [50, 0],
  [100, 0],
  [0, 50],
  [100, 50],
  [0, 100],
  [50, 100],
  [100, 100],
]

// The D's outline in a 100-unit box; `b` pushes the bowl out (the dragged handle).
const outer = (b: number) => `M0 0H38C${70 + b} 0 ${88 + b} 20 ${88 + b} 50C${88 + b} 80 ${70 + b} 100 38 100H0Z`
const NODES = [
  [0, 0],
  [38, 0],
  [88, 50],
  [38, 100],
  [0, 100],
]

// Figma's pen tool, nib down and tilted around its tip, so it reads as the apostrophe in "Let's". Nib tip at (12, 32).
function PenIcon() {
  return (
    <svg viewBox="0 0 24 32" className="block h-full w-full origin-bottom rotate-[18deg] overflow-visible" aria-hidden="true">
      <rect x="5" y="0" width="14" height="4" fill={SELECT} />
      <path d="M5 5h14l3.5 13L12 32 1.5 18z" fill="#fff" />
      <path d="M12 32V19" stroke="#0b0b0c" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="17" r="2.2" fill="#0b0b0c" />
    </svg>
  )
}

// "Let's BUILD": the apostrophe is the pen tool. When the frame comes into view it flies over,
// traces the D point by point, drags the curve out, lets go (the D shakes back and fills), then
// returns to its place. About 2s.
function BuildHeading() {
  const root = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      const h = root.current
      if (!h) return
      const svg = h.querySelector<SVGSVGElement>('[data-d]')!
      const real = h.querySelector<HTMLElement>('[data-real]')!
      const outline = svg.querySelector<SVGPathElement>('[data-outline]')!
      const nodes = svg.querySelectorAll('[data-node]')
      const handle = svg.querySelector<SVGGElement>('[data-handle]')!
      const home = h.querySelector<HTMLElement>('[data-home]')!
      const pen = h.querySelector<HTMLElement>('[data-pen]')!
      if (reducedMotion()) return

      // Fit the drawing to the real D's ink box (from the font's metrics), so the pen traces the
      // letter that is left behind.
      const fit = () => {
        const cs = getComputedStyle(real)
        const ctx = document.createElement('canvas').getContext('2d')
        if (!ctx) return
        ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
        const m = ctx.measureText('D')
        Object.assign(svg.style, {
          left: `${-m.actualBoundingBoxLeft}px`,
          top: `${m.fontBoundingBoxAscent - m.actualBoundingBoxAscent}px`,
          width: `${m.actualBoundingBoxLeft + m.actualBoundingBoxRight}px`,
          height: `${m.actualBoundingBoxAscent}px`,
        })
      }

      // at: home (0) to the D (1); hop: progress of the current jump, for a cartoon arc.
      const state = { b: 0, t: 0, at: 0, hop: 0 }
      // Screen position of a point in the D's 100-unit space.
      const toScreen = (x: number, y: number) => {
        const m = svg.getScreenCTM()
        return m ? new DOMPoint(x, y).matrixTransform(m) : new DOMPoint(0, 0)
      }
      // Move the pen so its nib sits on a screen point; `at` blends from home (0) to that point (1).
      const placePen = (x: number, y: number) => {
        const r = home.getBoundingClientRect()
        const nib = { x: r.left + r.width / 2, y: r.bottom }
        const arc = -Math.sin(Math.PI * state.hop) * r.height * 1.6
        gsap.set(pen, { x: (x - nib.x) * state.at, y: (y - nib.y) * state.at + arc })
      }
      let len = 0
      const update = () => {
        outline.setAttribute('d', outer(state.b))
        handle.setAttribute('transform', `translate(${state.b} 0)`)
        // While drawing, the nib follows the outline; while dragging, it holds the handle.
        const p = state.t < 1 ? outline.getPointAtLength(len * state.t) : { x: 88 + state.b, y: 18 }
        const s = toScreen(p.x, p.y)
        placePen(s.x, s.y)
      }

      // The pen's slot between t and s: it closes up when the pen leaves and pops open when it lands.
      const slot = { width: 0, margin: 0 }
      const hopTo = (at: number) => ({ at, duration: 0.45, ease: 'back.out(1.7)' })

      const tl = gsap.timeline({ paused: true, onUpdate: update })
      tl
        // Leave with a wiggle and hop over to the D while the gap behind it closes.
        .to(pen, { rotation: -22, duration: 0.12, ease: 'power2.out' })
        .to(state, hopTo(1))
        .fromTo(state, { hop: 0 }, { hop: 1, duration: 0.45, ease: 'none' }, '<')
        .to(pen, { rotation: 0, duration: 0.45, ease: 'elastic.out(1, 0.45)' }, '<')
        .to(home, { width: 0, marginLeft: 0, marginRight: 0, duration: 0.35, ease: 'back.in(1.6)' }, '<0.05')
        // Trace the outline (0.6s), dropping a point at each corner.
        .to(state, { t: 1, duration: 0.6, ease: 'none' })
        .to(outline, { strokeDashoffset: 0, duration: 0.6, ease: 'none' }, '<')
        .to(nodes, { opacity: 1, duration: 0.05, stagger: 0.12 }, '<')
        // Grab the curve's handle and pull (0.25s), then let go: it shakes back (0.55s) and the
        // letter fills in.
        .set(handle, { opacity: 1 })
        .to(state, { b: 18, duration: 0.25, ease: 'power2.out' })
        .to(state, { b: 0, duration: 0.55, ease: 'elastic.out(1.1, 0.3)' })
        .to(real, { opacity: 1, duration: 0.25 }, '<0.2')
        .to([outline, nodes, handle], { opacity: 0, duration: 0.25 }, '<0.1')
        // Hop back; the gap pops open to make room and the pen lands with a squash.
        .to(state, hopTo(0), '<')
        .fromTo(state, { hop: 0 }, { hop: 1, duration: 0.45, ease: 'none' }, '<')
        .to(home, { width: () => slot.width, marginLeft: () => slot.margin, marginRight: () => slot.margin, duration: 0.5, ease: 'elastic.out(1.1, 0.45)' }, '<0.25')
        .fromTo(pen, { scaleY: 0.75, scaleX: 1.2 }, { scaleY: 1, scaleX: 1, duration: 0.4, ease: 'elastic.out(1.2, 0.35)', transformOrigin: '50% 100%', immediateRender: false }, '<0.15')
        // Back to the stylesheet's em sizes, so the slot keeps scaling with the type.
        .set(home, { clearProps: 'width,marginLeft,marginRight' })

      let io: IntersectionObserver | undefined
      document.fonts.ready.then(() => {
        if (!root.current) return
        fit()
        const cs = getComputedStyle(home)
        slot.width = parseFloat(cs.width)
        slot.margin = parseFloat(cs.marginLeft)
        len = outline.getTotalLength()
        gsap.set(real, { opacity: 0 })
        gsap.set(outline, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 })
        gsap.set([nodes, handle], { opacity: 0 })
        // Play once the visitor is actually at the frame: (nearly) all of it on screen, or as
        // much of it as fits when it's taller than the window.
        const frame = h.closest<HTMLElement>('[data-frame]') ?? h
        const need = Math.min(0.9, (0.9 * window.innerHeight) / frame.offsetHeight)
        io = new IntersectionObserver(
          ([e]) => {
            if (e.intersectionRatio < need) return
            io?.disconnect()
            gsap.delayedCall(0.3, () => tl.play())
          },
          { threshold: [need] },
        )
        io.observe(frame)
      })
      window.addEventListener('resize', fit)
      return () => {
        io?.disconnect()
        window.removeEventListener('resize', fit)
      }
    },
    { scope: root },
  )

  return (
    <h2
      ref={root}
      id="contact-heading"
      aria-label="Let's BUILD"
      className="relative m-0 mt-5 text-[clamp(56px,10vw,168px)] leading-[0.92] font-medium tracking-[-0.045em] whitespace-nowrap"
    >
      <span aria-hidden="true">
        Let
        {/* The pen: sits where the apostrophe goes. */}
        <span data-home className="relative mx-[0.02em] inline-block h-[0.3em] w-[0.22em] -translate-y-[0.42em] align-baseline">
          <span data-pen className="absolute bottom-0 left-1/2 z-10 -ml-[0.11em] h-[0.3em] w-[0.22em] will-change-transform">
            <PenIcon />
          </span>
        </span>
        s{' '}
        <span className="tracking-[-0.02em]">
          BUIL
          <span className="relative">
            <span data-real>D</span>
            <svg data-d viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute top-0 left-0 overflow-visible">
              <path data-outline d={outer(0)} fill="none" stroke={SELECT} strokeWidth="1.5" vectorEffect="non-scaling-stroke" opacity="0" />
              {NODES.map(([x, y]) => (
                <rect key={`${x}-${y}`} data-node x={x - 3} y={y - 3} width="6" height="6" fill="#fff" stroke={SELECT} strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0" />
              ))}
              <g data-handle opacity="0">
                <line x1="88" y1="50" x2="88" y2="18" stroke={SELECT} strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <circle cx="88" cy="18" r="3.2" fill={SELECT} />
              </g>
            </svg>
          </span>
        </span>
      </span>
    </h2>
  )
}

// The showcase canvas shapes (ring, pill, star), large and cropped by the frame's edges.
function Shapes() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="absolute -top-[12%] -left-[6%] size-[clamp(140px,16vw,240px)] rounded-full border-[clamp(18px,2vw,30px)] border-white/90" />
      <span className="absolute -top-[6%] -right-[8%] h-[clamp(64px,7vw,104px)] w-[clamp(220px,24vw,360px)] rounded-full bg-[#FFD25A]" />
      <svg
        className="absolute -right-[4%] -bottom-[24%] w-[clamp(120px,13vw,200px)] animate-[spin_24s_linear_infinite] motion-reduce:animate-none"
        viewBox="0 0 100 100"
      >
        <path d="M50 0C53 34 66 47 100 50C66 53 53 66 50 100C47 66 34 53 0 50C34 47 47 34 50 0Z" fill="#7B61FF" />
      </svg>
    </div>
  )
}

// Square icon buttons, like the Resume button.
const iconButton =
  'grid size-10 place-items-center border border-line text-ink no-underline transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'

// On a case study page, `current` is its slug: the footer then links to the other projects.
export default function Contact({ current }: { current?: string } = {}) {
  const toTop = () => {
    const lenis = getLenis()
    // Jump straight to the hero: a smooth scroll gets caught by the work cards' snapping on the way up.
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    else window.scrollTo(0, 0)
  }

  return (
    <>
      <section
        id="reach-out"
        aria-labelledby="contact-heading"
        className="mx-auto max-w-[var(--max)] bg-paper px-[var(--gutter)] pt-[clamp(56px,9vh,104px)] font-body"
      >
        <Reveal className="relative mt-6">
          {/* Selection: the frame's name, a border with handles, and its size. */}
          <span className="absolute bottom-full left-0 mb-2 text-[12px] leading-none font-medium" style={{ color: SELECT }}>
            Let&apos;s build
          </span>
          <div data-frame className="relative bg-ink text-white outline outline-1 outline-offset-0" style={{ outlineColor: SELECT }}>
            <Shapes />
            <div className="relative flex flex-col gap-10 min-h-[clamp(320px,30vw,440px)] justify-end px-[clamp(24px,5vw,72px)] py-[clamp(44px,5vw,72px)] min-[901px]:flex-row min-[901px]:items-end min-[901px]:justify-between">
              <div>
                <p className="m-0 text-[15px] leading-none font-medium text-white/55">Contact</p>
                <BuildHeading />
              </div>
              <div className="flex flex-col items-start gap-5 min-[901px]:items-end">
                <a
                  href={`mailto:${EMAIL}`}
                  className="group inline-flex items-center gap-2.5 bg-white px-6 py-4 text-[16px] leading-none font-medium text-ink no-underline [transition:translate_300ms_var(--ease-out-expo),box-shadow_300ms_var(--ease-out-expo)] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[3px_3px_0_#7B61FF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7B61FF] motion-reduce:transition-none"
                >
                  Start a project
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-[3px]">
                    →
                  </span>
                </a>
              </div>
            </div>
            {HANDLES.map(([x, y]) => (
              <span
                key={`${x}-${y}`}
                aria-hidden="true"
                className="absolute size-[8px] -translate-x-1/2 -translate-y-1/2 border bg-white"
                style={{ left: `${x}%`, top: `${y}%`, borderColor: SELECT }}
              />
            ))}
          </div>
        </Reveal>

        {current && (
          <nav aria-label="More work" className="mt-[clamp(40px,6vh,72px)] border-t border-line pt-7">
            <p className="m-0 text-[15px] leading-none font-medium text-muted">More work</p>
            <ul className="m-0 mt-5 flex list-none flex-wrap gap-x-8 gap-y-3 p-0">
              {PROJECTS.filter((p) => p.slug !== current).map((p) => (
                <li key={p.slug}>
                  <Link
                    href={caseStudyHref(p.slug)}
                    className="text-[clamp(18px,1.6vw,24px)] leading-[1.3] font-medium tracking-[-0.02em] text-ink no-underline underline-offset-4 hover:underline focus-visible:rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </section>

      {/* Site footer: name on the left, copyright in the centre, socials and back to top as icons. */}
      <footer className="mx-auto mt-[clamp(40px,6vh,72px)] grid max-w-[var(--max)] grid-cols-[1fr_auto] items-center gap-4 border-t border-line px-[var(--gutter)] py-6 font-body text-[14px] leading-none min-[641px]:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="inline-flex items-center gap-2.5 justify-self-start text-[16px] font-medium tracking-[-0.02em] text-ink no-underline focus-visible:rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
          <span aria-hidden className="size-[9px] rounded-full bg-ink shadow-[0_0_0_3px_rgba(13,13,12,.1)]" />
          Anukriti Mishra
        </Link>
        <p className="col-span-2 row-start-2 m-0 text-center text-faint min-[641px]:col-span-1 min-[641px]:row-start-auto">
          © {new Date().getFullYear()} Anukriti Mishra
        </p>
        <div className="flex items-center justify-end gap-2">
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={iconButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
              <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3zM9.5 9.75h3.8v1.5h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-4z" />
            </svg>
          </a>
          <a href={`mailto:${EMAIL}`} aria-label={`Email ${EMAIL}`} className={iconButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" />
              <path d="M3.5 6l8.5 7 8.5-7" />
            </svg>
          </a>
          <button type="button" onClick={toTop} aria-label="Back to top" className={`group ${iconButton} ml-2 bg-ink text-white hover:bg-[#2a2a2d]`}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-y-[2px]">
              <path d="M12 19V5M6 11l6-6 6 6" />
            </svg>
          </button>
        </div>
      </footer>
    </>
  )
}
