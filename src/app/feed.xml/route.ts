import RSS from 'rss'
import { FULL_NAME, SITE_URL } from '@/constants/constants'
import { homeSeoContent } from '@/data/content/seo-content'
import { getAllBlogPosts } from '@/lib/managers/blog-manager'
import { getOgImageUrl } from '@/lib/metadata'
import type { BlogPost } from '@/types/blog'
import { parseDate } from '@/utils/utils'

/** The blog as RSS. Built through the rss package, so escaping and the envelope are handled */
export async function GET() {
  const feed = new RSS({
    title: `${FULL_NAME}'s Blog`,
    description: 'Web development insights and tutorials',
    site_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.xml`,
    language: 'en',
    generator: 'Next.js using RSS',
    pubDate: new Date(),
    copyright: `© ${new Date().getFullYear()} ${FULL_NAME}. All rights reserved.`,
    image_url: getOgImageUrl(homeSeoContent.ogTitle),
    webMaster: FULL_NAME,
  })

  try {
    const allPosts: BlogPost[] = await getAllBlogPosts()
    const blogPosts = allPosts

    blogPosts.forEach((post) => {
      feed.item({
        title: post.title,
        description: post.excerpt,
        url: `${SITE_URL}/blogs/${post.slug}`,
        date: parseDate(post.date),
        guid: post.slug,
        author: FULL_NAME,
        categories: post.type ? [post.type] : [],
      })
    })

    return new Response(feed.xml({ indent: true }), {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    })
  } catch {
    return new Response('Error generating feed', { status: 500 })
  }
}
