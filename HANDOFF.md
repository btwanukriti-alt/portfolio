# Portfolio site: handoff notes

React + Vite + TypeScript. Light, celestial, scroll-told portfolio.

Design: everything sits on one centre axis. Headlines are set in Doto (round-dot setting, `ROND` 100)
so the type is made of the same dots as the illustrations; Manrope for body and labels. The page
background is a fine dot texture painted in `src/texture.ts`; spare particles settle into it.

Run: `npm install`, then `npm run dev` (or `npm run build && npm run preview`).

## Structure

| Part | Files | Notes |
|---|---|---|
| Smooth scroll | `src/smoothScroll.ts` | Lenis (inertial scrolling). Disabled for `prefers-reduced-motion`. |
| Story (hero) | `src/components/Story.tsx`, `Story.module.css` | Pinned stage, ~8 screens of scroll. Copy for each chapter lives in `COPY`. |
| Dot illustrations | `src/story/beats.ts` | One entry per chapter: how the dots are drawn, how it moves, where it sits on desktop/phone. |
| Particle engine | `src/story/field.ts`, `src/story/cloud.ts` | ~4200 dots on desktop, 2200 on phones / low-core devices. Flat illustrations are drawn on an offscreen canvas and stippled with blue noise (even dot spacing); planets/orbs/galaxy are 3D point sets that spin. |
| Work | `src/components/Work.tsx` | Staggered two-column grid, clip-reveal on scroll. Data in `src/data/projects.ts`. |
| Contact / footer | `src/components/Contact.tsx` | |

## The story (scroll order)

0. **Hello**: ringed planet with two moons. "Hello, I'm Anukriti."
1. **Designer**: the dots spell *designer.*, completing "By trade, I'm an experienced …"
2. **Crafts**: the word splits into three orbiting spheres: UX & Product, Branding, UI & Visual
3. **UX**: user flow (start, screen, decision, two outcomes, dashed iterate loop)
4. **Brand**: monogram seal, gold spark, colour palette
5. **UI**: card with image, chips, button + pointer, toggle, slider, checklist
6. **Together**: spiral galaxy. "One designer. One clear story."

To change an illustration, edit its `build` in `beats.ts`: draw with normal canvas calls in a
-0.5..0.5 box using the `PEN` colours (`line` = ink, `tone` = lighter fill, `gold`, `violet`).
The dots follow whatever is drawn.

## Placeholders still to replace

- Contact email (`hello@example.com`) and LinkedIn / Dribbble / Behance links in `Contact.tsx`.
- Project descriptions, role and timeline in `src/data/projects.ts` (shared placeholder copy).
- Case study pages were retired with the old dark design; project cards say "Case study soon".
  The case study images are still in `src/assets/case-studies/` for when they're rebuilt.
