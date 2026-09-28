import card1 from '../assets/work/project-1.jpg'
import card2 from '../assets/work/project-2.jpg'
import card3 from '../assets/work/project-3.jpg'
import card4 from '../assets/work/project-4.jpg'
import card5 from '../assets/work/project-5.jpg'
import heroJaadu from '../assets/case-studies/jaadu-2/hero.jpg'
import heroFitness from '../assets/case-studies/fitness-tracker/hero.jpg'
import heroBosch from '../assets/case-studies/bosch-customer-experience/hero.jpg'
import heroClihub from '../assets/case-studies/clihub/hero.jpg'
import heroCollege from '../assets/case-studies/college-management/hero.jpg'

// Presentation slides (1600 x 900 exports from Figma), ordered by file name.
const slideModules = import.meta.glob<string>('../assets/case-studies/*/slide-*.jpg', {
  eager: true,
  import: 'default',
})

function slidesFor(slug: string) {
  return Object.keys(slideModules)
    .filter((path) => path.includes(`/case-studies/${slug}/`))
    .sort()
    .map((path) => slideModules[path])
}

// Placeholder copy from the Figma layouts (work cards 156:14295, case study 125:2),
// shared by every project until the real write-ups exist.
const PLACEHOLDER = {
  description:
    'Combined orders, returns, and support history into a single view, making it easier for teams to continue conversations without missing context',
  role: 'UX Designer',
  timeline: '3 months',
  problem:
    "The problem wasn't visual, it was cognitive. Users couldn't answer three basic questions: what am I covered for, what do I do next, and how do I know this is real. Insurance products usually answer these in a policy document nobody opens. So the work was to move those answers into the interface itself, into onboarding, the dashboard, and the moment a claim begins.",
}

export type Project = {
  slug: string
  title: string
  description: string
  role: string
  timeline: string
  problem: string
  card: string
  hero: string
  slides: string[]
}

// Figma sources: Fitness Tracker -> "Zync — Case Study", BOSCH card (Pulsefit screens) ->
// "Pulsefit — Case Study", CLIHUB -> "CLI Hub — Case Study", College Management ->
// "Dhondi — The Solution" (problem/solution pairs). Jaadu 2.0 has no presentation yet.
export const PROJECTS: Project[] = [
  { slug: 'jaadu-2', title: 'Jaadu 2.0', card: card1, hero: heroJaadu },
  { slug: 'fitness-tracker', title: 'Fitness Tracker App', card: card2, hero: heroFitness },
  { slug: 'bosch-customer-experience', title: 'BOSCH Customer Experience', card: card3, hero: heroBosch },
  { slug: 'clihub', title: 'CLIHUB', card: card4, hero: heroClihub },
  { slug: 'college-management', title: 'College Management', card: card5, hero: heroCollege },
].map((p) => ({ ...PLACEHOLDER, ...p, slides: slidesFor(p.slug) }))

export const caseStudyHref = (slug: string) => `#/work/${slug}`
