'use client'

import { createContext, useContext, useState } from 'react'

/**
 * True from the moment a navigation starts until the arriving page has finished sliding into place.
 *
 * A page slide is a transform on an ancestor of everything on the page, and a transform rebases the
 * two things content measures itself against: it becomes the containing block for fixed positioning,
 * and it drags every box through the viewport that observers and layout projection read from. So for
 * the length of the slide, anything that measures itself is measuring the animation instead of the
 * page. This is the signal to sit that out.
 */
export const PageArrivalContext = createContext(false)

export const usePageArriving = () => useContext(PageArrivalContext)

/**
 * Whether this component came in on a page slide. Captured once at mount rather than followed, so an
 * element that arrived with the page stays settled instead of animating itself the moment the slide
 * ends, which is the same double motion the flag exists to avoid.
 */
export const useArrivedWithPage = () => {
  const isArriving = usePageArriving()
  const [arrivedWithPage] = useState(isArriving)

  return arrivedWithPage
}
