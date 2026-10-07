# SSH client mockups (HTML to JPEG)

Source for `public/case-studies/ssh-client/`. Module spec: `MODULES.md`.

1. `npm i --no-save playwright-core @fontsource/outfit` in this folder.
2. Copy `screens-src/*.js` next to `modules.html`, then `node screens.js && node screens2.js && node render.js` (writes `screens/*.png` at 3x).
3. `node render_mods.js` writes the ten 2400px JPEGs to `gallery/`; copy them to `public/case-studies/ssh-client/`.

`logo.svg` is the mark (white version: `public/brand/ssh-client-mark.png`).
