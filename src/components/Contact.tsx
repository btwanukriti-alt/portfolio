import styles from './Contact.module.css'

// Figma "Contact — Paper (New)" (156:14595). Email and phone are the design's placeholders.
const EMAIL = 'your@email.com'
const PHONE = 'phone number'

export default function Contact({ className }: { className?: string }) {
  return (
    <footer
      id="reach-out"
      className={className ? `${styles.contact} ${className}` : styles.contact}
      aria-labelledby="contact-heading"
    >
      <h2 id="contact-heading" className={styles.heading}>
        lets
        <br />
        connect
      </h2>
      <hr className={styles.rule} />
      <ul className={styles.details}>
        <li>
          email : <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </li>
        <li>phone : {PHONE}</li>
      </ul>
    </footer>
  )
}
