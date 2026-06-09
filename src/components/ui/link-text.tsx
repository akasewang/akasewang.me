'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { AnimatedArrow } from '@/components/ui/animated-arrow'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

/** Props for {@link LinkText}. */
interface LinkTextProps {
  href: string
  children: ReactNode
  className?: string
  target?: string
  showIcon?: boolean
}

/**
 * An inline text link with an animated underline and an optional trailing arrow. Automatically
 * applies external link attributes (`target="_blank"`, `rel="noopener noreferrer"`) for `http` URLs.
 *
 * @param href - The destination URL for the link.
 * @param children - The text content of the link.
 * @param target - Optional explicit target attribute override.
 * @param showIcon - If true, appends an `AnimatedArrow` icon to the end of the text.
 */
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
        'group inline-block whitespace-nowrap mx-0.5 pb-[1px] text-sm text-primary',
        'from-border bg-[image:linear-gradient(currentColor,currentColor),linear-gradient(var(--tw-gradient-from),var(--tw-gradient-from))]',
        'bg-[length:0%_1px,100%_1px] bg-left-bottom bg-no-repeat',
        'transition-[color,background-size] duration-300 ease-out',
        'hover:bg-[length:100%_1px,100%_1px] hover:text-primary',
        className,
      )}
    >
      {children}
      {showIcon && <AnimatedArrow className="mb-0.5 ml-1 inline-block size-3.5 align-middle" />}
    </Link>
  )
}
