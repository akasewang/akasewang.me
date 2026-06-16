import type { Metadata } from 'next'
import { AdminNewsletterForm } from '@/components/admin/admin-newsletter-form'
import { PageLayout } from '@/components/layout/page-layout'
import { adminNewsletterContent } from '@/data/content/admin-content'
import { getAllBlogPosts } from '@/lib/managers/blog-manager'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

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
