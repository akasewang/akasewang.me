'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { SocialShare } from '@/components/common/mdx-components/social-share'
import { CopyButton } from '@/components/ui/copy-button'
import { Icons } from '@/components/ui/icons'
import { Link } from '@/components/ui/route-link'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { markSiblingDirection } from '@/utils/route-direction'
import { cn } from '@/utils/utils'

interface NavItem {
  slug: string
  title: string
}

interface SlugNavigationProps {
  prev?: NavItem
  next?: NavItem
  basePath: string
  content: string
  url?: string
  title?: string
}

const BUTTON_BASE_STYLES =
  'relative flex size-8 items-center justify-center rounded-lg bg-transparent text-secondary ring-1 ring-transparent retina:ring-[0.5px] transition-[background-color,color,transform,scale,box-shadow] duration-300'
const BUTTON_ACTIVE_STYLES =
  'supports-hover:hover:bg-accent supports-hover:hover:ring-accent-border supports-hover:hover:text-primary active:bg-accent active:ring-accent-border active:text-primary active:scale-[0.95] active:duration-200'
const BUTTON_DISABLED_STYLES = 'cursor-not-allowed opacity-20'

/**
 * The controls beside a post's title: copy its source, share it, and step to the one either side.
 *
 * The arrow keys move between siblings too, and the direction is recorded first so the page slides
 * the way the reader asked to go.
 */
export function SlugNavigation({ prev, next, basePath, content, url, title }: SlugNavigationProps) {
  const {
    navigate: navigateSound,
    hoverTick,
    success: successSound,
    error: errorSound,
  } = useSoundEffects()
  const router = useRouter()
  const pathname = usePathname()
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  /** Copies the post's own markdown rather than the rendered page, source and all */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      successSound()
      setCopied(true)
      toast.success('MDX copied to clipboard')

      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setCopied(false), 1500)
    } catch {
      errorSound()
      toast.error('Failed to copy MDX')
    }
  }

  const navigateTo = (item: NavItem | undefined, direction: 1 | -1) => {
    if (!item) return

    /**
     * Recorded before the push, since two posts are siblings and the router alone cannot tell
     * which way the reader went. The page transition reads this to slide the right way.
     */
    const href = `${basePath}/${item.slug}`
    markSiblingDirection(direction, pathname, href)
    navigateSound()
    router.push(href, { scroll: false })
  }

  useKeyboardShortcut('c', handleCopy, { shiftKey: true })
  useKeyboardShortcut('arrowleft', () => navigateTo(prev, -1))
  useKeyboardShortcut('arrowright', () => navigateTo(next, 1))

  const renderNavButton = (item: NavItem | undefined, direction: 'prev' | 'next') => {
    const Icon = direction === 'prev' ? Icons.arrowBack : Icons.arrowForward

    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href={item ? `${basePath}/${item.slug}` : ''}
              className={cn(
                BUTTON_BASE_STYLES,
                item ? BUTTON_ACTIVE_STYLES : BUTTON_DISABLED_STYLES,
              )}
              onClick={(e) => {
                if (!item) e.preventDefault()
                else {
                  markSiblingDirection(
                    direction === 'next' ? 1 : -1,
                    pathname,
                    `${basePath}/${item.slug}`,
                  )
                  navigateSound()
                }
              }}
              onMouseEnter={item ? hoverTick : undefined}
              aria-disabled={!item}
            >
              <Icon size={18} />
            </Link>
          }
        />
        {item && (
          <TooltipContent side="bottom" align="center" sideOffset={6} shortcut={<Icon size={10} />}>
            <span className="max-w-50 line-clamp-1">{item.title}</span>
          </TooltipContent>
        )}
      </Tooltip>
    )
  }

  return (
    <div className="hidden md:flex items-center gap-1.5 shrink-0">
      <Tooltip>
        <TooltipTrigger
          render={
            <CopyButton
              value={content}
              copied={copied}
              iconSize={18}
              className={cn(BUTTON_BASE_STYLES, BUTTON_ACTIVE_STYLES)}
              onClick={handleCopy}
              aria-label="Copy content"
            />
          }
        />
        <TooltipContent side="bottom" align="center" sideOffset={6} shortcut={['Shift', 'C']}>
          Copy content
        </TooltipContent>
      </Tooltip>

      {url && title && <SocialShare url={url} title={title} />}

      <div className="mx-1 h-4 border-l border-border retina:border-l-[0.5px]" />

      {renderNavButton(prev, 'prev')}
      {renderNavButton(next, 'next')}
    </div>
  )
}
