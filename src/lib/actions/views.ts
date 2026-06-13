'use server'

import { inArray, sql } from 'drizzle-orm'
import { db } from '@/lib/db/drizzle'
import { views } from '@/lib/db/schema'
import { logContent } from '@/data/content/log-content'

/**
 * Server action that atomically increments the view count for a specific route slug.
 * Uses a Postgres upsert (`ON CONFLICT DO UPDATE`) operation to prevent race conditions.
 *
 * @param slug - The unique identifier/path of the page being viewed.
 * @returns An object containing the new total `views` count.
 */
export async function incrementViewAction(slug: string) {
  /** Abort if no slug is provided to prevent database errors */
  if (!slug) return { views: null }

  try {
    /**
     * Perform an atomic Postgres upsert. If the slug doesn't exist, insert it with count = 1.
     * If it exists, let the database engine increment the count to prevent race conditions.
     */
    const [result] = await db
      .insert(views)
      .values({ slug, count: 1 })
      .onConflictDoUpdate({
        target: views.slug,
        set: { count: sql`${views.count} + 1` },
      })
      .returning({ count: views.count })

    return { views: result?.count ?? 0 }
  } catch (error) {
    console.error(logContent.view.incrementError, error)
    return { views: null }
  }
}

/**
 * Server action to efficiently fetch the view counts for multiple route slugs in a single query.
 * Optimized for grid/list views where showing views for dozens of items at once is necessary.
 *
 * @param slugs - An array of unique page identifiers.
 * @returns A dictionary mapping each slug to its current view count.
 */
export async function getViewsBatchAction(slugs: string[]) {
  /** Return an empty map immediately if the array is empty to save a database call */
  if (!slugs?.length) return { views: {} }

  try {
    /** Fetch all requested slugs in a single IN clause for optimal performance */
    const result = await db
      .select({
        slug: views.slug,
        count: views.count,
      })
      .from(views)
      .where(inArray(views.slug, slugs))

    /** Prefill the map with 0 for all requested slugs to handle missing database rows gracefully */
    const viewsMap: Record<string, number> = Object.fromEntries(slugs.map((slug) => [slug, 0]))

    for (const row of result) {
      viewsMap[row.slug] = row.count
    }

    return { views: viewsMap }
  } catch (error) {
    console.error(logContent.view.batchFetchError, error)
    return { views: null }
  }
}
