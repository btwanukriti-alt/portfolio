# AI trading platform (Jaadu 2.0): Figma-style showcase storyboard

The Jaadu 2.0 card video in the Selected Work boxes and the case-study hero (`public/showcase/jaadu-2.html`). It uses the same look and motion as the College Management cut: one plain soft-blue canvas (#CFDDFF) with no shapes and no dot grid, clipped inside a black selection frame with corner handles. It has blue selections with size labels, purple component labels, a blue prototype hotspot and noodle, one dark cursor with no name tag, no toolbar, and text on top only. The scenes are planned fresh for this product. The product name and logo appear nowhere.

**Source:** Figma `Jaadu-2.0`, section "Desktop" (2804:259012):
- Quant Lab Research (735:3056 empty state, 810:4672 with results);
- Alert: Price (508:3393);
- Window / Notifications (2802:183748);
- Quantlab: Overnight Discoveries (1413:27912).

**Length:** a 19.9s loop of four scenes (`SLOW` = 1.3). The dashboard and opening scenes were removed in feedback; the video now opens on the Quant Lab prompt.

| Time | Scene | Copy | Visual |
|---|---|---|---|
| 0:00–0:05.9 | **Quant lab research** | AI TRADING PLATFORM / **Ask the lab. Get the analysis.** | Only the prompt box (Research / Build tabs, input, disclaimer) is on the canvas. The cursor clicks it and *Distribution of funding rate before 5%+ drops on BTC 4h, last year.* types in. The cursor clicks send (hotspot "On click → Run research"). The box drops to the bottom while the results rise above it: the question, the *Distribution* card (histogram bars grow, median +0.041%, 90th percentile +0.118%, the insight line) and the *Output table* (three rows). The Distribution card is selected. |
| 0:05.9–0:10.0 | **Create an alert** | ALERTS / **Set an alert on any price.** | The *Create Alert* form appears on its own. The cursor clicks the condition value and types **116,000**, then clicks **Create Alert** (hotspot "On click → Create alert"), and the button turns green, "Created". |
| 0:10.0–0:13.9 | **Notifications** (a separate scene) | NOTIFICATIONS / **Know the moment it triggers.** | The Notifications panel appears with three earlier alerts. The triggered alert *BTC / USDT crossed $116,000 · now $116,040* pops in as a toast beside the panel, then flies in and docks as the top row; the list makes room, and the badge goes 2 → 3. The cursor rests on the new row, which is selected as *Notification*. |
| 0:13.9–0:19.9 | **Overnight discoveries** | OVERNIGHT DISCOVERIES / **642 strategies tested overnight. 3 survived.** | The *Falsification funnel* and *Discoveries per night* cards appear side by side (stacked in portrait), each drawn whole inside its card. The funnel draws as its stages count 642 → 128 → 31 → 3, and the 30 nightly bars grow, with last night's 3 highlighted. The cursor clicks "642 → 3 survived" (hotspot "On click → View survivors"); both cards step back and the three surviving strategy cards pop in with their equity curves drawing. |

## UI refinements and data notes
- **Removed:** the logo and wordmark. The top bar shows "Trading terminal" in their place.
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
- **Coin icons:** plain lettered discs in each coin's colour, not brand artwork.

**Build:** `cd figma-cut && npm install && npm run embed` → `public/showcase/jaadu-2.html`.
