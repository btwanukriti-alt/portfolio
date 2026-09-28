import { useEffect, useSyncExternalStore } from 'react'

// Tiny hash router: "#/work/<slug>" opens a case study, anything else is the home page
// (where "#work", "#reach-out" etc. are just in-page anchors).
const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

export function useHashRoute() {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash)
  const match = hash.match(/^#\/work\/([\w-]+)/)
  const caseStudy = match?.[1] ?? null

  // Case studies open at the top; home anchors scroll to their section once it has rendered.
  useEffect(() => {
    if (caseStudy) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    const id = hash.slice(1)
    const target = id ? document.getElementById(id) : null
    if (target) target.scrollIntoView()
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [hash, caseStudy])

  return { caseStudy }
}
