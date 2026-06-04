/** The set of user interactions tracked in analytics. */
type EventName =
  | 'copy_npm_command'
  | 'copy_code_block'
  | 'copy_email'
  | 'play_name_pronunciation'
  | 'open_command_menu'

/** An analytics event: a predefined name plus optional scalar properties. */
interface Event {
  name: EventName
  properties?: Record<string, string | number | boolean | null>
}

/**
 * Safely records strongly-typed user interaction events into Google Analytics (gtag).
 * Ensures tracking only occurs if the gtag script has successfully loaded on the window object.
 *
 * @param event - The event object containing a predefined `name` and optional string/number `properties`.
 */
export function trackEvent({ name, properties }: Event) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', name, properties)
  }
}
