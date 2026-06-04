import { getRegistryComponents } from '@/registry/registry-sync'
import { getComponentSource } from '@/lib/get-component'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { MDX_OPTIONS, MDX_COMPONENTS } from '@/components/common/mdx-components/mdx-config'

/** Props for {@link ComponentSource}. */
interface ComponentSourceProps {
  slug: string
  className?: string
}

/**
 * Server Component that renders the syntax-highlighted source of a registry component.
 * Resolves the component via the MDX-driven registry sync, reads the raw file from the local
 * filesystem, and rewrites registry-internal import paths to their public equivalents for display.
 *
 * @param slug - The unique identifier of the component in the registry.
 * @param className - Optional CSS classes for custom container styling.
 */
export async function ComponentSource({ slug, className }: ComponentSourceProps) {
  const components = await getRegistryComponents()
  const item = components.find((c) => c.slug === slug)
  const filePath = item?.files?.[0]?.path

  if (!item || !filePath) {
    return (
      <div className="my-8 rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        Component Source <code>{slug}</code> not found in registry.
      </div>
    )
  }

  let codeString = getComponentSource(filePath)

  codeString = codeString.replaceAll('@/registry/hooks/', '@/hooks/')
  codeString = codeString.replaceAll('@/registry/components/', '@/components/ui/')
  codeString = codeString.replaceAll('@/registry/lib/', '@/lib/')
  codeString = codeString.replaceAll('@/registry/utils/', '@/utils/')

  return (
    <div className={className}>
      <MDXRemote
        source={`\`\`\`tsx\n${codeString}\n\`\`\``}
        options={MDX_OPTIONS}
        components={MDX_COMPONENTS}
      />
    </div>
  )
}
