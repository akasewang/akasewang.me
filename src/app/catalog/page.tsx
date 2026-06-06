import { Suspense } from 'react'
import { Metadata } from 'next'
import { CatalogList } from '@/components/catalog/catalog-list'
import { catalogPageContent } from '@/data/content/catalog-content'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'
import { PageLayout } from '@/components/layout/page-layout'
import { catalogSeoContent } from '@/data/content/seo-content'

/** Statically generated metadata for the Catalog (Bookmarks/Reading List) page. */
export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: catalogSeoContent.title,
    description: catalogSeoContent.description,
    path: '/catalog',
    image: getOgImageUrl(catalogSeoContent.ogTitle, 'Catalog'),
  })
}

/**
 * Main Catalog Route.
 * Renders the reading list and bookmarks using a client side Suspense boundary
 * to enable dynamic filtering via URL parameters without blocking the initial paint.
 */
export default function CatalogPage() {
  return (
    <PageLayout
      title={catalogPageContent.title}
      subtitle={catalogPageContent.subtitle}
      footerText="That's a wrap. Now, what should I read or watch next?"
    >
      <section>
        <Suspense fallback={null}>
          <CatalogList />
        </Suspense>
      </section>
    </PageLayout>
  )
}
