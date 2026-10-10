// Module layout (same system as Pulsefit v2): a bento row of a short text tile and whole components, then the full screen.
(function(){
const M = document.getElementById('mods')
const i = P.i
const FLOW = ['Hosts', 'Keys', 'Terminal', 'Sessions']
const tile = (step, title, desc, at) => `<div class="tile"><div class="ts">${step}</div><div><h3>${title}</h3><p>${desc}</p></div>${at !== undefined ? `<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:auto">${FLOW.map((f, k) => `${k ? `<span style="color:rgba(255,255,255,.45)">${i('chevR', 'width:12px;height:12px')}</span>` : ''}<span style="height:26px;padding:0 10px;border-radius:13px;font:600 12.5px/26px Inter;${k === at ? 'background:#fff;color:#4C1D95' : 'background:rgba(255,255,255,.12);color:rgba(255,255,255,.8)'}">${f}</span>`).join('')}</div>` : ''}</div>`
const plate = (html, zoom = 1, st = '') => `<div class="plate cell" style="padding:44px;display:grid;place-items:center;${st}"><div style="zoom:${zoom}">${html}</div></div>`
const browser = (html, w) => `<div class="win" style="width:${w}px;border-radius:14px"><div class="fit" data-w="${w}"><div class="inner" style="width:${P.W}px">${html}</div></div></div>`
function mod(id, { cols = '340px 1fr', cells, frame, tab }) {
  const s = document.createElement('div')
  s.className = 'mod'; s.id = id
  s.innerHTML = `<div class="bento" style="grid-template-columns:${cols}">${cells.join('')}</div>${frame ? `<div class="plate bot" style="padding:44px;display:flex;justify-content:center">${browser(frame, 1432, tab)}</div>` : ''}`
  M.appendChild(s)
  return s
}
function line(box, a, b, mx) {
  let svg = box.querySelector('svg.links')
  if (!svg) { box.insertAdjacentHTML('beforeend', '<svg class="links" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:4"></svg>'); svg = box.querySelector('svg.links') }
  const d = mx === undefined ? `M${a.x} ${a.y} V${b.y}` : `M${a.x} ${a.y} H${mx} V${b.y} H${b.x}`
  svg.insertAdjacentHTML('beforeend', `<path d="${d}" fill="none" stroke="#8C93C8" stroke-width="3" stroke-dasharray="3 9" stroke-linecap="round"/><circle cx="${b.x}" cy="${b.y}" r="8" fill="#8B5CF6" stroke="#fff" stroke-width="4"/>`)
}
const rel = (box, el) => { const b = box.getBoundingClientRect(), r = el.getBoundingClientRect(); return { l: r.left - b.left, t: r.top - b.top, r: r.right - b.left, b: r.bottom - b.top, w: r.width, h: r.height } }

// ---------- 01 Logo ----------
function logoModule() {
  const s = document.createElement('div')
  s.className = 'mod'; s.id = 'm-logo'
  // the mark's own geometry (mark.svg, viewBox 5 10 84 80): rings r34 and r24.5 and the hub r13.5 around (42,50); nodes r7 at (80,27) and (80,73)
  const k = 7, ox = 5, oy = 10, X = x => (x - ox) * k, Y = y => (y - oy) * k
  const ang = Math.round(Math.atan2(23, 38) * 180 / Math.PI)
  const g = `<g fill="none" stroke="#7C86C4" stroke-width="2" stroke-dasharray="6 7" opacity=".8">
    ${[13.5, 24.5, 34].map(r => `<circle cx="${X(42)}" cy="${Y(50)}" r="${r * k}"/>`).join('')}
    <line x1="${X(-2)}" y1="${Y(50)}" x2="${X(96)}" y2="${Y(50)}"/><line x1="${X(42)}" y1="${Y(6)}" x2="${X(42)}" y2="${Y(94)}"/>
    <line x1="${X(42)}" y1="${Y(50)}" x2="${X(92)}" y2="${Y(50 - 50 * 23 / 38)}"/><line x1="${X(42)}" y1="${Y(50)}" x2="${X(92)}" y2="${Y(50 + 50 * 23 / 38)}"/>
    ${[[80, 27], [80, 73]].map(([x, y]) => `<circle cx="${X(x)}" cy="${Y(y)}" r="${7 * k + 14}"/>`).join('')}</g>
    <path d="M${X(42) + 120} ${Y(50)} A120 120 0 0 0 ${X(42) + 120 * Math.cos(ang * Math.PI / 180)} ${Y(50) - 120 * Math.sin(ang * Math.PI / 180)}" fill="none" stroke="#A9BCFF" stroke-width="2.5"/>`
  s.innerHTML = `<div class="plate" style="height:900px"><style>#m-logo .nb{position:absolute;height:36px;padding:0 14px;border-radius:18px;background:#fff;color:#14171F;font:600 17px/36px Inter;white-space:nowrap}#m-logo .cap{position:absolute;font:500 17px Inter;letter-spacing:.1em;text-transform:uppercase;color:#8C93C8}</style>
    <div class="cap" style="left:80px;top:64px">Mark construction</div>
    <div style="position:absolute;left:120px;top:150px;width:${84 * k}px;height:${80 * k}px"><img src="mark.svg" style="position:absolute;inset:0;width:100%;height:100%"><svg style="position:absolute;left:0;top:0;overflow:visible" width="${84 * k}" height="${80 * k}">${g}</svg></div>
    <div class="nb" style="left:${120 + X(42) + 130}px;top:${150 + Y(50) - 70}px">${ang}°</div>
    <div class="nb" style="left:70px;top:${150 + 80 * k + 20}px">Security ring</div>
    <div class="nb" style="left:${120 + X(42) - 40}px;top:${150 + Y(50) + 120}px">Hub</div>
    <div class="nb" style="left:${120 + X(80) + 70}px;top:${150 + Y(27) - 18}px">Connections</div>
    <div style="position:absolute;left:940px;top:0;bottom:0;border-left:2px dashed rgba(140,147,200,.35)"></div>
    <div class="cap" style="left:1000px;top:64px">Clear space</div>
    <div style="position:absolute;left:1080px;top:300px;width:300px;height:280px;outline:2px dashed #7C86C4">
      <div style="position:absolute;left:56px;top:56px;right:56px;bottom:56px;display:flex;align-items:center;outline:1.5px dashed rgba(140,147,200,.4);justify-content:center"><img src="mark.svg" style="width:128px;height:128px"></div>
      <div class="nb" style="left:12px;top:12px;height:30px;line-height:30px;font-size:15px">x</div><div class="nb" style="right:12px;bottom:12px;height:30px;line-height:30px;font-size:15px">x</div></div>
    <div class="nb" style="left:1080px;top:620px">x = the hub's width</div></div>`
  M.appendChild(s)
}

logoModule()
mod('m-hosts', {
  cols: '340px 1fr 1fr',
  cells: [tile('01 · Hosts', 'All servers as cards', 'Each card shows a server, its IP and status. Click Connect to open it.', 0), plate(`<div style="display:flex;flex-direction:column;gap:20px">${P.HOSTS2.slice(0, 2).map(h => P.hostCard(h, 330)).join('')}</div>`, 1.05, 'padding:36px'), plate(P.newHost2().replace('height:100%', 'height:740px;border-radius:18px;border:0;box-shadow:inset 0 0 0 1px #2A2A31'), .8, 'padding:28px')],
  frame: P.hostsFrame2(),
})
mod('m-health', {
  cols: '340px 1fr',
  cells: [tile('01 · Hosts', 'Check a server\'s health', 'A host opens on its stats: info, network and security checks.', 0), plate(`<div style="display:grid;grid-template-columns:600px 520px;gap:20px;align-items:start">${P.netCard2()}${P.security2()}</div>`, .92, 'padding:32px')],
  frame: P.overviewFrame2(),
})
const key = mod('m-keys', {
  cols: '1fr',
  cells: [`<div class="plate cell flow" style="padding:48px 44px 130px;display:grid;grid-template-columns:445px 445px 445px;justify-content:space-between">
    <div style="display:flex;flex-direction:column;gap:24px" class="kcol">${tile('02 · Keys', 'Send a key to a server', 'Pick a host and export your key. Each step shows until it connects.', 1)}<div class="kp" style="zoom:.766">${P.kSelect()}</div></div>
    <div class="kp">${P.kExport()}</div><div class="kp">${P.kDone()}</div>
    ${['Pick the host', 'Check where the key goes', 'Log in without a password'].map((t, k) => `<span class="pill q${k}" style="position:absolute;bottom:44px">${t}</span>`).join('')}</div>`],
})
key._links = box => {
  const panels = [...box.querySelectorAll('.kp')]
  panels.forEach((p, k) => {
    const r = rel(box, p.firstElementChild), pill = box.querySelector('.q' + k)
    pill.style.left = (r.l + r.w / 2 - pill.offsetWidth / 2) + 'px'
    const pr = rel(box, pill)
    line(box, { x: r.l + r.w / 2, y: pr.t }, { x: r.l + r.w / 2, y: r.b })
    if (k < panels.length - 1) {
      const n = rel(box, panels[k + 1].firstElementChild), y = n.t + n.h / 2
      box.insertAdjacentHTML('beforeend', `<span style="position:absolute;left:${(Math.max(r.r, 0) + n.l) / 2 - 20}px;top:${y - 20}px;width:40px;height:40px;border-radius:50%;background:#fff;color:#6D28D9;display:grid;place-items:center;z-index:5;box-shadow:0 10px 24px -10px rgba(0,0,0,.6)">${i('arrowR', 'width:18px;height:18px;stroke-width:2.4')}</span>`)
    }
  })
}
mod('m-term', {
  cols: '340px 1fr 1fr',
  cells: [tile('03 · Terminal', 'Run saved commands', 'Saved commands sit beside the terminal. Open one and click Run, or ask AI.', 2), plate(P.termPanel('cmd'), .9, 'padding:30px'), plate(P.askAI2(), .9, 'padding:30px')],
  frame: P.termFrame2(),
})
mod('m-sessions', {
  cols: '340px 1fr',
  cells: [tile('04 · Sessions', 'See who is connected', 'This table lists open sessions with device, location and key.', 3), plate(P.sessions2(), 1.04, 'padding:36px')],
})

Promise.all([document.fonts.ready, ...[...document.images].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r }))]).then(() => {
  document.querySelectorAll('.fit').forEach(f => {
    const w = +f.dataset.w, inner = f.firstElementChild, s = w / P.W
    inner.style.transform = `scale(${s})`
    f.style.height = Math.ceil(inner.offsetHeight * s) + 'px'
  })
  key._links(key.querySelector('.flow'))
  window.READY = true
})
})()
