import type { RegistryItem } from '@/types/registry'
import { getAllComponentDocs } from '@/lib/managers/component-manager'

/**
 * Dynamically derives the Shadcn CLI registry schema purely from MDX frontmatter.
 * This function parses all documents in `docs/components/` and generates the required
 * CLI fields (dependencies, files, etc.) on the fly. No static configuration array is needed.
 */
export async function getRegistryComponents(): Promise<RegistryItem[]> {
  /** Parse the physical MDX files in the content directory using the global manager */
  const mdxPosts = await getAllComponentDocs()

  /** Map the custom frontmatter schema into the strict JSON schema expected by shadcn CLI */

  return mdxPosts.map((mdx) => {
    return {
      slug: mdx.slug,
      name: mdx.title,
      description: mdx.excerpt,
      date: mdx.date,
      type: mdx.type ?? 'registry:component',
      category: mdx.category,
      dependencies: mdx.dependencies ?? [],
      devDependencies: mdx.devDependencies ?? [],
      registryDependencies: mdx.registryDependencies ?? [],
      cssVars: mdx.cssVars,
      tailwind: mdx.tailwind,
      /**
       * If files are not explicitly declared in MDX frontmatter, assume a standard
       * 1:1 mapping where the component lives in src/registry/components/ and installs to components/ui/
       */
      files: mdx.files ?? [
        {
          path: `src/registry/components/${mdx.slug}.tsx`,
          type: 'registry:component',
          target: `@components/ui/${mdx.slug}.tsx`,
        },
      ],
    } as RegistryItem
  })
}
