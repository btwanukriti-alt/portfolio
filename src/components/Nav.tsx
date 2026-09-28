import { useState } from 'react'
import styles from './Nav.module.css'

const LINKS = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'work', label: 'Work' },
  { id: 'reach-out', label: 'Reach Out' },
  { id: 'resume', label: 'Resume' },
] as const

type LinkId = (typeof LINKS)[number]['id']

export default function Nav({ active: initial = 'welcome' }: { active?: LinkId }) {
  const [active, setActive] = useState<string>(initial)

  return (
    <nav className={styles.nav} aria-label="Primary">
      {LINKS.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className={styles.link}
          aria-current={active === id ? 'page' : undefined}
          onClick={() => setActive(id)}
        >
          {label}
        </a>
      ))}
    </nav>
  )
}
