// Pulsefit case-study screens (src/data/stories.ts): whole screens without callouts, and the components the
// page shows close up. Every name and figure is the design's sample data.
(function () {
  const i = P.i
  const ground = 'background:#F7F8FA;padding:24px'
  shot('leads', P.leadDash(), { max: 2240 })
  shot('leads-missed', P.taskCard('missed', { hov: 0, w: 440 }), { style: ground })
  shot('leads-stale', P.taskCard('stale', { w: 440 }), { style: ground })
  shot('convert', P.convertFrame(), { max: 2240 })
  shot('convert-form', P.convertModal(), {
    skip: true, style: ground,
    clips: [['convert-fields', '.u > div:nth-child(2) > div:first-child', 20], ['convert-bill', '.sum, .u > div:last-child', 0]],
  })
  shot('members', P.membersDash(), { max: 2240 })
  shot('members-expiring', `<div class="card u" style="width:960px;overflow:hidden"><div class="ch"><span class="ico" style="background:var(--amb-s);color:var(--amb)">${i('refresh')}</span><h3>Expiring this week</h3><span class="cnt" style="background:var(--amb-s);color:var(--amb)">8</span><span class="ct">View all${i('chevR', 'width:14px;height:14px')}</span></div><table class="tbl"><tr><th>Member</th><th>Plan</th><th>Expires</th><th>Trainer</th><th class="r">Next step</th></tr>${P.EXP.map((e, k) => P.expRow(e, k === 0)).join('')}</table></div>`, { style: ground })
  shot('plans-cards', `<div style="display:flex;gap:20px">${[0, 4].map(k => P.planCard(P.PLANS[k], 1)).join('')}</div>`, { style: ground })
  shot('email', P.emailFrame(), { max: 2240 })
  shot('email-subscriptions', `<div class="card u" style="width:960px;overflow:hidden"><div class="ch">${i('refresh', 'color:var(--mut)')}<h3>Subscriptions</h3><span style="font-size:12.5px;color:var(--mut)">3 emails · 3 on</span><span class="ct">${i('plus', 'width:14px;height:14px')}Add</span></div>${P.CAMP.Subscriptions.map(r => P.campRow(r)).join('')}</div>`, { style: ground })
  mountShots()
})()
