import {chromium} from '/opt/node22/lib/node_modules/playwright/index.mjs'
const out=process.argv[3]
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const p=await b.newPage({viewport:{width:1700,height:1200},deviceScaleFactor:1.5})
p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{if(m.type()=='log')console.log('LOG',m.text())})
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(2500)
const names=[['m9','01-logo'],['m10','02-icon-palette'],['m1','03-leads'],['m4','04-members'],['m5','05-attendance'],['m8','06-tables-forms'],['m2','07-website'],['mp','08-pricing'],['m6','09-website-cards']]
for(const [id,n] of names){await (await p.$('#'+id)).screenshot({path:`${out}/${n}.jpg`,type:'jpeg',quality:88})}
await b.close()
