# Portfolio site — handoff notes

React + Vite + TypeScript site built from the Figma file **Portfolio**
(`https://www.figma.com/design/YN66oKLDCT31APRGoynI72/Portfolio`, Figma account btw.anukriti@gmail.com).

Run: `cd C:\Users\anukr\portfolio` then `npm run dev -- --port 5180` → http://localhost:5180
(Start it in your own terminal — Claude Code's background server kept getting stopped for low memory.)

## What's built

| Section | Figma node | Notes |
|---|---|---|
| Hero | 376:174249 | Name, nav pill, glasses, handwritten note + arrow, tagline. Desktop scales the 1440×725 frame to the window (`--px` unit in `src/index.css`). |
| Glasses "focus pull" | storyboard section 342:143576 (rest = 03 — Cleared, 338:144084) | **Click glasses** → screens sharpen, glasses zoom past, sphere turns into place (smoothstep-eased, 1.6s; `useFocusPull.ts`). **Drag / swipe / two-finger scroll / arrow keys** look around 360° (with glide). **Pinch** (trackpad Ctrl+wheel, Safari gestures, touch; +/− keys) widens the view. **Click a screen** → it flies out full size (`Lightbox.tsx`); Back button, click or Esc returns it. Close = top-centre button or Esc. Page scroll locked while open. `?debug` shows wheel/pinch events (temporary). |
| Screen sphere | replaces the flat 6×5 mosaic (340:143576) | Screenshots on the inside of a sphere around the viewer (`ScreenSphere.tsx`, 9 rows, ~137 tiles), CSS 3D, off-screen tiles hidden each frame. Tiles = 5 placeholder screenshots repeated (`src/assets/mosaic/shot-1..5.jpg`) until real images are added. |
| Work cards | 156:14295 (5 "Zync C" cards) | Sticky stacking cards; covered card shrinks/dims. Rounded tops + peek added (not in Figma). "Firness" typo fixed. Open Project → case study. |
| About + Timeline | 156:14540 | Paper ink colours remapped to dark (ink #edeade, ink-2 #a6a49a). Timeline scrolls sideways on mobile. |
| Contact | 156:14595 | Placeholder email/phone. |
| Case study pages | layout 125:2 | Hash routes `#/work/<slug>`. Hero per project + presentation carousel (clickable drawn-in arrows, live counter patched over the stale drawn one, keys/swipe). |

Case study → slide source mapping (please confirm the ⚠ ones):

- `jaadu-2` — no presentation in Figma (no carousel)
- `fitness-tracker` — Zync — Case Study (7)
- `bosch-customer-experience` — Pulsefit — Case Study (10) ⚠ card shows Pulsefit
- `ssh-client` — SSH client — Case Study (16)
- `college-management` — Dhondi — The Solution (9, problem/solution alternating) ⚠

Project data lives in `src/data/projects.ts`; slides are `src/assets/case-studies/<slug>/slide-NN.jpg`.

## Your preferences (from this session)

- Match Figma exactly (sizes/positions); the layout must scale properly on any screen size.
- The focus animation is **click-triggered**, not scroll-driven, and rests on "03 — Cleared".
- Zooming out to see more screenshots is **pinch only**.
- Close lives in a top-centre button.
- Mosaic uses a black background and placeholder images repeated until originals are supplied.
- Work cards should stack on scroll.

## Still open / placeholders

- Real project descriptions, role/timeline, problem statements (all use layout placeholder copy; problem text is about insurance).
- Real email/phone in Contact; Resume link has no target.
- Real mosaic images; higher-res work card images (current crops are 1×).
- About notes 03/04 end in "…" in Figma.
- Row of 5 small bars under the case study hero (171:18728) was left out — purpose unknown.
- Remove the `?debug` pinch readout (`src/components/debugLog.ts`) once pinch is confirmed working on your laptop.
- Pinch on the user's Windows laptop was reported not working before a dev-server fix; not yet re-confirmed.
- Not a git repo yet.
