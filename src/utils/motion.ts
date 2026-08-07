/** Queried once and reused, since matchMedia is not free to call per pointer move */
let reduceMotionQuery: MediaQueryList | null = null

/**
 * Whether the reader has asked for less movement.
 *
 * The query object is cached rather than its answer. A MediaQueryList stays live, so matches keeps
 * reporting the current preference even if it changes mid session, and nothing has to subscribe to
 * find that out. Read at the moment of the gesture rather than held in state, since the answer is
 * only ever needed while one is already under way.
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false

  reduceMotionQuery ??= window.matchMedia('(prefers-reduced-motion: reduce)')
  return reduceMotionQuery.matches
}
