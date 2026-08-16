'use client'

import { ViewCounter } from '@/components/common/view-counter'

/**
 * Visits rather than views: how many people left for a project hosted elsewhere, as counted by the
 * link that sent them. Read only, since the click that counts one happens in the link itself.
 */
export function VisitCounter({ slug }: { slug: string }) {
  return <ViewCounter slug={slug} type="visits" readOnly />
}
