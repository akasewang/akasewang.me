'use client'

import Link from 'next/link'
import { ViewCounter } from '@/components/common/view-counter'
import { NewTag } from '@/components/ui/new-tag'
import { SeparatorBullet } from '@/components/ui/separator-bullet'
import { formatDateString, isNew, cn } from '@/utils/utils'
import type { BlogPost } from '@/types/blog'

interface BlogPostCardProps {
  post: BlogPost
  className?: string
}

/** Blog Post Card Component. */
export function BlogPostCard({
  post: { title, slug, date, excerpt },
  className,
}: BlogPostCardProps) {
  return (
    <Link
      href={`/blogs/${slug}`}
      prefetch={false}
      className={cn(
        'group relative -mx-2 -my-1.5 flex flex-col rounded-xl ring-1 ring-transparent retina:ring-[0.5px] px-2 py-1.5 transition-[background-color,box-shadow,transform,scale] duration-300 ease-out hover:bg-accent hover:ring-accent-border hover:shadow-md active:scale-[0.99] active:duration-200 sm:-mx-3 sm:-my-2 sm:px-3 sm:py-2',
        className,
      )}
    >
      <article className="flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <h3 className="text-balance text-[15px] tracking-tight text-primary sm:text-base">
            {title}
            {isNew(date) && <NewTag className="ml-2 inline-flex align-middle" />}
          </h3>

          <div className="hidden sm:flex shrink-0 items-center font-mono tabular-nums text-[12.5px] text-muted-foreground mt-0.5">
            <time className="whitespace-nowrap">{formatDateString(date)}</time>
            <SeparatorBullet />
            <ViewCounter slug={slug} readOnly />
          </div>
        </div>

        <div className="flex sm:hidden items-center font-mono text-[11.5px] text-muted-foreground mt-1">
          <time className="whitespace-nowrap">{formatDateString(date)}</time>
          <SeparatorBullet />
          <ViewCounter slug={slug} readOnly />
        </div>

        {excerpt && (
          <p className="line-clamp-2 text-pretty text-sm leading-relaxed text-foreground mt-1">
            {excerpt}
          </p>
        )}
      </article>
    </Link>
  )
}
