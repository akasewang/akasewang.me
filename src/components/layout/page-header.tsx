import { cn } from '@/utils/utils'
import { SectionTitle } from './section-title'

interface PageHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <header className={cn('space-y-2', className)}>
      <SectionTitle element="h1">{title}</SectionTitle>
      {subtitle && (
        <p className="text-pretty text-md font-serif italic leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      )}
    </header>
  )
}
