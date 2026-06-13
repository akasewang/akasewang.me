import React from 'react'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/utils/utils'
import { Pre } from './code-block'
import { ZoomableImage } from './zoomable-image'
import { generateId } from './utils/parse-toc'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'

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
 * Higher order function that generates a customized heading component.
 * Automatically injects an anchor link and a hashtag icon to support the TOC.
 *
 * @param level - The heading level (1-6) to generate.
 * @returns A React functional component for the specified heading level.
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
          className="absolute -left-8 top-1/2 flex -translate-y-1/2 items-center justify-center text-muted-foreground opacity-0 transition-[color,opacity] duration-300 hover:text-primary group-hover:opacity-100"
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

/**
 * MDX HTML Element Overrides.
 * Automatically generates anchor links for all heading levels to support the table of contents.
 */
export const mdxElements = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={
        className ||
        'rounded-md bg-muted/50 px-1.5 py-0.5 font-mono text-xs text-secondary whitespace-nowrap ring-1 ring-inset ring-border/30'
      }
      {...props}
    >
      {children}
    </code>
  ),
  pre: Pre,
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
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-6 border-l-2 border-primary pl-5 text-pretty font-serif text-base italic leading-relaxed text-muted-foreground"
      {...props}
    >
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
