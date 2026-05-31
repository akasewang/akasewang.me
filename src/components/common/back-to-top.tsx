'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type Variants,
} from 'framer-motion'
import { Icons } from '@/components/ui/icons'
import { commonContent } from '@/data/content/layout-content'
import {
  BACK_TO_TOP_SIZE,
  BACK_TO_TOP_CENTER,
  BACK_TO_TOP_RADIUS,
  BACK_TO_TOP_CIRCUMFERENCE,
} from '@/constants/constants'
import { SPRING_TRANSITION, SMOOTH_SPRING_TRANSITION } from '@/constants/ui'

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
 * A floating action button that appears when the user scrolls down the page.
 * The button functions dually as a "scroll down to next section" and "back to top" action depending on scroll position.
 */
export function BackToTop() {
  const { scrollYProgress, scrollY } = useScroll()
  const dashoffset = useTransform(scrollYProgress, [0, 1], [BACK_TO_TOP_CIRCUMFERENCE, 0])

  const [isVisible, setIsVisible] = useState(false)
  const [mode, setMode] = useState<'down' | 'up'>('down')

  const domMetrics = useRef({
    sectionOffsets: [] as number[],
    lastSectionOffset: 0,
    isScrollable: false,
    windowHeight: 0,
  })

  const measureDOM = useCallback(() => {
    const sections = Array.from(document.querySelectorAll('main section[id]')) as HTMLElement[]
    const offsets = sections.map((s) => s.getBoundingClientRect().top + window.scrollY)

    domMetrics.current = {
      sectionOffsets: offsets,
      lastSectionOffset: offsets.length > 0 ? offsets[offsets.length - 1] : 0,
      isScrollable: document.documentElement.scrollHeight - window.innerHeight > 100,
      windowHeight: window.innerHeight,
    }
  }, [])

  useEffect(() => {
    measureDOM()
    window.addEventListener('resize', measureDOM)
    return () => window.removeEventListener('resize', measureDOM)
  }, [measureDOM])

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const { isScrollable, lastSectionOffset, windowHeight } = domMetrics.current

    setIsVisible(latest > 0.05 && isScrollable)

    const isAtLastSection =
      lastSectionOffset > 0 && scrollY.get() + windowHeight * 0.4 > lastSectionOffset

    setMode(latest > 0.98 || isAtLastSection ? 'up' : 'down')
  })

  const handleAction = useCallback(() => {
    if (mode === 'up') {
      return window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const currentScroll = window.scrollY

    /** Recalculate on click to ensure we don't use stale positions if page height changed */
    const sections = Array.from(document.querySelectorAll('main section[id]')) as HTMLElement[]
    const freshOffsets = sections.map((s) => s.getBoundingClientRect().top + window.scrollY)

    const nextOffset = freshOffsets.find((offset) => offset > currentScroll + 100)

    /** Stop 80px above the section for visual breathing room */
    const targetTop = nextOffset !== undefined ? nextOffset - 80 : document.body.scrollHeight

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth',
    })
  }, [mode, scrollY])

  const Icon = mode === 'down' ? Icons.arrowDownward : Icons.doubleArrowUp

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={handleAction}
          aria-label={mode === 'down' ? 'Scroll to next section' : commonContent.backToTop}
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={SMOOTH_SPRING_TRANSITION}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          className="group fixed bottom-8 right-8 z-50 flex size-[58px] items-center justify-center rounded-full bg-floating ring-1 ring-inset ring-ring retina:ring-[0.5px] shadow-md md:bottom-10"
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
            <motion.circle
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

          <div className="relative mb-[1px] flex size-full items-center justify-center overflow-hidden rounded-full">
            <AnimatePresence initial={false}>
              <motion.div
                key={mode}
                custom={mode === 'down'}
                variants={iconVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={SPRING_TRANSITION}
                className="absolute flex items-center justify-center text-muted-foreground transition-colors duration-500 group-hover:text-primary"
              >
                <Icon className="size-6.5" strokeWidth={2} />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
