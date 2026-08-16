import { type ComponentProps, forwardRef } from 'react'
import { FORM_FIELD_CLASS } from '@/components/ui/input'
import { cn } from '@/utils/utils'

/** The Input above in multiline form, sharing its field styling and fixed at the height given */
export const TextArea = forwardRef<HTMLTextAreaElement, ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(FORM_FIELD_CLASS, 'min-h-20 resize-none py-3 leading-relaxed', className)}
      {...props}
    />
  ),
)
TextArea.displayName = 'TextArea'
