/**
 * Where the page sits after a route change.
 *
 * The browser restores scroll the instant the URL changes, and during a page transition that is
 * the wrong moment twice over. The page being left is still the one on screen, so the restore is
 * visible as a jump on content that is already animating away, and the document is still that
 * page's height, so a position further down than it reaches is clamped and the page it belongs to
 * arrives somewhere else entirely.
 *
 * Restoration is taken over here and spent once the incoming page is mounted, which is the only
 * moment the document measures what the position was saved against.
 */

/** Where each path was last left. A path seen more than once keeps only its most recent position */
const positions = new Map<string, number>()

let cameFromHistory = false
let pending: number | null = null
let currentPath = ''

/**
 * History also moves for anchors and query changes, which stay on the page and never reach a route
 * change to spend this on. Left to set regardless, that would sit here until some later journey
 * picked it up and returned to a position it had no business restoring, so only a move that
 * actually changes the path counts as coming back to something.
 */
const markCameFromHistory = () => {
  if (window.location.pathname === currentPath) return

  cameFromHistory = true
}

/**
 * Hands scroll restoration to this module and starts watching for history moves. Returns its own
 * teardown, so a caller can pass it straight to an effect.
 */
export function takeOverScrollRestoration() {
  if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'

  currentPath = window.location.pathname
  window.addEventListener('popstate', markCameFromHistory)

  return () => window.removeEventListener('popstate', markCameFromHistory)
}

/**
 * Records where the page being left was sitting and works out where the next one belongs. Has to
 * run while that page is still mounted, since the scroll read here is its own.
 *
 * Going back returns to wherever that path was left. Everything else is a page being opened rather
 * than returned to, and opens at the top.
 */
export function markRouteChange(from: string, to: string) {
  positions.set(from, window.scrollY)
  currentPath = to

  const isReturning = cameFromHistory
  cameFromHistory = false

  pending = isReturning ? (positions.get(to) ?? 0) : 0
}

/** Spent once the incoming page is mounted, so the document is its height and the target is real */
export function flushScrollReset() {
  if (pending === null) return

  const top = pending
  pending = null

  /** An anchor in the URL already named a place to be, so that one is left to win */
  if (window.location.hash) return

  window.scrollTo({ top, behavior: 'instant' })
}
