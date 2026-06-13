import type { ReactNode } from 'react'
import { cn } from '@/utils/utils'

/** Props for {@link ExpandableContent}. */
interface ExpandableContentProps {
  isExpanded: boolean
  children: ReactNode
}

/**
 * Collapsible wrapper that animates between zero and natural height via the CSS grid
 * `grid-template-rows` trick, fading in sync. Purely visual and controlled, pair it
 * with {@link useExpandableRow} for the toggle behavior.
 *
 * @param isExpanded - The external state controlling whether the content is visible.
 */
export function ExpandableContent({ isExpanded, children }: ExpandableContentProps) {
  return (
    <div
      className={cn(
        'grid transition-[grid-template-rows,opacity] duration-300 ease-in-out',
        isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
      )}
      aria-hidden={!isExpanded}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  )
}
