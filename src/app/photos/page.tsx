import { Suspense } from 'react'
import { PhotosContent } from '@/components/photos/photos-content'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'
import { Metadata } from 'next'
import { photosSeoContent } from '@/data/content/seo-content'
import { PageLayout } from '@/components/layout/page-layout'

/** Statically generated metadata for the Photography gallery page. */
export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: photosSeoContent.title,
    description: photosSeoContent.description,
    path: '/photos',
    image: getOgImageUrl(photosSeoContent.ogTitle, 'Photos'),
  })
}

/**
 * Main Photos Route.
 * Renders the photo gallery inside a Suspense boundary so image fetching and the
 * client-side gallery can stream in without blocking the initial paint.
 */
export default function PhotosPage() {
  return (
    <PageLayout
      animate={false}
      footerText="Taking photos so I don't have to remember things."
      className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-screen w-screen overflow-hidden px-8 pb-12 pt-2 md:px-28 md:pt-12"
    >
      <Suspense fallback={null}>
        <PhotosContent />
      </Suspense>
    </PageLayout>
  )
}
