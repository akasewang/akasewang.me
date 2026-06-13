import 'server-only'
import { cache } from 'react'
import {
  getMdxFrontmatter,
  getMdxSlugs,
  readMdxFile,
  resolveMdxFilePath,
  sortMdxByDate,
} from '@/utils/mdx-utils'

/**
 * Factory function that creates strongly typed content managers (for blogs and projects).
 * Abstracts away the boilerplate of reading MDX files, parsing frontmatter and sorting by date.
 *
 * @param directory - The absolute, statically scoped directory containing the MDX files.
 * @param entityName - The singular name of the entity for error logging (e.g., 'blog', 'project').
 * @returns An object with `getSlugs`, `getPost` and `getAll` methods.
 */
export function createMdxManager<T extends { date: string }>(
  directory: string,
  entityName: string,
) {
  /** Lists the slugs of every MDX document in the directory (for static params). */
  const getSlugs = async () => {
    return getMdxSlugs(directory)
  }

  /**
   * Retrieves a single parsed MDX document by its slug.
   * Wrapped in React `cache()` to deduplicate identical reads across multiple components during a single server render pass.
   */
  const getPost = cache(async (slug: string) => {
    try {
      const filePath = await resolveMdxFilePath(directory, slug)
      if (!filePath) return null

      const { content, data } = await readMdxFile(filePath)

      return {
        content,
        data: { ...data, slug } as unknown as T,
      }
    } catch (error) {
      const code =
        typeof error === 'object' && error !== null && 'code' in error
          ? (error as { code?: unknown }).code
          : undefined

      if (code !== 'ENOENT') {
        console.error(`Error fetching ${entityName} [${slug}]:`, error)
      }
      return null
    }
  })

  /**
   * Retrieves all MDX documents in the directory, parses their frontmatter and sorts them chronologically.
   * Wrapped in React `cache()` to optimize aggressive parallel data fetching (e.g., in `Promise.all` on the Home page).
   */
  const getAll = cache(async (): Promise<T[]> => {
    try {
      const slugs = await getSlugs()
      const posts = await Promise.all(slugs.map(({ slug }) => getMdxFrontmatter(directory, slug)))

      const validPosts = posts.filter(Boolean) as unknown as T[]
      return sortMdxByDate(validPosts)
    } catch (error) {
      console.error(`Error fetching all ${entityName}s:`, error)
      return []
    }
  })

  return { getSlugs, getPost, getAll }
}
