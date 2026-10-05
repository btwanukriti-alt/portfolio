// Writes the built piece into the portfolio as the College Management card's showcase (embed
// mode: no controls, paused on the poster until the page posts 'showcase:play').
import { readFileSync, writeFileSync } from 'node:fs'
const html = readFileSync('dist/index.html', 'utf8')
const out = html
  .replace('<head>', '<head>\n    <script>window.__EMBED__ = 1</script>')
  .replace(/<title>[^<]*<\/title>/, '<title>Showcase</title>')
writeFileSync('../../public/showcase/college-management.html', out)
console.log('wrote public/showcase/college-management.html', (out.length / 1024).toFixed(0) + ' kB')
