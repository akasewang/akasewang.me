'use client'

import {
  AnimatePresence,
  m,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Icons } from '@/components/ui/icons'
import {
  BACK_TO_TOP_CENTER,
  BACK_TO_TOP_CIRCUMFERENCE,
  BACK_TO_TOP_RADIUS,
  BACK_TO_TOP_SIZE,
} from '@/constants/constants'
import { SMOOTH_SPRING_TRANSITION, SPRING_TRANSITION } from '@/constants/ui'
import { commonContent } from '@/data/content/layout-content'
import { useSoundEffects } from '@/hooks/use-sound-effects'

import { cn } from '@/utils/utils'

const buttonVariants: Variants = {
  initial: { opacity: 0, scale: 0.5, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: {
    opacity: 0,
    scale: 0.5,
    y: 20,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
}

/** The arrow enters from the side it points away from, so the swap reads as it turning around */
const iconVariants: Variants = {
  initial: (isDown: boolean) => ({
    opacity: 0,
    y: isDown ? -20 : 20,
    scale: 0.5,
  }),
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: (isDown: boolean) => ({ opacity: 0, y: isDown ? 20 : -20, scale: 0.5 }),
}

/**
 * The floating button that sends the reader down to the next section, then back to the top once
 * there is nothing left below.
 *
 * The ring around it is scroll position drawn as an arc, using a dash offset run through a spring
 * so it settles rather than tracking every jitter of the wheel. It completes at nine tenths of the
 * page, since the last stretch is footer nobody reads to.
 *
 * Page measurements are kept in a ref and refreshed on resize, so scrolling reads numbers already
 * taken instead of asking the layout for them on every frame.
 */
export function BackToTop() {
  const { navigate: navigateSound, hoverTick } = useSoundEffects()
  const { scrollYProgress, scrollY } = useScroll()
  const springProgress = useSpring(scrollYProgress, { stiffness: 250, damping: 40, bounce: 0 })
  const dashoffset = useTransform(springProgress, [0, 0.9], [BACK_TO_TOP_CIRCUMFERENCE, 0])

  const [isVisible, setIsVisible] = useState(false)
  const [mode, setMode] = useState<'down' | 'up'>('down')

  const domMetrics = useRef({
    lastSectionOffset: 0,
    isScrollable: false,
    windowHeight: 0,
  })

  const measureDOM = useCallback(() => {
    const sections = document.querySelectorAll('main section[id]')
    const lastSection = sections[sections.length - 1] as HTMLElement | undefined

    domMetrics.current = {
      lastSectionOffset: lastSection ? lastSection.getBoundingClientRect().top + window.scrollY : 0,
      isScrollable: document.documentElement.scrollHeight - window.innerHeight > 100,
      windowHeight: window.innerHeight,
    }
  }, [])

  useEffect(() => {
    measureDOM()

    let timeoutId: number
    const handleResize = () => {
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(measureDOM, 150)
    }

    const observer = new ResizeObserver(handleResize)
    observer.observe(document.body)

    return () => {
      observer.disconnect()
      window.clearTimeout(timeoutId)
    }
  }, [measureDOM])

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const { isScrollable, lastSectionOffset, windowHeight } = domMetrics.current

    if (!isScrollable) {
      setIsVisible(false)
      return
    }

    setIsVisible(latest > 0.05)

    const isAtLastSection =
      lastSectionOffset > 0 && scrollY.get() + windowHeight * 0.4 > lastSectionOffset

    const isNearBottom = scrollY.get() + windowHeight >= document.documentElement.scrollHeight - 150

    setMode(latest > 0.9 || isNearBottom || isAtLastSection ? 'up' : 'down')
  })

  const handleAction = useCallback(() => {
    navigateSound()
    if (mode === 'up') {
      return window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const currentScroll = window.scrollY
    const sections = document.querySelectorAll('main section[id]')
    let nextOffset: number | undefined

    for (let i = 0; i < sections.length; i++) {
      const offset = sections[i].getBoundingClientRect().top + window.scrollY
      if (offset > currentScroll + 100) {
        nextOffset = offset
        break
      }
    }

    const targetTop = nextOffset !== undefined ? nextOffset - 80 : document.body.scrollHeight

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth',
    })
  }, [mode, navigateSound])

  const Icon = mode === 'down' ? Icons.chevronDown : Icons.doubleArrowUp

  return (
    <AnimatePresence>
      {isVisible && (
        <m.button
          type="button"
          onClick={handleAction}
          onMouseEnter={hoverTick}
          aria-label={mode === 'down' ? 'Scroll to next section' : commonContent.backToTop}
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={SMOOTH_SPRING_TRANSITION}
          whileTap={{ scale: 0.95 }}
          className="group fixed bottom-[28px] right-[28px] z-50 flex size-[58px] items-center justify-center rounded-full bg-floating ring-1 ring-inset ring-ring retina:ring-[0.5px] shadow-md md:bottom-[36px]"
        >
          <svg
            viewBox={`0 0 ${BACK_TO_TOP_SIZE} ${BACK_TO_TOP_SIZE}`}
            className="pointer-events-none absolute inset-0 -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx={BACK_TO_TOP_CENTER}
              cy={BACK_TO_TOP_CENTER}
              r={BACK_TO_TOP_RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="text-muted"
            />
            <m.circle
              cx={BACK_TO_TOP_CENTER}
              cy={BACK_TO_TOP_CENTER}
              r={BACK_TO_TOP_RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeDasharray={BACK_TO_TOP_CIRCUMFERENCE}
              style={{ strokeDashoffset: dashoffset }}
              className="text-primary"
            />
          </svg>

          <div
            className={cn(
              'relative flex size-full items-center justify-center overflow-hidden rounded-full',
              mode === 'up' ? 'mb-[1px]' : 'translate-y-[1px]',
            )}
          >
            <AnimatePresence initial={false}>
              <m.div
                key={mode}
                custom={mode === 'down'}
                variants={iconVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={SPRING_TRANSITION}
                className="absolute flex items-center justify-center text-muted-foreground transition-colors duration-500 supports-hover:group-hover:text-primary group-active:text-primary"
              >
                <Icon className="size-6.5" strokeWidth={2} />
              </m.div>
            </AnimatePresence>
          </div>
        </m.button>
      )}
    </AnimatePresence>
  )
}
