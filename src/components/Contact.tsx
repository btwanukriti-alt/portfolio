import { useRef } from 'react'
import { useReveal } from '../useReveal'
import styles from './Contact.module.css'

// Placeholders until the real addresses are supplied.
const EMAIL = 'hello@example.com'
const LINKS = [
  { label: 'LinkedIn', href: '#' },
  { label: 'Dribbble', href: '#' },
  { label: 'Behance', href: '#' },
]

export default function Contact() {
  const root = useRef<HTMLElement>(null)
  useReveal(root)

  return (
    <footer ref={root} id="contact" className={styles.contact}>
      <div className={styles.inner}>
        <p className={styles.eyebrow} data-reveal>
          <span aria-hidden="true">✦</span> Next chapter
        </p>
        <h2 className={styles.title} data-reveal>
          Let's make something
          <br />
          <em>quietly magical.</em>
        </h2>
        <div className={styles.actions} data-reveal>
          <a className={styles.cta} href={`mailto:${EMAIL}`}>
            <span className={styles.ctaDot} aria-hidden="true" />
            {EMAIL}
            <span aria-hidden="true">↗</span>
          </a>
          <ul className={styles.links}>
            {LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.base}>
        <span>© {new Date().getFullYear()} Anukriti Mishra</span>
        <span>Drawn in a few thousand dots</span>
      </div>
    </footer>
  )
}
