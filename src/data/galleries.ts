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
      zync('01-hero.jpg', 1740, 'Three refined Zync screens in perspective around the Home screen', 'Zync, the member side of Pulsefit.'),
      zync('02-ring.jpg', 1500, 'The calorie ring pulled out of the Home screen with "300 cal to go"', 'A ring for today: burned against the goal, and what is left.'),
      zync('03-checkin.jpg', 1500, 'The Gym tab beside a large QR check-in card', 'Check-in is one tap from the Gym tab.'),
      zync('04-classes.jpg', 1500, 'Three class cards fanned out: available, full with waitlist, booked', "A class's status shows before the tap."),
      zync('05-trackers.jpg', 1650, 'Hydration, Sleep and Food screens with their key cards pulled forward', 'Water, sleep and food follow one pattern.'),
      zync('06-log.jpg', 1500, 'The Log sheet with Water and Food shortcuts pulled forward and the quick-add chips', 'Every shortcut shows today\'s progress.'),
      zync('07-workout.jpg', 1500, 'A workout plan card and exercise list around the workout detail screen', 'Level and length on every plan card.'),
      zync('08-layouts.jpg', 1500, 'Five earlier Home layouts fanned out beside the refined Home', 'Five Home layouts tried, then one refined.'),
      zync('09-system.jpg', 1500, 'Zync logo, colour palette, type scale and components', 'Colour and type were set before any screen.'),
    ],
  },
}
