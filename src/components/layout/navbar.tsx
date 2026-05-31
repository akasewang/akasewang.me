'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icons } from '@/components/ui/icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { navbarContent } from '@/data/content/layout-content'
import { cn } from '@/utils/utils'

const NAV_ITEMS = [
  { href: '/blogs', label: navbarContent.blogs, Icon: Icons.blogs },
  { href: '/projects', label: navbarContent.projects, Icon: Icons.projects },
  { href: '/components', label: navbarContent.components, Icon: Icons.components },
  { href: '/photos', label: navbarContent.photos, Icon: Icons.photos },
]

const ICON_BUTTON_STYLES =
  'relative flex size-8 items-center justify-center rounded-lg bg-transparent text-secondary ring-1 ring-transparent retina:ring-[0.5px] transition-[background-color,color,transform,scale,opacity,box-shadow] duration-300 hover:bg-accent hover:ring-accent-border hover:text-primary active:scale-[0.95] active:duration-200'

/**
 * Global navigation header.
 * Uses fixed positioning on desktop and absolute on mobile to stay out of the document flow.
 * Monitors `usePathname` to dynamically style the active route link.
 */
export function Navbar() {
  const pathname = usePathname()

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
            {}
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
                <Link
                  href="/feed.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="RSS Feed"
                  className={cn(ICON_BUTTON_STYLES, 'hidden md:flex', '-ml-[5px]')}
                >
                  <Icons.rss className="size-[22px]" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">RSS Feed</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </nav>
  )
}
