import { SlugNavigation } from '@/components/common/slug-navigation'
import { ViewCounter } from '@/components/common/view-counter'
import { SeparatorBullet } from '@/components/ui/separator-bullet'
import { formatDateString, getReadingTime } from '@/utils/utils'

interface AdjacentPost {
  slug: string
  title: string
}

interface MdxPostHeaderProps {
  title: string
  date?: string
  slug: string
  content: string
  basePath: string
  url: string
  prev?: AdjacentPost
  next?: AdjacentPost
}

/** The title of a post with its date, view count and reading time, above the body */
export function MdxPostHeader({
  title,
  date,
  slug,
  content,
  basePath,
  url,
  prev,
  next,
}: MdxPostHeaderProps) {
  const formattedDate = formatDateString(date)

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        <h1 className="text-balance font-serif text-2xl font-medium italic leading-snug text-primary">
          {title}
        </h1>

        <div className="flex items-center text-xs text-muted-foreground">
          {formattedDate && (
            <>
              <span>{formattedDate}</span>
              <SeparatorBullet />
            </>
          )}
          <ViewCounter slug={slug} readOnly={false} />
          <SeparatorBullet />
          <span>{getReadingTime(content)} min read</span>
        </div>
      </div>

      <SlugNavigation
        prev={prev}
        next={next}
        basePath={basePath}
        content={content}
        url={url}
        title={title}
      />
    </div>
  )
}
