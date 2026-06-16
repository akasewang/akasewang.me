import 'server-only'
import { cache } from 'react'
import {
  getMdxFrontmatter,
  getMdxSlugs,
  readMdxFile,
  resolveMdxFilePath,
  sortMdxByDate,
} from '@/utils/mdx-utils'

export function createMdxManager<T extends { date: string | Date; slug: string }>(
  directory: string,
  entityName: string,
) {
  const getSlugs = async () => {
    return getMdxSlugs(directory)
  }

  const getPost = cache(async (slug: string) => {
    try {
      const filePath = await resolveMdxFilePath(directory, slug)
      if (!filePath) return null

      const { content, data } = await readMdxFile(filePath)

      return {
        content,
        data: { ...data, slug } as T,
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

  const getAll = cache(async (): Promise<T[]> => {
    try {
      const slugs = await getSlugs()
      const posts: Array<T | null> = await Promise.all(
        slugs.map(({ slug }) => getMdxFrontmatter<T>(directory, slug)),
      )

      return sortMdxByDate(posts.filter((post): post is T => post !== null))
    } catch (error) {
      console.error(`Error fetching all ${entityName}s:`, error)
      return []
    }
  })

  return { getSlugs, getPost, getAll }
}
