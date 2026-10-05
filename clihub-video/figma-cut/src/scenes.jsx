// Three beats, told as an infographic flow:
//   1. Hub      - the app at the centre, wired to every server group.
//   2. Connect  - one click on a host, a secure handshake, live stats.
//   3. Features - terminal, SFTP, tunnels and keys as live tiles, folding back into the hub.
// Positions are stage px on a 1920x1080 ('land') or 1080x1920 ('port') base.
import { SCENES, DURATION, UI, prog, at, ease, lerp, clamp } from './lib.js'
import { Headline, Beam, Cursor, Ring, Sweep, curve, enter } from './fx.jsx'
import { HostCard, HOST_CARD, CONNECT_AT, Mark } from './ui.jsx'
import { FEATURES, FeatureTile } from './features.jsx'

const L = {
  land: {
    W: 1920,
    H: 1080,
    head: { top: 58, size: 68, width: 1600 },
    hub: { c: [960, 650], k: 1.22, nodeW: 360, dir: 'h', nodes: [[440, 520], [440, 780], [1480, 520], [1480, 780]] },
    connect: { s: 2.1, card: [140, 470], panel: { x: 1120, y: 395, w: 660, h: 490 }, dir: 'h', cur0: [1060, 980], rest: [990, 960] },
    features: { cols: 2, tw: 850, th: 330, gap: 28, top: 312 },
  },
  port: {
    W: 1080,
    H: 1920,
    head: { top: 120, size: 84, width: 940 },
    hub: { c: [540, 1080], k: 1.08, nodeW: 420, dir: 'v', nodes: [[290, 690], [790, 690], [290, 1470], [790, 1470]] },
    connect: { s: 1.9, card: [236, 520], panel: { x: 120, y: 1060, w: 840, h: 600 }, dir: 'v', cur0: [940, 1000], rest: [930, 980] },
    features: { cols: 1, tw: 960, th: 300, gap: 28, top: 470 },
  },
}

// Host groups from the Hosts screen (each shows 16 hosts in the file).
const GROUPS = [
  { name: 'Production Servers', mark: 'group' },
  { name: 'AWS Infrastructure', mark: 'aws' },
  { name: 'Azure Resources', mark: 'azure' },
  { name: 'DigitalOcean Droplets', mark: 'ocean' },
]

function Glow({ x, y, r, o = 1 }) {
  return <div style={{ position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(139,61,255,0.32), rgba(139,61,255,0))', opacity: o }} />
}

// The app at the centre: a dark tile with a prompt glyph and a slow ring pulse.
function HubTile({ x, y, t, scale = 1, opacity = 1, count, countO = 1 }) {
  const ring = (t % 1.6) / 1.6
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity, transform: `translate(-50%,-50%) scale(${scale})` }}>
      <div style={{ position: 'absolute', left: '50%', top: '50%', width: 210, height: 210, marginLeft: -105, marginTop: -105, borderRadius: 54, border: `2px solid ${UI.purple}`, transform: `scale(${1 + ring * 0.45})`, opacity: 0.6 * (1 - ring) }} />
      <div style={{ width: 210, height: 210, borderRadius: 54, background: 'linear-gradient(155deg, #2A2238, #121218 70%)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 40px 80px rgba(40,20,90,0.45), 0 0 60px rgba(139,61,255,0.35)', display: 'grid', placeItems: 'center' }}>
        <svg width="110" height="90" viewBox="0 0 110 90">
          <path d="M14 18 44 45 14 72" fill="none" stroke="#fff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M58 72h40" stroke={UI.purple} strokeWidth="11" strokeLinecap="round" />
        </svg>
      </div>
      {count != null && (
        <div style={{ position: 'absolute', left: '50%', top: 236, opacity: countO, transform: `translateX(-50%) translateY(${(1 - countO) * 12}px)`, whiteSpace: 'nowrap', padding: '8px 18px', borderRadius: 24, background: '#15151B', color: UI.text, fontFamily: UI.font, fontSize: 20, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 12px 30px rgba(20,20,50,0.25)' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: UI.green, boxShadow: '0 0 0 4px rgba(76,195,138,0.25)' }} />
          {count} hosts
        </div>
      )}
    </div>
  )
}

function Node({ g, w, p, online }) {
  const M = Mark[g.mark]
  return (
    <div style={{ width: w, height: 100, boxSizing: 'border-box', borderRadius: 20, background: 'linear-gradient(160deg, #23232C, #18181E)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 50px rgba(25,30,60,0.3)', display: 'flex', alignItems: 'center', gap: 16, padding: '0 18px', fontFamily: UI.font, position: 'relative', ...enter(p, { y: 30, tilt: 0, scale: 0.85 }) }}>
      <div style={{ width: 60, height: 60, borderRadius: 14, background: '#2A2A33', display: 'grid', placeItems: 'center', flex: 'none' }}>
        <M size={32} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ color: UI.text, fontSize: 21, fontWeight: 500, whiteSpace: 'nowrap' }}>{g.name}</div>
        <div style={{ color: UI.sub, fontSize: 16, marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: online > 0 ? UI.green : '#55555F', boxShadow: online > 0 ? `0 0 0 ${4 * online}px rgba(76,195,138,0.25)` : 'none' }} />
          16 hosts
        </div>
      </div>
    </div>
  )
}

// Zoom-through: a scene arrives from slightly behind and leaves past the viewer.
function Zoom({ t, win, inDur = 0.5, outDur = 0.45, origin, children, skipIn }) {
  const [a, b] = win
  if (t < a || t > b) return null
  const i = skipIn ? 1 : ease.outCubic(prog(t, a, inDur))
  const o = ease.in(prog(t, b - outDur, outDur))
  const s = lerp(0.88, 1, i) * lerp(1, 1.35, o)
  const blur = (1 - i) * 14 + o * 16
  return (
    <div style={{ position: 'absolute', inset: 0, transformOrigin: `${origin[0]}px ${origin[1]}px`, transform: `scale(${s})`, opacity: Math.min(i, 1 - o), filter: blur > 0.2 ? `blur(${blur}px)` : 'none' }}>
      {children}
    </div>
  )
}

/* ---------- 1. Hub ---------- */
function Hub({ t, M }) {
  const H = M.hub
  const [cx, cy] = H.c
  const hw = 105
  const lines = H.nodes.map(([nx, ny], i) => {
    const left = nx < cx
    const up = ny < cy
    const a = H.dir === 'h' ? [cx + (left ? -hw : hw), cy] : [cx, cy + (up ? -hw : hw)]
    const b = H.dir === 'h' ? [nx + (left ? H.nodeW / 2 : -H.nodeW / 2), ny] : [nx, ny + (up ? 50 : -50)]
    return { c: curve(a, b, H.dir), start: 0.5 + i * 0.12 }
  })
  const count = Math.round(64 * at(t, 1.2, 1.2, ease.outCubic))
  return (
    <Zoom t={t} win={SCENES.hub} origin={H.c} skipIn>
      <Glow x={cx} y={cy} r={420} />
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${H.k})`, transformOrigin: `${cx}px ${cy}px` }}>
      <svg width={M.W} height={M.H} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {lines.map((l, i) => {
          const done = l.start + 0.5
          const pulses = [0, 0.5].map((k) => (t > done ? ((t - done) * 1.3 + k) % 1 : 0))
          return <Beam key={i} c={l.c} p={at(t, l.start, 0.5, ease.inOut)} pulses={pulses} />
        })}
      </svg>
      {H.nodes.map(([nx, ny], i) => {
        const p = prog(t, 0.45 + i * 0.12, 0.7)
        const online = at(t, lines[i].start + 0.5 + 0.38, 0.3)
        return (
          <div key={i} style={{ position: 'absolute', left: nx - H.nodeW / 2, top: ny - 50 }}>
            <Node g={GROUPS[i]} w={H.nodeW} p={p} online={online} />
          </div>
        )
      })}
      <HubTile x={cx} y={cy} t={t} count={count} countO={at(t, 1.05, 0.4)} />
      </div>
    </Zoom>
  )
}

/* ---------- 2. Connect ---------- */
const STEPS = ['Host key verified', 'Encrypted SSH channel', 'Session started']

function Panel({ u, P }) {
  const p = prog(u, 1.5, 0.7)
  const phase2 = ease.inOut(prog(u, 2.6, 0.4))
  const k = at(u, 2.85, 0.8, ease.outCubic)
  const ring = Math.min(P.w * 0.27, 190)
  return (
    <div style={{ position: 'absolute', left: P.x, top: P.y, width: P.w, height: P.h, borderRadius: 28, background: 'linear-gradient(160deg, #22222B, #16161C)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 40px 80px rgba(25,30,60,0.35)', overflow: 'hidden', fontFamily: UI.font, ...enter(p, { y: 50, tilt: 12 }) }}>
      <div style={{ position: 'absolute', left: 36, top: 32, right: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Mark.ubuntu size={40} />
          <div style={{ color: UI.text, fontSize: 28, fontWeight: 600, letterSpacing: '-0.01em' }}>API Gateway</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 16px', borderRadius: 20, background: phase2 > 0.5 ? 'rgba(76,195,138,0.15)' : 'rgba(139,61,255,0.18)', color: phase2 > 0.5 ? UI.green : UI.violet, fontSize: 17 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'currentColor' }} />
          {phase2 > 0.5 ? 'Connected' : 'Connecting'}
        </div>
      </div>
      {/* Phase 1: handshake checklist */}
      <div style={{ position: 'absolute', left: 36, right: 36, top: 120, opacity: 1 - phase2, transform: `translateY(${-30 * phase2}px)` }}>
        {STEPS.map((s, i) => {
          const c = at(u, 1.85 + i * 0.25, 0.3)
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '18px 0', borderBottom: i < 2 ? `1px solid ${UI.line}` : 'none', opacity: 0.35 + 0.65 * clamp(c * 2) }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: c > 0 ? UI.green : '#2A2A33', display: 'grid', placeItems: 'center', transform: `scale(${0.8 + 0.2 * ease.pop(c)})` }}>
                <svg width="20" height="20" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="24" strokeDashoffset={24 * (1 - c)} /></svg>
              </div>
              <div style={{ color: UI.text, fontSize: 24 }}>{s}</div>
            </div>
          )
        })}
      </div>
      {/* Phase 2: live stats */}
      <div style={{ position: 'absolute', left: 36, right: 36, top: 118, bottom: 30, opacity: phase2, transform: `translateY(${30 * (1 - phase2)}px)`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Ring size={ring} p={0.34 * k} value={`${Math.round(34 * k)}%`} label="CPU" />
          <Ring size={ring} p={0.52 * k} value={`${Math.round(52 * k)}%`} label="RAM" color={UI.cyan} />
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            ['Uptime', `${Math.round(15 * k)} days`],
            ['Active sessions', `${Math.round(3 * k)}`],
          ].map(([l, v]) => (
            <div key={l} style={{ flex: 1, padding: '14px 20px', borderRadius: 16, background: '#26262F' }}>
              <div style={{ color: UI.sub, fontSize: 17 }}>{l}</div>
              <div style={{ color: UI.text, fontSize: 30, fontWeight: 600, marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <Sweep p={prog(u, 2.7, 0.9)} r={28} />
    </div>
  )
}

function Connect({ t, M }) {
  const C = M.connect
  const u = t - SCENES.connect[0]
  const s = C.s
  const cw = HOST_CARD.w * s
  const ch = HOST_CARD.h * s
  const [x0, y0] = C.card
  const btn = [x0 + CONNECT_AT.x * s, y0 + CONNECT_AT.y * s]
  const reach = at(u, 0.55, 0.7, ease.inOut)
  const leave = at(u, 1.6, 0.8, ease.inOut)
  const cx = lerp(lerp(C.cur0[0], btn[0], reach), C.rest[0], leave)
  const cy = lerp(lerp(C.cur0[1], btn[1], reach), C.rest[1], leave)
  const press = prog(u, 1.22, 0.22)
  const connected = u > 1.36
  const P = C.panel
  const a = C.dir === 'h' ? [x0 + cw, y0 + ch / 2] : [x0 + cw / 2, y0 + ch]
  const b = C.dir === 'h' ? [P.x, P.y + P.h / 2] : [P.x + P.w / 2, P.y]
  const beam = curve(a, b, C.dir)
  const drawn = 1.45 + 0.4
  const pulses = [0, 0.33, 0.66].map((k) => (u > drawn ? ((u - drawn) * 1.4 + k) % 1 : 0))
  const cardP = prog(u, 0.15, 0.7)
  const f = at(u, 1.5, 0.9, ease.inOut)
  const focus = [lerp(x0 + cw / 2, P.x + P.w / 2, f), lerp(y0 + ch / 2, P.y + P.h / 2, f)]
  return (
    <Zoom t={t} win={SCENES.connect} origin={[M.W / 2, M.H / 2 + 60]}>
      <Glow x={focus[0]} y={focus[1]} r={520} />
      <svg width={M.W} height={M.H} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <Beam c={beam} p={at(u, 1.45, 0.4, ease.inOut)} pulses={pulses} width={4} />
      </svg>
      <div style={{ position: 'absolute', left: x0, top: y0, width: cw, height: ch, ...enter(cardP, { y: 40, tilt: 12 }) }}>
        <div style={{ transform: `scale(${s})`, transformOrigin: '0 0' }}>
          <HostCard connected={connected} press={press < 1 ? press : 0} glow={connected ? 0 : at(u, 1.0, 0.2)} />
        </div>
        <Sweep p={prog(u, 1.36, 0.7)} r={20} />
      </div>
      <Panel u={u} P={P} />
      <Cursor x={cx} y={cy} press={press < 1 ? press : 0} ripple={prog(u, 1.28, 0.55)} opacity={clamp(prog(u, 0.35, 0.3)) * (1 - prog(u, 3.2, 0.3))} />
    </Zoom>
  )
}

/* ---------- 3. Features, folding back into the hub ---------- */
function Features({ t, M }) {
  const F = M.features
  const v = t - SCENES.features[0]
  const rows = Math.ceil(FEATURES.length / F.cols)
  const gw = F.cols * F.tw + (F.cols - 1) * F.gap
  const x0 = (M.W - gw) / 2
  const [hx, hy] = M.hub.c
  const hubP = prog(v, 4.25, 0.55)
  const hubIn = ease.outCubic(hubP)
  if (t < SCENES.features[0]) return null
  return (
    <>
      <Zoom t={t} win={[SCENES.features[0], DURATION + 1]} origin={[M.W / 2, M.H / 2]}>
        <Glow x={M.W / 2} y={F.top + (rows * (F.th + F.gap)) / 2} r={600} o={1 - hubIn} />
        {FEATURES.map((f, i) => {
          const col = i % F.cols
          const row = Math.floor(i / F.cols)
          const x = x0 + col * (F.tw + F.gap)
          const y = F.top + row * (F.th + F.gap)
          const start = 0.25 + i * 0.22
          // Fold back: each tile flies into the hub at the end.
          const fold = ease.in(prog(v, 3.85 + i * 0.07, 0.5))
          const tx = (hx - (x + F.tw / 2)) * fold
          const ty = (hy - (y + F.th / 2)) * fold
          return (
            <div key={f.key} style={{ position: 'absolute', left: x, top: y, transform: `translate(${tx}px,${ty}px) scale(${1 - 0.85 * fold})`, opacity: 1 - fold }}>
              <FeatureTile f={f} w={F.tw} h={F.th} lt={Math.max(0, v - start)} p={prog(v, start, 0.8)} />
            </div>
          )
        })}
      </Zoom>
      {hubIn > 0 && <Glow x={hx} y={hy} r={420} o={hubIn} />}
      {hubIn > 0 && <HubTile x={hx} y={hy} t={t} scale={M.hub.k * lerp(0.5, 1, ease.pop(hubP))} opacity={hubIn} />}
    </>
  )
}

const COPY = {
  hub: { label: 'SSH client for desktop', text: 'All your servers, one app.', port: 'All your servers, / one app.' },
  connect: { label: 'Hosts', text: 'Connect in one click.', port: 'Connect in / one click.' },
  features: { label: 'Built in', text: 'Terminal, files, tunnels and keys.', port: 'Terminal, files, / tunnels and keys.' },
}

export function Scenes({ t, mode, sw, sh }) {
  const M = L[mode]
  const e = (sh - M.H) / 3
  const dx = (sw - M.W) / 2
  const hd = M.head
  const head = (k, start, end) => (
    <div style={{ position: 'absolute', left: (sw - hd.width) / 2, top: e }}>
      <Headline t={t} start={start} end={end} label={COPY[k].label} text={mode === 'port' ? COPY[k].port : COPY[k].text} top={hd.top} width={hd.width} size={hd.size} />
    </div>
  )
  return (
    <>
      <div style={{ position: 'absolute', left: dx, top: 2 * e, width: M.W, height: M.H }}>
        <Hub t={t} M={M} />
        <Connect t={t} M={M} />
        <Features t={t} M={M} />
      </div>
      {head('hub', 0, 3.25)}
      {head('connect', 3.35, 6.85)}
      {head('features', 6.95, 11.0)}
    </>
  )
}
