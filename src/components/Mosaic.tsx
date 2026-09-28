import type { CSSProperties, Ref } from 'react'
import shot1 from '../assets/mosaic/shot-1.jpg'
import shot2 from '../assets/mosaic/shot-2.jpg'
import shot3 from '../assets/mosaic/shot-3.jpg'
import shot4 from '../assets/mosaic/shot-4.jpg'
import shot5 from '../assets/mosaic/shot-5.jpg'
import styles from './Mosaic.module.css'

// Layout from Figma "Hero — focus pull" / "Mosaic — 6×5 board" (340:143576): 200 x 150 tiles, 8px gap.
// Placeholder screenshots, repeated across the board until the real project images are added.
const SHOTS = [shot1, shot2, shot3, shot4, shot5]

type MosaicProps = {
  columns: number
  rows: number
  ref?: Ref<HTMLDivElement>
}

export default function Mosaic({ columns, rows, ref }: MosaicProps) {
  return (
    <div
      ref={ref}
      className={styles.board}
      style={{ '--columns': columns, '--rows': rows } as CSSProperties}
      aria-hidden="true"
    >
      {Array.from({ length: columns * rows }, (_, i) => (
        <img key={i} className={styles.tile} src={SHOTS[i % SHOTS.length]} width={200} height={150} alt="" decoding="async" />
      ))}
    </div>
  )
}
