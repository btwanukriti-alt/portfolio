// LinkedIn banner (1584 x 396, rendered at 2x) in the portfolio's design language: white canvas,
// Inter Tight, Figma selection boxes, the violet "Anukriti" cursor, and real project screens.
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
const logo = readFileSync(`${root}/src/components/Logo.tsx`, 'utf8').match(/<svg[\s\S]*?<\/svg>/)[0].replace(/ className=\{className\}/, '').replace(/ role="img" aria-label="[^"]*"/, '')
const shot = (n) => `file://${root}/public/hero/screens/s${n}.jpg`

const html = `<!doctype html><meta charset="utf-8"><style>${fonts}
*{box-sizing:border-box}body{margin:0}
#b{position:relative;width:1584px;height:396px;overflow:hidden;background:#fff;font-family:'Inter Tight',sans-serif;color:#0b0b0c;
  background-image:radial-gradient(#e2e2e0 1px,transparent 1.2px);background-size:22px 22px;background-position:11px 11px}
.lbl{font:500 12px/1 'Inter Tight';letter-spacing:.12em;text-transform:uppercase;color:#6e6e73}
.sel{position:absolute;border:1.5px solid #0b0b0c}
.h{position:absolute;width:9px;height:9px;background:#fff;border:1.5px solid #0b0b0c;transform:translate(-50%,-50%)}
.tile{position:absolute;width:190px;height:127px;border-radius:9px;overflow:hidden;box-shadow:0 0 0 1px rgba(0,0,0,.06),0 22px 44px -20px rgba(20,20,10,.35)}
.tile img{width:100%;height:100%;object-fit:cover;display:block}
.tag{position:absolute;font:500 11px/1 'Inter Tight';display:flex;gap:6px;align-items:center;white-space:nowrap}
.cur{position:absolute;z-index:5}
</style><div id="b">
  <div style="position:absolute;left:300px;top:58px">
    <div style="height:24px;width:auto">${logo.replace('<svg ', '<svg style="height:24px;width:auto;display:block" ')}</div>
  </div>
  <div class="lbl" style="position:absolute;left:300px;top:120px">Experience designer · SaaS</div>
  <div style="position:absolute;left:298px;top:144px;font:500 50px/1.05 'Inter Tight';letter-spacing:-.035em">Hello, I am Anukriti.</div>
  <div style="position:absolute;left:300px;top:226px;width:520px;height:64px">
    <div class="sel" style="inset:0"></div>
    ${[[0, 0], [50, 0], [100, 0], [100, 50], [100, 100], [50, 100], [0, 100], [0, 50]].map(([x, y]) => `<span class="h" style="left:${x}%;top:${y}%"></span>`).join('')}
    <div style="position:absolute;left:16px;top:0;bottom:0;display:flex;align-items:center;font:400 25px/1 'Inter';letter-spacing:-.02em">I design SaaS products, end to end.</div>
    <div class="tag" style="left:50%;top:calc(100% + 9px);transform:translateX(-50%);background:#0b0b0c;color:#fff;padding:4px 7px;border-radius:4px">520 × 64</div>
  </div>
  <div class="cur" style="left:808px;top:282px">
    <svg width="20" height="22" viewBox="0 0 20 22"><path d="M3 2.2 L3 17.6 L7.2 13.6 L10.1 20 L12.9 18.8 L10.1 12.5 L15.9 12.5 Z" fill="#7B61FF" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>
    <span style="position:absolute;left:13px;top:18px;background:#7B61FF;color:#fff;font:500 12px/1 'Inter Tight';padding:5px 8px;border-radius:6px 6px 6px 2px;white-space:nowrap">Anukriti</span>
  </div>

  ${[
    ['02', 930, 48], ['04', 1150, 96], ['03', 1370, 40],
    ['01', 1010, 236], ['05', 1260, 250],
  ].map(([n, x, y]) => `<div class="tile" style="left:${x}px;top:${y}px"><img src="${shot(n)}"></div>`).join('')}
  <div style="position:absolute;left:1150px;top:96px;width:190px;height:127px">
    <div class="sel" style="inset:0"></div>
    ${[[0, 0], [100, 0], [100, 100], [0, 100]].map(([x, y]) => `<span class="h" style="left:${x}%;top:${y}%"></span>`).join('')}
    <div class="tag" style="left:0;bottom:calc(100% + 7px)"><span style="color:#a1a1a6">04</span>Gym Member App<span style="background:rgba(123,97,255,.1);color:#7B61FF;padding:3px 5px;border-radius:3px;font-size:10px">Fill</span></div>
  </div>
  <div class="lbl" style="position:absolute;left:300px;top:332px;letter-spacing:.02em;text-transform:none;font-size:14px;color:#0b0b0c">anukritimishra.xyz</div>
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
