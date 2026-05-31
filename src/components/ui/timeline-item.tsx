'use client'

import { useState, useMemo, memo } from 'react'
import { LinkText } from '@/components/ui/link-text'
import { Tag } from '@/components/ui/tag'
import { ExpandToggle } from '@/components/ui/expand-toggle'
import { Bullet } from '@/components/ui/bullet'
import { SeparatorDate } from '@/components/ui/separator-date'
import { SeparatorSlash } from '@/components/ui/separator-slash'
import { renderWithLinks } from '@/utils/content-utils'
import { formatDateString, cn } from '@/utils/utils'
import type { TimelineItemProps } from '@/types/site'

/**
 * Supports rendering markdown-style links, lists, and technological tags.
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
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const hasContent = !!description?.length

  const parsedLines = useMemo(() => {
    if (!hasContent) return null

    const validLines = description.map((line) => line.trim()).filter(Boolean)
    if (!validLines.length) return null

    return validLines.map((trimmed, i) => {
      const isBullet = trimmed.startsWith('-')
      const content = isBullet ? trimmed.slice(1).trim() : trimmed

      return (
        <div key={i} className="flex items-start gap-3">
          {isBullet ? (
            <div className="flex w-5 shrink-0 justify-center">
              <Bullet className="mt-[9px]" />
            </div>
          ) : (
            <span className="mt-[1px] w-5 shrink-0 select-none font-mono text-[11px] font-medium text-muted-foreground">
              {(i + 1).toString().padStart(2, '0')}
            </span>
          )}
          <div className="flex-1">{renderWithLinks(content)}</div>
        </div>
      )
    })
  }, [description, hasContent])

  const handleToggle = () => setIsExpanded((prev) => !prev)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleToggle()
    }
  }

  const stopPropagation = (e: React.SyntheticEvent) => e.stopPropagation()

  return (
    <div id={id} className="scroll-mt-24">
      <div
        role={hasContent ? 'button' : undefined}
        tabIndex={hasContent ? 0 : undefined}
        aria-expanded={hasContent ? isExpanded : undefined}
        onClick={hasContent ? handleToggle : undefined}
        onKeyDown={hasContent ? handleKeyDown : undefined}
        className={cn(
          'group/card relative -mx-2 -my-1.5 flex flex-col gap-3 rounded-xl ring-1 ring-transparent retina:ring-[0.5px] px-2 py-1.5 transition-[background-color,box-shadow,transform,scale] duration-300 ease-out sm:-mx-3 sm:-my-2 sm:flex-row sm:items-start sm:justify-between sm:px-3 sm:py-2',
          hasContent &&
            'hover:bg-accent hover:ring-accent-border hover:shadow-md active:scale-[0.99] active:duration-200',
        )}
      >
        <div className="flex-1 pr-8 sm:pr-0">
          <h3 className="text-balance font-normal text-primary">{title}</h3>

          {!!links?.length && (
            <div
              className="relative z-10 mt-0.5 flex w-fit flex-wrap items-center gap-y-1 text-sm text-muted-foreground"
              onClick={stopPropagation}
              onPointerDown={stopPropagation}
            >
              {links.map((link, i) => (
                <div key={`${link.url}-${i}`} className="flex items-center">
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
      </div>

      {parsedLines && (
        <div
          className={cn(
            'grid transition-[grid-template-rows,opacity] duration-300 ease-in-out',
            isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
          aria-hidden={!isExpanded}
        >
          <div className="overflow-hidden">
            <div className="space-y-1.5 text-pretty pt-2 text-sm leading-relaxed text-foreground sm:pt-3">
              {parsedLines}
            </div>
          </div>
        </div>
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
