/**
 * Module customization hooks for the email preview server.
 *
 * Node keeps an ES module in memory for the life of the process, keyed by the URL it was resolved
 * to. A template can be re-imported under a fresh URL, but the modules it imports resolve to their
 * plain URLs and come back from that cache, so an edit to a shared file would never reach a render.
 * Appending the current generation to every resolved URL under the watched tree re-keys the whole
 * graph at once, which is what makes a save visible.
 *
 * The generation is read from shared memory rather than received over a message because these hooks
 * run on their own thread, where a message could arrive after an import has already resolved.
 */

interface ResolveContext {
  conditions: string[]
  importAttributes: Record<string, string>
  parentURL?: string
}

interface ResolveResult {
  url: string
  format?: string | null
  shortCircuit?: boolean
  importAttributes?: Record<string, string>
}

type NextResolve = (specifier: string, context: ResolveContext) => Promise<ResolveResult>

interface LoaderData {
  generation: Int32Array
  watchedPrefix: string
}

let generation: Int32Array | null = null
let watchedPrefix = ''

/** Node hands the loader its shared state here, the counter the watcher bumps on every save */
export function initialize(data: LoaderData) {
  generation = data.generation
  watchedPrefix = data.watchedPrefix
}

/**
 * Re-keys every module under the watched directory with the current generation, which is what makes
 * a re-import pick a saved file up. Node caches by URL and never lets go, so a changing query is
 * the only way to be handed a fresh copy.
 */
export async function resolve(
  specifier: string,
  context: ResolveContext,
  nextResolve: NextResolve,
): Promise<ResolveResult> {
  const resolved = await nextResolve(specifier, context)
  if (generation === null || !resolved.url.startsWith(watchedPrefix)) return resolved

  /** fileURLToPath reads the pathname alone, so this query never reaches the file lookup */
  const separator = resolved.url.includes('?') ? '&' : '?'
  return { ...resolved, url: `${resolved.url}${separator}g=${Atomics.load(generation, 0)}` }
}
