---
name: figma-showcase-video
description: Make Anu's 10-second Figma-style product showcase videos for her portfolio's Selected Work cards and case-study heroes. They have one lilac pastel canvas inside a black Figma selection frame, blue selection boxes, component labels, a prototype noodle, auto layout, a single unnamed cursor, captions on top only, and a calm three-scene loop (intro that says what the product is, one key flow, modules close). Use this whenever Anu asks for a project video, showcase, motion graphic, UX animation, card video or case-study hero animation, or sends a Figma link for "the next project". Also use it to revise one of these videos, even if she only says "make it like the Pulsefit one" or gives terse feedback on an existing cut.
---

# Figma-style showcase video (portfolio)

These are short product showcase loops for Anu's portfolio. They play inside the full-screen **Selected Work** cards (`src/components/Work.tsx`, via `public/showcase/<slug>.html`) and as the case-study hero.

The requirements below took many rounds of feedback to settle. **Read `references/requirements.md` before designing anything.** It has the full spec, the reasons behind each rule, the list of rejected directions, and the done checklist.

## The look, in one breath
- **Length and pace:** about 10s, calm, looping.
- **Canvas:** one bright Figma-like pastel (lilac `#DCCFFF`) for the whole video, with a few soft pastel shapes and no dot grid. It is clipped **inside** a black Figma selection frame (1.5px `#111`, corner handles) that is inset from the edges, with a plain margin outside.
- **Figma details inside:**
  - blue `#0D99FF` selection boxes with handles and size labels;
  - purple `#9747FF` component labels;
  - a prototype noodle and pink auto-layout spacing;
  - **one dark cursor with no name tag**;
  - no toolbar.
- **Text:** at the **top only**, an uppercase eyebrow and one plain title line. No product name or logo unless asked, and no exaggerated claims.
- **Structure:**
  1. **Intro:** the category ("Gym management software") and one plain line. The cursor draws a frame that fills with the real dashboard, and real component cards land around it.
  2. **Feature:** one key flow from real components, with a prototype noodle and a counting result.
  3. **Close:** the modules snap into an auto-layout grid.
- **Transitions:** scenes fade out **together** (frames included) and the next fades in on the same background. No wipes.

## Workflow
1. **Gather.** Get the project's Figma link. Use the Figma MCP to read the file: `get_metadata` for structure, then `get_screenshot` with `enableBase64Response: true` because figma.com asset URLs are blocked here. Choose:
   - the **hero dashboard** for the intro;
   - **three real component cards** with true values;
   - **one key flow** (the product's signature interaction, built from 2–3 components);
   - the **module list** from the sidebar.

   State the picks in one short message, then build. Don't ask for confirmation unless something is truly ambiguous.
2. **Build from the reference implementation.** Copy `pulsefit-video/figma-cut/` to `<project>-video/figma-cut/` and change only:
   - `src/ui.jsx`: the product's UI rebuilt as vector React, with initials avatars and refined placeholders; remove the logo and wordmark;
   - `src/scenes.jsx`: the hero frame, cards, flow and modules, plus copy and positions for `land` and `port`;
   - `src/lib.js`: the UI colour tokens, if the product differs; keep `BG` lilac unless asked;
   - `embed.mjs`: the output slug, e.g. `public/showcase/<slug>.html` from `src/data/projects.ts`.

   Leave `stage.jsx` (background and black canvas frame), `fig.jsx` (editor vocabulary and cursor) and `App.jsx` (clock, embed mode and player) as they are. They encode the settled look and behaviour.
3. **Lay out to fill the space.** Centre content in the area under the title, so there's no big empty bottom. Check landscape and portrait separately.
4. **Verify with Playwright** (Chromium is at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`).
   - Capture contact sheets by seeking with `window.__showcase.seek(t)` after `pause()`, at 1920×1080, 1366×768, 1280×800, 390×844 and 820×1180.
   - Look specifically at each scene's last 0.5s, where leftover elements read as glitches. Also check the bottom of each scene for empty space and the canvas frame for anything crossing it.
   - Check the embed: load `public/showcase/<slug>.html` in an iframe, post `showcase:play` and `showcase:pause`, and confirm the clock moves and stops with no page errors.
5. **Ship.**
   - Run `npm run embed` in the project's `figma-cut`.
   - Publish a preview artifact: strip the built `dist/index.html` to `<title>`, `<style>`, `<div id="root">` and `<script>`, and use a generic title with no product name.
   - Write `<project>-video/<project>-storyboard-10s.md`, covering time, scene, copy, visuals, data notes and the list of UI refinements.
   - Commit and push to the session branch.
6. **Report briefly.** Give the preview link and a short scene table, and list every refinement or invented value: placeholder names replaced, derived numbers, typos fixed.

## Taking feedback
Anu's feedback is short and direct. Treat each note as a rule for this and future videos. Apply it everywhere it's relevant, not only where it was spotted, and add it to `references/requirements.md` if it's new. When a note conflicts with an earlier one, the latest wins; update the requirements file so the rule stays current.
