// College group ERP case-study screens (src/data/stories.ts): the redesigned screens without callouts. The earlier
// screens (old-*.png) are converted at their own size, never upscaled (scripts/mockups/STORY.md). Every name and figure is the design's sample data.
(function () {
  shot('summary', `<div style="width:1020px">${P.banner('Consolidated finances', 'Vertex Group · 5 colleges', 112, 93.8, .42)}</div>`)
  shot('dashboard', P.dashboard(), { max: 2240 })
  shot('stack', P.stack(), { max: 2240 })
  shot('drawer-college', `<div style="width:1000px;height:850px">${P.drawer('All colleges', 'college', P.COLL[2][0], '4 programmes', [['LLB', 6.0, 4.5], ['BA LLB', 7.5, 4.4], ['LLM', 3.0, 2.1], ['PhD (Law)', 1.5, 1.1]], 'Programme', P.COLL[2][1], P.COLL[2][2], 1)}</div>`, { max: 1600 })
  shot('drawer-programme', `<div style="width:1000px;height:850px">${P.drawer('Vertex Law College', 'book', 'BA LLB', '4 batches', [['BA LLB · 2022 batch', 1.7, 1.5], ['BA LLB · 2023 batch', 1.8, 1.2], ['BA LLB · 2024 batch', 1.9, 1.0], ['BA LLB · 2025 batch', 2.1, 0.7]], 'Batch', 7.5, 4.4, -1)}</div>`, { max: 1600 })
  shot('attendance', P.attendance(), { max: 2240 })
  shot('settlements', P.settlements(), { max: 2240 })
  mountShots()
})()
