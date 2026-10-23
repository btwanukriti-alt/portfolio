// Renders every showcase composition to MP4 (and its first frame as the card's still) and copies them into the
// site: public/showcase/video/<id>.mp4 and public/showcase/posters/<id>.jpg.
// npm run render              all ten
// npm run render -- jaadu-land  just the named ones
import { bundle } from '@remotion/bundler'
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer'
import sharp from 'sharp'
import { mkdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const site = resolve('..', 'public', 'showcase')
mkdirSync(`${site}/video`, { recursive: true })
mkdirSync('out', { recursive: true })

const serveUrl = await bundle({ entryPoint: resolve('src/index.ts') })
const ids = process.argv.slice(2)
const all = ['gym-crm', 'college-erp', 'jaadu', 'zync', 'ssh-client'].flatMap((s) => [`${s}-land`, `${s}-port`])
for (const id of ids.length ? ids : all) {
  const composition = await selectComposition({ serveUrl, id, browserExecutable: CHROME })
  const t = Date.now()
  await renderMedia({
    serveUrl,
    composition,
    codec: 'h264',
    // Crisp UI text at a sensible size; x264 'slow' packs it tighter.
    crf: 20,
    x264Preset: 'slow',
    // Lossless frames into the encoder, and the BT.709 colour tags players expect.
    imageFormat: 'png',
    colorSpace: 'bt709',
    // 2x: 2560 x 1440 for desktop cards, 1080 x 1920 for phones.
    scale: 2,
    concurrency: 4,
    browserExecutable: CHROME,
    outputLocation: `${site}/video/${id}.mp4`,
  })
  await renderStill({ serveUrl, composition, frame: 0, scale: 2, imageFormat: 'png', browserExecutable: CHROME, output: `out/${id}.png` })
  await sharp(`out/${id}.png`).jpeg({ quality: 82, mozjpeg: true }).toFile(`${site}/posters/${id}.jpg`)
  console.log(`${id}: ${Math.round(statSync(`${site}/video/${id}.mp4`).size / 1024)} KB video, ${Math.round(statSync(`${site}/posters/${id}.jpg`).size / 1024)} KB still, ${Math.round((Date.now() - t) / 1000)}s`)
}
