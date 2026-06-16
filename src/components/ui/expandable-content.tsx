import type { ReactNode } from 'react'
import { cn } from '@/utils/utils'

interface ExpandableContentProps {
  isExpanded: boolean
  children: ReactNode
}

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
