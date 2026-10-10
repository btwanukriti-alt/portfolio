// SSH client case-study screens (src/data/stories.ts): whole screens without callouts, and the panels the page shows
// close up. Host names, addresses and metrics are the design's sample data.
(function () {
  const ground = 'background:#0E0E11;padding:24px'
  shot('hosts', P.hostsFrame2(), { max: 2240 })
  shot('new-host', P.newHost2().replace('height:100%', 'height:740px;border-radius:18px;border:0;box-shadow:inset 0 0 0 1px #2A2A31'), { style: ground })
  shot('overview', P.overviewFrame2(), { max: 2240 })
  shot('network', `<div style="width:600px">${P.netCard2()}</div>`, { style: ground })
  shot('security', `<div style="width:600px">${P.security2()}</div>`, { style: ground })
  shot('key-select', P.kSelect(), { style: ground })
  shot('key-export', P.kExport(), { style: ground })
  shot('key-done', P.kDone(), { style: ground })
  shot('terminal', P.termFrame2(), { max: 2240 })
  shot('saved-command', P.termPanel('cmd'), { style: ground })
  shot('ask-ai', P.askAI2(), { style: ground })
  shot('sessions', P.sessionsFrame2(), { max: 2240 })
  // READY waits for the .fit frames in modules.js; here there are none, so mount directly.
  mountShots()
})()
