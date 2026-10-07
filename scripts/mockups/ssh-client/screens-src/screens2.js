const {ic,os,shell,toolbar,CSS}=require('./lib');
const fs=require('fs');
const out={},heights={};
const sec='color:#909090';
// smooth path (Catmull-Rom -> cubic bezier)
function smooth(pts){let d=`M${pts[0][0]},${pts[0][1]}`;for(let i=0;i<pts.length-1;i++){const p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||p2;
 const c1=[p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6],c2=[p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6];d+=`C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`}return d}
const tab=(t)=>`<div style="position:absolute;left:0;top:0;height:36px;padding:0 14px;display:flex;align-items:center;gap:18px;border-right:1px solid #2b2b33;background:#171721">${t}<span style="color:#bdbdbd">${ic('x',13)}</span></div>`;

// ---------- Hosts grid ----------
{
 const H=[['API Gateway','10.0.4.21','ubuntu',1],['Staging-server','10.0.7.12','fedora',1],['Dev-api-01','10.0.7.14','ubuntu',1],['Test-app-01','10.0.9.4','android',1],['Test-app-02','10.0.9.5','android',0],['DB-master','10.0.4.35','debian',1],['Prod-server 1','10.0.5.9','fedora',1],['Prod-server 2','10.0.5.10','debian',1],['Deployment-server','10.0.3.7','mint',1],['Jump-server','10.0.1.2','ubuntu',1],['Cloud-instance-01','10.0.4.18','arch',0],['Apache-02','10.0.4.22','ubuntu',1]];
 const cw=(1000-2*20)/3,x0=214-20;
 const cards=H.map((h,i)=>{const x=x0+(i%3)*(cw+20),y=212+Math.floor(i/3)*(150+16);return `<div class=card style="position:absolute;left:${x}px;top:${y}px;width:${cw}px;height:150px;border-radius:10px">
  <div style="display:flex;gap:14px;align-items:center;padding:16px 16px 0">${os(h[2],48)}<div><div style="font-size:16px;font-weight:500;display:flex;align-items:center;gap:8px;white-space:nowrap">${h[0]}<span style="width:8px;height:8px;border-radius:50%;background:${h[3]?'#4fb286':'#5a5a66'}"></span></div><div class=sec>${h[1]}</div></div><div style="margin-left:auto;align-self:flex-start;color:#bdbdbd;position:absolute;right:14px;top:16px">${ic('dots',18)}</div></div>
  <div style="position:absolute;left:0;right:0;top:84px;height:1px;background:#2b2b33"><div style="position:absolute;left:50%;top:-10px;margin-left:-10px;width:20px;height:20px;border-radius:50%;background:#2b2b33;display:grid;place-items:center;color:#bdbdbd">${ic('chev',12)}</div></div>
  <div style="position:absolute;left:16px;right:16px;top:100px;display:flex;align-items:center;gap:10px"><div class=tile style="width:32px;height:32px;color:#cabbff">${ic('layout',14)}</div><div class=tile style="width:32px;height:32px">${ic('term',14)}</div><div class=tile style="width:32px;height:32px">${ic('doc',14)}</div><div class=ghost style="margin-left:auto;font-size:12px;padding:6px 18px">Connect</div></div></div>`}).join('');
 const f=[['list','All',1],['layout','Group'],['sliders','Serial'],['check','Connected'],['ai','Favourite']];
 out.hosts=shell('Hosts',toolbar()+`<div class=title style="position:absolute;left:${x0}px;top:124px">Hosts</div>
  <div class=seg style="position:absolute;left:${x0+1000-440}px;top:118px;width:440px">${f.map(t=>`<div class="${t[2]?'on':''}" style="gap:6px;padding:5px 9px">${ic(t[0],15)}${t[1]}</div>`).join('')}</div>${cards}`,tab('API Gateway'));
}

// ---------- Host header + tabs ----------
const hostHead=(active)=>`<div style="position:absolute;left:214px;top:122px;display:flex;align-items:center;gap:12px">${os('ubuntu',40)}<span class=title>API Gateway</span></div>
 <div style="position:absolute;left:${214+960-536}px;top:118px;display:flex;background:#101018;border:1px solid #2b2b33;border-radius:8px;padding:4px;width:536px;font-weight:500">
  ${[['Stats','#cabbff',1],['File Explorer','#4cc5f4'],['Terminal ↗','#58e0b0'],['Edit Host','#ffea80']].map(t=>`<div style="display:flex;align-items:center;gap:8px;padding:7px 12px;border-radius:6px;${t[2]?'background:#171721;':''}"><span style="color:${t[1]}">${ic(t[2]?'layout':t[0].startsWith('File')?'folder':t[0].startsWith('Term')?'term':'edit',16)}</span>${t[0]}</div>`).join('')}</div>
 <div style="position:absolute;left:214px;top:178px;width:960px;bottom:0;background:#111119;border-radius:10px 10px 0 0;border:1px solid #2b2b33;border-bottom:0">
  <div style="display:flex;height:50px;border-bottom:1px solid #2b2b33">${['Overview','Performance','Storage','Network','Activity'].map(t=>`<div style="flex:1;display:grid;place-items:center;font-size:16px;font-weight:${t===active?600:400};color:${t===active?'#e4e4e4':'#bdbdbd'};position:relative">${t}${t===active?'<i style="position:absolute;left:25%;right:25%;bottom:-1px;height:2px;background:#e4e4e4"></i>':''}</div>`).join('')}</div><div style="position:absolute;left:0;right:0;top:50px;bottom:0">`;

// ---------- Performance ----------
{
 const cores=[75,75,35,25,50,38,30,55];
 const pts=[48,38,27,31,40,52,73,50,51,58,38,52,66,65,60].map((v,i,a)=>[i*(470/(a.length-1)),140-v*1.4]);
 const line=smooth(pts),area=line+`L470,140L0,140Z`;
 const ax=(l,v)=>`<div style="position:absolute;left:0;width:26px;text-align:right;top:${140-v*1.4-7}px;font-size:10px;${sec}">${l}</div>`;
 const info=(l,v)=>`<div style="flex:1"><div class=sec style="margin-bottom:8px">${l}</div><div style="font-size:16px;font-weight:500">${v}</div></div>`;
 out.performance=shell('Hosts',toolbar()+hostHead('Performance')+`
  <div style="position:absolute;left:24px;right:24px;top:24px;border:1px solid #2b2b33;border-radius:6px;padding:22px 32px 26px;height:488px">
   <div style="display:flex;align-items:center;gap:10px;font-size:16px;font-weight:500;margin-bottom:24px"><span style="color:#cabbff">${ic('server',18)}</span>CPU Info</div>
   <div style="display:flex;gap:16px;margin-bottom:22px">${info('CPU Model','Intel Xeon E5-2676 v3')}${info('Architecture','x86_64')}${info('Cores','8 Cores')}${info('Threads','16 Threads')}</div>
   <div style="display:flex;gap:16px;padding-bottom:20px;border-bottom:1px solid #2b2b33">${info('Total CPU Usage','48%')}${info('Temperature','62°C')}<div style="flex:2"><div class=sec style="margin-bottom:6px">Load Average</div><div style="display:flex;gap:18px;font-size:13px"><div><div class=sec style="font-size:11px">1m</div>1.02</div><div><div class=sec style="font-size:11px">5m</div>0.88</div><div><div class=sec style="font-size:11px">15m</div>0.95</div></div></div></div>
   <div style="display:flex;gap:40px;margin-top:22px">
    <div style="width:500px"><div style="font-size:16px;font-weight:500;margin-bottom:14px">CPU Usage</div>
     <div style="position:relative;height:168px;padding-left:34px"><div style="position:absolute;left:34px;top:0">
      <svg width="470" height="146" viewBox="0 -2 470 146" overflow="visible"><defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4cc5f4" stop-opacity=".6"/><stop offset="1" stop-color="#4cc5f4" stop-opacity=".05"/></linearGradient></defs>
      <path d="${area}" fill="url(#a)"/><path d="${line}" fill="none" stroke="#4cc5f4" stroke-width="1.5"/><line x1="188" y1="0" x2="188" y2="140" stroke="#909090" stroke-dasharray="3 3"/><circle cx="188" cy="${140-73*1.4}" r="3" fill="#4cc5f4"/></svg>
      <div style="position:absolute;left:198px;top:0;width:76px;height:44px;border:1px solid #2b2b33;border-radius:4px;background:#111119;padding:6px 8px;font-size:11px;line-height:1.4"><span class=sec>10:00</span><br><b style="font-size:13px">75%</b></div></div>
      ${[100,75,50,25,0].map(v=>ax(v,v)).join('')}
      <div style="position:absolute;left:34px;top:150px;width:470px;display:flex;justify-content:space-between;font-size:10px;${sec}">${['00:00','04:00','08:00','12:00','16:00','20:00','Now'].map(t=>`<span>${t}</span>`).join('')}</div></div></div>
    <div style="flex:1"><div style="font-size:16px;font-weight:500;margin-bottom:14px">Per Core Usage</div>
     ${cores.map((v,i)=>`<div style="display:flex;align-items:center;gap:14px;height:19px;font-size:11px"><span style="width:62px">Core ${i+1} : ${v}%</span><div style="flex:1;height:5px;border-radius:3px;background:#2b2b33"><div style="width:${v}%;height:100%;border-radius:3px;background:#e4e4e4"></div></div></div>`).join('')}</div>
   </div></div>
  <div style="position:absolute;left:24px;right:24px;top:538px;border:1px solid #2b2b33;border-radius:6px;padding:22px 32px;height:120px"><div style="display:flex;align-items:center;gap:10px;font-size:16px;font-weight:500;margin-bottom:18px"><span style="color:#4cc5f4">${ic('db',18)}</span>RAM Stats</div><div style="display:flex">${info('Total RAM','32 GB')}${info('Used RAM','18.4 GB')}${info('Free RAM','13.6 GB')}</div></div></div>`,tab('API Gateway'));
}

// ---------- Storage ----------
{
 const rows=[['/','overlay','199 GB','129 GB','70 GB',65,'0.2 MB/s','0.1 MB/s'],['/boot','ext4','1.0 GB','0.3 GB','0.7 GB',30,'0.1 MB/s','0.0 MB/s'],['/var/log','ext4','100 GB','95 GB','5.0 GB',95,'14.8 MB/s','52.4 MB/s'],['/mnt/data','overlay','200 GB','190 GB','10 GB',95,'31.5 MB/s','12.6 MB/s']];
 const sum=(l,v)=>`<div style="flex:1"><div class=sec style="margin-bottom:8px">${l}</div><div style="font-size:16px;font-weight:500">${v}</div></div>`;
 const col=[170,100,100,110,210,100,100];
 const hd=['Mount Point','Total','Used','Available','Usage','Read','Write'];
 out.storage=shell('Hosts',toolbar()+hostHead('Storage')+`
  <div style="position:absolute;left:24px;right:24px;top:24px;border:1px solid #2b2b33;border-radius:6px;padding:22px 32px 24px"><div style="display:flex;align-items:center;gap:10px;font-size:16px;font-weight:500;margin-bottom:22px"><span style="color:#ffea80">${ic('db',20)}</span>Disk Storage</div><div style="display:flex">${sum('Total Storage','500 GB')}${sum('Used Storage','414.3 GB')}${sum('Free Storage','85.7 GB')}</div></div>
  <div style="position:absolute;left:24px;right:24px;top:170px;border:1px solid #2b2b33;border-radius:6px;padding:20px 22px 12px">
   <div style="display:flex;padding:0 14px 10px;font-size:12px;${sec}">${hd.map((h,i)=>`<span style="width:${col[i]}px">${h}</span>`).join('')}</div>
   ${rows.map((r,i)=>`<div style="display:flex;align-items:center;height:68px;padding:0 14px;border-top:${i?'1':'0'}px solid #2b2b33"><div style="width:${col[0]}px"><div style="font-size:16px;font-weight:500">${r[0]}</div><div class=sec style="font-size:11px">${r[1]}</div></div><span style="width:${col[1]}px;font-size:13px">${r[2]}</span><span style="width:${col[2]}px;font-size:13px">${r[3]}</span><span style="width:${col[3]}px;font-size:13px">${r[4]}</span>
    <div style="width:${col[4]}px;display:flex;align-items:center;gap:10px"><div style="width:120px;height:7px;border-radius:4px;background:#2b2b33"><div style="width:${r[5]}%;height:100%;border-radius:4px;background:${r[5]>=90?'#d9263c':r[5]>=50?'#4cc5f4':'#4cc5f4'}"></div></div><span style="font-size:11px">${r[5]}%</span></div><span style="width:${col[5]}px;font-size:13px">${r[6]}</span><span style="width:${col[6]}px;font-size:13px">${r[7]}</span></div>`).join('')}</div></div>`,tab('API Gateway'));
}

// ---------- Activity ----------
{
 const tiles=[['Total Processes','187'],['Zombie Processes','0'],['Running','3'],['Sleeping','184']];
 const procs=[['3456','nginx','23.4%'],['5678','postgres','18.3%'],['9012','redis','12.7%'],['1234','node','8.9%'],['7890','docker','6.2%']];
 const svc=[['SSH',1],['Firewall',1],['Cron',1],['Nginx',1],['Syslog',1],['PostgreSQL',1],['Redis',1],['Apache',0]];
 const pill=(a)=>`<span style="font-size:10px;padding:3px 10px;border-radius:10px;background:${a?'#16241f':'#1b1b24'};color:${a?'#4fd1a0':'#909090'}">${a?'Active':'Inactive'}</span>`;
 const logs=[['INFO','10:08:45','nginx','Nginx reloaded successfully','#4cc5f4'],['INFO','10:07:32','backup','Backup completed successfully','#4cc5f4'],['WARN','10:06:18','system','Disk usage above 90% on /var/log','#ffb020'],['DEBUG','10:05:11','postgres','Database connection pool: 45/100 active','#a567ff'],['ERROR','10:02:18','nginx','Connection timeout on upstream server','#e5384f']];
 out.activity=shell('Hosts',toolbar()+hostHead('Activity')+`
  <div style="position:absolute;left:24px;right:24px;top:24px;display:flex;gap:12px">${tiles.map(t=>`<div style="flex:1;border:1px solid #2b2b33;border-radius:4px;padding:12px 14px;background:#12121a"><div class=sec style="margin-bottom:6px">${t[0]}</div><div style="font-size:16px;font-weight:500">${t[1]}</div></div>`).join('')}</div>
  <div style="position:absolute;left:24px;top:116px;width:408px;height:350px;border:1px solid #2b2b33;border-radius:4px;padding:22px 22px">
   <div style="display:flex;align-items:center;margin-bottom:22px"><span style="font-size:16px;font-weight:600">CPU-Intensive Processes</span><div class=seg style="margin-left:auto;padding:2px"><div class=on style="padding:3px 12px;font-size:11px">CPU</div><div style="padding:3px 10px;font-size:11px">Memory</div></div></div>
   <div style="display:flex;font-size:11px;${sec};padding:0 10px 10px"><span style="width:70px">PID</span><span style="width:130px">Process Name</span><span style="width:80px">CPU%</span><span>Status</span></div>
   ${procs.map((p,i)=>`<div style="display:flex;align-items:center;height:44px;padding:0 10px;border-top:${i?1:0}px solid #2b2b33;font-size:14px"><span style="width:70px">${p[0]}</span><span style="width:130px">${p[1]}</span><span style="width:80px">${p[2]}</span>${pill(1)}</div>`).join('')}</div>
  <div style="position:absolute;left:446px;top:116px;right:24px;height:300px;border:1px solid #2b2b33;border-radius:4px;padding:22px 20px"><div style="font-size:16px;font-weight:600;margin-bottom:22px">Services &amp; Daemon Status</div>
   <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 8px">${svc.map(s=>`<div style="height:44px;border:1px solid #2b2b33;border-radius:4px;background:#12121a;display:flex;align-items:center;justify-content:space-between;padding:0 12px;font-size:14px">${s[0]}${pill(s[1])}</div>`).join('')}</div></div>
  <div style="position:absolute;left:24px;right:24px;top:484px;border:1px solid #2b2b33;border-radius:4px;padding:22px 22px 8px"><div style="font-size:16px;font-weight:600;margin-bottom:12px">System Logs</div>
   ${logs.map((l,i)=>`<div style="display:flex;align-items:center;height:52px;border-top:${i?1:0}px solid #2b2b33;font-size:13px"><span style="width:72px;text-align:center;padding:5px 0;border-radius:3px;background:${l[4]}22;color:${l[4]};font-size:12px;margin-right:18px">${l[0]}</span><span class=sec style="width:76px">${l[1]}</span><span style="width:80px;font-size:15px;font-weight:500">${l[2]}</span><span>${l[3]}</span></div>`).join('')}</div></div>`,tab('API Gateway'));
 heights.activity=1060;
}

// ---------- Terminal + packages + Ask AI ----------
{
 const g=s=>`<span style="color:#58e0b0">${s}</span>`,b=s=>`<span style="color:#4cc5f4">${s}</span>`,p=s=>`<span style="color:#ff6fa5">${s}</span>`,m=s=>`<span style="color:#6b7090">${s}</span>`,y=s=>`<span style="color:#ffea80">${s}</span>`;
 const pr=`${g('ubuntu@api-gateway')}:${b('~')}$ `;
 const T=[`${pr}sudo systemctl status nginx`,`${g('●')} nginx.service - A high performance web server`,`     Loaded: loaded (/lib/systemd/system/nginx.service; enabled)`,`     Active: ${g('active (running)')} since Mon 2025-11-10 09:12:44 UTC; 5 days ago`,`   Main PID: 1234 (nginx)`,`      Tasks: 9 (limit: 4620)`,``,`${pr}docker ps --format ${y('"table {{.Names}}\\t{{.Status}}"')}`,`NAMES          STATUS`,`api            Up 3 hours`,`redis          Up 5 days`,`worker         Up 5 days`,``,`${pr}tail -n 3 /var/log/nginx/error.log`,`${m('2025/11/15 10:02:18')} [${p('error')}] 1234#1234: upstream timed out`,`${m('2025/11/15 10:02:19')} [${p('error')}] 1234#1234: upstream timed out`,`${m('2025/11/15 10:06:18')} [${b('notice')}] signal process started`,``,`${pr}df -h /var/log`,`Filesystem      Size  Used Avail Use% Mounted on`,`/dev/nvme1n1    100G   95G  5.0G  ${p('95%')} /var/log`,``,`${pr}<span style="display:inline-block;width:8px;height:15px;background:#4cc5f4;vertical-align:-2px"></span>`];
 const pk=[['devops-kit',3],['Git Workflows',3],['Server Management',3]];
 out.terminal=shell('Terminal',`
  <div style="position:absolute;left:108px;top:36px;right:0;bottom:0;background:#070b1e"></div>
  <div style="position:absolute;left:132px;top:62px;font:400 13px/18px 'DejaVu Sans Mono',monospace;color:#e6e9f5;white-space:pre">${T.join('\n')}</div>
  <div style="position:absolute;left:880px;top:36px;right:0;bottom:0;background:#171721;border-left:1px solid #2b2b33">
   <div style="display:flex;align-items:center;height:62px;padding:0 20px;border-bottom:1px solid #2b2b33"><span style="font-size:16px;font-weight:500">Terminal Settings</span><span style="margin-left:auto;display:flex;gap:18px;color:#e4e4e4">${ic('gear',20)}${ic('x',22)}</span></div>
   <div style="display:flex;align-items:center;gap:10px;height:62px;padding:0 20px;border-bottom:1px solid #2b2b33"><span style="color:#4cc5f4">${ic('ai',20)}</span><span style="font-weight:500">Autocomplete Commands</span><span style="margin-left:auto;width:44px;height:24px;border-radius:12px;background:#1aa7e8;position:relative"><i style="position:absolute;right:3px;top:3px;width:18px;height:18px;border-radius:50%;background:#fff"></i></span></div>
   <div style="display:flex;gap:8px;padding:16px 20px"><div style="flex:1;display:flex;background:#101018;border:1px solid #2b2b33;border-radius:8px;padding:3px"><div style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;height:34px;border-radius:6px;background:#4cb6ff;color:#07101c;font-weight:500">${ic('db',16,'#07101c')}Packages</div><div style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;color:#e4e4e4;font-weight:500">${ic('clock',16)}History</div></div><div class=tile style="width:46px;height:46px;border:1px solid #2b2b33;border-radius:8px">${ic('search',18)}</div></div>
   ${pk.map(k=>`<div style="display:flex;align-items:center;gap:10px;height:56px;margin:0 20px;border-bottom:1px solid #2b2b33"><span style="color:#bdbdbd">${ic('db',16)}</span>${k[0]}<span style="margin-left:auto;font-size:11px;background:#2b2b33;border-radius:8px;padding:1px 6px">${k[1]}</span><span style="color:#bdbdbd">${ic('fwd',14)}</span></div>`).join('')}
   <div style="position:absolute;right:18px;bottom:22px;height:38px;padding:0 18px;border-radius:19px;background:linear-gradient(90deg,#1aa7e8,#4ad4ff);color:#fff;font-weight:500;display:flex;align-items:center;gap:8px">${ic('ai',18,'#fff')}Ask AI</div></div>`,tab('API Gateway'));
}

// ---------- Add Host ----------
{
 const fld=(l,v,ico,w)=>`<div style="margin-bottom:22px;${w?`width:${w}px`:''}"><div style="font-size:13px;margin-bottom:8px">${l}</div><div style="height:44px;border:1px solid #2b2b33;border-radius:6px;background:#12121a;display:flex;align-items:center;gap:12px;padding:0 14px;color:${v?'#e4e4e4':'#909090'}"><span style="color:#6a6a78">${ic(ico,18)}</span>${v}</div></div>`;
 out.add_host=shell('Hosts',toolbar()+`
  <div style="position:absolute;left:108px;top:99px;width:728px;bottom:0;display:grid;place-items:center;text-align:center"><div><div class=tile style="width:60px;height:60px;margin:0 auto 18px;background:#262634">${ic('server',28,'#cabbff')}</div><div style="font-size:20px;font-weight:600">No Host Yet</div><div style="margin:6px 0 20px">Add your first host to start tracking its performance</div><div class=btn style="width:119px;height:32px;margin:0 auto;font-size:13px">Add Host</div></div></div>
  <div style="position:absolute;left:836px;top:99px;right:0;bottom:0;background:#171721;border-left:1px solid #2b2b33">
   <div style="display:flex;align-items:center;gap:14px;height:72px;padding:0 30px;border-bottom:1px solid #2b2b33"><span style="color:#cabbff">${ic('server',26)}</span><span style="font-size:20px;font-weight:600">New Host</span><span style="margin-left:-6px;color:#bdbdbd">${ic('chev',16)}</span><span style="margin-left:auto;display:flex;gap:20px">${ic('copy',20)}${ic('x',24)}</span></div>
   <div style="padding:20px 34px 0"><div class=seg style="margin-bottom:22px;padding:4px"><div class=on style="flex:1;justify-content:center;font-size:13px">Connection</div><div style="flex:1;justify-content:center;font-size:13px;padding:5px 8px">Authentication</div><div style="flex:1;justify-content:center;font-size:13px">Advanced</div><div style="flex:1;justify-content:center;font-size:13px">Appearance</div></div>
    ${fld('Host Address','10.0.4.21','server')}${fld('SSH Port','22','lock',180)}${fld('Label','API Gateway','doc')}
    <div style="display:flex;gap:12px"><div style="flex:1">${fld('Tags','production','list')}</div><div style="flex:1">${fld('Group','Backend','layout')}</div></div>${fld('Backspace','Control-H','x')}</div>
   <div style="position:absolute;left:0;right:0;bottom:0;height:84px;border-top:1px solid #2b2b33;display:flex;align-items:center;justify-content:space-between;padding:0 32px"><span style="font-weight:500">Cancel</span><div class=btn style="width:109px;height:36px">Create Host</div></div></div>`,tab('New Host'));
}
for(const k of ['performance','storage','activity']) out[k]=out[k].replace('</body>','</div></div></body>');
for(const [k,v] of Object.entries(out)) fs.writeFileSync(`${__dirname}/screens/${k}.html`,v);
fs.writeFileSync(`${__dirname}/heights.json`,JSON.stringify(heights));
console.log(Object.keys(out).join(' '));
