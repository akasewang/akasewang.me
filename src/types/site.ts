/**
 * Global Layout & Navigation
 * Top level structure for navbars, footers and general page layouts.
 */

/** Navbar link labels for the primary routes. */
export interface NavbarContent {
  /** Home link label. */
  home: string
  /** Blogs link label. */
  blogs: string
  /** Projects link label. */
  projects: string
  /** Photos link label. */
  photos: string
  /** Changelog link label. */
  changelog: string
}

/** Footer attribution and optional license link. */
export interface FooterContent {
  /** Site owner's name, shown in the copyright line. */
  ownerName: string
  /** Optional content license name. */
  license?: string
  /** Optional URL the license name links to. */
  licenseHref?: string
  /** Optional changelog link label. */
  changelogLabel?: string
  /** Optional changelog link destination. */
  changelogHref?: string
}

/** Shared UI labels reused across pages (name pronunciation, back to top). */
export interface CommonContent {
  /** Accessible label for the name pronunciation control. */
  pronounceName: string
  /** Label for the back to top control. */
  backToTop: string
}

/** Copy and destination for the top announcement banner. */
export interface AnnouncementBannerContent {
  /** Banner message text. */
  message: string
  /** Destination URL the banner links to. */
  href: string
  /** Accessible label for the dismiss button. */
  dismissLabel: string
}

/** Generic page header copy (title + subtitle). */
export interface PageContent {
  /** Page heading. */
  title: string
  /** Page subheading. */
  subtitle: string
}

/** A section header with a "view all" link to its full listing. */
export interface LinkableSectionContent {
  /** Section heading. */
  title: string
  /** Label for the link to the full listing. */
  viewAll: string
}

/**
 * SEO & Social Sharing
 * Types for metadata, open graph and social links.
 */

/** Page metadata used to build `<head>` tags and open graph cards. */
export interface SeoContent {
  /** Page title tag. */
  title: string
  /** Meta description. */
  description: string
  /** Alt text for the open graph image. */
  imageAlt: string
  /** Title rendered onto the generated open graph image. */
  ogTitle: string
}

/** A social profile link: destination, accessible label and display text. */
export interface SocialLink {
  /** Destination URL. */
  href: string
  /** Accessible label for the link. */
  label: string
  /** Visible display text. */
  display: string
}

/** Shared "show more / show less" toggle labels. */
export interface SharedContent {
  /** Expand label. */
  more: string
  /** Collapse label. */
  less: string
}

/**
 * Metrics & View Counters
 * Content types for the views counter UI component.
 */

/** Labels for the view/visitor counter, including its offline state. */
export interface ViewsContent {
  /** Label shown when counts cannot load. */
  offline: string
  /** Label for the unique visitors metric. */
  visitors: string
  /** Label for the page views metric. */
  views: string
  /** Accessible title for the counter. */
  title: string
}

/**
 * Toast Notifications
 * Centralized dictionary of status messages and errors for the app.
 */

/** Toast copy grouped by feature (newsletter, message board, subscribe). */
export interface ToastMessages {
  /** Newsletter and admin broadcast toasts. */
  newsletter: {
    /** Subscription succeeded. */
    success: string
    /** Subscription failed. */
    error: string
    /** Builds the broadcast success message from the recipient count. */
    broadcastSuccess: (count: number) => string
    /** Admin password was missing. */
    passwordRequired: string
    /** An unexpected error occurred. */
    unexpectedError: string
    /** Admin password was rejected. */
    unauthorized: string
    /** The selected post could not be found. */
    postNotFound: string
    /** There are no subscribers to broadcast to. */
    noSubscribers: string
    /** The broadcast send failed. */
    broadcastError: string
  }
  /** Message board and admin moderation toasts. */
  messageBoard: {
    /** Message posted successfully. */
    success: string
    /** Posting the message failed. */
    error: string
    /** Admin logged in. */
    adminLogin: string
    /** Admin logged out. */
    adminLogout: string
    /** A network or connection error occurred. */
    connectionError: string
    /** The honeypot flagged the submission as a bot. */
    botDetected: string
    /** The name field was invalid. */
    invalidName: string
    /** The message field was invalid. */
    invalidMessage: string
    /** The message exceeded the length limit. */
    messageTooLong: string
    /** The sender hit the rate limit. */
    rateLimit: string
    /** A generic fallback error. */
    genericError: string
    /** Deleting a message failed. */
    deleteError: string
    /** Posting an admin reply failed. */
    replyError: string
  }
  /** Email subscription toasts. */
  subscribe: {
    /** A new email was subscribed. */
    successNew: string
    /** A returning email re-subscribed. */
    successReturning: string
    /** The email address was invalid. */
    invalidEmail: string
    /** The email was already subscribed. */
    alreadySubscribed: string
    /** An internal error occurred. */
    internalError: string
    /** The sender hit the rate limit and should wait. */
    wait: string
  }
}

/**
 * Chronological Data & Timelines
 * Reusable type definitions for representing any chronological event across the application.
 */

/** A labelled link with optional surrounding text, used in timeline entries. */
export interface LinkItem {
  /** Visible link text. */
  text: string
  /** Destination URL. */
  url: string
  /** Optional text shown before the link. */
  prefix?: string
  /** Optional text shown after the link. */
  suffix?: string
}

/** Props for a single timeline entry (experience, education, etc.) and its expandable body. */
export interface TimelineItemProps {
  /** Unique id, used as the anchor target for scrolling. */
  id: string
  /** Primary heading (job title, degree and so on). */
  title: string
  /** Optional links shown under the title. */
  links?: LinkItem[]
  /** Start date string. */
  startDate: string
  /** Optional end date string, omitted for ongoing entries. */
  endDate?: string
  /** Optional body lines, where dashed entries render as bullets. */
  description?: string[]
  /** Optional technology tags. */
  tech?: string[]
  /** Whether the body starts expanded. */
  defaultExpanded?: boolean
}
