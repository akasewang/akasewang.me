import type { ReactNode } from 'react'
import { cn } from '@/utils/utils'

/** Props for {@link Steps}. */
interface StepsProps {
  children: ReactNode
  className?: string
}

/**
 * Wrapper component for rendering a sequential list of steps.
 *
 * @param className - Optional CSS classes for custom container styling.
 */
export const Steps = ({ children, className }: StepsProps) => {
  return <div className={cn('my-8 ml-4 [counter-reset:step]', className)}>{children}</div>
}

/** Props for {@link Step}. */
interface StepProps {
  title?: string
  children: ReactNode
}

/**
 * Individual step within a `<Steps>` container; renders an auto incrementing number marker
 * and a dashed line connecting it to the next step.
 *
 * @param title - Optional heading for the step.
 */
export const Step = ({ title, children }: StepProps) => {
  return (
    <div className="group relative pb-6 pl-8 last:pb-2">
      <div className="absolute bottom-0 left-0 top-0 w-px border-l border-dashed border-border group-last:w-4 group-last:border-b" />
      <div className="absolute -left-3 top-0 z-10 flex size-6 items-center justify-center rounded-lg bg-muted font-mono text-[10px] font-medium text-secondary ring-1 ring-border/60 [counter-increment:step] before:content-[counter(step,decimal-leading-zero)]" />
      {title && (
        <h3 className="!mt-0 font-serif text-base font-medium italic leading-snug text-primary">
          {title}
        </h3>
      )}
      <div className="mt-1 [&>p:last-child]:mb-0 [&>pre:last-child]:mb-0">{children}</div>
    </div>
  )
}
