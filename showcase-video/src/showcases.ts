// The five work-card showcases. duration: the loop's length in seconds (the showcase's own clock); start: where
// the loop begins, the moment the showcase shows before it plays (so the card's still matches the first frame).
export const FPS = 30
export const SHOWCASES = [
  { slug: 'gym-crm', duration: 10, start: 2.8 },
  { slug: 'college-erp', duration: 18.395, start: 7.1 },
  { slug: 'jaadu', duration: 22.56, start: 5.2 },
  { slug: 'zync', duration: 31, start: 31 * 0.05 },
  { slug: 'ssh-client', duration: 17, start: 1.2 },
] as const
// Landscape for desktop and tablet cards; portrait for phones held upright. Sizes in CSS px, rendered at 2x.
export const CUTS = { land: [1280, 720], port: [540, 960] } as const
