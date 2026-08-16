# Interface Scale

The interface is drawn 3% larger than its natural size. This records how that is done, what each
change replaced and why it was done that way rather than the obvious alternative.

## The short version

One figure drives everything:

```css
:root {
  --ui-scale: 1.03;
  --content-width: 50rem;
}

html {
  font-size: calc(100% * var(--ui-scale));
}
```

Change `--ui-scale` and the whole interface follows. Tooltips and tag chrome have deliberate,
documented exemptions.

## Why the root font size and not `zoom`

`zoom` and `transform: scale()` are the two obvious ways to make everything bigger. Both break the
tooltip.

Tooltips render through a portal at the end of the document, so they sit outside whatever wrapper
would carry the zoom. Base UI places the popup by measuring the trigger's box at runtime and
offsetting from it in raw pixels. Scale the page and the popup is measured in one coordinate space
and placed into another, so it drifts off its mark. `transform` has a second problem: any value
other than `none` makes the element a containing block for `position: fixed` descendants, which
quietly changes what "fixed" means for everything inside it.

The root font size avoids both. Nothing is transformed, so every element keeps its real geometry and
anything measuring at runtime still reads true. It reaches everything stated in rem at once:

- `--spacing`, which every padding, margin, gap and size utility multiplies
- `--radius` and the radius steps built from it
- the whole type scale
- any rem a component states for itself

It is written as a percentage rather than a pixel size so the figure multiplies whatever base size
the reader has chosen in their browser instead of replacing it.

Breakpoints are unaffected. Tailwind states them in rem, but relative units in media queries resolve
against the browser's initial font size rather than declarations on the root element. The layout
therefore changes shape at the same viewport widths and only its contents are drawn larger.

## What made this possible

Tailwind v4 compiles spacing utilities against a live custom property rather than baking a number
in:

```css
.p-2   { padding: calc(var(--spacing) * 2); }
.gap-1\.5 { gap: calc(var(--spacing) * 1.5); }
.text-sm { font-size: var(--text-sm); }
```

Because `--spacing` is read at use time, any subtree can redeclare it and rescale everything inside
it. That is what makes the tooltip and tag exemptions possible at all.

Arbitrary values do not work this way. They compile to literals:

```css
.w-\[400px\]   { width: 400px; }
.text-\[11px\] { font-size: 11px; }
```

So a raw pixel value is the one thing the scale cannot reach, and the work below is largely a matter
of writing sizes in units that can.

## Where the scale is named

`--ui-scale` is set in `globals.css` and used there three times:

| use | why |
| --- | --- |
| `html { font-size }` | the lever itself |
| tooltip `--spacing` | dividing the token back out |
| tooltip `--radius` | dividing the token back out |

`--content-width` is `50rem`, the 800px base width expressed in the same unit as the rest of the
interface. It therefore follows both `--ui-scale` through the root font size and the reader's browser
font preference without referring to the scale directly.

Nothing in `src/components` or `src/app` refers to it. Sizes there are ordinary Tailwind units that
already multiply `--spacing`, or rem, both of which follow the lever on their own. That is
deliberate: it means new code written the normal way scales without anyone remembering to opt in.

One thing outside the stylesheet reads the figure, and reads it from there rather than repeating it:
`next.config.ts` pulls it out at build time for the few sizes that land in markup, where CSS cannot
reach. That is a second *reader*, not a second place to set it.

## The tooltip and tag exemptions

```css
[data-slot='tooltip-content'],
[data-slot='tag'] {
  --spacing: calc(0.25rem / var(--ui-scale));
  --radius: calc(0.35rem / var(--ui-scale));
}
```

A tooltip is a label for something else rather than a part of the layout, so it reads better held at
a constant size against whatever it points at.

A tag is deliberately a partial exemption. Its spacing and radius tokens are divided back down so
its padding, gap, icons and corners remain compact, while its rem-based text continues to grow with
the interface. That asymmetry is intentional and the selector must not be removed as an apparent
scaling inconsistency.

Dividing the tokens back out beats restating them in pixels. `--spacing: 4px` would pin the tooltip
to a 16px base while everything around it still followed the reader's own setting; dividing keeps
the relationship intact whatever that base is.

Only those two tokens are named. Tooltip type is already stated in pixels; tag type deliberately
remains relative. The tokens reach shortcut keys and tag icons by inheritance, while the same
elements shown elsewhere scale normally.

## Changes by category

### 1. The scale itself

`src/app/globals.css`

```diff
     --radius: 0.35rem;
     --spacing: 0.25rem;
+    --ui-scale: 1.03;
+    --content-width: 50rem;
   }

   html {
     background-color: var(--background);
     color-scheme: dark;
+    font-size: calc(100% * var(--ui-scale));
   }
```

### 2. The radius steps

`src/app/globals.css`, inside `@theme inline`

```diff
-  --radius-xs: calc(var(--radius) - 6px);
-  --radius-sm: calc(var(--radius) - 4px);
-  --radius-md: calc(var(--radius) - 2px);
+  --radius-xs: calc(var(--radius) - 0.375rem);
+  --radius-sm: calc(var(--radius) - 0.25rem);
+  --radius-md: calc(var(--radius) - 0.125rem);
   --radius-lg: var(--radius);
-  --radius-xl: calc(var(--radius) + 4px);
-  --radius-2xl: calc(var(--radius) + 8px);
-  --radius-3xl: calc(var(--radius) + 12px);
+  --radius-xl: calc(var(--radius) + 0.25rem);
+  --radius-2xl: calc(var(--radius) + 0.5rem);
+  --radius-3xl: calc(var(--radius) + 0.75rem);
```

Each step is a fixed distance from `--radius` rather than a multiple of it. Left in pixels the
distances stayed put while `--radius` grew, which spread the scale unevenly:

| token | before | with px offsets | with rem offsets |
| --- | --- | --- | --- |
| `radius-sm` | 1.60px | 1.77px (+10.5%) | 1.65px (+3.0%) |
| `radius-md` | 3.60px | 3.77px (+4.7%) | 3.71px (+3.0%) |
| `radius-lg` | 5.60px | 5.77px (+3.0%) | 5.77px (+3.0%) |
| `radius-xl` | 9.60px | 9.77px (+1.8%) | 9.89px (+3.0%) |
| `radius-3xl` | 17.60px | 17.77px (+1.0%) | 18.13px (+3.0%) |

The tightest corners gained a tenth of their size while the widest gained a hundredth. Every value
is the pixel distance it replaces divided by 16, so the steps are unchanged at a 16px base.

### 3. The content column

`src/app/layout.tsx`, `src/components/layout/footer.tsx`, `src/app/global-error.tsx`

```diff
- <div className="mx-auto flex min-h-screen max-w-[800px] flex-col pb-20 pt-12 md:pb-12">
+ <div className="mx-auto flex min-h-screen max-w-(--content-width) flex-col pb-20 pt-12 md:pb-12">
```

The measure is what the width is really for. A column that stayed at 800px while its type grew would
fit fewer words to the line and read narrower than it was drawn to, so `50rem` scales to 824px at the
default browser font size and continues to follow a reader who chooses a different base size.

Held as a token rather than repeated at each site, so the page, the footer beneath it and the error
screen that replaces both cannot drift apart.

### 4. Arbitrary pixel values

64 values across 33 files, rewritten as ordinary Tailwind units:

```diff
- className="... text-[13px] size-[13px] min-w-[150px] w-[400px] -ml-[17px] ..."
+ className="... text-xs-plus size-3.25 min-w-37.5 w-100 -ml-4.25 ..."
```

`--spacing` is a quarter of a rem, so a pixel size at the base is its multiple times four: 13px is
`3.25`, 150px is `37.5`, 400px is `100`. Those utilities compile to `calc(var(--spacing) * n)` and
so follow the scale without naming it.

This was chosen over writing `calc(13px*var(--ui-scale))` at each site. Both give the same pixel,
but a multiple is a value of the design system rather than an escape hatch, it leaves no reference
to the scale in component code, and it is shorter than the pixel value it replaces. The deciding
reason is what happens to code written later: a plain `size-3.5` follows the scale on its own, where
a scheme built on opting in leaves every new pixel value silently frozen until someone remembers.

Two values fall between steps, since Tailwind takes quarter steps only. The 9.5px timeline rail
becomes `left-[calc(var(--spacing)*2.375)]`, still reading from the same token.

### 4a. Type sizes

Type has no bare multiple form, so the sizes the default scale does not name are named in the theme:

```css
--text-4xs: 0.5625rem;     /* 9px  */
--text-3xs: 0.625rem;      /* 10px */
--text-2xs: 0.6875rem;     /* 11px */
--text-xs-plus: 0.8125rem; /* 13px, the step between xs and sm */
```

```diff
- className="font-mono text-[13px] text-muted-foreground"
+ className="font-mono text-xs-plus text-muted-foreground"
```

The 13px step alone sets type in twelve places, which makes it a step of the scale in all but name.
It also appears three times as a dimension, where it is a `size-3.25` like any other size.

A named step has to be declared to `cn` as well as to the theme, in the `font-size` group of the
`extendTailwindMerge` call in `src/utils/utils.ts`. `text-` prefixes both a size and a colour, so
tailwind-merge reads anything it does not recognise as a size as a colour instead. An unregistered
`text-2xs` therefore joins the same group as the `text-secondary` beside it, the later class wins,
and the size is dropped from the output with nothing reported anywhere. Adding a step to the theme
and not to that list leaves it working in a plain `className` and silently failing in a merged one,
which is the harder of the two to notice.

Two sizes are used once each and are not worth a name, so they stay arbitrary and are written in rem
to follow the scale anyway:

```diff
- text-[12.5px]        // blog-post-card.tsx
+ text-[0.78125rem]

- text-[26px]          // marquee-field.tsx
+ text-[1.625rem]
```

### 4b. Corner radii

The command palette states two of its corners directly rather than through the radius scale. A
radius reads from `--radius` rather than `--spacing`, so unlike a size it has no multiple form
either, and rem is the only way to have it follow:

```diff
- rounded-[16px]     rounded-[12px]      // command-palette.tsx
+ rounded-[1rem]     rounded-[0.75rem]
```

Left in pixels these would have been the only corners on the page holding still while the boxes they
round grew around them.

### 5. Values tied to something else's size

Four offsets pair with an element that scales, so they had to move with it.

`src/components/changelog/changelog-timeline.tsx` and `src/app/changelog/loading.tsx`

```diff
- className={cn(MOBILE_STUB_CLASS, 'bottom-[calc(50%_+_10px)]')}
+ className={cn(MOBILE_STUB_CLASS, 'bottom-[calc(50%_+_var(--spacing)*2.5)]')}
```

That 10px is exactly half the `size-5` commit icon the stub butts against. `size-5` is
`calc(var(--spacing) * 5)`, which now computes to 20.6px, so a stub left at a flat 10px would overlap
the icon it is supposed to meet. Written as `var(--spacing)*2.5` it stays half the icon whatever the
scale becomes.

The same reasoning covers the `9.5px` timeline rail, the `13px` skill icons that must match their
skeletons and the navbar's optical `-ml` nudges.

### 6. Values behind a breakpoint

Four values were prefixed with a responsive variant and needed the same treatment:

```diff
- sm:w-[140px]   md:bottom-[36px]   md:-ml-[17px]
+ sm:w-35        md:bottom-9        md:-ml-4.25
```

These are the values tuned for one particular screen size, so leaving them behind would have broken
the layout only at certain widths, which is the hardest kind of regression to notice.

A fourth, `md:text-[13px]` on the command palette's input, turned out to restate the size the input
already had at every width. Naming both ends of it made that plain, and it is gone rather than
converted.

### 7. Keyboard keys inside tooltips

`src/components/ui/kbd.tsx`

```diff
+ '[[data-slot=tooltip-content]_&]:text-[9px]',
```

`Kbd` renders both inside tooltips and in the command palette. Its box already freezes inside a
tooltip through the inherited `--spacing`, and its type now follows the scale as `text-4xs`, so
inside a popup held at its natural size it would have grown while the box around it did not. A flat
pixel size pins it back, using the tooltip scoped variant the file already relies on for its
colours. This is the one place a raw pixel value is the right answer, because the whole point is to
sit outside the scale.

### 8. Icons

`src/components/ui/icons/index.tsx`

```diff
+ const DEFAULT_ICON_SIZE = 24
+
+ const scalableSize = (size: string | number) =>
+   typeof size === 'number' ? `${size / 16}rem` : size
+
  const duotone = (Icon: PhosphorIcon) =>
-   function DuotoneIcon({ size = 24, weight = 'duotone', ...props }: PhosphorIconProps) {
-     return <Icon {...props} size={size} weight={weight} />
+   function DuotoneIcon({ size = DEFAULT_ICON_SIZE, weight = 'duotone', ...props }: PhosphorIconProps) {
+     return <Icon {...props} size={scalableSize(size)} weight={weight} />
    }
```

A size lands on the svg's own `width` and `height`, where no class reaches it. Most icons are given
a size utility at the point of use and follow the scale through that, but eight pass an explicit
number and the rest fall back to the default, and all of those would have held flat while the text
beside them grew.

Converting inside the wrapper means call sites still say `18` or `24` and mean what those look like
at the reader's base size. A size already carrying its own unit passes through untouched.

`Icons.initials` is the site's own mark rather than a Phosphor icon, so it sets `width` and `height`
on its `svg` directly and needs the same treatment:

```diff
  initials: ({ size = 32, className, ...props }: IconProps) => (
    <svg
-     width={size}
-     height={size}
+     width={scalableSize(size)}
+     height={scalableSize(size)}
```

### 9. Gradient avatars

`src/components/ui/gradient-avatar.tsx`

```diff
  style={{
-   width: size,
-   height: size,
+   width: `${size / 16}rem`,
+   height: `${size / 16}rem`,
```

React turns a bare number into pixels, which would have left avatars flat beside the names they sit
against. The prop stays a number and still means what it measures at the reader's base size.

### 10. Image size hints

```diff
- sizes="(max-width: 800px) 100vw, 800px"       // project-demo.tsx
+ sizes="(max-width: 51.5rem) 100vw, 51.5rem"

- sizes="(max-width: 640px) 100vw, 400px"       // project-card.tsx
+ sizes="(max-width: 40rem) 100vw, 25.75rem"
```

These describe how wide an image will actually render so the browser can pick a source. Both were
tied to the old column width, so left alone the browser would fetch something slightly too small and
the image would render soft.

A `sizes` attribute is read by the browser's preload scanner before any stylesheet exists, so it
cannot name a custom property. It can use a rem length, though, which makes the hint follow the
reader's browser font size just like the layout. `next.config.ts` reads `--ui-scale` out of the
stylesheet at build time and hands it to the bundle as `NEXT_PUBLIC_UI_SCALE`, and
`src/utils/ui-scale.ts` folds that figure into `scaledRem`.

```diff
- sizes="(max-width: 51.5rem) 100vw, 51.5rem"
+ sizes={`(max-width: ${scaledRem(800)}) 100vw, ${scaledRem(800)}`}
```

The figure still lives in one place, and these follow it like everything else.

Worth knowing while reading this: `images.unoptimized` is set in `next.config.ts`, and with it Next
serves each image as it sits and builds no `srcset`. A `sizes` without a `srcset` means nothing, so
the browser never consults these at all today. They are kept correct for the day that setting comes
off rather than for any effect they have now.

## What was deliberately left alone

- **69 `[0.5px]` hairlines and 11 borders, rings and blurs.** A hairline is a hairline. Growing one
  by a few percent lands it between device pixels, which buys nothing and only risks blurring.
- **Sub pixel optical nudges** (`-mt-[1px]`, `translate-y-[1px]`, `pb-[1.5px]`). These correct how
  something looks rather than how big it is.
- **The dot pattern texture** (`background-size: 16px 16px`). A texture holds its density; the
  container it fills grows, so it simply shows more dots.
- **Popup animation distances** (`translateY(15px)` and similar). Motion, not size.
- **The focus ring** (`outline: 2px`). A stroke.
- **The OG card.** A social card is a fixed 1200x630 image with no reader and no browser font size.
  It has no reference to `--ui-scale` at all.
- **Email templates.** They render in a mail client where none of this CSS exists, so their pixel
  values are the only thing that works.
- **JavaScript layout constants.** Every one reads live geometry (`scrollHeight`, `clientHeight`,
  `offsetTop`), so they follow whatever the elements actually measure. `rootMargin: '400px'` is a
  prefetch trigger distance rather than a size.

## Sizes land on fractional pixels

At a 16px base the root becomes 16.48px and `--spacing` 4.12px, so most sizes come out fractional:
13.39px, 9.27px, 9.785px. This is worth understanding rather than trying to remove, because at a 3%
scale it cannot be removed.

`--spacing` is `0.25rem × 16 × scale`, or `4 × scale`. For every multiple in use to land on a half
pixel, `4 × scale` has to be a multiple of two. Scanning every whole scale between 100% and 200%:

| set of values | scales that stay on a half pixel |
| --- | --- |
| the sizes this site uses | 100%, 200% |
| the same, with quarter steps removed | 100%, 150%, 200% |

There is nothing between 1x and 1.5x. A 3% scale and half pixel precision are not both available,
and no amount of care in how a value is written changes that.

It matters less than it sounds. Everything whose crispness depends on landing on a device pixel is
already held at a literal pixel value and does not scale at all: every border, ring, `w-px` rule,
`0.5px` retina hairline and the focus outline. What is left fractional is type and box dimensions,
where it is invisible; glyphs are antialiased at any size, and a box edge a quarter of a device
pixel off cannot be seen. It is also the ordinary state of any page under browser zoom, which lays
out in the same fractions.

The one way to have both is to round every value by hand, which trades the ability to change the
scale at all for a precision nothing here is short of.

## One known imprecision

Inside a tooltip, `rounded-md` computes to 3.54px against an ideal 3.6px. The tooltip divides
`--radius` back down but the rem step offsets are not divided with it. A twentieth of a pixel on a
corner is invisible, and chasing it would cost more clarity than the uniformity elsewhere is worth.

## A note on the documentation itself

`globals.css` excludes `architecture` from Tailwind's source scan. These notes quote class names in
their examples, and left in the scan those compile to real rules nothing can ever match: around two
kilobytes of stylesheet, and an edit to a document quietly changing the CSS. The MDX under `docs`
stays in the scan, since those files are pages and the markup in them is live.

## Every file this touched

Forty three files. Grouped by what each one carries, since most of them carry the same thing.

**The scale itself** — `src/app/globals.css`: `--ui-scale`, `--content-width`, the root font size,
the tooltip's token reset, the radius steps restated in rem, the four named type steps, and the
`@source not` that keeps these notes out of the stylesheet.

**The content column** — `src/app/layout.tsx`, `src/components/layout/footer.tsx`,
`src/app/global-error.tsx`.

**Sizes rewritten as spacing multiples or named type steps** — thirty-three files:

| | |
| --- | --- |
| `app/(home)/loading.tsx` | `app/changelog/loading.tsx` |
| `app/message-board/loading.tsx` | `app/dev/skeletons/page.tsx` |
| `components/blogs/blog-post-card.tsx` | `components/changelog/changelog-timeline.tsx` |
| `components/command/command-palette.tsx` | `components/common/back-to-top.tsx` |
| `components/common/category-filter.tsx` | `components/common/empty-state.tsx` |
| `components/common/marquee-field.tsx` | `components/common/newsletter-subscription.tsx` |
| `components/skeletons/shared.tsx` | `components/common/slug-navigation.tsx` |
| `components/common/social-links.tsx` | `components/common/mdx-components/aside-toc.tsx` |
| `components/common/mdx-components/code-block.tsx` | `components/common/mdx-components/steps.tsx` |
| `components/common/mdx-components/table.tsx` | `components/common/mdx-components/showcase/component-preview.tsx` |
| `components/layout/navbar.tsx` | `components/message-board/message-bubbles.tsx` |
| `components/projects/project-card.tsx` | `components/sections/testimonials.tsx` |
| `components/skills/skill-card.tsx` | `components/skeletons/skill-card.tsx` |
| `components/testimonials/testimonial-card.tsx` | `components/ui/dropdown-menu.tsx` |
| `components/ui/kbd.tsx` | `components/ui/profile-picture.tsx` |
| `components/ui/tag.tsx` | `components/ui/text-area.tsx` |
| `components/ui/timeline-item.tsx` | |

**Sizes landing on an attribute** — `src/components/ui/icons/index.tsx`,
`src/components/ui/gradient-avatar.tsx`.

**Carrying the figure into markup** — `next.config.ts` reads it out of the stylesheet at build time,
validates that there is exactly one positive value, and `src/utils/ui-scale.ts` turns it into
`scaledRem`.

**Keeping the named steps through a merge** — `src/utils/utils.ts` declares the four to
tailwind-merge, without which `cn` treats them as colours and drops them.

**Image size hints** — `src/components/common/mdx-components/project-demo.tsx`,
`src/components/projects/project-card.tsx`.

**Comments left inaccurate by the change** — three files described a size in figures the scale
moved. `src/constants/ui.ts` and `src/components/skeletons/testimonial-card.tsx` both
called the content column 800px, and `src/components/ui/skeleton.tsx` gave the height of a skeleton
line as the 22px it measures at the base size. All three now name the relationship rather than the
figure, which is what was actually meant and what stays true at any scale.

A converted size is indistinguishable from one that was always written that way, which is the point
of the conversion and also why this list is kept by hand rather than found by searching.

Two files outside `src` were edited to reach these notes at all: `README.md` lists them with the
other design notes, and `architecture/ui.md` points here from its styling section.

## Changing the scale later

Set `--ui-scale` in `src/app/globals.css`. That is the only place it is named. Everything follows
from it, including the content column, the radius steps, the type scale and every size in component
code. Setting it to `1` restores the original interface exactly.

That holds for the sizes written in markup too, which cannot read CSS: the build lifts the figure
out of the stylesheet and hands it to them. Nothing is left to recalculate by hand.

Nothing is rounded to a fixed pixel value anywhere, which is what makes that true. A pass that
snapped sizes to tidier numbers would read better in isolation and would then be wrong the moment
the figure changed.

When adding new code:

- Use ordinary spacing and type utilities. They multiply `--spacing` and follow the scale on their
  own, with nothing to remember.
- A new named type step goes in two places, the theme and the `font-size` group in `src/utils/utils.ts`.
  Left out of the second it is dropped by `cn` wherever a colour sits on the same element.
- A size the scale has no step for goes in rem, or as a multiple of `var(--spacing)` where it has to
  stay in proportion to something else.
- Borders, hairlines, rings, blurs and sub pixel nudges stay in pixels. They are strokes and
  corrections, not sizes.
- A size landing on an attribute rather than a CSS property, as with an svg's `width`, has to be
  stated in rem to follow at all.
