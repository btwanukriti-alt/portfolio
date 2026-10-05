// Jaadu 2.0 — feature showcase (30s base, 16:9), on the locked portfolio video system
// (reference: clihub-video/final). Real screens through camera moves, cursor clicks and floating
// callouts; component infographics rebuilt as live vector UI from the Jaadu screens.
// One clock `t`, ease-in-out cubic, no bounce. Every value shown comes from the designs.
const { useState, useEffect, useRef, useLayoutEffect } = React;

// ---------- theme (sampled from the Jaadu 2.0 screens) ----------
const C = {
  ink: "#F4F4F6", mute: "#8B8B96", // headlines, eyebrows
  card: "#0A1035", raised: "#111A4A", line: "rgba(130,150,255,.18)", track: "#1B2560",
  text: "#E6E8F5", sub: "#8D93B8",
  blue: "#5B7CFA", green: "#2FE0A0", red: "#F0485A", amber: "#F5B544", violet: "#8B6CF6", cyan: "#22D3EE",
};
const FONT = "'Geist', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";
// PACE scales the whole 30s base timeline evenly: holds, transitions and cursor moves together.
const PACE = 1.6;
const DURATION = 30 * PACE;
const IMG = window.JAADU_SCREENS; // { terminal, alerts, alertsDone, chat }

// ---------- timing ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const prog = (t, a, b) => ease(clamp((t - a) / (b - a)));
const lerp = (a, b, u) => {
  if (typeof a === "number") return a + (b - a) * u;
  const o = {}; for (const k in a) o[k] = a[k] + (b[k] - a[k]) * u; return o;
};
const kf = (t, keys) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i], [t1, v1] = keys[i + 1];
    if (t <= t1) return lerp(v0, v1, ease((t - t0) / (t1 - t0)));
  }
  return keys[keys.length - 1][1];
};
const inOut = (u, a, b, d = 0.6, e = 0.4) => prog(u, a, a + d) * (1 - prog(u, b - e, b));
const count = (v, p, d = 0) => (v * p).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

// ---------- desktop window for real screens (camera only — no overlays) ----------
const W = 1280, H = 800;
function Window({ x, y, s = 0.72, z = 1, zp = 0, f = { x: 640, y: 400 }, rotX = 0, o = 1, ty = 0, layers }) {
  if (o <= 0.001) return null;
  const k = s * z;
  const Tx = -k * (f.x - W / 2) * zp, Ty = -k * (f.y - H / 2) * zp;
  const mask = "linear-gradient(180deg, transparent 0, transparent 215px, #000 300px)"; // never runs under the headline
  return (
    <div style={{ position: "absolute", inset: 0, WebkitMaskImage: mask, maskImage: mask, opacity: o }}>
      <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, perspective: 3200 }}>
        <div style={{
          position: "absolute", left: -W / 2, top: -H / 2, width: W, height: H, borderRadius: 16, overflow: "hidden", background: C.card,
          transform: `translate3d(${Tx}px, ${Ty + ty}px, 0) scale(${k}) rotateX(${rotX}deg)`,
          boxShadow: "0 60px 120px -40px rgba(0,0,0,.9), 0 0 0 1.5px rgba(255,255,255,.08)",
        }}>
          {layers.map((L, i) => L.o > 0.001 && (
            <img key={i} src={L.src} alt="" draggable={false} style={{ position: "absolute", inset: 0, width: W, height: H, opacity: L.o }} />
          ))}
        </div>
      </div>
    </div>
  );
}
// Stage position of a point on the (un-zoomed) window
const onWin = (win, px, py) => ({ x: win.x + (px - W / 2) * win.s, y: win.y + (py - H / 2) * win.s + (win.ty || 0) });

const Place = ({ x, y, s = 1, o = 1, ty = 0, children }) => o > 0.001 && (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%, -50%) translateY(${ty}px) scale(${s})` }}>{children}</div>
);

function Headline({ t, a, b, eyebrow, title }) {
  if (t < a - 0.05 || t > b + 0.05) return null;
  const e = prog(t, a, a + 0.55), h = prog(t, a + 0.12, a + 0.8), out = prog(t, b - 0.5, b);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 96, textAlign: "center", opacity: 1 - out, zIndex: 30 }}>
      <div style={{ fontSize: 21, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: C.mute, opacity: e, transform: `translateY(${(1 - e) * 18 - out * 10}px)`, marginBottom: 16 }}>{eyebrow}</div>
      <div style={{ fontSize: 64, fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.03em", color: C.ink, whiteSpace: "nowrap", opacity: h, transform: `translateY(${(1 - h) * 28 - out * 14}px)` }}>{title}</div>
    </div>
  );
}

const winMotion = (u, len) => {
  const i = prog(u, 0, 0.75), out = prog(u, len - 0.45, len);
  return { o: i * (1 - out), ty: 90 * (1 - i) - 40 * out, rotX: 12 * (1 - i) };
};

// Stage-level cursor
const Cursor = ({ x, y, o, press, size = 1.15 }) => o > 0.001 && (
  <svg width="22" height="28" viewBox="0 0 22 28" style={{ position: "absolute", left: x - 2, top: y - 2, opacity: o, transform: `scale(${(press ? 0.85 : 1) * size})`, transformOrigin: "2px 2px", filter: "drop-shadow(0 3px 6px rgba(0,0,0,.5))", zIndex: 50, overflow: "visible" }}>
    <path d="M2 2 L2 22 L7.5 17 L11 25 L14.5 23.5 L11 15.8 L18.5 15.8 Z" fill="#fff" stroke="#111119" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);
const clickPath = (start, clicks, travel = 0.45) => {
  const keys = [start];
  clicks.forEach(([ct, p]) => { keys.push([ct - travel, keys[keys.length - 1][1]]); keys.push([ct - 0.04, p]); });
  return keys;
};
const pressedAt = (u, clicks) => clicks.some(([ct]) => u > ct && u < ct + 0.14);

// Floating callout card, beside the UI
const cardStyle = { position: "absolute", width: 300, background: "#0C1238", border: `1px solid ${C.line}`, borderRadius: 16, padding: "20px 22px", fontFamily: FONT, color: C.text, boxShadow: "0 40px 80px -30px rgba(0,0,0,.9)", boxSizing: "border-box", zIndex: 20 };
const Lbl = ({ children }) => <div style={{ fontSize: 14, color: C.sub, marginBottom: 10 }}>{children}</div>;
function Callout({ u, s0, s1, x, y, side = "left", w = 300, children }) {
  const e = inOut(u, s0, s1, 0.4, 0.35); if (e <= 0.001) return null;
  return (
    <div style={{ ...cardStyle, left: x, top: y, width: w, opacity: e, transform: `translate(${(side === "left" ? -30 : 30) * (1 - e)}px, ${12 * (1 - e)}px)` }}>
      {children(prog(u, s0 + 0.1, s0 + 0.8))}
    </div>
  );
}
const Chip = ({ c, children, on = true }) => (
  <span style={{ display: "inline-flex", alignItems: "center", height: 26, padding: "0 11px", borderRadius: 13, fontSize: 13, fontWeight: 500, color: on ? c : C.sub, background: on ? `${c}22` : "transparent", border: `1px solid ${on ? `${c}55` : C.line}`, whiteSpace: "nowrap" }}>{children}</span>
);

// ---------- scenes ----------
const S = { open: [0, 2.9], terminal: [2.9, 8.6], alerts: [8.6, 14.0], chat: [14.0, 19.4], discover: [19.4, 25.0], library: [25.0, 28.4], close: [28.4, 30] };
const local = (t, a, b, ref) => ({ u: (t - a) * ref / (b - a), len: ref });

// Regime split, from the terminal's Regime bar
const REGIME = [["Sideways", 40, C.blue], ["Breakout", 35, C.red], ["Volatile", 13, C.amber], ["Reversal", 12, C.green]];

// Opening infographic, rebuilt from the terminal: a live candle chart, its price tag and the regime split
const CANDLES = Array.from({ length: 30 }, (_, i) => {
  const base = 300 - i * 5.2 + 26 * Math.sin(i * 0.55);
  const body = 16 + 18 * Math.abs(Math.sin(i * 1.9 + 0.4));
  const up = Math.sin(i * 1.3 + 0.8) > -0.25;
  return { up, top: base - (up ? body : 0), body, wick: 10 + 8 * Math.abs(Math.cos(i * 2.3)) };
});
function Pulse({ u }) {
  const frame = prog(u, 0, 0.6);
  const n = 30 * prog(u, 0.25, 1.7);
  const line = prog(u, 1.4, 1.9);
  const bar = prog(u, 1.6, 2.3);
  return (
    <svg width="1000" height="520" viewBox="0 0 1000 520" style={{ overflow: "visible" }}>
      <rect x="0" y="0" width="1000" height="520" rx="26" fill={C.card} stroke="rgba(130,150,255,.22)" strokeWidth="1.5" opacity={frame} />
      {[0, 1, 2, 3].map((k) => <line key={k} x1="40" x2="840" y1={90 + k * 80} y2={90 + k * 80} stroke="rgba(130,150,255,.10)" strokeWidth="1.2" opacity={frame} />)}
      {CANDLES.map((c, i) => {
        const a = clamp(n - i); if (a <= 0) return null;
        const x = 60 + i * 26, col = c.up ? C.green : C.red;
        return (
          <g key={i} opacity={a} transform={`translate(0 ${(1 - a) * 14})`}>
            <line x1={x + 7} x2={x + 7} y1={c.top - c.wick} y2={c.top + c.body + c.wick} stroke={col} strokeWidth="2" />
            <rect x={x} y={c.top} width="14" height={c.body} rx="2" fill={col} />
          </g>
        );
      })}
      <line x1="40" x2={40 + 800 * line} y1="168" y2="168" stroke="rgba(220,230,255,.55)" strokeWidth="1.6" strokeDasharray="6 6" />
      <g opacity={line} transform={`translate(${848} 154)`}>
        <rect width="124" height="30" rx="7" fill={C.blue} opacity=".9" />
        <text x="62" y="20" textAnchor="middle" fontSize="15" fontWeight="600" fill="#fff" fontFamily="Geist">116,280.56</text>
      </g>
      {/* regime split */}
      <text x="40" y="440" fontSize="20" fontWeight="500" fill={C.text} fontFamily="Geist" opacity={bar}>Regime</text>
      {(() => { let x0 = 40; return REGIME.map(([name, v, col]) => {
        const w = 920 * (v / 100), x = x0; x0 += w;
        return (
          <g key={name}>
            <rect x={x} y="460" width={Math.max(0, w * bar - 3)} height="22" rx="5" fill={col} />
            <text x={x} y="508" fontSize="15" fill={C.sub} fontFamily="Geist" opacity={prog(u, 2.0, 2.4)}>{name}:{v}%</text>
          </g>
        );
      }); })()}
    </svg>
  );
}

function Opening({ t }) {
  const [a, b] = S.open; if (t > b + 0.1) return null;
  const u = t - a, out = prog(u, b - a - 0.5, b - a), tag = prog(u, 1.15, 1.85);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-24 * out}px)` }}>
      <Place x={960} y={500} s={1.02 + 0.03 * prog(u, 0, 2.9)}><Pulse u={u} /></Place>
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", fontSize: 44, fontWeight: 500, letterSpacing: "-0.02em", color: C.ink, opacity: tag, transform: `translateY(${(1 - tag) * 18}px)` }}>
        Charts, alerts, AI and a quant lab in one terminal.
      </div>
    </div>
  );
}

function Closing({ t }) {
  const [a] = S.close; if (t < a) return null;
  return <Place x={960} y={560} s={1.08}><Pulse u={(t - a) * 1.6} /></Place>;
}

// 1 — Trading terminal: the camera moves to the regime gauge, then to the chart's pattern reads
function Terminal({ t }) {
  const [a, b] = S.terminal; if (t < a - 0.1 || t > b + 0.1) return null;
  const { u, len } = local(t, a, b, 5.7);
  const m = winMotion(u, len);
  const z = kf(u, [[1.0, 1], [1.6, 1.55], [2.9, 1.55], [3.4, 1.55], [4.6, 1.55], [5.1, 1]]);
  const f = kf(u, [[1.0, { x: 1096, y: 391 }], [2.9, { x: 1096, y: 391 }], [3.5, { x: 560, y: 300 }]]);
  const zp = kf(u, [[1.0, 0], [1.6, 1], [4.6, 1], [5.1, 0]]);
  return (
    <>
      <Headline t={t} a={a + 0.2} b={b - 0.15} eyebrow="Trading terminal" title="Read the market's regime at a glance." />
      <Window x={960} y={660} s={0.72} z={z} zp={zp} f={f} o={m.o} ty={m.ty} rotX={m.rotX} layers={[{ src: IMG.terminal, o: 1 }]} />
      <div style={{ position: "absolute", inset: 0, opacity: m.o }}>
        <Callout u={u} s0={1.5} s1={3.0} x={110} y={420} side="left">{(p) => (
          <>
            <Lbl>Regime</Lbl>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <svg width="88" height="88" viewBox="0 0 88 88"><circle cx="44" cy="44" r="36" fill="none" stroke={C.track} strokeWidth="8" />
                <circle cx="44" cy="44" r="36" fill="none" stroke={C.blue} strokeWidth="8" strokeLinecap="round" pathLength="100" strokeDasharray={`${55 * p} 100`} transform="rotate(-90 44 44)" /></svg>
              <div><div style={{ fontSize: 40, fontWeight: 500 }}>{count(55, p)}%</div><div style={{ fontSize: 14, color: C.sub }}>Sideways</div></div>
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 14, fontSize: 13, color: C.sub }}>
              {[["Breakout", 35, C.red], ["Volatile", 13, C.amber], ["Reversal", 12, C.violet]].map(([n, v, c]) => (
                <span key={n} style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: c }} />{n}:{count(v, p)}%</span>))}
            </div>
          </>
        )}</Callout>
        <Callout u={u} s0={1.8} s1={3.0} x={1510} y={520} side="right">{(p) => (
          <>
            <Lbl>Funding (8h)</Lbl>
            <div style={{ fontSize: 34, fontWeight: 500, color: C.red }}>{(-0.00064 * p).toFixed(5)}%</div>
            <div style={{ fontSize: 14, color: C.sub, marginTop: 8 }}>Next in 00:54:02</div>
          </>
        )}</Callout>
        <Callout u={u} s0={3.5} s1={len - 0.5} x={1510} y={400} side="right">{(p) => (
          <>
            <Lbl>Patterns spotted</Lbl>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Doji", "Shooting Star", "Hammer"].map((n, i) => <span key={n} style={{ opacity: clamp(p * 3 - i) }}><Chip c={C.cyan}>{n}</Chip></span>)}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, fontSize: 16 }}>
              <span style={{ width: 9, height: 9, borderRadius: 5, background: C.blue }} />Breakout: <b style={{ fontWeight: 600 }}>{count(40, p)}%</b>
            </div>
          </>
        )}</Callout>
      </div>
    </>
  );
}

// 2 — Alerts: the condition on each alert, then the cursor switches to Completed Alerts
function Alerts({ t }) {
  const [a, b] = S.alerts; if (t < a - 0.1 || t > b + 0.1) return null;
  const { u, len } = local(t, a, b, 5.4);
  const m = winMotion(u, len);
  const win = { x: 960, y: 660, s: 0.72, ty: m.ty };
  const clicks = [[2.9, onWin(win, 355, 142)]];
  const cur = kf(u, clickPath([1.0, onWin(win, 760, 520)], clicks, 0.6));
  const done = prog(u, 2.95, 3.4);
  return (
    <>
      <Headline t={t} a={a + 0.2} b={b - 0.15} eyebrow="Alerts" title="Alerts on price, footprint and POC." />
      <Window x={win.x} y={win.y} s={win.s} o={m.o} ty={m.ty} rotX={m.rotX} layers={[{ src: IMG.alerts, o: 1 }, { src: IMG.alertsDone, o: done }]} />
      <div style={{ position: "absolute", inset: 0, opacity: m.o }}>
        <Callout u={u} s0={0.9} s1={2.8} x={110} y={430} side="left">{(p) => (
          <>
            <Lbl>BTC/USDT · Price</Lbl>
            <div style={{ fontSize: 30, fontWeight: 500 }}><span style={{ color: C.blue }}>Above</span> $70,000</div>
            <div style={{ height: 8, borderRadius: 4, background: C.track, marginTop: 14 }}><div style={{ height: 8, borderRadius: 4, width: `${99.8 * p}%`, background: C.blue }} /></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.sub, marginTop: 8 }}><span>now ${count(69840, p)}</span><span>0.2% away</span></div>
          </>
        )}</Callout>
        <Callout u={u} s0={1.3} s1={2.8} x={1510} y={520} side="right">{(p) => (
          <>
            <Lbl>Tools</Lbl>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[["Price", C.cyan], ["Footprint", C.amber], ["POC", C.blue], ["Indicators", C.red]].map(([n, c], i) => <span key={n} style={{ opacity: clamp(p * 4 - i) }}><Chip c={c}>{n}</Chip></span>)}
            </div>
            <div style={{ fontSize: 14, color: C.sub, marginTop: 14 }}>Once Only · Watch 1h close</div>
          </>
        )}</Callout>
        <Callout u={u} s0={3.4} s1={len - 0.5} x={1510} y={430} side="right">{(p) => (
          <>
            <Lbl>Completed</Lbl>
            <div style={{ fontSize: 22, fontWeight: 500 }}>SOL/USDT <span style={{ color: C.amber }}>Enters</span> $70,000</div>
            <div style={{ fontSize: 13, color: C.sub, marginTop: 6 }}>Sustained 2h · 70% range . 1h</div>
            <div style={{ marginTop: 14, opacity: p }}><Chip c={C.green}>● News Blackout</Chip></div>
          </>
        )}</Callout>
        <Cursor {...cur} o={inOut(u, 0.95, len - 0.6, 0.3, 0.35)} press={pressedAt(u, clicks)} />
      </div>
    </>
  );
}

// 3 — AI analyst: the cursor picks a prompt suggestion and it types into the ask bar
function Chat({ t }) {
  const [a, b] = S.chat; if (t < a - 0.1 || t > b + 0.1) return null;
  const { u, len } = local(t, a, b, 5.4);
  const m = winMotion(u, len);
  const win = { x: 960, y: 660, s: 0.72, ty: m.ty };
  const clicks = [[2.0, onWin(win, 258, 582)]];
  const cur = kf(u, clickPath([0.9, onWin(win, 640, 520)], clicks, 0.7));
  const PROMPT = "Breakdown this week's ETH movement";
  const typed = PROMPT.slice(0, Math.round(PROMPT.length * clamp((u - 2.4) / 1.3)));
  const send = prog(u, 3.8, 4.1);
  return (
    <>
      <Headline t={t} a={a + 0.2} b={b - 0.15} eyebrow="AI analyst" title="Ask anything. Trade smarter." />
      <Window x={win.x} y={win.y} s={win.s} o={m.o} ty={m.ty} rotX={m.rotX} layers={[{ src: IMG.chat, o: 1 }]} />
      <div style={{ position: "absolute", inset: 0, opacity: m.o }}>
        <Callout u={u} s0={0.9} s1={2.3} x={1510} y={440} side="right">{() => (
          <>
            <Lbl>Prompt suggestions</Lbl>
            {[["Price Action", "Breakdown this week's ETH movement"], ["Chart Pattern", "Head and shoulders forming on BNB?"]].map(([h, s]) => (
              <div key={h} style={{ padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.line}`, marginTop: 8 }}>
                <div style={{ fontSize: 13, color: C.blue }}>{h}</div><div style={{ fontSize: 13, marginTop: 3 }}>{s}</div>
              </div>))}
          </>
        )}</Callout>
        <Callout u={u} s0={2.3} s1={len - 0.5} x={1470} y={560} w={380} side="right">{() => (
          <>
            <Lbl>Your AI analyst</Lbl>
            <div style={{ display: "flex", alignItems: "center", gap: 10, height: 50, padding: "0 8px 0 16px", borderRadius: 25, border: `1.5px solid ${C.blue}`, background: "#0A0F33" }}>
              <span style={{ flex: 1, fontSize: 15, color: typed ? C.text : C.sub, whiteSpace: "nowrap", overflow: "hidden" }}>{typed || "Ask Anything.."}<span style={{ opacity: typed.length < PROMPT.length && Math.sin(u * 14) > 0 ? 1 : 0 }}>|</span></span>
              <span style={{ width: 36, height: 36, borderRadius: 18, display: "grid", placeItems: "center", background: send > 0 ? C.blue : "transparent", transform: `scale(${1 - 0.1 * Math.sin(send * Math.PI)})` }}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M3.5 20.5l17-8.5-17-8.5 2.5 8.5z" fill={send > 0 ? "#fff" : C.blue} /></svg>
              </span>
            </div>
          </>
        )}</Callout>
        <Cursor {...cur} o={inOut(u, 0.85, 3.0, 0.3, 0.35)} press={pressedAt(u, clicks)} />
      </div>
    </>
  );
}

// 4 — Overnight discoveries (infographic): the falsification funnel, then a surviving strategy
const FUNNEL = [["Generated", 642], ["passed FAST filter", 128], ["passed regime test", 31], ["passed CPCV +PBO + DSR", 3]];
function Funnel({ u }) {
  const draw = prog(u, 0.7, 2.3);
  const h = [150, 86, 48, 4]; // stage heights at each column boundary
  const xs = [0, 190, 380, 570, 760];
  const top = (i) => 170 - (i < 4 ? h[i] : 2) / 2;
  const path = `M0 ${top(0)} C 90 ${top(0)}, 120 ${top(1)}, 190 ${top(1)} C 270 ${top(1)}, 300 ${top(2)}, 380 ${top(2)} C 460 ${top(2)}, 500 ${top(3)}, 570 ${top(3)} L 760 ${top(3)} L 760 ${340 - top(3)} L 570 ${340 - top(3)} C 500 ${340 - top(3)}, 460 ${340 - top(2)}, 380 ${340 - top(2)} C 300 ${340 - top(2)}, 270 ${340 - top(1)}, 190 ${340 - top(1)} C 120 ${340 - top(1)}, 90 ${340 - top(0)}, 0 ${340 - top(0)} Z`;
  return (
    <div style={{ width: 820, padding: "24px 30px 28px", borderRadius: 20, background: C.card, border: `1px solid ${C.line}`, boxShadow: "0 50px 90px -30px rgba(0,0,0,.85)", fontFamily: FONT, color: C.text, boxSizing: "border-box" }}>
      <div style={{ fontSize: 20, fontWeight: 500 }}>Falsification Funnel</div>
      <div style={{ display: "flex", marginTop: 18 }}>
        {FUNNEL.map(([n, v], i) => {
          const p = prog(u, 0.8 + i * 0.35, 1.4 + i * 0.35);
          return <div key={n} style={{ width: 190, opacity: clamp(p * 2) }}><div style={{ fontSize: 13, color: C.sub }}>{n}</div><div style={{ fontSize: 26, fontWeight: 600, marginTop: 4, color: i === 3 ? C.blue : C.text }}>{count(v, p)}</div></div>;
        })}
      </div>
      <svg width="760" height="200" viewBox="0 100 760 140" style={{ marginTop: 10, overflow: "visible" }}>
        <defs>
          <linearGradient id="fun" x1="0" x2="1"><stop offset="0" stopColor="#3D5BF5" /><stop offset=".7" stopColor="#7FA6FF" /><stop offset=".76" stopColor={C.red} /><stop offset="1" stopColor={C.red} /></linearGradient>
          <clipPath id="funClip"><rect x="0" y="0" width={760 * draw} height="400" /></clipPath>
        </defs>
        {xs.slice(1, 4).map((x) => <line key={x} x1={x} x2={x} y1="90" y2="250" stroke="rgba(130,150,255,.2)" strokeDasharray="3 4" />)}
        <path d={path} fill="url(#fun)" clipPath="url(#funClip)" opacity=".95" />
      </svg>
    </div>
  );
}
function StrategyCard({ p }) {
  return (
    <div style={{ width: 380, padding: 22, borderRadius: 18, background: C.card, border: `1px solid ${C.line}`, boxShadow: "0 50px 90px -30px rgba(0,0,0,.85)", fontFamily: FONT, color: C.text, boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 22, fontWeight: 500 }}><span style={{ width: 10, height: 10, borderRadius: 5, background: C.red }} />MeanRev-VAL</div>
        <div style={{ textAlign: "right" }}><div style={{ fontSize: 22, fontWeight: 600 }}>{count(58, p)}%</div><div style={{ fontSize: 12, color: C.sub }}>Win Rate</div></div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}><Chip c={C.red}>Breakout</Chip><Chip c={C.sub} on={false}>Long Spot</Chip></div>
      <div style={{ display: "flex", gap: 26, marginTop: 20 }}>
        {[["MAX DD", `${(-12.6 * p).toFixed(1)}%`], ["PROFIT FACTOR", (1.74 * p).toFixed(2)], ["SHARPE", (2.14 * p).toFixed(2)]].map(([n, v]) => (
          <div key={n}><div style={{ fontSize: 11, color: C.sub, letterSpacing: ".04em" }}>{n}</div><div style={{ fontSize: 22, fontWeight: 500, marginTop: 4 }}>{v}</div></div>))}
      </div>
      <div style={{ marginTop: 18, padding: "10px 12px 6px", borderRadius: 12, background: "#070C2B", border: `1px solid ${C.line}` }}>
        <div style={{ fontSize: 12, color: C.sub }}>Equity Curve</div>
        <svg width="330" height="70" viewBox="0 0 330 70">
          <path d="M0 52 C 30 48, 40 40, 70 44 S 120 30, 150 34 S 200 26, 230 32 S 280 20, 330 14" fill="none" stroke={C.cyan} strokeWidth="2.5" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />
        </svg>
      </div>
    </div>
  );
}
function Discover({ t }) {
  const [a, b] = S.discover; if (t < a - 0.1 || t > b + 0.1) return null;
  const { u, len } = local(t, a, b, 5.6);
  const e = prog(u, 0.1, 0.8), out = prog(u, len - 0.45, len);
  const banner = prog(u, 0.4, 1.0);
  const shift = prog(u, 3.0, 3.7), card = prog(u, 3.3, 4.0);
  return (
    <>
      <Headline t={t} a={a + 0.2} b={b - 0.15} eyebrow="Overnight discoveries" title="642 candidates in. 3 survive." />
      <div style={{ position: "absolute", inset: 0, opacity: e * (1 - out), transform: `translateY(${60 * (1 - e) - 30 * out}px)` }}>
        <Place x={960} y={300} o={banner}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, height: 52, padding: "0 24px", borderRadius: 12, border: `1px solid ${C.line}`, background: "#0A1036", fontSize: 18, color: C.text, whiteSpace: "nowrap" }}>
            Last Night: {count(642, prog(u, 0.6, 1.6))} candidates generated <span style={{ color: C.sub }}>→</span> <b style={{ color: C.blue, fontWeight: 600 }}>{Math.round(3 * prog(u, 1.4, 1.9))}</b> survived the gauntlet
          </div>
        </Place>
        <Place x={960 - 230 * shift} y={640} s={1.05 - 0.07 * shift}><Funnel u={u} /></Place>
        <Place x={1500} y={650} o={card} ty={40 * (1 - card)} s={1.05}><StrategyCard p={prog(u, 3.5, 4.4)} /></Place>
      </div>
    </>
  );
}

// 5 — Library (infographic): strategy cards cycle forward; the regime filter follows the front card
const LIB = [
  ["MeanRev-VAL", "Breakout", "Long Spot", C.red, "All"],
  ["ReversalFade-4h", "Sideways", "Long Spot", C.blue, "Sideways"],
  ["Absorption-Put", "Reversal", "Long Spot", C.blue, "Reversal"],
  ["TurboMOVE-vol", "Volatile", "Short Spot", C.amber, "Volatile"],
];
const REG_C = { Breakout: C.red, Sideways: C.cyan, Reversal: C.blue, Volatile: C.amber };
function LibCard([name, regime, side, dot]) {
  return (
    <div style={{ width: 520, padding: "22px 24px", borderRadius: 18, background: C.card, border: `1px solid rgba(130,150,255,.26)`, boxShadow: "0 40px 80px -30px rgba(0,0,0,.9)", fontFamily: FONT, color: C.text, boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 24, fontWeight: 500 }}><span style={{ width: 11, height: 11, borderRadius: 6, background: dot }} />{name}</div>
        <div style={{ textAlign: "right" }}><div style={{ fontSize: 24, fontWeight: 600 }}>58%</div><div style={{ fontSize: 12, color: C.sub }}>Win Rate</div></div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}><Chip c={REG_C[regime]}>{regime}</Chip><Chip c={C.sub} on={false}>{side}</Chip></div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 22 }}>
        {["Paper Trade", "Fork"].map((n) => <span key={n} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${C.line}`, fontSize: 14, color: C.text }}>{n}</span>)}
      </div>
    </div>
  );
}
function Library({ t }) {
  const [a, b] = S.library; if (t < a - 0.1 || t > b + 0.1) return null;
  const { u, len } = local(t, a, b, 4.2);
  const e = prog(u, 0.1, 0.8), out = prog(u, len - 0.45, len);
  const step = kf(u, [[1.0, 0], [1.5, 1], [2.0, 1], [2.5, 2], [3.0, 2], [3.5, 3]]);
  const front = LIB[Math.min(3, Math.round(step))][4];
  return (
    <>
      <Headline t={t} a={a + 0.2} b={b - 0.15} eyebrow="Library" title="Strategies, sorted by market regime." />
      <div style={{ position: "absolute", inset: 0, opacity: e * (1 - out), transform: `translateY(${60 * (1 - e) - 30 * out}px)` }}>
        <Place x={960} y={330}>
          <div style={{ display: "flex", gap: 10 }}>
            {["All", "Sideways", "Reversal", "Breakdown", "Volatile"].map((n) => (
              <span key={n} style={{ padding: "9px 20px", borderRadius: 20, fontSize: 17, fontFamily: FONT, color: "#fff", background: n === front ? C.blue : "#111A4A", border: `1px solid ${n === front ? C.blue : C.line}` }}>{n}</span>))}
          </div>
        </Place>
        {LIB.map((c, i) => {
          const pos = i - step;
          if (pos < -1 || pos > 3) return null;
          const gone = clamp(-pos);
          const o = (1 - gone) * clamp(1 - pos * 0.28);
          return (
            <div key={c[0]} style={{ position: "absolute", left: 960, top: 600, zIndex: 10 - i, opacity: o, transform: `translate(-50%, -50%) translateY(${Math.max(0, pos) * -34 - gone * 60}px) scale(${1.15 - Math.max(0, pos) * 0.06})` }}>{LibCard(c)}</div>
          );
        })}
      </div>
    </>
  );
}

// Backdrop: black with low-opacity electric blue (locked).
const EB = (a) => `rgba(30,110,255,${a})`;
function Backdrop({ t }) {
  const fade = "radial-gradient(ellipse 62% 58% at 50% 42%, #000 0%, rgba(0,0,0,.5) 45%, transparent 78%)";
  const d = Math.sin(t * 0.25) * 60;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 960 - 1100 + d, top: -720, width: 2200, height: 1500, borderRadius: "50%", background: `radial-gradient(closest-side, ${EB(0.16)}, ${EB(0.05)} 55%, rgba(0,0,0,0))` }} />
      <div style={{ position: "absolute", left: 960 - 1000 - d, top: 820, width: 2000, height: 620, borderRadius: "50%", background: `radial-gradient(closest-side, ${EB(0.12)}, rgba(0,0,0,0))` }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${EB(0.09)} 1px, transparent 1px), linear-gradient(90deg, ${EB(0.09)} 1px, transparent 1px)`, backgroundSize: "80px 80px", backgroundPosition: "0 20px", WebkitMaskImage: fade, maskImage: fade }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 85% at 50% 45%, rgba(0,0,0,0) 60%, rgba(0,0,0,.7) 100%)" }} />
    </div>
  );
}

function Stage({ t }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", fontFamily: FONT, WebkitFontSmoothing: "antialiased" }}>
      <Backdrop t={t} />
      <Opening t={t} />
      <Terminal t={t} />
      <Alerts t={t} />
      <Chat t={t} />
      <Discover t={t} />
      <Library t={t} />
      <Closing t={t} />
    </div>
  );
}

// ---------- player (locked) ----------
const fmt = (s) => s.toFixed(1).padStart(4, "0");
const MARKS = [2.9, 8.6, 14.0, 19.4, 25.0, 28.4];

function Player() {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [chrome, setChrome] = useState(true);
  const [scale, setScale] = useState(0.5);
  const wrap = useRef(null), tRef = useRef(0), bar = useRef(null);

  useLayoutEffect(() => {
    const fit = () => { if (wrap.current) setScale(wrap.current.clientWidth / 1920); };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(wrap.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    let raf, last = performance.now();
    const step = (now) => {
      const nt = Math.min(DURATION, tRef.current + (now - last) / 1000);
      last = now; tRef.current = nt; setT(nt);
      if (nt >= DURATION) { setPlaying(false); return; }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const seek = (v) => { tRef.current = clamp(v, 0, DURATION); setT(tRef.current); };
  const toggle = () => { if (tRef.current >= DURATION) seek(0); setPlaying((p) => !p); };
  const restart = () => { seek(0); setPlaying(true); };

  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const go = () => setTimeout(() => { if (!reduce) setPlaying(true); }, 500);
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(go);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target && e.target.tagName === "INPUT") return;
      if (e.code === "Space") { e.preventDefault(); toggle(); }
      else if (e.key === "r" || e.key === "R") restart();
      else if (e.key === "h" || e.key === "H") setChrome((c) => !c);
      else if (e.key === "ArrowRight") seek(tRef.current + 1);
      else if (e.key === "ArrowLeft") seek(tRef.current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  window.__zync = { seek, pause: () => setPlaying(false) };

  const scrub = (e) => {
    const r = bar.current.getBoundingClientRect();
    seek(((e.clientX - r.left) / r.width) * DURATION);
  };

  return (
    <div className="player">
      <div className="frame" ref={wrap}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
          <Stage t={t / PACE} />
        </div>
      </div>
      {chrome && (
        <div className="controls">
          <button id="play" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
            {playing
              ? <svg width="16" height="16" viewBox="0 0 16 16"><rect x="3" y="2" width="3.5" height="12" rx="1" fill="currentColor" /><rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="currentColor" /></svg>
              : <svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 2.5v11a.8.8 0 0 0 1.2.7l9-5.5a.8.8 0 0 0 0-1.4l-9-5.5A.8.8 0 0 0 4 2.5z" fill="currentColor" /></svg>}
          </button>
          <button id="restart" onClick={restart} aria-label="Restart">
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3.5 8a4.5 4.5 0 1 0 1.4-3.3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" /><path d="M3 2.2v3.3h3.3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="bar" ref={bar} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); scrub(e); }}
            onPointerMove={(e) => { if (e.buttons) scrub(e); }} role="slider" aria-label="Timeline"
            aria-valuemin={0} aria-valuemax={DURATION} aria-valuenow={Math.round(t)} tabIndex={0}>
            {MARKS.map((m) => <span key={m} className="tick" style={{ left: `${(m * PACE / DURATION) * 100}%` }} />)}
            <div className="fill" style={{ width: `${(t / DURATION) * 100}%` }} />
          </div>
          <span className="time">{fmt(t)} / {DURATION.toFixed(1)}</span>
          <span className="hint">Space play · R restart · H hide controls</span>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Player />);
