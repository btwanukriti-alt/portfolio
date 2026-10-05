// clihub: 10s dashboard cut (loop). The API Gateway stats dashboard from the clihub Figma file,
// shown as a working prototype: it rises in, the cursor clicks through Overview, Performance,
// Storage and Network, and one small metric callout appears beside each tab. Grey canvas, no
// drop shadows. Scene pieces come from the 20s agency cut (clihub-showcase-20s-react).
// One clock t; <Stage t sw sh /> renders the frame.
import stats_head from "./assets/stats_head.png";
import tab_overview from "./assets/tab_overview.png";
import tab_performance from "./assets/tab_performance.png";
import tab_storage from "./assets/tab_storage.png";
import tab_network from "./assets/tab_network.png";

// ---------- theme (sampled from the clihub Figma file) ----------
const C = {
  stage: "#0A0A0D",
  ink: "#F4F4F6",      // headlines
  mute: "#8B8B96",     // eyebrows, tagline
  // app component tokens
  card: "#111119", raised: "#171721", line: "#25252D", track: "#2B2B33",
  text: "#E4E4E4", sub: "#909090", icon: "#C8C8CC",
  green: "#4FA084", check: "#71F0C0",
  keyBlue: "#4CC5F4", serverPurple: "#B86BD0", lavender: "#CABBFF",
  primary: "#7D28FE",
};
const FONT = "'Outfit', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";
const DURATION = 10;
const IMG = { stats_head, tab_overview, tab_performance, tab_storage, tab_network };

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
const inOut = (u, a, b, d = 0.6, e = 0.4) => prog(u, a, a + d) * (1 - prog(u, b - e, b)); // fade in at a, out by b

// Stage-level cursor
const Cursor = ({ x, y, o, press, size = 1 }) => o > 0.001 && (
  <svg width="22" height="28" viewBox="0 0 22 28" style={{ position: "absolute", left: x - 2, top: y - 2, opacity: o, transform: `scale(${(press ? 0.85 : 1) * size})`, transformOrigin: "2px 2px", zIndex: 50 }}>
    <path d="M2 2 L2 22 L7.5 17 L11 25 L14.5 23.5 L11 15.8 L18.5 15.8 Z" fill="#fff" stroke="#111119" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);
// Builds cursor keyframes that travel to each click target just before its click time
const clickPath = (start, clicks, travel = 0.4) => {
  const keys = [start];
  clicks.forEach(([ct, p]) => { keys.push([ct - travel, keys[keys.length - 1][1]]); keys.push([ct - 0.04, p]); });
  return keys;
};
const pressedAt = (u, clicks) => clicks.some(([ct]) => u > ct && u < ct + 0.14);

// 2 — Host stats: the real tab set (Overview → Performance → Storage → Network → Activity), switched live
const TABS = [["Overview", 83], ["Performance", 284], ["Storage", 480], ["Network", 659], ["Activity", 837]];
const TAB_IMG = ["tab_overview", "tab_performance", "tab_storage", "tab_network"];
function StatsPanel({ pos }) {
  const i0 = Math.floor(pos), f = pos - i0;
  const cx = TABS[i0][1] + ((TABS[Math.min(4, i0 + 1)][1] - TABS[i0][1]) * f);
  return (
    <div style={{ width: 960, padding: "0 24px 24px", background: C.raised, borderRadius: 18, fontFamily: FONT }}>
      <img src={IMG.stats_head} alt="" style={{ display: "block", width: 960, height: 88 }} />
      <div style={{ position: "relative", height: 50, background: "#101018", borderRadius: "10px 10px 0 0" }}>
        {TABS.map(([name, x], i) => {
          const near = clamp(1 - Math.abs(pos - i));
          return <div key={name} style={{ position: "absolute", left: x, top: 13, transform: "translateX(-50%)", fontSize: 16, color: C.text, fontWeight: near > 0.5 ? 600 : 400, opacity: 0.62 + 0.38 * near, whiteSpace: "nowrap" }}>{name}</div>;
        })}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: C.track }} />
        <div style={{ position: "absolute", left: cx - 80, width: 160, bottom: 0, height: 2, background: C.text, borderRadius: 1 }} />
      </div>
      <div style={{ position: "relative", height: 540, background: "#101018", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>
        {TAB_IMG.map((k, i) => {
          const o = i >= pos ? clamp(1 - (i - pos) * 1.4) : clamp(1 - (pos - i) * 3); // incoming leads, outgoing clears fast: no ghosting
          return o > 0.001 && <img key={k} src={IMG[k]} alt="" style={{ position: "absolute", left: 0, top: 0, width: 960, height: 540, opacity: o, transform: `translateY(${(i - pos) * 18}px)` }} />;
        })}
      </div>
    </div>
  );
}
// Floating metric callouts, one per stats tab (values from the design)
const cardStyle = { background: "#15151D", border: `1px solid ${C.line}`, borderRadius: 16, padding: "20px 22px", fontFamily: FONT, boxSizing: "border-box" };
const Lbl = ({ children }) => <div style={{ fontSize: 14, color: C.sub, marginBottom: 10 }}>{children}</div>;
const count = (v, p, d = 0) => (v * p).toFixed(d);
function StatCallout({ i, u, s0, s1 }) {
  const e = inOut(u, s0, s1, 0.35, 0.3); if (e <= 0.001) return null;
  const p = prog(u, s0 + 0.1, s0 + 0.75);
  const right = i % 2 === 0;
  const pos = right ? { left: 960 + 24 - 70 } : { left: -230 };
  let body;
  if (i === 0) body = (<><Lbl>Uptime</Lbl><div style={{ fontSize: 30, fontWeight: 500, color: "#4FD1A5" }}>15 days, 6 hours</div>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 15, color: C.text }}><span style={{ width: 9, height: 9, borderRadius: 5, background: C.green, boxShadow: `0 0 0 ${4 + 4 * Math.sin(u * 6) ** 2}px rgba(79,160,132,.18)` }} />Connected</div></>);
  if (i === 1) body = (<><Lbl>Total CPU Usage</Lbl><div style={{ display: "flex", alignItems: "center", gap: 18 }}>
    <svg width="84" height="84" viewBox="0 0 84 84"><circle cx="42" cy="42" r="34" fill="none" stroke={C.track} strokeWidth="8" /><circle cx="42" cy="42" r="34" fill="none" stroke="#51AFD4" strokeWidth="8" strokeLinecap="round" pathLength="100" strokeDasharray={`${45 * p} 100`} transform="rotate(-90 42 42)" /></svg>
    <div><div style={{ fontSize: 38, fontWeight: 500, color: C.text }}>{count(45, p)}%</div><div style={{ fontSize: 13, color: C.sub }}>Intel Xeon E5-2676 v3</div></div></div></>);
  if (i === 2) body = (<><Lbl>Used Storage</Lbl><div style={{ fontSize: 32, fontWeight: 500, color: C.text }}>{count(184, p)} GB <span style={{ fontSize: 17, color: C.sub }}>of 200 GB</span></div>
    <div style={{ height: 8, borderRadius: 4, background: C.track, marginTop: 14 }}><div style={{ height: 8, borderRadius: 4, width: `${92 * p}%`, background: "#D9485F" }} /></div>
    <div style={{ fontSize: 13, color: C.sub, marginTop: 8 }}>16 GB free</div></>);
  if (i === 3) {
    const spark = (c, seed) => <svg width="110" height="30" viewBox="0 0 110 30">{Array.from({ length: 14 }, (_, k) => { const h = 6 + 20 * Math.abs(Math.sin(k * 1.7 + seed + u * 3)); return <rect key={k} x={k * 8} y={30 - h} width="5" height={h} rx="1.5" fill={c} />; })}</svg>;
    body = (<><Lbl>Eth0</Lbl>{[["Download", "1.1", "#C6B8FF", 0], ["Upload", "1.6", "#4FD1A5", 2]].map(([n, v, c, sd]) => (
      <div key={n} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginTop: 8 }}>
        <div><div style={{ fontSize: 13, color: C.sub }}>{n}</div><div style={{ fontSize: 26, fontWeight: 500, color: c }}>{v}<span style={{ fontSize: 14, color: C.sub }}> MB/s</span></div></div>{spark(c, sd)}</div>))}</>);
  }
  if (i === 4) body = (<><Lbl>Processes</Lbl><div style={{ display: "flex", gap: 22 }}>{[["Total", 187], ["Running", 3], ["Sleeping", 240]].map(([n, v]) => (
    <div key={n}><div style={{ fontSize: 30, fontWeight: 500, color: C.text }}>{count(v, p)}</div><div style={{ fontSize: 13, color: C.sub }}>{n}</div></div>))}</div></>);
  return (
    <div style={{ position: "absolute", top: 250 + (i % 2) * 90, width: 300, ...pos, ...cardStyle, opacity: e, transform: `translate(${(right ? 30 : -30) * (1 - e)}px, ${12 * (1 - e)}px)`, zIndex: 20 }}>{body}</div>
  );
}

// ================= the dashboard shot =================
const INK = "#0E1424", SUB = "#4A5468";
const CLICK = [2.5, 4.5, 6.5]; // Performance, Storage, Network
const CALLOUTS = [[1.0, 2.55], [3.0, 4.55], [5.0, 6.55], [7.0, 9.1]]; // one per tab, while it is open

function Headline({ t }) {
  const out = prog(t, 9.0, 9.5);
  const e = prog(t, 0.15, 0.7);
  const words = "Everything about a server, one tab away.".split(" ");
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 64, textAlign: "center" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "7px 16px 7px 12px", borderRadius: 999, border: "1px solid rgba(255,255,255,.8)", background: "rgba(255,255,255,.45)", opacity: e * (1 - out), transform: `translateY(${(1 - e) * 12 - out * 10}px)`, marginBottom: 18 }}>
        <span style={{ width: 8, height: 8, borderRadius: 4, background: INK }} />
        <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: SUB }}>SSH client · Host stats</span>
      </div>
      <div style={{ fontSize: 62, fontWeight: 600, letterSpacing: "-0.035em", color: INK, lineHeight: 1.15, whiteSpace: "nowrap" }}>
        {words.map((w, k) => {
          const p = prog(t, 0.3 + k * 0.07, 1.0 + k * 0.07);
          return (
            <span key={k} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: 8, marginRight: k < words.length - 1 ? "0.26em" : 0 }}>
              <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 110 - out * 110}%)`, opacity: Math.min(p, 1 - out) }}>{w}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function Dashboard({ t }) {
  const e = prog(t, 0.05, 0.95);
  const out = prog(t, 9.15, 10);
  const clicks = CLICK.map((ct, i) => [ct, { x: TABS[i + 1][1] + 24 + 12, y: 88 + 30 }]);
  const pos = kf(t, [[2.5, 0], [2.9, 1], [4.5, 1], [4.9, 2], [6.5, 2], [6.9, 3]]);
  const cur = kf(t, clickPath([1.7, { x: 820, y: 640 }], clicks, 0.55));
  // Slow camera push across the shot, then it leaves past the lens for the loop.
  const s = 1.06 * (0.9 + 0.1 * e) * (1 + 0.035 * (t / DURATION)) * (1 + 0.22 * out);
  const blur = 10 * (1 - e) + 14 * out;
  return (
    <div style={{ position: "absolute", left: 960, top: 648, opacity: e * (1 - out), filter: blur > 0.3 ? `blur(${blur.toFixed(2)}px)` : "none", perspective: 2400 }}>
      <div style={{ position: "relative", transform: `translate(-50%, -50%) translateY(${70 * (1 - e)}px) rotateX(${14 * (1 - e)}deg) scale(${s})` }}>
        <div style={{ position: "relative", borderRadius: 18, border: "1px solid rgba(255,255,255,.55)" }}>
          <StatsPanel pos={pos} />
          {CALLOUTS.map(([s0, s1], i) => <StatCallout key={i} i={i} u={t} s0={s0} s1={s1} />)}
          <Cursor {...cur} o={inOut(t, 1.6, 8.9, 0.3, 0.3)} press={pressedAt(t, clicks)} size={1.15} />
        </div>
      </div>
    </div>
  );
}

// ---- Backdrop: grey only. Soft radial gradient on the swatch #B9C7DB, a slow drifting light, grain. ----
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";
function Backdrop({ t, w, h }) {
  const a = (t / DURATION) * Math.PI * 2;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "radial-gradient(ellipse 85% 80% at 50% 42%, #C8D3E2, #A9B7CB)" }}>
      <div style={{ position: "absolute", left: w / 2 + 240 * Math.cos(a) - 1100, top: h / 2 - 80 + 80 * Math.sin(a) - 760, width: 2200, height: 1520, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(234,239,246,.8), rgba(234,239,246,0))" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: GRAIN, opacity: 0.06, mixBlendMode: "overlay" }} />
    </div>
  );
}

// sw x sh is the canvas in stage px (at least 1920x1080): the backdrop fills it and the
// 1920x1080 composition sits centred.
export function Stage({ t, sw = 1920, sh = 1080 }) {
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: sw, height: sh, overflow: "hidden", fontFamily: FONT, WebkitFontSmoothing: "antialiased" }}>
      <Backdrop t={t} w={sw} h={sh} />
      <div style={{ position: "absolute", left: (sw - 1920) / 2, top: (sh - 1080) / 2, width: 1920, height: 1080 }}>
        <Dashboard t={t} />
        <Headline t={t} />
      </div>
    </div>
  );
}

export { DURATION };
