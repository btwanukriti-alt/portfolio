/**
 * Bounce: the animator's first exercise. A ball jumps along a timeline track,
 * its nine onion-skin frames drawn as dim rings, bunched at both ends where
 * the ease slows it. Each frame is ticked on the track. The pointer's place
 * along the track is the time; the ball follows it on a spring, through the
 * ease, so it lags and catches up the way the curve says. Frames already
 * played are drawn, frames still to come are dashed. At rest it hangs
 * just past the top of its jump. The slider is the ease's power.
 *
 * The pattern: scrub. One spring on the time, and a hit test on the ground
 * plane, which never moves.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rrect, unproj, seg, open, spring, stepS,
  mk, solid, put, flatDot, place, pointer, register, disposer,
} = HL;

const L = 150, H = 80, R = 9, F = 8, FRAMES = 24, REST_T = 0.6;

/** In-out ease of power p: 1 is linear, higher bunches the frames at both ends. */
const ease = (t, p) => (t < 0.5 ? 0.5 * (2 * t) ** p : 1 - 0.5 * (2 * (1 - t)) ** p);
/** Where the ball is at time t: along the track by the ease, up by the jump's arc. */
const pos = (t, p) => { const s = ease(t, p); return [s * L, R + H * 4 * s * (1 - s)]; };
/** The track runs across the screen: u along it, v toward the viewer, turned into the world's x and y. */
const CS = Math.SQRT1_2, w = (u, v) => [(u + v) * CS, (v - u) * CS];
const turn = (ring) => ring.map((q) => ({ ...q, u: w(q.u, q.v)[0], v: w(q.u, q.v)[1], nu: w(q.nu, q.nv)[0], nv: w(q.nu, q.nv)[1] }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let pw = value;

  const C = Cam(45, 0.5, 1.72);
  fit(C, [[...w(-16, -16), -5], [...w(L + 16, 16), -5], [...w(L + 16, -16), -5], [...w(-16, 16), -5], [...w(L / 2, 0), H + 2 * R]], 200, 166);
  const P = proj(C), front = facing(C), RS = R * C.S;

  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, turn(rrect(-16, -16, L + 16, 16, 10, 4)), turn(rrect(-14, -14, L + 14, 14, 8, 4)), -5, 0));
  // the timeline's ruler along the track, under the frames
  mk("path", { d: seg(P(...w(0, 9), 0), P(...w(L, 9), 0)), class: "nf lo" }, g);
  const ticks = [], ghosts = [];
  for (let k = 0; k <= F; k++) ticks.push(flatDot(g, C, 1.1, "dot off"));
  for (let k = 0; k <= F; k++) ghosts.push(mk("ellipse", { rx: RS, ry: RS, class: "lo" }, g));
  // the ball's shadow, its drop to the track, its tick, and the ball: one thing, painted last
  const shadow = flatDot(g, C, R * 0.8, "nf lo"), drop = mk("path", { class: "nf dash" }, g);
  const mark = flatDot(g, C, 1.5, "dot");
  const ball = mk("ellipse", { rx: RS, ry: RS, class: "hi" }, g), shine = mk("path", { class: "nf lo" }, g);

  function frames() {
    for (let k = 0; k <= F; k++) {
      const [x, z] = pos(k / F, pw);
      place(ticks[k], P(...w(x, 9), 0));
      place(ghosts[k], P(...w(x, 0), z));
    }
  }
  frames();

  const sp = spring(REST_T, { eps: 0.0005 });
  let drawn = NaN;
  function draw(t) {
    const key = t + pw;
    if (key === drawn) return;
    drawn = key;
    const [x, z] = pos(t, pw), c = P(...w(x, 0), z), lift = (z - R) / H;
    place(shadow, P(...w(x, 0), 0));
    shadow.setAttribute("rx", String(RS * (0.95 - 0.35 * lift)));
    shadow.setAttribute("ry", String(RS * (0.95 - 0.35 * lift) * C.k));
    drop.setAttribute("d", lift > 0.04 ? seg(P(...w(x, 0), 0), P(...w(x, 0), z - R)) : "");
    place(mark, P(...w(x, 9), 0));
    place(ball, c);
    // frames already played stay drawn; the ones still to come are dashed, as an onion skin shows them
    ghosts.forEach((el, k) => { const cls = k / F <= t + 1e-6 ? "lo" : "dash"; if (el.getAttribute("class") !== cls) el.setAttribute("class", cls); });
    // a crease of light inside the ball's upper left: dim inside, bright outside
    const arc = [];
    for (let a = 200; a <= 280; a += 10) arc.push([c[0] + RS * 0.66 * Math.cos((a * Math.PI) / 180), c[1] + RS * 0.66 * Math.sin((a * Math.PI) / 180)]);
    shine.setAttribute("d", open(arc));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  function scrub(t) {
    sp.t = t ?? REST_T;
    read.textContent = t == null ? "rest" : `f ${String(Math.round(t * FRAMES)).padStart(2, "0")}`;
    B.wake();
  }
  scrub(null);

  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0), u = (x - y) * CS; scrub(u < -40 || u > L + 40 ? null : clamp(u / L, 0, 1)); },
    leave: () => scrub(null),
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { pw = v; frames(); drawn = NaN; draw(sp.x); B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "bounce",
  means: "A ball's jump in onion skins: the pointer scrubs time along the track, and the ball follows through the ease.",
  rules: [1, 3, 5, 8],
  range: [1, 2.4, 4],
  mount,
});
