'use client'

import type { ComponentProps } from 'react'
import { Toaster as Sonner } from 'sonner'
import { Icons } from '@/components/ui/icons'

const TOAST_OPTIONS = {
  unstyled: true,
  classNames: {
    toast:
      'sonner-toast-callout group/toast relative flex w-full select-none items-center gap-2 rounded-lg px-3 py-2 font-sans transition-[background-color,border-color,box-shadow,transform,scale,opacity] duration-200 antialiased',
    content: 'flex min-w-0 flex-1 flex-col gap-0.5 pr-4',
    icon: 'flex shrink-0 items-center justify-center [&>svg]:size-3.5',
    loader: 'shrink-0 opacity-70',
    title: 'text-xs font-medium tracking-tight text-primary/90',
    description: 'text-xs leading-relaxed text-muted-foreground mt-0.5',
    actionButton:
      'inline-flex shrink-0 items-center justify-center rounded-md bg-[color-mix(in_oklab,var(--callout-hue)_25%,var(--surface-50))] border border-[var(--callout-border)] px-2.5 py-1 text-xs font-medium text-primary transition-[background-color,border-color,color,transform,scale,opacity] duration-200 ease-out supports-hover:hover:bg-[color-mix(in_oklab,var(--callout-hue)_35%,var(--surface-50))] active:scale-95 active:duration-150 retina:border-[0.5px]',
    cancelButton:
      'inline-flex shrink-0 items-center justify-center rounded-md bg-surface-40 border border-border/40 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-[background-color,border-color,color,transform,scale,opacity] duration-200 ease-out supports-hover:hover:bg-surface-50 supports-hover:hover:text-primary active:scale-95 active:duration-150 retina:border-[0.5px]',
    closeButton:
      'absolute right-2 top-1/2 -translate-y-1/2 flex size-5 items-center justify-center rounded !bg-transparent !p-0 !border-0 text-secondary/60 transition-[color,transform,scale,opacity] duration-200 ease-out supports-hover:hover:text-primary active:text-primary active:scale-90 active:duration-150 [&>svg]:size-3.5',
  },
}

/** The toast host, styled to match the site rather than the library's defaults */
export function Toaster(props: ComponentProps<typeof Sonner>) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      closeButton
      toastOptions={TOAST_OPTIONS}
      icons={{
        success: <Icons.checkCircle />,
        error: <Icons.alertCircle />,
        warning: <Icons.alertTriangle />,
        info: <Icons.question />,
      }}
      {...props}
    />
  )
}
