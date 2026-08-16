'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { EmptyState } from '@/components/common/empty-state'
import {
  CHANGELOG_DAY_CLASS,
  CHANGELOG_HEADING_CLASS,
  CHANGELOG_MARK_CLASS,
  CHANGELOG_RAIL_CLASS,
  CHANGELOG_STUB_ABOVE,
  CHANGELOG_STUB_BELOW,
  CHANGELOG_STUB_CLASS,
} from '@/components/skeletons/changelog'
import { Bullet } from '@/components/ui/bullet'
import { ExpandToggle } from '@/components/ui/expand-toggle'
import { ExpandableContent } from '@/components/ui/expandable-content'
import { GradientAvatar } from '@/components/ui/gradient-avatar'
import { HoverHighlight } from '@/components/ui/hover-highlight'
import { Icons } from '@/components/ui/icons'
import { useExpandableRow } from '@/hooks/use-expandable-row'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import type { ChangelogCommit, ChangelogDay } from '@/types/changelog'
import { cn } from '@/utils/utils'

interface ChangelogTimelineProps {
  days: ChangelogDay[]
}

/** The colour the placeholder leaves out, this being the only thing the two of them differ on */
const MOBILE_STUB_CLASS = cn(CHANGELOG_STUB_CLASS, 'border-border')

/**
 * One commit: its subject, its hash and the body it expands to. The button covers the whole row so
 * anywhere on it toggles, with the hash taking the pointer back so it can still be followed.
 */
function CommitRow({ commit }: { commit: ChangelogCommit }) {
  const { isExpanded, handleToggle } = useExpandableRow()
  const { hoverCard, hoverLink, navigate: navigateSound } = useSoundEffects()

  return (
    <div>
      <div
        data-highlight-item
        className="group/card relative z-10 flex flex-col gap-1.5 rounded-xl px-2 py-1.5 transition-[transform,scale] duration-300 ease-out active:scale-[0.99] active:duration-200 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:px-3 sm:py-2"
      >
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${commit.subject}`}
          onClick={handleToggle}
          onMouseEnter={hoverCard}
          className="absolute inset-0 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <h3 className="pointer-events-none relative z-10 min-w-0 flex-1 text-balance pr-8 text-sm font-normal text-primary sm:pr-0">
          {commit.subject}
        </h3>

        <div className="pointer-events-none relative z-10 flex items-center gap-3 font-mono text-xs-plus text-muted-foreground sm:shrink-0 sm:pt-px">
          <a
            href={commit.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View commit ${commit.shortSha} on GitHub`}
            onMouseEnter={hoverLink}
            onClick={navigateSound}
            className="pointer-events-auto transition-colors duration-300 supports-hover:hover:text-primary active:text-primary"
          >
            {commit.shortSha}
          </a>
          <ExpandToggle
            isExpanded={isExpanded}
            className="absolute right-2 top-2 text-muted-foreground transition-colors duration-300 supports-hover:group-hover/card:text-primary group-active/card:text-primary sm:static"
          />
        </div>
      </div>

      <ExpandableContent isExpanded={isExpanded}>
        <div className="flex flex-col gap-1.5 px-2 pb-2 pt-1 text-sm leading-relaxed text-foreground sm:px-3">
          {commit.body.map((block, index) => {
            /** An empty block is the blank line the message had, kept as a gap */
            if (!block) {
              return <div key={`${commit.sha}-${index}`} aria-hidden />
            }

            const isBullet = block.startsWith('- ') || block.startsWith('* ')
            const content = isBullet ? block.slice(2).trim() : block

            return (
              <div key={`${commit.sha}-${index}`} className="flex items-start gap-3">
                {isBullet && (
                  <div className="flex w-5 shrink-0 justify-center">
                    <Bullet className="mt-2.25" />
                  </div>
                )}
                <p className="flex-1 text-pretty whitespace-pre-wrap">{content}</p>
              </div>
            )
          })}

          <div className="flex items-center gap-2 font-mono text-xs-plus text-muted-foreground">
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
                  className="font-medium text-secondary transition-colors duration-300 supports-hover:hover:text-primary active:text-primary"
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

/** Commits to this site, grouped under the day they landed */
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
          <div key={day.date} className={CHANGELOG_DAY_CLASS}>
            {/**
             * The rail down the side, drawn per day rather than once. The first starts below its
             * own mark and the last turns a corner, so the line begins and ends deliberately.
             */}
            <div
              aria-hidden
              className={cn(
                CHANGELOG_RAIL_CLASS,
                'border-border',
                isFirst ? 'top-3' : 'top-0',
                isLast && 'w-4 border-b retina:border-b-[0.5px]',
              )}
            />

            <div className={cn(CHANGELOG_MARK_CLASS, 'text-muted-foreground')}>
              <Icons.gitCommit className="size-5" />
            </div>

            <h2
              className={cn(
                CHANGELOG_HEADING_CLASS,
                'font-mono text-xs-plus text-muted-foreground',
              )}
            >
              <span className="relative inline-flex sm:hidden">
                {!isFirst && (
                  <span aria-hidden className={cn(MOBILE_STUB_CLASS, CHANGELOG_STUB_ABOVE)} />
                )}
                <Icons.gitCommit className="size-5" />
                <span aria-hidden className={cn(MOBILE_STUB_CLASS, CHANGELOG_STUB_BELOW)} />
              </span>
              Commits on {day.label}
            </h2>

            <div className="-mx-2 mt-4 sm:-mx-3 sm:mt-1">
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
