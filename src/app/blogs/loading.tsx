import { PageLayout } from '@/components/layout/page-layout'
import {
  SkeletonCategoryFilter,
  SkeletonPostList,
  SkeletonSearchRow,
} from '@/components/skeletons/shared'
import { blogsListingContent } from '@/data/content/blogs-content'

/** Shown while the blogs listing loads, laid out to match it so nothing shifts when the real content arrives */
export default function Loading() {
  return (
    <PageLayout
      title={blogsListingContent.title}
      subtitle={blogsListingContent.subtitle}
      footerText={blogsListingContent.footerText}
    >
      <div className="space-y-6">
        <div className="space-y-8">
          <SkeletonSearchRow />
          <SkeletonCategoryFilter widths={['w-12', 'w-24', 'w-20']} />
        </div>

        <SkeletonPostList rows={5} />
      </div>
    </PageLayout>
  )
}
