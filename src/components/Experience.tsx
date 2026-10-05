import { useEffect, useRef, type CSSProperties } from 'react'
import { buildFormations, storyLayout, type StoryLayout } from '../experience/formations'
import { DotField } from '../experience/field'
import { prefersReducedMotion } from '../smoothScroll'
import jaadu from '../assets/case-studies/jaadu-2/hero.jpg'
import styles from './Experience.module.css'

type Chapter = { step: string; title: string; body: string; name?: boolean }

// One chapter per formation after the opening point of light.
const CHAPTERS: Chapter[] = [
  {
    step: 'Noise',
    title: 'Anukriti Mishra',
    body: 'Product designer. Every product I make starts as noise. Scroll to watch one take shape.',
    name: true,
  },
  {
    step: 'Listen',
    title: 'First, I listen.',
    body: 'Interviews, analytics, support tickets. I sort the noise until it gathers into something true.',
  },
  {
    step: 'Map',
    title: 'Patterns become paths.',
    body: 'I map how people actually move through a product, detours included.',
  },
  {
    step: 'Structure',
    title: 'Then, structure.',
    body: 'Hierarchy before pixels. What matters most is decided here.',
  },
  {
    step: 'Craft',
    title: 'And it comes alive.',
    body: 'Jaadu 2.0, a trading dashboard that reads at a glance.',
  },
  {
    step: 'Work',
    title: 'Five products, made this way.',
    body: 'Keep scrolling to see them.',
  },
]

const FIRST = 1 // formation index of the first chapter
const LAST = CHAPTERS.length // formation index of the last chapter
const SEGMENT_VH = 1.2
const TAIL_VH = 0.6
const INTRO_S = 2.6

// Label text is the same at every size; positions are set on resize.
const LABELS = storyLayout(1440, 900)

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

function loadPixels(src: string): Promise<ImageData | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = img.naturalWidth
      c.height = img.naturalHeight
      const ctx = c.getContext('2d', { willReadFrequently: true })!
      ctx.drawImage(img, 0, 0)
      resolve(ctx.getImageData(0, 0, c.width, c.height))
    }
    img.onerror = () => resolve(null)
    img.src = src
  })
}

export default function Experience() {
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const screen = useRef<HTMLDivElement>(null)
  const blocks = useRef<(HTMLDivElement | null)[]>([])
  const clusterTags = useRef<(HTMLSpanElement | null)[]>([])
  const nodeTags = useRef<(HTMLSpanElement | null)[]>([])
  const counter = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const sec = section.current!
    const stg = stage.current!
    const reduced = prefersReducedMotion()
    let field: DotField | null = null
    let pixels: ImageData | null = null
    let raf = 0
    let disposed = false
    let start = 0
    let prev = 0
    let q = 0
    let lastW = 0
    let lastH = 0
    let segmentPx = window.innerHeight * SEGMENT_VH

    const place = (el: HTMLElement | null, x: number, y: number, L: StoryLayout) => {
      if (el) el.style.transform = `translate(${L.w / 2 + x}px, ${L.h / 2 - y}px)`
    }

    const resize = () => {
      const w = stg.clientWidth
      const h = stg.clientHeight
      // Phones resize as the address bar slides; ignore small height changes.
      if (w === lastW && Math.abs(h - lastH) < 120) return
      lastW = w
      lastH = h
      const L = storyLayout(w, h)
      segmentPx = window.innerHeight * SEGMENT_VH
      sec.style.height = `${window.innerHeight * ((LAST - FIRST) * SEGMENT_VH + 1 + TAIL_VH)}px`

      const S = L.screen
      const scr = screen.current!
      scr.style.width = `${S.w}px`
      scr.style.height = `${S.h}px`
      scr.style.left = `${w / 2 + S.x - S.w / 2}px`
      scr.style.top = `${h / 2 - S.y - S.h / 2}px`
      L.clusters.forEach((c, i) => place(clusterTags.current[i], c.x, c.y + c.r + 14, L))
      L.nodes.forEach((n, i) => place(nodeTags.current[i], n.x, n.y - L.nodeRadius - 12, L))

      if (field) {
        const count = field.count
        field.resize(w, h, Math.min(window.devicePixelRatio || 1, 2), buildFormations(count, L, pixels))
      }
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

      // Each transition rests on its chapter at both ends and morphs through the middle.
      const raw = Math.max(0, -rect.top) / segmentPx
      const segs = LAST - FIRST
      const seg = Math.min(segs - 1, Math.floor(raw))
      const scrolled = raw >= segs ? segs : seg + smoothstep(0.2, 0.8, raw - seg)
      const intro = reduced ? 1 : easeOut(clamp01(t / INTRO_S))
      const target = intro + scrolled
      q += (target - q) * (1 - Math.exp(-dt * (reduced ? 30 : 5)))
      if (Math.abs(target - q) < 1e-4) q = target
      field.render(q, t, dt)

      CHAPTERS.forEach((_, i) => {
        const el = blocks.current[i]
        if (!el) return
        const d = q - (FIRST + i)
        const vis = clamp01(1 - Math.abs(d) * 2.4)
        el.style.opacity = vis.toFixed(3)
        el.style.visibility = vis < 0.01 ? 'hidden' : 'visible'
        el.style.setProperty('--d', d.toFixed(4))
      })
      const tagVis = (beat: number) => clamp01(1 - Math.abs(q - beat) * 3)
      const cv = tagVis(2)
      clusterTags.current.forEach((el, i) => el && (el.style.opacity = clamp01(cv * 1.5 - i * 0.08).toFixed(3)))
      const nv = tagVis(3)
      nodeTags.current.forEach((el, i) => el && (el.style.opacity = clamp01(nv * 1.5 - i * 0.08).toFixed(3)))

      // The dotted screen resolves into the real screenshot while it rests.
      const sv = clamp01(1 - Math.abs(q - 5) * 4.5)
      screen.current!.style.setProperty('--dot', (Math.pow(sv, 1.6) * 9).toFixed(3))
      screen.current!.style.visibility = sv > 0.001 ? 'visible' : 'hidden'

      const chapter = Math.min(CHAPTERS.length, Math.max(1, Math.round(q)))
      if (counter.current) counter.current.textContent = String(chapter).padStart(2, '0')
      stg.style.setProperty('--p', clamp01((q - FIRST) / (LAST - FIRST)).toFixed(4))
    }

    const onPointer = (e: PointerEvent) => {
      if (!field || e.pointerType === 'touch') return
      const r = stg.getBoundingClientRect()
      field.pointer(e.clientX - r.left - r.width / 2, r.height / 2 - (e.clientY - r.top))
    }
    const onLeave = () => field?.pointer(1e5, 1e5)

    loadPixels(jaadu).then((data) => {
      if (disposed) return
      pixels = data
      const small = window.innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4
      try {
        field = new DotField(canvas.current!, small ? 16000 : 40000, reduced)
      } catch {
        stg.dataset.nogl = ''
        return
      }
      lastW = 0
      resize()
      stg.dataset.ready = ''
    })

    resize()
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointer)
    document.addEventListener('pointerleave', onLeave)
    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('pointerleave', onLeave)
      field?.dispose()
    }
  }, [])

  return (
    <section ref={section} className={styles.experience} aria-label="How I work">
      <div ref={stage} className={styles.stage}>
        <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />

        <div ref={screen} className={styles.screen}>
          <img src={jaadu} alt="Jaadu 2.0 trading dashboard" width={1256} height={856} />
        </div>

        {LABELS.clusters.map((c, i) => (
          <span
            key={c.label}
            ref={(el) => {
              clusterTags.current[i] = el
            }}
            className={styles.tag}
            style={{ opacity: 0 }}
          >
            {c.label}
          </span>
        ))}
        {LABELS.nodes.map((n, i) => (
          <span
            key={n.label}
            ref={(el) => {
              nodeTags.current[i] = el
            }}
            className={styles.tag}
            data-node
            style={{ opacity: 0 }}
          >
            {n.label}
          </span>
        ))}

        {CHAPTERS.map((c, i) => {
          const Heading = c.name ? 'h1' : 'h2'
          return (
            <div
              key={c.step}
              ref={(el) => {
                blocks.current[i] = el
              }}
              className={styles.chapter}
              data-name={c.name || undefined}
              style={{ opacity: 0 }}
            >
              <p className={styles.step} style={{ '--i': 0 } as CSSProperties}>
                {String(i + 1).padStart(2, '0')} {c.step}
              </p>
              <Heading className={styles.title} style={{ '--i': 1 } as CSSProperties}>
                {c.title}
              </Heading>
              <p className={styles.body} style={{ '--i': 2 } as CSSProperties}>
                {c.body}
              </p>
            </div>
          )
        })}

        <div className={styles.progress} aria-hidden="true">
          <span ref={counter}>01</span>
          <span className={styles.track}>
            <span className={styles.fill} />
          </span>
          <span>{String(CHAPTERS.length).padStart(2, '0')}</span>
        </div>
      </div>
    </section>
  )
}
