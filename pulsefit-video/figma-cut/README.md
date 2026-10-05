# Pulsefit, Figma-style showcase

A 37s looping motion graphic in the style of Figma's launch videos. It tells one flow (lead → member → renewal) on solid pastel stages, with the real Pulsefit screens and lifted component cards. It is built as live React (no video file, no screenshots). Storyboard: `../pulsefit-storyboard-figma.md`.

## Run / build
- `npm install`
- `npm run dev` previews the piece with player controls.
- `npm run build` writes the one-file build to `dist/index.html`, with JS, CSS and fonts inlined.
- `npm run embed` builds, then writes `../../public/showcase/bosch-customer-experience.html`. That file is the Pulsefit card in the portfolio's Selected Work section and the case-study hero.

## Structure
- `src/lib.js`: easing, keyframe helpers, tokens, the chapter timeline with pastels and copy (`CHAPTERS`, `DURATION`) and the stage sizes.
- `src/fig.jsx`: Figma editor pieces: `Cursor`, `Selection`, `Comment`, `Toolbar`, `Headline`, `Tag`.
- `src/ui.jsx`: Pulsefit primitives (icons, avatar, chip, button) and the app `Shell` (sidebar and top bar).
- `src/screens.jsx`: Leads Dashboard, Leads Table, Members and the Convert to Member modal, as memoised components, with the geometry the cursors aim at. Also holds `TaskItem` and `StatusSwap`.
- `src/story.jsx`: the flow infographic (intro and outro), the `Chapter` template (screen window, cursor, lifted card), and the four chapters.
- `src/stage.jsx`: the solid pastel backdrop and the frame wipe between chapters.
- `src/App.jsx`: the clock, layout choice and scaling, embed mode, and the player.

## Responsive
- **Layouts:** two compositions, landscape (1920×1080 stage) and portrait (1080×1920 stage, used when width/height is below 0.9). Each is scaled to fit the viewport.
- **Screen and card placement:** landscape puts the screen left and the lifted card on the right. Portrait crops the screen to the step and puts the card below.
- **Background:** the pastel backdrop and wipes are drawn in viewport space, so colour always fills the screen.

## Controls
- **Keys:** Space plays/pauses, R restarts, ←/→ seek 1s, H hides the player.
- **Script API:** `window.__pulsefit.seek(t) / play() / pause() / t / duration` for frame capture.
- **Embed mode** (`window.__EMBED__ = 1` or `?embed`): no controls, paused on the poster frame (3.9s) until the page posts `showcase:play`, and stops on `showcase:pause`. With `prefers-reduced-motion` it stays on the poster frame.
