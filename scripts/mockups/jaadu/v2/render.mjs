import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'
import { mkdirSync } from 'fs'
const dir = new URL('.', import.meta.url).pathname, out = dir + 'out/'
mkdirSync(out, { recursive: true })
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const p = await b.newPage({ viewport: { width: 1700, height: 1200 }, deviceScaleFactor: 1.5 })
p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => console.log(m.text()))
await p.goto('file://' + dir + 'index.html'); await p.waitForFunction(() => window.READY)
const ids = process.argv.slice(2).length ? process.argv.slice(2) : await p.$$eval('.mod', m => m.map(x => x.id))
for (const id of ids) { const e = await p.$('#' + id); const bb = await e.boundingBox(); await e.screenshot({ path: out + id + '.jpg', type: 'jpeg', quality: 90 }); console.log(id, Math.round(bb.height * 1.5)) }
await b.close()
