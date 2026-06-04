import { MdxFooter } from '@/components/common/mdx-components/mdx-footer'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { AsideTOC } from '@/components/common/mdx-components/aside-toc'
import { MDX_OPTIONS, MDX_COMPONENTS } from '@/components/common/mdx-components/mdx-config'
import { ViewCounter } from '@/components/common/view-counter'
import { SeparatorBullet } from '@/components/ui/separator-bullet'
import { SeparatorSlash } from '@/components/ui/separator-slash'
import { LinkText } from '@/components/ui/link-text'
import { getReadingTime, formatDateString } from '@/utils/utils'
import { getBlogPost, getBlogSlugs, getAllBlogPosts } from '@/lib/managers/blog-manager'
import { SlugNavigation } from '@/components/common/slug-navigation'
import { getBlogPostingSchema, getBreadcrumbSchema } from '@/lib/json-ld'
import { FULL_NAME, SITE_URL } from '@/constants/constants'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'

/**
 * Next.js static generation hook.
 * Pre-computes all possible blog post paths at build time for ultra-fast static delivery.
 */
export async function generateStaticParams() {
  return getBlogSlugs()
}

/** Resolved dynamic route params for a single blog post. */
export type paramsType = Promise<{ slug: string }>

/** Dynamically resolves Open Graph and SEO metadata based on the requested blog's MDX frontmatter. */
export async function generateMetadata({ params }: { params: paramsType }): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) notFound()

  return constructMetadata({
    title: `${post.data.title} - ${FULL_NAME}`,
    description: post.data.excerpt,
    path: `/blogs/${post.data.slug}`,
    image: getOgImageUrl(post.data.title, 'Blog'),
    imageAlt: post.data.title,
    type: 'article',
    publishedTime: post.data.date,
  })
}

/**
 * Server Component responsible for rendering an individual blog post.
 * Hydrates the MDX content, calculates next/prev navigation, and injects SEO schemas.
 */
export default async function BlogPost({ params }: { params: paramsType }) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  /** Trigger a Next.js 404 boundary if the requested post does not exist */
  if (!post) notFound()

  const { content, data } = post
  const { title, excerpt, date, slug: postSlug, tags, links } = data

  const blogPostJsonLd = getBlogPostingSchema({
    title,
    excerpt,
    date,
    slug: postSlug,
  })
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Blogs', url: `${SITE_URL}/blogs` },
    { name: title, url: `${SITE_URL}/blogs/${postSlug}` },
  ])

  /** Calculate adjacent posts for chronological next/prev reading navigation */
  const allPosts = await getAllBlogPosts()
  const currentIndex = allPosts.findIndex((p) => p.slug === postSlug)
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : undefined
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : undefined

  return (
    <div className="group/blog">
      <AsideTOC content={content} />
      <div className="relative space-y-6 animate-page-simple">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-balance font-serif text-2xl font-medium italic leading-snug text-primary">
              {title}
            </h1>

            <div className="flex items-center text-xs text-muted-foreground">
              <span>{formatDateString(date)}</span>
              <SeparatorBullet />
              <ViewCounter slug={postSlug} readOnly={false} />
              <SeparatorBullet />
              <span>{getReadingTime(content)} min read</span>
            </div>
          </div>

          <SlugNavigation
            prev={prevPost ? { slug: prevPost.slug, title: prevPost.title } : undefined}
            next={nextPost ? { slug: nextPost.slug, title: nextPost.title } : undefined}
            basePath="/blogs"
            content={content}
            url={`${SITE_URL}/blogs/${postSlug}`}
            title={title}
          />
        </div>

        <div className="space-y-2">
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{excerpt}</p>

          {links && links.length > 0 && (
            <div className="flex flex-wrap items-center text-sm leading-relaxed text-muted-foreground">
              <span className="mr-1">You can also read this post on</span>
              {links.map((link, i) => (
                <span key={`${link.url}-${i}`} className="flex items-center">
                  {i > 0 && <SeparatorSlash />}
                  <LinkText href={link.url}>{link.label}</LinkText>
                </span>
              ))}
              <span>.</span>
            </div>
          )}

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {tags.map((tag, i) => (
                <MDX_COMPONENTS.code key={`${tag}-${i}`}>{tag}</MDX_COMPONENTS.code>
              ))}
            </div>
          )}
        </div>

        <hr className="border-t border-border" />

        <div className="mdx-content">
          <MDXRemote source={content} options={MDX_OPTIONS} components={MDX_COMPONENTS} />
        </div>

        <MdxFooter
          url={`${SITE_URL}/blogs/${postSlug}`}
          title={title}
          quote="This is where the text ends and the thinking begins."
          backHref="/blogs"
        />
      </div>
    </div>
  )
}
