// Builds pulsefit-showcase-10s.html from PulsefitShowcase-10s.jsx, using the same page shell
// (fonts, player styles, React UMD) as pulsefit-showcase.html.
// Usage: node build-10s.mjs  (esbuild comes from figma-cut/node_modules)
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
const require = createRequire(new URL('./figma-cut/package.json', import.meta.url))
const esbuild = require('esbuild')
const src = readFileSync(new URL('./PulsefitShowcase-10s.jsx', import.meta.url), 'utf8')
const { code } = esbuild.transformSync(src, { loader: 'jsx', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment', minifyWhitespace: true, minifySyntax: true, target: 'es2019' })
const shell = readFileSync(new URL('./pulsefit-showcase.html', import.meta.url), 'utf8')
const head = shell.slice(0, shell.indexOf('<script>'))
const out = head.replace(/<title>[^<]*<\/title>/, '<title>PulseFit 10s Showcase</title>') + `<script>${code}</script>\n</body></html>\n`
writeFileSync(new URL('./pulsefit-showcase-10s.html', import.meta.url), out)
console.log('pulsefit-showcase-10s.html', (out.length / 1024).toFixed(0) + ' kB')
