// LinkedIn banner (1584 x 396, rendered at 2x) in the portfolio's type: a minimal black banner
// with one line set in Inter Tight, kept clear of the profile photo at the bottom left.
// The fonts come from the site's build (.next), so run `npm run build` first.
// Usage: node scripts/mockups/linkedin/render.mjs <out.png>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'
import { readFileSync, readdirSync, writeFileSync, mkdtempSync } from 'fs'
import { tmpdir } from 'os'
import { resolve } from 'path'
const root = resolve(new URL('../../..', import.meta.url).pathname)
const out = process.argv[2]

const cssFile = readdirSync(`${root}/.next/static/chunks`).filter((f) => f.endsWith('.css')).map((f) => readFileSync(`${root}/.next/static/chunks/${f}`, 'utf8')).join('')
const fonts = (cssFile.match(/@font-face\{[^}]*\}/g) || []).join('\n').replaceAll('url(../media/', `url(file://${root}/.next/static/media/`)
const html = `<!doctype html><meta charset="utf-8"><style>${fonts}
*{box-sizing:border-box}body{margin:0}
#b{position:relative;width:1584px;height:396px;overflow:hidden;background:#0b0b0c;color:#fff;font-family:'Inter Tight',sans-serif}
</style><div id="b">
  <div style="position:absolute;left:560px;right:96px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center">
    <div style="display:flex;align-items:center;gap:10px;font:500 13px/1 'Inter Tight';letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.5)">
      <span style="width:7px;height:7px;border-radius:50%;background:#FF0A0A"></span><span style="width:7px;height:7px;border-radius:50%;background:#2F4BFF;margin-left:-4px"></span>
      Anukriti Mishra · Experience Designer
    </div>
    <div style="margin-top:22px;font:500 64px/1.02 'Inter Tight';letter-spacing:-.04em">Complex products.<br><span style="color:rgba(255,255,255,.42)">Simple screens.</span></div>
  </div>
  <div style="position:absolute;right:40px;bottom:30px;font:400 14px/1 'Inter';color:rgba(255,255,255,.45);letter-spacing:.01em">anukritimishra.xyz</div>
</div>`

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] })
const p = await b.newPage({ viewport: { width: 1600, height: 420 }, deviceScaleFactor: 2 })
// Loaded from a file, so the page may read the local fonts and screens.
const page = `${mkdtempSync(`${tmpdir()}/banner-`)}/banner.html`
writeFileSync(page, html)
await p.goto(`file://${page}`)
await p.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map((i) => i.decode().catch(() => {}))) })
await (await p.$('#b')).screenshot({ path: out })
await b.close()
