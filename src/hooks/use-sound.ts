'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { isAudioEnabled } from '@/hooks/use-audio-preference'

type CacheEntry = { buffer?: AudioBuffer; loading?: Promise<AudioBuffer> }

/** Decoded buffers and their in flight loads, shared so a clip decodes once per session */
const audioCache = new Map<string, CacheEntry>()

/** Browsers cap how many contexts a page may open, so every clip plays through this one */
let sharedAudioContext: AudioContext | null = null

/** Opens the shared context on first use, under whichever name the browser has for it */
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (sharedAudioContext) return sharedAudioContext

  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext

  if (!AudioContextClass) return null

  sharedAudioContext = new AudioContextClass()
  return sharedAudioContext
}

/**
 * Fetches and decodes a clip once. Callers arriving mid flight join the same promise, and a failed
 * load drops out of the cache so the next attempt is a real retry rather than the old rejection.
 */
function loadAudio(url: string, audioCtx: AudioContext): Promise<AudioBuffer> {
  const cached = audioCache.get(url)
  if (cached?.buffer) return Promise.resolve(cached.buffer)

  if (cached?.loading) return cached.loading

  const loadingPromise = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load audio: ${url}`)
      return res.arrayBuffer()
    })
    .then((data) => audioCtx.decodeAudioData(data))
    .then((decoded) => {
      audioCache.set(url, { buffer: decoded })
      return decoded
    })
    .catch((err) => {
      audioCache.delete(url)
      throw err
    })

  audioCache.set(url, { loading: loadingPromise })
  return loadingPromise
}

/** A source node is single use, so every play builds its own and lets it go when it ends */
function playAudioBuffer(buffer: AudioBuffer, audioCtx: AudioContext, volume: number = 1) {
  const source = audioCtx.createBufferSource()
  const gainNode = audioCtx.createGain()

  source.buffer = buffer
  gainNode.gain.value = volume

  source.connect(gainNode)
  gainNode.connect(audioCtx.destination)
  source.start(0)
}

/**
 * Fetches and decodes a real audio file on demand rather than at import, so the bytes are only
 * paid for once something is likely to play. Preload on hover and play on the action that follows.
 * Playing respects the shared audio preference unless a caller forces it, which is what the
 * pronunciation button does since pressing it is itself the request to hear something.
 */
export function useSoundLazy(url: string) {
  const bufferRef = useRef<AudioBuffer | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(() => !!audioCache.get(url)?.buffer)

  /** A changed url points at a different clip, which may or may not already be decoded */
  useEffect(() => {
    bufferRef.current = audioCache.get(url)?.buffer || null
    setIsLoaded(!!bufferRef.current)
  }, [url])

  const load = useCallback(async () => {
    if (bufferRef.current) return bufferRef.current

    const audioCtx = getAudioContext()
    if (!audioCtx) throw new Error('Web Audio API not supported')

    setIsLoading(true)
    try {
      const buffer = await loadAudio(url, audioCtx)
      bufferRef.current = buffer
      setIsLoaded(true)
      return buffer
    } finally {
      setIsLoading(false)
    }
  }, [url])

  const preload = useCallback(() => {
    load().catch(() => {})
  }, [load])

  const play = useCallback(
    (volume: number = 1, forcePlay: boolean = false) => {
      if (!forcePlay && !isAudioEnabled()) return

      const audioCtx = getAudioContext()
      if (!audioCtx) return

      if (bufferRef.current) {
        playAudioBuffer(bufferRef.current, audioCtx, volume)
        return
      }

      load()
        .then((buffer) => playAudioBuffer(buffer, audioCtx, volume))
        .catch(() => {})
    },
    [load],
  )

  return { play, preload, isLoading, isLoaded }
}
