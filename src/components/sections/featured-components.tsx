'use client'

import { useMemo, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { m, AnimatePresence } from 'framer-motion'
import { ViewAll } from '@/components/ui/view-all'
import { ComponentCard } from '@/components/registry/component-card'
import { useViews } from '@/components/providers/views-context'
import { landingPageContent } from '@/data/content/landing-content'
import { SectionTitle } from '@/components/layout/section-title'
import { EmptyState } from '@/components/common/empty-state'
import { SPRING_TRANSITION } from '@/constants/ui'
import type { RegistryItem } from '@/types/registry'

interface FeaturedComponentsProps {
  components: RegistryItem[]
}

const { featuredComponents } = landingPageContent.sections

/**
 * Featured Components Section.
 * A dual-purpose component that renders a subset of registry components on the home page.
 * or acts as the full list on the main `/components` route.
 */
export function FeaturedComponents({ components }: FeaturedComponentsProps) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const { prefetchViews } = useViews()

  const displayed = useMemo(() => {
    return isHomePage ? components.slice(0, 3) : components
  }, [components, isHomePage])

  useEffect(() => {
    if (displayed.length > 0) {
      prefetchViews(displayed.map((c) => `component-${c.slug}`))
    }
  }, [displayed, prefetchViews])

  return (
    <section id="components" className="space-y-6 animate-page-simple">
      {isHomePage && <SectionTitle>{featuredComponents.title}</SectionTitle>}

      <AnimatePresence mode="popLayout">
        {displayed.length > 0 ? (
          <m.div key="component-list" layout className="space-y-4">
            {displayed.map((component) => (
              <m.div
                key={component.slug}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={SPRING_TRANSITION}
              >
                <ComponentCard item={component} />
              </m.div>
            ))}
          </m.div>
        ) : (
          <EmptyState key="no-components" message="no components found." />
        )}
      </AnimatePresence>

      {isHomePage && <ViewAll href="/components" label={featuredComponents.viewAll} />}
    </section>
  )
}
