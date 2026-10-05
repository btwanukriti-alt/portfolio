// One solid pastel stage for the whole piece, always filling the viewport.
import { BG } from './lib.js'

export function Backdrop() {
  return <div style={{ position: 'absolute', inset: 0, background: BG }} />
}
