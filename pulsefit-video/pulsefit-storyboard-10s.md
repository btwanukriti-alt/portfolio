# PulseFit: 10s showcase storyboard

This is the Pulsefit card video in the portfolio's Selected Work boxes and the case-study hero.

It is cut from the 20s v3 showcase (`PulsefitShowcase.jsx`, artifact "PulseFit Showcase Video"), keeping its look and motion exactly. The look is a light stage with a drifting brand mesh, an uppercase eyebrow with a 64px headline on top, app windows that rise and tilt into place, a cursor driving real states, and the skewed brand-blue wipe between scenes.

Only the intro is new: v3's isometric layers are replaced. Nothing is sped up; the Leads beat and the close keep their original timing.

| Time | Scene | Copy | Visual |
|---|---|---|---|
| 0:00–0:03.4 | Intro: product overview (new) | GYM MANAGEMENT / **Run your whole gym from one place.** | The Members dashboard rises and settles into place, and its KPIs count up (234 · 12 · 42 · 26 · 34) as the attendance heatmap fills. The seven modules slide out from behind the window, each joined to it by a fine line: Members, Leads and Staff to the left; Plans, Communication, Equipments and Workouts to the right. The modules float gently. |
| 0:03.4 | Cut | | Brand-blue skewed wipe. |
| 0:03.4–0:07.8 | Leads (unchanged) | LEADS / **Turn every lead into a member.** | Alex Johnson's lead card. Lead Score counts to 92/100 and the Lead Growth ring fills. The cursor clicks **Convert to Member**, the connector draws through the convert node, and **Assign Plan** arrives (Plan A · 1 month · ₹1,000) with Total Amount counting to ₹1,100. |
| 0:07.8 | Cut | | Brand-blue skewed wipe. |
| 0:07.8–0:10 | Close (unchanged) | ALL IN ONE / **Everything your gym runs on.** | The brand hub, with the seven modules settling onto a slowly turning orbit as data dots travel the spokes. Fades out, and the video loops to the intro. |

**Build:**
- `node build-10s.mjs` writes `pulsefit-showcase-10s.html`. It uses esbuild from `figma-cut/node_modules` and the page shell of `pulsefit-showcase.html`.
- `node scripts/build-showcases.mjs bosch-customer-experience=pulsefit-video/pulsefit-showcase-10s.html`, run from the repo root, writes the card embed.
