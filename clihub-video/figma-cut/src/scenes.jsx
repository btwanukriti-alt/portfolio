// The three scenes of the CLIHUB cut. Positions are in stage px: 1920x1080 ('land') or
// 1080x1920 ('port'). Every value is a pure function of the clock t.
import { SCENES, at, prog, ease, lerp, clamp, sceneEnvelope, INK, EYEBROW } from './lib.js'
import { Selection, FrameLabel, Noodle, Spacing, Cursor } from './fig.jsx'
import {
  Dashboard,
  HostCard,
  HOST_CARD,
  CONNECT_AT,
  PortCard,
  PORT_CARD,
  SecurityCard,
  SECURITY_CARD,
  HostInfoCard,
  HOST_INFO,
  ModuleTile,
  MODULES,
} from './ui.jsx'

// Portrait titles break by hand so they wrap to two even lines.
const COPY = {
  intro: { eyebrow: 'Server access', title: 'SSH client for desktop', port: 'SSH client\nfor desktop' },
  feature: { eyebrow: 'Hosts', title: 'Connect to a host in one click.', port: 'Connect to a host\nin one click.' },
  close: { eyebrow: 'Modules', title: 'Hosts, terminal, port mapping and SFTP.', port: 'Hosts, terminal, port\nmapping and SFTP.' },
}

const LAYOUT = {
  land: {
    W: 1920,
    H: 1080,
    text: { eyebrow: 82, title: 116, size: 62, maxW: 1600 },
    intro: {
      frame: { x: 440, y: 412, w: 1040, h: 480, dw: 1280, cols: 2 },
      cards: [
        { kind: 'host', x: 196, y: 452, from: [-280, 0] },
        { kind: 'port', x: 226, y: 714, from: [-280, 0] },
        { kind: 'sec', x: 1356, y: 540, from: [280, 0] },
      ],
      rest: [1600, 990],
    },
    feature: { s: 1.6, card: { x: 250, y: 530 }, info: { x: 998, y: 466 }, dir: 'h', rest: [900, 930] },
    close: { cols: 3, tw: 400, th: 150, gap: 28, pad: 36, cy: 652 },
  },
  port: {
    W: 1080,
    H: 1920,
    text: { eyebrow: 150, title: 192, size: 76, maxW: 900 },
    intro: {
      frame: { x: 100, y: 700, w: 880, h: 820, dw: 900, cols: 1 },
      cards: [
        { kind: 'sec', x: 560, y: 608, from: [0, -220] },
        { kind: 'host', x: 52, y: 1446, from: [-260, 0] },
        { kind: 'port', x: 672, y: 1564, from: [260, 0] },
      ],
      rest: [930, 1810],
    },
    feature: { s: 1.9, card: { x: 236, y: 620 }, info: { x: 141, y: 1270 }, dir: 'v', rest: [860, 1140] },
    close: { cols: 2, tw: 450, th: 190, gap: 28, pad: 36, cy: 1170 },
  },
}

const CARD = {
  host: { C: HostCard, size: HOST_CARD, name: 'Host Card' },
  port: { C: PortCard, size: PORT_CARD, name: 'Port Mapping Card' },
  sec: { C: SecurityCard, size: SECURITY_CARD, name: 'Security Insights' },
}

function Title({ copy, L, sw, mode }) {
  const { eyebrow, title, size, maxW } = L.text
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: sw,
          top: eyebrow,
          textAlign: 'center',
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 500,
          fontSize: 19,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: EYEBROW,
        }}
      >
        {copy.eyebrow}
      </div>
      <div
        style={{
          position: 'absolute',
          left: (sw - maxW) / 2,
          width: maxW,
          top: title,
          textAlign: 'center',
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 500,
          fontSize: size,
          lineHeight: 1.12,
          letterSpacing: '-0.035em',
          color: INK,
          whiteSpace: mode === 'port' ? 'pre-line' : 'normal',
        }}
      >
        {mode === 'port' ? copy.port : copy.title}
      </div>
    </>
  )
}

// The title keeps to the top; the content group is centred in the room the stage gained
// beyond its base size.
function Scene({ t, win, children, copy, L, sw, sh, mode }) {
  const env = sceneEnvelope(t, win)
  if (!env.on) return null
  const dx = (sw - L.W) / 2
  const dy = (sh - L.H) / 2
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: env.opacity, transform: `translateY(${env.y}px)` }}>
      <Title copy={copy} L={L} sw={sw} mode={mode} />
      <div style={{ position: 'absolute', left: dx, top: dy, width: L.W, height: L.H }}>{children}</div>
    </div>
  )
}

// Selection that appears as an element lands, holds, then fades.
const landSel = (t, start, hold = 0.7) => Math.min(at(t, start, 0.15), 1 - prog(t, start + hold, 0.3))

/* ---------- Intro: what the product is ---------- */
function Intro({ t, L }) {
  const I = L.intro
  const F = I.frame
  // Cursor drags out the frame.
  const drag = at(t, 0.4, 0.85, ease.inOut)
  const fw = F.w * drag
  const fh = F.h * drag
  const fill = at(t, 1.25, 0.45, ease.outCubic)
  const frameSel = Math.min(at(t, 0.3, 0.15), 1 - prog(t, 1.65, 0.3))
  const k = at(t, 1.35, 1.0, ease.outCubic)
  // Cursor: press at the corner, drag, release, then drift aside.
  const away = at(t, 1.35, 0.9, ease.inOut)
  const cx = lerp(F.x + fw, I.rest[0], away)
  const cy = lerp(F.y + fh, I.rest[1], away)
  const press = prog(t, 0.22, 0.2) * (1 - prog(t, 1.25, 0.12))
  return (
    <>
      {drag > 0 && (
        <div style={{ position: 'absolute', left: F.x, top: F.y, width: fw, height: fh, background: '#fff', overflow: 'hidden', boxShadow: fill > 0 ? `0 30px 70px rgba(60,30,130,${0.22 * fill})` : 'none' }}>
          <div style={{ opacity: fill, transform: `scale(${lerp(0.985, 1, fill)})`, transformOrigin: '50% 0' }}>
            <Dashboard w={F.w} h={F.h} dw={F.dw} cols={F.cols} k={k} />
          </div>
        </div>
      )}
      {drag > 0 && <FrameLabel x={F.x} y={F.y} name="Hosts" />}
      <Selection x={F.x} y={F.y} w={fw} h={fh} opacity={frameSel} size={`${Math.round(fw)} × ${Math.round(fh)}`} />
      {I.cards.map((c, i) => {
        const s = 1.2
        const start = 1.75 + i * 0.32
        const p = prog(t, start, 0.6)
        if (p <= 0) return null
        const mv = ease.out(p)
        const sc = lerp(0.92, 1, ease.pop(p))
        const { C, size, name } = CARD[c.kind]
        const w = size.w * s
        const h = size.h * s
        return (
          <div key={c.kind}>
            <div
              style={{
                position: 'absolute',
                left: c.x + c.from[0] * (1 - mv),
                top: c.y + c.from[1] * (1 - mv),
                width: w,
                height: h,
                opacity: clamp(p * 3),
                transform: `scale(${sc})`,
              }}
            >
              <div style={{ transform: `scale(${s})`, transformOrigin: '0 0' }}>
                <C connected />
              </div>
            </div>
            <Selection x={c.x} y={c.y} w={w} h={h} opacity={landSel(t, start + 0.4, 0.55)} component={name} />
          </div>
        )
      })}
      <Cursor x={cx} y={cy} press={press > 0 && press < 1 ? press : 0} />
    </>
  )
}

/* ---------- Feature: connect to a host ---------- */
function Feature({ t: T, L }) {
  const t = T - SCENES.feature[0]
  const Fe = L.feature
  const s = Fe.s
  const cw = HOST_CARD.w * s
  const ch = HOST_CARD.h * s
  const iw = HOST_INFO.w * s
  const ih = HOST_INFO.h * s
  const cardIn = prog(t, 0.1, 0.6)
  const btn = [Fe.card.x + CONNECT_AT.x * s, Fe.card.y + CONNECT_AT.y * s]
  // Cursor comes in, clicks Connect, then eases aside.
  const reach = at(t, 0.55, 0.75, ease.inOut)
  const leave = at(t, 1.75, 0.9, ease.inOut)
  const startPt = Fe.dir === 'h' ? [Fe.card.x + cw + 140, Fe.card.y + ch + 200] : [Fe.card.x + cw + 120, Fe.card.y + ch + 160]
  const cx = lerp(lerp(startPt[0], btn[0], reach), Fe.rest[0], leave)
  const cy = lerp(lerp(startPt[1], btn[1], reach), Fe.rest[1], leave)
  const press = prog(t, 1.35, 0.22)
  const ripple = prog(t, 1.4, 0.5)
  const connected = t > 1.48
  // Noodle from the card to Host Info.
  const a = Fe.dir === 'h' ? [Fe.card.x + cw, btn[1]] : [btn[0], Fe.card.y + ch]
  const b = Fe.dir === 'h' ? [Fe.info.x, Fe.info.y + ih * 0.32] : [Fe.info.x + iw * 0.5, Fe.info.y]
  const draw = at(t, 1.6, 0.7, ease.inOut)
  const infoIn = prog(t, 2.05, 0.55)
  const k = at(t, 2.4, 1.0, ease.outCubic)
  return (
    <>
      <div style={{ position: 'absolute', left: Fe.card.x, top: Fe.card.y + 40 * (1 - ease.out(cardIn)), opacity: clamp(cardIn * 2.5), transform: `scale(${lerp(0.94, 1, ease.pop(cardIn))})` }}>
        <div style={{ transform: `scale(${s})`, transformOrigin: '0 0' }}>
          <HostCard connected={connected} press={press < 1 ? press : 0} glow={connected ? 0 : at(t, 1.15, 0.2)} />
        </div>
      </div>
      <Selection x={Fe.card.x} y={Fe.card.y} w={cw} h={ch} opacity={landSel(t, 0.45, 0.8)} component="Host Card" size="320 × 152" />
      <Noodle a={a} b={b} p={draw} dir={Fe.dir} />
      {infoIn > 0 && (
        <div style={{ position: 'absolute', left: Fe.info.x, top: Fe.info.y, opacity: clamp(infoIn * 2.5), transform: `scale(${lerp(0.92, 1, ease.pop(infoIn))})`, transformOrigin: Fe.dir === 'h' ? '0 50%' : '50% 0' }}>
          <div style={{ transform: `scale(${s})`, transformOrigin: '0 0' }}>
            <HostInfoCard k={k} />
          </div>
        </div>
      )}
      <Selection x={Fe.info.x} y={Fe.info.y} w={iw} h={ih} opacity={landSel(t, 2.45, 0.85)} component="Host Info" />
      <Cursor x={cx} y={cy} press={press < 1 ? press : 0} ripple={ripple} opacity={clamp(prog(t, 0.4, 0.3))} />
    </>
  )
}

/* ---------- Close: the modules snap into auto layout ---------- */
const SCATTER = [
  [-70, -40, -5],
  [30, 50, 4],
  [80, -30, -3],
  [-50, 40, 5],
  [60, 30, -4],
  [-30, -50, 3],
]

function Close({ t: T, L }) {
  const t = T - SCENES.close[0]
  const C = L.close
  const rows = Math.ceil(MODULES.length / C.cols)
  const gw = C.cols * C.tw + (C.cols - 1) * C.gap
  const gh = rows * C.th + (rows - 1) * C.gap
  const fw = gw + C.pad * 2
  const fh = gh + C.pad * 2
  const fx = (L.W - fw) / 2
  const fy = C.cy - fh / 2
  const snap = at(t, 1.0, 0.4, ease.inOut)
  const frameIn = at(t, 0.05, 0.4, ease.outCubic)
  const sel = Math.min(at(t, 1.38, 0.15), 1)
  const gaps = at(t, 1.45, 0.3, ease.outCubic)
  const press = prog(t, 1.3, 0.2)
  const cur = at(t, 0.6, 0.65, ease.inOut)
  const corner = [fx + fw - 6, fy + fh - 6]
  const cx = lerp(corner[0] + 120, corner[0], cur)
  const cy = lerp(corner[1] + 90, corner[1], cur)
  const spacers = []
  for (let c = 0; c < C.cols - 1; c++) spacers.push({ x: fx + C.pad + (c + 1) * C.tw + c * C.gap, y: fy + C.pad, w: C.gap, h: gh })
  for (let r = 0; r < rows - 1; r++) spacers.push({ x: fx + C.pad, y: fy + C.pad + (r + 1) * C.th + r * C.gap, w: gw, h: C.gap })
  return (
    <>
      <div style={{ position: 'absolute', left: fx, top: fy, width: fw, height: fh, borderRadius: 20, background: 'rgba(255,255,255,0.42)', border: '1px solid rgba(255,255,255,0.7)', opacity: frameIn }} />
      <FrameLabel x={fx} y={fy} name="Modules" opacity={frameIn} />
      {MODULES.map((m, i) => {
        const col = i % C.cols
        const row = Math.floor(i / C.cols)
        const gx = fx + C.pad + col * (C.tw + C.gap)
        const gy = fy + C.pad + row * (C.th + C.gap)
        const drop = prog(t, 0.12 + i * 0.09, 0.55)
        const [sx, sy, r] = SCATTER[i]
        const off = 1 - snap
        return (
          <div
            key={m[1]}
            style={{
              position: 'absolute',
              left: gx + sx * off,
              top: gy + sy * off - 110 * (1 - ease.out(drop)),
              opacity: clamp(drop * 3),
              transform: `rotate(${r * off}deg) scale(${lerp(0.94, 1, ease.pop(drop))})`,
            }}
          >
            <ModuleTile m={m} w={C.tw} h={C.th} />
          </div>
        )
      })}
      {spacers.map((sp, i) => (
        <Spacing key={i} {...sp} value={C.gap} opacity={gaps} />
      ))}
      <Selection x={fx} y={fy} w={fw} h={fh} opacity={sel} size="Hug × Hug" />
      <Cursor x={cx} y={cy} press={press < 1 ? press : 0} ripple={prog(t, 1.32, 0.5)} opacity={clamp(prog(t, 0.45, 0.3))} />
    </>
  )
}

export function Scenes({ t, mode, sw, sh }) {
  const L = LAYOUT[mode]
  const P = { L, sw, sh, mode }
  return (
    <>
      <Scene t={t} win={SCENES.intro} copy={COPY.intro} {...P}>
        <Intro t={t} L={L} />
      </Scene>
      <Scene t={t} win={SCENES.feature} copy={COPY.feature} {...P}>
        <Feature t={t} L={L} />
      </Scene>
      <Scene t={t} win={SCENES.close} copy={COPY.close} {...P}>
        <Close t={t} L={L} />
      </Scene>
    </>
  )
}
