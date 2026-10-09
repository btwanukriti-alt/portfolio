'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis, { type VirtualScrollData } from 'lenis'
import { gsap, ScrollTrigger, reducedMotion } from '@/lib/gsap'

// Smooth, inertial page scrolling (Lenis), driven by GSAP's ticker so ScrollTrigger stays in sync.
// Components can stop it (the glasses view) or intercept wheel input (the work-card magnet)
// through the helpers below. With reduced motion the page keeps native scrolling.

let lenis: Lenis | null = null
type Interceptor = (data: VirtualScrollData) => boolean
let interceptor: Interceptor | null = null

export const getLenis = () => lenis

// The page's scroll position without asking the browser for layout (reading window.scrollY right
// after other code has changed styles forces a style recalculation).
export const pageScroll = () => (lenis ? lenis.scroll : window.scrollY)

// Resting points: a section's title marked data-rest comes to rest this far below the top of the
// window (the fixed header, 72px, plus a gap). data-rest="n" adds n px for anything drawn above
// the title (a label, a comment pin).
const HEADER = 72
const restGap = () => (window.innerWidth < 720 ? 20 : 28)
// Measured from layout offsets, so reveal animations (which move things by transform) don't count.
const docTop = (el: HTMLElement | null) => {
  let y = 0
  for (; el; el = el.offsetParent as HTMLElement | null) y += el.offsetTop
  return y
}
const restOf = (el: HTMLElement) =>
  Math.min(
    docTop(el) - HEADER - restGap() - Number(el.dataset.rest || 0),
    // A section near the end can't rest higher than the page can scroll.
    document.documentElement.scrollHeight - window.innerHeight,
  )
// The resting point for a section (or anything inside one), if it has a marked title.
export function restingPoint(target: Element): number | null {
  const section = target.closest('section') ?? target
  const title = section.querySelector<HTMLElement>('[data-rest]')
  return title ? Math.max(0, restOf(title)) : null
}

// Return false from the interceptor to keep Lenis from handling that input (call preventDefault
// yourself if the native scroll should not happen either).
export function setScrollInterceptor(fn: Interceptor) {
  interceptor = fn
  return () => {
    if (interceptor === fn) interceptor = null
  }
}

export default function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    if (reducedMotion()) return
    const instance = new Lenis({
      autoRaf: false,
      // Quick to answer the wheel, with a short glide: smooth without feeling heavy or slow.
      lerp: 0.16,
      wheelMultiplier: 1.15,
      virtualScroll: (data) => (interceptor ? interceptor(data) : true),
    })
    lenis = instance
    const tick = (time: number) => instance.raf(time * 1000)
    instance.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      lenis = null
    }
  }, [])

  // In-page links (#work, #about, #reach-out...) glide to their section. Caught before Next's
  // Link handles them, so the smooth scroll and the pinned sections stay in step.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null
      if (!a || a.target === '_blank') return
      const url = new URL(a.href, window.location.href)
      if (url.pathname !== window.location.pathname || !url.hash) return
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)))
      if (!el) return
      e.preventDefault()
      e.stopPropagation()
      history.replaceState(null, '', url.hash)
      const rest = restingPoint(el)
      const to = rest ?? el
      if (lenis) lenis.scrollTo(to, { duration: 1.2, easing: (x) => 1 - Math.pow(1 - x, 4), force: true })
      else if (rest !== null) window.scrollTo({ top: rest, behavior: reducedMotion() ? 'auto' : 'smooth' })
      else el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' })
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  // Route changes start at the top; keep Lenis's position in step with the new page.
  // When scrolling comes to rest in the upper half of a section with a marked title (or just above
  // it), the page glides to that section's resting point, so its title sits clear of the header.
  useEffect(() => {
    if (reducedMotion()) return
    let timer = 0
    let gliding = false
    const settle = () => {
      if (gliding) return
      const y = window.scrollY
      const vh = window.innerHeight
      for (const title of document.querySelectorAll<HTMLElement>('[data-rest]')) {
        const section = title.closest('section')
        if (!section) continue
        const top = docTop(section)
        const rest = Math.max(0, restOf(title))
        // From a little above the resting point down to the section's halfway mark.
        const half = top + section.offsetHeight / 2
        if (y < rest - vh * 0.3 || y > Math.max(rest, half)) continue
        if (Math.abs(y - rest) < 4) return
        gliding = true
        const done = () => {
          gliding = false
        }
        if (lenis) lenis.scrollTo(rest, { duration: 0.6, easing: (x) => 1 - Math.pow(1 - x, 3), onComplete: done })
        else {
          window.scrollTo({ top: rest, behavior: 'smooth' })
          window.setTimeout(done, 700)
        }
        return
      }
    }
    const onScroll = () => {
      window.clearTimeout(timer)
      if (!gliding) timer = window.setTimeout(settle, 180)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Arriving with a hash (/#work from a case study) lands on that section once the page has laid out.
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) {
      lenis?.scrollTo(0, { immediate: true, force: true })
      ScrollTrigger.refresh()
      return
    }
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh()
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (!el) return
      const rest = restingPoint(el)
      if (lenis) lenis.scrollTo(rest ?? el, { immediate: true, force: true })
      else if (rest !== null) window.scrollTo(0, rest)
      else el.scrollIntoView()
    }, 120)
    return () => window.clearTimeout(id)
  }, [pathname])

  return null
}
