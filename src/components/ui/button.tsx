'use client'

import { AnimatePresence, type HTMLMotionProps, m } from 'framer-motion'
import { type ElementType, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { AnimatedArrow } from '@/components/ui/animated-arrow'
import { Icons } from '@/components/ui/icons'
import { BUTTON_SWAP_TRANSITION, SPRING_TRANSITION } from '@/constants/ui'
import { toastContent } from '@/data/content/toast-content'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

interface ButtonProps extends HTMLMotionProps<'button'> {
  isPending?: boolean
  isSuccess?: boolean
  countdown?: number
  loadingText?: string
  successText?: string
  successIcon?: ElementType
  defaultText: string
  defaultIcon?: ElementType
  showArrow?: boolean
  variant?: 'primary' | 'secondary' | 'minimal'
}

const VARIANT_STYLES = {
  primary:
    'ring-1 ring-inset ring-primary/20 retina:ring-[0.5px] bg-primary text-primary-foreground shadow-[0_2px_4px_rgb(0_0_0/0.2),inset_0_1px_1px_rgb(255_255_255/1),inset_0_-1px_1px_rgb(0_0_0/0.2)] supports-hover:group-[:hover:not(:active)]:bg-primary/95 supports-hover:group-[:hover:not(:active)]:shadow-[0_4px_8px_rgb(0_0_0/0.3),inset_0_1px_1px_rgb(255_255_255/1),inset_0_-1px_1px_rgb(0_0_0/0.2)] group-active:bg-primary/85 group-active:shadow-inner',
  secondary:
    'ring-1 ring-inset ring-ring retina:ring-[0.5px] bg-gradient-to-b from-muted/60 to-muted/20 text-foreground shadow-[0_2px_4px_rgb(0_0_0/0.2),inset_0_1px_1px_rgb(255_255_255/0.1),inset_0_-1px_1px_rgb(0_0_0/0.4)] backdrop-blur-md supports-hover:group-[:hover:not(:active)]:from-muted/80 supports-hover:group-[:hover:not(:active)]:to-muted/40 supports-hover:group-[:hover:not(:active)]:shadow-[0_4px_8px_rgb(0_0_0/0.3),inset_0_1px_1px_rgb(255_255_255/0.15),inset_0_-1px_1px_rgb(0_0_0/0.4)] group-active:bg-muted/80 group-active:shadow-inner',
  minimal:
    'ring-1 ring-inset ring-ring retina:ring-[0.5px] bg-background text-secondary supports-hover:group-[:hover:not(:active)]:bg-surface-40 supports-hover:group-[:hover:not(:active)]:text-primary supports-hover:group-[:hover:not(:active)]:shadow-sm group-active:bg-surface-30 group-active:text-primary group-active:shadow-inner-sm',
}

const SUCCESS_STYLES =
  'ring-1 ring-inset ring-success/30 retina:ring-[0.5px] bg-success/10 text-success shadow-[0_2px_4px_rgb(0_0_0/0.2),inset_0_1px_1px_rgb(255_255_255/0.1)]'

const BUTTON_CONTENT_SWAP = {
  initial: { y: '110%' },
  animate: { y: '0%', transition: BUTTON_SWAP_TRANSITION },
  exit: { y: '-110%', transition: BUTTON_SWAP_TRANSITION },
}

/** The site's button, in the sizes and variants the rest of the interface draws from */
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
  const { clickPop, hoverTick, error, success: successSound } = useSoundEffects()
  const isSuccessState = isSuccess && countdown > 0
  const isActionActive = isPending || countdown > 0
  const hasRightBox = showArrow || isActionActive
  const isDisabled = disabled || isPending || (countdown > 0 && !isSuccess)
  const wasSuccessRef = useRef(isSuccessState)

  useEffect(() => {
    if (isSuccessState && !wasSuccessRef.current) successSound()
    wasSuccessRef.current = isSuccessState
  }, [isSuccessState, successSound])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (countdown > 0) {
      error()
      e.preventDefault()
      e.stopPropagation()
      toast.error(toastContent.subscribe.wait)
      return
    }
    clickPop()
    onClick?.(e)
  }

  const segmentClasses = cn(
    'relative inline-flex h-10 items-center justify-center transition-[color,background-color,border-color,box-shadow,translate,transform] duration-300 ease-out',
    isSuccessState ? SUCCESS_STYLES : VARIANT_STYLES[variant],
  )

  const contentKey = isPending
    ? 'pending'
    : isSuccessState
      ? 'success'
      : countdown > 0
        ? 'wait'
        : defaultText

  const rightKey = isPending ? 'pending' : countdown > 0 ? 'countdown' : 'arrow'

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
        {DefaultIcon && <DefaultIcon className="size-4" />}
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
    <m.button
      {...props}
      onClick={handleClick}
      onMouseEnter={(e) => {
        if (!isDisabled) hoverTick()
        props.onMouseEnter?.(e)
      }}
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
          'flex-1 rounded-l-xl',
          variant === 'minimal' ? 'px-4' : 'px-5',
          hasRightBox ? 'rounded-r-md' : 'rounded-r-xl',
          isActionActive
            ? 'translate-x-px'
            : hasRightBox &&
                'supports-hover:group-hover:translate-x-px group-active:translate-x-px',
        )}
      >
        <span className="relative grid overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <m.span
              key={contentKey}
              {...BUTTON_CONTENT_SWAP}
              className="col-start-1 row-start-1 inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              {renderContent()}
            </m.span>
          </AnimatePresence>
        </span>
      </span>

      {hasRightBox && (
        <span
          className={cn(
            segmentClasses,
            'aspect-square w-10 overflow-hidden rounded-l-md rounded-r-xl',
            isActionActive
              ? '-translate-x-px'
              : 'supports-hover:group-hover:-translate-x-px group-active:-translate-x-px',
          )}
        >
          <span className="relative grid size-full place-items-center overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <m.span
                key={rightKey}
                {...BUTTON_CONTENT_SWAP}
                className="col-start-1 row-start-1 inline-flex items-center justify-center"
              >
                {renderRightContent()}
              </m.span>
            </AnimatePresence>
          </span>
        </span>
      )}
    </m.button>
  )
}
