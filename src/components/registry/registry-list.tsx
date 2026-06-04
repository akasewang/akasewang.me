'use client'

import { m, AnimatePresence } from 'framer-motion'
import { ComponentCard } from './component-card'
import type { RegistryItem } from '@/types/registry'
import { SPRING_TRANSITION } from '@/constants/ui'
import { EmptyState } from '@/components/common/empty-state'

interface RegistryListProps {
  components: RegistryItem[]
}

/**
 * Renders a staggered, animated list of registry component cards.
 * Uses Framer Motion's `AnimatePresence` with `mode="popLayout"` to ensure smooth
 * filtering transitions by instantly pulling exiting items out of the document flow,
 * preventing layout jumps. Heavily relies on the global `MotionProvider` for animation capabilities.
 *
 * @param components - Array of registry items to be rendered as cards.
 */
export function RegistryList({ components }: RegistryListProps) {
  return (
    <>
      <div className="flex flex-col gap-2">
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
            <m.div
              key="no-components"
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <EmptyState message="no components found matching your criteria." />
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
