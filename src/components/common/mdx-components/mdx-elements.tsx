import type React from 'react'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/utils/utils'
import { Pre } from './code-block'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'
import { generateId } from './utils/parse-toc'
import { ZoomableImage } from './zoomable-image'

const HEADING_SIZES = {
  1: 'mb-4 mt-8 font-serif text-2xl font-medium italic leading-snug text-primary',
  2: 'mb-3 mt-8 font-serif text-lg font-medium italic leading-snug text-primary',
  3: 'mb-2 mt-6 font-serif text-base font-medium italic leading-snug text-primary',
  4: 'mb-2 mt-4 font-serif text-sm font-medium italic text-primary',
  5: 'mb-1 mt-3 text-xs font-medium text-primary',
  6: 'mb-1 mt-2 text-xs font-medium text-primary',
} as const

const ICON_SIZES = { 1: 22, 2: 18, 3: 16, 4: 14, 5: 12, 6: 10 } as const

/**
 * One heading level. Each gets an id derived from its own text, matching what the table of contents
 * generates, and an anchor sitting in the margin that appears on hover or on focus.
 */
const createHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
  const HeadingComponent = ({
    children,
    id,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = typeof children === 'string' ? children : ''
    const headingId = id || generateId(text)
    const Tag = `h${level}` as React.ElementType

    return (
      <Tag
        id={headingId}
        className={cn('group relative scroll-mt-20 text-balance', HEADING_SIZES[level])}
        {...props}
      >
        <a
          href={`#${headingId}`}
          className="absolute -left-8 top-1/2 flex -translate-y-1/2 items-center justify-center text-muted-foreground opacity-0 transition-[color,opacity] duration-300 supports-hover:hover:text-primary active:text-primary supports-hover:group-hover:opacity-100 focus-visible:opacity-100"
          aria-label={`Link to ${text}`}
        >
          <Icons.hash size={ICON_SIZES[level]} />
        </a>
        {children}
      </Tag>
    )
  }
  HeadingComponent.displayName = `Heading${level}`
  return HeadingComponent
}

/** The plain HTML elements a post can produce, restyled to match the site */
export const mdxElements = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  /** Inline code only: a highlighted block arrives with its own class, which is left alone */
  code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={
        className ||
        'rounded-md bg-surface-50 px-1.5 py-0.5 font-mono text-xs text-secondary whitespace-nowrap ring-1 ring-inset ring-border/40 retina:ring-[0.5px]'
      }
      {...props}
    >
      {children}
    </code>
  ),
  pre: Pre,
  /**
   * A div rather than a p, since markdown puts images and code blocks inside paragraphs and a p
   * cannot legally contain them. The role keeps it a paragraph to anything reading the page.
   */
  p: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <div
      role="paragraph"
      className="mb-4 text-pretty text-sm leading-relaxed text-foreground last:mb-0"
      {...props}
    >
      {children}
    </div>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="mb-6 ml-6 list-disc space-y-2 text-pretty text-sm leading-relaxed text-foreground marker:text-muted-foreground"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="mb-6 ml-6 list-decimal space-y-2 text-pretty text-sm leading-relaxed text-foreground marker:text-muted-foreground"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="pl-1 text-pretty text-sm leading-relaxed text-foreground" {...props}>
      {children}
    </li>
  ),
  /**
   * A pull quote, set off by a fill rather than a rule, the way a link chip is. The type is left to
   * the paragraph inside it, which owns the size, leading and colour of everything in a post.
   */
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="my-6 bg-surface-30 px-5 py-4 font-serif italic" {...props}>
      {children}
    </blockquote>
  ),
  img: ZoomableImage,
  table: Table,
  tr: TableRow,
  th: TableHead,
  td: TableCell,
  thead: TableHeader,
  tbody: TableBody,
}
