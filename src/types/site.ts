import type { SOCIAL_CATEGORIES } from '@/constants/categories'

export interface NavbarContent {
  home: string
  blogs: string
  projects: string
  photos: string
}

export interface FooterContent {
  ownerName: string
  license?: string
  licenseHref?: string
  changelogLabel?: string
  changelogHref?: string
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

export interface SeoContent {
  title: string
  description: string
  imageAlt: string
  ogTitle: string
}

type SocialCategory = (typeof SOCIAL_CATEGORIES)[number]['value']

export interface SocialLink {
  href: string
  label: string
  category: SocialCategory
}

export interface SocialGroup {
  value: SocialCategory
  label: string
  links: SocialLink[]
}

export interface SharedContent {
  more: string
  less: string
}

export interface ViewsContent {
  offline: string
  sessions: string
  views: string
  title: string
}

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
    otpEmailRequired: string
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
