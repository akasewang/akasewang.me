'use client'

import React, { useMemo } from 'react'
import { Tabs, Tab } from '@/components/common/mdx-components/tabs'

/** Props for {@link ComponentPreviewClient}. */
interface ComponentPreviewProps {
  slug: string
  codeNode: React.ReactNode
}

/**
 * Resolves the preview component via a dynamic import string mapping to \`@/registry/examples\`
 * and provides a tabbed interface to toggle between the live preview and the raw source code.
 *
 * @param slug - The unique identifier of the component in the registry.
 * @param codeNode - The pre-compiled MDX syntax-highlighted source code node.
 */
export function ComponentPreviewClient({ slug, codeNode }: ComponentPreviewProps) {
  const Preview = useMemo(() => {
    const Component = React.lazy(() =>
      import(`@/registry/examples/${slug}-demo`).catch(() => ({
        default: () => (
          <div className="flex min-h-72 items-center justify-center text-sm text-muted-foreground">
            Component <code>{slug}</code> preview not found.
          </div>
        ),
      })),
    )

    return <Component />
  }, [slug])

  return (
    <div className="my-8 w-full not-prose">
      <Tabs items={['Preview', 'Code']}>
        <Tab title="Preview">
          <div className="relative flex min-h-[400px] w-full items-center justify-center overflow-hidden rounded-xl bg-background">
            <div className="absolute inset-0 pointer-events-none bg-dot-pattern opacity-50" />
            <div className="relative z-10 flex h-full w-full items-center justify-center">
              <React.Suspense
                fallback={
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    Loading component...
                  </div>
                }
              >
                {Preview}
              </React.Suspense>
            </div>
          </div>
        </Tab>
        <Tab title="Code">{codeNode}</Tab>
      </Tabs>
    </div>
  )
}
