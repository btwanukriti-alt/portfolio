# Pulsefit: Figma-style showcase storyboard (v4, 26.4s loop)

This is the Pulsefit card video for the portfolio's Selected Work boxes and the case-study hero. Its style follows Figma's product launch videos:

- **Stages:** bold, flat colour stages in Pulsefit's own palette: canvas grey, brand blue #1F4FF4, yellow #F5BD25 and violet #7358F5.
- **Shapes and texture:** big geometric shapes pop in and drift, over a fine grain.
- **Editor details:** Figma's own vocabulary. Multiplayer cursors carry name tags, selections have blue handles, components get purple labels. Prototype noodles, comment pins, pink auto-layout spacing and the canvas toolbar also appear.
- **Scene changes:** each scene opens with a **"draw a frame" wipe**. A frame with selection handles grows out to fill the screen.
- **Motion:** snappy ease-outs, small spring pops on landing, and smooth in-out for camera and wipes.
- **Type:** Inter Tight for headlines and Poppins for the product UI.

| Time | Scene | Copy | Visual |
|---|---|---|---|
| 0:00–0:06.4 | Hook (canvas) | **Run the whole gym from one place.** ("one place." on a yellow sticker) | Empty canvas with the toolbar. Anu's cursor drags out *Frame 1* (live size label), which fills with brand blue and rounds its corners. The headline rises in. Teammates drag in three components (Apurva Jha: **Lead Score** card, Alex Johnson 92/100 with ring; Shikhar Tiwari: **KPI Card**, Active Members 234, +21 since last week; Neha Singh: **Plan Card**, Plan A · Body Building · 1 month · ₹1,000), each selected while dragged. Stickers pop in. Then the frame grows to fill the screen. |
| 0:06.4–0:13.4 | Leads (blue) | LEADS / **Turn every lead into a member.** | Alex Johnson's lead card pops in, selected as a component (400 × 294). Lead Score counts to 92/100. Apurva Jha clicks **Convert to Member** (press + ripple). The card slides aside and a blue prototype noodle ("On click") draws to **Assign Plan** (Plan A · 1 month · ₹1,000). Total Amount counts to ₹1,100. |
| 0:13.4–0:20.4 | Members (yellow) | MEMBERS / **Every member, at a glance.** | The Members dashboard tilts up into place, and the KPIs count up (234 · 12 · 42 · 26 · 34). The camera pushes into Expiring Subscription. Shikhar Tiwari clicks Robert Fox's row, which tints and selects. Apurva Jha (his assigned trainer) pins a comment: *Robert Fox · Plan A expires today*. |
| 0:20.4–0:26.4 | All in one (violet) | ALL IN ONE / **Everything your gym runs on.** | The seven sidebar modules (Members, Leads, Staff, Plans, Communication, Equipments, Workouts) drop onto the canvas as tilted instances. They then snap into an auto-layout grid with pink 24px gap markers and a *Modules · Hug × Hug* selection, and all four cursors gather round. A canvas-grey frame is dragged out to fill the screen, which brings back the empty canvas (loop). |

**Layouts:** landscape (16:9 stage) and portrait (9:16 stage, stacked) compositions. Each fits any viewport, and the stage colour always fills edge to edge.

**Data notes:** names and values come from the Pulsefit Figma section (317:129218) and match the earlier v3 cut: lead card, Assign Plan, plan card, Members KPIs, Expiring Subscription rows, and sidebar modules. Cursor names are people from the file (Anu is the workspace owner; Apurva Jha, Shikhar Tiwari and Neha Singh appear in the members and staff tables).

## Refinements and open points
- **Sidebar:** "Excercise" and "Workouts" are unified as **Workouts**, as in v3.
- **Plan card:** shows **Plan A / Body Building** in place of the design's placeholder "Plan Name / Category".
- **Lead card:** the sub-label "New lead" is added under Alex Johnson.
- **Members comment:** the comment text is written for the video. It restates row data (Robert Fox · Plan A · Today); no new value is shown.
- **Frame and component labels:** labels such as "Frame 1", "Lead Card", "KPI Card" and "Modules" are editor props, not names from the file.
- **Left out:** the attendance heatmap's "peak" figure, because the heat data has several equal maxima, and the duplicate rows in Frozen Members.
