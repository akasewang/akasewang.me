'use client'

import { memo, useMemo } from 'react'
import { Bullet } from '@/components/ui/bullet'
import { ExpandableContent } from '@/components/ui/expandable-content'
import { ExpandToggle } from '@/components/ui/expand-toggle'
import { LinkText } from '@/components/ui/link-text'
import { SeparatorDate } from '@/components/ui/separator-date'
import { SeparatorSlash } from '@/components/ui/separator-slash'
import { Tag } from '@/components/ui/tag'
import { useExpandableRow } from '@/hooks/use-expandable-row'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import type { TimelineItemProps } from '@/types/site'
import { renderWithLinks } from '@/utils/content-utils'
import { cn, formatDateString } from '@/utils/utils'

/**
 * Supports rendering markdown style links, lists and technological tags.
 *
 * @param id - A unique identifier for the timeline item, used for anchor scrolling.
 * @param title - The primary heading (e.g., job title or degree).
 * @param links - An optional array of navigational links to display below the title.
 * @param startDate - The starting date of the timeline entry.
 * @param endDate - The optional ending date of the timeline entry.
 * @param description - An array of strings representing the body text; dashed strings become bullets.
 * @param tech - An optional array of string tags representing technologies used.
 * @param defaultExpanded - Whether the body content is visible on initial load.
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
  const { isExpanded, handleClick, handleKeyDown } = useExpandableRow(defaultExpanded)
  const hasContent = !!description?.length
  const { hoverCard } = useSoundEffects()

  const parsedLines = useMemo(() => {
    if (!hasContent) return null

    const validLines = description.map((line) => line.trim()).filter(Boolean)
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
              <Bullet className="mt-[9px]" />
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
      <div className="flex-1 pr-8 sm:pr-0">
        <h3 className="text-balance font-normal text-primary">{title}</h3>

        {!!links?.length && (
          <div className="relative z-10 mt-0.5 flex w-fit flex-wrap items-center gap-y-1 text-sm text-muted-foreground">
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

      <div className="flex items-center justify-between sm:mt-0.5 sm:flex-col sm:items-end sm:gap-2">
        <div className="whitespace-nowrap font-mono text-[13px] text-muted-foreground">
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
            className="absolute right-2 top-2.5 text-muted-foreground transition-colors duration-300 group-hover/card:text-primary sm:static sm:-mr-1"
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
      {hasContent ? (
        /** biome-ignore lint/a11y/useSemanticElements: This expandable summary contains links, so a real button would nest interactive controls. */
        <div
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onMouseEnter={hoverCard}
          data-highlight-item
          className={itemSummaryClassName}
        >
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
        <div className="mt-3 flex flex-wrap gap-2 sm:mt-3.5">
          {tech.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      )}
    </div>
  )
})
