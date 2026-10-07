// Gallery for the college group ERP case study: real redesign screens (rendered from the approved
// designs, sample data) composed into presentation mockups. Pins are positioned as % of the image.

const M = '/case-studies/college-management/mockups'

export type Pin = { x: number; y: number; text: string; flip?: boolean }

export type Mockup =
  | { type: 'hero'; src: string; alt: string; caption: string; pins: Pin[] }
  | { type: 'screen'; src: string; alt: string; caption: string; pins: Pin[] }
  | { type: 'flow'; caption: string; steps: { src: string; alt: string; label: string; crop?: number }[] }
  | { type: 'detail'; tone: 'navy' | 'peach'; src: string; alt: string; caption: string; note: string; pins: Pin[] }
  | { type: 'compare'; caption: string; before: { src: string; alt: string }; after: { src: string; alt: string }; cropTop?: boolean }
  | { type: 'board'; caption: string }

export const COLLEGE_INFO = [
  ['Type', 'Internship'],
  ['Timeline', '3 months'],
  ['Role', 'Sole designer'],
  ['Scope', 'Finance, staff and settlements'],
] as const

export const COLLEGE_GALLERY: Mockup[] = [
  {
    type: 'hero',
    src: `${M}/drawer-programme.webp`,
    alt: 'Stacked drawer at programme level: B.Tech batches ranked by collection',
    caption: 'Group to batch in stacked drawers, and every level stays on screen.',
    pins: [
      { x: 10, y: 22, text: 'Every level stays as a spine' },
      { x: 94.5, y: 12, text: 'Totals for this level only' },
      { x: 95.5, y: 52, text: 'Same columns at every level' },
    ],
  },
  {
    type: 'flow',
    caption: 'Three steps from the whole group to the weakest batch.',
    steps: [
      { src: `${M}/finance.webp`, alt: 'Finance overview', label: 'Group', crop: 0.62 },
      { src: `${M}/drawer-college.webp`, alt: 'College drawer', label: 'College' },
      { src: `${M}/drawer-programme.webp`, alt: 'Programme drawer', label: 'Programme' },
    ],
  },
  {
    type: 'screen',
    src: `${M}/finance.webp`,
    alt: 'Finance overview dashboard',
    caption: 'The finance overview opens on collection against target, not a greeting.',
    pins: [
      { x: 56, y: 15.5, text: 'Collected against target, one bar' },
      { x: 75, y: 27.8, text: 'Weakest college, named' },
      { x: 19.5, y: 74.4, text: 'Ranked, lowest first' },
    ],
  },
  {
    type: 'detail',
    tone: 'peach',
    src: `${M}/crop-target.webp`,
    alt: 'Total received bar with the 80% target marked',
    caption: 'One bar answers whether the group is on track.',
    note: 'Received, expected and the 80% target in one bar',
    pins: [{ x: 46.4, y: 56, text: '80% target marked on the bar' }],
  },
  {
    type: 'detail',
    tone: 'navy',
    src: `${M}/crop-table.webp`,
    alt: 'College table sorted by collection percentage',
    caption: 'Scan one column to find the weakest college.',
    note: 'Collection % runs down every table',
    pins: [{ x: 80.5, y: 19, text: 'Collection % in its own column' }],
  },
  {
    type: 'compare',
    caption: 'Finance overview, before and after.',
    before: { src: `${M}/earlier-finance.webp`, alt: 'Earlier finance dashboard' },
    after: { src: `${M}/finance.webp`, alt: 'Redesigned finance dashboard' },
    cropTop: true,
  },
  {
    type: 'compare',
    caption: 'Inside the drawer: totals now belong to the level you opened.',
    before: { src: `${M}/earlier-drawer.webp`, alt: 'Earlier drawer showing group totals' },
    after: { src: `${M}/drawer-programme.webp`, alt: 'Redesigned drawer showing programme totals' },
  },
  {
    type: 'screen',
    src: `${M}/staff.webp`,
    alt: 'Staff overview dashboard',
    caption: 'Staff overview: attendance first, then the people who need a follow-up.',
    pins: [
      { x: 34.5, y: 10.5, text: 'Five numbers, one row' },
      { x: 62, y: 34, text: 'Present, absent, on leave' },
      { x: 86.5, y: 71.4, text: 'Who needs a follow-up' },
    ],
  },
  { type: 'board', caption: 'One status system across every screen.' },
]
