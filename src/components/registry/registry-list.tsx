'use client'

import { m, LazyMotion, domMax, AnimatePresence } from 'framer-motion'
import { ComponentCard } from './component-card'
import type { RegistryItem } from '@/types/registry'
import { SPRING_TRANSITION } from '@/constants/ui'
import { EmptyState } from '@/components/common/empty-state'

interface RegistryListProps {
  components: RegistryItem[]
}

/**
 * @param components - Array of registry items to be rendered as cards.
 */

export function RegistryList({ components }: RegistryListProps) {
  return (
    <LazyMotion features={domMax}>
      <div className="flex flex-col gap-2">
        {/* Use popLayout so exiting elements are immediately removed from document flow to prevent jumpy layout shifts during filtering */}
        <AnimatePresence mode="popLayout">
          {components.length > 0 ? (
            components.map((item, index) => (
              <m.div
                key={item.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ ...SPRING_TRANSITION, delay: index * 0.05 }}
              >
                <ComponentCard item={item} />
              </m.div>
            ))
          ) : (
            <EmptyState key="no-components" message="no components found matching your criteria." />
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  )
}
