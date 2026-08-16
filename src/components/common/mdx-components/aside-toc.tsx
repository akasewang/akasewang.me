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

/**
 * The table of contents in the margin, marking whichever heading is being read.
 *
 * Read out of the raw markdown rather than off the rendered page, so it is there before the body
 * has mounted. Wide screens only, since there is no margin to put it in below that.
 */
export const AsideTOC = ({ content, className }: AsideTOCProps) => {
  const { select, hoverTick } = useSoundEffects()
  const items = useMemo(() => (content ? parseTocFromContent(content) : []), [content])
  const activeId = useActiveHeading(items)

  if (!items.length) return null

  return (
    <div
      className={cn(
        'not-prose pointer-events-none absolute inset-y-0 z-50 hidden w-56 xl:block',
        className,
      )}
      /** Pulled out of the content column and over to the left edge of the window */
      style={{ left: 'calc(50% - 50vw + 2rem)' }}
    >
      {/**
       * Centred on the title's first line rather than level with the top of its box, which is half
       * the difference between that line's height and the mark's own. Read from the same tokens the
       * heading uses, so a change to the type scale carries through. Once stuck the offset is spent
       * and the mark rests at the sticky top, the title being long out of view by then.
       */}
      <nav
        className="pointer-events-auto sticky top-24 flex flex-col gap-4"
        style={{
          marginTop: 'calc((var(--text-2xl) * var(--leading-snug) - var(--spacing) * 4.5) / 2)',
        }}
      >
        {/** The list stays hidden behind this mark until the post is hovered, or always on touch */}
        <Icons.menu className="size-4.5 text-muted-foreground transition-colors duration-300 supports-hover:hover:text-primary supports-hover:group-hover/blog:text-primary [@media(hover:none)]:text-primary" />
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
      </nav>
    </div>
  )
}
