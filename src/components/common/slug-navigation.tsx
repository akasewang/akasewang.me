'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { SocialShare } from '@/components/common/mdx-components/social-share'
import { CopyButton } from '@/components/ui/copy-button'
import { Icons } from '@/components/ui/icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

/** A single prev/next navigation target (slug + title). */
interface NavItem {
  slug: string
  title: string
}

/** Props for {@link SlugNavigation}. */
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
  'hover:bg-accent hover:ring-accent-border hover:text-primary active:scale-[0.95] active:duration-200'
const BUTTON_DISABLED_STYLES = 'cursor-not-allowed opacity-20'

/**
 * A combined navigation and utility toolbar displayed on detailed content pages (like individual blog posts).
 * Features previous/next content navigation, a "copy raw content" button and a social sharing dropdown.
 * Includes global keyboard shortcuts (Left/Right arrows for nav, 'C' for copy).
 *
 * @param prev - Navigation item data for the preceding content.
 * @param next - Navigation item data for the succeeding content.
 * @param basePath - The base URL path (e.g., '/blog') for constructing navigation links.
 * @param content - The raw string content (usually Markdown/MDX) to be copied to the clipboard.
 * @param url - The absolute URL of the current page, passed to the SocialShare component.
 * @param title - The title of the current page, passed to the SocialShare component.
 */
export function SlugNavigation({ prev, next, basePath, content, url, title }: SlugNavigationProps) {
  const {
    navigate: navigateSound,
    hoverTick,
    success: successSound,
    error: errorSound,
  } = useSoundEffects()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      successSound()
      setCopied(true)
      toast.success('MDX content copied to clipboard')

      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setCopied(false), 1500)
    } catch {
      errorSound()
      toast.error('Failed to copy MDX content')
    }
  }

  const navigateTo = (item?: NavItem) => {
    if (item) {
      navigateSound()
      router.push(`${basePath}/${item.slug}`)
    }
  }

  useKeyboardShortcut('C', handleCopy)
  useKeyboardShortcut('arrowleft', () => navigateTo(prev))
  useKeyboardShortcut('arrowright', () => navigateTo(next))

  const renderNavButton = (item: NavItem | undefined, direction: 'prev' | 'next') => {
    const Icon = direction === 'prev' ? Icons.arrowBack : Icons.arrowForward

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item ? `${basePath}/${item.slug}` : ''}
            className={cn(BUTTON_BASE_STYLES, item ? BUTTON_ACTIVE_STYLES : BUTTON_DISABLED_STYLES)}
            onClick={(e) => {
              if (!item) e.preventDefault()
              else navigateSound()
            }}
            onMouseEnter={item ? hoverTick : undefined}
            aria-disabled={!item}
          >
            <Icon size={18} />
          </Link>
        </TooltipTrigger>
        {item && (
          <TooltipContent side="bottom" align="center" sideOffset={6} shortcut={<Icon size={10} />}>
            <span className="max-w-[200px] line-clamp-1">{item.title}</span>
          </TooltipContent>
        )}
      </Tooltip>
    )
  }

  return (
    <div className="hidden md:flex items-center gap-1.5 shrink-0">
      <Tooltip>
        <TooltipTrigger asChild>
          <CopyButton
            value={content}
            copied={copied}
            iconSize={18}
            className={cn(BUTTON_BASE_STYLES, BUTTON_ACTIVE_STYLES)}
            onClick={handleCopy}
            aria-label="Copy content"
          />
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center" sideOffset={6} shortcut="C">
          Copy content
        </TooltipContent>
      </Tooltip>

      {url && title && <SocialShare url={url} title={title} />}

      <div className="mx-1 h-4 border-l border-border" />

      {renderNavButton(prev, 'prev')}
      {renderNavButton(next, 'next')}
    </div>
  )
}
