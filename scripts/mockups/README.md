# Mockup modules (HTML to JPEG)

Source for the Zync case study images in `public/case-studies/zync/`.

- `zync/screens.html`: the refined app screens as HTML (photos embedded).
- `zync/modules.html`: the gallery modules (plates, device frames, colour blocks). Replace `@MARK@` with a data URI of `gal/mark-white.png`.
- `zync/render.mjs`: Playwright script. Join `screens.html` (wrap its screens in `<div id="lib">`) with `modules.html`, open the result, and screenshot each `.mod` element at 1.5x as JPEG. See `.claude/skills/mockup-showcase/SKILL.md` for the module rules.
