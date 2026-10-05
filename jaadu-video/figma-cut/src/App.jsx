import { useEffect, useReducer, useRef, useState } from 'react'
import { DURATION, POSTER, SCENES, STAGES, UI_FONT } from './lib.js'
import { Alert, Discoveries, Library, Notify, Research } from './scenes.jsx'
import { Backdrop, CanvasFrame, frameInset } from './stage.jsx'

// Embed mode (the portfolio's work cards and case-study hero): no controls, paused on the
// poster frame until the page posts 'showcase:play', looping after that.
// Outside the selection frame: a plain light canvas.
const OUTSIDE = '#FBF0E6'
const EMBED = typeof window !== 'undefined' && (window.__EMBED__ || /[?&]embed\b/.test(location.search))
const STILL = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

const useViewport = () => {
  const read = () => ({ vw: window.innerWidth, vh: window.innerHeight })
  const [v, set] = useState(read)
  useEffect(() => {
    const on = () => set(read())
    addEventListener('resize', on)
    addEventListener('orientationchange', on)
    const ro = new ResizeObserver(on)
    ro.observe(document.documentElement)
    return () => {
      removeEventListener('resize', on)
      removeEventListener('orientationchange', on)
      ro.disconnect()
    }
  }, [])
  return v
}

export default function App() {
  const { vw, vh } = useViewport()
  const [, render] = useReducer((n) => n + 1, 0)
  const clock = useRef({ t: EMBED || STILL ? POSTER : 0, playing: !EMBED && !STILL, last: 0, raf: 0 })
  const [ui, setUi] = useState({ hidden: EMBED, idle: false })

  useEffect(() => {
    const c = clock.current
    const tick = (now) => {
      if (c.last) c.t = (c.t + Math.min(0.1, (now - c.last) / 1000)) % DURATION
      c.last = now
      render()
      c.raf = c.playing ? requestAnimationFrame(tick) : 0
    }
    const play = () => {
      if (c.playing || STILL) return
      c.playing = true
      c.last = 0
      c.raf = requestAnimationFrame(tick)
      render()
    }
    const pause = () => {
      c.playing = false
      cancelAnimationFrame(c.raf)
      c.raf = 0
      render()
    }
    const seek = (t) => {
      c.t = ((t % DURATION) + DURATION) % DURATION
      c.last = 0
      render()
    }
    window.__showcase = { seek, play, pause, duration: DURATION, get t() { return c.t } }
    if (c.playing) c.raf = requestAnimationFrame(tick)
    const onMsg = (e) => (e.data === 'showcase:play' ? play() : e.data === 'showcase:pause' ? pause() : null)
    const onKey = (e) => {
      if (EMBED) return
      if (e.code === 'Space') { e.preventDefault(); c.playing ? pause() : play() }
      else if (e.key === 'r' || e.key === 'R') seek(0)
      else if (e.key === 'ArrowRight') seek(c.t + 1)
      else if (e.key === 'ArrowLeft') seek(c.t - 1)
      else if (e.key === 'h' || e.key === 'H') setUi((u) => ({ ...u, hidden: !u.hidden }))
    }
    addEventListener('message', onMsg)
    addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(c.raf)
      removeEventListener('message', onMsg)
      removeEventListener('keydown', onKey)
    }
  }, [])

  // Controls auto-hide after a moment without pointer movement.
  useEffect(() => {
    if (EMBED) return
    let timer = setTimeout(() => setUi((u) => ({ ...u, idle: true })), 2500)
    const wake = () => {
      setUi((u) => (u.idle ? { ...u, idle: false } : u))
      clearTimeout(timer)
      timer = setTimeout(() => setUi((u) => ({ ...u, idle: true })), 2500)
    }
    addEventListener('pointermove', wake)
    addEventListener('pointerdown', wake)
    return () => {
      clearTimeout(timer)
      removeEventListener('pointermove', wake)
      removeEventListener('pointerdown', wake)
    }
  }, [])

  const { t, playing } = clock.current
  // The canvas lives inside the black selection frame and never crosses it.
  const m = frameInset(vw, vh)
  const iw = vw - 2 * m
  const ih = vh - 2 * m
  const L = iw / ih < 0.9 ? 'port' : 'land'
  const { W, H } = STAGES[L]
  const s = Math.min(iw / W, ih / H)
  const st = { s, ox: (iw - W * s) / 2, oy: (ih - H * s) / 2, W, H }
  const props = { t, L, W, H }

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', fontFamily: UI_FONT, background: OUTSIDE }}>
      <div style={{ position: 'absolute', left: m, top: m, width: iw, height: ih, overflow: 'hidden' }}>
        <Backdrop w={iw} h={ih} />
        <div style={{ position: 'absolute', left: st.ox, top: st.oy, width: W, height: H, transform: `scale(${s})`, transformOrigin: '0 0' }}>
          <Research {...props} />
          <Alert {...props} />
          <Notify {...props} />
          <Discoveries {...props} />
          <Library {...props} />
        </div>
      </div>
      <CanvasFrame vw={vw} vh={vh} />
      {!ui.hidden && <Player t={t} playing={playing} idle={ui.idle} />}
    </div>
  )
}

function Player({ t, playing, idle }) {
  const api = window.__showcase
  const btn = { width: 36, height: 36, borderRadius: 18, border: 0, background: 'rgba(255,255,255,.14)', color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer', padding: 0 }
  return (
    <div style={{ position: 'absolute', left: '50%', bottom: 'max(16px, env(safe-area-inset-bottom))', transform: `translate(-50%, ${idle ? 16 : 0}px)`, opacity: idle ? 0 : 1, transition: 'opacity .4s, transform .4s', display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 26, background: 'rgba(15,18,34,.72)', backdropFilter: 'blur(14px)', boxShadow: '0 12px 30px -12px rgba(0,0,0,.5)', zIndex: 100 }}>
      <button aria-label={playing ? 'Pause' : 'Play'} style={btn} onClick={() => (playing ? api.pause() : api.play())}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="#fff">{playing ? <path d="M3 2h3v10H3zM8 2h3v10H8z" /> : <path d="M3.5 1.8v10.4L12 7z" />}</svg>
      </button>
      <button aria-label="Restart" style={btn} onClick={() => api.seek(0)}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12a8 8 0 108-8 8.5 8.5 0 00-6 2.5L4 8.5M4 4v4.5h4.5" /></svg>
      </button>
      <div style={{ display: 'flex', gap: 4, padding: '0 6px' }}>
        {SCENES.map((sc) => {
          const f = Math.min(1, Math.max(0, (t - sc.a) / (sc.b - sc.a)))
          return (
            <button key={sc.id} aria-label={`Go to ${sc.id}`} onClick={() => api.seek(sc.a)} style={{ width: `clamp(28px, ${(sc.b - sc.a) * 1.6}vw, ${(sc.b - sc.a) * 14}px)`, height: 18, border: 0, padding: 0, background: 'transparent', cursor: 'pointer', display: 'grid', alignItems: 'center' }}>
              <span style={{ display: 'block', height: 4, borderRadius: 2, background: 'rgba(255,255,255,.25)', overflow: 'hidden' }}>
                <span style={{ display: 'block', height: '100%', width: `${f * 100}%`, background: '#fff' }} />
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
