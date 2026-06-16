import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { AsideTOC } from '@/components/common/mdx-components/aside-toc'
import { MDX_COMPONENTS, MDX_OPTIONS } from '@/components/common/mdx-components/mdx-config'
import { MdxFooter } from '@/components/common/mdx-components/mdx-footer'
import { MdxPostHeader } from '@/components/common/mdx-components/mdx-post-header'
import { ProjectDemo } from '@/components/common/mdx-components/project-demo'
import { LinkText } from '@/components/ui/link-text'
import { SeparatorSlash } from '@/components/ui/separator-slash'
import { FULL_NAME, SITE_URL } from '@/constants/constants'
import { getBreadcrumbSchema, getProjectSchema } from '@/lib/json-ld'
import { getAllProjects, getProject, getProjectSlugs } from '@/lib/managers/project-manager'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'

export async function generateStaticParams() {
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
