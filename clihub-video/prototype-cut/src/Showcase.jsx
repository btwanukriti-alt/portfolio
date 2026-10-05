// clihub: UI-prototype cut (loop). Built from the 20s agency cut (clihub-showcase-20s-react),
// keeping its real-screen scenes (Connect, Live stats, Terminal + Ask AI) and replacing the
// opening and backdrop: the cut now opens on the real Hosts screen, on Anu's grey-blue canvas.
// One clock t; <Stage t /> renders a 1920x1080 frame.
import hosts from "./assets/hosts.png";
import terminal from "./assets/terminal.png";
import stats_head from "./assets/stats_head.png";
import tab_performance from "./assets/tab_performance.png";
import tab_network from "./assets/tab_network.png";
import panel_askai from "./assets/panel_askai.png";

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
const DURATION = 18.9;
const IMG = { hosts, terminal, stats_head, tab_performance, tab_network, panel_askai };

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

// ---------- rebuilt components (native px, matched to the Figma components) ----------
const cardShell = { width: 305, background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, overflow: "hidden", fontFamily: FONT, color: C.text };
const IconBox = ({ children }) => <div style={{ width: 48, height: 48, borderRadius: 8, background: C.raised, display: "grid", placeItems: "center", flex: "none" }}>{children}</div>;
const Divider = ({ up }) => (
  <div style={{ position: "relative", height: 1, background: C.line }}>
    <div style={{ position: "absolute", left: "50%", top: -8, marginLeft: -8, width: 16, height: 16, borderRadius: 8, background: C.track, display: "grid", placeItems: "center" }}>{I.chevron(up)}</div>
  </div>
);
const Btn = ({ children, pressed }) => <div style={{ padding: "6px 16px", borderRadius: 6, background: pressed ? "#34343d" : C.line, color: "#D7D7D8", fontSize: 13, transform: `scale(${pressed ? 0.96 : 1})` }}>{children}</div>;
const Act = ({ children }) => <div style={{ width: 28, height: 28, borderRadius: 6, background: C.raised, display: "grid", placeItems: "center" }}>{children}</div>;
const Head = ({ icon, title, sub, dot = true }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 14px 20px 16px", height: 88, boxSizing: "border-box" }}>
    <IconBox>{icon}</IconBox>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 16, fontWeight: 500, display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap" }}>{title}{dot && <span style={{ width: 8, height: 8, borderRadius: 4, background: C.green }} />}</div>
      <div style={{ fontSize: 14, color: C.sub, marginTop: 3 }}>{sub}</div>
    </div>
    {I.kebab()}
  </div>
);

// Host Card (collapsed → expanded), from component "Host Card"
function HostCard({ open, pressed }) {
  const bodyH = 196 * open;
  return (
    <div style={cardShell}>
      <Head icon={I.ubuntu(26)} title="API Gateway" sub="192.168.1.100" />
      <Divider up={open > 0.5} />
      <div style={{ height: bodyH, overflow: "hidden" }}>
        <div style={{ padding: "18px 16px 0", opacity: open }}>
          <div style={{ display: "flex", gap: 26, fontSize: 14, color: C.text, marginBottom: 16 }}>
            <span style={{ display: "flex", gap: 8, alignItems: "center" }}>{I.tag()}Database</span>
            <span style={{ display: "flex", gap: 8, alignItems: "center" }}>{I.group()}Group 2</span>
          </div>
          <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: "12px 14px", display: "grid", gap: 6, fontSize: 15 }}>
            {[["Operating System", "Ubuntu"], ["Auth Method", <span style={{ display: "inline-flex", gap: 5, alignItems: "center" }}>{I.key(C.keyBlue, 13)}SSH</span>], ["CPU Usage", "34%"], ["RAM Usage", "52%"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: C.sub }}>{k}</span><span style={{ fontSize: 13 }}>{v}</span></div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 16px", height: 56 }}>
        <Act>{I.bars()}</Act><Act>{I.prompt()}</Act><Act>{I.doc()}</Act>
        <div style={{ flex: 1 }} />
        <Btn pressed={pressed}>Connect</Btn>
      </div>
    </div>
  );
}

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

// ---------- desktop window for real screens (camera only — no overlays) ----------
const W = 1280, H = 832;
function Window({ x, y, s = 0.72, z = 1, zp = 0, f = { x: 640, y: 416 }, rotY = -6, rotX = 2, o = 1, ty = 0, layers, children }) {
  if (o <= 0.001) return null;
  const k = s * z;
  const Tx = -k * (f.x - W / 2) * zp, Ty = -k * (f.y - H / 2) * zp;
  const mask = "linear-gradient(180deg, transparent 0, transparent 215px, #000 300px)"; // zoomed window never runs under the headline
  return (
    <div style={{ position: "absolute", inset: 0, WebkitMaskImage: mask, maskImage: mask, opacity: o }}>
      <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, perspective: 3200 }}>
        <div style={{
          position: "absolute", left: -W / 2, top: -H / 2, width: W, height: H, borderRadius: 16, overflow: "hidden", background: C.card,
          transform: `translate3d(${Tx}px, ${Ty + ty}px, 0) scale(${k}) rotateY(${rotY}deg) rotateX(${rotX}deg)`,
          boxShadow: "0 60px 120px -40px rgba(24,30,70,.42), 0 0 0 1.5px rgba(255,255,255,.08)",
        }}>
          {layers.map((L, i) => L.o > 0.001 && (
            <img key={i} src={L.src} alt="" draggable={false} style={{ position: "absolute", inset: 0, width: W, height: H, opacity: L.o }} />
          ))}
          {children}
        </div>
      </div>
    </div>
  );
}

// Places a native-size component on the stage, centred at (x, y)
const Place = ({ x, y, s = 1, o = 1, ty = 0, origin = "50% 50%", children }) => o > 0.001 && (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%, -50%) translateY(${ty}px) scale(${s})`, transformOrigin: origin }}>{children}</div>
);
const Shadow = ({ children }) => <div style={{ borderRadius: 12, boxShadow: "0 50px 90px -30px rgba(24,30,70,.4), 0 0 0 1px rgba(255,255,255,.04)" }}>{children}</div>;

// Stage-level cursor
const Cursor = ({ x, y, o, press, size = 1 }) => o > 0.001 && (
  <svg width="22" height="28" viewBox="0 0 22 28" style={{ position: "absolute", left: x - 2, top: y - 2, opacity: o, transform: `scale(${(press ? 0.85 : 1) * size})`, transformOrigin: "2px 2px", filter: "drop-shadow(0 3px 6px rgba(0,0,0,.5))", zIndex: 50 }}>
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

const TABS = [["Overview", 83], ["Performance", 284], ["Storage", 480], ["Network", 659], ["Activity", 837]];
const TAB_IMG = ["tab_overview", "tab_performance", "tab_storage", "tab_network", "tab_activity"];

const cardStyle = { background: "#15151D", border: `1px solid ${C.line}`, borderRadius: 16, padding: "20px 22px", fontFamily: FONT, boxShadow: "0 40px 80px -30px rgba(24,30,70,.42)", boxSizing: "border-box" };
const Lbl = ({ children }) => <div style={{ fontSize: 14, color: C.sub, marginBottom: 10 }}>{children}</div>;
const count = (v, p, d = 0) => (v * p).toFixed(d);

// ---- 1 · Connect: Host Card expands → Connect → connection ring ----
function Connect20({ t }) {
  return (
    <Shot t={t} a={T.connect[0]} b={T.connect[1]}>
      {(u, len) => {
        const cardIn = prog(u, 0.35, 1.15), open = prog(u, 1.3, 2.05), cardOut = prog(u, 3.15, 3.75);
        const G = 1.5, cardH = 145 + 196 * open;
        const btn = { x: 305 - 16 - 39, y: 89 + 196 * open + 28 };
        const cur = kf(u, [[1.95, { x: 340, y: btn.y + 130 }], [2.75, { x: btn.x + 4, y: btn.y + 4 }]]);
        const curO = inOut(u, 1.9, 3.3, 0.3, 0.3);
        const pressed = u > 2.85 && u < 3.02;
        const ring = prog(u, 3.35, 3.95), p = prog(u, 3.6, 4.85);
        const steps = [prog(u, 3.8, 4.1), prog(u, 4.25, 4.55), prog(u, 4.7, 5.0)];
        const done = prog(u, 4.85, 5.2), stepsIn = prog(u, 3.55, 4.15);
        return (
          <>
            <KHead u={u} len={len} eyebrow="Hosts" title="Connect in one click." />
            <Place x={960} y={650} s={G * (0.96 + 0.04 * cardIn) * (1 - 0.14 * cardOut)} o={cardIn * (1 - cardOut)} ty={40 * (1 - cardIn) - 50 * cardOut}>
              <div style={{ position: "relative", height: cardH }}>
                <Shadow><HostCard open={open} pressed={pressed} /></Shadow>
                {curO > 0 && (
                  <svg width="22" height="28" viewBox="0 0 22 28" style={{ position: "absolute", left: cur.x - 2, top: cur.y - 2, opacity: curO, transform: `scale(${(pressed ? 0.85 : 1) / G * 1.3})`, transformOrigin: "2px 2px", filter: "drop-shadow(0 3px 6px rgba(0,0,0,.5))" }}>
                    <path d="M2 2 L2 22 L7.5 17 L11 25 L14.5 23.5 L11 15.8 L18.5 15.8 Z" fill="#fff" stroke="#111119" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                )}
                {u > 2.85 && u < 3.5 && (
                  <div style={{ position: "absolute", left: btn.x - 30, top: btn.y - 30, width: 60, height: 60, borderRadius: 30, border: `2px solid ${EB(0.8)}`, opacity: 1 - prog(u, 2.85, 3.45), transform: `scale(${0.5 + prog(u, 2.85, 3.45)})` }} />
                )}
              </div>
            </Place>
            <Place x={960} y={478} s={1.12 * (0.94 + 0.06 * ring)} o={ring} ty={30 * (1 - ring)}><ConnectRing p={p} done={done} /></Place>
            <Place x={960} y={820} s={1.15} o={stepsIn} ty={30 * (1 - stepsIn)}><Shadow><ConnectSteps steps={steps} /></Shadow></Place>
          </>
        );
      }}
    </Shot>
  );
}

// ---- 2 · Live stats: Performance → Network, with metric callouts ----
function StatsDuo({ ux, mix }) {
  return (
    <div style={{ width: 960, padding: "0 24px 24px", background: C.raised, borderRadius: 18, fontFamily: FONT }}>
      <img src={IMG.stats_head} alt="" style={{ display: "block", width: 960, height: 88 }} />
      <div style={{ position: "relative", height: 50, background: "#101018", borderRadius: "10px 10px 0 0" }}>
        {TABS.map(([name, x], i) => {
          const act = i === 1 ? 1 - mix : i === 3 ? mix : 0;
          return <div key={name} style={{ position: "absolute", left: x, top: 13, transform: "translateX(-50%)", fontSize: 16, color: C.text, fontWeight: act > 0.5 ? 600 : 400, opacity: 0.62 + 0.38 * act, whiteSpace: "nowrap" }}>{name}</div>;
        })}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: C.track }} />
        <div style={{ position: "absolute", left: ux - 80, width: 160, bottom: 0, height: 2, background: C.text, borderRadius: 1 }} />
      </div>
      <div style={{ position: "relative", height: 540, background: "#101018", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>
        <img src={IMG.tab_performance} alt="" style={{ position: "absolute", inset: 0, width: 960, height: 540, opacity: 1 - mix, transform: `translateY(${-14 * mix}px)` }} />
        <img src={IMG.tab_network} alt="" style={{ position: "absolute", inset: 0, width: 960, height: 540, opacity: mix, transform: `translateY(${14 * (1 - mix)}px)` }} />
      </div>
    </div>
  );
}
const Callout = ({ e, side, top, children, w = 320 }) => e > 0.001 && (
  <div style={{ position: "absolute", top, width: w, [side === "left" ? "left" : "right"]: -250, ...cardStyle, opacity: e, transform: `translate(${(side === "left" ? -30 : 30) * (1 - e)}px, ${12 * (1 - e)}px)`, zIndex: 20 }}>{children}</div>
);
function Stats20({ t }) {
  return (
    <Shot t={t} a={T.stats[0]} b={T.stats[1]}>
      {(u, len) => {
        const e = prog(u, 0.3, 1.1);
        const mix = prog(u, 2.8, 3.35);
        const ux = TABS[1][1] + (TABS[3][1] - TABS[1][1]) * mix;
        const click = [[2.8, { x: TABS[3][1] + 24 + 12, y: 88 + 30 }]];
        const cur = kf(u, clickPath([1.65, { x: 640, y: 420 }], click, 0.75));
        const cpu = inOut(u, 0.9, 3.0, 0.45, 0.35), cpuP = prog(u, 1.1, 2.1);
        const net = inOut(u, 3.25, 5.5, 0.45, 0.35);
        const spark = (c, seed) => <svg width="120" height="32" viewBox="0 0 120 32">{Array.from({ length: 15 }, (_, k) => { const h = 6 + 22 * Math.abs(Math.sin(k * 1.7 + seed + u * 2.2)); return <rect key={k} x={k * 8} y={32 - h} width="5" height={h} rx="1.5" fill={c} />; })}</svg>;
        return (
          <>
            <KHead u={u} len={len} eyebrow="Host stats" title="Live stats for every host." />
            <Place x={960} y={655} s={1.02 * (0.97 + 0.03 * e)} o={e} ty={50 * (1 - e)}>
              <div style={{ position: "relative", borderRadius: 18, boxShadow: `0 60px 120px -40px rgba(24,30,70,.42), 0 0 0 1px rgba(255,255,255,.05), 0 0 120px -20px ${EB(0.25)}` }}>
                <StatsDuo ux={ux} mix={mix} />
                <Callout e={cpu} side="left" top={250}>
                  <Lbl>Total CPU Usage</Lbl>
                  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <svg width="88" height="88" viewBox="0 0 88 88"><circle cx="44" cy="44" r="36" fill="none" stroke={C.track} strokeWidth="8" /><circle cx="44" cy="44" r="36" fill="none" stroke="#51AFD4" strokeWidth="8" strokeLinecap="round" pathLength="100" strokeDasharray={`${45 * cpuP} 100`} transform="rotate(-90 44 44)" /></svg>
                    <div><div style={{ fontSize: 40, fontWeight: 500, color: C.text }}>{count(45, cpuP)}%</div><div style={{ fontSize: 13, color: C.sub }}>Intel Xeon E5-2676 v3</div></div>
                  </div>
                </Callout>
                <Callout e={net} side="right" top={300}>
                  <Lbl>Eth0</Lbl>
                  {[["Download", "1.1", "#C6B8FF", 0], ["Upload", "1.6", "#4FD1A5", 2]].map(([n, v, c, sd]) => (
                    <div key={n} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginTop: 8 }}>
                      <div><div style={{ fontSize: 13, color: C.sub }}>{n}</div><div style={{ fontSize: 28, fontWeight: 500, color: c }}>{v}<span style={{ fontSize: 14, color: C.sub }}> MB/s</span></div></div>{spark(c, sd)}
                    </div>
                  ))}
                </Callout>
                <Cursor {...cur} o={inOut(u, 1.6, 3.6, 0.3, 0.3)} press={pressedAt(u, click)} size={1.15} />
              </div>
            </Place>
          </>
        );
      }}
    </Shot>
  );
}

// ---- 3 · Terminal + Ask AI ----
function Term20({ t }) {
  return (
    <Shot t={t} a={T.term[0]} b={T.term[1]}>
      {(u, len) => {
        const WX = 820, WY = 650, WS = 0.62, PXp = 1365, PYp = 655, PS = 0.93;
        const wi = prog(u, 0.3, 1.0);
        const click = [[1.2, { x: WX + (1232 - 640) * WS, y: WY + (81 - 416) * WS }]];
        const cur = kf(u, clickPath([0.55, { x: 980, y: 800 }], click, 0.6));
        const pIn = prog(u, 1.3, 1.95);
        const ai = inOut(u, 1.85, 4.3, 0.45, 0.35), typed = prog(u, 2.05, 3.4);
        const q = "How do I find all .txt files in a directory?";
        return (
          <>
            <KHead u={u} len={len} eyebrow="Terminal" title="A terminal with AI built in." />
            <Window x={WX} y={WY} s={WS} o={wi} ty={60 * (1 - wi)} rotX={10 * (1 - wi)} rotY={0} layers={[{ src: IMG.terminal, o: 1 }]} />
            <Place x={PXp} y={PYp} s={PS} o={pIn}>
              <div style={{ width: 383, height: 793, borderRadius: 14, overflow: "hidden", transform: `translateX(${70 * (1 - pIn)}px)`, boxShadow: `0 60px 120px -30px rgba(24,30,70,.45), 0 0 0 1px rgba(255,255,255,.07), 0 0 100px -20px ${EB(0.3)}`, background: "#070A14" }}>
                <img src={IMG.panel_askai} alt="" style={{ display: "block", width: 383, height: 793 }} />
              </div>
            </Place>
            {ai > 0.001 && (
              <div style={{ position: "absolute", left: 370, top: 520, width: 380, transform: `translate(-50%, -50%) translateX(${-30 * (1 - ai)}px)`, opacity: ai, ...cardStyle, zIndex: 30 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 16, color: C.text, marginBottom: 12 }}><span style={{ color: "#8B5CF6", fontSize: 18 }}>✦</span>Ask AI</div>
                <div style={{ background: C.track, borderRadius: 10, padding: "12px 14px", fontSize: 16, color: C.text, minHeight: 46, lineHeight: 1.35 }}>{q.slice(0, Math.round(q.length * typed))}<span style={{ opacity: Math.sin(u * 14) > 0 ? 1 : 0 }}>|</span></div>
              </div>
            )}
            <div style={{ position: "absolute", inset: 0 }}><Cursor {...cur} o={inOut(u, 0.5, 1.9, 0.3, 0.3)} press={pressedAt(u, click)} size={1.2} /></div>
          </>
        );
      }}
    </Shot>
  );
}

// ================= shots =================
const T = { open: [0, 4.2], connect: [3.6, 9.7], stats: [9.1, 14.9], term: [14.3, 18.9] };
const CUTS = [3.9, 9.4, 14.6, 18.9]; // transition midpoints (light sweeps); the last one is the loop

// Zoom-through: each shot arrives from depth and pushes past the lens when it leaves.
function Shot({ t, a, b, children }) {
  if (t < a || t > b) return null;
  const u = t - a, len = b - a;
  const i = prog(u, 0, 0.75);
  const o = prog(u, len - 0.6, len);
  const push = 1 + 0.035 * (u / len);
  const scale = (0.86 + 0.14 * i) * (1 + 0.2 * o) * push;
  const blur = 10 * (1 - i) + 14 * o;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: i * (1 - o), transform: `scale(${scale})`, filter: blur > 0.3 ? `blur(${blur.toFixed(2)}px)` : "none" }}>
      {children(u, len)}
    </div>
  );
}

// Purple accent (the app's primary) for glows, rings and pills.
const EB = (a) => `rgba(125,40,254,${a})`;
const INK = "#0E1424", SUB = "#47526B";

// Kinetic headline: pill eyebrow, then words rise out of masks one by one (dark ink on the light canvas)
function KHead({ u, len, eyebrow, title, top = 92 }) {
  const out = prog(u, len - 0.95, len - 0.35);
  const e = prog(u, 0.25, 0.8);
  const words = title.split(" ");
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", zIndex: 40 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 18px 8px 13px", borderRadius: 999, border: "1px solid rgba(255,255,255,.85)", background: "rgba(255,255,255,.55)", boxShadow: "0 6px 20px rgba(40,50,90,.08)", opacity: e * (1 - out), transform: `translateY(${(1 - e) * 14 - out * 10}px)`, marginBottom: 22 }}>
        <span style={{ width: 9, height: 9, borderRadius: 5, background: C.primary, boxShadow: `0 0 0 ${3 + 2 * Math.sin(u * 4) ** 2}px ${EB(0.18)}` }} />
        <span style={{ fontSize: 18, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: SUB }}>{eyebrow}</span>
      </div>
      <div style={{ fontSize: 68, fontWeight: 600, letterSpacing: "-0.035em", color: INK, lineHeight: 1.15, whiteSpace: "nowrap" }}>
        {words.map((w, k) => {
          const p = prog(u, 0.4 + k * 0.08, 1.15 + k * 0.08);
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

// ---- 0 · Opening: the real Hosts screen rises in, the camera pushes in, a group is opened ----
// Hosts screen (250:32498) with two fixes painted over the capture: the duplicated third row
// is cleared and "Digital Ocean Dorplets" reads "DigitalOcean Droplets".
const GROUP_CARD = { x: 212, y: 222, w: 453, h: 74 };
function HostsFixes({ hover }) {
  return (
    <>
      <div style={{ position: "absolute", left: 200, top: 396, width: 960, height: 90, background: "#171721" }} />
      <div style={{ position: "absolute", left: 762, top: 327, width: 200, height: 26, background: "#101018", fontFamily: FONT, fontSize: 16, fontWeight: 500, color: "#E4E4E4", lineHeight: "26px", whiteSpace: "nowrap" }}>DigitalOcean Droplets</div>
      <div style={{ position: "absolute", left: GROUP_CARD.x - 2, top: GROUP_CARD.y - 2, width: GROUP_CARD.w + 4, height: GROUP_CARD.h + 4, borderRadius: 8, border: `2px solid ${C.primary}`, boxShadow: `0 0 24px ${EB(0.5)}`, opacity: hover, boxSizing: "border-box" }} />
    </>
  );
}

function Open({ t }) {
  return (
    <Shot t={t} a={T.open[0]} b={T.open[1]}>
      {(u, len) => {
        const WX = 960, WY = 668, WS = 0.82;
        const wi = prog(u, 0.15, 1.35);
        // Camera pushes in on the host groups, then a group is clicked.
        const zoom = prog(u, 1.7, 3.3);
        const f = { x: 677, y: 300 };
        const target = { x: GROUP_CARD.x + 120, y: GROUP_CARD.y + 40 };
        const k = WS * (1 + 0.22 * zoom);
        const onWin = (p) => ({ x: WX + (p.x - 640) * k - k * (f.x - 640) * zoom, y: WY + (p.y - 416) * k - k * (f.y - 416) * zoom });
        const clickT = 3.25;
        const cur = kf(u, [[1.4, { x: 1500, y: 1000 }], [2.2, { x: 1300, y: 860 }], [clickT - 0.05, onWin(target)], [len, onWin(target)]]);
        const hover = prog(u, 2.75, 3.05);
        return (
          <>
            <KHead u={u} len={len} eyebrow="SSH client for desktop" title="All your servers in one app." />
            <Window x={WX} y={WY} s={WS} z={1 + 0.22 * zoom} zp={zoom} f={f} o={wi} ty={140 * (1 - wi)} rotX={22 * (1 - wi)} rotY={0} layers={[{ src: IMG.hosts, o: 1 }]}>
              <HostsFixes hover={hover} />
            </Window>
            {u > clickT && u < clickT + 0.6 && (
              <div style={{ position: "absolute", left: cur.x - 34, top: cur.y - 34, width: 68, height: 68, borderRadius: 34, border: `3px solid ${EB(0.9)}`, opacity: 1 - prog(u, clickT, clickT + 0.55), transform: `scale(${0.4 + prog(u, clickT, clickT + 0.55)})` }} />
            )}
            <Cursor {...cur} o={inOut(u, 1.5, len, 0.3, 0.3)} press={u > clickT && u < clickT + 0.14} size={1.25} />
          </>
        );
      }}
    </Shot>
  );
}

// ---- Backdrop: grey-blue gradient, drifting light, purple key glow, light sweep at each cut, grain ----
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";
function Backdrop({ t, w, h }) {
  const a = (t / DURATION) * Math.PI * 2;
  const cx = w / 2, cy = h / 2;
  const sweep = CUTS.map((c) => clamp((t - (c - 0.55)) / 1.1)).find((v) => v > 0 && v < 1);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "radial-gradient(ellipse 85% 80% at 50% 42%, #C6D2E2, #A7B6CD)" }}>
      <div style={{ position: "absolute", left: cx + 260 * Math.cos(a) - 1100, top: cy - 70 + 90 * Math.sin(a) - 760, width: 2200, height: 1520, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(236,241,248,.85), rgba(236,241,248,0))" }} />
      <div style={{ position: "absolute", left: cx - 760, top: cy + 120 - 460, width: 1520, height: 920, borderRadius: "50%", background: `radial-gradient(closest-side, ${EB(0.16)}, ${EB(0)})` }} />
      {sweep !== undefined && (
        <div style={{ position: "absolute", top: -400, bottom: -400, width: 560, left: -700 + sweep * (w + 1400), transform: "rotate(18deg)", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.35), rgba(255,255,255,0))", filter: "blur(30px)" }} />
      )}
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
        <Open t={t} />
        <Connect20 t={t} />
        <Stats20 t={t} />
        <Term20 t={t} />
      </div>
    </div>
  );
}

export { DURATION };
