export interface NavbarContent {
  home: string
  blogs: string
  projects: string
  photos: string
  experiments: string
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

export interface SocialLink {
  href: string
  label: string
  display: string
}

export interface SharedContent {
  more: string
  less: string
}

export interface ViewsContent {
  offline: string
  visitors: string
  views: string
  title: string
}

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
