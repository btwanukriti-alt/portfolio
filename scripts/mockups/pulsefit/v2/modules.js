// Module layout: a bento row (a small text tile and whole components on plates), then the full frame.
(function(){
const M = document.getElementById('mods')
const i = P.i

const tile = (step, title, desc) => `<div class="tile"><div class="ts">${step}</div><div><h3>${title}</h3><p>${desc}</p></div></div>`
const plate = (html, zoom = 1, st = '') => `<div class="plate cell" style="padding:48px;display:grid;place-items:center;${st}"><div style="zoom:${zoom}">${html}</div></div>`
// a browser window holding a frame scaled to fit `w`
const browser = (html, w, url) => `<div class="win" style="width:${w}px"><div class="tb"><i></i><i></i><i></i><div class="url">${url}</div></div><div class="fit" data-w="${w}"><div class="inner" style="width:1440px">${html}</div></div></div>`

function mod(id, { cols = '340px 1fr', cells, frame, url }) {
  const s = document.createElement('div')
  s.className = 'mod'; s.id = id
  s.innerHTML = `<div class="bento" style="grid-template-columns:${cols}">${cells.join('')}</div>
    <div class="plate bot" style="padding:48px;display:flex;justify-content:center">${browser(frame, 1424, url)}</div>`
  M.appendChild(s)
  return s
}

// Dashed elbow line from a pill to a point, with a dot at the point. Coordinates are relative to `box`.
function line(box, a, b, mx) {
  const svg = box.querySelector('svg.links') || box.insertAdjacentHTML('beforeend', '<svg class="links" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:4"></svg>') || box.querySelector('svg.links')
  const d = mx === undefined ? `M${a.x} ${a.y} V${b.y}` : `M${a.x} ${a.y} H${mx} V${b.y} H${b.x}`
  svg.insertAdjacentHTML('beforeend', `<path d="${d}" fill="none" stroke="#8C93AA" stroke-width="3" stroke-dasharray="3 9" stroke-linecap="round"/><circle cx="${b.x}" cy="${b.y}" r="8" fill="#0063F8" stroke="#fff" stroke-width="4"/>`)
}
const rel = (box, el) => { const b = box.getBoundingClientRect(), r = el.getBoundingClientRect(); return { l: r.left - b.left, t: r.top - b.top, r: r.right - b.left, b: r.bottom - b.top, w: r.width, h: r.height } }
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
  s.innerHTML = `<div class="plate" style="height:980px"><style>
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

// ---------- Website: the original homepage, unchanged ----------
function siteModule() {
  const s = document.createElement('div')
  s.className = 'mod'; s.id = 'm-site'
  s.innerHTML = `<div class="bento" style="grid-template-columns:1fr"><div class="tile" style="flex-direction:row;align-items:flex-end;gap:40px;min-height:0;padding:34px 40px"><div><div class="ts" style="margin-bottom:14px">07 · Website</div><h3>The homepage, top to bottom</h3></div><p style="max-width:520px;margin-left:auto">From the promise to features, setup, pricing and FAQ, in one scroll.</p></div></div>
  <div class="plate bot" style="padding:48px;display:flex;justify-content:center"><div class="win" style="width:1424px"><div class="tb"><i></i><i></i><i></i><div class="url">pulsefit.app</div></div><img src="website-original.png" style="display:block;width:100%"></div></div>`
  M.appendChild(s)
}

// ---------- small cards for under the text tiles ----------
const up = (v, l = 'vs last month') => `<div class="f"><span class="up">${i('up', 'width:13px;height:13px;stroke-width:2.4')}${v}</span>${l}</div>`
const kpi = (ic, c, bg, l, v, ch) => `<div class="card kpi u" style="width:300px"><div class="l"><span class="ico" style="background:${bg};color:${c};width:28px;height:28px">${i(ic, 'width:15px;height:15px')}</span>${l}</div><div class="v">${v}</div>${up(ch)}</div>`
const side = (html) => `<div class="plate" style="display:grid;place-items:center"><div>${html}</div></div>`
const col = (t, html) => `<div class="col">${t}${side(html)}</div>`
const toast = `<div class="card u" style="width:300px;padding:16px 18px;display:flex;gap:12px;align-items:flex-start;box-shadow:0 0 0 1px var(--line),0 20px 40px -20px rgba(15,18,34,.3)"><span class="ico" style="background:var(--grn-s);color:var(--grn);border-radius:50%">${i('check')}</span><div><div style="font-weight:600">Nithya Menon is now a member</div><div style="font-size:12.5px;color:var(--mut);margin-top:3px;line-height:1.45">Monthly plan from 10 Oct · ₹2,124 billed</div><div style="font-size:12.5px;color:var(--pri);font-weight:600;margin-top:8px">View profile</div></div></div>`
const cats = `<div class="card u" style="width:300px;padding:6px 0"><div style="padding:12px 18px 8px;font-weight:600">Categories</div>${[['Membership', 'blue', 4, 426], ['Training', 'warm', 2, 60], ['Classes', 'grn', 2, 130], ['Student', 'cold', 2, 118], ['Corporate', 'vio', 1, 45], ['Trial', 'gray', 1, 12]].map(([n, c, k, m]) => `<div style="display:flex;align-items:center;gap:10px;padding:9px 18px;border-top:1px solid var(--line)">${P.tag(n, c, 1)}<span style="color:var(--mut);font-size:12.5px">${k} plan${k > 1 ? "s" : ""}</span><span style="margin-left:auto;font-weight:600">${m}</span></div>`).join('')}</div>`

// ---------- the flow ----------
logoModule()

mod('m-leads', {
  cols: '340px 1fr 1fr',
  cells: [col(tile('01 · Spot', 'Each alert has its fix', 'Stale and missed leads open the day, each row with one quiet action.'), kpi('cal', '#0E9F6E', 'var(--grn-s)', 'Trial booking rate', '42%', '5%')),
    plate(P.taskCard('missed', { hov: 0, w: 440 }), 1.1), plate(P.taskCard('stale', { w: 440 }), 1.1)],
  frame: P.leadDash(), url: 'app.pulsefit.app/leads',
})

// lead to member: the table with two leads selected, and the member form it opens
const tableCard = `<div class="card u" style="width:640px;overflow:hidden"><table class="tbl"><tr><th style="width:44px"></th><th>Lead</th><th>Status</th><th>Owner</th></tr>${[[2314, 'Robert Fox', 'Cold', 'Anika Shetty'], [2789, 'Nithya Menon', 'Hot', 'Rahul Menon'], [3051, 'Neha Singh', 'Hot', 'Farah Khan'], [3168, 'Alex John', 'Warm', 'Anika Shetty'], [3294, 'Aaron Joseph', 'Warm', 'Vikram Das']].map(([id, n, t, o], k) => `<tr class="${k === 1 ? 'sel' : ''}"><td><span class="cb${k === 1 ? ' on' : ''}">${k === 1 ? i('check') : ''}</span></td><td><div class="who">${P.av(n)}<div style="font-weight:600">${n}<small>#${id}</small></div></div></td><td><span class="sel-dd">${P.temp(t)}${i('chev')}</span></td><td><div class="who" style="gap:8px">${P.av(o, 1)}${o}</div></td></tr>`).join('')}</table></div>
  <div style="margin-top:18px">${P.bulkBar(640).replace('2 selected', '1 selected')}</div>`
const conv = mod('m-convert', {
  cells: [col(tile('02 · Convert', 'Lead to member, no retyping', 'Convert from the table. The member form opens with the lead\'s details already in.'), toast),
    `<div class="plate cell flow" style="height:980px">
      <div class="ft" style="position:absolute;left:56px;top:80px;zoom:.72">${tableCard}</div>
      <div class="fm" style="position:absolute;right:56px;top:56px;zoom:.82">${P.convertModal()}</div>
      <span class="pill p1" style="position:absolute;left:56px;top:500px">Convert opens the member form</span>
      <span class="pill p2" style="position:absolute;left:56px;top:640px">5 of 6 fields come from the lead</span>
      <span class="pill p3" style="position:absolute;left:56px;top:780px">The total updates as you toggle</span></div>`],
  frame: P.convertFrame(), url: 'app.pulsefit.app/leads/2789/convert',
})
conv._links = box => {
  const fm = rel(box, box.querySelector('.fm > div')), mx = fm.l - 24
  const btn = rel(box, box.querySelector('.ft .btn.sm[style*="margin-left:auto"]'))
  const p1 = rel(box, box.querySelector('.p1')), p2 = rel(box, box.querySelector('.p2')), p3 = rel(box, box.querySelector('.p3'))
  line(box, { x: p1.r, y: p1.t + p1.h / 2 }, { x: fm.l, y: fm.t + 50 }, mx - 56)
  line(box, { x: btn.l + btn.w / 2, y: p1.t }, { x: btn.l + btn.w / 2, y: btn.b })
  const f = rel(box, box.querySelector('.fm .inp.pf'))
  line(box, { x: p2.r, y: p2.t + p2.h / 2 }, { x: fm.l, y: f.t + f.h / 2 }, mx - 28)
  const t = rel(box, box.querySelector('.fm .sum'))
  line(box, { x: p3.r, y: p3.t + p3.h / 2 }, { x: fm.l, y: t.b - 22 }, mx)
}

mod('m-plans', {
  cells: [col(tile('03 · Plan', 'Every plan on one card', 'Price with GST, extension and pause days, and who is on it. Colour marks the category.'), cats),
    plate(`<div style="display:flex;gap:20px">${[0, 4, 6].map(k => P.planCard(P.PLANS[k], 1)).join('')}</div>`, 1, 'min-height:700px')],
  frame: P.plansFrame(), url: 'app.pulsefit.app/plans',
})

mod('m-members', {
  cells: [col(tile('04 · Keep', 'Renew before it lapses', 'This week\'s renewals, each with its trainer. Renew is the main step; Remind stays quiet.'), kpi('refresh', '#D97706', 'var(--amb-s)', 'Renewal rate', '86%', '3%')),
    plate(`<div class="card u" style="width:960px;overflow:hidden"><div class="ch"><span class="ico" style="background:var(--amb-s);color:var(--amb)">${i('refresh')}</span><h3>Expiring this week</h3><span class="cnt" style="background:var(--amb-s);color:var(--amb)">8</span><span class="ct">View all${i('chevR', 'width:14px;height:14px')}</span></div><table class="tbl"><tr><th>Member</th><th>Plan</th><th>Expires</th><th>Trainer</th><th class="r">Next step</th></tr>${P.EXP.map((e, k) => P.expRow(e, k === 0)).join('')}</table></div>`, 1.06)],
  frame: P.membersDash(), url: 'app.pulsefit.app/members',
})

mod('m-email', {
  cells: [col(tile('05 · Nurture', 'Emails follow the lifecycle', 'Each email is sent by a trigger: a new lead, a booked trial, a plan about to expire.'), kpi('eye', '#0E9F6E', 'var(--grn-s)', 'Open rate', '48%', '4%')),
    plate(`<div class="card u" style="width:960px;overflow:hidden"><div class="ch">${i('refresh', 'color:var(--mut)')}<h3>Subscriptions</h3><span style="font-size:12.5px;color:var(--mut)">3 emails · 3 on</span><span class="ct">${i('plus', 'width:14px;height:14px')}Add</span></div>${P.CAMP.Subscriptions.map(r => P.campRow(r)).join('')}</div>`, 1.06)],
  frame: P.emailFrame(), url: 'app.pulsefit.app/communication',
})
siteModule()

// size the frames, then draw the flow lines
Promise.all([document.fonts.ready, ...[...document.images].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r }))]).then(() => {
  document.querySelectorAll('.fit').forEach(f => {
    const w = +f.dataset.w, inner = f.firstElementChild, s = w / 1440
    inner.style.transform = `scale(${s})`
    f.style.height = Math.ceil(inner.offsetHeight * s) + 'px'
  })
  conv._links(conv.querySelector('.flow'))
  window.READY = true
})
})()
