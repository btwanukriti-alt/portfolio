// Pulsefit v2 product UI: helpers, the app shell and the full frames used in the modules.
(function(){
// Every name and number is sample data.
const P = {}
window.P = P

// ---- icons (lucide-style strokes) ----
const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chev: '<path d="m6 9 6 6 6-6"/>',
  chevR: '<path d="m9 6 6 6-6 6"/>',
  arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  dash: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
  userPlus: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
  tag: '<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  dumbbell: '<path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11"/>',
  heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  msg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  more: '<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  filter: '<path d="M3 6h18M7 12h10M10 18h4"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  cols: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  alert: '<path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3"/><path d="M12 9v4M12 17h.01"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
  up: '<path d="m7 14 5-5 5 5"/>',
  down: '<path d="m7 10 5 5 5-5"/>',
  snow: '<path d="M12 2v20M4.9 4.9l14.2 14.2M2 12h20M4.9 19.1 19.1 4.9"/>',
  refresh: '<path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M3 21v-5h5"/>',
  send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  pointer: '<path d="M9 9l12 4-5 2-2 5z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
  spark: '<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  ticket: '<path d="M2 9a3 3 0 0 0 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 0 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>',
  star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  pause: '<path d="M10 4H6v16h4zM18 4h-4v16h4z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
}
const i = (n, st = '') => `<svg class="i" viewBox="0 0 24 24"${st ? ` style="${st}"` : ''}>${ICONS[n]}</svg>`
P.i = i

// ---- small pieces ----
const AVC = [['#E7EEFF', '#2457D6'], ['#FDECEF', '#C0304A'], ['#E6F6EF', '#0B7A52'], ['#FFF2DE', '#B35A00'], ['#F0EBFF', '#5B3BE8'], ['#E5F5F9', '#0E7490']]
const ini = n => n.split(' ').map(s => s[0]).join('').slice(0, 2)
const hash = s => [...s].reduce((a, c) => a + c.charCodeAt(0), 0)
const av = (n, sm) => { const [b, c] = AVC[hash(n) % AVC.length]; return `<span class="av${sm ? ' sm' : ''}" style="background:${b};color:${c}">${ini(n)}</span>` }
const tag = (t, c, dot) => `<span class="tag t-${c}">${dot ? '<span class="d"></span>' : ''}${t}</span>`
const temp = t => tag(t, { Hot: 'hot', Warm: 'warm', Cold: 'cold' }[t], 1)
Object.assign(P, { av, tag, temp })

P.mark = (mode = 'color') => {
  const dark = mode === 'dark'
  const blue = dark ? '#fff' : '#0063F8', stem = dark ? '#fff' : 'url(#pf0)'
  return `<svg viewBox="0 0 20.48 22.28" fill="none"><path d="M5.13817 22.2799H2.76903C2.36327 22.2975 1.95883 22.2232 1.58689 22.0628C1.21494 21.9024 0.885422 21.6602 0.623759 21.3548C0.362096 21.0494 0.175268 20.689 0.0776862 20.3014C-0.0198958 19.9138 -0.0256258 19.5094 0.0609365 19.1192L1.10642 12.9727H6.79659L5.13817 22.2799Z" fill="${stem}"/><path d="M13.1781 13.0831H1.03516L2.78687 2.25127C2.90353 1.62895 3.21161 1.06768 3.66092 0.658885C4.11024 0.250088 4.67431 0.017854 5.26126 0H15.2927C18.689 0 20.9671 2.92987 20.3842 6.54155C19.7983 10.1597 16.5745 13.0863 13.1781 13.0831Z" fill="${blue}"/><path d="M13.5103 6.3842C13.4105 6.99031 13.1307 7.54469 12.7132 7.9633C12.3321 8.36324 11.8255 8.59294 11.2946 8.60652H1.75391L2.47659 4.14258H12.0173C13.0433 4.15223 13.7095 5.15244 13.5103 6.3842Z" fill="url(#pf1)"/><path d="M10.9889 10.8509C10.8767 11.4752 10.5599 12.0348 10.0967 12.4268C9.63463 12.8376 9.05622 13.0647 8.45802 13.07H4.12783C3.24741 13.1421 2.41298 13.5238 1.75194 14.1567C1.0909 14.7897 0.639565 15.6392 0.466797 16.5755L1.75454 8.59961H9.18962C10.3822 8.61569 11.1912 9.6159 10.9889 10.8509Z" fill="url(#pf2)"/><path d="M15.03 4.15194H2.47656L2.87509 1.6884C2.96488 1.22402 3.19635 0.805734 3.53236 0.500698C3.86837 0.195663 4.28942 0.0215712 4.72791 0.00637744H15.7318C15.9564 -0.00419649 16.1802 0.0414467 16.3858 0.139741C16.5914 0.238034 16.7732 0.386327 16.9171 0.573072C17.061 0.759818 17.1631 0.979972 17.2155 1.21638C17.2678 1.45279 17.269 1.69907 17.2188 1.93604L17.1742 2.20941C17.0679 2.74519 16.7992 3.22725 16.4108 3.57914C16.0223 3.93103 15.5364 4.13262 15.03 4.15194Z" fill="url(#pf3)"/></svg>`
}
// gradients once, for every mark on the page
document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute"><defs><linearGradient id="pf0" x1="5.27545" y1="17.3857" x2="1.69621" y2="10.4355" gradientUnits="userSpaceOnUse"><stop stop-color="#0063F8"/><stop offset="0.684415" stop-color="#003A92"/></linearGradient><linearGradient id="pf1" x1="13.819" y1="6.43939" x2="1.50958" y2="6.43939" gradientUnits="userSpaceOnUse"><stop stop-color="#FFC52E"/><stop offset="1" stop-color="#E9A903"/></linearGradient><linearGradient id="pf2" x1="11.0255" y1="9.37885" x2="0.829299" y2="9.65822" gradientUnits="userSpaceOnUse"><stop stop-color="#FFC737"/><stop offset="1" stop-color="#F3BE37"/></linearGradient><linearGradient id="pf3" x1="3.1709" y1="1.53928" x2="14.7252" y2="1.46945" gradientUnits="userSpaceOnUse"><stop stop-color="#D99C00"/><stop offset="1" stop-color="#FFB800"/></linearGradient></defs></svg>`)

// ---- app shell ----
const NAV = [['dash', 'Dashboard'], ['target', 'Leads', ['Dashboard', 'All leads', 'New lead']], ['users', 'Members', ['Dashboard', 'All members', 'Add member']], ['tag', 'Plans'], ['mail', 'Communication'], ['user', 'Staff'], ['dumbbell', 'Equipment'], ['heart', 'Workouts']]
P.shell = (active, sub, content, { search = 'Search members, leads, plans' } = {}) => {
  const nav = NAV.map(([ic, name, subs]) => {
    const on = name === active
    let h = `<div class="it${on ? ' on' : ''}">${i(ic)}${name}${name === 'Leads' ? '<span class="n">15</span>' : ''}</div>`
    if (on && subs) h += `<div class="sub">${subs.map(s => `<span class="${s === sub ? 'on' : ''}">${s}</span>`).join('')}</div>`
    return h
  }).join('')
  return `<div class="app u"><aside class="side"><div class="brand">${P.mark()}Pulsefit</div>
  <div class="ws"><span class="ico" style="background:#003A92;color:#fff;width:26px;height:26px;border-radius:7px;font-size:11px;font-weight:700">IF</span>Iron Fit, Indiranagar<span class="chev">${i('chev')}</span></div>
  <div class="nl">Workspace</div>${nav}
  <div class="me">${av('Sana Rao')}<div>Sana Rao<small>Front desk</small></div></div></aside>
  <div class="main"><div class="top"><div class="search">${i('search')}${search}<kbd>⌘K</kbd></div><div style="margin-left:auto"></div><div class="ib">${i('gear')}</div><div class="ib">${i('bell')}<span class="bd"></span></div>${av('Sana Rao')}</div>
  <div class="body">${content}</div></div></div>`
}
const head = (crumb, title, sub, acts) => `<div class="ph"><div><div class="crumb">${crumb.map((c, k) => k < crumb.length - 1 ? `${c}${i('chevR', 'width:12px;height:12px')}` : `<b>${c}</b>`).join('')}</div><h1>${title}</h1>${sub ? `<div class="sub2">${sub}</div>` : ''}</div><div class="acts">${acts}</div></div>`
P.head = head

// ---- lead task cards ----
const LEADTASKS = {
  stale: { t: 'Stale leads', ic: 'clock', c: '#D97706', bg: 'var(--amb-s)', n: 7, rows: [['Kabir Shah', 'Hot', 'No activity for 22 days'], ['Priya Raman', 'Hot', 'No activity for 18 days'], ['Alex John', 'Warm', 'No activity for 16 days'], ['Meera Iyer', 'Hot', 'No activity for 15 days']] },
  missed: { t: 'Missed follow-ups', ic: 'alert', c: '#E5484D', bg: 'var(--red-s)', n: 5, rows: [['Neha Singh', 'Hot', 'Due 5 days ago'], ['Aaron Joseph', 'Cold', 'Due 4 days ago'], ['Robert Fox', 'Hot', 'Due 3 days ago'], ['Nithya Menon', 'Warm', 'Due 2 days ago']] },
  quality: { t: 'Incomplete leads', ic: 'flag', c: '#6D4AFF', bg: 'var(--vio-s)', n: 3, rows: [['Rohan Iyer', 'Hot', 'Phone number missing'], ['Diya Kapoor', 'Cold', 'Goal missing'], ['Arjun Nair', 'Warm', 'Source missing'], ['Ishaan Rao', 'Warm', 'Email missing']] },
}
// One quiet action per row. The row in focus (hov) gets the filled button; the rest stay secondary.
P.taskCard = (key, { hov = -1, w } = {}) => {
  const d = LEADTASKS[key]
  const act = key === 'quality' ? 'Complete' : 'Follow up'
  const rows = d.rows.map(([n, t, r], k) => `<div class="tr${k === hov ? ' hov' : ''}">${av(n)}<div><div class="nm">${n}${temp(t)}</div><div class="rs" style="color:${key === 'quality' ? 'var(--t2)' : d.c}">${r}</div></div>
    <div class="ra">${k === hov ? `<span class="ib" style="width:30px;height:30px">${i('phone', 'width:15px;height:15px')}</span><span class="btn sm p">${act}</span>` : `<span class="btn sm s">${act}</span>`}<span class="ib" style="width:30px;height:30px;color:var(--mut)">${i('more')}</span></div></div>`).join('')
  return `<div class="card u" style="${w ? `width:${w}px` : ''}"><div class="ch"><span class="ico" style="background:${d.bg};color:${d.c}">${i(d.ic)}</span><h3>${d.t}</h3><span class="cnt" style="background:${d.bg};color:${d.c}">${d.n}</span><span class="ct">View all${i('chevR', 'width:14px;height:14px')}</span></div>${rows}</div>`
}

// ---- 1. Lead dashboard ----
P.leadDash = () => {
  const kpi = (l, ic, c, bg, v, ch, upq) => `<div class="card kpi"><div class="l"><span class="ico" style="background:${bg};color:${c};width:28px;height:28px">${i(ic, 'width:15px;height:15px')}</span>${l}</div><div class="v">${v}</div><div class="f"><span class="${upq ? 'up' : 'dn'}">${i(upq ? 'up' : 'down', 'width:13px;height:13px;stroke-width:2.4')}${ch}</span>vs last month</div></div>`
  // funnel: lead status breakdown
  const st = [['New', 420, '#9DC2FF'], ['Contacted', 296, '#6AA3FF'], ['Trial booked', 178, '#3D86FB'], ['Trial done', 121, '#0F6CF8'], ['Converted', 97, '#0049C2']]
  const max = 420, fh = 210
  const funnel = st.map(([n, v, c], k) => {
    const h = Math.round(v / max * fh)
    const drop = k ? Math.round((1 - v / st[k - 1][1]) * 100) : null
    return `<div style="flex:1;display:flex;flex-direction:column;gap:10px"><div style="font-size:12.5px;color:var(--t2);font-weight:500">${n}</div><div style="font-size:22px;font-weight:650;letter-spacing:-.02em">${v}</div>
      <div style="height:${fh}px;display:flex;align-items:flex-end;position:relative"><div style="width:100%;height:${h}px;border-radius:10px;background:linear-gradient(180deg,${c},${c}CC)"></div></div>
      <div style="font-size:12px;color:${drop === null ? 'var(--mut)' : 'var(--red)'};font-weight:500">${drop === null ? 'Start' : `−${drop}% from previous`}</div></div>`
  }).join('')
  // lead source conversion
  const src = [['Walk-in', 82, 41], ['Instagram', 140, 24], ['Website', 96, 31], ['Referral', 54, 46], ['Google Ads', 48, 19]]
  const srcRows = src.map(([n, l, cv]) => `<div style="display:grid;grid-template-columns:96px 1fr 44px;align-items:center;gap:12px;font-size:12.5px"><span style="color:var(--t2)">${n}</span><div style="height:10px;border-radius:5px;background:#EEF1F6;position:relative"><div style="position:absolute;left:0;top:0;bottom:0;width:${cv * 2}%;border-radius:5px;background:var(--pri)"></div></div><b style="text-align:right;font-weight:600">${cv}%</b></div>`).join('')
  // agents
  const ag = [['Anika Shetty', 64, 38, '2h 10m', 'Top', 'grn'], ['Rahul Menon', 58, 29, '4h 20m', 'On track', 'blue'], ['Farah Khan', 61, 26, '6h 05m', 'On track', 'blue'], ['Vikram Das', 52, 14, '1d 3h', 'Needs help', 'hot']]
  const agRows = ag.map(([n, a, c, rt, p, pc]) => `<tr><td><div class="who">${av(n, 1)}${n}</div></td><td class="r">${a}</td><td class="r">${c}</td><td><div style="display:flex;align-items:center;gap:10px"><div style="width:120px;height:6px;border-radius:3px;background:#EEF1F6"><div style="height:6px;border-radius:3px;width:${Math.round(c / a * 100)}%;background:var(--pri)"></div></div>${Math.round(c / a * 100)}%</div></td><td>${rt}</td><td>${tag(p, pc, 1)}</td></tr>`).join('')
  return P.shell('Leads', 'Dashboard', `
    ${head(['Leads', 'Dashboard'], 'Good morning, Sana', '15 leads need you today', `<span class="btn s">${i('cal')}1 Sep – 7 Oct</span><span class="btn p">${i('plus')}New lead</span>`)}
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">${P.taskCard('stale')}${P.taskCard('missed', { hov: 0 })}${P.taskCard('quality')}</div>
    <div style="display:flex;align-items:center;margin-top:8px"><h2>Lead performance</h2><span class="seg" style="margin-left:auto"><span>7 days</span><span class="on">30 days</span><span>Quarter</span></span></div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">${kpi('New leads', 'userPlus', 'var(--pri)', 'var(--pri-s)', '420', '12%', 1)}${kpi('Trial booking rate', 'cal', '#0E9F6E', 'var(--grn-s)', '42%', '5%', 1)}${kpi('Converted', 'check', '#6D4AFF', 'var(--vio-s)', '97', '8%', 1)}${kpi('Lost leads', 'x', '#E5484D', 'var(--red-s)', '65', '3%', 0)}</div>
    <div style="display:grid;grid-template-columns:1.75fr 1fr;gap:16px">
      <div class="card" style="padding:20px 22px"><div style="display:flex;align-items:center"><h3>Lead journey</h3><span style="margin-left:auto;font-size:12.5px;color:var(--mut)">Last 30 days</span></div><div style="display:flex;gap:14px;margin-top:18px">${funnel}</div></div>
      <div class="card" style="padding:20px 22px;display:flex;flex-direction:column"><div style="display:flex;align-items:center"><h3>Conversion by source</h3></div><div style="font-size:12.5px;color:var(--mut);margin-top:4px">Share of leads that became members</div><div style="display:flex;flex-direction:column;gap:20px;margin-top:26px">${srcRows}</div></div>
    </div>
    <div class="card" style="overflow:hidden"><div class="ch" style="padding:18px 20px"><h3>Team follow-up</h3><span class="ct">View report${i('chevR', 'width:14px;height:14px')}</span></div>
      <table class="tbl"><tr><th>Agent</th><th class="r">Leads</th><th class="r">Converted</th><th>Conversion</th><th>Avg response</th><th>Status</th></tr>${agRows}</table></div>
  `)
}

// ---- 2. Leads table ----
const LEADS = [[2314, 'Robert Fox', '+91 98450 21134', 'Cold', 'Anika Shetty', 'Walk-in', '2 Oct'], [2789, 'Nithya Menon', '+91 78798 63288', 'Hot', 'Rahul Menon', 'Instagram', '2 Oct'], [3051, 'Neha Singh', '+91 99021 44870', 'Hot', 'Farah Khan', 'Website', '3 Oct'], [3168, 'Alex John', '+91 90876 33215', 'Warm', 'Anika Shetty', 'Referral', '3 Oct'], [3294, 'Aaron Joseph', '+91 80455 19023', 'Warm', 'Vikram Das', 'Google Ads', '4 Oct'], [3407, 'Priya Raman', '+91 97411 56208', 'Cold', 'Farah Khan', 'Walk-in', '4 Oct'], [3512, 'Kabir Shah', '+91 93450 77612', 'Hot', 'Rahul Menon', 'Instagram', '5 Oct'], [3688, 'Meera Iyer', '+91 76690 28341', 'Warm', 'Anika Shetty', 'Website', '5 Oct']]
P.leadRow = ([id, n, ph, t, o, s, d], sel) => `<tr class="${sel ? 'sel' : ''}"><td style="width:44px"><span class="cb${sel ? ' on' : ''}">${sel ? i('check') : ''}</span></td><td><div class="who">${av(n)}<div style="font-weight:600">${n}<small>#${id}</small></div></div></td><td>${ph}</td><td><span class="sel-dd">${temp(t)}${i('chev')}</span></td><td><span class="sel-dd"><span class="who" style="gap:8px">${av(o, 1)}${o}</span>${i('chev')}</span></td><td style="color:var(--t2)">${s}</td><td style="color:var(--t2)">${d}, 2024</td><td class="r" style="color:var(--mut)"><span class="ib" style="display:inline-grid;width:30px;height:30px">${i('more')}</span></td></tr>`
P.bulkBar = (w) => `<div class="u" style="display:flex;align-items:center;gap:10px;height:52px;padding:0 10px 0 18px;border-radius:14px;background:#0F1222;color:#fff;font-size:13px;font-weight:500;white-space:nowrap;box-shadow:0 18px 40px -16px rgba(15,18,34,.5);${w ? `width:${w}px` : ''}"><span class="cb on" style="border-color:#fff;background:#fff;color:#0F1222">${i('check')}</span>2 selected<span style="width:1px;height:22px;background:rgba(255,255,255,.18);margin:0 6px"></span><span class="btn sm" style="color:#fff">${i('user')}Assign</span><span class="btn sm" style="color:#fff">${i('flag')}Change status</span><span class="btn sm" style="color:#fff">${i('mail')}Email</span><span class="btn sm" style="margin-left:auto;background:#fff;color:#0F1222">${i('userPlus')}Convert to member</span></div>`
P.leadsTable = () => P.shell('Leads', 'All leads', `
  ${head(['Leads', 'All leads'], 'All leads', '1,284 leads · 8 shown', `<span class="btn s">${i('download')}Export</span><span class="btn p">${i('plus')}New lead</span>`)}
  <div class="card" style="overflow:hidden">
    <div style="display:flex;align-items:center;gap:10px;padding:14px 16px"><div class="search" style="width:300px;background:#fff;box-shadow:0 0 0 1px var(--line2)">${i('search')}Search by name or phone</div>
      <span class="seg"><span class="on">All</span><span>Hot · 3</span><span>Warm · 3</span><span>Cold · 2</span></span>
      <span class="btn s sm" style="margin-left:auto;height:36px">${i('filter')}Filters</span><span class="btn s sm" style="height:36px">${i('cols')}Columns</span></div>
    <table class="tbl"><tr><th><span class="cb on" style="background:var(--pri);border-color:var(--pri);color:#fff">${i('x', 'width:10px;height:10px;stroke-width:3')}</span></th><th>Lead</th><th>Phone</th><th>Status</th><th>Owner</th><th>Source</th><th>Created</th><th></th></tr>
    ${LEADS.map((l, k) => P.leadRow(l, k === 1 || k === 6)).join('')}</table>
    <div style="display:flex;align-items:center;gap:8px;padding:14px 16px;font-size:12.5px;color:var(--t2)">Rows per page <span class="btn s sm">8${i('chev')}</span><span style="margin-left:auto">1–8 of 1,284</span><span class="btn s sm" style="width:30px;padding:0;justify-content:center">${i('chevR', 'transform:scaleX(-1)')}</span><span class="btn s sm" style="width:30px;padding:0;justify-content:center">${i('chevR')}</span></div>
  </div>
  <div style="display:flex;justify-content:center;margin-top:-4px">${P.bulkBar(760)}</div>
`)
P.statusMenu = () => `<div class="u card" style="width:220px;padding:6px;box-shadow:0 0 0 1px var(--line),0 20px 40px -16px rgba(15,18,34,.3)">
  <div style="font-size:11.5px;color:var(--mut);font-weight:600;padding:8px 10px 6px;letter-spacing:.04em;text-transform:uppercase">Set status</div>
  ${[['Hot', 'Ready to join'], ['Warm', 'Interested'], ['Cold', 'Not now']].map(([t, d], k) => `<div style="display:flex;align-items:center;gap:10px;height:42px;padding:0 10px;border-radius:9px;${k === 0 ? 'background:var(--gnd)' : ''}">${temp(t)}<span style="font-size:12.5px;color:var(--mut)">${d}</span>${k === 0 ? `<span style="margin-left:auto;color:var(--pri)">${i('check')}</span>` : ''}</div>`).join('')}</div>`

// ---- 3. Convert to member (modal) ----
P.convertModal = () => {
  const f = (l, v, pf, extra = '') => `<div class="fl">${l}<div class="inp${pf ? ' pf' : ''}">${v}${pf ? `<span class="sfx"><span class="fromlead">${i('link')}From lead</span></span>` : extra}</div></div>`
  return `<div class="u" style="width:640px;background:#fff;border-radius:20px;box-shadow:0 0 0 1px rgba(15,18,34,.06),0 40px 80px -30px rgba(15,18,34,.45);overflow:hidden">
  <div style="display:flex;align-items:flex-start;gap:14px;padding:22px 24px 18px;border-bottom:1px solid var(--line)">${av('Nithya Menon')}<div><h2 style="font-size:17px">Convert to member</h2><div style="color:var(--mut);font-size:13px;margin-top:3px">Nithya Menon · Lead #2789 · Hot</div></div><span class="ib" style="margin-left:auto;color:var(--mut)">${i('x')}</span></div>
  <div style="padding:20px 24px;display:flex;flex-direction:column;gap:22px">
    <div><div style="display:flex;align-items:center;gap:8px;margin-bottom:14px"><span class="cnt" style="background:var(--pri);color:#fff">1</span><h3>Member details</h3><span style="margin-left:auto;font-size:12px;color:var(--mut)">5 of 6 filled from the lead</span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">${f('First name', 'Nithya', 1)}${f('Last name', 'Menon', 1)}${f('Email', 'nithya.menon@mail.com', 1)}${f('Phone', '+91 78798 63288', 1)}${f('Goal', 'Weight loss', 1)}<div class="fl">Assign trainer<div class="inp">${av('Rahul Menon', 1)}Rahul Menon<span class="sfx">${i('chev')}</span></div></div></div></div>
    <div><div style="display:flex;align-items:center;gap:8px;margin-bottom:14px"><span class="cnt" style="background:var(--pri);color:#fff">2</span><h3>Plan</h3></div>
      <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:14px"><div class="fl">Plan<div class="inp">Monthly ${tag('Recurring', 'vio')}<span class="sfx">₹2,000 ${i('chev')}</span></div></div><div class="fl">Start date<div class="inp">10 Oct 2024<span class="sfx">${i('cal')}</span></div></div></div>
      <div style="display:flex;flex-direction:column;gap:12px;margin-top:16px">
        <div style="display:flex;align-items:center;gap:12px"><span class="tg on"></span><div><div style="font-weight:600;font-size:13px">Waive joining fee</div><div style="font-size:12px;color:var(--mut)">Saves ₹500 on the first bill</div></div></div>
        <div style="display:flex;align-items:center;gap:12px"><span class="tg on"></span><div><div style="font-weight:600;font-size:13px">Apply discount</div><div style="font-size:12px;color:var(--mut)">Festive offer</div></div><div class="inp" style="margin-left:auto;width:120px;height:36px">10<span class="sfx">%</span></div></div>
      </div></div>
    <div class="sum"><div><span>Monthly plan</span><span>₹2,000</span></div><div><span>Joining fee</span><span><s style="color:var(--mut)">₹500</s> ₹0</span></div><div><span>Discount (10%)</span><span style="color:var(--grn)">−₹200</span></div><div><span>GST (18%)</span><span>₹324</span></div><div class="tot"><span>Due today</span><span>₹2,124</span></div></div>
    <div class="note">${i('info', 'margin-top:1px;flex:none')}Billed every 30 days from 10 Oct. The first reminder goes out 5 days before renewal.</div>
  </div>
  <div style="display:flex;align-items:center;gap:10px;padding:16px 24px;border-top:1px solid var(--line);background:#FBFBFD"><span class="btn g">Cancel</span><span class="btn p" style="margin-left:auto">${i('check')}Convert and bill ₹2,124</span></div></div>`
}
P.convertFrame = () => {
  const bg = P.leadsTable().replace('<div class="app u">', '<div class="app u" style="min-height:1130px">')
  return `<div style="position:relative;width:1440px">${bg}<div style="position:absolute;inset:0;background:rgba(15,18,34,.42)"></div><div style="position:absolute;left:50%;top:40px;transform:translateX(-50%)">${P.convertModal()}</div></div>`
}

// ---- 4. Plans ----
const PLANS = [['Membership', 'blue', 'Monthly', 2000, '1 month', 180, '15 days', '1 week', 128], ['Membership', 'blue', 'Quarterly', 5400, '3 months', 486, '1 month', '2 weeks', 94], ['Membership', 'blue', 'Half-yearly', 9600, '6 months', 864, '1 month', '3 weeks', 61], ['Membership', 'blue', 'Annual', 16800, '12 months', 1512, '2 months', '1 month', 143], ['Training', 'warm', 'PT Starter', 6000, '1 month', 540, '15 days', '1 week', 38], ['Training', 'warm', 'PT Pro', 16500, '3 months', 1485, '1 month', '2 weeks', 22], ['Classes', 'grn', 'Yoga', 1800, '1 month', 162, '15 days', '1 week', 76], ['Classes', 'grn', 'Zumba', 1600, '1 month', 144, '15 days', '1 week', 54], ['Student', 'cold', 'Student Monthly', 1200, '1 month', 108, '15 days', '1 week', 87], ['Student', 'cold', 'Student Annual', 11000, '12 months', 990, '1 month', '3 weeks', 31], ['Corporate', 'vio', 'Corporate Flexi', 8400, '6 months', 756, '1 month', '2 weeks', 45], ['Trial', 'gray', 'Day pass', 300, '1 day', 27, '—', '—', 12]]
const inr = n => '₹' + n.toLocaleString('en-IN')
P.planCard = ([cat, c, n, price, dur, tax, ext, pause, act], big) => `<div class="card u" style="padding:20px;display:flex;flex-direction:column;gap:16px${big ? ';width:330px' : ''}">
  <div style="display:flex;align-items:center">${tag(cat, c, 1)}<span class="ib" style="margin-left:auto;width:28px;height:28px;color:var(--mut)">${i('more')}</span></div>
  <div><div style="font-size:16px;font-weight:650">${n}</div><div style="margin-top:6px;display:flex;align-items:baseline;gap:5px"><span style="font-size:24px;font-weight:700;letter-spacing:-.02em">${inr(price)}</span><span style="color:var(--mut);font-size:12.5px">/ ${dur}</span></div><div style="color:var(--mut);font-size:12px;margin-top:2px">+ ${inr(tax)} GST</div></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">${[['clock', 'Extension', ext], ['pause', 'Pause', pause]].map(([ic, l, v]) => `<div style="border-radius:10px;background:var(--gnd);padding:9px 11px"><div style="font-size:11.5px;color:var(--mut);display:flex;gap:5px;align-items:center">${i(ic, 'width:12px;height:12px')}${l}</div><div style="font-weight:600;margin-top:3px">${v}</div></div>`).join('')}</div>
  <div style="display:flex;align-items:center;gap:8px;border-top:1px solid var(--line);padding-top:14px"><span style="display:flex">${['Kabir Shah', 'Neha Singh', 'Alex John'].map((x, k) => `<span style="margin-left:${k ? -5 : 0}px;box-shadow:0 0 0 2px #fff;border-radius:50%">${av(x, 1)}</span>`).join('')}</span><span style="font-size:12.5px;color:var(--t2)"><b style="color:var(--ink)">${act}</b> active</span><span style="margin-left:auto;font-size:12.5px;font-weight:600;color:var(--pri);display:flex;align-items:center;gap:3px">View${i('chevR', 'width:13px;height:13px')}</span></div></div>`
P.PLANS = PLANS
P.plansFrame = () => P.shell('Plans', null, `
  ${head(['Plans'], 'Plans', '12 active plans · 791 members on a plan', `<span class="btn s">${i('plus')}Add category</span><span class="btn p">${i('plus')}Add plan</span>`)}
  <div style="display:flex;align-items:center;gap:10px"><span class="seg"><span class="on">All · 12</span><span>Membership · 4</span><span>Training · 2</span><span>Classes · 2</span><span>Student · 2</span><span>Corporate · 1</span><span>Trial · 1</span></span><span class="btn s sm" style="margin-left:auto;height:36px">${i('filter')}Active</span></div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">${PLANS.map(p => P.planCard(p)).join('')}</div>`)

// ---- 5. Members dashboard ----
P.expRow = ([n, ph, plan, pc, exp, ec, coach], focus) => `<tr${focus ? ' class="sel"' : ''}><td><div class="who">${av(n)}<div style="font-weight:600">${n}<small>${ph}</small></div></div></td><td>${tag(plan, pc)}</td><td><span style="color:${ec};font-weight:600">${exp}</span></td><td><div class="who" style="gap:8px">${av(coach, 1)}${coach}</div></td><td class="r"><span style="display:inline-flex;gap:6px;align-items:center"><span class="btn sm g">${i('bell')}Remind</span><span class="btn sm ${focus ? 'p' : 's'}">${i('refresh')}Renew</span></span></td></tr>`
const EXP = [['Robert Fox', '+91 98886 23443', 'Monthly', 'blue', 'Today', 'var(--red)', 'Anika Shetty'], ['Neha Singh', '+91 98676 23562', 'Quarterly', 'grn', 'In 2 days', 'var(--amb)', 'Rahul Menon'], ['Alex John', '+91 98568 96512', 'Half-yearly', 'warm', 'In 5 days', 'var(--amb)', 'Farah Khan'], ['Kabir Shah', '+91 78556 54916', 'Annual', 'vio', 'In 6 days', 'var(--t2)', 'Vikram Das'], ['Aaron Joseph', '+91 80455 19023', 'PT Pro', 'cold', 'In 7 days', 'var(--t2)', 'Rahul Menon']]
P.EXP = EXP
P.heat = () => {
  const hrs = ['5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p']
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const prof = [.35, .8, .95, .7, .45, .3, .25, .2, .15, .12, .18, .3, .55, .9, 1, .75, .45, .18]
  const dayk = [1, .95, .92, .97, .85, .7, .55]
  let h = '<div class="hm" style="grid-template-columns:36px repeat(18,1fr)"><span></span>' + hrs.map(x => `<span class="hl">${x}</span>`).join('')
  days.forEach((d, r) => {
    h += `<span class="lb">${d}</span>`
    prof.forEach((p, c) => {
      let v = p * dayk[r] * (1 + .12 * Math.sin(r * 3.1 + c * 1.7))
      if (r >= 5) v = (c >= 3 && c <= 7 ? .75 : .2) * dayk[r] * (1 + .1 * Math.sin(c))
      v = Math.max(.04, Math.min(1, v))
      const a = Math.round(v * 100) / 100
      const peak = r === 2 && c === 14
      h += `<span class="c" style="background:rgba(0,99,248,${(.06 + a * .9).toFixed(2)});${peak ? 'box-shadow:0 0 0 2px #fff,0 0 0 4px var(--pri)' : ''}"></span>`
    })
  })
  return h + '</div>'
}
P.membersDash = () => {
  const kpi = (l, v, f, upq) => `<div class="card kpi"><div class="l">${l}</div><div class="v">${v}</div><div class="f"><span class="${upq ? 'up' : 'dn'}">${i(upq ? 'up' : 'down', 'width:13px;height:13px;stroke-width:2.4')}${f}</span>vs last month</div></div>`
  const drop = [['Robert Fox', '42%', '18'], ['Neha Singh', '53%', '22'], ['Alex John', '68%', '15'], ['Kabir Shah', '40%', '27']]
  const fz = [['Meera Iyer', '15 days left', 'Travel'], ['Priya Raman', '12 days left', 'Injury'], ['Ishaan Rao', '9 days left', 'Exams'], ['Diya Kapoor', '5 days left', 'Travel']]
  return P.shell('Members', 'Dashboard', `
    ${head(['Members', 'Dashboard'], 'Members', '8 renewals this week · 4 attendance drops', `<span class="btn s">${i('cal')}1 Sep – 7 Oct</span><span class="btn p">${i('plus')}Add member</span>`)}
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">${kpi('Active members', '791', '4.2%', 1)}${kpi('Renewal rate', '86%', '3%', 1)}${kpi('Pending payments', '₹42,600', '6%', 0)}${kpi('Frozen', '26', '2', 0)}</div>
    <div style="display:grid;grid-template-columns:1.9fr 1fr;gap:16px">
      <div class="card" style="overflow:hidden"><div class="ch"><span class="ico" style="background:var(--amb-s);color:var(--amb)">${i('refresh')}</span><h3>Expiring this week</h3><span class="cnt" style="background:var(--amb-s);color:var(--amb)">8</span><span class="ct">View all${i('chevR', 'width:14px;height:14px')}</span></div>
        <table class="tbl"><tr><th>Member</th><th>Plan</th><th>Expires</th><th>Trainer</th><th class="r">Next step</th></tr>${EXP.map((e, k) => P.expRow(e, k === 0)).join('')}</table></div>
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card"><div class="ch"><span class="ico" style="background:var(--red-s);color:var(--red)">${i('down')}</span><h3>Attendance drops</h3><span class="cnt" style="background:var(--red-s);color:var(--red)">4</span></div>${drop.map(([n, a, d]) => `<div class="tr" style="padding:10px 18px">${av(n, 1)}<div style="font-weight:600">${n}</div><span style="margin-left:auto;font-size:12.5px;color:var(--t2)">${a}</span><span class="dn" style="font-size:12.5px;width:52px;justify-content:flex-end">${i('down', 'width:12px;height:12px;stroke-width:2.4')}${d}%</span><span class="btn sm s">Check in</span></div>`).join('')}</div>
        <div class="card"><div class="ch"><span class="ico" style="background:var(--cy-s);color:var(--cy)">${i('snow')}</span><h3>Frozen</h3><span class="cnt" style="background:var(--cy-s);color:var(--cy)">26</span></div>${fz.map(([n, d, r]) => `<div class="tr" style="padding:10px 18px">${av(n, 1)}<div><div style="font-weight:600">${n}</div><div style="font-size:12px;color:var(--mut)">${r}</div></div><span style="margin-left:auto;font-size:12.5px;color:var(--t2)">${d}</span><span class="btn sm g" style="color:var(--pri)">Unfreeze</span></div>`).join('')}</div>
      </div>
    </div>
    <div class="card" style="padding:20px 22px"><div style="display:flex;align-items:center;gap:12px"><h3>When members come in</h3><span style="font-size:12.5px;color:var(--mut)">Check-ins by hour, last 4 weeks</span><span class="seg" style="margin-left:auto"><span class="on">All</span><span>Weekdays</span><span>Weekends</span></span></div>
      <div style="margin-top:18px">${P.heat()}</div>
      <div style="display:flex;align-items:center;gap:8px;margin-top:14px;font-size:12px;color:var(--mut)">Fewer<span style="display:flex;gap:3px">${[.1, .3, .5, .7, .95].map(a => `<span style="width:22px;height:10px;border-radius:3px;background:rgba(0,99,248,${a})"></span>`).join('')}</span>More<span style="margin-left:auto;display:flex;align-items:center;gap:6px"><span style="width:12px;height:12px;border-radius:4px;box-shadow:0 0 0 2px var(--pri)"></span>Busiest: Wed, 7 pm</span></div></div>
  `)
}

// ---- 6. Email campaigns ----
const CAMP = { Leads: [['Lead welcome', 'When a lead is created', 'send', '#6D4AFF', 842, 52, 14.2, 1.8, 1], ['Trial reminder', 'A day before a booked trial', 'cal', '#0891B2', 806, 44, 21, 3.1, 1], ['Lead feedback', 'After a trial with no sign-up', 'msg', '#E5484D', 612, 38, 11, 4.4, 0]], Members: [['Member welcome', 'When a lead converts', 'userPlus', '#0063F8', 758, 61, 18, 1.2, 1], ['Monthly check-in', 'On the 1st of each month', 'heart', '#0E9F6E', 934, 36, 12, 3.8, 1], ['Testimonial request', 'After 90 days as a member', 'star', '#D97706', 702, 29, 8.4, 5.1, 0]], Subscriptions: [['Renewal reminder', '5 days before a plan expires', 'refresh', '#D97706', 726, 67, 27, 2.2, 1], ['Plan changed', 'When a member switches plan', 'layers', '#6D4AFF', 889, 47, 13, 2.9, 1], ['Payment receipt', 'After every payment', 'card', '#0891B2', 910, 58, 16, 1.4, 1]] }
P.campRow = ([n, trig, ic, c, sent, op, cl, un, on], big) => `<div class="u" style="display:grid;grid-template-columns:44px 1.6fr 50px repeat(4,1fr) 32px;align-items:center;gap:14px;padding:14px 18px;${big ? 'width:900px;background:#fff;border-radius:16px;box-shadow:0 0 0 1px var(--line)' : 'border-top:1px solid var(--line)'}">
  <span class="ico" style="width:38px;height:38px;border-radius:11px;background:${c}14;color:${c}">${i(ic, 'width:18px;height:18px')}</span><div><div style="font-weight:600;font-size:13.5px">${n}</div><div style="font-size:12px;color:var(--mut);margin-top:2px;display:flex;align-items:center;gap:5px">${i('spark', 'width:12px;height:12px')}${trig}</div></div>
  <span class="tg${on ? ' on' : ''}"></span>
  ${[['Sent', sent.toLocaleString('en-IN'), null], ['Opened', op + '%', op], ['Clicked', cl + '%', cl * 2], ['Unsubscribed', un + '%', null]].map(([l, v, b]) => `<div><div style="font-size:11.5px;color:var(--mut)">${l}</div><div style="font-weight:650;font-size:15px;margin-top:2px;${!on ? 'color:var(--mut)' : ''}">${v}</div>${b !== null ? `<div style="height:4px;border-radius:2px;background:#EEF1F6;margin-top:6px"><div style="height:4px;border-radius:2px;width:${b}%;background:${on ? 'var(--pri)' : '#C9CDD8'}"></div></div>` : '<div style="height:10px"></div>'}</div>`).join('')}
  <span class="ib" style="width:30px;height:30px;color:var(--mut)">${i('more')}</span></div>`
P.CAMP = CAMP
P.emailFrame = () => {
  const kpi = (l, v, ic, c) => `<div class="card kpi" style="display:flex;align-items:center;gap:14px"><span class="ico" style="width:42px;height:42px;border-radius:12px;background:${c}14;color:${c}">${i(ic, 'width:19px;height:19px')}</span><div><div class="l" style="font-size:12.5px">${l}</div><div class="v" style="margin-top:2px;font-size:22px">${v}</div></div></div>`
  const grp = (g, rows, ic) => `<div class="card" style="overflow:hidden"><div class="ch">${i(ic, 'color:var(--mut)')}<h3>${g}</h3><span style="font-size:12.5px;color:var(--mut)">${rows.length} emails · ${rows.filter(r => r[8]).length} on</span><span class="ct">${i('plus', 'width:14px;height:14px')}Add</span></div>${rows.map(r => P.campRow(r)).join('')}</div>`
  return P.shell('Communication', null, `
    ${head(['Communication', 'Email'], 'Automated emails', 'Each one is sent by a trigger, not by hand', `<span class="btn s">${i('cal')}Last 30 days</span><span class="btn p">${i('plus')}New email</span>`)}
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">${kpi('Sent', '7,179', 'send', '#0063F8')}${kpi('Open rate', '48%', 'eye', '#0E9F6E')}${kpi('Click rate', '16%', 'pointer', '#6D4AFF')}${kpi('Unsubscribed', '2.8%', 'x', '#E5484D')}</div>
    ${grp('Leads', CAMP.Leads, 'target')}${grp('Members', CAMP.Members, 'users')}${grp('Subscriptions', CAMP.Subscriptions, 'refresh')}`)
}
})()
