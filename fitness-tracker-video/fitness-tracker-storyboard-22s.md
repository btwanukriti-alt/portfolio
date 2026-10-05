# Fitness tracker showcase: 22s storyboard

Source: Figma `Portfolio` → section **Zync** (`393:169642`). Built as `fitness-showcase.html` (player, `window.__zync` API) and embedded with
`node scripts/build-showcases.mjs fitness-tracker=fitness-tracker-video/fitness-showcase.html` → `public/showcase/fitness-tracker.html`.

Style matches the College Management cut: the same soft blue studio background, Public Sans captions on top, numbered feature scenes, one cursor with click ripples, a dashed connector that draws, and floating callout cards. The product UI is rebuilt as vector phone screens (390×844 in a slim bezel, Poppins, Zync purple). The workout photos are the real Figma images (`img/`, inlined as data URIs). There is no product name or logo.

| Time | Scene | Copy | Visuals | Data |
|---|---|---|---|---|
| 0–3.7s | Opener | "Daily tracking" / "Water, food and sleep, every day." | Three graph cards rise in one after another. Hydration: the wave ring fills to 1,600 ml and the 7-day bars grow to the 12-glass line. Food: the gauge sweeps to 1,385 cal and the macro bars fill. Sleep: the gradient ring sweeps to 6h 30m and the 7-day bars grow to the 8h line. Tooltips show 13/02 · 8 Glasses and 8 Hours. | 1,600 of 3,000 ml; 1,385 of 2,250 cal; Protein 35/112g, Carbs 239/281g, Fat 35/75g, Fibre 26/30g; 6h 30m of 8h |
| 3.6–9.5s | 01 Daily log | "Log a glass of water, then a meal." | Home phone; the cursor taps **Log** and the Journal sheet slides up. It taps **Water**: the phone slides left, the connector draws, and the Hydration Log fills to 1,600 ml. A "+250 ml" glass-counter callout appears. The cursor taps **Food**: the second phone slides to the Food Log. The cursor taps **+** on Breakfast and a 09:30 am **Chapati** row slides in. The gauge counts 1,085 → 1,385 cal and Breakfast goes 348 → 648 of 562 Cal. A Sleep callout appears. | Breakfast items from Figma: Pomegranate 114, Coffee 234, Chapati 300 |
| 9.3–14.3s | 02 Workouts | "Pick a plan, then press start." | Workout Explore phone with the real photos (Core Plus, Stretching, Game Changer). The cursor taps **Stretching** and the detail phone enters (photo hero, workout details, exercise list with photo thumbnails). The cursor presses **Start** and the first exercise's progress bar fills. Callouts: Weekly plan Mon–Fri and plan summary. | 5 weeks · 60 Mins; Cardio / Beginner / None; 30s per exercise; 30m · 10 Exercises per day |
| 13.8–18.7s | 03 Gym | "Check in and see the day's classes." | Gym Activity phone. The cursor taps **Check-In Now**: the tile turns green and Monthly goes 0 → 1. The connector draws to Daily Fitness Attendance (Done ✓), with a calories card and a gym/membership callout. | BodyPump and Strength Training, Feb 26, 2025, Alex John, Fitness Rooms 1 and 3 |
| 18.4–22s | Closer | Same as the opener | The graph cards build again and fade out, so the loop restarts on the opener | — |

## UI refinements and invented values
- Profile photos → initials avatars (SS, AJ); the gym logo → a vector badge. The workout photos are real Figma exports: Suggested `393:171114`, Stretching `393:171235`, Game Changer `393:171139`, detail hero `393:171003`, exercises `393:171034/39/44`.
- "Fitzone, Bangalore-5600…" (truncated) → "Fitzone, Bangalore".
- The detail screen's "Strecthing" typo → "Stretching".
- The exercise list shows the 3 distinct exercises; Figma repeats "Reclining Bound Angle" as a 4th row.
- Food Log "of 2250 ml" → "of 2,250 cal" (wrong unit fixed). Macro percentages are recomputed from the gram values (Figma shows Carbs 47% for 239/281g).
- The food-logging step is built from the Food Log screen: Chapati (09:30 am, 300 cal) is the item that gets added. The before-state (1,085 cal total, 348 Cal breakfast) is derived by subtracting it; the after-state matches Figma (1,385 cal, 648 of 562 Cal).
- The Explore sections are reordered so the Stretching card sits in the "Recovery" row next to Game Changer.
- Monthly check-ins 0 → 1 after check-in (the design shows 0; the +1 is derived).
- Water and sleep 7-day bar values are approximated from the Figma charts. The tooltip values (8 Glasses, 8 Hours on 13/02) and goal lines (12 glasses, 8h) come from the design.
- The first exercise's progress bar after Start is new motion, not a screen in Figma.
- Status bar, dynamic island and bezel are added for the phone presentation.
