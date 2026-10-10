// LinkedIn banner (1584 x 396, rendered at 2x), styled like the site's "Let's BUILD" frame: a black
// Figma frame with its violet selection, the corner shapes, and the pen tool as the apostrophe.
// The line sits right of the profile photo, which covers the bottom left.
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
const SELECT = '#7B61FF'
const handles = [[0, 0], [50, 0], [100, 0], [100, 50], [100, 100], [50, 100], [0, 100], [0, 50]]
// The pen tool as the apostrophe, as in the site's "Let's BUILD" heading.
const pen = `<svg viewBox="0 0 24 32" style="display:block;width:100%;height:100%;transform:rotate(18deg);transform-origin:50% 100%;overflow:visible"><rect x="5" y="0" width="14" height="4" fill="${SELECT}"/><path d="M5 5h14l3.5 13L12 32 1.5 18z" fill="#fff"/><path d="M12 32V19" stroke="#0b0b0c" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="17" r="2.2" fill="#0b0b0c"/></svg>`

const html = `<!doctype html><meta charset="utf-8"><style>${fonts}
*{box-sizing:border-box}body{margin:0}
#b{position:relative;width:1584px;height:396px;overflow:hidden;background:#0b0b0c;color:#fff;font-family:'Inter Tight',sans-serif}
.h{position:absolute;width:9px;height:9px;background:#fff;border:1.5px solid ${SELECT};transform:translate(-50%,-50%)}
</style><div id="b">
  <span style="position:absolute;top:-70px;left:-60px;width:230px;height:230px;border-radius:50%;border:30px solid rgba(255,255,255,.9)"></span>
  <span style="position:absolute;top:-28px;right:-70px;width:340px;height:98px;border-radius:49px;background:#FFD25A"></span>
  <svg viewBox="0 0 100 100" style="position:absolute;right:-30px;bottom:-80px;width:190px"><path d="M50 0C53 34 66 47 100 50C66 53 53 66 50 100C47 66 34 53 0 50C34 47 47 34 50 0Z" fill="${SELECT}"/></svg>

  <div style="position:absolute;inset:14px;border:1.5px solid ${SELECT}">
    ${handles.map(([x, y]) => `<span class="h" style="left:${x}%;top:${y}%"></span>`).join('')}
  </div>

  <div style="position:absolute;left:330px;bottom:72px">
    <div style="font:500 15px/1 'Inter Tight';color:rgba(255,255,255,.55);margin:0 0 18px 6px">Anukriti Mishra · Experience designer for SaaS</div>
    <div style="font:500 128px/.92 'Inter Tight';letter-spacing:-.045em;white-space:nowrap">Let<span style="position:relative;display:inline-block;width:.22em;height:.3em;margin:0 .02em;transform:translateY(-.42em)">${pen}</span>s <span style="letter-spacing:-.02em">DESIGN</span> yours</div>
  </div>
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
