# Pulsefit, Figma-style showcase

A 33.4s looping motion graphic in the style of Figma's launch videos: a camera journey across a canvas of seven real Pulsefit screens, built as live React (no video file, no screenshots). Storyboard: `../pulsefit-storyboard-figma.md`.

## Run / build
- `npm install`
- `npm run dev` previews the piece with player controls.
- `npm run build` writes the one-file build to `dist/index.html`, with JS, CSS and fonts inlined.
- `npm run embed` builds, then writes `../../public/showcase/bosch-customer-experience.html`. That file is the Pulsefit card in the portfolio's Selected Work section and the case-study hero.

## Structure
- `src/lib.js`: easing, keyframe helpers, tokens, the beat timeline with copy (`BEATS`, `DURATION`) and the stage sizes and camera view areas.
- `src/fig.jsx`: Figma editor pieces: `Cursor`, `Selection`, `Comment`, `Toolbar`, `Headline`, `Tag`.
- `src/ui.jsx`: Pulsefit primitives (icons, avatar, chip, button) and the app `Shell` (sidebar and top bar).
- `src/screens.jsx`: the seven screens, as memoised components, with the geometry the cursors aim at.
- `src/canvas.jsx`: canvas layout per orientation, the camera (`camera(t, L)`), cursor tracks, selections, comments and captions.
- `src/stage.jsx`: the canvas backdrop (grey, soft light, a dot grid that follows the camera, grain).
- `src/App.jsx`: the clock, layout choice and scaling, embed mode, and the player.

## Responsive
- **Layouts:** two compositions, landscape (1920×1080 stage) and portrait (1080×1920 stage, used when width/height is below 0.9). Each is scaled to fit the viewport.
- **Camera framing:** each orientation has its own canvas layout and camera targets; portrait frames the key part of each screen.
- **Background:** the canvas is drawn in viewport space, so it always fills the screen, including ultra-wide, tall phones, and live resize or rotation.

## Controls
- **Keys:** Space plays/pauses, R restarts, ←/→ seek 1s, H hides the player.
- **Script API:** `window.__pulsefit.seek(t) / play() / pause() / t / duration` for frame capture.
- **Embed mode** (`window.__EMBED__ = 1` or `?embed`): no controls, paused on the poster frame (2.6s) until the page posts `showcase:play`, and stops on `showcase:pause`. With `prefers-reduced-motion` it stays on the poster frame.
