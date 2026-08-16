import { type ComponentProps, forwardRef } from 'react'
import { cn } from '@/utils/utils'

/**
 * The surface, ring and every state a field can be in: hovered, focused, invalid, disabled. Read by
 * the multiline field beside this one too, so the two are one treatment rather than two that happen
 * to match. Only the box each sits in differs, which is why the size is left out.
 */
export const FORM_FIELD_CLASS =
  'form-field w-full rounded-lg bg-surface-10 px-3.5 text-sm text-primary ring-1 ring-inset ring-ring shadow-inner-sm transition-[background-color,box-shadow,color] duration-200 ease-out placeholder:text-muted-foreground/50 retina:ring-[0.5px] supports-hover:enabled:hover:bg-surface-20 supports-hover:enabled:hover:ring-primary/15 focus:bg-surface-20 focus:ring-primary/30 focus:shadow-inner focus:outline-none focus-visible:ring-[1.5px] focus-visible:ring-primary/30 aria-invalid:bg-destructive/5 aria-invalid:ring-destructive/40 aria-invalid:focus:ring-destructive/60 disabled:cursor-not-allowed disabled:bg-surface-10 disabled:text-muted-foreground disabled:opacity-60'

/**
 * The site's text input. A plain input under the styling, so anything valid on one works here,
 * including aria-invalid, which is what draws the error state.
 */
export const Input = forwardRef<HTMLInputElement, ComponentProps<'input'>>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(FORM_FIELD_CLASS, 'flex h-10 shrink-0', className)}
      {...props}
    />
  ),
)
Input.displayName = 'Input'
