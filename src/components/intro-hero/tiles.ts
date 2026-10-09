// The UX screens that orbit the hero text: full frames from each case study, each in a device
// mockup on its own pattern, as one still image (public/hero/screens/, 840 x 560; generator in
// scripts/mockups/hero/). Each links to its project. Ordered so light and dark screens alternate.

export type Tile = { src: string; slug?: string; label: string }

const tile = (n: string, slug: string, label: string): Tile => ({ src: `/hero/screens/${n}.jpg`, slug, label })

export const TILES: Tile[] = [
  tile('s01', 'jaadu-2', 'Jaadu 2.0'),
  tile('s02', 'bosch-customer-experience', 'Gym Management CRM'),
  tile('s03', 'ssh-client', 'SSH CLIENT'),
  tile('s04', 'fitness-tracker', 'Fitness Tracker App'),
  tile('s05', 'college-management', 'College Management'),
  tile('s06', 'jaadu-2', 'Jaadu 2.0'),
  tile('s07', 'bosch-customer-experience', 'Gym Management CRM'),
  tile('s08', 'ssh-client', 'SSH CLIENT'),
  tile('s09', 'fitness-tracker', 'Fitness Tracker App'),
  tile('s10', 'jaadu-2', 'Jaadu 2.0'),
  tile('s11', 'college-management', 'College Management'),
  tile('s12', 'ssh-client', 'SSH CLIENT'),
  tile('s13', 'bosch-customer-experience', 'Gym Management CRM'),
  tile('s14', 'college-management', 'College Management'),
  tile('s15', 'jaadu-2', 'Jaadu 2.0'),
  tile('s16', 'bosch-customer-experience', 'Gym Management CRM'),
]
