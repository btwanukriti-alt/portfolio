import type { MouseEvent } from 'react'
import { scrollToTarget } from '../smoothScroll'
import styles from './Header.module.css'

const LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
]

export default function Header() {
  const go = (e: MouseEvent<HTMLAnchorElement>, id?: string) => {
    e.preventDefault()
    const target = id ? document.getElementById(id) : null
    scrollToTarget(target ?? 0)
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Primary">
        <a href="#top" className={styles.brand} onClick={(e) => go(e)}>
          <span className={styles.mark} aria-hidden="true">
            ✦
          </span>
          Anukriti
        </a>
        {LINKS.map((link) => (
          <a key={link.id} href={`#${link.id}`} className={styles.link} onClick={(e) => go(e, link.id)}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
