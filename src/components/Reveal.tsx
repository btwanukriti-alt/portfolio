'use client'

import { useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { gsap, SplitText, useGSAP, reducedMotion } from '@/lib/gsap'

// Scroll reveals (GSAP ScrollTrigger + SplitText). Elements start invisible and are revealed the
// first time they scroll into view: blocks rise and fade in; headlines slide up word by word from
// behind a mask. With reduced motion they simply appear.

type Tag = 'div' | 'p' | 'span' | 'li' | 'section' | 'h1' | 'h2' | 'h3' | 'ul' | 'ol' | 'figure'

const TRIGGER = { start: 'top 88%', once: true }

type RevealProps = {
  as?: Tag
  delay?: number // ms
  className?: string
  style?: CSSProperties
  children?: ReactNode
  id?: string
}

// A block that rises and fades in.
export function Reveal({ as = 'div', delay = 0, className, style, children, id }: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return
    if (reducedMotion()) {
      gsap.set(el, { autoAlpha: 1 })
      return
    }
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 40 },
      { autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out', delay: delay / 1000, scrollTrigger: { trigger: el, ...TRIGGER } },
    )
  })

  const Tag = as as ElementType
  return (
    <Tag ref={ref} id={id} className={`invisible ${className ?? ''}`} style={style}>
      {children}
    </Tag>
  )
}

// A headline whose words slide up one after another. SplitText keeps it accessible (aria-label).
export function SplitReveal({
  as = 'h2',
  text,
  delay = 0,
  className,
  id,
}: {
  as?: Tag
  text: string
  delay?: number
  className?: string
  id?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return
    if (reducedMotion()) {
      gsap.set(el, { autoAlpha: 1 })
      return
    }
    const split = SplitText.create(el, {
      type: 'words',
      mask: 'words',
      wordsClass: 'split-word',
      autoSplit: true,
      onSplit: (self) => {
        gsap.set(el, { autoAlpha: 1 })
        return gsap.from(self.words, {
          yPercent: 110,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.055,
          delay: delay / 1000,
          scrollTrigger: { trigger: el, ...TRIGGER },
        })
      },
    })
    return () => split.revert()
  })

  const Tag = as as ElementType
  return (
    <Tag ref={ref} id={id} className={`invisible ${className ?? ''}`}>
      {text}
    </Tag>
  )
}
