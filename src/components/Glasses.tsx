import type { CSSProperties, Ref } from 'react'

export const LENS_MASK_URL = '/hero/glasses-lens-frame.svg'

type GlassesProps = {
  ref?: Ref<HTMLDivElement>
  lensRef?: Ref<HTMLDivElement>
}

// Design group: 654.064 x 265.168. Children are positioned in % of that box so the glasses scale
// down on narrow screens without drifting. The lenses are see-through: whatever sits behind the
// page's lens-shaped hole shows through.
export default function Glasses({ ref, lensRef }: GlassesProps) {
  return (
    <div ref={ref} className="relative aspect-[654.064/265.168] w-full origin-center will-change-transform">
      {/* Lens outline: 576.092 x 196.157 at (40.44, 35.61). */}
      <div
        ref={lensRef}
        className="lens-stroke absolute top-[13.43%] left-[6.183%] aspect-[576.092/196.157] w-[88.079%]"
        style={{ '--lens-mask': `url("${LENS_MASK_URL}")` } as CSSProperties}
      />
      <img
        className="absolute top-0 left-0 h-auto w-full max-w-none"
        src="/hero/glasses-rim.svg"
        width={654.064}
        height={265.168}
        alt=""
      />
    </div>
  )
}
