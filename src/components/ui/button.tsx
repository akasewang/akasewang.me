'use client'

import { type ElementType } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { Icons } from '@/components/ui/icons'
import { AnimatedArrow } from '@/components/ui/animated-arrow'
import { cn } from '@/utils/utils'
import { toast } from 'sonner'
import { toastContent } from '@/data/content/toast-content'
import { SPRING_TRANSITION } from '@/constants/ui'

interface ButtonProps extends HTMLMotionProps<'button'> {
  isPending?: boolean
  isSuccess?: boolean
  countdown?: number
  loadingText?: string
  successText?: string
  successIcon?: ElementType
  defaultText: string
  defaultIcon: ElementType
  showArrow?: boolean
  variant?: 'primary' | 'secondary' | 'minimal'
}

const VARIANT_STYLES = {
  primary:
    'ring-1 ring-inset ring-primary/20 retina:ring-[0.5px] bg-primary text-primary-foreground shadow-[0_2px_4px_oklch(0%_0_0/0.2),inset_0_1px_1px_oklch(100%_0_0/1),inset_0_-1px_1px_oklch(0%_0_0/0.2)] group-[:hover:not(:active)]:bg-primary/95 group-[:hover:not(:active)]:shadow-[0_4px_8px_oklch(0%_0_0/0.3),inset_0_1px_1px_oklch(100%_0_0/1),inset_0_-1px_1px_oklch(0%_0_0/0.2)] group-active:bg-primary/85 group-active:shadow-inner',
  secondary:
    'ring-1 ring-inset ring-ring retina:ring-[0.5px] bg-gradient-to-b from-muted/60 to-muted/20 text-foreground shadow-[0_2px_4px_oklch(0%_0_0/0.2),inset_0_1px_1px_oklch(100%_0_0/0.1),inset_0_-1px_1px_oklch(0%_0_0/0.4)] backdrop-blur-md group-[:hover:not(:active)]:from-muted/80 group-[:hover:not(:active)]:to-muted/40 group-[:hover:not(:active)]:shadow-[0_4px_8px_oklch(0%_0_0/0.3),inset_0_1px_1px_oklch(100%_0_0/0.15),inset_0_-1px_1px_oklch(0%_0_0/0.4)] group-active:bg-muted/80 group-active:shadow-inner',
  minimal:
    'ring-1 ring-inset ring-ring retina:ring-[0.5px] bg-transparent text-secondary group-[:hover:not(:active)]:bg-accent group-[:hover:not(:active)]:text-primary group-[:hover:not(:active)]:shadow-sm group-active:bg-accent/80 group-active:text-primary group-active:shadow-inner-sm',
}

const SUCCESS_STYLES =
  'ring-1 ring-inset ring-success/30 retina:ring-[0.5px] bg-success/10 text-success shadow-[0_2px_4px_oklch(0%_0_0/0.2),inset_0_1px_1px_oklch(100%_0_0/0.1)]'

/**
 * A versatile Button component with built-in handling for pending and success states commonly used in forms.
 *
 * @param isPending - If true, displays the `loadingText` and a spinner in the right box.
 * @param isSuccess - If true (and `countdown > 0`), displays the success state styling.
 * @param countdown - A numeric value used to render a cooldown timer in the right box.
 * @param loadingText - Text to display while `isPending` is true.
 * @param successText - Text to display when `isSuccess` is true.
 * @param successIcon - The icon component to display in the success state.
 * @param defaultText - The primary text label for the button.
 * @param defaultIcon - The primary icon component to display next to the default text.
 * @param showArrow - If true, renders a right-side box with an animated hover arrow.
 * @param variant - Visual style variant (`primary`, `secondary`, or `minimal`).
 */
export function Button({
  isPending = false,
  isSuccess = false,
  countdown = 0,
  loadingText = 'sending...',
  successText = 'sent!',
  successIcon: SuccessIcon = Icons.check,
  defaultText,
  defaultIcon: DefaultIcon,
  showArrow = true,
  variant = 'primary',
  className,
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const isSuccessState = isSuccess && countdown > 0
  const isActionActive = isPending || countdown > 0
  const hasRightBox = showArrow || isActionActive
  const isDisabled = disabled || isPending || (countdown > 0 && !isSuccess)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (countdown > 0) {
      e.preventDefault()
      e.stopPropagation()
      toast.error(toastContent.subscribe.wait)
      return
    }
    onClick?.(e)
  }

  const segmentClasses = cn(
    'relative inline-flex h-10 items-center justify-center transition-[color,background-color,border-color,box-shadow,translate,transform] duration-300 ease-out',
    isSuccessState ? SUCCESS_STYLES : VARIANT_STYLES[variant],
  )

  const renderContent = () => {
    if (isPending) return <span>{loadingText}</span>
    if (isSuccessState) {
      return (
        <>
          <SuccessIcon className="size-4" />
          <span>{successText}</span>
        </>
      )
    }
    if (countdown > 0) return <span>wait</span>
    return (
      <>
        <DefaultIcon className="size-4" />
        <span>{defaultText}</span>
      </>
    )
  }

  const renderRightContent = () => {
    if (isPending) {
      return (
        <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )
    }
    if (countdown > 0) {
      return (
        <span className={cn('font-mono text-xs', !isSuccessState && 'opacity-50')}>
          {countdown}
        </span>
      )
    }
    if (showArrow) return <AnimatedArrow />
    return null
  }

  return (
    <motion.button
      {...props}
      onClick={handleClick}
      disabled={isDisabled}
      whileTap={isDisabled ? undefined : { scale: 0.99 }}
      transition={SPRING_TRANSITION}
      className={cn(
        'group relative inline-flex w-full shrink-0 items-stretch justify-center gap-1 text-sm font-medium lowercase outline-none disabled:pointer-events-none disabled:opacity-50 sm:w-auto',
        className,
      )}
    >
      <span
        className={cn(
          segmentClasses,
          'flex-1 gap-1.5 rounded-l-xl',
          variant === 'minimal' ? 'px-4' : 'px-5',
          hasRightBox ? 'rounded-r-md' : 'rounded-r-xl',
          isActionActive
            ? 'translate-x-px'
            : hasRightBox && 'group-hover:translate-x-px group-active:translate-x-px',
        )}
      >
        {renderContent()}
      </span>

      {hasRightBox && (
        <span
          className={cn(
            segmentClasses,
            'aspect-square w-10 overflow-hidden rounded-l-md rounded-r-xl',
            isActionActive
              ? '-translate-x-px'
              : 'group-hover:-translate-x-px group-active:-translate-x-px',
          )}
        >
          {renderRightContent()}
        </span>
      )}
    </motion.button>
  )
}
