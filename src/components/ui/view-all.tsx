'use client'

import { Icons } from '@/components/ui/icons'
import { Link } from '@/components/ui/route-link'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

interface ViewAllProps {
  href: string
  label: string
  className?: string
}

/** The link at the foot of a landing page section, through to its fuller page */
export function ViewAll({ href, label, className }: ViewAllProps) {
  const { hoverLink, navigate: navigateSound } = useSoundEffects()

  return (
    <Link
      href={href}
      onMouseEnter={hoverLink}
      onClick={navigateSound}
      className={cn(
        'group flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors duration-300 supports-hover:hover:text-primary active:text-primary',
        className,
      )}
    >
      <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-[transform,scale] after:duration-300 after:ease-out supports-hover:group-hover:after:scale-x-100 group-active:after:scale-x-100 retina:after:h-[0.5px]">
        {label}
      </span>
      <Icons.arrowForward className="size-3.5 transition-[transform,translate] duration-300 ease-out supports-hover:group-hover:translate-x-0.5 group-active:translate-x-0.5" />
    </Link>
  )
}
