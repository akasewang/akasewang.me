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
  prefetchViews: (slugs: string[]) => Promise<void>
}

const ViewsContext = createContext<ViewsContextType | null>(null)

const CACHE_KEY = 'views-cache-all'

const CACHE_DURATION = 5 * 60 * 1000

const BATCH_DELAY = 50

function normalizeClientSlug(slug: string): string | null {
  const normalizedSlug = slug.trim()
  return normalizedSlug || null
}

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

export function ViewsProvider({ children }: { children: ReactNode }) {
  const [viewsMap, setViewsMap] = useState<Record<string, number | null>>({})
  const viewsMapRef = useRef<Record<string, number | null>>({})

  const pendingSlugsRef = useRef<Set<string>>(new Set())
  const fetchingRef = useRef<Set<string>>(new Set())
  const incrementingRef = useRef<Set<string>>(new Set())
  const countedThisSessionRef = useRef<Set<string>>(new Set())
  const batchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  const fetchBatch = useCallback(async (slugs: string[]) => {
    if (!slugs.length) return

    slugs.forEach((slug) => {
      fetchingRef.current.add(slug)
    })

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
      slugs.forEach((slug) => {
        fetchingRef.current.delete(slug)
      })
    }
  }, [])

  const prefetchViews = useCallback(
    async (slugs: string[]) => {
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
      prefetchViews([slug]).catch(() => {})
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
        setViewsMap((prev) => {
          viewsMapRef.current = { ...prev, [slug]: data.views ?? null }
          syncCache(viewsMapRef.current)
          return viewsMapRef.current
        })

        if (data.views !== null && typeof window !== 'undefined') {
          countedThisSessionRef.current.add(slug)
          try {
            sessionStorage.setItem(sessionKey, 'true')
          } catch {}
        }
      } catch (error) {
        console.error('Error incrementing views:', error)
        setViewsMap((prev) => {
          viewsMapRef.current = { ...prev, [slug]: null }
          syncCache(viewsMapRef.current)
          return viewsMapRef.current
        })
      } finally {
        incrementingRef.current.delete(slug)
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

export function useViews() {
  const context = useContext(ViewsContext)
  if (!context) {
    throw new Error('useViews must be used within a ViewsProvider')
  }
  return context
}
