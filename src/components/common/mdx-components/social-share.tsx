'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icons } from '@/components/ui/icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { USERNAME } from '@/constants/constants'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

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
      return `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${url}`)}`
    case 'Email':
      return `mailto:?subject=${encodedTitle}&body=${encodedUrl}`
    default:
      return '#'
  }
}

export function SocialShare({ url, title, className }: SocialShareProps) {
  const { hoverTick, error: errorSound } = useSoundEffects()
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

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

      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
      closeTimerRef.current = setTimeout(() => {
        setCopied(false)
        setIsOpen(false)
      }, 1000)
    } catch {
      errorSound()
      toast.error('Failed to copy link')
      setIsOpen(false)
    }
  }

  const triggerButton = (
    <button
      type="button"
      onMouseEnter={hoverTick}
      className={cn(
        'relative flex size-8 items-center justify-center rounded-lg bg-background text-secondary ring-1 ring-transparent retina:ring-[0.5px] transition-[color,background-color,transform,scale,box-shadow] duration-300 ease-in-out hover:bg-surface-40 hover:ring-accent-border hover:text-primary active:bg-surface-30 active:scale-[0.95] active:duration-200',
        isOpen && 'bg-surface-40 ring-accent-border text-primary scale-[0.95]',
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

        <DropdownMenuContent align="center" sideOffset={6}>
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
                <a href={option.href} target="_blank" rel="noopener noreferrer">
                  <Icon />
                  <span>
                    {actionText} {option.name.toLowerCase()}
                  </span>
                </a>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
