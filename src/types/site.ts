/**
 * Global Layout & Navigation
 * Top-level structure for navbars, footers, and general page layouts
 */
export interface NavbarContent {
  home: string
  blogs: string
  projects: string
  components: string
  photos: string
}

export interface FooterContent {
  ownerName: string
  license?: string
  licenseHref?: string
}

export interface CommonContent {
  pronounceName: string
  backToTop: string
}

export interface PageContent {
  title: string
  subtitle: string
}

export interface LinkableSectionContent {
  title: string
  viewAll: string
}

/**
 * SEO & Social Sharing
 * Types for metadata, open graph, and social links
 */
export interface SeoContent {
  title: string
  description: string
  imageAlt: string
  ogTitle: string
}

export interface SocialLink {
  href: string
  label: string
  display: string
}

export interface SharedContent {
  more: string
  less: string
}

/**
 * Metrics & View Counters
 * Content types for the views counter UI component
 */
export interface ViewsContent {
  offline: string
  visitors: string
  views: string
  title: string
}

/**
 * Toast Notifications
 * Centralized dictionary of status messages and errors for the app
 */
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
 * Reusable type definitions for representing any chronological event across the application
 */
export interface LinkItem {
  text: string
  url: string
  prefix?: string
  suffix?: string
}

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
