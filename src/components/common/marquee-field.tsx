import { cn } from '@/utils/utils'

interface MarqueeFieldProps {
  text: string
  label: string
  className?: string
}

/** Enough copies that a row still overruns the widest card it can be dropped into */
const REPEATS = 8

const ROWS = 9

/** Degrees off level, so the rows read as a field rather than as a list of lines */
const TILT = -8

/**
 * A drifting field of repeated text, used where a card has no image of its own to show.
 *
 * Rows alternate direction and each is given a different duration, so nothing lines up into a
 * visible column and the field never appears to repeat. The whole block is oversized and tilted,
 * which keeps its corners outside the card once turned, and a heavy inset shadow darkens the edges
 * so whatever sits on top stays readable.
 *
 * The text is decoration, so it is hidden from assistive tech and the label is announced instead.
 */
export function MarqueeField({ text, label, className }: MarqueeFieldProps) {
  /** A hard space, so the gap between copies cannot be collapsed the way a plain one would be */
  const line = `${text}\u00A0`.repeat(REPEATS)

  return (
    <div
      role="img"
      aria-label={label}
      className={cn('relative size-full select-none overflow-hidden bg-surface-20', className)}
    >
      <div
        aria-hidden="true"
        style={{ transform: `rotate(${TILT}deg)` }}
        className="absolute -inset-[20%] flex flex-col justify-center"
      >
        {Array.from({ length: ROWS }, (_, row) => (
          <div key={row} className="flex overflow-hidden">
            <div
              className={cn(
                'marquee-row flex shrink-0 whitespace-nowrap font-mono text-[26px] font-black uppercase leading-[1.35] tracking-tight',
                row % 2 === 0 ? 'text-primary/[0.13]' : 'text-primary/[0.05]',
              )}
              style={{
                animation: `marquee ${17 + row * 3}s linear infinite`,
                animationDirection: row % 2 === 0 ? 'normal' : 'reverse',
              }}
            >
              <span>{line}</span>
              <span>{line}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_70px_24px_rgba(0,0,0,0.4)]" />
    </div>
  )
}
