'use client'

import type { ComponentProps, ReactNode } from 'react'
import { AnimatedArrow } from '@/components/ui/animated-arrow'
import { Link } from '@/components/ui/route-link'
import { LINK_REGEX } from '@/constants/constants'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { cn } from '@/utils/utils'

type LinkTextProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  /** Left out for something that should read as one of these without leading anywhere */
  href?: string
}

/** The type and spacing both forms share, so an inert one sits level with the links beside it */
const LINK_TEXT_BASE = 'mx-0.5 inline-block whitespace-nowrap text-sm text-primary'

/** An inline link with the site's animated underline, arrow and navigation sounds */
export function LinkText({
  href,
  children,
  className,
  target,
  rel,
  onMouseEnter,
  onClick,
  ...props
}: LinkTextProps) {
  const { hoverLink, navigate: navigateSound } = useSoundEffects()

  /**
   * Without a destination it is drawn rather than linked: the same type in the same place, but no
   * anchor, no arrow and no underline growing in under the pointer, since all three of those say
   * that something happens when it is followed and nothing does.
   */
  if (!href) {
    return <span className={cn(LINK_TEXT_BASE, className)}>{children}</span>
  }

  /**
   * A link off the site opens in its own tab unless told otherwise, and anything opening in a tab
   * carries noopener and noreferrer. A rel the caller supplied is merged rather than replaced, so
   * asking for one relationship cannot quietly drop the two that keep the new tab safe.
   */
  const isExternal = /^(?:https?:)?\/\//.test(href)
  const linkTarget = target ?? (isExternal ? '_blank' : undefined)
  const linkRel =
    linkTarget === '_blank'
      ? [...new Set(['noopener', 'noreferrer', ...(rel?.split(/\s+/).filter(Boolean) ?? [])])].join(
          ' ',
        )
      : rel

  return (
    <Link
      {...props}
      href={href}
      target={linkTarget}
      rel={linkRel}
      onMouseEnter={(event) => {
        onMouseEnter?.(event)
        if (!event.defaultPrevented) hoverLink()
      }}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) navigateSound()
      }}
      className={cn(
        'group',
        LINK_TEXT_BASE,
        'from-muted-foreground/50 bg-[image:linear-gradient(to_right,currentColor,currentColor),linear-gradient(to_right,var(--tw-gradient-from),var(--tw-gradient-from))]',
        'bg-[length:0%_1px,100%_1px] bg-left-bottom bg-no-repeat',
        'transition-[color,background-size] duration-300 ease-out',
        'supports-hover:hover:bg-[length:100%_1px,100%_1px] active:bg-[length:100%_1px,100%_1px]',
        className,
      )}
    >
      {children}

      <AnimatedArrow className="ml-1 -my-10 inline-block size-3.5 align-middle" />
    </Link>
  )
}

/**
 * Turns the markdown style links embedded in plain data strings into real LinkText nodes, so
 * content files can carry a link without being MDX. Returns the string untouched when there is
 * nothing to replace, which keeps callers free to render it directly.
 *
 * Kept beside the component it renders rather than among the utils, which are framework free: this
 * one returns React nodes, and a helper that does cannot sit with helpers that do not.
 */
export function renderWithLinks(text: string): ReactNode {
  if (!text) return text

  /** A local copy of the pattern, so the shared regex never carries lastIndex between calls */
  const flags = LINK_REGEX.flags.includes('g') ? LINK_REGEX.flags : `${LINK_REGEX.flags}g`
  const regex = new RegExp(LINK_REGEX.source, flags)

  const parts: ReactNode[] = []
  let lastIndex = 0

  for (const match of text.matchAll(regex)) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    parts.push(
      <LinkText key={match.index} href={match[2]}>
        {match[1]}
      </LinkText>,
    )

    lastIndex = match.index + match[0].length
  }

  if (lastIndex === 0) return text

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}
