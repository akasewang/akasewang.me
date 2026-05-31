import { getRegistryComponents } from '@/registry/registry-sync'
import { ComponentPreviewClient } from './component-preview-client'
import { ComponentSource } from './component-source'

interface ComponentPreviewProps {
  slug: string
}

/**
 * It resolves the component slug against the MDX-driven registry sync and pre-generates
 * the syntax-highlighted source code node to be passed down to the Client wrapper.
 *
 * @param slug - The unique identifier of the component in the registry.
 */

export async function ComponentPreview({ slug }: ComponentPreviewProps) {
  const components = await getRegistryComponents()
  const item = components.find((c) => c.slug === slug)

  if (!item) {
    return (
      <div className="my-8 rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        Component <code>{slug}</code> not found in registry.
      </div>
    )
  }

  return (
    <ComponentPreviewClient
      slug={slug}
      codeNode={<ComponentSource slug={slug} className="[&_figure]:!my-0" />}
    />
  )
}
