// The UX screens that orbit the hero text: full frames from each case study, in device mockups
// on that project's own ground (public/hero/tiles/, 960 x 640; generator in scripts/mockups/hero/).
// Each tile is two layers: the ground with any background devices (src), and the foreground
// device on its own (pop), which lifts out of the tile in a loop. pop.x/y/w/h place it, as a
// share of the tile's width and height. Each links to its project.
// Ordered so light and dark screens alternate around the ring.

export type Pop = { src: string; x: number; y: number; w: number; h: number }
export type Tile = { src: string; pop: Pop; slug?: string; label: string }

const tile = (n: string, slug: string, label: string, x: number, y: number, w: number, h: number): Tile => ({
  src: `/hero/tiles/${n}.jpg`,
  pop: { src: `/hero/tiles/${n}-pop.webp`, x, y, w, h },
  slug,
  label,
})

export const TILES: Tile[] = [
  tile('t01', 'jaadu-2', 'Jaadu 2.0', 0.7278, 0.1533, 0.2244, 0.6987),
  tile('t02', 'bosch-customer-experience', 'Gym Management CRM', 0.1222, 0.11, 0.7556, 0.7661),
  tile('t03', 'ssh-client', 'SSH CLIENT', 0.4556, 0.35, 0.5, 0.5192),
  tile('t04', 'fitness-tracker', 'Fitness Tracker App', 0.3778, 0.0833, 0.2444, 0.6632),
  tile('t05', 'jaadu-2', 'Jaadu 2.0', 0.4444, 0.3333, 0.5422, 0.5247),
  tile('t06', 'college-management', 'College Management', 0.1222, 0.1133, 0.7556, 0.7013),
  tile('t07', 'bosch-customer-experience', 'Gym Management CRM', 0.4556, 0.35, 0.5, 0.5009),
  tile('t08', 'ssh-client', 'SSH CLIENT', 0.1222, 0.11, 0.7556, 0.7925),
  tile('t09', 'fitness-tracker', 'Fitness Tracker App', 0.3778, 0.0833, 0.2444, 0.6632),
  tile('t10', 'college-management', 'College Management', 0.1222, 0.1133, 0.7556, 0.7013),
  tile('t11', 'bosch-customer-experience', 'Gym Management CRM', 0.4556, 0.35, 0.5, 0.5009),
  tile('t12', 'jaadu-2', 'Jaadu 2.0', 0.4556, 0.35, 0.5, 0.5004),
  tile('t13', 'college-management', 'College Management', 0.1222, 0.1133, 0.7556, 0.7013),
  tile('t14', 'ssh-client', 'SSH CLIENT', 0.0444, 0.35, 0.5, 0.5192),
  tile('t15', 'bosch-customer-experience', 'Gym Management CRM', 0.1111, 0.1167, 0.7778, 0.7783),
  tile('t16', 'fitness-tracker', 'Fitness Tracker App', 0.3778, 0.0833, 0.2444, 0.6632),
]
