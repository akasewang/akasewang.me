import { FULL_NAME, SITE_NAME, SITE_DESCRIPTION } from '@/constants/constants'
import type { SeoContent } from '@/types/site'

/**
 * SEO Content Dictionary.
 * Provides the localized metadata, titles, and descriptions used across different site routes.
 * Injected into the generic layout SEO configuration to construct dynamic meta tags and Open Graph data.
 */
export const homeSeoContent: SeoContent = {
  title: FULL_NAME,
  description: SITE_DESCRIPTION,
  imageAlt: SITE_NAME,
  ogTitle: 'Software engineer who designs on the side.',
}

export const projectsSeoContent: SeoContent = {
  title: `Projects | ${FULL_NAME}`,
  description:
    "A showcase of my recent work, including web apps, open-source tools, and weekend experiments that I haven't abandoned yet.",
  imageAlt: `Projects - ${FULL_NAME}`,
  ogTitle: 'Selected projects and open source works.',
}

export const newsletterSeoContent: SeoContent = {
  title: `Newsletter | ${FULL_NAME}`,
  description:
    "Drop your email to get occasional updates on what I am building or writing. I don't send emails often enough for it to be annoying.",
  imageAlt: `Newsletter - ${FULL_NAME}`,
  ogTitle: 'Join my weekly newsletter.',
}

export const messageBoardSeoContent: SeoContent = {
  title: `Message Board | ${FULL_NAME}`,
  description:
    'Leave a message, say hello, or drop a random thought on my message board. I actually read them.',
  imageAlt: `Message Board - ${FULL_NAME}`,
  ogTitle: 'Leave a message, drop a thought, or just say hello.',
}

export const blogsSeoContent: SeoContent = {
  title: `Blogs | ${FULL_NAME}`,
  description:
    'A collection of my writing. Spanning software engineering, design, and personal essays on life.',
  imageAlt: `Blogs - ${FULL_NAME}`,
  ogTitle: 'Writing on software, design, and personal reflections.',
}

export const skillsSeoContent: SeoContent = {
  title: `Skills & Tech Stack | ${FULL_NAME}`,
  description:
    'The programming languages, frameworks, and tools I use to build things (and occasionally break things) on a daily basis.',
  imageAlt: `Skills - ${FULL_NAME}`,
  ogTitle: 'The tech stack I use to build things.',
}

export const testimonialsSeoContent: SeoContent = {
  title: `Testimonials | ${FULL_NAME}`,
  description:
    "Nice things people have said about me. (I promise I didn't pay them to write these).",
  imageAlt: `Testimonials - ${FULL_NAME}`,
  ogTitle: 'Kind words from people who (mostly) like me.',
}

export const catalogSeoContent: SeoContent = {
  title: `Catalog | ${FULL_NAME}`,
  description:
    'A curated log of media and entertainment I have consumed (or am just hoarding in my backlog to feel productive).',
  imageAlt: `Catalog - ${FULL_NAME}`,
  ogTitle: 'A curated log of media and entertainment.',
}

export const photosSeoContent: SeoContent = {
  title: `Photos | ${FULL_NAME}`,
  description:
    'A small collection of photos I have taken. Mostly just proof that I step away from my keyboard sometimes.',
  imageAlt: `Photos - ${FULL_NAME}`,
  ogTitle: 'A small collection of photos I have taken.',
}

export const componentsSeoContent: SeoContent = {
  title: `Components | ${FULL_NAME}`,
  description:
    'A registry of reusable UI components and micro-interactions I have built for my projects.',
  imageAlt: `Components - ${FULL_NAME}`,
  ogTitle: 'Reusable UI components and interactions.',
}
