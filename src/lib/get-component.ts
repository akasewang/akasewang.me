import fs from 'node:fs'
import path from 'node:path'

/** Cache the Current Working Directory to avoid recalculating on every file read */
const CWD = process.cwd()

/**
 * Reads a component's source code directly from the file system.
 * Used during build time (or SSR) to display the source in the component preview tab
 * Serves the raw string via the JSON payload for the shadcn CLI.
 *
 * @param filePath - The relative path to the file from the project root.
 * @returns The raw string contents of the file, or an error fallback string.
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
