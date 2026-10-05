import { mulberry32 } from './story/cloud'

/**
 * Paints a tile of fine, irregular dots and sets it as --texture, so the whole page
 * reads as the same dotted material the illustrations are drawn in.
 */
export function paintTexture() {
  const size = 320
  const scale = 2
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size * scale
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.scale(scale, scale)
  const rand = mulberry32(11)
  const colours = ['34, 30, 74', '184, 140, 62', '118, 98, 226']
  for (let i = 0; i < 1100; i++) {
    const pick = rand()
    const colour = colours[pick < 0.92 ? 0 : pick < 0.97 ? 1 : 2]
    const alpha = 0.06 + rand() * rand() * 0.22
    const r = 0.3 + rand() * 0.35
    ctx.fillStyle = `rgba(${colour}, ${alpha.toFixed(3)})`
    ctx.beginPath()
    ctx.arc(rand() * size, rand() * size, r, 0, Math.PI * 2)
    ctx.fill()
  }
  document.documentElement.style.setProperty('--texture', `url(${canvas.toDataURL('image/png')})`)
}
