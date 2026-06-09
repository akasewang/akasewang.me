import { Suspense } from 'react'
import { Metadata } from 'next'
import { ComponentTabs } from '@/components/registry/component-tabs'
import { getRegistryComponents } from '@/registry/registry-sync'
import { componentsPageContent } from '@/data/content/components-content'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'
import { PageLayout } from '@/components/layout/page-layout'
import { componentsSeoContent } from '@/data/content/seo-content'

/** Resolves static SEO metadata for the component registry listing page. */
export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: componentsSeoContent.title,
    description: componentsSeoContent.description,
    path: '/components',
    image: getOgImageUrl(componentsSeoContent.ogTitle, 'Components'),
  })
}

/**
 * Server Component for the component registry catalog.
 * Fetches the entire registry schema and passes it to the client side filtering tabs.
 */
export default async function ComponentsPage() {
  /** Await the dynamic registry sync to ensure we have the latest MDX definitions */
  const components = await getRegistryComponents()

  return (
    <PageLayout
      title={componentsPageContent.title}
      subtitle={componentsPageContent.subtitle}
      footerText="Feel free to copy and use these in your own projects."
    >
      {/** Suspend the Tabs component to allow Next.js to stream the page shell instantly while client hooks initialize. */}
      <Suspense fallback={null}>
        <ComponentTabs allComponents={components} />
      </Suspense>
    </PageLayout>
  )
}
