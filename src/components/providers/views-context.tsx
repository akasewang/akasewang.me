'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  type ReactNode,
} from 'react'
import { incrementViewAction, getViewsBatchAction } from '@/lib/actions/views'

/** Shape of the views snapshot persisted to localStorage. */
type ViewsCache = {
  views: Record<string, number>
  timestamp: number
}

/** Defines the public API for the view counting system. */
type ViewsContextType = {
  getViews: (slug: string) => number | null | undefined
  requestView: (slug: string) => void
  incrementViews: (slug: string) => Promise<void>
  prefetchViews: (slugs: string[]) => Promise<void>
}

const ViewsContext = createContext<ViewsContextType | null>(null)

const CACHE_KEY = 'views-cache-all'
/** How long a persisted cache stays valid (5 minutes). */
const CACHE_DURATION = 5 * 60 * 1000
/** Window for coalescing prefetch requests into a single batched API call (ms). */
const BATCH_DELAY = 50

/** Persists the current view counts to localStorage, stripping unresolved (null) entries. */
function syncCache(views: Record<string, number | null>) {
  if (typeof window === 'undefined') return
  try {
    const filterNull = (obj: Record<string, number | null>) =>
      Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null)) as Record<
        string,
        number
      >

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        views: filterNull(views),
        timestamp: Date.now(),
      }),
    )
  } catch {}
}

/**
 * Context provider that manages view counts across the application.
 * Implements a batching strategy to group multiple view requests into a single API call.
 * preventing network spam when rendering large lists of items (e.g., the blog list).
 * Also caches view counts locally to optimize navigation.
 *
 * @param children - The React tree to wrap with the provider.
 */
export function ViewsProvider({ children }: { children: ReactNode }) {
  const [viewsMap, setViewsMap] = useState<Record<string, number | null>>({})
  const viewsMapRef = useRef<Record<string, number | null>>({})

  const pendingSlugsRef = useRef<Set<string>>(new Set())
  const fetchingRef = useRef<Set<string>>(new Set())
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return

      const data = JSON.parse(cached) as ViewsCache
      if (Date.now() - data.timestamp < CACHE_DURATION) {
        setViewsMap((prev) => {
          viewsMapRef.current = { ...data.views, ...prev }
          return viewsMapRef.current
        })
      } else {
        localStorage.removeItem(CACHE_KEY)
      }
    } catch {
      localStorage.removeItem(CACHE_KEY)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (batchTimeoutRef.current) clearTimeout(batchTimeoutRef.current)
    }
  }, [])

  const fetchBatch = useCallback(async (slugs: string[]) => {
    if (!slugs.length) return

    slugs.forEach((slug) => fetchingRef.current.add(slug))

    const updateMap = (fetchedViews?: Record<string, number> | null) => {
      const newViews = Object.fromEntries(slugs.map((s) => [s, fetchedViews?.[s] ?? null]))

      setViewsMap((prev) => {
        viewsMapRef.current = { ...prev, ...newViews }
        syncCache(viewsMapRef.current)
        return viewsMapRef.current
      })
    }

    try {
      const data = await getViewsBatchAction(slugs)
      updateMap(data?.views)
    } catch (error) {
      console.error('Error fetching views:', error)
      updateMap(null)
    } finally {
      slugs.forEach((slug) => fetchingRef.current.delete(slug))
    }
  }, [])

  const prefetchViews = useCallback(
    async (slugs: string[]) => {
      let hasNew = false
      for (const slug of slugs) {
        if (
          !(slug in viewsMapRef.current) &&
          !fetchingRef.current.has(slug) &&
          !pendingSlugsRef.current.has(slug)
        ) {
          pendingSlugsRef.current.add(slug)
          hasNew = true
        }
      }

      if (!hasNew) return

      if (batchTimeoutRef.current) clearTimeout(batchTimeoutRef.current)

      batchTimeoutRef.current = setTimeout(() => {
        const slugsToFetch = Array.from(pendingSlugsRef.current)
        pendingSlugsRef.current.clear()
        if (slugsToFetch.length) fetchBatch(slugsToFetch)
      }, BATCH_DELAY)
    },
    [fetchBatch],
  )

  const requestView = useCallback(
    (slug: string) => {
      prefetchViews([slug]).catch(() => {})
    },
    [prefetchViews],
  )

  const getViews = useCallback(
    (slug: string): number | null | undefined => viewsMap[slug],
    [viewsMap],
  )

  const incrementViews = useCallback(
    async (slug: string) => {
      const sessionKey = `viewed-${slug}`

      if (typeof window !== 'undefined' && sessionStorage.getItem(sessionKey)) {
        requestView(slug)
        return
      }

      try {
        const data = await incrementViewAction(slug)
        setViewsMap((prev) => {
          viewsMapRef.current = { ...prev, [slug]: data.views ?? null }
          syncCache(viewsMapRef.current)
          return viewsMapRef.current
        })

        if (data.views !== null && typeof window !== 'undefined') {
          sessionStorage.setItem(sessionKey, 'true')
        }
      } catch (error) {
        console.error('Error incrementing views:', error)
      }
    },
    [requestView],
  )

  const contextValue = useMemo(
    () => ({ getViews, requestView, incrementViews, prefetchViews }),
    [getViews, requestView, incrementViews, prefetchViews],
  )

  return <ViewsContext.Provider value={contextValue}>{children}</ViewsContext.Provider>
}

/**
 * Hook to access the views context.
 * Provides methods for fetching, incrementing and batching view count updates.
 * Must be used within a `<ViewsProvider>`.
 *
 * @returns The context containing view management methods.
 */
export function useViews() {
  const context = useContext(ViewsContext)
  if (!context) {
    throw new Error('useViews must be used within a ViewsProvider')
  }
  return context
}
