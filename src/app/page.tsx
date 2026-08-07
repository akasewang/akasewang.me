import type { Metadata } from 'next'
import { NewsletterSubscription } from '@/components/common/newsletter-subscription'
import { Achievements } from '@/components/sections/achievements'
import { Bookmarks } from '@/components/sections/bookmarks'
import { Certifications } from '@/components/sections/certifications'
import { Education } from '@/components/sections/education'
import { Experience } from '@/components/sections/experiences'
import { FeaturedPosts } from '@/components/sections/featured-posts'
import { FeaturedProjects } from '@/components/sections/featured-projects'
import { HeroSection } from '@/components/sections/hero-section'
import { Skills } from '@/components/sections/skills'
import { homeSeoContent } from '@/data/content/seo-content'
import { getAllBlogPosts } from '@/lib/managers/blog-manager'
import { getAllProjects } from '@/lib/managers/project-manager'
import { constructMetadata, getOgImageUrl } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
  title: homeSeoContent.title,
  description: homeSeoContent.description,
  path: '/',
  image: getOgImageUrl(homeSeoContent.ogTitle),
  imageAlt: homeSeoContent.imageAlt,
})

/** The landing page, stacking every section of the site into one scroll */
export default async function Home() {
  const [blogPosts, projects] = await Promise.all([getAllBlogPosts(), getAllProjects()])

  return (
    <main className="flex-1">
      <section className="space-y-14">
        <HeroSection />
        <Skills />
        <Experience />
        <FeaturedProjects projects={projects} isHomePage />
        <FeaturedPosts posts={blogPosts} isHomePage />
        <Education />
        <Achievements />
        <Certifications />
        <Bookmarks />
        <NewsletterSubscription />
      </section>
    </main>
  )
}
