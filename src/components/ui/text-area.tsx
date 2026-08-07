import { type ComponentProps, forwardRef } from 'react'
import { cn } from '@/utils/utils'

/** The site's multi line field, used by the message board and the newsletter composer */
export const TextArea = forwardRef<HTMLTextAreaElement, ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'min-h-[80px] w-full resize-none rounded-xl ring-1 ring-inset ring-ring/80 retina:ring-[0.5px] bg-surface-50 px-4 py-3 text-sm shadow-inner transition-[background-color,box-shadow] duration-300 placeholder:text-muted-foreground/50 focus:ring-ring focus:bg-surface-30 focus:shadow-inner-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
)
TextArea.displayName = 'TextArea'
