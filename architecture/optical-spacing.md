# Optical Spacing Adjustments

Some interface spacing is intentionally optically balanced rather than mathematically uniform.
Icons have different silhouettes and shadows alter the apparent edge of a surface, so equal numeric
offsets can still look uneven. The adjustments below are deliberate exceptions and should not be
normalized during later refactors without checking the rendered interface at the affected
breakpoints.

These values remain expressed with Tailwind spacing utilities so they continue to follow the global
interface scale. They are not replacements for the ordinary spacing system; add an entry here only
when a local visual correction cannot be represented accurately by the surrounding shared spacing.

## Current adjustments

| Area | Source | Adjustment | Visual reason |
| --- | --- | --- | --- |
| Navbar GitHub control | `src/components/layout/navbar.tsx` | Margin changed from `-ml-2.5` to `-ml-1.5`. | The GitHub mark and its optional star-count surface already carry visual weight toward the preceding navigation item. The reduced negative margin keeps their apparent separation consistent without forcing identical box-edge measurements. |
| Command results viewport | `src/components/command/command-palette.tsx` | Bottom padding is `pb-1.75` (a 7px base spacing), while the top and horizontal padding remain `1.5` (6px base spacing). | The moving highlight has a shadow and rounded bottom edge, which makes an equal 6px inset look tighter at the end of the list than at the sides. One extra base pixel restores the perceived spacing. The overflow hook excludes trailing padding when deciding whether a bottom fade is needed, so this correction does not create a false scroll affordance. |

## Maintenance rule

When touching one of these areas:

1. Preserve the listed value unless the surrounding geometry or glyph changes.
2. Compare perceived gaps in the rendered UI, including the navbar's desktop state and the command
   palette with its final row highlighted.
3. If a new value is required, update both the implementation and this registry in the same change.
4. Do not replace these values merely to make neighboring utility classes numerically identical.
