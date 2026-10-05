import jaadu from '../assets/case-studies/jaadu-2/hero.jpg'
import fitness from '../assets/case-studies/fitness-tracker/hero.jpg'
import bosch from '../assets/case-studies/bosch-customer-experience/hero.jpg'
import clihub from '../assets/case-studies/clihub/hero.jpg'
import college from '../assets/case-studies/college-management/hero.jpg'

export type Project = {
  slug: string
  title: string
  kind: string
  /** Placeholder until the real write-ups exist. */
  summary: string
  image: string
}

// Titles from the original site; kinds are read off the screens. Summaries are placeholders.
export const PROJECTS: Project[] = [
  { slug: 'jaadu-2', title: 'Jaadu 2.0', kind: 'Trading dashboard', image: jaadu },
  { slug: 'fitness-tracker', title: 'Fitness Tracker App', kind: 'Health and habit tracking', image: fitness },
  { slug: 'bosch-customer-experience', title: 'BOSCH Customer Experience', kind: 'Gym management platform', image: bosch },
  { slug: 'clihub', title: 'CLIHUB', kind: 'Server management tool', image: clihub },
  { slug: 'college-management', title: 'College Management', kind: 'College management system', image: college },
].map((p) => ({ ...p, summary: 'Case study coming soon.' }))
