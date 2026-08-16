import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { AsideTOC } from '@/components/common/mdx-components/aside-toc'
import { MDX_COMPONENTS, MDX_OPTIONS } from '@/components/common/mdx-components/mdx-config'
import { MdxFooter } from '@/components/common/mdx-components/mdx-footer'
import { MdxPostHeader } from '@/components/common/mdx-components/mdx-post-header'
import { MdxPostSummary } from '@/components/common/mdx-components/mdx-post-summary'
import { PostMessageBoard } from '@/components/message-board/post-message-board'
import { FULL_NAME, SITE_URL } from '@/constants/constants'
import { getBlogPostingSchema, getBreadcrumbSchema, serializeJsonLd } from '@/lib/json-ld'
import { getAllBlogPosts, getBlogPost, getBlogSlugs } from '@/lib/managers/blog-manager'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'
import { getAdjacentContent } from '@/utils/content-utils'

/** One page per post file, so every post is built ahead of any request for it */
export function generateStaticParams() {
  return getBlogSlugs()
}

type PageParams = Promise<{ slug: string }>

/** Read from the post's own frontmatter, so a card shared anywhere carries the post's own words */
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

/** A single post: its header, the MDX body and the contents alongside it */
export default async function BlogPost({ params }: { params: PageParams }) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) notFound()

  const { content, data } = post
  const { title, excerpt, date, slug: postSlug, links } = data

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

  /** The posts either side of this one, which the header turns into its back and forward controls */
  const allPosts = await getAllBlogPosts()
  const { previous: prevPost, next: nextPost } = getAdjacentContent(allPosts, postSlug)

  return (
    <div className="group/blog relative">
      <AsideTOC content={content} />
      <div className="relative space-y-6">
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

        <MdxPostSummary linkLabel="You can also read this post on" links={links} />

        <div className="mdx-content">
          <MDXRemote source={content} options={MDX_OPTIONS} components={MDX_COMPONENTS} />
        </div>

        <PostMessageBoard scope="blogs" slug={postSlug} />

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
