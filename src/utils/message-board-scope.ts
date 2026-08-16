/**
 * The two kinds of page that carry a board of their own. Both are pages that exist here: a project
 * that sends readers to an external link generates no page, so it never reaches this.
 */
const BOARD_SCOPES = ['blogs', 'projects'] as const
export type BoardScope = (typeof BOARD_SCOPES)[number]

/**
 * A board's key, which is the page's own path. Namespacing by scope keeps a blog and a project that
 * happen to share a slug on separate boards, and makes a stored row readable at a glance.
 *
 * The site-wide board at /message-board is the one with no key at all, so its rows stay null.
 */
export function boardSlugFor(scope: BoardScope, slug: string): string {
  return `${scope}/${slug}`
}

/**
 * Splits a key back into its parts, or null where it is not one. Kept here beside the join so the
 * two cannot drift, and free of any content lookup so the client can use it too.
 */
export function parseBoardSlug(boardSlug: unknown): { scope: BoardScope; slug: string } | null {
  if (typeof boardSlug !== 'string') return null

  const separator = boardSlug.indexOf('/')
  if (separator === -1) return null

  const scope = boardSlug.slice(0, separator)
  const slug = boardSlug.slice(separator + 1)
  if (!slug) return null

  return BOARD_SCOPES.includes(scope as BoardScope) ? { scope: scope as BoardScope, slug } : null
}
