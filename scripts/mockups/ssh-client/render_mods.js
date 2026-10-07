const {chromium}=require('playwright-core');const fs=require('fs');
const ids=[['m-health','01-health'],['m-disks','02-disks'],['m-activity','03-activity'],['m-terminal','04-terminal'],['m-addhost','05-add-host'],['m-hosts','06-hosts-keys'],['m-sftp','07-sftp'],['m-ports','08-ports-sessions'],['m-brand','09-logo'],['m-icon','10-icon-palette']];
(async()=>{const out=__dirname+'/gallery/';fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:1700,height:1200},deviceScaleFactor:1.5});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+__dirname+'/modules.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1500);
for(const [id,n] of ids){await (await p.$('#'+id)).screenshot({path:out+n+'.jpg',type:'jpeg',quality:88})}
await b.close();console.log('done')})();
