# PulseFit: UX showcase storyboard (v3, 20s agency cut)

The video runs 16:9 at 20 seconds and plays in real time (PACE 1.0). Type is Poppins throughout. The stage matches the product: an off-white base with a drifting mesh of PulseFit blue, soft violet and logo-yellow light, plus a slowly panning masked grid. Scenes change with a skewed brand-blue wipe that has a yellow trailing edge. Headlines rise in through a mask. Easing is cubic in-out throughout, with no bounce.

| Time | Scene | Copy | Visual |
|---|---|---|---|
| 0:00–0:03 | Opening | *Leads, members, plans and campaigns in one place.* | The landing hero rebuilt as three isometric glass layers. They lift apart, the trend line draws, bars grow and the "Table" rows fill. |
| 0:03–0:07.4 | Leads (infographic) | LEADS / **Turn every lead into a member.** | Alex Johnson's lead card enters, Lead Score counts to 92/100 and the Lead Growth ring sweeps. The cursor clicks **Convert to Member**, the connector draws through the convert node, and **Assign Plan** arrives (Plan A · 1 month · ₹1,000) with Total Amount counting to ₹1,100. |
| 0:07.4–0:12 | Members (real screen) | MEMBERS / **Every member, at a glance.** | The refined Members dashboard. KPIs count up and an *Active members 234* callout appears. The camera eases in and scrolls to Attendance Analysis, where the heatmap fills hour by hour. The cursor lands on the peak cell, and a *Peak attendance 85 · Sun 11 AM* callout appears. |
| 0:12–0:16.4 | Plans (infographic) | PLANS / **Create a plan in three steps.** | The Create Plan stepper and Billing Info. 1 Month(s) and ₹1,000.00 are typed, Taxes switches on at 10%, and Sub Total counts to ₹1,100.00. The cursor clicks **Next**, the stepper advances, and the **Plan A · Body Building** card slides in. |
| 0:16.4–0:18.8 | Overview (infographic) | ALL IN ONE / **Everything your gym runs on.** | A brand-blue workspace hub. Connectors draw out to the seven modules from the sidebar (Members, Leads, Staff, Plans, Communication, Equipments, Workouts), which pop in on a slowly turning orbit while data dots travel along the spokes. |
| 0:18.8–0:20 | Close | (no text) | The isometric layers reprise. |

**Controls:** Space plays or pauses · R restarts · ←/→ seeks 1s · H hides the controls · `window.__zync.seek(t)` / `.pause()` for frame capture.

**Earlier cuts:** v2 (33s, every module) is saved as `PulsefitShowcase-v2-33s.jsx`.

## Refinements made to the source screens (still open for review)
- **Task Dashboard:** this screen has no Tasks nav item. The sidebar and breadcrumb say "Communication". It's not used in this cut.
- **Sidebar:** "Excercise" and "Workouts" are unified as **Workouts**.
- **Plan cards:** the design had placeholder "Plan Name" and "Category". The card shows **Plan A** and **Body Building**, both taken from elsewhere in the file. The Billing fields use the plan card's values (1 month, ₹1,000, ₹100 tax → 10%, total ₹1,100).
- **Landing page:** one chip says "State Lead Alerts" and should be "Stale". The logo says **Fit Flow** while the copy says PulseFit.
- **Members:** Frozen Members lists Alex John twice, and Attendance Drop Alert repeats values. Those tables are left out.
