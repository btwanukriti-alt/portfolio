// The canvas behind everything: a calm Figma-canvas grey that always fills the viewport, a dot
// grid that pans and zooms with the camera, and very soft brand-tinted light in two corners.
const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>')}")`

export function Backdrop({ cam, st }) {
  // Grid spacing on screen: 32 world units, coarsened while zoomed out (as Figma does).
  let gap = 32 * cam.z * st.s
  while (gap < 14) gap *= 4
  const ox = st.ox + (cam.V.x + cam.V.w / 2 - cam.x * cam.z) * st.s
  const oy = st.oy + (cam.V.y + cam.V.h / 2 - cam.y * cam.z) * st.s
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#E9EBF0', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 55% at 0% 0%, rgba(31,79,244,.10), transparent 70%), radial-gradient(55% 60% at 100% 100%, rgba(115,88,245,.10), transparent 70%), radial-gradient(60% 50% at 50% 45%, rgba(255,255,255,.55), transparent 75%)' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(40,50,80,.20) 1.2px, transparent 1.4px)', backgroundSize: `${gap}px ${gap}px`, backgroundPosition: `${ox}px ${oy}px` }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: GRAIN, opacity: 0.12, mixBlendMode: 'overlay' }} />
    </div>
  )
}
