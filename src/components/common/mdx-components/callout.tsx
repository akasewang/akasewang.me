'use client'

import { type CSSProperties, type ReactNode, useId } from 'react'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/utils/utils'

type CalloutType = 'info' | 'tip' | 'warn' | 'error' | 'success'
interface CalloutProps {
  type?: CalloutType
  title?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * One hue per kind of note. Everything else about the callout, the tab, the border, the surface and
 * the tint behind inline code, is mixed from that hue below rather than being listed per variant.
 */
const VARIANTS: Record<
  CalloutType,
  { icon: keyof typeof Icons; label: string; accent: string; hue: string }
> = {
  info: {
    icon: 'question',
    label: 'Note',
    accent: 'text-blue-300',
    hue: 'oklch(0.6 0.17 250)',
  },
  tip: {
    icon: 'lightbulb',
    label: 'Tip',
    accent: 'text-violet-300',
    hue: 'oklch(0.6 0.17 300)',
  },
  warn: {
    icon: 'alertTriangle',
    label: 'Warning',
    accent: 'text-amber-300',
    hue: 'oklch(0.7 0.15 60)',
  },
  error: {
    icon: 'alertCircle',
    label: 'Error',
    accent: 'text-rose-300',
    hue: 'oklch(0.6 0.18 20)',
  },
  success: {
    icon: 'checkCircle',
    label: 'Success',
    accent: 'text-emerald-300',
    hue: 'oklch(0.6 0.16 160)',
  },
}

/** An aside in a post, tinted by the kind of note it is */
export const Callout = ({ type = 'info', title, children, className }: CalloutProps) => {
  const { icon, label, accent, hue } = VARIANTS[type]
  const Icon = Icons[icon] as React.ComponentType<{ className?: string }>
  const labelId = useId()

  return (
    <div
      role="note"
      aria-labelledby={labelId}
      style={
        {
          '--callout-hue': hue,
          '--callout-border': 'color-mix(in oklab, var(--callout-hue) 18%, transparent)',
          '--callout-surface': 'color-mix(in oklab, var(--callout-hue) 6%, var(--surface-30))',
          '--callout-tab': 'color-mix(in oklab, var(--callout-hue) 12%, var(--surface-50))',
        } as CSSProperties
      }
      className={cn(
        'relative isolate not-prose my-6 flex flex-col motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-300',
        className,
      )}
    >
      {/** The tab drops its bottom border and sits behind the body, so the two read as one shape */}
      <div className="relative z-0 ml-4 flex w-fit max-w-[calc(100%-2rem)] select-none items-center gap-2 self-start rounded-t-lg border border-b-0 border-[var(--callout-border)] bg-[var(--callout-tab)] px-3 py-1.5 retina:border-[0.5px] retina:border-b-0">
        <Icon className={cn('size-3.5 shrink-0 opacity-80', accent)} aria-hidden />
        <span id={labelId} className="text-xs font-medium tracking-tight text-primary/90">
          {title ?? label}
        </span>
      </div>
      <div
        className={cn(
          'relative z-10 overflow-hidden rounded-xl border border-[var(--callout-border)] bg-[var(--callout-surface)] px-4 py-3 text-pretty text-xs leading-relaxed text-foreground/90 retina:border-[0.5px]',
          '[&>[role=paragraph]]:my-0 [&>[role=paragraph]+[role=paragraph]]:mt-3 [&_[role=paragraph]]:text-xs',
          '[&>ol]:ml-0 [&>ol]:my-0 [&>ol]:list-decimal [&>ol]:pl-5',
          '[&>ul]:ml-0 [&>ul]:my-0 [&>ul]:list-disc [&>ul]:pl-5',
          '[&_li:first-child]:mt-0 [&_li]:mb-0 [&_li]:mt-1 [&_li]:text-xs',
          '[&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-[3px] [&_a]:[text-decoration-color:color-mix(in_oklab,var(--callout-hue)_45%,transparent)] supports-hover:hover:[&_a]:[text-decoration-color:var(--callout-hue)] active:[&_a]:[text-decoration-color:var(--callout-hue)]',
          '[&_code]:rounded [&_code]:bg-[color-mix(in_oklab,var(--callout-hue)_12%,transparent)] [&_code]:px-[0.35em] [&_code]:py-[0.1em] [&_code]:font-mono [&_code]:text-[0.875em]',
        )}
      >
        {children}
      </div>
    </div>
  )
}
