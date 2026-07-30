import { LinkText } from '@/components/ui/link-text'
import { SeparatorSlash } from '@/components/ui/separator-slash'
import { cn } from '@/utils/utils'
import { MDX_COMPONENTS } from './mdx-config'

interface MdxPostSummaryProps {
  excerpt: string
  linkLabel: string
  links?: { label: string; url: string }[]
  keywords?: string[]
  keywordsClassName?: string
}

export function MdxPostSummary({
  excerpt,
  linkLabel,
  links,
  keywords,
  keywordsClassName,
}: MdxPostSummaryProps) {
  return (
    <div className="space-y-2">
      <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{excerpt}</p>

      {!!links?.length && (
        <div className="flex flex-wrap items-center text-sm leading-relaxed text-muted-foreground">
          <span className="mr-1">{linkLabel}</span>
          {links.map((link, index) => (
            <span key={link.url} className="flex items-center">
              {index > 0 && <SeparatorSlash />}
              <LinkText href={link.url}>{link.label}</LinkText>
            </span>
          ))}
          <span>.</span>
        </div>
      )}

      {!!keywords?.length && (
        <div className={cn('flex flex-wrap gap-2 pt-1', keywordsClassName)}>
          {keywords.map((keyword) => (
            <MDX_COMPONENTS.code key={keyword}>{keyword}</MDX_COMPONENTS.code>
          ))}
        </div>
      )}
    </div>
  )
}
