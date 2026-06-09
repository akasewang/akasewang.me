import 'server-only'
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { parseAnyDate } from '@/utils/utils'

/**
 * Resolves the absolute file path for a markdown/MDX file given its slug and parent directory.
 * Checks for both `.mdx` and `.md` extensions automatically.
 *
 * @param baseDir - The absolute path to the directory containing the markdown files.
 * @param slug - The unique filename identifier (without extension).
 * @returns The absolute file path if found, or null.
 */
export async function resolveMdxFilePath(baseDir: string, slug: string): Promise<string | null> {
  for (const ext of ['.mdx', '.md']) {
    const p = path.join(/* turbopackIgnore: true */ baseDir, `${slug}${ext}`)
    try {
      await fs.access(/* turbopackIgnore: true */ p)
      return p
    } catch {}
  }

  return null
}

/**
 * Reads a directory and extracts a list of valid MDX/MD slugs.
 * Used for dynamic routing (like `generateStaticParams`).
 *
 * @param baseDir - The absolute path to the directory to scan.
 * @returns An array of objects containing the extracted `slug`.
 */
export async function getMdxSlugs(baseDir: string) {
  try {
    const entries = await fs.readdir(/* turbopackIgnore: true */ baseDir, { withFileTypes: true })

    return entries
      .filter(
        (entry) => entry.isFile() && (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')),
      )
      .map((entry) => ({ slug: entry.name.replace(/\.mdx?$/, '') }))
  } catch {
    return []
  }
}

/**
 * Reads an MDX file from disk and parses its gray-matter frontmatter alongside the content.
 * Automatically injects a fallback `date` if one is missing from the frontmatter.
 *
 * @param filePath - The absolute path to the markdown file.
 * @returns An object containing the raw `content` string and parsed `data` object.
 */
export async function readMdxFile(filePath: string) {
  const fileContent = await fs.readFile(/* turbopackIgnore: true */ filePath, 'utf8')
  const { content, data } = matter(fileContent)

  return {
    content,
    data: {
      ...data,
      date: data.date || new Date().toISOString(),
    },
  }
}

/**
 * Retrieves just the frontmatter metadata for an MDX file without processing its full content.
 * Ideal for rendering post lists or catalog grids efficiently.
 *
 * @param baseDir - The directory containing the file.
 * @param slug - The file slug.
 * @returns The parsed frontmatter data mixed with the slug, or null if unreadable.
 */
export async function getMdxFrontmatter(baseDir: string, slug: string) {
  try {
    const filePath = await resolveMdxFilePath(baseDir, slug)
    if (!filePath) return null

    const { data } = await readMdxFile(filePath)
    return { ...data, slug }
  } catch {
    return null
  }
}

/**
 * Sorts an array of objects chronologically based on their `date` property (newest first).
 * Uses a robust date parser to handle various date formats.
 *
 * @param posts - The array of objects (posts, projects, etc.) to sort.
 * @returns A new array sorted from newest to oldest.
 */
export function sortMdxByDate<T extends { date: string | Date }>(posts: T[]): T[] {
  return posts
    .map((post) => ({
      post,
      time: parseAnyDate(post.date)?.getTime() || 0,
    }))
    .sort((a, b) => b.time - a.time)
    .map(({ post }) => post)
}
