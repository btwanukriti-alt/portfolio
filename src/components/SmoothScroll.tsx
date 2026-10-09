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
      if (lenis) lenis.scrollTo(el, { duration: 1.2, easing: (x) => 1 - Math.pow(1 - x, 4), force: true })
      else el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' })
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  // Route changes start at the top; keep Lenis's position in step with the new page.
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
      if (lenis) lenis.scrollTo(el, { immediate: true, force: true })
      else el.scrollIntoView()
    }, 120)
    return () => window.clearTimeout(id)
  }, [pathname])

  return null
}
