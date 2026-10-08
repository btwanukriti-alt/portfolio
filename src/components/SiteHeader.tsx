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
    { href: `${base}#reach-out`, label: 'Contact' },
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
      {/* Same layout as the home hero's header: name left, links centred, a pill on the right. */}
      <div className="mx-auto grid h-[64px] max-w-[var(--max)] grid-cols-[1fr_auto] items-center px-[var(--gutter)] font-hero text-[13px] text-ink md:grid-cols-[1fr_auto_1fr]">
        <Link
          href={afterHero ? '#welcome' : '/'}
          className="inline-flex items-center gap-2.5 text-[15px] font-medium text-ink no-underline focus-visible:rounded-[6px] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent"
        >
          <span className="size-[9px] rounded-full bg-ink shadow-[0_0_0_3px_rgba(13,13,12,.1)]" />
          Anukriti
        </Link>
        <nav className="hidden gap-7 text-muted md:flex" aria-label="Primary">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className="group relative text-muted no-underline transition-colors hover:text-ink">
              {label}
              <span className="absolute inset-x-0 -bottom-1 h-px origin-right scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(.2,.7,.1,1)] group-hover:origin-left group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-2">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#0d0d0c1f] px-3.5 py-2 font-hero-mono text-[11px] tracking-[0.08em] text-muted uppercase no-underline transition-colors hover:border-ink/35 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Resume
          </a>
        </div>
      </div>
    </header>
  )
}
