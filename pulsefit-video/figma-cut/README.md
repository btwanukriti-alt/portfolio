# Pulsefit, Figma-style showcase

A 28s looping product video. It follows one flow (lead → member → renewal) on a single pastel background, with no captions: four flow cards, then the real Pulsefit screens shown whole, driven by a cursor. It is built as live React (no video file, no screenshots). Storyboard: `../pulsefit-storyboard-figma.md`.

## Run / build
- `npm install`
- `npm run dev` previews the piece with player controls.
- `npm run build` writes the one-file build to `dist/index.html`, with JS, CSS and fonts inlined.
- `npm run embed` builds, then writes `../../public/showcase/bosch-customer-experience.html`. That file is the Pulsefit card in the portfolio's Selected Work section and the case-study hero.

## Structure
- `src/lib.js`: easing, keyframe helpers, tokens, the background colour and the chapter timeline (`BG`, `CHAPTERS`, `DURATION`), and the stage sizes.
- `src/fig.jsx`: the cursor.
- `src/ui.jsx`: Pulsefit primitives (icons, avatar, chip, button) and the app `Shell` (sidebar and top bar).
- `src/screens.jsx`: Leads Dashboard, Leads Table, Members and the Convert to Member modal and frame, as memoised components, with the geometry the cursor aims at.
- `src/story.jsx`: the four flow cards and the `Screen` template, which fits a whole frame to the stage and runs the cursor.
- `src/stage.jsx`: the single pastel background.
- `src/App.jsx`: the clock, layout choice and scaling, embed mode, and the player.

## Responsive
- **Layouts:** two compositions, landscape (1920×1080 stage) and portrait (1080×1920 stage, used when width/height is below 0.9). Each is scaled to fit the viewport.
- **Placement:** screens are always shown whole, fitted to the stage. Landscape shows the cards in a 2 × 2 grid; portrait shows them in one column and the form as the modal on its own.
- **Background:** drawn in viewport space, so the colour always fills the screen.

## Controls
- **Keys:** Space plays/pauses, R restarts, ←/→ seek 1s, H hides the player.
- **Script API:** `window.__pulsefit.seek(t) / play() / pause() / t / duration` for frame capture.
- **Embed mode** (`window.__EMBED__ = 1` or `?embed`): no controls, paused on the poster frame (4.8s) until the page posts `showcase:play`, and stops on `showcase:pause`. With `prefers-reduced-motion` it stays on the poster frame.
