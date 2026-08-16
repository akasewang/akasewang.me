'use client'

import type { ReactNode } from 'react'
import { Link } from '@/components/ui/route-link'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

interface LinkChipProps {
  href: string
  children: ReactNode
  className?: string
  'aria-label'?: string
}

/**
 * A link drawn as a filled chip rather than as underlined text.
 *
 * Takes after the count beside the source link in the navbar: a dim fill, mono type and no rule
 * around it, lifting to the foreground colour on hover. Nothing marks it as leading anywhere, which
 * is the point wherever one of these sits among ordinary links, since an underline there would read
 * as one more of the same and a chip reads as a way out.
 */
export function LinkChip({ href, children, className, 'aria-label': ariaLabel }: LinkChipProps) {
  const { hoverLink, navigate: navigateSound } = useSoundEffects()
  const isExternal = href.startsWith('http')

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onMouseEnter={hoverLink}
      onClick={navigateSound}
      className={cn(
        'inline-flex items-center justify-center rounded-none bg-muted px-2 py-1 font-mono text-2xs font-medium lowercase leading-none text-secondary',
        'transition-[background-color,color,scale] duration-300',
        'supports-hover:hover:bg-muted/80 supports-hover:hover:text-primary',
        'active:bg-muted/80 active:text-primary active:scale-[0.96] active:duration-200',
        className,
      )}
    >
      {children}
    </Link>
  )
}
