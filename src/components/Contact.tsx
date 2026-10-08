import Link from 'next/link'
import { Reveal, SplitReveal } from './Reveal'
import { PROJECTS, caseStudyHref } from '@/data/projects'

// Contact footer (Figma "Contact — Paper (New)", 156:14595). Email only, no phone.
const EMAIL = 'hey@anukritimishra.xyz'
// TODO: add the LinkedIn profile URL; the link shows once this is set.
const LINKEDIN = ''

// On a case study page, `current` is its slug: the footer then links to the other projects.
export default function Contact({ current }: { current?: string } = {}) {
  return (
    <footer
      id="reach-out"
      aria-labelledby="contact-heading"
      className="mx-auto max-w-[var(--max)] border-t border-line bg-paper px-[var(--gutter)] pt-[clamp(80px,14vh,160px)] pb-8"
    >
      <Reveal as="p" className="m-0 text-[15px] leading-none font-medium text-muted">
        Contact <span className="text-faint">(03)</span>
      </Reveal>
      <SplitReveal
        as="h2"
        id="contact-heading"
        className="mt-6 mb-0 max-w-[14ch] text-[clamp(44px,7.4vw,124px)] leading-[0.98] font-medium tracking-[-0.045em] text-ink"
        text="Let's design yours next."
      />

      <Reveal
        className="mt-[clamp(48px,8vh,96px)] flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4 border-t border-line pt-7"
        delay={150}
      >
        <a
          href={`mailto:${EMAIL}`}
          // The underline draws in on hover.
          className="group/email inline-flex items-center gap-3 bg-[linear-gradient(currentColor,currentColor)] bg-[length:0_1px] bg-[position:0_100%] bg-no-repeat text-[clamp(22px,2.6vw,40px)] leading-[1.1] font-medium tracking-[-0.03em] text-ink no-underline [transition:background-size_600ms_var(--ease-out-expo)] hover:bg-[length:100%_1px] focus-visible:rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-reduce:transition-none"
        >
          {EMAIL}
          <svg
            width="28"
            height="28"
            viewBox="0 0 14 14"
            aria-hidden="true"
            className="h-[0.8em] w-[0.8em] [transition:transform_400ms_var(--ease-out-expo)] group-hover/email:[transform:translate(3px,-3px)] motion-reduce:transition-none"
          >
            <path d="M3 11L11 3M5 3h6v6" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </svg>
        </a>
        {LINKEDIN && (
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[18px] leading-none font-normal text-muted no-underline hover:text-ink focus-visible:rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            LinkedIn
          </a>
        )}
      </Reveal>

      {current && (
        <nav aria-label="More work" className="mt-[clamp(48px,8vh,96px)] border-t border-line pt-7">
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

      <div className="mt-[clamp(64px,12vh,140px)] flex justify-between gap-4 text-[14px] leading-none font-normal text-faint">
        <span>© {new Date().getFullYear()} Anukriti Mishra</span>
        <a
          href="#top"
          className="text-muted no-underline hover:text-ink focus-visible:rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}
