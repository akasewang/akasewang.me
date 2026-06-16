import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CatalogList } from '@/components/catalog/catalog-list'
import { PageLayout } from '@/components/layout/page-layout'
import { catalogPageContent } from '@/data/content/catalog-content'
import { catalogSeoContent } from '@/data/content/seo-content'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: catalogSeoContent.title,
    description: catalogSeoContent.description,
    path: '/catalog',
    image: getOgImageUrl(catalogSeoContent.ogTitle, 'Catalog'),
  })
}

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
