'use client'

import { isValidElement, useMemo, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/utils'
import { CopyButton } from '@/components/ui/copy-button'

/** Props for {@link Pre}. */
interface PreProps extends HTMLAttributes<HTMLPreElement> {
  copyable?: boolean
  raw?: boolean
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
 * Custom `<pre>` renderer for MDX code blocks. Extracts the code text to power a floating
 * hover copy-to-clipboard button.
 *
 * @param copyable - Whether to display the copy button hover action. Defaults to true.
 * @param raw - If true, bypasses the styled wrapper and renders a standard HTML pre tag.
 */
export const Pre = ({ copyable = true, raw = false, className, children, ...props }: PreProps) => {
  const code = useMemo(() => extractCode(children), [children])

  if (raw)
    return (
      <pre className={className} {...props}>
        {children}
      </pre>
    )

  return (
    /**
     * By placing both the CopyButton container and the `<pre>` in col-start-1 row-start-1,
     * the button can use `sticky top-2.5` to float elegantly while scrolling, which is
     * impossible with traditional `absolute` positioning inside an `overflow-x-auto` container.
     */
    <figure className="group/pre relative isolate my-6 w-full max-w-full not-prose rounded-xl bg-code-block grid">
      {copyable && (
        <div className="col-start-1 row-start-1 sticky top-2.5 z-20 justify-self-end self-start pointer-events-none pr-2.5 py-2.5">
          <CopyButton
            value={code}
            iconSize={14}
            className={cn(
              'pointer-events-auto flex size-6 items-center justify-center scale-[0.95] rounded-md opacity-0 backdrop-blur-sm',
              'transition-[color,background-color,opacity,transform,scale] duration-200 ease-out',
              'bg-transparent text-secondary',
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
          'col-start-1 row-start-1 overflow-x-auto px-4.5 py-3.5 font-mono text-xs leading-relaxed',
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
