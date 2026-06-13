import { FULL_NAME, SITE_DESCRIPTION, SITE_NAME } from '@/constants/constants'
import type { SeoContent } from '@/types/site'

/**
 * SEO Content Dictionary.
 * Provides the localized metadata, titles and descriptions used across different site routes.
 * Injected into the generic layout SEO configuration to construct dynamic meta tags and Open Graph data.
 */
export const homeSeoContent: SeoContent = {
  title: `${FULL_NAME} | Software Engineer`,
  description: SITE_DESCRIPTION,
  imageAlt: SITE_NAME,
  ogTitle: 'Software engineer who designs on the side.',
}

/** SEO metadata for the projects listing page. */
export const projectsSeoContent: SeoContent = {
  title: `Projects | ${FULL_NAME}`,
  description:
    "A showcase of my recent work, including web apps, open source tools and weekend experiments that I haven't abandoned yet.",
  imageAlt: `Projects - ${FULL_NAME}`,
  ogTitle: 'Selected projects and open source works.',
}

/** SEO metadata for the newsletter signup page. */
export const newsletterSeoContent: SeoContent = {
  title: `Newsletter | ${FULL_NAME}`,
  description:
    "Drop your email to get occasional updates on what I am building or writing. I don't send emails often enough for it to be annoying.",
  imageAlt: `Newsletter - ${FULL_NAME}`,
  ogTitle: 'Join my weekly newsletter.',
}

/** SEO metadata for the public message board page. */
export const messageBoardSeoContent: SeoContent = {
  title: `Message Board | ${FULL_NAME}`,
  description:
    'Leave a message, say hello, or drop a random thought on my message board. I actually read them.',
  imageAlt: `Message Board - ${FULL_NAME}`,
  ogTitle: 'Leave a message, drop a thought, or just say hello.',
}

/** SEO metadata for the blog index page. */
export const blogsSeoContent: SeoContent = {
  title: `Blogs | ${FULL_NAME}`,
  description:
    'A collection of my writing. Spanning software engineering, design and personal essays on life.',
  imageAlt: `Blogs - ${FULL_NAME}`,
  ogTitle: 'Writing on software, design and personal reflections.',
}

/** SEO metadata for the skills and technology stack page. */
export const skillsSeoContent: SeoContent = {
  title: `Skills & Tech Stack | ${FULL_NAME}`,
  description:
    'The programming languages, frameworks and tools I use to build things (and occasionally break things) on a daily basis.',
  imageAlt: `Skills - ${FULL_NAME}`,
  ogTitle: 'The tech stack I use to build things.',
}

/** SEO metadata for the testimonials page. */
export const testimonialsSeoContent: SeoContent = {
  title: `Testimonials | ${FULL_NAME}`,
  description:
    "Nice things people have said about me. (I promise I didn't pay them to write these).",
  imageAlt: `Testimonials - ${FULL_NAME}`,
  ogTitle: 'Kind words from people who (mostly) like me.',
}

/** SEO metadata for the catalog page. */
export const catalogSeoContent: SeoContent = {
  title: `Catalog | ${FULL_NAME}`,
  description:
    'A curated log of media and entertainment I have consumed (or am just hoarding in my backlog to feel productive).',
  imageAlt: `Catalog - ${FULL_NAME}`,
  ogTitle: 'A curated log of media and entertainment.',
}

/** SEO metadata for the changelog page. */
export const changelogSeoContent: SeoContent = {
  title: `Changelog | ${FULL_NAME}`,
  description:
    'A running log of every update shipped to this site, pulled straight from the GitHub commit history. This website is a product and these are its release notes.',
  imageAlt: `Changelog - ${FULL_NAME}`,
  ogTitle: 'Every update shipped to this site.',
}

/** SEO metadata for the photos page. */
export const photosSeoContent: SeoContent = {
  title: `Photos | ${FULL_NAME}`,
  description:
    'A small collection of photos I have taken. Mostly just proof that I step away from my keyboard sometimes.',
  imageAlt: `Photos - ${FULL_NAME}`,
  ogTitle: 'A small collection of photos I have taken.',
}
