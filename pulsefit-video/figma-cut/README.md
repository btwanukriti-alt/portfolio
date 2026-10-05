# Pulsefit, Figma-style showcase

A 35.5s looping, agency-style UX showcase on one pastel background, with a hook, a middle and an end. The hook is a product overview. The middle follows one flow (lead → member → renewal) across the real Pulsefit screens, shown whole and joined by shared-element transitions, with a supporting infographic. The end is a 3D deck of the screens with the sign-off. It is built as live React (no video file, no screenshots). Storyboard: `../pulsefit-storyboard-figma.md`.

## Run / build
- `npm install`
- `npm run dev` previews the piece with player controls.
- `npm run build` writes the one-file build to `dist/index.html`, with JS, CSS and fonts inlined.
- `npm run embed` builds, then writes `../../public/showcase/bosch-customer-experience.html`. That file is the Pulsefit card in the portfolio's Selected Work section and the case-study hero.

## Structure
- `src/lib.js`: easing, keyframe helpers, tokens, the background colour and the chapter timeline (`BG`, `HEAD_FONT`, `CHAPTERS`, `DURATION`), and the stage sizes.
- `src/fig.jsx`: the cursor.
- `src/ui.jsx`: Pulsefit primitives (icons, avatar, chip, button) and the app `Shell` (sidebar and top bar).
- `src/screens.jsx`: Leads Dashboard, Leads Table, Members and the Convert to Member modal and frame, as memoised components, with the geometry the cursor aims at.
- `src/story.jsx`: the whole piece. The overview hook (dashboard hub and seven modules), the captions, `Shot` (a whole screen plus cursor), `Ghost` (shared-element transitions), the four flow chapters and the end deck.
- `src/infographics.jsx`: the Price per month plan infographic.
- `src/stage.jsx`: the single pastel background.
- `src/App.jsx`: the clock, layout choice and scaling, embed mode, and the player.

## Responsive
- **Layouts:** two compositions, landscape (1920×1080 stage) and portrait (1080×1920 stage, used when width/height is below 0.9). Each is scaled to fit the viewport.
- **Placement:** screens are always shown whole. Landscape puts captions in a left column and the screen on the right; portrait puts the caption on top and the screen below.
- **Background:** drawn in viewport space, so the colour always fills the screen.

## Controls
- **Keys:** Space plays/pauses, R restarts, ←/→ seek 1s, H hides the player.
- **Script API:** `window.__pulsefit.seek(t) / play() / pause() / t / duration` for frame capture.
- **Embed mode** (`window.__EMBED__ = 1` or `?embed`): no controls, paused on the poster frame (3.6s) until the page posts `showcase:play`, and stops on `showcase:pause`. With `prefers-reduced-motion` it stays on the poster frame.
