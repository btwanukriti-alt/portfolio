// Zync modules: the rebuilt screens (../screens.html, loaded into #lib) placed in phones and bento rows.
(function(){
const M = document.getElementById('mods')
const ICON = { chevR: '<path d="m9 6 6 6-6 6"/>' }
const i = (n, st = '') => `<svg class="i" viewBox="0 0 24 24"${st ? ` style="${st}"` : ''}>${ICON[n]}</svg>`
const tile = (step, title, desc) => `<div class="tile"><div class="ts">${step}</div><div><h3>${title}</h3><p>${desc}</p></div></div>`
const phone = (id, z = 1) => `<div class="phone" data-s="${id}" style="zoom:${z}"><span class="isl"></span><div class="scr"></div></div>`
const comp = (sel, w, z = 1) => `<div class="comp" data-c="${sel}" style="width:${w}px;zoom:${z}"></div>`
const plate = (html, st = '') => `<div class="plate" style="padding:44px;display:flex;gap:36px;justify-content:center;align-items:center;${st}">${html}</div>`
const add = (id, html) => { const s = document.createElement('div'); s.className = 'mod'; s.id = id; s.innerHTML = html; M.appendChild(s); return s }
const arw = `<span class="arw">${i('chevR', 'width:20px;height:20px;stroke-width:2.4')}</span>`
function line(box, a, b) {
  let svg = box.querySelector('svg.links')
  if (!svg) { box.insertAdjacentHTML('beforeend', '<svg class="links" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:4"></svg>'); svg = box.querySelector('svg.links') }
  svg.insertAdjacentHTML('beforeend', `<path d="M${a.x} ${a.y} L${b.x} ${b.y}" fill="none" stroke="#9B93BE" stroke-width="3" stroke-dasharray="3 9" stroke-linecap="round"/><circle cx="${b.x}" cy="${b.y}" r="8" fill="#644ACD" stroke="#fff" stroke-width="4"/>`)
}
const rel = (box, el) => { const b = box.getBoundingClientRect(), r = el.getBoundingClientRect(); return { l: r.left - b.left, t: r.top - b.top, r: r.right - b.left, b: r.bottom - b.top, w: r.width, h: r.height } }

add('m-overview', `<div class="bento" style="grid-template-columns:340px 1fr">${tile('01 · Zync', 'A gym member\'s app', 'Track your day, log meals, water and sleep, book classes and follow workout plans.')}
  ${plate(phone('s-signup', .9) + phone('s-home', .9) + phone('s-wo', .9))}</div>`)
add('m-home', `<div class="bento" style="grid-template-columns:340px 1fr 1fr">${tile('02 · Home', 'Your day on one screen', 'Calories burned against the goal, steps, BMI and your next class, all on Home.')}
  ${plate(comp('#s-home .card2', 390, 1.25))}${plate(phone('s-home', .95))}</div>`)
const log = add('m-log', `<div class="plate flow" style="padding:48px">
  <div class="tile" style="flex-direction:row;align-items:flex-end;gap:48px;padding:34px 40px"><div style="flex:none"><div class="ts" style="margin-bottom:14px">03 · Log</div><h3>Log food, water and sleep</h3></div><p style="margin:0 0 0 auto;max-width:560px">Tap + on Home and pick what to log. Each log shows today against its goal, and the week.</p></div>
  <div style="display:flex;align-items:center;justify-content:space-between;margin-top:40px">${phone('s-log', .74)}${arw}${phone('s-food', .74)}${arw}${phone('s-water', .74)}${arw}${phone('s-sleep', .74)}</div>
  <div class="pl" style="height:110px"></div>
  ${['Pick what to log', 'Meals add up to the day', 'Add water by glass size', 'Sleep shows the whole week'].map((t, k) => `<span class="pill q${k}" style="position:absolute">${t}</span>`).join('')}</div>`)
log._links = box => { const ph = [...box.querySelectorAll('.phone')]; ph.forEach((p, k) => { const r = rel(box, p), el = box.querySelector('.q' + k); el.style.left = (r.l + r.w / 2 - el.offsetWidth / 2) + 'px'; el.style.top = (r.b + 46) + 'px'; line(box, { x: r.l + r.w / 2, y: r.b + 46 }, { x: r.l + r.w / 2, y: r.b - 6 }) }) }
add('m-gym', `<div class="bento" style="grid-template-columns:340px 1fr 1fr">${tile('04 · Gym', 'Check in and book a class', 'Show your QR at the desk. Book a class, or join the waitlist when it is full.')}
  ${plate(phone('s-gymact', .95))}${plate(phone('s-gymev', .95))}</div>`)
add('m-workout', `<div class="bento" style="grid-template-columns:340px 1fr 1fr">${tile('05 · Workout', 'Follow a workout plan', 'Pick a plan, see every exercise in it, then start the workout.')}
  ${plate(phone('s-wo', .95))}${plate(phone('s-wd', .95))}</div>`)

// fill phones and components with clones of the screens
document.querySelectorAll('.phone').forEach(p => { const s = document.getElementById(p.dataset.s).cloneNode(true); s.removeAttribute('id'); p.querySelector('.scr').appendChild(s) })
document.querySelectorAll('.comp').forEach(c => { const src = document.querySelector('#lib ' + c.dataset.c).cloneNode(true); const z = document.createElement('div'); z.className = 'z'; z.style.cssText = 'background:transparent;overflow:visible;width:100%'; z.appendChild(src); c.appendChild(z) })
Promise.all([document.fonts.ready, ...[...document.images].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r }))]).then(() => { log._links(log.querySelector('.flow')); window.READY = true })
})()
