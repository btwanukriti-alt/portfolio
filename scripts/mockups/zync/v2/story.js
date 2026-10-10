// Zync case-study screens (src/data/stories.ts): whole phone screens and close-ups, taken from the rebuilt screens in
// #lib (story.html). Health and activity figures are the design's sample data.
(function () {
  const lib = document.getElementById('lib')
  // The Consumed side of the calorie card: the Burned card with the food log's numbers (as in modules.js).
  const b = lib.querySelector('#s-home .card2').cloneNode(true); b.id = 'k-consumed'
  const sg = b.querySelectorAll('.seg span'); sg[0].classList.remove('on'); sg[1].classList.add('on')
  // The segments keep the board's split between nutrients, scaled so the ring fills 1,385 / 2,250 of the goal.
  const C = 477.5, fill = 1385 / 2250, split = [['#2DC6A0', .52], ['#F5B01D', .18], ['#F5577D', .13], ['#C86BFA', .05]], sum = split.reduce((a, p) => a + p[1], 0)
  const parts = split.map(([c, f]) => [c, f / sum * fill]); let off = 0
  const circles = b.querySelectorAll('.ring circle'); parts.forEach(([c, f], k) => { const el = circles[k + 1]; el.setAttribute('stroke', c); el.setAttribute('stroke-dasharray', `${(f * C - 6).toFixed(1)} ${C}`); el.setAttribute('stroke-dashoffset', (-off).toFixed(1)); off += f * C })
  b.querySelector('.ring .c').innerHTML = '<b>1,385</b><small>of 2,250 cal</small><u style="background:#FFE3EA;color:#C93A60">865 left</u>'
  b.querySelector('.lg').innerHTML = [['#2DC6A0', 'Carbs', '239 g'], ['#F5B01D', 'Fat', '35 g'], ['#F5577D', 'Protein', '35 g'], ['#C86BFA', 'Fibre', '26 g']].map(([c, n, v]) => `<div><i style="background:${c}"></i><span><b>${n}</b><small>${v}</small></span></div>`).join('')
  lib.appendChild(b)

  // A phone: the whole screen in a device frame. A part: one or more elements of a screen, in a .z wrapper so the
  // screen styles apply, on the app's own ground.
  const phone = (id) => { const sc = document.getElementById(id).cloneNode(true); sc.removeAttribute('id'); return `<div style="padding:24px"><div class="phone"><span class="isl"></span><div class="scr">${sc.outerHTML}</div></div></div>` }
  const part = (sels, w = 390) => `<div class="comp" style="width:${w}px;padding:20px;background:#F6F5FA;border-radius:28px;display:flex;flex-direction:column;gap:14px">${sels.map(sel => { const [q, n] = sel.split('@'); const cl = lib.querySelectorAll(q)[+(n || 0)].cloneNode(true); cl.removeAttribute('id'); cl.style.margin = '0'; if (cl.classList.contains('cta')) { cl.style.background = 'transparent'; cl.style.padding = '0' } return `<div class="z" style="background:transparent;overflow:visible;width:100%">${cl.outerHTML}</div>` }).join('')}</div>`
  const z = 'zoom:1.3'
  shot('home', phone('s-home'), { style: 'zoom:1.25' })
  shot('home-burned', part(['#s-home .card2']), { style: z })
  shot('home-consumed', part(['#k-consumed']), { style: z })
  shot('food', phone('s-food'), { style: 'zoom:1.25' })
  shot('water', phone('s-water'), { style: 'zoom:1.25' })
  shot('sleep', phone('s-sleep'), { style: 'zoom:1.25' })
  shot('food-nutrients', part(['#s-food .card3']), { style: z })
  shot('log-tiles', part(['#s-log .tiles']), { style: z })
  shot('class-open', part(['#s-gymev .cls@0']), { style: z })
  shot('class-full', part(['#s-gymev .cls@1']), { style: z })
  shot('class-booked', part(['#s-gymev .cls@2']), { style: z })
  shot('checkin', phone('s-gymact'), { style: 'zoom:1.25' })
  shot('workout', phone('s-wd'), { style: 'zoom:1.25' })
  shot('workout-list', part(['#s-wd .card2', '#s-wd .cta']), { style: z })
  mountShots()
})()
