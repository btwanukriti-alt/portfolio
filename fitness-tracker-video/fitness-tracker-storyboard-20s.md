# Fitness tracker showcase: 20s storyboard

Source: Figma `Portfolio` → section **Zync** (`393:169642`). Built as `fitness-showcase.html` (player, `window.__zync` API) and embedded with
`node scripts/build-showcases.mjs fitness-tracker=fitness-tracker-video/fitness-showcase.html` → `public/showcase/fitness-tracker.html`.

Style matches the College Management cut: the same soft blue studio background, Public Sans captions on top, chip-sentence intro and outro, numbered feature scenes, one cursor with click ripples, a dashed connector that draws, and floating callout cards. The product UI is rebuilt as vector phone screens (390×844 in a slim bezel, Poppins, Zync purple). There is no product name or logo.

| Time | Scene | Copy | Visuals | Data |
|---|---|---|---|---|
| 0–3.6s | Intro | Sentence: "Calories [882 kcal] water [1,600 ml] sleep [6h 30m] / workouts [Core Plus · 5 wk] and gym visits [Checked in]". Sub: "A gym and fitness app for your whole day." | Words blur up; the inline chips grow and count up | 882 kcal burned, 1,600 ml water, 6h 30m sleep, Core Plus 5 weeks |
| 3.6–8.1s | 01 Daily log | "Water, food and sleep, logged in a tap." | Home phone (greeting, gym, Daily Fitness Attendance, calories and macros). The cursor taps **Log** and the Journal sheet slides up; it taps **Water**. The phone slides left, a connector draws, and the Hydration Log phone fills its wave to 1,600 ml with 7-day bars. Callouts: Food Log macros (left) and Sleep ring (right). | 882 Kcal / 1,385 cal; macros 55/75g, 80/160g, 15/30g; water 1,600 of 3,000 ml, goal 12 glasses; food 35/112g, 239/281g, 35/75g, 26/30g; sleep 6h 30m of 8h, 12:35–07:05 |
| 7.9–12.9s | 02 Workouts | "Pick a plan, then press start." | Workout Explore phone (Suggested Core Plus, Recovery row). The cursor taps **Stretching**, the phone slides left, the connector draws, and the detail phone enters with the exercise list staggering in. The cursor presses **Start** and the first exercise's progress bar fills. Callouts: Weekly plan Mon–Fri (right) and plan summary (left). | 5 weeks · 60 Mins; Cardio / Beginner; 30s per exercise; 30m · 10 Exercises per day |
| 12.4–17.3s | 03 Gym | "Check in and see the day's classes." | Gym Activity phone. The cursor taps **Check-In Now**: the tile turns green ("Checked in") and Monthly goes 0 → 1. The connector draws to the Daily Fitness Attendance card (Done ✓), with the calories card below. Left callout: gym and Membership Card. | BodyPump Feb 26, 2025, 02:30 PM, Fitness Room 1; Strength Training 12:30 PM, Fitness Room 3; staff Alex John |
| 17–20s | Outro | Same sentence as the intro | The sentence rebuilds and fades out to the empty studio, so the loop restarts cleanly | — |

## UI refinements and invented values
- Photos replaced: profile photos → initials avatars (SS, AJ); the gym logo → a vector badge; workout photos → soft gradient tiles with a line icon.
- "Fitzone, Bangalore-5600…" (truncated) → "Fitzone, Bangalore".
- The detail screen's "Strecthing" typo → "Stretching".
- Duplicate 4th exercise ("Reclining Bound Angle" twice) → "Seated Forward Bend" (invented).
- Goal "None" → "Flexibility" (invented, to fit a stretching plan).
- The Explore sections are reordered so the Stretching card sits in a "Recovery" row next to Game Changer; in Figma, Recovery is the third row.
- Food Log "of 2250 ml" → "2,250 cal" (wrong unit fixed).
- Home calories use the 882 Kcal / 1,385 cal screen; the other home variant shows 900 Cal.
- Monthly check-ins 0 → 1 after check-in (the design shows 0; the +1 is derived).
- The bottom nav uses the 4-tab version (Home, Log, Gym, Workout) from the Track/Homepage frames.
- The Daily Water Intake bar values (6, 8, 7, 9, 10, 10, 12 glasses) are approximated from the chart; 8 on 13/02 and 12 at the goal line come from the design.
- The first exercise's progress bar after Start is new motion, not a screen in Figma.
- Status bar, dynamic island and bezel are added for the phone presentation.
