'use client'

import { ViewCounter } from '@/components/common/view-counter'
import { Link } from '@/components/ui/route-link'
import { SeparatorBullet } from '@/components/ui/separator-bullet'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import type { BlogPost } from '@/types/blog'
import { cn, formatDateString } from '@/utils/utils'

interface BlogPostCardProps {
  post: BlogPost
  className?: string
}

/** One post in the listing: its title, date, view count and standfirst */
export function BlogPostCard({
  post: { title, slug, date, excerpt },
  className,
}: BlogPostCardProps) {
  const { hoverCard, navigate: navigateSound } = useSoundEffects()

  return (
    <Link
      href={`/blogs/${slug}`}
      prefetch={false}
      onMouseEnter={hoverCard}
      onClick={navigateSound}
      data-highlight-item
      className={cn(
        'group relative z-10 -mx-2 -my-1.5 flex flex-col rounded-xl px-2 py-1.5 transition-[transform,scale] duration-300 ease-out active:scale-[0.99] active:duration-200 sm:-mx-3 sm:-my-2 sm:px-3 sm:py-2',
        className,
      )}
    >
      <article className="flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <h3 className="text-balance text-base tracking-tight text-primary">{title}</h3>

          <div className="mt-1 flex shrink-0 items-center font-mono tabular-nums text-[12.5px] text-muted-foreground sm:mt-0.5">
            <time className="whitespace-nowrap">{formatDateString(date)}</time>
            <SeparatorBullet />
            <ViewCounter slug={slug} readOnly />
          </div>
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
