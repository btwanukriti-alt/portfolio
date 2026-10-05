# Pulsefit, Figma-style showcase

A 26.4s looping motion graphic in the style of Figma's launch videos, built as live React (no video file, no screenshots). Storyboard: `../pulsefit-storyboard-figma.md`.

## Run / build
- `npm install`
- `npm run dev` previews the piece with player controls.
- `npm run build` writes the one-file build to `dist/index.html`, with JS, CSS and fonts inlined.
- `npm run embed` builds, then writes `../../public/showcase/bosch-customer-experience.html`. That file is the Pulsefit card in the portfolio's Selected Work section and the case-study hero.

## Structure
- `src/lib.js`: easing, keyframe helpers, tokens, the scene timeline (`SCENES`, `DURATION`) and the stage sizes.
- `src/fig.jsx`: Figma editor pieces: `Cursor`, `Selection`, `Noodle`, `Comment`, `Spacing`, `Toolbar`, `Headline`, `Tag`, `Sticker`.
- `src/ui.jsx`: Pulsefit UI rebuilt from the Figma frames: lead card, Assign Plan, KPI, plan card, Members window and module tiles.
- `src/scenes.jsx`: `Hook`, `Leads`, `Members` and `Modules`, each a pure function of the clock `t`.
- `src/stage.jsx`: the full-bleed stage colour with drifting shapes and grain, plus the frame wipe between scenes.
- `src/App.jsx`: the clock, layout choice and scaling, embed mode, and the player.

## Responsive
- **Layouts:** two compositions, landscape (1920×1080 stage) and portrait (1080×1920 stage, used when width/height is below 0.9). Each is scaled to fit the viewport.
- **Background:** drawn in viewport space, so it always fills the screen, including ultra-wide, tall phones, and live resize or rotation.

## Controls
- **Keys:** Space plays/pauses, R restarts, ←/→ seek 1s, H hides the player.
- **Script API:** `window.__pulsefit.seek(t) / play() / pause() / t / duration` for frame capture.
- **Embed mode** (`window.__EMBED__ = 1` or `?embed`): no controls, paused on the poster frame (4.4s) until the page posts `showcase:play`, and stops on `showcase:pause`. With `prefers-reduced-motion` it stays on the poster frame.
