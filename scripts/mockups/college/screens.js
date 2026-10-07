
const I={
 home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
 fin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h3"/></svg>',
 staff:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c2 .6 3.3 2.3 3.5 5"/></svg>',
 bank:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/></svg>',
 rep:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
 warn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.1"/></svg>',
 chev:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
 filt:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 5h16M7 12h10M10 19h4"/></svg>'
};
const nav=(active,sub)=>`<aside class="side"><div class="brand"><i></i>College Group</div><nav class="nav">
 <a>${I.home}Dashboard</a>
 <a class="${active=='fin'?'on':''}">${I.fin}Finance</a>
 ${active=='fin'?['Overview','Income breakdown','Settlements'].map(s=>`<span class="sub ${s==sub?'on':''}">${s}</span>`).join(''):''}
 <a class="${active=='staff'?'on':''}">${I.staff}Staff</a>
 ${active=='staff'?['Overview','Attendance','Staff details'].map(s=>`<span class="sub ${s==sub?'on':''}">${s}</span>`).join(''):''}
 <a>${I.bank}Banking</a><a>${I.rep}Reports</a></nav>
 <div class="who"><span class="av">AK</span><div><div style="font-weight:600;font-size:13px">Finance admin</div><div style="color:var(--sub);font-size:12px">Group office</div></div></div></aside>`;
const bar=(t,s)=>`<div class="bar"><div><h4>${t}</h4><p>${s}</p></div><div class="ctrl"><span class="pill">AY 2025–26 ${I.chev}</span><span class="pill">${I.filt} Filters</span></div></div>`;
const cls=p=>p>=80?'ok':p>=70?'warn':'bad';
const col=p=>p>=80?'#12805c':p>=70?'#d9910a':'#d92d20';

const colleges=[
 {n:'Science',r:9.5,e:17.0},{n:'Law',r:14.0,e:21.0},{n:'Arts & Management',r:12.55,e:18.0},
 {n:'Medical',r:16.0,e:22.0},{n:'Engineering',r:28.5,e:34.0}].map(c=>({...c,p:+(c.r/c.e*100).toFixed(1),pend:+(c.e-c.r).toFixed(2)}));
const cr=v=>'₹'+v.toFixed(2)+' Cr';

function spark(vals,color,w=84,h=28){const mx=Math.max(...vals),mn=Math.min(...vals);
 const pts=vals.map((v,i)=>[i*(w-4)/(vals.length-1)+2,h-3-(v-mn)/(mx-mn||1)*(h-6)]);
 const d=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join('');
 const last=pts[pts.length-1];
 return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${last[0]}" cy="${last[1]}" r="3" fill="${color}"/></svg>`;}

function trend(){
 const W=620,H=230,L=44,R=14,T=14,B=30,mx=120;
 const months=['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
 const rec=[14,27,38,47,55,63,70,76,80.55], sch=[20,36,52,68,80,92,102,108,112];
 const x=i=>L+i*(W-L-R)/8, y=v=>T+(1-v/mx)*(H-T-B);
 const line=a=>a.map((v,i)=>(i?'L':'M')+x(i).toFixed(1)+' '+y(v).toFixed(1)).join('');
 let g='';[0,40,80,120].forEach(v=>g+=`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="#e6e9ef"/><text x="${L-8}" y="${y(v)+4}" text-anchor="end" font-size="11" fill="#667085">${v}</text>`);
 months.forEach((m,i)=>g+=`<text x="${x(i)}" y="${H-8}" text-anchor="middle" font-size="11" fill="#667085">${m}</text>`);
 return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block"><defs><linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--acc2)" stop-opacity=".28"/><stop offset="1" stop-color="var(--acc2)" stop-opacity="0"/></linearGradient></defs>${g}
 <path d="${line(rec)}L${x(8)} ${y(0)}L${x(0)} ${y(0)}Z" fill="url(#ga)"/>
 <path d="${line(sch)}" fill="none" stroke="#98a2b3" stroke-width="2" stroke-dasharray="5 5"/>
 <path d="${line(rec)}" fill="none" stroke="var(--acc)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
 <circle cx="${x(8)}" cy="${y(80.55)}" r="5" fill="var(--acc)" stroke="#fff" stroke-width="2"/>
 <text x="${x(8)-8}" y="${y(80.55)+22}" text-anchor="end" font-size="12" font-weight="700" fill="var(--acc)">₹80.55 Cr</text>
 <text x="${x(8)-8}" y="${y(112)-8}" text-anchor="end" font-size="12" fill="#667085">Due by Dec ₹112 Cr</text></svg>`;
}

function financeRows(items,label){return items.map(c=>`<tr>
 <td><div class="cname"><i style="background:${col(c.p)}"></i>${c.n}</div></td>
 <td style="width:30%"><div class="cell2"><div class="mini"><b style="width:${c.p}%;background:${col(c.p)}"></b><u style="left:80%"></u></div><small class="num">${cr(c.r)} of ${cr(c.e)}</small></div></td>
 <td class="r num">${cr(c.pend)}</td>
 <td class="r"><span class="chip ${cls(c.p)}">${c.p.toFixed(1)}%</span></td>
 <td class="r num" style="color:${c.p>=80?'var(--ok)':'var(--bad)'};font-weight:600">${c.p>=80?'+':'−'}${Math.abs(c.p-80).toFixed(1)} pts</td></tr>`).join('');}
const thead=(first)=>`<thead><tr><th>${first}</th><th>Received vs expected</th><th class="r">Pending</th><th class="r">Collection</th><th class="r">Gap to 80% target</th></tr></thead>`;

function finance(){return `<div class="app" >${nav('fin','Overview')}<div class="main">
 ${bar('Finance overview','Academic year 2025–26, year to date · 5 colleges')}
 <div class="card hero"><div><div class="lbl">TOTAL RECEIVED</div><div class="big num">₹80.55 Cr</div><div class="of num">of ₹112.00 Cr expected · 71.9% collected</div>
   <div class="track"><i style="width:71.9%"></i><u style="left:80%"></u></div><div class="track-l"><span>₹0</span><span style="margin-left:auto;margin-right:16%">Target 80%</span><span>₹112 Cr</span></div></div>
  <div class="hstats"><div><b class="num">₹31.45 Cr</b><span>Pending</span></div><div><b class="num">₹12.40 Cr</b><span>Fines collected</span></div><div><b class="num">5</b><span>Colleges</span></div><div><b class="num">−8.1 pts</b><span>Behind target</span></div></div></div>
 <div class="callout">${I.warn}<p><b>Science College is lowest at 55.9%</b>, 24.1 points under target with ₹7.50 Cr pending.</p><span class="btn">Open college</span></div>
 <div class="row" style="grid-template-columns:1.9fr 1fr">
  <div class="card"><div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px"><div><h5>Collection against schedule</h5><div class="cap">Cumulative, ₹ Cr</div></div><div class="lg"><span><i style="background:var(--acc)"></i>Received</span><span><i style="background:#98a2b3"></i>Due</span></div></div>${trend()}</div>
  <div class="card"><div style="display:flex;justify-content:space-between;margin-bottom:10px"><h5>Alerts</h5><div class="tabs"><span class="on">All</span><span>Unread</span></div></div>
   <div class="alert"><span class="tag" style="background:var(--bad-bg);color:var(--bad)">Receipt cancelled</span><b>Receipt #RCP-08432</b><span class="cap">Incorrect amount · ₹11,000 · Engineering</span></div>
   <div class="alert"><span class="tag" style="background:var(--warn-bg);color:var(--warn)">Fee updated</span><b>Concession approved</b><span class="cap">₹20,000 to ₹17,000 · Engineering</span></div>
   <div class="alert"><span class="tag" style="background:var(--bad-bg);color:var(--bad)">Receipt cancelled</span><b>Receipt #RCP-08433</b><span class="cap">Duplicate entry · Law</span></div></div>
 </div>
 <div class="card"><div style="display:flex;justify-content:space-between;margin-bottom:12px"><div><h5>Colleges, lowest collection first</h5><div class="cap">Black tick marks the 80% target</div></div></div>
  <table>${thead('College')}<tbody>${financeRows(colleges)}</tbody></table></div>
</div></div>`;}


function stackDrawer(level){
 level=level||'programme';
 const mk=(arr,den)=>arr.map(a=>({n:a[0],r:a[1],e:a[2],p:+(a[1]/a[2]*100).toFixed(1),pend:+(a[2]-a[1]).toFixed(2)}));
 const L={
  college:{spines:['All colleges','Engineering College'],title:'Engineering College',lbl:'TOTAL RECEIVED · ENGINEERING',big:'₹28.50 Cr',pct:83.8,stats:[['Expected','₹34.00 Cr'],['Pending','₹5.50 Cr'],['Collection','83.8%'],['Against 80% target','+3.8 pts']],low:['Lowest collection · B.Tech','₹5.00 Cr pending · 5.0 pts below target'],tab:'Programmes',col:'Programme',rows:mk([['B.Tech',15.0,20.0],['M.Tech',7.2,7.5],['MSc',3.9,4.0],['PhD',2.4,2.5]]),crumb:'Income breakdown'},
  programme:{spines:['All colleges','Engineering College','B.Tech'],title:'B.Tech',lbl:'TOTAL RECEIVED · B.TECH',big:'₹15.00 Cr',pct:75,stats:[['Expected','₹20.00 Cr'],['Pending','₹5.00 Cr'],['Collection','75.0%'],['Behind 80% target','−5.0 pts']],low:['Lowest collection · Batch 2029','₹2.20 Cr pending · 24.0 pts below target'],tab:'Batches',col:'Batch',rows:mk([['Batch 2029',2.8,5],['Batch 2028',3.6,5],['Batch 2027',4.0,5],['Batch 2026',4.6,5]]),crumb:'Income breakdown'}}[level];
 const shades=['#d5dded','#e3e9f5','#eef2fa'];
 const spine=(t,i)=>`<div style="width:48px;flex:none;background:${shades[i]};display:flex;align-items:center;justify-content:center"><span style="writing-mode:vertical-rl;transform:rotate(180deg);font-weight:600;font-size:14px;white-space:nowrap">${t}</span></div>`;
 const ring='<span style="width:44px;height:44px;border-radius:50%;border:2px solid rgba(255,255,255,.35);display:grid;place-items:center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7fb0ff" stroke-width="2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-9-9v9z"/></svg></span>';
 const left=96;
 return `<div class="app" style="height:800px;position:relative"><div style="position:absolute;inset:0;display:grid;grid-template-columns:216px 1fr;overflow:hidden">${nav('fin',L.crumb)}<div class="main" style="overflow:hidden">${bar('Revenue contribution','Data for academic year 2025–26 (YTD)')}<div class="card" style="height:300px"></div></div></div>
  <div style="position:absolute;inset:0;background:rgba(10,20,50,.5)"></div>
  <div style="position:absolute;left:${left}px;right:0;top:12px;bottom:12px;display:flex;border-radius:22px 0 0 22px;overflow:hidden;background:#fff;box-shadow:-20px 0 50px rgba(8,21,58,.25)">
   ${L.spines.map(spine).join('')}
   <div style="flex:1;padding:24px 32px;display:flex;flex-direction:column;gap:16px;min-width:0;background:#fff">
    <div class="dh" style="padding:0"><div class="person" style="gap:12px"><span class="av" style="width:44px;height:44px;border-radius:12px;background:var(--acc-bg)">${I.fin}</span><div><div style="font-weight:700;font-size:16px">${L.title}</div><div class="cap" style="color:var(--sub);font-size:12.5px">Data for academic year 2025–26 (YTD)</div></div></div>
     <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#344054" stroke-width="2" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg></div>
    <div class="card hero" style="display:block;padding:20px 26px"><div style="display:flex;gap:14px;align-items:center">${ring}<div><div class="lbl">${L.lbl}</div><div class="big num" style="font-size:30px;margin:0">${L.big}</div></div></div>
     <div class="track" style="margin-top:14px"><i style="width:${L.pct}%"></i><u style="left:80%"></u></div>
     <div class="hstats" style="grid-template-columns:repeat(4,1fr);margin-top:16px">${L.stats.map(x=>`<div><span>${x[0]}</span><b class="num" style="font-size:18px">${x[1]}</b></div>`).join('')}</div></div>
    <div class="callout warn" id="lowline" style="background:var(--canvas);border-color:var(--ln);padding:10px 16px"><svg viewBox="0 0 24 24" fill="none" stroke="#d9910a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.1"/></svg><p><b>${L.low[0]}</b><br><span class="cap" style="color:var(--sub)">${L.low[1]}</span></p></div>
    <div class="tabs" style="display:flex"><span class="on" style="flex:1;text-align:center;padding:9px">${L.tab}</span><span style="flex:1;text-align:center;padding:9px">Fee breakdown</span></div>
    <div class="card" style="padding:16px 18px"><table>${thead(L.col)}<tbody>${financeRows(L.rows)}</tbody></table></div>
   </div></div></div>`;}

function drill(){
 const progs=[{n:'B.Tech Mechanical',r:5.6,e:8.0},{n:'B.Tech Electronics',r:7.8,e:9.5},{n:'B.Tech Computer Science',r:11.2,e:12.5},{n:'B.Tech Civil',r:3.9,e:4.0}].map(c=>({...c,p:+(c.r/c.e*100).toFixed(1),pend:+(c.e-c.r).toFixed(2)}));
 return `<div class="app" >${nav('fin','Overview')}<div class="main">
 ${bar('Engineering College','Programmes · academic year 2025–26')}
 <div class="card" style="display:flex;justify-content:space-between;align-items:center;padding:12px 18px">
  <div class="crumb"><span>Group</span><em>›</em><b>Engineering College</b><em>›</em><span>Programme</span><em>›</em><span>Batch</span></div>
  <div class="tabs"><span>Group</span><span>College</span><span class="on">Programme</span><span>Batch</span></div></div>
 <div class="row" style="grid-template-columns:repeat(4,1fr)">
  <div class="card kpi"><span class="cap">Received</span><span class="v">₹28.50 Cr</span><span class="d">of ₹34.00 Cr expected</span></div>
  <div class="card kpi"><span class="cap">Pending</span><span class="v">₹5.50 Cr</span><span class="d">across 4 programmes</span></div>
  <div class="card kpi"><span class="cap">Collection</span><span class="v">83.8%</span><span class="d up">+3.8 pts over target</span></div>
  <div class="card kpi"><span class="cap">Lowest programme</span><span class="v" style="font-size:20px;padding-top:6px">Mechanical</span><span class="d dn">70.0%, 10.0 pts under target</span></div></div>
 <div class="callout warn"><svg viewBox="0 0 24 24" fill="none" stroke="#a15c07" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.1"/></svg><p><b>B.Tech Mechanical is the weakest programme</b>, ₹2.40 Cr pending against a ₹8.00 Cr expected.</p><span class="btn">Open programme</span></div>
 <div class="card"><div style="display:flex;justify-content:space-between;margin-bottom:12px"><div><h5>Programmes, lowest collection first</h5><div class="cap">Same columns as the group and college views</div></div></div>
  <table>${thead('Programme')}<tbody>${financeRows(progs)}</tbody></table></div>
</div></div>`;}

function staff(){
 const kp=[['Total staff','1,250',null,[1210,1218,1225,1232,1240,1245,1250],'#667085','across 5 colleges'],
  ['Present today','1,115','+0.8% vs yesterday',[1080,1092,1088,1101,1098,1110,1115],'#12805c','up'],
  ['Absent','56','+8.2% vs yesterday',[41,44,40,48,45,52,56],'#d92d20','dn'],
  ['On leave','79','−2.1% vs yesterday',[88,90,86,84,83,81,79],'#d9910a','up'],
  ['Late check-in','23','+4.5% vs yesterday',[18,20,17,19,22,21,23],'#d9910a','dn']];
 const att=[['Engineering',512,28,31],['Medical',231,10,17],['Arts & Management',148,7,11],['Science',130,6,12],['Law',94,5,8]];
 const abs=[['Rajesh Kumar','CSE · Engineering',6],['Meera Nair','Anatomy · Medical',5],['Anil Verma','Commerce · Arts & Mgmt',5],['Sana Iqbal','Physics · Science',4]];
 return `<div class="app" >${nav('staff','Overview')}<div class="main">
 ${bar('Staff overview','Today · all 5 colleges · sample data')}
 <div class="row" style="grid-template-columns:repeat(5,1fr)">${kp.map(k=>`<div class="card kpi"><span class="cap">${k[0]}</span><div style="display:flex;justify-content:space-between;align-items:end;gap:6px"><span class="v">${k[1]}</span>${spark(k[3],k[4],64,26)}</div><span class="d ${k[5]=='up'?'up':k[5]=='dn'?'dn':''}">${k[2]||k[5]}</span></div>`).join('')}</div>
 <div class="row" style="grid-template-columns:1.9fr 1fr">
  <div class="card"><div style="display:flex;justify-content:space-between;margin-bottom:14px"><div><h5>Attendance by college</h5><div class="cap">Share of staff, today</div></div><div class="lg"><span><i style="background:#12805c"></i>Present</span><span><i style="background:#d92d20"></i>Absent</span><span><i style="background:#f2b53a"></i>On leave</span></div></div>
   <div style="display:flex;flex-direction:column;gap:16px">${att.map(a=>{const t=a[1]+a[2]+a[3];return `<div style="display:grid;grid-template-columns:150px 1fr 64px;gap:14px;align-items:center"><span style="font-weight:600">${a[0]}</span><div class="stack"><i style="width:${a[1]/t*100}%;background:#12805c"></i><i style="width:${a[2]/t*100}%;background:#d92d20"></i><i style="width:${a[3]/t*100}%;background:#f2b53a"></i></div><span class="num r" style="text-align:right;font-weight:600">${(a[1]/t*100).toFixed(1)}%</span></div>`}).join('')}</div></div>
  <div class="card"><div style="display:flex;justify-content:space-between;margin-bottom:10px"><h5>Needs attention</h5><div class="tabs"><span class="on">All</span><span>Unread</span></div></div>
   <div class="alert"><span class="tag" style="background:var(--bad-bg);color:var(--bad)">Absence trend</span><b>Absences peak on Mondays</b><span class="cap">Highest across the period · all colleges</span></div>
   <div class="alert"><span class="tag" style="background:var(--warn-bg);color:var(--warn)">Uninformed absence</span><b>3 absences with no leave request</b><span class="cap">This month · Engineering</span></div></div>
 </div>
 <div class="card"><div style="display:flex;justify-content:space-between;margin-bottom:12px"><div><h5>Most days absent this period</h5><div class="cap">Names are placeholders</div></div><span class="pill">View all</span></div>
  <table><thead><tr><th>Employee</th><th>Department</th><th>Absence pattern</th><th class="r">Days absent</th></tr></thead><tbody>${abs.map(a=>`<tr><td><div class="person"><span class="av">${a[0].split(' ').map(w=>w[0]).join('')}</span><b>${a[0]}</b></div></td><td>${a[1]}</td><td style="width:30%"><div class="mini"><b style="width:${a[2]/6*100}%;background:#d92d20"></b></div></td><td class="r"><span class="chip ${a[2]>=6?'bad':'warn'}">${a[2]} days</span></td></tr>`).join('')}</tbody></table></div>
</div></div>`;}

