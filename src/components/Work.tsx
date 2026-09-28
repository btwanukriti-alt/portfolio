import { Fragment, useEffect, useRef, type CSSProperties } from 'react'
import { PROJECTS, caseStudyHref, type Project } from '../data/projects'
import styles from './Work.module.css'

// Stacked project cards: a header row (index, client, expertise, arrows, project link) over a
// large media slot for the UX showcase video (falls back to the card image).

// How much a card shrinks and dims once the next one fully covers it.
const COVERED_SCALE = 0.06
const COVERED_DIM = 0.45

const pad = (n: number) => String(n).padStart(2, '0')

export default function Work() {
  const cards = useRef<(HTMLElement | null)[]>([])
  // Zero-height markers in normal flow: where each sticky card would sit if it weren't stuck.
  const anchors = useRef<(HTMLElement | null)[]>([])

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

  const goTo = (i: number) => {
    const anchor = anchors.current[i]
    const card = cards.current[i]
    if (!anchor || !card) return
    const stickyTop = parseFloat(getComputedStyle(card).top) || 0
    window.scrollTo({ top: anchor.getBoundingClientRect().top + window.scrollY - stickyTop })
  }

  return (
    <section
      id="work"
      className={styles.work}
      aria-label="Work"
      style={{ '--count': PROJECTS.length } as CSSProperties}
    >
      {PROJECTS.map((project, i) => (
        <Fragment key={project.slug}>
          <div
            ref={(el) => {
              anchors.current[i] = el
            }}
            aria-hidden="true"
          />
          <article
            ref={(el) => {
              cards.current[i] = el
            }}
            className={styles.card}
            style={{ '--i': i } as CSSProperties}
            aria-labelledby={`work-${project.slug}`}
          >
            <header className={styles.meta}>
              <p className={styles.index}>
                <span className={styles.num}>{pad(i + 1)}</span>
                <span className={styles.total}>/{pad(PROJECTS.length)}</span>
              </p>
              <div className={styles.fact}>
                <span className={styles.label}>Client</span>
                <h2 id={`work-${project.slug}`} className={styles.value}>
                  {project.client}
                </h2>
              </div>
              <div className={styles.fact}>
                <span className={styles.label}>Expertise</span>
                <ul className={styles.tags}>
                  {project.expertise.map((e) => (
                    <li key={e} className={styles.value}>
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.arrow}
                  aria-label="Previous project"
                  disabled={i === 0}
                  onClick={() => goTo(i - 1)}
                >
                  ←
                </button>
                <button
                  type="button"
                  className={styles.arrow}
                  aria-label="Next project"
                  disabled={i === PROJECTS.length - 1}
                  onClick={() => goTo(i + 1)}
                >
                  →
                </button>
                <a className={styles.open} href={caseStudyHref(project.slug)}>
                  Open project <span aria-hidden="true">↗</span>
                </a>
              </div>
            </header>
            <div className={styles.media}>
              <Showcase project={project} />
            </div>
            <div className={styles.shade} aria-hidden="true" />
          </article>
        </Fragment>
      ))}
    </section>
  )
}

// Plays the showcase video only while it's on screen; reduced-motion users just see the poster.
function Showcase({ project }: { project: Project }) {
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = video.current
    if (!el) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduceMotion.matches) el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.25 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (!project.video) {
    return <img src={project.card} alt={`${project.title} screens`} loading="lazy" />
  }

  return (
    <video
      ref={video}
      src={project.video}
      poster={project.card}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={`${project.title} UX showcase`}
    />
  )
}
