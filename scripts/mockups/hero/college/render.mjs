import {chromium} from '/opt/node22/lib/node_modules/playwright/index.mjs'
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const p=await b.newPage({viewport:{width:1300,height:6000},deviceScaleFactor:1.6})
p.on('pageerror',e=>console.log('ERR',e.message))
await p.goto('file://'+process.argv[2]);await p.waitForLoadState('networkidle');await p.waitForTimeout(800)
for(const [id,n] of [['s-fin','col-finance-s'],['s-staff','col-staff-s'],['s-d3','col-drawer-s'],['s-d2','col-drawer2-s']]){
  const bb=await (await p.$(`#${id} .app`)).boundingBox(); console.log(id,bb)
  await p.screenshot({path:`${process.argv[3]}/${n}.png`,clip:{x:bb.x,y:bb.y,width:bb.width,height:Math.min(bb.height,bb.width/1.6)}})
}
await b.close()
