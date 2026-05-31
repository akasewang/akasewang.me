import { Suspense } from 'react'
import { PhotosContent } from '@/components/photos/photos-content'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'
import { Metadata } from 'next'
import { photosSeoContent } from '@/data/content/seo-content'

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
 * Renders the photo gallery inside a Suspense boundary to allow the image fetching
 */
export default function PhotosPage() {
  return (
    <Suspense>
      <PhotosContent />
    </Suspense>
  )
}
