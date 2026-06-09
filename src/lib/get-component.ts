import fs from 'node:fs'
import path from 'node:path'

const REGISTRY_PATH_PREFIX = 'src/registry/'
const REGISTRY_ROOT = path.join(/* turbopackIgnore: true */ process.cwd(), 'src', 'registry')

function resolveRegistryFilePath(filePath: string): string | null {
  const normalizedFilePath = filePath.replace(/\\/g, '/')
  if (!normalizedFilePath.startsWith(REGISTRY_PATH_PREFIX)) return null

  const registryRelativePath = normalizedFilePath.slice(REGISTRY_PATH_PREFIX.length)
  const absolutePath = path.join(/* turbopackIgnore: true */ REGISTRY_ROOT, registryRelativePath)
  const relativeToRoot = path.relative(REGISTRY_ROOT, absolutePath)

  if (relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) return null
  return absolutePath
}

/**
 * Reads a registry component's source code directly from the file system.
 * Used at build time (or during SSR) to show the source in the component preview tab and
 * to serve the raw string in the JSON payload for the shadcn CLI.
 *
 * @param filePath - The registry file path, relative to the project root.
 * @returns The raw file contents, or a fallback string if the read fails.
 */
export function getComponentSource(filePath: string): string {
  try {
    const absolutePath = resolveRegistryFilePath(filePath)
    if (!absolutePath) return 'Source code not available.'

    return fs.readFileSync(/* turbopackIgnore: true */ absolutePath, 'utf8')
  } catch (error) {
    console.error(error)
    return 'Source code not available.'
  }
}
