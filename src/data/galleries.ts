// Mockup galleries for the case study pages that use the visual-first layout
// (src/components/GalleryCaseStudy.tsx): a short description on top, a long run of mockups below.
// Images are 2400px-wide JPEGs in public/case-studies/<folder>/. Every figure shown in them is
// sample data from the design, and the captions say what each image proves in one line.

export type GalleryImage = {
  src: string
  width: number
  height: number
  alt: string
  caption: string
}

export type Brand = {
  // Supporting colours for the page (hex). accent: links and labels; soft: chips and plates;
  // tint: the project colour (also the work card's strip); pop: the second accent.
  accent: string
  deep: string
  soft: string
  tint: string
  pop: string
  // Font stack for the page title (default: the Zync wordmark font).
  font?: string
  // White-on-transparent mark in public/brand/, drawn in the accent colour with a CSS mask.
  mark?: { src: string; ratio: number; full?: boolean }
}

// Bento page (Zync): each feature is a two-row grid of cards. A 'ui' card holds one transparent
// component image from public/case-studies/<folder>/ui/ with room around it; a 'text' card is the
// feature's text box; a 'block' card is a component rebuilt in React. `span` holds the card's grid classes on the 12-column desktop grid.
// surface: the card's ground. plate (light grey, default), tint (the project's soft colour), deep (a
// dark gradient in the project's deep colour), pop (the second accent), white. Text cards default to
// the accent colour.
export type Surface = 'plate' | 'tint' | 'deep' | 'pop' | 'white' | 'night'
export type BentoCard =
  | { kind: 'ui'; src: string; width: number; height: number; alt: string; span: string; fit?: 'contain' | 'top' | 'fill'; size?: string; surface?: Surface }
  | { kind: 'text'; kicker: string; title: string; text: string; span: string; surface?: Surface }
  // A component rebuilt in React (src/components/zync/ZyncBlocks.tsx); the card is its surface.
  | { kind: 'block'; block: string; label: string; span: string; surface?: Surface }

// rows: how many grid rows the section uses on desktop (2 by default, or 3).
export type GallerySection = { label: string; rows?: 1 | 2 | 3 | 'auto'; cards: BentoCard[] }

type GalleryConfig = { studyKey: string; brand: Brand; note: string; images: GalleryImage[]; sections?: GallerySection[] }

const pf = (file: string, height: number, alt: string, caption: string): GalleryImage => ({
  src: `/case-studies/pulsefit-crm/${file}`,
  width: 2400,
  height,
  alt,
  caption,
})
const jaadu = (file: string, height: number, alt: string, caption: string): GalleryImage => ({
  src: `/case-studies/jaadu-2/${file}`,
  width: 2400,
  height,
  alt,
  caption,
})

// Keyed by project slug (src/data/projects.ts); studyKey points at src/data/caseStudies.ts.
export const GALLERIES: Record<string, GalleryConfig> = {
  'fitness-tracker': {
    studyKey: 'zync',
    note: 'Screens are refined for this portfolio, and the figures in them are sample data.',
    brand: {
      accent: '#644ACD',
      deep: '#3E2B94',
      soft: '#ECE8FA',
      tint: '#FFE8EE',
      pop: '#F5577D',
      mark: { src: '/brand/zync-mark.png', ratio: 170 / 188 },
    },
    images: [
      { src: '/case-studies/fitness-tracker/v2-01-home.jpg', width: 2400, height: 1776, alt: 'The Burned and Consumed calorie cards beside the Home screen on a phone', caption: 'Your day on one screen.' },
      { src: '/case-studies/fitness-tracker/v2-02-log.jpg', width: 2400, height: 2526, alt: 'The log tiles, the nutrient bars and the water chart, above the food, sleep and water screens', caption: 'Log food, water and sleep.' },
      { src: '/case-studies/fitness-tracker/v2-03-gym.jpg', width: 2400, height: 1230, alt: 'The QR check-in card and a class in its three states: open, full and booked', caption: 'Check in and book a class.' },
      { src: '/case-studies/fitness-tracker/v2-04-workout.jpg', width: 2400, height: 1880, alt: 'A plan card, the plan on a phone, and its exercise list with Start workout', caption: 'Follow a workout plan.' },
    ],
  },
  'college-management': {
    studyKey: 'college-erp',
    note: 'Screens are rebuilt for this portfolio with sample content. Every figure in them is sample data.',
    brand: {
      accent: '#12326E',
      deep: '#08153A',
      soft: '#E6EDF9',
      tint: '#D5DDED',
      pop: '#4F86E8',
      font: 'var(--font-hanken), system-ui, sans-serif',
    },
    images: [
      { src: '/case-studies/college-management/v2-01-problem.jpg', width: 2400, height: 2040, alt: 'The old finance stats page and the 28-column Excel sheet, with the problems marked', caption: 'The old system.' },
      { src: '/case-studies/college-management/v2-02-dashboard.jpg', width: 2400, height: 3245, alt: 'The group summary banner above the full group finance dashboard', caption: 'One view of every college.' },
      { src: '/case-studies/college-management/v2-03-drill-down.jpg', width: 2400, height: 2448, alt: 'The hierarchy from group to batch, and the stacked drawers for a college and a programme', caption: 'See it by level, group to batch.' },
      { src: '/case-studies/college-management/v2-04-staff.jpg', width: 2400, height: 1274, alt: 'The old staff list beside the new attendance screen with status tabs and filters', caption: 'Staff attendance.' },
      { src: '/case-studies/college-management/v2-05-settlements.jpg', width: 2400, height: 1286, alt: 'The old settlements list beside the new settlements screen with tabs and search', caption: 'Settlements.' },
    ],
  },
  'ssh-client': {
    studyKey: 'ssh-client',
    note: 'Screens are rebuilt for this portfolio with sample content. Every figure in them is sample data.',
    brand: {
      accent: '#7C5CFF',
      deep: '#2B1C70',
      soft: '#F1EDFF',
      tint: '#E6DEFF',
      pop: '#3B82F6',
      font: 'var(--font-outfit), var(--font-hanken), sans-serif',
      mark: { src: '/brand/ssh-client-mark.png', ratio: 84 / 80 },
    },
    images: [
      { src: '/case-studies/ssh-client/v3-01-logo.jpg', width: 2400, height: 1470, alt: 'The product mark on a construction grid, and its clear space', caption: 'One mark: a security ring around a hub.' },
      { src: '/case-studies/ssh-client/v2-02-add-host.jpg', width: 2400, height: 2657, alt: 'Two host cards and the New Host panel above the full hosts screen', caption: 'All servers as cards.' },
      { src: '/case-studies/ssh-client/v2-03-health.jpg', width: 2400, height: 2645, alt: 'The network and security insights cards above the full host overview', caption: 'Check a server’s health.' },
      { src: '/case-studies/ssh-client/v2-04-keys.jpg', width: 2400, height: 1499, alt: 'Select host, export key and connection successful, linked in order', caption: 'Send a key to a server.' },
      { src: '/case-studies/ssh-client/v2-05-terminal.jpg', width: 2400, height: 2850, alt: 'The saved command and Ask AI panels above the full terminal screen', caption: 'Run saved commands.' },
      { src: '/case-studies/ssh-client/v2-06-sessions.jpg', width: 2400, height: 942, alt: 'The active sessions table grouped by day', caption: 'See who is connected.' },
    ],
  },
  'jaadu-2': {
    studyKey: 'jaadu-2',
    note: 'Screens are exported from the Figma file. Every figure in them is sample data.',
    brand: {
      accent: '#2653CF',
      deep: '#00022B',
      soft: '#E8EEFF',
      tint: '#CFDDFF',
      pop: '#5985FF',
    },
    images: [
      jaadu('v2-01-terminal.jpg', 1175, 'The trading terminal with the chart, market mood gauge, watchlist and live trades', 'Everything in one place.'),
      jaadu('v2-02-footprint.jpg', 1416, 'A footprint chart where each candle shows money sold and bought at each price', 'See inside every candle.'),
      jaadu('v2-03-ask.jpg', 1125, 'The market mood gauge and the chart prompt with suggested questions', 'Ask about any candle.'),
      jaadu('v2-04-alerts.jpg', 2555, 'An alert with three conditions, the create alert panel and the full alerts screen', 'Alerts that do more.'),
      jaadu('v2-05-build.jpg', 1176, 'Quant Lab turning a typed idea into a strategy card', 'Build a strategy by typing.'),
      jaadu('v2-06-overnight.jpg', 2378, 'Overnight Discoveries in three steps: set up, running, and the morning shortlist', 'Wake up to new strategies.'),
      jaadu('v2-07-library.jpg', 1127, 'The strategy library and the comparison screen side by side', 'Save and compare.'),
      jaadu('v2-08-deja.jpg', 1175, 'Déjà Vu showing past matches for today\'s market and what happened next', 'Has this happened before?'),
    ],
  },
  'bosch-customer-experience': {
    studyKey: 'pulsefit-crm',
    note: 'The software and the website are rebuilt for this portfolio with sample content. Every name and figure in them is sample data.',
    brand: {
      accent: '#0063F8',
      deep: '#003A92',
      soft: '#E6F0FF',
      tint: '#DCCFFF',
      pop: '#FFB800',
      font: 'var(--font-hanken), system-ui, sans-serif',
      // The original mark keeps its own colours, so it is drawn as an image rather than a mask.
      mark: { src: '/brand/pulsefit-mark.svg', ratio: 20.48 / 22.28, full: true },
    },
    images: [
      pf('01-logo.jpg', 1590, 'The Pulsefit mark on a construction grid, and the logo with its clear space', 'One mark, built on a single slant.'),
      pf('02-lead-dashboard-v2.jpg', 3335, 'The missed follow-ups and stale leads cards above the full lead dashboard', 'Leads that need a follow-up.'),
      pf('03-convert-v2.jpg', 1712, 'The leads table and the convert to member form it opens, with the lead details carried over', 'Turn a lead into a member.'),
      pf('04-plans-v2.jpg', 2672, 'Plan categories and two plan cards above the full plans screen', 'All plans in one place.'),
      pf('05-members-v2.jpg', 3131, 'The expiring this week table above the full members dashboard', 'Renew expiring plans.'),
      pf('06-email-v2.jpg', 2795, 'The subscription emails card above the full automated emails screen', 'Automatic emails.'),
      { ...pf('07-website-full.jpg', 6157, 'The full Pulsefit homepage, as designed', 'The homepage, top to bottom.'), width: 1440 },
    ],
  },
}
