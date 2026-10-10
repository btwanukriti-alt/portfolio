import {chromium} from '/opt/node22/lib/node_modules/playwright/index.mjs'
import {fileURLToPath} from 'url'
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'})
const p=await b.newPage({viewport:{width:1256,height:856},deviceScaleFactor:2})
await p.goto('file://'+fileURLToPath(new URL('hero.html',import.meta.url)));await p.waitForFunction(()=>window.READY);await p.waitForTimeout(400)
await (await p.$('#hero')).screenshot({path:process.argv[2],type:'jpeg',quality:88});await b.close()
