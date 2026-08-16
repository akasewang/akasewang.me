import { NAV_AXIS } from '@/constants/navigation'

/**
 * How one route change moves: along which axis, in which direction, and whether it is the first
 * load, which stays put because the loader is what covers it.
 */
export type PageTravel = {
  axis: 'x' | 'y'
  sign: 1 | -1
  opening: boolean
}

/** Where a path sits in the navbar's running order, matching a section and everything beneath it */
const sectionIndexOf = (path: string) =>
  NAV_AXIS.findIndex((route) =>
    route === '/' ? path === '/' : path === route || path.startsWith(`${route}/`),
  )

/** 0 for a section's own page, 1 for anything inside it, which is what makes going in feel deeper */
const depthOf = (path: string) => (NAV_AXIS.some((route) => route === path) ? 0 : 1)

/**
 * Works out which way the page should travel, so movement matches where the visitor went.
 *
 * Moving between sections travels sideways in navbar order. Moving into or out of a section
 * travels vertically. Between siblings, where paths alone cannot express content order, the
 * caller supplies the direction remembered by the control that initiated the navigation.
 */
export function resolvePageTravel(
  from: string | null,
  to: string,
  siblingDirection: 1 | -1 = to > (from ?? '') ? 1 : -1,
): PageTravel {
  if (from === null) return { axis: 'y', sign: -1, opening: true }

  const fromIndex = sectionIndexOf(from)
  const toIndex = sectionIndexOf(to)

  if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
    return { axis: 'x', sign: toIndex > fromIndex ? 1 : -1, opening: false }
  }

  const depthDelta = depthOf(to) - depthOf(from)
  if (depthDelta !== 0) {
    return { axis: 'y', sign: depthDelta > 0 ? 1 : -1, opening: false }
  }

  if (fromIndex !== -1 && fromIndex === toIndex) {
    return { axis: 'x', sign: siblingDirection, opening: false }
  }

  return { axis: 'x', sign: to > from ? 1 : -1, opening: false }
}
