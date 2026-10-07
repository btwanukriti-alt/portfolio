# Start prompt

Paste this into a new session, then paste the Figma link after "Figma:".

---

Use mockup-showcase. Figma: 

Work out which project this is from the link and `src/data/caseStudies.ts`. First run `git fetch --all`, then read `.claude/skills/mockup-showcase/SKILL.md` and `references/design-language.md` from the newest branch that has them. The SSH client (`scripts/mockups/ssh-client/`, `src/data/galleries.ts`) and Zync are the templates.

1. Audit the frames at full size. Fix placeholder data, wrong totals, typos and cramped nav in HTML, not Figma.
2. Set the ground from the product's UI mode (dark or light) and take colours from `get_variable_defs`.
3. Build 8 to 10 modules: spreads, spotlights, bento, logo construction, icon and palette. Components only. Callouts are a dashed line, a dot and a chip. No pins, legends or captions on images.
4. Check on a contact sheet, show me the modules, and wait for my OK.
5. Then wire the page, lint, build, look at it, push and open a PR.

Replies under 100 words. Ask only if blocked. Don't touch `project.color`, the card video or any colour I didn't mention. If the PR is merged, branch from `main` again.
