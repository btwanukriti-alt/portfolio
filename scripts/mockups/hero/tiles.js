// Hero tiles: full UX frames in device mockups. Each tile = base (ground + background devices)
// + pop (the foreground device, exported alone so the hero can lift it out of the frame).
// Canvas 900 x 600. Devices: lap(screen), lapimg(college laptop png), phoneimg(zync png),
// phone(screen), tab(screen), win(screen).
// Grounds: a colourful mesh in each project's own palette (from src/data/galleries.ts and the
// case-study modules), with soft rings and a dot grain so the tiles stand out in the hero.
const mesh = (base, blobs) => blobs.map(([c, x, y, r]) => `radial-gradient(${r}% ${r}% at ${x}% ${y}%,${c} 0%,${c}00 70%)`).join(',') + `,${base}`
window.GROUNDS = {
  // Jaadu 2.0: deep navy, electric blue, violet, the regime gauge's orange.
  jaadu: mesh('#040A26', [['#3B6CFF', 82, 12, 70], ['#8B5CF6', 8, 92, 65], ['#FF8A3D', 98, 98, 45], ['#0F2C86', 30, 20, 80]]),
  // SSH client: night ground, product violet, pink and blue accents.
  ssh: mesh('#0E0D15', [['#7C5CFF', 80, 10, 75], ['#F5577D', 5, 95, 55], ['#3B82F6', 100, 100, 55], ['#2B1C70', 25, 15, 80]]),
  // Pulsefit: product blue, the yellow accent, a violet note.
  pf: mesh('#DCE6FA', [['#5985FF', 90, 5, 70], ['#FFB800', 4, 96, 55], ['#B9A6FF', 0, 0, 60], ['#E6F0FF', 50, 60, 70]]),
  pfsite: mesh('#CFDDFF', [['#0063F8', 95, 95, 70], ['#FFB800', 2, 4, 50], ['#DCCFFF', 90, 0, 60]]),
  // College ERP: navy, blue, the on-target green.
  colnavy: mesh('#08153A', [['#4F86E8', 85, 8, 75], ['#1A9E6E', 4, 96, 50], ['#2653CF', 20, 10, 70]]),
  collight: mesh('#D5DDED', [['#4F86E8', 92, 6, 70], ['#1A9E6E', 0, 100, 45], ['#E6EDF9', 40, 40, 70], ['#F2A93B', 100, 100, 40]]),
  // Zync: lilac, pink pop, deep violet.
  zync: mesh('#ECE8FA', [['#F5577D', 96, 8, 55], ['#644ACD', 4, 96, 65], ['#FFE8EE', 60, 60, 60], ['#B7A6F5', 10, 0, 60]]),
}
window.DARK = { jaadu: 1, ssh: 1, colnavy: 1 }
window.GLOW = { jaadu:'#6C8CFF', ssh:'#B49CFF', pf:'#FFFFFF', pfsite:'#FFFFFF', colnavy:'#7FA6F0', collight:'#FFFFFF', zync:'#FFFFFF' }
window.TILESPEC = [
  { id:'t01', g:'jaadu', base:[{k:'lap',s:'ja-footprint',x:40,y:78,w:620}], pop:[{k:'phone',s:'ja-mobile',x:655,y:92,w:186,dark:1}] },
  { id:'t02', g:'pf', base:[], pop:[{k:'lap',s:'app-leads',x:110,y:66,w:680}] },
  { id:'t03', g:'ssh', base:[{k:'lap',s:'ssh-hosts',x:36,y:60,w:560}], pop:[{k:'win',s:'ssh-terminal',x:410,y:210,w:450,dark:1}] },
  { id:'t04', g:'zync', base:[{k:'phoneimg',s:'zy-food',x:180,y:120,w:190},{k:'phoneimg',s:'zy-gym',x:530,y:120,w:190}], pop:[{k:'phoneimg',s:'zy-home',x:340,y:50,w:220}] },
  { id:'t05', g:'jaadu', base:[{k:'lap',s:'ja-library',x:30,y:56,w:560}], pop:[{k:'tab',s:'ja-tablet',x:400,y:200,w:460}] },
  { id:'t06', g:'colnavy', base:[], pop:[{k:'lapimg',s:'col-finance',x:110,y:68,w:680}] },
  { id:'t07', g:'pfsite', base:[{k:'lap',s:'app-plans',x:36,y:60,w:560}], pop:[{k:'win',s:'app-site',x:410,y:210,w:450,dark:1}] },
  { id:'t08', g:'ssh', base:[], pop:[{k:'lap',s:'ssh-terminal',x:110,y:66,w:680}] },
  { id:'t09', g:'zync', base:[{k:'phoneimg',s:'zy-workout',x:180,y:120,w:190},{k:'phoneimg',s:'zy-food',x:530,y:120,w:190}], pop:[{k:'phoneimg',s:'zy-water',x:340,y:50,w:220}] },
  { id:'t10', g:'collight', base:[], pop:[{k:'lapimg',s:'col-staff',x:110,y:68,w:680}] },
  { id:'t11', g:'pf', base:[{k:'lap',s:'app-members',x:36,y:60,w:560}], pop:[{k:'win',s:'app-leads',x:410,y:210,w:450}] },
  { id:'t12', g:'jaadu', base:[{k:'lap',s:'ja-overnight',x:30,y:56,w:560}], pop:[{k:'win',s:'ja-alerts',x:410,y:210,w:450,dark:1}] },
  { id:'t13', g:'colnavy', base:[], pop:[{k:'lapimg',s:'col-drawer',x:110,y:68,w:680}] },
  { id:'t14', g:'ssh', base:[{k:'lap',s:'ssh-terminal',x:300,y:60,w:560}], pop:[{k:'win',s:'ssh-hosts',x:40,y:210,w:450,dark:1}] },
  { id:'t15', g:'pfsite', base:[], pop:[{k:'win',s:'app-site',x:100,y:70,w:700,dark:1}] },
  { id:'t16', g:'zync', base:[{k:'phoneimg',s:'zy-water',x:180,y:120,w:190},{k:'phoneimg',s:'zy-workout',x:530,y:120,w:190}], pop:[{k:'phoneimg',s:'zy-gym',x:340,y:50,w:220}] },
]
const A = (s) => `a/${s}.png`
function device(d) {
  const st = `left:${d.x}px;top:${d.y}px;width:${d.w}px`
  if (d.k === 'lap') {
    const p = Math.round(d.w * 0.022)
    return `<div class="dev lap" style="${st}"><div class="bz" style="padding:${p}px ${p}px ${p * 1.2}px;border-radius:${p * 1.6}px ${p * 1.6}px ${p * 0.4}px ${p * 0.4}px"><img class="sc" src="${A(d.s)}" style="border-radius:${p * 0.5}px"></div><div class="bs" style="height:${Math.round(d.w * 0.03)}px;margin:0 -${Math.round(d.w * 0.06)}px"></div></div>`
  }
  if (d.k === 'win') {
    const tb = Math.round(d.w * 0.04)
    return `<div class="dev win ${d.dark ? 'dk' : ''}" style="${st};border-radius:${Math.round(d.w * 0.022)}px"><div class="tb" style="height:${tb}px;padding-left:${tb * 0.5}px"><i></i><i></i><i></i></div><img class="sc" src="${A(d.s)}"></div>`
  }
  if (d.k === 'tab') {
    const p = Math.round(d.w * 0.03)
    return `<div class="dev tab" style="${st};padding:${p}px;border-radius:${p * 1.5}px"><img class="sc" src="${A(d.s)}" style="border-radius:${p * 0.6}px"></div>`
  }
  if (d.k === 'phone') {
    const p = Math.round(d.w * 0.045)
    return `<div class="dev phone" style="${st};padding:${p}px;border-radius:${d.w * 0.16}px"><div style="position:relative"><img class="sc" src="${A(d.s)}" style="border-radius:${d.w * 0.12}px"><b class="isl" style="width:${d.w * 0.3}px;height:${d.w * 0.085}px;top:${d.w * 0.035}px;margin-left:-${d.w * 0.15}px"></b></div></div>`
  }
  return `<img class="dev" src="${A(d.s)}" style="${st}">` // phoneimg, lapimg: framed already
}
window.buildTile = (t, mode) => {
  const glow = GLOW[t.g]
  const p = t.pop[0]
  const shadowY = p.k === 'lapimg' || p.k === 'lap' ? p.y + p.w * 0.6 : p.y + p.w * (p.k.startsWith('phone') ? 1.8 : 0.66)
  const dk = DARK[t.g]
  const ground = mode === 'pop' ? '' : `<div class="gr" style="background:${GROUNDS[t.g]}"></div>
    <div class="dots" style="background-image:radial-gradient(${dk ? 'rgba(255,255,255,.16)' : 'rgba(20,12,60,.13)'} 1.4px,transparent 1.6px)"></div>
    <div class="ring" style="right:-170px;top:-200px;border-color:${dk ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.6)'}"></div>
    <div class="ring" style="right:-90px;top:-120px;width:340px;height:340px;border-color:${dk ? 'rgba(255,255,255,.09)' : 'rgba(255,255,255,.45)'}"></div>
    <div class="ring" style="left:-160px;bottom:-230px;width:420px;height:420px;border-color:${dk ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.5)'}"></div>
    <div class="glow" style="left:${p.x + p.w / 2 - 260}px;top:${p.y - 40}px;background:radial-gradient(closest-side,${glow}66,${glow}00)"></div>
    <div class="cs" style="left:${p.x + p.w * 0.08}px;width:${p.w * 0.84}px;top:${shadowY}px"></div>
    ${t.base.map(device).join('')}`
  const pop = mode === 'base' ? '' : `<div class="pop">${t.pop.map(device).join('')}</div>`
  return `<div class="tile ${mode}" id="${t.id}-${mode}">${ground}${pop}</div>`
}
