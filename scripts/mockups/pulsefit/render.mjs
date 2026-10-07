import {chromium} from '/opt/node22/lib/node_modules/playwright/index.mjs'
const out=process.argv[3]
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const p=await b.newPage({viewport:{width:1700,height:1200},deviceScaleFactor:1.5})
p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{if(m.type()=='log')console.log('LOG',m.text())})
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(2500)
const names=[['m9','01-logo'],['m10','02-icon-palette'],['mt','03-type-components'],['m1','04-leads'],['m4','05-members'],['m5','06-attendance'],['m8','07-tables-forms'],['m2','08-website'],['mp','09-pricing'],['m6','10-website-cards']]
for(const [id,n] of names){await (await p.$('#'+id)).screenshot({path:`${out}/${n}.jpg`,type:'jpeg',quality:88})}
await b.close()
