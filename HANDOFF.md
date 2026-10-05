# Portfolio site: handoff notes

React + Vite + TypeScript + three.js. Light theme, one typeface (Bricolage Grotesque), one accent (#5b3df5).

Run: `npm install`, then `npm run dev` (or `npm run build && npm run preview`).

## The experience

The opening is a pinned, scroll-driven story in which ~40,000 dots (16,000 on phones) show a product
being designed. Each chapter is a "formation" of the same dots; the GPU morphs between them.

| # | Chapter | What the dots do |
|---|---|---|
| 0 | (load) | All dots start as one point and burst outward |
| 1 | Noise | Deep drifting cloud; name + intro line |
| 2 | Listen | Gather into six clusters: Interviews, Analytics, Support tickets, Competitors, Stakeholders, Edge cases |
| 3 | Map | Become a user flow; dots stream along the paths, the detour in accent colour |
| 4 | Structure | Draw a wireframe of the Jaadu 2.0 dashboard |
| 5 | Craft | Take on the screenshot's colours, then resolve into the real image through a dot mask |
| 6 | Work | Release into a wide orbit, leading into the gallery |

The cursor gently parts the dots (not on touch). Reduced motion disables drift, swirl and smooth scroll.

Then a pinned sideways gallery: each project screen assembles from dots as it reaches the centre and
dissolves back into dots as it leaves.

## Files

| Part | Files |
|---|---|
| Chapter copy + scroll timeline | `src/components/Experience.tsx` |
| Dot formations (what each chapter draws) | `src/experience/formations.ts` |
| GPU renderer (shaders, morph, noise, cursor) | `src/experience/field.ts` |
| Gallery | `src/components/Work.tsx`, data in `src/data/projects.ts` |
| Contact / footer | `src/components/Contact.tsx` |
| Smooth scroll (Lenis) | `src/smoothScroll.ts` |

## Placeholders to replace

- All chapter copy in `Experience.tsx` is a draft; rewrite it in your own voice.
- Contact email (`hello@example.com`) and LinkedIn / Dribbble / Behance links.
- Project summaries ("Case study coming soon.") in `src/data/projects.ts`.
- Case study pages don't exist yet; slides are kept in `src/assets/case-studies/`.
