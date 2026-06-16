import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { AsideTOC } from '@/components/common/mdx-components/aside-toc'
import { MDX_COMPONENTS, MDX_OPTIONS } from '@/components/common/mdx-components/mdx-config'
import { MdxFooter } from '@/components/common/mdx-components/mdx-footer'
import { MdxPostHeader } from '@/components/common/mdx-components/mdx-post-header'
import { LinkText } from '@/components/ui/link-text'
import { SeparatorSlash } from '@/components/ui/separator-slash'
import { FULL_NAME, SITE_URL } from '@/constants/constants'
import { getBlogPostingSchema, getBreadcrumbSchema } from '@/lib/json-ld'
import { getAllBlogPosts, getBlogPost, getBlogSlugs } from '@/lib/managers/blog-manager'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'

export async function generateStaticParams() {
  return getBlogSlugs()
}

type PageParams = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
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

export default async function BlogPost({ params }: { params: PageParams }) {
  const { slug } = await params
  const post = await getBlogPost(slug)

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

        <MdxPostHeader
          title={title}
          date={date}
          slug={postSlug}
          content={content}
          prev={prevPost ? { slug: prevPost.slug, title: prevPost.title } : undefined}
          next={nextPost ? { slug: nextPost.slug, title: nextPost.title } : undefined}
          basePath="/blogs"
          url={`${SITE_URL}/blogs/${postSlug}`}
        />

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
