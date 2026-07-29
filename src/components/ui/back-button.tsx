'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/icons'
import { SeparatorSlash } from '@/components/ui/separator-slash'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

interface BackButtonProps {
  href?: string
  label?: string
  className?: string
}

export function BackButton({ href = '/', label, className }: BackButtonProps) {
  const router = useRouter()
  const { hoverLink, navigate: navigateSound } = useSoundEffects()
  const resolvedLabel = (label || href.split('/')[1] || 'home').toLowerCase()

  useKeyboardShortcut('Escape', () => {
    navigateSound()
    router.push(href)
  })

  return (
    <Link
      href={href}
      aria-keyshortcuts="Escape"
      onMouseEnter={hoverLink}
      onClick={navigateSound}
      className={cn(
        'group flex w-fit items-center text-sm text-muted-foreground transition-colors duration-300 supports-hover:hover:text-primary active:text-primary',
        className,
      )}
    >
      <Icons.doubleChevronRight className="mr-1 size-4 shrink-0 transition-transform duration-300 ease-out supports-hover:group-hover:translate-x-px group-active:translate-x-px" />

      <div className="grid grid-cols-[0fr] opacity-0 transition-[grid-template-columns,opacity] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] supports-hover:group-hover:grid-cols-[1fr] group-active:grid-cols-[1fr] supports-hover:group-hover:opacity-100 group-active:opacity-100">
        <div className="flex items-center overflow-hidden whitespace-nowrap">
          <span className="font-medium tracking-tight">{resolvedLabel}</span>
          <SeparatorSlash />
        </div>
      </div>

      <span className="font-mono text-sm font-medium tracking-tight text-muted-foreground transition-colors duration-300 supports-hover:group-hover:text-primary group-active:text-primary">
        cd ..
      </span>
    </Link>
  )
}
