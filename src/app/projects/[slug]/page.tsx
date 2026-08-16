import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { AsideTOC } from '@/components/common/mdx-components/aside-toc'
import { MDX_COMPONENTS, MDX_OPTIONS } from '@/components/common/mdx-components/mdx-config'
import { MdxFooter } from '@/components/common/mdx-components/mdx-footer'
import { MdxPostHeader } from '@/components/common/mdx-components/mdx-post-header'
import { MdxPostSummary } from '@/components/common/mdx-components/mdx-post-summary'
import { ProjectDemo } from '@/components/common/mdx-components/project-demo'
import { PostMessageBoard } from '@/components/message-board/post-message-board'
import { FULL_NAME, SITE_URL } from '@/constants/constants'
import { getBreadcrumbSchema, getProjectSchema, serializeJsonLd } from '@/lib/json-ld'
import { getPageProjects, getProject } from '@/lib/managers/project-manager'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'
import { getAdjacentContent } from '@/utils/content-utils'
import { formatProjectDate, getProjectEffectiveDate, projectHasPage } from '@/utils/project'

/** One page per project file, so every project is built ahead of any request for it */
export async function generateStaticParams() {
  return (await getPageProjects()).map(({ slug }) => ({ slug }))
}

/** Only the slugs generated below exist, so anything else is a 404 rather than a render attempt */
export const dynamicParams = false

type PageParams = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { slug } = await params
  const post = await getProject(slug)

  if (!post || !projectHasPage(post.data)) notFound()

  return constructMetadata({
    title: `${post.data.title} - ${FULL_NAME}`,
    description: post.data.excerpt,
    path: `/projects/${post.data.slug}`,
    image: getOgImageUrl(post.data.title, 'Project'),
    imageAlt: post.data.title,
    type: 'article',
    publishedTime: getProjectEffectiveDate(post.data),
  })
}

/** A single project: its header, its demo, the MDX body and the links out */
export default async function ProjectPost({ params }: { params: PageParams }) {
  const { slug } = await params
  const post = await getProject(slug)

  if (!post || !projectHasPage(post.data)) notFound()

  const { content, data } = post
  const { title, excerpt, slug: postSlug, tech, links, image, video } = data
  const effectiveDate = getProjectEffectiveDate(data)

  const projectJsonLd = getProjectSchema({
    title,
    excerpt,
    date: effectiveDate,
    slug: postSlug,
    tech,
  })
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Projects', url: `${SITE_URL}/projects` },
    { name: title, url: `${SITE_URL}/projects/${postSlug}` },
  ])

  const pageProjects = await getPageProjects()
  const { previous: prevProject, next: nextProject } = getAdjacentContent(pageProjects, postSlug)

  return (
    <div className="group/blog relative">
      <AsideTOC content={content} />
      <div className="relative space-y-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd([projectJsonLd, breadcrumbJsonLd]) }}
        />

        <MdxPostHeader
          title={title}
          date={formatProjectDate(data)}
          slug={postSlug}
          content={content}
          prev={prevProject ? { slug: prevProject.slug, title: prevProject.title } : undefined}
          next={nextProject ? { slug: nextProject.slug, title: nextProject.title } : undefined}
          basePath="/projects"
          url={`${SITE_URL}/projects/${postSlug}`}
        />

        <MdxPostSummary
          excerpt={excerpt}
          linkLabel="You can explore this project on"
          links={links}
          keywords={tech}
          keywordsClassName="pt-2"
        />

        <hr className="border-t border-border retina:border-t-[0.5px]" />

        {(image || video) && <ProjectDemo image={image} video={video} title={title} />}

        <div className="mdx-content">
          <MDXRemote source={content} options={MDX_OPTIONS} components={MDX_COMPONENTS} />
        </div>

        <PostMessageBoard scope="projects" slug={postSlug} />

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
