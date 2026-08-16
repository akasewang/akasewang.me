'use client'

import { useCallback } from 'react'
import { isAudioEnabled } from '@/hooks/use-audio-preference'
import { canUseHover } from '@/utils/pointer'

/**
 * Every sound in the UI is synthesised here rather than loaded, so there are no audio files to ship
 * and each cue can be shaped in code. The tuning lives in these constants: see the
 * [audio design system](../../architecture/audio-design-system.md) for which cue belongs to which
 * interaction.
 */

/** Never ramp gain to a true zero, since exponential ramps cannot reach it */
const MIN_GAIN = 0.0001
const ATTACK_TIME = 0.012

/**
 * What separates a mechanism from a note.
 *
 * A note fades up over a few milliseconds and the ear hears pitch. A contact arrives in well under
 * one, and the ear hears an event instead: the strike lands before any tone can establish itself,
 * which is the whole difference between a switch and a beep.
 */
const CONTACT_ATTACK = 0.0005
const STANDARD_DURATION = 0.12
const LONG_DURATION = 0.14
const HOVER_GAIN = 0.096
const ACTION_GAIN = 0.112
const MASTER_GAIN = 1.4

type SharedOutput = {
  input: GainNode
  compressor: DynamicsCompressorNode
}

type ToneOptions = {
  type?: OscillatorType
  from: number
  to?: number
  gain?: number
  duration?: number
  delay?: number
  attack?: number
}

/**
 * A band of noise, shaped by an envelope. Every mechanical texture here is built from these: a
 * mechanism makes broadband noise as parts strike, where an oscillator can only make a pitch.
 */
type NoiseOptions = {
  type?: BiquadFilterType
  frequency: number
  Q?: number
  gain: number
  duration: number
  delay?: number
  sweepTo?: number
}

/** One context and one output chain for the whole page, reused by every cue */
let sharedCtx: AudioContext | null = null
let sharedOutput: SharedOutput | null = null
let lastHoverAt = 0

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (sharedCtx) return sharedCtx

  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext

  if (!Ctor) return null
  sharedCtx = new Ctor()
  return sharedCtx
}

/**
 * The shared master chain. A gentle compressor sits before the destination so overlapping cues,
 * such as a hover landing under a click, cannot stack into something harsh.
 */
function getOutput(ctx: AudioContext) {
  if (sharedOutput) {
    sharedOutput.input.gain.value = MASTER_GAIN
    return sharedOutput.input
  }

  const input = ctx.createGain()
  const compressor = ctx.createDynamicsCompressor()

  input.gain.value = MASTER_GAIN
  compressor.threshold.value = -20
  compressor.knee.value = 18
  compressor.ratio.value = 2.5
  compressor.attack.value = 0.004
  compressor.release.value = 0.16

  input.connect(compressor)
  compressor.connect(ctx.destination)
  sharedOutput = { input, compressor }

  return input
}

/**
 * One second of white noise, generated once and shared. Typing can ask for a burst several times a
 * second, and filling a fresh second long buffer for each of them would cost more than the sound.
 */
let noiseBuffer: AudioBuffer | null = null

function getNoiseBuffer(ctx: AudioContext) {
  if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) return noiseBuffer

  const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1
  }

  noiseBuffer = buffer
  return buffer
}

/** Browsers suspend a context until a gesture, and again whenever the tab is backgrounded */
function resumeIfNeeded(ctx: AudioContext) {
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
}

/**
 * One shaped oscillator note, the building block for most cues. The short attack and exponential
 * decay are what keep these reading as taps rather than beeps.
 */
function playTone(ctx: AudioContext, options: ToneOptions) {
  const start = ctx.currentTime + (options.delay ?? 0)
  const duration = options.duration ?? STANDARD_DURATION
  const stopAt = start + duration
  const peakGain = options.gain ?? ACTION_GAIN
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = options.type ?? 'sine'
  osc.frequency.setValueAtTime(options.from, start)

  if (options.to && options.to !== options.from) {
    osc.frequency.exponentialRampToValueAtTime(options.to, stopAt)
  }

  gain.gain.setValueAtTime(MIN_GAIN, start)
  gain.gain.linearRampToValueAtTime(peakGain, start + (options.attack ?? ATTACK_TIME))
  gain.gain.exponentialRampToValueAtTime(MIN_GAIN, stopAt)

  osc.connect(gain)
  gain.connect(getOutput(ctx))
  osc.start(start)
  osc.stop(stopAt)
}

/**
 * A filtered burst of noise: the strike itself.
 *
 * Read from a random offset into the shared buffer every time, so repeats of the same cue are never
 * bit for bit identical. Two presses of one key on a real board are never quite the same either,
 * and it is that tiny inconsistency the ear uses to tell a mechanism from a recording of one.
 */
function playNoise(ctx: AudioContext, options: NoiseOptions) {
  const start = ctx.currentTime + (options.delay ?? 0)
  const stopAt = start + options.duration
  const buffer = getNoiseBuffer(ctx)
  const source = ctx.createBufferSource()
  const filter = ctx.createBiquadFilter()
  const gain = ctx.createGain()

  source.buffer = buffer
  filter.type = options.type ?? 'bandpass'
  filter.frequency.setValueAtTime(options.frequency, start)
  filter.Q.value = options.Q ?? 1

  if (options.sweepTo && options.sweepTo !== options.frequency) {
    filter.frequency.exponentialRampToValueAtTime(options.sweepTo, stopAt)
  }

  gain.gain.setValueAtTime(MIN_GAIN, start)
  gain.gain.linearRampToValueAtTime(options.gain, start + CONTACT_ATTACK)
  gain.gain.exponentialRampToValueAtTime(MIN_GAIN, stopAt)

  source.connect(filter)
  filter.connect(gain)
  gain.connect(getOutput(ctx))

  source.start(start, Math.random() * (buffer.duration - options.duration - 0.02))
  source.stop(stopAt)
}

/**
 * A keypress is three events, not one tone, and the order of them is what the ear reads as a
 * switch: the contact strikes, the keycap bottoms out against the plate, and the case rings.
 *
 * Its own gain floor sits well under the rest of the kit. Every other cue answers one deliberate
 * action, where these arrive several a second for as long as someone is writing, and anything loud
 * enough to notice once is unbearable by the end of a sentence.
 */
type KeyVoice = {
  /** The contact, high and over almost before it starts */
  contact: number
  /** The case ringing under it, which is what gives a board its character */
  body: number
  bodyQ: number
  /** How long the case rings. Bigger keys sit in more plate and ring longer */
  ring: number
  gain: number
  /** Wide keys ride stabilisers, which rattle a moment after the strike */
  rattle?: boolean
}

/** Keys grouped by the sound they make rather than by what they do */
export type KeyKind = 'letter' | 'space' | 'enter' | 'delete' | 'modifier'

const KEY_VOICES: Record<KeyKind, KeyVoice> = {
  letter: { contact: 4200, body: 305, bodyQ: 4.2, ring: 0.045, gain: 0.05 },
  space: { contact: 3100, body: 168, bodyQ: 3.1, ring: 0.082, gain: 0.062, rattle: true },
  enter: { contact: 3400, body: 205, bodyQ: 3.4, ring: 0.068, gain: 0.058, rattle: true },
  delete: { contact: 5100, body: 385, bodyQ: 4.8, ring: 0.033, gain: 0.045 },
  modifier: { contact: 3800, body: 260, bodyQ: 3.6, ring: 0.038, gain: 0.032 },
}

/**
 * A stable number in 0..1 for a character, so a given key always sounds like itself.
 *
 * Randomising per press would be wrong in a way that is hard to name but easy to hear: on a real
 * board a key's pitch comes from where it sits, so it does not wander between presses. What the
 * variation is for is telling keys apart from each other, not one press from the next.
 */
function keySeed(key: string) {
  let hash = 0

  for (let index = 0; index < key.length; index += 1) {
    hash = (hash * 31 + key.charCodeAt(index)) >>> 0
  }

  return (hash % 997) / 997
}

/** Nothing lands closer together than this, so a held key cannot machine gun the output */
const KEY_MIN_GAP_MS = 16
let lastKeyAt = 0

function playKey(ctx: AudioContext, kind: KeyKind, key: string, softer = false) {
  const now = Date.now()
  if (now - lastKeyAt < KEY_MIN_GAP_MS) return
  lastKeyAt = now

  resumeIfNeeded(ctx)

  const voice = KEY_VOICES[kind]
  const seed = keySeed(key)
  /** Spread either side of the voice's centre, so keys differ from each other but stay a set */
  const detune = 1 + (seed - 0.5) * 0.17
  const level = voice.gain * (softer ? 0.55 : 1) * (0.93 + seed * 0.14)

  /** The strike. Brief enough that it reads as an edge rather than a pitch */
  playNoise(ctx, {
    type: 'highpass',
    frequency: voice.contact * detune,
    Q: 0.7,
    gain: level,
    duration: 0.006,
  })

  /** The case under it, tuned by the key's own seed so no two keys ring alike */
  playNoise(ctx, {
    frequency: voice.body * detune,
    Q: voice.bodyQ,
    gain: level * 0.85,
    duration: voice.ring,
    delay: 0.0015,
  })

  /** The bottom out, a shade below the ring, which is what gives the press its weight */
  playTone(ctx, {
    from: voice.body * detune * 0.62,
    to: voice.body * detune * 0.5,
    gain: level * 0.5,
    duration: voice.ring * 0.8,
    attack: CONTACT_ATTACK,
    delay: 0.002,
  })

  /** Only the wide keys, and always late enough to hear as a consequence of the strike */
  if (voice.rattle) {
    playNoise(ctx, {
      type: 'bandpass',
      frequency: 2400 * detune,
      Q: 1.4,
      gain: level * 0.22,
      duration: 0.02,
      delay: 0.011,
    })
  }
}

/**
 * Hovering is pre travel: the point where a switch has been disturbed but nothing has actuated.
 * A hair of noise and no pitch to speak of, because nothing has happened yet.
 */
function playHoverTick(ctx: AudioContext) {
  resumeIfNeeded(ctx)
  playNoise(ctx, {
    type: 'highpass',
    frequency: 5200,
    Q: 0.6,
    gain: HOVER_GAIN * 0.5,
    duration: 0.007,
  })
  playNoise(ctx, {
    frequency: 1750,
    Q: 2.2,
    gain: HOVER_GAIN * 0.32,
    duration: 0.02,
    delay: 0.001,
  })
}

/** Lighter still. Links are the smallest thing on the page that answers back */
function playHoverLink(ctx: AudioContext) {
  resumeIfNeeded(ctx)
  playNoise(ctx, {
    type: 'highpass',
    frequency: 6100,
    Q: 0.6,
    gain: HOVER_GAIN * 0.42,
    duration: 0.005,
  })
}

/** A card is a bigger object, so its pre travel is lower and rings a little longer */
function playHoverCard(ctx: AudioContext) {
  resumeIfNeeded(ctx)
  playNoise(ctx, {
    type: 'highpass',
    frequency: 3900,
    Q: 0.6,
    gain: HOVER_GAIN * 0.46,
    duration: 0.006,
  })
  playNoise(ctx, {
    frequency: 620,
    Q: 3,
    gain: HOVER_GAIN * 0.4,
    duration: 0.032,
    delay: 0.0015,
  })
}

/**
 * Actuation. The strike, the case behind it and the weight underneath, which is the same anatomy
 * as a keypress but on a heavier object and allowed to be heard.
 */
function playClickPop(ctx: AudioContext) {
  resumeIfNeeded(ctx)
  playNoise(ctx, {
    type: 'highpass',
    frequency: 3600,
    Q: 0.7,
    gain: ACTION_GAIN * 0.72,
    duration: 0.007,
  })
  playNoise(ctx, {
    frequency: 430,
    Q: 3.6,
    gain: ACTION_GAIN * 0.66,
    duration: 0.055,
    delay: 0.0015,
  })
  playTone(ctx, {
    from: 250,
    to: 196,
    gain: ACTION_GAIN * 0.44,
    duration: 0.06,
    attack: CONTACT_ATTACK,
    delay: 0.002,
  })
}

/**
 * The heaviest thing in the kit, because leaving a page is the largest thing a click can do. Reads
 * as a latch throwing: a strike, the case behind it, and a low fall that carries the travel.
 */
function playNavigate(ctx: AudioContext) {
  resumeIfNeeded(ctx)
  playNoise(ctx, {
    type: 'highpass',
    frequency: 3200,
    Q: 0.7,
    gain: ACTION_GAIN * 0.78,
    duration: 0.008,
  })
  playNoise(ctx, {
    frequency: 340,
    Q: 3.2,
    gain: ACTION_GAIN * 0.72,
    duration: 0.075,
    sweepTo: 250,
    delay: 0.0015,
  })
  playTone(ctx, {
    from: 190,
    to: 132,
    gain: ACTION_GAIN * 0.5,
    duration: 0.1,
    attack: CONTACT_ATTACK,
    delay: 0.003,
  })
}

/**
 * A detent: the two clicks a switch makes passing over its notch. Opening runs up through them,
 * closing runs back down, so the direction is heard in the order rather than in a melody.
 */
function playToggle(ctx: AudioContext, expanded: boolean) {
  resumeIfNeeded(ctx)
  const steps = expanded ? [560, 880] : [880, 560]

  steps.forEach((frequency, index) => {
    playNoise(ctx, {
      type: 'highpass',
      frequency: frequency * 4.4,
      Q: 0.7,
      gain: ACTION_GAIN * (0.5 - index * 0.14),
      duration: 0.004,
      delay: index * 0.036,
    })
    playNoise(ctx, {
      frequency,
      Q: 4.5,
      gain: ACTION_GAIN * (0.52 - index * 0.12),
      duration: 0.028,
      delay: index * 0.036 + 0.0015,
    })
  })
}

/** The same mechanism as a click, on something small enough that only the contact carries */
function playTap(ctx: AudioContext) {
  resumeIfNeeded(ctx)
  playNoise(ctx, {
    type: 'highpass',
    frequency: 4700,
    Q: 0.7,
    gain: ACTION_GAIN * 0.6,
    duration: 0.005,
  })
  playNoise(ctx, {
    frequency: 720,
    Q: 4,
    gain: ACTION_GAIN * 0.5,
    duration: 0.03,
    delay: 0.0015,
  })
}

/** A click that seats into place, so the case rings upward rather than falling away */
function playSelect(ctx: AudioContext) {
  resumeIfNeeded(ctx)
  playNoise(ctx, {
    type: 'highpass',
    frequency: 4400,
    Q: 0.7,
    gain: ACTION_GAIN * 0.62,
    duration: 0.005,
  })
  playNoise(ctx, {
    frequency: 620,
    Q: 4.2,
    gain: ACTION_GAIN * 0.55,
    duration: 0.042,
    sweepTo: 760,
    delay: 0.0015,
  })
}

/**
 * Tonal, where the rest of the kit is not.
 *
 * Everything else reports that a control moved. These two report an outcome, which is the one thing
 * a mechanism cannot say: a latch sounds the same whether what it did worked. The contact in front
 * keeps them in the same family, and the interval behind it carries the verdict.
 */
function playSuccess(ctx: AudioContext) {
  resumeIfNeeded(ctx)
  playNoise(ctx, {
    type: 'highpass',
    frequency: 4800,
    Q: 0.7,
    gain: ACTION_GAIN * 0.4,
    duration: 0.004,
  })
  ;[523.25, 659.25].forEach((freq, index) => {
    playTone(ctx, {
      type: 'triangle',
      from: freq,
      to: freq * 1.04,
      gain: ACTION_GAIN * (0.82 - index * 0.08),
      duration: LONG_DURATION,
      delay: index * 0.035,
    })
  })
}

function playError(ctx: AudioContext) {
  resumeIfNeeded(ctx)
  playNoise(ctx, {
    type: 'lowpass',
    frequency: 2600,
    Q: 0.8,
    gain: ACTION_GAIN * 0.34,
    duration: 0.006,
  })
  ;[392, 415.3].forEach((freq) => {
    playTone(ctx, {
      type: 'triangle',
      from: freq,
      to: freq * 0.94,
      gain: ACTION_GAIN * 0.62,
      duration: LONG_DURATION,
    })
  })
}

/** Dull and low, the sound of something closing rather than seating: no ring, no lift */
function playDestructive(ctx: AudioContext) {
  resumeIfNeeded(ctx)
  playNoise(ctx, {
    type: 'lowpass',
    frequency: 1400,
    Q: 0.8,
    gain: ACTION_GAIN * 0.6,
    duration: 0.012,
  })
  playNoise(ctx, {
    frequency: 210,
    Q: 2.4,
    gain: ACTION_GAIN * 0.62,
    duration: 0.09,
    sweepTo: 150,
    delay: 0.002,
  })
  playTone(ctx, {
    from: 150,
    to: 104,
    gain: ACTION_GAIN * 0.52,
    duration: LONG_DURATION,
    attack: CONTACT_ATTACK,
    delay: 0.003,
  })
}

/** A lens barrel: the catch releasing, then the body travelling up or back down */
function playZoom(ctx: AudioContext, zoomIn: boolean) {
  resumeIfNeeded(ctx)
  const [from, to] = zoomIn ? [480, 900] : [900, 480]

  playNoise(ctx, {
    type: 'highpass',
    frequency: 4600,
    Q: 0.7,
    gain: ACTION_GAIN * 0.5,
    duration: 0.005,
  })
  playNoise(ctx, {
    frequency: from,
    sweepTo: to,
    Q: 3.4,
    gain: ACTION_GAIN * 0.5,
    duration: 0.09,
    delay: 0.0015,
  })
}

/** A transport key: the same button either way, ringing up into play and down into pause */
function playMedia(ctx: AudioContext, playing: boolean) {
  resumeIfNeeded(ctx)
  const [from, to] = playing ? [380, 520] : [520, 380]

  playNoise(ctx, {
    type: 'highpass',
    frequency: 4000,
    Q: 0.7,
    gain: ACTION_GAIN * 0.52,
    duration: 0.005,
  })
  playNoise(ctx, {
    frequency: from,
    sweepTo: to,
    Q: 4,
    gain: ACTION_GAIN * 0.5,
    duration: 0.05,
    delay: 0.0015,
  })
}

/**
 * Wraps a cue so it plays only when sound is on and a context is available, forwarding whatever
 * arguments the cue takes. Returns a stable callback, so components can depend on it without
 * re-subscribing.
 */
function useAudioCue<A extends unknown[]>(play: (ctx: AudioContext, ...args: A) => void) {
  return useCallback(
    (...args: A) => {
      if (!isAudioEnabled()) return

      const ctx = getCtx()
      if (ctx) play(ctx, ...args)
    },
    [play],
  )
}

/**
 * The cue callbacks every interactive component uses. Each one checks the shared audio preference
 * first, so nothing plays until sound is switched on, and the hover cues additionally require a real
 * hovering pointer so a touch device is not given feedback it never asked for.
 */
export function useSoundEffects() {
  const throttledHover = useCallback((play: (ctx: AudioContext) => void) => {
    if (!canUseHover() || !isAudioEnabled()) return

    const now = Date.now()
    if (now - lastHoverAt < 60) return
    lastHoverAt = now

    const ctx = getCtx()
    if (ctx) play(ctx)
  }, [])

  const hoverTick = useCallback(() => throttledHover(playHoverTick), [throttledHover])
  const hoverLink = useCallback(() => throttledHover(playHoverLink), [throttledHover])
  const hoverCard = useCallback(() => throttledHover(playHoverCard), [throttledHover])

  /**
   * Typing is the one cue that fires without a deliberate decision behind it, so it checks the
   * preference on every press rather than trusting a subscription. Which keys are audible at all is
   * settled by the caller, this only voices whichever kind it is handed.
   */
  const typeKey = useCallback((kind: KeyKind, key: string, softer = false) => {
    if (!isAudioEnabled()) return

    const ctx = getCtx()
    if (ctx) playKey(ctx, kind, key, softer)
  }, [])

  const clickPop = useAudioCue(playClickPop)
  const navigate = useAudioCue(playNavigate)
  const toggle = useAudioCue(playToggle)
  const tap = useAudioCue(playTap)
  const select = useAudioCue(playSelect)
  const success = useAudioCue(playSuccess)
  const error = useAudioCue(playError)
  const destructive = useAudioCue(playDestructive)
  const zoom = useAudioCue(playZoom)
  const media = useAudioCue(playMedia)

  return {
    hoverTick,
    hoverLink,
    hoverCard,
    typeKey,
    clickPop,
    navigate,
    toggle,
    tap,
    select,
    success,
    error,
    destructive,
    zoom,
    media,
  }
}
