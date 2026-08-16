# MDX & Content Parsing

Blogs and projects are authored as Markdown or MDX. Files live under `docs/`, grouped by type
(`docs/blogs` and `docs/projects`).

## Reading Content

- `src/lib/managers/mdx-manager.ts` exposes a `createMdxManager` factory, generic over the
  frontmatter type. Blog and project managers share slug discovery, file reading and newest-first
  date sorting through `getSlugs`, `getPost` and `getAll`.
- Slugs are restricted to letters, numbers, underscores and hyphens, and resolved paths are checked
  to remain inside their configured content directory. The filename is the single slug source:
  managers inject it after parsing and overwrite any authored `slug`, so content files do not carry
  a redundant slug field. Both `.md` and `.mdx` files are supported.
- Files are read asynchronously with `fs.readFile`. React's `cache()` wraps post and collection
  lookups so repeated requests during the same server render reuse their result.
- YAML frontmatter is parsed with `js-yaml` and spread through as-is, so adding a field to the
  TypeScript type is enough to make it available; the manager needs no change. Fields are
  represented by types but are not runtime-schema validated, and malformed files are omitted or
  return `null` through the manager's error handling. The project manager adds one focused runtime
  invariant: an authored `external` destination must be an absolute HTTP(S) URL.
- Frontmatter does not select a background. One canvas is mounted for the whole site in the root
  layout, so every page carries the same one and no MDX field can change it.
- `date` is optional and a missing one is left missing rather than backfilled with the current
  timestamp, so work with no meaningful date is not given an invented one. `sortMdxByDate` treats
  those entries as time `0`, which sorts them last.

## Project Frontmatter

Beyond the shared fields, a project understands:

| Field             | Meaning                                                                                                                                                                                      |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `date` / `period` | A point date or a `{ start, end }` work span. A point date wins; otherwise the period end, then start, drives ordering and generated timestamps.                                               |
| `type`            | Which filter chip it appears under. Values come from `PROJECT_CATEGORIES`; anything unrecognised or absent shows only under All.                                                             |
| `external`        | Sends every discovery surface straight to this URL. The project is excluded from static parameters, adjacent-project navigation and the sitemap, and its guarded detail route returns 404. |
| `links`           | Labelled repository, demo or related URLs rendered on an internal project page.                                                                                                              |
| `tech`            | Technology labels displayed with the project and included in project and command-menu search.                                                                                               |
| `image` / `video` | Artwork for the card. A video is preferred and falls back to the image.                                                                                                                       |

`getProjectDestination` is the shared internal/external decision used by cards, command results and
view/visit count keys. `projectHasPage` is the inverse page-generation rule used by the manager and
the detail-route guard, so those surfaces cannot drift into contradictory behavior.

## Blog Frontmatter

Blog posts require `title`, `excerpt` and `date`; the filename supplies the slug. Optional `type` values come from
`BLOG_CATEGORIES`, `tags` extend command-menu search keywords, and labelled `links` render beside a
post's header metadata.

## React in Markdown

- `next-mdx-remote` compiles content into React elements, with `remark-gfm` for GitHub Flavored
  Markdown and `rehype-highlight` for server-side syntax highlighting. `mdx-options.ts` also defines
  `remarkCodeMeta`, which extracts `title="..."` metadata from fenced code blocks.
- `mdx-config.tsx` assembles the registry: it spreads in the plain HTML mapping from
  `mdx-elements.tsx` and adds the custom blocks on top. Links render through `LinkText`, images
  through `ZoomableImage`, and Markdown tables through the shared table primitives.
- The `p` mapping is a `div` carrying `role="paragraph"`, since Markdown puts images and code blocks
  inside paragraphs and a `p` cannot legally contain either. It also owns the size, leading and
  colour of prose, which is worth knowing before styling anything that wraps it: type set on a
  `blockquote` loses to the paragraph inside it, so a wrapper changing prose typography has to aim
  at `[role=paragraph]` rather than at itself. `Callout` and `blockquote` both do.
- A blockquote is drawn as a fill rather than a rule, taking after `LinkChip`. The fill sits at the
  same level as the other content blocks so a run of quotes stays in family with code and tables.
- The component mapping also exposes `Callout`, `Steps`, `Tabs`, `ProjectDemo`, `AsideTOC`,
  `SocialShare`, component showcases and code blocks to MDX content.

## Table of Contents

- The custom `h1`–`h6` renderers use an explicit `id` when supplied; otherwise they generate one
  from plain-string heading children and render a clickable hash anchor.
- The sidebar table of contents extracts levels 2 through 4 and highlights the active section while
  the reader scrolls. It is absolutely positioned against the post and sticks below the navbar. Its
  mark is nudged down by half the difference between the title's line height and its own, so it
  starts on the title's row rather than level with the top of the title's box; the offset is read
  from the same theme tokens the heading uses and is spent once the nav sticks.
