import { MdxFooter } from '@/components/common/mdx-components/mdx-footer'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { MDX_OPTIONS, MDX_COMPONENTS } from '@/components/common/mdx-components/mdx-config'
import { AsideTOC } from '@/components/common/mdx-components/aside-toc'
import { ProjectDemo } from '@/components/common/mdx-components/project-demo'
import { LinkText } from '@/components/ui/link-text'
import { SeparatorBullet } from '@/components/ui/separator-bullet'
import { SeparatorSlash } from '@/components/ui/separator-slash'
import { ViewCounter } from '@/components/common/view-counter'
import { getReadingTime, formatDateString } from '@/utils/utils'
import { getProject, getProjectSlugs, getAllProjects } from '@/lib/managers/project-manager'
import { SlugNavigation } from '@/components/common/slug-navigation'
import { getBreadcrumbSchema, getProjectSchema } from '@/lib/json-ld'
import { SITE_URL, FULL_NAME } from '@/constants/constants'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'

/**
 * Next.js static generation hook.
 * Precomputes all possible project showcase paths at build time for instant delivery.
 */
export async function generateStaticParams() {
  return getProjectSlugs()
}

/** Resolved dynamic route params for a single project. */
export type paramsType = Promise<{ slug: string }>

/** Dynamically resolves Open Graph and SEO metadata based on the requested project's MDX frontmatter. */
export async function generateMetadata({ params }: { params: paramsType }): Promise<Metadata> {
  const { slug } = await params
  const post = await getProject(slug)

  if (!post) notFound()

  return constructMetadata({
    title: `${post.data.title} - ${FULL_NAME}`,
    description: post.data.excerpt,
    path: `/projects/${post.data.slug}`,
    image: getOgImageUrl(post.data.title, 'Project'),
    imageAlt: post.data.title,
    type: 'article',
    publishedTime: post.data.date,
  })
}

/**
 * Server Component responsible for rendering an individual project case study.
 * Hydrates the MDX content, calculates navigation and renders demo visuals (video/image).
 */
export default async function ProjectPost({ params }: { params: paramsType }) {
  const { slug } = await params
  const post = await getProject(slug)

  if (!post) notFound()

  const { content, data } = post
  const { title, excerpt, date, slug: postSlug, tech, links, image, video } = data

  const projectJsonLd = getProjectSchema({ title, excerpt, date, slug: postSlug, tech })
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Projects', url: `${SITE_URL}/projects` },
    { name: title, url: `${SITE_URL}/projects/${postSlug}` },
  ])

  const allProjects = await getAllProjects()
  const currentIndex = allProjects.findIndex((p) => p.slug === postSlug)
  const nextProject = currentIndex > 0 ? allProjects[currentIndex - 1] : undefined
  const prevProject =
    currentIndex !== -1 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : undefined

  return (
    <div className="group/blog">
      <AsideTOC content={content} />
      <div className="relative space-y-6 animate-page-simple">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([projectJsonLd, breadcrumbJsonLd]) }}
        />

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-balance font-serif text-2xl font-medium italic leading-snug text-primary">
              {title}
            </h1>

            <div className="flex items-center text-xs text-muted-foreground">
              <span>{formatDateString(date)}</span>
              <SeparatorBullet />
              <ViewCounter slug={postSlug} readOnly={false} />
              <SeparatorBullet />
              <span>{getReadingTime(content)} min read</span>
            </div>
          </div>

          <SlugNavigation
            prev={prevProject ? { slug: prevProject.slug, title: prevProject.title } : undefined}
            next={nextProject ? { slug: nextProject.slug, title: nextProject.title } : undefined}
            basePath="/projects"
            content={content}
            url={`${SITE_URL}/projects/${postSlug}`}
            title={title}
          />
        </div>

        <div className="space-y-2">
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{excerpt}</p>

          {links && links.length > 0 && (
            <div className="flex flex-wrap items-center text-sm leading-relaxed text-muted-foreground">
              <span className="mr-1">You can explore this project on</span>
              {links.map((link, i) => (
                <span key={`${link.url}-${i}`} className="flex items-center">
                  {i > 0 && <SeparatorSlash />}
                  <LinkText href={link.url}>{link.label}</LinkText>
                </span>
              ))}
              <span>.</span>
            </div>
          )}

          {tech && tech.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {tech.map((t, i) => (
                <MDX_COMPONENTS.code key={`${t}-${i}`}>{t}</MDX_COMPONENTS.code>
              ))}
            </div>
          )}
        </div>

        <hr className="border-t border-border" />

        {(image || video) && <ProjectDemo image={image} video={video} title={title} />}

        <div className="mdx-content">
          <MDXRemote source={content} options={MDX_OPTIONS} components={MDX_COMPONENTS} />
        </div>

        <MdxFooter
          url={`${SITE_URL}/projects/${postSlug}`}
          title={title}
          quote="Hope this inspired you as much as it did me."
          backHref="/projects"
        />
      </div>
    </div>
  )
}
