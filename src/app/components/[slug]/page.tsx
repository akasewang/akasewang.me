import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import {
  getComponentSlugs,
  getComponentDoc,
  getAllComponentDocs,
} from '@/lib/managers/component-manager'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { MDX_OPTIONS, MDX_COMPONENTS } from '@/components/common/mdx-components/mdx-config'
import { AsideTOC } from '@/components/common/mdx-components/aside-toc'
import { DownloadCounter } from '@/components/registry/download-counter'
import { SlugNavigation } from '@/components/common/slug-navigation'
import { ViewCounter } from '@/components/common/view-counter'
import { MdxFooter } from '@/components/common/mdx-components/mdx-footer'
import { SeparatorBullet } from '@/components/ui/separator-bullet'
import { getBreadcrumbSchema } from '@/lib/json-ld'
import { getReadingTime, formatDateString } from '@/utils/utils'
import { SITE_URL, FULL_NAME } from '@/constants/constants'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'

interface ComponentPageProps {
  params: Promise<{
    slug: string
  }>
}

/**
 * Next.js static generation hook.
 * Pre-computes all possible component paths at build time to ensure ultra-fast static delivery.
 */
export async function generateStaticParams() {
  return getComponentSlugs()
}

/** Dynamically resolves Open Graph and SEO metadata based on the requested component's MDX frontmatter. */

export async function generateMetadata({ params }: ComponentPageProps): Promise<Metadata> {
  const { slug } = await params
  const doc = await getComponentDoc(slug)

  if (!doc) notFound()

  return constructMetadata({
    title: `${doc.data.title} - ${FULL_NAME}`,
    description: doc.data.excerpt,
    path: `/components/${doc.data.slug}`,
    image: getOgImageUrl(doc.data.title, 'Component'),
    imageAlt: doc.data.title,
    type: 'article',
    publishedTime: doc.data.date,
  })
}

/**
 * Server Component responsible for rendering an individual component's documentation page.
 * Hydrates the MDX content, calculates navigation (prev/next), and injects structured JSON-LD data.
 */
export default async function ComponentPage({ params }: ComponentPageProps) {
  const { slug } = await params
  const doc = await getComponentDoc(slug)

  /** Trigger a Next.js 404 boundary if the user requests a non-existent slug */
  if (!doc) notFound()

  const {
    content,
    data: { title, excerpt, date, tech },
  } = doc

  /** Calculate adjacent components for the previous/next navigation UI */
  const allDocs = await getAllComponentDocs()
  const currentIndex = allDocs.findIndex((c) => c.slug === slug)
  const prevComponent = allDocs[currentIndex - 1]
  const nextComponent = allDocs[currentIndex + 1]

  return (
    <div className="group/blog">
      <AsideTOC content={content} />
      <div className="relative space-y-6 animate-page-simple">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              getBreadcrumbSchema([
                { name: 'Home', url: SITE_URL },
                { name: 'Components', url: `${SITE_URL}/components` },
                { name: title, url: `${SITE_URL}/components/${slug}` },
              ]),
            ),
          }}
        />

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-balance font-serif text-2xl font-medium italic leading-snug text-primary">
              {title}
            </h1>

            <div className="flex items-center text-xs text-muted-foreground">
              {date && (
                <>
                  <span>{formatDateString(date)}</span>
                  <SeparatorBullet />
                </>
              )}
              <ViewCounter slug={`component-${slug}`} readOnly={false} />
              <SeparatorBullet />
              <span>{getReadingTime(content)} min read</span>
            </div>
          </div>

          <SlugNavigation
            prev={
              prevComponent ? { slug: prevComponent.slug, title: prevComponent.title } : undefined
            }
            next={
              nextComponent ? { slug: nextComponent.slug, title: nextComponent.title } : undefined
            }
            basePath="/components"
            content={content}
            url={`${SITE_URL}/components/${slug}`}
            title={title}
          />
        </div>

        <div className="space-y-2">
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{excerpt}</p>

          {tech && tech.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {tech.map((t) => (
                <MDX_COMPONENTS.code key={t}>{t}</MDX_COMPONENTS.code>
              ))}
            </div>
          )}
        </div>

        <hr className="border-border" />

        <div className="mdx-content">
          <MDXRemote source={content} options={MDX_OPTIONS} components={MDX_COMPONENTS} />
        </div>

        <DownloadCounter slug={slug} />

        <MdxFooter
          url={`${SITE_URL}/components/${slug}`}
          title={title}
          quote="Hope this component is useful for your project."
          backHref="/components"
        />
      </div>
    </div>
  )
}
