/** Queried once and reused, since matchMedia is not free to call per pointer move */
let reduceMotionQuery: MediaQueryList | null = null

function getReducedMotionQuery() {
  if (typeof window === 'undefined' || !window.matchMedia) return null
  reduceMotionQuery ??= window.matchMedia('(prefers-reduced-motion: reduce)')
  return reduceMotionQuery
}

/**
 * Whether the reader has asked for less movement.
 *
 * The query object is cached rather than its answer. A MediaQueryList stays live, so matches keeps
 * reporting the current preference even if it changes mid session, and nothing has to subscribe to
 * find that out. Read at the moment of the gesture rather than held in state, since the answer is
 * only ever needed while one is already under way.
 */
export function prefersReducedMotion() {
  return getReducedMotionQuery()?.matches ?? false
}

/** Keeps long-running canvas animation in sync when the OS preference changes mid-session. */
export function subscribeToReducedMotion(listener: (reduced: boolean) => void) {
  const query = getReducedMotionQuery()
  if (!query) return () => {}

  const handleChange = (event: MediaQueryListEvent) => listener(event.matches)
  query.addEventListener('change', handleChange)
  return () => query.removeEventListener('change', handleChange)
}
