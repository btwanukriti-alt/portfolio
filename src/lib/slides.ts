import 'server-only'
import { readdirSync } from 'node:fs'
import path from 'node:path'

// Presentation slides (1600 x 900 exports from Figma) for a case study, ordered by file name:
// public/case-studies/<slug>/slide-NN.jpg. Read at build time.
export function slidesFor(slug: string): string[] {
  const dir = path.join(process.cwd(), 'public', 'case-studies', slug)
  try {
    return readdirSync(dir)
      .filter((f) => /^slide-.*\.jpg$/.test(f))
      .sort()
      .map((f) => `/case-studies/${slug}/${f}`)
  } catch {
    return []
  }
}
