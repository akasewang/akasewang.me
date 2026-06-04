'use client'

import { useState, useMemo } from 'react'

import { toast } from 'sonner'
import { Icons } from '@/components/ui/icons'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { cn } from '@/utils/utils'
import { USERNAME } from '@/constants/constants'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

interface SocialShareProps {
  url: string
  title: string
  className?: string
}

type ShareOption = {
  name: string
  icon: typeof Icons.x
  actionText?: string
}

const SHARE_NETWORKS: ShareOption[] = [
  { name: 'X', icon: Icons.x },
  { name: 'LinkedIn', icon: Icons.linkedin },
  { name: 'Reddit', icon: Icons.reddit },
  { name: 'Hacker News', icon: Icons.hackerNews },
  { name: 'Facebook', icon: Icons.facebook },
  { name: 'WhatsApp', icon: Icons.whatsapp, actionText: 'share via' },
  { name: 'Email', icon: Icons.mail, actionText: 'share via' },
]

const getShareUrl = (network: string, url: string, title: string) => {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  switch (network) {
    case 'X':
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(`Just finished reading "${title}" by @${USERNAME}, some really interesting points in this one, highly recommend checking it out`)}`
    case 'LinkedIn':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    case 'Reddit':
      return `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`
    case 'Hacker News':
      return `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`
    case 'Facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    case 'WhatsApp':
      return `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} — ${url}`)}`
    case 'Email':
      return `mailto:?subject=${encodedTitle}&body=${encodedUrl}`
    default:
      return '#'
  }
}

/**
 * Includes a native "Copy Link" fallback with clipboard support, and direct integration
 * with multiple social networks.
 *
 * @param url - The absolute URL of the page to be shared.
 * @param title - The title of the page to be included in social previews.
 * @param className - Optional CSS classes for custom container styling.
 */
export function SocialShare({ url, title, className }: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareLinks = useMemo(
    () =>
      SHARE_NETWORKS.map((option) => ({ ...option, href: getShareUrl(option.name, url, title) })),
    [url, title],
  )

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link copied to clipboard')
      setTimeout(() => {
        setCopied(false)
        setIsOpen(false)
      }, 1000)
    } catch {
      toast.error('Failed to copy link')
      setIsOpen(false)
    }
  }

  const triggerButton = (
    <button
      onClick={() => setIsOpen((prev) => !prev)}
      className={cn(
        'relative flex size-8 items-center justify-center rounded-lg bg-transparent text-secondary ring-1 ring-transparent retina:ring-[0.5px] transition-[color,background-color,transform,scale,box-shadow] duration-300 ease-in-out hover:bg-accent hover:ring-accent-border hover:text-primary active:scale-[0.95] active:duration-200',
        isOpen && 'bg-accent ring-accent-border text-primary scale-[0.95]',
      )}
      aria-label="Share post"
      aria-expanded={isOpen}
    >
      <Icons.share size={18} />
    </button>
  )

  return (
    <div className={cn('relative inline-block', className)}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center" sideOffset={6}>
            Share post
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent
          align="center"
          sideOffset={6}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex flex-col gap-0.5">
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                handleCopyLink()
              }}
              className={copied ? 'text-success data-[highlighted]:text-success' : ''}
            >
              {copied ? <Icons.check className="text-success" /> : <Icons.link />}
              <span>{copied ? 'copied!' : 'copy link'}</span>
            </DropdownMenuItem>

            {shareLinks.map((option) => {
              const Icon = option.icon
              const actionText = option.actionText || 'share on'

              return (
                <DropdownMenuItem key={option.name} asChild>
                  <a
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon />
                    <span>
                      {actionText} {option.name.toLowerCase()}
                    </span>
                  </a>
                </DropdownMenuItem>
              )
            })}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
