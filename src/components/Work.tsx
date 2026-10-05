import { useRef, type CSSProperties } from 'react'
import { PROJECTS } from '../data/projects'
import { useReveal } from '../useReveal'
import styles from './Work.module.css'

export default function Work() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)

  return (
    <section ref={root} id="work" className={styles.work} aria-labelledby="work-title">
      <header className={styles.head}>
        <p className={styles.eyebrow} data-reveal>
          <span aria-hidden="true">✦</span> Selected work
        </p>
        <h2 id="work-title" className={styles.title} data-reveal>
          Where the crafts <em>land.</em>
          <sup className={styles.count}>({String(PROJECTS.length).padStart(2, '0')})</sup>
        </h2>
        <p className={styles.lede} data-reveal>
          A few projects where research, identity and interface had to work as one.
        </p>
      </header>

      <ol className={styles.grid}>
        {PROJECTS.map((project, i) => (
          <li
            key={project.slug}
            className={styles.item}
            data-reveal
            style={{ '--stagger': `${(i % 2) * 0.12}s` } as CSSProperties}
          >
            <article className={styles.card}>
              <div className={styles.frame}>
                <img src={project.card} alt="" width={628} height={428} loading="lazy" decoding="async" />
                <span className={styles.peek}>Case study soon</span>
              </div>
              <div className={styles.meta}>
                <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className={styles.name}>{project.title}</h3>
                  <p className={styles.desc}>{project.description}</p>
                </div>
                <p className={styles.facts}>
                  <span>{project.role}</span>
                  <span>{project.timeline}</span>
                </p>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}
