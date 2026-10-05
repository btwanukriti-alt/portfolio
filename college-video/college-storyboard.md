# College management: Figma-style showcase storyboard

The College Management card video in the Selected Work boxes and the case-study hero. Same look as the Pulsefit 10s cut: one lilac canvas (#DCCFFF) with soft pastel shapes and no dot grid, clipped inside a black selection frame with corner handles; blue selections with size labels, purple component labels, blue prototype hotspots ("On click → Open drawer"), pink auto-layout spacing; one dark cursor with no name tag; no toolbar; text on top only. The product name ("Dhondi") and the group's logo and name ("CMR") appear nowhere.

**Source:** Figma `Portfolio`, section "Dhondi" (267:97221): Finance Dashboard (267:97222), Staff Dashboard (267:98194), Attendance (267:104429), Revenue Contribution (267:102038) and the stacked college drawers (Drawer_College frames, e.g. 267:102278, 267:103274, 267:103813, 267:103606).

**Length:** an 11s loop. The drawer stack needs a little more time to stay calm.

| Time | Scene | Copy | Visual |
|---|---|---|---|
| 0:00–0:03.4 | **Intro** | COLLEGE MANAGEMENT SOFTWARE / **Track fees and staff across your colleges.** | The cursor drags out a frame, *Financial overview*, with a live size label. It fills with the Financial Overview dashboard: ₹94.30 Cr received counts up, the 82% collected bar fills and the Collection Progress line draws. Three components land around it, each selected as it arrives: Alert Card (Fee reduced ₹20,000 → ₹17,000), KPI Card (Present Staff 1,415, ↑8.2% vs yesterday) and Leave Type (On Leave 128 donut). Everything fades out together. |
| 0:03.4–0:08.6 | **Flow: stacked drawers** | FINANCE / **Drill down from college to fee.** | Each drill-down level is a full sheet. *Revenue Contribution* pops in as a component, with ₹94.30 Cr counting up over five college rows, and a breadcrumb starts at "All colleges". A floating stat chip (collected ring + pending) lands on its corner. The cursor clicks **Engineering College**: the row shows a blue prototype hotspot ("On click → Open drawer") and the Engineering drawer pops in on top. The previous sheet is pushed back (smaller, tilted, faded to lilac), the stack re-centres, the breadcrumb adds "Engineering College", and the stat chip hands over and counts to ₹3.50 Cr pending. **B.Tech** and then **Tuition Fee** stack the same way. The result is a fanned deck of four sheets, the full trail All colleges › Engineering College › B.Tech › Tuition Fee, and ₹11.20 Cr / ₹1.60 Cr pending. In portrait the sheets stack upwards, so each earlier level peeks out above the next. |
| 0:08.6–0:11 | **Close** | ALL IN ONE / **Finance, staff, banking and reports.** | Eight modules from the sidebar (Dashboard, Finance, Income, Settlements, Staff, Attendance, Banking, Reports) drop in tilted and snap into an auto-layout grid with 24px gap markers and a *Modules · Auto layout* selection. Fades, and loops to the intro on the same lilac. |

## UI refinements and data notes
- **Removed:** the logo, plus the group's name everywhere. "CMR Engineering College" becomes "Engineering College". The sidebar's logo slot becomes an "All Colleges" workspace switcher.
- **Avatars:** initials avatars in place of photo avatars.
- **One consistent data set:** the design's figures contradict each other and repeat placeholders, so every level adds up to its parent.
  - **Overview / Revenue Contribution:** ₹94.30 Cr received (as in the design), ₹20.50 Cr pending and ₹114.80 Cr expected, which is 82.1% collected. The design's Financial Overview showed ₹80.55 / ₹112 Cr with "80% collected", which is wrong for those numbers and doesn't match the Revenue Contribution page.
  - **Colleges (invented split of the ₹94.30 Cr):**
    - Engineering: ₹28.50 of ₹32.00 Cr
    - Medical: ₹22.40 of ₹27.50 Cr
    - Science: ₹18.20 of ₹21.00 Cr
    - Law: ₹12.80 of ₹18.00 Cr
    - Arts & Management: ₹12.40 of ₹16.30 Cr

    The design repeats "CMR Engineering College ₹41.50 Cr" on every row.
  - **Engineering programmes:**
    - B.Tech: ₹14.00 of ₹16.00 Cr
    - M.Tech: ₹6.20 of ₹6.80 Cr
    - MBA: ₹5.10 of ₹5.70 Cr
    - PhD: ₹3.20 of ₹3.50 Cr

    MBA replaces BSc/MSc, which don't fit an engineering college.
  - **B.Tech fee types:**
    - Tuition: ₹11.20 of ₹12.80 Cr
    - Lab: ₹1.40 of ₹1.60 Cr
    - Exam: ₹0.80 of ₹0.90 Cr
    - Hostel: ₹0.60 of ₹0.70 Cr

    The design repeats "Lab Fee ₹41.50 Cr" five times.
  - **Tuition by batch:**
    - 2022–26: ₹2.40 of ₹2.80 Cr
    - 2023–27: ₹3.10 of ₹3.50 Cr
    - 2024–28: ₹2.90 of ₹3.30 Cr
    - 2025–29: ₹2.80 of ₹3.20 Cr

    The design's "B.Tech 2023-26 Batch" is a three-year span, so the batches are now four years.
- **Drawer details:**
  - "Tution Fee" is spelled correctly as **Tuition Fee**.
  - List labels match the level: Colleges / Programmes / Fee types / Batches. The design says "College" or "Institution" on every level.
  - The drawers' side spines are shown as a breadcrumb trail above the stack, and each level is a sheet in a fanned stack.
  - Each sheet ends with a total row ("Total · 4 programmes  ₹28.50 Cr of ₹32.00 Cr").
  - The ₹1.60 Cr scholarship sub-values the "Lowest Collection" banner and the Expected/Pending columns are left out to keep the sheets readable. Pending and expected show in each sheet's summary.
- **Leave Type split (invented):** CL 52, CCL 26, On Duty 22, LOP 28. It adds up to the design's 128 on leave; the design's donut has no per-type values.
- **Copy tightened:**
  - Alert copy: "Receipt cancelled · Cancelled after an incorrect amount entry"; "Fee reduced · ₹20,000 → ₹17,000 after concession approval".
  - The Fee updated card names a student, "Ananya K · B.Tech 2023", from the design's alert.
- **Present Staff:** stays at the design's 1,415. The design's Total Staff (1,250) is lower than its Present Staff, so Total Staff isn't shown.
- **Collection Progress:** the curve is read off the design's chart, and the axis is labelled ₹ Cr (the design said "Crores").

**Build:** `cd figma-cut && npm install && npm run embed` → `public/showcase/college-management.html`.
