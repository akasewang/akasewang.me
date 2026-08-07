import type { SOCIAL_CATEGORIES } from '@/constants/categories'

/** Copy for the navbar and its links */
export interface NavbarContent {
  home: string
  blogs: string
  projects: string
  photos: string
}

/** Copy for the site footer */
export interface FooterContent {
  ownerName: string
  license?: string
  licenseHref?: string
  changelogLabel?: string
  changelogHref?: string
}

/** Strings reused across pages, such as the labels on a show more toggle */
export interface CommonContent {
  pronounceName: string
  backToTop: string
}

/** The heading and standfirst at the top of a page */
export interface PageContent {
  title: string
  subtitle: string
}

/** A landing page section that links through to a fuller page of its own */
export interface LinkableSectionContent {
  title: string
  viewAll: string
}

/** What a page reports to search engines and share cards */
export interface SeoContent {
  title: string
  description: string
  imageAlt: string
  ogTitle: string
}

type SocialCategory = (typeof SOCIAL_CATEGORIES)[number]['value']

/** One profile elsewhere, grouped by the kind of place it is */
export interface SocialLink {
  href: string
  label: string
  category: SocialCategory
}

/** Social links gathered under one heading, built from the category list */
export interface SocialGroup {
  value: SocialCategory
  label: string
  links: SocialLink[]
}

/** Strings that belong to no single page */
export interface SharedContent {
  more: string
  less: string
}

/** Copy for the view counter, including what it says when the count cannot be read */
export interface ViewsContent {
  offline: string
  sessions: string
  views: string
  visits: string
  title: string
}

/** Every toast the site can raise, grouped by what raised it */
export interface ToastMessages {
  newsletter: {
    broadcastSuccess: (count: number) => string
    unexpectedError: string
    unauthorized: string
    postNotFound: string
    noSubscribers: string
    broadcastError: string
    partialBroadcast: (sent: number, total: number) => string
    otpSent: string
    otpUnavailable: string
    otpSenderUnavailable: string
    otpEmailRequired: string
    otpEmailInvalid: string
    otpSendFailed: string
  }
  messageBoard: {
    success: string
    adminLogin: string
    connectionError: string
    botDetected: string
    invalidName: string
    invalidMessage: string
    messageTooLong: string
    rateLimit: string
    genericError: string
    deleteError: string
    replyError: string
  }
  subscribe: {
    successNew: string
    successReturning: string
    invalidEmail: string
    alreadySubscribed: string
    internalError: string
    wait: string
  }
}

interface LinkItem {
  text: string
  url: string
  prefix?: string
  suffix?: string
}

/**
 * One entry in a timeline, such as a job or a course. The end date is optional, its absence being
 * what marks an entry as still ongoing.
 */
export interface TimelineItemProps {
  id: string
  title: string
  links?: LinkItem[]
  startDate: string
  endDate?: string
  description?: string[]
  tech?: string[]
  defaultExpanded?: boolean
}
