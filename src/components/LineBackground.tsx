import heroLines from '../assets/hero/bg-lines.svg'
import styles from './LineBackground.module.css'

// The design repeats a 1440 x 20.8 "Line" tile every 25px; 80 rows covers tall viewports.
const DEFAULT_ROWS = 80

type LineBackgroundProps = {
  // The hero and the work cards use the same tile in different colours.
  src?: string
  // Rows needed to cover the parent (each row is 25px).
  rows?: number
}

export default function LineBackground({ src = heroLines, rows = DEFAULT_ROWS }: LineBackgroundProps) {
  return (
    <div className={styles.lines} aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className={styles.row} style={{ backgroundImage: `url("${src}")` }} />
      ))}
    </div>
  )
}
