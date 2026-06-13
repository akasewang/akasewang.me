import type { LinkableSectionContent } from './site'
import { SKILL_CATEGORIES } from '@/constants/categories'

/**
 * Hero Section
 * Content schema for the top landing banner and intro text.
 */
export interface HeroContent {
  /** Owner's first name. */
  firstName: string
  /** Owner's last name. */
  lastName: string
  /** Primary role label. */
  role: string
  /** Rotating role labels cycled in the hero. */
  roles: string[]
  /** Heading above the about paragraphs. */
  aboutTitle: string
  /** About paragraphs, one entry per paragraph. */
  about: string[]
  /** Label introducing the social links. */
  findMeOn: string
  /** Call to action text inviting visitors to connect. */
  connectText: string
  /** Label for the schedule a meeting action. */
  scheduleMeet: string
  /** Label linking to the message board. */
  messageBoard: string
  /** Label preceding the contact email. */
  mailMeAt: string
  /** Prefix shown before an inactive social link. */
  inactivePrefix: string
  /** Destination URL for the schedule a meeting action. */
  scheduleMeetUrl: string
}

/** A single testimonial quote with its attribution and optional link/avatar. */
export interface Testimonial {
  /** Stable unique identifier, used as a React key. */
  id: string
  /** The testimonial text. */
  quote: string
  /** Name of the person quoted. */
  author: string
  /** Optional role or title of the author. */
  role?: string
  /** Optional link to the author's profile or site. */
  url?: string
  /** Optional avatar image path. */
  image?: string
}

/** Testimonials split into two rows for the scrolling marquee wall. */
export interface TestimonialRows {
  /** Testimonials scrolling along the top row. */
  topRow: Testimonial[]
  /** Testimonials scrolling along the bottom row. */
  bottomRow: Testimonial[]
}

/**
 * Skills & Technologies
 * Type definitions for tech stack badges and categorization.
 */
export type SkillCategory = (typeof SKILL_CATEGORIES)[number]['value']

/** A single tech stack skill: its name, icon, optional link and category. */
export interface Skill {
  /** Stable unique identifier, used as a React key. */
  id: string
  /** Display name of the skill. */
  name: string
  /** Icon identifier or path for the badge. */
  icon: string
  /** Optional link to the technology's site. */
  url?: string
  /** Category the skill is grouped under. */
  category: SkillCategory
}

/** Skills split into two rows for the scrolling marquee. */
export interface SkillRows {
  /** Skills scrolling along the first row. */
  firstRow: Skill[]
  /** Skills scrolling along the second row. */
  secondRow: Skill[]
}

/**
 * Landing Page Layout
 * High level configuration tying all home sections together.
 */
export interface LandingPageContent {
  /** Hero banner content. */
  hero: HeroContent
  /** Section headings and the linkable section headers for the home page. */
  sections: {
    /** Experience section heading. */
    experience: string
    /** Volunteer section heading. */
    volunteer: string
    /** Education section heading. */
    education: string
    /** Certifications section heading. */
    certifications: string
    /** Achievements section heading. */
    achievements: string
    /** Bookmarks section heading. */
    bookmarks: string
    /** Featured projects section header with its view all link. */
    featuredProjects: LinkableSectionContent
    /** Featured posts section header with its view all link. */
    featuredPosts: LinkableSectionContent
  }
}
