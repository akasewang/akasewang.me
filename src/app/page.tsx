import { Metadata } from 'next'

import { HeroSection } from '@/components/sections/hero-section'
import { Education } from '@/components/sections/education'
import { Experience } from '@/components/sections/experiences'
import { Certifications } from '@/components/sections/certifications'
import { Skills } from '@/components/sections/skills'
import { Achievements } from '@/components/sections/achievements'
import { Bookmarks } from '@/components/sections/bookmarks'
import { FeaturedProjects } from '@/components/sections/featured-projects'
import { FeaturedPosts } from '@/components/sections/featured-posts'
import { FeaturedComponents } from '@/components/sections/featured-components'
import { Volunteer } from '@/components/sections/volunteer'
import { NewsletterSubscription } from '@/components/common/newsletter-subscription'
import { getAllBlogPosts } from '@/lib/managers/blog-manager'
import { getAllProjects } from '@/lib/managers/project-manager'
import { getRegistryComponents } from '@/registry/registry-sync'

import { constructMetadata, getOgImageUrl } from '@/lib/metadata'
import { homeSeoContent } from '@/data/content/seo-content'

/** Resolves static SEO metadata for the primary home page. */
export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: homeSeoContent.title,
    description: homeSeoContent.description,
    path: '/',
    image: getOgImageUrl(homeSeoContent.ogTitle),
    imageAlt: homeSeoContent.imageAlt,
  })
}

/**
 * The main entry point and home page of the application.
 * Performs parallel data fetching for all featured content sections to minimize TTFB.
 */
export default async function Home() {
  /** Fetch all required MDX data streams simultaneously before yielding the React tree */
  const [blogPosts, projects, components] = await Promise.all([
    getAllBlogPosts(),
    getAllProjects(),
    getRegistryComponents(),
  ])

  return (
    <main className="flex-1">
      <section className="stagger-sections space-y-14">
        <HeroSection />
        <Skills />
        <Experience />
        <Volunteer />
        <FeaturedProjects projects={projects} />
        <FeaturedComponents components={components} />
        <FeaturedPosts posts={blogPosts} />
        <Education />
        <Achievements />
        <Certifications />
        <Bookmarks />
        <NewsletterSubscription />
      </section>
    </main>
  )
}
