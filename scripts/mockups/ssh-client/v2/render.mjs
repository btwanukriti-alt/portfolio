// node render.mjs <outdir> [ids...]: writes each module as a 2400px-wide JPEG
import {chromium} from '/opt/node22/lib/node_modules/playwright/index.mjs'
import {fileURLToPath} from 'url'
const out=process.argv[2], only=process.argv.slice(3)
const page=fileURLToPath(new URL('index.html',import.meta.url))
const NAMES=[['m-logo','01-logo'],['m-hosts','02-add-host'],['m-health','03-health'],['m-keys','04-keys'],['m-term','05-terminal'],['m-sessions','06-sessions']]
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const p=await b.newPage({viewport:{width:1600,height:1200},deviceScaleFactor:1.5})
p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>console.log('LOG',m.text()))
await p.goto('file://'+page);await p.waitForFunction(()=>window.READY,null,{timeout:20000});await p.waitForTimeout(500)
for(const [id,n] of NAMES){if(only.length&&!only.includes(id))continue;const el=await p.$('#'+id);const bb=await el.boundingBox();console.log(n,Math.round(bb.height));await el.screenshot({path:`${out}/${n}.jpg`,type:'jpeg',quality:86})}
await b.close()
