# College management: Figma-style showcase storyboard

The College Management card video in the Selected Work boxes and the case-study hero. Same look as the Pulsefit 10s cut: one plain soft-blue canvas (#CFDDFF) with no shapes and no dot grid, clipped inside a black selection frame with corner handles; blue selections with size labels, purple component labels, blue prototype hotspots ("On click → Open drawer"), one dark cursor with no name tag; no toolbar; text on top only. The product name ("Dhondi") and the group's logo and name ("CMR") appear nowhere.

**Source:** Figma `Portfolio`, section "Dhondi" (267:97221): Finance Dashboard (267:97222), Staff Directory (267:104636), Staff Details (267:104471), Staff Dashboard (267:98194), Attendance (267:104429), Revenue Contribution (267:102038) and the stacked college drawers (Drawer_College frames, e.g. 267:102278, 267:103274, 267:103813, 267:103606).

**Length:** an 18.4s loop of four scenes: opening (college switcher), dashboard, drill-down and staff directory. Everything runs at a calm pace (one shared slow-down factor, `SLOW` = 1.3), so a first-time viewer can read each scene. The drill-down is two clicks, not three. The staff scene fades out and the opening starts again on the same blue.

| Time | Scene | Copy | Visual |
|---|---|---|---|
| 0:00–0:03.5 | **Opening: one workspace** | COLLEGE MANAGEMENT SOFTWARE / **One workspace for all your colleges.** | The five colleges pop in scattered and tilted across the canvas, each a row with its collection bar filling. The sidebar's *All Colleges* switcher pops in at the centre. The cursor clicks it, the dropdown opens, and the five colleges fly in and dock as its rows. The cursor moves to *All colleges* (₹94.30 Cr received · 82.1%), a green check pops in, and the whole component is selected as *College Switcher*. |
| 0:03.5–0:07.9 | **Dashboard** | DASHBOARD / **Track fees and staff across your colleges.** | The cursor drags out a large frame (1340 × 618 on landscape), *Financial overview*, with a live size label. It fills with the Financial Overview dashboard: ₹94.30 Cr received counts up, the 82% collected bar fills and the Collection Progress line draws. Three components land around it, each selected as it arrives: Alert Card (Fee reduced ₹20,000 → ₹17,000), KPI Card (Present Staff 1,415, ↑8.2% vs yesterday) and Leave Type (On Leave 128 donut). Everything fades out together. |
| 0:07.9–0:13.5 | **Flow: stacked drawers** | FINANCE / **Drill down from college to fee.** | Each drill-down level is a full sheet. *Revenue Contribution* pops in as a component, with ₹94.30 Cr counting up over five college rows, and a breadcrumb starts at "All colleges". The cursor clicks **Engineering College**: the row shows a blue prototype hotspot ("On click → Open drawer") and the Engineering drawer pops in on top. The previous sheet is pushed back (smaller, tilted, faded into the blue), the stack re-centres and the breadcrumb adds "Engineering College". The cursor clicks **B.Tech**, which stacks its fee types (Tuition, Lab, Exam, Hostel) the same way, with ₹14.00 Cr counting. The scene holds on the finished stack and the trail All colleges › Engineering College › B.Tech. In portrait the sheets stack upwards. |
| 0:13.5–0:18.4 | **Staff directory** | STAFF / **Find anyone across your colleges.** | The *Staff Directory* header pops in (1,250 staff counting, search, Engineering College, All departments) and six staff cards pop into the grid: initials avatar with a status dot, role, Dean/HOD badge, department, Employee ID and Present today / On leave. The cursor hovers Meera Iyer's card, which lifts and is selected as *Staff Card*, and clicks it. The grid fades back and her *Staff Profile* slides in (from the right in landscape, up from the bottom in portrait): Dean · Professor, Computer Science; attendance ring 21 of 22 days (95%); 28 yrs experience; 12 publications; the subjects she teaches; phone and email. |

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
  - **Tuition by batch** (in the data, not shown since the drill-down stops at B.Tech):
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
- **Staff directory:** the design repeats one placeholder card ("Jayvion Simon, Professor, EMP-101234", the same email and stock photos). It now shows six distinct people (Meera Iyer, Rajesh Kumar, Ananya Rao, Vikram Singh, Priya Nair, Arjun Mehta) with initials avatars, real-looking roles and departments, unique Employee IDs (EMP-1001…), and a status (Present today / On leave) in place of phone and email on the card. The product-specific "Dhondi ID" is left out. Header filters: Engineering College, All departments, and a "1,250 staff" count from the design's Total Staff.
- **Staff profile (invented, built from the design's figures):** 28 yrs experience (from *Most Experienced Staff*), 12 publications (from *Top Publicators*), attendance 21 of 22 days, subjects (Data Structures, Machine Learning, Algorithms), and a placeholder phone and @college.edu email.
- **Opening:** the switcher is the sidebar's workspace switcher. The college rows use the same per-college figures as the rest of the video.
- **Leave Type split (invented):** CL 52, CCL 26, On Duty 22, LOP 28. It adds up to the design's 128 on leave; the design's donut has no per-type values.
- **Copy tightened:**
  - Alert copy: "Receipt cancelled · Cancelled after an incorrect amount entry"; "Fee reduced · ₹20,000 → ₹17,000 after concession approval".
  - The Fee updated card names a student, "Ananya K · B.Tech 2023", from the design's alert.
- **Present Staff:** stays at the design's 1,415. The design's Total Staff (1,250) is lower than its Present Staff, so Total Staff isn't shown.
- **Collection Progress:** the curve is read off the design's chart, and the axis is labelled ₹ Cr (the design said "Crores").

**Build:** `cd figma-cut && npm install && npm run embed` → `public/showcase/college-management.html`.
