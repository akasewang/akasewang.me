import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CatalogList } from '@/components/catalog/catalog-list'
import { PageLayout } from '@/components/layout/page-layout'
import { SITE_URL } from '@/constants/constants'
import { catalogPageContent } from '@/data/content/catalog-content'
import { catalogSeoContent } from '@/data/content/seo-content'
import { getBreadcrumbSchema } from '@/lib/json-ld'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
  title: catalogSeoContent.title,
  description: catalogSeoContent.description,
  path: '/catalog',
  image: getOgImageUrl(catalogSeoContent.ogTitle, 'Catalog'),
  imageAlt: catalogSeoContent.imageAlt,
})

export default function CatalogPage() {
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Catalog', url: `${SITE_URL}/catalog` },
  ])

  return (
    <PageLayout
      title={catalogPageContent.title}
      subtitle={catalogPageContent.subtitle}
      footerText="That's a wrap. Now, what should I read or watch next?"
      breadcrumb={breadcrumbJsonLd}
    >
      <section>
        <Suspense fallback={null}>
          <CatalogList />
        </Suspense>
      </section>
    </PageLayout>
  )
}
