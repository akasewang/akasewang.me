import { getRegistryComponents } from '@/registry/registry-sync'
import { ComponentPreviewClient } from './component-preview-client'
import { ComponentSource } from './component-source'

/** Props for {@link ComponentPreview}. */
interface ComponentPreviewProps {
  slug: string
}

/**
 * Server Component that resolves a component slug against the MDX-driven registry sync and
 * pre-generates the syntax-highlighted source node, handing both off to the client preview wrapper.
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
