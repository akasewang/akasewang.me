'use client'

import Link from 'next/link'
import { Icons } from '@/components/ui/icons'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

/** Props for {@link ViewAll}. */
interface ViewAllProps {
  href: string
  label: string
  className?: string
}

/**
 * A "view all" link with an underline on hover label and a forward arrow, linking to a full listing.
 *
 * @param href - The destination URL for the link.
 * @param label - The text to display.
 */
export function ViewAll({ href, label, className }: ViewAllProps) {
  const { hoverLink, navigate: navigateSound } = useSoundEffects()

  return (
    <Link
      href={href}
      onMouseEnter={hoverLink}
      onClick={navigateSound}
      className={cn(
        'group flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors duration-300 hover:text-primary',
        className,
      )}
    >
      <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-[transform,scale] after:duration-300 after:ease-out group-hover:after:scale-x-100">
        {label}
      </span>
      <Icons.arrowForward className="size-3.5 transition-[transform,translate] duration-300 ease-out group-hover:translate-x-0.5" />
    </Link>
  )
}
