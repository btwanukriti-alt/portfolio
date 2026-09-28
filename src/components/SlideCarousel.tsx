import { useEffect, useRef, useState, type CSSProperties } from 'react'
import styles from './SlideCarousel.module.css'

// Each 1600 x 900 slide already has its pager drawn in (counter + prev/next circles at the
// bottom right). We make those circles real buttons, and cover the drawn counter, which is
// often stale in the Figma slides, with a live one.
const SWIPE_PX = 40

type SlideCarouselProps = {
  slides: string[]
  title: string
}

export default function SlideCarousel({ slides, title }: SlideCarouselProps) {
  const [index, setIndex] = useState(0)
  const touchX = useRef<number | null>(null)
  const count = slides.length

  const go = (delta: number) => setIndex((i) => Math.min(count - 1, Math.max(0, i + delta)))

  // Warm the neighbours so paging doesn't flash.
  useEffect(() => {
    for (const i of [index - 1, index + 1]) {
      if (slides[i]) new Image().src = slides[i]
    }
  }, [index, slides])

  if (!count) return null
  const slide = slides[index]

  return (
    <section
      className={styles.carousel}
      aria-roledescription="carousel"
      aria-label={`${title} presentation`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1)
        else if (e.key === 'ArrowLeft') go(-1)
        else return
        e.preventDefault()
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > SWIPE_PX) go(dx < 0 ? 1 : -1)
        touchX.current = null
      }}
    >
      <img
        key={slide}
        className={styles.slide}
        src={slide}
        width={1600}
        height={900}
        alt={`${title} slide ${index + 1} of ${count}`}
      />

      {/* Covers the drawn counter with the same slide shifted 80px (two dot-grid steps). */}
      <div className={styles.counterPatch} style={{ '--slide': `url("${slide}")` } as CSSProperties} aria-hidden="true">
        {index + 1} / {count}
      </div>
      <p className={styles.srOnly} aria-live="polite">
        Slide {index + 1} of {count}
      </p>

      <button
        type="button"
        className={`${styles.hit} ${styles.prev}`}
        onClick={() => go(-1)}
        disabled={index === 0}
        aria-label="Previous slide"
      />
      <button
        type="button"
        className={`${styles.hit} ${styles.next}`}
        onClick={() => go(1)}
        disabled={index === count - 1}
        aria-label="Next slide"
      />
    </section>
  )
}
