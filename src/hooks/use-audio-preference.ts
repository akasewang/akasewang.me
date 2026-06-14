'use client'

import { useCallback, useEffect, useState } from 'react'

let audioEnabled = false
const subscribers = new Set<() => void>()

function notifySubscribers() {
  subscribers.forEach((subscriber) => {
    subscriber()
  })
}

/** Returns the current page-load sound-effects preference for non-React callers. */
export function isAudioEnabled() {
  return audioEnabled
}

/** Updates and broadcasts the global sound-effects preference for the current page load. */
function setAudioEnabled(enabled: boolean) {
  audioEnabled = enabled
  notifySubscribers()
}

/** React hook that exposes the in-memory global sound-effects preference and updater. */
export function useAudioPreference() {
  const [enabled, setEnabled] = useState(audioEnabled)

  useEffect(() => {
    setEnabled(audioEnabled)

    const syncEnabled = () => setEnabled(audioEnabled)
    subscribers.add(syncEnabled)

    return () => {
      subscribers.delete(syncEnabled)
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
