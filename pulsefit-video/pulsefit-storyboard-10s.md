# PulseFit: 10s Figma-style showcase storyboard

This is the Pulsefit card video in the portfolio's Selected Work boxes and the case-study hero.

**Brief:**
- similar to the v3 PulseFit showcase (its feature flow and pace), but in Figma's style;
- one lilac background;
- an intro a first-time viewer understands;
- calm, not fast-paced.

**Look:**
- **Background:** one lilac, #DCCFFF, for the whole piece, with a few soft pastel shapes (pink, yellow, violet, white) drifting slowly. No dot grid.
- **Canvas frame:** the whole canvas sits inside a black Figma-style selection frame with corner handles.
- **Editor details:** blue selection boxes with corner handles and size labels, purple component labels, a prototype noodle, pink auto-layout spacing, a frame name label and the canvas toolbar.
- **Cursor:** one dark cursor with no name tag. It's Anu's own work.
- **Scene changes:** soft fades. Everything in a scene leaves together, so nothing is left behind.
- **Text:** on top. An uppercase eyebrow over a 62px Poppins title.

| Time | Scene | Copy | Visual |
|---|---|---|---|
| 0:00–0:03.6 | **Intro** | PULSEFIT · GYM MANAGEMENT SOFTWARE / **Run your whole gym from one place.** | The cursor draws a frame, *Pulsefit — Members*, with a live size label. It fills with the Pulsefit Members dashboard as the KPIs count up. Product components land around it, each selected as it arrives: the Lead Score card (Alex Johnson 92/100), the KPI card (Active Members 234) and the Plan card (Plan A · 1 month · ₹1,000). Everything fades out together. |
| 0:03.6–0:07.6 | **Leads** | LEADS / **Convert a lead into a member.** | Alex Johnson's lead card pops in, selected as a component (400 × 294), and Lead Score counts to 92/100. The cursor clicks **Convert to Member**. A blue prototype noodle ("On click") draws to **Assign Plan** (Plan A · 1 month · ₹1,000), which is selected as it lands, and the total counts to ₹1,100. |
| 0:07.6–0:10 | **Close** | ALL IN ONE / **Members, leads, plans and more.** | The seven modules drop in as tilted instances and snap into an auto-layout grid. Pink 24px gap markers and a *Modules · Auto layout* selection appear and the cursor settles beside them. The scene fades, and the video loops to the intro. |

**Build:** in `figma-cut`, `npm run embed` writes the card embed, `public/showcase/bosch-customer-experience.html`.

**Data:** the Pulsefit Figma section (317:129218). Initials avatars replace photos. The plan card shows Plan A · Body Building, from elsewhere in the file, in place of the design's placeholder "Plan Name / Category".
