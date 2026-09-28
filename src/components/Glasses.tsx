import type { CSSProperties, Ref } from 'react'
import rim from '../assets/hero/glasses-rim.svg'
import lensFrame from '../assets/hero/glasses-lens-frame.svg'
import styles from './Glasses.module.css'

export const LENS_MASK_URL = lensFrame

type GlassesProps = {
  ref?: Ref<HTMLDivElement>
  lensRef?: Ref<HTMLDivElement>
}

// The lenses are see-through: whatever sits behind the page's lens-shaped hole shows through.
export default function Glasses({ ref, lensRef }: GlassesProps) {
  return (
    <div ref={ref} className={styles.glasses}>
      <div
        ref={lensRef}
        className={styles.lensStroke}
        style={{ '--lens-mask': `url("${lensFrame}")` } as CSSProperties}
      />
      <img className={styles.rim} src={rim} width={654.064} height={265.168} alt="" />
    </div>
  )
}
