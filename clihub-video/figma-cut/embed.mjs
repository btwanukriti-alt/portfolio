// Builds the cut and writes the single-file card embed to public/showcase/clihub.html.
// The embed waits for postMessage 'showcase:play' / 'showcase:pause' from the work card.
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const SLUG = 'clihub'
const out = resolve(here, `../../public/showcase/${SLUG}.html`)

execSync('npx vite build', { cwd: here, stdio: 'inherit' })

const dist = resolve(here, 'dist')
let html = readFileSync(resolve(dist, 'index.html'), 'utf8')
const assets = resolve(dist, 'assets')
for (const f of readdirSync(assets)) {
  const code = readFileSync(resolve(assets, f), 'utf8')
  if (f.endsWith('.js')) {
    html = html.replace(new RegExp(`<script type="module" crossorigin src="\\./assets/${f}"></script>`), () => '')
    html = html.replace('</body>', () => `<script type="module">${code.replace(/<\/script/g, '<\\/script')}</script></body>`)
  } else if (f.endsWith('.css')) {
    html = html.replace(new RegExp(`<link rel="stylesheet" crossorigin href="\\./assets/${f}">`), () => `<style>${code}</style>`)
  }
}
if (/src="\.\/assets|href="\.\/assets/.test(html)) throw new Error('asset left un-inlined')
const embed = html
  .replace(/<title>[^<]*<\/title>/, '<title>Showcase</title>')
  .replace('<div id="root"></div>', '<div id="root"></div><script>window.__SHOWCASE_EMBED__=true</script>')
writeFileSync(out, embed)
// The single-file preview (plays on its own) for the artifact.
writeFileSync(resolve(dist, 'preview.html'), html)
console.log(`${SLUG}.html  ${(embed.length / 1024).toFixed(0)} KB`)
