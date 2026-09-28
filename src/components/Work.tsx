import { useEffect, useRef, type CSSProperties } from 'react'
import LineBackground from './LineBackground'
import cardLines from '../assets/work/card-lines.svg'
import { PROJECTS, caseStudyHref } from '../data/projects'
import styles from './Work.module.css'

// Figma "Homepage — Paper" (156:14295) work list: five "Zync C" cards, 1440 x 650 each.

// How much a card shrinks and dims once the next one fully covers it.
const COVERED_SCALE = 0.06
const COVERED_DIM = 0.45

export default function Work() {
  const cards = useRef<(HTMLElement | null)[]>([])

  // Cards pin via position: sticky; this only adds the "pushed back" look as the next card slides over.
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const update = () => {
      frame = 0
      const els = cards.current
      els.forEach((card, i) => {
        const next = els[i + 1]
        if (!card) return
        let covered = 0
        if (next) {
          const a = card.getBoundingClientRect()
          const b = next.getBoundingClientRect()
          covered = Math.min(1, Math.max(0, (a.bottom - b.top) / a.height))
        }
        const scale = reduceMotion.matches ? 1 : 1 - COVERED_SCALE * covered
        card.style.setProperty('--covered-scale', String(scale))
        card.style.setProperty('--covered-dim', String(COVERED_DIM * covered))
      })
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <section id="work" className={styles.work} aria-label="Work">
      {PROJECTS.map((project, i) => (
        <article
          key={project.title}
          ref={(el) => {
            cards.current[i] = el
          }}
          className={styles.card}
          style={{ '--i': i } as CSSProperties}
        >
          <LineBackground src={cardLines} />
          <div className={styles.inner}>
            <div className={styles.copy}>
              <div className={styles.text}>
                <h2 className={styles.title}>{project.title}</h2>
                <p className={styles.description}>{project.description}</p>
              </div>
              <a className={styles.button} href={caseStudyHref(project.slug)}>
                Open Project
              </a>
            </div>
            <div className={styles.frame}>
              <img src={project.card}width={628} height={428} alt={`${project.title} screens`} loading="lazy" />
            </div>
          </div>
          <div className={styles.shade} aria-hidden="true" />
        </article>
      ))}
    </section>
  )
}
