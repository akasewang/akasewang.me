import { Icons } from '@/components/ui/icons'
import { cn } from '@/utils/utils'

interface ProjectMediaFallbackProps {
  title: string
  className?: string
}

export function ProjectMediaFallback({ title, className }: ProjectMediaFallbackProps) {
  return (
    <div
      className={cn(
        'flex size-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--muted)_42%,transparent),transparent_62%)] p-6 text-center',
        className,
      )}
      role="img"
      aria-label={`${title} project preview`}
    >
      <div className="flex size-12 items-center justify-center rounded-xl bg-surface-50 text-muted-foreground ring-1 ring-ring/80 retina:ring-[0.5px]">
        <Icons.projects className="size-6" />
      </div>
      <span className="max-w-[16rem] text-balance text-sm font-medium leading-snug text-muted-foreground">
        {title}
      </span>
    </div>
  )
}
