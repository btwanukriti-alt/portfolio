'use client'

import { useRef, type CSSProperties } from 'react'
import { Reveal } from './Reveal'
import { gsap, useGSAP, reducedMotion } from '@/lib/gsap'

// About: the title typed by Anukriti's comment cursor, the disciplines as quiet chips, a
// slim career timeline, and four short notes. Roles from the resume.

const SELECT = '#7B61FF'

const TITLE = 'The story so far.'

// The disciplines, as quiet chips under the heading.
const CHIPS = ['UX & UI', 'Branding', 'Websites', 'Motion', 'AI features']

type Stop = { year: string; role: string; company: string; kind: string; dot: string }

// From the resume (Anukriti Mishra_ UI UX Designer.pdf).
// How each of the five stops lines up with its dot on wide screens.
const ALIGN = [
  { item: 'min-[901px]:text-left', dot: 'min-[901px]:left-0' },
  { item: 'min-[901px]:-translate-x-1/2 min-[901px]:text-center', dot: 'min-[901px]:left-1/2 min-[901px]:-translate-x-1/2' },
  { item: 'min-[901px]:-translate-x-1/2 min-[901px]:text-center', dot: 'min-[901px]:left-1/2 min-[901px]:-translate-x-1/2' },
  { item: 'min-[901px]:-translate-x-1/2 min-[901px]:text-center', dot: 'min-[901px]:left-1/2 min-[901px]:-translate-x-1/2' },
  { item: 'min-[901px]:-translate-x-full min-[901px]:text-right', dot: 'min-[901px]:left-auto min-[901px]:right-0' },
]

const STOPS: Stop[] = [
  { year: '2024', role: 'UI/UX Design Intern', company: 'IAS Sathi', dot: '#4F86E8', kind: 'Internship' },
  { year: '2024', role: 'UI/UX Design Intern', company: 'Pulsefit', dot: '#F28C28', kind: 'Internship' },
  { year: '2025', role: 'UI/UX Design Intern', company: 'Gamalabs', dot: '#F5577D', kind: 'Internship' },
  { year: '2026', role: 'Freelance Product Designer', company: 'Alzyon Tech Solutions', dot: '#1A9E6E', kind: 'Freelance' },
]

const ABOUT = [
  'I design SaaS products, and no two have been alike: a gym CRM, a college ERP, an SSH client for engineers, a trading analytics platform and a fitness app. B2B and B2C, desktop and mobile.',
  'I learn each industry before I design for it, from the team that knows it and the products its users already rely on.',
  "I design AI features, and I design with AI. I've designed an AI strategy lab and an AI terminal assistant, and I built this website and its product videos with Claude.",
  'I trained in Visual Communication: branding, illustration, photography, film and print. On most projects I also design the logo, the visual system and the marketing website.',
]

export default function About() {
  const timeline = useRef<HTMLDivElement>(null)
  const comment = useRef<HTMLHeadingElement>(null)

  // Anukriti's comment pin pops in, a cursor comes out of it and types the title, then the pin
  // and cursor go.
  useGSAP(
    () => {
      const h = comment.current
      if (!h) return
      const typed = h.querySelector<HTMLElement>('[data-typed]')!
      const cursor = h.querySelector<HTMLElement>('[data-cursor]')!
      const pin = h.querySelector<HTMLElement>('[data-pin]')!
      const bar = cursor.querySelector<HTMLElement>('i')!
      if (reducedMotion()) {
        cursor.style.display = 'none'
        return
      }
      const chars = { n: 0 }
      typed.textContent = ''
      gsap.set(pin, { autoAlpha: 0, scale: 0.6 })
      gsap.set(bar, { autoAlpha: 0, scaleY: 0, transformOrigin: '50% 0%' })
      // Starts as soon as the heading comes on screen (and plays again after scrolling back above
      // it), with quick beats before the typing, so it's under way while the title is in view.
      gsap
        .timeline({ scrollTrigger: { trigger: h, start: 'top bottom', toggleActions: 'restart none none reset' } })
        .set(typed, { textContent: '' })
        .to(pin, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(1.6)' })
        .to(bar, { autoAlpha: 1, scaleY: 1, duration: 0.2, ease: 'power2.out' }, '-=0.1')
        .to(chars, {
          n: TITLE.length,
          duration: TITLE.length * 0.05,
          ease: 'none',
          onUpdate: () => {
            typed.textContent = TITLE.slice(0, Math.round(chars.n))
          },
        }, '+=0.05')
        .to([pin, bar], { autoAlpha: 0, duration: 0.4, ease: 'power1.out' }, '+=0.7')
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
      const scrollTrigger = { trigger: timeline.current, start: 'top 75%', once: true }
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
      {/* Heading, centred: Anukriti's comment pin brings a cursor that types the title. The
          disciplines follow as quiet chips. */}
      <div className="flex flex-col items-center text-center">
        <h2
          ref={comment}
          id="about-heading"
          aria-label={TITLE}
          className="relative m-0 text-[clamp(36px,4.9vw,74px)] leading-[1.04] font-medium tracking-[-0.045em] whitespace-nowrap text-ink"
        >
          {/* An invisible copy holds the width; the typed text, the cursor and its comment pin sit
              on top. */}
          <span aria-hidden="true" className="invisible">
            {TITLE}
          </span>
          <span aria-hidden="true" className="absolute inset-0 text-left">
            <span data-typed>{TITLE}</span>
            <span data-cursor className="relative inline-block h-[0.82em] w-0 translate-y-[0.1em] align-baseline">
              <i className="absolute top-0 left-[0.03em] h-full w-[3px]" style={{ background: SELECT }} />
              {/* Anukriti's comment pin, riding on the cursor. */}
              <span
                data-pin
                className="absolute bottom-full left-[0.03em] mb-[6px] origin-bottom-left rounded-[14px] rounded-bl-none px-[10px] py-[6px] text-[clamp(12px,0.95vw,14px)] leading-none font-semibold tracking-normal whitespace-nowrap text-white shadow-[0_6px_16px_-6px_rgba(123,97,255,.7)]"
                style={{ background: SELECT }}
              >
                Anukriti
              </span>
            </span>
          </span>
        </h2>
        <Reveal as="ul" delay={150} className="m-0 mt-[clamp(24px,3vw,36px)] flex list-none flex-wrap justify-center gap-2.5 p-0">
          {CHIPS.map((label) => (
            <li key={label} className="rounded-full border border-line px-4 py-2.5 text-[clamp(13px,1vw,15px)] leading-none font-medium text-muted">
              {label}
            </li>
          ))}
        </Reveal>
      </div>

      {/* Timeline: a slim black line through coloured dots, each role in a few words under its dot, ending at
          the open spot (violet). Down the left on narrow screens. */}
      <div ref={timeline}>
        <p className="m-0 mb-5 text-[11px] leading-none font-semibold tracking-[0.12em] text-faint uppercase">Experience</p>
        {/* Wide screens: the five stops sit at even intervals along the line (0, 25, 50, 75, 100%),
            each label aligned to its dot: the first to the left, the middle three centred, the open
            spot to the right, at the line's end. */}
        <ol aria-label="Career timeline" className="relative m-0 flex list-none flex-col gap-7 p-0 pl-7 min-[901px]:block min-[901px]:h-[132px] min-[901px]:pl-0">
          <span
            data-line
            aria-hidden="true"
            className="absolute top-[6px] left-0 hidden h-[2px] w-full origin-left scale-x-0 rounded-full bg-ink min-[901px]:block"
          />
          <span
            data-line
            aria-hidden="true"
            className="absolute top-1 bottom-1 left-[6px] w-[2px] origin-top scale-y-0 rounded-full bg-ink min-[901px]:hidden"
          />
          {STOPS.map((stop, i) => {
            const align = ALIGN[i]
            return (
              <li key={stop.company} className={`relative min-[901px]:absolute min-[901px]:top-9 min-[901px]:left-[var(--x)] min-[901px]:w-[19%] ${align.item}`} style={{ '--x': `${i * 25}%` } as CSSProperties}>
                <span
                  data-dot
                  aria-hidden="true"
                  className={`invisible absolute top-[2px] -left-[27px] size-[14px] rounded-full border-[3px] border-white shadow-[0_0_0_1px_rgba(11,11,12,0.12)] min-[901px]:-top-[34px] ${align.dot}`}
                  style={{ background: stop.dot }}
                />
                <div data-card className="invisible">
                  <p className="m-0 text-[13px] leading-none font-medium text-faint tabular-nums">
                    {stop.year} · {stop.kind}
                  </p>
                  <p className="m-0 mt-2.5 text-[16px] leading-[1.25] font-semibold tracking-[-0.01em] text-ink">{stop.role}</p>
                  <p className="m-0 mt-1 text-[14px] leading-[1.3] text-muted">{stop.company}</p>
                </div>
              </li>
            )
          })}
          <li className={`relative min-[901px]:absolute min-[901px]:top-9 min-[901px]:left-full min-[901px]:w-[19%] ${ALIGN[4].item}`}>
            <span
              data-dot
              aria-hidden="true"
              // The open spot: a larger, hollow violet ring with a soft pulse, at the end of the line.
              className="invisible absolute top-0 -left-[29px] size-[18px] rounded-full border-[3px] bg-white min-[901px]:-top-[36px] min-[901px]:right-[-1px] min-[901px]:left-auto"
              style={{ borderColor: SELECT }}
            >
              <span
                className="absolute -inset-[6px] animate-ping rounded-full opacity-40 [animation-duration:2.2s] motion-reduce:animate-none"
                style={{ background: SELECT }}
              />
            </span>
            <div data-card className="invisible">
              <p className="m-0 text-[13px] leading-none font-medium text-faint">Now · Open to roles</p>
              <p className="m-0 mt-2.5 text-[16px] leading-[1.25] font-semibold tracking-[-0.01em] text-ink">
                Looking for my
                <br />
                next challenge.
              </p>
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
