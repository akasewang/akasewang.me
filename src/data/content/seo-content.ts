import { FULL_NAME, SITE_DESCRIPTION, SITE_NAME } from '@/constants/constants'
import type { SeoContent } from '@/types/site'

/**
 * What each page reports to search engines and share cards, one entry per page.
 *
 * Kept together rather than beside the pages themselves, so the titles and descriptions can be
 * read against one another and stay consistent in voice.
 */
export const homeSeoContent: SeoContent = {
  title: `${FULL_NAME} | Software Engineer`,
  description: SITE_DESCRIPTION,
  imageAlt: SITE_NAME,
  ogTitle: 'My work is better than this tagline.',
}

export const projectsSeoContent: SeoContent = {
  title: `Projects | ${FULL_NAME}`,
  description:
    "A showcase of my recent work, including web apps, open source tools and weekend experiments that I haven't abandoned yet.",
  imageAlt: `Projects - ${FULL_NAME}`,
  ogTitle: 'Selected projects and open source works.',
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
    'A collection of my writing. Spanning software engineering, design and personal essays on life.',
  imageAlt: `Blogs - ${FULL_NAME}`,
  ogTitle: 'Writing on software, design and personal reflections.',
}

export const skillsSeoContent: SeoContent = {
  title: `Skills & Tech Stack | ${FULL_NAME}`,
  description:
    'The programming languages, frameworks and tools I use to build things (and occasionally break things) on a daily basis.',
  imageAlt: `Skills - ${FULL_NAME}`,
  ogTitle: 'The tech stack I use to build things.',
}

export const linksSeoContent: SeoContent = {
  title: `Links | ${FULL_NAME}`,
  description:
    'Everywhere you can find me online, from code and design profiles to social and media accounts.',
  imageAlt: `Links - ${FULL_NAME}`,
  ogTitle: 'Everywhere else you can find me online.',
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

export const domainsSeoContent: SeoContent = {
  title: `Registered Domains | ${FULL_NAME}`,
  description:
    'The domains registered under my name, the ones with something behind them and the ones still waiting for an idea worth the renewal fee.',
  imageAlt: `Registered Domains - ${FULL_NAME}`,
  ogTitle: 'Every domain I have talked myself into buying.',
}

export const changelogSeoContent: SeoContent = {
  title: `Changelog | ${FULL_NAME}`,
  description:
    'A running log of every update shipped to this site, pulled straight from the GitHub commit history. This website is a product and these are its release notes.',
  imageAlt: `Changelog - ${FULL_NAME}`,
  ogTitle: 'Every update shipped to this site.',
}

export const photosSeoContent: SeoContent = {
  title: `Photos | ${FULL_NAME}`,
  description:
    'A small collection of photos I have taken. Mostly just proof that I step away from my keyboard sometimes.',
  imageAlt: `Photos - ${FULL_NAME}`,
  ogTitle: 'A small collection of photos I have taken.',
}
