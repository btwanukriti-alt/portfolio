'use client'

import { useEffect, useRef } from 'react'
import { SHOWCASE_VERSION } from '@/data/projects'
import { reducedMotion } from '@/lib/gsap'

// A project's looping showcase: the MP4 rendered from its showcase page (showcase-video/), as on the
// homepage cards, so the phone decodes it instead of running the page itself. Screens held upright
// get the portrait cut. Its opening frame shows straight away, and it plays only while on screen.
export default function ShowcaseVideo({ slug, title, className }: { slug: string; title: string; className?: string }) {
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = video.current
    if (!v) return
    const cut = window.matchMedia('(orientation: portrait)').matches ? 'port' : 'land'
    v.poster = `/showcase/posters/${slug}-${cut}.jpg?v=${SHOWCASE_VERSION}`
    v.src = `/showcase/video/${slug}-${cut}.mp4?v=${SHOWCASE_VERSION}`
    // React doesn't always set the muted property, and browsers only autoplay muted video.
    v.muted = true
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reducedMotion()) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.1 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [slug])

  return <video ref={video} className={className} aria-label={title} muted loop playsInline preload="auto" disablePictureInPicture />
}
