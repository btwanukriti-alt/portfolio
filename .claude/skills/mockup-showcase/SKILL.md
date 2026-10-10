---
name: mockup-showcase
description: Turn Anukriti's case study data into a visual-first portfolio page, with a short description at the top and a long gallery of professional UX mockups below. Use when she wants the visuals, mockups, gallery layout or page build for any of her five case studies, or when she shares a Behance or agency-site reference to match. Continues the work started with case-study-editor and src/data/caseStudies.ts.
---

# Mockup showcase

**Read `references/requirements.md` first. It is Anukriti's rule list and overrides anything below that disagrees.**

Continue from `case-study-editor` (copy and decisions) and `src/data/caseStudies.ts` (the content for all five projects, with a visual list per project). This skill is the visual step: mockups, gallery, page.

## The page

- **Top:** the description only. Title, hook, one info line (label, company, dates, role, team, outcome), the two paragraphs, the standout idea. Nothing longer.
- **Bottom:** the modules (see below), stacked, 8 to 10 images. About 80% visual. Very little text, and none on the images except a module's own title block.
- Rhythm and look are fixed by the reference analysis below. Do not invent a different style.
- **Read `references/design-language.md` first.** It sets the ground (it follows the product's UI mode, dark or light), the colour rules, the geometry and the build recipe. `references/start-prompt.md` is the prompt for a new session.

## Reference analysis (DONE, from Anukriti's 17 screenshots, 7 Oct 2026)

Sources she sent: Behance "Stratus CRM", "Dialin" (AI phone and chat system), "Fynix" (finance, green), and a "ZeeNovo" healthcare case study. The sites themselves are blocked from the cloud session, so this comes from her screenshots only. If she sends more, add to this list.

**What they all share**
- **Clean and organised.** Every image is one calm module on a very light neutral ground (about #EEEFF3, sometimes a soft lilac or blue wash). Nothing floats randomly. Lots of empty space.
- **Plates.** Content sits on large rounded plates (radius about 48 to 56px): a light grey gradient plate with a soft white inner rim, and often a white card inside it. Plates in one module share radius, gap and padding. Plates may crop their content at an edge (a card cut off at the right or bottom edge) to show scale and depth.
- **One feature per image.** A component is enlarged and shown alone: a calendar card, a balance card with its Deposit and Send buttons, a list of cards, a chart card, a menu, a search panel. Real components, not whole screens.
- **Spreads.** Two columns. Left: one phone (real device frame, black bezel, dynamic island), straight or turned slightly in 3D, cropped by the plate edge. Right top: the same feature enlarged as a component. Right bottom: a solid colour block in the product's colour, with a light-weight white title (about 48 to 56px) and a two-line description. The text lives only in this block.
- **Bento.** A grid of plates of different sizes, each holding one component, cropped at the edges (integration cards, chat list, status menu, search panel, AI replies).
- **Callouts.** Dashed lines with a small dot link a floating pill or chip to the card it belongs to. No numbered pins, no captions pasted on the image.
- **Brand module.** The logo on a construction grid (dashed guides, spacing numbers), the app icon as a rounded square (alone in concentric squares, or in a dock row with other icons), and the palette.
- **Colour.** One product colour per case study (green Fynix, purple Dialin, periwinkle Stratus). The colour block, the highlights and the buttons use it. Everything else is neutral.
- **Real UI only.** Avatars are real photos. Numbers are plausible sample data.

## Module types (use these; mix them in this order)

1. **Spread:** phone left, enlarged component right top, colour block with title and description right bottom. Mirror it for the next one.
2. **Spotlight:** one component enlarged on one plate, optionally with a dashed callout.
3. **Bento:** 3 to 5 component plates in an uneven grid, cropped at the edges.
4. **Brand module:** the logo on a full-width plate with a full construction (dashed guides, circles and diagonals on the mark, clear space, numbered measurements derived from the drawing), then the app icon and the palette on a second module. Never crop the logo.
5. **Process (only with real earlier versions):** the real earlier frames flat in one plate next to the final, labelled "earlier layouts".
6. **Motion:** a still from the showcase video, as the hero.

## Never (these were all done wrong on the first Zync attempt)

- Never show a screen just because it exists. Pick the 5 or 6 features worth highlighting and make each an image.
- Never tilt, skew or float cards. No perspective planes, no vignettes. Depth comes only from cropping, plates, device frames and soft shadows.
- Never paste caption pills or numbered pins on the images.
- Never use whole-screen photos of the app as the main idea. Use components.
- Never ship before comparing against the reference analysis above, point by point.
- Never take the ground from `project.color` (that is the work-card strip and the video ground). A dark UI gets a dark ground; a light UI gets `#EEEFF3`.
- Never use a big slab of one colour (purple, mint) as the title block on a dark ground. The product colour is an accent.
- Never change the card video, `project.color` or any colour she didn't mention.
- Never show the modules and the page in one go: modules first, wait for her OK.

## Process

1. Load the project's entry from `src/data/caseStudies.ts`. Its `visuals` list says what exists (`ready`, `export`, `make`, `missing`).
2. Pick 8 to 10 modules from the list above. The first spread leads with the standout idea.
3. For each, write: the source frame, the module type, the plate layout, and the title block text (title of 6 words or fewer, description of 20 words or fewer).
4. Build the modules. In the cloud session Figma's image host is blocked, so render them from HTML: the screens as HTML (see `scripts/mockups/`), cloned into plates, exported with Playwright as 2400px JPEGs. Photos come from Figma screenshots of the image layers (`get_screenshot`, base64). Or build them in Figma through the Figma MCP (load `figma-use` first).
5. The page is `src/components/GalleryCaseStudy.tsx`, fed by `src/data/galleries.ts`. Read the Next.js docs in `node_modules/next/dist/docs/` before changing code (see AGENTS.md; run `npm install` first if `node_modules` is missing).

## Honesty rules (carry over from case-study-editor)

- No invented metrics, quotes, research, users or launches. Never write "shipped," "live" or "users" unless she says so.
- Every number visible in a mockup is sample data from the design. Say so in the caption.
- Placeholder content (fake testimonials, stock portraits, "250 users" copy) is labelled or replaced, never presented as real.
- Before and after only where a real earlier version exists.
- NDA project: no name, no competitor name, and blur or crop anything that identifies it. Permission to show the screens is still to be confirmed.
- No competitor names in any copy.
- Voice: concise, specific, direct. Never "seamless," "delightful," "user-centric," "leveraging."

## Where things stand (handoff)

- Skill `case-study-editor`: short format, two paragraphs maximum.
- Data `src/data/caseStudies.ts`: five projects. Zync is wired to the new page.
- **Zync is built** in the module style above: `src/components/GalleryCaseStudy.tsx`, `src/data/galleries.ts`, images in `public/case-studies/zync/`, generator in `scripts/mockups/`. Use it as the template for the other four.
- Still open for Zync: the card video still shows the earlier screens; the logo mark is a 170px render (ask for the SVG).
- **SSH client is built** (renamed, no project name anywhere): `public/case-studies/ssh-client/`, generator and spec in `scripts/mockups/ssh-client/`. Desktop product, so laptop frames replace phones. Its old card video was dropped (it showed the earlier UI); the mark is a redraw, ask for the original SVG.
- Design language and the start prompt are in `references/`. The SSH client is the template for a dark UI, Zync for a light UI.
- **Pulsefit CRM is built** (software and website): `public/case-studies/pulsefit-crm/`, generator in `scripts/mockups/pulsefit/`, the logo is the original vector (`public/brand/pulsefit-mark.svg`). See section 9 of the design language.
- Other projects still use the old slide-carousel page. Next: College ERP, Jaadu 2.0.
- Open items from `fixBeforePublishing` in the data file still apply to the other four.

Start a new session with `references/start-prompt.md`.
