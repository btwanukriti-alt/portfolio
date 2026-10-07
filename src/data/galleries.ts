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
  // White-on-transparent mark in public/brand/, drawn in the accent colour with a CSS mask.
  mark?: { src: string; ratio: number }
}

type GalleryConfig = { studyKey: string; brand: Brand; images: GalleryImage[] }

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
    brand: {
      accent: '#644ACD',
      deep: '#3E2B94',
      soft: '#ECE8FA',
      tint: '#FFE8EE',
      pop: '#F5577D',
      mark: { src: '/brand/zync-mark.png', ratio: 170 / 188 },
    },
    images: [
      zync('04-ring-chart.jpg', 1500, 'The calorie ring beside the weekly water intake chart', 'A ring for today, a chart for the week.'),
      zync('02-home.jpg', 1725, 'The refined Zync Home screen on a pink and violet ground', "The member's day on one scroll."),
      zync('03-annotated.jpg', 1725, 'Zync Home with four callouts: QR check-in, gym switcher, calorie toggle and next class', 'Gym access on top, the day below.'),
      zync('05-trackers.jpg', 1620, 'Hydration, Sleep and Food log screens side by side', 'Three trackers, one pattern.'),
      zync('07-states.jpg', 840, 'Three class cards: available, full with waitlist, booked', "A class's status shows before the tap."),
      zync('08-gym.jpg', 1500, 'Gym Activity, Gym Events and the Log sheet', 'Check-in, classes and logging, one tap from the nav.'),
      zync('09-workout.jpg', 1500, 'Sign up, Workout plans and a workout detail screen', 'From sign-up to a workout plan in three screens.'),
      zync('06-layouts.jpg', 1110, 'Five earlier Home layouts next to the refined Home', 'Five Home layouts tried, then one refined.'),
      zync('01-system.jpg', 1500, 'Zync logo, colour palette, type scale and components on one board', 'Colour and type were set before any screen.'),
    ],
  },
}
