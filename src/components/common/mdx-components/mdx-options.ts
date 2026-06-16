import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

type CodeMetaNode = {
  type?: string
  meta?: string
  data?: {
    hProperties?: Record<string, unknown>
  }
  children?: CodeMetaNode[]
}

const remarkCodeMeta = () => (tree: CodeMetaNode) => {
  const visit = (node: CodeMetaNode) => {
    if (node.type === 'code' && node.meta) {
      const match = /title="([^"]+)"/.exec(node.meta) || /title='([^']+)'/.exec(node.meta)
      if (match) {
        node.data = node.data || {}
        node.data.hProperties = node.data.hProperties || {}
        node.data.hProperties.title = match[1]
      }
    }

    if (node.children) {
      node.children.forEach(visit)
    }
  }

  visit(tree)
}

export const MDX_OPTIONS = {
  mdxOptions: {
    rehypePlugins: [rehypeHighlight],
    remarkPlugins: [remarkCodeMeta, remarkGfm],
  },
}
