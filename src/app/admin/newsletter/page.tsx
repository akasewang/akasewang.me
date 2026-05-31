import { getAllBlogPosts } from '@/lib/managers/blog-manager'
import { AdminNewsletterForm } from '@/components/admin/admin-newsletter-form'
import { PageLayout } from '@/components/layout/page-layout'
import { adminNewsletterContent } from '@/data/content/admin-content'
import { Metadata } from 'next'

/**
 * Statically defined metadata for the Admin Newsletter page.
 * Strictly prevents search engine indexing and crawling to keep this route private.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

/**
 * Admin Newsletter Route.
 * Provides a UI to manually trigger newsletter dispatches for specific blog posts.
 * Note: Actual authentication is handled at the API route layer (`/api/newsletter/send`).
 */
export default async function AdminNewsletterPage() {
  const blogs = await getAllBlogPosts()

  return (
    <PageLayout
      title={adminNewsletterContent.title}
      subtitle={adminNewsletterContent.description}
      backButtonHref="/"
      className="max-w-2xl"
    >
      <AdminNewsletterForm blogs={blogs} />
    </PageLayout>
  )
}
