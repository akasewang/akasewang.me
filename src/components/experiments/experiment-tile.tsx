'use client'

import { m } from 'framer-motion'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import type { Experiment } from '@/types/experiments'
import { cn } from '@/utils/utils'

/** Props for {@link ExperimentTile}. */
interface ExperimentTileProps {
  /** Registry entry supplying the live component, grid footprint and name. */
  experiment: Experiment
  /** Position in the grid, used to stagger the entrance cascade. */
  index: number
}

/**
 * Interactive container that frames a single live experiment.
 *
 * Keeps the title free aesthetic of the photo gallery: the sketch fills the whole tile and the only
 * chrome is a quiet bordered frame. Mirroring the project cards, the experiment name is hidden until
 * hover, then slides up and fades in over a soft bottom scrim so it stays legible without dimming the
 * whole visual.
 *
 * @param experiment - Registry entry providing the component, footprint and name.
 * @param index - Grid position driving the staggered fade in.
 */
export function ExperimentTile({ experiment, index }: ExperimentTileProps) {
  const { Component, className, name } = experiment
  const { hoverCard } = useSoundEffects()

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.96, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.06, 0.6) }}
      onPointerEnter={hoverCard}
      aria-label={name}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm',
        className,
      )}
    >
      <div className="absolute inset-0">
        <Component />
      </div>

      {/** Bottom scrim that fades in on hover so the name stays legible over the live visual. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 via-black/15 to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />

      {/** Experiment name, hidden until hover then sliding up and fading in from the bottom left. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end px-4 py-3">
        <span className="translate-y-1 text-balance text-base font-medium leading-tight tracking-tight text-white opacity-0 drop-shadow-md transition-[translate,opacity] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          {name}
        </span>
      </div>
    </m.div>
  )
}
