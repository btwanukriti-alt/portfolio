// Hero tiles: one full UX frame per tile, every device the same size and place, on a textured
// ground in that project's palette (textures.py). Each tile = base (ground + contact shadow) +
// pop (the device alone, which the hero lifts out of the tile on a loop). Canvas 900 x 600.
const SCREEN = { x: 110, y: 70, w: 680 } // every desktop frame
const PHONES = { side: 180, mid: 210 } // the phone trio
window.TILESPEC = [
  { id: 't01', tex: 'p01', dark: 1, screen: 'ja-footprint' },
  { id: 't02', tex: 'p02', screen: 'app-site', bezel: 'dark' },
  { id: 't03', tex: 'p03', dark: 1, screen: 'ssh2-performance' },
  { id: 't04', tex: 'p04', phones: ['zy-food', 'zy-home', 'zy-water'] },
  { id: 't05', tex: 'p05', screen: 'col-finance-s' },
  { id: 't06', tex: 'p06', dark: 1, screen: 'ja-library' },
  { id: 't07', tex: 'p07', screen: 'app-leads' },
  { id: 't08', tex: 'p08', dark: 1, screen: 'ssh2-hosts' },
  { id: 't09', tex: 'p09', screen: 'col-staff-s' },
  { id: 't10', tex: 'p10', dark: 1, screen: 'ja-tablet' },
  { id: 't11', tex: 'p11', screen: 'app-members' },
  { id: 't12', tex: 'p12', phones: ['zy-gym', 'zy-workout', 'zy-food'] },
  { id: 't13', tex: 'p13', dark: 1, screen: 'ssh2-sessions' },
  { id: 't14', tex: 'p14', screen: 'col-drawer-s' },
  { id: 't15', tex: 'p15', dark: 1, screen: 'ja-overnight' },
  { id: 't16', tex: 'p16', screen: 'app-plans' },
]
const A = (s) => `a/${s}.png`
function screenDev(t) {
  const { x, y, w } = SCREEN
  const b = 12
  const h = Math.round((w - 2 * b) / 1.6)
  const dk = t.dark || t.bezel === 'dark'
  return `<div class="dev scr ${dk ? 'dk' : 'lt'}" style="left:${x}px;top:${y}px;width:${w}px;padding:${b}px;border-radius:22px"><div class="sc" style="height:${h}px;background-image:url(${A(t.screen)})"></div></div>`
}
function phonesDev(t, which) {
  const [l, m, r] = t.phones
  const ar = 2789 / 1542
  const sideH = PHONES.side * ar, midH = PHONES.mid * ar
  const sideY = 600 - 44 - sideH, midY = 600 - 28 - midH
  if (which === 'side') return `<img class="dev" src="${A(l)}" style="left:${450 - PHONES.mid / 2 - PHONES.side + 26}px;top:${sideY}px;width:${PHONES.side}px"><img class="dev" src="${A(r)}" style="left:${450 + PHONES.mid / 2 - 26}px;top:${sideY}px;width:${PHONES.side}px">`
  return `<img class="dev" src="${A(m)}" style="left:${450 - PHONES.mid / 2}px;top:${midY}px;width:${PHONES.mid}px">`
}
window.buildTile = (t, mode) => {
  const isPh = !!t.phones
  const shadow = isPh
    ? `<div class="cs" style="left:330px;width:240px;top:548px"></div>`
    : `<div class="cs" style="left:${SCREEN.x + 40}px;width:${SCREEN.w - 80}px;top:${SCREEN.y + 420}px"></div>`
  const ground = mode === 'pop' ? '' : `<div class="gr" style="background-image:url(${A(t.tex)})"></div>${shadow}${isPh ? phonesDev(t, 'side') : ''}`
  const pop = mode === 'base' ? '' : `<div class="pop">${isPh ? phonesDev(t, 'mid') : screenDev(t)}</div>`
  return `<div class="tile ${mode}" id="${t.id}-${mode}">${ground}${pop}</div>`
}
