// Swaps the placeholder "Fit Flow" logo on the website frame for Pulsefit (step 2 of 2): draws
// the Pulsefit mark (light version, for the dark nav and footer) and name over the cleared image.
// Usage: node website-logo.mjs <cleared.png> <out.jpg>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'
import { readFileSync } from 'fs'
const dir = new URL('.', import.meta.url).pathname
const [img, out] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.setContent(`<!doctype html><style>
@font-face{font-family:PFont;font-weight:600;src:url(data:font/woff2;base64,${readFileSync(dir + 'fonts/poppins-600.woff2').toString('base64')})}
body{margin:0}#w{position:relative;width:1440px}#w>img{display:block;width:1440px}
.lg{position:absolute;left:190px;display:flex;align-items:center;gap:12px;color:#fff;font:600 26px/1 PFont,sans-serif;letter-spacing:-.02em}
.lg span{width:28px;height:30px;display:block}.lg svg{width:100%;height:100%;display:block}</style>
<div id="w"><img src="data:image/png;base64,${readFileSync(img).toString('base64')}">
<div class="lg" style="top:53px"><span class=m></span>Pulsefit</div>
<div class="lg" style="top:5940px"><span class=m></span>Pulsefit</div></div>
<script>${readFileSync(dir + 'ui.js', 'utf8')}</script>
<script>document.querySelectorAll('.m').forEach(m => m.innerHTML = P.mark('dark'))</script>`)
await p.evaluate(() => document.fonts.load('600 26px PFont')).then(f => console.log('font faces', f.length))
await (await p.$('#w')).screenshot({ path: out, type: 'jpeg', quality: 92 })
await b.close()
