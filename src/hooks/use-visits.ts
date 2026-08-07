'use client'

import { useCallback } from 'react'
import { useViews } from '@/components/providers/views-context'

/**
 * What separates a visit tally from a page view tally.
 *
 * Both live in the same slug keyed table, and the colon is what keeps them apart. A content slug is
 * validated against `[a-z0-9][a-z0-9_-]*`, so it can never contain one, which means no project can
 * be named such that its visits and its views land on the same row. The two counts are therefore
 * separate rows that cannot reach each other, without a second table to keep in step.
 */
export const visitKey = (slug: string) => `visit:${slug}`

/**
 * Where an item's card count is kept, which depends on what the card does.
 *
 * One rule in one place, because every surface that touches a count has to agree with every other:
 * the listing prefetches it, sorting by count reads it and the counter renders it. If any of them
 * derived the key differently, a card would show one number while the sort ordered by another, or a
 * listing would warm a row nothing goes on to read. Content without an external link, which is
 * every blog post, is unaffected and keeps its plain slug.
 */
export const countKeyFor = ({ slug, external }: { slug: string; external?: string }) =>
  external ? visitKey(slug) : slug

/**
 * Counts a project being opened, for the projects that live somewhere else.
 *
 * A project that links away has no page here to be viewed, so a view count on its card would sit at
 * whatever it happened to reach and never move again. What can still be observed is the card being
 * taken up on, so that is what is counted instead.
 *
 * The whole of the views machinery is reused through the namespaced key: the once per session
 * guard, the shared cache and the failure handling all apply unchanged, so opening the same project
 * twice in one session counts once, exactly as re-reading a page does. Reading a visit count needs
 * nothing from here, since the counter renders through the same component views do.
 *
 * Recording is deliberately the card's job rather than the counter's. `VisitCounter` is read only,
 * because a card sitting in a listing has not been taken up on merely by being on screen: counting
 * it where it renders would tally the listing rather than the project.
 */
export function useVisits() {
  const { incrementViews } = useViews()

  const recordVisit = useCallback(
    (slug: string) => incrementViews(visitKey(slug)),
    [incrementViews],
  )

  return { recordVisit }
}
