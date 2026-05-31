'use client'

import { useId, type CSSProperties, type ReactNode } from 'react'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/utils/utils'

/* Defines the available visual variants for the Callout component */
type CalloutType = 'info' | 'tip' | 'warn' | 'error' | 'success'

/* Props for the Callout component, allowing custom title and type */
interface CalloutProps {
  type?: CalloutType
  title?: ReactNode
  children: ReactNode
  className?: string
}

/* Configuration mapping for each callout type, including its icon, label, text accent color, and base hue */
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

/**
 * @param type - The semantic variant of the callout (info, tip, warn, error, success).
 * @param title - Optional custom title to display instead of the default type label.
 * @param className - Optional CSS classes for custom container styling.
 */
export const Callout = ({ type = 'info', title, children, className }: CalloutProps) => {
  const { icon, label, accent, hue } = VARIANTS[type]
  const Icon = Icons[icon] as React.ComponentType<{ className?: string }>
  const labelId = useId()

  return (
    <div
      role="note"
      aria-labelledby={labelId}
      style={{ '--callout-hue': hue } as CSSProperties}
      className={cn(
        'relative isolate not-prose my-6 overflow-hidden rounded-xl bg-[color-mix(in_oklab,var(--callout-hue)_6%,oklch(0.23_0_0_/_0.3))] motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-300',
        className,
      )}
    >
      <div className="flex select-none items-center gap-3 px-4 pb-0 pt-3">
        <Icon className={cn('size-3.5 shrink-0 opacity-80', accent)} aria-hidden />
        <span id={labelId} className="text-xs font-medium tracking-tight text-primary opacity-90">
          {title ?? label}
        </span>
      </div>
      <div
        className={cn(
          'pl-10.5 pr-4 pb-3 pt-1.5 text-pretty text-xs leading-relaxed text-foreground/90',
          '[&>[role=paragraph]]:my-0 [&>[role=paragraph]+[role=paragraph]]:mt-3 [&_[role=paragraph]]:text-xs',
          '[&>ol]:ml-0 [&>ol]:my-0 [&>ol]:list-decimal [&>ol]:pl-5',
          '[&>ul]:ml-0 [&>ul]:my-0 [&>ul]:list-disc [&>ul]:pl-5',
          '[&_li:first-child]:mt-0 [&_li]:mb-0 [&_li]:mt-1 [&_li]:text-xs',
          '[&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-[3px] [&_a]:[text-decoration-color:color-mix(in_oklab,var(--callout-hue)_45%,transparent)] hover:[&_a]:[text-decoration-color:var(--callout-hue)]',
          '[&_code]:rounded [&_code]:bg-[color-mix(in_oklab,var(--callout-hue)_12%,transparent)] [&_code]:px-[0.35em] [&_code]:py-[0.1em] [&_code]:font-mono [&_code]:text-[0.875em]',
        )}
      >
        {children}
      </div>
    </div>
  )
}
