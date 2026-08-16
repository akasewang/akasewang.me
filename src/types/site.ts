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

/** The heading and standfirst at the top of a page, and the line that closes it */
export interface PageContent {
  title: string
  subtitle: string
  /** Shown by the page and by its loading state alike, so the two cannot say different things */
  footerText: string
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

/**
 * Any run of links under one heading, whatever they happen to be.
 *
 * The directory draws every row the same way, so what it needs from a group is a heading and the
 * links beneath it, not what kind of thing they are. A social group satisfies this as it stands.
 */
export interface LinkGroup {
  label: string
  /** An entry with no href is written out as plain text, for something held but not yet standing up */
  links: Array<{ href?: string; label: string }>
}

/**
 * A site in the wider ecosystem, sitting apart from the profiles.
 *
 * These are somewhere the work itself lives rather than an account on someone else's platform,
 * which is why they carry a line of their own: a reader deciding whether to follow one wants to
 * know what is behind it, where a profile only has to say which service it is on.
 */
export interface EcosystemSite {
  href: string
  label: string
  domain: string
  description: string
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
