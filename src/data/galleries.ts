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

type GalleryConfig = { studyKey: string; brand: Brand; note: string; images: GalleryImage[] }

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

const zync = (file: string, height: number, alt: string, caption: string): GalleryImage => ({
  src: `/case-studies/zync/${file}`,
  width: 2400,
  height,
  alt,
  caption,
})

// Keyed by project slug (src/data/projects.ts); studyKey points at src/data/caseStudies.ts.
export const GALLERIES: Record<string, GalleryConfig> = {
  'fitness-tracker': {
    studyKey: 'zync',
    note: 'Screens are refined for this portfolio, and the figures in them are sample data. The last image shows five earlier Home layouts next to the refined one.',
    brand: {
      accent: '#644ACD',
      deep: '#3E2B94',
      soft: '#ECE8FA',
      tint: '#FFE8EE',
      pop: '#F5577D',
      mark: { src: '/brand/zync-mark.png', ratio: 170 / 188 },
    },
    images: [
      zync('01-home.jpg', 1500, 'A phone showing the Zync Home screen beside the enlarged calorie card', 'Your day, at a glance.'),
      zync('02-checkin.jpg', 1500, 'A large QR check-in card beside the Gym tab on a phone', 'Check in with one tap.'),
      zync('03-classes.jpg', 1500, 'Three class cards (available, full, booked) beside the Gym Events screen', 'Status before the tap.'),
      zync('04-log.jpg', 1500, 'The Log shortcuts, quick-add chips, water stepper, hydration ring and chart as separate cards', 'Log in two taps.'),
      zync('05-trackers.jpg', 1500, 'Sleep ring, food gauge, macros and the weekly water and sleep charts as separate cards', 'Water, sleep and food follow one pattern.'),
      zync('06-workout.jpg', 1500, 'A workout plan card beside the workout detail screen on a phone', 'Plans show level and length.'),
      zync('07-stats.jpg', 1050, 'Four daily stat tiles and a class table, each as its own component', 'Today at a glance, and the class list.'),
      zync('08-brand.jpg', 1350, 'The Zync logo on a construction grid with measurements and clear space', 'Colour and type were set before any screen.'),
      zync('09-icon.jpg', 1200, 'The Zync app icon and the colour palette', 'The app icon and palette.'),
      zync('10-layouts.jpg', 1050, 'Five earlier Home layouts next to the refined Home', 'Five Home layouts tried, then one refined.'),
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
