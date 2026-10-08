// Usage: node render.mjs <abs path to modules.html> <out dir> <abs path to public/case-studies/college-management/mockups/>
import {chromium} from '/opt/node22/lib/node_modules/playwright/index.mjs'
const [file,out,img]=process.argv.slice(2)
const names=[['m-spines','01-spines'],['m-target','02-target'],['m-totals','03-totals'],['m-ranked','04-ranked'],['m-weakest','05-weakest'],['m-attendance','06-attendance'],['m-staff','07-staff'],['m-colour','08-colour'],['m-process','09-process']]
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const p=await b.newPage({viewport:{width:1700,height:1200},deviceScaleFactor:1.5})
p.on('pageerror',e=>console.log('ERR',e.message))
await p.addInitScript(`window.IMG=${JSON.stringify('file://'+img)}`)
await p.goto('file://'+file);await p.waitForTimeout(2500)
await p.evaluate(()=>window.build());await p.waitForTimeout(1500)
for(const [id,n] of names){await (await p.$('#'+id)).screenshot({path:`${out}/${n}.jpg`,type:'jpeg',quality:88})}
await b.close()
