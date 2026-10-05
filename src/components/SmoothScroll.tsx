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
      anchors: true,
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

  // Route changes start at the top; keep Lenis's position in step with the new page.
  useEffect(() => {
    if (window.location.hash) return
    lenis?.scrollTo(0, { immediate: true, force: true })
    ScrollTrigger.refresh()
  }, [pathname])

  return null
}
