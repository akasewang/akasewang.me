import type { CommandContent } from '@/types/command'

/** Every string the command menu renders, from its groups to its keyboard hints */
export const commandContent: CommandContent = {
  trigger: 'Search',
  title: 'Command palette',
  placeholder: 'search the archive',
  inputLabel: 'Search the site',
  closeLabel: 'Close command palette',
  empty: 'Nothing goes by that name.',
  emptyHint: 'Try a page, a post or a project.',
  groups: {
    pages: 'Pages',
    blogs: 'Blogs',
    projects: 'Projects',
    actions: 'Actions',
    elsewhere: 'Social Links',
  },
  hints: {
    move: 'move',
    open: 'open',
    close: 'close',
    openPage: 'go to page',
    openPost: 'read post',
    openProject: 'view project',
    runAction: 'run command',
    openLink: 'open link',
  },
  actions: {
    soundOn: 'Turn sound effects on',
    soundOff: 'Turn sound effects off',
    copyLink: 'Copy link to this page',
    copyEmail: 'Copy email address',
  },
  toasts: {
    linkCopied: 'Link copied to clipboard',
    emailCopied: 'Email copied to clipboard',
    copyFailed: 'Nothing could be copied',
  },
}
