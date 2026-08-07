import type { ReactNode } from 'react'
import { cn } from '@/utils/utils'

interface ExpandableContentProps {
  isExpanded: boolean
  children: ReactNode
}

/** Animates its own height between hidden and shown, for one row of a timeline */
export function ExpandableContent({ isExpanded, children }: ExpandableContentProps) {
  return (
    <div
      className={cn(
        'grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none',
        isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
      )}
      aria-hidden={!isExpanded}
      inert={!isExpanded}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  )
}
