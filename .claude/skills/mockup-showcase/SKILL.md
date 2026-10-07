---
name: mockup-showcase
description: Turn Anukriti's case study data into a visual-first portfolio page, with a short description at the top and a long gallery of professional UX mockups below. Use when she wants the visuals, mockups, gallery layout or page build for any of her five case studies, or when she shares a Behance or agency-site reference to match. Continues the work started with case-study-editor and src/data/caseStudies.ts.
---

# Mockup showcase

Continue from `case-study-editor` (copy and decisions) and `src/data/caseStudies.ts` (the content for all five projects, with a visual list per project). This skill is the visual step: mockups, gallery, page.

## The page

- **Top:** the description only. Title, hook, one info line (label, company, dates, role, team, outcome), the two paragraphs, the standout idea. Nothing longer.
- **Bottom:** the visuals. 8 to 12 professional mockups in one long vertical gallery. Aim for 80% visual and 20% text.
- Reference style she wants: Behance's "Stratus CRM" case study and yourbrandmate.agency. The idea is a gallery of strong mockups that shows UX taste by highlighting the most important features only, with very little text.
- Captions are one line and state what the visual proves. On-image annotations are 8 words or fewer.

## Reference analysis (status: NOT DONE)

Both reference sites were blocked from the cloud session, so nothing about them has been analysed, and none of the section below is derived from them:
- https://www.behance.net/gallery/215887035/Stratus-CRM-SaaS-UX-UI-Dashboard-Design
- https://yourbrandmate.agency/

To do it, she either (a) adds `behance.net` and `yourbrandmate.agency` under Allowed domains in the environment's Network settings, or (b) shares screenshots of full pages. Then analyse and write the findings to `.claude/skills/mockup-showcase/references/analysis.md`:
- the order of the image blocks, and where the hero sits
- the share of text to image
- mockup types and device frames used, their scale, crops and zoom-ins
- background colours and gradients, padding, corner radius and shadow
- how a single feature is highlighted (callouts, numbered pins, crops)
- rhythm: how often a full-bleed screen alternates with a detail or a grid

Do not guess any of these. If the file doesn't exist, say the analysis is pending.

## Mockup types (general practice, to adjust once the references are analysed)

1. **Hero:** the strongest screen, large, on a soft gradient in the project's colour.
2. **Full-bleed screen:** one screen, edge to edge, no device frame.
3. **Detail crop:** one component zoomed in, so a single decision is the whole image.
4. **Annotated screen:** the screen plus 2 to 4 numbered pins with short labels.
5. **Before and after:** a split, only where a real earlier version exists (labelled "earlier version").
6. **Flow strip:** three or four screens in order, with arrows.
7. **Component or system board:** colours, type, components, states.
8. **Responsive trio:** desktop, laptop and mobile together, only where those frames exist.
9. **State grid:** default, empty, loading, error, success.
10. **Motion frames:** stills from the showcase video.

Rules: one idea per image; consistent corner radius, shadow and padding across the gallery; one background family per project (use the project's colour from `src/data/projects.ts`); real screens only, never invented UI.

## Process

1. Load the project's entry from `src/data/caseStudies.ts`. Its `visuals` list says what exists (`ready`, `export`, `make`, `missing`).
2. Pick 8 to 12 mockups. Lead with the standout idea. Use a mockup type from the list for each.
3. For each, write: the source frame, the mockup type, the background, the on-image annotation (8 words or fewer), the caption.
4. Build the mockups in Figma through the Figma MCP (load the `figma-use` skill before `use_figma`), or give her exact export steps. If a Figma file returns "no edit access", ask her to share it or export the frames.
5. Rebuild `src/components/CaseStudy.tsx` so the description is at the top and the gallery is below. Read the Next.js docs in `node_modules/next/dist/docs/` before changing code (see AGENTS.md; run `npm install` first if `node_modules` is missing).

## Honesty rules (carry over from case-study-editor)

- No invented metrics, quotes, research, users or launches. Never write "shipped," "live" or "users" unless she says so.
- Every number visible in a mockup is sample data from the design. Say so in the caption.
- Placeholder content (fake testimonials, stock portraits, "250 users" copy) is labelled or replaced, never presented as real.
- Before and after only where a real earlier version exists.
- NDA project: no name, no competitor name, and blur or crop anything that identifies it. Permission to show the screens is still to be confirmed.
- No competitor names in any copy.
- Voice: concise, specific, direct. Never "seamless," "delightful," "user-centric," "leveraging."

## Where things stand (handoff)

Branch `claude/intelligent-cannon-afj5pq` on `btwanukriti-alt/portfolio`. Done so far:
- Skill `case-study-editor`: short format, two paragraphs maximum.
- Data file `src/data/caseStudies.ts`: five projects (Zync, Pulsefit CRM, an NDA SSH client, a college group ERP, Jaadu 2.0), each with hook, info line, paragraphs, standout, delivered, next, visuals with status, homepage card, `confirm` and `fixBeforePublishing`.
- Not yet wired into the site. `CaseStudy.tsx` still shows the old layout.

Figma files: Portfolio `YN66oKLDCT31APRGoynI72` (Zync, CRM, SSH client, college ERP, website); Jaadu `Hc75tMn9m8J1WDN1fHPiVd`; All work compilation `9XYyhDlDVJt7F592Z9MaWd` (no access from the cloud session).

Open items that affect visuals:
- **Zync:** fix 13/02 chart labels, Steve versus Sandra, the "0" check-in count.
- **Pulsefit CRM:** website brand reads "Fit Flow"; "250 users" and testimonials are placeholders; no real dates.
- **SSH client:** public name appears on the live site, in the URL and in the showcase file. Rename everything; the project and competitor names stay out of copy.
- **College ERP:** only 4 of 8 solution slides exist; the final drill-down order is unconfirmed; "before" screens read "Powered by NEXUS."
- **Jaadu:** typos on screen ("Breif", "TRIGGEER", "MAX DO", "PROFT FACTOR", "Z core"), regime numbers sum to 115, identical Library rows; website and motion files are not in the shared Figma.
- **Dates:** four of five projects still need real dates.

Start a new session with: "Use mockup-showcase on [project]."
