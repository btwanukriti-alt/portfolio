const fs=require('fs'),path=require('path');
const FD=path.join(__dirname,'node_modules/@fontsource/outfit/files');
const font=w=>`@font-face{font-family:Outfit;font-weight:${w};src:url(file://${FD}/outfit-latin-${w}-normal.woff2) format('woff2')}`;
const I=(d,s=20,c='currentColor',sw=1.7)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const P={
 home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
 monitor:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
 term:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 10l3 2-3 2M13 15h4"/>',
 pm:'<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
 folder:'<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>',
 grid:'<circle cx="6" cy="6" r="1.2"/><circle cx="12" cy="6" r="1.2"/><circle cx="18" cy="6" r="1.2"/><circle cx="6" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="18" cy="12" r="1.2"/><circle cx="6" cy="18" r="1.2"/><circle cx="12" cy="18" r="1.2"/><circle cx="18" cy="18" r="1.2"/>',
 bell:'<path d="M6 16V11a6 6 0 1112 0v5l2 2H4zM10 21h4"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
 back:'<path d="M19 12H5M11 6l-6 6 6 6"/>',fwd:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 search:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',chev:'<path d="M6 9l6 6 6-6"/>',
 layout:'<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
 list:'<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
 sliders:'<path d="M4 8h9M17 8h3M4 16h3M11 16h9"/><circle cx="15" cy="8" r="2"/><circle cx="9" cy="16" r="2"/>',
 dots:'<circle cx="12" cy="5" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="12" cy="19" r="1.3"/>',
 clock:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
 server:'<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><path d="M7 7h.01M7 17h.01"/>',
 key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>',
 cert:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M7 9h10M7 12h5M14 17l2 4 2-4"/>',
 smile:'<path d="M7 9v2M17 9v2M6 15c1.5 3 10.5 3 12 0"/>',
 usb:'<rect x="5" y="8" width="14" height="8" rx="1.5"/><path d="M19 12h3"/>',
 copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 012-2h9"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
 lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 cloud:'<path d="M7 18a4 4 0 01-.5-7.97A6 6 0 0118 9a4.5 4.5 0 01-.5 9z"/><path d="M12 17v-6M9.5 13.5L12 11l2.5 2.5"/>',
 edit:'<path d="M4 20h4l11-11-4-4L4 16z"/>',trash:'<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>',
 local:'<path d="M5 17V9h12M13 5l4 4-4 4"/>',remote:'<path d="M19 17V9H7M11 5L7 9l4 4"/>',dyn:'<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
 calendar:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
 book:'<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M4 21V5"/>',
 db:'<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
 check:'<path d="M5 12l5 5 9-10"/>',doc:'<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
 ai:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
};
const ic=(n,s,c,sw)=>I(P[n],s,c,sw);
// OS badge: coloured tile with a simple distro-neutral glyph
const OS={ubuntu:['#e95420','U'],debian:['#d70a53','D'],arch:['#1793d1','A'],fedora:['#3c6eb4','F'],mint:['#86be43','M'],android:['#3ddc84','A']};
const os=(k,s=42)=>`<div style="width:${s}px;height:${s}px;border-radius:8px;background:#171721;display:grid;place-items:center"><div style="width:${s*.5}px;height:${s*.5}px;border-radius:50%;background:${OS[k][0]};display:grid;place-items:center;color:#111119;font-weight:600;font-size:${s*.3}px">${OS[k][1]}</div></div>`;
const CSS=`${font(400)}${font(500)}${font(600)}
*{box-sizing:border-box;margin:0;padding:0}body{width:1280px;height:832px;overflow:hidden;background:#171721;color:#e4e4e4;font:400 14px/1.4 Outfit,sans-serif;position:relative}
.sec{color:#909090}.rail{position:absolute;left:0;top:0;bottom:0;width:108px;background:#101018;border-right:1px solid #2b2b33}
.tabbar{position:absolute;left:108px;right:0;top:0;height:36px;border-bottom:1px solid #2b2b33;background:#101018}
.brand{position:absolute;left:0;top:0;width:108px;height:99px;border-right:1px solid #2b2b33;border-bottom:1px solid #2b2b33;background:#101018;display:grid;place-items:center;z-index:3}.homecell{position:absolute;left:0;top:0;width:108px;height:36px;border-right:1px solid #2b2b33;display:grid;place-items:center;color:#a567ff}
.ri{position:absolute;left:0;width:108px;text-align:center;color:#bdbdbd;font-size:13px;line-height:1.25;white-space:nowrap}
.ri .ico{width:44px;height:44px;border-radius:50%;margin:0 auto 6px;display:grid;place-items:center}.ri.on{color:#e4e4e4}.ri.on .ico{background:#30135b;color:#cabbff}
.top{position:absolute;left:108px;right:0;top:36px;height:63px;border-bottom:1px solid #2b2b33;background:#171721}
.search{position:absolute;left:125px;top:14px;width:310px;height:32px;border-radius:6px;background:#111119;border:1px solid #2b2b33;color:#909090;display:flex;align-items:center;gap:8px;padding-left:12px}
.btn{background:linear-gradient(90deg,#a567ff,#5b2bd9);color:#fff;border-radius:6px;font-weight:500;display:grid;place-items:center}
.card{background:#111119;border:1px solid #2b2b33;border-radius:10px}
.title{font-size:24px;font-weight:600;line-height:1.4}
.seg{display:flex;gap:2px;background:#111119;border:1px solid #2b2b33;border-radius:8px;padding:4px}.seg>div{display:flex;align-items:center;gap:8px;padding:5px 12px;border-radius:6px;color:#bdbdbd;font-size:14px;font-weight:500}.seg>div.on{background:#171721;color:#e4e4e4}
.tile{width:42px;height:42px;border-radius:8px;background:#171721;display:grid;place-items:center}
.ghost{background:#2b2b33;border-radius:6px;padding:6px 14px;font-weight:500;font-size:13px}
`;
function shell(active,body,extraTop=''){
 const items=[['monitor','Hosts','Hosts',0],['term','Terminal','Terminal',1],['pm','Port Mapping','Port Mapping',2],['folder','SFTP','SFTP',3],['grid','More','More',4]];
 const names={Hosts:0,Terminal:1,'Port Mapping':2,SFTP:3,More:4};
 return `<!doctype html><meta charset=utf-8><style>${CSS}</style><body>
 <div class=rail>${items.map(([i,l,k,y])=>`<div class="ri ${k===active?'on':''}" style="top:${130+y*88}px"><div class=ico>${ic(i,22)}</div>${l}</div>`).join('')}
  <div class=ri style="top:716px;height:44px"><div class=ico style="margin:0 auto">${ic('bell',22)}</div></div>
  <div class=ri style="top:770px"><div class=ico style="margin:0 auto">${ic('gear',22)}</div></div></div>
 <div class=brand><svg width="40" height="38" viewBox="5 10 84 80"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e2d9ff"/><stop offset="1" stop-color="#8b4dff"/></linearGradient><linearGradient id="lr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cabbff"/><stop offset="1" stop-color="#a567ff"/></linearGradient></defs><path d="M70.8 32A34 34 0 1 0 70.8 68" fill="none" stroke="url(#lr)" stroke-width="4" stroke-linecap="round"/><path d="M62.8 37A24.5 24.5 0 1 0 62.8 63" fill="none" stroke="url(#lr)" stroke-width="3.5" stroke-linecap="round"/><path d="M42 50L77 29M42 50L77 71" stroke="url(#lr)" stroke-width="5" stroke-linecap="round"/><circle cx="42" cy="50" r="13.5" fill="url(#lg)"/><circle cx="80" cy="27" r="7" fill="url(#lr)"/><circle cx="80" cy="73" r="7" fill="url(#lr)"/></svg></div><div class=tabbar>${extraTop}</div>${body}</body>`;
}
function toolbar(){
 return `<div class=top>
  <div style="position:absolute;left:26px;top:19px;color:#bdbdbd">${ic('back',20)}</div><div style="position:absolute;left:70px;top:19px;color:#bdbdbd">${ic('fwd',20)}</div>
  <div class=search>${ic('search',14)}Search</div>
  <div style="position:absolute;left:753px;top:14px;display:flex;gap:2px"><div style="width:32px;height:32px;border-radius:6px;background:#424254;display:grid;place-items:center">${ic('layout',18)}</div><div style="width:32px;height:32px;display:grid;place-items:center;color:#bdbdbd">${ic('list',18)}</div></div>
  <div style="position:absolute;left:847px;top:14px;width:32px;height:32px;display:grid;place-items:center;color:#bdbdbd">${ic('sliders',18)}</div>
  <div style="position:absolute;left:892px;top:11px;width:162px;height:38px;border-radius:8px;background:#111119;border:1px solid #2b2b33;display:flex;align-items:center;gap:10px;padding:0 10px"><div style="width:20px;height:20px;border-radius:50%;background:#4cc5f4;color:#111119;font-size:11px;font-weight:600;display:grid;place-items:center">A</div><span style="font-weight:500;white-space:nowrap">Personal Vault</span><span style="margin-left:auto;color:#bdbdbd">${ic('chev',16)}</span></div>
  <div class=btn style="position:absolute;left:1082px;top:11px;width:76px;height:36px;grid-auto-flow:column;gap:10px;place-items:center">${ic('plus',20,'#fff')}<span style="width:1px;height:20px;background:rgba(255,255,255,.3)"></span>${ic('chev',14,'#fff')}</div>
 </div>`;
}
module.exports={ic,os,shell,toolbar,CSS,font};
