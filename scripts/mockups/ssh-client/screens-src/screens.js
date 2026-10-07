const {ic,os,shell,toolbar,CSS}=require('./lib');
const fs=require('fs');
const L=146,W=1096; // shared content column for every screen
const out={};

// ---------- Key Manager ----------
{
 const keys=[
  ['Production Server Key','ED25519','key','#cabbff','2 hosts','3h ago'],
  ['Laptop Windows Hello','Windows Hello','smile','#4cc5f4','1 host','Yesterday'],
  ['Deploy Certificate','X.509 certificate','cert','#b86bd0','4 hosts','2d ago'],
  ['GitHub Account','RSA 4096','key','#cabbff','1 host','5h ago'],
  ['YubiKey 5 NFC','FIDO2 hardware key','usb','#ffea80','3 hosts','3h ago'],
  ['Staging Certificate','X.509 certificate','cert','#b86bd0','2 hosts','1w ago'],
  ['Home Desktop','Windows Hello','smile','#4cc5f4','1 host','3d ago'],
  ['Backup Server Key','ECDSA 521','key','#cabbff','1 host','2w ago'],
  ['YubiKey 5C','FIDO2 hardware key','usb','#ffea80','2 hosts','4d ago'],
 ];
 const cw=(W-2*20)/3;
 const cards=keys.map((k,i)=>{const x=L+(i%3)*(cw+20),y=212+Math.floor(i/3)*(150+17);
  return `<div class=card style="position:absolute;left:${x}px;top:${y}px;width:${cw}px;height:150px;padding:18px 16px">
   <div style="display:flex;gap:12px;align-items:center"><div class=tile style="width:44px;height:44px;color:${k[3]}">${ic(k[2],22)}</div>
   <div><div style="font-size:16px;font-weight:500">${k[0]}</div><div class=sec style="font-size:14px">${k[1]}</div></div>
   <div style="margin-left:auto;align-self:flex-start;color:#bdbdbd">${ic('dots',18)}</div></div>
   <div style="height:1px;background:#2b2b33;margin:14px 0 12px"></div>
   <div class=sec style="display:flex;align-items:center;gap:8px;margin-bottom:6px">${ic('clock',16)}Last used ${k[5]}</div>
   <div class=sec style="display:flex;align-items:center;gap:8px">${ic('server',16)}${k[4]} connected</div></div>`}).join('');
 const tabs=[['list','All',1],['key','Key'],['cert','Certificate'],['smile','Windows Hello'],['usb','FIDO2']];
 out.key_manager=shell('More',toolbar()+`
  <div class=title style="position:absolute;left:${L}px;top:124px">Key Manager</div>
  <div class=seg style="position:absolute;right:${1280-L-W}px;top:118px">${tabs.map(t=>`<div class="${t[2]?'on':''}">${ic(t[0],16)}${t[1]}</div>`).join('')}</div>${cards}`);
}

// ---------- SFTP ----------
{
 const rows=[['Backups','18/09/2025 2:03 PM','2.4 GB',1],['Uploads','18/09/2025 1:41 PM','812 MB'],['Downloads','11/09/2025 3:43 PM','1.1 GB'],['Resources','04/08/2025 7:03 PM','346 MB'],['Archive','04/08/2025 2:03 PM','6.8 GB'],['Album','02/08/2025 6:05 PM','1.9 GB'],['Public Documents','02/08/2025 2:03 PM','128 MB'],['Authentication','02/07/2025 7:30 PM','4.2 MB'],['Videos','22/06/2025 8:03 PM','9.3 GB']];
 const lr=rows.map((r,i)=>`<div style="display:flex;align-items:center;height:42px;padding:0 16px;${i<2?'background:#171721;':''}border-radius:6px">
  <div style="width:18px;height:18px;border-radius:4px;${r[3]?'background:#a567ff;display:grid;place-items:center':'border:1px solid #424254'}">${r[3]?ic('check',13,'#fff',2.4):''}</div>
  <div style="margin-left:14px;color:#ffea80;display:flex">${ic('folder',18,'#ffea80',0)}</div><span style="margin-left:10px;width:170px">${r[0]}</span>
  <span style="width:170px;font-size:13px">${r[1]}</span><span style="width:90px;font-size:13px">${r[2]}</span><span style="margin-left:auto;color:#bdbdbd">${ic('dots',16)}</span></div>`).join('');
 const rec=[['web-prod-01','10.0.4.21','ubuntu'],['db-primary','10.0.4.35','debian'],['staging-api','10.0.7.12','ubuntu']].map(r=>`<div style="display:flex;align-items:center;gap:14px;padding:10px 12px;border:1px solid #2b2b33;border-radius:8px;margin-bottom:10px">${os(r[2],48)}<div><div style="font-size:16px;font-weight:500">${r[0]}</div><div class=sec>${r[1]}</div></div><div class=ghost style="margin-left:auto">Connect</div></div>`).join('');
 out.sftp=shell('SFTP',`
  <div class=tabbar style="left:108px;width:92px;border-right:1px solid #2b2b33;display:flex;align-items:center;padding-left:12px;gap:22px;background:#171721;z-index:2">SFTP<span style="color:#bdbdbd">${ic('x',14)}</span></div>
  <div class=title style="position:absolute;left:${L}px;top:52px">SFTP</div>
  <div class=card style="position:absolute;left:${L}px;top:112px;width:536px;height:670px;border-radius:14px">
   <div style="display:flex;align-items:center;gap:14px;padding:30px 28px 0 28px;height:90px"><div style="color:#cabbff">${ic('doc',36,'#cabbff',1.4)}</div><span style="font-size:20px;font-weight:500">Local Files</span>
    <div style="margin-left:auto;display:flex;background:#171721;border:1px solid #2b2b33;border-radius:6px;padding:3px"><div style="width:30px;height:30px;display:grid;place-items:center;color:#bdbdbd">${ic('layout',16)}</div><div style="width:30px;height:30px;border-radius:5px;background:#424254;display:grid;place-items:center">${ic('list',16)}</div></div></div>
   <div style="height:1px;background:#2b2b33;margin-top:0"></div>
   <div style="height:36px;display:flex;align-items:center;gap:16px;padding:0 24px;border-bottom:1px solid #2b2b33;color:#bdbdbd">${ic('back',16)}${ic('fwd',16)}<span style="width:1px;height:36px;background:#2b2b33"></span><span style="color:#a567ff">${ic('home',18)}</span></div>
   <div style="display:flex;gap:10px;padding:18px 22px 10px"><div style="flex:1;height:36px;border:1px solid #2b2b33;border-radius:6px;background:#171721;display:flex;align-items:center;gap:8px;padding-left:14px;color:#909090">${ic('search',16)}Search</div><div class=tile style="width:36px;height:36px;border:1px solid #2b2b33">${ic('sliders',16)}</div><div class=tile style="width:36px;height:36px;border:1px solid #2b2b33">${ic('list',16)}</div></div>
   <div class=sec style="display:flex;padding:0 32px 6px 70px;font-size:11px"><span style="width:195px">File Name</span><span style="width:170px">Date Modified</span><span>Size</span></div>
   <div style="padding:0 6px">${lr}</div></div>
  <div class=card style="position:absolute;left:${L+560}px;top:112px;width:536px;height:670px;border-radius:14px;padding:0 24px">
   <div style="text-align:center;padding-top:56px"><div class=tile style="width:60px;height:60px;margin:0 auto 18px;background:#30135b;color:#cabbff">${ic('server',28)}</div><div style="font-size:20px;font-weight:600">Quick Connect</div><div class=sec style="margin-top:4px">Set up a new SFTP connection</div></div>
   <div style="display:flex;gap:14px;margin-top:22px">${[['server','Connect to Host','#4cc5f4'],['db','Connect to S3 Storage','#b86bd0']].map(a=>`<div style="flex:1;height:96px;background:#171721;border:1px solid #2b2b33;border-radius:8px;display:grid;place-items:center;text-align:center;padding-top:12px"><div style="color:${a[2]}">${ic(a[0],24)}</div><div style="font-size:13px;font-weight:500;margin-top:-18px">${a[1]}</div></div>`).join('')}</div>
   <div style="border:1px solid #2b2b33;border-radius:10px;margin-top:20px;padding:16px 16px 4px"><div style="display:flex;gap:10px;align-items:center;font-size:16px;font-weight:500;margin-bottom:16px;color:#e4e4e4"><span style="color:#bdbdbd">${ic('clock',18)}</span>Recent Connections</div>${rec}</div></div>`);
}

// ---------- Port Mapping ----------
{
 const t={Local:['local','#cabbff'],Remote:['remote','#4cc5f4'],Dynamic:['dyn','#58e0b0']};
 const maps=[['PostgreSQL Database','Local','5432 → db-primary:5432',1],['Dev App Tunnel','Remote','8080 ← staging-api:3000'],['Local Web Server','Remote','80 ← web-prod-01:8000'],['Private Tunnel','Dynamic','SOCKS5 · 1080'],['Dynamic Proxy','Dynamic','SOCKS5 · 9050',1],['API Tunnel','Local','3000 → staging-api:3000',1]];
 const cw=(632-20)/2;
 const cards=maps.map((m,i)=>{const x=160+(i%2)*(cw+20),y=212+Math.floor(i/2)*(156+16);const [ico,col]=t[m[1]];
  return `<div class=card style="position:absolute;left:${x}px;top:${y}px;width:${cw}px;height:156px;overflow:hidden">
  <div style="display:flex;gap:12px;align-items:center;padding:14px 14px 0;white-space:nowrap"><div class=tile style="color:${col}">${ic(ico,22)}</div>
   <div><div style="font-size:16px;font-weight:500;display:flex;align-items:center;gap:8px">${m[0]}${m[3]?'<span style="width:8px;height:8px;border-radius:50%;background:#4fb286"></span>':''}</div><div class=sec>${m[1]}</div><div class=sec style="font-size:12px">${m[2]}</div></div><div style="margin-left:auto;align-self:flex-start;color:#bdbdbd">${ic('dots',18)}</div></div>
  <div style="height:1px;background:#2b2b33;margin:16px 0 0"></div>
  <div style="display:flex;align-items:center;gap:8px;padding:14px;color:#bdbdbd"><div class=tile style="width:30px;height:30px">${ic('edit',14)}</div><div class=tile style="width:30px;height:30px">${ic('trash',14)}</div><div class=ghost style="margin-left:auto">${m[3]?'Disconnect':'Connect'}</div></div></div>`}).join('');
 const hosts=[['arch','arch-dev','10.0.4.18','Arch Linux'],['android','android-test','10.0.9.4','Android'],['fedora','fedora-ci','10.0.5.9','Fedora'],['mint','mint-desk','10.0.3.7','Linux Mint'],['debian','db-primary','10.0.4.35','Debian']];
 const hl=hosts.map(h=>`<div style="display:flex;align-items:center;gap:14px;padding:12px 16px;background:#111119;border:1px solid #2b2b33;border-radius:8px;margin-bottom:16px">${os(h[0],42)}<div><div style="font-weight:500">${h[1]}</div><div class=sec style="font-size:13px">${h[2]} · ${h[3]}</div></div><div style="margin-left:auto;color:#bdbdbd">${ic('plus',18)}</div></div>`).join('');
 out.port_mapping=shell('Port Mapping',toolbar()+`
  <div class=title style="position:absolute;left:160px;top:124px">Port Mapping</div>
  <div class=seg style="position:absolute;left:${160+632-376}px;top:118px;width:376px">${[['list','All',1],['local','Local'],['remote','Remote'],['dyn','Dynamic']].map(t=>`<div class="${t[2]?'on':''}" style="gap:6px;padding:5px 9px">${ic(t[0],15)}${t[1]}</div>`).join('')}</div>${cards}
  <div style="position:absolute;left:836px;top:99px;right:0;bottom:0;background:#171721;border-left:1px solid #2b2b33">
   <div style="display:flex;align-items:center;gap:14px;padding:18px 32px 0;height:72px;border-bottom:1px solid #2b2b33"><span style="color:#cabbff">${ic('server',26)}</span><span style="font-size:20px;font-weight:600">Select Host</span><span style="margin-left:auto;color:#e4e4e4">${ic('x',24)}</span></div>
   <div style="padding:20px 32px 0">${hl}</div>
   <div style="position:absolute;left:0;right:0;bottom:0;height:84px;border-top:1px solid #2b2b33;display:flex;align-items:center;justify-content:flex-end;gap:30px;padding-right:32px"><span style="font-weight:500">Cancel</span><div class=btn style="width:110px;height:36px">Select</div></div></div>`);
}

// ---------- Active Sessions ----------
{
 const row=(u,e,col,o,ip,dev,loc,dur,key,live)=>`<div style="display:flex;align-items:center;height:73px;padding:0 20px;border-top:1px solid #2b2b33">
  <div style="width:42px;height:42px;border-radius:6px;background:${col};display:grid;place-items:center;font-size:22px;font-weight:500;color:#fff">${u[0]}</div>
  <div style="width:210px;margin-left:16px"><div style="font-weight:500;display:flex;align-items:center;gap:8px">${u}${live?'<span style="width:8px;height:8px;border-radius:50%;background:#4fb286"></span>':''}</div><div class=sec style="font-size:13px">${e}</div></div>
  <div style="width:220px;display:flex;align-items:center;gap:10px">${os(o,30)}<span>${ip}</span></div>
  <div style="width:130px">${dev}</div><div style="width:150px">${loc}</div><div style="width:100px">${dur}</div>
  <div style="width:110px;display:flex;align-items:center;gap:6px;font-size:13px"><span style="color:#4cc5f4">${ic('key',14)}</span>${key}</div><div style="margin-left:auto;color:#bdbdbd">${ic('dots',18)}</div></div>`;
 const head=(d)=>`<div class=sec style="display:flex;align-items:center;height:46px;padding:0 20px;color:#bdbdbd"><span style="width:268px;color:#e4e4e4">${d}</span><span style="width:220px">Host</span><span style="width:130px">Device</span><span style="width:150px">Location</span><span style="width:100px">Duration</span><span>Key</span></div>`;
 out.sessions=shell('More',toolbar()+`
  <div style="position:absolute;left:${L}px;top:122px;display:flex;align-items:center;gap:14px"><span class=title>Active Sessions</span><span style="background:#101018;border:1px solid #2b2b33;border-radius:20px;padding:3px 14px;font-size:12px;color:#4cc5f4">3 active</span></div>
  <div class=card style="position:absolute;left:${L}px;top:186px;width:${W}px;border-radius:12px;overflow:hidden">
   ${head('Today · Nov 15, 2025')}
   ${row('Maya Rao','maya@northwind.dev','#8a3fc4','ubuntu','10.0.4.21:22','MacBook Pro','Bengaluru, India','2h 14m','ED25519',1)}
   ${row('Dev Patel','dev@northwind.dev','#17a673','arch','10.0.4.18:22','Pixel 8','Pune, India','48m','FIDO2',1)}
   ${row('Lena Fischer','lena@northwind.dev','#d9822b','debian','10.0.4.35:22','ThinkPad X1','Berlin, Germany','1h 05m','RSA 4096',1)}
   <div style="border-top:1px solid #2b2b33">${head('Yesterday · Nov 14, 2025')}</div>
   ${row('Maya Rao','maya@northwind.dev','#8a3fc4','fedora','10.0.5.9:22','MacBook Pro','Bengaluru, India','5h 30m','ED25519')}
   ${row('Sam Okoye','sam@northwind.dev','#2b7fd9','ubuntu','10.0.7.12:22','Dell XPS 13','Lagos, Nigeria','3h 12m','ECDSA 521')}
  </div>`);
}

// ---------- Command History ----------
{
 const code=(lines)=>lines.map(l=>`<div style="white-space:pre">${l}</div>`).join('');
 const r=s=>`<span style="color:#ff5c7a">${s}</span>`,g=s=>`<span style="color:#58e0b0">${s}</span>`,y=s=>`<span style="color:#ffea80">${s}</span>`,p=s=>`<span style="color:#b86bd0">${s}</span>`;
 const cards=[
  [[`${r('menu')}() {`,` ${y('echo')}`,` ${y('echo')} ${g('"=== Terminal Toolkit ==="')}`,` ${y('echo')} ${g('"1) System Info"')}`,` ${y('echo')} ${g('"2) Backup Home"')}`,` ${y('echo')} ${g('"3) Docker Status"')}`,`}`],'5 mins ago','10.0.4.21'],
  [[`#!/usr/bin/env bash`,`${y('set')} -euo pipefail`,``,`LOGFILE=${g('"')}${p('$HOME')}${g('/.toolkit.log"')}`,`BACKUP_DIR=${g('"')}${p('$HOME')}${g('/backups"')}`],'18 mins ago','web-prod-01'],
  [[`docker ps --format ${g('"table {{.Names}}\\t{{.Status}}"')}`],'1 hour ago','staging-api'],
 ].map((c,i,a)=>{const h=30+c[0].length*17;return `<div class=card style="border-radius:8px;overflow:hidden;margin-bottom:16px"><div style="padding:18px 20px 12px;font:400 13px/17px Outfit;color:#e4e4e4;height:${h}px">${code(c[0])}</div>
  <div style="height:46px;border-top:1px solid #2b2b33;display:flex;align-items:center;padding:0 20px;gap:22px;color:#909090;font-size:13px"><span style="display:flex;gap:8px;align-items:center">${ic('clock',14)}${c[1]}</span><span style="display:flex;gap:8px;align-items:center">${ic('server',14)}${c[2]}</span><span style="margin-left:auto;display:flex;align-items:center;gap:20px;color:#bdbdbd">${ic('copy',16)}<span class=ghost style="color:#e4e4e4">Save</span></span></div></div>`}).join('');
 const dd=(i,t)=>`<div style="height:38px;border:1px solid #2b2b33;border-radius:8px;background:#111119;display:flex;align-items:center;gap:10px;padding:0 14px;color:#bdbdbd">${ic(i,17)}<span style="color:#e4e4e4;font-weight:500;width:90px">${t}</span>${ic('chev',16)}</div>`;
 out.commands=shell('More',toolbar()+`
  <div class=title style="position:absolute;left:${L}px;top:124px">Command History</div>
  <div style="position:absolute;right:${1280-L-W}px;top:118px;display:flex;gap:14px;align-items:center">${dd('server','All Hosts')}${dd('calendar','This Week')}
   <div class=seg><div>${ic('book',16)}Command Library</div><div class=on>${ic('clock',16)}Command History</div></div></div>
  <div style="position:absolute;left:${L}px;top:190px;width:${W}px">${cards}</div>`);
}

// ---------- Sign In (name removed) ----------
{
 const field=(l,i,eye)=>`<div style="margin-bottom:16px"><div style="font-weight:500;margin-bottom:6px">${l}</div><div style="height:44px;border:1px solid #2b2b33;border-radius:6px;background:#111119;display:flex;align-items:center;gap:12px;padding:0 14px;color:#909090">${ic(i,18)}<span style="flex:1"></span>${eye?ic('eye',18):''}</div></div>`;
 const sso=(t,i)=>`<div style="height:40px;border:1px solid #2b2b33;border-radius:6px;display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:8px">${i}${t}</div>`;
 out.signin=`<!doctype html><meta charset=utf-8><style>${CSS}</style><body style="background:#101018">
 <div style="position:absolute;left:0;top:0;width:664px;height:832px;background:#13131c;overflow:hidden"><div style="position:absolute;left:390px;top:-130px;width:300px;height:300px;border-radius:50%;background:#1b1b24"></div><div style="position:absolute;left:-150px;top:610px;width:400px;height:400px;border-radius:50%;background:#1b1b24"></div>
  <div style="position:absolute;left:205px;top:211px;width:248px;height:224px;border:1px solid #3a3a46;border-radius:6px"></div>
  ${[[286,174,86,80,'bars'],[162,278,86,80,'list'],[410,278,86,80,'ring'],[286,394,86,80,'prog']].map(b=>`<div style="position:absolute;left:${b[0]}px;top:${b[1]}px;width:${b[2]}px;height:${b[3]}px;border-radius:12px;background:#171721;border:1px solid #3a3a46;display:grid;place-items:center;color:#8f86c8">${b[4]==='bars'?'<div style="display:flex;gap:6px;align-items:end;height:34px">'+[18,30,22,34,26].map(h=>`<div style="width:5px;height:${h}px;border-radius:3px;background:linear-gradient(#58e0b0,#6a5acd)"></div>`).join('')+'</div>':b[4]==='ring'?'<div style="width:36px;height:36px;border-radius:50%;border:5px solid #4a4a60;border-top-color:#4cc5f4;border-right-color:#b86bd0"></div>':b[4]==='list'?ic('list',30,'#cfc9ee',1.8):ic('sliders',30,'#cfc9ee',1.8)}</div>`).join('')}
  <div style="position:absolute;left:298px;top:293px;width:62px;height:62px;border-radius:12px;background:#2a2740;display:grid;place-items:center;color:#cabbff">${ic('server',30)}</div>
  <div style="position:absolute;left:100px;width:464px;top:508px;text-align:center;font-size:24px;font-weight:500;line-height:34px">Real-time host stats dashboard<br>with performance monitoring</div>
  <div style="position:absolute;left:308px;top:602px;display:flex;gap:5px;align-items:center"><i style="width:5px;height:5px;border-radius:50%;background:#909090"></i><i style="width:22px;height:5px;border-radius:3px;background:#e4e4e4"></i><i style="width:5px;height:5px;border-radius:50%;background:#909090"></i><i style="width:5px;height:5px;border-radius:50%;background:#909090"></i></div></div>
 <div style="position:absolute;left:664px;top:0;right:0;bottom:0;background:#101018;border-left:1px solid #2b2b33"><div style="position:absolute;left:113px;width:389px;top:124px">
  <div style="text-align:center;color:#e4e4e4">${ic('cloud',60,'#e4e4e4',1.6)}<div style="font-size:20px;font-weight:500;margin-top:-6px">Sign in to your account</div></div>
  <div style="margin-top:22px">${field('Email','mail')}${field('Password','lock',1)}</div>
  <div style="text-align:right;font-weight:500;margin:-6px 0 14px">Forgot Password?</div>
  <div class=btn style="height:44px">Login</div>
  <div style="display:flex;align-items:center;gap:12px;margin:20px 8px;color:#909090;font-size:13px"><i style="flex:1;height:1px;background:#2b2b33"></i>or<i style="flex:1;height:1px;background:#2b2b33"></i></div>
  ${sso('Continue with Google','<b style="font-size:18px;color:#e4e4e4">G</b>')}${sso('Continue with Apple','<svg width="18" height="18" viewBox="0 0 24 24" fill="#e4e4e4"><path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.300.8 1.100 1.700 2.400 2.900 2.300 1.200 0 1.600-.7 3-.7s1.800.7 3 .7 2-1.100 2.800-2.200c.9-1.300 1.200-2.500 1.300-2.600-.1 0-2.500-1-2.500-3.900zM14.200 5.700c.6-.8 1.100-1.800.9-2.900-.9 0-2 .6-2.700 1.400-.6.700-1.100 1.800-.9 2.800 1 .1 2-.5 2.700-1.300z"/></svg>')}${sso('Continue with Enterprise SSO',ic('key',18))}
  <div style="text-align:center;margin-top:24px;color:#bdbdbd">New here? <span style="color:#a567ff">Create Account</span></div>
  <div class=sec style="text-align:center;margin-top:18px;font-size:12px">By continuing you agree to the Terms and Privacy Policy</div></div></div>`;
}
for(const [k,v] of Object.entries(out)) fs.writeFileSync(`${__dirname}/screens/${k}.html`,v);
console.log(Object.keys(out).join(' '));
