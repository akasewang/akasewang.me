import 'server-only'
import fs from 'node:fs/promises'
import path from 'node:path'
import { load as loadYaml } from 'js-yaml'
import { parseAnyDate } from '@/utils/utils'

interface MdxFileData {
  date: string | Date
  [key: string]: unknown
}

const SAFE_MDX_SLUG_REGEX = /^[a-z0-9][a-z0-9_-]*$/i
const FRONTMATTER_REGEX = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/

function isSafeMdxSlug(slug: string): boolean {
  return SAFE_MDX_SLUG_REGEX.test(slug)
}

function isFrontmatterData(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

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

export async function getMdxSlugs(baseDir: string) {
  try {
    const entries = await fs.readdir(/* turbopackIgnore: true */ baseDir, { withFileTypes: true })

    return entries
      .filter(
        (entry) => entry.isFile() && (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')),
      )
      .map((entry) => ({ slug: entry.name.replace(/\.mdx?$/, '') }))
      .filter(({ slug }) => isSafeMdxSlug(slug))
  } catch {
    return []
  }
}

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

export function sortMdxByDate<T extends { date: string | Date }>(posts: T[]): T[] {
  return posts
    .map((post) => ({
      post,
      time: parseAnyDate(post.date)?.getTime() || 0,
    }))
    .sort((a, b) => b.time - a.time)
    .map(({ post }) => post)
}
