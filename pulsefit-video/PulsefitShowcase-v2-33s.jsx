// PulseFit — feature showcase (30s base × PACE 1.6 ≈ 48s, 16:9)
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
const PACE = 1.1;
const DURATION = 30 * PACE;

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
  const e = prog(t, a, a + 0.55), h = prog(t, a + 0.12, a + 0.8), out = prog(t, b - 0.5, b);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 96, textAlign: "center", opacity: 1 - out, zIndex: 40 }}>
      <div style={{ fontSize: 21, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: C.mute, opacity: e, transform: `translateY(${(1 - e) * 18 - out * 10}px)`, marginBottom: 16 }}>{eyebrow}</div>
      <div style={{ fontSize: 64, fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.03em", color: C.ink, whiteSpace: "nowrap", opacity: h, transform: `translateY(${(1 - h) * 28 - out * 14}px)` }}>{title}</div>
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
const S = { open: [0, 3.0], leads: [3.0, 8.4], members: [8.4, 14.4], tasks: [14.4, 19.8], plans: [19.8, 24.4], comms: [24.4, 28.4], close: [28.4, 30] };
const winIn = (u, len) => { const i = prog(u, 0, 0.75), out = prog(u, len - 0.45, len); return { o: i * (1 - out), ty: 80 * (1 - i) - 34 * out, rotX: 12 * (1 - i), i, out }; };

// =====================================================================
// OPENING — the landing hero's layered dashboard illustration, rebuilt as live isometric layers
// =====================================================================
function IsoLayer({ z, o, children, glow }) {
  return (
    <div style={{ position: "absolute", left: -290, top: -200, width: 580, height: 400, borderRadius: 26, transform: `translateZ(${z}px)`, opacity: o,
      background: "linear-gradient(155deg, rgba(52,86,235,.94), rgba(20,36,130,.96) 60%, rgba(12,24,92,.97))",
      border: "1.5px solid rgba(150,180,255,.38)", boxShadow: `0 0 0 1px rgba(20,40,140,.4) inset, 0 40px 80px rgba(20,36,130,${0.28 * glow})` }}>{children}</div>
  );
}
function Iso({ u }) {
  const L = [prog(u, 0.05, 0.75), prog(u, 0.25, 0.95), prog(u, 0.45, 1.15)];
  const gap = 130;
  const draw = prog(u, 0.9, 1.9), bars = prog(u, 0.8, 1.7), rows = prog(u, 1.0, 2.1);
  const rot = -44 + 5 * prog(u, 0, 3);
  const bh = [0.45, 0.7, 0.55, 0.85, 0.62, 0.95, 0.78];
  const rowC = ["#6FD6A8", "#E57A86", "#6FD6A8", "#F2C96B", "#6FD6A8", "#E57A86", "#F2C96B"];
  return (
    <div style={{ position: "relative", width: 0, height: 0 }}>
      <div style={{ position: "absolute", transformStyle: "preserve-3d", transform: `rotateX(56deg) rotateZ(${rot}deg)` }}>
        {/* layer 1 — trend chart */}
        <IsoLayer z={0} o={L[0]} glow={1}>
          <svg width="580" height="400" viewBox="0 0 580 400">
            <rect x="36" y="34" width="120" height="10" rx="5" fill="rgba(210,225,255,.75)" />
            {[0, 1, 2, 3].map((i) => <line key={i} x1="36" x2="544" y1={120 + i * 64} y2={120 + i * 64} stroke="rgba(160,190,255,.16)" strokeWidth="2" />)}
            <path d="M36 300 C 110 250, 150 280, 220 220 S 330 160, 400 180 S 500 90, 544 100 L544 330 L36 330Z" fill="url(#isoArea)" opacity={draw} />
            <path d="M36 300 C 110 250, 150 280, 220 220 S 330 160, 400 180 S 500 90, 544 100" fill="none" stroke="#7FE3F5" strokeWidth="5" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw} />
            <defs><linearGradient id="isoArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5CC8F0" stopOpacity=".45" /><stop offset="1" stopColor="#5CC8F0" stopOpacity="0" /></linearGradient></defs>
          </svg>
        </IsoLayer>
        {/* layer 2 — KPI tiles + bars */}
        <IsoLayer z={gap * L[1]} o={L[1]} glow={0.8}>
          <svg width="580" height="400" viewBox="0 0 580 400">
            {[0, 1, 2].map((i) => (
              <g key={i}><rect x={36 + i * 176} y="34" width="156" height="92" rx="14" fill="rgba(255,255,255,.08)" stroke="rgba(170,195,255,.25)" strokeWidth="1.5" />
                <rect x={56 + i * 176} y="56" width="60" height="8" rx="4" fill="rgba(200,215,255,.6)" />
                <rect x={56 + i * 176} y="80" width={40 + 30 * bars} height="18" rx="6" fill={["#7FE3F5", "#F2C96B", "#8FA8FF"][i]} opacity=".9" /></g>
            ))}
            {bh.map((h, i) => <rect key={i} x={56 + i * 70} y={360 - 190 * h * bars} width="34" height={190 * h * bars} rx="8" fill="url(#isoBar)" />)}
            <defs><linearGradient id="isoBar" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#3D63F0" /><stop offset="1" stopColor="#8FB0FF" /></linearGradient></defs>
          </svg>
        </IsoLayer>
        {/* layer 3 — table (as in the hero) */}
        <IsoLayer z={gap * 2 * L[2]} o={L[2]} glow={0.6}>
          <svg width="580" height="400" viewBox="0 0 580 400">
            <text x="36" y="52" fill="rgba(235,240,255,.92)" fontSize="22" fontFamily="Poppins" fontWeight="500">Table</text>
            <rect x="300" y="32" width="130" height="30" rx="8" fill="rgba(200,215,255,.35)" /><rect x="442" y="32" width="46" height="30" rx="8" fill="rgba(200,215,255,.5)" /><rect x="498" y="32" width="46" height="30" rx="8" fill="#4C74FF" />
            {[70, 170, 280, 380, 480].map((x, j) => <rect key={j} x={x - 30} y="92" width="46" height="7" rx="3.5" fill="#F2C96B" opacity={prog(u, 0.9 + j * 0.06, 1.2 + j * 0.06)} />)}
            {rowC.map((c, i) => {
              const e = clamp(rows * 8 - i);
              const y = 128 + i * 36;
              return (<g key={i} opacity={e}>
                <rect x="40" y={y} width="14" height="6" rx="3" fill="#7FE3F5" />
                <rect x="140" y={y} width={62 * e} height="6" rx="3" fill="#7FE3F5" />
                <rect x="250" y={y} width={46 * e} height="6" rx="3" fill="#7FE3F5" opacity=".8" />
                <rect x="352" y={y - 2} width="40" height="10" rx="5" fill={c} />
                <rect x="440" y={y} width={70 * e} height="6" rx="3" fill="#7FE3F5" opacity=".7" />
                <circle cx="530" cy={y + 3} r="2.4" fill="#DDE6FF" /><circle cx="538" cy={y + 3} r="2.4" fill="#DDE6FF" />
              </g>);
            })}
          </svg>
        </IsoLayer>
      </div>
    </div>
  );
}
function Opening({ t }) {
  const [a, b] = S.open; if (t > b + 0.1) return null;
  const u = t - a, out = prog(u, b - a - 0.5, b - a), line = prog(u, 1.15, 1.85);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-24 * out}px)` }}>
      <Place x={960} y={560} s={1.1 + 0.04 * prog(u, 0, 3)}><Iso u={u} /></Place>
      <div style={{ position: "absolute", left: 0, right: 0, top: 846, textAlign: "center", fontSize: 44, fontWeight: 500, letterSpacing: "-0.02em", color: C.ink, opacity: line, transform: `translateY(${(1 - line) * 18}px)` }}>Leads, members, plans and campaigns in one place.</div>
    </div>
  );
}
function Closing({ t }) {
  const [a] = S.close; if (t < a) return null;
  return <Place x={960} y={620} s={1.14}><Iso u={(t - a) * 1.5} /></Place>;
}

// =====================================================================
// 1 — LEADS: the lead-to-member flow (landing illustration, rebuilt as live UI)
// =====================================================================
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
  const cardIn = prog(u, 0.15, 0.85), chips = prog(u, 0.6, 1.1), wire = prog(u, 0.7, 1.2);
  const score = prog(u, 0.8, 1.8), ring = prog(u, 0.9, 1.9);
  const clicks = [[2.3, { x: 230, y: 370 }]];
  const cur = kf(u, clickPath([1.5, { x: 470, y: 520 }], clicks, 0.7));
  const press = pressedAt(u, clicks);
  const l1 = prog(u, 2.45, 2.85), node = prog(u, 2.7, 3.05), l2 = prog(u, 2.95, 3.3), assign = prog(u, 3.1, 3.7), rows = prog(u, 3.4, 4.1), total = prog(u, 3.7, 4.5);
  const pk = u > 3.3 ? ((u - 3.3) % 1.1) / 1.1 : -1;
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
          <div style={{ position: "absolute", left: 40, top: 112, opacity: cardIn, transform: `translateY(${50 * (1 - cardIn)}px)` }}><LeadCard press={press} glow={prog(u, 2.3, 2.6) * (1 - prog(u, 2.9, 3.4))} /></div>
          <div style={{ position: "absolute", left: 560, top: 240, width: 52, height: 52, marginLeft: -26, marginTop: -26, borderRadius: 26, background: "linear-gradient(135deg,#8C6BF6,#C06BF0)", display: "grid", placeItems: "center", opacity: node, transform: `scale(${0.6 + 0.4 * node})`, boxShadow: `0 0 0 ${8 * node}px rgba(140,107,246,.16)` }}>{IC.userPlus("#fff", 22)}</div>
          <div style={{ position: "absolute", left: 700, top: 240, opacity: assign, transform: `translateY(-50%) translateX(${40 * (1 - assign)}px)` }}><AssignCard p={total} rows={rows} /></div>
          <Cursor {...cur} o={inOut(u, 1.45, 3.2, 0.3, 0.35)} press={press} size={1.1 / G * 1.25} />
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
function MembersPage({ u, scroll, rowHi, press }) {
  const k = prog(u, 0.6, 1.5);
  const heat = (r, c) => clamp((u - 3.0) * 6 - c * 0.55 - r * 0.25);
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
function Members({ t }) {
  const [a, b] = S.members; if (t < a - 0.1 || t > b + 0.1) return null;
  const u = t - a, len = b - a, m = winIn(u, len);
  const W = { x: 990, y: 668, s: 0.8, ty: m.ty };
  const scroll = kf(u, [[2.75, 0], [3.5, 152]]);
  const renew = inPage(20 + 8 + 500 + 30, 40 + 24 + 116 + 16 + 20 + 44 + 40 + 25, 0);
  const clicks = [[2.05, onWin(W, renew[0], renew[1])]];
  const cur = kf(u, clickPath([1.2, onWin(W, 760, 700)], clicks, 0.7));
  const cur2 = kf(u, [[2.6, clicks[0][1]], [3.55, clicks[0][1]], [4.25, onWin(W, ...inPage(20 + 54 + 11 * 81.2 + 30, 40 + 24 + 116 + 16 + 360 + 16 + 20 + 44 + 26 + 14, 152))]]);
  const pos = u < 2.6 ? cur : cur2;
  return (
    <>
      <Headline t={t} a={a + 0.2} b={b - 0.15} eyebrow="Members" title="Every member, at a glance." />
      <AppWin x={W.x} y={W.y} s={W.s} o={m.o} ty={m.ty} rotX={m.rotX}>
        <MembersPage u={u} scroll={scroll} rowHi={prog(u, 1.75, 2.05) * (1 - prog(u, 2.9, 3.3))} press={pressedAt(u, clicks)} />
      </AppWin>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - m.out }}>
        <Callout u={u} s0={1.05} s1={2.85} x={120} y={440} side="left">{(p) => (<>
          <CLbl>Subscriptions expiring</CLbl>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}><span style={{ fontSize: 46, fontWeight: 600, letterSpacing: "-0.02em" }}>{Math.round(8 * p)}</span><span style={{ fontSize: 15, color: "#A9B4E6" }}>this week</span></div>
          <div style={{ display: "flex", gap: 6, marginTop: 14 }}>{["Today", "2 days", "5 days", "6 days", "7 days"].map((d, i) => <div key={d} style={{ flex: 1, height: 6, borderRadius: 3, background: i === 0 ? "#FF6B70" : i === 1 ? "#F5A524" : "#5A6BFF", opacity: clamp(p * 5 - i) }} />)}</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#A9B4E6", marginTop: 8 }}><span>Today</span><span>7 days</span></div>
        </>)}</Callout>
        <Callout u={u} s0={3.75} s1={len - 0.35} x={1570} y={640} side="right">{(p) => (<>
          <CLbl>Peak attendance</CLbl>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}><span style={{ fontSize: 46, fontWeight: 600, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{Math.round(85 * p)}</span><span style={{ fontSize: 15, color: "#A9B4E6" }}>Sun · 11 AM</span></div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 46, marginTop: 12 }}>{[0.1, 0.12, 0.3, 0.55, 0.62, 0.94, 1].map((h, i) => <div key={i} style={{ flex: 1, height: `${h * 100 * clamp(p * 7 - i * 0.6)}%`, borderRadius: 4, background: i === 6 ? "#5A7BFF" : "rgba(120,140,255,.35)" }} />)}</div>
        </>)}</Callout>
        <Cursor {...pos} o={inOut(u, 1.15, 5.2, 0.3, 0.35)} press={pressedAt(u, clicks)} size={1.15} />
      </div>
    </>
  );
}

// =====================================================================
// 3 — TASKS: Task dashboard (refined) — completion chart, status donut, workload, epics
// =====================================================================
const SERIES = [["High", "#22A06B", [40, 65, 17, 66]], ["Medium", "#4B5CF0", [16, 45, 12, 42]], ["Low", "#E8A317", [63, 91, 45, 90]], ["Escalated", "#E5484D", [7, 23, 23, 32]]];
const WORK = [["Emile Berlinier", 2, 4], ["Aprurva Jha", 12, 15], ["Eshika Mehta", 3, 5], ["S.M Jha", 7, 15], ["Prerna Singh", 14, 15], ["Pranjal Mishra", 5, 5]];
const EPIC = [["Call", 20, 30, "#1F4FF4", C.pSoft], ["Follow-Up", 25, 30, "#1BA35D", C.gSoft], ["Outreach", 15, 40, "#F0641E", "#FFEDE3"], ["Equipments", 9, 15, "#1A7FB5", "#E3F3FB"], ["Plan Creation", 18, 21, "#B0258C", "#FBE6F5"], ["Trial", 18, 18, "#E6AD12", "#FFF6DB"]];
const DONUT = [["Pending", 20, "#FF9A5A"], ["In-Progress", 5, "#5B8DEF"], ["Done", 10, "#22CFC0"], ["Blocked", 5, "#F0468F"]];
function LineChart({ draw, tip }) {
  const X = (i) => 56 + i * 196, Y = (v) => 226 - v * 1.9;
  return (
    <svg width="660" height="270" viewBox="0 0 660 270" style={{ overflow: "visible" }}>
      {[0, 20, 40, 60, 80, 100].map((v) => <g key={v}><line x1="44" x2="650" y1={Y(v)} y2={Y(v)} stroke={C.line2} strokeWidth="1" /><text x="30" y={Y(v) + 4} fontSize="11" fill={C.faint} textAnchor="end" fontFamily="Poppins">{v}</text></g>)}
      {["Week 1", "Week 2", "Week 3", "Week 4"].map((w, i) => <text key={w} x={X(i)} y="256" fontSize="12" fill={C.sub} textAnchor="middle" fontFamily="Poppins">{w}</text>)}
      <line x1={X(2)} x2={X(2)} y1="30" y2="226" stroke={C.faint} strokeDasharray="3 4" opacity={tip} />
      {SERIES.map(([n, c, v]) => {
        const d = v.map((y, i) => `${i ? "L" : "M"}${X(i)} ${Y(y)}`).join(" ");
        return <g key={n}><path d={d} fill="none" stroke={c} strokeWidth="2.5" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - draw} />
          {v.map((y, i) => <circle key={i} cx={X(i)} cy={Y(y)} r={i === 2 ? 4 + 1.5 * tip : 4} fill="#fff" stroke={c} strokeWidth="2.2" opacity={clamp(draw * 4 - i)} />)}</g>;
      })}
      <g opacity={tip} transform={`translate(${X(2) + 16} ${60 + 8 * (1 - tip)})`}>
        <rect width="150" height="112" rx="10" fill="#fff" stroke={C.line} filter="url(#tipSh)" />
        {[["High", 17, "#22A06B"], ["Medium", 12, "#4B5CF0"], ["Low", 45, "#E8A317"], ["Escalated", 23, "#E5484D"]].map(([n, v, c], i) => (
          <g key={n} transform={`translate(16 ${26 + i * 22})`}><circle r="4" cx="4" cy="-4" fill={c} /><text x="16" fontSize="12" fill={C.sub} fontFamily="Poppins">{n}</text><text x="120" fontSize="12" fill={C.t1} fontWeight="600" textAnchor="end" fontFamily="Poppins">{v}</text></g>
        ))}
      </g>
      <defs><filter id="tipSh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0F1222" floodOpacity=".12" /></filter></defs>
    </svg>
  );
}
function Donut({ p }) {
  const tot = 40, R = 84; let acc = 0;
  return (
    <svg width="220" height="220" viewBox="-110 -110 220 220">
      <circle r={R} fill="none" stroke={C.line2} strokeWidth="26" />
      {DONUT.map(([n, v, c]) => {
        const s = acc / tot, f = v / tot; acc += v;
        const vis = clamp((p - s) / f) * f;
        return vis > 0 && <circle key={n} r={R} fill="none" stroke={c} strokeWidth="26" pathLength="100" strokeDasharray={`${Math.max(0, vis * 100 - 0.8)} 100`} strokeDashoffset={-s * 100} transform="rotate(-90)" />;
      })}
      <text y="6" textAnchor="middle" fontSize="38" fontWeight="600" fill={C.t1} fontFamily="Poppins">{Math.round(40 * p)}</text>
      <text y="30" textAnchor="middle" fontSize="13" fill={C.sub} fontFamily="Poppins">Total Tasks</text>
    </svg>
  );
}
function TasksPage({ u, scroll, tip }) {
  const k = prog(u, 0.6, 1.4), draw = prog(u, 0.8, 1.9), dn = prog(u, 0.9, 1.9), bars = prog(u, 3.3, 4.3);
  const kw = (CW - 4 * 16) / 5;
  return (
    <Shell active="Communication" crumb={["Communication", "Task Dashboard"]} scroll={scroll}>
      <PageHead title="Task Dashboard" right={<>
        <div style={{ display: "flex", padding: 4, borderRadius: 10, background: "#fff", border: `1px solid ${C.line}` }}>
          {["Dashboard", "Lists", "Board"].map((n, i) => <div key={n} style={{ height: 30, padding: "0 14px", borderRadius: 7, display: "flex", alignItems: "center", fontSize: 13, fontWeight: i ? 400 : 500, color: i ? C.sub : C.primary, background: i ? "transparent" : C.pSoft }}>{n}</div>)}
        </div>
        <Btn kind="ghost">{IC.filter(C.t2)}Filter</Btn><Btn>{IC.plus()}Add Task</Btn></>} />
      <div style={{ display: "flex", gap: 16 }}>
        <Kpi w={kw} label="Total Task Assigned" value={234} p={k} icon={IC.clip} tint={C.primary} bg={C.pSoft} trend="+21" />
        <Kpi w={kw} label="Pending Task" value={34} p={k} icon={IC.clock} tint={C.amber} bg={C.aSoft} trend="+21%" good={false} />
        <Kpi w={kw} label="Overdue Follow-Ups" value={6} p={k} icon={IC.alert} tint={C.red} bg={C.rSoft} trend="+2" />
        <Kpi w={kw} label="Task Closed" value={42} p={k} icon={IC.done} tint={C.green} bg={C.gSoft} trend="+21" />
        <Card style={{ width: kw, height: 116 }} pad={18}>
          <div style={{ fontSize: 13, color: C.sub }}>Top Performer</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}><Avatar name="Emile Berlinier" s={40} /><div><div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>Emile Berlinier</div><div style={{ fontSize: 12, color: C.primary, fontWeight: 500 }}>12 tasks closed</div></div></div>
        </Card>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
        <Card style={{ width: 736, height: 380 }}>
          <CardHead title="Task Completion Over Time" right={<div style={{ display: "flex", gap: 16 }}>{SERIES.map(([n, c]) => <span key={n} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.sub }}><span style={{ width: 10, height: 10, borderRadius: 3, background: c }} />{n}</span>)}</div>} />
          <div style={{ marginTop: 8 }}><LineChart draw={draw} tip={tip} /></div>
        </Card>
        <Card style={{ flex: 1, height: 380 }}>
          <CardHead title="Task Status Breakdown" />
          <div style={{ display: "grid", placeItems: "center", marginTop: 4 }}><Donut p={dn} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px", marginTop: 14, padding: "0 12px" }}>
            {DONUT.map(([n, v, c]) => <div key={n} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.t2 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: c }} />{n}<span style={{ marginLeft: "auto", fontWeight: 600 }}>{v}</span></div>)}
          </div>
        </Card>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
        <Card style={{ width: 564, height: 372 }}>
          <CardHead title="Team Workload" />
          {WORK.map(([n, d, tot], i) => (
            <div key={n} style={{ display: "grid", gridTemplateColumns: "170px 1fr 84px 92px", alignItems: "center", gap: 14, height: 48 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: C.t1, fontWeight: 500 }}><Avatar name={n} s={28} />{n}</div>
              <div style={{ height: 8, borderRadius: 4, background: C.line2 }}><div style={{ height: 8, borderRadius: 4, width: `${(d / tot) * 100 * clamp(bars * 1.6 - i * 0.12)}%`, background: C.t2 }} /></div>
              <div style={{ fontSize: 13, color: C.sub }}><b style={{ color: C.t1, fontWeight: 600 }}>{d}</b>/{tot} tasks</div>
              <Btn h={30} kind="ghost">View tasks</Btn>
            </div>
          ))}
        </Card>
        <Card style={{ flex: 1, height: 372 }}>
          <CardHead title="Task Progress by Epic" />
          {EPIC.map(([n, d, tot, c, bg], i) => (
            <div key={n} style={{ display: "grid", gridTemplateColumns: "120px 56px 1fr", alignItems: "center", gap: 14, height: 48 }}>
              <div><Chip fg={c} bg={bg}>{n}</Chip></div>
              <div style={{ fontSize: 13, color: C.sub }}><b style={{ color: C.t1, fontWeight: 600 }}>{d}</b>/{tot}</div>
              <div style={{ height: 8, borderRadius: 4, background: C.line2 }}><div style={{ height: 8, borderRadius: 4, width: `${(d / tot) * 100 * clamp(bars * 1.6 - i * 0.12)}%`, background: c }} /></div>
            </div>
          ))}
        </Card>
      </div>
    </Shell>
  );
}
function Tasks({ t }) {
  const [a, b] = S.tasks; if (t < a - 0.1 || t > b + 0.1) return null;
  const u = t - a, len = b - a, m = winIn(u, len);
  const W = { x: 960, y: 668, s: 0.8, ty: m.ty };
  const scroll = kf(u, [[2.85, 0], [3.5, 184]]);
  const pt = inPage(20 + 56 + 2 * 196, 40 + 24 + 116 + 16 + 20 + 44 + 8 + 226 - 17 * 1.9);
  const clicks = [[1.95, onWin(W, pt[0] + 2, pt[1] + 2)]];
  const epicEnd = inPage(1070, 592 + 64 + 24 + 48, 184);
  const cur = kf(u, [...clickPath([1.1, onWin(W, 700, 760)], clicks, 0.7), [2.9, clicks[0][1]], [3.6, onWin(W, epicEnd[0], epicEnd[1])]]);
  const tip = prog(u, 2.05, 2.35) * (1 - prog(u, 2.8, 3.05));
  return (
    <>
      <Headline t={t} a={a + 0.2} b={b - 0.15} eyebrow="Tasks" title="See where your team stands." />
      <AppWin x={W.x} y={W.y} s={W.s} o={m.o} ty={m.ty} rotX={m.rotX}><TasksPage u={u} scroll={scroll} tip={tip} /></AppWin>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - m.out }}>
        <Callout u={u} s0={1.05} s1={2.8} x={1500} y={420} side="right" w={290}>{(p) => (<>
          <CLbl>Top performer</CLbl>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ transform: `scale(${0.8 + 0.2 * p})` }}><Avatar name="Emile Berlinier" s={52} /></div>
            <div><div style={{ fontSize: 18, fontWeight: 600 }}>Emile Berlinier</div><div style={{ fontSize: 14, color: "#A9B4E6", marginTop: 2 }}><b style={{ color: "#7EA2FF", fontSize: 22, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{Math.round(12 * p)}</b> tasks closed</div></div>
          </div>
        </>)}</Callout>
        <Callout u={u} s0={3.55} s1={len - 0.35} x={110} y={600} side="left">{(p) => (<>
          <CLbl>Follow-Up epic</CLbl>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="84" height="84" viewBox="0 0 84 84"><circle cx="42" cy="42" r="34" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="8" /><circle cx="42" cy="42" r="34" fill="none" stroke="#2FC877" strokeWidth="8" strokeLinecap="round" pathLength="100" strokeDasharray={`${83 * p} 100`} transform="rotate(-90 42 42)" /></svg>
            <div><div style={{ fontSize: 38, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{Math.round(25 * p)}<span style={{ fontSize: 18, color: "#A9B4E6" }}>/30</span></div><div style={{ fontSize: 13, color: "#A9B4E6" }}>tasks done</div></div>
          </div>
        </>)}</Callout>
        <Cursor {...cur} o={inOut(u, 1.05, 4.6, 0.3, 0.35)} press={pressedAt(u, clicks)} size={1.15} />
      </div>
    </>
  );
}

// =====================================================================
// 4 — PLANS: Create Plan stepper + Billing (rebuilt), producing the plan card
// =====================================================================
const Field = ({ w, children, active }) => <div style={{ width: w, height: 42, boxSizing: "border-box", border: `1px solid ${active ? C.primary : C.line}`, boxShadow: active ? `0 0 0 3px ${C.pSoft}` : "none", borderRadius: 8, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", fontSize: 14, color: C.t1, background: "#fff" }}>{children}</div>;
const Sel = ({ w, children }) => <div style={{ width: w, height: 42, boxSizing: "border-box", borderRadius: 8, background: C.page, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px 0 12px", fontSize: 13, color: C.t2 }}>{children}{IC.chev(C.sub, 14)}</div>;
const Lab = ({ children, style }) => <div style={{ fontSize: 13, fontWeight: 500, color: C.t2, marginBottom: 8, ...style }}>{children}</div>;
const typed = (s, p) => s.slice(0, Math.round(s.length * p));
function Stepper({ s2, s3 }) {
  const steps = [["Step 1", "Plan Info", "Complete", 1], ["Step 2", "Billing", s2 > 0.5 ? "Complete" : "In progress", s2], ["Step 3", "Add Ons", s3 > 0.5 ? "In progress" : "Pending", 0]];
  return (
    <Card style={{ width: 300, height: 430 }} pad={26}>
      <div style={{ fontSize: 22, fontWeight: 600, color: C.t1, letterSpacing: "-0.01em" }}>Create Plan</div>
      <div style={{ fontSize: 13, color: C.sub, marginTop: 4 }}>Follow these steps to create a plan</div>
      <div style={{ marginTop: 30, position: "relative" }}>
        <div style={{ position: "absolute", left: 13, top: 30, width: 2, height: 176, background: C.line }} />
        <div style={{ position: "absolute", left: 13, top: 30, width: 2, height: 88 + 88 * s2, background: C.green }} />
        {steps.map(([k, n, st, done], i) => {
          const active = (i === 1 && s2 < 0.5) || (i === 2 && s3 > 0.5);
          return (
            <div key={i} style={{ display: "flex", gap: 16, height: 88, position: "relative" }}>
              <div style={{ width: 28, height: 28, borderRadius: 14, flex: "none", display: "grid", placeItems: "center", background: done > 0.5 ? C.green : "#fff", border: `2px solid ${done > 0.5 ? C.green : active ? C.primary : C.line}`, boxSizing: "border-box", boxShadow: active ? `0 0 0 4px ${C.pSoft}` : "none" }}>
                {done > 0.5 ? IC.check("#fff", 14) : active ? <span style={{ width: 10, height: 10, borderRadius: 5, background: C.primary }} /> : <span style={{ fontSize: 12, color: C.sub, fontWeight: 600 }}>{i + 1}</span>}
              </div>
              <div><div style={{ fontSize: 12, color: C.faint }}>{k}</div><div style={{ fontSize: 16, fontWeight: 600, color: C.t1, marginTop: 1 }}>{n}</div><div style={{ fontSize: 12, marginTop: 2, fontWeight: 500, color: st === "Complete" ? C.green : st === "In progress" ? C.primary : C.faint }}>{st}</div></div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
function Billing({ u, press }) {
  const dur = prog(u, 0.8, 1.0), amt = prog(u, 1.05, 1.5), tog = prog(u, 1.5, 1.75), tax = prog(u, 1.8, 2.05), sub = prog(u, 2.0, 2.7);
  const rows = [["Subscription Amount", 1000 * clamp(sub * 1.4)], ["Joining Fee", 0], ["Discount", 0], ["Tax", 100 * clamp(sub * 1.4 - 0.2)]];
  return (
    <Card style={{ width: 560 }} pad={0}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, height: 60, padding: "0 26px", borderBottom: `1px solid ${C.line}` }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: C.vSoft, display: "grid", placeItems: "center" }}>{IC.clip(C.violet)}</div>
        <span style={{ fontSize: 17, fontWeight: 600, color: C.t1 }}>Billing Info</span>
      </div>
      <div style={{ padding: "20px 26px" }}>
        <div style={{ display: "flex", gap: 20 }}>
          <div><Lab>Duration</Lab><div style={{ display: "flex", gap: 8 }}><Field w={90} active={u > 0.75 && u < 1.05}>{typed("1", dur)}</Field><Sel w={120}>Month(s)</Sel></div></div>
          <div><Lab>Subscription Amount</Lab><div style={{ display: "flex", gap: 8 }}><Sel w={96}>INR (₹)</Sel><Field w={150} active={u > 1.0 && u < 1.55}><span style={{ color: C.sub }}>₹</span>{typed("1,000.00", amt)}</Field></div></div>
        </div>
        <div style={{ height: 1, background: C.line2, margin: "20px 0" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div><div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>Taxes applicable</div><div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>Add on top of subscription</div></div>
          <Toggle on={tog} />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, opacity: 0.4 + 0.6 * tog }}><Sel w={70}>%</Sel><Field w={120} active={u > 1.75 && u < 2.1}>{typed("10.00", tax)}</Field></div>
        <div style={{ marginTop: 20, borderRadius: 12, background: C.page, padding: "16px 20px" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.t1, marginBottom: 10 }}>Sub Total</div>
          {rows.map(([k, v]) => <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.sub, height: 24 }}><span>{k}</span><span style={{ color: C.t2, fontVariantNumeric: "tabular-nums" }}>₹{fmtN(v, 2)}</span></div>)}
          <div style={{ height: 1, background: C.line, margin: "8px 0 10px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{IC.coin(18)}<span style={{ fontSize: 15, fontWeight: 600, color: C.t1, flex: 1 }}>Total Amount</span><span style={{ fontSize: 18, fontWeight: 600, color: C.primary, fontVariantNumeric: "tabular-nums" }}>₹{fmtN(1100 * sub, 2)}</span></div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}><Btn pressed={press}>Next{IC.chevR("#fff", 16)}</Btn></div>
      </div>
    </Card>
  );
}
function PlanCard() {
  const Row = ({ k, v, big }) => <div style={{ display: "flex", justifyContent: "space-between", fontSize: big ? 14 : 13, color: C.sub, height: big ? 26 : 22 }}><span>{k}</span><span style={{ color: big ? C.t1 : C.t2, fontWeight: big ? 600 : 400 }}>{v}</span></div>;
  return (
    <Card style={{ width: 290 }} pad={0}>
      <div style={{ padding: "20px 22px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Chip fg="#fff" bg={C.violet}>Body Building</Chip>{IC.dots()}</div>
        <div style={{ fontSize: 20, fontWeight: 600, color: C.t1, marginTop: 14 }}>Plan A</div>
        <div style={{ marginTop: 12 }}><Row big k="Duration" v="1 month" /><Row big k="Subscription" v="₹1,000" /></div>
        <div style={{ height: 1, background: C.line2, margin: "10px 0" }} />
        <Row k="Taxes" v="₹100" /><Row k="Extended days" v="1 month" /><Row k="Pause days" v="2 weeks" />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 22px", borderTop: `1px solid ${C.line2}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ display: "flex" }}><Avatar name="Robert Fox" s={26} /><div style={{ marginLeft: -8 }}><Avatar name="Neha Singh" s={26} /></div></div><div><div style={{ fontSize: 11, color: C.faint }}>Active users</div><div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>50</div></div></div>
        <Btn h={30} kind="soft">View plan{IC.chevR(C.primary, 13)}</Btn>
      </div>
    </Card>
  );
}
function Plans({ t }) {
  const [a, b] = S.plans; if (t < a - 0.1 || t > b + 0.1) return null;
  const u = t - a, len = b - a, out = prog(u, len - 0.45, len);
  const G = 1.1, inn = prog(u, 0.1, 0.75);
  const s2 = prog(u, 2.85, 3.1), s3 = prog(u, 3.0, 3.25), card = prog(u, 3.05, 3.7);
  // native group 1180×580, placed centred at (960,668)
  const nx = (x) => 960 + (x - 590) * G, ny = (y) => 668 + (y - 290) * G;
  const clicks = [[2.75, { x: nx(330 + 560 - 26 - 40), y: ny(541) }]];
  const cur = kf(u, clickPath([1.9, { x: nx(700), y: ny(420) }], clicks, 0.6));
  return (
    <>
      <Headline t={t} a={a + 0.2} b={b - 0.15} eyebrow="Plans" title="Create a plan in three steps." />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-30 * out}px)` }}>
        <Place x={960} y={668} s={G} o={inn} ty={50 * (1 - inn)}>
          <div style={{ position: "relative", width: 1180, height: 580, fontFamily: FONT }}>
            <div style={{ position: "absolute", left: 0 + 150 * (1 - card), top: 0, boxShadow: "0 40px 80px -36px rgba(22,38,110,.35)", borderRadius: 14 }}><Stepper s2={s2} s3={s3} /></div>
            <div style={{ position: "absolute", left: 330 + 150 * (1 - card), top: 0, boxShadow: "0 40px 80px -36px rgba(22,38,110,.35)", borderRadius: 14 }}><Billing u={u} press={pressedAt(u, clicks)} /></div>
            <div style={{ position: "absolute", left: 920, top: 70, opacity: card, transform: `translateX(${60 * (1 - card)}px) translateY(${20 * (1 - card)}px)`, boxShadow: "0 40px 80px -36px rgba(22,38,110,.35)", borderRadius: 14 }}><PlanCard /></div>
          </div>
        </Place>
        <Cursor {...cur} o={inOut(u, 1.85, 3.3, 0.3, 0.3)} press={pressedAt(u, clicks)} size={1.15} />
      </div>
    </>
  );
}

// =====================================================================
// 5 — COMMUNICATION: Email campaigns (rebuilt) — campaigns switched on, live stats
// =====================================================================
const CAMP = [["Lead Onboarding", C.violet, IC.up, 773, 40, 309, 9.1, 70, 3.6, 28], ["Demo / Trial Schedule / Offer", "#11A8E0", IC.cal2, 800, 35, 280, 20, 160, 5, 40], ["Feedback / Survey", C.pink, IC.chat, 683, 56, 382, 32, 218, 5, 14]];
const EK = [["Sent", 1000, "", C.primary, IC.send], ["Open", 35, "%", C.pink, IC.open], ["CTR", 25, "%", C.teal, IC.tap], ["Unsubscribed", 2, "%", C.red, IC.unsub], ["Engaged", 25, "%", C.yellow, IC.spark]];
function CampRow({ r, on, p, show }) {
  const [n, c, ic, sent, op, opN, cl, clN, un, unN] = r;
  const Stat = ({ v, d, lab, sub }) => <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 20px", borderLeft: `1px solid ${C.line}` }}><span style={{ fontSize: 20, fontWeight: 600, color: p > 0.01 ? C.t1 : C.faint, minWidth: 58, fontVariantNumeric: "tabular-nums" }}>{p > 0.01 ? `${fmtN(v * p, d)}%` : "—"}</span><div><div style={{ fontSize: 12, color: C.t2 }}>{lab}</div><div style={{ fontSize: 11, color: C.faint, fontVariantNumeric: "tabular-nums" }}>{p > 0.01 ? Math.round(sub * p) : "—"}</div></div></div>;
  return (
    <div style={{ display: "flex", alignItems: "center", height: 78, padding: "0 22px", background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, opacity: show, transform: `translateY(${24 * (1 - show)}px)` }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: c, display: "grid", placeItems: "center", flex: "none" }}>{ic("#fff")}</div>
      <div style={{ width: 290, fontSize: 16, fontWeight: 600, color: C.t1, paddingLeft: 16 }}>{n}</div>
      <Toggle on={on} />
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, paddingRight: 20, width: 104, justifyContent: "flex-end" }}><span style={{ fontSize: 20, fontWeight: 600, color: p > 0.01 ? C.t1 : C.faint, fontVariantNumeric: "tabular-nums" }}>{p > 0.01 ? Math.round(sent * p) : "—"}</span><span style={{ fontSize: 12, color: C.sub }}>Sent</span></div>
      <Stat v={op} d={0} lab="Opened" sub={opN} /><Stat v={cl} d={cl % 1 ? 1 : 0} lab="Clicked" sub={clN} /><Stat v={un} d={un % 1 ? 1 : 0} lab="Unsubscribed" sub={unN} />
    </div>
  );
}
function Comms({ t }) {
  const [a, b] = S.comms; if (t < a - 0.1 || t > b + 0.1) return null;
  const u = t - a, len = b - a, out = prog(u, len - 0.45, len);
  const G = 1.0, inn = prog(u, 0.1, 0.75), kp = prog(u, 0.35, 1.25);
  const TOG = [1.55, 2.05, 2.55];
  // native panel 1200×560 centred at (960,668); toggle centre at x = 22+38+16+290+20 = 386
  const px = (x) => 960 + (x - 600) * G, py = (y) => 668 + (y - 280) * G;
  const rowY = (i) => 276 + i * 92;
  const clicks = TOG.map((ct, i) => [ct, { x: px(415), y: py(rowY(i)) }]);
  const cur = kf(u, clickPath([1.0, { x: px(560), y: py(520) }], clicks, 0.4));
  return (
    <>
      <Headline t={t} a={a + 0.2} b={b - 0.15} eyebrow="Communication" title="Every campaign, tracked live." />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-30 * out}px)` }}>
        <Place x={960} y={668} s={G} o={inn} ty={50 * (1 - inn)}>
          <div style={{ width: 1200, height: 560, boxSizing: "border-box", padding: 28, borderRadius: 20, background: C.page, fontFamily: FONT, boxShadow: "0 50px 100px -40px rgba(22,38,110,.32), 0 0 0 1px rgba(15,18,34,.07)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 40 }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: C.t1, letterSpacing: "-0.02em" }}>Email Campaigns</div>
              <div style={{ display: "flex", gap: 10 }}><Sel w={130}>All</Sel><Sel w={160}><span style={{ display: "flex", alignItems: "center", gap: 8 }}>{IC.cal(C.sub)}Last 7 days</span></Sel><Btn h={42}>{IC.plus()}Add Email</Btn></div>
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 20 }}>
              {EK.map(([n, v, sfx, c, ic], i) => (
                <Card key={n} style={{ flex: 1, height: 86, display: "flex", alignItems: "center", gap: 14, opacity: clamp(inn * 5 - i * 0.6) }} pad={18}>
                  <div style={{ width: 44, height: 44, borderRadius: 22, background: c, display: "grid", placeItems: "center", flex: "none" }}>{ic("#fff")}</div>
                  <div><div style={{ fontSize: 13, color: C.sub }}>{n}</div><div style={{ fontSize: 22, fontWeight: 600, color: C.t1, fontVariantNumeric: "tabular-nums" }}>{fmtN(Math.round(v * kp))}{sfx}</div></div>
                </Card>
              ))}
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, color: C.t1, margin: "24px 0 12px" }}>Leads</div>
            <div style={{ display: "grid", gap: 14 }}>
              {CAMP.map((r, i) => <CampRow key={r[0]} r={r} show={prog(u, 0.6 + i * 0.15, 1.2 + i * 0.15)} on={prog(u, TOG[i] + 0.02, TOG[i] + 0.22)} p={prog(u, TOG[i] + 0.1, TOG[i] + 0.8)} />)}
            </div>
          </div>
        </Place>
        <Cursor {...cur} o={inOut(u, 0.95, 3.25, 0.3, 0.3)} press={pressedAt(u, clicks)} size={1.1} />
      </div>
    </>
  );
}

// ---------- backdrop: product theme — PulseFit off-white with low-opacity brand blue (+ a hint of the logo yellow) ----------
const BL = (a) => `rgba(31,79,244,${a})`;
function Backdrop({ t }) {
  const fade = "radial-gradient(ellipse 62% 58% at 50% 42%, #000 0%, rgba(0,0,0,.5) 45%, transparent 78%)";
  const d = Math.sin(t * 0.25) * 60, d2 = Math.cos(t * 0.2) * 80;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#F5F6FA", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 960 - 1100 + d, top: -760, width: 2200, height: 1500, borderRadius: "50%", background: `radial-gradient(closest-side, ${BL(0.16)}, ${BL(0.05)} 55%, rgba(31,79,244,0))` }} />
      <div style={{ position: "absolute", left: 960 - 1000 - d, top: 820, width: 2000, height: 620, borderRadius: "50%", background: `radial-gradient(closest-side, ${BL(0.12)}, rgba(31,79,244,0))` }} />
      <div style={{ position: "absolute", left: 1300 + d2, top: 420, width: 900, height: 700, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,184,0,.10), rgba(255,184,0,0))" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${BL(0.08)} 1px, transparent 1px), linear-gradient(90deg, ${BL(0.08)} 1px, transparent 1px)`, backgroundSize: "80px 80px", backgroundPosition: `0 ${20 + (t * 12) % 80}px`, WebkitMaskImage: fade, maskImage: fade }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 85% at 50% 45%, rgba(245,246,250,0) 60%, rgba(245,246,250,.85) 100%)" }} />
    </div>
  );
}

function Stage({ t }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", fontFamily: FONT, WebkitFontSmoothing: "antialiased" }}>
      <Backdrop t={t} />
      <Opening t={t} />
      <Leads t={t} />
      <Members t={t} />
      <Tasks t={t} />
      <Plans t={t} />
      <Comms t={t} />
      <Closing t={t} />
    </div>
  );
}

// ---------- player ----------
const fmt = (s) => s.toFixed(1).padStart(4, "0");
const MARKS = [S.leads[0], S.members[0], S.tasks[0], S.plans[0], S.comms[0], S.close[0]];
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
