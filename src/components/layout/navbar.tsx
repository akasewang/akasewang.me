'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icons } from '@/components/ui/icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { SITE, USERNAME } from '@/constants/constants'
import { navbarContent } from '@/data/content/layout-content'
import { useAudioPreference } from '@/hooks/use-audio-preference'
import { useGithubStars } from '@/hooks/use-github-stars'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

const NAV_ITEMS = [
  { href: '/blogs', label: navbarContent.blogs, Icon: Icons.blogs },
  { href: '/projects', label: navbarContent.projects, Icon: Icons.projects },
  { href: '/photos', label: navbarContent.photos, Icon: Icons.photos },
]

const ICON_BUTTON_STYLES =
  'relative flex size-8 items-center justify-center rounded-lg bg-transparent text-secondary ring-1 ring-transparent transition-[background-color,color,transform,scale,opacity,box-shadow] duration-300 supports-hover:hover:bg-accent supports-hover:hover:text-primary supports-hover:hover:ring-accent-border active:bg-accent active:text-primary active:ring-accent-border active:scale-[0.95] active:duration-200 retina:ring-[0.5px]'

export function Navbar() {
  const { isAudioEnabled, setAudioEnabled } = useAudioPreference()
  const { hoverLink, navigate: navigateSound, toggle } = useSoundEffects()
  const pathname = usePathname()
  const {
    count: githubStars,
    shortCount: formattedStarsShort,
    fullCount: formattedStarsFull,
  } = useGithubStars()
  const githubUrl = `https://github.com/${USERNAME}/${SITE}`

  const handleAudioToggle = () => {
    const nextAudioEnabled = !isAudioEnabled

    if (nextAudioEnabled) {
      setAudioEnabled(true)
      toggle(true)
      return
    }

    toggle(false)
    setAudioEnabled(false)
  }

  useKeyboardShortcut('f1', handleAudioToggle)

  useKeyboardShortcut('g', () => {
    navigateSound()
    window.open(githubUrl, '_blank', 'noopener,noreferrer')
  })

  useKeyboardShortcut('r', () => {
    navigateSound()
    window.open('/feed.xml', '_blank', 'noopener,noreferrer')
  })

  const AudioIcon = isAudioEnabled ? Icons.volumeUp : Icons.volumeMute

  return (
    <nav className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto px-8 py-6">
        <div className="flex items-center justify-between md:justify-end">
          <Link
            href="/"
            aria-label={navbarContent.home}
            onMouseEnter={hoverLink}
            onClick={navigateSound}
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
                onMouseEnter={hoverLink}
                onClick={navigateSound}
                className={cn(
                  'relative flex h-8 shrink-0 items-center justify-center text-sm font-medium transition-colors duration-300',
                  pathname === href
                    ? 'text-primary'
                    : 'text-secondary supports-hover:hover:text-primary active:text-primary',
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
                  onMouseEnter={hoverLink}
                  onClick={navigateSound}
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
                <button
                  type="button"
                  aria-label={isAudioEnabled ? 'Turn sound effects off' : 'Turn sound effects on'}
                  aria-pressed={isAudioEnabled}
                  aria-keyshortcuts="f1"
                  onMouseEnter={hoverLink}
                  onClick={handleAudioToggle}
                  className={cn(ICON_BUTTON_STYLES, '-ml-[7px] md:-ml-[17px]')}
                >
                  <AudioIcon className="size-4.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" shortcut="F1">
                {isAudioEnabled ? 'Sound Effects On' : 'Sound Effects Off'}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="/feed.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="RSS Feed"
                  onMouseEnter={hoverLink}
                  onClick={navigateSound}
                  className={cn(ICON_BUTTON_STYLES, '-ml-[15px]')}
                >
                  <Icons.rss className="size-[22px]" />
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
