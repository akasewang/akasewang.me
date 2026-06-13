import fs from 'node:fs'
import path from 'node:path'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { MDX_OPTIONS, MDX_COMPONENTS } from '../mdx-config'
import { Pre } from '../code-block'

/** Props for {@link ComponentSource}. */
interface ComponentSourceProps {
  src: string
  title?: string
  className?: string
}

/**
 * Directories ComponentSource may read from, relative to the repo root. Keeps the
 * component from ever exposing sensitive root level files (e.g. `.env`) even though
 * MDX content is repo controlled today.
 */
const ALLOWED_SOURCE_DIRS = ['src', 'docs']

/**
 * Safely resolve a project relative file path, rejecting anything that escapes the
 * repo root or lives outside {@link ALLOWED_SOURCE_DIRS}.
 * Returns the raw file contents or null when the file is missing or out of bounds.
 */
const readProjectFile = (src: string): string | null => {
  try {
    const root = process.cwd()
    const absolutePath = path.join(/* turbopackIgnore: true */ root, src)
    const relativeToRoot = path.relative(root, absolutePath)

    if (relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) return null

    const [topLevelDir] = relativeToRoot.split(path.sep)
    if (!ALLOWED_SOURCE_DIRS.includes(topLevelDir)) return null

    return fs.readFileSync(/* turbopackIgnore: true */ absolutePath, 'utf8')
  } catch (error) {
    console.error(error)
    return null
  }
}

/**
 * Server Component that renders the syntax highlighted source of any project file as a
 * code block, with the file name shown in the header bar. The language is inferred
 * from the file extension.
 *
 * @param src - The file path relative to the project root (e.g. `src/components/ui/button.tsx`).
 * @param title - Optional header label overriding the inferred file name.
 * @param className - Optional CSS classes for custom container styling.
 */
export async function ComponentSource({ src, title, className }: ComponentSourceProps) {
  const codeString = readProjectFile(src)

  if (codeString === null) {
    return (
      <div className="my-8 rounded-xl border border-border/50 bg-card p-6 text-center text-sm text-muted-foreground">
        Source file <code>{src}</code> not found.
      </div>
    )
  }

  const language = path.extname(src).slice(1) || 'text'
  const label = title ?? path.basename(src)

  return (
    <div className={className}>
      <MDXRemote
        source={`\`\`\`\`${language}\n${codeString}\n\`\`\`\``}
        options={MDX_OPTIONS}
        components={{
          ...MDX_COMPONENTS,
          pre: (props: React.HTMLAttributes<HTMLPreElement>) => <Pre title={label} {...props} />,
        }}
      />
    </div>
  )
}
