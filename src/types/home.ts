import type { SKILL_CATEGORIES } from '@/constants/categories'
import type { LinkableSectionContent } from './site'

/** Every string in the opening block, so the copy lives in the content files rather than the markup */
interface HeroContent {
  firstName: string
  lastName: string
  role: string
  roles: string[]
  aboutTitle: string
  about: string[]
  findMeOn: string
  connectText: string
  scheduleMeet: string
  messageBoard: string
  mailMeAt: string
  scheduleMeetUrl: string
  designsLabel: string
  designsUrl: string
}

/** One quote on the landing page, with the person it came from */
export interface Testimonial {
  id: string
  quote: string
  author: string
  role?: string
  url?: string
  image?: string
  verified?: boolean
}

/** Split into two rows so each can scroll in its own direction */
export interface TestimonialRows {
  topRow: Testimonial[]
  bottomRow: Testimonial[]
}

type SkillCategory = (typeof SKILL_CATEGORIES)[number]['value']
/** One entry in the skills grid, keyed to an icon file by name */
export interface Skill {
  id: string
  name: string
  icon: string
  url?: string
  category: SkillCategory
}

/** Split into two rows so each can scroll in its own direction */
export interface SkillRows {
  firstRow: Skill[]
  secondRow: Skill[]
}

/** Every string and list the landing page renders, section by section */
export interface LandingPageContent {
  hero: HeroContent
  sections: {
    experience: string
    technicalTraining: string
    volunteer: string
    education: string
    certifications: string
    achievements: string
    bookmarks: string
    featuredProjects: LinkableSectionContent
    featuredPosts: LinkableSectionContent
  }
}
