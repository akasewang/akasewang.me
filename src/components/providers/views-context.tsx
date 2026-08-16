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
 * Every storage call below is wrapped and its failure dropped. Storage can be turned off, full or
 * refused outright, and none of that should stop a count being shown, since it is only a cache.
 */

/** Versioned, so a change to the stored shape is ignored rather than read as the old one */
const CACHE_KEY = 'views-cache-all:v1'

/** How long stored counts are trusted before being asked for again */
const CACHE_DURATION = 5 * 60 * 1000

/**
 * How long a slug waits for company before being sent. A list mounts its cards together, so this
 * is what turns a page of counters into one request.
 */
const BATCH_DELAY = 50

function normalizeClientSlug(slug: string): string | null {
  const normalizedSlug = slug.trim()
  return normalizedSlug || null
}

/**
 * Mirrors the counts to storage so a return visit paints numbers immediately. Nulls are dropped,
 * being the marker for a count that could not be read, which is worth retrying rather than keeping.
 */
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

/**
 * Holds the view count for every slug on the page and hands it to whichever counters ask.
 *
 * Counters are scattered across a list, so asking one at a time would mean a request per card.
 * Instead each request joins a short queue and the whole queue goes out as one call, with counts
 * kept in storage so a page paints numbers before that call comes back.
 *
 * The sets below are refs rather than state because they gate the requests themselves, and a
 * render would come too late to stop a duplicate that has already been asked for.
 */
export function ViewsProvider({ children }: { children: ReactNode }) {
  const [viewsMap, setViewsMap] = useState<Record<string, number | null>>({})

  /** The same counts as the state, readable inside callbacks without making them depend on it */
  const viewsMapRef = useRef<Record<string, number | null>>({})

  /** Waiting to be asked for */
  const pendingSlugsRef = useRef<Set<string>>(new Set())

  /** Already in flight, so a second counter for the same slug does not ask again */
  const fetchingRef = useRef<Set<string>>(new Set())

  /** Mid increment, which keeps a double click from counting twice */
  const incrementingRef = useRef<Set<string>>(new Set())

  /** Counted once already, so revisiting a post in the same session does not count again */
  const countedThisSessionRef = useRef<Set<string>>(new Set())

  const batchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /** Writes to the ref, the state and storage together, so no reader sees a stale set of counts */
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
   * Queues slugs whose counts are not known yet and sends the queue as one call.
   *
   * Each new slug pushes the send back, so a list mounting its cards over several frames still
   * goes out as a single request once they have all arrived.
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

  /** Asks for one slug's count without counting a visit, which is what a read only counter wants */
  const requestView = useCallback(
    (slug: string) => {
      prefetchViews([slug])
    },
    [prefetchViews],
  )

  /**
   * The count for a slug. A number is the count, null means it could not be read and undefined
   * means it has not arrived yet, which is what a counter shows its skeleton for.
   */
  const getViews = useCallback(
    (slug: string): number | null | undefined => {
      const normalizedSlug = normalizeClientSlug(slug)
      return normalizedSlug ? viewsMap[normalizedSlug] : undefined
    },
    [viewsMap],
  )

  /**
   * Counts a visit, then shows the new total.
   *
   * A slug is only counted once per session, remembered both in this tab and in session storage so
   * a reload does not count again. The in flight set guards the gap before either has been written.
   */
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

/**
 * Reads the views store. Throws where the provider is missing, since a counter with nothing above
 * it would otherwise just never show a number and give no hint why.
 */
export function useViews() {
  const context = useContext(ViewsContext)
  if (!context) {
    throw new Error('useViews must be used within a ViewsProvider')
  }
  return context
}
