'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

// Each 1600 x 900 slide already has its pager drawn in (counter + prev/next circles at the
// bottom right). We make those circles real buttons, and cover the drawn counter, which is
// often stale in the Figma slides, with a live one. Positions are in slide pixels via
// --u = 1 slide px (container query width / 1600).
const SWIPE_PX = 40

type SlideCarouselProps = {
  slides: string[]
  title: string
}

const hit =
  'absolute top-[calc(803*var(--u))] h-[calc(50*var(--u))] w-[calc(50*var(--u))] cursor-pointer rounded-full border-0 bg-transparent p-0 transition-[background-color] duration-150 ease-[ease] enabled:hover:bg-[rgba(107,107,128,0.12)] disabled:cursor-default disabled:bg-white/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

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
      aria-roledescription="carousel"
      aria-label={`${title} presentation`}
      tabIndex={0}
      className="relative aspect-[1600/900] w-full overflow-hidden rounded-[20px] bg-white outline-none [container-type:inline-size] [--u:calc(100cqw/1600)] focus-visible:shadow-[0_0_0_2px_var(--color-accent)]"
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
        className="h-full w-full animate-slide-in motion-reduce:animate-none"
        src={slide}
        width={1600}
        height={900}
        alt={`${title} slide ${index + 1} of ${count}`}
      />

      {/* Covers the drawn counter (x 1294–1374 around y 828) with the same slide shifted 80px
          (two dot-grid steps); patch x 1290–1378, y 808–848. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[calc(808*var(--u))] left-[calc(1290*var(--u))] flex h-[calc(40*var(--u))] w-[calc(88*var(--u))] items-center justify-end bg-[image:var(--slide)] bg-[length:calc(1600*var(--u))_calc(900*var(--u))] bg-[position:calc(-1210*var(--u))_calc(-808*var(--u))] pr-[calc(4*var(--u))] font-slides text-[calc(16*var(--u))] leading-none font-medium text-[#6b6b80]"
        style={{ '--slide': `url("${slide}")` } as CSSProperties}
      >
        {index + 1} / {count}
      </div>
      <p className="sr-only" aria-live="polite">
        Slide {index + 1} of {count}
      </p>

      {/* Drawn prev/next circles: 50px across, centred at (1436, 828) and (1502, 828). */}
      <button
        type="button"
        className={`${hit} left-[calc(1411*var(--u))]`}
        onClick={() => go(-1)}
        disabled={index === 0}
        aria-label="Previous slide"
      />
      <button
        type="button"
        className={`${hit} left-[calc(1477*var(--u))]`}
        onClick={() => go(1)}
        disabled={index === count - 1}
        aria-label="Next slide"
      />
    </section>
  )
}
