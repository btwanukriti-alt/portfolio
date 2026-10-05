// Clock, layout and player. The frame is a pure function of t, so the loop can be sought,
// paused off screen and captured exactly.
//   Preview (default): plays and loops; click or Space toggles pause.
//   Embed (?embed or window.__SHOWCASE_EMBED__): waits for postMessage 'showcase:play' /
//   'showcase:pause' from the portfolio's work card.
// window.__showcase = { seek(t), play(), pause(), duration, t } for tests and captures.
import { useEffect, useRef, useState } from 'react'
import { DURATION } from './lib.js'
import { Background } from './stage.jsx'
import { Scenes } from './scenes.jsx'

const embed = typeof window !== 'undefined' && (window.__SHOWCASE_EMBED__ || new URLSearchParams(location.search).has('embed'))
const still = matchMedia('(prefers-reduced-motion: reduce)').matches
const STILL_T = 2.6

export default function App() {
  const [t, setT] = useState(still ? STILL_T : embed ? 0.6 : 0)
  const [size, setSize] = useState({ w: innerWidth, h: innerHeight })
  const clock = useRef({ t: still ? STILL_T : embed ? 0.6 : 0, playing: false, frame: 0, last: 0 })

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

  const { w, h } = size
  const mode = w / h < 1 ? 'port' : 'land'
  const BW = mode === 'port' ? 1080 : 1920
  const BH = mode === 'port' ? 1920 : 1080
  const iw = w
  const ih = h
  // Fit the base stage, then extend it to the canvas aspect so the content can be centred in
  // the extra room instead of leaving empty bands.
  const s = Math.min(iw / BW, ih / BH)
  const SW = iw / s
  const SH = ih / s

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#B9C7DB', cursor: embed ? 'default' : 'pointer' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <Background t={t} w={iw} h={ih} />
        <div
          style={{
            position: 'absolute',
            left: (iw - SW * s) / 2,
            top: (ih - SH * s) / 2,
            width: SW,
            height: SH,
            transform: `scale(${s})`,
            transformOrigin: '0 0',
          }}
        >
          <Scenes t={t} mode={mode} sw={SW} sh={SH} />
        </div>
      </div>
    </div>
  )
}
