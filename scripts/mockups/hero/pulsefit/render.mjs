import {chromium} from '/opt/node22/lib/node_modules/playwright/index.mjs'
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const p=await b.newPage({viewport:{width:1800,height:1400},deviceScaleFactor:2})
p.on('pageerror',e=>console.log('ERR',e.message))
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(2500)
for(const id of ['app-leads','app-members','app-plans','app-site']){
  const el=await p.$('#'+id); const bb=await el.boundingBox(); console.log(id,bb)
  await el.screenshot({path:`${process.argv[3]}/${id}.png`})
}
await b.close()
