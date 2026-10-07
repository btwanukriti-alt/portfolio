// SSH client — feature showcase v2 (30s, 16:9)
// Mix of real screens (camera zooms, no overlays) and component infographics rebuilt
// as live vector UI from the SSH client Figma components (Host Card, Port Mapping cards, Key card,
// connection progress). One clock `t`, ease-in-out cubic, no bounce.
const { useState, useEffect, useRef, useLayoutEffect } = React;

// ---------- theme (sampled from the SSH client Figma file) ----------
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
// PACE stretches the whole 30s timeline evenly: holds, transitions and cursor moves all slow down together.
const PACE = 1.6;
const DURATION = 30 * PACE;
const IMG = window.SSH_CLIENT_SCREENS; // { stats, terminal, ai }

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
      <Head icon={I.ubuntu(26)} title="API Gateway" sub="192.333.4.545" />
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

// Port Mapping card (Local / Remote / Dynamic), from components "Port Mapping (…)"
const PM = {
  Local: { color: "#9C8FE6", icon: I.arrowLocal, rows: [["0.0.0.0:8080", "127.0.0.1:3000"], ["SSH Server", "staging-server"]], dir: 1 },
  Remote: { color: C.keyBlue, icon: I.arrowRemote, rows: [["0.0.0.0:8080", "127.0.0.1:3000"], ["SSH Server", "staging-server"]], dir: -1 },
  Dynamic: { color: "#4FD1A5", icon: I.arrowDynamic, rows: [["Proxy Host", "127.0.0.1:1080"], ["SSH Server", "staging-server"]], dir: 0 },
};
function PortCard({ type, open, flow }) {
  const p = PM[type];
  return (
    <div style={cardShell}>
      <Head icon={p.icon(p.color)} title="PostgreSQL Database" sub={type} />
      <Divider up={open > 0.5} />
      <div style={{ height: 112 * open, overflow: "hidden" }}>
        <div style={{ margin: "18px 16px 0", border: `1px solid ${C.line}`, borderRadius: 10, padding: "14px 14px", fontSize: 14, opacity: open }}>
          {p.dir === 0 ? p.rows.map(([a, b], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginTop: i ? 12 : 0 }}><span style={{ color: C.sub }}>{a}</span><span>{b}</span></div>
          )) : (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>{p.rows[0][0]}</span>
                <FlowArrow dir={p.dir} color={p.color} flow={flow} />
                <span>{p.rows[0][1]}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}><span style={{ color: C.sub }}>{p.rows[1][0]}</span><span>{p.rows[1][1]}</span></div>
            </>
          )}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 16px", height: 56 }}>
        <Act>{I.pencil()}</Act><Act>{I.trash()}</Act><div style={{ flex: 1 }} /><Btn>Connect</Btn>
      </div>
    </div>
  );
}
// Arrow from the card, with a small packet travelling in its direction
function FlowArrow({ dir, color, flow }) {
  const x = dir > 0 ? 4 + 34 * flow : 38 - 34 * flow;
  return (
    <svg width="46" height="14" viewBox="0 0 46 14">
      <path d={dir > 0 ? "M4 7h36M34 2l6 5-6 5" : "M42 7H6M12 2L6 7l6 5"} stroke={C.icon} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {flow > 0 && flow < 1 && <circle cx={x} cy="7" r="3" fill={color} opacity={Math.sin(flow * Math.PI)} />}
    </svg>
  );
}

// Key card, from component "Key"
function KeyCard() {
  return (
    <div style={{ ...cardShell, width: 310 }}>
      <Head icon={I.key()} title="Production Server Key" sub="ED25519" dot={false} />
      <div style={{ height: 1, background: C.line, margin: "0 16px" }} />
      <div style={{ padding: "14px 16px 18px", display: "grid", gap: 10, fontSize: 14, color: C.sub }}>
        <span style={{ display: "flex", gap: 8, alignItems: "center" }}>{I.clock()}Last Used: 3h Ago</span>
        <span style={{ display: "flex", gap: 8, alignItems: "center" }}>{I.server()}Hosts : 2 Hosts Connected</span>
      </div>
    </div>
  );
}
// Connected-host row, from the key detail modal
function HostRow({ os, done }) {
  return (
    <div style={{ width: 300, height: 46, boxSizing: "border-box", padding: "0 16px", borderRadius: 8, background: "#1A1A22", display: "flex", alignItems: "center", gap: 14, fontFamily: FONT }}>
      {os === "ubuntu" ? I.ubuntu(20) : I.arch(18)}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: C.text }}>Device model 201</div>
        <div style={{ fontSize: 9, color: C.sub, marginTop: 2 }}>192.333.4.545</div>
      </div>
      <div style={{ opacity: done, transform: `scale(${0.7 + 0.3 * done})` }}>{I.tick()}</div>
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
function Window({ x, y, s = 0.72, z = 1, zp = 0, f = { x: 640, y: 416 }, rotY = -6, rotX = 2, o = 1, ty = 0, layers }) {
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

// Places a native-size component on the stage, centred at (x, y)
const Place = ({ x, y, s = 1, o = 1, ty = 0, origin = "50% 50%", children }) => o > 0.001 && (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%, -50%) translateY(${ty}px) scale(${s})`, transformOrigin: origin }}>{children}</div>
);
const Shadow = ({ children }) => <div style={{ borderRadius: 12, boxShadow: "0 50px 90px -30px rgba(0,0,0,.85), 0 0 0 1px rgba(255,255,255,.04)" }}>{children}</div>;

function Headline({ t, a, b, eyebrow, title }) {
  if (t < a - 0.05 || t > b + 0.05) return null;
  const e = prog(t, a, a + 0.55), h = prog(t, a + 0.12, a + 0.8), out = prog(t, b - 0.5, b);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 96, textAlign: "center", opacity: 1 - out }}>
      <div style={{ fontSize: 21, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: C.mute, opacity: e, transform: `translateY(${(1 - e) * 18 - out * 10}px)`, marginBottom: 16 }}>{eyebrow}</div>
      <div style={{ fontSize: 64, fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.03em", color: C.ink, whiteSpace: "nowrap", opacity: h, transform: `translateY(${(1 - h) * 28 - out * 14}px)` }}>{title}</div>
    </div>
  );
}

const PX = 960, PY = 650;
const winMotion = (u, len, zp) => {
  const i = prog(u, 0, 0.75), out = prog(u, len - 0.4, len);
  return { o: i * (1 - out), ty: 90 * (1 - i) - 40 * out, rotY: 0, rotX: (16 - 9 * i) * (1 - zp) };
};

// ---------- scenes (each uses local time u) ----------
const S = { open: [0, 2.9], connect: [2.9, 7.9], stats: [7.9, 14.0], term: [14.0, 20.5], ports: [20.5, 25.0], keys: [25.0, 28.4], close: [28.4, 30] };
// Scenes authored at a reference length are time-scaled to fit their slot.
const local = (t, a, b, ref) => ({ u: (t - a) * ref / (b - a), len: ref });

function Wordmark({ u, size, sub, subStyle, subAt }) {
  const w = prog(u, 0.2, 1.05), s = prog(u, subAt, subAt + 0.7);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: size, fontWeight: 600, color: C.ink, lineHeight: 1, letterSpacing: `${-0.045 + 0.04 * (1 - w)}em`, opacity: w, transform: `translateY(${(1 - w) * 30}px)` }}>SSH client</div>
      <div style={{ marginTop: 30, opacity: s, transform: `translateY(${(1 - s) * 16}px)`, ...subStyle }}>{sub}</div>
    </div>
  );
}

// Hub infographic, rebuilt from the sign-in illustration: the host at the centre, four live views around it
function Hub({ u }) {
  const card = (x, y, k, child) => {
    const e = prog(u, 0.25 + k * 0.12, 0.8 + k * 0.12);
    return (
      <g transform={`translate(${x * e} ${y * e})`} opacity={e}>
        <rect x="-43" y="-39" width="86" height="78" rx="11" fill="#17161F" stroke="#34323E" strokeWidth="1.2" />
        {child(e)}
      </g>
    );
  };
  const grow = prog(u, 0.9, 1.6), sweep = prog(u, 0.9, 1.9), fill = prog(u, 1.0, 1.8), frame = prog(u, 0.1, 0.9);
  const bars = [0.55, 0.35, 0.5, 0.4, 0.7, 0.62];
  return (
    <svg width="520" height="470" viewBox="-260 -235 520 470" style={{ overflow: "visible" }}>
      <rect x="-124" y="-112" width="248" height="224" rx="16" fill="none" stroke="#3A3845" strokeWidth="1.4" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - frame} />
      {card(0, -112, 0, () => (<g>
        <rect x="-30" y="-28" width="44" height="3" rx="1.5" fill="#8C8A99" /><rect x="-30" y="-21" width="30" height="3" rx="1.5" fill="#5E5C6A" />
        {bars.map((h, i) => <rect key={i} x={-28 + i * 10} y={26 - 34 * h * grow} width="5" height={34 * h * grow} rx="2" fill={`url(#hubBar)`} />)}
      </g>))}
      {card(-124, 0, 1, () => (<g>
        {[["#4FD1A5", -18], ["#4FD1A5", -2], ["#E0506E", 14]].map(([c, y], i) => (<g key={i} opacity={prog(u, 1.0 + i * 0.15, 1.3 + i * 0.15)}>
          <circle cx="-28" cy={y} r="2.6" fill={c} /><rect x="-20" y={y - 2} width="46" height="3" rx="1.5" fill="#8C8A99" /><rect x="-20" y={y + 4} width="28" height="2.5" rx="1.2" fill="#5E5C6A" />
        </g>))}
      </g>))}
      {card(124, 0, 2, () => (<g>
        <circle cx="0" cy="-8" r="15" fill="none" stroke="#2E2C38" strokeWidth="4" />
        <circle cx="0" cy="-8" r="15" fill="none" stroke="url(#hubRing)" strokeWidth="4" strokeLinecap="round" pathLength="1" strokeDasharray={`${0.72 * sweep} 1`} transform="rotate(-90 0 -8)" />
        <rect x="-26" y="18" width="20" height="3" rx="1.5" fill="#8C8A99" /><rect x="6" y="18" width="20" height="3" rx="1.5" fill="#8C8A99" />
        <rect x="-26" y="25" width="20" height="3" rx="1.5" fill="#5E5C6A" /><rect x="6" y="25" width="20" height="3" rx="1.5" fill="#5E5C6A" />
      </g>))}
      {card(0, 112, 3, () => (<g>
        {[-22, 6].map((y, i) => (<g key={i}>
          <rect x="-30" y={y - 6} width="40" height="3" rx="1.5" fill="#8C8A99" /><rect x="-30" y={y} width="26" height="2.5" rx="1.2" fill="#5E5C6A" />
          <rect x="-30" y={y + 8} width="52" height="3" rx="1.5" fill="#2E2C38" /><rect x="-30" y={y + 8} width={52 * (i ? 0.78 : 0.55) * fill} height="3" rx="1.5" fill="url(#hubProg)" />
          <rect x="26" y={y + 8} width="6" height="3" rx="1.5" fill="#8C8A99" />
        </g>))}
      </g>))}
      <g opacity={prog(u, 0, 0.5)} transform={`scale(${0.9 + 0.1 * prog(u, 0, 0.6)})`}>
        <rect x="-31" y="-31" width="62" height="62" rx="13" fill="#24222E" stroke="#3E3B4B" strokeWidth="1.2" />
        <g transform="translate(-15 -15) scale(2.3)">{I.server("#B9AEF5", 13)}</g>
      </g>
      <defs>
        <linearGradient id="hubBar" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#3E7C83" /><stop offset="1" stopColor="#8FD3C3" /></linearGradient>
        <linearGradient id="hubRing" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6D7CF0" /><stop offset="1" stopColor="#C46FA8" /></linearGradient>
        <linearGradient id="hubProg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7D6BF0" /><stop offset="1" stopColor="#6FA6F0" /></linearGradient>
      </defs>
    </svg>
  );
}

function Opening({ t }) {
  const [a, b] = S.open; if (t > b + 0.1) return null;
  const u = t - a, out = prog(u, b - a - 0.5, b - a);
  const line = prog(u, 1.0, 1.7);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-22 * out}px)` }}>
      <Place x={960} y={450} s={1.35}><Hub u={u} /></Place>
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", fontSize: 44, fontWeight: 500, letterSpacing: "-0.02em", color: C.ink, opacity: line, transform: `translateY(${(1 - line) * 18}px)` }}>Hosts, terminal, files and keys in one app.</div>
    </div>
  );
}

// 1 — Host Card expands, Connect is clicked, the connection infographic runs
function Connect({ t }) {
  const [a, b] = S.connect; if (t < a - 0.1 || t > b + 0.1) return null;
  const { u, len } = local(t, a, b, 6.0);
  const cardIn = prog(u, 0.2, 0.9), open = prog(u, 1.05, 1.65), cardOut = prog(u, 2.85, 3.4);
  const G = 1.5, cx = 960;
  const cardH = 145 + 196 * open;
  // cursor in card space (native px, origin top-left of card)
  const btn = { x: 305 - 16 - 39, y: 89 + 196 * open + 28 };
  const cur = kf(u, [[1.7, { x: 330, y: btn.y + 120 }], [2.45, { x: btn.x + 4, y: btn.y + 4 }]]);
  const curO = inOut(u, 1.65, 3.0, 0.3, 0.3);
  const pressed = u > 2.55 && u < 2.72;
  const ring = prog(u, 3.05, 3.65), p = prog(u, 3.5, 4.9);
  const steps = [prog(u, 3.6, 3.85), prog(u, 4.15, 4.4), prog(u, 4.75, 5.0)];
  const done = prog(u, 4.9, 5.2), out = prog(u, len - 0.45, len);
  return (
    <>
      <Headline t={t} a={a + 0.25} b={b - 0.15} eyebrow="Hosts" title={"Connect in one click."} />
      <Place x={cx} y={640} s={G * (0.96 + 0.04 * cardIn) * (1 - 0.12 * cardOut)} o={cardIn * (1 - cardOut)} ty={40 * (1 - cardIn) - 60 * cardOut}>
        <div style={{ position: "relative", height: cardH }}>
          <Shadow><HostCard open={open} pressed={pressed} /></Shadow>
          {curO > 0 && (
            <svg width="22" height="28" viewBox="0 0 22 28" style={{ position: "absolute", left: cur.x - 2, top: cur.y - 2, opacity: curO, transform: `scale(${(pressed ? 0.85 : 1) / G * 1.3})`, transformOrigin: "2px 2px", filter: "drop-shadow(0 3px 6px rgba(0,0,0,.5))" }}>
              <path d="M2 2 L2 22 L7.5 17 L11 25 L14.5 23.5 L11 15.8 L18.5 15.8 Z" fill="#fff" stroke="#111119" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </Place>
      <Place x={cx} y={468} s={1.12 * (0.94 + 0.06 * ring)} o={ring * (1 - out)} ty={30 * (1 - ring) - 30 * out}><ConnectRing p={p} done={done} /></Place>
      <Place x={cx} y={812} s={1.15} o={prog(u, 3.25, 3.85) * (1 - out)} ty={30 * (1 - prog(u, 3.25, 3.85)) - 30 * out}><Shadow><ConnectSteps steps={steps} /></Shadow></Place>
    </>
  );
}

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

// 2 — Host stats: the real tab set (Overview → Performance → Storage → Network → Activity), switched live
const TABS = [["Overview", 83], ["Performance", 284], ["Storage", 480], ["Network", 659], ["Activity", 837]];
const TAB_IMG = ["tab_overview", "tab_performance", "tab_storage", "tab_network", "tab_activity"];
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
          const o = clamp(1 - Math.abs(pos - i) * 1.6);
          return o > 0.001 && <img key={k} src={IMG[k]} alt="" style={{ position: "absolute", left: 0, top: 0, width: 960, height: 540, opacity: o, transform: `translateY(${(i - pos) * 18}px)` }} />;
        })}
      </div>
    </div>
  );
}
// Floating metric callouts, one per stats tab (values from the design)
const cardStyle = { background: "#15151D", border: `1px solid ${C.line}`, borderRadius: 16, padding: "20px 22px", fontFamily: FONT, boxShadow: "0 40px 80px -30px rgba(0,0,0,.9)", boxSizing: "border-box" };
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

function Stats({ t }) {
  const [a, b] = S.stats; if (t < a - 0.1 || t > b + 0.1) return null;
  const { u, len } = local(t, a, b, 6.2);
  const e = prog(u, 0.1, 0.8), out = prog(u, len - 0.45, len);
  const SW = [1.35, 2.35, 3.35, 4.35];
  const clicks = SW.map((ct, i) => [ct, { x: TABS[i + 1][1] + 24 + 12, y: 88 + 30 }]);
  const pos = kf(u, [[1.35, 0], [1.75, 1], [2.35, 1], [2.75, 2], [3.35, 2], [3.75, 3], [4.35, 3], [4.75, 4]]);
  const win = [[0.75, 1.3], [1.6, 2.3], [2.6, 3.3], [3.6, 4.3], [4.6, 5.7]]; // when each tab's callout is on screen
  const cur = kf(u, clickPath([0.6, { x: 560, y: 420 }], clicks));
  const G = 1.08;
  return (
    <>
      <Headline t={t} a={a + 0.2} b={b - 0.15} eyebrow="Host stats" title="Live stats for every host." />
      <Place x={960} y={648} s={G * (0.97 + 0.03 * e)} o={e * (1 - out)} ty={50 * (1 - e) - 30 * out}>
        <div style={{ position: "relative", borderRadius: 18, boxShadow: "0 60px 120px -40px rgba(0,0,0,.9), 0 0 0 1px rgba(255,255,255,.05)" }}>
          <StatsPanel pos={pos} />
          {win.map(([s0, s1], i) => <StatCallout key={i} i={i} u={u} s0={s0} s1={s1} />)}
          <Cursor {...cur} o={inOut(u, 0.55, 5.4, 0.3, 0.3)} press={pressedAt(u, clicks)} size={1.15} />
        </div>
      </Place>
    </>
  );
}

// 3 — Terminal + Terminal Settings panel: Packages → package → command → History → Appearance → Ask AI
const PANELS = ["panel_pk_list", "panel_pk_open", "panel_pk_cmd", "panel_history", "panel_appearance", "panel_askai"];
// Supporting callouts for the terminal settings walk-through (content from the panels)
function TermCallouts({ u }) {
  const box = (s0, s1, child, w = 330) => {
    const e = inOut(u, s0, s1, 0.35, 0.3); if (e <= 0.001) return null;
    return <div style={{ position: "absolute", left: 300, top: 470, width: w, transform: `translate(-50%, -50%) translateX(${-30 * (1 - e)}px)`, opacity: e, ...cardStyle, zIndex: 30 }}>{child(prog(u, s0 + 0.1, s0 + 0.7))}</div>;
  };
  const q = "How do I find all .txt files in a directory?";
  return (
    <>
      {box(1.1, 1.95, (p) => (<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
        <span style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 16, color: C.text }}><span style={{ color: C.keyBlue, fontSize: 18 }}>✦</span>Autocomplete Commands</span>
        <span style={{ width: 44, height: 24, borderRadius: 12, background: p > 0.5 ? "#1FA3E0" : C.track, position: "relative", flex: "none" }}><span style={{ position: "absolute", top: 3, left: 3 + 20 * p, width: 18, height: 18, borderRadius: 9, background: "#fff" }} /></span></div>))}
      {box(2.05, 3.6, (p) => (<div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 17, color: C.text, fontWeight: 500 }}>devops-kit<span style={{ fontSize: 12, color: C.sub, background: C.track, borderRadius: 10, padding: "1px 8px" }}>3</span></div>
        <svg width="280" height="112" viewBox="0 0 280 112" style={{ marginTop: 6, overflow: "visible" }}>
          {["Check Network Load", "Backup", "Check Network Load"].map((n, k) => { const e = prog(u, 2.25 + k * 0.2, 2.6 + k * 0.2); const y = 20 + k * 36; return (<g key={k} opacity={e}>
            <path d={`M8 0 V${y} H${8 + 22 * e}`} stroke="#3A3A46" strokeWidth="1.6" fill="none" />
            <text x="40" y={y + 5} fill={C.text} fontSize="15" fontFamily="Outfit, sans-serif">{n}</text></g>); })}
        </svg></div>), 330)}
      {box(3.7, 4.45, (p) => (<div><Lbl>History</Lbl><div style={{ display: "flex", gap: 10 }}>
        {["All Hosts", "This Week"].map((n, k) => <span key={n} style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${C.line}`, fontSize: 15, color: C.text, opacity: prog(u, 3.85 + k * 0.15, 4.15 + k * 0.15) }}>{n}</span>)}</div>
        <div style={{ fontSize: 13, color: C.sub, marginTop: 12 }}>◷ 5 mins ago</div></div>))}
      {box(4.55, 5.3, (p) => (<div><Lbl>Appearance</Lbl><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "'Fira Code', ui-monospace, monospace", fontSize: 17, color: C.text }}>Fira Code</span>
        <span style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 18, color: C.text }}><span style={{ width: 28, height: 28, borderRadius: 7, background: C.track, display: "grid", placeItems: "center" }}>−</span>{Math.round(12 + 2 * p)}<span style={{ width: 28, height: 28, borderRadius: 7, background: C.track, display: "grid", placeItems: "center" }}>+</span></span></div>
        <div style={{ fontSize: 14, color: C.sub, marginTop: 12 }}>Theme · Rose Pink</div></div>))}
      {box(5.4, 6.3, (p) => (<div><div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 15, color: C.text, marginBottom: 12 }}><span style={{ color: "#8B5CF6", fontSize: 18 }}>✦</span>Ask AI</div>
        <div style={{ background: C.track, borderRadius: 10, padding: "10px 14px", fontSize: 15, color: C.text, minHeight: 42 }}>{q.slice(0, Math.round(q.length * p))}<span style={{ opacity: Math.sin(u * 14) > 0 ? 1 : 0 }}>|</span></div></div>), 360)}
    </>
  );
}

function Terminal({ t }) {
  const [a, b] = S.term; if (t < a - 0.1 || t > b + 0.1) return null;
  const { u, len } = local(t, a, b, 6.6);
  const wi = prog(u, 0, 0.75), out = prog(u, len - 0.45, len);
  const WX = 850, WY = 640, WS = 0.62, PXp = 1395, PYp = 648, PS = 0.95;
  const onWin = (x, y) => ({ x: WX + (x - 640) * WS, y: WY + (y - 416) * WS });
  const onPanel = (x, y) => ({ x: PXp + (x - 191.5) * PS, y: PYp + (y - 396.5) * PS });
  const clicks = [[0.85, onWin(1232, 81)], [1.9, onPanel(85, 230)], [2.75, onPanel(115, 300)], [3.6, onPanel(236, 168)], [4.45, onPanel(301, 30)], [5.3, onPanel(310, 743)]];
  const shows = [1.0, 1.95, 2.8, 3.65, 4.5, 5.35];
  const pIn = prog(u, 1.0, 1.55);
  const cur = kf(u, clickPath([0.35, { x: 980, y: 760 }], clicks));
  return (
    <>
      <Headline t={t} a={a + 0.2} b={b - 0.15} eyebrow="Terminal" title="Saved commands, history and AI." />
      <Window x={WX} y={WY} s={WS} o={wi * (1 - out)} ty={70 * (1 - wi) - 30 * out} rotX={10 * (1 - wi)} rotY={0} layers={[{ src: IMG.terminal, o: 1 }]} />
      <Place x={PXp} y={PYp} s={PS} o={pIn * (1 - out)} ty={-30 * out}>
        <div style={{ position: "relative", width: 383, height: 793, borderRadius: 14, overflow: "hidden", transform: `translateX(${60 * (1 - pIn)}px)`, boxShadow: "0 60px 120px -30px rgba(0,0,0,.95), 0 0 0 1px rgba(255,255,255,.07)", background: "#070A14" }}>
          {PANELS.map((k, i) => {
            const o = i === 0 ? 1 : prog(u, shows[i], shows[i] + 0.35);
            return o > 0.001 && <img key={k} src={IMG[k]} alt="" style={{ position: "absolute", inset: 0, width: 383, height: 793, opacity: o, transform: `translateY(${(1 - o) * 10}px)` }} />;
          })}
        </div>
      </Place>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}><TermCallouts u={u} /></div>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}><Cursor {...cur} o={inOut(u, 0.3, 6.0, 0.3, 0.3)} press={pressedAt(u, clicks)} size={1.2} /></div>
    </>
  );
}

// 4 — Port Mapping components as a deck: each forwarding type comes forward, opens, shows its flow
function Ports({ t }) {
  const [a, b] = S.ports; if (t < a - 0.1 || t > b + 0.1) return null;
  const { u, len } = local(t, a, b, 5.4), out = prog(u, len - 0.45, len);
  const types = ["Local", "Remote", "Dynamic"];
  const front = [0.9, 2.75, 4.35];                       // when each card arrives at the front
  const active = kf(u, [[2.25, 0], [2.75, 1], [3.85, 1], [4.35, 2]]);
  const deckIn = prog(u, 0.15, 0.9);
  const G = 1.65;
  return (
    <>
      <Headline t={t} a={a + 0.25} b={b - 0.15} eyebrow="Port Mapping" title={"Local, remote or dynamic."} />
      {types.map((ty, i) => {
        const d = i - active;                            // 0 = front, >0 behind, <0 leaving
        const open = prog(u, front[i] + 0.05, front[i] + 0.5) * (1 - prog(u, front[i] + 1.3, front[i] + 1.6) * (i < 2 ? 1 : 0));
        const flowT = u - (front[i] + 0.5);
        const flow = flowT > 0 ? (flowT % 1.0) / 1.0 : 0;
        const behind = Math.max(0, d), gone = Math.max(0, -d);
        const o = deckIn * (1 - out) * (d >= 0 ? 1 - 0.35 * behind : 1 - gone) * (d > 2.2 ? 0 : 1);
        return (
          <div key={ty} style={{
            position: "absolute", left: 960 - 120 * gone, top: 330 - 40 * behind, zIndex: 10 - Math.round(behind * 2), opacity: o,
            filter: behind > 0.05 ? `brightness(${1 - 0.25 * Math.min(1, behind)})` : "none",
            transform: `translate(-50%, 0) translateY(${40 * (1 - deckIn) - 30 * out}px) scale(${G * (1 - 0.07 * behind)})`, transformOrigin: "50% 0",
          }}>
            <Shadow><PortCard type={ty} open={open} flow={open > 0.9 ? flow : 0} /></Shadow>
          </div>
        );
      })}
    </>
  );
}

// 5 — Key card links to the hosts it's exported to
function Keys({ t }) {
  const [a, b] = S.keys; if (t < a - 0.1 || t > b + 0.1) return null;
  const { u, len } = local(t, a, b, 3.8), out = prog(u, len - 0.45, len);
  const kIn = prog(u, 0.2, 0.9), line = prog(u, 0.95, 1.6);
  const rows = [{ os: "ubuntu", y: 540 }, { os: "arch", y: 720 }];
  const kx = 700, kr = kx + 155 * 1.6, rx = 1300, rl = rx - 150 * 1.55;
  return (
    <>
      <Headline t={t} a={a + 0.25} b={b - 0.15} eyebrow="Key Manager" title={"Keys, managed securely."} />
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
        {rows.map((r, i) => {
          const d = `M${kr} 630 C ${kr + 90} 630, ${rl - 90} ${r.y}, ${rl} ${r.y}`;
          return <path key={i} d={d} stroke="#3A3A46" strokeWidth="2" fill="none" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - line} />;
        })}
      </svg>
      <Place x={kx} y={630} s={1.6} o={kIn * (1 - out)} ty={40 * (1 - kIn) - 30 * out}><Shadow><KeyCard /></Shadow></Place>
      {rows.map((r, i) => {
        const e = prog(u, 1.3 + i * 0.2, 1.85 + i * 0.2);
        return <Place key={i} x={rx} y={r.y} s={1.55} o={e * (1 - out)} ty={20 * (1 - e) - 30 * out}><HostRow os={r.os} done={prog(u, 1.95 + i * 0.25, 2.25 + i * 0.25)} /></Place>;
      })}
    </>
  );
}

function Closing({ t }) {
  const [a] = S.close; if (t < a) return null;
  return <Place x={960} y={540} s={1.35}><Hub u={(t - a) * 1.4} /></Place>;
}

// Backdrop: black with low-opacity electric blue. A soft blue key light from above, a fine
// blue grid that fades toward the edges, a faint blue floor glow that drifts slowly, and edge falloff.
const EB = (a) => `rgba(30,110,255,${a})`; // electric blue #1E6EFF
function Backdrop({ t }) {
  const fade = "radial-gradient(ellipse 62% 58% at 50% 42%, #000 0%, rgba(0,0,0,.5) 45%, transparent 78%)";
  const d = Math.sin(t * 0.25) * 60;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#000", overflow: "hidden" }}>
      {/* key light from above */}
      <div style={{ position: "absolute", left: 960 - 1100 + d, top: -720, width: 2200, height: 1500, borderRadius: "50%", background: `radial-gradient(closest-side, ${EB(0.16)}, ${EB(0.05)} 55%, rgba(0,0,0,0))` }} />
      {/* floor glow */}
      <div style={{ position: "absolute", left: 960 - 1000 - d, top: 820, width: 2000, height: 620, borderRadius: "50%", background: `radial-gradient(closest-side, ${EB(0.12)}, rgba(0,0,0,0))` }} />
      {/* fine grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${EB(0.09)} 1px, transparent 1px), linear-gradient(90deg, ${EB(0.09)} 1px, transparent 1px)`,
        backgroundSize: "80px 80px", backgroundPosition: "0 20px",
        WebkitMaskImage: fade, maskImage: fade,
      }} />
      {/* edge falloff */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 85% at 50% 45%, rgba(0,0,0,0) 60%, rgba(0,0,0,.7) 100%)" }} />
    </div>
  );
}

function Stage({ t }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", fontFamily: FONT, WebkitFontSmoothing: "antialiased" }}>
      <Backdrop t={t} />
      <Opening t={t} />
      <Connect t={t} />
      <Stats t={t} />
      <Terminal t={t} />
      <Ports t={t} />
      <Keys t={t} />
      <Closing t={t} />
    </div>
  );
}

// ---------- player ----------
const fmt = (s) => s.toFixed(1).padStart(4, "0");

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

  window.__zync = { seek, pause: () => setPlaying(false) }; // handy for frame-exact capture

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
            {[2.9, 7.9, 14.0, 20.5, 25.0, 28.4].map((m) => <span key={m} className="tick" style={{ left: `${(m * PACE / DURATION) * 100}%` }} />)}
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
