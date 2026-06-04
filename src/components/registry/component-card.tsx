'use client'

import Link from 'next/link'
import { ViewCounter } from '@/components/common/view-counter'
import { NewTag } from '@/components/ui/new-tag'
import { SeparatorBullet } from '@/components/ui/separator-bullet'
import { formatDateString, isNew, cn } from '@/utils/utils'
import type { RegistryItem } from '@/types/registry'

/** Props for {@link ComponentCard}. */
interface ComponentCardProps {
  item: RegistryItem
  className?: string
}

/**
 * Displays metadata such as the component's name, description, release date, and view count.
 * Acts as a prefetching navigation link to the component's detailed documentation page.
 *
 * @param item - The registry item data containing slug, name, description, and date.
 * @param className - Optional CSS classes for custom container styling.
 */

/** from needlessly re-parsing these massive string literals on every single re-render of the list. */
const CARD_BASE_CLASSES =
  'group relative z-10 -mx-2 -my-1.5 flex flex-col rounded-xl px-2 py-1.5 transition-[transform,scale] duration-300 ease-out active:scale-[0.99] active:duration-200 sm:-mx-3 sm:-my-2 sm:px-3 sm:py-2'

export function ComponentCard({
  item: { name, slug, description, date },
  className,
}: ComponentCardProps) {
  return (
    /**
     * Disable default Next.js aggressive prefetching.
     * Fetching MDX documents for dozens of list items simultaneously wastes client bandwidth
     * and causes unnecessary server load for content they might never click.
     */
    <Link
      href={`/components/${slug}`}
      prefetch={false}
      data-highlight-item
      className={className ? cn(CARD_BASE_CLASSES, className) : CARD_BASE_CLASSES}
    >
      <article className="flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <h3 className="text-balance text-[15px] tracking-tight text-primary sm:text-base">
            {name}
            {isNew(date) && <NewTag className="ml-2 inline-flex align-middle" />}
          </h3>

          <div className="mt-1 flex items-center font-mono tabular-nums text-[11.5px] text-muted-foreground sm:mt-0.5 sm:shrink-0 sm:text-[12.5px]">
            {date && (
              <>
                <time className="whitespace-nowrap">{formatDateString(date)}</time>
                <SeparatorBullet />
              </>
            )}
            <ViewCounter slug={slug} readOnly />
          </div>
        </div>

        {description && (
          <p className="mt-1 line-clamp-2 text-pretty text-sm leading-relaxed text-foreground">
            {description}
          </p>
        )}
      </article>
    </Link>
  )
}
