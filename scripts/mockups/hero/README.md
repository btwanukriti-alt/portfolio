# Hero tiles (full UX frames)

Source for `public/hero/tiles/tNN.jpg` (ground + background devices) and `tNN-pop.webp` (the
foreground device alone, which the hero lifts out of the tile on a loop). Every screen is a full
frame from a case study, on that project's own ground and accent.

1. Pulsefit screens: build a page from `../pulsefit/ui.css`, `site.css`, `pulsefit/sprite.html`
   (line icons), an empty `<div id="lib">`, then `mark.js`, `ui.js`, `site.js`. Run
   `node pulsefit/render.mjs <page.html> a/` to write `app-leads|members|plans|site.png`.
2. `python3 scripts/mockups/hero/prep.py` collects the other screens and devices into `a/`.
3. `node render.mjs <abs path to this folder> <out dir>` writes `tNN.jpg`, `tNN-full.png`,
   `tNN-pop.png` and `meta.json` (pop box as a share of the 900 x 600 tile).
4. Resize to 960 x 640 (pop by the same factor, WebP) into `public/hero/tiles/`, and copy the
   `meta.json` boxes into `src/components/intro-hero/tiles.ts`.

Layouts live in `tiles.js` (`TILESPEC`). Every name and number in the screens is sample data.
