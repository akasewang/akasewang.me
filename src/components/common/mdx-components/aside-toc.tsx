'use client'

import { useMemo } from 'react'
import { Icons } from '@/components/ui/icons'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'
import { scrollToHeading, useActiveHeading } from './hooks/use-active-heading'
import { parseTocFromContent } from './utils/parse-toc'

interface AsideTOCProps {
  content?: string
  className?: string
}

export const AsideTOC = ({ content, className }: AsideTOCProps) => {
  const { select, hoverTick } = useSoundEffects()
  const items = useMemo(() => (content ? parseTocFromContent(content) : []), [content])
  const activeId = useActiveHeading(items)

  if (!items.length) return null

  return (
    <nav
      className={cn(
        'not-prose hidden xl:block fixed left-8 top-24 z-50 h-[calc(100vh-6rem)] w-56',
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        <Icons.menu className="size-[18px] text-muted-foreground transition-colors duration-300 supports-hover:hover:text-primary supports-hover:group-hover/blog:text-primary [@media(hover:none)]:text-primary" />
        <div className="flex flex-col gap-2.5 opacity-0 transition-opacity duration-300 ease-in-out supports-hover:hover:opacity-100 supports-hover:group-hover/blog:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100">
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
                    : 'text-muted-foreground supports-hover:group-hover:text-primary/90 group-active:text-primary/90',
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
