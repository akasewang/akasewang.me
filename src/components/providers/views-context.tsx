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

type ViewsCache = {
  views: Record<string, number>
  installs: Record<string, number>
  timestamp: number
}

/** Defines the public API for the view counting system. */
type ViewsContextType = {
  getViews: (slug: string) => number | null | undefined
  getInstalls: (slug: string) => number | null | undefined
  requestView: (slug: string) => void
  incrementViews: (slug: string) => Promise<void>
  prefetchViews: (slugs: string[]) => Promise<void>
}

const ViewsContext = createContext<ViewsContextType | null>(null)

const CACHE_KEY = 'views-cache-all'
const CACHE_DURATION = 5 * 60 * 1000
const BATCH_DELAY = 50

function syncCache(views: Record<string, number | null>, installs: Record<string, number | null>) {
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
        installs: filterNull(installs),
        timestamp: Date.now(),
      }),
    )
  } catch {}
}

/**
 * Context provider that manages view counts across the application.
 * Implements a batching strategy to group multiple view requests into a single API call.
 * preventing network spam when rendering large lists of items (e.g., the component registry).
 * Also caches view counts locally to optimize navigation.
 *
 * @param children - The React tree to wrap with the provider.
 */
export function ViewsProvider({ children }: { children: ReactNode }) {
  const [viewsMap, setViewsMap] = useState<Record<string, number | null>>({})
  const viewsMapRef = useRef<Record<string, number | null>>({})

  const [installsMap, setInstallsMap] = useState<Record<string, number | null>>({})
  const installsMapRef = useRef<Record<string, number | null>>({})

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
        setInstallsMap((prev) => {
          installsMapRef.current = { ...data.installs, ...prev }
          return installsMapRef.current
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

    const updateMaps = (
      fetchedViews?: Record<string, number> | null,
      fetchedInstalls?: Record<string, number> | null,
    ) => {
      const newViews = Object.fromEntries(slugs.map((s) => [s, fetchedViews?.[s] ?? null]))
      const newInstalls = Object.fromEntries(slugs.map((s) => [s, fetchedInstalls?.[s] ?? null]))

      setViewsMap((prev) => {
        viewsMapRef.current = { ...prev, ...newViews }
        return viewsMapRef.current
      })

      setInstallsMap((prev) => {
        installsMapRef.current = { ...prev, ...newInstalls }
        syncCache(viewsMapRef.current, installsMapRef.current)
        return installsMapRef.current
      })
    }

    try {
      const data = await getViewsBatchAction(slugs)
      updateMaps(data?.views, data?.installs)
    } catch (error) {
      console.error('Error fetching views:', error)
      updateMaps(null, null)
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

  const getInstalls = useCallback(
    (slug: string): number | null | undefined => installsMap[slug],
    [installsMap],
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
          syncCache(viewsMapRef.current, installsMapRef.current)
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
    () => ({ getViews, getInstalls, requestView, incrementViews, prefetchViews }),
    [getViews, getInstalls, requestView, incrementViews, prefetchViews],
  )

  return <ViewsContext.Provider value={contextValue}>{children}</ViewsContext.Provider>
}

/**
 * Hook to access the views context.
 * Provides methods for fetching, incrementing, and batching view count updates.
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
