/** Every icon the menu can draw, named by what it stands for rather than by the glyph */
export type CommandIconName =
  | 'home'
  | 'blogs'
  | 'projects'
  | 'photos'
  | 'skills'
  | 'catalog'
  | 'messageBoard'
  | 'newsletter'
  | 'changelog'
  | 'link'
  | 'github'
  | 'rss'
  | 'mail'
  | 'copy'
  | 'sound'
  | 'soundOff'

/** The entries that do something in place rather than going anywhere */
export type CommandActionId = 'toggle-sound' | 'copy-link' | 'copy-email'

/**
 * One row in the menu. An item either goes somewhere, through href, or does something, through
 * action. External marks an href that should open in a new tab.
 */
export interface CommandItem {
  id: string
  label: string
  icon: CommandIconName
  meta?: string
  keywords?: string[]
  href?: string
  external?: boolean
  action?: CommandActionId
}

/** A titled run of items, which is how the menu is split up */
export interface CommandGroup {
  id: string
  label: string
  items: CommandItem[]
}

/** Every string the menu renders, kept out of the components so the copy lives in one place */
export interface CommandContent {
  trigger: string
  title: string
  placeholder: string
  inputLabel: string
  closeLabel: string
  empty: string
  emptyHint: string
  groups: {
    pages: string
    blogs: string
    projects: string
    actions: string
    elsewhere: string
  }
  hints: {
    move: string
    open: string
    close: string
    openPage: string
    openPost: string
    openProject: string
    runAction: string
    openLink: string
  }
  actions: {
    soundOn: string
    soundOff: string
    copyLink: string
    copyEmail: string
  }
  toasts: {
    linkCopied: string
    emailCopied: string
    copyFailed: string
  }
}
