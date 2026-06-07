import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/constants/constants'
import { getAllBlogPosts } from '@/lib/managers/blog-manager'
import { getAllProjects } from '@/lib/managers/project-manager'
import { getAllComponentDocs } from '@/lib/managers/component-manager'
import { photos } from '@/data/static/photos'
import { parseAnyDate } from '@/utils/utils'

/** Static, top level routes that always belong in the sitemap. */
const STATIC_PATHS = [
  '',
  '/projects',
  '/blogs',
  '/components',
  '/skills',
  '/catalog',
  '/photos',
  '/testimonials',
  '/message-board',
  '/newsletter',
] as const

/**
 * Builds absolute sitemap entries for a collection of MDX documents.
 * Resolves each document's `date` frontmatter into a `lastModified` timestamp, falling back to now.
 *
 * @param basePath - The route prefix for the collection (e.g. `/blogs`).
 * @param docs - The parsed documents, each carrying a `slug` and `date`.
 * @returns An array of sitemap entries for the collection.
 */
function toSitemapEntries(
  basePath: string,
  docs: { slug: string; date: string }[],
): MetadataRoute.Sitemap {
  return docs.map((doc) => ({
    url: `${SITE_URL}${basePath}/${doc.slug}`,
    lastModified: parseAnyDate(doc.date) ?? new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))
}

/**
 * Generates the site's XML sitemap at `/sitemap.xml`.
 * Combines the static top level routes with every dynamically generated blog, project and component page,
 * so search engines can discover and re-crawl the current content (replacing any stale index entries).
 *
 * @returns A Next.js sitemap descriptor consumed by the App Router.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects, components] = await Promise.all([
    getAllBlogPosts(),
    getAllProjects(),
    getAllComponentDocs(),
  ])

  const now = new Date()

  /** Absolute URLs of every gallery image, surfaced on the `/photos` entry for Google Images. */
  const photoImageUrls = photos.map((photo) => `${SITE_URL}${photo.url}`)

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.8,
    ...(path === '/photos' && photoImageUrls.length > 0 && { images: photoImageUrls }),
  }))

  return [
    ...staticEntries,
    ...toSitemapEntries('/blogs', posts),
    ...toSitemapEntries('/projects', projects),
    ...toSitemapEntries('/components', components),
  ]
}
