/**
 * Shadcn UI registry schema definitions.
 * Defines the strict JSON schema required for components to be compatible with the Shadcn CLI.
 */
export type RegistryItemType =
  | 'registry:component'
  | 'registry:block'
  | 'registry:example'
  | 'registry:hook'
  | 'registry:lib'

/** A single file shipped by a registry item, with its install type and optional target path. */
export interface RegistryFile {
  path: string
  type: RegistryItemType
  target?: string
}

/** A full registry component entry: identity, files, dependencies, and theming config. */
export interface RegistryItem {
  slug: string
  name: string
  description: string
  /**
   * Optional category for the component registry browser UI.
   * Note: This is an extension of the standard Shadcn CLI schema, used purely for our UI filtering.
   */
  category?: string
  type: RegistryItemType
  date: string
  files: RegistryFile[]
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  cssVars?: { light: Record<string, string>; dark: Record<string, string> }
  tailwind?: { config?: Record<string, unknown> }
}
