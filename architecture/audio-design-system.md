# Audio Feedback Design System

To ensure a consistent, premium tactile experience across the portfolio, all interactive elements adhere to the following sound rules. Sounds are procedurally generated via `useSoundEffects` (Web Audio API), so there are no audio files.

## Core Principles
1. **Predictability:** The same action always produces the same sound.
2. **Subtlety:** Sounds provide tactile confirmation, not distraction.
3. **Hierarchy:** Heavier actions get darker or denser textures, not dramatically louder or longer sounds.
4. **One concept, one sound:** Each distinct *kind* of action gets its own sound. Do not reuse a sound for an action it was not designed for. If an interaction does not fit an existing sound, add a new one rather than overloading.

---

## Global Sound Effects Preference
The navbar sound effects toggle is the single global mute control. It defaults to disabled on each page load, stays enabled only in memory for the current page session, exposes the `F1` keyboard shortcut, and all procedural UI sounds plus real audio playback from `useSoundLazy` must check that preference before playing.

When turning audio off, the control may play one final falling `toggle(false)` chime before muting. When turning audio on, it re-enables first and then plays `toggle(true)`.

---

## The palette

All procedural cues should sit in the same perceived range: roughly 100-160 ms and a consistent shared output level. Avoid sub-bass drops, piercing high frequencies, or one-off volume spikes. Difference should come from envelope, direction, and timbre rather than raw loudness.

| Sound | Character | Meaning |
|---|---|---|
| `hoverTick` | crisp sine+triangle blip | hovering a discrete control (button/menu/tab/filter) |
| `hoverLink` | whisper-soft high blip | hovering a navigation link |
| `hoverCard` | mellow low pad | hovering a large content/media card |
| `spotlightSweep(state)` | soft low brushed movement | moving across a spotlight card (Skill/Testimonial) |
| `navigate` | rising 3-note arpeggio whoosh | going somewhere (route/scroll) |
| `clickPop` | bass thump + crisp snap | primary button press |
| `toggle(open)` | directional two-tone chime | boolean open/close, expand/collapse |
| `select` | soft pitch-nudge blip | picking an option (filter/tab/menu item) |
| `tap` | clean high bell ping | minor neutral utility |
| `success` | warm rising perfect fifth | an action succeeded |
| `error` | soft dissonant minor-second sag | an action was blocked or failed |
| `destructive(…)` | heavy downward thunk + sub | delete / remove / sign out |
| `zoom(in)` | airy octave sweep + shimmer | image zoom open/close |
| `media(playing)` | short percussive directional thip | video play/pause |

---

## 1. Hover: a family, not one sound
**Trigger:** Pointer enters an interactive element.
Every interactive element still makes a sound on hover (consistency), but the *texture* is matched to the kind of element so the UI never feels like one tick spamming everywhere. Pick by element type:

| Element type | Sound | Examples |
|---|---|---|
| Navigation link | `hoverLink` | Navbar items, home logo, GitHub/RSS, footer license, `LinkText`, View All, Back, Carousel, prev/next arrows, announcement-banner link |
| Large content / media card | `hoverCard` | Blog/Project cards, photo tiles, the project demo video, MDX zoomable images, timeline rows |
| Spotlight card | `spotlightSweep(state)` | Skill cards, Testimonial cards (matches their velocity-reactive spotlight reveal) |
| Discrete control | `hoverTick` | CTA `Button`, icon buttons, Select/Dropdown items + triggers, Tabs, Category filters, TOC headings, Copy, Back-to-Top, banner dismiss, message-board actions, photos view toggle |

*   **Consistency rule:** within a category every element uses the same hover sound, no "card that sounds" vs "card that doesn't". Differentiation is *across* categories only.
*   **Shared throttle:** `hoverTick`, `hoverLink`, and `hoverCard` share one 60 ms throttle, so a fast sweep across mixed elements never buzzes regardless of which textures it crosses. `spotlightSweep` is different: it plays one low entry bloom on pointer enter, then keeps one audible, low, non-tonal audio voice alive while the cursor moves, modulating filter, gain, and a very light stereo pan from spotlight position/intensity before fading out shortly after movement stops.
*   **Subtlety:** hover is the most frequent event, so all four stay lighter than action sounds; `hoverLink` remains the lightest since links are hovered most.
*   **Do NOT use on:** Non-interactive elements, or controls that make no click sound. `PronounceMyName` uses `hoverTick` on hover and the real speech clip on click.

## 2. Navigation (`navigate`)
**Trigger:** Clicking something that routes to a new page/section or scrolls.
**Do use on:** Internal links (Navbar items, home logo, Blog/Project cards), external links (Social/Skill/Testimonial links, GitHub/RSS, announcement-banner inline links route via `clickPop`, see §3), Back/Forward arrows, "View All", inline text links (`LinkText`), Back-to-Top / scroll-to-section.
**Keyboard parity:** Shortcuts that navigate (`g` GitHub, `r` RSS, `l` License, arrow keys for prev/next) also fire `navigate`, so keyboard and pointer feel identical.
**Do NOT use on:** State changes that stay on the current view.

## 3. Primary Action (`clickPop`)
**Trigger:** Pressing a primary button.
**Do use on:** All `Button`-component presses (Message Board Send/Reply, Newsletter, Admin broadcast, CTAs), announcement-banner link.
**Do NOT use on:** Navigation links, toggles, or opening menus/dropdowns. The Social Share trigger gets `hoverTick` + `toggle` (it is a dropdown), never `clickPop`.
**Note:** `clickPop` is just the *press*. The result of a form submit is signalled separately by `success` or `error` (§7, §8). The `Button` component fires those automatically from its `isSuccess` / rate-limit state, so individual forms only need to add `error` on their own failure branches.

## 4. Toggles & Drawers (`toggle`)
**Trigger:** Flipping a boolean: expand/collapse or open/close.
**Do use on:** Expandable lists (Show More/Less), Timeline item expansion, Photos view mode (Grid/Masonry), opening/closing Select and Dropdown menus (and sub-menus).
**Implementation:** Pass the boolean `(isOpen)` so the chime rises to open and falls to close.

## 5. Select & Filter (`select`)
**Trigger:** Choosing an option without full navigation.
**Do use on:** Category filters, MDX Tabs, Select/Dropdown menu items (including Social Share network links and the dropdown "copy link" entry), Table-of-Contents heading clicks.
**Implementation:** `DropdownMenuItem` / `SelectItem` play `select` automatically on selection and suppress the menu's automatic close chime for that selection-close cycle. Do **not** add a second click sound to their children, that doubles the blip. The menu-item `select` is canonical for anything inside a menu.

## 6. Utility (`tap`)
**Trigger:** A minor, neutral utility action that is neither success, navigation, nor a toggle.
**Do use on:** Dismissing the announcement banner, retrying a failed load, cancelling/editing a message-board reply.
**Note:** This used to also cover copy and zoom; those now have dedicated sounds (§7, §10). Keep `tap` for genuinely minor, characterless taps.

## 7. Success (`success`)
**Trigger:** An action completed successfully.
**Do use on:** Standalone "Copy to clipboard" success (`CopyButton`, slug-nav copy), and form/subscribe success (fired automatically by `Button` when it enters its success state).
**Note:** Copy *inside a dropdown* is a menu item → `select` (§5). `success` is for copy rendered as its own button and for completed submissions.

## 8. Error (`error`)
**Trigger:** An action was blocked or failed.
**Do use on:** Rate-limited button presses (fired by `Button`), failed form submissions (Newsletter, Message Board, Admin), failed delete/reply on the message board.
**Rule:** Pair with the user-facing `toast.error`; play `error` immediately before showing the toast.

## 9. Destructive (`destructive`)
**Trigger:** Deleting, removing, or signing out.
**Do use on:** Message Board "delete", "Leave Admin Mode".
**Rule:** Use instead of `clickPop` whenever the action removes data or ends a session. The heavier, darker thunk signals consequence.

## 10. Zoom (`zoom`)
**Trigger:** Opening or closing a fullscreen image.
**Do use on:** `ZoomableImage` and gallery `PhotoCard` (open → `zoom(true)`), `PhotoOverlay` close via backdrop/image/Escape (close → `zoom(false)`).
**Implementation:** Pass the boolean direction so open sweeps up and close sweeps down.

## 11. Media (`media`)
**Trigger:** Play/pause on a project demo video.
**Do use on:** `ProjectDemo` play/pause.
**Implementation:** Pass `isPlaying` so starting nudges up and pausing nudges down.
