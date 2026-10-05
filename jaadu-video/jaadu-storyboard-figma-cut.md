# AI trading platform (Jaadu 2.0): Figma-style showcase storyboard

The Jaadu 2.0 card video in the Selected Work boxes and the case-study hero (`public/showcase/jaadu-2.html`). It uses the same look and motion as the College Management cut: one plain soft-blue canvas (#CFDDFF) with no shapes and no dot grid, clipped inside a black selection frame with corner handles. It has blue selections with size labels, purple component labels (no click-hotspot outlines), one dark cursor with no name tag, no toolbar, and text on top only. The scenes are planned fresh for this product. The product name and logo appear nowhere.

**Source:** Figma `Jaadu-2.0`, section "Desktop" (2804:259012):
- Quant Lab Research (735:3056 empty state, 810:4672 with results);
- Alert: Price (508:3393);
- Window / Notifications (2802:183748);
- Quantlab: Overnight Discoveries (1413:27912);
- Quantlab: Library (817:8467).

**Length:** a 22.6s loop of five scenes (`SLOW` = 1.2). The video opens on a close-up of the Quant Lab prompt.

| Time | Scene | Copy | Visual |
|---|---|---|---|
| 0:00–0:06.0 | **Quant lab research** | AI TRADING PLATFORM / **Ask the lab. Get the analysis.** | A close-up of the prompt box (Research / Build tabs, input, disclaimer), nearly the width of the canvas. The cursor clicks it and *Distribution of funding rate before 5%+ drops on BTC 4h, last year.* types in. The cursor clicks send. The view pulls back: the box shrinks into its place at the bottom of the full Quant Lab *Research* screen (rail, Quantlab sidebar with tools and history, page header), which fades in around it. The results fill in above the prompt: the question, the *Distribution* card (bars grow, median +0.041%, 90th percentile +0.118%, insight line) and the *Output table*. The screen is selected (1440 × 820). |
| 0:06.0–0:09.8 | **Create an alert** | ALERTS / **Set an alert on any price.** | The *Create Alert* form on its own. The cursor clicks the condition value and types **116,000**, then clicks **Create Alert**; the button turns green, "Created". |
| 0:09.8–0:13.4 | **Notifications** | NOTIFICATIONS / **Know the moment it triggers.** | The Notifications panel. The triggered alert *BTC / USDT crossed $116,000 · now $116,040* pops in as a toast, then docks as the top row; the badge goes 2 → 3, and the row is selected. |
| 0:13.4–0:18.6 | **Overnight discoveries** | OVERNIGHT DISCOVERIES / **642 strategies tested overnight. 3 survived.** | The *Falsification funnel* and *Discoveries per night* cards appear side by side (stacked in portrait), drawn whole. The cursor clicks "642 → 3 survived"; the cards step back and the three survivors pop in. The cursor clicks **Save to Library** on MeanRev-VAL, which turns to "Saved". |
| 0:18.6–0:22.6 | **Library** | LIBRARY / **Saved strategies, sorted by regime.** | The Quant Lab *Library* screen (header with Compare, regime filter chips, a grid of saved strategies) appears with the first slot empty. The saved MeanRev-VAL card flies in and lands there with a green glow and a "Saved just now" tag, and it is selected. |

## UI refinements and data notes
- **Removed:** the logo and wordmark.
- **Trading pair:** the alert is on BTCUSDT (the design's chart is labelled ETHUSDC but priced like Bitcoin, up to a 116,280.56 tag).
- **Create Alert:**
  - The alert is on BTCUSDT, Crossing **116,000**. The design's value was 7800, which matches no price shown.
  - Expiration is "Jul 27, 2026 · 15:42", from the design's "July 27, 2026 at 3:42".
  - "Once Only" is now sentence case, "Once only".
- **Notifications:**
  - The new row, "BTC / USDT crossed $116,000 · now $116,040", replaces the design's "$70,000 · now $70,040" to match the price.
  - ETH reads "above $4,450.00", not $1,572.50, so it fits with BTC at 116,000.
  - The SOL and AVAX rows are as designed.
  - The tabs read All · 3→4 and Unread · 2→3; yesterday's rows are left out.
- **Research:** the question and results are from the design's Research frame. The insight copy is shortened; the output table shows three of its rows; "probablity" in the prompt suggestions is not shown. The placeholder reads "Ask the lab anything: describe a strategy, request research or run a backtest…".
- **Overnight discoveries:**
  - The funnel numbers are as designed: 642 / 128 / 31 / 3.
  - The banner "642 candidates → 3 survived" became the clickable chip in the funnel card's header.
  - Discoveries per night: the 30 nightly values (0–3 survivors, last night 3) are invented to match the design's caption "most nights yield 0–2".
  - Stage labels are in sentence case ("Passed fast filter", "Passed CPCV + PBO + DSR").
- **Strategy cards:** the design repeats one card three times ("MeanRev-VAL, 58%, −12.6%, 1.74, 2.14").
  - **MeanRev-VAL** keeps the design's values, tagged Sideways instead of Breakout, which suits a mean-reversion strategy.
  - **ReversalFade-4h** (54%, −9.8%, PF 1.52, Sharpe 1.86) and **Absorption-Put** (61%, −14.2%, PF 1.91, Sharpe 2.31) are invented. Their names come from the design's Library.
  - The labels "MAX DO" and "PROFT FACTOR" are fixed to **Max DD** and **Profit factor**.
- **Library:**
  - The design repeats MeanRev-VAL and other cards with the same 58% win rate. The grid now holds six distinct strategies: the saved MeanRev-VAL (with its backtest), FundingSkew-1h and TurboMOVE-vol (names from the design), and VAH-Breakout, FundingDrop-4h and RegimeCorr-ETH (named after the design's history items). Their win rates and backtest values are invented; two show "Not run yet" as in the design.
  - The filter chip "Breakdown" is now **Breakout**, matching the regime tags.
  - "shadow-mode" in the subtitle is now "shadow mode".
- **Quant Lab shell:** the logo is left out of the top bar ("Quant Lab" in its place). The portrait layout drops the Quantlab sidebar so the results stay readable.
- **Coin icons:** plain lettered discs in each coin's colour, not brand artwork.

**Build:** `cd figma-cut && npm install && npm run embed` → `public/showcase/jaadu-2.html`.
