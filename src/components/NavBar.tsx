'use client'

import Link from 'next/link'
import { RESUME } from '@/data/site'

// The header row shared by the landing hero and every other page: name on the left, Work, About
// and Contact in the middle, Replay (quiet) and Resume (the one black button) on the right.
// On the landing page `onReplay` restarts the intro; elsewhere Replay goes home, where it plays.
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent'

const navLink = `relative py-2 text-muted no-underline transition-colors hover:text-ink after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-[var(--ease-out-expo)] hover:after:origin-left hover:after:scale-x-100 motion-reduce:after:transition-none ${focus}`

export default function NavBar({ home = false, onReplay }: { home?: boolean; onReplay?: () => void }) {
  const base = home ? '' : '/'
  const replayClass = `inline-flex items-center gap-1.5 px-2 py-2 text-[13px] leading-none text-muted transition-colors hover:text-ink max-[520px]:hidden ${focus}`
  const replayIcon = (
    <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true" className="transition-transform duration-500 group-hover:-rotate-180">
      <path d="M13.5 8A5.5 5.5 0 1 1 11.9 4.1M13.5 2v3.5H10" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  return (
    <div className="mx-auto grid h-[72px] max-w-[var(--max)] grid-cols-[1fr_auto] items-center gap-6 px-[var(--gutter)] font-hero text-[14px] text-ink min-[721px]:grid-cols-[1fr_auto_1fr]">
      <Link href={home ? '#welcome' : '/'} className={`justify-self-start text-[16px] leading-none font-medium tracking-[-0.02em] whitespace-nowrap text-ink no-underline ${focus}`}>
        Anukriti Mishra
      </Link>

      <nav aria-label="Primary" className="hidden items-center gap-8 min-[721px]:flex">
        <Link href={`${base}#work`} className={navLink}>
          Work
        </Link>
        <Link href={`${base}#about`} className={navLink}>
          About
        </Link>
        <Link href={`${base}#reach-out`} className={navLink}>
          Contact
        </Link>
      </nav>

      <div className="flex items-center justify-end gap-3">
        {onReplay ? (
          <button type="button" onClick={onReplay} className={`group ${replayClass}`}>
            {replayIcon}
            Replay
          </button>
        ) : (
          <Link href="/" className={`group no-underline ${replayClass}`}>
            {replayIcon}
            Replay
          </Link>
        )}
        <a
          href={RESUME}
          target="_blank"
          rel="noopener noreferrer"
          // Square and black; on hover it lifts off a violet offset, like a dragged Figma layer.
          className={`group inline-flex items-center gap-2 bg-ink px-5 py-3 text-[14px] leading-none font-medium text-white no-underline [transition:translate_300ms_var(--ease-out-expo),box-shadow_300ms_var(--ease-out-expo)] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[3px_3px_0_#7B61FF] motion-reduce:transition-none ${focus}`}
        >
          Resume
          <svg width="11" height="11" viewBox="0 0 14 14" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">
            <path d="M3 11L11 3M5 3h6v6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          </svg>
        </a>
      </div>
    </div>
  )
}
