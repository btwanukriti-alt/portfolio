# Showcase video: design and motion requirements

These are the requirements Anu settled on for the portfolio's product showcase videos, over many rounds of feedback on the Pulsefit cut (lilac, 10s) and the College Management cut (blue, 18s). The latest reference build is `college-video/figma-cut`, with its storyboard at `college-video/college-storyboard.md`.

Each rule includes the reason behind it, so it can be applied to a new product rather than copied blindly.

**The split that matters:**
- **The style is fixed:** the canvas, the Figma vocabulary, type, motion language and pacing.
- **The story is not:** which scenes, which flow and which layouts are chosen fresh for every product.

## Contents
1. Purpose
2. Story and structure (per product)
3. Pacing and length
4. Canvas and background (fixed style)
5. Figma editor vocabulary (fixed style)
6. Text
7. UI content and data
8. Layout
9. Motion language (fixed style)
10. Patterns that worked
11. Do not use (rejected in feedback)
12. Engineering notes
13. Done checklist

---

## 1. Purpose
The video plays in the portfolio's Selected Work cards and at the top of the case study.

- **The test:** someone seeing it **once, for the first time**, understands what the product is and what it does, and wants to open the project link.
- **The feel:** a designer's work on a Figma canvas, polished, calm and specific.
- **When in doubt:** clarity beats cleverness, and fewer things shown slowly beat many things shown fast.

## 2. Story and structure (per product)
- **Plan the story for this product.** Don't reuse another video's sequence, layouts or interactions by default. Ask: what is the one idea a newcomer must get, and which real screens and components show it best?
- **3–4 scenes, one idea each.** A good shape is:
  1. an **opening** that shows the product's core idea through one real component;
  2. the **main screen** (dashboard), drawn as a large frame with real component cards landing around it;
  3. **one key flow**, the product's signature interaction, in **2–3 steps max**;
  4. optionally **one more feature** that a viewer would care about.
- **Example (College Management):**
  1. Opening: five colleges fly into the "All Colleges" workspace switcher.
  2. Dashboard: Financial Overview.
  3. Key flow: stacked drawer sheets, college → B.Tech fees.
  4. Extra feature: staff directory, where a card opens a profile.

  It's an example, not a template.
- **No separate conclusion scene.** End on the last feature and loop. Every ending tried was rejected: a modules auto-layout grid, a platform tree, a filter panel, summary tiles with bars, and a navy summary with columns.
- **Two compositions:** landscape (1920×1080 stage) and portrait (1080×1920 stage), chosen by the viewport's aspect and each scaled to fit. Portrait gets its own layout (usually stacked), not a squeezed landscape.

## 3. Pacing and length
- **Calm enough for a first-time viewer.** "Too fast-paced for anyone new" was explicit feedback. Each scene needs time to land and to be read before it leaves.
- **Length:** about **15–20s** for 3–4 scenes; at least 10s. Show fewer things rather than speed motion up.
- **One slow-down knob.** Scene lengths live in scene-local seconds (`LEN` in `lib.js`), and a single `SLOW` factor (1.3 in the college cut) stretches every scene uniformly. To calm a cut, raise `SLOW` instead of retiming every animation.
- **Simplify before slowing:** cut a click, a level or a floating chip before adding time. The college drill-down went from three clicks to two, and its moving stat chip was removed.

## 4. Canvas and background (fixed style)
- **One plain pastel for the whole video, with no shapes.**
  - **Colour:** soft blue `#CFDDFF` (latest, College Management) or lilac `#DCCFFF` (Pulsefit), as asked. Never change colour between scenes.
  - **Texture:** a gentle white key light and faint grain (about 12% overlay) are fine.
  - **No shapes:** no drifting shapes ("weird shapes" were removed) and no dot grid.
- **Black selection frame around the canvas,** so the whole video reads as a selected Figma frame:
  - a 1.5px `#111` border, inset from the viewport edges by about 2.2% of the short side, clamped to 10–28px;
  - white square handles with a 1.5px `#111` edge at the four corners.
- **The canvas is clipped inside that frame.** Nothing crosses it. Outside is a plain light margin matching the hue: `#F2F5FC` for blue, `#F4F2FA` for lilac. Scale the composition to the inner rect.

## 5. Figma editor vocabulary (fixed style)
- **Selection boxes:** blue `#0D99FF`, 2px, with white square corner handles and a size label in a blue pill (`520 × 544`, `Hug × Hug`). Show one while an element is created, lands or is clicked, then fade it.
- **Component labels:** purple `#9747FF` text with the four-diamond icon above the selection (`Staff Card`, `Drawer · Level 1`, `College Switcher`).
- **Frame name label:** small grey text above a drawn frame's top-left (e.g. "Financial overview").
- **Prototype hotspots:** the clicked row outlines in blue with an "On click → Open drawer" pill. Fade the hotspot **before** the next layer covers the row, or it reads as a ghost.
- **Prototype noodle:** a blue curve with a start dot, an arrowhead and an "On click" pill. Use it when two separate objects are linked side by side; skip it when the result covers the source.
- **Auto-layout spacing:** pink `#F24822` hatched gap markers with a value pill. Use them only where a real auto-layout group exists.
- **Cursor:** **one** dark cursor (`#111` with a white edge) with **no name tag**. It presses (scales slightly) and shows a soft ripple on click.
- **No Figma toolbar.**

## 6. Text
- **Text sits at the top only,** centred:
  - an uppercase **eyebrow** (Poppins 500, about 19px, `0.16em`, `#3D3A5C`) naming the area, e.g. *College management software*, *Dashboard*, *Finance*, *Staff*;
  - a one-line **title** (Poppins 500, about 62px, `-0.035em`, `#0F1222`), wrapping to two lines at about 76px on portrait.
- **Plain, true copy. No exaggeration.** For example: "One workspace for all your colleges.", "Drill down from college to fee.", "Find anyone across your colleges."
- **No product name or logo** anywhere, in the UI, the titles or the page title, unless asked. Describe the category instead. Remove brand names from data too ("CMR Engineering College" → "Engineering College", no "Dhondi ID").

## 7. UI content and data
- **Rebuild screens and components as vector React from the Figma file.** Never embed screenshots. Use only well-designed screens, and improve them to production quality.
- **Fix placeholders.** Designs often repeat one card or row ("Jayvion Simon, EMP-101234" ×9, "₹41.50 Cr" in every row). Replace them with distinct, realistic people and values, and use initials avatars instead of photos.
- **Use one consistent data set across all scenes.** Every drill-down level adds up to its parent, and the same figure is the same everywhere: the dashboard total equals the drill-down total, and percentages match amounts. Fix the design's own contradictions (e.g. "80% collected" when the numbers give 72%).
- **List every change:** each invented, corrected or reworded value goes in the storyboard and the report.
- **Show frames whole at rest.** Don't crop a screen so it looks like a fragment.

## 8. Layout
- **Fill the space under the title.** Content is large and centred, with no big empty band at the bottom and nothing that looks unfinished. The dashboard frame is about 1340×618 on landscape.
- **No cramped or oddly proportioned containers.** A single small window with drawers cropping each other read as "weird screen sizes"; use full, properly proportioned cards instead.
- **Group re-centring:** when content grows (a stack, a panel sliding aside), move the whole group so it stays centred.
- **Check** 1920×1080, 1366×768, 1280×800, 390×844 and 820×1180.

## 9. Motion language (fixed style)
- **Easing:**
  - entrances: snappy ease-out (expo);
  - landings: a small back pop;
  - moves: smooth ease-in-out;
  - no bounce beyond a slight pop.
- **Reveal:** counters count up to the design's values, bars fill, paths draw by length, and rows stagger in.
- **Depth over cuts:** a new layer arrives on top while earlier ones step back (smaller, slightly tilted, faded into the background colour). Cards land with a small tilt and settle.
- **Scene changes:** everything in a scene fades and lifts out **together**, then the next fades in on the same background. No wipes, no leftovers.
- **Purity:** every frame is a pure function of the clock `t`, so the video is seekable, pausable in the embed and capture-exact.

## 10. Patterns that worked (reuse the style, adapt to the product)
- **Core idea as a component:** scattered items fly in and dock into the real component that unifies them (colleges → workspace switcher).
- **Drawn frame:** the cursor drags out a frame with a live size label, the frame fills with the dashboard, and three real cards land around it, each selected as it lands.
- **Stacked sheets for drill-downs:** each level is a full card that pushes earlier ones back into a fanned stack. A breadcrumb trail above grows with each level, replacing the side spines a drawer design would use.
- **Grid → detail:** a grid of distinct cards pops in, the cursor lifts and selects one, the grid fades back and a detail panel slides in with counting stats.

## 11. Do not use (rejected in feedback)
- **Canvas:**
  - saturated or dark stages, or a different background per scene;
  - muted grey canvases;
  - drifting decorative shapes and the dot grid.
- **Figma chrome:**
  - the toolbar;
  - multiplayer cursors, name tags and teammates' comment pins.
- **Branding and copy:**
  - the product's logo or name;
  - exaggerated copy.
- **Endings:**
  - any separate conclusion: a modules grid, a hierarchy/platform tree, a filter dropdown panel, summary tiles, a summary dashboard;
  - the "All in one" modules close.
- **Containers:**
  - a single cramped prototype window with drawers cropping each other;
  - drawers shown as narrow side spines.
- **Clutter:** floating chips that move between layers in a flow, and anything added just to fill.
- **Pacing:** fast pacing, compressed timelines, more than 2–3 steps in one flow.
- **Story:**
  - camera tours across many screens;
  - isometric layer intros;
  - screens just placed on a background with no motion story.
- **Typography:** captions in a side column, and big bold headlines with highlight pills.

## 12. Engineering notes
- **Project:** Vite + React with `vite-plugin-singlefile`. `npm run embed` writes `public/showcase/<slug>.html` with `window.__EMBED__ = 1` (no controls, paused on `POSTER` until the page posts `showcase:play`).
- **Poster:** set `POSTER` to a frame that explains the product at a glance; the dashboard with its cards landed works well.
- **Scene timing:**
  - `SCENES` is built from `LEN` and `SLOW` in `lib.js`;
  - `local(t, id)` returns scene-local seconds;
  - each scene returns `null` outside its window;
  - remember to add any new scene to `App.jsx`.
- **Figma MCP:** `get_metadata` on a big section overflows the context, so parse the saved result with `jq`/Python. Screenshots need `enableBase64Response: true`.
- **Verification:**
  - Playwright lives in `/opt/node-tools/node_modules`, and Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`;
  - there is no PIL, so build contact sheets as an HTML image grid and screenshot it;
  - seek with `window.__showcase.seek(t)` after `pause()`.

## 13. Done checklist
- [ ] Would a first-time viewer get what the product is, and want to open it?
- [ ] Is the story planned for *this* product, in 3–4 scenes with one idea each and flows of at most 2–3 steps?
- [ ] Is it calm (about 15–20s, via `SLOW`), with every scene held long enough to read, and does it loop seamlessly?
- [ ] Is it one plain pastel background, with no shapes and no dot grid, inside the black selection frame with handles and nothing crossing it?
- [ ] Is there one cursor with no name, and no toolbar?
- [ ] Is the text on top only, plain and not exaggerated, with no product name or logo?
- [ ] Are the screens real (from Figma), with placeholders fixed, one consistent data set, and every change listed?
- [ ] Is the content large, filling the space, with no cramped windows, at every checked size?
- [ ] Do scenes leave together, with no ghosts or leftovers, and is there no separate conclusion?
- [ ] Is the embed built, does it pause off screen, is the poster frame meaningful, and is the preview artifact updated?
