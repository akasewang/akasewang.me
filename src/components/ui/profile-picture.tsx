'use client'

import { m, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'
import { SpinningCircularText } from './spinning-circular-text'

interface ProfilePictureProps {
  src: string
  alt: string
  href: string
  label: string
  className?: string
}

const DURATION = 4

export function ProfilePicture({ src, alt, href, label, className }: ProfilePictureProps) {
  const shouldReduceMotion = useReducedMotion()
  const { hoverLink, navigate: navigateSound } = useSoundEffects()

  const textToSpin = `${label} `.repeat(2)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={hoverLink}
      onClick={navigateSound}
      className={cn(
        'group relative z-10 flex size-[4.25rem] shrink-0 items-center justify-center overflow-visible rounded-full transition-transform duration-300 active:scale-[0.92]',
        className,
      )}
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <SpinningCircularText
          text={textToSpin}
          charSpacing={0.98}
          fontSize="11px"
          className="[--color:var(--secondary)] [--shimmering-color:color-mix(in_oklab,var(--foreground)_40%,var(--secondary))]"
          spinClassName="[animation-duration:20s] motion-reduce:animate-none"
          renderChar={(char, index) =>
            shouldReduceMotion ? (
              <span className="text-[var(--shimmering-color)]">{char}</span>
            ) : (
              <m.span
                animate={{
                  color: ['var(--color)', 'var(--shimmering-color)', 'var(--color)'],
                }}
                transition={{
                  duration: DURATION,
                  repeat: Infinity,
                  repeatType: 'loop',
                  repeatDelay: textToSpin.length * 0.03,
                  delay: (index * DURATION) / textToSpin.length,
                  ease: 'easeInOut',
                }}
              >
                {char}
              </m.span>
            )
          }
        />
      </div>

      <span className="relative size-full overflow-hidden rounded-full shadow-lg transition-transform duration-300 supports-hover:group-hover:scale-105 group-active:scale-105">
        <Image
          src={src}
          alt={alt}
          width={68}
          height={68}
          priority
          unoptimized
          className="size-full object-cover"
        />
      </span>
    </a>
  )
}
