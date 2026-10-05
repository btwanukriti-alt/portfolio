---
name: figma-showcase-video
description: Make Anu's Figma-style product showcase videos for her portfolio's Selected Work cards and case-study heroes. A calm 15–20s loop of 3–4 scenes, planned fresh for each product, in one shared design and motion style: one plain pastel canvas inside a black Figma selection frame, with blue selection boxes, purple component labels, prototype hotspots, a single unnamed cursor and captions on top only. Use this whenever Anu asks for a project video, showcase, motion graphic, UX animation, card video or case-study hero animation, or sends a Figma link for "the next project". Also use it to revise one of these videos, even if she only says "make it like the college one" or gives terse feedback on an existing cut.
---

# Figma-style showcase video (portfolio)

These are short product showcase loops for Anu's portfolio. They play inside the **Selected Work** cards (`src/components/Work.tsx`, via `public/showcase/<slug>.html` from `src/data/projects.ts`) and as the case-study hero.

**The goal:** someone seeing it once, for the first time, understands what the product is and what it does, and wants to open the project. Calm and clear beats clever and fast.

The rules below took many rounds of feedback (Pulsefit, then College Management). **Read `references/requirements.md` before designing anything.** It has the full spec, the reasons behind each rule, the list of rejected directions, and the done checklist.

## The look, in one breath
- **Length and pace:** 15–20s, calm, looping. Every scene gets time to land and be read. Use the `SLOW` factor; don't squeeze motion to hit a length.
- **Canvas:** one plain pastel for the whole video, with no shapes and no dot grid. It's soft blue `#CFDDFF` (latest) or lilac `#DCCFFF`, as asked. It is clipped **inside** a black Figma selection frame (1.5px `#111`, white corner handles) inset from the edges, with a plain light margin outside.
- **Figma details inside:** blue `#0D99FF` selection boxes with handles and size labels; purple `#9747FF` component labels; blue prototype hotspots ("On click → Open drawer"); **one dark cursor with no name tag**; no toolbar. Use pink auto-layout spacing only where it's natural.
- **Text:** **top only**: an uppercase eyebrow and one plain title line. No product name or logo, and no exaggerated claims.
- **Story, not template:** each video's scenes, flow and layouts are chosen **fresh for its product**. Don't copy another video's sequence. What stays the same is the design and motion style. A good story usually has 3–4 scenes, each with one idea:
  - an **opening** that shows the product's core idea through a real component;
  - its **main screen**;
  - **one key flow**;
  - optionally **one more feature**.

  Pick whatever components and interactions explain *this* product best. The College Management cut is one example (switcher → dashboard → stacked drawers → staff directory), not a pattern to repeat.
- **No separate "conclusion".** End on the last feature, then loop. Modules grids, platform trees, filter panels and summary dashboards as endings were all rejected.
- **Transitions:** each scene fades and lifts out **together**, then the next fades in on the same background. No wipes.

## Workflow
1. **Gather.** Get the project's Figma link and read it with the Figma MCP. Use `get_metadata` for structure; on big sections it overflows, so parse the saved file with `jq`/Python and list the top-level frames. Then use `get_screenshot` with `enableBase64Response: true` (figma.com asset URLs are blocked here). Choose:
   - what the product **is** and the one idea a first-time viewer must get;
   - the 3–4 scenes that tell that story, each built from real, well-designed screens and components;
   - for any flow, **2–3 steps, no more**.

   State the scene plan in one short message, then build. Ask only if something is truly ambiguous; for example, when a link is shared with no message, ask what to do with it.
2. **Build from the reference implementation.** Copy `college-video/figma-cut/` (the latest) to `<project>-video/figma-cut/`. `pulsefit-video/figma-cut/` is the older lilac three-scene version. Change:
   - `src/ui.jsx`: the product's UI rebuilt as vector React, with initials avatars and refined placeholders; remove the logo and wordmark;
   - `src/scenes.jsx`: the scenes, with copy and positions for `land` and `port`;
   - `src/lib.js`: the UI colour tokens, `BG`, the scene list `LEN` (scene-local lengths), `SLOW` and `POSTER`;
   - `embed.mjs`: the output slug, e.g. `public/showcase/<slug>.html`;
   - `index.html`: a generic `<title>`.

   Leave `stage.jsx` (background and black canvas frame), `fig.jsx` (editor vocabulary and cursor) and `App.jsx` (clock, embed mode and player) as they are. They encode the settled look and behaviour.

   Reuse the **style primitives**: the `Title`, `Selection`, `Cursor`, hotspot, and the easing and pop patterns. Write **new scenes** for the new product's story; the reference scenes are examples of the style, not a script.
3. **Use one consistent data set.** Designs often repeat placeholders (the same name, ID or amount in every row) or contradict themselves between screens. Make one set where every level adds up to its parent, and where the same figure is the same in every scene. List every invented or corrected value.
4. **Lay out to fill the space.** Content is large and centred under the title, with no big empty band and no cramped, oddly proportioned windows. Design landscape and portrait separately; portrait usually stacks vertically.
5. **Verify with Playwright** (Chromium is at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`; `playwright` is under `/opt/node-tools/node_modules`; PIL isn't installed, so build contact sheets as an HTML grid and screenshot it).
   - Capture by seeking `window.__showcase.seek(t)` after `pause()` at 1920×1080, 1366×768, 1280×800, 390×844 and 820×1180.
   - Look at each scene's last 0.5s for leftovers, the bottom for empty space, the canvas frame for anything crossing it, and moving elements for ghosts (e.g. a hotspot left on a row after a drawer has covered it).
   - Check the embed: load `public/showcase/<slug>.html` in an iframe, post `showcase:play` and `showcase:pause`, and confirm the clock moves and stops with no page errors.
6. **Ship.**
   - Run `npm run embed`.
   - Publish or update the preview artifact: strip the built `dist/index.html` to `<title>`, `<style>`, `<div id="root">` and `<script>`, use a generic title, and keep the same file path so the URL stays.
   - Keep `<project>-video/<project>-storyboard.md` current (time, scene, copy, visuals, data notes, every refinement).
   - Commit and push to the session branch.
7. **Report briefly.** Give the preview link and a short scene table, list every refinement or invented value, and mention the length when it differs from what was asked.

## Taking feedback
Anu's feedback is short and direct ("looks bad", "boring", "remove last part"). Treat each note as a rule for this and future videos, and apply it everywhere it's relevant. When she says a part looks bad, **replace or remove it; don't polish it**. When she shares a reference, ask what to take from it, then borrow ideas, not branding. Add new rules to `references/requirements.md`; when a note conflicts with an earlier one, the latest wins.
