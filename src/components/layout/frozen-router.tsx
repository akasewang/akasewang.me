'use client'

import { useIsPresent } from 'framer-motion'
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import {
  PathnameContext,
  PathParamsContext,
  SearchParamsContext,
} from 'next/dist/shared/lib/hooks-client-context.shared-runtime'
import { type ReactNode, useContext, useState } from 'react'

/**
 * Holds the outgoing page on the route it was rendered for while it animates away.
 *
 * Next swaps the router context the moment a navigation starts, so a page still on screen for its
 * exit would suddenly see the new route and render the new content mid animation. Once framer
 * marks this subtree as leaving, the last set of contexts is pinned and served to it until it
 * unmounts, so the page that is exiting stays the page the visitor was looking at.
 */
export function FrozenRouter({ children }: { children: ReactNode }) {
  const routerContext = useContext(LayoutRouterContext)
  const pathnameContext = useContext(PathnameContext)
  const searchParamsContext = useContext(SearchParamsContext)
  const pathParamsContext = useContext(PathParamsContext)
  const isPresent = useIsPresent()

  const [pinned, setPinned] = useState(() => ({
    router: routerContext,
    pathname: pathnameContext,
    searchParams: searchParamsContext,
    pathParams: pathParamsContext,
  }))

  if (
    isPresent &&
    (pinned.router !== routerContext ||
      pinned.pathname !== pathnameContext ||
      pinned.searchParams !== searchParamsContext ||
      pinned.pathParams !== pathParamsContext)
  ) {
    setPinned({
      router: routerContext,
      pathname: pathnameContext,
      searchParams: searchParamsContext,
      pathParams: pathParamsContext,
    })
  }

  const current = isPresent
    ? {
        router: routerContext,
        pathname: pathnameContext,
        searchParams: searchParamsContext,
        pathParams: pathParamsContext,
      }
    : pinned

  return (
    <LayoutRouterContext.Provider value={current.router}>
      <PathnameContext.Provider value={current.pathname}>
        <SearchParamsContext.Provider value={current.searchParams}>
          <PathParamsContext.Provider value={current.pathParams}>
            {children}
          </PathParamsContext.Provider>
        </SearchParamsContext.Provider>
      </PathnameContext.Provider>
    </LayoutRouterContext.Provider>
  )
}
