import card1 from '../assets/work/project-1.jpg'
import card2 from '../assets/work/project-2.jpg'
import card3 from '../assets/work/project-3.jpg'
import card4 from '../assets/work/project-4.jpg'
import card5 from '../assets/work/project-5.jpg'

// Placeholder copy shared by every project until the real write-ups exist.
const PLACEHOLDER = {
  description:
    'Combined orders, returns, and support history into a single view, making it easier for teams to continue conversations without missing context.',
  role: 'UX Designer',
  timeline: '3 months',
}

export type Project = {
  slug: string
  title: string
  description: string
  role: string
  timeline: string
  card: string
}

// Case study material for each project (hero + presentation slides) is kept in
// src/assets/case-studies/<slug>/ for when the case study pages are rebuilt.
export const PROJECTS: Project[] = [
  { slug: 'jaadu-2', title: 'Jaadu 2.0', card: card1 },
  { slug: 'fitness-tracker', title: 'Fitness Tracker App', card: card2 },
  { slug: 'bosch-customer-experience', title: 'BOSCH Customer Experience', card: card3 },
  { slug: 'clihub', title: 'CLIHUB', card: card4 },
  { slug: 'college-management', title: 'College Management', card: card5 },
].map((p) => ({ ...PLACEHOLDER, ...p }))
