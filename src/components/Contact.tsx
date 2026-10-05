import styles from './Contact.module.css'

// Placeholders until the real addresses are supplied.
const EMAIL = 'hello@example.com'
const LINKS = [
  { label: 'LinkedIn', href: '#' },
  { label: 'Dribbble', href: '#' },
  { label: 'Behance', href: '#' },
]

export default function Contact() {
  return (
    <footer id="contact" className={styles.contact}>
      <p className={styles.lead}>Have something noisy that needs to become clear?</p>
      <a className={styles.email} href={`mailto:${EMAIL}`}>
        {EMAIL}
      </a>
      <div className={styles.base}>
        <span>© {new Date().getFullYear()} Anukriti Mishra</span>
        <ul className={styles.links}>
          {LINKS.map((link) => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
