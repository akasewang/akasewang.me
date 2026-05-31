'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import { useGithubStars } from '@/hooks/use-github-stars'
import { Icons } from '@/components/ui/icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { navbarContent } from '@/data/content/layout-content'
import { USERNAME, SITE } from '@/constants/constants'
import { cn } from '@/utils/utils'

const NAV_ITEMS = [
  { href: '/blogs', label: navbarContent.blogs, Icon: Icons.blogs },
  { href: '/projects', label: navbarContent.projects, Icon: Icons.projects },
  { href: '/components', label: navbarContent.components, Icon: Icons.components },
  { href: '/photos', label: navbarContent.photos, Icon: Icons.photos },
]

const ICON_BUTTON_STYLES =
  'relative flex size-8 items-center justify-center rounded-lg bg-transparent text-secondary ring-1 ring-transparent transition-[background-color,color,transform,scale,opacity,box-shadow] duration-300 hover:bg-accent hover:text-primary hover:ring-accent-border active:scale-[0.95] active:duration-200 retina:ring-[0.5px]'

/**
 * Global navigation header.
 * Uses fixed positioning on desktop and absolute on mobile to stay out of the document flow.
 * Monitors `usePathname` to dynamically style the active route link.
 */
export function Navbar() {
  const pathname = usePathname()
  const {
    count: githubStars,
    shortCount: formattedStarsShort,
    fullCount: formattedStarsFull,
  } = useGithubStars()
  const githubUrl = `https://github.com/${USERNAME}/${SITE}`

  useKeyboardShortcut('g', () => {
    window.open(githubUrl, '_blank', 'noopener,noreferrer')
  })

  useKeyboardShortcut('r', () => {
    window.open('/feed.xml', '_blank', 'noopener,noreferrer')
  })

  return (
    <nav className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto px-8 py-6">
        <div className="flex items-center justify-between md:justify-end">
          <Link
            href="/"
            aria-label={navbarContent.home}
            className="relative flex h-8 shrink-0 items-center justify-center text-primary transition-colors duration-300 md:fixed md:left-8 md:top-6"
          >
            <Icons.initials className="size-9" />
          </Link>

          <div className="flex items-center gap-4 md:gap-5">
            {NAV_ITEMS.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                aria-label={label}
                className={cn(
                  'relative flex h-8 shrink-0 items-center justify-center text-sm font-medium transition-colors duration-300',
                  pathname === href ? 'text-primary' : 'text-secondary hover:text-primary',
                )}
              >
                <span className="hidden md:block">{label}</span>
                <Icon className="size-4.5 md:hidden" />
              </Link>
            ))}

            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Repository"
                  className={cn(
                    ICON_BUTTON_STYLES,
                    'hidden md:flex',
                    '-ml-[10px]',
                    githubStars !== null && 'w-auto px-2.5',
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <Icons.github className="size-4.5" />
                    {formattedStarsShort !== null && (
                      <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                        {formattedStarsShort}
                      </span>
                    )}
                  </div>
                </a>
              </TooltipTrigger>
              <TooltipContent side="bottom" shortcut="G">
                {formattedStarsFull !== null ? `${formattedStarsFull} Stars` : 'Source Code'}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="/feed.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="RSS Feed"
                  className={cn(ICON_BUTTON_STYLES, '-ml-[5px] md:-ml-[15px]')}
                >
                  <Icons.rss className="size-[21.5px]" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="bottom" shortcut="R">
                RSS Feed
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </nav>
  )
}
