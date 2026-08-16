'use client'

import { type ReactNode, Suspense } from 'react'
import { cn } from '@/utils/utils'
import { Tab, Tabs } from '../tabs'

interface ComponentPreviewProps {
  children: ReactNode
  code?: ReactNode
  className?: string
}

/** Renders a live component inside a post, beside the source that produced it */
export function ComponentPreview({ children, code, className }: ComponentPreviewProps) {
  const canvas = (
    <div
      className={cn(
        'relative flex min-h-100 w-full items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-background retina:border-[0.5px]',
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
