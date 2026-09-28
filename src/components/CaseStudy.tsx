import type { Project } from '../data/projects'
import Nav from './Nav'
import LineBackground from './LineBackground'
import SlideCarousel from './SlideCarousel'
import Contact from './Contact'
import styles from './CaseStudy.module.css'

// Figma case study layout "Homepage — Paper" (125:2), filled per project.
export default function CaseStudy({ project }: { project: Project }) {
  return (
    <div className={styles.page}>
      <LineBackground rows={140} />

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a href="#welcome" className={styles.name}>
            Anukriti
            <br />
            Mishra
          </a>
          <Nav active="work" />
        </div>
      </header>

      <main className={styles.frame}>
        <div className={styles.intro}>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.description}>{project.description}</p>
          <dl className={styles.meta}>
            <div>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>Timeline</dt>
              <dd>{project.timeline}</dd>
            </div>
          </dl>
        </div>

        <div className={styles.hero}>
          <img src={project.hero} alt={`${project.title} screens`} />
        </div>

        <p className={styles.problem}>{project.problem}</p>

        {project.slides.length > 0 && (
          <div className={styles.slides}>
            <SlideCarousel slides={project.slides} title={project.title} />
          </div>
        )}
      </main>

      <Contact className={styles.contact} />
    </div>
  )
}
