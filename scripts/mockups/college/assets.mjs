// Exports the desktop screens as transparent laptop PNGs for the bento page.
// Usage: node assets.mjs <abs path to modules.html> <out dir>
import {chromium} from '/opt/node22/lib/node_modules/playwright/index.mjs'
const [file,out]=process.argv.slice(2)
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const p=await b.newPage({viewport:{width:1800,height:1200},deviceScaleFactor:2})
p.on('pageerror',e=>console.log('ERR',e.message))
await p.addInitScript('window.IMG=""')
await p.goto('file://'+file);await p.waitForTimeout(2500)
const shots=[['laptop-finance','#s-fin'],['laptop-college','#s-d2'],['laptop-programme','#s-d3'],['laptop-staff','#s-staff']]
for(const [name,sel] of shots){
  await p.evaluate(sel=>{document.querySelectorAll('.xp').forEach(e=>e.remove())
    document.body.style.background='transparent'
    const w=document.createElement('div');w.className='xp';w.style.cssText='position:absolute;left:0;top:0;padding:60px 80px 80px;z-index:9;background:transparent'
    const l=lap(sel,1,0,0,750);l.style.position='relative';w.appendChild(l);document.body.appendChild(w)},sel)
  await p.addStyleTag({content:'html,html body{background:transparent!important}#out{display:none}'})
  await (await p.$('.xp')).screenshot({path:`${out}/${name}.png`,omitBackground:true})
  console.log(name)
}
await b.close()
