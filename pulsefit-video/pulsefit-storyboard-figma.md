# Pulsefit: showcase storyboard (v7, 28s loop)

This is the Pulsefit card video for the portfolio's Selected Work boxes and the case-study hero.

**v7 brief (from feedback on v6, which "looked like AI slop"):**
- one background colour;
- frames never cropped;
- no title text;
- no Figma editor overlays (purple component borders, frame names);
- just simple UI screens, the card flow and the form flow.

**Look:**
- **Background:** one solid pastel, #E6EBFA, edge to edge.
- **Screens and cards:** shown whole on white with a soft shadow. Each enters with a short rise and fade, then exits the same way.
- **Cursor:** one plain dark cursor with a press and a soft ripple.
- **Not used:** captions, labels, selection boxes, connectors and wipes.

**The flow:** Neha Singh (lead #3051 in the file) goes from missed follow-up to converted lead, to new member on the Quarterly plan, to renewal.

| Time | Scene | Visual |
|---|---|---|
| 0:00–0:06.5 | Card flow | Four cards rise in, in order: **Missed follow-up** (Neha Singh · Hot · Missed by 5 days · Follow-up), **Lead status** (Hot → Converted), **Plan** (Quarterly · Recurring · ₹5,886) and **Renewal** (Quarterly · expires in 2 days · Renew). The cursor clicks Follow-up, the status flips to Converted, the total counts up, and the cursor clicks Renew. Landscape shows the cards in a 2 × 2 grid; portrait shows one column. |
| 0:06.5–0:13 | Leads Table (whole screen) | The cursor clicks ··· on Neha Singh's row, then **Mark as Converted**. Her status turns from Hot to Converted and the row tints green. |
| 0:13–0:21.5 | Form flow: Convert to Member | The modal over the dimmed Leads Table, whole (portrait shows the modal on its own). Neha's details type in. The cursor opens Select Plan and picks **Quarterly**, the total counts to **₹5,886.00**, and the cursor clicks **Add Member**. |
| 0:21.5–0:28 | Members (whole screen) | The KPIs count up (234 · 12 · 42 · 26 · 34). The cursor clicks **Renew** on Neha Singh's Quarterly row (expires in 2 days), and the row tints. Loops to the cards. |

## UI refinements (the brief allowed polishing the real UI)
- **Convert to Member modal:**
  - real lead data replaces the placeholders "Balaji / Nant / John Doe";
  - the plan picker lists the real plans from the Plans screen, and "Premium Memership" (typo) becomes Quarterly;
  - the Lorem Ipsum helper text is removed;
  - the billing note matches the plan ("Billed every 3 months…");
  - the joining fee is marked waived, and Apply Discount is off.
- **Total:** ₹5,886 is Quarterly's ₹5,400 plus its ₹486 tax, both from the Plans screen. The design shows ₹00.00.
- **Expiring Subscription:** placeholder plans "Plan A-E" become real plan names, Neha's row uses her phone number and trainer from the Leads Table, and Aaron J. becomes Aaron Joseph.
- **Leads Table:** after Mark as Converted the status reads Converted. That label comes from the dashboard's Lead Status Breakdown.
- **Avatars:** initials replace stock photos.
- **Flow cards:** these are new compositions that reuse the screens' components and data.
