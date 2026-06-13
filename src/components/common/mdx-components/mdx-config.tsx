import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { mdxElements } from './mdx-elements'
import { SocialShare } from './social-share'
import { Callout } from './callout'
import { Tabs, Tab } from './tabs'
import { Steps, Step } from './steps'
import { ProjectDemo } from './project-demo'
import { AsideTOC } from './aside-toc'
import { LinkText } from '@/components/ui/link-text'
import { ZoomableImage } from './zoomable-image'
import { ComponentPreview } from './showcase/component-preview'
import { ComponentSource } from './showcase/component-source'

/**
 * Global MDX configuration and component mapping.
 * Serves as the central registry linking raw Markdown elements and custom React components
 * to the `next-mdx-remote` parser used across blogs, projects and component documentation.
 */

/** Configure server side syntax highlighting (rehypeHighlight) and GitHub Flavored Markdown (remarkGfm) */
export const MDX_OPTIONS = {
  mdxOptions: {
    rehypePlugins: [rehypeHighlight as any],
    remarkPlugins: [remarkGfm],
  },
}

/**
 * Map standard HTML elements to custom UI components (e.g., overriding `<a>` with `<LinkText>`)
 * and register custom React components (like `<ComponentPreview>`) for direct use inside .mdx files.
 */
export const MDX_COMPONENTS = {
  ...mdxElements,
  a: ({ href, children, ...props }: any) => (
    <LinkText href={href || '#'} {...props}>
      {children}
    </LinkText>
  ),
  LinkText,
  SocialShare,
  Callout,
  Tabs,
  Tab,
  Steps,
  Step,
  ProjectDemo,
  AsideTOC,
  ZoomableImage,
  ComponentPreview,
  ComponentSource,
}
