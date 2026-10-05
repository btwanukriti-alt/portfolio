// Chromeless, looping embed of the clihub 20s cut for the portfolio work cards.
// Same protocol as the other showcases (scripts/build-showcases.mjs): the stage fills the frame,
// loops, and plays only between postMessage 'showcase:play' and 'showcase:pause'.
import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ClihubStage, DURATION } from '../../clihub-video/clihub-showcase-20s-react/src/ClihubShowcase.jsx'

const still = matchMedia('(prefers-reduced-motion: reduce)').matches

function Embed() {
  const [t, setT] = useState(still ? DURATION * 0.3 : DURATION * 0.05)
  const [size, setSize] = useState({ w: innerWidth, h: innerHeight })

  useEffect(() => {
    let frame = 0
    let last = 0
    const tick = (now) => {
      if (last) setT((v) => (v + Math.min(0.1, (now - last) / 1000)) % DURATION)
      last = now
      frame = requestAnimationFrame(tick)
    }
    const onMessage = (e) => {
      if (e.data === 'showcase:play' && !frame && !still) {
        last = 0
        frame = requestAnimationFrame(tick)
      } else if (e.data === 'showcase:pause') {
        cancelAnimationFrame(frame)
        frame = 0
      }
    }
    const onResize = () => setSize({ w: innerWidth, h: innerHeight })
    addEventListener('message', onMessage)
    addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('message', onMessage)
      removeEventListener('resize', onResize)
    }
  }, [])

  const s = Math.max(size.w / 1920, size.h / 1080)
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#000' }}>
      <div
        style={{
          position: 'absolute',
          left: (size.w - 1920 * s) / 2,
          top: (size.h - 1080 * s) / 2,
          width: 1920,
          height: 1080,
          transformOrigin: '0 0',
          transform: `scale(${s})`,
        }}
      >
        <ClihubStage t={t} />
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<Embed />)
