# Pulsefit, Figma-style showcase

A 39.5s looping, agency-style UX showcase on one pastel background, with text on top only. A camera moves over every shot. The hook is a product overview: it opens close on a module, pulls back to the dashboard hub with seven modules, then pushes into the hub. The middle follows one lead (Neha Singh) across the real screens: each opens whole, zooms into the feature and back out, with infographic cards popping up beside it, and chapters are joined by match cuts. The end is a 3D deck of the screens under the Pulsefit sign-off. It is built as live React (no video file, no screenshots).

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
- `src/story.jsx`: the whole piece, with a `camera(keys, u, V)` that fits frame rects into the view and eases zoom in log space. Also the overview hook, top captions, `CamScreen` (a screen under the camera, plus cursor), `Pop` (supporting cards), the four flow chapters with match cuts, and the end deck.
- `src/infographics.jsx`: the supporting cards: missed follow-ups, days since due, lead status breakdown, status change, price per month, quarterly total ring, members at a glance, and expiring subscriptions.
- `src/stage.jsx`: the single pastel background.
- `src/App.jsx`: the clock, layout choice and scaling, embed mode, and the player.

## Responsive
- **Layouts:** two compositions, landscape (1920×1080 stage) and portrait (1080×1920 stage, used when width/height is below 0.9). Each is scaled to fit the viewport.
- **Placement:** text is always on top. The camera frames feature rects inside a view area below it, with a soft-masked top edge. Supporting cards sit in the two lower corners.
- **Background:** drawn in viewport space, so the colour always fills the screen.

## Controls
- **Keys:** Space plays/pauses, R restarts, ←/→ seek 1s, H hides the player.
- **Script API:** `window.__pulsefit.seek(t) / play() / pause() / t / duration` for frame capture.
- **Embed mode** (`window.__EMBED__ = 1` or `?embed`): no controls, paused on the poster frame (3.4s) until the page posts `showcase:play`, and stops on `showcase:pause`. With `prefers-reduced-motion` it stays on the poster frame.
