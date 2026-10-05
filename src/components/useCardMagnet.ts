'use client'

import { useEffect, type RefObject } from 'react'
import { getLenis, setScrollInterceptor } from './SmoothScroll'
import { reducedMotion } from '@/lib/gsap'

// Magnetic paging for the full-screen work cards. Inside the card stack, any scroll — a wheel
// notch, a trackpad flick, a swipe, an arrow key — glides the page to the next or previous card
// and locks it to the screen, one card per gesture. From the last card (or below it), one scroll
// up glides all the way back to the first. Above the first card and below the last, the page
// scrolls normally (smoothly, through Lenis).
//
// Wheel input is intercepted before Lenis smooths it (setScrollInterceptor), and glides run on
// Lenis's own scrollTo so they blend with the smooth scrolling. With reduced motion there is no
// Lenis: native wheel events are handled and cards are jumped to directly.

const GLIDE_S = 0.75
const GESTURE_GAP_MS = 180 // wheel events closer than this belong to the same gesture (trackpad inertia)
const SWIPE_PX = 24

const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

export function useCardMagnet(stack: RefObject<HTMLElement | null>, count: number) {
  useEffect(() => {
    let gliding = false
    let lastWheel = 0
    let gestureUsed = false // one card per gesture

    // Card i starts at stackTop + i * screen height (the cards are one screen tall, in flow).
    const geometry = () => {
      const el = stack.current
      if (!el) return null
      return { top: el.getBoundingClientRect().top + window.scrollY, h: window.innerHeight }
    }

    // Where a scroll in direction dir should land, or null to let the page scroll normally.
    const targetFor = (dir: 1 | -1) => {
      const g = geometry()
      if (!g || document.documentElement.hasAttribute('data-glasses')) return null
      const pos = (window.scrollY - g.top) / g.h // 0 = first card exactly on screen
      if (pos <= -1 || pos >= count) return null // well outside the stack
      // Once you've been through every project, one scroll up goes straight back to the first.
      if (dir < 0 && pos > count - 1.01) return g.top
      const aligned = Math.abs(pos - Math.round(pos)) < 0.01
      const index = aligned ? Math.round(pos) + dir : dir > 0 ? Math.ceil(pos) : Math.floor(pos)
      if (index < 0 || index > count - 1) return null // leaving the stack: scroll on as usual
      return g.top + index * g.h
    }

    const glideTo = (y: number) => {
      const lenis = getLenis()
      if (!lenis || reducedMotion()) {
        window.scrollTo({ top: y, behavior: 'instant' })
        return
      }
      // Longer trips (back to the first card) take a little longer, but stay quick.
      const cards = Math.abs(y - window.scrollY) / window.innerHeight
      gliding = true
      lenis.scrollTo(y, {
        duration: Math.min(1.3, GLIDE_S + Math.max(0, cards - 1) * 0.15),
        easing: easeInOutCubic,
        lock: true,
        force: true,
        onComplete: () => {
          gliding = false
        },
      })
    }

    // Returns true when the magnet took the wheel event.
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < 1) return false
      const now = e.timeStamp
      const newGesture = now - lastWheel > GESTURE_GAP_MS
      lastWheel = now
      const target = targetFor(e.deltaY > 0 ? 1 : -1)
      if (target === null) return false
      if (e.cancelable) e.preventDefault()
      if (newGesture) gestureUsed = false
      if (gliding || gestureUsed) return true // finish this card first; swallow the rest of the gesture
      gestureUsed = true
      glideTo(target)
      return true
    }

    // With Lenis: intercept wheel input before it's smoothed.
    const release = setScrollInterceptor(({ event }) => {
      if (event.type !== 'wheel') return true
      return !handleWheel(event as WheelEvent)
    })
    // Without Lenis (reduced motion): plain wheel events.
    const onNativeWheel = (e: WheelEvent) => {
      if (!getLenis()) handleWheel(e)
    }

    // Touch: the finger scrolls natively; on release, glide to the card in the swipe's direction.
    let touchY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY
    }
    const onTouchEnd = (e: TouchEvent) => {
      const dy = touchY - e.changedTouches[0].clientY
      if (Math.abs(dy) < SWIPE_PX) return
      const target = targetFor(dy > 0 ? 1 : -1)
      if (target !== null) glideTo(target)
    }

    const KEYS: Record<string, 1 | -1> = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 }
    const onKey = (e: KeyboardEvent) => {
      const dir = KEYS[e.key]
      const tag = (e.target as HTMLElement | null)?.tagName
      if (!dir || e.shiftKey || tag === 'INPUT' || tag === 'TEXTAREA') return
      const target = targetFor(dir)
      if (target === null) return
      e.preventDefault()
      if (!gliding) glideTo(target)
    }

    window.addEventListener('wheel', onNativeWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      release()
      window.removeEventListener('wheel', onNativeWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKey)
    }
  }, [stack, count])
}
