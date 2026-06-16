'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { isAudioEnabled } from '@/hooks/use-audio-preference'

type CacheEntry = { buffer?: AudioBuffer; loading?: Promise<AudioBuffer> }

const audioCache = new Map<string, CacheEntry>()

let sharedAudioContext: AudioContext | null = null

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

function playAudioBuffer(buffer: AudioBuffer, audioCtx: AudioContext, volume: number = 1) {
  const source = audioCtx.createBufferSource()
  const gainNode = audioCtx.createGain()

  source.buffer = buffer
  gainNode.gain.value = volume

  source.connect(gainNode)
  gainNode.connect(audioCtx.destination)
  source.start(0)
}

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
