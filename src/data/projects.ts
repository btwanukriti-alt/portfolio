// Project data shared by the work cards and the case-study pages (in this order: Pulsefit, College ERP, Jaadu,
// Zync, SSH Client). Images live in public/; case-study content is in src/data/stories.ts.

export type Project = {
  slug: string
  // title: the case-study page; name: the work card, two or three words on what the software is.
  title: string
  name: string
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
// "Pulsefit — Case Study", SSH client -> "SSH client — Case Study", College Management ->
// "The Solution" (problem/solution pairs). Jaadu 2.0 has no presentation yet.
export const PROJECTS: Project[] = [
  {
    slug: 'gym-crm',
    title: 'Gym Management CRM',
    name: 'Gym Management CRM',
    description:
      "Leads, members, payments and follow-ups for gym owners and staff, in one dashboard.",
    role: 'Sole Designer',
    timeline: '3 months',
    problem:
      "The front desk handles calls, walk-ins and messages all day. Leads written on paper got lost. I designed a CRM that keeps every lead in view until it becomes a member.",
    card: '/work/project-3.jpg',
    hero: caseStudyImage('gym-crm'),
    showcase: '/showcase/gym-crm.html?embed&v=3',
    color: '#DCCFFF',
  },
  {
    slug: 'college-erp',
    title: 'College Group ERP',
    name: 'College Group ERP',
    description:
      "A group-level ERP for college trusts and admin staff, with one dashboard and role-based access.",
    role: 'Sole Designer',
    timeline: '3 months',
    problem:
      "A college group had no way to see all its colleges at once. The redesign puts them on one dashboard, with access set by role.",
    card: '/case-studies/college-erp/hero-v2.jpg',
    hero: '/case-studies/college-erp/hero-v2.jpg',
    showcase: '/showcase/college-erp.html?embed&v=5',
    color: '#FFE4D3',
  },
  {
    slug: 'jaadu',
    title: 'Jaadu 2.0',
    name: 'AI Trading Terminal',
    description:
      "Charts, alerts, backtesting and an AI strategy lab for active traders, in one terminal.",
    role: 'Sole Designer',
    timeline: '2 months',
    problem:
      "Traders had every number they needed: charts, order flow, footprint, alerts. What they didn't have was an answer to where to trade. The work was to keep the depth active traders rely on, and add QuantLab, which narrows hundreds of strategies to the few that fit the current market.",
    card: '/work/project-1.jpg',
    hero: caseStudyImage('jaadu'),
    showcase: '/showcase/jaadu.html?embed&v=5',
    color: '#CFDDFF',
  },
  {
    slug: 'zync',
    title: 'Zync',
    name: 'Gym Member App',
    description:
      "The member app for a gym software company: classes, workouts and health tracking in one place.",
    role: 'Sole Designer',
    timeline: '2 months',
    problem:
      "Gym members signed up, came for a few weeks and stopped. Booking a class, logging a workout and tracking calories each happened somewhere different, and none of it showed progress. The work was to put all three in one app, so members could see their effort add up and had a reason to come back.",
    card: '/case-studies/zync/01-home.jpg',
    hero: caseStudyImage('zync'),
    showcase: '/showcase/zync.html?v=5',
    color: '#FFE8EE',
  },
  {
    slug: 'ssh-client',
    title: 'SSH Client',
    name: 'SSH Client',
    description:
      "A multi-platform SSH client with saved commands, live server stats and an AI terminal assistant.",
    role: 'Sole Designer',
    timeline: '3 months',
    problem:
      "A sysadmin managing 40 servers shouldn't need to remember 400 commands. I designed it to remember them, and to write the next one on request.",
    card: '/case-studies/ssh-client/01-health.jpg',
    hero: caseStudyImage('ssh-client'),
    showcase: '/showcase/ssh-client.html?embed&v=10',
    color: '#D3F0F5',
  },
]

export const projectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug)

export const caseStudyHref = (slug: string) => `/work/${slug}`
