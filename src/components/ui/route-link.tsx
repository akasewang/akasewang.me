import NextLink from 'next/link'
import type { ComponentProps } from 'react'

/**
 * Next's link with the site's scrolling rule: a route change is left to the page transition, which
 * places the arriving page itself, while an anchor still scrolls or the jump to a heading does
 * nothing. Passing scroll overrides both.
 */
export function Link({ href, scroll, ...props }: ComponentProps<typeof NextLink>) {
  const isSamePageAnchor = typeof href === 'string' && href.startsWith('#')

  return <NextLink {...props} href={href} scroll={scroll ?? isSamePageAnchor} />
}
