import lineStudying from '../assets/about/line-studying.svg'
import linePast from '../assets/about/line-past.svg'
import lineNext from '../assets/about/line-next.svg'
import dotPast from '../assets/about/dot-past.svg'
import dotCurrent from '../assets/about/dot-current.svg'
import dotNext from '../assets/about/dot-next.svg'
import styles from './About.module.css'

// Figma "About Me + Timeline — Paper (New)" (156:14540).
// Timeline x positions are in px along the 1180-wide track.
const TRACK = 1180

type Stop = {
  x: number
  year: string
  role?: string
  company?: string
  state: 'past' | 'current' | 'next'
}

const STOPS: Stop[] = [
  { x: 40, year: '2020', role: 'Design Intern', company: 'Zubi.io · Design Avenue', state: 'past' },
  { x: 325, year: '2021', role: 'Design Intern', company: 'Innovaccer', state: 'past' },
  { x: 610, year: '2021', role: 'Product Designer', company: 'Innovaccer', state: 'past' },
  { x: 895, year: '2024', role: 'Senior Product Designer', company: 'Innovaccer', state: 'current' },
  { x: 1140, year: '20??', state: 'next' },
]

// Track segments: dashed "studying" lead-in, grey past, accent from now to next.
const SEGMENTS = [
  { src: lineStudying, from: 0, to: 40 },
  { src: linePast, from: 40, to: 895 },
  { src: lineNext, from: 895, to: 1140 },
]

const DOTS = { past: dotPast, current: dotCurrent, next: dotNext }

const ABOUT = [
  "I'm an engineer-turned-designer, purely because of my passion for solving problems — and because anything that isn't pixel-perfect gives me the ick.",
  "Being granted the power to pester anyone until I get my answer makes me a good team player. That same determination takes me deeper into a problem, and when constraints mean I can't solve it, I make sure it's highlighted instead of buried.",
  'I like systems thinking, and I have a perpetual drive to make sure every solution I design follows a standard hand-off…',
  'Apart from staring at a screen for long hours, hoping a bulb lights up in my head like it does in cartoons, I play competitive…',
]

const pct = (x: number) => `${(x / TRACK) * 100}%`

export default function About() {
  return (
    <section id="about" className={styles.about} aria-labelledby="about-heading">
      <div className={styles.eyebrow}>
        <span className={styles.pill}>About me</span>
        <span className={styles.rule} />
      </div>

      <h2 id="about-heading" className={styles.headline}>
        I design calm, usable software for messy, high-stakes work.
      </h2>

      <div className={styles.timelineScroller}>
        <div className={styles.timeline}>
          <span className={styles.studying}>Studying</span>
          {SEGMENTS.map((s) => (
            <img
              key={s.from}
              className={styles.segment}
              src={s.src}
              alt=""
              style={{ left: pct(s.from), width: pct(s.to - s.from) }}
            />
          ))}
          <ol className={styles.stops} aria-label="Career timeline">
          {STOPS.map((stop) => (
            <li
              key={stop.x}
              className={styles.stop}
              data-state={stop.state}
              style={{ left: pct(stop.x) }}
              aria-current={stop.state === 'current' ? 'step' : undefined}
            >
              <span className={stop.state === 'current' ? styles.yearBadge : styles.year}>{stop.year}</span>
              <img className={styles.dot} src={DOTS[stop.state]} alt="" />
              {stop.role ? (
                <>
                  <span className={styles.role}>{stop.role}</span>
                  <span className={styles.company}>{stop.company}</span>
                </>
              ) : (
                <span className={styles.invite}>You can be here next! :D</span>
              )}
            </li>
          ))}
          </ol>
        </div>
      </div>

      <ol className={styles.grid}>
        {ABOUT.map((text, i) => (
          <li key={i} className={styles.item}>
            <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
            <p className={styles.itemText}>{text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
