// clihub: 18.7s product-flow cut (loop). How the app is used, step by step, on the real screens
// from the clihub Figma file: a dragged selection box opens the window, then 1 Add a host,
// 2 Connect, 3 Monitor (all five dashboard tabs), 4 Run commands, 5 Move files, tracked by a step rail. Grey canvas, no
// drop shadows. One clock t; <Stage t sw sh /> renders the frame.
import newhost from "./assets/newhost.png";
import perf from "./assets/perf.png";
import terminal from "./assets/terminal.png";
import panel_askai from "./assets/panel_askai.png";
import sftp from "./assets/sftp.png";
import tab_overview from "./assets/tab_overview.png";
import tab_performance from "./assets/tab_performance.png";
import tab_storage from "./assets/tab_storage.png";
import tab_network from "./assets/tab_network.png";
import tab_activity from "./assets/tab_activity.png";

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
const DURATION = 18.7;
const IMG = { newhost, perf, terminal, panel_askai, sftp, tab_overview, tab_performance, tab_storage, tab_network, tab_activity };

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

// ---------- small vector icons (drawn to match the app's line icons) ----------
const I = {
  bars: (c = C.icon) => <svg width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="6" width="2" height="5" rx=".5" fill={c}/><rect x="5" y="3" width="2" height="8" rx=".5" fill={c}/><rect x="9" y="7" width="2" height="4" rx=".5" fill={c}/></svg>,
  prompt: (c = C.icon) => <svg width="14" height="12" viewBox="0 0 14 12"><path d="M1.5 2.5l3.5 3.5-3.5 3.5M7 10h5.5" stroke={c} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  doc: (c = C.icon) => <svg width="11" height="13" viewBox="0 0 11 13"><path d="M1 1.5A.5.5 0 011.5 1H7l3 3v7.5a.5.5 0 01-.5.5h-8a.5.5 0 01-.5-.5z" fill={c}/><path d="M3 6.5h5M3 8.5h5" stroke={C.card} strokeWidth="1"/></svg>,
  kebab: () => <svg width="4" height="16" viewBox="0 0 4 16"><circle cx="2" cy="2" r="1.8" fill={C.icon}/><circle cx="2" cy="8" r="1.8" fill={C.icon}/><circle cx="2" cy="14" r="1.8" fill={C.icon}/></svg>,
  chevron: (up) => <svg width="8" height="5" viewBox="0 0 8 5" style={{ transform: up ? "rotate(180deg)" : "none" }}><path d="M1 1l3 3 3-3" stroke={C.icon} strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  pencil: () => <svg width="12" height="12" viewBox="0 0 12 12"><path d="M1.5 10.5l.6-2.6 6-6 2 2-6 6z" fill={C.icon}/></svg>,
  trash: () => <svg width="11" height="12" viewBox="0 0 11 12"><path d="M1 2.5h9M4 2.5V1.2h3v1.3M2.2 2.5l.6 8.3h5.4l.6-8.3" stroke={C.icon} strokeWidth="1.2" fill="none" strokeLinejoin="round"/></svg>,
  tag: () => <svg width="15" height="15" viewBox="0 0 15 15"><path d="M1.5 1.5h6l6 6-6 6-6-6z" fill={C.icon}/><circle cx="4.6" cy="4.6" r="1.3" fill={C.card}/></svg>,
  group: () => <svg width="16" height="15" viewBox="0 0 16 15"><path d="M8 1l3.2 5.5H4.8z" fill={C.icon}/><circle cx="4" cy="11" r="3.2" fill={C.icon}/><rect x="9.2" y="8" width="6" height="6" rx="1" fill={C.icon}/></svg>,
  clock: () => <svg width="13" height="13" viewBox="0 0 13 13"><circle cx="6.5" cy="6.5" r="5.3" stroke={C.sub} strokeWidth="1.2" fill="none"/><path d="M6.5 3.6v3.2l2 1.3" stroke={C.sub} strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>,
  server: (c = C.sub, s = 13) => <svg width={s} height={s} viewBox="0 0 13 13"><rect x="1" y="1.5" width="11" height="4.2" rx="1" stroke={c} strokeWidth="1.2" fill="none"/><rect x="1" y="7.3" width="11" height="4.2" rx="1" stroke={c} strokeWidth="1.2" fill="none"/><circle cx="3.4" cy="3.6" r=".7" fill={c}/><circle cx="3.4" cy="9.4" r=".7" fill={c}/></svg>,
  key: (c = C.lavender, s = 22) => <svg width={s} height={s} viewBox="0 0 22 22"><circle cx="15" cy="7" r="5" fill={c}/><circle cx="16.3" cy="5.7" r="1.5" fill={C.raised}/><path d="M11.6 10.4L3 19l2.2 2.2 1.6-1.6-1.4-1.4 1.4-1.4 1.4 1.4 1.4-1.4-1.4-1.4 3.4-3.4z" fill={c}/></svg>,
  check: (c = C.check, s = 16) => <svg width={s} height={s} viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke={c} strokeWidth="1.3" fill="none"/><path d="M5 8.2l2 2 4-4.2" stroke={c} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  tick: (c = "#52C79A") => <svg width="16" height="12" viewBox="0 0 16 12"><path d="M1.5 6.5l4 4 9-9" stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  ubuntu: (s = 26) => <svg width={s} height={s} viewBox="-13 -13 26 26"><circle r="7.4" fill="none" stroke="#E95420" strokeWidth="3" strokeDasharray="10.5 5" transform="rotate(-40.6)"/>{[60, 180, 300].map((a) => <circle key={a} r="2.9" cx={10.6 * Math.cos(a * Math.PI / 180)} cy={10.6 * Math.sin(a * Math.PI / 180)} fill="#E95420"/>)}</svg>,
  arch: (s = 20) => <svg width={s} height={s} viewBox="-10 -10 20 20"><path d="M0-9.5L8.8 9.5C5.5 7.4 3 6.6 0 6.6S-5.5 7.4-8.8 9.5z" fill="#1793D1"/></svg>,
  arrowLocal: (c) => <svg width="20" height="16" viewBox="0 0 20 16"><path d="M2 14V8a3 3 0 013-3h12M13 1l4 4-4 4" stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  arrowRemote: (c) => <svg width="20" height="16" viewBox="0 0 20 16"><path d="M18 14V8a3 3 0 00-3-3H3M7 1L3 5l4 4" stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  arrowDynamic: (c) => <svg width="20" height="16" viewBox="0 0 20 16"><path d="M3 4.5h14M13.5 1l3.5 3.5L13.5 8M17 11.5H3M6.5 8L3 11.5 6.5 15" stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  shield: (c) => <svg width="34" height="38" viewBox="0 0 34 38"><path d="M17 2l13 5v10c0 9-5.6 15.4-13 19C9.6 32.4 4 26 4 17V7z" stroke={c} strokeWidth="2.4" fill="none" strokeLinejoin="round"/><path d="M11.5 18.5l4 4 7.5-8" stroke={c} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

// Connection progress, rebuilt from the "Host" connecting / connected screens
function ConnectRing({ p, steps, done }) {
  const N = 72, R = 112;
  return (
    <svg width="300" height="300" viewBox="-150 -150 300 300" style={{ overflow: "visible" }}>
      <circle r="128" fill="none" stroke={C.line} strokeWidth="1.5" />
      {Array.from({ length: N }, (_, i) => {
        const a = (i / N) * Math.PI * 2 - Math.PI / 2;
        const lit = i / N < p;
        return <line key={i} x1={Math.cos(a) * (R - 7)} y1={Math.sin(a) * (R - 7)} x2={Math.cos(a) * (R + 7)} y2={Math.sin(a) * (R + 7)} stroke={lit ? "#BDBDBD" : C.track} strokeWidth="3" strokeLinecap="round" />;
      })}
      <g transform="translate(-116 0)"><circle r="25" fill={C.keyBlue} /><g transform="translate(-10 -10) scale(.9)">{I.key("#ffffff", 22)}</g></g>
      <g transform="translate(116 0)"><circle r="25" fill={C.serverPurple} /><g transform="translate(-9 -9) scale(1.4)">{I.server("#ffffff", 13)}</g></g>
      <g transform="translate(-17 -19)" opacity={1 - done}>{I.shield("#8A8A92")}</g>
      <g transform="translate(-17 -19)" opacity={done}>{I.shield(C.check)}</g>
    </svg>
  );
}
function ConnectSteps({ steps }) {
  const rows = [
    ['Starting a new connection to: "API Gateway" port "22"', "Connecting to 192.168.1.100"],
    ["Authenticating", "Verifying credentials"],
    ["Exporting key", "Key exported successfully to ~/.ssh/authorized_keys"],
  ];
  return (
    <div style={{ width: 338, boxSizing: "border-box", padding: "20px 22px", borderRadius: 10, background: "#101017", border: `1px solid ${C.line}`, display: "grid", gap: 14, fontFamily: FONT }}>
      {rows.map(([a, b], i) => (
        <div key={i} style={{ display: "flex", gap: 10, opacity: i === 0 ? 1 : 0.35 + 0.65 * steps[i - 1] }}>
          <div style={{ position: "relative", width: 16, height: 16, marginTop: 2, flex: "none" }}>
            <div style={{ position: "absolute", inset: 0, opacity: steps[i] }}>{I.check()}</div>
            <div style={{ position: "absolute", inset: 1, borderRadius: 8, border: `1.5px solid ${C.track}`, borderTopColor: "#8A8A92", opacity: 1 - steps[i] }} />
          </div>
          <div>
            <div style={{ fontSize: 14, color: C.text, lineHeight: 1.35 }}>{a}</div>
            <div style={{ fontSize: 10.5, color: C.sub, marginTop: 3 }}>{b}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

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

// ================= layout =================
const INK = "#0E1424", SUB = "#4A5468", BLUE = "#0D99FF";
// The app window: 1280 x 832 screens at FK, centred at (960, 574).
const FK = 0.8125, FW = 1280 * FK, FH = 832 * FK, FX = 960 - FW / 2, FY = 574 - FH / 2;
const onWin = (p) => ({ x: FX + p.x * FK, y: FY + p.y * FK });

const STEPS = [
  { a: 1.4, label: "Add a host", title: "Add a host in seconds." },
  { a: 4.6, label: "Connect", title: "Connect in one click." },
  { a: 7.4, label: "Monitor", title: "Watch it live." },
  { a: 13.0, label: "Run commands", title: "Run commands, with AI to help." },
  { a: 15.7, label: "Move files", title: "Move files across, side by side." },
];
const FLOW_END = 18.1;
// Monitor: the five dashboard tabs, clicked in turn (Overview is open on arrival).
const DASH_TABS = [["Overview", 83], ["Performance", 284], ["Storage", 480], ["Network", 659], ["Activity", 837]];
const DASH_IMG = ["tab_overview", "tab_performance", "tab_storage", "tab_network", "tab_activity"];
const TAB_AT = [7.4, 8.5, 9.6, 10.7, 11.8]; // when each tab opens
const stepAt = (t) => STEPS.reduce((k, s, i) => (t >= s.a ? i : k), 0);

// Cursor plan: [time, window point, click?]
const PLAN = [
  [1.9, { x: 1050, y: 289 }, 1],   // Host Address field
  [2.95, { x: 1050, y: 460 }, 1],  // Label field
  [4.15, { x: 1198, y: 788 }, 1],  // Create Host
  ...TAB_AT.slice(1).map((ct, i) => [ct, { x: 192 + DASH_TABS[i + 1][1] + 10, y: 262 }, 1]), // dashboard tabs
  [13.55, { x: 1232, y: 81 }, 1],  // Ask AI
  [16.25, { x: 156, y: 357 }, 1],  // select Backups
  [17.0, { x: 833, y: 385 }, 1],   // Connect to Host
];

// ================= pieces =================
function Headline({ t }) {
  const i = stepAt(t);
  const s = STEPS[i];
  const a = s.a;
  const b = i < STEPS.length - 1 ? STEPS[i + 1].a : FLOW_END + 0.3;
  if (t < a - 0.05) return null;
  const out = prog(t, b - 0.35, b);
  const e = prog(t, a, a + 0.45);
  const words = s.title.split(" ");
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 54, textAlign: "center" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "6px 16px 6px 8px", borderRadius: 999, border: "1px solid rgba(255,255,255,.8)", background: "rgba(255,255,255,.45)", opacity: e * (1 - out), marginBottom: 14 }}>
        <span style={{ width: 24, height: 24, borderRadius: 12, background: INK, color: "#fff", fontSize: 14, fontWeight: 600, display: "grid", placeItems: "center" }}>{i + 1}</span>
        <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: SUB }}>Step {i + 1} of 5</span>
      </div>
      <div style={{ fontSize: 58, fontWeight: 600, letterSpacing: "-0.035em", color: INK, lineHeight: 1.15, whiteSpace: "nowrap" }}>
        {words.map((w, k) => {
          const p = prog(t, a + 0.08 + k * 0.06, a + 0.7 + k * 0.06);
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

// Step rail under the window: done steps get a check, the current one is filled.
function StepRail({ t }) {
  const o = prog(t, 1.3, 1.8) * (1 - prog(t, FLOW_END, FLOW_END + 0.4));
  if (o <= 0.001) return null;
  const cur = stepAt(t);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: FY + FH + 30, display: "flex", justifyContent: "center", alignItems: "center", opacity: o }}>
      {STEPS.map((s, i) => {
        const done = i < cur, on = i === cur;
        const fill = on ? prog(t, s.a, s.a + 0.35) : done ? 1 : 0;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            {i > 0 && <div style={{ width: 46, height: 2, background: "rgba(14,20,36,.15)", position: "relative" }}><div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${100 * (i <= cur ? (i === cur ? fill : 1) : 0)}%`, background: INK }} /></div>}
            <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 16px 8px 8px", borderRadius: 999, background: on ? INK : "rgba(255,255,255,.5)", border: `1px solid ${on ? INK : "rgba(255,255,255,.85)"}`, color: on ? "#fff" : done ? INK : SUB, fontSize: 18, fontWeight: 500, whiteSpace: "nowrap" }}>
              <span style={{ width: 24, height: 24, borderRadius: 12, display: "grid", placeItems: "center", fontSize: 13, fontWeight: 600, background: on ? "#fff" : done ? INK : "rgba(14,20,36,.08)", color: on ? INK : done ? "#fff" : SUB }}>
                {done ? <svg width="12" height="10" viewBox="0 0 12 10"><path d="M1 5l3.5 3.5L11 1.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg> : i + 1}
              </span>
              {s.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Figma-style selection box (blue, white corner handles, live size label), no shadow.
function Selection({ t }) {
  const drag = prog(t, 0.25, 1.15);
  const o = Math.min(prog(t, 0.2, 0.3), 1 - prog(t, 1.35, 1.7));
  if (o <= 0.001) return null;
  const w = FW * drag, h = FH * drag;
  const hd = (hx, hy, i) => <div key={i} style={{ position: "absolute", left: hx - 5, top: hy - 5, width: 10, height: 10, background: "#fff", border: `1.5px solid ${BLUE}`, boxSizing: "border-box" }} />;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: FX, top: FY, width: w, height: h, border: `2px solid ${BLUE}`, background: "rgba(13,153,255,.06)", boxSizing: "border-box" }} />
      {[[FX, FY], [FX + w, FY], [FX, FY + h], [FX + w, FY + h]].map(([hx, hy], i) => hd(hx, hy, i))}
      <div style={{ position: "absolute", left: FX + w / 2, top: FY + h + 10, transform: "translateX(-50%)", background: BLUE, color: "#fff", fontSize: 15, fontWeight: 500, lineHeight: "24px", padding: "0 9px", borderRadius: 5, whiteSpace: "nowrap" }}>{Math.round(1280 * drag)} × {Math.round(832 * drag)}</div>
    </div>
  );
}

const typed = (s, t, a, b) => s.slice(0, Math.round(s.length * clamp((t - a) / (b - a))));
const Field = ({ x, y, text, caret }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 300, height: 26, background: "#101018", color: "#E4E4E4", fontSize: 16, lineHeight: "26px", fontFamily: FONT, whiteSpace: "nowrap" }}>
    {text}{caret && <span style={{ display: "inline-block", width: 2, height: 18, marginLeft: 2, verticalAlign: -3, background: "#E4E4E4" }} />}
  </div>
);
const blink = (t) => Math.floor(t * 2.6) % 2 === 0;

// Screen layers in the window, in window px (1280 x 832).
function Screens({ t }) {
  // Which screen is up, cross-fading with a small slide at each step.
  const layers = [
    { k: "newhost", a: 0, b: 4.6 },
    { k: "connect", a: 4.6, b: 7.4 },
    { k: "perf", a: 7.4, b: 13.0 },
    { k: "terminal", a: 13.0, b: 15.7 },
    { k: "sftp", a: 15.7, b: 99 },
  ];
  return layers.map((L, i) => {
    const inP = i === 0 ? 1 : prog(t, L.a - 0.15, L.a + 0.3);
    const outP = prog(t, L.b - 0.15, L.b + 0.15);
    const o = inP * (1 - outP);
    if (o <= 0.001) return null;
    let content = null;
    if (L.k === "newhost") {
      const ip = typed("192.168.1.100", t, 2.0, 2.65), label = typed("API Gateway", t, 3.05, 3.6);
      content = (
        <>
          <img src={IMG.newhost} alt="" style={{ position: "absolute", inset: 0, width: 1280, height: 832 }} />
          {t > 1.95 && <Field x={910} y={276} text={ip} caret={t < 3.0 && blink(t)} />}
          {t > 3.0 && <Field x={910} y={447} text={label} caret={t < 4.1 && blink(t)} />}
        </>
      );
    } else if (L.k === "connect") {
      const u = t - 4.6;
      const steps = [prog(u, 0.6, 0.85), prog(u, 1.15, 1.4), prog(u, 1.7, 1.95)];
      const done = prog(u, 2.0, 2.3);
      content = (
        <div style={{ position: "absolute", inset: 0, background: "#16161B", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30, fontFamily: FONT }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, color: "#ECECF2", fontSize: 30, fontWeight: 600 }}>{I.ubuntu(34)}API Gateway<span style={{ fontSize: 20, fontWeight: 400, color: "#909090" }}>192.168.1.100</span></div>
          <div style={{ transform: "scale(1.15)" }}><ConnectRing p={prog(u, 0.3, 2.0)} done={done} /></div>
          <div style={{ transform: "scale(1.25)", transformOrigin: "50% 0" }}><ConnectSteps steps={steps} /></div>
        </div>
      );
    } else if (L.k === "perf") {
      // The stats screen's own chrome, with its tab row and content redrawn per tab (same
      // 960-wide panel as the 20s cut's tab captures, at x 192).
      const pos = kf(t, TAB_AT.slice(1).flatMap((ct, i) => [[ct, i], [ct + 0.35, i + 1]]));
      const ux = DASH_TABS[Math.floor(pos)][1] + ((DASH_TABS[Math.min(4, Math.floor(pos) + 1)][1] - DASH_TABS[Math.floor(pos)][1]) * (pos - Math.floor(pos)));
      content = (
        <>
          <img src={IMG.perf} alt="" style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 917 }} />
          <div style={{ position: "absolute", left: 192, top: 238, width: 960, height: 50, background: "#101018", fontFamily: FONT }}>
            {DASH_TABS.map(([name, x], i) => {
              const near = clamp(1 - Math.abs(pos - i));
              return <div key={name} style={{ position: "absolute", left: x, top: 12, transform: "translateX(-50%)", fontSize: 17, color: "#E4E4E4", fontWeight: near > 0.5 ? 600 : 400, opacity: 0.62 + 0.38 * near, whiteSpace: "nowrap" }}>{name}</div>;
            })}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: "#2B2B33" }} />
            <div style={{ position: "absolute", left: ux - 83, width: 166, bottom: 0, height: 2, background: "#E4E4E4" }} />
          </div>
          <div style={{ position: "absolute", left: 192, top: 288, width: 960, height: 544, background: "#101018", overflow: "hidden" }}>
            {DASH_IMG.map((k, i) => {
              const o = i >= pos ? clamp(1 - (i - pos) * 1.4) : clamp(1 - (pos - i) * 3); // incoming leads, outgoing clears fast
              return o > 0.001 && <img key={k} src={IMG[k]} alt="" style={{ position: "absolute", left: 0, top: 0, width: 960, height: 540, opacity: o, transform: `translateY(${(i - pos) * 14}px)` }} />;
            })}
          </div>
        </>
      );
    } else if (L.k === "terminal") {
      const p = prog(t, 13.65, 14.1);
      content = (
        <>
          <img src={IMG.terminal} alt="" style={{ position: "absolute", inset: 0, width: 1280, height: 832 }} />
          {p > 0 && <img src={IMG.panel_askai} alt="" style={{ position: "absolute", right: 14, top: 22, width: 383, height: 793, opacity: p, transform: `translateX(${60 * (1 - p)}px)`, borderRadius: 12, outline: "1px solid rgba(255,255,255,.08)" }} />}
        </>
      );
    } else if (L.k === "sftp") {
      content = (
        <>
          <img src={IMG.sftp} alt="" style={{ position: "absolute", inset: 0, width: 1280, height: 832 }} />
          {[0, 1, 2].map((r) => <div key={r} style={{ position: "absolute", left: 804, top: 563 + 82 * r, width: 150, height: 22, background: "#111119", color: "#A3A3AC", fontSize: 14, lineHeight: "22px", fontFamily: FONT }}>192.168.1.100</div>)}
        </>
      );
    }
    return <div key={L.k} style={{ position: "absolute", inset: 0, opacity: o, transform: `translateX(${36 * (1 - inP) - 36 * outP}px)` }}>{content}</div>;
  });
}

// ================= camera =================
// No zooms: the screen stays at full view for the whole cut (Anu, round 11). The camera
// plumbing is kept so leader lines still resolve through one projection.
const CAM = [[0, { x: 640, y: 416, z: 1 }], [DURATION, { x: 640, y: 416, z: 1 }]];
// Clamped so the zoomed screen always covers the frame (no empty edge inside it).
const camAt = (t) => {
  const c = kf(t, CAM);
  const hx = 640 / c.z, hy = 416 / c.z;
  return { x: clamp(c.x, hx, 1280 - hx), y: clamp(c.y, hy, 832 - hy), z: c.z };
};
// Stage px of a window point, through the camera.
const project = (c, p) => {
  const S = onWin(p), Fp = onWin(c);
  return { x: 960 + (S.x - Fp.x) * c.z, y: 574 + (S.y - Fp.y) * c.z };
};
function Camera({ t, children }) {
  const c = camAt(t);
  const Fp = onWin(c);
  return <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${960 - Fp.x * c.z}px, ${574 - Fp.y * c.z}px) scale(${c.z})` }}>{children}</div>;
}

// ================= infographic callouts =================
// Dark cards fixed beside the frame, each tied to its spot in the UI by a leader line and a
// pulsing target dot that follow the camera. No shadows.
const G = { card: "#15151D", line: "#2B2B33", text: "#E4E4E4", sub: "#909090", green: "#4FD1A5", ok: "#71F0C0", cyan: "#51AFD4", violet: "#C6B8FF", red: "#D9485F", purple: "#7D28FE" };
const Lbl = ({ children }) => <div style={{ fontSize: 14, color: G.sub, marginBottom: 10, letterSpacing: "0.02em" }}>{children}</div>;
const Donut = ({ p, v, color, size = 84 }) => (
  <svg width={size} height={size} viewBox="0 0 84 84"><circle cx="42" cy="42" r="34" fill="none" stroke={G.line} strokeWidth="9" /><circle cx="42" cy="42" r="34" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" pathLength="100" strokeDasharray={`${v * p} 100`} transform="rotate(-90 42 42)" /></svg>
);
// CPU usage over the day, traced from the Performance chart (values in %).
const CPU_DAY = [52, 44, 35, 27, 31, 38, 46, 58, 72, 61, 50, 49, 56, 47, 38, 41, 52, 63, 66, 65, 62];
const Spark = ({ p, data, color, w = 230, h = 54 }) => {
  const n = data.length, pts = data.map((v, i) => [(i / (n - 1)) * w, h - (v / 80) * h]);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      <defs><clipPath id="sparkclip"><rect x="0" y="-4" width={w * p} height={h + 8} /></clipPath></defs>
      <g clipPath="url(#sparkclip)"><path d={`${d}L${w} ${h}L0 ${h}Z`} fill={color} opacity=".18" /><path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" /></g>
    </svg>
  );
};
const Bars = ({ t, color, seed, n = 14, w = 120, h = 34 }) => (
  <svg width={w} height={h}>{Array.from({ length: n }, (_, k) => { const bh = 5 + (h - 6) * Math.abs(Math.sin(k * 1.7 + seed + t * 2.4)); return <rect key={k} x={k * (w / n)} y={h - bh} width={w / n - 3} height={bh} rx="1.5" fill={color} />; })}</svg>
);
const Check = ({ on }) => (
  <span style={{ width: 20, height: 20, borderRadius: 10, display: "inline-grid", placeItems: "center", background: on ? "#1E3B33" : G.line, flex: "none" }}>
    <svg width="11" height="9" viewBox="0 0 12 10" style={{ opacity: on ? 1 : 0.25 }}><path d="M1 5l3.5 3.5L11 1.5" stroke={G.ok} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </span>
);

const CALLOUTS = [
  { a: 3.7, b: 4.62, side: "right", top: 330, at: { x: 1050, y: 460 }, body: (p) => (<>
    <Lbl>New host</Lbl>
    {[["Address", "192.168.1.100"], ["Port", "22"], ["Label", "API Gateway"]].map(([k, v], i) => (
      <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", fontSize: 16 }}><Check on={p > 0.2 + i * 0.25} /><span style={{ color: G.sub, width: 70 }}>{k}</span><span>{v}</span></div>))}
  </>) },
  { a: 6.55, b: 7.4, side: "right", top: 360, at: { x: 640, y: 390 }, body: (p) => (<>
    <Lbl>SSH handshake</Lbl>
    <div style={{ display: "flex", gap: 6 }}>{[0, 1, 2].map((i) => <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: p > (i + 0.5) / 3 ? G.green : G.line }} />)}</div>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, fontSize: 24, fontWeight: 500, color: G.ok }}><span style={{ width: 10, height: 10, borderRadius: 5, background: "#4FA084" }} />Connected</div>
  </>) },
  { a: 7.65, b: 8.5, side: "right", top: 380, at: { x: 783, y: 483 }, body: (p) => (<>
    <Lbl>Uptime</Lbl>
    <div style={{ fontSize: 28, fontWeight: 500, color: G.green }}>{Math.round(15 * p)} days, {Math.round(6 * p)} hours</div>
    <div style={{ display: "flex", gap: 4, marginTop: 12 }}>{Array.from({ length: 15 }, (_, i) => <div key={i} style={{ flex: 1, height: 18, borderRadius: 3, background: i < 15 * p ? "#2E6B57" : G.line }} />)}</div>
  </>) },
  { a: 8.75, b: 9.6, side: "left", top: 360, at: { x: 290, y: 521 }, body: (p) => (<>
    <Lbl>Total CPU usage</Lbl>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}><Donut p={p} v={45} color={G.cyan} size={74} /><div><div style={{ fontSize: 34, fontWeight: 500 }}>{Math.round(45 * p)}%</div><div style={{ fontSize: 13, color: G.sub }}>Intel Xeon E5-2676 v3</div></div></div>
    <div style={{ marginTop: 12 }}><Spark p={p} data={CPU_DAY} color={G.cyan} /></div>
  </>) },
  { a: 9.85, b: 10.7, side: "right", top: 380, at: { x: 492, y: 350 }, body: (p) => (<>
    <Lbl>Disk storage</Lbl>
    <div style={{ fontSize: 28, fontWeight: 500 }}>{Math.round(184 * p)} GB <span style={{ fontSize: 16, color: G.sub }}>of 200 GB</span></div>
    <div style={{ display: "flex", height: 14, borderRadius: 7, overflow: "hidden", background: G.line, marginTop: 12 }}><div style={{ width: `${92 * p}%`, background: G.red }} /><div style={{ width: `${8 * p}%`, background: G.green }} /></div>
    <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 13, color: G.sub }}><span><span style={{ color: G.red }}>■</span> Used 184 GB</span><span><span style={{ color: G.green }}>■</span> Free 16 GB</span></div>
  </>) },
  { a: 10.95, b: 11.8, side: "left", top: 400, at: { x: 340, y: 540 }, body: () => (<>
    <Lbl>Eth0 · live</Lbl>
    {[["Download", "1.1", G.violet, 0], ["Upload", "1.6", G.green, 2]].map(([n, v, c, sd]) => (
      <div key={n} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10, marginTop: 8 }}>
        <div><div style={{ fontSize: 13, color: G.sub }}>{n}</div><div style={{ fontSize: 24, fontWeight: 500, color: c }}>{v}<span style={{ fontSize: 13, color: G.sub }}> MB/s</span></div></div><Bars t={t0} color={c} seed={sd} />
      </div>))}
  </>) },
  { a: 12.05, b: 12.9, side: "right", top: 380, at: { x: 252, y: 320 }, body: (p) => (<>
    <Lbl>Processes</Lbl>
    {[["Sleeping", 240, "#6C7BD9"], ["Total", 187, G.violet], ["Running", 3, G.green]].map(([n, v, c]) => (
      <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 7, fontSize: 15 }}>
        <span style={{ width: 66, color: G.sub }}>{n}</span><div style={{ flex: 1, height: 10, borderRadius: 5, background: G.line }}><div style={{ width: `${Math.max(3, (v / 240) * 100) * p}%`, height: 10, borderRadius: 5, background: c }} /></div><span style={{ width: 34, textAlign: "right", fontWeight: 500 }}>{Math.round(v * p)}</span>
      </div>))}
  </>) },
  { a: 14.15, b: 15.45, side: "left", top: 380, at: { x: 1100, y: 170 }, body: (p) => { const q = "How do I find all .txt files in a directory?"; return (<>
    <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 15, marginBottom: 10 }}><span style={{ color: "#8B5CF6" }}>✦</span>Ask AI</div>
    <div style={{ background: G.line, borderRadius: 10, padding: "10px 12px", fontSize: 15, minHeight: 42, lineHeight: 1.35 }}>{q.slice(0, Math.round(q.length * clamp(p * 1.4)))}</div>
    <div style={{ marginTop: 10, padding: "9px 12px", borderRadius: 10, background: "#0B0B10", border: `1px solid ${G.line}`, fontFamily: "'Fira Code', ui-monospace, monospace", fontSize: 15, color: G.ok, opacity: clamp((p - 0.72) * 4) }}>find . -name "*.txt"</div>
  </>); } },
  { a: 16.85, b: 18.0, side: "right", top: 360, at: { x: 833, y: 385 }, body: (p) => {
    const f = clamp(p * 1.15);
    return (<>
      <Lbl>Backups → API Gateway</Lbl>
      <div style={{ position: "relative", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {[["This computer", "M3 5h18v11H3zM8 20h8M12 16v4"], ["Server", "M4 4h16v6H4zM4 14h16v6H4z"]].map(([n, d]) => (
          <div key={n} style={{ textAlign: "center", width: 80, zIndex: 1 }}><div style={{ width: 44, height: 44, margin: "0 auto", borderRadius: 12, background: G.line, display: "grid", placeItems: "center" }}><svg width="22" height="22" viewBox="0 0 24 24"><path d={d} fill="none" stroke={G.text} strokeWidth="1.8" strokeLinejoin="round" /></svg></div><div style={{ fontSize: 12, color: G.sub, marginTop: 4 }}>{n}</div></div>))}
        <div style={{ position: "absolute", left: 66, right: 66, top: 22, borderTop: `2px dashed ${G.line}` }} />
        {f < 1 && <div style={{ position: "absolute", top: 13, left: 66 + (260 - 132 - 18) * ((t0 * 1.6) % 1), width: 18, height: 18, borderRadius: 4, background: G.purple }} />}
      </div>
      <div style={{ height: 8, borderRadius: 4, background: G.line, marginTop: 6 }}><div style={{ height: 8, borderRadius: 4, width: `${100 * f}%`, background: f < 1 ? G.purple : "#4FA084" }} /></div>
      <div style={{ fontSize: 14, color: f < 1 ? G.text : G.ok, marginTop: 8 }}>{f < 1 ? `Uploading ${Math.round(100 * f)}%` : "✓ Uploaded"}</div>
    </>); } },
];
let t0 = 0; // current time for live bars inside callout bodies

function Callouts({ t }) {
  t0 = t;
  const c = camAt(t);
  return (
    <>
      {CALLOUTS.map((k, i) => {
        const e = inOut(t, k.a, k.b, 0.35, 0.3);
        if (e <= 0.001) return null;
        const p = prog(t, k.a + 0.1, k.a + 0.85);
        const W = 320, X = k.side === "left" ? 90 : 1920 - 90 - W;
        const anchor = { x: k.side === "left" ? X + W : X, y: k.top + 34 };
        const pr = project(c, k.at);
        const tgt = { x: clamp(pr.x, FX + 18, FX + FW - 18), y: clamp(pr.y, FY + 18, FY + FH - 18) };
        const ln = prog(t, k.a + 0.15, k.a + 0.55);
        const lx = anchor.x + (tgt.x - anchor.x) * ln, ly = anchor.y + (tgt.y - anchor.y) * ln;
        const pulse = ((t - k.a) * 1.4) % 1;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, opacity: e, pointerEvents: "none" }}>
            <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <line x1={anchor.x} y1={anchor.y} x2={lx} y2={ly} stroke="#0E1424" strokeOpacity=".55" strokeWidth="1.5" strokeDasharray="5 5" />
              {ln >= 1 && <>
                <circle cx={tgt.x} cy={tgt.y} r={8 + 16 * pulse} fill="none" stroke="#fff" strokeWidth="2" opacity={1 - pulse} />
                <circle cx={tgt.x} cy={tgt.y} r="7" fill="#0E1424" stroke="#fff" strokeWidth="2.5" />
              </>}
            </svg>
            <div style={{ position: "absolute", left: X, top: k.top, width: W, padding: "18px 20px", borderRadius: 16, background: G.card, border: `1px solid ${G.line}`, color: G.text, fontFamily: FONT, boxSizing: "border-box", transform: `translateX(${(k.side === "left" ? -24 : 24) * (1 - e)}px) scale(${0.96 + 0.04 * e})` }}>{k.body(p)}</div>
          </div>
        );
      })}
    </>
  );
}

function AppWindow({ t }) {
  const fill = prog(t, 1.0, 1.45);
  return (
    <div style={{ position: "absolute", left: FX, top: FY, width: FW, height: FH, borderRadius: 16, overflow: "hidden", background: "#111119", opacity: fill, transform: `scale(${0.985 + 0.015 * fill})` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 832, transform: `scale(${FK})`, transformOrigin: "0 0" }}>
        <Screens t={t} />
      </div>
    </div>
  );
}

function StageCursor({ t }) {
  const start = { x: FX, y: FY }, end = { x: FX + FW, y: FY + FH };
  const keys = [[0, { x: start.x - 90, y: start.y - 60 }], [0.25, start], [1.15, end], [1.5, { x: end.x - 160, y: end.y - 60 }]];
  PLAN.forEach(([ct, p]) => { keys.push([ct - 0.5, keys[keys.length - 1][1]]); keys.push([ct - 0.04, onWin(p)]); });
  keys.push([FLOW_END, { x: 1560, y: 1000 }]);
  const cur = kf(t, keys);
  const clicks = [[0.25, start], ...PLAN.filter((c) => c[2]).map(([ct, p]) => [ct, onWin(p)])];
  const press = (t > 0.25 && t < 1.15) || pressedAt(t, clicks);
  const ripple = clicks.map(([ct]) => prog(t, ct, ct + 0.5)).find((p) => p > 0 && p < 1);
  return (
    <>
      {ripple !== undefined && <div style={{ position: "absolute", left: cur.x - 30, top: cur.y - 30, width: 60, height: 60, borderRadius: 30, border: `2px solid ${BLUE}`, opacity: 0.7 * (1 - ripple), transform: `scale(${0.4 + ripple})` }} />}
      <Cursor {...cur} o={inOut(t, 0, FLOW_END + 0.2, 0.25, 0.3)} press={press} size={1.2} />
    </>
  );
}

function Shot({ t, children }) {
  const out = prog(t, FLOW_END, DURATION);
  return <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `scale(${1 + 0.25 * out})`, filter: out > 0.01 ? `blur(${(14 * out).toFixed(2)}px)` : "none" }}>{children}</div>;
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
        <Shot t={t}>
          {/* The frame stays put; the camera zooms the screen inside it. */}
          <div style={{ position: "absolute", left: FX, top: FY, width: FW, height: FH, borderRadius: 16, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: -FX, top: -FY, width: 1920, height: 1080 }}>
              <Camera t={t}>
                <AppWindow t={t} />
                {t >= 1.45 && <StageCursor t={t} />}
              </Camera>
            </div>
          </div>
          <div style={{ position: "absolute", left: FX, top: FY, width: FW, height: FH, borderRadius: 16, outline: "1px solid rgba(255,255,255,.55)", opacity: prog(t, 1.0, 1.45), pointerEvents: "none" }} />
          <Selection t={t} />
          {t < 1.45 && <StageCursor t={t} />}
          <Callouts t={t} />
          <StepRail t={t} />
        </Shot>
        <Headline t={t} />
      </div>
    </div>
  );
}

export { DURATION };
