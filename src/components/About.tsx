'use client'

import { useRef } from 'react'
import { Reveal, SplitReveal } from './Reveal'
import { gsap, useGSAP, reducedMotion } from '@/lib/gsap'

// About + career timeline (content from Figma "About Me + Timeline", 156:14540, and the resume).
// Timeline x positions are in px along a 1180-wide track.
const TRACK = 1180

type Stop = {
  x: number
  year: string
  role?: string
  company?: string
  state: 'past' | 'current' | 'next'
}

// From the resume (Anukriti Mishra_ UI UX Designer.pdf).
const STOPS: Stop[] = [
  { x: 40, year: '2024', role: 'UI/UX Design Intern', company: 'IAS Sathi', state: 'past' },
  { x: 325, year: '2024', role: 'UI/UX Design Intern', company: 'Pulsefit', state: 'past' },
  { x: 610, year: '2025', role: 'UI/UX Intern', company: 'Gamalabs', state: 'past' },
  { x: 895, year: '2026', role: 'B.A. Visual Communication', company: "St Joseph's University", state: 'current' },
  { x: 1140, year: '20??', state: 'next' },
]

// Track segments: dotted "studying" lead-in, solid past, then the stretch toward what's next.
const SEGMENTS = [
  { kind: 'studying', from: 0, to: 40 },
  { kind: 'past', from: 40, to: 895 },
  { kind: 'next', from: 895, to: 1140 },
] as const

const SEGMENT_STYLE = {
  studying: 'bg-[repeating-linear-gradient(90deg,var(--color-faint)_0_3px,transparent_3px_7px)]',
  past: 'bg-faint',
  next: 'bg-ink',
}

// Written from the resume for now (summary, experience, education and skills).
const ABOUT = [
  "I'm a UI/UX designer studying Visual Communication at St Joseph's University, Bengaluru, and I design end-to-end digital products for startups and growing teams.",
  "I've designed across mobile apps, web dashboards and enterprise platforms: Zync, a consumer fitness app; Dhondi, a group-level college ERP; and CliHub, a multi-platform SSH client with an AI terminal assistant.",
  'I own the full design lifecycle, from concept and wireframes to high-fidelity Figma prototypes, and work closely with developers and stakeholders to ship products that are both functional and delightful.',
  "I like taking things all the way to launch: at Pulsefit I built the company website end-to-end in WordPress, from design system to deployment. My everyday tools are Figma, Illustrator and Photoshop.",
]

const pct = (x: number) => `${(x / TRACK) * 100}%`

export default function About() {
  const timeline = useRef<HTMLDivElement>(null)

  // The track draws in from the left, segment by segment, and each stop appears as the line
  // reaches it.
  useGSAP(
    () => {
      const segments = gsap.utils.toArray<HTMLElement>('[data-segment]')
      const stops = gsap.utils.toArray<HTMLElement>('[data-stop]')
      if (reducedMotion()) {
        gsap.set(segments, { scaleX: 1 })
        gsap.set(stops, { autoAlpha: 1, y: 0 })
        return
      }
      const at = (el: HTMLElement) => Number(el.dataset.at) * 1.4
      const scrollTrigger = { trigger: timeline.current, start: 'top 88%', once: true }
      segments.forEach((el) =>
        gsap.to(el, { scaleX: 1, duration: 1.2, ease: 'expo.out', delay: at(el), scrollTrigger }),
      )
      stops.forEach((el) =>
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', delay: at(el) + 0.2, scrollTrigger },
        ),
      )
    },
    { scope: timeline },
  )

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      // overflow-x clip: the last timeline stop's label hangs past the track end.
      className="mx-auto flex max-w-[var(--max)] flex-col gap-[clamp(56px,9vh,104px)] overflow-x-clip border-t border-line bg-paper px-[var(--gutter)] py-[clamp(80px,14vh,160px)]"
    >
      <div className="grid grid-cols-1 gap-5 min-[901px]:grid-cols-[minmax(160px,1fr)_3fr] min-[901px]:items-start">
        <Reveal as="p" className="m-0 text-[15px] leading-none font-medium text-muted min-[901px]:pt-[14px]">
          About <span className="text-faint">(02)</span>
        </Reveal>
        <SplitReveal
          as="h2"
          id="about-heading"
          className="m-0 max-w-[18ch] text-[clamp(36px,5vw,76px)] leading-[1.02] font-medium tracking-[-0.04em] text-ink"
          text="I design calm, usable software for messy, high-stakes work."
        />
      </div>

      {/* Timeline: a 1180-wide track, scrolls sideways on narrow screens. */}
      <div className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] min-[901px]:m-0 min-[901px]:overflow-visible min-[901px]:p-0">
        <div
          ref={timeline}
          // Inset from the right on desktop so the last stop's label stays inside the column.
          className="relative mx-[90px] h-[180px] min-w-[960px] [--line-y:62px] min-[901px]:mr-16 min-[901px]:ml-0 min-[901px]:min-w-0"
        >
          <span className="absolute top-0 left-0 text-[11px] leading-none font-semibold tracking-[0.12em] text-faint uppercase">
            Studying
          </span>
          {SEGMENTS.map((s) => (
            <span
              key={s.from}
              data-segment
              data-at={s.from / TRACK}
              className={`absolute top-[var(--line-y)] h-px origin-left [transform:scaleX(0)] motion-reduce:[transform:none] ${SEGMENT_STYLE[s.kind]}`}
              style={{ left: pct(s.from), width: pct(s.to - s.from) }}
            />
          ))}
          <ol className="absolute inset-0 m-0 list-none p-0" aria-label="Career timeline">
            {STOPS.map((stop) => {
              const current = stop.state === 'current'
              return (
                <li
                  key={stop.x}
                  data-stop
                  data-at={stop.x / TRACK}
                  aria-current={current ? 'step' : undefined}
                  className="invisible absolute top-0 bottom-0 w-[260px] -translate-x-1/2 text-center"
                  style={{ left: pct(stop.x) }}
                >
                  <span
                    className={`absolute left-1/2 -translate-x-1/2 leading-none whitespace-nowrap tabular-nums ${
                      current
                        ? 'top-6 rounded-full bg-ink px-[10px] py-1 text-[12px] font-semibold text-white'
                        : 'top-7 text-[13px] font-medium text-muted'
                    }`}
                  >
                    {stop.year}
                  </span>
                  {/* Dots centre on the track line. */}
                  <span
                    className={`absolute left-1/2 -translate-x-1/2 rounded-full ${
                      current
                        ? 'top-[calc(var(--line-y)-7px)] h-[15px] w-[15px] bg-ink shadow-[0_0_0_5px_rgba(11,11,12,0.1)]'
                        : stop.state === 'next'
                          ? 'top-[calc(var(--line-y)-5px)] h-[11px] w-[11px] border-[1.5px] border-ink bg-white'
                          : 'top-[calc(var(--line-y)-5px)] h-[11px] w-[11px] bg-faint'
                    }`}
                  />
                  {stop.role ? (
                    <>
                      <span className="absolute top-[88px] right-0 left-0 text-[16px] leading-[1.25] font-semibold tracking-[-0.01em] text-ink">
                        {stop.role}
                      </span>
                      <span className="absolute top-[112px] right-0 left-0 text-[14px] leading-[1.25] font-normal text-muted">
                        {stop.company}
                      </span>
                    </>
                  ) : (
                    <span className="absolute top-[84px] left-1/2 -translate-x-1/2 rounded-full border border-ink px-[14px] py-2 text-[13px] leading-none font-semibold whitespace-nowrap text-ink">
                      You can be here next! :D
                    </span>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      <ol className="m-0 grid list-none grid-cols-1 gap-x-16 gap-y-8 p-0 min-[901px]:grid-cols-2">
        {ABOUT.map((text, i) => (
          <Reveal as="li" key={i} className="flex gap-5 border-t border-line pt-5" delay={i * 90}>
            <span className="w-6 flex-none text-[13px] leading-[1.9] font-medium text-faint tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="m-0 text-[clamp(16px,1.2vw,18px)] leading-[1.6] font-normal text-muted">{text}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
