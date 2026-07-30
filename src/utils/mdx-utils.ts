import 'server-only'
import fs from 'node:fs/promises'
import path from 'node:path'
import { load as loadYaml } from 'js-yaml'
import { parseAnyDate } from '@/utils/utils'

interface MdxFileData {
  date: string | Date
  [key: string]: unknown
}

/** Slugs come from the URL, so only plain names are allowed anywhere near the filesystem */
const SAFE_MDX_SLUG_REGEX = /^[a-z0-9][a-z0-9_-]*$/i
const FRONTMATTER_REGEX = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/

function isSafeMdxSlug(slug: string): boolean {
  return SAFE_MDX_SLUG_REGEX.test(slug)
}

function isFrontmatterData(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Splits the YAML block off the top of a file. A leading byte order mark is stripped first,
 * because it would otherwise sit in front of the opening fence and hide it.
 */
function parseFrontmatter(fileContent: string): { content: string; data: Record<string, unknown> } {
  const normalizedContent = fileContent.replace(/^\uFEFF/, '')
  const match = normalizedContent.match(FRONTMATTER_REGEX)

  if (!match) {
    return { content: normalizedContent, data: {} }
  }

  const parsed = loadYaml(match[1])

  return {
    content: normalizedContent.slice(match[0].length),
    data: isFrontmatterData(parsed) ? parsed : {},
  }
}

/**
 * Resolves a slug to a real file, or null. The slug is checked against the allowlist and the
 * resolved path is then confirmed to still sit inside the base directory, so neither traversal
 * nor an absolute path can reach outside the content folder.
 */
export async function resolveMdxFilePath(baseDir: string, slug: string): Promise<string | null> {
  const normalizedSlug = slug.trim()
  if (!isSafeMdxSlug(normalizedSlug)) return null

  const resolvedBaseDir = path.resolve(baseDir)

  for (const ext of ['.mdx', '.md']) {
    const p = path.resolve(/* turbopackIgnore: true */ resolvedBaseDir, `${normalizedSlug}${ext}`)
    const relativePath = path.relative(resolvedBaseDir, p)

    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) continue

    try {
      await fs.access(/* turbopackIgnore: true */ p)
      return p
    } catch {}
  }

  return null
}

/** Every readable slug in a directory, filtered by the same allowlist. Empty if it cannot be read */
export async function getMdxSlugs(baseDir: string) {
  try {
    const entries = await fs.readdir(/* turbopackIgnore: true */ baseDir, { withFileTypes: true })

    return entries.flatMap((entry) => {
      if (!entry.isFile() || (!entry.name.endsWith('.mdx') && !entry.name.endsWith('.md'))) {
        return []
      }

      const slug = entry.name.replace(/\.mdx?$/, '')
      return isSafeMdxSlug(slug) ? [{ slug }] : []
    })
  } catch {
    return []
  }
}

/** Reads a file and gives frontmatter a date, defaulting to now so sorting always has a value */
export async function readMdxFile(
  filePath: string,
): Promise<{ content: string; data: MdxFileData }> {
  const fileContent = await fs.readFile(/* turbopackIgnore: true */ filePath, 'utf8')
  const { content, data } = parseFrontmatter(fileContent)

  return {
    content,
    data: {
      ...data,
      date: data.date || new Date().toISOString(),
    } as MdxFileData,
  }
}

/**
 * Frontmatter for one slug with the slug folded in, or null for anything unreadable. Callers use
 * the null to answer notFound rather than having to catch.
 */
export async function getMdxFrontmatter<T extends { date: string | Date; slug: string }>(
  baseDir: string,
  slug: string,
): Promise<T | null> {
  try {
    const filePath = await resolveMdxFilePath(baseDir, slug)
    if (!filePath) return null

    const { data } = await readMdxFile(filePath)
    return { ...data, slug } as T
  } catch {
    return null
  }
}

/** Newest first. Dates that will not parse sort to the end rather than dropping out */
export function sortMdxByDate<T extends { date: string | Date }>(posts: T[]): T[] {
  return posts
    .map((post) => ({
      post,
      time: parseAnyDate(post.date)?.getTime() || 0,
    }))
    .sort((a, b) => b.time - a.time)
    .map(({ post }) => post)
}
