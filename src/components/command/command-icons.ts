import { Icons } from '@/components/ui/icons'
import type { CommandIconName } from '@/types/command'

/** Maps each icon name a menu entry can carry to the icon that draws it */
export const commandIcons: Record<CommandIconName, typeof Icons.blogs> = {
  home: Icons.home,
  blogs: Icons.blogs,
  projects: Icons.projects,
  photos: Icons.photos,
  skills: Icons.skills,
  catalog: Icons.catalog,
  messageBoard: Icons.messageBoard,
  newsletter: Icons.newsletter,
  changelog: Icons.gitCommit,
  link: Icons.link,
  github: Icons.github,
  rss: Icons.rss,
  mail: Icons.mail,
  copy: Icons.copy,
  sound: Icons.volumeUp,
  soundOff: Icons.volumeMute,
}
