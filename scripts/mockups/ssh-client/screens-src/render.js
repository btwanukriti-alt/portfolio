const {chromium}=require('playwright-core');const fs=require('fs');const d=__dirname+'/screens';
const H=fs.existsSync(__dirname+'/heights.json')?JSON.parse(fs.readFileSync(__dirname+'/heights.json')):{};
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const f of fs.readdirSync(d).filter(f=>f.endsWith('.html'))){const k=f.replace('.html','');const h=H[k]||832;
 const p=await b.newPage({viewport:{width:1280,height:h},deviceScaleFactor:3});
 await p.goto('file://'+d+'/'+f);await p.addStyleTag({content:`body{height:${h}px!important}`});await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:d+'/'+k+'.png'});await p.close();}
await b.close();})();
