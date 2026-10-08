const {chromium}=require('playwright-core');const fs=require('fs');
const ids=process.argv.slice(2).length?process.argv.slice(2):['m1','m2','m3','m4','m5','m6','m7','m8','m9'];
(async()=>{const out=__dirname+'/final/';fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:1700,height:1200},deviceScaleFactor:1.5});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+__dirname+'/final.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1500);
for(const id of ids){await (await p.$('#'+id)).screenshot({path:out+id+'.jpg',type:'jpeg',quality:92})}
await b.close();console.log('done')})();
