// The UX screens that orbit the hero text: full frames from each case study, every device
// the same size, each on its own textured pattern in colours that suit that screen (public/hero/tiles/, 960 x 640; generator in scripts/mockups/hero/).
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
  tile('t01', 'jaadu-2', 'Jaadu 2.0', 0.1222, 0.1167, 0.7822, 0.7233),
  tile('t02', 'bosch-customer-experience', 'Gym Management CRM', 0.1222, 0.1167, 0.7822, 0.7233),
  tile('t03', 'ssh-client', 'SSH CLIENT', 0.1222, 0.1167, 0.7822, 0.7233),
  tile('t04', 'fitness-tracker', 'Fitness Tracker App', 0.3833, 0.3203, 0.2333, 0.633),
  tile('t05', 'college-management', 'College Management', 0.1222, 0.1167, 0.7822, 0.7233),
  tile('t06', 'jaadu-2', 'Jaadu 2.0', 0.1222, 0.1167, 0.7822, 0.7233),
  tile('t07', 'bosch-customer-experience', 'Gym Management CRM', 0.1222, 0.1167, 0.7822, 0.7233),
  tile('t08', 'ssh-client', 'SSH CLIENT', 0.1222, 0.1167, 0.7822, 0.7233),
  tile('t09', 'fitness-tracker', 'Fitness Tracker App', 0.3833, 0.26, 0.2333, 0.7167),
  tile('t10', 'jaadu-2', 'Jaadu 2.0', 0.1222, 0.1167, 0.7822, 0.7233),
  tile('t11', 'college-management', 'College Management', 0.1222, 0.1167, 0.7822, 0.7233),
  tile('t12', 'ssh-client', 'SSH CLIENT', 0.1222, 0.1167, 0.7822, 0.7233),
  tile('t13', 'bosch-customer-experience', 'Gym Management CRM', 0.1222, 0.1167, 0.7822, 0.7233),
  tile('t14', 'college-management', 'College Management', 0.1222, 0.1167, 0.7822, 0.7233),
  tile('t15', 'jaadu-2', 'Jaadu 2.0', 0.1222, 0.1167, 0.7822, 0.7233),
  tile('t16', 'bosch-customer-experience', 'Gym Management CRM', 0.1222, 0.1167, 0.7822, 0.7233),
]
