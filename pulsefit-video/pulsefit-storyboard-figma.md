# Pulsefit: Figma-style showcase storyboard (v5, 33.4s loop)

This is the Pulsefit card video for the portfolio's Selected Work boxes and the case-study hero.

**v5 changes, from feedback on v4 ("colours too bright, use more UI screens"):**
- **Calmer look:** the bold colour stages are gone. The whole piece sits on one calm Figma canvas: soft grey #E9EBF0, a dot grid that pans and zooms with the camera, and faint blue and lavender light in two corners.
- **More screens:** it is now a camera journey across **seven real Pulsefit screens** rebuilt from the file: Leads Table, Leads Dashboard, Members Dashboard, Plans, Staff Table, Workout Plan and Add Equipment.
- **Figma details:** multiplayer cursors with name tags, frame names, blue selections, purple component labels, comment pins and the canvas toolbar.
- **Motion:** smooth zoom-to-frame camera flights with a small zoom-out dip on long moves, plus snappy headline reveals.
- **Type:** Inter Tight for headlines and Poppins for the product UI.

| Time | Beat | Copy | Visual |
|---|---|---|---|
| 0:00–0:05 | Overview | GYM MANAGEMENT / **Run the whole gym from one place.** ("one place." on a soft blue highlight) | The canvas with all seven frames and their names, plus the toolbar. Four teammates' cursors (Anu, Apurva Jha, Shikhar Tiwari, Neha Singh) work across the frames. Apurva clicks the *Leads Table* frame and it is selected (1440 × 860). |
| 0:05–0:11 | Leads Table | LEADS / **Turn every lead into a member.** | The camera flies into Leads Table. Apurva clicks ··· on Neha Singh's row. The design's menu opens (Mark as Converted · Mark as Lost · Delete). Apurva hovers and clicks *Mark as Converted*, the status chip turns from Hot to **Converted**, and the row tints green. |
| 0:11–0:16.6 | Leads Dashboard | LEAD PERFORMANCE / **Know which leads convert.** | The camera flies to Lead Performance. The KPIs count up (New Leads 234 · Conversion Rate 34% · Demo Booking Rate 23% · Lost Leads 65), the Lead Flow Trend lines draw and the Lead Source bars grow. Shikhar hovers Week 3 and the tooltip shows 67 New Leads · 45 Demo Booked · 27 Converted · 12 Drop-offs. |
| 0:16.6–0:22.2 | Members Dashboard | MEMBERS / **Every member, at a glance.** | The KPIs count up (234 · 12 · 42 · 26 · 34). Shikhar clicks Robert Fox's Expiring Subscription row, which is selected and tinted. Apurva Jha (his assigned trainer) comments: *Robert Fox · Plan A expires today*. |
| 0:22.2–0:27.4 | Plans | PLANS / **A plan for every member.** | Active Plans grid (Monthly, Quarterly, Half-Yearly, Annual, PT Starter, PT Pro, Yoga Monthly, Zumba Monthly). Neha hovers **Quarterly**, which lifts and is selected as *Plan Card*. She comments: *Quarterly · 94 active users*. |
| 0:27.4–0:30.4 | Staff · Workouts · Equipment | **And the rest of the gym.** | The camera pans across Staff Table, Workout Plan and Add Equipment, with Anu's cursor travelling along. |
| 0:30.4–0:33.4 | Outro | ALL IN ONE / **Everything your gym runs on.** | The camera pulls back to the whole canvas, all cursors return, and all frames are selected together. Loops to the overview. |

**Layouts:**
- **Landscape:** a 16:9 stage, where the camera frames whole screens.
- **Portrait:** a 9:16 stage, where the camera frames the key part of each screen, so the UI stays readable on phones.
- The canvas always fills the viewport edge to edge.

## Data and refinements (for review)
**Data sources:**
- **Values:** all values come from the Pulsefit Figma section (317:129218): Leads Table 4, Lead_Dashboard, Members_Dashboard, Plan List, Staff Table, Workout and Equipments.
- **Names:** cursor and comment names are people from the file.

**Refinements:**
- **Avatars:** initials replace stock photos.
- **Sidebar:** "Excercise" and "Workouts" are unified as **Workouts**.
- **Workout Plan cards:** the design's placeholder title "Workout Name" is replaced with each card's goal (Weight Loss, Muscle Gain…).
- **Lead Flow Trend:** Week 3 uses the tooltip's values (67 / 45 / 27 / 12). The drawn Converted point sits a little lower in the design.
- **Leads Table:** after "Mark as Converted" the status shows **Converted**. That status label comes from the dashboard's Lead Status Breakdown; the table design doesn't show this state.
- **Comments:** the comment texts are written for the video, but only restate data on screen.

**Left out:**
- the Plans screen's third row (to keep cards readable);
- Leads Dashboard sections below the charts (Lead Status Breakdown, Agent Performance, Recent Leads, Conversion Sources).

**Earlier cuts:** v4 (bold colour stages) is in git history; v3 is `PulsefitShowcase.jsx`.
