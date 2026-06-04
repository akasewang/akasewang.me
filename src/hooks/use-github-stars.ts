'use client'

import { useState, useEffect } from 'react'
import { USERNAME, SITE } from '@/constants/constants'

const CACHE_KEY = 'github_stars_cache'
const CACHE_TTL = 15 * 60 * 1000

/** Module-level variable to deduplicate simultaneous in-flight requests across components. */
let sharedFetchPromise: Promise<number | null> | null = null

/**
 * React hook to fetch and cache GitHub stars for the site's repository.
 * Utilizes a shared promise to prevent network spam if used in multiple components,
 * and localStorage to prevent rate-limiting across tabs and page navigations.
 * Includes strict Error Boundaries for incognito/privacy mode storage blocks.
 */
export function useGithubStars() {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchStars = async () => {
      /** 1. Attempt to read from cache first to avoid hitting GitHub API rate limits. */
      try {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const { count, timestamp } = JSON.parse(cached)
          if (Date.now() - timestamp < CACHE_TTL) {
            if (isMounted) setStars(count)
            return
          }
        }
      } catch {
        /** Silently ignore storage errors (e.g., Safari private mode, strict ad blockers). */
      }

      try {
        /** 2. If another component is already fetching, piggyback on that promise. */
        if (!sharedFetchPromise) {
          sharedFetchPromise = fetch(`https://api.github.com/repos/${USERNAME}/${SITE}`)
            .then((res) => {
              if (!res.ok) throw new Error('API limit or network error')
              return res.json()
            })
            .then((data) => {
              const count = data.stargazers_count
              if (typeof count === 'number') {
                try {
                  /** 3. Cache the result for future visits across all tabs. */
                  localStorage.setItem(CACHE_KEY, JSON.stringify({ count, timestamp: Date.now() }))
                } catch {
                  /** Silently ignore storage errors. */
                }

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

    /** Cleanup function to prevent setting state if the component unmounts before the promise resolves. */
    return () => {
      isMounted = false
    }
  }, [])

  /** Pre-format string variants so the UI components can remain strictly presentational. */
  const shortCount =
    stars !== null
      ? new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
          .format(stars)
          .toLowerCase()
      : null

  const fullCount = stars !== null ? new Intl.NumberFormat('en-US').format(stars) : null

  return { count: stars, shortCount, fullCount }
}
