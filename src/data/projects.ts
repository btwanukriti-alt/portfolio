// Project data shared by the work cards and the case-study pages. Images live in public/;
// presentation slides are listed at build time by src/lib/slides.ts.

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
  // The showcase's background colour: a collapsed work card is a solid strip of it.
  color: string
}

const caseStudyImage = (slug: string) => `/case-studies/${slug}/hero.jpg`

// Figma sources: Fitness Tracker -> "Zync — Case Study", BOSCH card (Pulsefit screens) ->
// "Pulsefit — Case Study", CLIHUB -> "CLI Hub — Case Study", College Management ->
// "Dhondi — The Solution" (problem/solution pairs). Jaadu 2.0 has no presentation yet.
export const PROJECTS: Project[] = [
  {
    slug: 'jaadu-2',
    title: 'Jaadu 2.0',
    description:
      "Charts, alerts, backtesting and an AI strategy lab for active traders, in one terminal.",
    role: 'Sole Designer',
    timeline: '2 months',
    problem:
      "Traders had every number they needed: charts, order flow, footprint, alerts. What they didn't have was an answer to where to trade. The work was to keep the depth active traders rely on, and add QuantLab, which narrows hundreds of strategies to the few that fit the current market.",
    card: '/work/project-1.jpg',
    hero: caseStudyImage('jaadu-2'),
    showcase: '/showcase/jaadu-2.html?embed&v=3',
    color: '#CFDDFF',
  },
  {
    slug: 'fitness-tracker',
    title: 'Fitness Tracker App',
    description:
      "Book a class, log the workout, track calories. A fitness app for gym members.",
    role: 'Sole Designer',
    timeline: '2 months',
    problem:
      "Gym members signed up, came for a few weeks and stopped. Booking a class, logging a workout and tracking calories each happened somewhere different, and none of it showed progress. The work was to put all three in one app, so members could see their effort add up and had a reason to come back.",
    card: '/work/project-2.jpg',
    hero: caseStudyImage('fitness-tracker'),
    showcase: '/showcase/fitness-tracker.html?v=4',
    color: '#FFE8EE',
  },
  {
    slug: 'bosch-customer-experience',
    title: 'Gym Management CRM',
    description:
      "Leads, members, payments and follow-ups for gym owners and staff, in one dashboard.",
    role: 'Sole Designer',
    timeline: '3 months',
    problem:
      "The front desk handles calls, walk-ins and messages all day. Leads written on paper got lost. I designed a CRM that keeps every lead in view until it becomes a member.",
    card: '/work/project-3.jpg',
    hero: caseStudyImage('bosch-customer-experience'),
    showcase: '/showcase/bosch-customer-experience.html?embed&v=3',
    color: '#DCCFFF',
  },
  {
    slug: 'clihub',
    title: 'CLIHUB',
    description:
      "A multi-platform SSH client with saved commands, live server stats and an AI terminal assistant.",
    role: 'Sole Designer',
    timeline: '3 months',
    problem:
      "A sysadmin managing 40 servers shouldn't need to remember 400 commands. I designed CLIHUB to remember them, and to write the next one on request.",
    card: '/work/project-4.jpg',
    hero: caseStudyImage('clihub'),
    showcase: '/showcase/clihub.html?embed&v=4',
    color: '#B9C7DB',
  },
  {
    slug: 'college-management',
    title: 'College Management',
    description:
      "A group-level ERP for college trusts and admin staff, with one dashboard and role-based access.",
    role: 'Sole Designer',
    timeline: '3 months',
    problem:
      "A college group had no way to see all its colleges at once. Dhondi puts them on one dashboard, with access set by role.",
    card: caseStudyImage('college-management'),
    hero: caseStudyImage('college-management'),
    showcase: '/showcase/college-management.html?embed&v=3',
    color: '#CFDDFF',
  },
]

export const projectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug)

export const caseStudyHref = (slug: string) => `/work/${slug}`
