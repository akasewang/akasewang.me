import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ExperimentsContent } from '@/components/experiments/experiments-content'
import { PageLayout } from '@/components/layout/page-layout'
import { experimentsSeoContent } from '@/data/content/seo-content'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'

/** Statically generated metadata for the interactive Experiments page. */
export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: experimentsSeoContent.title,
    description: experimentsSeoContent.description,
    path: '/experiments',
    image: getOgImageUrl(experimentsSeoContent.ogTitle, 'Experiments'),
  })
}

/**
 * Main Experiments Route.
 * Renders the interactive bento grid inside a Suspense boundary, using the same full bleed wide
 * canvas as the photo gallery so the live sketches get the extra horizontal room they deserve.
 */
export default function ExperimentsPage() {
  return (
    <PageLayout
      animate={false}
      footerText="Experiments. Half of these probably shouldn't run in production."
      className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-screen w-screen overflow-hidden px-8 pb-12 pt-2 md:px-28 md:pt-12"
    >
      <Suspense fallback={null}>
        <ExperimentsContent />
      </Suspense>
    </PageLayout>
  )
}
