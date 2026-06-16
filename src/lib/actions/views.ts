'use server'

import { inArray, sql } from 'drizzle-orm'
import { logContent } from '@/data/content/log-content'
import { db } from '@/lib/db/drizzle'
import { views } from '@/lib/db/schema'

const MAX_VIEW_SLUG_LENGTH = 128
const MAX_VIEW_BATCH_SIZE = 100

function normalizeViewSlug(slug: string): string | null {
  const normalizedSlug = slug.trim()
  if (!normalizedSlug || normalizedSlug.length > MAX_VIEW_SLUG_LENGTH) return null
  return normalizedSlug
}

export async function incrementViewAction(slug: string) {
  const normalizedSlug = normalizeViewSlug(slug)
  if (!normalizedSlug) return { views: null }

  try {
    const [result] = await db
      .insert(views)
      .values({ slug: normalizedSlug, count: 1 })
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

export async function getViewsBatchAction(slugs: string[]) {
  if (!slugs?.length) return { views: {} }
  const uniqueSlugs = [
    ...new Set(slugs.map(normalizeViewSlug).filter((slug): slug is string => slug !== null)),
  ].slice(0, MAX_VIEW_BATCH_SIZE)

  if (!uniqueSlugs.length) return { views: {} }

  try {
    const result = await db
      .select({
        slug: views.slug,
        count: views.count,
      })
      .from(views)
      .where(inArray(views.slug, uniqueSlugs))

    const viewsMap: Record<string, number> = Object.fromEntries(
      uniqueSlugs.map((slug) => [slug, 0]),
    )

    for (const row of result) {
      viewsMap[row.slug] = row.count
    }

    return { views: viewsMap }
  } catch (error) {
    console.error(logContent.view.batchFetchError, error)
    return { views: null }
  }
}
