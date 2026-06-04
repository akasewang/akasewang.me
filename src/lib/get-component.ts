import fs from 'node:fs'
import path from 'node:path'

/** Cache the current working directory to avoid recalculating on every file read. */
const CWD = process.cwd()

/**
 * Reads a component's source code directly from the file system.
 * Used at build time (or during SSR) to show the source in the component preview tab and
 * to serve the raw string in the JSON payload for the shadcn CLI.
 *
 * @param filePath - The path to the file, relative to the project root.
 * @returns The raw file contents, or a fallback string if the read fails.
 */
export function getComponentSource(filePath: string): string {
  try {
    /**
     * Perform a synchronous file read.
     * This is acceptable and often preferred in Next.js Server Components / SSR
     * Synchronous execution is used where reading local files asynchronously does not yield meaningful event-loop benefits.
     */
    return fs.readFileSync(path.join(CWD, filePath), 'utf8')
  } catch (error) {
    console.error(error)
    return 'Source code not available.'
  }
}
