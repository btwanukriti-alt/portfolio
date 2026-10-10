// Module layout: the component enlarged on a plate, the title block beside it, the full frame below.
(function(){
const M = document.getElementById('mods')
const i = P.i

// Callouts are anchored to an element inside the plate, measured after layout.
// side: where the pill sits relative to the target (r, l, d, u).
function callout(plate, { sel, side = 'r', len = 80, text, at = 0.5 }) {
  const t = plate.querySelector(sel)
  if (!t) { console.log('callout target missing', sel); return }
  const pr = plate.getBoundingClientRect(), r = t.getBoundingClientRect()
  const el = document.createElement('div')
  el.className = 'co' + (side === 'd' || side === 'u' ? ' v' : '')
  const ln = side === 'd' || side === 'u' ? `height:${len}px` : `width:${len}px`
  el.innerHTML = `<span class="dot"></span><span class="ln" style="${ln}"></span><span class="pill">${text}</span>`
  if (side === 'r') { el.style.left = (r.right - pr.left - 8) + 'px'; el.style.top = (r.top - pr.top + r.height * at - 23) + 'px' }
  if (side === 'l') { el.style.flexDirection = 'row-reverse'; el.style.right = (pr.right - r.left - 8) + 'px'; el.style.top = (r.top - pr.top + r.height * at - 23) + 'px' }
  if (side === 'd') { el.style.left = (r.left - pr.left + r.width * at) + 'px'; el.style.top = (r.bottom - pr.top - 8) + 'px'; el.style.transform = 'translateX(-50%)' }
  if (side === 'u') { el.style.flexDirection = 'column-reverse'; el.style.left = (r.left - pr.left + r.width * at) + 'px'; el.style.bottom = (pr.bottom - r.top - 8) + 'px'; el.style.transform = 'translateX(-50%)' }
  plate.appendChild(el)
}

const block = (step, title, desc) => `<div class="block" style="flex:1"><div class="st">${step}</div><div class="bar"></div><h3>${title}</h3><p>${desc}</p></div>`
// a browser window holding a frame scaled to fit `w`
const browser = (html, w, url) => `<div class="win" style="width:${w}px"><div class="tb"><i></i><i></i><i></i><div class="url">${url}</div></div><div class="fit" data-w="${w}"><div class="inner" style="width:1440px">${html}</div></div></div>`

function mod(id, { comp, scale, h, pos = 'center', pad = '0', step, title, desc, frame, url, callouts = [], frameCallouts = [] }) {
  const s = document.createElement('div')
  s.className = 'mod'; s.id = id
  s.innerHTML = `<div class="row" style="height:${h}px"><div class="plate ptop" style="width:940px;flex:none"><div class="stage" style="place-items:${pos};padding:${pad}"><div class="zoom" style="transform:scale(${scale});transform-origin:${pos.includes('start') ? 'left center' : 'center'}">${comp}</div></div></div>${block(step, title, desc)}</div>
    <div class="plate bot" style="padding:48px;display:flex;justify-content:center">${browser(frame, 1424, url)}</div>`
  M.appendChild(s)
  s._co = [callouts, frameCallouts]
}

// ---------- 01 Logo construction ----------
function logoModule() {
  const s = document.createElement('div')
  s.className = 'mod'; s.id = 'm-logo'
  // mark drawn at 34px per unit; guides are read from the mark's own geometry (viewBox 20.48 x 22.28)
  const k = 25, W = 20.48 * k, H = 22.28 * k
  const ys = [0, 4.15, 8.6, 13.08, 22.28].map(y => y * k)
  const hl = ys.map(y => `<line x1="-120" x2="${W + 120}" y1="${y}" y2="${y}" class="g"/>`).join('')
  // the stem's slant: from (6.80, 12.97) to (5.14, 22.28), continued to the top
  const sl = (6.80 - 5.14) / (22.28 - 12.97)
  const xAt = (x0, y) => x0 + (12.97 - y) * sl
  const slant = [[6.80, 12.97], [1.106, 12.97]].map(([x0]) => `<line x1="${xAt(x0, -4) * k}" y1="${-4 * k}" x2="${xAt(x0, 26) * k}" y2="${26 * k}" class="g s"/>`).join('')
  // round ends of the three bars and the bowl
  const circ = [[15.15, 2.075, 2.075], [11.53, 6.37, 2.23], [9.0, 10.84, 2.23], [14.08, 6.54, 6.54]].map(([cx, cy, r]) => `<circle cx="${cx * k}" cy="${cy * k}" r="${r * k}" class="g c"/><circle cx="${cx * k}" cy="${cy * k}" r="4" class="pt"/>`).join('')
  const ang = Math.round(Math.atan(sl) * 180 / Math.PI)
  s.innerHTML = `<div class="plate" style="height:1000px"><style>
    #m-logo .g{stroke:#A9AFC4;stroke-width:2;stroke-dasharray:6 7;fill:none}
    #m-logo .g.s{stroke:#7F8AB5}#m-logo .g.c{stroke:#0063F8;stroke-opacity:.55;stroke-dasharray:4 6}
    #m-logo .pt{fill:#0063F8;stroke:#fff;stroke-width:2.5}
    #m-logo .nb{position:absolute;height:34px;padding:0 12px;border-radius:17px;background:#fff;color:#14171F;font:600 17px/34px Inter;box-shadow:0 0 0 1px #DADDE7;white-space:nowrap}
    #m-logo .cap{position:absolute;font:500 18px Inter;letter-spacing:.1em;text-transform:uppercase;color:#8C91A6}
  </style>
  <div class="cap" style="left:90px;top:70px">Mark construction</div>
  <div style="position:absolute;left:230px;top:230px;width:${W}px;height:${H}px">
    <div style="position:absolute;inset:0">${P.mark()}</div>
    <svg style="position:absolute;left:-200px;top:-200px;overflow:visible" width="${W + 400}" height="${H + 400}" viewBox="-200 -200 ${W + 400} ${H + 400}">${hl}${slant}${circ}</svg>
  </div>
  <div class="nb" style="left:${230 + W + 70}px;top:${230 + ys[1] / 2 - 17}px">Bar 1</div>
  <div class="nb" style="left:${230 + W - 60}px;top:${230 + (ys[1] + ys[2]) / 2 - 17}px">Bar 2</div>
  <div class="nb" style="left:${230 + W - 140}px;top:${230 + (ys[2] + ys[3]) / 2 - 17}px">Bar 3</div>
  <div class="nb" style="left:${230 + 70}px;top:${230 + H + 40}px">${ang}° slant, one axis for stem and bars</div>
  <div class="nb" style="left:${230 + W + 70}px;top:${230 + ys[3] - 17}px">Bowl r = ½ height</div>
  <div style="position:absolute;left:1000px;top:0;bottom:0;width:2px;border-left:2px dashed #D3D6E0"></div>
  <div class="cap" style="left:1060px;top:70px">Lockup and clear space</div>
  <div style="position:absolute;left:1060px;top:380px;width:470px;height:250px;outline:2px dashed #A9AFC4">
    <div style="position:absolute;left:55px;top:55px;right:55px;bottom:55px;display:flex;align-items:center;justify-content:center;gap:14px;outline:1.5px dashed #D3D6E0"><span style="width:110px;height:120px;display:block;flex:none;transform:scale(.62)">${P.mark()}</span><span style="font:600 52px Poppins;letter-spacing:-.03em;color:#14171F;margin-left:-30px">Pulsefit</span></div>
    <div class="nb" style="left:12px;top:13px;height:30px;line-height:30px;font-size:15px">x</div><div class="nb" style="right:12px;bottom:13px;height:30px;line-height:30px;font-size:15px">x</div>
  </div>
  <div class="nb" style="left:1060px;top:670px">x = ½ the mark width</div>
  </div>`
  M.appendChild(s)
}

// ---------- 08 Website ----------
function siteModule() {
  const s = document.createElement('div')
  s.className = 'mod'; s.id = 'm-site'; s.style.background = '#E9EEF8'
  s.innerHTML = `<div class="row" style="height:330px"><div class="block" style="flex:1;flex-direction:row;align-items:flex-end;gap:60px"><div style="flex:1"><div class="st" style="margin-bottom:60px">The website</div><div class="bar"></div><h3>The homepage, top to bottom</h3></div><p style="flex:1;margin:0">One scroll from the promise to features, the lead-to-member flow, setup, pricing and FAQ.</p></div></div>
  <div class="plate bot" style="padding:48px;display:flex;justify-content:center;background:linear-gradient(180deg,#F6F8FD,#E4EAF6)">${browser(P.site(), 1424, 'pulsefit.app')}</div>`
  M.appendChild(s)
}

logoModule()
mod('m-leads', {
  step: '01 · Spot', title: 'Each alert has its fix', desc: 'Stale, missed and incomplete leads open the day. One quiet action per row; the row in focus fills.',
  comp: P.taskCard('missed', { hov: 0, w: 420 }), scale: 1.32, h: 760, pos: 'center start', pad: '0 0 0 70px',
  frame: P.leadDash(), url: 'app.pulsefit.app/leads',
  callouts: [{ sel: '.tr.hov .btn.p', side: 'r', len: 60, text: 'Only the row in focus fills' }, { sel: '.tr:nth-of-type(4) .btn.s', side: 'r', len: 60, text: 'The rest stay quiet' }],
})
mod('m-table', {
  step: '02 · Sort', title: 'Triage without opening a record', desc: 'Status and owner change inline. Select leads and the bar offers bulk actions, ending in Convert.',
  comp: `<div style="display:flex;flex-direction:column;gap:22px;align-items:flex-end"><div class="card u" style="width:520px;overflow:hidden"><table class="tbl">${P.leadRow([2789, 'Nithya Menon', '+91 78798 63288', 'Hot', 'Rahul Menon', 'Instagram', '2 Oct'], 1).replace(/<td style="color:var\(--t2\)">.*?<\/td>/g, '').replace(/<td>\+91.*?<\/td>/, '').replace(/<td><span class="sel-dd"><span class="who".*?<\/td>/, '')}</table></div><div style="margin-right:60px;margin-top:-14px">${P.statusMenu()}</div>${P.bulkBar(620)}</div>`,
  scale: 1.18, h: 760,
  frame: P.leadsTable(), url: 'app.pulsefit.app/leads/all',
  callouts: [{ sel: '.zoom .card.u:not(.tbl) div[style*="width:220px"], .zoom .card[style*="width:220px"]', side: 'l', len: 70, text: 'Set status inline' }],
})
mod('m-convert', {
  step: '03 · Convert', title: 'Convert without retyping', desc: 'The lead\'s details carry into the member form. Pick a plan and see the total before you confirm.',
  comp: P.convertModal(), scale: 0.86, h: 1160, pos: 'center start', pad: '0 0 0 40px',
  frame: P.convertFrame(), url: 'app.pulsefit.app/leads/2789/convert',
  callouts: [{ sel: '.fl:nth-child(2) .inp.pf', side: 'r', len: 30, text: 'Carried from the lead' }, { sel: '.sum', side: 'r', len: 30, text: 'Live total', at: .88 }],
})
mod('m-plans', {
  step: '04 · Plan', title: 'Every plan on one card', desc: 'Price with GST, extension and pause days, and who is on it. Category colour groups the grid.',
  comp: P.planCard(P.PLANS[0], 1), scale: 1.4, h: 760, pos: 'center start', pad: '0 0 0 150px',
  frame: P.plansFrame(), url: 'app.pulsefit.app/plans',
  callouts: [{ sel: '.zoom .tag', side: 'u', len: 60, text: 'Category colour' }, { sel: '.zoom div[style*="grid-template-columns:1fr 1fr"]', side: 'r', len: 40, text: 'Pause and extension days', at: .5 }],
})
mod('m-members', {
  step: '05 · Keep', title: 'Renew before it lapses', desc: 'Expiring plans, attendance drops and frozen members. Renew is the main step; Remind stays secondary.',
  comp: `<div class="card u" style="width:600px;overflow:hidden"><table class="tbl"><tr><th>Member</th><th>Expires</th><th class="r">Next step</th></tr>${P.EXP.slice(0, 3).map((e, k) => P.expRow(e, k === 0).replace(/<td>(<span class="tag[^]*?)<\/td>/, '').replace(/<td><div class="who" style="gap:8px">.*?<\/td>/, '')).join('')}</table></div>`,
  scale: 1.3, h: 760,
  frame: P.membersDash(), url: 'app.pulsefit.app/members',
  callouts: [{ sel: 'tr.sel .btn.p', side: 'u', len: 90, text: 'One filled button: Renew' }, { sel: 'tr:last-child .btn.g', side: 'd', len: 90, text: 'Remind stays quiet' }],
})
mod('m-email', {
  step: '06 · Nurture', title: 'Emails follow the lifecycle', desc: 'Lead, member and subscription emails, each sent by a trigger, each with its own results.',
  comp: P.campRow(P.CAMP.Subscriptions[0], 1), scale: .98, h: 560,
  frame: P.emailFrame(), url: 'app.pulsefit.app/communication',
  callouts: [{ sel: '.zoom .tg', side: 'u', len: 90, text: 'Pause without deleting' }, { sel: '.zoom > div', side: 'd', len: 90, text: 'Sent by a trigger, not by hand', at: .2 }],
})
siteModule()

// size the frames, then place the callouts
document.fonts.ready.then(() => {
  document.querySelectorAll('.fit').forEach(f => {
    const w = +f.dataset.w, inner = f.firstElementChild, s = w / 1440
    inner.style.transform = `scale(${s})`
    f.style.height = Math.ceil(inner.offsetHeight * s) + 'px'
  })
  document.querySelectorAll('.mod').forEach(m => {
    if (!m._co) return
    const [top] = m._co
    top.filter(c => !c.skip).forEach(c => callout(m.querySelector('.plate.ptop'), c))
  })
  window.READY = true
})
})()
