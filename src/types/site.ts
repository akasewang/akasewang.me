/**
 * Global Layout & Navigation
 * Top level structure for navbars, footers and general page layouts.
 */

/** Navbar link labels for the primary routes. */
export interface NavbarContent {
  home: string
  blogs: string
  projects: string
  components: string
  photos: string
}

/** Footer attribution and optional license link. */
export interface FooterContent {
  ownerName: string
  license?: string
  licenseHref?: string
}

/** Shared UI labels reused across pages (name pronunciation, back to top). */
export interface CommonContent {
  pronounceName: string
  backToTop: string
}

/** Copy and destination for the top announcement banner. */
export interface AnnouncementBannerContent {
  message: string
  href: string
  dismissLabel: string
}

/** Generic page header copy (title + subtitle). */
export interface PageContent {
  title: string
  subtitle: string
}

/** A section header with a "view all" link to its full listing. */
export interface LinkableSectionContent {
  title: string
  viewAll: string
}

/**
 * SEO & Social Sharing
 * Types for metadata, open graph and social links.
 */

/** Page metadata used to build `<head>` tags and open graph cards. */
export interface SeoContent {
  title: string
  description: string
  imageAlt: string
  ogTitle: string
}

/** A social profile link: destination, accessible label and display text. */
export interface SocialLink {
  href: string
  label: string
  display: string
}

/** Shared "show more / show less" toggle labels. */
export interface SharedContent {
  more: string
  less: string
}

/**
 * Metrics & View Counters
 * Content types for the views counter UI component.
 */

/** Labels for the view/visitor counter, including its offline state. */
export interface ViewsContent {
  offline: string
  visitors: string
  views: string
  title: string
}

/**
 * Toast Notifications
 * Centralized dictionary of status messages and errors for the app.
 */

/** Toast copy grouped by feature (newsletter, message board, subscribe). */
export interface ToastMessages {
  newsletter: {
    success: string
    error: string
    broadcastSuccess: (count: number) => string
    passwordRequired: string
    unexpectedError: string
    unauthorized: string
    postNotFound: string
    noSubscribers: string
    broadcastError: string
  }
  messageBoard: {
    success: string
    error: string
    adminLogin: string
    adminLogout: string
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

/**
 * Chronological Data & Timelines
 * Reusable type definitions for representing any chronological event across the application.
 */

/** A labelled link with optional surrounding text, used in timeline entries. */
export interface LinkItem {
  text: string
  url: string
  prefix?: string
  suffix?: string
}

/** Props for a single timeline entry (experience, education, etc.) and its expandable body. */
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
