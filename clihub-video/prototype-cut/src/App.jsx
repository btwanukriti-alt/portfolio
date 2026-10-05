// Clock, layout and player. The frame is a pure function of t, so the loop can be sought,
// paused off screen and captured exactly.
//   Preview (default): plays and loops; click or Space toggles pause.
//   Embed (?embed or window.__SHOWCASE_EMBED__): waits for postMessage 'showcase:play' /
//   'showcase:pause' from the portfolio's work card.
// window.__showcase = { seek(t), play(), pause(), duration, t } for tests and captures.
import { useEffect, useRef, useState } from 'react'
import { Stage, DURATION } from './Showcase.jsx'

const embed = typeof window !== 'undefined' && (window.__SHOWCASE_EMBED__ || new URLSearchParams(location.search).has('embed'))
const still = matchMedia('(prefers-reduced-motion: reduce)').matches
const STILL_T = 8.6

export default function App() {
  const [t, setT] = useState(still ? STILL_T : embed ? 1.2 : 0)
  const [size, setSize] = useState({ w: innerWidth, h: innerHeight })
  const clock = useRef({ t: still ? STILL_T : embed ? 1.2 : 0, playing: false, frame: 0, last: 0 })

  useEffect(() => {
    const c = clock.current
    const tick = (now) => {
      if (c.last) c.t = (c.t + Math.min(0.1, (now - c.last) / 1000)) % DURATION
      c.last = now
      setT(c.t)
      c.frame = c.playing ? requestAnimationFrame(tick) : 0
    }
    const play = () => {
      if (c.playing || still) return
      c.playing = true
      c.last = 0
      c.frame = requestAnimationFrame(tick)
    }
    const pause = () => {
      c.playing = false
      cancelAnimationFrame(c.frame)
      c.frame = 0
    }
    const seek = (v) => {
      c.t = ((v % DURATION) + DURATION) % DURATION
      setT(c.t)
    }
    window.__showcase = { seek, play, pause, duration: DURATION, get t() { return c.t }, get playing() { return c.playing } }

    const onMessage = (e) => {
      if (e.data === 'showcase:play') play()
      else if (e.data === 'showcase:pause') pause()
    }
    const toggle = () => (c.playing ? pause() : play())
    const onKey = (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        toggle()
      }
    }
    const onResize = () => setSize({ w: innerWidth, h: innerHeight })
    addEventListener('message', onMessage)
    addEventListener('resize', onResize)
    if (!embed) {
      addEventListener('keydown', onKey)
      addEventListener('click', toggle)
      play()
    }
    return () => {
      pause()
      removeEventListener('message', onMessage)
      removeEventListener('resize', onResize)
      removeEventListener('keydown', onKey)
      removeEventListener('click', toggle)
    }
  }, [])

  // One 1920x1080 composition, fitted whole; the backdrop extends to fill the rest. On tall
  // screens it may crop up to 100px of empty margin per side so the screens read larger.
  const { w, h } = size
  const s = Math.max(Math.min(w / 1920, h / 1080), Math.min(w / 1720, h / 1080))
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#B9C7DB', cursor: embed ? 'default' : 'pointer' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, transform: `scale(${s})`, transformOrigin: '0 0' }}>
        <div style={{ position: 'absolute', left: Math.min(0, (w / s - 1920) / 2), top: 0 }}>
          <Stage t={t} sw={Math.max(1920, w / s)} sh={h / s} />
        </div>
      </div>
    </div>
  )
}
