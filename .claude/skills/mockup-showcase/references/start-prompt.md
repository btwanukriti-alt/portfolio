# Start prompt for the next project

Paste this into a new session, filling the brackets.

---

Use mockup-showcase on **[Pulsefit CRM | College ERP | Jaadu 2.0]**. Figma: **[link]**.

Before anything: `git fetch --all` and read `.claude/skills/mockup-showcase/SKILL.md` and `references/design-language.md` from the newest branch that has them. Use the SSH client (`scripts/mockups/ssh-client/`, `src/data/galleries.ts`) and Zync as the templates.

Do this, in order:
1. Audit the frames at full size. List what looks unprofessional (placeholder data, wrong totals, typos, cramped nav, wrong icons). Fix it in HTML, not Figma.
2. Pick the product's mode (dark or light) and set the ground from the design language. Pull tokens with `get_variable_defs`.
3. Build 8 to 10 modules: spreads, spotlights, bento, logo construction, icon and palette. Components, not screens. Callouts only as dashed line, dot and chip. No pins, no legends.
4. Check on a contact sheet. Show me the modules. Stop and wait for my OK.
5. After my OK: wire the page, lint, build, look at it, push, open a PR.

Rules: replies under 100 words. Ask only if blocked. Don't touch `project.color`, the card video or any colour I didn't mention. NDA or placeholder content follows the honesty rules in the skill. If the PR is merged, branch from `main` again.
