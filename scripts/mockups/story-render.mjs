// Case-study screen export (the editorial case-study pages, src/data/stories.ts).
// node story-render.mjs <project-dir> <public-slug> [names...]
// Opens <project-dir>/story.html, which builds window.SHOTS from the project's own UI source (no callouts, no
// boards), and saves each shot, plus any code-generated crops of it, as PNG at 2x into ./.story-out/<slug>/.
// story-post.py then writes the WebP files into public/case-studies/<slug>/story/.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'
import { mkdirSync, writeFileSync } from 'fs'
import { resolve } from 'path'
const [dir, slug, ...only] = process.argv.slice(2)
const out = resolve('.story-out', slug)
mkdirSync(out, { recursive: true })
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined })
const p = await b.newPage({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 2 })
p.on('pageerror', e => console.log('ERR', e.message))
p.on('console', m => console.log('LOG', m.text()))
await p.goto('file://' + resolve(dir, 'story.html'))
await p.waitForFunction(() => window.READY, null, { timeout: 30000 })
await p.waitForTimeout(400)
const shots = await p.evaluate(() => window.SHOTS.map(s => ({ name: s.name, max: s.max || 0, skip: !!s.skip, clips: s.clips || [] })))
const manifest = []
for (const s of shots) {
  if (only.length && !only.some(n => s.name === n || s.clips.some(c => c[0] === n))) continue
  const el = await p.$(`[data-shot="${s.name}"]`)
  if (!s.skip) {
    await el.screenshot({ path: `${out}/${s.name}.png`, omitBackground: true })
    manifest.push({ name: s.name, max: s.max })
  }
  for (const [name, sel, pad = 12, max = 0] of s.clips) {
    const box = await el.evaluate((root, sel) => {
      const els = [...root.querySelectorAll(sel)]
      if (!els.length) return null
      const r = els.map(e => e.getBoundingClientRect())
      return { x: Math.min(...r.map(a => a.left)), y: Math.min(...r.map(a => a.top)) + scrollY, r: Math.max(...r.map(a => a.right)), b: Math.max(...r.map(a => a.bottom)) + scrollY }
    }, sel)
    if (!box) { console.log('MISSING', name, sel); continue }
    const clip = { x: box.x - pad, y: box.y - pad, width: box.r - box.x + pad * 2, height: box.b - box.y + pad * 2 }
    await p.screenshot({ path: `${out}/${name}.png`, clip, fullPage: true, omitBackground: true })
    manifest.push({ name, max })
  }
}
writeFileSync(`${out}/manifest.json`, JSON.stringify(manifest))
console.log(manifest.map(m => m.name).join(' '))
await b.close()
