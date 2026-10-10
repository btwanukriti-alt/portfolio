# Design language for the case-study mockups

Set by the Zync and SSH client work (Oct 2026). This is the taste Anukriti wants. Follow it; don't copy a reference, apply the idea.

## The idea
Calm, organised, one feature per image. Enlarged **components** (never whole screens) sit on **plates**, cropped by the plate edge to show scale. Depth comes from crops, plates, device frames and soft shadows only.

## 1. Ground follows the product's UI
- **Dark UI** (like the SSH client): dark ground `#0E0D16`; plates a lighter gradient `#2B2A42 → #1B1A2B` with an inset rim `rgba(255,255,255,.07)`; component cards keep the UI's own card colour plus a 1px rim `rgba(255,255,255,.09)`; shadow `0 18px 30px rgba(0,0,0,.55)`.
- **Light UI** (like Zync): ground `#EEEFF3`; plates `#F8F9FC → #E7E9F0` with a white inner rim; shadow `rgba(20,12,60,.22)`.
- Never take the ground from `project.color` in `projects.ts`. That is the work-card strip and the video's ground; don't change it unasked. (Mint under a dark purple UI was the mistake.)

## 2. Colour
One product colour per case study, used **small**: callout dots, the logo mark, chips, links. No big purple (or any single-colour) slabs unless she asks.
- Title block on a **dark** ground: light neutral `#ECEDF4`, title `#15141F` weight 300 at 58px, description `#55546B` at 25px.
- Title block on a **light** ground: the product colour with white text (the Zync pattern), unless she says otherwise.
- Take tokens from the Figma file (`get_variable_defs`), not by eye.

## 3. Geometry
Module canvas 1600px wide, rendered at 1.5x to 2400px JPEG. Plates and blocks radius 56, page margin 40, gap 20. Spread: plates 740x920, 740x560, block 740x340. Crop radius = the component's own radius x its scale. Enlarge a component at least 1.2x over its size on the screen.

## 4. Modules (8 to 10, in this order)
Spread, Spotlight, Bento, Spread (mirrored), Spotlight, Bento, Spread, Bento, Brand (logo construction), Brand (icon and palette).
- **Spread:** device left cropped by the plate edge, enlarged component right top, title block right bottom. Desktop product: laptop frame (scale 0.9, left 40, top 70, cropped at the right edge). Phones only when mobile frames exist.
- **Spotlight:** one component, one plate, up to two callouts.
- **Bento:** 3 to 5 plates, uneven grid, each holds one component, cropped at the edges. Never let two cards touch so they read as one.
- **Brand:** logo on a construction grid (guides, circles, rays, clear space, measurements read from the drawing, never invented), then the app icon in concentric squares and the palette. Never crop the logo.

## 5. Callouts and text
Dashed line (3px, round, `3 9`) ending in a dot in the product colour with a 3px white stroke, linked to a white pill chip (24px, weight 500, 8 words or fewer). Max two per module. **No numbered pins, no legends, no captions on the images.** Title block: title 6 words or fewer, description 20 words or fewer; only spreads carry one.

## 6. Content is real and clean
- Rebuild each screen as HTML from the Figma tokens, then fix the content: valid IPs, totals that add up, distinct names, no repeated placeholder rows, no typos, no personal names, no project or competitor name on an NDA project. Say "sample data" in the captions.
- Nothing invented: no metrics, users, quotes, "live", "shipped".
- A mark you redraw is a redraw. Say so and ask for the original SVG.

## 7. Build recipe
1. Audit the frames at full size. List content faults.
2. Rebuild the needed screens as HTML (see `scripts/mockups/ssh-client/screens-src/`), render at 3x with Playwright.
3. Compose modules from crops (`scripts/mockups/ssh-client/modules.html`), render to JPEG.
4. Check every module on a contact sheet. Fix before showing.
5. Show the modules. **Wait for approval before building the page.**
6. Page: add the project to `src/data/galleries.ts` (accent, deep, soft, tint, pop, font, mark, note, images), delete old slide images that show earlier UI or a name, keep the card video unless she says drop it.
7. Lint, build, look at the page, commit, push. If the PR is already merged, branch again from `main` and open a new PR (Vercel deploys `main`).

## 8. What went wrong before (don't repeat)
Whole screens as the main idea; numbered pins and caption pills; tilted or floating cards; a mint ground on a dark UI; a big purple block; guessing the skill instead of checking other branches (`git fetch --all`); removing her card video; changing colours she didn't mention; long replies (keep under 100 words).

## 9. Learned on the Pulsefit CRM (Oct 2026)
- **Order:** design system first (logo construction, then app icon and palette), then the product UI, then the website. Never interleave them. Show the software and the website the same way (spread, spotlight, bento).
- **One palette, from the logo.** Read the logo's own fills (`use_figma` read-only `exportAsync({format:'SVG_STRING'})`) and build the UI, website and palette from them, so nothing disagrees. Buttons use the product colour. Never black buttons.
- **Grounds:** neutral greys for the design system and the product; one soft tint for the website. Never yellow or cream grounds.
- **Title blocks:** the brand's deep colour (not the bright primary), small yellow bar on top. Bright blue slabs and the same blue on every element strain the eyes.
- **No type specimen module, no font showcase.** Fonts stay out of the gallery.
- **Charts only where they help.** Drop a chart module if she says so; keep heatmaps and tables.
- **Website:** rebuild it clean (the product name everywhere, no user-count claims, no third-party logos, no stock testimonials).

## 10. THE REFERENCE: Pulsefit v2 (approved 10 Oct 2026). Every project follows this.
Source: `scripts/mockups/pulsefit/v2/` (index.html, style.css, ui.js, modules.js, render.mjs). Images: `public/case-studies/pulsefit-crm/`.
- **Pick one real flow** from her selected Figma frames (Pulsefit: spot a lead, convert to member, plan, renew, email). Order the modules along it. Logo module first, website last.
- **Module = bento row + full frame below.** The row holds a short deep-blue text tile (only as tall as its text unless nothing useful fits) and one or two WHOLE components (a full card or full table, never a single button or row). Below it, the full screen in a browser window on a plate, uncropped. A module with a modal flow drops the full frame and goes full width, with the text tile inside the plate.
- **Never add filler.** No KPI cards or toasts just to fill space. If nothing adds value, leave the tile full height.
- **Tooltips only to explain a flow** (Pulsefit: only on lead to member: "Convert opens the member form", "5 of 6 fields come from the lead", "The total updates as you toggle"). Dashed elbow lines, no lines across UI. Never point at a button or selection state just to label it.
- **Copy: plain, short sentences that say what is on the screen.** Title 3 to 5 words ("Renew expiring plans"). One or two sentences ("This table shows plans ending this week. Click Renew or Remind."). No clever phrasing, no semicolons. Show the copy to her before rendering.
- **Modern UI:** rebuild the screens from her frames, Inter UI, 16px card radius, 1px borders, soft tags with dots, initials avatars. One filled primary button per view; row actions are secondary (outline) or ghost.
- **Colour:** ground is a soft blue to lilac wash; plates white to pale blue; text tiles deep brand colour with white text and a yellow step label. No yellow plates, no coloured frame plates. Full-frame plates radius 28, windows radius 12.
- **Website:** show her original website frame exactly as designed (export at full size with `get_screenshot`, saved from the tool-result blob), no wrapper, no rebuild.
- **Publishing:** new file names for changed images (`-v2`), or browsers keep the cached old ones.
