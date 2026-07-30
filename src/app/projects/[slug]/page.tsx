import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { AsideTOC } from '@/components/common/mdx-components/aside-toc'
import { MDX_COMPONENTS, MDX_OPTIONS } from '@/components/common/mdx-components/mdx-config'
import { MdxFooter } from '@/components/common/mdx-components/mdx-footer'
import { MdxPostHeader } from '@/components/common/mdx-components/mdx-post-header'
import { MdxPostSummary } from '@/components/common/mdx-components/mdx-post-summary'
import { ProjectDemo } from '@/components/common/mdx-components/project-demo'
import { FULL_NAME, SITE_URL } from '@/constants/constants'
import { getBreadcrumbSchema, getProjectSchema, serializeJsonLd } from '@/lib/json-ld'
import { getAllProjects, getProject, getProjectSlugs } from '@/lib/managers/project-manager'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'
import { getAdjacentContent } from '@/utils/content-utils'

export function generateStaticParams() {
  return getProjectSlugs()
}

type PageParams = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
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

export default async function ProjectPost({ params }: { params: PageParams }) {
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
  const { previous: prevProject, next: nextProject } = getAdjacentContent(allProjects, postSlug)

  return (
    <div className="group/blog">
      <AsideTOC content={content} />
      <div className="relative space-y-6 animate-page-simple">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd([projectJsonLd, breadcrumbJsonLd]) }}
        />

        <MdxPostHeader
          title={title}
          date={date}
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
