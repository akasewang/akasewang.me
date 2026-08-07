import { cn } from '@/utils/utils'

type SpinningCircularTextProps = Omit<React.ComponentProps<'div'>, 'children'> & {
  text: string
  charSpacing?: number
  fontSize?: string
  spinClassName?: string
  renderChar?: (char: string, index: number) => React.ReactNode
}

/**
 * Sets a line of text around a circle and turns it slowly.
 *
 * Each character is placed by the same three steps: move it to the middle, turn it by its share of
 * the full turn, then push it out to the radius. The radius itself comes from the character count,
 * since a ring has to be wide enough for its letters to sit side by side, and that is what the sine
 * works out. Every one of those figures is a CSS variable, so the whole ring resizes from the font
 * size alone with nothing measured in JavaScript.
 *
 * The letters are hidden from assistive tech and the same text is repeated in a plain span, which
 * reads as one word rather than as a stack of single characters.
 */
export function SpinningCircularText({
  text,
  charSpacing = 1,
  fontSize = '1rem',
  spinClassName,
  renderChar,
  className,
  style,
  ...props
}: SpinningCircularTextProps) {
  return (
    <div
      className={cn(
        'grid size-(--sc-container-size) place-items-center font-mono font-medium uppercase select-none',
        className,
      )}
      style={
        {
          '--sc-size': fontSize,
          '--sc-char-count': text.length,
          '--sc-char-spacing': charSpacing,
          '--sc-inner-angle': 'calc((360 / var(--sc-char-count)) * 1deg)',
          '--sc-radius-factor': 'calc(var(--sc-char-spacing) / sin(var(--sc-inner-angle)))',
          '--sc-radius': 'calc(var(--sc-radius-factor) * -1ch)',
          '--sc-container-size': 'calc(var(--sc-radius-factor) * var(--sc-size) * 2)',
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <div
        className={cn(
          'relative animate-spin text-(size:--sc-size) leading-none',
          '*:absolute *:top-1/2 *:left-1/2 *:inline-block',
          '*:[--sc-char-rotate:calc(var(--sc-inner-angle)*var(--sc-char-index))]',
          '*:transform-[translate(-50%,-50%)_rotate(var(--sc-char-rotate))_translateY(var(--sc-radius))]',
          spinClassName,
        )}
        aria-hidden
      >
        {text.split('').map((char, index) => (
          <span key={index} style={{ '--sc-char-index': index } as React.CSSProperties}>
            {renderChar ? renderChar(char, index) : char}
          </span>
        ))}
      </div>
      <span className="sr-only">{text}</span>
    </div>
  )
}
