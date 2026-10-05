# Pulsefit: UX showcase storyboard (v8, 35.5s loop)

This is the Pulsefit card video for the portfolio's Selected Work boxes and the case-study hero.

**Brief:**
- an agency-style UX showcase with a proper hook, middle and end, transitions and infographics;
- the hook is a product overview;
- one background colour, screens never cropped, and no Figma editor overlays.

**Look:**
- **Background:** one pastel, #E6EBFA.
- **Captions:** a left column (portrait: on top). A 64px Inter Tight headline, lines rising out of a mask, with a quiet Poppins sub line.
- **Screens:** shown whole, white with soft shadows. One plain cursor drives them.
- **Transitions:**
  - the overview hub grows into the first screen;
  - Neha's alert card travels into her table row (shared element);
  - the row grows into the Convert to Member form (shared element);
  - the form pushes out as Members slides in;
  - the screens settle into a 3D deck.

| Time | Part | Caption | Visual |
|---|---|---|---|
| 0:00–0:05.5 | **Hook:** product overview | **Every lead. Every member. One place.** *Pulsefit runs a gym from first enquiry to renewal.* | The Leads Dashboard appears as a hub. Lines draw out to the seven modules, which pop in with a fact each: Leads (234 new leads), Members (234 active members), Plans (12 active plans), Staff (managers and trainers), Communication (email campaigns), Equipments (repair schedules), Workouts (workout plans). The modules drift away and the hub grows into the full screen. |
| 0:05.5–0:11.5 | Middle: follow up | **Never miss a follow-up.** *Stale and missed leads surface on their own, ready to act on.* | Leads Dashboard, whole. The cursor clicks **Follow-up** on Neha Singh (Missed by 5 days), and her alert card lifts and travels into her row in the next screen. |
| 0:11.5–0:17.5 | Middle: convert | **Convert a lead in two clicks.** *Mark a lead converted straight from the table.* | Leads Table, whole. The cursor clicks ···, then **Mark as Converted**: Hot changes to Converted and the row tints green. The row then grows into the form. |
| 0:17.5–0:25 | Middle: onboard | **Plan and billing in one step.** *Pick a plan. Tax and totals work themselves out.* | Convert to Member, whole. Neha's details type in, **Quarterly** is picked, and the total counts to **₹5,886.00**. A **Price per month** infographic rises beside it (Monthly ₹2,000 · Quarterly ₹1,800 · Half-Yearly ₹1,600 · Annual ₹1,400). The cursor clicks Add Member and the screen pushes away. |
| 0:25–0:31 | Middle: retain | **Keep members coming back.** *Expiring plans surface early, so renewals never slip.* | Members, whole, slides in. The KPIs count up and the cursor clicks **Renew** on Neha's Quarterly row (expires in 2 days). |
| 0:31–0:35.5 | **End** | **Pulsefit.** *From first lead to loyal member.* | The four screens settle into a tilted 3D deck beside the Pulsefit mark and name. Fades back to the hook. |

## Data notes and UI refinements
- **Price per month:** each plan's price on the Plans screen divided by its months (₹5,400 / 3 = ₹1,800, and so on).
- **Hook facts:**
  - "234 new leads" comes from the Leads Dashboard, "234 active members" from Members, and "12 active plans" from the 12 plan cards on the Plans screen;
  - the Staff, Communication, Equipments and Workouts notes describe what those modules' screens hold;
  - they are descriptions, not figures.
- **Convert to Member modal:**
  - real lead data replaces the placeholders, and the plan picker lists the real plans;
  - the "Premium Memership" typo and the lorem-ipsum helper text are removed;
  - the billing note matches the plan, the joining fee is waived and the discount is off.
- **Total:** ₹5,886 is Quarterly's ₹5,400 plus ₹486 tax. The design shows ₹00.00.
- **Expiring Subscription:**
  - "Plan A–E" become real plan names;
  - Neha's row uses her phone number and trainer from the Leads Table;
  - Aaron J. becomes Aaron Joseph.
- **Leads Table:** the Converted status label comes from the dashboard's Lead Status Breakdown.
- **Avatars:** initials replace photos.
