'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type CacheEntry = { buffer: AudioBuffer; loading: Promise<AudioBuffer> }

/**
 * A global singleton cache mapping audio URLs to their loaded buffers or pending Promises.
 * This prevents identical sounds (like multiple fast clicks) from downloading/decoding multiple times.
 */
const audioCache = new Map<string, CacheEntry | null>()
/** A single shared Web Audio API context used across the entire application to prevent hitting browser hardware limits. */
let sharedAudioContext: AudioContext | null = null

/** Lazily creates (and then reuses) the shared AudioContext, with a webkit fallback for older Safari. */
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (sharedAudioContext) return sharedAudioContext

  /** Fallback to webkitAudioContext for older Safari browser compatibility */
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext

  if (!AudioContextClass) return null

  sharedAudioContext = new AudioContextClass()
  return sharedAudioContext
}

/** Fetches and decodes an audio file, deduplicating concurrent requests via the shared cache. */
function loadAudio(url: string, audioCtx: AudioContext): Promise<AudioBuffer> {
  const cached = audioCache.get(url)
  /** If the audio is already fully decoded and cached, return it instantly */
  if (cached?.buffer) return Promise.resolve(cached.buffer)
  /** If the audio is currently downloading/decoding from a previous request, return the pending Promise to prevent race conditions */
  if (cached?.loading) return cached.loading

  const loadingPromise = fetch(url)
    .then((res) => res.arrayBuffer())
    .then((data) => audioCtx.decodeAudioData(data))
    .then((decoded) => {
      audioCache.set(url, { buffer: decoded, loading: loadingPromise })
      return decoded
    })
    .catch((err) => {
      audioCache.set(url, null)
      throw err
    })

  audioCache.set(url, {
    buffer: null as unknown as AudioBuffer,
    loading: loadingPromise,
  })
  return loadingPromise
}

/** Plays a decoded buffer once through a gain node at the given volume. */
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
 * Hook for lazily loading audio only when needed (or via explicit preload), returning playback controls and loading states.
 * Uses a global `AudioContext` and an in-memory cache to prevent duplicate fetching/decoding across identical URLs.
 * @param url - The URL path to the audio file.
 * @returns {object} An object containing playback and preloading methods, and loading state booleans.
 */
export function useSoundLazy(url: string) {
  const bufferRef = useRef<AudioBuffer | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(() => !!audioCache.get(url)?.buffer)

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
    (volume: number = 1) => {
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
