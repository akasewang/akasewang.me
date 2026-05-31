/**
 * Defines the structure of the MDX frontmatter for component documentation.
 * This interface acts as the single source of truth for both the documentation UI
 * Also defines the Shadcn CLI installation schema.
 */
export interface ComponentPost {
  title: string
  date: string
  excerpt: string
  slug: string
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
   * Used by the CLI to automatically install sub-components.
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
