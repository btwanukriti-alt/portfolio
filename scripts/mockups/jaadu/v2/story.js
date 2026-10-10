// Jaadu case-study: the footprint chart is code-rendered (footprint.js) at 2x. The other Jaadu screens exist only as
// 1440 x 900 exports (screens/), so they are cropped at their own size in story-crops.py, never upscaled.
(function () {
  shot('footprint', footprint(1440), { max: 2240 })
  mountShots()
})()
