# PulseFit: 10s Figma-style showcase storyboard

This is the Pulsefit card video in the portfolio's Selected Work boxes and the case-study hero.

**Brief:**
- similar to the v3 PulseFit showcase (its feature flow and pace), but in Figma's style;
- bright Figma-like pastels;
- an intro a first-time viewer understands;
- calm, not fast-paced.

**Look:**
- **Background:** one bright pastel per scene: lilac #DCCFFF, sky #BFDBFF, butter #FFE79E. Each has a Figma canvas dot grid, soft pastel shapes (pink, peach, mint, violet) and light grain.
- **Figma editor details:** multiplayer cursors with name tags; blue selection boxes with corner handles and size labels; purple component labels; a prototype noodle; pink auto-layout spacing; a frame name label; the canvas toolbar.
- **Scene changes:** each scene opens with a Figma "draw a frame" wipe in the next pastel.
- **Text:** on top. An uppercase eyebrow over a 62px Poppins title, as in v3.

| Time | Scene | Copy | Visual |
|---|---|---|---|
| 0:00–0:03.6 | **Intro** (lilac) | PULSEFIT · GYM MANAGEMENT SOFTWARE / **Run your whole gym from one place.** | Anu's cursor draws a frame, *Pulsefit — Members*, with a live size label. It fills with the Pulsefit Members dashboard as the KPIs count up. Teammates drag product components in around it, each selected while dragged: Apurva Jha brings the Lead Score card (Alex Johnson 92/100), Shikhar Tiwari the KPI card (Active Members 234), and Neha Singh the Plan card (Plan A · 1 month · ₹1,000). The frame then grows into the next scene. |
| 0:03.6–0:07.6 | **Leads** (sky) | LEADS / **Turn every lead into a member.** | Alex Johnson's lead card pops in, selected as a component (400 × 294), and Lead Score counts to 92/100. Apurva Jha clicks **Convert to Member**. A blue prototype noodle ("On click") draws to **Assign Plan** (Plan A · 1 month · ₹1,000), which is selected as it lands, and the total counts to ₹1,100. |
| 0:07.6–0:10 | **Close** (butter) | ALL IN ONE / **Everything your gym runs on.** | The seven modules drop in as tilted instances and snap into an auto-layout grid. Pink 24px gap markers and a *Modules · Auto layout* selection appear as all four cursors gather. A lilac frame is dragged out, and the video loops to the intro. |

**Build:** in `figma-cut`, `npm run embed` writes the card embed, `public/showcase/bosch-customer-experience.html`.

**Data:** the Pulsefit Figma section (317:129218). Initials avatars replace photos. The plan card shows Plan A · Body Building, from elsewhere in the file, in place of the design's placeholder "Plan Name / Category".
