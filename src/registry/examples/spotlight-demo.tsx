'use client'

import { SpotlightCard } from '@/registry/components/spotlight'

/** This is lazily loaded and rendered inside the `ComponentPreview` on the `/components` page. */
export default function SpotlightDemo() {
  return (
    <SpotlightCard
      withBaseReveal
      outerSize={400}
      className="flex min-h-[400px] w-full flex-col items-center justify-center bg-transparent"
    >
      <div className="flex h-full w-full items-center justify-center">
        <h1 className="text-center font-mono text-5xl font-bold tracking-tighter text-foreground">
          Spotlight Effect
        </h1>
      </div>
    </SpotlightCard>
  )
}
