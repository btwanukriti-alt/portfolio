import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { BEATS, ORB_CENTRES, ORB_RADIUS } from '../story/beats'
import { Field } from '../story/field'
import { prefersReducedMotion, scrollToTarget } from '../smoothScroll'
import styles from './Story.module.css'

type Copy = {
  chapter: string
  place: 'below' | 'top' | 'centre'
  eyebrow?: string
  lines: ReactNode[]
  body?: string
  tags?: string[]
  heading?: 'h1' | 'h2'
}

// One block of copy per beat in BEATS, same order.
const COPY: Copy[] = [
  {
    chapter: 'Hello',
    place: 'below',
    heading: 'h1',
    eyebrow: 'Anukriti Mishra · Portfolio 2026',
    lines: [
      "Hello, I'm",
      <>
        <em>Anukriti</em>.
      </>,
    ],
    body: 'I notice where people hesitate, and design the way through.',
  },
  {
    chapter: 'Designer',
    place: 'top',
    lines: ["By trade, I'm an", <em key="e">experienced</em>],
  },
  {
    chapter: 'Crafts',
    place: 'below',
    eyebrow: 'Look a little closer',
    lines: ['Up close, a designer', 'is three crafts', <em key="e">in orbit.</em>],
  },
  {
    chapter: 'UX',
    place: 'below',
    eyebrow: '01 · UX & Product',
    lines: [
      'I map the messy paths',
      'people actually take,',
      <>
        then design <em>the clear one.</em>
      </>,
    ],
    tags: ['Research', 'User flows', 'Prototypes', 'Testing'],
  },
  {
    chapter: 'Brand',
    place: 'below',
    eyebrow: '02 · Branding & Identity',
    lines: [
      'Marks, voices and',
      'systems that feel',
      <>
        unmistakably <em>yours.</em>
      </>,
    ],
    tags: ['Logomarks', 'Typography', 'Colour', 'Guidelines'],
  },
  {
    chapter: 'UI',
    place: 'below',
    eyebrow: '03 · UI & Visual',
    lines: [
      'Interfaces with rhythm,',
      'hierarchy, and a little',
      <>
        <em>delight</em> in every pixel.
      </>,
    ],
    tags: ['Design systems', 'Components', 'Interaction', 'Detail'],
  },
  {
    chapter: 'Together',
    place: 'centre',
    eyebrow: 'Three crafts',
    lines: ['One designer.', <em key="e">One clear story.</em>],
    body: "Here's where they've taken me so far.",
  },
]

const ORB_LABELS = ['UX & Product', 'Branding', 'UI & Visual']

const SEGMENTS = BEATS.length - 1
const SEGMENT_VH = 1.15 // scroll distance per transition, in viewport heights
const TAIL_VH = 0.7 // extra scroll that rests on the final beat before the page moves on

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

export default function Story() {
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const blocks = useRef<(HTMLDivElement | null)[]>([])
  const labels = useRef<(HTMLSpanElement | null)[]>([])
  const rail = useRef<(HTMLButtonElement | null)[]>([])
  const segmentPx = useRef(0)

  useEffect(() => {
    const sec = section.current!
    const stg = stage.current!
    const cvs = canvas.current!
    const reduced = prefersReducedMotion()
    let field: Field | null = null
    let raf = 0
    let disposed = false
    let lastW = 0
    let lastH = 0
    let q = 0
    let start = 0
    let prev = 0
    let active = -1

    const resize = () => {
      if (!field) return
      const w = stg.clientWidth
      const h = stg.clientHeight
      // Phones resize the viewport as the address bar slides; only re-lay out on real changes.
      if (w === lastW && Math.abs(h - lastH) < 120) return
      lastW = w
      lastH = h
      const mobile = w < 760
      field.resize(w, h, Math.min(window.devicePixelRatio || 1, 2), mobile)
      segmentPx.current = window.innerHeight * SEGMENT_VH
      sec.style.height = `${window.innerHeight * (SEGMENTS * SEGMENT_VH + 1 + TAIL_VH)}px`

      const crafts = field.layout(2)
      ORB_CENTRES.forEach(([x, y], i) => {
        const el = labels.current[i]
        if (!el) return
        el.style.transform = `translate(${crafts.cx + x * crafts.s}px, ${crafts.cy + (y + ORB_RADIUS + 0.055) * crafts.s}px) translateX(-50%)`
      })
    }

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (!field) return
      if (!start) start = prev = now
      const dt = Math.min(0.05, (now - prev) / 1000)
      prev = now
      const t = (now - start) / 1000

      const rect = sec.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return

      // Each transition rests on its beat at both ends, morphing only through the middle.
      const raw = Math.max(0, -rect.top) / segmentPx.current
      const seg = Math.min(SEGMENTS - 1, Math.floor(raw))
      const target = raw >= SEGMENTS ? SEGMENTS : seg + smoothstep(0.18, 0.82, raw - seg)
      q += (target - q) * (1 - Math.exp(-dt * (reduced ? 30 : 6)))
      if (Math.abs(target - q) < 1e-4) q = target

      const intro = clamp01(t / 2.4)
      field.frame(q, t, dt, intro)

      COPY.forEach((_, i) => {
        const el = blocks.current[i]
        if (!el) return
        const d = q - i
        const vis = clamp01(1 - Math.abs(d) * 2.6)
        el.style.opacity = vis.toFixed(3)
        el.style.visibility = vis < 0.01 ? 'hidden' : 'visible'
        el.style.setProperty('--d', d.toFixed(4))
        el.style.setProperty('--a', Math.abs(d).toFixed(4))
      })
      const craftsVis = clamp01(1 - Math.abs(q - 2) * 2.2)
      labels.current.forEach((el, i) => {
        if (!el) return
        el.style.opacity = clamp01(craftsVis * 1.4 - i * 0.12).toFixed(3)
      })

      // Glow follows the illustration.
      const a = Math.min(SEGMENTS, Math.floor(q))
      const b = Math.min(SEGMENTS, a + 1)
      const e = q - a
      const la = field.layout(a)
      const lb = field.layout(b)
      stg.style.setProperty('--gx', `${la.cx + (lb.cx - la.cx) * e}px`)
      stg.style.setProperty('--gy', `${la.cy + (lb.cy - la.cy) * e}px`)
      stg.style.setProperty('--p', (q / SEGMENTS).toFixed(4))

      const now_ = Math.round(q)
      if (now_ !== active) {
        active = now_
        rail.current.forEach((el, i) => el?.toggleAttribute('data-active', i === active))
      }
    }

    // The stippled type needs Manrope loaded before it is drawn into dots.
    const fonts = Promise.race([
      Promise.all([document.fonts.load('800 200px "Manrope"'), document.fonts.ready]),
      new Promise((r) => setTimeout(r, 2500)),
    ])
    fonts.then(() => {
      if (disposed) return
      const small = window.innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4
      field = new Field(cvs, BEATS, { count: small ? 2200 : 4200, reducedMotion: reduced })
      resize()
      stg.dataset.ready = ''
    })

    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)
    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const goTo = (i: number) => {
    const sec = section.current
    if (!sec) return
    const top = sec.getBoundingClientRect().top + window.scrollY
    scrollToTarget(top + i * segmentPx.current + (i ? segmentPx.current * 0.02 : 0))
  }

  return (
    <section ref={section} className={styles.story} aria-label="Introduction">
      <div ref={stage} className={styles.stage}>
        <div className={styles.glow} aria-hidden="true" />
        <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />

        {COPY.map((copy, i) => {
          const Heading = copy.heading ?? 'h2'
          return (
            <div
              key={copy.chapter}
              ref={(el) => {
                blocks.current[i] = el
              }}
              className={styles.block}
              data-place={copy.place}
              data-first={i === 0 || undefined}
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              {copy.eyebrow && (
                <p className={styles.eyebrow} style={{ '--i': 0 } as CSSProperties}>
                  <span className={styles.lineInner}>
                    <span className={styles.star} aria-hidden="true">
                      ✦
                    </span>
                    {copy.eyebrow}
                  </span>
                </p>
              )}
              <Heading className={styles.heading}>
                {copy.lines.map((line, j) => (
                  <span key={j} className={styles.line} style={{ '--i': j + 1 } as CSSProperties}>
                    <span className={styles.lineInner}>{line}</span>
                  </span>
                ))}
              </Heading>
              {copy.body && (
                <p className={styles.body} style={{ '--i': copy.lines.length + 1 } as CSSProperties}>
                  <span className={styles.lineInner}>{copy.body}</span>
                </p>
              )}
              {copy.tags && (
                <ul className={styles.tags} style={{ '--i': copy.lines.length + 1 } as CSSProperties}>
                  {copy.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}

        {ORB_LABELS.map((label, i) => (
          <span
            key={label}
            ref={(el) => {
              labels.current[i] = el
            }}
            className={styles.orbLabel}
            style={{ opacity: 0 }}
          >
            <span className={styles.orbIndex}>0{i + 1}</span>
            {label}
          </span>
        ))}

        <nav className={styles.rail} aria-label="Story chapters">
          <span className={styles.railTrack} aria-hidden="true">
            <span className={styles.railFill} />
          </span>
          {COPY.map((copy, i) => (
            <button
              key={copy.chapter}
              type="button"
              ref={(el) => {
                rail.current[i] = el
              }}
              className={styles.railItem}
              onClick={() => goTo(i)}
              data-active={i === 0 || undefined}
            >
              <span className={styles.railDot} aria-hidden="true" />
              <span className={styles.railLabel}>{copy.chapter}</span>
            </button>
          ))}
        </nav>

      </div>
    </section>
  )
}
