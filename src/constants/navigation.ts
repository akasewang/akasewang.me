/**
 * Single source of truth for the navbar running order. The navbar renders these links left to right
 * and the page transition slides along the same axis so a link's position in the bar decides which
 * way the next page arrives. Reorder here and both follow.
 */
export const NAV_ROUTES = ['/blogs', '/projects', '/photos'] as const

/** Derived, so nothing can name a nav route the bar does not actually have */
export type NavRoute = (typeof NAV_ROUTES)[number]

/**
 * The horizontal axis the page transition travels. The initials mark is pinned to the far left of
 * the bar so home anchors index 0 and every nav link sits to its right.
 */
export const NAV_AXIS = ['/', ...NAV_ROUTES] as const
