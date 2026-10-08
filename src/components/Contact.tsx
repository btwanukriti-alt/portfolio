'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { Reveal } from './Reveal'
import { getLenis } from './SmoothScroll'
import { gsap, useGSAP, reducedMotion } from '@/lib/gsap'
import { PROJECTS, caseStudyHref } from '@/data/projects'
import { EMAIL, LINKEDIN, LINKEDIN_ID } from '@/data/site'

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

// The D in a 100-unit cap height; `b` pushes the bowl out (the dragged handle).
const dPath = (b: number) => {
  const o = 88 + b
  const i = 71 + b * 0.8
  return `M0 0H38C${70 + b} 0 ${o} 20 ${o} 50C${o} 80 ${70 + b} 100 38 100H0Z M15 15H36C${58 + b * 0.8} 15 ${i} 29 ${i} 50C${i} 71 ${58 + b * 0.8} 85 36 85H15Z`
}
const NODES = [
  [0, 0],
  [38, 0],
  [88, 50],
  [38, 100],
  [0, 100],
]

function PenD() {
  const root = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      const svg = root.current
      if (!svg) return
      const shape = svg.querySelector<SVGPathElement>('[data-shape]')!
      const outline = svg.querySelector<SVGPathElement>('[data-outline]')!
      const nodes = svg.querySelectorAll('[data-node]')
      const handle = svg.querySelector<SVGGElement>('[data-handle]')!
      const pen = svg.querySelector<SVGGElement>('[data-pen]')!
      if (reducedMotion()) return
      const state = { b: 0 }
      const draw = () => {
        const d = dPath(state.b)
        shape.setAttribute('d', d)
        outline.setAttribute('d', d)
        handle.setAttribute('transform', `translate(${state.b} 0)`)
      }
      const len = outline.getTotalLength()
      gsap.set(shape, { opacity: 0 })
      gsap.set(outline, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 })
      gsap.set([nodes, handle, pen], { opacity: 0 })
      gsap
        .timeline({ scrollTrigger: { trigger: svg, start: 'top 85%', once: true } })
        // Pen tool: the outline is drawn point by point (0.6s).
        .to(pen, { opacity: 1, duration: 0.1 })
        .to(outline, { strokeDashoffset: 0, duration: 0.6, ease: 'power1.inOut' }, '<')
        .to(nodes, { opacity: 1, duration: 0.08, stagger: 0.1 }, '<')
        // Grab the curve's handle and drag it out (0.35s)…
        .to(handle, { opacity: 1, duration: 0.1 })
        .to(state, { b: 16, duration: 0.35, ease: 'power2.out', onUpdate: draw })
        // …let go: it shakes back into shape and fills in (0.7s).
        .to(state, { b: 0, duration: 0.7, ease: 'elastic.out(1.1, 0.3)', onUpdate: draw })
        .to(shape, { opacity: 1, duration: 0.3 }, '<0.1')
        .to([outline, nodes, handle, pen], { opacity: 0, duration: 0.3 }, '<0.2')
    },
    { scope: root },
  )

  return (
    <svg
      ref={root}
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="ml-[0.03em] inline-block h-[0.72em] w-[0.66em] overflow-visible align-baseline"
    >
      <path data-shape d={dPath(0)} fill="currentColor" fillRule="evenodd" />
      <path data-outline d={dPath(0)} fill="none" stroke={SELECT} strokeWidth="1.5" vectorEffect="non-scaling-stroke" opacity="0" />
      {NODES.map(([x, y]) => (
        <rect key={`${x}-${y}`} data-node x={x - 3} y={y - 3} width="6" height="6" fill="#fff" stroke={SELECT} strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0" />
      ))}
      <g data-handle opacity="0">
        <line x1="88" y1="50" x2="88" y2="18" stroke={SELECT} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <circle cx="88" cy="18" r="3.2" fill={SELECT} />
        <g data-pen opacity="0" transform="translate(91 21) scale(0.42)">
          <path d="M0 0l14 34 6-12 12-6z" fill="#fff" stroke="#0b0b0c" strokeWidth="2" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  )
}

// The showcase canvas shapes (ring, pill, star), large and cropped by the frame's edges.
function Shapes() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="absolute -top-[12%] -left-[6%] size-[clamp(140px,16vw,240px)] rounded-full border-[clamp(18px,2vw,30px)] border-white/90" />
      <span className="absolute -top-[6%] -right-[8%] h-[clamp(64px,7vw,104px)] w-[clamp(220px,24vw,360px)] rounded-full bg-[#FFD25A]" />
      <svg className="absolute -right-[4%] -bottom-[24%] w-[clamp(120px,13vw,200px)] animate-[spin_24s_linear_infinite] motion-reduce:animate-none" viewBox="0 0 100 100">
        <path d="M50 0C53 34 66 47 100 50C66 53 53 66 50 100C47 66 34 53 0 50C34 47 47 34 50 0Z" fill="#7B61FF" />
      </svg>
    </div>
  )
}

// On a case study page, `current` is its slug: the footer then links to the other projects.
export default function Contact({ current }: { current?: string } = {}) {
  const toTop = () => {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { duration: 1.4 })
    else window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' })
  }

  return (
    <footer
      id="reach-out"
      aria-labelledby="contact-heading"
      className="mx-auto max-w-[var(--max)] bg-paper px-[var(--gutter)] pt-[clamp(56px,9vh,104px)] pb-8 font-body"
    >
      <Reveal className="relative mt-6">
        {/* Selection: the frame's name, a border with handles, and its size. */}
        <span className="absolute bottom-full left-0 mb-2 text-[12px] leading-none font-medium" style={{ color: SELECT }}>
          Let&apos;s build
        </span>
        <div className="relative bg-ink text-white outline outline-1 outline-offset-0" style={{ outlineColor: SELECT }}>
          <Shapes />
          <div className="relative flex flex-col gap-10 min-h-[clamp(440px,42vw,620px)] justify-end px-[clamp(24px,5vw,72px)] py-[clamp(56px,7vw,104px)] min-[901px]:flex-row min-[901px]:items-end min-[901px]:justify-between">
            <div>
              <p className="m-0 text-[15px] leading-none font-medium text-white/55">Contact</p>
              <h2
                id="contact-heading"
                className="m-0 mt-5 text-[clamp(56px,10vw,168px)] leading-[0.92] font-medium tracking-[-0.045em] whitespace-nowrap"
              >
                Let&apos;s <span className="tracking-[-0.02em]">BUIL</span>
                <PenD />
                <span className="sr-only">D</span>
              </h2>
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
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] leading-none text-white/65">
                <a href={`mailto:${EMAIL}`} className="text-inherit no-underline transition-colors hover:text-white">
                  {EMAIL}
                </a>
                {LINKEDIN && (
                  <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="text-inherit no-underline transition-colors hover:text-white">
                    in/{LINKEDIN_ID}
                  </a>
                )}
              </div>
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

      <div className="mt-[clamp(32px,5vh,56px)] flex items-center justify-between gap-4 text-[13px] leading-none text-faint">
        <span>© {new Date().getFullYear()} Anukriti Mishra</span>
        <button
          type="button"
          onClick={toTop}
          className="group inline-flex items-center gap-1.5 text-muted transition-colors hover:text-ink focus-visible:rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          Back to top
          <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-[2px]">
            ↑
          </span>
        </button>
      </div>
    </footer>
  )
}
