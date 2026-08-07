'use client'

import { useEffect } from 'react'
import { PageLayout } from '@/components/layout/page-layout'

interface ErrorStateProps {
  error: Error & { digest?: string }
  title: string
  subtitle: string
}

/** Shown when a section fails to load, offering a retry rather than an empty space */
export function ErrorState({ error, title, subtitle }: ErrorStateProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return <PageLayout title={title} subtitle={subtitle} />
}
