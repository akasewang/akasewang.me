'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { AnimatedArrow } from '@/components/ui/animated-arrow'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

interface LinkTextProps {
  href: string
  children: ReactNode
  className?: string
  target?: string
  showIcon?: boolean
}

export function LinkText({ href, children, className, target, showIcon = true }: LinkTextProps) {
  const { hoverLink, navigate: navigateSound } = useSoundEffects()
  const isExternal = href.startsWith('http')
  const linkTarget = target ?? (isExternal ? '_blank' : undefined)

  return (
    <Link
      href={href}
      target={linkTarget}
      rel={linkTarget === '_blank' ? 'noopener noreferrer' : undefined}
      onMouseEnter={hoverLink}
      onClick={navigateSound}
      className={cn(
        'group inline-block whitespace-nowrap mx-0.5 pb-[1.5px] text-sm text-primary',
        'from-muted-foreground/50 bg-[image:repeating-linear-gradient(to_right,currentColor_0_3px,transparent_3px_6px),repeating-linear-gradient(to_right,var(--tw-gradient-from)_0_3px,transparent_3px_6px)]',
        'bg-[length:0%_1px,100%_1px] bg-left-bottom bg-no-repeat',
        'transition-[color,background-size] duration-300 ease-out',
        'supports-hover:hover:bg-[length:100%_1px,100%_1px] active:bg-[length:100%_1px,100%_1px] supports-hover:hover:text-primary active:text-primary',
        className,
      )}
    >
      {children}
      {showIcon && <AnimatedArrow className="mb-0.5 ml-1 inline-block size-3.5 align-middle" />}
    </Link>
  )
}
