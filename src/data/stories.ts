// Case-study page text (title, category, summary, confirmed facts, sample-data note), shown in the gallery layout
// (src/components/GalleryCaseStudy.tsx). The sections and shots below are kept for the story images; the gallery
// layout shows the mockup boards from src/data/galleries.ts.
//
// Rules the copy follows:
// - captions describe what the screen shows; nothing here claims research, testing, a launch or a metric;
// - every name and figure in a screen is sample data, and each page says so;
// - facts (role, timeline, scope) are only the confirmed ones; a disputed fact is left out, not guessed.
//
// Images live in public/case-studies/<slug>/story/ and are exported from the design's own HTML source by
// scripts/mockups/story-render.mjs (see scripts/mockups/STORY.md). Sizes come from storySizes.ts.

import { STORY_SIZES } from './storySizes'

export type Shot = {
  src: string
  width: number
  height: number
  alt: string
  // A short live-text name shown above the image (Before, Redesigned view, Set up...).
  label?: string
  // The image's own caption, under it.
  caption?: string
  // Dark product UI: the media area keeps a dark ground.
  dark?: boolean
  // Narrow components (phones, panels) are shown at most this wide, in CSS px.
  maxWidth?: number
}

export type Demo = 'jaadu-shortlist' | 'footprint-legend'

export type StorySection = {
  id: string
  heading: string
  // The section's main caption, under its primary visual.
  caption?: string
  primary?: Shot
  // Separate complete visuals shown together: before / after, or the steps of a flow.
  set?: Shot[]
  setLayout?: 'stack' | 'row'
  // Close-ups below the primary visual, each with its own caption or label.
  details?: Shot[]
  // A caption shared by the close-ups.
  detailCaption?: string
  // Code-rendered UI shown in the section (the footprint legend, the illustrative shortlist).
  demo?: Demo
  demoAfter?: boolean
}

export type Story = {
  slug: string
  title: string
  category: string
  summary: string
  facts: [string, string][]
  disclosure: string
  // Accent for small text and controls on white; holds 4.5:1.
  accent: string
  // The project's own colours (as on the earlier bento pages): accent, deep, soft, tint and pop.
  brand: { accent: string; deep: string; soft: string; tint: string; pop: string }
  dark?: boolean
  sections: StorySection[]
  // Optional extra screens, behind a disclosure.
  more?: { heading: string; shots: Shot[] }
  // Logo and visual system, collapsed at the end.
  visualSystem?: { heading: string; shots: Shot[] }
  closing?: { heading: string; copy: string }
  related: [string, string]
}

const shot = (slug: string) => (name: string, alt: string, extra: Partial<Shot> = {}): Shot => {
  const src = `/case-studies/${slug}/story/${name}.webp`
  const size = STORY_SIZES[src.slice(1)]
  if (!size) throw new Error(`No size for ${src}; run scripts/mockups/story-sizes.py`)
  return { src, width: size[0], height: size[1], alt, ...extra }
}

const pf = shot('gym-crm')
const ce = shot('college-erp')
const jd = shot('jaadu')
const zy = shot('zync')
const ss = shot('ssh-client')

export const STORIES: Story[] = [
  {
    slug: 'gym-crm',
    title: 'Pulsefit',
    category: 'Gym management CRM',
    summary: 'A gym CRM that connects lead follow-ups, member conversion, renewals and automated emails.',
    facts: [
      ['Role', 'Sole designer (internship at Pulsefit)'],
      ['Timeline', '3 months'],
      ['Scope', 'Logo, design system, every CRM flow, and the company website built in WordPress'],
    ],
    disclosure: 'Screens are rebuilt for this portfolio. Names, contact details and figures are sample data.',
    accent: '#0058DB',
    brand: { accent: '#0063F8', deep: '#003A92', soft: '#E6F0FF', tint: '#DCCFFF', pop: '#FFB800' },
    sections: [
      {
        id: 'leads',
        heading: 'Know which leads need attention',
        primary: pf('leads', 'The Pulsefit leads dashboard: stale leads, missed follow-ups and incomplete leads above lead performance, the lead journey and team follow-up'),
        caption: 'Missed follow-ups and stale leads bring the next action into view without scanning the whole lead list.',
        details: [
          pf('leads-missed', 'The missed follow-ups card: four leads, each with how many days overdue and a Follow up button', { label: 'Missed follow-ups', maxWidth: 488 }),
          pf('leads-stale', 'The stale leads card: four leads, each with days since the last activity and a Follow up button', { label: 'Stale leads', maxWidth: 488 }),
        ],
        detailCaption: 'Follow-up status sits beside the lead, so the owner can act from the same screen.',
      },
      {
        id: 'convert',
        heading: 'Carry lead details into membership',
        primary: pf('convert', 'The Convert to member form open over the leads table, with member details marked From lead and the plan and bill below'),
        caption: 'Five of the six fields are prefilled from the lead record. Imported values stay visible and editable before conversion.',
        details: [
          pf('convert-fields', 'Member details: first name, last name, email, phone and goal each marked From lead; Assign trainer is chosen by hand', { label: 'Imported fields' }),
          pf('convert-bill', 'The bill: monthly plan, waived joining fee, 10% discount and GST, Due today ₹2,124, and the Convert and bill ₹2,124 button', { label: 'Bill and final action' }),
        ],
        detailCaption: 'The bill updates with the selected plan, and the final action shows the amount before confirmation.',
      },
      {
        id: 'renewals',
        heading: 'Make renewal work explicit',
        primary: pf('members', 'The members dashboard: active members, renewal rate, pending payments and frozen members above the expiring this week table, attendance drops and frozen lists'),
        caption: 'Renew, Remind and Unfreeze name the next task instead of using the same generic action for every member.',
        details: [
          pf('members-expiring', 'The expiring this week table: member, plan, expiry, trainer, and Remind and Renew for each member', { label: 'Expiring this week' }),
          pf('plans-cards', 'Two plan cards, Monthly and PT Starter, each with category, price, GST, extension and pause', { label: 'Plan cards', caption: 'Plan cards keep category, duration and price together when choosing a membership.', maxWidth: 728 }),
        ],
      },
      {
        id: 'emails',
        heading: 'Make automated emails understandable',
        primary: pf('email', 'The automated emails screen: rules grouped under Leads, Members and Subscriptions, each with its trigger, an on/off switch and send figures'),
        caption: 'Subscription email rules are grouped around the membership event they respond to.',
        details: [pf('email-subscriptions', 'The subscriptions group: renewal reminder, plan changed and payment receipt, each with its trigger', { label: 'Subscription email rules' })],
      },
    ],
    visualSystem: {
      heading: 'Visual system',
      shots: [{ src: '/case-studies/gym-crm/01-logo.jpg', width: 2400, height: 1590, alt: 'The Pulsefit mark on a construction grid, and the logo lockup with its clear space', label: 'Logo construction' }],
    },
    closing: {
      heading: 'What the screens show',
      copy: 'The strongest part of this flow is the connection between a lead record, membership details and the next task.',
    },
    related: ['college-erp', 'zync'],
  },
  {
    slug: 'college-erp',
    title: 'College group ERP',
    category: 'Finance, staff and settlements',
    summary: 'An ERP redesign that keeps group-level totals and institution-level details connected.',
    facts: [
      ['Role', 'Sole designer (internship)'],
      ['Timeline', '3 months'],
      ['Scope', 'Redesigned the finance, staff and settlements screens of an existing ERP'],
    ],
    disclosure: 'Screens are rebuilt for this portfolio. Names and figures are sample data.',
    accent: '#1D4ED8',
    brand: { accent: '#12326E', deep: '#08153A', soft: '#E6EDF9', tint: '#D5DDED', pop: '#4F86E8' },
    sections: [
      {
        id: 'summary',
        heading: 'From a wide sheet to a clear summary',
        set: [
          ce('before-finance', 'The earlier finance stats page for one college: totals without a target, and a list of programmes', { label: 'Before' }),
          ce('before-sheet', 'The earlier group finance totals: a 28-column spreadsheet of fee heads by course, year and department', { label: 'Before' }),
          ce('dashboard', 'The redesigned group finance dashboard: consolidated finances against the target, collection progress, alerts, collection by college and college-wise finances', { label: 'Redesigned view' }),
        ],
        setLayout: 'stack',
        caption: 'The earlier view spread finance information across a wide sheet. The redesigned summary brings target, collected and pending amounts together.',
        details: [ce('summary', 'The consolidated finances banner: received, percent collected against the target, pending, expected and fines collected', { label: 'Target, collected and pending' })],
      },
      {
        id: 'hierarchy',
        heading: 'Go deeper without losing the group view',
        primary: ce('stack', 'The group dashboard with the Vertex Law College drawer and the BA LLB programme drawer stacked on top'),
        caption: 'The hierarchy runs from group to college, programme and batch. Stacked drawers keep the parent view available while opening a smaller scope.',
        details: [
          ce('drawer-college', 'The college drawer for Vertex Law College: its totals, lowest collection line, and programmes table', { label: 'College drawer' }),
          ce('drawer-programme', 'The programme drawer for BA LLB: its totals, lowest collection line, and batches table', { label: 'Programme drawer' }),
        ],
        detailCaption: 'Each drawer names the level being viewed, so a batch total is not mistaken for the group total.',
      },
      {
        id: 'staff',
        heading: 'Find the staff view that matters',
        set: [
          ce('before-staff', 'The earlier staff list: one long table with present, absent and on-leave counts', { label: 'Before' }),
          ce('attendance', 'The redesigned attendance screen: status tabs with counts, search, and filters for college, department and division', { label: 'Redesigned view' }),
        ],
        setLayout: 'stack',
        caption: 'Status tabs and filters make attendance easier to inspect without treating every staff record as the same task.',
      },
      {
        id: 'settlements',
        heading: 'Separate settlement states',
        set: [
          ce('before-settlements', 'The earlier settlements page: three totals above one long list of settlements', { label: 'Before' }),
          ce('settlements', 'The redesigned settlements screen: totals, tabs for pending, settled, late and refunded, search, and a late settlement highlighted', { label: 'Redesigned view' }),
        ],
        setLayout: 'stack',
        caption: 'Tabs and search give the settlements list a clearer route into the records that need attention.',
      },
    ],
    closing: {
      heading: 'What changed in the presentation',
      copy: 'The before-and-after views show the shift in hierarchy.',
    },
    related: ['gym-crm', 'jaadu'],
  },
  {
    slug: 'jaadu',
    title: 'Jaadu 2.0',
    category: 'Trading terminal and strategy tools',
    summary: 'A trading workspace that connects market context, conditional alerts and strategy exploration.',
    facts: [
      ['Role', 'Sole designer (freelance, Alzyon Tech Solutions)'],
      ['Timeline', '2 months'],
      ['Scope', 'Terminal, alerts, journal, AI chat, Quant Lab, design system, desktop, laptop and mobile layouts, marketing website and motion graphics'],
    ],
    disclosure: 'Screens use sample market and strategy data. The figures are illustrative, not investment recommendations or verified trading performance.',
    accent: '#2652CC',
    brand: { accent: '#2653CF', deep: '#00022B', soft: '#E8EEFF', tint: '#CFDDFF', pop: '#5985FF' },
    dark: true,
    sections: [
      {
        id: 'terminal',
        heading: 'Keep market context in one workspace',
        primary: jd('terminal', 'The Jaadu trading terminal: the ETHUSDC chart with drawing tools, the ETH market panel, the market mood gauge, the watchlist and live trades', { dark: true }),
        caption: 'The chart, watchlist, market mood and live-trade information share one workspace.',
        details: [
          jd('terminal-watchlist', 'The watchlist: BTC, DAI, CRED and DASH with price and change', { label: 'Watchlist', dark: true, maxWidth: 540 }),
          jd('terminal-mood', 'The market mood gauge: the current regime with its score and the other regimes below', { label: 'Market mood', dark: true, maxWidth: 540 }),
        ],
      },
      {
        id: 'footprint',
        heading: 'Read activity inside each candle',
        primary: jd('footprint', 'A footprint chart of seven 15-minute candles: each price bin shows volume sold and bought, coloured by which side won, with the time axis below and the price axis on the right', { dark: true }),
        caption: 'The footprint view shows buying and selling activity at each price level. Time, price and the volume legend give the cells context.',
        demo: 'footprint-legend',
        demoAfter: true,
      },
      {
        id: 'alerts',
        heading: 'Make alert conditions inspectable',
        primary: jd('alerts', 'The alerts screen: active alerts with their tools, conditions, status, trigger, expiry and notification settings', { dark: true }),
        caption: 'The alert rule keeps its conditions visible before it is created, so the trigger can be checked rather than hidden behind a label.',
        details: [jd('alerts-rule', 'An ETH/USDC alert opened to its three conditions on price, POC and footprint, each with its status', { label: 'Three-condition rule', dark: true })],
      },
      {
        id: 'quant-lab',
        heading: 'Turn an idea into a strategy to inspect',
        primary: jd('build', 'Quant Lab Build: a typed strategy idea, the compiled strategy tags and the strategy definition card with entry, exits, sizing and regime scope', { dark: true }),
        caption: 'Quant Lab connects a written idea to a strategy card that can be inspected before comparison.',
        details: [jd('build-card', 'The typed idea and the resulting strategy definition card', { label: 'Typed idea and strategy card', dark: true })],
      },
      {
        id: 'overnight',
        heading: 'Show the overnight search as a sequence',
        set: [
          jd('overnight-setup', 'Overnight Discoveries set-up: choose coins and a timeframe, then start discovery', { label: 'Set up', dark: true }),
          jd('overnight-running', 'Overnight Discoveries running: the campaign with the number of candidates generated so far', { label: 'Running', dark: true }),
          jd('overnight-results', 'The morning results: last night’s candidates and survivors, the falsification funnel and discoveries per night', { label: 'Morning shortlist', dark: true }),
        ],
        setLayout: 'stack',
        caption: 'Setup, progress and the morning shortlist show what happens before and after an overnight search.',
        demo: 'jaadu-shortlist',
        demoAfter: true,
      },
    ],
    more: {
      heading: 'More screens',
      shots: [
        jd('compare', 'The strategy library comparison table, equity curves and parameter differences', { label: 'Strategy comparison', dark: true }),
        jd('deja', 'Déjà Vu: a structured query, past matches with similarity scores, the current setup against a historical match, and what happened next', { label: 'Déjà Vu', dark: true }),
      ],
    },
    related: ['college-erp', 'ssh-client'],
  },
  {
    slug: 'zync',
    title: 'Zync',
    category: 'Fitness tracking app',
    summary: 'A fitness app that brings daily tracking, gym check-in, classes and workouts into one place.',
    facts: [
      ['Role', 'Sole designer (internship at Pulsefit)'],
      ['Timeline', '2 months, Feb–Mar 2025'],
      ['Scope', 'Visual system, logo, every screen, and the calorie and health tracking I proposed'],
      ['Team', 'Two Pulsefit founders (PRD and walkthrough). No developers during the design work.'],
      ['Handoff', 'Design delivered to the founders. Development began after handoff.'],
    ],
    disclosure: 'Screens are refined for this portfolio. Health and activity figures are sample data.',
    accent: '#5B3FC4',
    brand: { accent: '#644ACD', deep: '#3E2B94', soft: '#ECE8FA', tint: '#FFE8EE', pop: '#F5577D' },
    sections: [
      {
        id: 'home',
        heading: 'Start with the day’s activity',
        primary: zy('home', 'The Zync Home screen: today’s calories burned against the goal by activity, steps, BMI and the next class', { maxWidth: 440 }),
        caption: 'The daily overview separates calories burned from calories consumed before showing the next tracking action.',
        details: [
          zy('home-burned', 'The calories card on Burned: 900 of 1,200 cal, split by swimming, walking, badminton and yoga', { label: 'Burned', maxWidth: 400 }),
          zy('home-consumed', 'The calories card on Consumed: 1,385 of 2,250 cal, split by carbs, fat, protein and fibre', { label: 'Consumed', maxWidth: 400 }),
        ],
      },
      {
        id: 'log',
        heading: 'Log food, water and sleep',
        set: [
          zy('food', 'The food log: calories against the daily goal, nutrient bars and today’s meals', { label: 'Food', maxWidth: 330 }),
          zy('water', 'Hydration: glasses today against the goal, the week’s chart and the daily goal setting', { label: 'Water', maxWidth: 330 }),
          zy('sleep', 'Sleep: hours last night against the goal and the week’s chart', { label: 'Sleep', maxWidth: 330 }),
        ],
        setLayout: 'row',
        caption: 'Food, water and sleep use a shared logging pattern while keeping their units and daily totals visible.',
        details: [zy('food-nutrients', 'Nutrient bars: protein 35 / 112 g at 31%, carbs 239 / 281 g at 85%, fat 35 / 75 g at 47%, fibre 26 / 30 g at 87%', { label: 'Nutrient totals', maxWidth: 420 })],
        detailCaption: 'Nutrient totals and progress bars should show the same proportion.',
      },
      {
        id: 'classes',
        heading: 'Make class availability clear',
        set: [
          zy('class-open', 'An open class, Kick Box at 12:30 PM, 10 spots left, with a Book button', { label: 'Book', maxWidth: 420 }),
          zy('class-full', 'A full class, BodyPump at 2:30 PM, full with 4 waiting, with a Join waitlist button', { label: 'Join waitlist', maxWidth: 420 }),
          zy('class-booked', 'A booked class, TRX Training at 6:00 PM, 4 spots left, marked Booked', { label: 'Booked', maxWidth: 420 }),
        ],
        setLayout: 'stack',
        caption: 'Open, full and booked classes use different actions, so availability is clear before the next tap.',
        details: [zy('checkin', 'The gym activity screen: visits this month beside the Check in now QR card, and upcoming classes', { label: 'Check-in', caption: 'The check-in screen keeps the QR code as the main action.', maxWidth: 360 })],
      },
      {
        id: 'workout',
        heading: 'Move from a plan into a workout',
        primary: zy('workout', 'A workout plan: duration, session length and level, its category, the exercise list and Start workout', { maxWidth: 440 }),
        caption: 'The plan connects its summary to an exercise list and a clear start action.',
        details: [zy('workout-list', 'The exercise list with four stretches of 30 seconds each, and the Start workout button', { label: 'Exercise list and Start workout', maxWidth: 420 })],
      },
    ],
    related: ['gym-crm', 'jaadu'],
  },
  {
    slug: 'ssh-client',
    title: 'SSH Client',
    category: 'Developer tools',
    summary: 'An SSH client that shows a server’s health before you connect.',
    facts: [
      ['Role', 'Sole designer (internship)'],
      ['Timeline', '3 months'],
      ['Scope', 'The entire UI, designed from scratch, for desktop, laptop and mobile'],
    ],
    disclosure: 'Screens are rebuilt for this portfolio. Host names, addresses and metrics are sample data.',
    accent: '#6D3FE0',
    brand: { accent: '#7C5CFF', deep: '#2B1C70', soft: '#F1EDFF', tint: '#E6DEFF', pop: '#3B82F6' },
    dark: true,
    sections: [
      {
        id: 'hosts',
        heading: 'Choose a host before connecting',
        primary: ss('hosts', 'The hosts screen: host cards with name, address, status and Connect, and the New Host panel open on the right', { dark: true }),
        caption: 'Host cards and the add-host form keep the connection target visible before opening a session.',
        details: [ss('new-host', 'The New Host panel: host address, label, SSH port, tags, group and vault, with Cancel and Connect', { label: 'New Host panel', dark: true, maxWidth: 420 })],
      },
      {
        id: 'health',
        heading: 'Inspect health and security',
        primary: ss('overview', 'The API Gateway host overview: host info, system metadata and security insights', { dark: true }),
        caption: 'Health and security information sit beside the selected host, so connection context is available before entering the terminal.',
        details: [
          ss('network', 'The network card: IP and MAC address, total received and sent, and download and upload rates', { label: 'Network', dark: true }),
          ss('security', 'Security insights: key-based login, firewall, a disk space warning, package updates and the last login', { label: 'Security insights', dark: true }),
        ],
      },
      {
        id: 'keys',
        heading: 'Make the key flow visible',
        set: [
          ss('key-select', 'Select host: a searchable grid of hosts with DB-master selected', { label: 'Host selection', dark: true }),
          ss('key-export', 'Export key: the target host, export location, filename and the export script', { label: 'Key export', dark: true }),
          ss('key-done', 'Connection successful: the key is on DB-master, with each completed step listed', { label: 'Connection success', dark: true }),
        ],
        setLayout: 'row',
        caption: 'The key flow shows host selection, key export and connection feedback as separate steps.',
      },
      {
        id: 'terminal',
        heading: 'Keep help near the command',
        primary: ss('terminal', 'The terminal for API Gateway with the terminal settings panel: autocomplete, saved command packages and Ask AI', { dark: true }),
        caption: 'Saved commands and the AI panel stay close to the terminal instead of becoming a separate workspace.',
        details: [
          ss('saved-command', 'A saved command, Check Network Load, with its script and a Run button', { label: 'Saved command', dark: true, maxWidth: 400 }),
          ss('ask-ai', 'The Ask AI panel answering how to find .txt files with two find commands', { label: 'Ask AI panel', dark: true, maxWidth: 400 }),
        ],
      },
    ],
    more: {
      heading: 'More screens',
      shots: [ss('sessions', 'The active sessions screen: open sessions grouped by day with device, location and key', { label: 'Session history', dark: true })],
    },
    visualSystem: {
      heading: 'Visual system',
      shots: [{ src: '/case-studies/ssh-client/v3-01-logo.jpg', width: 2400, height: 1470, alt: 'The SSH client mark on a construction grid, and its clear space', label: 'Logo construction', dark: true }],
    },
    related: ['college-erp', 'jaadu'],
  },
]

export const storyBySlug = (slug: string) => STORIES.find((s) => s.slug === slug)
