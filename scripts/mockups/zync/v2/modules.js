// Zync modules: components taken out of the rebuilt screens (../screens.html, in #lib) and laid out as flows.
(function(){
const M = document.getElementById('mods')
const IC = { chevR: '<path d="m9 6 6 6-6 6"/>' }
const i = (n, st = '') => `<svg class="i" viewBox="0 0 24 24"${st ? ` style="${st}"` : ''}>${IC[n]}</svg>`
const add = (id, html) => { const s = document.createElement('div'); s.className = 'mod'; s.id = id; s.innerHTML = html; M.appendChild(s); return s }
const rel = (box, el) => { const b = box.getBoundingClientRect(), r = el.getBoundingClientRect(); return { l: r.left - b.left, t: r.top - b.top, r: r.right - b.left, b: r.bottom - b.top, w: r.width, h: r.height } }
function line(box, a, b) {
  let svg = box.querySelector('svg.links')
  if (!svg) { box.insertAdjacentHTML('beforeend', '<svg class="links" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:4"></svg>'); svg = box.querySelector('svg.links') }
  svg.insertAdjacentHTML('beforeend', `<path d="M${a.x} ${a.y} L${b.x} ${b.y}" fill="none" stroke="#9B93BE" stroke-width="3" stroke-dasharray="3 9" stroke-linecap="round"/><circle cx="${b.x}" cy="${b.y}" r="8" fill="#644ACD" stroke="#fff" stroke-width="4"/>`)
}
// a component: one or more parts of a screen, cloned into a .z wrapper so the screen styles apply
const comp = (sels, w, z) => sels.startsWith('PHONE:') ? `<div class="phone" data-s="${sels.slice(6)}" style="zoom:${z}"><span class="isl"></span><div class="scr"></div></div>` : `<div class="comp" data-c="${sels}" style="width:${w}px;zoom:${z};display:flex;flex-direction:column;gap:14px"></div>`
const arw = `<span class="arw">${i('chevR', 'width:22px;height:22px;stroke-width:2.4')}</span>`
const head = (step, title, desc) => `<div class="tile" style="flex-direction:row;align-items:flex-end;gap:48px;padding:32px 40px"><div style="flex:none"><div class="ts" style="margin-bottom:12px">${step}</div><h3>${title}</h3></div><p style="margin:0 0 0 auto;max-width:600px">${desc}</p></div>`
// a flow: components left to right with arrows, a note under each one
function flow(id, step, title, desc, items) {
  const m = add(id, `<div class="plate flow" style="padding:48px 48px 40px">${head(step, title, desc)}
    <div class="row" style="display:flex;align-items:center;justify-content:center;gap:28px;margin-top:56px">${items.map(([sels, w, z], k) => `${k ? arw : ''}<div class="stg">${comp(sels, w, z)}</div>`).join('')}</div>
    <div style="height:120px"></div>${items.map(([, , , note], k) => note ? `<span class="pill q${k}" style="position:absolute">${note}</span>` : '').join('')}</div>`)
  m._links = box => { const row = rel(box, box.querySelector('.row')); [...box.querySelectorAll('.stg')].forEach((st, k) => { const el = box.querySelector('.q' + k); if (!el) return; const r = rel(box, st); el.style.left = (r.l + r.w / 2 - el.offsetWidth / 2) + 'px'; el.style.top = (row.b + 52) + 'px'; line(box, { x: r.l + r.w / 2, y: row.b + 52 }, { x: r.l + r.w / 2, y: r.b - 4 }) }) }
  return m
}

// the Consumed side of the calorie card, made from the Burned card with the food log's numbers
;(() => { const b = document.querySelector('#lib #s-home .card2').cloneNode(true); b.id = 'k-consumed'
  const sg = b.querySelectorAll('.seg span'); sg[0].classList.remove('on'); sg[1].classList.add('on')
  const C = 477.5, parts = [['#2DC6A0', .52], ['#F5B01D', .18], ['#F5577D', .13], ['#C86BFA', .05]]; let off = 0
  const circles = b.querySelectorAll('.ring circle'); parts.forEach(([c, f], k) => { const el = circles[k + 1]; el.setAttribute('stroke', c); el.setAttribute('stroke-dasharray', `${(f * C - 6).toFixed(1)} ${C}`); el.setAttribute('stroke-dashoffset', (-off).toFixed(1)); off += f * C })
  b.querySelector('.ring .c').innerHTML = '<b>1,385</b><small>of 2,250 cal</small><u style="background:#FFE3EA;color:#C93A60">865 left</u>'
  b.querySelector('.lg').innerHTML = [['#2DC6A0', 'Carbs', '239 g'], ['#F5B01D', 'Fat', '35 g'], ['#F5577D', 'Protein', '35 g'], ['#C86BFA', 'Fibre', '26 g']].map(([c, n, v]) => `<div><i style="background:${c}"></i><span><b>${n}</b><small>${v}</small></span></div>`).join('')
  document.getElementById('lib').appendChild(b) })()
const phone = (id, z = 1) => `<div class="phone" data-s="${id}" style="zoom:${z}"><span class="isl"></span><div class="scr"></div></div>`
const F = [
  flow('m-workout', '04 · Workout', 'Follow a workout plan', 'Pick a plan, see every exercise in it, then start the workout.', [
    ['#s-wo .wc@2', 220, 1.7, 'Pick a plan'], ['PHONE:s-wd', 390, .92, 'See its length, level and exercises'], ['#s-wd .card2, #s-wd .cta', 390, 1.2, 'Start when you are ready']]),
]

const card = (sels, w, z) => `<div class="comp" data-c="${sels}" data-card="1" style="width:${w}px;zoom:${z};display:flex;flex-direction:column;gap:18px;background:#F6F5FA;border-radius:28px;padding:22px 0 24px"></div>`
const note = (t) => `<span class="pill" style="position:relative;align-self:center">${t}</span>`
add('m-home', `<div class="plate flow" style="padding:48px">${head('01 · Home', 'Your day on one screen', 'Calories burned and eaten, both against the goal, open Home. Switch between them with one tap.')}
  <div style="display:flex;align-items:center;justify-content:space-between;margin-top:48px;padding:0 20px"><div style="display:flex;gap:28px"><div style="display:flex;flex-direction:column;gap:22px"><div class="stg">${comp('#s-home .card2', 390, 1.2)}</div>${note('Burned, by activity')}</div><div style="display:flex;flex-direction:column;gap:22px"><div class="stg">${comp('#k-consumed', 390, 1.2)}</div>${note('Eaten, by nutrient')}</div></div>${phone('s-home', .98)}</div></div>`)
add('m-log', `<div class="plate flow" style="padding:48px">${head('02 · Log', 'Log food, water and sleep', 'Tap + on Home and pick what to log. Each log shows today against its goal, and the week.')}
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-top:48px;padding:0 20px"><div style="display:flex;flex-direction:column;gap:22px;align-items:center"><div class="stg">${comp('#s-log .tiles', 390, 1.1)}</div>${note('Pick what to log')}</div>
   <div style="display:flex;flex-direction:column;gap:22px;align-items:center"><div class="stg">${card('#s-food > div:nth-child(3), #s-food .pillrow, #s-food .card3', 390, 1.05)}</div>${note('Meals add up to your macros')}</div>
   <div style="display:flex;flex-direction:column;gap:22px;align-items:center"><div class="stg">${card('#s-water .big2, #s-water .pillrow, #s-water .step, #s-water .chips, #s-water .card3', 390, 1.05)}</div>${note('Add water by glass size')}</div></div>
  <div style="display:flex;justify-content:space-around;margin-top:64px">${phone('s-food', .95)}${phone('s-sleep', .95)}${phone('s-water', .95)}</div></div>`)
// gym: the QR card, then the three states a class can be in, each with its note
const gym = add('m-gym', `<div class="plate flow" style="padding:48px">${head('03 · Gym', 'Check in and book a class', 'Show your QR at the desk. Each class shows how many spots are left, so you know what to do.')}
  <div style="display:flex;align-items:center;gap:40px;margin-top:48px;padding-left:20px"><div class="stg">${comp('#s-gymact .qrc', 300, 1.35)}</div>${arw}
   <div style="display:flex;flex-direction:column;gap:22px">${[['@0', 'Spots left: book it'], ['@1', 'Full: join the waitlist'], ['@2', 'Booked: you are in']].map(([n, t], k) => `<div style="display:flex;align-items:center;gap:0"><div class="stg g${k}">${comp('#s-gymev .cls' + n, 390, 1.3)}</div><span style="width:70px;border-top:3px dashed #9B93BE;margin-left:-6px;position:relative"><i style="position:absolute;left:-8px;top:-10px;width:16px;height:16px;border-radius:50%;background:#644ACD;box-shadow:0 0 0 4px #fff"></i></span><span class="pill" style="position:relative">${t}</span></div>`).join('')}</div></div></div>`)
gym._links = () => {}
document.querySelectorAll('.phone').forEach(p => { const sc = document.getElementById(p.dataset.s).cloneNode(true); sc.removeAttribute('id'); p.querySelector('.scr').appendChild(sc) })
document.querySelectorAll('.comp').forEach(c => c.dataset.c.split(',').forEach(sel => { const [q, n] = sel.trim().split('@'); const src = document.querySelectorAll('#lib ' + q)[+(n || 0)]; if (!src) { console.log('missing', sel); return } const z = document.createElement('div'); z.className = 'z'; z.style.cssText = 'background:transparent;overflow:visible;width:100%'; const cl = src.cloneNode(true); cl.style.margin = '0'; if (cl.classList.contains('cta')) cl.style.background = 'transparent'; z.appendChild(cl); c.appendChild(z) }))
// shrink a row's components together if the row is wider than the plate
document.querySelectorAll('.flow .row').forEach(r => { const avail = r.parentElement.clientWidth - 96; if (r.scrollWidth > avail) { const k = (avail - 28 * 8) / ([...r.querySelectorAll('.comp')].reduce((a, c) => a + c.getBoundingClientRect().width, 0)); r.querySelectorAll('.comp').forEach(c => c.style.zoom = (+c.style.zoom) * Math.min(1, k)) } })
Promise.all([document.fonts.ready, ...[...document.images].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r }))]).then(() => { F.forEach(m => m._links(m.querySelector('.flow'))); window.READY = true })
})()
