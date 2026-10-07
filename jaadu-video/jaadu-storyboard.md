# Jaadu 2.0: feature showcase storyboard (48s, 16:9)

**System:** the locked portfolio video system (reference: `ssh-client-video/final`). Pure black stage with low-opacity electric blue (#1E6EFF): key light from above, drifting floor glow, fine grid fading to the edges. White headlines, grey eyebrows, Geist (the Jaadu UI font). Ease-in-out cubic, no bounce, no outlines or spotlights.
**Sources:** `OneDrive/Pictures/Jaadu 2.0 screens` — Trading Terminal: OHLC, Alerts, Alerts: Completed, Chatbot, Quantlab: Overnight Discoveries, Quantlab: Paper Library. Every value on screen comes from these frames.

| # | Time (base) | Scene | Copy | Visual |
|---|------|-------|------|--------|
| 0 | 0.0–2.9 | Opening *(infographic)* | **Charts, alerts, AI and a quant lab in one terminal.** | Live candle chart draws on, the dashed price line runs to the *116,280.56* tag, and the Regime bar grows: *Sideways 40% · Breakout 35% · Volatile 13% · Reversal 12%*. |
| 1 | 2.9–8.6 | Trading terminal *(real screen + camera)* | TRADING TERMINAL · **Read the market's regime at a glance.** | Camera moves to the regime gauge (callouts: Regime ring to *55% Sideways*; Funding (8h) *-0.00064%*, next in *00:54:02*), then to the chart (Patterns *Doji · Shooting Star · Hammer*, *Breakout: 40%*). |
| 2 | 8.6–14.0 | Alerts *(real screen + cursor)* | ALERTS · **Alerts on price, footprint and POC.** | Callouts: BTC/USDT *Above $70,000*, now *$69,840*, *0.2% away*; tools *Price · Footprint · POC · Indicators*, *Once Only · Watch 1h close*. The cursor clicks **Completed Alerts** and the screen switches; callout: SOL/USDT *Enters $70,000*, *News Blackout*. |
| 3 | 14.0–19.4 | AI analyst *(real screen + cursor)* | AI ANALYST · **Ask anything. Trade smarter.** | Prompt suggestions callout; the cursor picks *Price Action* and *"Breakdown this week's ETH movement"* types into the ask bar, then send. |
| 4 | 19.4–25.0 | Overnight discoveries *(infographic)* | OVERNIGHT DISCOVERIES · **642 candidates in. 3 survive.** | Banner *Last Night: 642 candidates generated → 3 survived the gauntlet*. The Falsification Funnel draws while its stages count up *642 → 128 → 31 → 3*, then the surviving *MeanRev-VAL* card: *58%* win rate, Max DD *-12.6%*, Profit factor *1.74*, Sharpe *2.14*, equity curve draws. |
| 5 | 25.0–28.4 | Library *(infographic)* | LIBRARY · **Strategies, sorted by market regime.** | Deck of strategy cards cycles forward (*MeanRev-VAL · ReversalFade-4h · Absorption-Put · TurboMOVE-vol*); the regime filter (*All · Sideways · Reversal · Volatile*) follows the front card. |
| 6 | 28.4–30.0 | Close | — | The opening chart reprises, no text. |

**Pacing:** times above are the 30s base; the timeline plays at PACE 1.6 (about 48s).
**Controls:** Space plays or pauses · R restarts · ←/→ seeks 1s · H hides the controls.

**Design notes found while building (shown as designed on the real screens):**
- "Morning Breif" on the Alerts and Chat screens (the terminal screen says "Morning Brief").
- Alerts table header "TRIGGEER".
- Overnight Discoveries card labels "MAX DO" and "PROFT FACTOR" (rebuilt here as Max DD / Profit factor).
- Deja Vu "Z core" (likely "Z-score").
- Mark price "$60.553.20" on the terminal (index price reads 60,553.20).
- The terminal's regime gauge shows 55% Sideways with Breakout 35 / Volatile 13 / Reversal 12 (sums past 100); the Regime bar elsewhere uses 40 / 35 / 13 / 12.
- Library filter chips say "Breakdown" while strategy tags say "Breakout".
