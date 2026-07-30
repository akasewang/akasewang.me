import fs from 'node:fs'
import path from 'node:path'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Pre } from '../code-block'
import { MDX_OPTIONS } from '../mdx-options'

interface ComponentSourceProps {
  src: string
  title?: string
  className?: string
}

const ALLOWED_SOURCE_DIRS = ['src', 'docs']

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

export function ComponentSource({ src, title, className }: ComponentSourceProps) {
  const codeString = readProjectFile(src)

  if (codeString === null) {
    return (
      <div className="my-8 rounded-xl border border-border/60 bg-card p-6 text-center text-sm text-muted-foreground">
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
          pre: (props: React.HTMLAttributes<HTMLPreElement>) => <Pre title={label} {...props} />,
        }}
      />
    </div>
  )
}
