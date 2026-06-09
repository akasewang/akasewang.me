'use client'

import { useMemo } from 'react'
import { Icons } from '@/components/ui/icons'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'
import { scrollToHeading, useActiveHeading } from './hooks/use-active-heading'
import { parseTocFromContent } from './utils/parse-toc'

/** Props for {@link AsideTOC}. */
interface AsideTOCProps {
  content?: string
  className?: string
}

/**
 * Sidebar navigation component that dynamically generates and displays a Table of Contents (TOC).
 * Uses an IntersectionObserver hook to highlight the currently active heading as the user scrolls.
 * Only visible on large screens (xl breakpoint).
 *
 * @param content - The raw Markdown/MDX string content to parse for headings.
 * @param className - Optional CSS classes for custom container styling.
 */
export const AsideTOC = ({ content, className }: AsideTOCProps) => {
  const { select, hoverTick } = useSoundEffects()
  const items = useMemo(() => (content ? parseTocFromContent(content) : []), [content])
  const activeId = useActiveHeading(items)

  if (!items.length) return null

  return (
    <nav
      className={cn(
        'not-prose hidden xl:block fixed left-8 top-[calc(6rem_+_var(--banner-offset,0px))] z-50 h-[calc(100vh-6rem)] w-56 transition-[top] duration-300 ease-out',
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        <Icons.menu className="size-[18px] text-muted-foreground transition-colors duration-300 hover:text-primary group-hover/blog:text-primary" />
        <div className="flex flex-col gap-2.5 opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100 group-hover/blog:opacity-100">
          {items.map(({ id, level, text }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                select()
                scrollToHeading(id)
              }}
              onMouseEnter={hoverTick}
              className={cn('group block text-left', level > 2 && 'ml-6')}
            >
              <span
                className={cn(
                  'block truncate text-xs leading-tight tracking-tight transition-colors duration-200 ease-out',
                  activeId === id
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground group-hover:text-primary/90',
                )}
              >
                {text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
