import type { Ref } from 'react'

// What the glasses reveal: screenshots lining the inside of a sphere, with the viewer at its
// centre. useFocusPull turns the camera (drag / swipe / scroll), widens the view (pinch) and
// opens a screen on click. Placeholder screenshots, repeated until the real images are added.
const SHOTS = [1, 2, 3, 4, 5].map((n) => `/mosaic/shot-${n}.jpg`)

export const TILE_W = 400
export const TILE_H = 300
const GAP = 28
export const RADIUS = 1350
const ROWS_EACH_SIDE = 4 // rows above and below the horizon

export type Tile = {
  src: string
  transform: string
  // Tile centre on the sphere, used to skip tiles outside the view.
  x: number
  y: number
  z: number
  // The tile's own right and down directions, used to tell which tile the pointer is on.
  right: [number, number, number]
  down: [number, number, number]
}

// Rows of tiles at fixed latitudes; each row holds as many tiles as fit its circumference,
// alternate rows offset by half a tile like brickwork.
function layout(): Tile[] {
  const tiles: Tile[] = []
  const latStep = (TILE_H + GAP) / RADIUS
  for (let row = -ROWS_EACH_SIDE; row <= ROWS_EACH_SIDE; row++) {
    const lat = row * latStep
    const count = Math.max(4, Math.floor((2 * Math.PI * RADIUS * Math.cos(lat)) / (TILE_W + GAP)))
    const offset = row % 2 ? 0.5 : 0
    for (let i = 0; i < count; i++) {
      const lon = ((i + offset) / count) * 2 * Math.PI
      tiles.push({
        src: SHOTS[(tiles.length * 2 + row + 20) % SHOTS.length],
        transform: `rotateY(${lon}rad) rotateX(${-lat}rad) translateZ(${-RADIUS}px)`,
        x: -RADIUS * Math.cos(lat) * Math.sin(lon),
        y: -RADIUS * Math.sin(lat),
        z: -RADIUS * Math.cos(lat) * Math.cos(lon),
        right: [Math.cos(lon), 0, -Math.sin(lon)],
        down: [-Math.sin(lat) * Math.sin(lon), Math.cos(lat), -Math.sin(lat) * Math.cos(lon)],
      })
    }
  }
  return tiles
}

export const TILES = layout()

type ScreenSphereProps = {
  viewportRef?: Ref<HTMLDivElement>
  worldRef?: Ref<HTMLDivElement>
}

export default function ScreenSphere({ viewportRef, worldRef }: ScreenSphereProps) {
  return (
    <div ref={viewportRef} className="absolute inset-0 overflow-hidden [perspective-origin:50%_50%]" aria-hidden="true">
      <div ref={worldRef} className="absolute top-1/2 left-1/2 h-0 w-0 [transform-style:preserve-3d] will-change-transform">
        {TILES.map((tile, i) => (
          <img
            key={i}
            data-tile={i}
            // Tiles stay on the GPU (will-change) so zooming the view never redraws them.
            className="absolute max-w-none rounded-[6px] bg-[#e6e6e3] object-cover select-none [backface-visibility:hidden] will-change-transform"
            src={tile.src}
            width={TILE_W}
            height={TILE_H}
            style={{ transform: tile.transform, left: -TILE_W / 2, top: -TILE_H / 2, width: TILE_W, height: TILE_H }}
            alt=""
            draggable={false}
            decoding="async"
          />
        ))}
      </div>
    </div>
  )
}
