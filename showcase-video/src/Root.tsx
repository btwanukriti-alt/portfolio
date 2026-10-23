import { Composition } from 'remotion'
import { Showcase } from './Showcase'
import { CUTS, FPS, SHOWCASES } from './showcases'

// One composition per showcase and cut: <slug>-land, <slug>-port.
export function Root() {
  return (
    <>
      {SHOWCASES.flatMap(({ slug, duration, start }) =>
        Object.entries(CUTS).map(([cut, [width, height]]) => (
          <Composition
            key={`${slug}-${cut}`}
            id={`${slug}-${cut}`}
            component={Showcase}
            defaultProps={{ slug, duration, start }}
            durationInFrames={Math.round(duration * FPS)}
            fps={FPS}
            width={width}
            height={height}
          />
        )),
      )}
    </>
  )
}
