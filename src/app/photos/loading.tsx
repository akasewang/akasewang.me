import { PageLayout } from '@/components/layout/page-layout'
import { PHOTOS_PAGE_CLASS, PhotosSkeleton } from '@/components/skeletons/photos'
import { photosPageContent } from '@/data/content/photos-content'

/** Shown while the photos page loads, laid out to match it so nothing shifts when the real content arrives */
export default function Loading() {
  return (
    <PageLayout footerText={photosPageContent.footerText} className={PHOTOS_PAGE_CLASS}>
      <PhotosSkeleton />
    </PageLayout>
  )
}
