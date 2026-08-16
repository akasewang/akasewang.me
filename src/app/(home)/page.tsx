import type { Metadata } from 'next'
import { Fragment, type ReactNode } from 'react'
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
import { TechnicalTraining } from '@/components/sections/technical-training'
/* import { Testimonials } from '@/components/sections/testimonials' */
/* import { Volunteer } from '@/components/sections/volunteer' */
import { LANDING_SECTIONS, type LandingSection } from '@/constants/landing'
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
  /** Both read the filesystem, so they are read together rather than one after the other */
  const [blogPosts, projects] = await Promise.all([getAllBlogPosts(), getAllProjects()])

  /** What each name in the running order draws. The skeleton keys the same names to its own shapes */
  const sections: Record<LandingSection, ReactNode> = {
    hero: <HeroSection />,
    skills: <Skills />,
    experience: <Experience />,
    /* volunteer: <Volunteer />, */
    technicalTraining: <TechnicalTraining />,
    featuredProjects: <FeaturedProjects projects={projects} isHomePage />,
    featuredPosts: <FeaturedPosts posts={blogPosts} isHomePage />,
    /* testimonials: <Testimonials />, */
    education: <Education />,
    achievements: <Achievements />,
    certifications: <Certifications />,
    bookmarks: <Bookmarks />,
    newsletter: <NewsletterSubscription />,
  }

  return (
    <main className="flex-1">
      <section className="space-y-14">
        {LANDING_SECTIONS.map((section) => (
          <Fragment key={section}>{sections[section]}</Fragment>
        ))}
      </section>
    </main>
  )
}
