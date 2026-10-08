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
  { id: 't06', tex: 'p06', dark: 1, screen: 'ja-chat' },
  { id: 't07', tex: 'p07', screen: 'pf-createlead' },
  { id: 't08', tex: 'p08', dark: 1, screen: 'ssh2-signin' },
  { id: 't09', tex: 'p09', phonesH: ['zr-signup', 'zr-workout', 'zr-sleep'] },
  { id: 't10', tex: 'p17', logo: { icon: 'pf', name: 'Pulsefit', font: '600 64px Poppins', color: '#14171F' } },
  { id: 't11', tex: 'p10', dark: 1, screen: 'ssh2-sftp' },
  { id: 't12', tex: 'p18', logo: { icon: 'zy', name: 'Zync', font: '700 66px Montserrat', color: '#1B1340' } },
  { id: 't13', tex: 'p11', screen: 'pf-pricing', bezel: 'dark' },
  { id: 't14', tex: 'p14', screen: 'col-drawer-s' },
  { id: 't15', tex: 'p15', dark: 1, logo: { icon: 'ssh' } },
  { id: 't16', tex: 'p12', phonesH: ['zr-events', 'zr-profile', 'zr-explore'] },
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
// The same trio drawn with phone frames, for raw screens (zync-refined/).
function phonesHtml(t, which) {
  const [l, m, r] = t.phones
  const ph = (s, x, w, bottom) => {
    const p = Math.round(w * 0.045), h = Math.round(w * 2.05)
    return `<div class="dev phone" style="left:${x}px;top:${600 - bottom - h}px;width:${w}px;height:${h}px;padding:${p}px;border-radius:${w * 0.16}px"><div class="psc" style="border-radius:${w * 0.12}px;background-image:url(${A(s)})"><b class="isl" style="width:${w * 0.3}px;height:${w * 0.085}px;top:${w * 0.035}px;margin-left:-${w * 0.15}px"></b></div></div>`
  }
  if (which === 'side') return ph(l, 450 - PHONES.mid / 2 - PHONES.side + 26, PHONES.side, 30) + ph(r, 450 + PHONES.mid / 2 - 26, PHONES.side, 30)
  return ph(m, 450 - PHONES.mid / 2, PHONES.mid, 14)
}
// A logo tile: the app icon (rebuilt clean: gradient square + white mark, or white square +
// colour mark) with the wordmark under it. The SSH client is under NDA, so no name.
const ICONS = {
  pf: `<div class="ico" style="background:#fff;box-shadow:inset 0 0 0 1.5px rgba(20,23,31,.06)"><img src="a/mark-pf.svg" style="width:46%"></div>`,
  zy: `<div class="ico" style="background:linear-gradient(145deg,#8F78FF,#5233D6)"><img src="a/mark-zy.png" style="width:48%"></div>`,
  ssh: `<div class="ico" style="background:linear-gradient(145deg,#A567FF,#5B2BD9)"><img src="a/mark-ssh.png" style="width:58%"></div>`,
}
function logoDev(t) {
  const l = t.logo
  const name = l.name ? `<div class="wm" style="font:${l.font},sans-serif;color:${l.color}">${l.name}</div>` : ''
  return `<div class="dev logo" style="left:0;width:900px;top:${l.name ? 120 : 165}px">${ICONS[l.icon]}${name}</div>`
}
window.buildTile = (t, mode) => {
  if (t.logo) {
    const ground = mode === 'pop' ? '' : `<div class="gr" style="background-image:url(${A(t.tex)})"></div><div class="cs" style="left:360px;width:180px;top:${t.logo.name ? 330 : 375}px"></div>`
    const pop = mode === 'base' ? '' : `<div class="pop">${logoDev(t)}</div>`
    return `<div class="tile ${mode}" id="${t.id}-${mode}">${ground}${pop}</div>`
  }
  if (t.phonesH) { t = { ...t, phones: t.phonesH }; t.html = 1 }
  const isPh = !!t.phones
  const shadow = isPh
    ? `<div class="cs" style="left:330px;width:240px;top:548px"></div>`
    : `<div class="cs" style="left:${SCREEN.x + 40}px;width:${SCREEN.w - 80}px;top:${SCREEN.y + 420}px"></div>`
  const ground = mode === 'pop' ? '' : `<div class="gr" style="background-image:url(${A(t.tex)})"></div>${shadow}${isPh ? (t.html ? phonesHtml(t, 'side') : phonesDev(t, 'side')) : ''}`
  const pop = mode === 'base' ? '' : `<div class="pop">${isPh ? (t.html ? phonesHtml(t, 'mid') : phonesDev(t, 'mid')) : screenDev(t)}</div>`
  return `<div class="tile ${mode}" id="${t.id}-${mode}">${ground}${pop}</div>`
}
