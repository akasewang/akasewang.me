import { getAllBlogPosts } from '@/lib/managers/blog-manager'
import { getAllProjects } from '@/lib/managers/project-manager'
import { photos } from '@/data/static/photos'
import { parseDate } from '@/utils/utils'
import { SITE_URL } from '@/constants/constants'

/** A single sitemap URL entry that may carry image children for Google Images. */
interface SitemapUrl {
  url: string
  lastModified: string
  priority: string
  changefreq: string
  images?: string[]
}

/**
 * Generates an XML Sitemap for search engine crawlers (Googlebot, Bingbot, etc.).
 * Dynamically aggregates all static routes, blog posts and projects so the
 * site's content stays accurately and freshly indexed. The photos page also lists its gallery
 * images via the image sitemap extension so they can surface in Google Images.
 *
 * @returns An XML Response containing the full URL set.
 */
export async function GET(): Promise<Response> {
  const [blogPosts, projectPosts] = await Promise.all([getAllBlogPosts(), getAllProjects()])

  const currentDate = new Date().toISOString()

  /** Absolute URLs of every gallery image surfaced on the `/photos` entry. */
  const photoImages = photos.map((photo) => `${SITE_URL}${photo.url}`)

  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'weekly' },
    { path: '/blogs', priority: '0.9', changefreq: 'daily' },
    { path: '/projects', priority: '0.8', changefreq: 'weekly' },
    { path: '/message-board', priority: '0.6', changefreq: 'monthly' },
    { path: '/newsletter', priority: '0.8', changefreq: 'monthly' },
    { path: '/photos', priority: '0.4', changefreq: 'monthly' },
    { path: '/experiments', priority: '0.5', changefreq: 'weekly' },
    { path: '/catalog', priority: '0.4', changefreq: 'monthly' },
    { path: '/skills', priority: '0.8', changefreq: 'monthly' },
    { path: '/testimonials', priority: '0.7', changefreq: 'monthly' },
    { path: '/changelog', priority: '0.6', changefreq: 'daily' },
  ]

  const urls: SitemapUrl[] = [
    ...staticPages.map(({ path, priority, changefreq }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: currentDate,
      priority,
      changefreq,
      ...(path === '/photos' && photoImages.length > 0 && { images: photoImages }),
    })),
    ...blogPosts.map((post) => ({
      url: `${SITE_URL}/blogs/${post.slug}`,
      lastModified: parseDate(post.date),
      priority: '0.8',
      changefreq: 'weekly',
    })),
    ...projectPosts.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: parseDate(project.date),
      priority: '0.8',
      changefreq: 'weekly',
    })),
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>${(page.images ?? [])
      .map(
        (image) => `\n    <image:image>\n      <image:loc>${image}</image:loc>\n    </image:image>`,
      )
      .join('')}
  </url>`,
  )
  .join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
