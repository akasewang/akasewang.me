'use client'

import { isValidElement, useMemo, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/utils'
import { CopyButton } from '@/components/ui/copy-button'
import { useInTabPanel } from './contexts/tab-panel-context'

/** Props for {@link Pre}. */
interface PreProps extends HTMLAttributes<HTMLPreElement> {
  copyable?: boolean
  raw?: boolean
  title?: string
}

/**
 * Recursively walk the React element tree to extract the pure text content of a code block.
 * This is necessary because rehype-highlight breaks the raw string into many nested `<span>` tags.
 */
const extractCode = (node: ReactNode): string => {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractCode).join('')
  if (isValidElement(node))
    return extractCode((node.props as { children?: ReactNode }).children ?? null)
  return ''
}

/**
 * Walk the element tree for a `language-*` class to detect the fenced code language.
 * rehype-highlight leaves this class on the inner `<code>` element rather than the `<pre>`.
 */
const extractLanguage = (node: ReactNode): string | null => {
  if (Array.isArray(node)) {
    for (const child of node) {
      const lang = extractLanguage(child)
      if (lang) return lang
    }
    return null
  }
  if (!isValidElement(node)) return null
  const { className, children } = node.props as { className?: string; children?: ReactNode }
  return /language-([\w-]+)/.exec(className ?? '')?.[1] ?? extractLanguage(children ?? null)
}

/* Extract the `title="..."` value from the `meta` string prop passed by MDX to the `<code>` element. */
const extractMetaTitle = (node: ReactNode): string | null => {
  if (Array.isArray(node)) {
    for (const child of node) {
      const title = extractMetaTitle(child)
      if (title) return title
    }
    return null
  }
  if (!isValidElement(node)) return null
  const { meta, title, children } = node.props as {
    meta?: string
    title?: string
    children?: ReactNode
  }
  if (title) return title
  if (meta && typeof meta === 'string') {
    const match = /title="([^"]+)"/.exec(meta) || /title='([^']+)'/.exec(meta)
    if (match) return match[1]
  }
  return extractMetaTitle(children ?? null)
}

/**
 * Custom `<pre>` renderer for MDX code blocks. Renders the code in a bordered surface with a
 * copy to clipboard button floating over it; when a language is detected it adds a label tab
 * connected above the surface, which is omitted when the block is inside a tab panel.
 *
 * @param copyable - Whether to display the copy to clipboard button. Defaults to true.
 * @param raw - If true, bypasses the styled wrapper and renders a standard HTML pre tag.
 * @param title - Optional label overriding the detected language.
 */
export const Pre = ({
  copyable = true,
  raw = false,
  title,
  className,
  children,
  ...props
}: PreProps) => {
  const code = useMemo(() => extractCode(children), [children])
  const metaTitle = useMemo(() => extractMetaTitle(children), [children])
  const label = useMemo(
    () => title ?? metaTitle ?? extractLanguage(children),
    [title, metaTitle, children],
  )
  const inTabPanel = useInTabPanel()

  if (raw)
    return (
      <pre className={className} {...props}>
        {children}
      </pre>
    )

  const hasHeader = Boolean(label) && !inTabPanel

  const codeArea = (
    <div className={cn('relative grid', hasHeader && 'z-10')}>
      {copyable && (
        <div className="pointer-events-none sticky top-2.5 z-20 col-start-1 row-start-1 self-start justify-self-end pt-2.5 pr-2.5 pb-2.5">
          <CopyButton
            value={code}
            iconSize={14}
            className={cn(
              'pointer-events-auto flex size-6 items-center justify-center rounded-md',
              'transition-[color,background-color,opacity,transform,scale] duration-200 ease-out',
              'scale-[0.95] bg-transparent text-secondary opacity-0 backdrop-blur-sm',
              'hover:bg-background/80 hover:text-primary',
              'group-hover/pre:scale-100 group-hover/pre:opacity-100',
              'data-[copied=true]:scale-100 data-[copied=true]:text-primary data-[copied=true]:opacity-100',
              '[@media(hover:none)]:scale-100 [@media(hover:none)]:opacity-100',
            )}
          />
        </div>
      )}
      <pre
        className={cn(
          'col-start-1 row-start-1 overflow-x-auto rounded-xl border border-border/60 bg-code-block px-4.5 py-3.5 font-mono text-xs leading-relaxed',
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          hasHeader && 'shadow-t-sm',
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  )

  return (
    <figure className="group/pre relative isolate my-6 flex w-full max-w-full flex-col not-prose">
      {hasHeader && (
        <figcaption className="relative z-0 ml-4 -mb-2 flex w-fit max-w-[calc(100%-2rem)] select-none items-center self-start rounded-t-lg border border-b-0 border-border/60 bg-floating px-4 pt-1 pb-3">
          <span className="font-mono text-[10px] font-medium lowercase tracking-widest text-muted-foreground">
            {label}
          </span>
        </figcaption>
      )}
      {codeArea}
    </figure>
  )
}
