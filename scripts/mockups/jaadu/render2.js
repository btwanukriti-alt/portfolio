const {chromium}=require('playwright-core');const fs=require('fs');
const ids=['s1','s2','s3','s4','s5','s6','s7','s8','s9'];
(async()=>{const out=__dirname+'/scenes/';fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:1700,height:1200},deviceScaleFactor:1.5});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+__dirname+'/scenes.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1200);
for(const id of ids){await (await p.$('#'+id)).screenshot({path:out+id+'.jpg',type:'jpeg',quality:90})}
await b.close();console.log('done')})();
