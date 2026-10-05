'use client'

import { useCallback, useEffect, useImperativeHandle, useRef, type Ref } from 'react'
import { gsap, reducedMotion } from '@/lib/gsap'

// A screen opened from the sphere: the image lifts out of its tile, grows to fill the view,
// and flies back into the same tile on close (click anywhere, Esc, or the top Back button).

export type LightboxHandle = { close: () => void }

type LightboxProps = {
  tile: HTMLImageElement
  ref?: Ref<LightboxHandle>
  onClosed: () => void
}

const DURATION = 0.52
const EASE = 'power3.out'

const box = (r: DOMRect) => ({ left: r.left, top: r.top, width: r.width, height: r.height })

// Largest box with the screenshot's own proportions that fits the window.
function fullView(tile: HTMLImageElement) {
  const ratio = tile.naturalWidth / tile.naturalHeight || 4 / 3
  const width = Math.min(window.innerWidth * 0.88, window.innerHeight * 0.8 * ratio)
  const height = width / ratio
  return { left: (window.innerWidth - width) / 2, top: (window.innerHeight - height) / 2, width, height }
}

export default function Lightbox({ tile, ref, onClosed }: LightboxProps) {
  const image = useRef<HTMLImageElement>(null)
  const backdrop = useRef<HTMLDivElement>(null)
  const closing = useRef(false)

  useEffect(() => {
    const el = image.current
    const shade = backdrop.current
    if (!el || !shade) return
    const duration = reducedMotion() ? 0 : DURATION
    gsap.set(tile, { opacity: 0 }) // the tile itself has lifted out
    gsap.fromTo(
      el,
      { ...box(tile.getBoundingClientRect()), borderRadius: 6 },
      { ...fullView(tile), borderRadius: 14, duration, ease: EASE },
    )
    gsap.fromTo(shade, { opacity: 0 }, { opacity: 1, duration, ease: 'power1.inOut' })

    const onResize = () => gsap.set(el, fullView(tile))
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      gsap.killTweensOf([el, shade])
      gsap.set(tile, { clearProps: 'opacity' })
    }
  }, [tile])

  const close = useCallback(() => {
    const el = image.current
    if (!el || closing.current) return
    closing.current = true
    const duration = reducedMotion() ? 0 : DURATION
    gsap.to(el, { ...box(tile.getBoundingClientRect()), borderRadius: 6, duration, ease: EASE, onComplete: onClosed })
    gsap.to(backdrop.current, { opacity: 0, duration, ease: 'power1.inOut' })
  }, [tile, onClosed])

  useImperativeHandle(ref, () => ({ close }), [close])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  return (
    <div className="fixed inset-0 z-[2] cursor-zoom-out" onClick={close}>
      <div ref={backdrop} className="absolute inset-0 bg-[rgba(250,250,249,0.9)]" />
      {/* Positioned and sized by GSAP; cover keeps the crop steady while it morphs from the
          tile's shape to the screenshot's own. */}
      <img
        ref={image}
        className="fixed max-w-none rounded-[14px] object-cover shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]"
        src={tile.currentSrc || tile.src}
        alt=""
      />
    </div>
  )
}
