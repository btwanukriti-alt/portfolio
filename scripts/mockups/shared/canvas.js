// Puts every other module's main plate on the landing page's playful canvas: the project's card
// colour with a ring, a pill, a circle and a star peeking in at the corners (as on the work cards).
// Usage: load this file, then call canvasify({ground, star, circle, sel, skip}).
(function () {
  const svg = (s) => 'url("data:image/svg+xml;utf8,' + encodeURIComponent(s) + '")'
  window.canvasify = function ({ ground, star = '#5C8BFF', circle = '#B6EBD2', pill = '#FFE07A', sel = '.mod', plate = '.plate', skip = /brand|logo|icon|colour|palette|process|layouts/i, pick = (i) => i % 2 === 1 }) {
    const ring = svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="12"/></svg>')
    const pl = svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100"><rect x="0" y="4" width="300" height="92" rx="46" fill="' + pill + '" transform="rotate(4 150 50)"/></svg>')
    const ci = svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="' + circle + '"/></svg>')
    const st = svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 4l13.6 30.4 33.1 3.4-24.8 22.2 7.1 32.6L50 75.8 21 92.6l7.1-32.6L3.3 37.8l33.1-3.4z" fill="' + star + '"/></svg>')
    const bg = [
      ring + ' left -70px top -70px / 250px 250px no-repeat',
      pl + ' right -70px top 36px / 320px 106px no-repeat',
      ci + ' left -110px bottom -150px / 380px 380px no-repeat',
      st + ' right 44px bottom 40px / 110px 110px no-repeat',
      'radial-gradient(120% 90% at 50% 40%, rgba(255,255,255,.55), rgba(255,255,255,0) 70%)',
      ground,
    ].join(',')
    document.querySelectorAll(sel).forEach((m, i) => {
      if (skip.test(m.id || '') || !pick(i)) return
      const p = m.querySelector(plate)
      if (!p) return
      p.style.background = bg
      p.style.boxShadow = 'inset 0 0 0 2px rgba(255,255,255,.6)'
    })
  }
})()
