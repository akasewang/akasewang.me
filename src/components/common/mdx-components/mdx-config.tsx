import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { LinkText } from '@/components/ui/link-text'
import { AsideTOC } from './aside-toc'
import { Callout } from './callout'
import { mdxElements } from './mdx-elements'
import { ProjectDemo } from './project-demo'
import { ComponentPreview } from './showcase/component-preview'
import { ComponentSource } from './showcase/component-source'
import { SocialShare } from './social-share'
import { Step, Steps } from './steps'
import { Tab, Tabs } from './tabs'
import { ZoomableImage } from './zoomable-image'

export { MDX_OPTIONS } from './mdx-options'

type MdxAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children?: ReactNode
}

/** Every component a post can use, from restyled HTML to the custom blocks */
export const MDX_COMPONENTS = {
  ...mdxElements,
  /** Every link in a post goes through the site's own, which sorts out target and rel for itself */
  a: ({ href, children, ...props }: MdxAnchorProps) => (
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
