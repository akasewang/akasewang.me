'use client'

import { isValidElement, useMemo, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/utils'
import { CopyButton } from '@/components/ui/copy-button'

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

/**
 * Custom `<pre>` renderer for MDX code blocks. Detects the fenced language to render a slim
 * header bar with a label and extracts the code text to power a copy to clipboard button.
 * Blocks without a detectable language fall back to a frameless layout where the copy
 * button is revealed on hover.
 *
 * @param copyable - Whether to display the copy to clipboard button. Defaults to true.
 * @param raw - If true, bypasses the styled wrapper and renders a standard HTML pre tag.
 * @param title - Optional label for the header bar overriding the detected language.
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
  const label = useMemo(() => title ?? extractLanguage(children), [title, children])

  if (raw)
    return (
      <pre className={className} {...props}>
        {children}
      </pre>
    )

  const hasHeader = Boolean(label)

  return (
    /**
     * The CopyButton container spans every grid row alongside the header and the `<pre>`,
     * letting it use `sticky` to float elegantly while scrolling, which is impossible
     * with traditional `absolute` positioning inside an `overflow-x-auto` container.
     */
    <figure className="group/pre relative isolate my-6 grid w-full max-w-full not-prose rounded-xl border border-border/60 bg-code-block">
      {hasHeader && (
        <figcaption className="col-start-1 row-start-1 flex h-9 select-none items-center rounded-t-[inherit] border-b border-border/50 bg-code-tab/50 px-3.5">
          <span className="font-mono text-[10px] font-medium lowercase tracking-widest text-muted-foreground">
            {label}
          </span>
        </figcaption>
      )}
      {copyable && (
        <div
          className={cn(
            'pointer-events-none sticky z-20 col-start-1 row-start-1 self-start justify-self-end',
            hasHeader ? 'top-1 row-span-2 pt-1 pr-1.5' : 'top-2 pt-2 pr-2',
          )}
        >
          <CopyButton
            value={code}
            iconSize={14}
            className={cn(
              'pointer-events-auto flex size-6 items-center justify-center rounded-md',
              'transition-[color,background-color,opacity,transform,scale] duration-200 ease-out',
              hasHeader
                ? cn(
                    'text-muted-foreground backdrop-blur-sm',
                    'hover:bg-background/70 hover:text-primary',
                    'data-[copied=true]:text-primary',
                  )
                : cn(
                    'scale-[0.95] bg-transparent text-secondary opacity-0 backdrop-blur-sm',
                    'hover:bg-background/80 hover:text-primary',
                    'group-hover/pre:scale-100 group-hover/pre:opacity-100',
                    'data-[copied=true]:scale-100 data-[copied=true]:text-primary data-[copied=true]:opacity-100',
                    '[@media(hover:none)]:scale-100 [@media(hover:none)]:opacity-100',
                  ),
            )}
          />
        </div>
      )}
      <pre
        className={cn(
          'col-start-1 overflow-x-auto px-4 py-3 font-mono text-xs leading-relaxed',
          hasHeader ? 'row-start-2' : 'row-start-1',
          '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1.5',
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    </figure>
  )
}
