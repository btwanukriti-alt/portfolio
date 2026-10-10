// LinkedIn banner (1584 x 396, rendered at 2x): a quote on black, each word in its own coloured
// shape, in the site's colours and Inter Tight. Kept clear of the profile photo at the bottom left.
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
// Each word sits in its own shape (a sticker), drawn as SVG at the word's size.
const C = { blue: '#2F4BFF', violet: '#7B61FF', red: '#FF3B3B', yellow: '#FFD25A', pink: '#FF86A8', white: '#FFFFFF', ink: '#0B0B0C' }
const shape = (kind, w, h, fill) => {
  const r = h / 2
  let d = ''
  if (kind === 'pill') d = `<rect width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`
  if (kind === 'rect') d = `<rect width="${w}" height="${h}" fill="${fill}"/>`
  if (kind === 'scallop') {
    // A rounded body with bumps along the top and bottom edges.
    const n = Math.round(w / 34), step = w / n, br = step / 2
    d = `<rect x="0" y="${br}" width="${w}" height="${h - 2 * br}" rx="${br}" fill="${fill}"/>`
    for (let i = 0; i < n; i++) d += `<circle cx="${br + i * step}" cy="${br}" r="${br}" fill="${fill}"/><circle cx="${br + i * step}" cy="${h - br}" r="${br}" fill="${fill}"/>`
  }
  if (kind === 'ticket') {
    const b = h * 0.32
    d = `<rect x="${b}" width="${w - 2 * b}" height="${h}" fill="${fill}"/><circle cx="${b}" cy="${r}" r="${b}" fill="${fill}"/><circle cx="${w - b}" cy="${r}" r="${b}" fill="${fill}"/>`
  }
  if (kind === 'ribbon') {
    const k = h * 0.32
    d = `<path d="M0 0H${w}L${w - k} ${r}L${w} ${h}H0L${k} ${r}Z" fill="${fill}"/>`
  }
  if (kind === 'bow') {
    // Concave bites top and bottom.
    const m = `bow${w}`
    d = `<mask id="${m}"><rect width="${w}" height="${h}" fill="#fff"/><circle cx="${w / 2}" cy="${-h * 0.18}" r="${h * 0.42}" fill="#000"/><circle cx="${w / 2}" cy="${h * 1.18}" r="${h * 0.42}" fill="#000"/></mask><rect width="${w}" height="${h}" fill="${fill}" mask="url(#${m})"/>`
  }
  if (kind === 'star') {
    // Eight square-ended arms.
    const c = w / 2, arm = w * 0.17
    for (let i = 0; i < 4; i++) d += `<rect x="${c - arm}" y="0" width="${arm * 2}" height="${w}" fill="${fill}" transform="rotate(${i * 45} ${c} ${c})"/>`
  }
  if (kind === 'flower') {
    const c = w / 2, pr = w * 0.19, ring = w * 0.3
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; d += `<circle cx="${c + Math.cos(a) * ring}" cy="${c + Math.sin(a) * ring}" r="${pr}" fill="${fill}"/>` }
    d += `<circle cx="${c}" cy="${c}" r="${ring}" fill="${fill}"/>`
  }
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="position:absolute;inset:0;overflow:visible">${d}</svg>`
}
const word = (text, kind, w, fill, ink, { caps = false, h = 84 } = {}) =>
  `<div style="position:relative;width:${w}px;height:${h}px;flex:none;display:grid;place-items:center">${shape(kind, w, h, fill)}<span style="position:relative;color:${ink};font:${caps ? '600 28px' : '500 38px'}/1 'Inter Tight';letter-spacing:${caps ? '.22em' : '-.03em'};${caps ? 'margin-right:-.22em;' : ''}">${text}</span></div>`

const html = `<!doctype html><meta charset="utf-8"><style>${fonts}
*{box-sizing:border-box}body{margin:0}
#b{position:relative;width:1584px;height:396px;overflow:hidden;background:#0b0b0c;font-family:'Inter Tight',sans-serif}
.row{display:flex;align-items:center;gap:22px}
</style><div id="b">
  <div style="position:absolute;left:390px;top:58px;display:flex;flex-direction:column;gap:20px">
    <div class="row">
      ${word('I design', 'pill', 236, C.blue, '#fff')}
      ${word('complex', 'scallop', 222, C.white, C.ink)}
      ${word('products', 'rect', 238, C.violet, '#fff')}
      ${word('to', 'star', 92, C.yellow, C.ink, { h: 92 })}
    </div>
    <div class="row" style="padding-left:58px">
      ${word('feel', 'ticket', 170, C.red, '#fff')}
      ${word('SIMPLE', 'ribbon', 300, C.pink, C.ink, { caps: true })}
      ${word('<b style="font-weight:700">!</b>', 'flower', 92, C.white, C.ink, { h: 92 })}
    </div>
    <div style="margin-top:14px;font:600 13px/1 'Inter Tight';letter-spacing:.26em;color:#fff;padding-left:4px">ANUKRITI MISHRA · EXPERIENCE DESIGNER</div>
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
