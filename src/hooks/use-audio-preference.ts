'use client'

import { useCallback, useEffect, useState } from 'react'

const AUDIO_ENABLED_STORAGE_KEY = 'audio-enabled-v2'
const LEGACY_AUDIO_ENABLED_STORAGE_KEY = 'audio-enabled'

let audioEnabled = true
let hasHydratedPreference = false
const subscribers = new Set<() => void>()

function notifySubscribers() {
  subscribers.forEach((subscriber) => {
    subscriber()
  })
}

function hydrateAudioPreference() {
  if (hasHydratedPreference || typeof window === 'undefined') return

  const storedPreference = window.localStorage.getItem(AUDIO_ENABLED_STORAGE_KEY)
  if (storedPreference !== null) {
    audioEnabled = storedPreference === 'true'
  } else {
    audioEnabled = true
    window.localStorage.setItem(AUDIO_ENABLED_STORAGE_KEY, 'true')
    window.localStorage.removeItem(LEGACY_AUDIO_ENABLED_STORAGE_KEY)
  }

  hasHydratedPreference = true
}

/** Returns the hydrated global sound-effects preference for non-React callers. */
export function isAudioEnabled() {
  hydrateAudioPreference()
  return audioEnabled
}

/** Persists and broadcasts the global sound-effects preference. */
export function setAudioEnabled(enabled: boolean) {
  audioEnabled = enabled

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(AUDIO_ENABLED_STORAGE_KEY, String(enabled))
  }

  notifySubscribers()
}

/** React hook that exposes the hydrated global sound-effects preference and updater. */
export function useAudioPreference() {
  const [enabled, setEnabled] = useState(audioEnabled)

  useEffect(() => {
    hydrateAudioPreference()
    setEnabled(audioEnabled)

    const syncEnabled = () => setEnabled(audioEnabled)
    subscribers.add(syncEnabled)

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== AUDIO_ENABLED_STORAGE_KEY || event.newValue === null) return

      audioEnabled = event.newValue === 'true'
      notifySubscribers()
    }

    window.addEventListener('storage', handleStorage)

    return () => {
      subscribers.delete(syncEnabled)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const updateAudioEnabled = useCallback((nextEnabled: boolean) => {
    setAudioEnabled(nextEnabled)
  }, [])

  return {
    isAudioEnabled: enabled,
    setAudioEnabled: updateAudioEnabled,
  }
}
