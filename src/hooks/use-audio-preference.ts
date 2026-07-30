'use client'

import { useCallback, useSyncExternalStore } from 'react'

/**
 * Deliberately module state rather than storage: sound stays off until it is asked for on each
 * page load, so a visitor is never met by noise they enabled days ago.
 */
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

/** Snapshot for callers outside React, such as the procedural sound helpers */
export function isAudioEnabled() {
  return audioEnabled
}

function setAudioEnabled(enabled: boolean) {
  audioEnabled = enabled
  notifySubscribers()
}

/** Subscribes a component to the shared preference through useSyncExternalStore */
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
