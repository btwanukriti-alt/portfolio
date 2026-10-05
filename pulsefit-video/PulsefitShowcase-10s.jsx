// PulseFit — 10s feature showcase (16:9), cut from the 20s v3 showcase: a new product-overview
// intro, the Leads beat at its original pace, and the all-in-one overview as the close.
// Locked portfolio system (see clihub final). Every screen is rebuilt as live vector React from the
// PulseFit Figma frames and refined to one consistent spec (8pt grid, one radius scale, one type ramp,
// aligned tables, consistent nav). Values and labels come from the frames.
const { useState, useEffect, useRef, useLayoutEffect } = React;

// ---------- theme ----------
const C = {
  ink: "#0F1222", mute: "#6B7084",                  // stage headline / eyebrow (light stage)
  page: "#F5F6FA", surf: "#FFFFFF", line: "#E7E9F0", line2: "#F0F1F5",
  t1: "#0F1222", t2: "#2B2F42", sub: "#6B7084", faint: "#9A9EB0",
  primary: "#1F4FF4", pSoft: "#ECF1FF",
  green: "#139B55", gSoft: "#E6F6EE", amber: "#D9820B", aSoft: "#FFF3DF",
  red: "#E0444A", rSoft: "#FDECEC", violet: "#7358F5", vSoft: "#F0ECFF",
  pink: "#E0457F", teal: "#0FB5A5", yellow: "#F2B21B",
};
const FONT = "'Poppins', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";
const PACE = 1.0;
const DURATION = 10 * PACE;

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
const fmtN = (v, d = 0) => Number(v).toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });

// ---------- icons (18px line icons, one stroke weight) ----------
const Ic = ({ d, s = 18, c = "currentColor", w = 1.7, fill = "none", children }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", display: "block" }}>{d ? <path d={d} /> : children}</svg>
);
const IC = {
  grid: (c) => <Ic c={c}><rect x="3.5" y="3.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.6" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.6" /></Ic>,
  users: (c) => <Ic c={c}><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" /><path d="M15.5 5.2a3 3 0 010 5.6M17.5 14.4c1.7.6 2.7 2.2 3 4.6" /></Ic>,
  star: (c) => <Ic c={c} d="M12 3.5l2.5 5.2 5.7.8-4.1 4 1 5.6L12 16.4 6.9 19.1l1-5.6-4.1-4 5.7-.8z" />,
  staff: (c) => <Ic c={c}><circle cx="12" cy="7.5" r="3.5" /><path d="M5 20c.8-3.8 3.6-6 7-6s6.2 2.2 7 6" /></Ic>,
  plans: (c) => <Ic c={c}><rect x="3.5" y="4" width="17" height="5" rx="1.4" /><path d="M5 9v9.5a1.5 1.5 0 001.5 1.5h11a1.5 1.5 0 001.5-1.5V9M10 13h4" /></Ic>,
  mail: (c) => <Ic c={c}><rect x="3" y="5" width="18" height="14" rx="2.2" /><path d="M3.8 6.5l8.2 6 8.2-6" /></Ic>,
  dumbbell: (c) => <Ic c={c} d="M6.5 7v10M4 9.5v5M17.5 7v10M20 9.5v5M6.5 12h11" />,
  heart: (c) => <Ic c={c} d="M12 19.5s-7.5-4.4-7.5-10A4.2 4.2 0 0112 7a4.2 4.2 0 017.5 2.5c0 5.6-7.5 10-7.5 10z" />,
  chev: (c = C.faint, s = 16) => <Ic c={c} s={s} d="M7 10l5 5 5-5" />,
  chevR: (c = C.faint, s = 14) => <Ic c={c} s={s} d="M9.5 6.5l5 5.5-5 5.5" />,
  gear: (c) => <Ic c={c}><circle cx="12" cy="12" r="3" /><path d="M10.3 3.5h3.4l.5 2.4 1.7.9 2.2-1 2.4 2.4-1 2.2.9 1.7 2.4.5v3.4l-2.4.5-.9 1.7 1 2.2-2.4 2.4-2.2-1-1.7.9-.5 2.4h-3.4l-.5-2.4-1.7-.9-2.2 1-2.4-2.4 1-2.2-.9-1.7-2.4-.5v-3.4l2.4-.5.9-1.7-1-2.2 2.4-2.4 2.2 1 1.7-.9z" /></Ic>,
  bell: (c) => <Ic c={c} d="M6 16.5V11a6 6 0 0112 0v5.5l1.5 1.5h-15zM10 20.5h4" />,
  plus: (c = "#fff", s = 16) => <Ic c={c} s={s} w={2} d="M12 5v14M5 12h14" />,
  filter: (c) => <Ic c={c} s={16} d="M4 7h16M7 12h10M10 17h4" />,
  dots: (c = C.faint) => <Ic c={c} s={18} w={2.6} d="M5.5 12h.01M12 12h.01M18.5 12h.01" />,
  check: (c = "#fff", s = 14) => <Ic c={c} s={s} w={2.4} d="M5 12.5l4.5 4.5L19 7.5" />,
  userPlus: (c = "#fff", s = 20) => <Ic c={c} s={s} w={2}><circle cx="10" cy="8" r="3.5" /><path d="M3.5 19.5c.7-3.6 3.3-5.6 6.5-5.6 1.4 0 2.6.3 3.7 1M18 13v6M15 16h6" /></Ic>,
  send: (c) => <Ic c={c} w={2} d="M20.5 3.5l-7 17-3.2-7-7-3.2z" />,
  open: (c) => <Ic c={c} w={2} d="M13.5 4.5h6v6M19.5 4.5L11 13M17 14v4.5a1.5 1.5 0 01-1.5 1.5h-10A1.5 1.5 0 014 18.5v-10A1.5 1.5 0 015.5 7H10" />,
  tap: (c) => <Ic c={c} w={2}><path d="M12 12v8M12 12a3 3 0 00-3 3M7.5 9a6 6 0 019 0M5 6.5a9.5 9.5 0 0114 0" /></Ic>,
  unsub: (c) => <Ic c={c} w={2}><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="M3.8 7l8.2 6 8.2-6M9 15.5l6-5" /></Ic>,
  spark: (c) => <Ic c={c} w={2} d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4M6 6l2.6 2.6M15.4 15.4L18 18M6 18l2.6-2.6M15.4 8.6L18 6" />,
  cal: (c) => <Ic c={c} s={16}><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></Ic>,
  sun: (c) => <Ic c={c} s={16}><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></Ic>,
  moon: (c) => <Ic c={c} s={16} d="M19.5 14.5A8 8 0 019.5 4.5a8 8 0 1010 10z" />,
  clip: (c) => <Ic c={c}><rect x="5" y="4.5" width="14" height="16" rx="2" /><path d="M9 4.5V3.5h6v1M9 11h6M9 15h4" /></Ic>,
  clock: (c) => <Ic c={c}><circle cx="12" cy="12" r="8" /><path d="M12 7.5V12l3 2" /></Ic>,
  alert: (c) => <Ic c={c}><path d="M12 4l9 15.5H3z" /><path d="M12 10v4M12 16.8h.01" /></Ic>,
  done: (c) => <Ic c={c}><circle cx="12" cy="12" r="8" /><path d="M8.5 12.2l2.4 2.4 4.6-4.8" /></Ic>,
  rupee: (c) => <Ic c={c} s={16} d="M7 5h10M7 9h10M8 5c5 0 5 8 0 8h-1l7 7" />,
  coin: (s = 18) => <svg width={s} height={s} viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="#F5B82E" /><circle cx="10" cy="10" r="6.5" fill="#FFCD4D" /><text x="10" y="13.6" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#B7791F" fontFamily="Poppins">₹</text></svg>,
  trend: (c) => <Ic c={c} s={14} w={2.2} d="M4 16l5.5-5.5 3.5 3.5L20 7M15 7h5v5" />,
  chat: (c) => <Ic c={c} w={2}><path d="M4.5 5.5h15v10h-9l-4 3.5v-3.5h-2z" /><path d="M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01" /></Ic>,
  cal2: (c) => <Ic c={c} w={2}><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4M9 14.5l2 2 4-4" /></Ic>,
  up: (c) => <Ic c={c} w={2} d="M12 19V5M6 11l6-6 6 6" />,
};

// PulseFit mark (small, used only inside the product's own sidebar)
const Mark = ({ s = 26 }) => (
  <svg width={s} height={s} viewBox="0 0 26 26"><path d="M6 23.5L9.8 3h7.7a5.6 5.6 0 015.3 7l-.3 1.1a6 6 0 01-5.8 4.4H12.4L10.9 23.5z" fill={C.primary} /><path d="M13.7 7.6h3.4c1 0 1.8 1 1.5 2l-.3 1.2a2 2 0 01-1.9 1.4h-3.6z" fill={C.yellow} /></svg>
);

// ---------- primitives ----------
const HUES = { "Robert Fox": 18, "Neha Singh": 330, "Alex John": 200, Cameron: 150, "Aaron J.": 45, "Apurva Jha": 280, "Shikhar Tiwari": 210, "Abhishek M": 100, "Ritesh Jha": 20, "Emile Berlinier": 340, "Aprurva Jha": 280, "Eshika Mehta": 170, "S.M Jha": 230, "Prerna Singh": 10, "Pranjal Mishra": 260, "Alex Johnson": 215, "Anu": 25 };
const Avatar = ({ name, s = 28 }) => {
  const h = HUES[name] ?? 220;
  const ini = name.replace(".", "").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return <div style={{ width: s, height: s, borderRadius: s / 2, flex: "none", background: `hsl(${h} 70% 92%)`, color: `hsl(${h} 45% 36%)`, display: "grid", placeItems: "center", fontSize: s * 0.38, fontWeight: 600, letterSpacing: "-0.02em", boxShadow: "0 0 0 2px #fff" }}>{ini}</div>;
};
const Card = ({ children, style, pad = 20 }) => <div style={{ background: C.surf, border: `1px solid ${C.line}`, borderRadius: 14, padding: pad, boxSizing: "border-box", ...style }}>{children}</div>;
const CardHead = ({ title, right, badge }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 32, marginBottom: 12 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 16, fontWeight: 600, color: C.t1, letterSpacing: "-0.01em" }}>{title}</span>{badge}</div>{right}
  </div>
);
const Chip = ({ children, fg, bg, style }) => <span style={{ display: "inline-flex", alignItems: "center", gap: 5, height: 24, padding: "0 10px", borderRadius: 12, background: bg, color: fg, fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", ...style }}>{children}</span>;
const Btn = ({ children, kind = "primary", h = 36, pressed, style }) => {
  const k = { primary: { background: C.primary, color: "#fff", border: `1px solid ${C.primary}` }, ghost: { background: "#fff", color: C.t2, border: `1px solid ${C.line}` }, soft: { background: C.pSoft, color: C.primary, border: `1px solid ${C.pSoft}` } }[kind];
  return <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, height: h, padding: `0 ${h > 30 ? 16 : 12}px`, borderRadius: 8, fontSize: h > 30 ? 14 : 12, fontWeight: 500, whiteSpace: "nowrap", boxSizing: "border-box", transform: `scale(${pressed ? 0.95 : 1})`, filter: pressed ? "brightness(.94)" : "none", ...k, ...style }}>{children}</div>;
};
const Toggle = ({ on }) => (
  <div style={{ width: 40, height: 22, borderRadius: 11, background: on > 0.5 ? C.primary : "#D5D8E2", position: "relative", flex: "none", transition: "none" }}>
    <div style={{ position: "absolute", top: 3, left: 3 + 18 * on, width: 16, height: 16, borderRadius: 8, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
  </div>
);
const Trend = ({ v, good = true }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.sub, marginTop: 10 }}>
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: good ? C.green : C.red, fontWeight: 600 }}>{IC.trend(good ? C.green : C.red)}{v}</span>since last week
  </div>
);
const Kpi = ({ label, value, p, icon, tint, bg, trend, good = true, w, d = 0, suffix = "" }) => (
  <Card style={{ width: w, height: 116 }} pad={18}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 13, color: C.sub }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 600, color: C.t1, letterSpacing: "-0.02em", marginTop: 4, fontVariantNumeric: "tabular-nums" }}>{fmtN(value * p, d)}{suffix}</div>
      </div>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: "grid", placeItems: "center" }}>{icon(tint)}</div>
    </div>
    {trend && <Trend v={trend} good={good} />}
  </Card>
);

// ---------- app shell (refined, shared by every screen) ----------
const NAV = [["Dashboard", IC.grid], ["Members", IC.users], ["Leads", IC.star], ["Staff", IC.staff], ["Plans", IC.plans], ["Communication", IC.mail], ["Equipments", IC.dumbbell], ["Workouts", IC.heart]];
function Sidebar({ active }) {
  return (
    <div style={{ width: 232, flex: "none", height: "100%", background: C.surf, borderRight: `1px solid ${C.line}`, padding: "20px 16px", boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, height: 36, padding: "0 8px", marginBottom: 20 }}><Mark /><span style={{ fontSize: 20, fontWeight: 600, color: C.t1, letterSpacing: "-0.02em" }}>Pulsefit</span></div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, height: 48, padding: "0 12px", borderRadius: 10, background: C.page, border: `1px solid ${C.line}`, marginBottom: 20 }}>
        <Avatar name="Anu" s={28} /><span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: C.t2 }}>My Workspace</span>{IC.chev(C.sub)}
      </div>
      {NAV.map(([n, ic]) => {
        const on = n === active;
        return (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 12, height: 44, padding: "0 12px", borderRadius: 10, background: on ? C.pSoft : "transparent", color: on ? C.primary : C.t2, fontSize: 14, fontWeight: on ? 600 : 400, marginBottom: 4 }}>
            {ic(on ? C.primary : C.sub)}<span style={{ flex: 1 }}>{n}</span>{n !== "Dashboard" && IC.chev(on ? C.primary : C.faint)}
          </div>
        );
      })}
    </div>
  );
}
function Topbar({ crumb }) {
  return (
    <div style={{ height: 64, background: C.surf, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 32px", gap: 20 }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.sub }}>
        {crumb.map((c, i) => <React.Fragment key={c}>{i > 0 && IC.chevR(C.faint, 14)}<span style={{ color: i === crumb.length - 1 ? C.primary : C.sub, fontWeight: i === crumb.length - 1 ? 500 : 400 }}>{c}</span></React.Fragment>)}
      </div>
      {IC.gear(C.sub)}
      <div style={{ position: "relative" }}>{IC.bell(C.sub)}<span style={{ position: "absolute", top: 0, right: 1, width: 7, height: 7, borderRadius: 4, background: C.red, boxShadow: "0 0 0 2px #fff" }} /></div>
      <Avatar name="Anu" s={34} />
    </div>
  );
}
const SH = { W: 1440, H: 900, side: 232, top: 64, pad: 32, padT: 28 };
function Shell({ active, crumb, scroll = 0, children }) {
  return (
    <div style={{ display: "flex", width: SH.W, height: SH.H, background: C.page, fontFamily: FONT, color: C.t1 }}>
      <Sidebar active={active} />
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <Topbar crumb={crumb} />
        <div style={{ position: "absolute", top: SH.top, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
          <div style={{ padding: `${SH.padT}px ${SH.pad}px`, transform: `translateY(${-scroll}px)` }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
const PageHead = ({ title, right }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 40, marginBottom: 24 }}>
    <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", color: C.t1 }}>{title}</div>
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>{right}</div>
  </div>
);

// ---------- stage helpers ----------
const MASK = "linear-gradient(180deg, transparent 0, transparent 238px, #000 300px)"; // UI never runs under the headline
function AppWin({ x, y, s, o = 1, ty = 0, rotX = 0, children }) {
  if (o <= 0.001) return null;
  return (
    <div style={{ position: "absolute", inset: 0, WebkitMaskImage: MASK, maskImage: MASK, opacity: o }}>
      <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, perspective: 3200 }}>
        <div style={{ position: "absolute", left: -SH.W / 2, top: -SH.H / 2, width: SH.W, height: SH.H, borderRadius: 18, overflow: "hidden", transform: `translateY(${ty}px) scale(${s}) rotateX(${rotX}deg)`, boxShadow: "0 50px 100px -40px rgba(22,38,110,.32), 0 0 0 1px rgba(15,18,34,.07)" }}>{children}</div>
      </div>
    </div>
  );
}
// native window coordinates -> stage coordinates
const onWin = (W, nx, ny) => ({ x: W.x + (nx - SH.W / 2) * W.s, y: W.y + (ny - SH.H / 2) * W.s + (W.ty || 0) });
// content coordinates (inside the page padding) -> native window coordinates
const inPage = (cx, cy, scroll = 0) => [SH.side + SH.pad + cx, SH.top + SH.padT + cy - scroll];

const Place = ({ x, y, s = 1, o = 1, ty = 0, children }) => o > 0.001 && (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%, -50%) translateY(${ty}px) scale(${s})` }}>{children}</div>
);
const Cursor = ({ x, y, o, press, size = 1 }) => o > 0.001 && (
  <svg width="22" height="28" viewBox="0 0 22 28" style={{ position: "absolute", left: x - 2, top: y - 2, opacity: o, transform: `scale(${(press ? 0.85 : 1) * size})`, transformOrigin: "2px 2px", filter: "drop-shadow(0 3px 6px rgba(0,0,0,.45))", zIndex: 60, overflow: "visible" }}>
    <path d="M2 2 L2 22 L7.5 17 L11 25 L14.5 23.5 L11 15.8 L18.5 15.8 Z" fill="#fff" stroke="#111119" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);
const clickPath = (start, clicks, travel = 0.45) => {
  const keys = [start];
  clicks.forEach(([ct, p]) => { keys.push([ct - travel, keys[keys.length - 1][1]]); keys.push([ct - 0.04, p]); });
  return keys;
};
const pressedAt = (u, clicks) => clicks.some(([ct]) => u > ct && u < ct + 0.14);

function Headline({ t, a, b, eyebrow, title }) {
  if (t < a - 0.05 || t > b + 0.05) return null;
  const e = prog(t, a, a + 0.5), h = prog(t, a + 0.1, a + 0.75), out = prog(t, b - 0.45, b);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 96, textAlign: "center", opacity: 1 - out, zIndex: 40 }}>
      <div style={{ fontSize: 21, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: C.mute, opacity: e, transform: `translateY(${(1 - e) * 18 - out * 10}px)`, marginBottom: 16 }}>{eyebrow}</div>
      <div style={{ overflow: "hidden", paddingBottom: 10, marginBottom: -10 }}>
        <div style={{ fontSize: 64, fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.03em", color: C.ink, whiteSpace: "nowrap", transform: `translateY(${(1 - h) * 105 - out * 105}%)` }}>{title}</div>
      </div>
    </div>
  );
}

// Floating callout card (dark glass, sits beside the UI)
const calloutStyle = { position: "absolute", width: 300, background: "rgba(14,24,86,.96)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 18, padding: "20px 22px", fontFamily: FONT, color: "#EDEEF4", boxShadow: "0 40px 80px -30px rgba(14,24,86,.55)", boxSizing: "border-box", zIndex: 30, backdropFilter: "blur(6px)" };
const CLbl = ({ children }) => <div style={{ fontSize: 14, color: "#A9B4E6", marginBottom: 10 }}>{children}</div>;
function Callout({ u, s0, s1, x, y, side = "left", w = 300, children }) {
  const e = inOut(u, s0, s1, 0.4, 0.35); if (e <= 0.001) return null;
  const dx = (side === "left" ? -34 : 34) * (1 - e);
  return <div style={{ ...calloutStyle, left: x, top: y, width: w, opacity: e, transform: `translate(${dx}px, ${14 * (1 - e)}px)` }}>{children(prog(u, s0 + 0.1, s0 + 0.8))}</div>;
}

// ---------- scene timing (base seconds) ----------
const S = { open: [0, 3.4], leads: [3.4, 7.8], overview: [7.8, 10.0] };
const CUTS = [3.4, 7.8];
const winIn = (u, len) => { const i = prog(u, 0, 0.75), out = prog(u, len - 0.45, len); return { o: i * (1 - out), ty: 80 * (1 - i) - 34 * out, rotX: 12 * (1 - i), i, out }; };

// =====================================================================
// 0 — OPENING: product overview. The Members dashboard rises into place and the seven modules
// slide out from behind it to either side, linked to the window.
// =====================================================================
const OPEN_L = [0, 1, 2]; // Members, Leads, Staff on the left
const OPEN_R = [3, 4, 5, 6]; // Plans, Communication, Equipments, Workouts on the right
function Opening({ t }) {
  const [a, b] = S.open; if (t > b + 0.1) return null;
  const u = t - a, len = b - a, out = prog(u, len - 0.5, len);
  const w = winIn(u - 0.3, len - 0.3);
  const W = { x: 960, y: 700, s: 0.6, ty: w.ty };
  const half = (SH.W * W.s) / 2;
  const chip = (idx, i, side) => {
    const [n, ic, c] = MODS[idx];
    const col = side === "left" ? OPEN_L : OPEN_R;
    const gap = 132;
    const y = 700 - ((col.length - 1) * gap) / 2 + i * gap + Math.sin(u * 1.1 + idx) * 4;
    const tx = side === "left" ? 330 : 1590;
    const from = side === "left" ? W.x - half + 120 : W.x + half - 120;
    const e = prog(u, 1.05 + idx * 0.13, 1.85 + idx * 0.13);
    const x = from + (tx - from) * e;
    const edge = side === "left" ? W.x - half : W.x + half;
    const tip = side === "left" ? x + 110 : x - 110;
    return { n, ic, c, x, y, e, edge, tip };
  };
  const chips = [...OPEN_L.map((m, i) => chip(m, i, "left")), ...OPEN_R.map((m, i) => chip(m, i, "right"))];
  return (
    <>
      <Headline t={t} a={a + 0.15} b={b - 0.05} eyebrow="Gym management" title="Run your whole gym from one place." />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-24 * out}px)` }}>
        <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
          {chips.map((k) => (
            <g key={k.n} opacity={k.e}>
              <path d={`M${k.edge} ${700 + (k.y - 700) * 0.35} C ${(k.edge + k.tip) / 2} ${700 + (k.y - 700) * 0.35}, ${(k.edge + k.tip) / 2} ${k.y}, ${k.tip} ${k.y}`} fill="none" stroke="rgba(31,79,244,.22)" strokeWidth="1.5" />
              <circle cx={k.tip} cy={k.y} r="4" fill="#fff" stroke="rgba(31,79,244,.35)" strokeWidth="1.5" />
            </g>
          ))}
        </svg>
        <AppWin x={W.x} y={W.y} s={W.s} o={w.o} ty={w.ty} rotX={w.rotX}>
          <MembersPage u={u - 0.3} scroll={0} rowHi={0} press={false} kS={0.6} hS={1.3} />
        </AppWin>
        {chips.map((k) => (
          <div key={k.n} style={{ position: "absolute", left: k.x, top: k.y, transform: `translate(-50%,-50%) scale(${0.9 + 0.1 * k.e})`, opacity: k.e, zIndex: 5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, height: 58, padding: "0 20px 0 10px", borderRadius: 16, background: "#fff", border: `1px solid ${C.line}`, boxShadow: "0 24px 50px -24px rgba(22,38,110,.35)", fontFamily: FONT, whiteSpace: "nowrap" }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: k.c, display: "grid", placeItems: "center" }}>{k.ic("#fff")}</div>
              <span style={{ fontSize: 18, fontWeight: 600, color: C.t1, letterSpacing: "-0.01em" }}>{k.n}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const dotBg = { backgroundImage: "radial-gradient(rgba(115,88,245,.16) 1.2px, transparent 1.3px)", backgroundSize: "16px 16px" };
function LeadCard({ press, glow }) {
  return (
    <div style={{ width: 380, boxSizing: "border-box", padding: 22, borderRadius: 22, background: "#fff", border: "1.5px solid #D9D0FF", boxShadow: `0 0 0 ${6 * glow}px rgba(115,88,245,.10), 0 30px 60px -30px rgba(40,20,120,.30)`, fontFamily: FONT }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Avatar name="Alex Johnson" s={44} /><div style={{ fontSize: 19, fontWeight: 600, color: C.t1 }}>Alex Johnson</div></div>
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <Chip fg={C.primary} bg={C.pSoft}><span style={{ width: 14, height: 14, borderRadius: 7, background: C.primary, display: "grid", placeItems: "center" }}>{IC.check("#fff", 10)}</span>Trial</Chip>
        <Chip fg={C.primary} bg={C.pSoft}><span style={{ width: 14, height: 14, borderRadius: 7, background: C.primary, display: "grid", placeItems: "center" }}>{IC.check("#fff", 10)}</span>Follow-Up</Chip>
        <Chip fg={C.red} bg={C.rSoft}>Hot</Chip>
      </div>
      <div style={{ marginTop: 16, padding: "14px 16px", borderRadius: 12, background: "#F4F2FF", display: "grid", gap: 8 }}>
        <div style={{ height: 8, width: "78%", borderRadius: 4, background: "#D6D0F7" }} /><div style={{ height: 8, width: "48%", borderRadius: 4, background: "#D6D0F7" }} />
      </div>
      <div style={{ marginTop: 18, height: 50, borderRadius: 12, background: "linear-gradient(90deg,#6A55F2,#8C6BF6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 17, fontWeight: 500, transform: `scale(${press ? 0.965 : 1})`, filter: press ? "brightness(.92)" : "none", boxShadow: "0 12px 24px -12px rgba(106,85,242,.8)" }}>{IC.userPlus("#fff", 20)}Convert to Member</div>
    </div>
  );
}
function AssignCard({ p, rows }) {
  const R = [["Plan", "Plan A"], ["Duration", "1 month"], ["Subscription", "₹1,000"]];
  return (
    <div style={{ width: 360, boxSizing: "border-box", padding: 22, borderRadius: 22, background: "#fff", border: "1.5px solid #D9D0FF", boxShadow: "0 30px 60px -30px rgba(40,20,120,.30)", fontFamily: FONT }}>
      <div style={{ fontSize: 19, fontWeight: 600, color: C.t1 }}>Assign Plan</div>
      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        {R.map(([k, v], i) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, opacity: clamp(rows * 3 - i), transform: `translateY(${8 * (1 - clamp(rows * 3 - i))}px)` }}><span style={{ color: C.sub }}>{k}</span><span style={{ color: C.t1, fontWeight: 500 }}>{v}</span></div>
        ))}
      </div>
      <div style={{ marginTop: 16, padding: "14px 16px", borderRadius: 12, background: "#F4F2FF", display: "flex", alignItems: "center", gap: 10 }}>
        {IC.coin(20)}<span style={{ fontSize: 14, fontWeight: 500, color: C.t2, flex: 1 }}>Total Amount</span><span style={{ fontSize: 18, fontWeight: 600, color: C.violet, fontVariantNumeric: "tabular-nums" }}>₹{fmtN(1100 * p)}</span>
      </div>
    </div>
  );
}
const MiniChip = ({ children }) => <div style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 40, padding: "0 16px", borderRadius: 12, background: "#fff", border: "1.5px solid #D9D0FF", fontFamily: FONT, fontSize: 15, fontWeight: 500, color: C.t2, whiteSpace: "nowrap", boxShadow: "0 16px 30px -18px rgba(40,20,120,.5)" }}>{children}</div>;
function Leads({ t }) {
  const [a, b] = S.leads; if (t < a - 0.1 || t > b + 0.1) return null;
  const u = t - a, len = b - a, out = prog(u, len - 0.45, len);
  const G = 1.24;
  const cardIn = prog(u, 0.1, 0.75), chips = prog(u, 0.45, 0.95), wire = prog(u, 0.55, 1.05);
  const score = prog(u, 0.6, 1.5), ring = prog(u, 0.7, 1.6);
  const clicks = [[1.75, { x: 230, y: 370 }]];
  const cur = kf(u, clickPath([0.95, { x: 470, y: 520 }], clicks, 0.7));
  const press = pressedAt(u, clicks);
  const l1 = prog(u, 1.9, 2.25), node = prog(u, 2.1, 2.45), l2 = prog(u, 2.35, 2.7), assign = prog(u, 2.5, 3.05), rows = prog(u, 2.75, 3.3), total = prog(u, 2.95, 3.6);
  const pk = u > 2.7 ? ((u - 2.7) % 1.1) / 1.1 : -1;
  const pkX = 420 + 280 * pk;
  return (
    <>
      <Headline t={t} a={a + 0.2} b={b - 0.15} eyebrow="Leads" title="Turn every lead into a member." />
      <Place x={960} y={660} s={G} o={1 - out} ty={-30 * out}>
        <div style={{ position: "relative", width: 1100, height: 520 }}>
          <div style={{ position: "absolute", inset: -30, borderRadius: 30, ...dotBg, opacity: 0.8 * cardIn, WebkitMaskImage: "radial-gradient(closest-side, #000 55%, transparent)", maskImage: "radial-gradient(closest-side, #000 55%, transparent)" }} />
          <svg width="1100" height="520" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path d="M230 64 V112" stroke="#B9ABFA" strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - wire} fill="none" />
            <path d="M230 374 V452" stroke="#B9ABFA" strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - wire} fill="none" />
            <path d="M420 240 H534" stroke="#B9ABFA" strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - l1} fill="none" />
            <path d="M586 240 H700" stroke="#B9ABFA" strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - l2} fill="none" />
            {[[230, 112, wire], [230, 374, wire], [420, 240, l1], [700, 240, l2]].map(([x, y, e], i) => <circle key={i} cx={x} cy={y} r="5.5" fill="#fff" stroke="#B9ABFA" strokeWidth="2" opacity={e} />)}
            {pk >= 0 && (pk < 0.4 || pk > 0.6) && <circle cx={pkX} cy="240" r="5" fill={C.violet} opacity={Math.sin(pk * Math.PI)} />}
          </svg>
          <div style={{ position: "absolute", left: 230, top: 44, transform: `translate(-50%,-50%) translateY(${10 * (1 - chips)}px)`, opacity: chips }}>
            <MiniChip><Ic c={C.violet} fill={C.violet} s={18} d="M12 3.5l2.5 5.2 5.7.8-4.1 4 1 5.6L12 16.4 6.9 19.1l1-5.6-4.1-4 5.7-.8z" />Lead Score: <span style={{ color: C.violet, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{Math.round(92 * score)}/100</span></MiniChip>
          </div>
          <div style={{ position: "absolute", left: 230, top: 474, transform: `translate(-50%,-50%) translateY(${-10 * (1 - chips)}px)`, opacity: chips }}>
            <MiniChip><Ic c={C.violet} s={18} w={2.2} d="M4 18l5-5 4 3 7-8" />Lead Growth
              <svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="10" fill="none" stroke="#E6E1FB" strokeWidth="3.4" /><circle cx="13" cy="13" r="10" fill="none" stroke={C.teal} strokeWidth="3.4" strokeLinecap="round" pathLength="100" strokeDasharray={`${72 * ring} 100`} transform="rotate(-90 13 13)" /></svg>
            </MiniChip>
          </div>
          <div style={{ position: "absolute", left: 40, top: 112, opacity: cardIn, transform: `translateY(${50 * (1 - cardIn)}px)` }}><LeadCard press={press} glow={prog(u, 1.75, 2.05) * (1 - prog(u, 2.4, 2.9))} /></div>
          <div style={{ position: "absolute", left: 560, top: 240, width: 52, height: 52, marginLeft: -26, marginTop: -26, borderRadius: 26, background: "linear-gradient(135deg,#8C6BF6,#C06BF0)", display: "grid", placeItems: "center", opacity: node, transform: `scale(${0.6 + 0.4 * node})`, boxShadow: `0 0 0 ${8 * node}px rgba(140,107,246,.16)` }}>{IC.userPlus("#fff", 22)}</div>
          <div style={{ position: "absolute", left: 700, top: 240, opacity: assign, transform: `translateY(-50%) translateX(${40 * (1 - assign)}px)` }}><AssignCard p={total} rows={rows} /></div>
          <Cursor {...cur} o={inOut(u, 0.9, 2.65, 0.3, 0.35)} press={press} size={1.1 / G * 1.25} />
        </div>
      </Place>
    </>
  );
}

// =====================================================================
// 2 — MEMBERS: Members dashboard (refined), KPIs, expiring subscriptions, attendance heatmap
// =====================================================================
const EXP = [
  ["Robert Fox", "+91 98886 23443", "Apurva Jha", "Plan A", "Today"],
  ["Neha Singh", "+91 98676 23562", "Shikhar Tiwari", "Plan B", "2 days"],
  ["Alex John", "+91 98568 96512", "Abhishek M", "Plan C", "5 days"],
  ["Cameron", "+91 78556 54916", "Ritesh Jha", "Plan D", "6 days"],
  ["Aaron J.", "+91 78556 54916", "Shikhar Tiwari", "Plan E", "7 days"],
];
const PLAN_C = { "Plan A": [C.primary, C.pSoft], "Plan B": [C.amber, C.aSoft], "Plan C": [C.violet, C.vSoft], "Plan D": [C.teal, "#E3F7F4"], "Plan E": [C.pink, "#FDE9F1"] };
const INCOMPLETE = [["Robert Fox", "Plan A", "Biometrics missing"], ["Neha Singh", "Plan B", "Phone number missing"], ["Alex John", "Plan C", "Email missing"], ["Cameron", null, "Plan not assigned"]];
const HOURS = ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HEAT = [
  [0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 4, 4, 0],
  [0, 0, 0, 0, 0, 4, 1, 1, 3, 3, 3, 3, 0],
  [0, 0, 0, 3, 3, 4, 1, 3, 3, 3, 4, 3, 0],
  [0, 0, 0, 0, 3, 4, 1, 3, 4, 3, 3, 0, 3],
  [0, 0, 0, 0, 3, 4, 1, 3, 4, 3, 3, 3, 0],
  [0, 0, 0, 0, 0, 4, 1, 4, 4, 0, 3, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 3, 4, 1, 0, 0, 0],
];
const HEAT_C = ["#F1F2F7", "#DCE3FF", "#B5C4FF", "#7F95F8", C.primary];
const CW = 1144; // page content width
function MembersPage({ u, scroll, rowHi, press, kS = 0.6, hS = 3.0 }) {
  const k = prog(u, kS, kS + 0.9);
  const heat = (r, c) => clamp((u - hS) * 7 - c * 0.38 - r * 0.16);
  const kw = (CW - 4 * 16) / 5;
  return (
    <Shell active="Members" crumb={["Members", "Members Dashboard"]} scroll={scroll}>
      <PageHead title="Members" right={<Btn>{IC.plus()}Add Member</Btn>} />
      <div style={{ display: "flex", gap: 16 }}>
        <Kpi w={kw} label="Active Members" value={234} p={k} icon={IC.users} tint={C.primary} bg={C.pSoft} trend="+21" />
        <Kpi w={kw} label="New Joinees" value={12} p={k} icon={IC.userPlus} tint={C.green} bg={C.gSoft} trend="+21" />
        <Kpi w={kw} label="Pending Payments" value={42} p={k} icon={IC.clock} tint={C.amber} bg={C.aSoft} trend="+21" />
        <Kpi w={kw} label="Frozen Accounts" value={26} p={k} icon={IC.alert} tint={C.red} bg={C.rSoft} trend="+21" />
        <Kpi w={kw} label="Biometrics Missing" value={34} p={k} icon={IC.staff} tint={C.violet} bg={C.vSoft} trend="+2" good={false} />
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
        <Card style={{ width: 736, height: 360 }}>
          <CardHead title="Expiring Subscription" badge={<Chip fg={C.red} bg={C.rSoft}>8 expiring</Chip>} right={<span style={{ fontSize: 13, color: C.primary, fontWeight: 500 }}>View all</span>} />
          <div style={{ display: "grid", gridTemplateColumns: "170px 160px 84px 86px 1fr", fontSize: 12, color: C.faint, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", padding: "0 8px 10px", borderBottom: `1px solid ${C.line2}` }}>
            <span>Name</span><span>Assigned to</span><span>Plan</span><span>Expires in</span><span style={{ textAlign: "right" }}>Actions</span>
          </div>
          {EXP.map(([n, ph, as, pl, ex], i) => (
            <div key={n} style={{ display: "grid", gridTemplateColumns: "170px 160px 84px 86px 1fr", alignItems: "center", height: 51, padding: "0 8px", borderBottom: i < 4 ? `1px solid ${C.line2}` : "none", background: i === 0 ? `rgba(31,79,244,${0.05 * rowHi})` : "transparent", borderRadius: 8 }}>
              <div><div style={{ fontSize: 14, fontWeight: 500, color: C.t1 }}>{n}</div><div style={{ fontSize: 12, color: C.faint }}>{ph}</div></div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.t2 }}><Avatar name={as} s={24} />{as}</div>
              <div><Chip fg={PLAN_C[pl][0]} bg={PLAN_C[pl][1]}>{pl}</Chip></div>
              <div style={{ fontSize: 13, fontWeight: 500, color: ex === "Today" ? C.red : ex === "2 days" ? C.amber : C.sub }}>{ex}</div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", alignItems: "center" }}><Btn h={30} pressed={i === 0 && press}>Renew</Btn><Btn h={30} kind="ghost">Reminder</Btn></div>
            </div>
          ))}
        </Card>
        <Card style={{ flex: 1, height: 360 }}>
          <CardHead title="Incomplete Profile" right={<span style={{ fontSize: 13, color: C.primary, fontWeight: 500 }}>View all</span>} />
          <div style={{ display: "grid", gap: 10 }}>
            {INCOMPLETE.map(([n, pl, issue]) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 12, height: 60, padding: "0 14px", border: `1px solid ${C.line}`, borderRadius: 12 }}>
                <Avatar name={n} s={32} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500, color: C.t1 }}>{n}{pl && <Chip fg={PLAN_C[pl][0]} bg={PLAN_C[pl][1]} style={{ height: 20, fontSize: 11 }}>{pl}</Chip>}</div>
                  <div style={{ fontSize: 12, color: C.red, marginTop: 2 }}>{issue}</div>
                </div>
                <Btn h={30} kind="soft">Reminder</Btn>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card style={{ marginTop: 16, height: 360 }}>
        <CardHead title="Attendance Analysis" right={
          <div style={{ display: "flex", padding: 4, borderRadius: 10, background: C.page, border: `1px solid ${C.line}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, height: 30, padding: "0 14px", borderRadius: 7, background: "#fff", boxShadow: "0 1px 3px rgba(15,18,34,.1)", fontSize: 13, fontWeight: 500, color: C.t1 }}>{IC.sun(C.amber)}Morning</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, height: 30, padding: "0 14px", fontSize: 13, color: C.sub }}>{IC.moon(C.sub)}Evening</div>
          </div>} />
        <div style={{ display: "grid", gridTemplateColumns: `48px repeat(13, 1fr)`, gap: 6, alignItems: "center" }}>
          <span />{HOURS.map((h) => <span key={h} style={{ fontSize: 11, color: C.faint, textAlign: "center", paddingBottom: 4 }}>{h}</span>)}
          {HEAT.map((row, r) => (
            <React.Fragment key={r}>
              <span style={{ fontSize: 12, color: C.sub, fontWeight: 500 }}>{DAYS[r]}</span>
              {row.map((v, c) => {
                const e = heat(r, c);
                const lab = r === 0 && c === 10 ? "80" : r === 0 && c === 11 ? "85" : null;
                return <div key={c} style={{ height: 32, borderRadius: 7, background: HEAT_C[0], position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, background: HEAT_C[v], opacity: v ? e : 0, transform: `scale(${0.7 + 0.3 * e})`, borderRadius: 7 }} />
                  {lab && <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#fff", fontSize: 12, fontWeight: 600, opacity: e }}>{lab}</span>}
                </div>;
              })}
            </React.Fragment>
          ))}
        </div>
      </Card>
    </Shell>
  );
}
const MODS = [["Members", IC.users, C.primary], ["Leads", IC.star, C.violet], ["Staff", IC.staff, C.teal], ["Plans", IC.plans, C.amber], ["Communication", IC.mail, C.pink], ["Equipments", IC.dumbbell, "#1A7FB5"], ["Workouts", IC.heart, C.red]];
function Overview({ t }) {
  const [a, b] = S.overview; if (t < a - 0.1 || t > b + 0.1) return null;
  const u = t - a, len = b - a, out = prog(u, len - 0.4, len);
  const hub = prog(u, 0.05, 0.55), ring = prog(u, 0.1, 0.9);
  const cx = 960, cy = 668, RX = 600, RY = 250;
  const rot = u * 7;
  return (
    <>
      <Headline t={t} a={a + 0.1} b={b} eyebrow="All in one" title="Everything your gym runs on." />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `scale(${1 + 0.04 * out})`, transformOrigin: `${cx}px ${cy}px` }}>
        <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
          <ellipse cx={cx} cy={cy} rx={RX} ry={RY} fill="none" stroke="rgba(31,79,244,.18)" strokeWidth="1.5" strokeDasharray="4 8" pathLength="1" strokeDashoffset={0} opacity={ring} />
          <ellipse cx={cx} cy={cy} rx={RX * 0.55} ry={RY * 0.55} fill="none" stroke="rgba(31,79,244,.12)" strokeWidth="1.5" opacity={ring} />
          {MODS.map((m, i) => {
            const ang = ((i / MODS.length) * 360 - 90 + rot) * Math.PI / 180;
            const x = cx + RX * Math.cos(ang), y = cy + RY * Math.sin(ang);
            const e = prog(u, 0.3 + i * 0.09, 0.75 + i * 0.09);
            return <line key={i} x1={cx} y1={cy} x2={cx + (x - cx) * e} y2={cy + (y - cy) * e} stroke="rgba(31,79,244,.22)" strokeWidth="1.5" />;
          })}
          {MODS.map((m, i) => {
            const ang = ((i / MODS.length) * 360 - 90 + rot) * Math.PI / 180;
            const k = ((u * 0.8 + i * 0.37) % 1);
            const x = cx + RX * Math.cos(ang) * k, y = cy + RY * Math.sin(ang) * k;
            return u > 0.9 && <circle key={"p" + i} cx={x} cy={y} r="3.5" fill={m[2]} opacity={Math.sin(k * Math.PI) * 0.8} />;
          })}
        </svg>
        <div style={{ position: "absolute", left: cx, top: cy, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * hub})`, opacity: hub }}>
          <div style={{ width: 132, height: 132, borderRadius: 34, background: "linear-gradient(150deg,#3A66FF,#1F4FF4 55%,#1638C9)", display: "grid", placeItems: "center", boxShadow: `0 0 0 ${14 + 6 * Math.sin(u * 3)}px rgba(31,79,244,.10), 0 30px 60px -20px rgba(31,79,244,.6)` }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.6" fill="#FFB800" stroke="#FFB800" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.6" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.6" /></svg>
          </div>
        </div>
        {MODS.map(([n, ic, c], i) => {
          const ang = ((i / MODS.length) * 360 - 90 + rot) * Math.PI / 180;
          const x = cx + RX * Math.cos(ang), y = cy + RY * Math.sin(ang);
          const e = prog(u, 0.45 + i * 0.09, 0.95 + i * 0.09);
          return (
            <div key={n} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateY(${18 * (1 - e)}px) scale(${0.85 + 0.15 * e})`, opacity: e, zIndex: Math.round(y) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, height: 64, padding: "0 22px 0 12px", borderRadius: 18, background: "#fff", border: `1px solid ${C.line}`, boxShadow: "0 24px 50px -24px rgba(22,38,110,.35)", fontFamily: FONT, whiteSpace: "nowrap" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: c, display: "grid", placeItems: "center" }}>{ic("#fff")}</div>
                <span style={{ fontSize: 19, fontWeight: 600, color: C.t1, letterSpacing: "-0.01em" }}>{n}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ---------- scene cut: a skewed brand-blue wipe ----------
function Wipe({ t }) {
  return CUTS.map((c) => {
    const p = (t - (c - 0.36)) / 0.72;
    if (p <= 0 || p >= 1) return null;
    const e = ease(p);
    const x = -3000 + 5400 * e;
    return (
      <div key={c} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 80, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -200, bottom: -200, left: x - 220, width: 2600, transform: "skewX(-16deg)", background: "#8FA8FF" }} />
        <div style={{ position: "absolute", top: -200, bottom: -200, left: x, width: 2600, transform: "skewX(-16deg)", background: "linear-gradient(90deg,#1F4FF4,#3A66FF 70%,#1F4FF4)" }} />
        <div style={{ position: "absolute", top: -200, bottom: -200, left: x + 2380, width: 140, transform: "skewX(-16deg)", background: "#FFB800" }} />
      </div>
    );
  });
}

// ---------- backdrop: PulseFit off-white with a soft drifting mesh of brand light ----------
const BL = (a) => `rgba(31,79,244,${a})`;
function Backdrop({ t }) {
  const fade = "radial-gradient(ellipse 62% 58% at 50% 46%, #000 0%, rgba(0,0,0,.5) 45%, transparent 78%)";
  const d = Math.sin(t * 0.35) * 70, d2 = Math.cos(t * 0.3) * 90, d3 = Math.sin(t * 0.25 + 1) * 60;
  const blob = (l, tp, w, h, c) => <div style={{ position: "absolute", left: l, top: tp, width: w, height: h, borderRadius: "50%", background: `radial-gradient(closest-side, ${c}, rgba(255,255,255,0))` }} />;
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#F3F5FC 0%,#F7F8FC 55%,#EEF2FD 100%)", overflow: "hidden" }}>
      {blob(-420 + d, -520, 1500, 1200, BL(0.20))}
      {blob(1150 - d2, -380, 1300, 1000, "rgba(115,88,245,.14)")}
      {blob(1250 + d3, 560, 1000, 760, "rgba(255,184,0,.12)")}
      {blob(-200 - d3, 640, 1300, 800, BL(0.12))}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${BL(0.07)} 1px, transparent 1px), linear-gradient(90deg, ${BL(0.07)} 1px, transparent 1px)`, backgroundSize: "80px 80px", backgroundPosition: `${(t * 8) % 80}px ${20 + (t * 12) % 80}px`, WebkitMaskImage: fade, maskImage: fade }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 95% 90% at 50% 45%, rgba(245,246,250,0) 62%, rgba(236,240,252,.85) 100%)" }} />
    </div>
  );
}

function Stage({ t }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", fontFamily: FONT, WebkitFontSmoothing: "antialiased" }}>
      <Backdrop t={t} />
      <Opening t={t} />
      <Leads t={t} />
      <Overview t={t} />
      <Wipe t={t} />
    </div>
  );
}

// ---------- player ----------
const fmt = (s) => s.toFixed(1).padStart(4, "0");
const MARKS = [S.leads[0], S.overview[0]];
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
    const go = () => setTimeout(() => { if (!reduce && !window.__noAutoplay) setPlaying(true); }, 500);
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
  const scrub = (e) => { const r = bar.current.getBoundingClientRect(); seek(((e.clientX - r.left) / r.width) * DURATION); };
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
          <span className="hint">Space play · R restart · ←/→ seek · H hide controls</span>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Player />);
