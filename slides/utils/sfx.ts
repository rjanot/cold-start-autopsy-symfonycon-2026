// Every sound is synthesised with Web Audio: no asset files, nothing to license, works offline on stage.

// Kept low and pure on purpose: a big room PA makes high or harsh tones painful for sensitive ears.
const MONITOR_FREQUENCY = 780
const BEEP_LEVEL = 0.28
const FLATLINE_LEVEL = BEEP_LEVEL * 0.6

let context: AudioContext | null = null
let master: GainNode | null = null
let noise: AudioBuffer | null = null
const sustained = new Set<OscillatorNode>()

function audio(): { ctx: AudioContext, out: GainNode } {
  if (!context) {
    context = new AudioContext()
    master = context.createGain()
    master.gain.value = 0.7
    master.connect(context.destination)
  }
  if (context.state === 'suspended')
    void context.resume()
  return { ctx: context, out: master! }
}

function whiteNoise(ctx: AudioContext): AudioBuffer {
  if (!noise) {
    noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.06), ctx.sampleRate)
    const data = noise.getChannelData(0)
    for (let i = 0; i < data.length; i++)
      data[i] = Math.random() * 2 - 1
  }
  return noise
}

// Browsers only start audio after a user gesture; the presenter's first key press unlocks it.
export function unlockAudioOnFirstGesture(): void {
  const unlock = () => audio()
  window.addEventListener('keydown', unlock, { once: true })
  window.addEventListener('pointerdown', unlock, { once: true })
}

export function typewriterKey(soft = false): void {
  const { ctx, out } = audio()
  const now = ctx.currentTime

  const click = ctx.createBufferSource()
  click.buffer = whiteNoise(ctx)
  const band = ctx.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = 2400 + Math.random() * 1800
  band.Q.value = 1.4
  const clickGain = ctx.createGain()
  clickGain.gain.setValueAtTime(soft ? 0.25 : 0.55, now)
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045)
  click.connect(band).connect(clickGain).connect(out)
  click.start(now)
  click.stop(now + 0.06)

  const thump = ctx.createOscillator()
  thump.type = 'triangle'
  thump.frequency.value = 110 + Math.random() * 30
  const thumpGain = ctx.createGain()
  thumpGain.gain.setValueAtTime(soft ? 0.08 : 0.18, now)
  thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)
  thump.connect(thumpGain).connect(out)
  thump.start(now)
  thump.stop(now + 0.04)
}

export function monitorBeep(): void {
  const { ctx, out } = audio()
  const now = ctx.currentTime
  const tone = ctx.createOscillator()
  tone.type = 'sine'
  tone.frequency.value = MONITOR_FREQUENCY
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(BEEP_LEVEL, now + 0.015)
  gain.gain.setValueAtTime(BEEP_LEVEL, now + 0.11)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16)
  tone.connect(gain).connect(out)
  tone.start(now)
  tone.stop(now + 0.18)
}

export function flatline(seconds = 2, fade = 0.15): void {
  const { ctx, out } = audio()
  const now = ctx.currentTime
  const tone = ctx.createOscillator()
  tone.type = 'sine'
  tone.frequency.value = MONITOR_FREQUENCY
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(FLATLINE_LEVEL, now + fade)
  gain.gain.setValueAtTime(FLATLINE_LEVEL, now + seconds)
  gain.gain.exponentialRampToValueAtTime(0.001, now + seconds + fade)
  tone.connect(gain).connect(out)
  tone.start(now)
  tone.stop(now + seconds + fade + 0.05)
  sustained.add(tone)
  tone.onended = () => sustained.delete(tone)
}

export function ding(): void {
  const { ctx, out } = audio()
  const now = ctx.currentTime
  for (const [frequency, level] of [[1318.5, 0.18], [659.25, 0.08]] as const) {
    const tone = ctx.createOscillator()
    tone.type = 'sine'
    tone.frequency.value = frequency
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(level, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2)
    tone.connect(gain).connect(out)
    tone.start(now)
    tone.stop(now + 1.3)
  }
}

export function stopSustainedSounds(): void {
  for (const tone of sustained)
    tone.stop()
  sustained.clear()
}

// Runs `start` as soon as the audience window may play sound: now if already unlocked, else on its first gesture.
export function whenAudioUnlocked(start: () => void): () => void {
  if (context?.state === 'running') {
    start()
    return () => {}
  }
  const unlock = () => {
    audio()
    start()
    cancel()
  }
  const cancel = () => {
    window.removeEventListener('keydown', unlock)
    window.removeEventListener('pointerdown', unlock)
  }
  window.addEventListener('keydown', unlock)
  window.addEventListener('pointerdown', unlock)
  return cancel
}

let rainBuffer: AudioBuffer | null = null

// Soft, band-limited noise under the scene; returns a function that fades it out.
export function startRain(): () => void {
  const { ctx, out } = audio()
  if (!rainBuffer) {
    rainBuffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate)
    const data = rainBuffer.getChannelData(0)
    for (let i = 0; i < data.length; i++)
      data[i] = (Math.random() * 2 - 1) * (Math.random() < 0.002 ? 3 : 1)
  }
  const now = ctx.currentTime
  const source = ctx.createBufferSource()
  source.buffer = rainBuffer
  source.loop = true
  const band = ctx.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = 1600
  band.Q.value = 0.5
  const low = ctx.createBiquadFilter()
  low.type = 'lowpass'
  low.frequency.value = 5000
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.015, now + 2)
  source.connect(band).connect(low).connect(gain).connect(out)
  source.start(now)
  return () => {
    const end = ctx.currentTime
    gain.gain.cancelScheduledValues(end)
    gain.gain.setValueAtTime(gain.gain.value, end)
    gain.gain.linearRampToValueAtTime(0, end + 0.8)
    source.stop(end + 0.9)
  }
}

export function clockTick(): void {
  const { ctx, out } = audio()
  const now = ctx.currentTime
  const click = ctx.createBufferSource()
  click.buffer = whiteNoise(ctx)
  const high = ctx.createBiquadFilter()
  high.type = 'bandpass'
  high.frequency.value = 3800
  high.Q.value = 3
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.45, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)
  click.connect(high).connect(gain).connect(out)
  click.start(now)
  click.stop(now + 0.04)
}

// An electromechanical bell: a metallic, slightly inharmonic tone struck ~20 times a second,
// rung twice (1 s, pause, 1 s). Returns a function that silences what is still scheduled.
// Four cycles of this length ring for fourteen seconds, from the first strike to the last: 3 × 3.87 + 2.4 ≈ 14.
export const PHONE_RING_CYCLE_S = 3.87

export function phoneRing(): () => void {
  const { ctx, out } = audio()
  const start = ctx.currentTime + 0.05
  const STRIKE_INTERVAL = 0.05
  const tones: OscillatorNode[] = []
  for (const burst of [0, 1.4]) {
    for (let t = 0; t < 1; t += STRIKE_INTERVAL) {
      const at = start + burst + t
      for (const [frequency, level] of [[1170, 0.18], [1720, 0.1], [2510, 0.05]] as const) {
        const tone = ctx.createOscillator()
        tone.type = 'sine'
        tone.frequency.value = frequency
        const gain = ctx.createGain()
        gain.gain.setValueAtTime(level, at)
        gain.gain.exponentialRampToValueAtTime(0.001, at + 0.045)
        tone.connect(gain).connect(out)
        tone.start(at)
        tone.stop(at + 0.05)
        tones.push(tone)
      }
    }
  }
  return () => {
    for (const tone of tones) {
      try {
        tone.stop()
      }
      catch {}
    }
  }
}
