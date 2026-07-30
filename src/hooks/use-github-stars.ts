'use client'

import { useEffect, useMemo, useState } from 'react'

const CACHE_KEY = 'github_stars_cache:v1'
const CACHE_TTL = 15 * 60 * 1000
const COMPACT_NUMBER_FORMATTER = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
const NUMBER_FORMATTER = new Intl.NumberFormat('en-US')

/** Module level, so several mounted components share one request instead of racing each other */
let sharedFetchPromise: Promise<number | null> | null = null

function isFreshCache(value: unknown): value is { count: number; timestamp: number } {
  if (!value || typeof value !== 'object') return false

  const cached = value as { count?: unknown; timestamp?: unknown }
  return (
    typeof cached.count === 'number' &&
    Number.isFinite(cached.count) &&
    typeof cached.timestamp === 'number' &&
    Date.now() - cached.timestamp < CACHE_TTL
  )
}

/**
 * Star count for display, from cache when it is still fresh and otherwise from the API route that
 * holds the token. Every failure path leaves the count null so the UI can simply omit it, since a
 * rate limited badge is not worth surfacing as an error.
 */
export function useGithubStars() {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchStars = async () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const parsedCache = JSON.parse(cached)
          if (isFreshCache(parsedCache)) {
            if (isMounted) setStars(parsedCache.count)
            return
          }
        }
      } catch {}

      try {
        if (!sharedFetchPromise) {
          sharedFetchPromise = fetch('/api/github-stars')
            .then((res) => {
              if (!res.ok) throw new Error('API limit or network error')
              return res.json()
            })
            .then((data) => {
              const count = data.count
              if (typeof count === 'number') {
                try {
                  localStorage.setItem(CACHE_KEY, JSON.stringify({ count, timestamp: Date.now() }))
                } catch {}

                return count
              }
              return null
            })
            .catch(() => null)
            .finally(() => {
              sharedFetchPromise = null
            })
        }

        const count = await sharedFetchPromise
        if (isMounted && count !== null) {
          setStars(count)
        }
      } catch {}
    }

    fetchStars()

    return () => {
      isMounted = false
    }
  }, [])

  const shortCount = useMemo(
    () => (stars !== null ? COMPACT_NUMBER_FORMATTER.format(stars).toLowerCase() : null),
    [stars],
  )

  const fullCount = useMemo(() => (stars !== null ? NUMBER_FORMATTER.format(stars) : null), [stars])

  return { count: stars, shortCount, fullCount }
}
