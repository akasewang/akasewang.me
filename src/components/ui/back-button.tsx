import Link from 'next/link'
import { cn } from '@/utils/utils'
import { Icons } from '@/components/ui/icons'
import { SeparatorSlash } from '@/components/ui/separator-slash'

interface BackButtonProps {
  href?: string
  label?: string
  className?: string
}

/**
 * @param href - The target URL to navigate to (defaults to '/').
 * @param label - Optional explicit label. If omitted, derives a label from the URL path.
 * @param className - Optional CSS classes for custom sizing or positioning.
 */
export function BackButton({ href = '/', label, className }: BackButtonProps) {
  const resolvedLabel = (label || href.split('/')[1] || 'home').toLowerCase()

  return (
    <Link
      href={href}
      className={cn(
        'group flex w-fit items-center text-sm text-muted-foreground transition-colors duration-300 hover:text-primary',
        className,
      )}
    >
      <Icons.chevronRight className="mr-1 size-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-px" />

      <div className="grid grid-cols-[0fr] opacity-0 transition-[grid-template-columns,opacity] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:grid-cols-[1fr] group-hover:opacity-100">
        <div className="flex items-center overflow-hidden whitespace-nowrap">
          <span className="font-medium tracking-tight">{resolvedLabel}</span>
          <SeparatorSlash />
        </div>
      </div>

      <span className="font-mono text-sm font-medium tracking-tight text-muted-foreground transition-colors duration-300 group-hover:text-primary">
        cd ..
      </span>
    </Link>
  )
}
