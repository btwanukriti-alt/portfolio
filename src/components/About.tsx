'use client'

import { useRef } from 'react'
import { Reveal } from './Reveal'
import { gsap, useGSAP, reducedMotion } from '@/lib/gsap'

// About: the title as a Figma comment that types itself out, the disciplines as quiet chips, a
// slim career timeline, and four short notes. Roles from the resume.

const SELECT = '#7B61FF'

const TITLE = 'The story so far.'

// The disciplines, as quiet chips under the heading.
const CHIPS = ['UX & UI', 'Branding', 'Websites', 'Motion', 'AI features']

type Stop = { year: string; role: string; company: string; kind: string }

// From the resume (Anukriti Mishra_ UI UX Designer.pdf).
const STOPS: Stop[] = [
  { year: '2024', role: 'UI/UX Design Intern', company: 'IAS Sathi', kind: 'Internship' },
  { year: '2024', role: 'UI/UX Design Intern', company: 'Pulsefit', kind: 'Internship' },
  { year: '2025', role: 'UI/UX Design Intern', company: 'Gamalabs', kind: 'Internship' },
  { year: '2026', role: 'Freelance Product Designer', company: 'Alzyon Tech Solutions', kind: 'Freelance' },
]

const ABOUT = [
  'I design SaaS products, and no two have been alike: a gym CRM, a college ERP, an SSH client for engineers, a trading analytics platform and a fitness app. B2B and B2C, desktop and mobile.',
  'I learn each industry before I design for it, from the team that knows it and the products its users already rely on.',
  "I design AI features, and I design with AI. I've designed an AI strategy lab and an AI terminal assistant, and I built this website and its product videos with Claude.",
  'I trained in Visual Communication: branding, illustration, photography, film and print. On most projects I also design the logo, the visual system and the marketing website.',
]

export default function About() {
  const timeline = useRef<HTMLDivElement>(null)
  const comment = useRef<HTMLDivElement>(null)

  // The comment pops in and its title types itself out, once, when the section arrives.
  useGSAP(
    () => {
      const box = comment.current
      if (!box) return
      const typed = box.querySelector<HTMLElement>('[data-typed]')!
      const caret = box.querySelector<HTMLElement>('[data-caret]')!
      if (reducedMotion()) {
        caret.style.display = 'none'
        return
      }
      const chars = { n: 0 }
      typed.textContent = ''
      gsap.set(box, { autoAlpha: 0, y: 16, scale: 0.97, transformOrigin: '0% 0%' })
      gsap
        .timeline({ scrollTrigger: { trigger: box, start: 'top 85%', once: true } })
        .to(box, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' })
        .set(caret, { animation: 'none' })
        .to(chars, {
          n: TITLE.length,
          duration: TITLE.length * 0.06,
          ease: 'none',
          onUpdate: () => {
            typed.textContent = TITLE.slice(0, Math.round(chars.n))
          },
        }, '+=0.15')
        .set(caret, { animation: '' })
    },
    { scope: comment },
  )

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
      {/* Heading, centred, as a Figma comment: Anukriti's pin and a bubble in which the title types
          itself out when the section arrives. The disciplines follow as quiet chips. */}
      <div className="flex flex-col items-center text-center">
        <div ref={comment} className="relative inline-flex items-start gap-3 text-left">
          {/* The comment pin: a rounded tear with her initials. */}
          <span
            aria-hidden="true"
            className="mt-1 grid size-[clamp(36px,3vw,44px)] flex-none place-items-center rounded-full rounded-bl-none text-[clamp(13px,1vw,15px)] leading-none font-semibold text-white shadow-[0_4px_12px_-4px_rgba(123,97,255,.6)]"
            style={{ background: SELECT }}
          >
            AM
          </span>
          <div className="rounded-[18px] rounded-tl-[6px] bg-white px-[clamp(18px,2vw,28px)] pt-[clamp(12px,1.2vw,16px)] pb-[clamp(16px,1.6vw,22px)] shadow-[0_1px_2px_rgba(11,11,12,.06),0_18px_40px_-16px_rgba(11,11,12,.22)] ring-1 ring-black/5">
            <p className="m-0 flex items-baseline gap-2 text-[13px] leading-none">
              <span className="font-semibold text-ink">Anukriti</span>
              <span className="text-faint">Just now</span>
            </p>
            <h2
              id="about-heading"
              aria-label="The story so far."
              className="relative m-0 mt-3 text-[clamp(28px,4.9vw,74px)] leading-[1.04] font-medium tracking-[-0.045em] whitespace-nowrap text-ink"
            >
              {/* An invisible copy holds the width; the typed text and caret sit on top. */}
              <span aria-hidden="true" className="invisible">
                {TITLE}
              </span>
              <span aria-hidden="true" className="absolute inset-0">
                <span data-typed>{TITLE}</span>
                <i
                  data-caret
                  className="ml-[0.04em] inline-block h-[0.82em] w-[3px] translate-y-[0.1em] animate-[caret-blink_1.06s_steps(1)_infinite] align-baseline"
                  style={{ background: SELECT }}
                />
              </span>
            </h2>
          </div>
        </div>
        <Reveal as="ul" delay={150} className="m-0 mt-[clamp(24px,3vw,36px)] flex list-none flex-wrap justify-center gap-2.5 p-0">
          {CHIPS.map((label) => (
            <li key={label} className="rounded-full border border-line px-4 py-2.5 text-[clamp(13px,1vw,15px)] leading-none font-medium text-muted">
              {label}
            </li>
          ))}
        </Reveal>
      </div>

      {/* Timeline: a slim line through grey dots, each role in a few words under its dot, ending at
          the open spot (green). Down the left on narrow screens. */}
      <div ref={timeline}>
        <p className="m-0 mb-5 text-[11px] leading-none font-semibold tracking-[0.12em] text-faint uppercase">Experience</p>
        <ol aria-label="Career timeline" className="relative m-0 grid list-none grid-cols-1 gap-6 p-0 pl-7 min-[901px]:grid-cols-5 min-[901px]:gap-6 min-[901px]:pt-7 min-[901px]:pl-0">
          <span
            data-line
            aria-hidden="true"
            className="absolute top-[6px] left-0 hidden h-[2px] w-full origin-left scale-x-0 rounded-full min-[901px]:block"
            style={{ background: 'linear-gradient(90deg, var(--color-line), var(--color-faint) 80%, var(--color-ink))' }}
          />
          <span
            data-line
            aria-hidden="true"
            className="absolute top-1 bottom-1 left-[6px] w-[2px] origin-top scale-y-0 rounded-full min-[901px]:hidden"
            style={{ background: 'linear-gradient(180deg, var(--color-line), var(--color-faint) 80%, var(--color-ink))' }}
          />
          {STOPS.map((stop) => (
            <li key={stop.company} className="relative">
              <span
                data-dot
                aria-hidden="true"
                className="invisible absolute top-[2px] -left-[27px] size-[14px] rounded-full border-[3px] border-white bg-faint shadow-[0_0_0_1px_rgba(11,11,12,0.08)] min-[901px]:-top-[27px] min-[901px]:left-0"
              />
              <div data-card className="invisible">
                <p className="m-0 text-[13px] leading-none font-medium text-faint tabular-nums">
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
              className="invisible absolute top-[2px] -left-[27px] size-[14px] rounded-full border-[3px] border-white bg-[#1A9E6E] shadow-[0_0_0_1px_rgba(11,11,12,0.08)] min-[901px]:-top-[27px] min-[901px]:left-0"
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
