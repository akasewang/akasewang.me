import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { PhotosContent } from '@/components/photos/photos-content'
import { SITE_URL } from '@/constants/constants'
import { photosSeoContent } from '@/data/content/seo-content'
import { getBreadcrumbSchema } from '@/lib/json-ld'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
  title: photosSeoContent.title,
  description: photosSeoContent.description,
  path: '/photos',
  image: getOgImageUrl(photosSeoContent.ogTitle, 'Photos'),
  imageAlt: photosSeoContent.imageAlt,
})

/** the photos page */
export default function PhotosPage() {
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Photos', url: `${SITE_URL}/photos` },
  ])

  return (
    <PageLayout
      footerText="Taking photos so I don't have to remember things."
      breadcrumb={breadcrumbJsonLd}
      className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-screen w-screen px-8 pb-12 pt-2 md:px-28 md:pt-12"
    >
      <h1 className="sr-only">photos.</h1>
      <Suspense fallback={null}>
        <PhotosContent />
      </Suspense>
    </PageLayout>
  )
}
