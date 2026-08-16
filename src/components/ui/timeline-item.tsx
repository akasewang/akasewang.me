'use client'

import { memo, useMemo } from 'react'
import { Bullet } from '@/components/ui/bullet'
import { ExpandToggle } from '@/components/ui/expand-toggle'
import { ExpandableContent } from '@/components/ui/expandable-content'
import { LinkText, renderWithLinks } from '@/components/ui/link-text'
import { SeparatorDate } from '@/components/ui/separator-date'
import { SeparatorSlash } from '@/components/ui/separator-slash'
import { Tag } from '@/components/ui/tag'
import { useExpandableRow } from '@/hooks/use-expandable-row'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import type { TimelineItemProps } from '@/types/site'
import { cn, formatDateString } from '@/utils/utils'

/**
 * One entry in a timeline, such as a job or a course, with its dates set to the side.
 *
 * An entry with a description expands to show it and reads as a control, while one without is
 * simply a heading and a date and stays inert.
 */
export const TimelineItem = memo(function TimelineItem({
  id,
  title,
  links,
  startDate,
  endDate,
  description,
  tech,
  defaultExpanded = false,
}: TimelineItemProps) {
  const { isExpanded, handleToggle } = useExpandableRow(defaultExpanded)
  const hasContent = !!description?.length
  const { hoverCard } = useSoundEffects()

  /**
   * The description, line by line. A line starting with a dash is a bullet and anything else is
   * numbered, so an entry can mix the two without saying which it is using. Repeated lines get a
   * counter appended to their key, since the text alone would collide.
   */
  const parsedLines = useMemo(() => {
    if (!hasContent) return null

    const validLines = description.flatMap((line) => {
      const trimmed = line.trim()
      return trimmed ? [trimmed] : []
    })
    if (!validLines.length) return null

    const lineKeyCounts = new Map<string, number>()

    return validLines.map((trimmed, i) => {
      const isBullet = trimmed.startsWith('-')
      const content = isBullet ? trimmed.slice(1).trim() : trimmed
      const keyCount = lineKeyCounts.get(trimmed) ?? 0
      const lineKey = keyCount ? `${trimmed}-${keyCount}` : trimmed
      lineKeyCounts.set(trimmed, keyCount + 1)

      return (
        <div key={lineKey} className="flex items-start gap-3">
          {isBullet ? (
            <div className="flex w-5 shrink-0 justify-center">
              <Bullet className="mt-2.25" />
            </div>
          ) : (
            <span className="mt-[3px] sm:mt-[2px] w-5 shrink-0 select-none font-mono text-xs font-medium text-muted-foreground">
              {(i + 1).toString().padStart(2, '0')}
            </span>
          )}
          <div className="flex-1">{renderWithLinks(content)}</div>
        </div>
      )
    })
  }, [description, hasContent])

  const itemSummary = (
    <>
      <div className={cn('flex-1 pr-8 sm:pr-0', hasContent && 'pointer-events-none relative z-10')}>
        <h3 className="text-balance font-normal text-primary">{title}</h3>

        {!!links?.length && (
          <div
            className={cn(
              'relative z-10 mt-0.5 flex w-fit flex-wrap items-center gap-y-1 text-sm text-muted-foreground',
              hasContent && 'pointer-events-auto',
            )}
          >
            {links.map((link, i) => (
              <div key={`${link.url}-${link.text}`} className="flex items-center">
                {i > 0 && <SeparatorSlash />}
                <div className="flex items-center gap-1.5">
                  {link.prefix && <span className="whitespace-nowrap">{link.prefix}</span>}
                  <LinkText href={link.url}>{link.text}</LinkText>
                  {link.suffix && <span className="whitespace-nowrap">{link.suffix}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className={cn(
          'flex items-center justify-between sm:mt-0.5 sm:flex-col sm:items-end sm:gap-2',
          hasContent && 'pointer-events-none z-10',
        )}
      >
        <div className="whitespace-nowrap font-mono text-xs-plus text-muted-foreground">
          {formatDateString(startDate)}
          {endDate && (
            <>
              <SeparatorDate />
              {formatDateString(endDate)}
            </>
          )}
        </div>

        {hasContent && (
          <ExpandToggle
            isExpanded={isExpanded}
            className="absolute right-2 top-2.5 text-muted-foreground transition-colors duration-300 supports-hover:group-hover/card:text-primary group-active/card:text-primary sm:static sm:-mr-1"
          />
        )}
      </div>
    </>
  )

  const itemSummaryClassName = cn(
    'group/card relative z-10 -mx-2 -my-1.5 flex flex-col gap-3 rounded-xl px-2 py-1.5 transition-[transform,scale] duration-300 ease-out sm:-mx-3 sm:-my-2 sm:flex-row sm:items-start sm:justify-between sm:px-3 sm:py-2',
    hasContent && 'active:scale-[0.99] active:duration-200',
  )

  return (
    <div id={id} className="scroll-mt-24">
      {/**
       * An expandable entry lays a button over the whole summary rather than wrapping it, so the
       * links inside stay clickable in their own right. That is what the pointer-events juggling
       * above is for: the summary ignores the pointer, the links take it back.
       */}
      {hasContent ? (
        <div data-highlight-item className={itemSummaryClassName}>
          <button
            type="button"
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${title}`}
            onClick={handleToggle}
            onMouseEnter={hoverCard}
            className="absolute inset-0 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {itemSummary}
        </div>
      ) : (
        <div className={itemSummaryClassName}>{itemSummary}</div>
      )}

      {parsedLines && (
        <ExpandableContent isExpanded={isExpanded}>
          <div className="space-y-1.5 text-pretty pt-2 text-sm leading-relaxed text-foreground sm:pt-3">
            {parsedLines}
          </div>
        </ExpandableContent>
      )}

      {!!tech?.length && (
        <div
          className={cn(
            'flex flex-wrap gap-2 transition-all duration-300 ease-in-out',
            isExpanded ? 'mt-2.5 sm:mt-3' : 'mt-3 sm:mt-3.5',
          )}
        >
          {tech.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      )}
    </div>
  )
})
