// Tiny Web-Audio SFX engine — all sounds are synthesized (no asset files).
// ON by default; the visitor can mute via the toggle. The AudioContext is
// created lazily and resumed inside the first user gesture (a click/tap handler),
// so it unlocks without a separate "enable audio" prompt.

const KEY = "farhad.sound.on"

let ctx: AudioContext | null = null
let master: GainNode | null = null
let enabled = true
const listeners = new Set<(on: boolean) => void>()

function readPref(): boolean {
  if (typeof window === "undefined") return true
  try {
    return localStorage.getItem(KEY) !== "0"
  } catch {
    return true
  }
}

// Lazily create/resume the context. Returns null when audio is unavailable
// (SSR, or the browser has no Web Audio).
function ac(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    enabled = readPref()
    master.gain.value = enabled ? 1 : 0
    master.connect(ctx.destination)
  }
  if (ctx.state === "suspended") void ctx.resume()
  return ctx
}

function noiseBuffer(c: AudioContext, dur: number): AudioBuffer {
  const buf = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * dur)), c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  return buf
}

export function isSoundOn(): boolean {
  return enabled
}

export function onSoundChange(fn: (on: boolean) => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function setSoundOn(on: boolean): void {
  enabled = on
  try {
    localStorage.setItem(KEY, on ? "1" : "0")
  } catch {
    /* private mode */
  }
  const c = ac()
  if (c && master) master.gain.setTargetAtTime(on ? 1 : 0, c.currentTime, 0.02)
  listeners.forEach((fn) => fn(on))
}

// Call inside a user gesture to unlock audio early (idempotent).
export function unlockSound(): void {
  ac()
}

// --- Individual sounds -----------------------------------------------------

// Soft mechanical switch click — for the lamp toggle.
export function playClick(): void {
  const c = ac()
  if (!c || !master || !enabled) return
  const t = c.currentTime
  const o = c.createOscillator()
  o.type = "triangle"
  o.frequency.setValueAtTime(190, t)
  o.frequency.exponentialRampToValueAtTime(90, t + 0.08)
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.35, t + 0.004)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.11)
  o.connect(g).connect(master)
  o.start(t)
  o.stop(t + 0.12)
  // tiny noise tick for the mechanical "clack"
  const n = c.createBufferSource()
  n.buffer = noiseBuffer(c, 0.03)
  const nf = c.createBiquadFilter()
  nf.type = "highpass"
  nf.frequency.value = 1800
  const ng = c.createGain()
  ng.gain.setValueAtTime(0.25, t)
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.04)
  n.connect(nf).connect(ng).connect(master)
  n.start(t)
  n.stop(t + 0.05)
}

// Tiny UI "pop/blip" — for tapping desk objects.
export function playPop(): void {
  const c = ac()
  if (!c || !master || !enabled) return
  const t = c.currentTime
  const o = c.createOscillator()
  o.type = "sine"
  o.frequency.setValueAtTime(480, t)
  o.frequency.exponentialRampToValueAtTime(920, t + 0.06)
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.22, t + 0.006)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.13)
  o.connect(g).connect(master)
  o.start(t)
  o.stop(t + 0.14)
}

// Looping drone motor whir. Returns a stop() that fades it out.
let droneNodes: { stop: () => void } | null = null
export function startDrone(): void {
  const c = ac()
  if (!c || !master || !enabled || droneNodes) return
  const t = c.currentTime
  const lp = c.createBiquadFilter()
  lp.type = "lowpass"
  lp.frequency.value = 420
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.09, t + 0.35)
  lp.connect(g).connect(master)
  // Two slightly detuned saws → a beating rotor hum.
  const oscs = [88, 91.5].map((f) => {
    const o = c.createOscillator()
    o.type = "sawtooth"
    o.frequency.value = f
    o.connect(lp)
    o.start(t)
    return o
  })
  // Vibrato LFO on the filter cutoff for a whirring shimmer.
  const lfo = c.createOscillator()
  lfo.frequency.value = 24
  const lfoGain = c.createGain()
  lfoGain.gain.value = 120
  lfo.connect(lfoGain).connect(lp.frequency)
  lfo.start(t)
  droneNodes = {
    stop: () => {
      const now = c.currentTime
      g.gain.cancelScheduledValues(now)
      g.gain.setTargetAtTime(0.0001, now, 0.18)
      const end = now + 0.9
      oscs.forEach((o) => o.stop(end))
      lfo.stop(end)
    },
  }
}
export function stopDrone(): void {
  if (!droneNodes) return
  droneNodes.stop()
  droneNodes = null
}

// The dial-up modem handshake — the retro fast-forward moment (~2.2s).
export function playModem(): void {
  const c = ac()
  if (!c || !master || !enabled) return
  const t0 = c.currentTime
  const out = c.createGain()
  out.gain.value = 0.16
  out.connect(master)

  const beep = (freq: number, start: number, dur: number, type: OscillatorType = "square") => {
    const o = c.createOscillator()
    o.type = type
    o.frequency.value = freq
    const g = c.createGain()
    g.gain.setValueAtTime(0.0001, t0 + start)
    g.gain.exponentialRampToValueAtTime(0.5, t0 + start + 0.01)
    g.gain.setValueAtTime(0.5, t0 + start + dur - 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + start + dur)
    o.connect(g).connect(out)
    o.start(t0 + start)
    o.stop(t0 + start + dur + 0.02)
  }

  // Dial tone
  beep(350, 0, 0.35, "sine")
  beep(440, 0, 0.35, "sine")
  // Touch-tone "dialing"
  const tones = [941, 1336, 1209, 1477, 852, 1209]
  tones.forEach((f, i) => beep(f, 0.45 + i * 0.13, 0.09))
  // Handshake: dual carriers + warble
  ;[1200, 2400].forEach((f) => {
    const o = c.createOscillator()
    o.type = "sine"
    o.frequency.setValueAtTime(f, t0 + 1.3)
    o.frequency.linearRampToValueAtTime(f * 0.9, t0 + 2.2)
    const g = c.createGain()
    g.gain.setValueAtTime(0.0001, t0 + 1.3)
    g.gain.exponentialRampToValueAtTime(0.3, t0 + 1.35)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.25)
    o.connect(g).connect(out)
    o.start(t0 + 1.3)
    o.stop(t0 + 2.3)
  })
  // Handshake noise bursts (the "kshhhh")
  const n = c.createBufferSource()
  n.buffer = noiseBuffer(c, 1.0)
  const nf = c.createBiquadFilter()
  nf.type = "bandpass"
  nf.frequency.value = 1800
  nf.Q.value = 0.7
  const ng = c.createGain()
  ng.gain.setValueAtTime(0.0001, t0 + 1.3)
  ng.gain.linearRampToValueAtTime(0.28, t0 + 1.6)
  ng.gain.setValueAtTime(0.28, t0 + 2.0)
  ng.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.25)
  n.connect(nf).connect(ng).connect(out)
  n.start(t0 + 1.3)
  n.stop(t0 + 2.35)
}
