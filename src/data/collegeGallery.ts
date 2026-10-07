// Mockup modules for the college group ERP case study (mockup-showcase layout): 2400px-wide JPEGs
// rendered from the redesigned screens by scripts/mockups/college. Every figure in them is sample
// data. Captions state what each image proves in one line.

export type CollegeImage = { src: string; width: number; height: number; alt: string; caption: string }

const img = (file: string, height: number, alt: string, caption: string): CollegeImage => ({
  src: `/case-studies/college-management/${file}`,
  width: 2400,
  height,
  alt,
  caption,
})

export const COLLEGE_BRAND = {
  accent: '#12326E',
  deep: '#08153A',
  soft: '#E6EDF9',
  tint: '#FFE4D3',
  pop: '#4F86E8',
}

export const COLLEGE_IMAGES: CollegeImage[] = [
  img('01-spines.jpg', 1500, 'A desktop screen of the B.Tech batch drawer beside the enlarged drawer header, with the group, college and programme spines', 'Every level stays on screen.'),
  img('02-target.jpg', 1080, 'The total received card with the 80% target marked on its progress bar', 'One bar shows whether the group is on track.'),
  img('03-totals.jpg', 1500, 'Three summary banners (Engineering, B.Tech, group) beside the college drawer on a desktop screen', 'Each drawer shows its own totals.'),
  img('04-ranked.jpg', 1500, 'The ranked college table, collection chips, progress bars and gap-to-target cards as separate components', 'One column to scan for the weakest college.'),
  img('05-weakest.jpg', 1080, 'The lowest-collection banner on the finance page and the same line inside a drawer', 'The weakest row is named at every level.'),
  img('06-attendance.jpg', 1500, 'The staff overview on a desktop screen beside the attendance-by-college card', 'Attendance by college in one bar each.'),
  img('07-staff.jpg', 1500, 'Staff KPI cards, the needs-attention list, the absence table and the absent card as separate components', 'Staff numbers, alerts and absences as separate cards.'),
  img('08-colour.jpg', 1230, 'The navy palette, the green, amber and red status colours, collection chips and progress bars', 'One status system across every screen.'),
  img('09-process.jpg', 1140, 'The earlier finance and drawer layouts next to the redesigned drawer', 'Earlier layouts next to the redesign.'),
]
