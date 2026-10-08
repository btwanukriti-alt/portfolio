# Hero tiles (full UX frames)

Source for `public/hero/tiles/tNN.jpg` (the patterned ground) and `tNN-pop.webp` (the device
alone, which the hero lifts out of the tile on a loop). Every tile holds one full screen from a
case study, every device the same size, on its own pattern in colours chosen for that screen.

1. Screens into `a/`:
   - Pulsefit: build a page from `../pulsefit/ui.css`, `site.css`, `pulsefit/sprite.html`, an empty
     `<div id="lib">`, then `mark.js`, `ui.js`, `site.js`; `node pulsefit/render.mjs <page> a/`.
   - College ERP: `node college/render.mjs <abs path to college/page.html> a/`.
   - SSH client: run `../ssh-client/screens-src/screens.js`, `screens2.js` and `render.js`
     (needs `@fontsource/outfit`), then copy `performance`, `hosts`, `sessions` as `ssh2-*.png`.
   - `python3 scripts/mockups/hero/prep.py` collects Jaadu and Zync.
2. Patterns: `python3 textures.py a/` writes `p01..p16.png` (space, paper cut-outs, grain,
   sunburst, watercolour, halftone, Memphis, topographic, terrazzo, synthwave, op-art ripples,
   groovy waves, pixel mosaic, hills, aurora, Bauhaus).
3. `node render.mjs <abs path to this folder> <out dir>` writes `tNN.jpg`, `tNN-full.png`,
   `tNN-pop.png` and `meta.json` (pop box as a share of the 900 x 600 tile).
4. Resize to 840 x 560 (pop by the same factor, WebP) into `public/hero/tiles/`, and copy the
   `meta.json` boxes into `src/components/intro-hero/tiles.ts`.

Layouts live in `tiles.js` (`TILESPEC`). Every name and number in the screens is sample data.
