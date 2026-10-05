// The UX screenshots that orbit the eyes and frame the hero text (720 x 480 crops in
// public/hero/tiles/, made from the project covers, case-study slides and mosaic shots).
// Each links to its project; the mosaic shots aren't tied to one, so they open the work list.
// Ordered so light and dark screens alternate around the ring.

export type Tile = { src: string; slug?: string; label: string }

export const TILES: Tile[] = [
  { src: '/hero/tiles/t01.jpg', slug: 'jaadu-2', label: 'Jaadu 2.0' },
  { src: '/hero/tiles/t02.jpg', slug: 'clihub', label: 'CLIHUB' },
  { src: '/hero/tiles/t03.jpg', slug: 'fitness-tracker', label: 'Fitness Tracker App' },
  { src: '/hero/tiles/t04.jpg', label: 'Selected work' },
  { src: '/hero/tiles/t05.jpg', slug: 'fitness-tracker', label: 'Fitness Tracker App' },
  { src: '/hero/tiles/t06.jpg', slug: 'bosch-customer-experience', label: 'BOSCH Customer Experience' },
  { src: '/hero/tiles/t07.jpg', slug: 'clihub', label: 'CLIHUB' },
  { src: '/hero/tiles/t08.jpg', slug: 'college-management', label: 'College Management' },
  { src: '/hero/tiles/t09.jpg', slug: 'bosch-customer-experience', label: 'BOSCH Customer Experience' },
  { src: '/hero/tiles/t10.jpg', label: 'Selected work' },
  { src: '/hero/tiles/t11.jpg', slug: 'fitness-tracker', label: 'Fitness Tracker App' },
  { src: '/hero/tiles/t12.jpg', slug: 'clihub', label: 'CLIHUB' },
  { src: '/hero/tiles/t13.jpg', slug: 'clihub', label: 'CLIHUB' },
  { src: '/hero/tiles/t14.jpg', slug: 'college-management', label: 'College Management' },
  { src: '/hero/tiles/t15.jpg', label: 'Selected work' },
  { src: '/hero/tiles/t16.jpg', slug: 'college-management', label: 'College Management' },
]
