// College group ERP v2: her new screens rebuilt with placeholder names (Vertex Group) and figures that add up.
(function(){
const P = {}; window.P = P
const IC = {
  home: '<path d="M3 11 12 3l9 8v10h-6v-6H9v6H3z"/>', money: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M7 9v.01M17 15v.01"/>',
  staff: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/>', bank: '<path d="m3 10 9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/>',
  report: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>', chev: '<path d="m6 9 6 6 6-6"/>', chevR: '<path d="m9 6 6 6-6 6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>', gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>', alert: '<path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3"/><path d="M12 9v4M12 17h.01"/>',
  college: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>', book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5V21h16"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>', down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>', check: '<path d="M20 6 9 17l-5-5"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', cap: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M22 9v6"/>',
}
const i = (n, st = '') => `<svg class="i" viewBox="0 0 24 24"${st ? ` style="${st}"` : ''}>${IC[n]}</svg>`
P.i = i
const AVC = [['#E0E7FF', '#3730A3'], ['#DCFCE7', '#166534'], ['#FEF3C7', '#92400E'], ['#FCE7F3', '#9D174D'], ['#E0F2FE', '#075985']]
const av = (n, sm) => { const [b, c] = AVC[[...n].reduce((a, ch) => a + ch.charCodeAt(0), 0) % 5]; return `<span class="av${sm ? ' sm' : ''}" style="background:${b};color:${c}">${n.split(' ').map(s => s[0]).join('').slice(0, 2)}</span>` }
P.av = av
const cr = v => '₹' + v.toFixed(v < 10 ? 2 : 1).replace(/\.?0+$/, m => m.length > 1 ? (v < 10 ? '.00'.slice(0, m.length) : '') : '') + ' Cr'
const crs = v => '₹' + v.toFixed(1) + ' Cr'
const pc = (r, e) => Math.round(r / e * 1000) / 10
const pcls = p => p >= 85 ? 'p-g' : p >= 70 ? 'p-a' : 'p-r'
P.crs = crs

// ---- data: every level adds up to the one above ----
const COLL = [['Vertex Engineering College', 42.0, 37.3, .14], ['Vertex Arts & Management', 24.0, 20.8, .08], ['Vertex Law College', 18.0, 12.1, .06], ['Vertex Science College', 12.0, 10.6, .05], ['Vertex Medical College', 16.0, 13.0, .09]]
const LAW = [['LLB', 6.0, 4.5], ['BA LLB', 7.5, 4.4], ['LLM', 3.0, 2.1], ['PhD (Law)', 1.5, 1.1]]
const BALLB = [['BA LLB · 2022 batch', 1.7, 1.5], ['BA LLB · 2023 batch', 1.8, 1.2], ['BA LLB · 2024 batch', 1.9, 1.0], ['BA LLB · 2025 batch', 2.1, 0.7]]
P.COLL = COLL

// ---- shell ----
const NAV = [['home', 'Dashboard'], ['money', 'Finance', ['Financial overview', 'Revenue contribution', 'Settlements']], ['staff', 'Staff', ['Staff overview', 'Attendance', 'Staff details']], ['bank', 'Banking'], ['report', 'Reports']]
P.shell = (active, sub, content, st = '') => `<div class="app u" style="${st}"><aside class="side"><div class="brand"><span class="lg">VG</span><div><b>Vertex Group</b><small>of Institutions</small></div></div>
  ${NAV.map(([ic, n, subs]) => { const on = n === active; return `<div class="it${on ? ' on' : ''}">${i(ic)}${n}<span class="chev">${i(on && subs ? 'chev' : 'chevR', 'width:15px;height:15px')}</span></div>${on && subs ? `<div class="sub">${subs.map(s => `<span class="${s === sub ? 'on' : ''}">${s}</span>`).join('')}</div>` : ''}` }).join('')}</aside>
  <div class="main"><div class="topi"><span class="ib b">${i('search')}</span><span class="ib">${i('bell')}<span class="bd">2</span></span><span class="ib">${i('gear')}</span>${av('Nisha Rao')}</div>${content}</div></div>`

// ---- summary banner (same at every level) ----
P.banner = (title, sub, exp, rec, fines, extra = '') => {
  const p = pc(rec, exp)
  return `<div class="banner u"><div style="display:flex;align-items:flex-start;gap:18px"><div><div style="font-size:13px;color:#9FB3D1">${sub}</div><div style="font-size:16px;font-weight:600;margin-top:2px">${title}</div></div>${extra}</div>
  <div style="display:flex;align-items:flex-end;gap:30px;margin-top:22px"><div><div style="font-size:12.5px;color:#9FB3D1">Received</div><div style="font-size:34px;font-weight:650;letter-spacing:-.02em;margin-top:2px">${crs(rec)}</div></div>
   <div style="flex:1;padding-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:12.5px;color:#C7D4E8;margin-bottom:8px"><span><b style="color:#5EEAD4">${p}%</b> collected</span><span>Target ${crs(exp)}</span></div><div class="prog"><i style="width:${p}%"></i></div></div></div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px">${[['Pending', crs(exp - rec), '#FCA5A5'], ['Expected', crs(exp), '#fff'], ['Fines collected', fines < 1 ? '₹' + (fines * 100).toFixed(1) + ' L' : crs(fines), '#fff']].map(([l, v, c]) => `<div style="border-radius:12px;background:rgba(255,255,255,.06);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);padding:12px 16px"><div style="font-size:12px;color:#9FB3D1">${l}</div><div style="font-size:17px;font-weight:600;margin-top:4px;color:${c}">${v}</div></div>`).join('')}</div></div>`
}
// lowest row named under the banner
const lowest = (rows, unit) => { const r = rows.slice().sort((a, b) => a[2] / a[1] - b[2] / b[1])[0]; return `<div class="card u" style="display:flex;align-items:center;gap:14px;padding:14px 18px;background:#FFF8F1;box-shadow:0 0 0 1px #FCE3C2"><span style="width:34px;height:34px;border-radius:10px;background:#FEF3C7;color:#B45309;display:grid;place-items:center">${i('alert', 'width:17px;height:17px')}</span><div><div style="font-weight:600;font-size:14px">Lowest collection: ${r[0]}</div><div style="font-size:12.5px;color:#92400E;margin-top:2px">${crs(r[1] - r[2])} pending · ${Math.round(pc(r[2], r[1]))}% collected</div></div><span style="margin-left:auto;font-size:12.5px;font-weight:600;color:#B45309">Open ${unit}</span></div>` }
P.lowest = lowest
// the same columns at every level
P.levelTable = (rows, ic, first, open = -1) => { const lo = rows.slice().sort((a, b) => a[2] / a[1] - b[2] / b[1])[0][0]; return `<div class="card u" style="overflow:hidden"><table class="tbl"><tr><th>${first}</th><th class="r">Received</th><th class="r">Expected</th><th class="r">Pending</th><th style="width:240px">Collection</th><th></th></tr>
  ${rows.map(([n, e, r], k) => { const p = pc(r, e); return `<tr class="${n === lo ? 'low' : ''}"${k === open ? ' style="box-shadow:inset 3px 0 0 #1D4ED8"' : ''}><td><div style="display:flex;align-items:center;gap:12px"><span style="width:34px;height:34px;border-radius:10px;background:${n === lo ? '#FEF3C7' : '#EEF2FF'};color:${n === lo ? '#B45309' : '#3730A3'};display:grid;place-items:center">${i(ic, 'width:17px;height:17px')}</span><span class="lk"${n === lo ? ' style="color:#B45309"' : ''}>${n}</span></div></td><td class="r" style="font-weight:600">${crs(r)}</td><td class="r">${crs(e)}</td><td class="r" style="color:#B91C1C">${crs(e - r)}</td>
   <td><div style="display:flex;align-items:center;gap:12px"><div style="flex:1;height:6px;border-radius:3px;background:#EEF2F7"><div style="height:6px;border-radius:3px;width:${p}%;background:${p >= 85 ? '#10B981' : p >= 70 ? '#F59E0B' : '#EF4444'}"></div></div><span class="pct ${pcls(p)}">${p}%</span></div></td><td class="r" style="color:var(--mut)">${i('chevR')}</td></tr>` }).join('')}</table></div>` }

// ---- group dashboard ----
P.dashboard = () => {
  const r1 = v => Math.round(v * 100) / 100, exp = r1(COLL.reduce((a, c) => a + c[1], 0)), rec = r1(COLL.reduce((a, c) => a + c[2], 0)), fines = r1(COLL.reduce((a, c) => a + c[3], 0))
  const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], cum = [8, 21, 35, 46, 55, 63, 70, 79, 87, 93.8], tgt = months.map((m, k) => 112 * (k + 1) / months.length)
  const W = 640, H = 210, X = k => k / (months.length - 1) * W, Y = v => H - v / 120 * H
  const line = arr => 'M' + arr.map((v, k) => `${X(k).toFixed(1)} ${Y(v).toFixed(1)}`).join(' L')
  const chart = `<svg width="100%" viewBox="0 0 ${W} ${H + 24}"><defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#10B981" stop-opacity=".25"/><stop offset="1" stop-color="#10B981" stop-opacity="0"/></linearGradient></defs>${[0, 30, 60, 90, 120].map(v => `<line x1="0" x2="${W}" y1="${Y(v)}" y2="${Y(v)}" stroke="#EEF2F7"/><text x="0" y="${Y(v) - 4}" font-size="10" fill="#94A3B8" font-family="Inter">${v}</text>`).join('')}<path d="${line(cum)} L${W} ${H} L0 ${H}Z" fill="url(#ga)"/><path d="${line(cum)}" fill="none" stroke="#10B981" stroke-width="2.5"/><path d="${line(tgt)}" fill="none" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="5 5"/>${months.map((m, k) => `<text x="${X(k)}" y="${H + 18}" font-size="11" fill="#94A3B8" text-anchor="${k ? k === months.length - 1 ? 'end' : 'middle' : 'start'}" font-family="Inter">${m}</text>`).join('')}</svg>`
  const effic = COLL.slice().sort((a, b) => b[2] / b[1] - a[2] / a[1]).map(([n, e, r]) => { const p = pc(r, e); return `<div><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:7px"><span><b style="font-weight:600">${n.replace('Vertex ', '')}</b> <span style="color:var(--mut)">${crs(r)} / ${crs(e)}</span></span><b style="color:${p >= 85 ? '#047857' : p >= 70 ? '#B45309' : '#B91C1C'}">${p}%</b></div><div style="height:8px;border-radius:4px;background:#EEF2F7"><div style="height:8px;border-radius:4px;width:${p}%;background:${p >= 85 ? '#10B981' : p >= 70 ? '#F59E0B' : '#EF4444'}"></div></div></div>` }).join('')
  const alerts = [['Receipt cancelled', 'p-r', 'Receipt #RCP-08432 cancelled', 'Wrong amount entered. ₹11,000 · Vertex Engineering'], ['Fee updated', 'p-a', 'Fee reduced for a concession', '₹20,000 → ₹17,000 · Vertex Law College'], ['Settlement late', 'p-r', 'Settlement #58210447 is 2 days late', '₹48,600 · due 05 Jan']].map(([t, c, h, d]) => `<div style="padding:14px 0;border-top:1px solid var(--line)"><span class="tag ${c}" style="height:22px;font-size:11.5px">${t}</span><div style="font-weight:600;margin-top:8px">${h}</div><div style="font-size:12.5px;color:var(--t2);margin-top:3px">${d}</div></div>`).join('')
  return P.shell('Finance', 'Financial overview', `
   <div class="card hd"><h2>Finance dashboard</h2><span style="margin-left:auto;display:flex;gap:10px"><span class="sel">${i('cal')}AY 2025–26${i('chev', 'color:var(--mut)')}</span><span class="btn s">${i('filter')}Filters</span></span></div>
   ${P.banner('Consolidated finances', 'Vertex Group · 5 colleges', exp, rec, fines)}
   <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:20px"><div class="card" style="padding:20px 22px"><div style="display:flex;align-items:center"><b style="font-size:15px">Collection progress</b><span style="margin-left:auto;display:flex;gap:16px;font-size:12px;color:var(--t2)"><span style="display:flex;align-items:center;gap:6px"><span style="width:14px;height:3px;background:#10B981;border-radius:2px"></span>Received</span><span style="display:flex;align-items:center;gap:6px"><span style="width:14px;border-top:2px dashed #94A3B8"></span>Target</span></span></div><div style="margin-top:14px">${chart}</div></div>
    <div class="card" style="padding:20px 22px 6px"><div style="display:flex;align-items:center;gap:8px"><span style="color:#F59E0B">${i('alert')}</span><b style="font-size:15px">Alerts</b><span class="tag" style="margin-left:auto;background:#F1F5F9;height:24px">All colleges</span></div><div style="margin-top:12px">${alerts}</div></div></div>
   <div class="card" style="padding:20px 22px;display:flex;flex-direction:column;gap:16px"><div style="display:flex;align-items:center"><b style="font-size:15px">Collection by college</b><span style="margin-left:auto;font-size:12.5px;color:var(--mut)">Received against expected</span></div>${effic}</div>
   <div class="card" style="overflow:hidden"><div class="hd"><h2 style="font-size:16px">College-wise finances</h2><span style="margin-left:auto;font-size:12.5px;color:var(--mut)">Click a college to open it</span></div>${P.levelTable(COLL.map(c => c.slice(0, 3)), 'college', 'College').replace('<div class="card u" style="overflow:hidden">', '<div>')}</div>`)
}

// ---- drawers ----
// One drawer: a vertical strip naming the level behind it, a header, the same banner, the lowest row and the table.
P.drawer = (strip, ic, title, sub, rows, first, exp, rec, open) => `<div class="u" style="display:flex;height:100%;border-radius:18px 0 0 18px;overflow:hidden;box-shadow:-30px 0 60px -20px rgba(11,31,58,.45)">
  <div style="width:56px;flex:none;background:#DCE5F1;display:flex;align-items:center;justify-content:center"><span style="transform:rotate(-90deg);white-space:nowrap;font-weight:600;font-size:14px;color:#334155">${strip}</span></div>
  <div style="flex:1;background:#fff;padding:26px 30px;display:flex;flex-direction:column;gap:16px;min-width:0">
   <div style="display:flex;align-items:center;gap:14px"><span style="width:44px;height:44px;border-radius:12px;background:#EEF2FF;color:#3730A3;display:grid;place-items:center">${i(ic, 'width:20px;height:20px')}</span><div><div style="font-size:17px;font-weight:650">${title}</div><div style="font-size:12.5px;color:var(--mut)">${sub}</div></div><span style="margin-left:auto;color:var(--t2)">${i('x', 'width:22px;height:22px')}</span></div>
   ${P.banner(title, 'AY 2025–26 · year to date', exp, rec, exp * .004)}${lowest(rows, first.toLowerCase())}
   <div class="seg"><span class="on">${first === 'Batch' ? 'Batches' : first + 's'}</span><span>Fee heads</span></div>${P.levelTable(rows, first === 'Batch' ? 'users' : 'book', first, open)}</div></div>`
P.stack = () => {
  const law = COLL[2], prog = LAW[1]
  return `<div style="position:relative;width:1440px;height:1060px;overflow:hidden">${P.dashboard().replace('<div class="app u" style="">', '<div class="app u" style="height:1060px;overflow:hidden">')}
   <div style="position:absolute;inset:0;background:rgba(15,23,42,.38)"></div>
   <div style="position:absolute;left:190px;top:22px;right:0;bottom:-40px" class="d1">${P.drawer('All colleges', 'college', law[0], '4 programmes', LAW, 'Programme', law[1], law[2], 1)}</div>
   <div style="position:absolute;left:190px;top:22px;right:0;bottom:-40px;background:rgba(15,23,42,.22);border-radius:18px 0 0 18px"></div>
   <div style="position:absolute;left:390px;top:22px;right:0;bottom:-40px" class="d2">${P.drawer('Vertex Law College', 'book', prog[0], '4 batches', BALLB, 'Batch', prog[1], prog[2], -1)}</div></div>`
}
P.drawerLaw = () => `<div style="width:1150px;height:1000px">${P.drawer('All colleges', 'college', COLL[2][0], '4 programmes', LAW, 'Programme', COLL[2][1], COLL[2][2], 1)}</div>`

// ---- staff attendance (new) ----
const STAFF = [['Aarav Patel', 'Professor', 'Teaching', 'Vertex Engineering', 'Computer Science', '08:50', '17:00', '8h 10m', 'Present'], ['Meera Nair', 'Lab assistant', 'Non-teaching', 'Vertex Engineering', 'Chemistry lab', '08:55', '16:00', '7h 05m', 'Early'], ['Rohan Pillai', 'Admin officer', 'Management', 'Vertex Engineering', 'AI/ML', '', '', '', 'Absent'], ['Sunita Rao', 'Librarian', 'Non-teaching', 'Vertex Engineering', 'Library', '08:45', '17:05', '8h 20m', 'Present'], ['Vikram Iyer', 'Assistant professor', 'Teaching', 'Vertex Engineering', 'Mechanical', '10:50', '17:00', '6h 10m', 'Late'], ['Lakshmi Menon', 'Professor', 'Teaching', 'Vertex Engineering', 'CSE', '', '', '', 'On leave']]
const st = s => ({ Present: ['p-g', 'Present'], Early: ['p-a', 'Early check-out'], Late: ['p-a', 'Late'], Absent: ['p-r', 'Absent'], 'On leave': ['', 'On leave (CL)'] })[s]
P.attendance = () => P.shell('Staff', 'Attendance', `
  <div class="card hd"><h2>Attendance</h2><span style="margin-left:auto;display:flex;gap:10px"><span class="sel">${i('cal')}12 Jan 2026${i('chev', 'color:var(--mut)')}</span><span class="btn s">${i('filter')}Filters</span></span></div>
  <div class="seg card" style="padding:4px"><span>Attendance overview</span><span class="on" style="background:#F1F5F9;box-shadow:none">Staff list</span></div>
  <div class="card" style="overflow:hidden"><div class="tabs">${[['All', 1000, '#0F172A', '#fff'], ['Present', 800, '#047857', '#D1FAE5'], ['Absent', 78, '#B91C1C', '#FEE2E2'], ['On leave', 114, '#B45309', '#FEF3C7'], ['Late', 5, '#B45309', '#FFF6E3'], ['Early check-out', 3, '#B45309', '#FFF6E3']].map(([t, n, c, b], k) => `<span class="${k ? '' : 'on'}">${t}<b style="background:${k ? b : '#0F172A'};color:${k ? c : '#fff'}">${n}</b></span>`).join('')}</div>
   <div style="display:flex;gap:12px;padding:16px 22px"><div class="sel" style="flex:1;color:var(--mut)">${i('search')}Search staff</div>${[['College', 'Vertex Engineering'], ['Department', 'All'], ['Division', 'All']].map(([l, v]) => `<span class="sel" style="width:200px"><span style="color:var(--mut)">${l}</span> ${v}<span style="margin-left:auto;color:var(--mut)">${i('chev')}</span></span>`).join('')}</div>
   <table class="tbl"><tr><th>Name</th><th>Staff ID</th><th>Division</th><th>Department</th><th>Check in</th><th>Check out</th><th>Hours</th><th>Status</th></tr>
   ${STAFF.map(([n, r, dv, c, d, ci, co, h, s], k) => { const [cl, lab] = st(s); const off = !ci; return `<tr><td><div style="display:flex;align-items:center;gap:12px">${av(n)}<div style="font-weight:600">${n}<span class="sub2">${r}</span></div></div></td><td class="mono" style="color:var(--t2)">VG-${4120 + k * 37}</td><td><span class="tag" style="${{ Teaching: 'background:#E0F2FE;color:#075985', 'Non-teaching': 'background:#FCE7F3;color:#9D174D', Management: 'background:#FEF3C7;color:#92400E' }[dv]}">${dv}</span></td><td>${d}</td>${off ? `<td colspan="3" style="color:var(--mut)">No check-in</td>` : `<td><span class="tag" style="background:${s === 'Late' ? '#FFEDD5;color:#9A3412' : '#EAF1FF;color:#1D4ED8'}">${ci}</span></td><td><span class="tag" style="background:${s === 'Early' ? '#FFEDD5;color:#9A3412' : '#EAF1FF;color:#1D4ED8'}">${co}</span></td><td>${h}</td>`}<td><span class="pct ${cl}" style="${cl ? '' : 'background:#F1F5F9;color:#475569'}">${lab}</span></td></tr>` }).join('')}</table>
   <div style="display:flex;justify-content:flex-end;gap:16px;padding:14px 22px;font-size:13px;color:var(--t2)">Rows per page 6 · 1–6 of 1,000</div></div>`)

// ---- settlements (new) ----
const SET = [['58210447', 48600, '03 Jan', '05 Jan', '07 Jan', 'Late'], ['71904382', 32400, '02 Jan', '04 Jan', '', 'Pending'], ['24660915', 65000, '29 Dec', '31 Dec', '31 Dec', 'Settled'], ['90337128', 47825, '28 Dec', '30 Dec', '30 Dec', 'Settled'], ['66120934', 12760, '23 Dec', '25 Dec', '', 'Pending'], ['47592061', 61200, '22 Dec', '24 Dec', '24 Dec', 'Settled']]
P.settlements = () => P.shell('Finance', 'Settlements', `
  <div class="card hd"><div><h2>Settlements</h2><div style="font-size:12.5px;color:var(--mut);margin-top:2px">Vertex Group · Administration · ••••0142</div></div><span style="margin-left:auto;display:flex;gap:10px"><span class="btn s">${i('down')}Download</span></span></div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">${[['Total amount', '₹58.74 L', '#0F172A'], ['Settled', '₹58.65 L', '#047857'], ['Due in the next 7 days', '₹8.72 K', '#B45309']].map(([l, v, c]) => `<div class="card" style="padding:18px 20px"><div style="font-size:13px;color:var(--t2)">${l}</div><div style="font-size:26px;font-weight:650;margin-top:6px;color:${c}">${v}</div></div>`).join('')}</div>
  <div class="card" style="overflow:hidden"><div class="tabs">${[['All', 20], ['Pending', 6], ['Settled', 10], ['Late', 2], ['Refunded', 2]].map(([t, n], k) => `<span class="${k === 1 ? 'on' : ''}">${t}<b style="background:${['#F1F5F9', '#FEF3C7', '#D1FAE5', '#FEE2E2', '#FFEDD5'][k]};color:${['#475569', '#92400E', '#047857', '#B91C1C', '#9A3412'][k]}">${n}</b></span>`).join('')}</div>
   <div style="padding:16px 22px"><div class="sel" style="color:var(--mut)">${i('search')}Search settlement number or bank reference</div></div>
   <table class="tbl"><tr><th>Settlement no.</th><th>Timeline</th><th class="r">Amount</th><th>Txn date</th><th>Due date</th><th>Settled</th><th>Bank reference</th><th>Status</th><th></th></tr>
   ${SET.map(([n, a, t, d, s, stt]) => `<tr${stt === 'Late' ? ' class="low"' : ''}><td class="lk">${n}</td><td><span class="tag" style="background:#F1F5F9;color:#475569">T+2</span></td><td class="r" style="font-weight:600">₹${a.toLocaleString('en-IN')}</td><td>${t}</td><td style="${stt === 'Late' ? 'color:#B91C1C;font-weight:600' : ''}">${d}</td><td>${s || '<span style="color:var(--mut)">—</span>'}</td><td style="color:var(--t2);font-size:12.5px">UTR26${n.slice(2, 8)}${n.slice(0, 2)}</td><td><span class="pct ${{ Settled: 'p-g', Pending: 'p-a', Late: 'p-r' }[stt]}">${stt === 'Late' ? '2 days late' : stt}</span></td><td class="r"><span class="lk" style="font-size:12.5px">View</span></td></tr>`).join('')}</table></div>`)
})()
