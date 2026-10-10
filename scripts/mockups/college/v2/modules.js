// College group ERP modules: problem first (the old screens), then the redesign, in the Pulsefit v2 layout.
(function(){
const M = document.getElementById('mods')
const i = P.i
const tile = (step, title, desc) => `<div class="tile"><div class="ts">${step}</div><div><h3>${title}</h3><p>${desc}</p></div></div>`
const browser = (html, w, iw = 1440) => `<div class="win" style="width:${w}px"><div class="fit" data-w="${w}" data-iw="${iw}"><div class="inner" style="width:${iw}px">${html}</div></div></div>`
const img = (src, w, st = '') => `<img src="${src}" style="display:block;width:${w}px;border-radius:12px;box-shadow:0 0 0 1px rgba(15,23,42,.08),0 24px 50px -30px rgba(11,31,58,.4);${st}">`
function line(box, a, b, mx) {
  let svg = box.querySelector('svg.links')
  if (!svg) { box.insertAdjacentHTML('beforeend', '<svg class="links" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:4"></svg>'); svg = box.querySelector('svg.links') }
  const d = mx === undefined ? (a.y === b.y || a.x === b.x ? `M${a.x} ${a.y} L${b.x} ${b.y}` : `M${a.x} ${a.y} V${(a.y + Math.min(b.y, a.y + 60))} H${b.x} V${b.y}`) : `M${a.x} ${a.y} H${mx} V${b.y} H${b.x}`
  svg.insertAdjacentHTML('beforeend', `<path d="${d}" fill="none" stroke="#94A3B8" stroke-width="3" stroke-dasharray="3 9" stroke-linecap="round"/><circle cx="${b.x}" cy="${b.y}" r="8" fill="${a.c || '#1D4ED8'}" stroke="#fff" stroke-width="4"/>`)
}
const rel = (box, el) => { const b = box.getBoundingClientRect(), r = el.getBoundingClientRect(); return { l: r.left - b.left, t: r.top - b.top, r: r.right - b.left, b: r.bottom - b.top, w: r.width, h: r.height } }
const add = (id, html) => { const s = document.createElement('div'); s.className = 'mod'; s.id = id; s.innerHTML = html; M.appendChild(s); return s }

// 01 The problem: the old finance screens
const prob = add('m-problem', `<div class="plate flow" style="height:1280px">
  <div style="position:absolute;left:48px;top:470px;width:420px">${tile('01 · Before', 'The old system', 'Each college had its own page. Group data sat in a 28-column Excel sheet.')}</div>
  <div class="o1" style="position:absolute;right:48px;top:48px">${img('old-stats.png', 960)}</div>
  <div class="o2" style="position:absolute;left:48px;right:48px;top:800px">${img('old-sheet.png', 1424)}</div>
  <span class="pill bad n1" style="position:absolute;left:48px">No group view: one college at a time</span>
  <span class="pill bad n3" style="position:absolute;left:48px">Totals with no target to read them against</span>
  <span class="pill bad n2" style="position:absolute;left:48px">Programmes mixed, hard to compare</span>
  <span class="pill bad n4" style="position:absolute;left:48px;top:736px">Group data in Excel: hard to analyse</span></div>`)
prob._links = box => {
  const o1 = rel(box, box.querySelector('.o1 img')), o2 = rel(box, box.querySelector('.o2 img')), s = o1.w / 1440
  ;[['.n1', 330, 46], ['.n3', 700, 196], ['.n2', 130, 601]].forEach(([sel, x, y]) => { const el = box.querySelector(sel); el.style.top = (o1.t + y * s - 22) + 'px'; const p = rel(box, el); line(box, { x: p.r, y: p.t + p.h / 2, c: '#EF4444' }, { x: o1.l + x * s, y: p.t + p.h / 2 }, o1.l + x * s) })
  const p4 = rel(box, box.querySelector('.n4')); line(box, { x: p4.r, y: p4.t + p4.h / 2, c: '#EF4444' }, { x: o2.l + 760, y: o2.t + 70 }, o2.l + 760)
}

// 02 The group dashboard
add('m-dash', `<div class="bento" style="grid-template-columns:340px 1fr">${tile('02 · After', 'One view of every college', 'The group dashboard shows money received against the target, and which college lags.')}
  <div class="plate" style="padding:40px;display:grid;place-items:center"><div style="width:1020px">${P.banner('Consolidated finances', 'Vertex Group · 5 colleges', 112, 93.8, .42)}</div></div></div>
  <div class="plate bot" style="padding:44px;display:flex;justify-content:center">${browser(P.dashboard(), 1432)}</div>`)

// 03 Drill-down in stacked drawers (the main idea)
const node = (lvl, name, meta, on, last) => `<div class="hn" style="flex:1;border-radius:18px;padding:16px 20px;${on ? 'background:#0B1F3A;color:#fff' : 'background:#fff;box-shadow:0 0 0 1px #DCE3EC'}"><div style="font:600 12px Inter;letter-spacing:.08em;text-transform:uppercase;color:${on ? '#5EEAD4' : '#64748B'}">${lvl}</div><div style="font:600 18px Inter;margin-top:6px">${name}</div><div style="font:400 14px Inter;margin-top:3px;color:${on ? '#C7D4E8' : '#64748B'}">${meta}</div></div>`
const arrow = `<span style="flex:none;color:#64748B;align-self:center">${i('chevR', 'width:26px;height:26px;stroke-width:2.4')}</span>`
const drill = add('m-drill', `<div class="plate flow" style="padding:48px">
  <div class="tile" style="flex-direction:row;align-items:flex-end;gap:48px;padding:34px 40px"><div style="flex:none"><div class="ts" style="margin-bottom:14px">03 · Drill down</div><h3>See it by level, group to batch</h3></div><p style="margin:0 0 0 auto;max-width:600px">Pick a college to see its programmes. Pick a programme to see its batches. Each level opens as a drawer on top.</p></div>
  <div style="display:flex;gap:12px;margin-top:24px">${node('Group', 'Vertex Group', '5 colleges · ₹93.8 Cr received')}${arrow}${node('College', 'Vertex Law College', '4 programmes · 67.2% collected', 1)}${arrow}${node('Programme', 'BA LLB', '4 batches · 58.7% collected', 1)}${arrow}${node('Batch', '2025 batch', '120 students · 33.3% collected')}</div>
  ${['The strip names the level behind', 'Each level opens as a drawer on top', 'Every level starts with its overview', 'Same columns, so programmes compare'].map((t, k) => `<span class="pill q${k}" style="position:absolute">${t}</span>`).join('')}
  <div class="sc" style="margin-top:150px">${browser(P.stack(), 1424)}</div></div>`)
drill._links = box => {
  const sc = rel(box, box.querySelector('.sc .inner')), s = sc.w / 1440, top = rel(box, box.querySelectorAll('.hn')[0])
  const T = [[218, 520, 0], [700, 22, 1], [900, 200, 0], [1200, 568, 1]]
  T.forEach(([x, y, row], k) => {
    const el = box.querySelector('.q' + k), tx = sc.l + x * s
    el.style.left = Math.max(48, Math.min(box.clientWidth - 48 - el.offsetWidth, tx - el.offsetWidth / 2)) + 'px'
    el.style.top = (top.b + 22 + row * 62) + 'px'
    const p = rel(box, el)
    line(box, { x: tx, y: p.b }, { x: tx, y: sc.t + y * s })
  })
}

// 04 Staff attendance, before and after
const ba = (id, step, title, desc, before, after, notes, flip) => { const m = add(id, `<div class="bento" style="grid-template-columns:${flip ? '1fr 540px' : '540px 1fr'}"><div style="display:flex;flex-direction:column;gap:24px;${flip ? 'order:2' : ''}">${tile(step, title, desc)}<div class="plate" style="flex:1;padding:44px 28px 28px;display:grid;place-items:center"><div style="position:relative">${img(before, 480, 'filter:saturate(.6);opacity:.92')}<span class="chip b" style="left:-10px;top:-17px">Before</span></div></div></div>
  <div class="plate flow" style="padding:${48 + 140}px 40px 40px"><div class="af" style="position:relative">${browser(after, 896)}<span class="chip a" style="left:-10px;top:-17px">After</span></div>
   ${notes.map(([t], k) => `<span class="pill good r${k}" style="position:absolute">${t}</span>`).join('')}</div></div>`)
  m._links = box => { const f = rel(box, box.querySelector('.af .inner')), s = f.w / 1440
    notes.forEach(([t, x, y, row], k) => { const el = box.querySelector('.r' + k), tx = f.l + x * s; el.style.left = Math.max(40, Math.min(box.clientWidth - 40 - el.offsetWidth, tx - el.offsetWidth / 2)) + 'px'; el.style.top = (40 + row * 62) + 'px'; const p = rel(box, el); line(box, { x: tx, y: p.b, c: '#10B981' }, { x: tx, y: f.t + y * s }) }) }
  return m }
const staff = ba('m-staff', '04 · Staff', 'Staff attendance', 'Before: one long list. After: status tabs with counts, and filters by college, department and division.', 'old-staff.png', P.attendance(), [['Status tabs with counts', 560, 244, 0], ['Filter by college, department and division', 1283, 320, 1]])
const settle = ba('m-settle', '05 · Settlements', 'Settlements', 'Before: one long list. After: tabs by status, search, and late ones stand out.', 'old-settle.png', P.settlements(), [['Tabs by status, with counts', 443, 300, 0], ['Search by number or bank reference', 800, 368, 1], ['Late settlements stand out', 1280, 465, 0]], 1)

Promise.all([document.fonts.ready, ...[...document.images].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r }))]).then(() => {
  document.querySelectorAll('.fit').forEach(f => {
    const w = +f.dataset.w, iw = +f.dataset.iw, inner = f.firstElementChild, s = w / iw
    inner.style.transform = `scale(${s})`
    f.style.height = Math.ceil(inner.offsetHeight * s) + 'px'
  })
  prob._links(prob.querySelector('.flow')); drill._links(drill.querySelector('.flow')); staff._links(staff.querySelector('.plate.flow')); settle._links(settle.querySelector('.plate.flow'))
  window.READY = true
})
})()
