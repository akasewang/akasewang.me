import type { RegistryItemType } from '@/types/registry'

/**
 * Defines the structure of the MDX frontmatter for component documentation.
 * Acts as the single source of truth for both the documentation UI and the
 * Shadcn CLI installation schema.
 */
export interface ComponentPost {
  title: string
  date: string
  excerpt: string
  slug: string
  /**
   * Optional: UI classification category (e.g., 'layout', 'effects', 'inputs').
   * Used to filter components in the registry browser tabs.
   */
  category?: string

  /**
   * Optional: The Shadcn CLI installation type (e.g., 'registry:component', 'registry:hook').
   * Used by the CLI to determine where to install the core component file.
   */
  type?: RegistryItemType
  tech?: string[]

  /**
   * Optional: Required NPM packages for the component (e.g., 'framer-motion', 'clsx').
   * Used by the CLI to automatically run `npm install <dependencies>`.
   */
  dependencies?: string[]

  /**
   * Optional: Required development NPM packages for the component.
   * Used by the CLI to automatically run `npm install -D <devDependencies>`.
   */
  devDependencies?: string[]

  /**
   * Optional: Other registry components this component depends on (e.g., 'button', 'badge').
   * Used by the CLI to automatically install subcomponents.
   */
  registryDependencies?: string[]

  /**
   * Optional: Overrides for the files array if the component spans multiple files (like hooks or utils).
   * If omitted, the system assumes a single file at `src/registry/components/[slug].tsx`.
   */
  files?: any[]

  cssVars?: { light: Record<string, string>; dark: Record<string, string> }

  tailwind?: { config?: Record<string, unknown> }
}
