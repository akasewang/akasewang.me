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
const HOVER_DURATION = 0.1
const STANDARD_DURATION = 0.12
const LONG_DURATION = 0.14
const HOVER_GAIN = 0.096
const ACTION_GAIN = 0.112
const SECONDARY_GAIN = 0.06
const MASTER_GAIN = 1.4

type SharedOutput = {
  input: GainNode
  compressor: DynamicsCompressorNode
}

type SpotlightVoice = {
  noise: AudioBufferSourceNode
  noiseFilter: BiquadFilterNode
  noiseGain: GainNode
  pan: StereoPannerNode | null
}

type SpotlightSweepInput =
  | number
  | {
      phase?: 'enter' | 'move'
      intensity: number
      ratioX?: number
      ratioY?: number
    }

type ToneOptions = {
  type?: OscillatorType
  from: number
  to?: number
  gain?: number
  duration?: number
  delay?: number
}

/** One context and one output chain for the whole page, reused by every cue */
let sharedCtx: AudioContext | null = null
let sharedOutput: SharedOutput | null = null
let spotlightVoice: SpotlightVoice | null = null
let spotlightReleaseTimer: number | null = null
let lastHoverAt = 0
let lastSpotlightEntryAt = 0

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

function createNoiseBuffer(ctx: AudioContext) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1
  }

  return buffer
}

/**
 * The spotlight sweep is one continuous filtered noise voice that is kept alive between pointer
 * moves and re-aimed, because starting a fresh source per move would click.
 */
function getSpotlightVoice(ctx: AudioContext) {
  if (spotlightReleaseTimer !== null) {
    window.clearTimeout(spotlightReleaseTimer)
    spotlightReleaseTimer = null
  }

  if (spotlightVoice) return spotlightVoice

  const output = getOutput(ctx)
  const noise = ctx.createBufferSource()
  const noiseFilter = ctx.createBiquadFilter()
  const noiseGain = ctx.createGain()
  const pan = typeof ctx.createStereoPanner === 'function' ? ctx.createStereoPanner() : null

  noise.buffer = createNoiseBuffer(ctx)
  noise.loop = true
  noiseFilter.type = 'lowpass'
  noiseFilter.frequency.value = 420
  noiseFilter.Q.value = 0.7
  noiseGain.gain.value = MIN_GAIN

  noise.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  if (pan) {
    noiseGain.connect(pan)
    pan.connect(output)
  } else {
    noiseGain.connect(output)
  }

  noise.start()

  spotlightVoice = {
    noise,
    noiseFilter,
    noiseGain,
    pan,
  }

  return spotlightVoice
}

/**
 * Fades the sweep out once the pointer settles, then tears the nodes down. Both stages check that
 * the voice is still the current one, so a pointer returning mid fade is not left silent.
 */
function releaseSpotlightVoice(ctx: AudioContext, idleDelay = 140) {
  const voice = spotlightVoice
  if (!voice || typeof window === 'undefined') return

  if (spotlightReleaseTimer !== null) {
    window.clearTimeout(spotlightReleaseTimer)
  }

  spotlightReleaseTimer = window.setTimeout(() => {
    if (spotlightVoice !== voice) return

    const now = ctx.currentTime
    voice.noiseGain.gain.cancelScheduledValues(now)
    voice.noiseGain.gain.setTargetAtTime(MIN_GAIN, now, 0.055)

    spotlightReleaseTimer = window.setTimeout(() => {
      if (spotlightVoice !== voice) return

      try {
        voice.noise.stop()
      } catch {}

      voice.noise.disconnect()
      voice.noiseFilter.disconnect()
      voice.noiseGain.disconnect()
      voice.pan?.disconnect()

      spotlightVoice = null
      spotlightReleaseTimer = null
    }, 320)
  }, idleDelay)
}

/** Browsers suspend a context until a gesture, and again whenever the tab is backgrounded */
function resumeIfNeeded(ctx: AudioContext) {
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
}

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1)
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
  gain.gain.linearRampToValueAtTime(peakGain, start + ATTACK_TIME)
  gain.gain.exponentialRampToValueAtTime(MIN_GAIN, stopAt)

  osc.connect(gain)
  gain.connect(getOutput(ctx))
  osc.start(start)
  osc.stop(stopAt)
}

function playHoverTick(ctx: AudioContext) {
  resumeIfNeeded(ctx)
  playTone(ctx, {
    from: 920,
    to: 760,
    gain: HOVER_GAIN,
    duration: HOVER_DURATION,
  })
  playTone(ctx, {
    type: 'triangle',
    from: 1220,
    to: 980,
    gain: SECONDARY_GAIN,
    duration: HOVER_DURATION * 0.92,
  })
}

function playHoverLink(ctx: AudioContext) {
  resumeIfNeeded(ctx)
  playTone(ctx, {
    from: 1040,
    to: 900,
    gain: HOVER_GAIN * 0.88,
    duration: HOVER_DURATION,
  })
}

function playHoverCard(ctx: AudioContext) {
  resumeIfNeeded(ctx)
  playTone(ctx, {
    from: 520,
    to: 460,
    gain: HOVER_GAIN * 0.95,
    duration: STANDARD_DURATION,
  })
}

function getSpotlightState(input: SpotlightSweepInput = 0.4) {
  if (typeof input === 'number') {
    return {
      phase: 'move',
      intensity: input,
      ratioX: 0.5,
      ratioY: 0.5,
    }
  }

  return {
    phase: input.phase ?? 'move',
    intensity: input.intensity,
    ratioX: input.ratioX ?? 0.5,
    ratioY: input.ratioY ?? 0.5,
  }
}

function playSpotlightEntry(ctx: AudioContext, horizontal: number, verticalLift: number) {
  const now = Date.now()
  if (now - lastSpotlightEntryAt < 90) return
  lastSpotlightEntryAt = now

  playTone(ctx, {
    type: 'triangle',
    from: 430 + verticalLift * 70,
    to: 340 + horizontal * 40,
    gain: HOVER_GAIN * 1.18,
    duration: STANDARD_DURATION,
  })
}

function playSpotlightSweep(ctx: AudioContext, input: SpotlightSweepInput = 0.4) {
  resumeIfNeeded(ctx)
  const now = ctx.currentTime
  const { phase, intensity, ratioX, ratioY } = getSpotlightState(input)
  const motion = clamp01((intensity - 0.4) / 0.6)
  const sweep = 1 - (1 - motion) ** 2
  const audibleMotion = Math.max(sweep ** 1.35, phase === 'enter' ? 0.38 : 0)
  const horizontal = clamp01(ratioX)
  const verticalLift = 1 - clamp01(ratioY)
  const voice = getSpotlightVoice(ctx)

  if (phase === 'enter') playSpotlightEntry(ctx, horizontal, verticalLift)

  voice.noiseFilter.frequency.setTargetAtTime(
    340 + verticalLift * 120 + audibleMotion * 560,
    now,
    0.045,
  )
  voice.noiseFilter.Q.setTargetAtTime(0.65 + audibleMotion * 0.65, now, 0.05)
  voice.noiseGain.gain.setTargetAtTime(HOVER_GAIN * (0.075 + audibleMotion * 0.3), now, 0.055)
  voice.pan?.pan.setTargetAtTime((horizontal - 0.5) * 0.16, now, 0.065)

  releaseSpotlightVoice(ctx)
}

function playClickPop(ctx: AudioContext) {
  resumeIfNeeded(ctx)
  playTone(ctx, {
    from: 420,
    to: 300,
    gain: ACTION_GAIN,
    duration: STANDARD_DURATION,
  })
  playTone(ctx, {
    type: 'triangle',
    from: 880,
    to: 680,
    gain: SECONDARY_GAIN,
    duration: STANDARD_DURATION * 0.82,
  })
}

function playNavigate(ctx: AudioContext) {
  resumeIfNeeded(ctx)
  ;[440, 554.37, 659.25].forEach((freq, index) => {
    playTone(ctx, {
      from: freq,
      to: freq * 1.08,
      gain: ACTION_GAIN * (1 - index * 0.12),
      duration: STANDARD_DURATION,
      delay: index * 0.022,
    })
  })
}

function playToggle(ctx: AudioContext, expanded: boolean) {
  resumeIfNeeded(ctx)
  const tones = expanded ? [523.25, 659.25] : [659.25, 523.25]

  tones.forEach((freq, index) => {
    playTone(ctx, {
      from: freq,
      to: freq * (expanded ? 1.05 : 0.95),
      gain: ACTION_GAIN * (1 - index * 0.16),
      duration: STANDARD_DURATION,
      delay: index * 0.04,
    })
  })
}

function playTap(ctx: AudioContext) {
  resumeIfNeeded(ctx)
  playTone(ctx, {
    from: 880,
    to: 740,
    gain: ACTION_GAIN * 0.9,
    duration: HOVER_DURATION,
  })
}

function playSelect(ctx: AudioContext) {
  resumeIfNeeded(ctx)
  playTone(ctx, {
    from: 660,
    to: 760,
    gain: ACTION_GAIN * 0.88,
    duration: STANDARD_DURATION,
  })
  playTone(ctx, {
    type: 'triangle',
    from: 520,
    to: 480,
    gain: SECONDARY_GAIN * 0.7,
    duration: STANDARD_DURATION,
  })
}

function playSuccess(ctx: AudioContext) {
  resumeIfNeeded(ctx)
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

function playDestructive(ctx: AudioContext) {
  resumeIfNeeded(ctx)
  playTone(ctx, {
    from: 330,
    to: 220,
    gain: ACTION_GAIN * 0.95,
    duration: LONG_DURATION,
  })
  playTone(ctx, {
    type: 'triangle',
    from: 220,
    to: 165,
    gain: SECONDARY_GAIN,
    duration: LONG_DURATION,
  })
}

function playZoom(ctx: AudioContext, zoomIn: boolean) {
  resumeIfNeeded(ctx)
  const [from, to] = zoomIn ? [440, 660] : [660, 440]

  playTone(ctx, {
    from,
    to,
    gain: ACTION_GAIN * 0.82,
    duration: LONG_DURATION,
  })
  playTone(ctx, {
    type: 'triangle',
    from: from * 1.5,
    to: to * 1.5,
    gain: SECONDARY_GAIN * 0.72,
    duration: LONG_DURATION,
  })
}

function playMedia(ctx: AudioContext, playing: boolean) {
  resumeIfNeeded(ctx)
  const [from, to] = playing ? [360, 480] : [480, 360]

  playTone(ctx, {
    type: 'triangle',
    from,
    to,
    gain: ACTION_GAIN * 0.86,
    duration: STANDARD_DURATION,
  })
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

  const spotlightSweep = useCallback((input: SpotlightSweepInput = 0.4) => {
    if (!isAudioEnabled()) {
      if (sharedCtx && spotlightVoice) releaseSpotlightVoice(sharedCtx, 0)
      return
    }

    const ctx = getCtx()
    if (ctx) playSpotlightSweep(ctx, input)
  }, [])

  const clickPop = useCallback(() => {
    if (!isAudioEnabled()) return

    const ctx = getCtx()
    if (ctx) playClickPop(ctx)
  }, [])

  const navigate = useCallback(() => {
    if (!isAudioEnabled()) return

    const ctx = getCtx()
    if (ctx) playNavigate(ctx)
  }, [])

  const toggle = useCallback((expanded: boolean) => {
    if (!isAudioEnabled()) return

    const ctx = getCtx()
    if (ctx) playToggle(ctx, expanded)
  }, [])

  const tap = useCallback(() => {
    if (!isAudioEnabled()) return

    const ctx = getCtx()
    if (ctx) playTap(ctx)
  }, [])

  const select = useCallback(() => {
    if (!isAudioEnabled()) return

    const ctx = getCtx()
    if (ctx) playSelect(ctx)
  }, [])

  const success = useCallback(() => {
    if (!isAudioEnabled()) return

    const ctx = getCtx()
    if (ctx) playSuccess(ctx)
  }, [])

  const error = useCallback(() => {
    if (!isAudioEnabled()) return

    const ctx = getCtx()
    if (ctx) playError(ctx)
  }, [])

  const destructive = useCallback(() => {
    if (!isAudioEnabled()) return

    const ctx = getCtx()
    if (ctx) playDestructive(ctx)
  }, [])

  const zoom = useCallback((zoomIn: boolean) => {
    if (!isAudioEnabled()) return

    const ctx = getCtx()
    if (ctx) playZoom(ctx, zoomIn)
  }, [])

  const media = useCallback((playing: boolean) => {
    if (!isAudioEnabled()) return

    const ctx = getCtx()
    if (ctx) playMedia(ctx, playing)
  }, [])

  return {
    hoverTick,
    hoverLink,
    hoverCard,
    spotlightSweep,
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
