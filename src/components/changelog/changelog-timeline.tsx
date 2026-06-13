'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { EmptyState } from '@/components/common/empty-state'
import { Bullet } from '@/components/ui/bullet'
import { ExpandableContent } from '@/components/ui/expandable-content'
import { ExpandToggle } from '@/components/ui/expand-toggle'
import { GradientAvatar } from '@/components/ui/gradient-avatar'
import { HoverHighlight } from '@/components/ui/hover-highlight'
import { Icons } from '@/components/ui/icons'
import { useExpandableRow } from '@/hooks/use-expandable-row'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import type { ChangelogCommit, ChangelogDay } from '@/types/changelog'
import { cn } from '@/utils/utils'

/** Props for {@link ChangelogTimeline}. */
interface ChangelogTimelineProps {
  days: ChangelogDay[]
}

/** Shared classes for the mobile marker's dashed connector stubs (flanking the icon). */
const MOBILE_STUB_CLASS =
  'absolute left-1/2 h-3 w-px -translate-x-1/2 border-l border-dashed border-border'

/**
 * A single expandable commit row. The whole row toggles a detail panel with the commit
 * body and an author line (avatar, profile link and timestamp). The short SHA in the
 * summary links to the commit on GitHub. On mobile the SHA stacks below the subject
 * (like the timeline date) with the toggle pinned to the top right corner.
 */
function CommitRow({ commit }: { commit: ChangelogCommit }) {
  const { isExpanded, handleClick, handleKeyDown } = useExpandableRow()
  const { hoverCard, hoverLink, navigate: navigateSound } = useSoundEffects()

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={hoverCard}
        data-highlight-item
        className="group/card relative z-10 flex flex-col gap-1.5 rounded-xl px-2 py-1.5 transition-[transform,scale] duration-300 ease-out active:scale-[0.99] active:duration-200 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:px-3 sm:py-2"
      >
        <h3 className="min-w-0 flex-1 text-balance pr-8 text-sm font-normal text-primary sm:pr-0">
          {commit.subject}
        </h3>

        <div className="flex items-center gap-3 font-mono text-[13px] text-muted-foreground sm:shrink-0 sm:pt-px">
          <a
            href={commit.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View commit ${commit.shortSha} on GitHub`}
            onMouseEnter={hoverLink}
            onClick={navigateSound}
            className="transition-colors duration-300 hover:text-primary"
          >
            {commit.shortSha}
          </a>
          <ExpandToggle
            isExpanded={isExpanded}
            className="absolute right-2 top-2 text-muted-foreground transition-colors duration-300 group-hover/card:text-primary sm:static"
          />
        </div>
      </div>

      <ExpandableContent isExpanded={isExpanded}>
        <div className="space-y-1.5 px-2 pb-2 pt-1 text-sm leading-relaxed text-foreground sm:px-3">
          {commit.body.map((line, index) => {
            const isBullet = line.startsWith('-')
            const content = isBullet ? line.slice(1).trim() : line

            return (
              <div key={`${commit.sha}-${index}`} className="flex items-start gap-3">
                {isBullet && (
                  <div className="flex w-5 shrink-0 justify-center">
                    <Bullet className="mt-[9px]" />
                  </div>
                )}
                <p className="flex-1 text-pretty">{content}</p>
              </div>
            )
          })}

          <div className="flex items-center gap-2 font-mono text-[13px] text-muted-foreground">
            {commit.authorAvatar ? (
              <Image
                src={commit.authorAvatar}
                alt={commit.authorName}
                width={32}
                height={32}
                className="size-4 shrink-0 rounded-full object-cover"
              />
            ) : (
              <GradientAvatar name={commit.authorName} size={16} />
            )}
            <span>
              {commit.authorUrl ? (
                <a
                  href={commit.authorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={hoverLink}
                  onClick={navigateSound}
                  className="font-medium text-secondary transition-colors duration-300 hover:text-primary"
                >
                  {commit.authorName}
                </a>
              ) : (
                <span className="font-medium text-secondary">{commit.authorName}</span>
              )}{' '}
              committed {commit.relativeTime} at {commit.time}
            </span>
          </div>
        </div>
      </ExpandableContent>
    </div>
  )
}

/**
 * Changelog Timeline.
 * Renders the site's commit history grouped by day. On desktop a dashed rail with commit
 * markers runs down the left of each group; on mobile the marker moves inline into the day
 * heading and the rail collapses to a short connector that only bridges the gap between
 * day groups, mirroring GitHub's responsive commit list. Rows are lit by the shared
 * {@link HoverHighlight} glide and expand in place to reveal the commit details.
 */
export function ChangelogTimeline({ days }: ChangelogTimelineProps) {
  const listRef = useRef<HTMLDivElement>(null)

  if (!days.length) {
    return (
      <EmptyState
        title="The log went quiet"
        message="GitHub is not handing over the commit history right now. Check back in a bit, the timeline rebuilds itself."
      />
    )
  }

  return (
    <div ref={listRef} className="relative">
      <HoverHighlight parentRef={listRef} />

      {days.map((day, index) => {
        const isFirst = index === 0
        const isLast = index === days.length - 1

        return (
          <div key={day.date} className="relative pb-3 last:pb-2 sm:pb-8 sm:pl-8 sm:last:pb-2">
            <div
              aria-hidden
              className={cn(
                'absolute bottom-0 left-[9.5px] hidden w-px border-l border-dashed border-border sm:block',
                isFirst ? 'top-3' : 'top-0',
                isLast && 'w-4 border-b',
              )}
            />

            <div className="absolute left-0 top-0.5 z-10 hidden bg-background text-muted-foreground sm:block">
              <Icons.gitCommit className="size-5" />
            </div>

            <h2 className="flex items-center gap-2 pt-0.5 font-mono text-[13px] text-muted-foreground">
              <span className="relative inline-flex sm:hidden">
                {!isFirst && (
                  <span
                    aria-hidden
                    className={cn(MOBILE_STUB_CLASS, 'bottom-[calc(50%_+_10px)]')}
                  />
                )}
                <Icons.gitCommit className="size-5" />
                <span aria-hidden className={cn(MOBILE_STUB_CLASS, 'top-[calc(50%_+_10px)]')} />
              </span>
              Commits on {day.label}
            </h2>

            <div className="-mx-2 mt-3 sm:-mx-3 sm:mt-2">
              {day.commits.map((commit) => (
                <CommitRow key={commit.sha} commit={commit} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
