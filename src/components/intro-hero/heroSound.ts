// Optional sound for the hero, synthesised with Web Audio (no files): a soft ambient drone,
// keystrokes and mouse clicks for the Figma-style intro, a whoosh as the screenshots fly, a
// chime when they settle and a tick on hover. Silent until the visitor turns it on.

type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext }

export class HeroSound {
  private ctx: AudioContext | null = null
  private enabled = false
  private master!: GainNode
  private dry!: GainNode
  private ambient!: GainNode
  private noise!: AudioBuffer

  async enable() {
    if (!this.ctx) this.init()
    const ctx = this.ctx!
    if (ctx.state !== 'running') await ctx.resume()
    this.enabled = true
    const t = ctx.currentTime
    this.master.gain.cancelScheduledValues(t)
    this.master.gain.setTargetAtTime(0.9, t, 0.25)
    this.ambient.gain.setTargetAtTime(0.05, t, 1.2)
  }

  disable() {
    this.enabled = false
    if (!this.ctx) return
    const t = this.ctx.currentTime
    this.master.gain.setTargetAtTime(0, t, 0.15)
    this.ambient.gain.setTargetAtTime(0, t, 0.3)
  }

  dispose() {
    this.ctx?.close()
    this.ctx = null
    this.enabled = false
  }

  private init() {
    const Ctx = window.AudioContext || (window as AudioWindow).webkitAudioContext!
    const ctx = new Ctx()
    this.ctx = ctx
    this.master = ctx.createGain()
    this.master.gain.value = 0
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -18
    comp.ratio.value = 3
    this.master.connect(comp).connect(ctx.destination)

    const reverb = ctx.createConvolver()
    reverb.buffer = this.impulse(2.6, 2.4)
    const wet = ctx.createGain()
    wet.gain.value = 0.35
    reverb.connect(wet).connect(this.master)
    this.dry = ctx.createGain()
    this.dry.connect(this.master)
    this.dry.connect(reverb)
    this.noise = this.noiseBuffer(2)

    // Ambient pad: detuned triangles through a slowly swept low-pass.
    this.ambient = ctx.createGain()
    this.ambient.gain.value = 0
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 420
    lp.Q.value = 0.6
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 0.07
    lfoGain.gain.value = 180
    lfo.connect(lfoGain).connect(lp.frequency)
    lfo.start()
    for (const [freq, detune] of [
      [55, -4],
      [82.41, 3],
      [110, 6],
      [164.8, -7],
    ]) {
      const osc = ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.value = freq
      osc.detune.value = detune
      const g = ctx.createGain()
      g.gain.value = freq > 100 ? 0.25 : 0.5
      osc.connect(g).connect(lp)
      osc.start()
    }
    lp.connect(this.ambient).connect(this.dry)
  }

  private impulse(seconds: number, decay: number) {
    const ctx = this.ctx!
    const len = Math.floor(ctx.sampleRate * seconds)
    const buf = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch)
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
    }
    return buf
  }

  private noiseBuffer(seconds: number) {
    const ctx = this.ctx!
    const len = Math.floor(ctx.sampleRate * seconds)
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    return buf
  }

  private get live() {
    return this.enabled && this.ctx !== null && this.ctx.state === 'running'
  }

  form() {
    if (!this.live) return
    const ctx = this.ctx!
    const t = ctx.currentTime
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.Q.value = 6
    bp.frequency.setValueAtTime(600, t)
    bp.frequency.exponentialRampToValueAtTime(5200, t + 2.1)
    const g = ctx.createGain()
    g.gain.setValueAtTime(1e-4, t)
    g.gain.exponentialRampToValueAtTime(0.09, t + 1.6)
    g.gain.exponentialRampToValueAtTime(1e-4, t + 2.4)
    src.connect(bp).connect(g).connect(this.dry)
    src.start(t)
    src.stop(t + 2.5)
  }

  whoosh({ from = -0.9, to = 0.9, dur = 1, f0 = 300, f1 = 3000, gain = 0.22 } = {}) {
    if (!this.live) return
    const ctx = this.ctx!
    const t = ctx.currentTime
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.Q.value = 1.8
    bp.frequency.setValueAtTime(f0, t)
    bp.frequency.exponentialRampToValueAtTime(f1, t + dur * 0.6)
    bp.frequency.exponentialRampToValueAtTime(Math.max(200, f1 * 0.35), t + dur)
    const pan = ctx.createStereoPanner()
    pan.pan.setValueAtTime(from, t)
    pan.pan.linearRampToValueAtTime(to, t + dur)
    const g = ctx.createGain()
    g.gain.setValueAtTime(1e-4, t)
    g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.45)
    g.gain.exponentialRampToValueAtTime(1e-4, t + dur)
    src.connect(bp).connect(g).connect(pan).connect(this.dry)
    src.start(t, Math.random())
    src.stop(t + dur + 0.05)
  }

  chime() {
    if (!this.live) return
    const ctx = this.ctx!
    const t = ctx.currentTime
    ;[523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq
      const g = ctx.createGain()
      const at = t + i * 0.07
      g.gain.setValueAtTime(1e-4, at)
      g.gain.exponentialRampToValueAtTime(0.05, at + 0.015)
      g.gain.exponentialRampToValueAtTime(1e-4, at + 2.6)
      osc.connect(g).connect(this.dry)
      osc.start(at)
      osc.stop(at + 2.7)
    })
  }

  close() {
    if (!this.live) return
    const ctx = this.ctx!
    const t = ctx.currentTime
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 3200
    bp.Q.value = 1.4
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.16, t + 0.004)
    g.gain.exponentialRampToValueAtTime(1e-4, t + 0.07)
    src.connect(bp).connect(g).connect(this.dry)
    src.start(t, Math.random())
    src.stop(t + 0.1)
    const thump = ctx.createOscillator()
    thump.type = 'sine'
    thump.frequency.setValueAtTime(220, t)
    thump.frequency.exponentialRampToValueAtTime(90, t + 0.08)
    const tg = ctx.createGain()
    tg.gain.setValueAtTime(1e-4, t)
    tg.gain.exponentialRampToValueAtTime(0.12, t + 0.006)
    tg.gain.exponentialRampToValueAtTime(1e-4, t + 0.1)
    thump.connect(tg).connect(this.dry)
    thump.start(t)
    thump.stop(t + 0.12)
  }

  open(big = false) {
    if (!this.live) return
    const ctx = this.ctx!
    const t = ctx.currentTime
    const dur = big ? 1.4 : 0.85
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.Q.value = 2.2
    bp.frequency.setValueAtTime(280, t)
    bp.frequency.exponentialRampToValueAtTime(big ? 4200 : 2600, t + dur * 0.55)
    bp.frequency.exponentialRampToValueAtTime(900, t + dur)
    const pan = ctx.createStereoPanner()
    pan.pan.setValueAtTime(-0.8, t)
    pan.pan.linearRampToValueAtTime(0.8, t + dur)
    const g = ctx.createGain()
    g.gain.setValueAtTime(1e-4, t)
    g.gain.exponentialRampToValueAtTime(big ? 0.32 : 0.2, t + dur * 0.4)
    g.gain.exponentialRampToValueAtTime(1e-4, t + dur)
    src.connect(bp).connect(g).connect(pan).connect(this.dry)
    src.start(t, Math.random())
    src.stop(t + dur + 0.05)

    // Bell: a few inharmonic partials.
    const root = big ? 659.25 : [523.25, 587.33, 659.25, 783.99][Math.floor(Math.random() * 4)]
    const at = t + (big ? 0.18 : 0.08)
    for (const [ratio, level] of [
      [1, 0.09],
      [2.01, 0.035],
      [2.99, 0.018],
      [4.2, 0.008],
    ]) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = root * ratio
      const pg = ctx.createGain()
      pg.gain.setValueAtTime(1e-4, at)
      pg.gain.exponentialRampToValueAtTime(level, at + 0.012)
      pg.gain.exponentialRampToValueAtTime(1e-4, at + (big ? 3.2 : 1.8) / ratio ** 0.3)
      osc.connect(pg).connect(this.dry)
      osc.start(at)
      osc.stop(at + 3.5)
    }
    if (big) {
      const fifth = ctx.createOscillator()
      fifth.type = 'sine'
      fifth.frequency.value = root * 1.5
      const fg = ctx.createGain()
      fg.gain.setValueAtTime(1e-4, t + 0.42)
      fg.gain.exponentialRampToValueAtTime(0.05, t + 0.44)
      fg.gain.exponentialRampToValueAtTime(1e-4, t + 3.4)
      fifth.connect(fg).connect(this.dry)
      fifth.start(t + 0.42)
      fifth.stop(t + 3.6)
    }
  }

  // A soft keystroke: a short burst of filtered noise, slightly different every time.
  key() {
    if (!this.live) return
    const ctx = this.ctx!
    const t = ctx.currentTime
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 2600 + Math.random() * 1400
    bp.Q.value = 2.5
    const g = ctx.createGain()
    g.gain.setValueAtTime(1e-4, t)
    g.gain.exponentialRampToValueAtTime(0.07, t + 0.003)
    g.gain.exponentialRampToValueAtTime(1e-4, t + 0.045)
    src.connect(bp).connect(g).connect(this.dry)
    src.start(t, Math.random())
    src.stop(t + 0.06)
  }

  // Mouse button: a tiny low tick.
  click() {
    if (!this.live) return
    const ctx = this.ctx!
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(900, t)
    osc.frequency.exponentialRampToValueAtTime(380, t + 0.03)
    const g = ctx.createGain()
    g.gain.setValueAtTime(1e-4, t)
    g.gain.exponentialRampToValueAtTime(0.06, t + 0.003)
    g.gain.exponentialRampToValueAtTime(1e-4, t + 0.05)
    osc.connect(g).connect(this.dry)
    osc.start(t)
    osc.stop(t + 0.06)
  }

  hover(pan = 0) {
    if (!this.live) return
    const ctx = this.ctx!
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(1900, t)
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05)
    const g = ctx.createGain()
    g.gain.setValueAtTime(1e-4, t)
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.004)
    g.gain.exponentialRampToValueAtTime(1e-4, t + 0.09)
    const p = ctx.createStereoPanner()
    p.pan.value = Math.max(-1, Math.min(1, pan))
    osc.connect(g).connect(p).connect(this.dry)
    osc.start(t)
    osc.stop(t + 0.1)
  }
}
