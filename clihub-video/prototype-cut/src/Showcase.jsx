// clihub: 12s cut (loop). The cursor drags out a selection box and the API Gateway stats
// dashboard fills it; the cursor clicks through Overview, Performance, Storage and Network with
// one small callout per tab; then the window steps through the other features (Terminal + Ask AI,
// SFTP, Port mapping, Key manager). Real screens from the clihub Figma file, shown as a working
// prototype. Grey canvas, no drop shadows. One clock t; <Stage t sw sh /> renders the frame.
import stats_head from "./assets/stats_head.png";
import tab_overview from "./assets/tab_overview.png";
import tab_performance from "./assets/tab_performance.png";
import tab_storage from "./assets/tab_storage.png";
import tab_network from "./assets/tab_network.png";
import terminal from "./assets/terminal.png";
import panel_askai from "./assets/panel_askai.png";
import sftp from "./assets/sftp.png";
import ports from "./assets/ports.png";
import keys from "./assets/keys.png";

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
const DURATION = 12;
const IMG = { stats_head, tab_overview, tab_performance, tab_storage, tab_network, terminal, panel_askai, sftp, ports, keys };

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

// ================= shots =================
const INK = "#0E1424", SUB = "#4A5468", BLUE = "#0D99FF";
// Dashboard rect: the 1008 x 702 stats panel at 1.06, centred at (960, 648).
const DS = 1.06, DW = 1008 * DS, DH = 702 * DS, DX = 960 - DW / 2, DY = 648 - DH / 2;
// Feature window: a 1280 x 832 screen at the dashboard's width, same centre.
const FK = DW / 1280, FW = DW, FH = 832 * FK, FX = DX, FY = 648 - FH / 2;
const onDash = (p) => ({ x: DX + p.x * DS, y: DY + p.y * DS });
const onWin = (p) => ({ x: FX + p.x * FK, y: FY + p.y * FK });

const TAB_CLICK = [2.6, 3.9, 5.1]; // Performance, Storage, Network
const CALLOUTS = [[1.6, 2.65], [2.95, 3.95], [4.25, 5.15], [5.45, 6.4]];
// Feature screens: when each is on, where the cursor clicks in it, and its label.
const FEATS = [
  { k: "terminal", a: 6.6, label: "Terminal + Ask AI", click: { x: 1232, y: 81 }, ct: 7.05 },
  { k: "sftp", a: 7.8, label: "SFTP", click: { x: 833, y: 385 }, ct: 8.4 },
  { k: "ports", a: 9.0, label: "Port mapping", click: { x: 776, y: 323 }, ct: 9.55 },
  { k: "keys", a: 10.1, label: "Key manager", click: { x: 335, y: 260 }, ct: 10.6 },
];
const FEAT_END = 11.2;

function Headline({ t, a, b, eyebrow, title }) {
  if (t < a || t > b) return null;
  const out = prog(t, b - 0.45, b);
  const e = prog(t, a, a + 0.5);
  const words = title.split(" ");
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 58, textAlign: "center" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "7px 16px 7px 12px", borderRadius: 999, border: "1px solid rgba(255,255,255,.8)", background: "rgba(255,255,255,.45)", opacity: e * (1 - out), transform: `translateY(${(1 - e) * 12 - out * 10}px)`, marginBottom: 16 }}>
        <span style={{ width: 8, height: 8, borderRadius: 4, background: INK }} />
        <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: SUB }}>{eyebrow}</span>
      </div>
      <div style={{ fontSize: 60, fontWeight: 600, letterSpacing: "-0.035em", color: INK, lineHeight: 1.15, whiteSpace: "nowrap" }}>
        {words.map((w, k) => {
          const p = prog(t, a + 0.12 + k * 0.07, a + 0.8 + k * 0.07);
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

// Figma-style selection box (blue, white corner handles, size label), no shadow.
function Selection({ x, y, w, h, o, label }) {
  if (o <= 0.001) return null;
  const hd = (hx, hy, i) => <div key={i} style={{ position: "absolute", left: hx - 5, top: hy - 5, width: 10, height: 10, background: "#fff", border: `1.5px solid ${BLUE}`, boxSizing: "border-box" }} />;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, border: `2px solid ${BLUE}`, background: "rgba(13,153,255,.06)", boxSizing: "border-box" }} />
      {[[x, y], [x + w, y], [x, y + h], [x + w, y + h]].map(([hx, hy], i) => hd(hx, hy, i))}
      <div style={{ position: "absolute", left: x + w / 2, top: y + h + 10, transform: "translateX(-50%)", background: BLUE, color: "#fff", fontSize: 15, fontWeight: 500, lineHeight: "24px", padding: "0 9px", borderRadius: 5, whiteSpace: "nowrap" }}>{label}</div>
    </div>
  );
}

function Dashboard({ t }) {
  if (t < 1.0 || t > 6.9) return null;
  const fill = prog(t, 1.05, 1.5);
  const out = prog(t, 6.3, 6.75);
  const clicks = TAB_CLICK.map((ct, i) => [ct, { x: TABS[i + 1][1] + 24 + 12, y: 88 + 30 }]);
  const pos = kf(t, [[2.6, 0], [2.95, 1], [3.9, 1], [4.25, 2], [5.1, 2], [5.45, 3]]);
  return (
    <div style={{ position: "absolute", left: DX, top: DY, width: DW, height: DH, opacity: fill * (1 - out), transform: `scale(${(0.985 + 0.015 * fill) * (1 - 0.04 * out)})` }}>
      <div style={{ transform: `scale(${DS})`, transformOrigin: "0 0", position: "relative", width: 1008, borderRadius: 18, outline: "1px solid rgba(255,255,255,.5)" }}>
        <StatsPanel pos={pos} />
        {CALLOUTS.map(([s0, s1], i) => <StatCallout key={i} i={i} u={t} s0={s0} s1={s1} />)}
      </div>
    </div>
  );
}

// SFTP capture fix: its recent connections show "192.333.4.545" (not a valid IP).
const SftpFix = () => [0, 1, 2].map((i) => (
  <div key={i} style={{ position: "absolute", left: 804, top: 563 + 82 * i, width: 150, height: 22, background: "#111119", color: "#A3A3AC", fontSize: 14, lineHeight: "22px", fontFamily: FONT }}>192.168.1.100</div>
));

function Features({ t }) {
  if (t < 6.4) return null;
  const e = prog(t, 6.45, 6.9);
  return (
    <div style={{ position: "absolute", left: FX, top: FY, width: FW, height: FH, opacity: e, transform: `scale(${0.97 + 0.03 * e})`, borderRadius: 16, overflow: "hidden", outline: "1px solid rgba(255,255,255,.5)", background: "#111119" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 832, transform: `scale(${FK})`, transformOrigin: "0 0" }}>
        {FEATS.map((f, i) => {
          const next = FEATS[i + 1];
          const inP = i === 0 ? 1 : prog(t, f.a - 0.2, f.a + 0.25);
          const outP = next ? prog(t, next.a - 0.2, next.a + 0.05) : 0;
          const o = inP * (1 - outP);
          if (o <= 0.001) return null;
          return (
            <div key={f.k} style={{ position: "absolute", inset: 0, opacity: o, transform: `translateX(${40 * (1 - inP) - 40 * outP}px)` }}>
              <img src={IMG[f.k]} alt="" draggable={false} style={{ position: "absolute", inset: 0, width: 1280, height: 832 }} />
              {f.k === "sftp" && <SftpFix />}
              {f.k === "terminal" && (() => {
                const p = prog(t, 7.1, 7.55);
                return p > 0 && <img src={IMG.panel_askai} alt="" style={{ position: "absolute", right: 14, top: 22, width: 383, height: 793, opacity: p, transform: `translateX(${60 * (1 - p)}px)`, borderRadius: 12, outline: "1px solid rgba(255,255,255,.08)" }} />;
              })()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Feature label chip on the window's bottom edge.
function FeatureChip({ t }) {
  const f = [...FEATS].reverse().find((x) => t >= x.a - 0.1);
  if (!f || t > FEAT_END) return null;
  const p = prog(t, f.a - 0.1, f.a + 0.25);
  return (
    <div style={{ position: "absolute", left: 960, top: FY + FH - 26, transform: `translateX(-50%) translateY(${(1 - p) * 10}px)`, opacity: p * (1 - prog(t, FEAT_END - 0.3, FEAT_END)), padding: "10px 22px", borderRadius: 999, background: "#F4F6FA", border: "1px solid rgba(14,20,36,.08)", color: INK, fontSize: 22, fontWeight: 600, whiteSpace: "nowrap" }}>{f.label}</div>
  );
}

// One cursor for the whole cut: drags the selection, clicks the tabs, then a control on each feature screen.
function StageCursor({ t }) {
  const start = { x: DX, y: DY };
  const end = { x: DX + DW, y: DY + DH };
  const tabClicks = TAB_CLICK.map((ct, i) => [ct, onDash({ x: TABS[i + 1][1] + 24 + 12, y: 88 + 30 })]);
  const featClicks = FEATS.map((f) => [f.ct, onWin(f.click)]);
  const keys = [[0, { x: start.x - 90, y: start.y - 60 }], [0.25, start], [1.2, end], [1.6, { x: end.x - 120, y: end.y - 40 }]];
  [...tabClicks, ...featClicks].forEach(([ct, p]) => { keys.push([ct - 0.45, keys[keys.length - 1][1]]); keys.push([ct - 0.04, p]); });
  keys.push([FEAT_END, { x: 1500, y: 980 }]);
  const cur = kf(t, keys);
  const clicks = [[0.25, start], ...tabClicks, ...featClicks];
  const press = (t > 0.25 && t < 1.2) || pressedAt(t, clicks);
  const ripple = clicks.map(([ct]) => prog(t, ct, ct + 0.5)).find((p) => p > 0 && p < 1);
  return (
    <>
      {ripple !== undefined && <div style={{ position: "absolute", left: cur.x - 30, top: cur.y - 30, width: 60, height: 60, borderRadius: 30, border: `2px solid ${INK}`, opacity: 0.5 * (1 - ripple), transform: `scale(${0.4 + ripple})` }} />}
      <Cursor {...cur} o={inOut(t, 0, FEAT_END + 0.2, 0.25, 0.3)} press={press} size={1.2} />
    </>
  );
}

function Shot({ t, children }) {
  const out = prog(t, FEAT_END, DURATION);
  const s = 1 + 0.25 * out;
  return <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `scale(${s})`, filter: out > 0.01 ? `blur(${(14 * out).toFixed(2)}px)` : "none" }}>{children}</div>;
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
  const drag = prog(t, 0.25, 1.2);
  const selO = Math.min(prog(t, 0.2, 0.3), 1 - prog(t, 1.45, 1.8));
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: sw, height: sh, overflow: "hidden", fontFamily: FONT, WebkitFontSmoothing: "antialiased" }}>
      <Backdrop t={t} w={sw} h={sh} />
      <div style={{ position: "absolute", left: (sw - 1920) / 2, top: (sh - 1080) / 2, width: 1920, height: 1080 }}>
        <Shot t={t}>
          <Dashboard t={t} />
          <Features t={t} />
          <FeatureChip t={t} />
          <Selection x={DX} y={DY} w={DW * drag} h={DH * drag} o={selO} label={`${Math.round(1008 * drag)} × ${Math.round(702 * drag)}`} />
          <StageCursor t={t} />
        </Shot>
        <Headline t={t} a={0.15} b={6.45} eyebrow="SSH client · Host stats" title="Everything about a server, one tab away." />
        <Headline t={t} a={6.5} b={11.5} eyebrow="Built in" title="Terminal, files, tunnels and keys." />
      </div>
    </div>
  );
}

export { DURATION };
