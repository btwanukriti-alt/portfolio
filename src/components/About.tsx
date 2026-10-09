'use client'

import { useRef } from 'react'
import { Reveal } from './Reveal'
import { gsap, useGSAP, reducedMotion } from '@/lib/gsap'

// About: a headline set like a Figma selection, the disciplines as coloured chips, a career
// timeline of pastel cards on a gradient line, and four short notes. Roles from the resume.

const SELECT = '#7B61FF'

// The disciplines around the product, in the work cards' pastel palette.
const CHIPS = [
  { label: 'UX & UI', bg: '#DCCFFF', fg: '#3E2B94' },
  { label: 'Branding', bg: '#FFE4D3', fg: '#8A3B12' },
  { label: 'Websites', bg: '#CFDDFF', fg: '#12326E' },
  { label: 'Motion', bg: '#C9EEDC', fg: '#0C5A3E' },
  { label: 'AI features', bg: '#FFE8EE', fg: '#9E1F45' },
]

type Stop = { year: string; role: string; company: string; kind: string; bg: string; dot: string }

// From the resume (Anukriti Mishra_ UI UX Designer.pdf). Each card takes a colour from the palette.
const STOPS: Stop[] = [
  { year: '2024', role: 'UI/UX Design Intern', company: 'IAS Sathi', kind: 'Internship', bg: '#E4ECFF', dot: '#4F86E8' },
  { year: '2024', role: 'UI/UX Design Intern', company: 'Pulsefit', kind: 'Internship', bg: '#FFF1E6', dot: '#F28C28' },
  { year: '2025', role: 'UI/UX Design Intern', company: 'Gamalabs', kind: 'Internship', bg: '#EEE8FF', dot: SELECT },
  { year: '2026', role: 'Freelance Product Designer', company: 'Alzyon Tech Solutions', kind: 'Freelance', bg: '#E3F6EC', dot: '#1A9E6E' },
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
      gsap.fromTo(cards, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, delay: 0.25, scrollTrigger })
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
            I design{' '}
            <span className="relative inline-block">
              <span aria-hidden="true" className="absolute -inset-x-[0.1em] inset-y-[0.04em]" >
                <span className="absolute inset-0 border-[1.5px]" style={{ borderColor: SELECT }} />
              {[
                [0, 0],
                [100, 0],
                [0, 100],
                [100, 100],
              ].map(([x, y]) => (
                <span
                  key={`${x}-${y}`}
                  aria-hidden="true"
                  className="absolute size-[clamp(6px,0.6vw,9px)] -translate-x-1/2 -translate-y-1/2 border-[1.5px] bg-white"
                  style={{ left: `${x}%`, top: `${y}%`, borderColor: SELECT }}
                />
              ))}
              <span
                aria-hidden="true"
                className="absolute bottom-full left-0 mb-[6px] rounded-[3px] px-[6px] py-[3px] text-[clamp(10px,0.8vw,12px)] leading-none font-medium tracking-normal whitespace-nowrap text-white"
                style={{ background: SELECT }}
              >
                Product
              </span>
              </span>
              products
            </span>
            ,<br /> and everything around them.
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

      {/* Timeline: a gradient line through coloured dots, a pastel card per role, and the open spot. */}
      <div ref={timeline}>
        <div className="mb-6 flex items-end justify-between gap-4">
          <p className="m-0 text-[11px] leading-none font-semibold tracking-[0.12em] text-faint uppercase">Experience</p>
          <p className="m-0 text-[13px] leading-none font-medium text-faint tabular-nums">2024 — Now</p>
        </div>
        <ol aria-label="Career timeline" className="relative m-0 grid list-none grid-cols-1 gap-3 p-0 pl-8 min-[901px]:grid-cols-5 min-[901px]:gap-4 min-[901px]:pt-9 min-[901px]:pl-0">
          {/* The line: across the top of the cards on wide screens, down their left on narrow ones. */}
          <span
            data-line
            aria-hidden="true"
            className="absolute top-[14px] left-0 hidden h-[3px] w-full origin-left scale-x-0 rounded-full min-[901px]:block"
            style={{ background: `linear-gradient(90deg, #4F86E8, #F28C28 30%, ${SELECT} 55%, #1A9E6E 78%, #0b0b0c)` }}
          />
          <span
            data-line
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[10px] w-[3px] origin-top scale-y-0 rounded-full min-[901px]:hidden"
            style={{ background: `linear-gradient(180deg, #4F86E8, #F28C28 30%, ${SELECT} 55%, #1A9E6E 78%, #0b0b0c)` }}
          />
          {STOPS.map((stop) => (
            <li key={stop.company} className="relative">
              <span
                data-dot
                aria-hidden="true"
                className="invisible absolute top-[22px] -left-[29px] size-[15px] rounded-full border-[3px] border-white shadow-[0_0_0_1px_rgba(11,11,12,0.08)] min-[901px]:-top-[29px] min-[901px]:left-6"
                style={{ background: stop.dot }}
              />
              <div data-card className="invisible flex h-full flex-col gap-3 rounded-[20px] p-[clamp(18px,1.6vw,24px)]" style={{ background: stop.bg }}>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-white px-[10px] py-[6px] text-[12px] leading-none font-semibold text-ink tabular-nums">{stop.year}</span>
                  <span className="text-[12px] leading-none font-medium" style={{ color: stop.dot }}>
                    {stop.kind}
                  </span>
                </div>
                <p className="m-0 mt-auto pt-[clamp(12px,2.2vw,36px)] text-[clamp(16px,1.25vw,19px)] leading-[1.2] font-semibold tracking-[-0.015em] text-ink">{stop.role}</p>
                <p className="m-0 text-[14px] leading-[1.3] text-muted">{stop.company}</p>
              </div>
            </li>
          ))}
          <li className="relative">
            <span
              data-dot
              aria-hidden="true"
              className="invisible absolute top-[22px] -left-[29px] size-[15px] rounded-full border-[3px] border-white bg-ink shadow-[0_0_0_1px_rgba(11,11,12,0.08)] min-[901px]:-top-[29px] min-[901px]:left-6"
            />
            <a
              data-card
              href="#reach-out"
              className="group invisible flex h-full flex-col gap-3 rounded-[20px] border-[1.5px] border-dashed bg-white p-[clamp(18px,1.6vw,24px)] text-ink no-underline transition-colors hover:bg-[#F7F5FF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7B61FF]"
              style={{ borderColor: SELECT }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-ink px-[10px] py-[6px] text-[12px] leading-none font-semibold text-white">Now</span>
                <span className="inline-flex items-center gap-1.5 text-[12px] leading-none font-medium text-[#1A9E6E]">
                  <span className="size-[7px] animate-pulse rounded-full bg-[#1A9E6E] motion-reduce:animate-none" />
                  Open to work
                </span>
              </div>
              <p className="m-0 mt-auto pt-[clamp(12px,2.2vw,36px)] text-[clamp(16px,1.25vw,19px)] leading-[1.2] font-semibold tracking-[-0.015em]">Your team, next?</p>
              <p className="m-0 inline-flex items-center gap-1.5 text-[14px] leading-[1.3] text-muted transition-colors group-hover:text-ink">
                Get in touch
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-[3px]">
                  →
                </span>
              </p>
            </a>
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
