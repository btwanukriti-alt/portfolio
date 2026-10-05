# Pulsefit: Figma-style showcase storyboard (v6, 37s loop)

This is the Pulsefit card video for the portfolio's Selected Work boxes and the case-study hero.

**v6 brief (from feedback):**
- solid pastel colours;
- one flow, told as a story, not a tour of unrelated screens;
- a proper intro;
- component infographics supporting the UI;
- only the best screens, polished where needed.

**The flow:** one lead's journey, told with Neha Singh, a lead from the file (#3051, Hot, assigned to Apurva Jha). She moves from a missed follow-up, to converted lead, to new member on the Quarterly plan, to renewal three months later.

**Look:**
- **Stages:** each chapter has one solid pastel stage: lavender #E7E1FF, sky #D9E8FF, mint #D4F2E4, peach #FFE3D3 and butter #FFF0C4.
- **Chapter changes:** each new chapter opens with a Figma "draw a frame" wipe. A teammate's cursor drags a frame in the next pastel out to full screen.
- **Screens:** each chapter shows one real screen in a window that rises and tilts into place, with a teammate's cursor doing the step.
- **Lifted cards:** that step's component lifts out of the screen into a purple-labelled component card, joined to its source by a dashed line.
- **Recurring cards:** the same four cards form the intro and outro infographic.
- **Type:** Inter Tight for headlines and Poppins for the UI.

| Time | Chapter | Copy | Visual |
|---|---|---|---|
| 0:00–0:05.5 | Intro (lavender) | LEAD TO MEMBER / **From first lead to loyal member.** | The flow infographic builds node by node with dashed links: 01 Follow up (Missed Follow-ups: Neha Singh · Hot · Missed by 5 days) → 02 Convert (Hot → Converted) → 03 Onboard (Quarterly · Recurring · ₹5,886) → 04 Renew (Expires in 2 days · Renew). Anu's cursor walks along the flow. |
| 0:05.5–0:12 | 01 Follow up (sky) | **Never miss a follow-up.** | The Leads Dashboard (Leads Tasks). Apurva Jha clicks **Follow-up** on Neha's Missed Follow-ups alert, which rings red. The alert lifts out as the *Follow-up alert* card. |
| 0:12–0:18.5 | 02 Convert (mint) | **Convert a lead in two clicks.** | The Leads Table. Apurva clicks ··· on Neha's row, then **Mark as Converted**. The status turns from Hot to Converted and the row tints green. The *Lead status* card lifts out (Hot → Converted). |
| 0:18.5–0:26 | 03 Onboard (peach) | **Plan and billing in one step.** | The **Convert to Member** modal over the dimmed table. Neha's details type in (Neha · Singh · +91 99021 44870 · Apurva Jha). The view scrolls to Plan Info, where Anu opens Select Plan (Monthly ₹2,000 / Quarterly ₹5,400 / Half-Yearly ₹9,600 / Annual ₹16,800) and picks **Quarterly**. The total counts up: ₹5,400 + ₹486 tax = **₹5,886**, joining fee waived. The *Plan & total* card lifts out and Anu clicks **Add Member**. |
| 0:26–0:32.5 | 04 Renew · 3 months later (butter) | **Renew before a plan lapses.** | The Members dashboard: KPIs count up (234 · 12 · 42 · 26 · 34), and Neha's Quarterly plan expires in 2 days. Apurva clicks **Renew**. The *Expiring member* card lifts out. |
| 0:32.5–0:37 | Outro (lavender) | **Every step, in one place.** | The four flow cards return, each ticked green. Loops to the intro. |

**Layouts:**
- **Landscape:** the screen sits left and the lifted card in a clear column on the right.
- **Portrait:** the screen is cropped to the step, with the lifted card below it.
- **Background:** the pastel always fills the viewport.

## UI refinements (the brief allowed polishing the real UI)
- **Convert to Member modal:**
  - real lead data replaces the placeholders "Balaji / Nant / John Doe";
  - the plan picker lists the real plans from the Plans screen;
  - "Premium Memership" (typo, placeholder) becomes **Quarterly**;
  - the Lorem Ipsum helper text under the toggles is removed;
  - the billing note now matches the plan ("Billed every 3 months…" instead of "30-day cycle");
  - "Joining Fee (waived)" is labelled;
  - Apply Discount is off, so the total isn't muddied by a 0% discount.
- **Total:** ₹5,886 is Quarterly's ₹5,400 plus its ₹486 tax, both from the Plans screen. The design itself shows ₹00.00.
- **Expiring Subscription:**
  - placeholder plans "Plan A-E" become real plans (Monthly, Quarterly, Half-Yearly, Annual, PT Starter);
  - Neha's row uses her phone number and trainer from the Leads Table;
  - Aaron J. becomes Aaron Joseph.
- **Leads Table:** after Mark as Converted the status reads **Converted**. That status label comes from the dashboard's Lead Status Breakdown.
- **Avatars:** initials replace stock photos.
- **Story beats:** "3 months later" is a story device. Neha in Expiring Subscription with "2 days" is the design's own row.
- **Screens dropped as weaker or off-flow:** Staff Table (repeats the leads table), Workout Plan (placeholder names), Add Equipment (plain form) and Plans (the plan is picked inside the modal instead).
