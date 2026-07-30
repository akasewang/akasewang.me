import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ExperimentsContent } from '@/components/experiments/experiments-content'
import { PageLayout } from '@/components/layout/page-layout'
import { SITE_URL } from '@/constants/constants'
import { experimentsSeoContent } from '@/data/content/seo-content'
import { getBreadcrumbSchema } from '@/lib/json-ld'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
  title: experimentsSeoContent.title,
  description: experimentsSeoContent.description,
  path: '/experiments',
  image: getOgImageUrl(experimentsSeoContent.ogTitle, 'Experiments'),
  imageAlt: experimentsSeoContent.imageAlt,
})

export default function ExperimentsPage() {
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Experiments', url: `${SITE_URL}/experiments` },
  ])

  return (
    <PageLayout
      animate={false}
      footerText="Experiments. Half of these probably shouldn't run in production."
      breadcrumb={breadcrumbJsonLd}
      className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-screen w-screen overflow-hidden px-8 pb-12 pt-2 md:px-28 md:pt-12"
    >
      <h1 className="sr-only">experiments.</h1>
      <Suspense fallback={null}>
        <ExperimentsContent />
      </Suspense>
    </PageLayout>
  )
}
