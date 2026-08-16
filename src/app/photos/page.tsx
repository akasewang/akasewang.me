import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageLayout } from '@/components/layout/page-layout'
import { PhotosContent } from '@/components/photos/photos-content'
import { PHOTOS_PAGE_CLASS } from '@/components/skeletons/photos'
import { SITE_URL } from '@/constants/constants'
import { photosPageContent } from '@/data/content/photos-content'
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
      footerText={photosPageContent.footerText}
      breadcrumb={breadcrumbJsonLd}
      className={PHOTOS_PAGE_CLASS}
    >
      <h1 className="sr-only">photos.</h1>
      <Suspense fallback={null}>
        <PhotosContent />
      </Suspense>
    </PageLayout>
  )
}
