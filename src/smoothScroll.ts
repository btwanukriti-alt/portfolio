import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

let lenis: Lenis | null = null

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Weighted, inertial scrolling. Skipped entirely for reduced motion. */
export function startSmoothScroll() {
  if (prefersReducedMotion()) return () => {}
  lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.9 })
  let id = requestAnimationFrame(function raf(time) {
    lenis?.raf(time)
    id = requestAnimationFrame(raf)
  })
  return () => {
    cancelAnimationFrame(id)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToTarget(target: HTMLElement | number) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) })
    return
  }
  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY
  window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}
