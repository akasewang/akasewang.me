import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/utils'

/**
 * How far a placeholder sits above the page background.
 *
 * Four fixed steps, darkest to lightest: `panel` for large fills such as media and inputs, `muted`
 * for dates and meta lines, `base` for body text, `strong` for headings and titles. Picking a step
 * rather than an opacity keeps a heading heavier than the line beneath it on every page.
 */
type SkeletonTone = 'panel' | 'muted' | 'base' | 'strong'

const TONE_CLASS: Record<SkeletonTone, string> = {
  panel: 'bg-skeleton-panel',
  muted: 'bg-skeleton-muted',
  base: 'bg-skeleton',
  strong: 'bg-skeleton-strong',
}

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  tone?: SkeletonTone
}

/**
 * A placeholder block that pulses while the thing it stands for loads.
 *
 * `relative` comes from a utility class so a caller passing `absolute` overrides it, which the
 * pulse needs since it is drawn by a positioned pseudo element. Corners are nearly square by
 * default, so anything genuinely round such as an avatar or a card asks for its own radius.
 */
export function Skeleton({ className, tone = 'base', ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('relative rounded-sm animate-skeleton-pulse', TONE_CLASS[tone], className)}
      {...props}
    />
  )
}

/** Cycled rather than random, so the server and the browser draw the same paragraph */
const TEXT_LINE_WIDTHS = ['w-full', 'w-[93%]', 'w-[97%]', 'w-[89%]']

interface SkeletonTextProps {
  lines?: number
  tone?: SkeletonTone
  /** The short line that closes a paragraph, which is what makes the block read as prose */
  lastLineWidth?: string
  className?: string
}

/**
 * A run of lines standing in for a paragraph.
 *
 * A 3.5 line on a 2 gap comes to the height text-sm on leading-relaxed occupies, so a paragraph of
 * these leaves the block the height the words will need. Both sides are multiples of the same
 * spacing token, so the match holds wherever the interface scale puts them.
 */
export function SkeletonText({
  lines = 3,
  tone = 'base',
  lastLineWidth = 'w-3/5',
  className,
}: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          tone={tone}
          className={cn(
            'h-3.5',
            index === lines - 1 ? lastLineWidth : TEXT_LINE_WIDTHS[index % TEXT_LINE_WIDTHS.length],
          )}
        />
      ))}
    </div>
  )
}
