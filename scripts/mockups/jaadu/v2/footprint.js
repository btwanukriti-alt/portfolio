// The footprint chart, rebuilt with believable order flow. Each candle is split into $50 price bins.
// In every bin the first number is the volume sold and the second the volume bought. The row colour
// says who won that price: blue when buyers outweigh sellers, red when sellers do, and yellow for the
// bin with the most volume in the candle (its point of control).
function rng(s) { return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646 }

const ROWS = 14, TOP = 61650, STEP = 50
const CANDLES = [
  { hi: 2, lo: 10, o: 3, c: 9, poc: 6, peak: 118, t: '13:00' },
  { hi: 7, lo: 12, o: 7, c: 11, poc: 10, peak: 96, t: '13:15' },
  { hi: 6, lo: 12, o: 11, c: 7, poc: 9, peak: 104, t: '13:30' },
  { hi: 1, lo: 8, o: 7, c: 2, poc: 4, peak: 212, t: '13:45' },
  { hi: 4, lo: 10, o: 4, c: 9, poc: 7, peak: 131, t: '14:00' },
  { hi: 5, lo: 11, o: 10, c: 6, poc: 8, peak: 109, t: '14:15' },
  { hi: 0, lo: 7, o: 6, c: 1, poc: 3, peak: 157, t: '14:30' },
]
const k = v => (v >= 1000 ? (v / 1000).toFixed(2) + 'm' : v.toFixed(1) + 'k')
const money = n => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function buildData() {
  const r = rng(7)
  return CANDLES.map(cd => {
    const bull = cd.c < cd.o
    const rows = []
    for (let i = cd.hi; i <= cd.lo; i++) {
      const s = (cd.lo - cd.hi) / 2.6
      let v = cd.peak * Math.exp(-((i - cd.poc) ** 2) / (2 * s * s)) * (0.8 + 0.3 * r())
      if (i === cd.poc) v = cd.peak
      else v = Math.min(v, cd.peak * 0.86)
      v = Math.max(v, 6 + 8 * r())
      let share = 0.5 + 0.16 + (r() - 0.5) * 0.4
      if (!bull) share = 1 - share
      const buy = v * share, sell = v - buy
      rows.push({ i, v, buy, sell })
    }
    return { ...cd, bull, rows }
  })
}

// W x H in CSS px. Returns the markup; cells get ids fp-<candle>-<row> for the notes.
function footprint(W = 1520) {
  const data = buildData()
  const x0 = 24, axisW = 128, y0 = 132, rh = 36, H = y0 + ROWS * rh + 56
  const gw = (W - x0 - axisW) / data.length, cw = Math.floor((gw - 30) / 2)
  let h = ''
  for (let i = 0; i <= ROWS; i += 2) h += `<div class="gl" style="left:${x0}px;width:${W - x0 - axisW + 10}px;top:${y0 + i * rh}px;height:1px"></div>`
  for (let j = 0; j <= data.length; j++) h += `<div class="gl" style="top:${y0 - 10}px;height:${ROWS * rh + 10}px;left:${Math.round(x0 + j * gw - 8)}px;width:1px"></div>`
  for (let i = 0; i <= ROWS; i += 2) h += `<div class="ax" style="left:${W - axisW + 22}px;top:${y0 + i * rh - 9}px">${(TOP - i * STEP).toLocaleString('en-US')}.00</div>`
  data.forEach((cd, j) => {
    const gx = x0 + j * gw
    const pocV = Math.max(...cd.rows.map(q => q.v))
    cd.rows.forEach(q => {
      const d = (q.buy - q.sell) / q.v
      const bg = q.v === pocV ? '#DE9C2E' : d > 0.22 ? '#3157E0' : d > 0 ? '#23388C' : d < -0.22 ? '#D2384F' : '#7A2134'
      const y = y0 + q.i * rh + 2
      h += `<div class="c" id="fp-${j}-${q.i}" style="left:${gx}px;top:${y}px;width:${cw}px;height:${rh - 4}px;background:${bg}">${k(q.sell)}</div>`
      h += `<div class="c" id="fp-${j}-${q.i}b" style="left:${gx + cw + 14}px;top:${y}px;width:${cw}px;height:${rh - 4}px;background:${bg}">${k(q.buy)}</div>`
    })
    const mx = gx + cw + 7
    const col = cd.bull ? '#3DDC97' : '#FF4D6A'
    h += `<div class="wk" style="left:${mx - 2}px;top:${y0 + cd.hi * rh + 8}px;height:${(cd.lo - cd.hi + 1) * rh - 16}px;background:${col}"></div>`
    const bt = Math.min(cd.o, cd.c), bb = Math.max(cd.o, cd.c)
    h += `<div class="bd" style="left:${mx - 6}px;top:${y0 + bt * rh + 14}px;height:${(bb - bt + 1) * rh - 28}px;background:${col}"></div>`
    h += `<div class="ax" style="left:${gx + cw - 18}px;top:${y0 + ROWS * rh + 22}px">${cd.t}</div>`
  })
  // hovered bin: the point of control of the big buying candle
  const hc = data[3], hq = hc.rows.find(q => q.i === hc.poc)
  h += `<div class="hv" id="fp-hover" style="left:${x0 + 3 * gw - 6}px;top:${y0 + hq.i * rh - 2}px;width:${2 * cw + 26}px;height:${rh + 4}px"></div>`
  const lo = p => TOP - (p + 1) * STEP, vol = hc.rows.reduce((a, q) => a + q.v, 0), del = hc.rows.reduce((a, q) => a + q.buy - q.sell, 0)
  h = `<div class="pl" style="top:22px">› <b>O:</b> ${money(lo(hc.o) + 20)}  <b>H:</b> ${money(lo(hc.hi) + 45)}  <b>L:</b> ${money(lo(hc.lo) + 5)}  <b>C:</b> ${money(lo(hc.c) + 30)}  <b>Vol:</b> ${k(vol)}  <b>Δ</b> ${del >= 0 ? '+' : ''}${k(del)}</div>` +
    `<div class="pl" id="fp-pill" style="top:72px">› <b>Bin:</b> ${money(lo(hq.i))}–${money(lo(hq.i) + STEP)}  <b>Vol:</b> ${k(hq.v)}  <b>Δ</b> +${k(hq.buy - hq.sell)}  <b>Buys:</b> ${k(hq.buy)}  <b>Sells:</b> ${k(hq.sell)}</div>` + h
  return `<div class="fp" id="fp" style="width:${W}px;height:${H}px">${h}</div>`
}
