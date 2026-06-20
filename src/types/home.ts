import type { SKILL_CATEGORIES } from '@/constants/categories'
import type { LinkableSectionContent } from './site'

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
  inactivePrefix: string
  scheduleMeetUrl: string
  designsLabel: string
  designsUrl: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  role?: string
  url?: string
  image?: string
  verified?: boolean
}

export interface TestimonialRows {
  topRow: Testimonial[]
  bottomRow: Testimonial[]
}

export type SkillCategory = (typeof SKILL_CATEGORIES)[number]['value']
export interface Skill {
  id: string
  name: string
  icon: string
  url?: string
  category: SkillCategory
}

export interface SkillRows {
  firstRow: Skill[]
  secondRow: Skill[]
}

export interface LandingPageContent {
  hero: HeroContent
  sections: {
    experience: string
    volunteer: string
    education: string
    certifications: string
    achievements: string
    bookmarks: string
    featuredProjects: LinkableSectionContent
    featuredPosts: LinkableSectionContent
  }
}
