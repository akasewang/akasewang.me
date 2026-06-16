'use client'

import { m } from 'framer-motion'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { useSpotlight } from '@/hooks/use-spotlight'
import type { Experiment } from '@/types/experiments'

interface ExperimentTileProps {
  experiment: Experiment
  index: number
}

export function ExperimentTile({ experiment, index }: ExperimentTileProps) {
  const { Component, name } = experiment
  const { spotlightSweep } = useSoundEffects()
  const { ref } = useSpotlight<HTMLDivElement>({ onMove: spotlightSweep })

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.96, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.06, 0.6) }}
      aria-label={name}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm col-span-2 row-span-2"
    >
      <div className="absolute inset-0">
        <Component />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 via-black/15 to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end px-4 py-3">
        <span className="translate-y-1 text-balance text-base font-medium leading-tight tracking-tight text-white opacity-0 drop-shadow-md transition-[translate,opacity] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          {name}
        </span>
      </div>
    </m.div>
  )
}
