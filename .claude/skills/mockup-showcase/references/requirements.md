# What Anukriti wants from case-study mockups

Her rules, collected from the Pulsefit, SSH client, College Management and Zync rounds (Oct 2026). Read this before touching any mockup. Follow it exactly.

## 1. Before you build
- Ask her to **select the frames in Figma**, then read the selection (`get_metadata` with no node id lists it).
- **Filter.** Do not use every frame she sends. Pick the one flow that matters and the screens that tell it.
- **Tell her the plan and the copy first** (module list, titles, one-line descriptions, tooltip text). Build only after she says go.
- Ask about anything unclear. Do not guess on names, NDA, before/after or logos.

## 2. Her UI is the UI
- **Keep her layouts.** Rebuild her screens as they are: same structure, sidebar, tabs, buttons, cards. Never redesign the screen.
- Allowed changes: modern colours, slightly rounder corners, cleaner borders, spacing, and real UX fixes (button hierarchy, one primary action per view, consistent radius). She will say when she wants more.
- **Fix the content:** typos, wrong units, totals that do not add up, repeated rows, placeholder text. Data is placeholder but must look realistic and vary from row to row and level to level.
- Buttons use the normal radius (about 12 to 14 px), never pill-shaped unless her design is.

## 3. Names and NDA
- NDA projects: **never write the product or client name anywhere**: site copy, mockups, alt text, file names, PR titles, commit messages.
- Replace real client and college names with made-up placeholders (for example "Vertex Group").
- Hide vendor marks on old screens (for example "Powered by NEXUS").
- Check the work card, hero image and showcase video too, not just the gallery.

## 4. What a module looks like
- **Components first.** Take components out of the screens, enlarge them, and show them as a flow with arrows. Whole screens or phones only where they add context, usually one per module.
- **A flow, not a pile.** Each image tells one step of the journey (problem to solution, or step 1 to step 2 to step 3).
- **Text tile:** short, only as tall as its text. Deep brand colour, white text, small coloured step label. No giant colour slabs. A wide tile across the top works well for full-width modules.
- **No empty space that throws off balance, and no filler.** Never add a component (KPI card, toast) just to fill a gap. If nothing useful fits, change the layout instead.
- **No cropped frames** when showing a full screen. A full screen is shown whole.
- **Phones:** correct device frame (border-box, even bezel), at a size where the text can be read.
- Before and after: the old screen must be big enough to read, shown dimmed, with a red "Before" chip; the new one with a green "After" chip.
- Website: her original frame, exactly as designed, uncut, no wrapper.

## 5. Tooltips (notes)
- **Explain the design decision**, in plain words: what the UI does and why it helps.
  - Good: "When it fills up, Book turns into Join waitlist". "A dashed goal line shows which days you drank enough". "Every level opens as a drawer on top".
  - Bad: labels like "Burned, by activity", or empty lines like "Pick a plan".
- Short, one line, no jargon, no semicolons.
- Only where they explain something. Dashed line from the note to the exact element. Lines must not cross other notes or wander across the UI.

## 6. Copy in text tiles
- Title: 3 to 6 words, says what the feature is ("Renew expiring plans").
- One or two simple sentences that say what is on the screen and what the user does.
- Never clever, never generic, never marketing.

## 7. Colour and ground
- The ground and plates must **support the UI**: light UI on a soft light wash; dark UI on neutral near-black (like Linear or Raycast), never navy-blue plates under grey UI.
- One brand colour for tiles and accents. No yellow plates, no coloured frame plates.
- Full-frame plates radius about 28, windows about 12 to 14.

## 8. Publishing
- Show the images, wait for her OK. **Publish and merge only when she says so.**
- Give changed images new file names (`v2-`, `v3-`) so browsers do not show cached copies.
- Remove helpers and files that the change leaves unused, run tsc, lint and build before merging.

## 9. How to talk to her
- Under 100 words. Say what changed or what you need.
- When she says something looks bad, find the real cause (sizing bug, too much colour, screens instead of components) and fix that, not the symptom.
