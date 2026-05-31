import type { LinkableSectionContent } from './site'
import { SKILL_CATEGORIES } from '@/constants/categories'

/**
 * Hero Section
 * Content schema for the top landing banner and intro text
 */
export interface HeroContent {
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
}

/** Testimonials */
export interface Testimonial {
  id: string
  quote: string
  author: string
  role?: string
  url?: string
  image?: string
}

export interface TestimonialRows {
  topRow: Testimonial[]
  bottomRow: Testimonial[]
}

/**
 * Skills & Technologies
 * Type definitions for tech stack badges and categorization
 */
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

/**
 * Landing Page Layout
 * High-level configuration tying all home sections together
 */
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
    featuredComponents: LinkableSectionContent
  }
}
