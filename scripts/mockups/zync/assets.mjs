// Exports each component as its own transparent PNG at 3x.
// Usage: node assets.mjs <built page> <out dir>. Build the page as for render.mjs, with assets.html
// inserted before the <script> of modules.html.
import {chromium} from '/opt/node22/lib/node_modules/playwright/index.mjs'
const out=process.argv[3]
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const p=await b.newPage({viewport:{width:2400,height:1400},deviceScaleFactor:3})
p.on('pageerror',e=>console.log('ERR',e.message))
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(2500)
await p.addStyleTag({content:'html,html body{background:transparent!important}.mod{background:transparent!important}.plate{overflow:visible!important}'})
// [file, selector, keep the target's own background]
const list=[...(await p.$$eval('#assets .as',els=>els.map(e=>e.id))).map(id=>[id.slice(2),'#'+id,false]),
  ['qr','#m-checkin .qcard',true],['stats','#m-stats .plate:nth-child(1) > .abs',true],['table','#m-stats .plate:nth-child(2) > .abs',true],
  ['logo','#lg-stage',false],['icon','#m-icon .plate:nth-child(1)',false],['palette','#m-icon .plate:nth-child(2) > .abs',false]]
const pad=48
for(const [name,sel,own] of list){
  await p.evaluate(([sel,own])=>{document.querySelectorAll('[data-vis]').forEach(e=>e.remove())
    const s=document.createElement('style');s.dataset.vis=1
    s.textContent=`body *:not(symbol,symbol *){visibility:hidden!important} ${sel} *{visibility:visible!important} ${own?sel+'{visibility:visible!important}':''}`
    document.head.appendChild(s)},[sel,own])
  const r=await (await p.$(sel)).boundingBox()
  await p.screenshot({path:`${out}/${name}.png`,omitBackground:true,fullPage:true,clip:{x:r.x-pad,y:r.y-pad,width:r.width+pad*2,height:r.height+pad*2}})
  console.log(name,Math.round(r.width),Math.round(r.height))
}
await b.close()
