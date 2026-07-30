'use client'

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { getViewsBatchAction, incrementViewAction } from '@/lib/actions/views'

type ViewsCache = {
  views: Record<string, number>
  timestamp: number
}

type ViewsContextType = {
  getViews: (slug: string) => number | null | undefined
  requestView: (slug: string) => void
  incrementViews: (slug: string) => Promise<void>
  prefetchViews: (slugs: string[]) => void
}

const ViewsContext = createContext<ViewsContextType | null>(null)

/**
 * View counts for every list and page on the site. A list of twenty cards would otherwise fire
 * twenty requests, so reads are collected for a moment and sent as one batch, then cached so
 * moving between pages does not ask again.
 *
 * A count reads as undefined while unknown and null once a read failed, which lets a card tell
 * loading apart from unavailable and simply omit the number in the second case.
 */
const CACHE_KEY = 'views-cache-all:v1'

const CACHE_DURATION = 5 * 60 * 1000

/** Long enough for a list to finish mounting and register every card, short enough to feel instant */
const BATCH_DELAY = 50

function normalizeClientSlug(slug: string): string | null {
  const normalizedSlug = slug.trim()
  return normalizedSlug || null
}

function syncCache(views: Record<string, number | null>) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        views: Object.fromEntries(Object.entries(views).filter(([, value]) => value !== null)),
        timestamp: Date.now(),
      }),
    )
  } catch {}
}

export function ViewsProvider({ children }: { children: ReactNode }) {
  const [viewsMap, setViewsMap] = useState<Record<string, number | null>>({})
  const viewsMapRef = useRef<Record<string, number | null>>({})

  const pendingSlugsRef = useRef<Set<string>>(new Set())
  const fetchingRef = useRef<Set<string>>(new Set())
  const incrementingRef = useRef<Set<string>>(new Set())
  const countedThisSessionRef = useRef<Set<string>>(new Set())
  const batchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const commitViews = useCallback((updates: Record<string, number | null>) => {
    const nextViews = { ...viewsMapRef.current, ...updates }
    viewsMapRef.current = nextViews
    setViewsMap(nextViews)
    syncCache(nextViews)
  }, [])

  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return

      /** Anything already in state wins, since it was read fresh from the server */
      const data = JSON.parse(cached) as ViewsCache
      if (Date.now() - data.timestamp < CACHE_DURATION) {
        const nextViews = { ...data.views, ...viewsMapRef.current }
        viewsMapRef.current = nextViews
        setViewsMap(nextViews)
      } else {
        try {
          localStorage.removeItem(CACHE_KEY)
        } catch {}
      }
    } catch {
      try {
        localStorage.removeItem(CACHE_KEY)
      } catch {}
    }
  }, [])

  useEffect(() => {
    return () => {
      if (batchTimeoutRef.current) clearTimeout(batchTimeoutRef.current)
    }
  }, [])

  /**
   * Every slug in the batch is written back, including the ones the server did not return, so a
   * missing count settles as null instead of being retried forever.
   */
  const fetchBatch = useCallback(
    async (slugs: string[]) => {
      if (!slugs.length) return

      slugs.forEach((slug) => {
        fetchingRef.current.add(slug)
      })

      const updateMap = (fetchedViews?: Record<string, number> | null) => {
        const newViews = Object.fromEntries(slugs.map((s) => [s, fetchedViews?.[s] ?? null]))

        commitViews(newViews)
      }

      try {
        const data = await getViewsBatchAction(slugs)
        updateMap(data?.views)
      } catch (error) {
        console.error('Error fetching views:', error)
        updateMap(null)
      } finally {
        slugs.forEach((slug) => {
          fetchingRef.current.delete(slug)
        })
      }
    },
    [commitViews],
  )

  /**
   * Queues slugs that are neither known nor already in flight, then restarts the batch window so
   * cards mounting one after another still land in a single request.
   */
  const prefetchViews = useCallback(
    (slugs: string[]) => {
      let hasNew = false
      for (const rawSlug of slugs) {
        const slug = normalizeClientSlug(rawSlug)
        if (
          slug &&
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
      prefetchViews([slug])
    },
    [prefetchViews],
  )

  const getViews = useCallback(
    (slug: string): number | null | undefined => {
      const normalizedSlug = normalizeClientSlug(slug)
      return normalizedSlug ? viewsMap[normalizedSlug] : undefined
    },
    [viewsMap],
  )

  const incrementViews = useCallback(
    async (rawSlug: string) => {
      const slug = normalizeClientSlug(rawSlug)
      if (!slug) return

      /**
       * Session storage is what stops a refresh counting twice, and it outlives this provider.
       * The ref covers the same tab in case storage is unavailable. Either way an already counted
       * page still reads the current number, it just does not add to it.
       */
      const sessionKey = `viewed-${encodeURIComponent(slug)}`
      let alreadyCounted = countedThisSessionRef.current.has(slug)

      try {
        alreadyCounted =
          alreadyCounted ||
          (typeof window !== 'undefined' && sessionStorage.getItem(sessionKey) === 'true')
      } catch {}

      if (alreadyCounted) {
        requestView(slug)
        return
      }

      if (incrementingRef.current.has(slug)) return
      incrementingRef.current.add(slug)

      try {
        const data = await incrementViewAction(slug)
        commitViews({ [slug]: data.views ?? null })

        if (data.views !== null && typeof window !== 'undefined') {
          countedThisSessionRef.current.add(slug)
          try {
            sessionStorage.setItem(sessionKey, 'true')
          } catch {}
        }
      } catch (error) {
        console.error('Error incrementing views:', error)
        commitViews({ [slug]: null })
      } finally {
        incrementingRef.current.delete(slug)
      }
    },
    [commitViews, requestView],
  )

  const contextValue = useMemo(
    () => ({ getViews, requestView, incrementViews, prefetchViews }),
    [getViews, requestView, incrementViews, prefetchViews],
  )

  return <ViewsContext.Provider value={contextValue}>{children}</ViewsContext.Provider>
}

/** Throws rather than returning null, since a silent zero would look like real data */
export function useViews() {
  const context = useContext(ViewsContext)
  if (!context) {
    throw new Error('useViews must be used within a ViewsProvider')
  }
  return context
}
