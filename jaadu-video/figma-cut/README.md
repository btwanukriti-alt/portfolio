# AI trading platform (Jaadu 2.0), Figma-style showcase (19.9s)

A 19.9s looping UX showcase (calm pace, `SLOW` in `src/lib.js`) for the Jaadu 2.0 card. It is built from the College Management reference (`college-video/figma-cut` on the skill's branch): one plain soft-blue canvas inside a black selection frame, Figma editor details, one unnamed cursor and captions on top only. It is live React with no screenshots. Storyboard: `../jaadu-storyboard-figma-cut.md`.

## Run / build
- `npm install`
- `npm run dev` previews the piece with player controls (Space, R, ←/→, H).
- `npm run embed` builds a single-file `dist/index.html` and writes `../../public/showcase/jaadu-2.html`, the card video and case-study hero.

## Structure
- `src/lib.js`: easing, keyframes, UI tokens (dark trading UI, Geist), `BG`, the scene timeline and stage sizes.
- `src/ui.jsx`: the rebuilt UI: `PromptBox` and `ResearchResults` (Quant Lab research), `AlertForm`, `Notifications` and `NoteRow`, `FunnelCard`, `NightsCard` and `StrategyCard`.
- `src/scenes.jsx`: Research, Alert, Notify and Discoveries, with layouts for `land` (1920×1080) and `port` (1080×1920).
- `src/stage.jsx`, `src/fig.jsx` and `src/App.jsx` are unchanged from the reference (stage, editor vocabulary and cursor, clock/embed/player).

Script API: `window.__showcase.seek(t) / play() / pause() / t / duration`.
