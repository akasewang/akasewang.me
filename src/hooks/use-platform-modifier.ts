'use client'

import { useSyncExternalStore } from 'react'
import { KEY_CAPS, type KeyCap } from '@/constants/keys'

/** The platform never changes while the page is open, so there is nothing to subscribe to */
function subscribe() {
  return () => {}
}

/** userAgentData where the browser has it, falling back to the older platform string */
function isApplePlatform() {
  if (typeof navigator === 'undefined') return false

  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
    navigator.platform ??
    ''

  return /mac|iphone|ipad|ipod/i.test(platform)
}

/**
 * The modifier key this visitor's machine uses for shortcuts, command on Apple and control
 * everywhere else.
 *
 * Read through useSyncExternalStore so the server and the first client render both answer control
 * and agree. The real platform is only known in the browser, so reading it during render would
 * hydrate a different key than the server sent.
 */
export function usePlatformModifier(): KeyCap {
  const isApple = useSyncExternalStore(
    subscribe,
    () => isApplePlatform(),
    () => false,
  )

  return isApple ? KEY_CAPS.command : KEY_CAPS.control
}
