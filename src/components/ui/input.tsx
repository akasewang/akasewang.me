import { type ComponentProps, forwardRef } from 'react'
import { cn } from '@/utils/utils'

/** The site's text field */
export const Input = forwardRef<HTMLInputElement, ComponentProps<'input'>>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-10 w-full shrink-0 rounded-xl ring-1 ring-inset ring-ring/80 retina:ring-[0.5px] bg-surface-50 px-4 text-sm shadow-inner transition-[background-color,box-shadow] duration-300 placeholder:text-muted-foreground/50 focus:ring-ring focus:bg-surface-30 focus:shadow-inner-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = 'Input'
