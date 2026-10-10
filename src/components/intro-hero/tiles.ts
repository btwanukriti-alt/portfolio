// The UX screens that orbit the hero text: full frames from each case study, each in a device
// mockup on its own pattern, as one still image (public/hero/screens/, 840 x 560; generator in
// scripts/mockups/hero/). Each links to its project. Ordered so light and dark screens alternate.

// small: a 420 x 280 copy for phones, where the screens are drawn small.
export type Tile = { src: string; small: string; slug?: string; label: string }

const tile = (n: string, slug: string, label: string): Tile => ({
  src: `/hero/screens/${n}.jpg`,
  small: `/hero/screens/${n}-m.jpg`,
  slug,
  label,
})

export const TILES: Tile[] = [
  tile('s01', 'jaadu', 'Jaadu 2.0'),
  tile('s02', 'gym-crm', 'Gym Management CRM'),
  tile('s03', 'ssh-client', 'SSH CLIENT'),
  tile('s04', 'zync', 'Fitness Tracker App'),
  tile('s05', 'college-erp', 'College Management'),
  tile('s06', 'jaadu', 'Jaadu 2.0'),
  tile('s07', 'gym-crm', 'Gym Management CRM'),
  tile('s08', 'ssh-client', 'SSH CLIENT'),
  tile('s09', 'zync', 'Fitness Tracker App'),
  tile('s10', 'jaadu', 'Jaadu 2.0'),
  tile('s11', 'college-erp', 'College Management'),
  tile('s12', 'ssh-client', 'SSH CLIENT'),
  tile('s13', 'gym-crm', 'Gym Management CRM'),
  tile('s14', 'college-erp', 'College Management'),
  tile('s15', 'jaadu', 'Jaadu 2.0'),
  tile('s16', 'gym-crm', 'Gym Management CRM'),
]
