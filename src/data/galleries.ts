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

const block = (name: string, label: string, span: string): BentoCard => ({ kind: 'block', block: name, label, span })

// College ERP bento cards: laptop screens from public/case-studies/college-management/ui/.
const cui = (file: string, alt: string, span: string, surface?: Surface, fit?: 'fill', size: [number, number] = [2776, 1884]): BentoCard => ({
  kind: 'ui',
  src: `/case-studies/college-management/ui/${file}.webp`,
  width: size[0],
  height: size[1],
  alt,
  span,
  surface,
  fit,
})

const cblock = (name: string, label: string, span: string, surface?: Surface): BentoCard => ({ kind: 'block', block: name, label, span, surface })

const ctext = (kicker: string, title: string, body: string, span: string, surface?: Surface): BentoCard => ({ kind: 'text', kicker, title, text: body, span, surface })

// SSH client bento cards: dark screens from public/case-studies/ssh-client/ui/.
const sui = (file: string, alt: string, span: string, size: [number, number], fit?: 'fill'): BentoCard => ({
  kind: 'ui',
  src: `/case-studies/ssh-client/ui/${file}.webp`,
  width: size[0],
  height: size[1],
  alt,
  span,
  surface: 'night',
  fit,
})

const sblock = (name: string, label: string, span: string): BentoCard => ({ kind: 'block', block: name, label, span, surface: 'night' })

const stext = (kicker: string, title: string, body: string, span: string, surface?: Surface): BentoCard => ({ kind: 'text', kicker, title, text: body, span, surface })

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
          ui('logo', 4824, 2748, 'The Zync logo on its construction grid, with measurements and clear space', 'min-[901px]:col-span-12', 'max-w-[78%]'),
          ui('icon', 2484, 2448, 'The Zync app icon inside concentric squares', 'min-[901px]:col-span-4'),
          block('palette', 'The Zync colour palette: primary, deep, accent and the tracker colours', 'min-[901px]:col-span-8'),
        ],
      },
      {
        label: 'Main feature: Home',
        cards: [
          ui('phone-home', 1542, 2904, 'The Zync Home screen on a phone', 'min-[901px]:col-span-4 min-[901px]:row-span-2'),
          text('Main feature · Home', 'The whole day on one screen', 'Calories burned and eaten against the goal, steps, BMI and the next class. A member reads the day before the first scroll.', 'min-[901px]:col-span-4'),
          block('calories', 'The calorie ring: 900 of 1,200 cal burned, split by activity', 'min-[901px]:col-span-4'),
          block('consumed', 'The Consumed side of the calorie card: 1,385 of 2,250 cal, split into carbs, fat and protein', 'min-[901px]:col-span-8'),
        ],
      },
      {
        label: 'Gym',
        cards: [
          ui('phone-gym', 1542, 2904, 'The Gym tab on a phone, with the check-in card and upcoming classes', 'min-[901px]:col-span-4 min-[901px]:row-span-2'),
          block('checkin', 'The check-in QR card', 'min-[901px]:col-span-4'),
          text('Gym · Check-in and classes', 'Check in, then book', 'The QR is one tap from the Gym tab. Each class says book, join the waitlist or booked before the tap.', 'min-[901px]:col-span-4'),
          block('classes', 'Three classes: one to book, one full with a waitlist, one booked', 'min-[901px]:col-span-8'),
        ],
      },
      {
        label: 'Log: water and food',
        rows: 3,
        cards: [
          text('Log · Water and food', 'Water and food read the same way', 'Today against the goal comes first: a ring for water, a gauge for calories. Quick amounts and meals sit right below.', 'min-[901px]:col-span-4'),
          ui('phone-water', 1542, 2904, 'The Hydration screen with the intake ring and glass sizes', 'min-[901px]:col-span-4 min-[901px]:row-span-2'),
          ui('phone-food', 1542, 2904, 'The Food log screen with the calorie gauge, macros and meals', 'min-[901px]:col-span-4 min-[901px]:row-span-2'),
          block('hydration', 'The hydration ring with quick amounts and the glass stepper', 'min-[901px]:col-span-4'),
          block('food', 'The food log: 1,385 of 2,250 cal, macros and the meals logged today', 'min-[901px]:col-span-12'),
        ],
      },
      {
        label: 'Workouts',
        cards: [
          ui('phone-workout', 1542, 2904, 'The workout detail screen with duration, session, level and the exercise list', 'min-[901px]:col-span-5 min-[901px]:row-span-2'),
          block('plans', 'Suggested workout plans with length, session time and tags', 'min-[901px]:col-span-7 min-[901px]:row-span-2'),
        ],
      },
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
    images: [],
    // The flow: the drill-down drawers (the main feature), the finance dashboard, then staff attendance and profiles.
    sections: [
      {
        label: 'Main feature: drill-down drawers',
        rows: 3,
        cards: [
          ctext(
            'Main feature · Drill-down',
            'Group to batch, without losing your place',
            'Each level opens as a drawer over the finance dashboard. The levels behind stay as spines on the left, so the path is always in view.',
            'min-[901px]:col-span-4',
          ),
          cui(
            'laptops-drawer-finance',
            'The B.Tech drawer open over the college and group drawers, above the finance overview it opens from',
            'min-[901px]:col-span-8 min-[901px]:row-span-3',
            'deep',
            undefined,
            [2712, 3448],
          ),
          cblock('drill-path', 'Group, college, programme and batch stacked as drawers, each with its collection', 'min-[901px]:col-span-4', 'tint'),
          cblock('lowest-line', 'The lowest-collection line at group, college and programme level', 'min-[901px]:col-span-4', 'plate'),
        ],
      },
      {
        label: 'Alerts',
        rows: 'auto',
        cards: [
          ctext(
            'Alerts',
            'Each alert says what, where and who',
            'Alerts are sorted into finance and staff, and each type has its own colour. Every card carries the college, and finance alerts add the amount, the student and the owner.',
            'min-[901px]:col-span-4',
          ),
          cblock('alert-types', 'The four alert types in two groups, with what raises each one', 'min-[901px]:col-span-8', 'white'),
          cblock('finance-alerts', 'The finance alerts panel: a cancelled receipt and a fee reduction, with amount, student and owner', 'min-[901px]:col-span-6', 'tint'),
          cblock('staff-alerts', 'The staff alerts panel: an absence trend and uninformed absences', 'min-[901px]:col-span-6', 'plate'),
        ],
      },
      {
        label: 'Staff: dashboard, register and profiles',
        rows: 'auto',
        cards: [
          ctext(
            'Staff · Dashboard and register',
            "From the staff dashboard to one person's record",
            'The overview shows who is in, by college, and flags absence patterns. The register filters by status in one row of tabs, and any name opens that person’s history.',
            'min-[901px]:col-span-4',
          ),
          cui('laptop-staff', 'The staff overview: totals with trends, attendance by college, alerts and most days absent', 'min-[901px]:col-span-8', 'tint', 'fill'),
          cblock('attendance-table', 'The employee attendance register with status tabs, division, check-in and check-out times and status', 'min-[901px]:col-span-12', 'plate'),
          cblock('profile', 'An employee profile: ID, tabs, work experience and education', 'min-[901px]:col-span-12', 'tint'),
        ],
      },
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
    images: [],
    sections: [
      {
        label: 'Hosts',
        rows: 'auto',
        cards: [
          sui('hosts', 'The hosts list with each server’s IP, group, tags, status and quick actions', 'min-[901px]:col-span-8 min-[901px]:row-span-2', [1280, 832], 'fill'),
          stext('Hosts', 'All servers in one list', 'Each row shows status, tags and quick actions, so you can check a server without opening it.', 'min-[901px]:col-span-4'),
          sblock('ssh-host-card', 'A host card with its IP, live status and a Connect button', 'min-[901px]:col-span-4'),
        ],
      },
      {
        label: 'Main feature: host stats',
        rows: 'auto',
        cards: [
          sui('overview', 'The API Gateway overview with host info, system metadata and security insights', 'min-[901px]:col-span-7 min-[901px]:row-span-2', [988, 952], 'fill'),
          stext('Main feature · Host stats', 'A host opens on its stats', 'I made stats the first screen, not the terminal. Uptime, traffic and warnings show before you run anything.', 'min-[901px]:col-span-5'),
          sblock('ssh-network', 'Live download and upload rates for eth0', 'min-[901px]:col-span-5'),
        ],
      },
      {
        label: 'Terminal',
        rows: 'auto',
        cards: [sui('terminal', 'The terminal beside the Terminal Settings panel with a saved script ready to run', 'min-[901px]:col-span-12', [1280, 832], 'fill')],
      },
      {
        label: 'Main feature: terminal settings',
        rows: 'auto',
        cards: [
          stext('Main feature · Terminal settings', 'Save a script once, run it again', 'Scripts are grouped into packages. Open one to read it, then run it in one click.', 'min-[901px]:col-span-6', 'pop'),
          sblock('ssh-autocomplete', 'Autocomplete toggle, a suggested command and Ask AI', 'min-[901px]:col-span-6'),
        ],
      },
      {
        label: 'Packages, command and history',
        rows: 2,
        cards: [
          sui('packages', 'Command packages with devops-kit open', 'min-[901px]:col-span-4 min-[901px]:row-span-2', [383, 796]),
          sui('command', 'The Check Network Load script open with Copy and Run', 'min-[901px]:col-span-4 min-[901px]:row-span-2', [383, 796]),
          sui('history', 'Command history filtered by host and week', 'min-[901px]:col-span-4 min-[901px]:row-span-2', [383, 796]),
        ],
      },
      {
        label: 'SSH keys',
        rows: 2,
        cards: [
          sui('key-generate', 'Generate Key with the stepper, label, key type and passphrase', 'min-[901px]:col-span-4 min-[901px]:row-span-2', [445, 740]),
          sui('key-export', 'Exporting the key to a host, with each step ticked off', 'min-[901px]:col-span-4 min-[901px]:row-span-2', [445, 740]),
          stext('SSH keys', 'A key in four steps', 'Configure, review, export, connect. The stepper shows where you are, and export shows each step as it happens.', 'min-[901px]:col-span-4'),
          sui('key-done', 'Connection successful after the key is exported', 'min-[901px]:col-span-4', [445, 470]),
        ],
      },
      {
        label: 'Sessions',
        rows: 'auto',
        cards: [
          stext('Sessions', 'Who is signed in', 'Each session shows the user, device, location, time and key, grouped by day.', 'min-[901px]:col-span-4', 'pop'),
          sui('sessions', 'Active sessions with user, device, location, duration and key', 'min-[901px]:col-span-8', [1003, 461], 'fill'),
        ],
      },
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
