// Zync — feature showcase (30s, 16:9). Stage renders at 1920x1080 and scales to fit.
// Everything is driven by one clock `t` (seconds), so play / pause / scrub are exact
// and the piece screen-records identically every time.
const { useState, useEffect, useRef, useLayoutEffect } = React;

// Project theme (sampled from the Zync Figma file)
const C = {
  primary: "#644ACD",   // buttons, active tabs
  accent: "#F5577D",    // calories ring
  bg: "#F6F5FA",        // app background
  ink: "#12101C",
  muted: "#6E6A82",
};
const FONT = "'Poppins', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";
const DURATION = 30;
const IMG = window.ZYNC_SCREENS; // { home, track, food, water, sleep, workouts, detail, plan, gym }

// ---------- timing helpers ----------
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2); // ease-in-out cubic, no overshoot
const prog = (t, a, b) => ease(clamp((t - a) / (b - a)));
const lerp = (a, b, u) => {
  if (typeof a === "number") return a + (b - a) * u;
  const o = {};
  for (const k in a) o[k] = a[k] + (b[k] - a[k]) * u;
  return o;
};
// keyframes: [[time, value], ...] eased between neighbours
const kf = (t, keys) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i], [t1, v1] = keys[i + 1];
    if (t <= t1) return lerp(v0, v1, ease((t - t0) / (t1 - t0)));
  }
  return keys[keys.length - 1][1];
};

// ---------- device ----------
// Screen 390x870 (native Figma width), 12px bezel → frame 414x894.
function Phone({ x, y, s = 0.84, z = 1, zp = 0, f = { x: 195, y: 435 }, rotY = -8, rotX = 3,
  o = 1, ty = 0, layers, hl, tap }) {
  if (o <= 0.001) return null;
  const k = s * z;
  const dx = f.x + 12 - 207, dy = f.y + 12 - 447;
  const Tx = -k * dx * zp, Ty = -k * dy * zp; // pull the focus point to the device centre as we zoom
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, perspective: 2600, opacity: o }}>
      <div style={{
        position: "absolute", left: -207, top: -447, width: 414, height: 894,
        transform: `translate3d(${Tx}px, ${Ty + ty}px, 0) scale(${k}) rotateY(${rotY}deg) rotateX(${rotX}deg)`,
        borderRadius: 60, background: "#15131D", padding: 12, boxSizing: "border-box",
        boxShadow: "0 70px 120px -40px rgba(52,30,140,.38), 0 24px 48px -24px rgba(18,16,28,.35), inset 0 0 0 1.5px rgba(255,255,255,.10)",
      }}>
        <div style={{ position: "relative", width: 390, height: 870, borderRadius: 48, overflow: "hidden", background: C.bg }}>
          {layers.map((L, i) => L.o > 0.001 && (
            <img key={i} src={L.src} alt="" draggable={false} style={{
              position: "absolute", left: 0, top: 0, width: 390, opacity: L.o,
              transform: `translateY(${-(L.y || 0)}px) scale(${L.sc || 1})`, transformOrigin: "50% 30%",
            }} />
          ))}
          {hl && hl.o > 0.001 && (
            <div style={{
              position: "absolute", left: hl.x, top: hl.y, width: hl.w, height: hl.h, borderRadius: hl.r ?? 16,
              opacity: hl.o, border: `2.5px solid ${C.primary}`,
              boxShadow: `0 0 0 6px rgba(100,74,205,.16)${hl.dim === false ? "" : `, 0 0 0 2400px rgba(22,16,52,${0.2 * hl.o})`}`,
            }} />
          )}
          {tap && tap.p > 0 && tap.p < 1 && (
            <div style={{
              position: "absolute", left: tap.x - 28, top: tap.y - 28, width: 56, height: 56, borderRadius: 999,
              background: "rgba(100,74,205,.22)", border: "2px solid rgba(100,74,205,.55)",
              transform: `scale(${0.45 + 0.85 * ease(tap.p)})`,
              opacity: tap.p < 0.25 ? tap.p / 0.25 : 1 - (tap.p - 0.25) / 0.75,
            }} />
          )}
          <div style={{ position: "absolute", left: 128, bottom: 8, width: 134, height: 5, borderRadius: 3, background: "rgba(18,16,28,.55)" }} />
        </div>
      </div>
    </div>
  );
}

function Headline({ t, a, b, eyebrow, title }) {
  if (t < a - 0.05 || t > b + 0.05) return null;
  const e = prog(t, a, a + 0.55), h = prog(t, a + 0.12, a + 0.8), out = prog(t, b - 0.5, b);
  return (
    <div style={{ position: "absolute", left: 180, top: 540, transform: "translateY(-50%)", opacity: 1 - out }}>
      <div style={{
        fontSize: 22, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: C.primary,
        opacity: e, transform: `translateY(${(1 - e) * 18 - out * 10}px)`, marginBottom: 22,
      }}>{eyebrow}</div>
      <div style={{
        fontSize: 78, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.035em", color: C.ink, whiteSpace: "pre-line",
        opacity: h, transform: `translateY(${(1 - h) * 28 - out * 14}px)`,
      }}>{title}</div>
    </div>
  );
}

const PX = 1250, PY = 560; // device anchor shared by every feature scene

// ---------- scenes ----------
function Opening({ t }) {
  if (t > 3.3) return null;
  const a = prog(t, 0.25, 1.1), b = prog(t, 0.85, 1.55), out = prog(t, 2.6, 3.2);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 1 - out, transform: `translateY(${-22 * out}px)` }}>
      <div style={{ fontSize: 176, fontWeight: 700, color: C.ink, lineHeight: 1, letterSpacing: `${-0.05 + 0.04 * (1 - a)}em`, opacity: a, transform: `translateY(${(1 - a) * 30}px)` }}>Zync</div>
      <div style={{ fontSize: 34, color: C.muted, marginTop: 28, opacity: b, transform: `translateY(${(1 - b) * 16}px)` }}>Train, track and book in one app.</div>
    </div>
  );
}

function Dashboard({ t }) {
  if (t < 3.1 || t > 9.7) return null;
  const inn = prog(t, 3.2, 3.95), out = prog(t, 9.1, 9.6);
  const zp = kf(t, [[4.4, 0], [5.1, 1], [8.2, 1], [8.9, 0]]);
  const Z = kf(t, [[6.3, 1.55], [6.95, 1.32]]);
  const f = kf(t, [[6.3, { x: 193, y: 246 }], [6.95, { x: 193, y: 505 }]]);
  const r = kf(t, [
    [5.6, { x: 21, y: 186, w: 345, h: 120, r: 22 }],   // Daily Fitness Attendance
    [6.0, { x: 274, y: 242, w: 76, h: 36, r: 12 }],    // Done
    [6.35, { x: 274, y: 242, w: 76, h: 36, r: 12 }],
    [6.95, { x: 19, y: 321, w: 347, h: 367, r: 26 }],  // Calories + Macro
  ]);
  const ho = kf(t, [[4.9, 0], [5.3, 1], [8.1, 1], [8.5, 0]]);
  return (
    <>
      <Headline t={t} a={3.45} b={9.5} eyebrow="Home" title={"Your day,\nat a glance."} />
      <Phone x={PX} y={PY} o={inn * (1 - out)} ty={90 * (1 - inn) - 40 * out}
        rotY={(-14 + 6 * inn) * (1 - zp)} rotX={3 * (1 - zp)} z={1 + (Z - 1) * zp} zp={zp} f={f}
        layers={[{ src: IMG.home, o: 1 }]} hl={{ ...r, o: ho }} tap={{ x: 312, y: 260, p: clamp((t - 6.05) / 0.55) }} />
    </>
  );
}

function Journal({ t }) {
  if (t < 9.5 || t > 16.5) return null;
  const inn = prog(t, 9.6, 10.35), gone = prog(t, 12.3, 12.9), out = prog(t, 15.95, 16.4);
  const zp = kf(t, [[10.5, 0], [11.1, 1], [11.9, 1], [12.4, 0]]);
  const ho = kf(t, [[10.7, 0], [11.05, 1], [11.85, 1], [12.2, 0]]);
  const trio = [
    ["food", 1010, { x: 66, y: 106, w: 258, h: 204, r: 28 }],
    ["water", 1290, { x: 70, y: 114, w: 250, h: 250, r: 125 }],
    ["sleep", 1570, { x: 84, y: 120, w: 219, h: 219, r: 110 }],
  ];
  return (
    <>
      <Headline t={t} a={9.85} b={16.3} eyebrow="Journal" title={"Log food, water\nand sleep."} />
      {t < 13 && (
        <Phone x={PX} y={PY} o={inn * (1 - gone)} ty={90 * (1 - inn)} s={0.84 * (1 - 0.08 * gone)}
          rotY={(-14 + 6 * inn) * (1 - zp)} rotX={3 * (1 - zp)} z={1 + 0.28 * zp} zp={zp} f={{ x: 194, y: 567 }}
          layers={[{ src: IMG.track, o: 1 }]} hl={{ x: 21, y: 387, w: 347, h: 360, r: 22, o: ho }}
          tap={{ x: 103, y: 454, p: clamp((t - 11.45) / 0.55) }} />
      )}
      {t > 12.3 && trio.map(([key, x, ring], i) => {
        const a = 12.55 + i * 0.13, e = prog(t, a, a + 0.65);
        const fs = 13.55 + i * 0.8;
        const lift = prog(t, fs, fs + 0.4) - prog(t, fs + 0.8, fs + 1.2);
        return (
          <Phone key={key} x={x} y={PY - 20 * lift} s={0.6 * (1 + 0.05 * lift)} o={e * (1 - out)} ty={70 * (1 - e)}
            rotY={-6 + 6 * lift} rotX={2 * (1 - lift)} layers={[{ src: IMG[key], o: 1 }]}
            hl={{ ...ring, o: lift, dim: false }} />
        );
      })}
    </>
  );
}

function Workouts({ t }) {
  if (t < 16.3 || t > 23.3) return null;
  const inn = prog(t, 16.4, 17.15), out = prog(t, 22.8, 23.2);
  const dI = prog(t, 19.0, 19.6), pI = prog(t, 20.9, 21.5);
  const zp = kf(t, [[17.35, 0], [17.95, 1], [18.5, 1], [19.0, 0], [19.65, 0], [20.2, 1], [20.55, 1], [21.0, 0]]);
  const first = t < 19.3;
  const f = first ? { x: 195, y: 321 } : { x: 195, y: 556 };
  const Z = first ? 1.3 : 1.25;
  const rect = first ? { x: 27, y: 195, w: 336, h: 252, r: 16 }            // Suggested workout
    : t < 20.95 ? { x: 29, y: 387, w: 333, h: 339, r: 18 }                 // Exercise list
    : kf(t, [[21.9, { x: 27, y: 145, w: 336, h: 81, r: 10 }], [22.35, { x: 28, y: 816, w: 333, h: 50, r: 12 }]]); // Day → Save Workout
  const ho = kf(t, [[17.55, 0], [17.9, 1], [18.45, 1], [18.85, 0], [19.8, 0], [20.15, 1], [20.5, 1], [20.85, 0], [21.45, 0], [21.8, 1], [22.7, 1], [22.95, 0]]);
  return (
    <>
      <Headline t={t} a={16.65} b={23.1} eyebrow="Workouts" title={"Train with\na plan."} />
      <Phone x={PX} y={PY} o={inn * (1 - out)} ty={90 * (1 - inn) - 40 * out}
        rotY={(-14 + 6 * inn) * (1 - zp)} rotX={3 * (1 - zp)} z={1 + (Z - 1) * zp} zp={zp} f={f}
        layers={[
          { src: IMG.workouts, o: 1 },
          { src: IMG.detail, o: dI, sc: 1.03 - 0.03 * dI },
          { src: IMG.plan, o: pI, sc: 1.03 - 0.03 * pI },
        ]}
        hl={{ ...rect, o: ho }} tap={{ x: 194, y: 841, p: clamp((t - 22.35) / 0.55) }} />
    </>
  );
}

function Gym({ t }) {
  if (t < 23.1 || t > 27.7) return null;
  const inn = prog(t, 23.2, 23.95), out = prog(t, 27.15, 27.6);
  const zp = kf(t, [[24.0, 0], [24.6, 1], [26.7, 1], [27.2, 0]]);
  const Z = kf(t, [[25.2, 1.5], [25.85, 1.4]]);
  const f = kf(t, [[25.2, { x: 196, y: 264 }], [25.85, { x: 192, y: 478 }]]);
  const r = kf(t, [[25.2, { x: 172, y: 224, w: 51, h: 81, r: 25 }], [25.85, { x: 21, y: 411, w: 343, h: 135, r: 16 }]]);
  const ho = kf(t, [[24.3, 0], [24.65, 1], [26.6, 1], [26.95, 0]]);
  return (
    <>
      <Headline t={t} a={23.45} b={27.5} eyebrow="Gym" title={"Book classes\nat your gym."} />
      <Phone x={PX} y={PY} o={inn * (1 - out)} ty={90 * (1 - inn) - 40 * out}
        rotY={(-14 + 6 * inn) * (1 - zp)} rotX={3 * (1 - zp)} z={1 + (Z - 1) * zp} zp={zp} f={f}
        layers={[{ src: IMG.gym, o: 1 }]} hl={{ ...r, o: ho }} tap={{ x: 197, y: 258, p: clamp((t - 24.75) / 0.55) }} />
    </>
  );
}

function Closing({ t }) {
  if (t < 27.6) return null;
  const a = prog(t, 27.75, 28.55), b = prog(t, 28.25, 28.95);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 150, fontWeight: 700, color: C.ink, lineHeight: 1, letterSpacing: `${-0.05 + 0.03 * (1 - a)}em`, opacity: a, transform: `translateY(${(1 - a) * 26}px)` }}>Zync</div>
      <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: C.primary, marginTop: 30, opacity: b, transform: `translateY(${(1 - b) * 14}px)` }}>Coming soon</div>
    </div>
  );
}

function Backdrop({ t }) {
  const d = Math.sin(t / 5) * 40;
  return (
    <div style={{ position: "absolute", inset: 0, background: C.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 1300 - 800 + d, top: 260 - 800, width: 1600, height: 1600, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(100,74,205,.14), rgba(100,74,205,0))" }} />
      <div style={{ position: "absolute", left: 300 - 700, top: 980 - 700 - d, width: 1400, height: 1400, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(245,87,125,.07), rgba(245,87,125,0))" }} />
    </div>
  );
}

function Stage({ t }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", fontFamily: FONT, WebkitFontSmoothing: "antialiased" }}>
      <Backdrop t={t} />
      <Opening t={t} />
      <Dashboard t={t} />
      <Journal t={t} />
      <Workouts t={t} />
      <Gym t={t} />
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
          <Stage t={t} />
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
            {[3.2, 9.6, 16.4, 23.2, 27.6].map((m) => <span key={m} className="tick" style={{ left: `${(m / DURATION) * 100}%` }} />)}
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
