/**
 * Screen: a phone lying flat, its interface pulled apart like a spec. Five
 * parts float over the glass at uneven heights: a nav bar, a card, two tiles
 * and the button, which is bright at rest because that is where the eye
 * should start. The part under the pointer lifts and takes the bright edge;
 * the others settle, staggered outwards from it. The slider is the lift.
 *
 * The pattern: one of many. Tweens, a stagger by distance, and a hit test on
 * each part's own resting top, since the parts float at different heights.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, rrect, ringAt, poly, seg, extremes, unproj,
  tween, tset, tval, tdone, mk, solid, put, flatDot, place, pointer, register, disposer,
} = HL;

const W = 72, L = 144, SLAB = 5, T = 2.4, STEP = 45;
const PARTS = [
  { name: "nav", box: [8, 15, 64, 25], r: 3, rest: 9 },
  { name: "card", box: [8, 31, 64, 75], r: 4, rest: 5 },
  { name: "tile 1", box: [8, 81, 34, 107], r: 3.5, rest: 3 },
  { name: "tile 2", box: [38, 81, 64, 107], r: 3.5, rest: 6 },
  { name: "button", box: [8, 115, 64, 129], r: 7, rest: 11 },
];
const REST_HI = 4;

/** What each part carries on its top, as lines in the part's own x, y: the things that make it that part. */
function marks(i, [x0, y0, x1, y1]) {
  if (i === 0) return { lines: [[[x1 - 22, (y0 + y1) / 2], [x1 - 5, (y0 + y1) / 2]]], dots: [[x0 + 5, (y0 + y1) / 2], [x0 + 9, (y0 + y1) / 2], [x0 + 13, (y0 + y1) / 2]] };
  if (i === 1) return { rects: [[x0 + 4, y0 + 4, x1 - 4, y1 - 15, 2]], lines: [[[x0 + 4, y1 - 9.5], [x0 + 34, y1 - 9.5]], [[x0 + 4, y1 - 5], [x0 + 22, y1 - 5]]] };
  if (i === 4) return { lines: [[[(x0 + x1) / 2 - 10, (y0 + y1) / 2], [(x0 + x1) / 2 + 10, (y0 + y1) / 2]]] };
  return { rects: [[x0 + 4, y0 + 4, x0 + 11, y0 + 11, 3.5]], lines: [[[x0 + 4, y1 - 6], [x1 - 4, y1 - 6]]] };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;

  // Fitted to the phone with the nav lifted as high as the slider goes, so no pose leaves the frame.
  const C = Cam(45, 0.5, 1.98);
  const top = SLAB + 28 + T;
  fit(C, [[0, 0, 0], [W, L, 0], [W, 0, 0], [0, L, 0], [8, 15, top], [64, 15, top], [8, 25, top]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, L, 11, 1.8);
  put(solid(g), prism(P, front, br, bi, 0, SLAB));
  // the glass, the speaker slot and the home bar
  mk("path", { d: poly(ringAt(P, rrect(4, 11, W - 4, L - 10, 6, 5), SLAB)), class: "nf lo" }, g);
  mk("path", { d: poly(ringAt(P, rrect(W / 2 - 9, 5, W / 2 + 9, 8, 1.5, 4), SLAB)), class: "nf lo" }, g);
  mk("path", { d: seg(P(W / 2 - 12, L - 5, SLAB), P(W / 2 + 12, L - 5, SLAB)), class: "nf lo" }, g);

  // Back to front: the parts never overlap on the glass, so their order down the phone is the paint order.
  const parts = PARTS.map((p, i) => {
    const [x0, y0, x1, y1] = p.box, [ring, inner] = rings(x0, y0, x1, y1, p.r, 0.9);
    const grp = mk("g", {}, g);
    const drops = mk("path", { class: "nf dash" }, grp), el = solid(grp);
    const m = marks(i, p.box);
    const lines = mk("path", { class: "nf lo" }, grp);
    const rects = (m.rects || []).map(() => mk("path", { class: "nf lo" }, grp));
    const dots = (m.dots || []).map(() => flatDot(grp, C, 0.9, "dot off"));
    return { ...p, ring, inner, ends: extremes(P, ring), m, drops, el, lines, rects, dots, z: tween(p.rest), drawn: NaN };
  });

  function draw(pt, z) {
    if (z === pt.drawn) return;
    pt.drawn = z;
    const z0 = SLAB + z, z1 = z0 + T;
    put(pt.el, prism(P, front, pt.ring, pt.inner, z0, z1));
    pt.drops.setAttribute("d", pt.ends.map((q) => seg(P(q.u, q.v, SLAB), P(q.u, q.v, z0))).join(""));
    pt.lines.setAttribute("d", pt.m.lines.map(([a, b]) => seg(P(a[0], a[1], z1), P(b[0], b[1], z1))).join(""));
    (pt.m.rects || []).forEach(([a, b, c, d, r], k) => pt.rects[k].setAttribute("d", poly(ringAt(P, rrect(a, b, c, d, r, 4), z1))));
    (pt.m.dots || []).forEach(([x, y], k) => place(pt.dots[k], P(x, y, z1)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const pt of parts) { draw(pt, tval(pt.z, now)); if (!tdone(pt.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** The part whose RESTING top puts the pointer nearest its middle; -1 when none holds it. */
  function hit([sx, sy]) {
    let best = -1, bd = 1;
    parts.forEach((pt, i) => {
      const [x0, y0, x1, y1] = pt.box, [x, y] = unproj(C, sx, sy, SLAB + pt.rest + T);
      const d = Math.max(Math.abs(x - (x0 + x1) / 2) / ((x1 - x0) / 2 + 3), Math.abs(y - (y0 + y1) / 2) / ((y1 - y0) / 2 + 3));
      if (d <= bd) { bd = d; best = i; }
    });
    return best;
  }

  let act = null;
  /** Lifts part a (-1 lets them all back to rest), spreading out from it, or from the one let go. */
  function choose(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = a >= 0 ? a : act ?? REST_HI;
    act = a;
    parts.forEach((pt, i) => {
      const d = Math.abs(i - from);
      const to = a < 0 ? pt.rest : i === a ? lift : clamp((lift * 0.4) / Math.abs(i - a), 2, lift);
      tset(pt.z, to, now, d * STEP);
      pt.el.sil.classList.toggle("hi", i === (a < 0 ? REST_HI : a));
    });
    read.textContent = a < 0 ? "rest" : parts[a].name;
    B.wake();
  }
  choose(-1);

  bag.add(pointer(stage, { move: (p) => choose(hit(p)), leave: () => choose(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { lift = v; if (act >= 0) choose(act, true); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "screen",
  means: "An interface pulled apart over a phone: the part under the pointer lifts, and the rest make way in turn.",
  rules: [1, 2, 5, 9],
  range: [12, 20, 28],
  mount,
});
