const {chromium}=require('playwright-core');const fs=require('fs');
const ids=['g1','g2','g3','b3'];
(async()=>{const out=__dirname+'/boards/';fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:1700,height:1200},deviceScaleFactor:1.5});
await p.goto('file://'+__dirname+'/board.html');await p.waitForTimeout(1200);
for(const id of ids){await (await p.$('#'+id)).screenshot({path:out+id+'.jpg',type:'jpeg',quality:92})}
await b.close();console.log('done')})();
