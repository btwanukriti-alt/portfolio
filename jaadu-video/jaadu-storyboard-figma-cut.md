# AI trading platform (Jaadu 2.0): Figma-style showcase storyboard

The Jaadu 2.0 card video in the Selected Work boxes and the case-study hero (`public/showcase/jaadu-2.html`). It uses the same look and motion as the College Management cut: one plain soft-blue canvas (#CFDDFF) with no shapes and no dot grid, clipped inside a black selection frame with corner handles. It has blue selections with size labels, purple component labels, a blue prototype hotspot and noodle, one dark cursor with no name tag, no toolbar, and text on top only. The scenes are planned fresh for this product. The product name and logo appear nowhere.

**Source:** Figma `Jaadu-2.0`, section "Desktop" (2804:259012):
- Trading Terminal: OHLC (1117:28210) and OHLC: Standard (1147:25040);
- Chatbot (1476:32512);
- Alert: Price (508:3393);
- Window / Notifications (2802:183748);
- Quantlab: Overnight Discoveries (1413:27912).

**Length:** an 18.6s loop of four scenes (`SLOW` = 1.3).

| Time | Scene | Copy | Visual |
|---|---|---|---|
| 0:00–0:03.5 | **Opening: the market's regime** | AI TRADING PLATFORM / **Read the market before you trade.** | The four regime chips (Sideways 40%, Breakout 35%, Volatile 13%, Reversal 12%) pop in, scattered and tilted. The *Market regime* card pops in at the centre. The cursor clicks it, the chips fly in and dock as its legend, each one draws its arc segment, and the centre counts to 40% Sideways. The card is selected as *Regime Gauge*. |
| 0:03.5–0:07.9 | **Dashboard** | TRADING TERMINAL / **Charts, signals and AI in one terminal.** | The cursor drags out a large frame, *Trading terminal*, with a live size label. It fills with the terminal: BTCUSDT, the candle chart drawing left to right up to the 116,280.56 price tag, and the right panel (ticker stats, mini regime gauge, watchlist). Three components land around it, each selected as it arrives: *AI Analyst* (the suggested prompt types in), *Pattern Card* (Doji · Shooting Star · Hammer, 35% breakout probability) and *Trades*. |
| 0:07.9–0:13.4 | **Flow: set an alert** | ALERTS / **Set an alert. Get notified when it hits.** | The *Create Alert* form and the *Notifications* panel pop in side by side (stacked in portrait). The cursor clicks the condition value and types **116,000**, then clicks **Create Alert**: a blue hotspot shows "On click → Create alert", and the button turns green, "Created". A prototype noodle ("On trigger") draws to Notifications, where *BTC / USDT crossed $116,000 · now $116,040* slides in at the top. The unread badge goes 2 → 3, and the new row is selected as *Notification*. |
| 0:13.4–0:18.6 | **Quant lab** | QUANT LAB / **642 strategies tested overnight. 3 survived.** | The *Overnight discoveries* falsification funnel draws while its stages count 642 → 128 → 31 → 3, and the banner shows "642 candidates → 3 survived". The three surviving strategy cards pop in, with win rates counting and equity curves drawing. The cursor selects *MeanRev-VAL* as *Strategy Card* and clicks **Save to Library**, which turns to "Saved". |

## UI refinements and data notes
- **Removed:** the logo and wordmark. The top bar shows "Trading terminal" in their place.
- **One trading pair throughout:** BTC/USDT at 116,280.6. The design labels the main chart **ETHUSDC** but prices it like Bitcoin (62,956.8, with an axis of 82,500–117,500 and a 116,280.56 price tag), so the pair is now BTCUSDT, priced from the chart's own tag.
- **Header, invented to match:** +2,483.6 (+2.18%); 24h high 116,912.0; 24h low 113,402.5. The design showed −3,748.0 (−5.61%) while the chart rose, with a high/low of 67,448.0 / 61,344.8. 24h volume stays at 61,344.8 as designed.
- **Ticker card:**
  - Mark 116,274.20 and index 116,268.90. The design showed 60,553.20 for mark, index and open interest alike, and "$60.553.20" elsewhere.
  - Open interest is 84,215.6 BTC (invented).
  - 24h volume of 6,167,144,953.95 and funding of −0.00064% (next in 00:54:02) are as designed.
- **Regime:** one set, Sideways 40 · Breakout 35 · Volatile 13 · Reversal 12, which sums to 100. The design's gauge read 55% Sideways alongside 35 / 13 / 12, which sums past 100. The chart chip "Breakout: 40%" is now 35% to match.
- **Watchlist:** BTC 116,280.6 (+2.18%), ETH 4,486.20 (+1.42%), SOL 212.84 (−0.86%) and AVAX 31.07 (−3.12%), all invented. The design repeats "BTC $0.48 +0.52%" and lists DAI, CRED and DASH; these now match the coins in Notifications.
- **Trades:** the columns are now Price / Size / Time, with five distinct rows near 116,280. The design repeats "63,913.10 · 0.352 · $22.5K" under mismatched headers.
- **Create Alert:**
  - The alert is on BTCUSDT, Crossing **116,000**. The design's value was 7800, which matches no price shown.
  - Expiration is "Jul 27, 2026 · 15:42", from the design's "July 27, 2026 at 3:42".
  - "Once Only" is now sentence case, "Once only".
- **Notifications:**
  - The new row, "BTC / USDT crossed $116,000 · now $116,040", replaces the design's "$70,000 · now $70,040" to match the price.
  - ETH reads "above $4,450.00", not $1,572.50, to match the watchlist.
  - The SOL and AVAX rows are as designed.
  - The tabs read All · 3→4 and Unread · 2→3; yesterday's rows are left out.
- **AI analyst:** the suggestion "Breakdown this week's ETH movement" is fixed to "Break down…".
- **Quant lab:**
  - The funnel numbers are as designed: 642 / 128 / 31 / 3.
  - The banner text was moved into the funnel card.
  - Stage labels are in sentence case ("Passed fast filter", "Passed CPCV + PBO + DSR").
- **Strategy cards:** the design repeats one card three times ("MeanRev-VAL, 58%, −12.6%, 1.74, 2.14").
  - **MeanRev-VAL** keeps the design's values, tagged Sideways instead of Breakout, which suits a mean-reversion strategy.
  - **ReversalFade-4h** (54%, −9.8%, PF 1.52, Sharpe 1.86) and **Absorption-Put** (61%, −14.2%, PF 1.91, Sharpe 2.31) are invented. Their names come from the design's Library.
  - The labels "MAX DO" and "PROFT FACTOR" are fixed to **Max DD** and **Profit factor**.
- **Coin icons:** plain lettered discs in each coin's colour, not brand artwork.

**Build:** `cd figma-cut && npm install && npm run embed` → `public/showcase/jaadu-2.html`.
