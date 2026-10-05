# College management: 10s Figma-style showcase storyboard

The College Management card video in the Selected Work boxes and the case-study hero. Same look as the Pulsefit 10s cut: one lilac canvas (#DCCFFF) with soft pastel shapes and no dot grid, clipped inside a black selection frame with corner handles; blue selections with size labels, purple component labels, an "On click" prototype noodle, pink auto-layout spacing; one dark cursor with no name tag; no toolbar; text on top only. The product name ("Dhondi") and the group's logo and name ("CMR") appear nowhere.

**Source:** Figma `Portfolio`, section "Dhondi" (267:97221): Finance Dashboard (267:97222), Staff Dashboard (267:98194), Attendance (267:104429), Revenue Contribution (267:101956) and the college drawer (267:102278).

| Time | Scene | Copy | Visual |
|---|---|---|---|
| 0:00–0:03.6 | **Intro** | COLLEGE MANAGEMENT SOFTWARE / **Track fees and staff across your colleges.** | The cursor drags out a frame, *Financial overview*, with a live size label. It fills with the Financial Overview dashboard: ₹80.55 Cr received counts up, the 72% collected bar fills and the Collection Progress line draws. Three components land around it, each selected as it arrives: Alert Card (Fee reduced ₹20,000 → ₹17,000), KPI Card (Present Staff 1,415, ↑8.2% vs yesterday) and Leave Type (On Leave 128 donut). Everything fades out together. |
| 0:03.6–0:07.6 | **Flow** | FINANCE / **See fee collection by programme.** | The Engineering College card pops in, selected as a component (400 × 294). Its collected bar fills to 89.1%, and a chip above counts "Lowest collection: B.Tech ₹2.00 Cr pending". The cursor clicks **View fee breakdown**. An "On click" noodle draws to **Collection by programme** (B.Tech, M.Tech, MBA, PhD), which is selected as it lands. Its bars fill and the total counts to ₹28.50 Cr. |
| 0:07.6–0:10 | **Close** | ALL IN ONE / **Finance, staff, banking and reports.** | Eight modules from the sidebar (Dashboard, Finance, Income, Settlements, Staff, Attendance, Banking, Reports) drop in tilted and snap into an auto-layout grid with 24px gap markers and a *Modules · Auto layout* selection. Fades, and loops to the intro on the same lilac. |

## UI refinements and data notes
- **Removed:** the logo, plus the group's name everywhere. "CMR Engineering College" becomes "Engineering College". The sidebar's logo slot becomes an "All Colleges" workspace switcher.
- **Avatars:** initials avatars in place of photo avatars.
- **Banner fix:** the design's "80% collected" contradicts its own numbers (₹80.55 Cr of ₹112 Cr is 71.9%), so the banner now reads **72% collected**. Received + pending (₹80.55 + ₹31.45 Cr) still equals expected (₹112 Cr).
- **Engineering College (invented):** the design's college rows are placeholder repeats (₹48.0 Cr received = expected = pending), so I wrote one consistent set: ₹28.50 Cr received, ₹32.00 Cr expected, ₹3.50 Cr pending, 89.1% collected.
- **Programme breakdown (invented to match):**
  - B.Tech: ₹14.00 Cr of ₹16.00 Cr (87.5%)
  - M.Tech: ₹6.20 Cr of ₹6.80 Cr (91.2%)
  - MBA: ₹5.10 Cr of ₹5.70 Cr (89.5%)
  - PhD: ₹3.20 Cr of ₹3.50 Cr (91.4%)

  These add up to the college totals. The design's rows all repeated ₹14.00 Cr / 66.7%, and MBA replaces the design's BSc/MSc for an engineering college.
- **"Lowest collection" chip:** the design's "Lowest Collection - B.Tech" line, reworded and now matching the numbers (B.Tech has the lowest rate, with ₹2.00 Cr pending).
- **Leave Type split (invented):** CL 52, CCL 26, On Duty 22, LOP 28. It adds up to the design's 128 on leave; the design's donut has no per-type values.
- **Copy tightened:**
  - Alert copy is tightened: "Receipt cancelled · Cancelled after an incorrect amount entry"; "Fee reduced · ₹20,000 → ₹17,000 after concession approval".
  - The Fee updated card names a student, "Ananya K · B.Tech 2023", from the design's alert.
- **Present Staff:** stays at the design's 1,415. The design's Total Staff (1,250) is lower than its Present Staff, so Total Staff isn't shown.
- **Collection Progress:** the curve is read off the design's chart, and the axis is labelled ₹ Cr (the design said "Crores").

**Build:** `cd figma-cut && npm install && npm run embed` → `public/showcase/college-management.html`.
