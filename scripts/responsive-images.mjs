// Smaller copies of the case-study mockups, so phones and tablets don't download the 2400px originals.
// For every JPEG the case-study data uses (src/data/galleries.ts, collegeGallery.ts) wider than 1200px,
// writes <name>-1200.jpg (and <name>-1600.jpg if it is wider) beside it in public/case-studies/<project>/
// (GalleryCaseStudy lists them in the image's srcset). Run again after replacing a mockup:
//   node scripts/responsive-images.mjs
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

export const WIDTHS = [1200, 1600]
const repo = join(dirname(fileURLToPath(import.meta.url)), '..')
const root = join(repo, 'public', 'case-studies')
const data = ['galleries.ts', 'collegeGallery.ts'].map((f) => readFileSync(join(repo, 'src', 'data', f), 'utf8')).join('\n')
const used = new Set(data.match(/[\w.-]+\.jpg/g))

for (const project of readdirSync(root)) {
  const dir = join(root, project)
  if (!statSync(dir).isDirectory()) continue
  for (const file of readdirSync(dir)) {
    if (!used.has(file) || /-\d+\.jpg$/.test(file)) continue
    const src = join(dir, file)
    const { width } = await sharp(src).metadata()
    if (!width || width <= WIDTHS[0]) continue
    for (const w of WIDTHS.filter((w) => w < width)) {
      const out = src.replace(/\.jpg$/, `-${w}.jpg`)
      const info = await sharp(src).resize({ width: w }).jpeg({ quality: 82, mozjpeg: true }).toFile(out)
      console.log(`${project}/${file} -> ${w}px ${Math.round(info.size / 1024)}KB`)
    }
  }
}
