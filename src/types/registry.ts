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

export interface RegistryFile {
  path: string
  type: RegistryItemType
  target?: string
}

export interface RegistryItem {
  slug: string
  name: string
  description: string
  type: RegistryItemType
  date: string
  files: RegistryFile[]
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  cssVars?: { light: Record<string, string>; dark: Record<string, string> }
  tailwind?: { config?: Record<string, unknown> }
}
