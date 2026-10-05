import { useEffect, useRef } from 'react'
import { PROJECTS } from '../data/projects'
import styles from './Work.module.css'

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** A pinned, sideways gallery. Each screen assembles from dots as it reaches the centre. */
export default function Work() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLOListElement>(null)
  const panels = useRef<(HTMLLIElement | null)[]>([])
  const counter = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const sec = section.current!
    const trk = track.current!
    let raf = 0
    let x = 0

    const size = () => {
      const travel = Math.max(0, trk.scrollWidth - window.innerWidth)
      sec.style.height = `${travel + window.innerHeight}px`
    }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const rect = sec.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      const travel = Math.max(0, trk.scrollWidth - window.innerWidth)
      const target = Math.min(travel, Math.max(0, -rect.top))
      x += (target - x) * 0.14
      trk.style.transform = `translate3d(${-x}px, 0, 0)`

      const vw = window.innerWidth
      let nearest = 0
      let best = Infinity
      panels.current.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const off = (r.left + r.width / 2 - vw / 2) / vw
        const dist = Math.abs(off)
        if (dist < best) {
          best = dist
          nearest = i
        }
        el.style.setProperty('--dot', (clamp01(1 - (dist - 0.12) * 2.4) * 9).toFixed(3))
        el.style.setProperty('--off', off.toFixed(4))
      })
      if (counter.current) counter.current.textContent = String(nearest + 1).padStart(2, '0')
    }

    size()
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', size)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', size)
    }
  }, [])

  return (
    <section ref={section} id="work" className={styles.work} aria-labelledby="work-title">
      <div className={styles.stage}>
        <header className={styles.head}>
          <h2 id="work-title" className={styles.title}>
            Selected work
          </h2>
          <p className={styles.count}>
            <span ref={counter}>01</span> / {String(PROJECTS.length).padStart(2, '0')}
          </p>
        </header>
        <ol ref={track} className={styles.track}>
          {PROJECTS.map((p, i) => (
            <li
              key={p.slug}
              ref={(el) => {
                panels.current[i] = el
              }}
              className={styles.panel}
            >
              <div className={styles.frame}>
                <img src={p.image} alt={`${p.title}, ${p.kind}`} loading="lazy" decoding="async" />
              </div>
              <div className={styles.meta}>
                <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={styles.name}>{p.title}</h3>
                <p className={styles.kind}>{p.kind}</p>
                <p className={styles.summary}>{p.summary}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
