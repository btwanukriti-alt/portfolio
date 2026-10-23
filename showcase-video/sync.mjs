// Copies the showcase pages from the site into this project's public/, so Remotion serves them same-origin.
import { cpSync, mkdirSync, readdirSync } from 'node:fs'
mkdirSync('public/showcase', { recursive: true })
for (const f of readdirSync('../public/showcase')) if (f.endsWith('.html')) cpSync(`../public/showcase/${f}`, `public/showcase/${f}`)
