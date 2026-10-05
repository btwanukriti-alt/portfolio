'use client'

import { useEffect, useRef } from 'react'

// A project's looping showcase (public/showcase/, see scripts/build-showcases.mjs), playing only
// while it's on screen. The embed listens for postMessage 'showcase:play' / 'showcase:pause'.
export default function ShowcaseVideo({ src, title, className }: { src: string; title: string; className?: string }) {
  const frame = useRef<HTMLIFrameElement>(null)
  const visible = useRef(false)

  useEffect(() => {
    const el = frame.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting
        el.contentWindow?.postMessage(entry.isIntersecting ? 'showcase:play' : 'showcase:pause', '*')
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <iframe
      ref={frame}
      className={className}
      src={src}
      title={title}
      tabIndex={-1}
      // Pick up the current play state once the embed has loaded.
      onLoad={() => visible.current && frame.current?.contentWindow?.postMessage('showcase:play', '*')}
    />
  )
}
