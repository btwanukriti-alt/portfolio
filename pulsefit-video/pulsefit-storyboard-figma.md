# Pulsefit: UX showcase storyboard (v9, 39.5s loop)

This is the Pulsefit card video for the portfolio's Selected Work boxes and the case-study hero.

**Brief:**
- an agency-style UX showcase with real camera movement (zoom in and out on features);
- infographics and components supporting the UI;
- a proper hook, middle and end, with text on top only;
- the hook is a product overview;
- one background colour and no Figma editor overlays.

**Look and motion:**
- **Background:** one pastel, #E6EBFA.
- **Text:** a centred headline at the top (Inter Tight 60px, words rising out of a mask) with a quiet sub line.
- **Camera:** each shot is framed by a camera that fits feature rects into the view below the text, easing zoom in log space so pushes and pulls feel even.
- **Supporting cards:** infographic cards pop up in the lower corners while the camera holds on a feature.
- **Match cuts:** the camera dives into an element and the next chapter dissolves in, already zoomed on the same element, then pulls out.

| Time | Part | Text | Camera and visuals |
|---|---|---|---|
| 0:00–6:00 | **Hook:** product overview | **Run your whole gym from one place.** *Leads, members, plans and staff, in one product.* | Opens close on the **Leads** module (234 new leads). Pulls back to the Leads Dashboard hub as lines draw out to all seven modules: Members (234 active), Plans (12 active), Staff, Communication, Equipments and Workouts. Then pushes into the hub, which becomes the first screen. |
| 0:06–0:13 | Follow up | **Never miss a follow-up.** *Missed and stale leads surface on their own.* | Leads Dashboard whole, then a push into Leads Tasks and on to **Missed Follow-ups**. The cursor clicks Follow-up on Neha Singh. Cards: **Missed follow-ups: 4** (longest wait, Neha, 5 days) and **follow-up due → 5d** timeline. Dives into Neha's alert. |
| 0:13–0:20 | Convert | **Convert a lead in two clicks.** *Mark it converted right from the table.* | Match cut into Neha's row in the Leads Table. The cursor clicks ···, then **Mark as Converted**, and the camera pulls out to the whole table. Cards: **Hot → Converted** and the **Lead status breakdown** (Cold 100%, Warm 60%, Hot 30%, In progress 10%, Converted 5%). Dives into the row. |
| 0:20–0:28.5 | Onboard | **Plan and billing in one step.** *Pick a plan. Tax and total work themselves out.* | Match cut into the Convert to Member name fields as they type. Pans down to Plan Info: Select Plan, then **Quarterly**. Pans to Total, which counts to ₹5,886. Cards: **Price per month** (₹2,000 / ₹1,800 / ₹1,600 / ₹1,400) and a **Quarterly total** ring (₹5,400 plan + ₹486 tax). Pulls out to the whole form, the cursor clicks Add Member, and the camera dives into the button. |
| 0:28.5–0:35 | Retain | **Keep members coming back.** *Expiring plans surface before they lapse.* | Match cut into Neha's row in Expiring Subscription. The cursor clicks **Renew**. Card: **8 expiring subscriptions** with an avatar stack. Pulls out to the whole Members screen as the KPIs count up. Card: **Members at a glance** (Active 234, Pending payments 42, Biometrics missing 34, Frozen 26, New joinees 12). Pulls far out. |
| 0:35–0:39.5 | **End** | **Pulsefit.** *From first lead to loyal member.* | The four screens rise into a tilted 3D deck under the mark. Fades back to the hook. |

## Data notes and UI refinements
**Card data:**
- **Infographic cards:** values come from the screens. Missed Follow-ups badge 4; "Missed by 5 days"; the Lead Status Breakdown chart; the Plans screen prices; the Members KPIs; the "8 expiring" badge.
- **Price per month:** each plan's price divided by its months.
- **Total:** ₹5,886 is Quarterly's ₹5,400 plus ₹486 tax.
- **Hook facts:** 234 new leads (Leads Dashboard), 234 active members (Members) and 12 active plans (Plans screen). The other modules carry descriptions, not figures.

**UI refinements:**
- **Convert to Member modal:**
  - real lead data replaces the placeholders, and the plan picker lists the real plans;
  - the "Memership" typo and the lorem-ipsum text are removed;
  - the billing note matches the plan, the joining fee is waived and the discount is off.
- **Expiring Subscription:** "Plan A–E" become real plan names, Neha's row uses her Leads Table details, and Aaron J. becomes Aaron Joseph.
- **Avatars:** initials replace photos.
- **Leads Table:** the Converted status label comes from the Lead Status Breakdown.
