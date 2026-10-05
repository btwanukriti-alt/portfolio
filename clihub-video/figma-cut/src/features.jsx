// Feature tiles for the third beat: each pairs a short label with a live mini-infographic.
// lt is seconds since the tile started to reveal.
import { UI, clamp, prog, ease } from './lib.js'
import { Icon } from './ui.jsx'
import { Sweep, enter } from './fx.jsx'

const T = (c = UI.text) => ({ color: c, fontFamily: UI.font })
const M = (c = UI.text) => ({ color: c, fontFamily: UI.mono })

const typed = (s, lt, a, b) => s.slice(0, Math.round(s.length * clamp((lt - a) / (b - a))))

function TerminalMini({ lt }) {
  const lines = [
    [<span key="a"><span style={{ color: UI.green }}>$ </span>{typed('ssh admin@192.168.1.100', lt, 0.25, 0.95)}</span>, 0.2],
    [<span key="b" style={{ color: UI.sub }}>Connected to API Gateway · Ubuntu 22.04 LTS</span>, 1.05],
    [<span key="c"><span style={{ color: UI.green }}>$ </span>{typed('df -h /dev/sda1', lt, 1.3, 1.75)}</span>, 1.25],
    [<span key="d"><span style={{ color: UI.sub }}>/dev/sda1 </span><span style={{ color: UI.amber }}>81% used</span></span>, 1.9],
  ]
  const blink = Math.floor(lt * 2.5) % 2 === 0
  const ai = ease.out(prog(lt, 2.15, 0.5))
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0B0B10', borderRadius: 12, border: `1px solid ${UI.line}`, padding: '18px 20px', boxSizing: 'border-box', fontSize: 17, lineHeight: '30px', ...M() }}>
      <div style={{ display: 'flex', gap: 7, marginBottom: 10 }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <span key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />
        ))}
      </div>
      {lines.map(([el, a], i) => (lt >= a ? <div key={i} style={{ whiteSpace: 'nowrap' }}>{el}{i === lines.filter(([, s]) => lt >= s).length - 1 && blink && <span style={{ display: 'inline-block', width: 9, height: 18, background: UI.text, marginLeft: 3, verticalAlign: -3 }} />}</div> : null))}
      <div style={{ position: 'absolute', right: 16, bottom: 14, display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 20, background: UI.purple, ...T('#fff'), fontSize: 15, opacity: ai, transform: `translateY(${(1 - ai) * 14}px) scale(${0.9 + 0.1 * ai})`, boxShadow: '0 8px 22px rgba(139,61,255,0.45)' }}>
        ✦ Ask AI
      </div>
    </div>
  )
}

function Pane({ title, sub, x, w, active }) {
  return (
    <div style={{ position: 'absolute', left: x, top: 0, bottom: 0, width: w, background: '#121218', borderRadius: 12, border: `1px solid ${active ? 'rgba(76,195,138,0.6)' : UI.line}`, padding: 16, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, ...T(), fontSize: 16, fontWeight: 500 }}>
        <Icon.folder width={20} height={20} style={{ color: UI.violet }} /> {title}
      </div>
      <div style={{ ...M(UI.sub), fontSize: 13, marginTop: 6 }}>{sub}</div>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ height: 9, borderRadius: 5, background: '#24242D', marginTop: i ? 10 : 22, width: `${80 - i * 18}%` }} />
      ))}
    </div>
  )
}

function SftpMini({ lt, w, h }) {
  const pw = w * 0.4
  const move = ease.inOut(prog(lt, 0.45, 1.3))
  const done = lt > 1.9
  const pct = Math.round(100 * clamp((lt - 0.45) / 1.4))
  const fx = 14 + (w - pw) * move
  const fy = h * 0.42 - Math.sin(Math.PI * move) * 40
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Pane title="This computer" sub="~/builds" x={0} w={pw} h={h} />
      <Pane title="API Gateway" sub="/var/www" x={w - pw} w={pw} h={h} active={done} />
      <div style={{ position: 'absolute', left: pw + 8, right: pw + 8, top: h / 2 - 1, borderTop: `2px dashed ${UI.violet}`, opacity: 0.5 }} />
      <div style={{ position: 'absolute', left: fx, top: fy, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: UI.cardHi, border: `1px solid ${UI.violet}`, boxShadow: '0 10px 24px rgba(0,0,0,0.4)', ...T(), fontSize: 15, opacity: clamp(lt * 3) }}>
        <Icon.file width={16} height={16} style={{ color: UI.violet }} /> release.zip
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: -44, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ flex: 1, height: 8, borderRadius: 4, background: '#2A2A33', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: done ? UI.green : UI.purple, borderRadius: 4 }} />
        </div>
        <div style={{ ...T(done ? UI.green : UI.text), fontSize: 16, width: 90, textAlign: 'right' }}>{done ? 'Uploaded' : `${pct}%`}</div>
      </div>
    </div>
  )
}

function Box({ x, w, title, sub, icon }) {
  const I = Icon[icon]
  return (
    <div style={{ position: 'absolute', left: x, top: '50%', transform: 'translateY(-50%)', width: w, padding: '16px 14px', boxSizing: 'border-box', borderRadius: 12, background: '#121218', border: `1px solid ${UI.line}`, textAlign: 'center' }}>
      <I width={26} height={26} style={{ color: UI.violet }} />
      <div style={{ ...T(), fontSize: 16, fontWeight: 500, marginTop: 6, whiteSpace: 'nowrap' }}>{title}</div>
      <div style={{ ...M(UI.sub), fontSize: 13, marginTop: 4 }}>{sub}</div>
    </div>
  )
}

function PortMini({ lt, w, h }) {
  const bw = w * 0.34
  const flow = lt * 90
  const on = lt > 0.7
  const modes = ['Local', 'Remote', 'Dynamic']
  const active = Math.min(2, Math.floor(clamp((lt - 0.9) / 1.8) * 3))
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Box x={0} w={bw} title="This computer" sub="localhost:5432" icon="monitor" />
      <Box x={w - bw} w={bw} title="PostgreSQL" sub="db-server:5432" icon="terminal" />
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <rect x={bw + 6} y={h / 2 - 16} width={w - 2 * bw - 12} height={32} rx={16} fill="rgba(139,61,255,0.12)" stroke="rgba(139,61,255,0.5)" />
        <line x1={bw + 18} x2={w - bw - 18} y1={h / 2} y2={h / 2} stroke={on ? UI.green : UI.violet} strokeWidth={3} strokeDasharray="10 12" strokeDashoffset={-flow} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: -46, display: 'flex', justifyContent: 'center', gap: 10 }}>
        {modes.map((m, i) => (
          <div key={m} style={{ ...T(i === active ? '#fff' : UI.sub), fontSize: 15, padding: '6px 14px', borderRadius: 16, background: i === active ? UI.purple : '#24242D', transition: 'none' }}>
            {m}
          </div>
        ))}
      </div>
    </div>
  )
}

function KeyMini({ lt, w }) {
  const gen = clamp((lt - 0.3) / 1.2)
  const fp = 'SHA256:k3Vq8pZ1rT0mYwN4…9xTz'
  const shown = typed(fp, lt, 1.5, 2.2)
  const pulse = 0.5 + 0.5 * Math.sin(lt * 5)
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#121218', borderRadius: 12, border: `1px solid ${UI.line}`, padding: 20, boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 58, height: 58, borderRadius: 14, background: UI.tagBg, display: 'grid', placeItems: 'center', color: UI.violet, boxShadow: gen < 1 ? `0 0 ${12 + 14 * pulse}px rgba(139,61,255,0.6)` : `0 0 0 2px ${UI.green}` }}>
          <Icon.key width={30} height={30} />
        </div>
        <div>
          <div style={{ ...T(), fontSize: 19, fontWeight: 500 }}>id_rsa</div>
          <div style={{ ...T(UI.sub), fontSize: 15, marginTop: 3 }}>RSA 4096 · {gen < 1 ? 'Generating…' : 'Ready'}</div>
        </div>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: '#2A2A33', marginTop: 20, overflow: 'hidden', width: w - 40 }}>
        <div style={{ width: `${gen * 100}%`, height: '100%', background: gen < 1 ? UI.purple : UI.green }} />
      </div>
      <div style={{ ...M(UI.violet), fontSize: 15, marginTop: 16, whiteSpace: 'nowrap', minHeight: 20 }}>{shown}</div>
    </div>
  )
}

export const FEATURES = [
  { key: 'terminal', icon: 'terminal', title: 'Terminal', line: 'Run commands, with Ask AI built in.', Mini: TerminalMini },
  { key: 'sftp', icon: 'folder', title: 'Files', line: 'Move files to any server over SFTP.', Mini: SftpMini, pad: 46 },
  { key: 'ports', icon: 'ports', title: 'Tunnels', line: 'Local, remote and dynamic port forwarding.', Mini: PortMini, pad: 46 },
  { key: 'keys', icon: 'key', title: 'Keys', line: 'Generate and import SSH keys.', Mini: KeyMini },
]

// A tile: label column on the left, live visual on the right. p = reveal 0..1.
export function FeatureTile({ f, w, h, lt, p }) {
  const I = Icon[f.icon]
  const lw = Math.round(w * 0.35)
  const vw = w - lw - 56
  const vh = h - 56 - (f.pad || 0)
  return (
    <div style={{ position: 'relative', width: w, height: h, borderRadius: 24, background: 'linear-gradient(160deg, #22222B, #17171D)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 30px 60px rgba(25,30,60,0.28), 0 2px 0 rgba(255,255,255,0.05) inset', ...enter(p, { y: 50, tilt: 14 }) }}>
      <div style={{ position: 'absolute', left: 32, top: 32, width: lw - 32 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: UI.tagBg, color: UI.violet, display: 'grid', placeItems: 'center' }}>
          <I width={28} height={28} />
        </div>
        <div style={{ ...T(), fontSize: 34, fontWeight: 600, marginTop: 20, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{f.title}</div>
        <div style={{ ...T(UI.sub), fontSize: 19, marginTop: 10, lineHeight: 1.35 }}>{f.line}</div>
      </div>
      <div style={{ position: 'absolute', left: lw + 24, top: 28, width: vw, height: vh }}>
        <f.Mini lt={lt} w={vw} h={vh} />
      </div>
      <Sweep p={prog(lt, 0.15, 0.9)} r={24} />
    </div>
  )
}
