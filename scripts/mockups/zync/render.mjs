import {chromium} from '/opt/node22/lib/node_modules/playwright/index.mjs'
const out=process.argv[3]
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const p=await b.newPage({viewport:{width:1700,height:1200},deviceScaleFactor:1.5})
p.on('pageerror',e=>console.log('ERR',e.message))
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(2500)
const names=[['m-home','01-home'],['m-checkin','02-checkin'],['m-classes','03-classes'],['m-log','04-log'],['m-trackers','05-trackers'],['m-workout','06-workout'],['m-stats','07-stats'],['m-brand','08-brand'],['m-icon','09-icon']]
for(const [id,n] of names){await (await p.$('#'+id)).screenshot({path:`${out}/${n}.jpg`,type:'jpeg',quality:88})}
await b.close()
