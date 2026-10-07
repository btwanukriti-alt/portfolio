// Case study content for the five projects: the short format (info line, two paragraphs, 8-12
// visuals with captions). Not wired into the site yet; the next step is the visuals, then a
// page that reads this file.
//
// Rules the copy follows (see .claude/skills/case-study-editor/SKILL.md):
// - nothing here claims a launch, a user count, a metric or a quote;
// - every number shown in a visual is sample data from the design, not a result;
// - `confirm` lists facts still to be checked before a page goes live;
// - `fixBeforePublishing` lists problems in the source files that a reader would notice.

export type VisualStatus = 'ready' | 'export' | 'make' | 'missing'

export type Visual = {
  n: number
  what: string
  // Where it comes from: Figma file key + node id, a published slide, or "make".
  source: string
  caption: string
  status: VisualStatus
}

export type CaseStudy = {
  key: string
  // Public title. Null where the name is withheld (NDA).
  title: string | null
  nda?: boolean
  hook: string
  label: 'Internship' | 'Freelance' | 'Concept'
  company: string | null
  dates: string | null
  timeline: string
  role: string
  team: string
  outcome: string
  paragraphs: [string, string]
  standout: string
  delivered: string[]
  next: string[]
  visuals: Visual[]
  homeCard: string
  confirm: string[]
  fixBeforePublishing: string[]
}

const PORTFOLIO = 'YN66oKLDCT31APRGoynI72'
const JAADU = 'Hc75tMn9m8J1WDN1fHPiVd'

export const CASE_STUDIES: CaseStudy[] = [
  {
    key: 'zync',
    title: 'Zync',
    hook: 'A visual system and every screen of a gym member app, built in two months.',
    label: 'Internship',
    company: 'Pulsefit',
    dates: 'Feb-Mar 2025',
    timeline: '2 months',
    role: 'Sole designer. Visual system, logo, every screen, and the calorie and health tracking I proposed.',
    team: 'Two Pulsefit founders (PRD and walkthrough). No developers during the design work.',
    outcome: 'Design delivered to the founders. Development began after handoff.',
    paragraphs: [
      "Pulsefit sells software that runs a gym. The founders needed a member app to go with it, with check-in, classes and workout plans. They had a PRD, no brand and no screens. I was the only designer. I built the colour and type system and the logo, designed every screen, and added health tracking (calories, water, sleep, food) so a member needs one app, not two.",
      "Every screen reuses one component set. Home fits eight metrics on one scroll, with the gym's QR in the header, and I tried five layouts to get there. Water, Sleep, Calories and Food follow one pattern, a ring for today and a chart for the week. Class and workout cards show their status at a glance.",
    ],
    standout: 'A ring for today, a chart for the week.',
    delivered: [
      'Colour system, type system, logo',
      'Sign-up and profile',
      'Home',
      'Gym tab (Activity, Events)',
      'Workout plans (curated, create, details)',
      'Tracking (calories, water, sleep, food)',
    ],
    next: [
      'Calories per exercise from sets and reps (the founders own the formula)',
      'An Indian-diet food list with add-your-own (not designed yet)',
      'Measure QR check-in rate, class-booking fill rate, members logging food 3+ days a week',
    ],
    visuals: [
      { n: 1, what: 'Hero: existing Zync showcase video', source: 'public/showcase/fitness-tracker.html', caption: 'Zync, the member side of Pulsefit', status: 'ready' },
      { n: 2, what: 'System board: colour, type, logo', source: `make (Figma ${PORTFOLIO})`, caption: 'Colour and type were set before any screen', status: 'make' },
      { n: 3, what: 'Steps, BMI and calorie ring across five screens', source: `Figma ${PORTFOLIO}, section "Zync" 393:169642`, caption: 'One component set runs through the app', status: 'export' },
      { n: 4, what: 'Five Home layouts, final highlighted', source: 'Final: public/case-studies/fitness-tracker/slide-01.jpg. Earlier: Homepage frames 393:169995, 393:170150, 393:170290, 393:170361, 393:170384', caption: 'Five Home layouts tried; one scroll holds eight metrics', status: 'export' },
      { n: 5, what: 'Final Home, annotated (QR in header, branch selector, calorie toggle)', source: 'public/case-studies/fitness-tracker/slide-01.jpg', caption: "Gym access on top, the member's day below", status: 'ready' },
      { n: 6, what: 'Water, Sleep, Calories and Food side by side', source: 'slides 02-05 of fitness-tracker', caption: 'Four trackers, one pattern', status: 'ready' },
      { n: 7, what: 'Events: Available and Reserved cards', source: `Figma ${PORTFOLIO} 393:170416, 393:170669`, caption: "A class's status shows before the member taps", status: 'export' },
      { n: 8, what: 'Gym tab, Activity: Check-In Now and upcoming classes', source: `Figma ${PORTFOLIO} 393:170416`, caption: 'Check-in and the day\'s classes in one place', status: 'export' },
      { n: 9, what: 'Workout plans list and plan details', source: 'slides 06-07 of fitness-tracker', caption: 'Level and length on every card', status: 'ready' },
    ],
    homeCard:
      "Zync is the member app for Pulsefit's gym software. I designed its visual system and every screen, and proposed the tracking that keeps a member's gym and health in one place.",
    confirm: [
      'About timeline lists Pulsefit as 2024; this project is Feb-Mar 2025',
      'Whether the Gym tab, Events and Workout screens in the file are all final',
    ],
    fixBeforePublishing: [
      'Water and Sleep chart bars are all labelled 13/02',
      'User is Steve in some frames and Sandra in others',
      'Gym tab Monthly check-in count reads 0',
      'Date strip highlights the 21st but cards say Feb 26',
      'Slide counter reads 1/7 on every slide',
      'Mock data dates read June 2023 in slides and Feb 2025 in Figma',
      'Published slides leave out the Gym tab and Events screens',
    ],
  },
  {
    key: 'pulsefit-crm',
    title: 'Pulsefit CRM',
    hook: 'A gym-management platform where every alert carries its own fix.',
    label: 'Internship',
    company: 'Pulsefit',
    dates: null,
    timeline: '3 months',
    role: 'Sole designer. Logo, design system, every CRM flow, and the company website built in WordPress.',
    team: 'Sole designer. Who defined the feature scope is to be confirmed.',
    outcome: 'Design delivered.',
    paragraphs: [
      'Pulsefit is gym-management software that puts leads, members, tasks, plans, staff, equipment and email in one place. I was the only designer and started it from zero: the Pulsefit logo, the design system, then two dozen flows, including a task dashboard with list, create and view screens. I also designed the Pulsefit website and built it in WordPress.',
      'Each dashboard opens on what needs action: stale leads, missed follow-ups, expiring subscriptions, attendance drops. Each row carries its own button (Follow-up, Renew, Unfreeze). Lists share one table pattern, and forms are short steppers, so the same patterns run through every module.',
    ],
    standout: 'Every alert row ends in its fix.',
    delivered: [
      'Logo and design system',
      'Leads (dashboard, follow-ups, table)',
      'Members (dashboard, list, add member)',
      'Tasks (dashboard, list, create, view)',
      'Plans, staff, equipment and repairs',
      'Workout builder',
      'Email campaigns',
      'Company website in WordPress',
    ],
    next: [
      'Time from a missed follow-up to the follow-up',
      'Share of leads with a complete profile',
      'Renewal rate on expiring subscriptions',
    ],
    visuals: [
      { n: 1, what: 'Hero: existing CRM showcase video', source: 'public/showcase/bosch-customer-experience.html', caption: 'The Pulsefit CRM', status: 'ready' },
      { n: 2, what: 'Flow map (24 labelled flows)', source: `Figma ${PORTFOLIO} 406:43188`, caption: '24 flows from sign-up to email, one product', status: 'export' },
      { n: 3, what: 'Design system board', source: `make; components in Figma ${PORTFOLIO} 474:245983 ("SAAS Dashboard Components")`, caption: 'Logo and system first; every module draws from it', status: 'make' },
      { n: 4, what: 'Lead Dashboard, full frame', source: `Figma ${PORTFOLIO} 406:43188 (Lead Dashboard); slide-01 is cropped`, caption: 'Three alert columns open the day, each row with Follow-up', status: 'export' },
      { n: 5, what: 'Members Dashboard, full frame', source: `Figma ${PORTFOLIO} 474:268097, 406:43188`, caption: 'Renew, Follow Up and Unfreeze sit on the row', status: 'export' },
      { n: 6, what: 'Lead, Staff and Equipment tables side by side', source: 'slides 03, 07, 08 of bosch-customer-experience', caption: 'One table pattern across modules', status: 'ready' },
      { n: 7, what: 'Lead Form and Add Member steppers', source: 'slides 02, 04 of bosch-customer-experience', caption: 'Source and objective carry from lead to member', status: 'ready' },
      { n: 8, what: 'Plan Table', source: 'slide 06 of bosch-customer-experience; Plan List 474:265444', caption: 'Duration, price, taxes and pause days on every plan', status: 'ready' },
      { n: 9, what: 'Workout Form', source: 'slide 09 of bosch-customer-experience', caption: 'Pick a day, add an exercise, add a set', status: 'ready' },
      { n: 10, what: 'Communication / Email campaigns (label as sample data)', source: 'slide 10 of bosch-customer-experience; Email frames 474:267363', caption: 'Campaigns grouped by lifecycle stage (sample data)', status: 'ready' },
      { n: 11, what: 'Website homepage, both versions side by side', source: `Figma ${PORTFOLIO} 474:245984, 474:248818`, caption: 'Two versions of the Pulsefit homepage, built in WordPress', status: 'export' },
      { n: 12, what: 'Task Dashboard, List, Create and View', source: `Figma ${PORTFOLIO} 474:251633, 474:253876, 474:254669, 474:255122`, caption: "One place for a gym team's follow-ups", status: 'export' },
    ],
    homeCard:
      "Pulsefit's gym-management platform, designed from logo to every module, plus the company website. Each dashboard alert carries its own fix.",
    confirm: [
      'Real months for this internship (mock data reads Sep-Oct 2024; site says 2024)',
      'Who defined the feature scope',
      'Whether the 24-flow count is right',
      'Whether the website is the same site as the deployed one',
      'One public name: Pulsefit CRM, Gym Management CRM or bosch-customer-experience',
    ],
    fixBeforePublishing: [
      'Website brand reads "Fit Flow" in the nav and footer, Pulsefit in the body',
      '"More than 250 users use Pulsefit" reads as a result; remove or source it',
      'Testimonial cards ("Founder, PowerCore Fitness", "Founder, Gymfit") look like placeholders; label or replace',
      'Label all numbers (34% conversion, 51% open rate, +21%) as sample data',
      'The "Dashboard" row in the flow map has no frames next to it',
      'Lead Dashboard slide crops its charts; export the full frame',
    ],
  },
  {
    key: 'ssh-client',
    title: null,
    nda: true,
    hook: "An SSH client that shows a server's health before you connect.",
    label: 'Internship',
    company: null,
    dates: null,
    timeline: '3 months',
    role: 'Sole designer. The entire UI, designed from scratch, for desktop, laptop and mobile.',
    team: 'Sole designer.',
    outcome: 'Design delivered.',
    paragraphs: [
      'A multi-platform SSH client for managing servers, with hosts, keys, files, saved commands and sessions in one app. I designed the entire UI from scratch.',
      'A host opens on its stats, not on a terminal: CPU by hour and per core, memory, storage, network, running processes, and security checks marked INFO or WARN. Keys, files, saved commands, port mapping and sessions share one dark interface of short step-by-step dialogs. An AI helper sits beside the terminal.',
    ],
    standout: 'A host opens on its health, not a terminal.',
    delivered: [
      'Login and sign-up',
      'Hosts and vaults',
      'Host stats',
      'Terminal with command packages and AI helper',
      'SSH key manager',
      'SFTP',
      'Port mapping',
      'Trusted servers',
      'Sessions',
      'Settings and team invite',
    ],
    next: [
      'Time from opening a host to knowing its state',
      'Saved commands run per week',
      'How often the AI helper is used',
    ],
    visuals: [
      { n: 1, what: 'Hero: existing showcase video', source: 'public/showcase/ (rename file; it carries the project name)', caption: "A host's health, files and terminal in one app", status: 'ready' },
      { n: 2, what: 'Flow map, 12 sections', source: `Figma ${PORTFOLIO} 400:3561 (delete stray "CLihub Framer" frames elsewhere first)`, caption: 'Twelve sections, one UI, designed from scratch', status: 'export' },
      { n: 3, what: 'Hosts grid and vault switcher', source: 'slide 01 of the project folder', caption: 'Live status and quick actions on every host card', status: 'ready' },
      { n: 4, what: 'Host Overview with Security Insights', source: 'slide 05', caption: 'A host opens on its stats, not a terminal', status: 'ready' },
      { n: 5, what: 'Performance and Activity side by side', source: 'slides 06, 07', caption: "CPU by hour and per core, plus what's running right now", status: 'ready' },
      { n: 6, what: 'Add Host, four tabs', source: 'slide 03', caption: 'Power-user options stay in Advanced', status: 'ready' },
      { n: 7, what: 'Terminal with command packages and Ask AI', source: 'slides 09, 10, 11', caption: 'Saved commands and an AI helper beside the terminal', status: 'ready' },
      { n: 8, what: 'Key generate and export, plus hardware key', source: 'slides 13, 14', caption: 'Four steps for every key, hardware keys included', status: 'ready' },
      { n: 9, what: 'SFTP with Quick Connect', source: 'slide 15', caption: 'Local and remote files side by side', status: 'ready' },
      { n: 10, what: 'Active Sessions and Trusted Servers', source: 'slides 16, 17', caption: "Who is connected, and which hosts are approved", status: 'ready' },
    ],
    homeCard:
      'A multi-platform SSH client, designed from scratch under NDA. A host opens on its health before the terminal.',
    confirm: [
      'Company name, or write "under NDA"',
      'Dates (mock data reads Sep-Oct 2025; About lists Gamalabs 2025: is this that internship?)',
      'Permission under the NDA to show these screens',
      'Where the password manager screens are, if they exist',
      'Whether mobile and laptop frames exist (only desktop frames seen)',
    ],
    fixBeforePublishing: [
      'The project name is public on the site: work card, page title, URL, About text and the showcase file. Rename everywhere.',
      'Do not name any competitor in copy.',
      'Slide counters are stale (2/18, 3/18, 4/18, 6/18 ... two "11/18")',
      'Slide 3, the Hosts empty state, is blank; export the real screen',
      'Four stray frames named after the project sit inside the College file',
    ],
  },
  {
    key: 'college-erp',
    title: 'College group ERP',
    hook: 'A finance view where a college group finds its weakest college by scanning one column.',
    label: 'Internship',
    company: null,
    dates: null,
    timeline: '3 months',
    role: 'Sole designer. Redesigned the finance, staff and settlements screens of an existing ERP.',
    team: 'Sole designer [confirm].',
    outcome: 'Design delivered [confirm].',
    paragraphs: [
      'A college group runs several colleges on an ERP whose finance screens were flat totals with no target and no comparison, and whose head-wise report stopped at a 28-column spreadsheet. I had the earlier version to work from, and redesigned its finance, staff and settlements screens.',
      'Total received now sits on a bar against expected, and a collection % column runs down every table, so the weakest college is found by scanning one column. A four-level drill-down (group, college, programme, batch) keeps the same columns at every level, and a banner names the lowest-collecting programme and its gap to target.',
    ],
    standout: 'Every level has the same columns, with the weakest collection always in view.',
    delivered: [
      'Navigation rail',
      'Revenue overview',
      'Four-level drill-down (two orders explored)',
      'Lowest-collection banner',
      'Staff attendance and employee profiles',
      'Transactions and settlements',
    ],
    next: [
      'Time to find the weakest college',
      'How often finance staff drill past college level',
      'Whether the banner changes what they open first',
    ],
    visuals: [
      { n: 1, what: 'Hero: existing showcase video', source: 'public/showcase/college-management.html', caption: 'One dashboard for a college group', status: 'ready' },
      { n: 2, what: 'Flow map, four sections', source: `Figma ${PORTFOLIO} 410:40434`, caption: 'Finance, Staff and Settlements from one file', status: 'export' },
      { n: 3, what: 'Before and after: grey total tiles to target bar with collection %', source: 'before: slide 03 (existing system); after: slide 02 of college-management', caption: 'Totals now sit against a target', status: 'ready' },
      { n: 4, what: 'Before and after: banking page with no navigation to one navigation rail', source: 'before: slide 01; after: slide 02', caption: 'Finance, Staff, Banking and Reports in one rail', status: 'ready' },
      { n: 5, what: 'Drill-down, group to batch (Drawer_College frames)', source: `Figma ${PORTFOLIO} 410:40434; slide 04`, caption: 'Four levels, same columns, path pinned on the left', status: 'export' },
      { n: 6, what: 'Both drill-down orders side by side', source: `Figma ${PORTFOLIO} 410:40434 (Batch-first and Department-first sections)`, caption: 'Same data, two orders; [final one] kept', status: 'export' },
      { n: 7, what: 'Lowest-collection banner', source: 'solution slide 04', caption: 'The weakest programme is named, with its gap to target', status: 'ready' },
      { n: 8, what: 'Before and after: one long staff table to Attendance overview and list', source: `before: slide 09; after: Attendance 410:47642, 410:48966`, caption: 'Staff attendance with filters and status, where there were none', status: 'export' },
      { n: 9, what: 'Before and after: flat settlements list to Transactions & Settlements', source: 'before: slide 05; after: Transactions & Settlements frames in 410:40434', caption: 'A late settlement no longer looks like the rest', status: 'export' },
    ],
    homeCard:
      'A finance, staff and settlements redesign for a college-group ERP. Every level shares the same columns, so the weakest collection is always in view.',
    confirm: [
      'Company, dates, role and status',
      'Which drill-down order is final',
      'Whether the "before" screens may be shown (they read "Powered by NEXUS")',
      'Whether the work was built on a dashboard UI kit (many layer names look like kit components)',
    ],
    fixBeforePublishing: [
      'Only 4 of the 8 solution slides exist (counters read 1/8 to 4/8)',
      'Label the "before" screens as the existing system',
      'Names conflict: College Management, Dhondi, Vertex, CMR logo on the rail',
      'Label figures (94.30 Cr, 91.4%) as sample data',
      'Site problem line promises role-based access; no such screen seen',
      'Mock report reads "Generated 12/01/2026"; confirm the real months',
    ],
  },
  {
    key: 'jaadu-2',
    title: 'Jaadu 2.0',
    hook: "A trading terminal that reads the market's regime, and a Quant Lab that turns a night of strategy search into a shortlist.",
    label: 'Freelance',
    company: 'Alzyon Tech Solutions',
    dates: null,
    timeline: '2 months',
    role: 'Sole designer. Terminal, alerts, journal, AI chat, Quant Lab, design system, desktop, laptop and mobile layouts, marketing website and motion graphics.',
    team: 'Sole designer.',
    outcome: 'Design delivered [confirm].',
    paragraphs: [
      "Jaadu 2.0 is a trading analytics platform. It doesn't place trades. It reads the market and suggests strategies. I was the only designer. I designed the terminal, alerts, trading journal, AI chat and Quant Lab, plus the design system, the desktop, laptop and mobile layouts, and the marketing website with its motion graphics.",
      'The terminal shows the market\'s regime as one bar under the chart, and a footprint view that splits each candle into price cells. Alerts can fire on price, footprint or POC. Quant Lab is one research workspace with Overnight Discoveries, Library, Paper Trade and Deja Vu. A chart prompt lets a trader ask about a single point on the chart, and it floats on desktop and docks on mobile.',
    ],
    standout: 'Quant Lab: you set it up, it works overnight, you wake up to a shortlist.',
    delivered: [
      'Trading terminal (OHLC, footprint, indicators, regime, watchlist, trades)',
      'Footprint settings',
      'Alerts (price, footprint, POC, multi-condition)',
      'Trading journal and AI chat',
      'Quant Lab (Research, Build, Overnight Discoveries, Library, Paper Trade, Deja Vu)',
      'Chart prompt across desktop, tablet and mobile',
      'Design system',
      'Marketing website and motion graphics (files to add)',
    ],
    next: [
      'Alerts created per active trader',
      'Share of alerts using footprint or POC',
      'Strategies moved from Overnight Discoveries to paper trading',
      'Chart prompts per session',
    ],
    visuals: [
      { n: 1, what: 'Hero: existing showcase video', source: 'public/showcase/jaadu-2.html', caption: 'Charts, alerts, AI and a quant lab in one terminal', status: 'ready' },
      { n: 2, what: 'Terminal, annotated', source: `Figma ${JAADU} 1968:164569`, caption: 'Regime, patterns and funding on one screen', status: 'export' },
      { n: 3, what: 'Footprint view with settings', source: `Figma ${JAADU} 2592:225454`, caption: 'Each candle splits into price cells; the view is configurable', status: 'export' },
      { n: 4, what: 'Alerts, active and completed', source: `Figma ${JAADU} 886:7116, 891:7445`, caption: 'Alerts on price, footprint and POC, with multi-condition states', status: 'export' },
      { n: 5, what: 'Quant Lab workspace', source: `Figma ${JAADU} 735:3056`, caption: 'Research and Build modes, four tools, one history', status: 'export' },
      { n: 6, what: 'Overnight Discoveries, setup and results', source: `Figma ${JAADU} 893:7146, 932:8551`, caption: 'The screen explains itself in three steps: set up, works overnight, shortlist', status: 'export' },
      { n: 7, what: 'Library comparison', source: `Figma ${JAADU} 854:10158`, caption: 'Four strategy variants compared on one table and one equity curve', status: 'export' },
      { n: 8, what: 'Deja Vu', source: `Figma ${JAADU} 772:3896`, caption: 'A structured query finds historical look-alikes', status: 'export' },
      { n: 9, what: 'Chart prompt, desktop, tablet, mobile', source: `Figma ${JAADU} 3641:325462`, caption: 'Five states in three layouts, anchored to one point on the chart', status: 'export' },
      { n: 10, what: 'Design system board, plus the mobile dashboard', source: `Figma ${JAADU} Components section 1576:42307; mobile 1743:65879`, caption: 'One component set from desktop to mobile', status: 'export' },
    ],
    homeCard:
      "A trading terminal that reads the market's regime, and a Quant Lab that turns a night of strategy search into a shortlist. I designed the terminal, alerts, Quant Lab, AI chat, the design system and the layouts from desktop to mobile.",
    confirm: [
      'Real dates, and whether the work was paid and delivered',
      'Spelling: Jaadu (site) or Jadoo',
      'Laptop or tablet: frames are labelled Tablet',
      'Link to the website and motion graphics files (not in this Figma file)',
    ],
    fixBeforePublishing: [
      'Typos on screen: "Morning Breif", "TRIGGEER", "MAX DO", "PROFT FACTOR", "Z core", mark price "$60.553.20"',
      'Regime gauge reads 55/35/13/12 (sums to 115) while the bar reads 40/35/13/12',
      'Library table: all four variants show identical Sharpe, return and profit factor; two Quant Lab prompts are duplicated',
      'Terminal placeholders: BTC watchlist price $0.48, identical trade rows',
      'Label all figures (including 642 to 3) as sample data',
      'Do not call the footprint chart "completely new"; say "new to this product"',
      'Library filter chips say Breakdown while strategy tags say Breakout',
    ],
  },
]

export const caseStudyByKey = (key: string) => CASE_STUDIES.find((c) => c.key === key)
