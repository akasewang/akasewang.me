'use client'

import { Suspense, type ReactNode } from 'react'
import { Tabs, Tab } from '../tabs'
import { cn } from '@/utils/utils'

/** Props for {@link ComponentPreview}. */
interface ComponentPreviewProps {
  children: ReactNode
  code?: ReactNode
  className?: string
}

/**
 * A live component showcase for MDX docs. Renders its children centered on a dotted
 * canvas and when a `code` node is provided wraps everything in a preview/code tab
 * switcher so readers can flip between the running demo and its source.
 *
 * @param children - The live demo node rendered on the preview canvas.
 * @param code - Optional source node (e.g. a fenced code block or `<ComponentSource>`).
 * @param className - Optional CSS classes for custom canvas styling.
 */
export function ComponentPreview({ children, code, className }: ComponentPreviewProps) {
  const canvas = (
    <div
      className={cn(
        'relative flex min-h-[400px] w-full items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-background',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-50" />
      <div className="relative z-10 flex h-full w-full items-center justify-center p-6">
        <Suspense
          fallback={
            <span className="font-mono text-xs lowercase tracking-wider text-muted-foreground">
              loading preview...
            </span>
          }
        >
          {children}
        </Suspense>
      </div>
    </div>
  )

  if (!code) return <div className="my-8 w-full not-prose">{canvas}</div>

  return (
    <div className="my-8 w-full not-prose">
      <Tabs items={['Preview', 'Code']}>
        <Tab title="Preview">{canvas}</Tab>
        <Tab title="Code">{code}</Tab>
      </Tabs>
    </div>
  )
}
