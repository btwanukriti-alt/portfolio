import { useEffect, useRef, useState } from 'react'
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'

// The showcase pages expose their clock: window.__showcase (Stage players) or window.__zync (the Zync player).
type Clock = { seek: (t: number) => void; pause: () => void }
type ShowcaseWindow = Window & { __showcase?: Clock; __zync?: Clock; __showcaseLoaded?: Promise<Clock> }

const loaded = (el: HTMLElement) => new Promise<void>((resolve) => el.addEventListener('load', () => resolve(), { once: true }))

// Runs a showcase page inside this one: its styles and markup go into the document, its scripts run in order. (Not
// an iframe: while rendering, Remotion only picks up changes to its own page.)
async function mount(slug: string, host: HTMLElement): Promise<Clock> {
  const html = await (await fetch(staticFile(`showcase/${slug}.html`))).text()
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const scripts = [...doc.querySelectorAll('script')]
  scripts.forEach((s) => s.remove())
  for (const node of [...doc.querySelectorAll('style, link[rel="stylesheet"]')]) {
    const el = node.cloneNode(true) as HTMLElement
    document.head.append(el)
    if (el.tagName === 'LINK') await loaded(el)
    node.remove()
  }
  host.innerHTML = doc.body.innerHTML
  // Embed mode, as on the work cards (?embed there): no player controls, the stage filling the frame.
  Object.assign(window, { __EMBED__: true, __SHOWCASE_EMBED__: true })
  for (const s of scripts) {
    const el = document.createElement('script')
    for (const a of s.attributes) el.setAttribute(a.name, a.value)
    if (s.src) {
      document.body.append(el)
      await loaded(el)
    } else {
      el.textContent = s.textContent
      document.body.append(el)
    }
  }
  const win = window as ShowcaseWindow
  await new Promise<void>((resolve) => {
    const wait = () => (win.__showcase || win.__zync ? resolve() : setTimeout(wait, 50))
    wait()
  })
  await document.fonts.ready
  // The Zync player hides its controls and seeks on its own first; give it a moment.
  await new Promise((r) => setTimeout(r, 300))
  const clock = (win.__showcase ?? win.__zync)!
  clock.pause()
  return clock
}

// One showcase, paused, moved to the exact time of each frame.
export function Showcase({ slug, duration, start }: { slug: string; duration: number; start: number }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const host = useRef<HTMLDivElement>(null)
  const [clock, setClock] = useState<Clock | null>(null)
  const [loading] = useState(() => delayRender(`Loading the ${slug} showcase`))

  useEffect(() => {
    const win = window as ShowcaseWindow
    win.__showcaseLoaded ??= mount(slug, host.current!)
    win.__showcaseLoaded.then((c) => {
      setClock(c)
      continueRender(loading)
    })
  }, [slug, loading])

  useEffect(() => {
    if (!clock) return
    const drawn = delayRender(`Frame ${frame}`)
    clock.seek((start + frame / fps) % duration)
    // The showcase has its own React; let it commit the new time before the frame is captured.
    const t = setTimeout(() => continueRender(drawn), 30)
    return () => clearTimeout(t)
  }, [clock, frame, fps, start, duration])

  return <AbsoluteFill ref={host} />
}
