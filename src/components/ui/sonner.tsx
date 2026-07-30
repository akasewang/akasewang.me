'use client'

import type { ComponentProps } from 'react'
import { Toaster as Sonner } from 'sonner'
import { Icons } from '@/components/ui/icons'

const TOAST_OPTIONS = {
  unstyled: true,
  classNames: {
    toast:
      'group/toast relative flex w-full items-start gap-3.5 rounded-xl bg-toast px-4 py-3.5 font-sans shadow-xl ring-1 ring-inset ring-ring/80 retina:ring-[0.5px] transition-[background-color,box-shadow,transform,opacity,scale] antialiased',
    content: 'flex min-w-0 flex-1 flex-col gap-1.5 pr-6',
    icon: 'mt-[1px] flex shrink-0 items-center justify-center text-primary [&>svg]:size-[18px]',
    loader: 'mt-[1px] shrink-0 opacity-50',
    title: 'text-sm font-medium leading-5 tracking-[-0.02em] text-primary',
    description:
      'text-[13px] font-normal leading-[1.6] text-muted-foreground [&_strong]:font-medium [&_strong]:text-foreground',
    actionButton:
      'inline-flex shrink-0 items-center justify-center rounded-md bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground transition-[background-color,box-shadow,transform,scale] supports-hover:hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-toast active:bg-primary/90 active:scale-[0.95]',
    cancelButton:
      'inline-flex shrink-0 items-center justify-center rounded-md bg-muted px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors supports-hover:hover:bg-muted/80 supports-hover:hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:bg-muted/80 active:text-primary',
    closeButton:
      'absolute right-2.5 top-2.5 flex items-center justify-center rounded-md p-1 text-muted-foreground opacity-0 transition-[color,background-color,opacity] !bg-transparent supports-hover:hover:!bg-muted/50 supports-hover:hover:text-primary focus-visible:opacity-100 supports-hover:group-hover/toast:opacity-100 active:!bg-muted/50 active:text-primary [@media(hover:none)]:opacity-100',
    success: 'bg-success/10 ring-ring [&_[data-icon]]:text-success',
    error: 'bg-destructive/10 ring-ring [&_[data-icon]]:text-destructive',
    warning: 'bg-warning/10 ring-ring [&_[data-icon]]:text-warning',
    info: 'bg-verified/10 ring-ring [&_[data-icon]]:text-verified',
  },
}

export function Toaster(props: ComponentProps<typeof Sonner>) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      closeButton
      toastOptions={TOAST_OPTIONS}
      icons={{
        success: <Icons.checkCircle />,
        error: <Icons.cancelCircle />,
        warning: <Icons.alertTriangle />,
        info: <Icons.lightbulb />,
      }}
      {...props}
    />
  )
}
