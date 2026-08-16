import type { Metadata } from 'next'
import { Suspense } from 'react'
import { BlogTabs } from '@/components/blogs/blog-tabs'
import { PageLayout } from '@/components/layout/page-layout'
import { SITE_URL } from '@/constants/constants'
import { blogsListingContent } from '@/data/content/blogs-content'
import { blogsSeoContent } from '@/data/content/seo-content'
import { getBreadcrumbSchema } from '@/lib/json-ld'
import { getAllBlogPosts } from '@/lib/managers/blog-manager'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
  title: blogsSeoContent.title,
  description: blogsSeoContent.description,
  path: '/blogs',
  image: getOgImageUrl(blogsSeoContent.ogTitle, 'Blog'),
  imageAlt: blogsSeoContent.imageAlt,
})

/** the blogs listing, filtered and sorted in the browser */
export default async function BlogPage() {
  const allPosts = await getAllBlogPosts()

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Blogs', url: `${SITE_URL}/blogs` },
  ])

  return (
    <PageLayout
      title={blogsListingContent.title}
      subtitle={blogsListingContent.subtitle}
      footerText={blogsListingContent.footerText}
      breadcrumb={breadcrumbJsonLd}
    >
      <Suspense fallback={null}>
        <BlogTabs allPosts={allPosts} />
      </Suspense>
    </PageLayout>
  )
}
