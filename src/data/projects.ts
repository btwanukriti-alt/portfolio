// Project data shared by the work cards and the case-study pages. Images live in public/;
// presentation slides are listed at build time by src/lib/slides.ts.

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
  // Looping animated showcase (public/showcase/, the Claude showcase artifacts): the work card's
  // video and the case-study hero. The bundled players go chromeless with ?embed; the fitness
  // one is wrapped by scripts/build-showcases.mjs. All play/pause on postMessage. Browsers cache
  // these files for a day (next.config.ts), so bump v= when one changes. Falls back to the
  // card / hero stills.
  showcase?: string
}

const caseStudyImage = (slug: string) => `/case-studies/${slug}/hero.jpg`

// Figma sources: Fitness Tracker -> "Zync — Case Study", BOSCH card (Pulsefit screens) ->
// "Pulsefit — Case Study", CLIHUB -> "CLI Hub — Case Study", College Management ->
// "Dhondi — The Solution" (problem/solution pairs). Jaadu 2.0 has no presentation yet.
export const PROJECTS: Project[] = [
  {
    slug: 'jaadu-2',
    title: 'Jaadu 2.0',
    card: '/work/project-1.jpg',
    hero: caseStudyImage('jaadu-2'),
    showcase: '/showcase/jaadu-2.html?embed&v=3',
  },
  {
    slug: 'fitness-tracker',
    title: 'Fitness Tracker App',
    card: '/work/project-2.jpg',
    hero: caseStudyImage('fitness-tracker'),
    showcase: '/showcase/fitness-tracker.html?v=3',
  },
  {
    slug: 'bosch-customer-experience',
    title: 'BOSCH Customer Experience',
    card: '/work/project-3.jpg',
    hero: caseStudyImage('bosch-customer-experience'),
    showcase: '/showcase/bosch-customer-experience.html?embed&v=3',
  },
  {
    slug: 'clihub',
    title: 'CLIHUB',
    card: '/work/project-4.jpg',
    hero: caseStudyImage('clihub'),
    showcase: '/showcase/clihub.html?embed&v=3',
  },
  {
    slug: 'college-management',
    title: 'College Management',
    card: caseStudyImage('college-management'),
    hero: caseStudyImage('college-management'),
    showcase: '/showcase/college-management.html?embed&v=3',
  },
].map((p) => ({ ...PLACEHOLDER, ...p }))

export const projectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug)

export const caseStudyHref = (slug: string) => `/work/${slug}`
