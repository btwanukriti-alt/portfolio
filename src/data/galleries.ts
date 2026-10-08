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
// feature's text box. `span` holds the card's grid classes on the 12-column desktop grid.
export type BentoCard =
  | { kind: 'ui'; src: string; width: number; height: number; alt: string; span: string; fit?: 'contain' | 'top'; size?: string }
  | { kind: 'text'; kicker: string; title: string; text: string; span: string }

export type GallerySection = { label: string; cards: BentoCard[] }

type GalleryConfig = { studyKey: string; brand: Brand; note: string; images: GalleryImage[]; sections?: GallerySection[] }

const ssh = (file: string, height: number, alt: string, caption: string): GalleryImage => ({
  src: `/case-studies/ssh-client/${file}`,
  width: 2400,
  height,
  alt,
  caption,
})

const pf = (file: string, height: number, alt: string, caption: string): GalleryImage => ({
  src: `/case-studies/pulsefit-crm/${file}`,
  width: 2400,
  height,
  alt,
  caption,
})

const ui = (file: string, width: number, height: number, alt: string, span: string, fitOrSize?: string): BentoCard => ({
  kind: 'ui',
  src: `/case-studies/zync/ui/${file}.webp`,
  width,
  height,
  alt,
  span,
  ...(fitOrSize === 'top' ? { fit: 'top' as const } : fitOrSize ? { size: fitOrSize } : {}),
})

const text = (kicker: string, title: string, body: string, span: string): BentoCard => ({ kind: 'text', kicker, title, text: body, span })

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
    images: [],
    // The flow: the brand, then the main feature (Home), then the features around it.
    sections: [
      {
        label: 'Brand',
        cards: [
          ui('logo', 4824, 2748, 'The Zync logo on its construction grid, with measurements and clear space', 'col-span-12', 'max-w-[78%]'),
          ui('icon', 2484, 2448, 'The Zync app icon inside concentric squares', 'min-[901px]:col-span-4'),
          ui('palette', 2142, 2142, 'The Zync colour palette: primary, deep, accent and the tracker colours', 'min-[901px]:col-span-4'),
          text('Brand', 'The mark came first', 'Colour and type were set before any screen. Every card on this page draws from them.', 'min-[901px]:col-span-4'),
        ],
      },
      {
        label: 'Main feature',
        cards: [
          ui('phone-home', 1542, 2904, 'The Zync Home screen on a phone', 'min-[901px]:col-span-4 min-[901px]:row-span-2'),
          text('Main feature · Home', 'Your day, at a glance', 'Calories against the goal, steps, BMI and the next class, on one scroll.', 'min-[901px]:col-span-4'),
          ui('calories', 1338, 1362, 'The calorie card with burned and consumed tabs and a ring per activity', 'min-[901px]:col-span-4'),
          ui('stats', 2052, 2088, 'Four daily stat tiles: burned, consumed, steps and water', 'min-[901px]:col-span-4'),
          ui('table', 3168, 2208, 'The class table with staff, time, spots and status', 'min-[901px]:col-span-4'),
        ],
      },
      {
        label: 'Gym',
        cards: [
          ui('phone-gym', 1542, 2904, 'The Gym tab on a phone, with the check-in card and upcoming classes', 'min-[901px]:col-span-4 min-[901px]:row-span-2'),
          ui('qr', 1872, 1764, 'The check-in QR card', 'min-[901px]:col-span-4'),
          text('Gym · Check-in and classes', 'Check in, then book', "The gym's QR sits one tap from the Gym tab. Each class shows book, waitlist or booked before the tap.", 'min-[901px]:col-span-4'),
          ui('classes', 1338, 1368, 'Three class cards: available, full with a waitlist, and booked', 'min-[901px]:col-span-4'),
          ui('phone-events', 1542, 2904, 'The Gym Events screen with the week strip and class list', 'min-[901px]:col-span-4', 'top'),
        ],
      },
      {
        label: 'Tracking',
        cards: [
          text('Health · Tracking', 'Log in two taps', 'Shortcuts for every log. Water, sleep and food follow one pattern: a ring, a goal, a week.', 'min-[901px]:col-span-4'),
          ui('tiles', 1338, 1368, 'Log shortcuts for food, water, sleep, workout, steps and weight', 'min-[901px]:col-span-4'),
          ui('water-chart', 1338, 1158, 'Daily water intake over seven days against a goal of 12 glasses', 'min-[901px]:col-span-4'),
          ui('water-ring', 1458, 1026, 'The hydration ring: 1,600 of 3,000 ml', 'min-[901px]:col-span-3'),
          ui('sleep-ring', 1458, 1026, 'The sleep ring: 6h 30m of an 8h goal', 'min-[901px]:col-span-3'),
          ui('sleep-chart', 1338, 1158, 'Sleep analysis over seven days against an 8h goal', 'min-[901px]:col-span-3'),
          ui('macros', 1338, 786, 'Macros: protein, carbs, fat and fibre against their goals', 'min-[901px]:col-span-3'),
        ],
      },
      {
        label: 'Workouts',
        cards: [
          text('Workouts', 'Plans show level and length', 'Beginner, five weeks, sixty minutes. A member knows before opening a plan.', 'min-[901px]:col-span-4'),
          ui('plan-1', 1338, 1176, 'The Core Plus workout plan card', 'min-[901px]:col-span-4'),
          ui('phone-workout', 1542, 2904, 'The workout detail screen with duration, session, level and the exercise list', 'min-[901px]:col-span-4 min-[901px]:row-span-2'),
          ui('plan-2', 978, 957, 'The Game Changer workout plan card', 'min-[901px]:col-span-4'),
          ui('plan-3', 978, 957, 'The Stretching workout plan card', 'min-[901px]:col-span-4'),
        ],
      },
    ],
  },
  'ssh-client': {
    studyKey: 'ssh-client',
    note: 'Screens are rebuilt for this portfolio with sample content. Every figure in them is sample data.',
    brand: {
      accent: '#6D34D8',
      deep: '#3B1D91',
      soft: '#EFE9FD',
      tint: '#E4DBFF',
      pop: '#8049EC',
      font: 'var(--font-outfit), var(--font-hanken), sans-serif',
      mark: { src: '/brand/ssh-client-mark.png', ratio: 84 / 80 },
    },
    images: [
      ssh('01-health.jpg', 1000, 'A laptop showing the host stats screen beside the enlarged per-core CPU card', 'A host opens on its stats, not a terminal.'),
      ssh('02-disks.jpg', 860, 'The storage table with the nearly full disks in red and a callout on one bar', 'Disks at 95% turn red, so the risky one is found first.'),
      ssh('03-activity.jpg', 1000, 'Services, system logs, process list and process counts as separate cards', 'Running services and recent logs, read in one place.'),
      ssh('04-terminal.jpg', 1000, 'The command packages panel beside a laptop showing the terminal', 'Saved commands and an AI helper stay beside the terminal.'),
      ssh('05-add-host.jpg', 1000, 'The New Host panel with callouts on the four tabs and the default port', 'Adding a host takes four short tabs.'),
      ssh('06-hosts-keys.jpg', 1000, 'Host cards, key cards and their filters as separate cards', 'Hosts and keys share one card pattern.'),
      ssh('07-sftp.jpg', 1000, 'A laptop showing SFTP beside the enlarged Quick Connect card', 'Local files and a new connection, side by side.'),
      ssh('08-ports-sessions.jpg', 1000, 'Port mapping cards for local, remote and dynamic tunnels above the active sessions table', 'Tunnels and sessions, each readable at a glance.'),
      ssh('09-logo.jpg', 900, 'The logo mark on a construction grid with measurements and clear space', 'A ring for security, a hub for connections.'),
      ssh('10-icon-palette.jpg', 800, 'The app icon and the colour palette', 'The app icon and palette.'),
    ],
  },
  'jaadu-2': {
    studyKey: 'jaadu-2',
    note: 'Screens and components are exported from the Figma file. Every figure in them is sample data.',
    brand: {
      accent: '#2653CF',
      deep: '#00022B',
      soft: '#E8EEFF',
      tint: '#CFDDFF',
      pop: '#5985FF',
    },
    images: [
      jaadu('01-footprint.jpg', 1140, 'A zoomed footprint chart where each candle is split into price bins, with the hovered bin showing buys, sells and delta', 'The footprint splits each candle into price bins.'),
      jaadu('02-regime.jpg', 1140, 'The regime gauge showing sideways, breakout, volatile and reversal shares', 'The market regime, read live beside the chart.'),
      jaadu('03-alerts.jpg', 1170, 'A multi-condition alert with its condition list, and the create-alert panel', 'Alerts combine price, POC, footprint and regime conditions.'),
      jaadu('04-overnight.jpg', 1860, 'Overnight Discoveries: the falsification funnel, discoveries per night and the surviving strategy cards', 'Quant Lab: set it up, it works overnight, you wake up to a shortlist.'),
      jaadu('05-library.jpg', 1500, 'The strategy library as cards with regime, direction, win rate and backtest actions', 'Every saved strategy is a card.'),
      jaadu('06-comparison.jpg', 1875, 'The strategy comparison table with the best value per column highlighted, above the equity curves', 'Strategies compared side by side.'),
      jaadu('07-deja-vu.jpg', 1140, 'Deja Vu: historical matches, the current setup beside a match, and the outcome distribution', 'Deja Vu finds look-alike setups in market history.'),
      jaadu('08-chart-prompt.jpg', 1140, 'The chart prompt in its suggested and typing states', 'Ask about any point on the chart.'),
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
      pf('01-logo.jpg', 1350, 'The Pulsefit logo on a construction grid with measurements and clear space', 'Logo first: every module draws from it.'),
      pf('02-icon-palette.jpg', 1200, 'The app icon and the colour palette taken from the logo', 'One palette, taken from the logo.'),
      pf('03-leads.jpg', 1500, 'A laptop showing the lead tasks screen beside the enlarged stale leads card', 'Each alert has its Follow up button.'),
      pf('04-members.jpg', 1500, 'The member tasks screen on a laptop beside the enlarged expiring subscriptions card', 'Renew and Remind sit on the row.'),
      pf('05-attendance.jpg', 1140, 'The attendance heatmap by hour and weekday with a callout on the busiest hour', 'Attendance by hour, with the busiest one marked.'),
      pf('06-tables-forms.jpg', 1500, 'The staff table, create lead form, equipment table and a plan card as separate cards', 'One table pattern across modules.'),
      pf('07-website.jpg', 1500, 'The Pulsefit homepage on a laptop beside the enlarged feature tabs', 'The homepage opens on the promise.'),
      pf('08-pricing.jpg', 1050, 'Three pricing plans, Starter, Growth and Scale, on one plate', 'Three plans, one clear action each.'),
      pf('09-website-cards.jpg', 1500, 'How it works steps, FAQ, a call to action and the lead follow-up flow as separate cards', 'Setup, questions and the follow-up flow, as cards.'),
    ],
  },
}
