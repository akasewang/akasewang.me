import { Suspense } from 'react'
import { getAllBlogPosts } from '@/lib/managers/blog-manager'
import { getBreadcrumbSchema } from '@/lib/json-ld'
import { SITE_URL } from '@/constants/constants'
import { Metadata } from 'next'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'
import { blogsSeoContent } from '@/data/content/seo-content'
import { blogsListingContent } from '@/data/content/blogs-content'
import { BlogTabs } from '@/components/blogs/blog-tabs'
import { PageLayout } from '@/components/layout/page-layout'

/** Statically generated metadata for the Blog listing page. */
export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: blogsSeoContent.title,
    description: blogsSeoContent.description,
    path: '/blogs',
    image: getOgImageUrl(blogsSeoContent.ogTitle, 'Blog'),
    imageAlt: blogsSeoContent.imageAlt,
  })
}

/**
 * Main Blog Listing Route.
 * Fetches all MDX posts server side and passes them to a client side Suspense boundary
 * to handle category filtering and URL search parameters without blocking the initial render.
 */
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
      footerText="If you've made it this far, you deserve a coffee. Or a nap."
      breadcrumb={breadcrumbJsonLd}
    >
      <Suspense fallback={null}>
        <BlogTabs allPosts={allPosts} />
      </Suspense>
    </PageLayout>
  )
}
