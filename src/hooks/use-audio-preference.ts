'use client'

import { useCallback, useSyncExternalStore } from 'react'

let audioEnabled = false
const subscribers = new Set<() => void>()

function notifySubscribers() {
  subscribers.forEach((subscriber) => {
    subscriber()
  })
}

function subscribeToAudioPreference(subscriber: () => void) {
  subscribers.add(subscriber)

  return () => {
    subscribers.delete(subscriber)
  }
}

function getAudioPreferenceSnapshot() {
  return audioEnabled
}

export function isAudioEnabled() {
  return audioEnabled
}

function setAudioEnabled(enabled: boolean) {
  audioEnabled = enabled
  notifySubscribers()
}

export function useAudioPreference() {
  const enabled = useSyncExternalStore(
    subscribeToAudioPreference,
    getAudioPreferenceSnapshot,
    getAudioPreferenceSnapshot,
  )

  const updateAudioEnabled = useCallback((nextEnabled: boolean) => {
    setAudioEnabled(nextEnabled)
  }, [])

  return {
    isAudioEnabled: enabled,
    setAudioEnabled: updateAudioEnabled,
  }
}
