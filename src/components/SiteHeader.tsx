'use client'

import { useEffect, useState } from 'react'
import NavBar from './NavBar'

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
      <NavBar home={afterHero} />
    </header>
  )
}
