'use client'

import { ViewCounter } from '@/components/common/view-counter'

export function VisitCounter({ slug }: { slug: string }) {
  return <ViewCounter slug={slug} type="visits" readOnly />
}
