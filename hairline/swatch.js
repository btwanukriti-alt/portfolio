/**
 * Swatch: a fan deck of seven colour strips on one rivet, half open. Each strip
 * is divided into chips, and carries one punched dot at its tip. The strip
 * under the pointer keeps its place and takes the bright edge; the fan parts
 * around it, the strips on either side swinging away in turn. At rest the top
 * strip is bright. The slider is the parting, in degrees.
 *
 * The pattern: one of many, on a pivot. Tweens on each strip's angle, a
 * stagger by distance, and a hit test on the resting angles, read on the
 * ground plane, so a strip swinging away cannot change the choice.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rrect, ringAt, rings, poly, seg, unproj, rad,
  tween, tset, tval, tdone, mk, solid, put, flatDot, place, pointer, register, disposer,
} = HL;

const N = 7, LEN = 112, WID = 22, BACK = -11, T = 1.8, B = 1.1, STEP = 45;
const REST = [-4, 8, 19, 29, 41, 50, 66];
const CHIPS = [34, 53, 72, 91];

/** A ring of samples turned th degrees round the rivet. */
function turn(ring, th) {
  const c = Math.cos(rad(th)), s = Math.sin(rad(th));
  return ring.map((q) => ({ ...q, u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
}
const at = (u, v, th) => [u * Math.cos(rad(th)) - v * Math.sin(rad(th)), u * Math.sin(rad(th)) + v * Math.cos(rad(th))];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gap = value;

  // Fitted to the fan opened as wide as the slider goes.
  const C = Cam(45, 0.5, 2.12);
  const pts = [];
  for (let th = REST[0] - 18; th <= REST[N - 1] + 18; th += 6) for (const [u, v] of [[LEN, -WID / 2], [LEN, WID / 2], [BACK, -WID / 2], [BACK, WID / 2]]) pts.push([...at(u, v, th), 0], [...at(u, v, th), N * T]);
  fit(C, pts, 200, 166);
  const P = proj(C), front = facing(C);

  const outer = rrect(BACK, -WID / 2, LEN, WID / 2, 8, 6), inner = rrect(BACK + B, -WID / 2 + B, LEN - B, WID / 2 - B, 8 - B, 6);
  const g = mk("g", {}, svg);
  // Bottom strip first: the deck is a stack, so its order up the rivet is the paint order.
  const strips = REST.map((th, i) => {
    const grp = mk("g", {}, g), el = solid(grp);
    const chips = mk("path", { class: "nf lo" }, grp);
    const dot = flatDot(grp, C, 1.3, "dot off");
    return { i, th, el, chips, dot, a: tween(th), drawn: NaN };
  });
  const [rr, ri] = rings(-4.5, -4.5, 4.5, 4.5, 4.5, 1.2), rivet = solid(g);
  put(rivet, prism(P, front, rr, ri, N * T, N * T + 2.2));

  function draw(st, th) {
    if (th === st.drawn) return;
    st.drawn = th;
    const z0 = st.i * T, z1 = z0 + T;
    put(st.el, prism(P, front, turn(outer, th), turn(inner, th), z0, z1));
    st.chips.setAttribute("d", CHIPS.map((u) => seg(P(...at(u, -WID / 2 + B, th), z1), P(...at(u, WID / 2 - B, th), z1))).join("")
      + poly(ringAt(P, turn(rrect(BACK + 3.5, -3, BACK + 9.5, 3, 3, 4), th), z1)));
    place(st.dot, P(...at(LEN - 9, 0, th), z1));
  }

  const L = register(stage, (_dt, now) => {
    let moving = false;
    for (const st of strips) { draw(st, tval(st.a, now)); if (!tdone(st.a, now)) moving = true; }
    return moving;
  });
  bag.add(L.unregister);

  /** The strip whose RESTING angle is nearest the pointer's, read round the rivet on the ground; -1 off the fan. */
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, (N * T) / 2), r = Math.hypot(x, y), th = (Math.atan2(y, x) * 180) / Math.PI;
    if (r < 14 || r > LEN + 6) return -1;
    let best = -1, bd = 9;
    REST.forEach((a, i) => { if (Math.abs(th - a) < bd) { bd = Math.abs(th - a); best = i; } });
    return best;
  }

  let act = null;
  /** Parts the fan round strip a (-1 closes it to rest), spreading out from it, or from the one let go. */
  function choose(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = a >= 0 ? a : act ?? N - 1;
    act = a;
    const lit = a < 0 ? N - 1 : a;
    strips.forEach((st, i) => {
      const to = a < 0 ? st.th : st.th + Math.sign(i - a) * gap;
      tset(st.a, to, now, Math.abs(i - from) * STEP);
      st.el.sil.classList.toggle("hi", i === lit);
      st.dot.setAttribute("class", i === lit ? "dot" : "dot off");
    });
    read.textContent = a < 0 ? "rest" : `strip ${a + 1}`;
    L.wake();
  }
  choose(-1);

  bag.add(pointer(stage, { move: (p) => choose(hit(p)), leave: () => choose(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { gap = clamp(v, 0, 18); if (act >= 0) choose(act, true); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "swatch",
  means: "A swatch fan on its rivet: the strip under the pointer holds, and the fan parts around it.",
  rules: [1, 2, 5, 10],
  range: [6, 11, 18],
  mount,
});
