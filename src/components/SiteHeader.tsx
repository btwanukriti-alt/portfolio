'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// Fixed, minimal header shared by every page. It tucks away while scrolling down and comes back
// on the way up; it also stays out of the way while the glasses are on (html[data-glasses]).
// With afterHero (the home page, whose hero has its own name and nav) it stays hidden until
// you've scrolled past the hero. It also stays out of full-screen sections
// (marked data-fullscreen, like the work videos) while they fill the window.
export default function SiteHeader({ afterHero = false }: { afterHero?: boolean }) {
  const [hidden, setHidden] = useState(afterHero)
  const [scrolled, setScrolled] = useState(false)
  // Section links point at the home page from other pages.
  const base = afterHero ? '' : '/'
  const links = [
    { href: `${base}#work`, label: 'Work' },
    { href: `${base}#about`, label: 'About' },
    { href: '/resume.pdf', label: 'Resume' },
  ]

  useEffect(() => {
    let last = window.scrollY
    let frame = 0
    const overFullscreen = () =>
      [...document.querySelectorAll('[data-fullscreen]')].some((el) => {
        const r = el.getBoundingClientRect()
        return r.top <= 1 && r.bottom > 72
      })
    const update = () => {
      frame = 0
      const y = window.scrollY
      setScrolled(y > 8)
      // The home hero is pinned for a few screens and has its own header: stay away until it ends.
      const hero = afterHero ? document.getElementById('welcome') : null
      const overHero = hero ? hero.getBoundingClientRect().bottom > 72 : false
      if (overHero || overFullscreen()) setHidden(true)
      else if (Math.abs(y - last) > 6) setHidden(y > last && y > 120)
      last = y
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [afterHero])

  return (
    <header
      data-hidden={hidden || undefined}
      data-scrolled={scrolled || undefined}
      className="fixed inset-x-0 top-0 z-40 border-b border-transparent [transition:transform_600ms_var(--ease-out-expo),background-color_300ms_ease,border-color_300ms_ease] motion-reduce:transition-none data-[hidden]:[transform:translateY(-101%)] data-[scrolled]:border-line data-[scrolled]:bg-white/82 data-[scrolled]:backdrop-blur-[16px] data-[scrolled]:backdrop-saturate-[1.6] [html[data-glasses]_&]:[transform:translateY(-101%)]"
    >
      <div className="mx-auto flex h-[72px] max-w-[var(--max)] items-center justify-between gap-6 px-[var(--gutter)]">
        <Link
          href={afterHero ? '#welcome' : '/'}
          className="font-body text-[17px] leading-none font-semibold tracking-[-0.02em] whitespace-nowrap text-ink no-underline focus-visible:rounded-[6px] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent"
        >
          Anukriti Mishra
        </Link>
        <nav className="flex items-center gap-1" aria-label="Primary">
          {links.map(({ href, label }) => {
            // The resume is a static file: a plain link, opened in a new tab.
            const Tag = href.endsWith('.pdf') ? 'a' : Link
            return (
            <Tag
              key={href}
              href={href}
              {...(Tag === 'a' && { target: '_blank', rel: 'noopener noreferrer' })}
              // Underline draws in from the left on hover.
              className="relative px-[14px] py-[10px] font-body text-[15px] leading-none font-medium text-ink no-underline after:absolute after:right-[14px] after:bottom-1 after:left-[14px] after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-[450ms] after:ease-[var(--ease-out-expo)] hover:after:origin-left hover:after:scale-x-100 focus-visible:rounded-[6px] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent motion-reduce:after:transition-none max-[640px]:hidden max-[640px]:first:block"
            >
              {label}
            </Tag>
            )
          })}
          <Link
            href={`${base}#reach-out`}
            className="ml-[10px] rounded-full bg-ink px-5 py-3 font-body text-[15px] leading-none font-medium whitespace-nowrap text-white no-underline [transition:translate_300ms_var(--ease-out-expo),background-color_200ms_ease] hover:-translate-y-px hover:bg-[#2a2a2d] focus-visible:rounded-[6px] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent motion-reduce:transition-none max-[640px]:px-4 max-[640px]:py-[10px]"
          >
            Let&apos;s talk
          </Link>
        </nav>
      </div>
    </header>
  )
}
