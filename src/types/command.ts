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
  | 'globe'
  | 'aperture'
  | 'blueprint'
  | 'terminalWindow'
  | 'target'
  | 'shieldCheck'
  | 'userCircle'
  | 'usersThree'
  | 'cardholder'
  | 'circlesFour'
  | 'cow'
  | 'cube'
  | 'at'
  | 'monitorPlay'

/** The entries that do something in place rather than going anywhere */
export type CommandActionId = 'toggle-sound' | 'copy-link' | 'copy-email'

/**
 * Fields shared by every row. The variants below make destinations, actions and section drill-downs
 * mutually exclusive, so an ambiguous command cannot enter the menu unnoticed.
 */
interface CommandItemBase {
  id: string
  label: string
  /** Left out to take the group's icon, or the icon of the section the group sits in */
  icon?: CommandIconName
  meta?: string
  excerpt?: string
  keywords?: string[]
}

/** The three kinds of row, told apart by kind: one goes somewhere, one does something, one opens a
 * group of its own */
interface CommandLinkItem extends CommandItemBase {
  kind: 'link'
  href: string
  external?: boolean
  visitSlug?: string
}

interface CommandActionItem extends CommandItemBase {
  kind: 'action'
  action: CommandActionId
}

interface CommandSectionItem extends CommandItemBase {
  kind: 'section'
  sectionId: string
}

/** What pressing Enter can actually carry out, as against a section which only moves the view */
export type CommandExecutableItem = CommandLinkItem | CommandActionItem
export type CommandItem = CommandExecutableItem | CommandSectionItem

/** A titled run of items, which is how the menu is split up */
export interface CommandGroup {
  id: string
  label: string
  items: CommandItem[]
  parentGroupId?: string
  /** What the top level row calls this, where the group's own heading names only its direct rows */
  sectionLabel?: string
  /** The icon its rows fall back to, itself falling back to the section's */
  icon?: CommandIconName
}

/** Every string the menu renders, kept out of the components so the copy lives in one place */
export interface CommandContent {
  trigger: string
  title: string
  placeholder: string
  inputLabel: string
  closeLabel: string
  empty: string
  groups: {
    sections: string
    pages: string
    blogs: string
    projects: string
    actions: string
    ecosystem: string
    domains: string
    elsewhere: string
    site: string
    code: string
    design: string
    practice: string
    security: string
    connections: string
    social: string
    media: string
  }
  hints: {
    move: string
    open: string
    close: string
    back: string
    openSection: string
    openPage: string
    openPost: string
    openProject: string
    runAction: string
    openSite: string
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
