const {chromium}=require('playwright-core');const fs=require('fs');
const ids=['f1','f2','f3','f4','f5','f6','f7','f8'];
(async()=>{const out=__dirname+'/features/';fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:1700,height:1200},deviceScaleFactor:1.5});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+__dirname+'/features.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1200);
for(const id of ids){await (await p.$('#'+id)).screenshot({path:out+id+'.jpg',type:'jpeg',quality:92})}
await b.close();console.log('done')})();
