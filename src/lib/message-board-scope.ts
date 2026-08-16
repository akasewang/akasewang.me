import { getBlogSlugs } from '@/lib/managers/blog-manager'
import { getPageProjects } from '@/lib/managers/project-manager'
import { parseBoardSlug } from '@/utils/message-board-scope'

/**
 * Whether a board key names a page that actually exists. The key reaches the server from the client,
 * where anything can be sent, and without this a message could be filed against a page that was
 * never written, on a board no reader will ever open.
 *
 * Kept apart from the key helpers themselves, which the client also uses: reading the content
 * directory is server work and would follow those helpers into the browser bundle otherwise.
 */
export async function isKnownBoardSlug(boardSlug: unknown): Promise<boolean> {
  const parsed = parseBoardSlug(boardSlug)
  if (!parsed) return false

  const { scope, slug } = parsed

  if (scope === 'blogs') return (await getBlogSlugs()).some((post) => post.slug === slug)

  return (await getPageProjects()).some((project) => project.slug === slug)
}
