'use client'

import { useEffect, useState } from 'react'
import NavBar from './NavBar'
import { pageScroll } from './SmoothScroll'

// Fixed, minimal header shared by every page. It tucks away while scrolling down and comes back
// on the way up; it also stays out of the way while the glasses are on (html[data-glasses]).
// With afterHero (the home page, whose hero has its own name and nav) it stays hidden until
// you've scrolled past the hero. It also stays out of full-screen sections
// (marked data-fullscreen, like the work videos) while they fill the window.
export default function SiteHeader({ afterHero = false }: { afterHero?: boolean }) {
  const [hidden, setHidden] = useState(afterHero)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    let last = window.scrollY
    let frame = 0
    // What sits under the header's band (the top 72px): the home hero, or a full-screen section
    // (data-fullscreen). An IntersectionObserver reports it without measuring layout on every
    // scroll frame, which forced a style recalculation each frame and made scrolling stutter.
    const under = new Set<Element>()
    let io: IntersectionObserver | null = null
    const watch = () => {
      io?.disconnect()
      under.clear()
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) under.add(e.target)
            else under.delete(e.target)
          }
          update()
        },
        { rootMargin: `0px 0px ${72 - window.innerHeight}px 0px` },
      )
      const hero = afterHero ? document.getElementById('welcome') : null
      for (const el of [hero, ...document.querySelectorAll('[data-fullscreen]')]) if (el) io.observe(el)
    }
    const update = () => {
      frame = 0
      const y = pageScroll()
      setScrolled(y > 8)
      // The home hero is pinned for a few screens and has its own header: stay away until it ends.
      if (under.size) setHidden(true)
      else if (Math.abs(y - last) > 6) setHidden(y > last && y > 120)
      last = y
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    let height = window.innerHeight
    const onResize = () => {
      if (window.innerHeight === height) return
      height = window.innerHeight
      watch()
    }
    watch()
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(frame)
      io?.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [afterHero])

  return (
    <header
      data-hidden={hidden || undefined}
      data-scrolled={scrolled || undefined}
      className="fixed inset-x-0 top-0 z-40 border-b border-transparent [transition:transform_600ms_var(--ease-out-expo),background-color_300ms_ease,border-color_300ms_ease] motion-reduce:transition-none data-[hidden]:[transform:translateY(-101%)] data-[scrolled]:border-line data-[scrolled]:bg-white/82 data-[scrolled]:backdrop-blur-[16px] data-[scrolled]:backdrop-saturate-[1.6] [html[data-glasses]_&]:[transform:translateY(-101%)]"
    >
      <NavBar home={afterHero} />
    </header>
  )
}
