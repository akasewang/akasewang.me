'use client'

import { type HTMLMotionProps, m } from 'framer-motion'
import { type ElementType, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Icons } from '@/components/ui/icons'
import { TEXT_FLIP_SWAP_VARIANTS, TextFlip } from '@/components/ui/text-flip'
import { BUTTON_SWAP_TRANSITION, SPRING_TRANSITION } from '@/constants/ui'
import { toastContent } from '@/data/content/toast-content'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

/**
 * Where a button leads, told in the colour it lights up when hovered, pressed or focused.
 *
 * `onsite` stays on this site and `offsite` hands the reader to another one. A reader learns the
 * pair without being told: the two sit side by side under the introduction, one of them opens a
 * booking page elsewhere and the other moves to a page here, and after that the colour answers the
 * question before the click does.
 *
 * Named for the destination rather than the hue because the hue is the part that might change. The
 * tokens beneath them are still called `warning` and `verified`, which say what colour they are
 * rather than what they mean here, so a button asks for the meaning and the theme decides how it
 * looks.
 *
 * This governs only the resting button. The states it enters on its own, meaning working, done and
 * blocked, keep their own colours whichever accent is chosen, since amber for busy and green for
 * done and red for refused say the same thing wherever they appear.
 */
type ButtonAccent = 'onsite' | 'offsite'

interface ButtonProps extends HTMLMotionProps<'button'> {
  isPending?: boolean
  isSuccess?: boolean
  countdown?: number
  loadingText?: string
  successText?: string
  successIcon?: ElementType
  defaultText: string
  defaultIcon?: ElementType
  accent?: ButtonAccent
}

/**
 * Every class spelled out per accent, `onsite` in the golden token and `offsite` in the blue one.
 *
 * Written out in full rather than assembled from the accent name, because Tailwind reads these
 * files as plain text and generates only the classes it can literally see. A name put together at
 * runtime would leave the button with no styles at all.
 */
const ACCENT_STYLES: Record<ButtonAccent, string> = {
  onsite:
    'supports-hover:hover:ring-warning/30 supports-hover:hover:bg-warning/10 supports-hover:hover:text-warning active:ring-warning/40 active:bg-warning/15 active:text-warning focus-visible:bg-warning/10 focus-visible:text-warning focus-visible:ring-warning/30',
  offsite:
    'supports-hover:hover:ring-verified/30 supports-hover:hover:bg-verified/10 supports-hover:hover:text-verified active:ring-verified/40 active:bg-verified/15 active:text-verified focus-visible:bg-verified/10 focus-visible:text-verified focus-visible:ring-verified/30',
}

/** What every resting button shares, before its accent decides how it lights up */
const RESTING_STYLES = 'ring-ring bg-transparent text-secondary'

const SUCCESS_STYLES =
  'ring-success/30 bg-success/10 text-success opacity-100 supports-hover:hover:ring-success/40 supports-hover:hover:bg-success/15'

const PENDING_STYLES = 'ring-warning/30 bg-warning/10 text-warning opacity-100'

const BLOCKED_STYLES = 'ring-destructive/30 bg-destructive/10 text-destructive opacity-100'

function ButtonIcon({ icon: Icon, filled = false }: { icon: ElementType; filled?: boolean }) {
  return (
    <span className="relative inline-grid size-[1.25em] shrink-0 place-items-center">
      <Icon
        weight={filled ? 'fill' : 'duotone'}
        className={cn(
          'col-start-1 row-start-1 size-full transition-all duration-200 ease-out',
          !filled &&
            'supports-hover:group-hover:scale-90 supports-hover:group-hover:opacity-0 group-active:scale-90 group-active:opacity-0',
        )}
      />
      {!filled && (
        <Icon
          weight="fill"
          className="col-start-1 row-start-1 size-full scale-90 opacity-0 transition-all duration-200 ease-out supports-hover:group-hover:scale-100 supports-hover:group-hover:opacity-100 group-active:scale-100 group-active:opacity-100"
        />
      )}
    </span>
  )
}

/** The shared action button used by forms and homepage calls to action */
export function Button({
  isPending = false,
  isSuccess = false,
  countdown = 0,
  loadingText = 'sending...',
  successText = 'sent!',
  successIcon: SuccessIcon = Icons.check,
  defaultText,
  defaultIcon: DefaultIcon,
  /** Most buttons submit a form or move within the site, so staying is what a button does unasked */
  accent = 'onsite',
  className,
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const { clickPop, hoverTick, error, success: successSound } = useSoundEffects()
  const isSuccessState = isSuccess && countdown > 0
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

  const contentKey = isPending
    ? 'pending'
    : isSuccessState
      ? 'success'
      : countdown > 0
        ? 'wait'
        : defaultText

  const activeText = isPending
    ? loadingText
    : isSuccessState
      ? successText
      : countdown > 0
        ? 'wait'
        : defaultText

  const stateStyles = isPending
    ? PENDING_STYLES
    : isSuccessState
      ? SUCCESS_STYLES
      : countdown > 0
        ? BLOCKED_STYLES
        : `${RESTING_STYLES} ${ACCENT_STYLES[accent]}`

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
        'group relative inline-flex min-h-9 w-full shrink-0 items-center justify-center gap-2 overflow-hidden rounded-lg px-3.5 py-2 text-sm font-normal leading-4 lowercase ring-1 ring-inset outline-none transition-all duration-200 ease-out retina:ring-[0.5px] focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 sm:w-auto',
        stateStyles,
        className,
      )}
    >
      <span className="relative grid overflow-hidden">
        <TextFlip
          activeKey={contentKey}
          layout={false}
          variants={TEXT_FLIP_SWAP_VARIANTS}
          transition={BUTTON_SWAP_TRANSITION}
          className="col-start-1 row-start-1 inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          {isPending ? (
            <span className="size-[1.25em] shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none" />
          ) : isSuccessState ? (
            <ButtonIcon icon={SuccessIcon} filled />
          ) : countdown > 0 ? (
            <ButtonIcon icon={Icons.alertCircle} filled />
          ) : (
            DefaultIcon && <ButtonIcon icon={DefaultIcon} />
          )}
          <span>{activeText}</span>
          {countdown > 0 && (
            <span className="font-mono text-xs tabular-nums opacity-70">{countdown}</span>
          )}
        </TextFlip>
      </span>
    </m.button>
  )
}
