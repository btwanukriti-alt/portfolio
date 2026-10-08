import {chromium} from '/opt/node22/lib/node_modules/playwright/index.mjs'
import fs from 'fs'
const [,,dir,out]=process.argv
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const p=await b.newPage({viewport:{width:1100,height:10000},deviceScaleFactor:1.2})
p.on('pageerror',e=>console.log('ERR',e.message))
const meta={}
for(const mode of ['full','base','pop']){
  await p.goto(`file://${dir}/tiles.html?mode=${mode}`);await p.waitForLoadState('networkidle');await p.waitForTimeout(400)
  const ids=await p.$$eval('.tile',ts=>ts.map(t=>t.id.split('-')[0]))
  for(const id of ids){
    const el=await p.$(`#${id}-${mode}`)
    if(mode==='pop'){
      const pop=await el.$('.pop .dev')
      const r=await p.$eval(`#${id}-pop .pop`,n=>{const t=n.parentElement.getBoundingClientRect();let l=1e9,tp=1e9,rr=-1e9,bt=-1e9;n.querySelectorAll('.dev').forEach(d=>{const q=d.getBoundingClientRect();l=Math.min(l,q.left);tp=Math.min(tp,q.top);rr=Math.max(rr,q.right);bt=Math.max(bt,q.bottom)});return {x:l-t.left,y:tp-t.top,w:rr-l,h:bt-tp,ax:t.left,ay:t.top}})
      await p.screenshot({path:`${out}/${id}-pop.png`,omitBackground:true,clip:{x:r.ax+r.x,y:r.ay+r.y,width:r.w,height:r.h}})
      meta[id]={x:+(r.x/900).toFixed(4),y:+(r.y/600).toFixed(4),w:+(r.w/900).toFixed(4),h:+(r.h/600).toFixed(4)}
    } else {
      await el.screenshot({path:`${out}/${id}${mode==='full'?'-full':''}.${mode==='full'?'png':'jpg'}`,...(mode==='base'?{type:'jpeg',quality:84}:{})})
    }
  }
}
fs.writeFileSync(`${out}/meta.json`,JSON.stringify(meta,null,1))
await b.close()
