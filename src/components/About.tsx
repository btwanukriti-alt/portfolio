'use client'

import { useRef } from 'react'
import { Reveal } from './Reveal'
import { gsap, useGSAP, reducedMotion } from '@/lib/gsap'

// About: a headline with an empty Figma frame for the blank canvas, the disciplines as coloured
// chips, a slim career timeline on a gradient line, and four short notes. Roles from the resume.

const SELECT = '#7B61FF'

// The disciplines around the product, in the work cards' pastel palette.
const CHIPS = [
  { label: 'UX & UI', bg: '#DCCFFF', fg: '#3E2B94' },
  { label: 'Branding', bg: '#FFE4D3', fg: '#8A3B12' },
  { label: 'Websites', bg: '#CFDDFF', fg: '#12326E' },
  { label: 'Motion', bg: '#C9EEDC', fg: '#0C5A3E' },
  { label: 'AI features', bg: '#FFE8EE', fg: '#9E1F45' },
]

type Stop = { year: string; role: string; company: string; kind: string; dot: string }

// From the resume (Anukriti Mishra_ UI UX Designer.pdf). Each stop takes a colour from the palette.
const STOPS: Stop[] = [
  { year: '2024', role: 'UI/UX Design Intern', company: 'IAS Sathi', kind: 'Internship', dot: '#4F86E8' },
  { year: '2024', role: 'UI/UX Design Intern', company: 'Pulsefit', kind: 'Internship', dot: '#F28C28' },
  { year: '2025', role: 'UI/UX Design Intern', company: 'Gamalabs', kind: 'Internship', dot: SELECT },
  { year: '2026', role: 'Freelance Product Designer', company: 'Alzyon Tech Solutions', kind: 'Freelance', dot: '#1A9E6E' },
]

const ABOUT = [
  'I design SaaS products, and no two have been alike: a gym CRM, a college ERP, an SSH client for engineers, a trading analytics platform and a fitness app. B2B and B2C, desktop and mobile.',
  'I learn each industry before I design for it, from the team that knows it and the products its users already rely on.',
  "I design AI features, and I design with AI. I've designed an AI strategy lab and an AI terminal assistant, and I built this website and its product videos with Claude.",
  'I trained in Visual Communication: branding, illustration, photography, film and print. On most projects I also design the logo, the visual system and the marketing website.',
]

export default function About() {
  const timeline = useRef<HTMLDivElement>(null)

  // The gradient line draws across (down, on narrow screens) and the cards rise in after it.
  useGSAP(
    () => {
      const line = timeline.current?.querySelectorAll<HTMLElement>('[data-line]') ?? []
      const cards = gsap.utils.toArray<HTMLElement>('[data-card]')
      const dots = gsap.utils.toArray<HTMLElement>('[data-dot]')
      if (reducedMotion()) {
        gsap.set(line, { scale: 1 })
        gsap.set([...cards, ...dots], { autoAlpha: 1, y: 0, scale: 1 })
        return
      }
      const scrollTrigger = { trigger: timeline.current, start: 'top 82%', once: true }
      gsap.to(line, { scale: 1, duration: 1.4, ease: 'power2.inOut', scrollTrigger })
      gsap.fromTo(dots, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power2.out', stagger: 0.22, delay: 0.15, scrollTrigger })
      gsap.fromTo(cards, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, delay: 0.25, scrollTrigger })
    },
    { scope: timeline },
  )

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="mx-auto flex max-w-[var(--max)] flex-col gap-[clamp(48px,7vh,88px)] border-t border-line bg-paper px-[var(--gutter)] py-[clamp(80px,13vh,150px)]"
    >
      {/* Heading: "products" is selected like a Figma layer; the chips are everything around it. */}
      <div className="grid grid-cols-1 gap-6 min-[901px]:grid-cols-[minmax(160px,1fr)_3fr] min-[901px]:items-start">
        <Reveal as="p" className="m-0 text-[15px] leading-none font-medium text-muted min-[901px]:pt-[18px]">
          About <span className="text-faint">(02)</span>
        </Reveal>
        <div>
          <Reveal as="h2" id="about-heading" className="m-0 text-[clamp(36px,4.9vw,74px)] leading-[1.04] font-medium tracking-[-0.045em] text-ink">
            I take products from a{' '}
            <span className="relative inline-block">
              {/* An empty Figma frame: the blank canvas everything starts on. */}
              <span aria-hidden="true" className="absolute -inset-x-[0.1em] inset-y-[0.04em]">
                <span className="absolute inset-0 border-[1.5px] border-dashed" style={{ borderColor: SELECT }} />
                {[
                  [0, 0],
                  [100, 0],
                  [0, 100],
                  [100, 100],
                ].map(([x, y]) => (
                  <span
                    key={`${x}-${y}`}
                    className="absolute size-[clamp(6px,0.6vw,9px)] -translate-x-1/2 -translate-y-1/2 border-[1.5px] bg-white"
                    style={{ left: `${x}%`, top: `${y}%`, borderColor: SELECT }}
                  />
                ))}
                <span
                  className="absolute top-0 left-full ml-[0.35em] rounded-[3px] px-[6px] py-[3px] text-[clamp(10px,0.8vw,12px)] leading-none font-medium tracking-normal whitespace-nowrap text-white"
                  style={{ background: SELECT }}
                >
                  Frame 1
                </span>
              </span>
              blank canvas
            </span>
            <br /> to launch day.
          </Reveal>
          <Reveal as="ul" delay={150} className="m-0 mt-[clamp(24px,3vw,36px)] flex list-none flex-wrap gap-2.5 p-0">
            {CHIPS.map((c) => (
              <li
                key={c.label}
                className="rounded-full px-4 py-2.5 text-[clamp(13px,1vw,15px)] leading-none font-medium"
                style={{ background: c.bg, color: c.fg }}
              >
                {c.label}
              </li>
            ))}
          </Reveal>
        </div>
      </div>

      {/* Timeline: a slim gradient line through coloured dots, each role in a few words under its
          dot, ending at an open spot. Down the left on narrow screens. */}
      <div ref={timeline}>
        <p className="m-0 mb-5 text-[11px] leading-none font-semibold tracking-[0.12em] text-faint uppercase">Experience</p>
        <ol aria-label="Career timeline" className="relative m-0 grid list-none grid-cols-1 gap-6 p-0 pl-7 min-[901px]:grid-cols-5 min-[901px]:gap-6 min-[901px]:pt-7 min-[901px]:pl-0">
          <span
            data-line
            aria-hidden="true"
            className="absolute top-[6px] left-0 hidden h-[2px] w-full origin-left scale-x-0 rounded-full min-[901px]:block"
            style={{ background: `linear-gradient(90deg, #4F86E8, #F28C28 30%, ${SELECT} 55%, #1A9E6E 78%, #0b0b0c)` }}
          />
          <span
            data-line
            aria-hidden="true"
            className="absolute top-1 bottom-1 left-[6px] w-[2px] origin-top scale-y-0 rounded-full min-[901px]:hidden"
            style={{ background: `linear-gradient(180deg, #4F86E8, #F28C28 30%, ${SELECT} 55%, #1A9E6E 78%, #0b0b0c)` }}
          />
          {STOPS.map((stop) => (
            <li key={stop.company} className="relative">
              <span
                data-dot
                aria-hidden="true"
                className="invisible absolute top-[2px] -left-[27px] size-[14px] rounded-full border-[3px] border-white shadow-[0_0_0_1px_rgba(11,11,12,0.08)] min-[901px]:-top-[27px] min-[901px]:left-0"
                style={{ background: stop.dot }}
              />
              <div data-card className="invisible">
                <p className="m-0 text-[13px] leading-none font-semibold tabular-nums" style={{ color: stop.dot }}>
                  {stop.year} · {stop.kind}
                </p>
                <p className="m-0 mt-2.5 text-[16px] leading-[1.25] font-semibold tracking-[-0.01em] text-ink">{stop.role}</p>
                <p className="m-0 mt-1 text-[14px] leading-[1.3] text-muted">{stop.company}</p>
              </div>
            </li>
          ))}
          <li className="relative">
            <span
              data-dot
              aria-hidden="true"
              className="invisible absolute top-[2px] -left-[27px] size-[14px] rounded-full border-[3px] border-white bg-ink shadow-[0_0_0_1px_rgba(11,11,12,0.08)] min-[901px]:-top-[27px] min-[901px]:left-0"
            />
            <div data-card className="invisible">
              <p className="m-0 flex items-center gap-1.5 text-[13px] leading-none font-semibold text-[#1A9E6E]">
                <span className="size-[7px] animate-pulse rounded-full bg-[#1A9E6E] motion-reduce:animate-none" />
                Now · Open to work
              </p>
              <a
                href="#reach-out"
                className="group mt-2.5 flex w-fit items-center gap-1.5 text-[16px] leading-[1.25] font-semibold tracking-[-0.01em] text-ink no-underline underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7B61FF]"
              >
                Your team, next?
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-[3px]">
                  →
                </span>
              </a>
            </div>
          </li>
        </ol>
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
