import {chromium} from '/opt/node22/lib/node_modules/playwright/index.mjs'
const out=process.argv[3]
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const p=await b.newPage({viewport:{width:1700,height:1200},deviceScaleFactor:1.5})
p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{if(m.type()=='log')console.log('LOG',m.text())})
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(2500)
const names=[['m1','01-leads'],['m2','02-website'],['m3','03-lead-charts'],['m4','04-members'],['m5','05-attendance'],['m6','06-website-cards'],['m7','07-plans'],['m8','08-tables'],['m9','09-logo'],['m10','10-icon-palette']]
for(const [id,n] of names){await (await p.$('#'+id)).screenshot({path:`${out}/${n}.jpg`,type:'jpeg',quality:88})}
await b.close()
