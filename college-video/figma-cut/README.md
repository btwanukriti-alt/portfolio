# College management, Figma-style showcase (11s)

An 11s looping UX showcase for the College Management card, built from the Pulsefit reference (`pulsefit-video/figma-cut`): one lilac canvas inside a black selection frame, Figma editor details, one unnamed cursor, captions on top only. Live React, no screenshots. Storyboard: `../college-storyboard.md`.

## Run / build
- `npm install`
- `npm run dev` previews the piece with player controls (Space, R, ←/→, H).
- `npm run embed` builds a single-file `dist/index.html` and writes `../../public/showcase/college-management.html`, the card video and case-study hero.

## Structure
- `src/lib.js`: easing, keyframes, UI tokens, `BG`, the scene timeline and stage sizes.
- `src/ui.jsx`: the rebuilt UI: Financial Overview window, KPI / Leave Type / Alert cards, the drill-down sheets (`SheetCard`), `Breadcrumb`, `StatChip`, module tiles.
- `src/scenes.jsx`: Intro, Flow and Close, with layouts for `land` (1920×1080) and `port` (1080×1920).
- `src/stage.jsx`, `src/fig.jsx`, `src/App.jsx`: unchanged from the reference (stage, editor vocabulary and cursor, clock/embed/player).

Script API: `window.__showcase.seek(t) / play() / pause() / t / duration`.
