const {chromium}=require('playwright-core');const fs=require('fs');
const ids=[['m-overnight','01-overnight'],['m-footprint','02-footprint'],['m-panels','03-panels'],['m-settings','04-settings'],['m-regime','05-regime'],['m-alerts','06-alerts'],['m-library','07-library'],['m-deja','08-deja-vu'],['m-system','09-system'],['m-palette','10-palette']];
(async()=>{const out=__dirname+'/gallery/';fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:1700,height:1200},deviceScaleFactor:1.5});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+__dirname+'/modules.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1200);
for(const [id,n] of ids){await (await p.$('#'+id)).screenshot({path:out+n+'.jpg',type:'jpeg',quality:88})}
await b.close();console.log('done')})();
