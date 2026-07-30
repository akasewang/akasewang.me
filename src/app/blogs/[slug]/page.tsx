import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { AsideTOC } from '@/components/common/mdx-components/aside-toc'
import { MDX_COMPONENTS, MDX_OPTIONS } from '@/components/common/mdx-components/mdx-config'
import { MdxFooter } from '@/components/common/mdx-components/mdx-footer'
import { MdxPostHeader } from '@/components/common/mdx-components/mdx-post-header'
import { MdxPostSummary } from '@/components/common/mdx-components/mdx-post-summary'
import { FULL_NAME, SITE_URL } from '@/constants/constants'
import { getBlogPostingSchema, getBreadcrumbSchema, serializeJsonLd } from '@/lib/json-ld'
import { getAllBlogPosts, getBlogPost, getBlogSlugs } from '@/lib/managers/blog-manager'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'
import { getAdjacentContent } from '@/utils/content-utils'

export function generateStaticParams() {
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
  const { previous: prevPost, next: nextPost } = getAdjacentContent(allPosts, postSlug)

  return (
    <div className="group/blog">
      <AsideTOC content={content} />
      <div className="relative space-y-6 animate-page-simple">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd([blogPostJsonLd, breadcrumbJsonLd]),
          }}
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

        <MdxPostSummary
          excerpt={excerpt}
          linkLabel="You can also read this post on"
          links={links}
          keywords={tags}
        />

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
