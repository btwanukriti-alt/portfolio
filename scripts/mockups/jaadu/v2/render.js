const {chromium}=require('../node_modules/playwright-core');const fs=require('fs');
(async()=>{const out=__dirname+'/out/';fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:1700,height:1200},deviceScaleFactor:1.5});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+__dirname+'/modules.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(800);
const ids=process.argv.slice(2).length?process.argv.slice(2):await p.$$eval('section',s=>s.map(x=>x.id));
for(const id of ids){const el=await p.$('#'+id);const bb=await el.boundingBox();await el.screenshot({path:out+id+'.jpg',type:'jpeg',quality:90});console.log(id,Math.round(bb.height*1.5))}
await b.close()})();
