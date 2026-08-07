# MDX & Content Parsing

Blogs and projects are authored as Markdown or MDX. Files live under `docs/`, grouped by type
(`docs/blogs` and `docs/projects`).

## Reading Content

- `src/lib/managers/mdx-manager.ts` exposes a `createMdxManager` factory, generic over the
  frontmatter type. Blog and project managers share slug discovery, file reading and newest-first
  date sorting through `getSlugs`, `getPost` and `getAll`.
- Slugs are restricted to letters, numbers, underscores and hyphens, and resolved paths are checked
  to remain inside their configured content directory. Both `.md` and `.mdx` files are supported.
- Files are read asynchronously with `fs.readFile`. React's `cache()` wraps post and collection
  lookups so repeated requests during the same server render reuse their result.
- YAML frontmatter is parsed with `js-yaml` and spread through as-is, so adding a field to the
  TypeScript type is enough to make it available; the manager needs no change. Fields are
  represented by types but are not runtime-schema validated, and malformed files are omitted or
  return `null` through the manager's error handling.
- `date` is optional and a missing one is left missing rather than backfilled with the current
  timestamp, so work with no meaningful date is not given an invented one. `sortMdxByDate` treats
  those entries as time `0`, which sorts them last.

## Project Frontmatter

Beyond the shared fields, a project understands:

| Field | Meaning |
| --- | --- |
| `type` | Which filter chip it appears under. Values come from `PROJECT_CATEGORIES`; anything unrecognised or absent shows only under All. |
| `external` | Sends the card and the command palette straight to this URL instead of the generated `/projects/[slug]` page. |
| `image` / `video` | Artwork for the card. A video is preferred and falls back to the image. |
| `preview` | Marks work that is not out yet. The card shows a `COMING SOON` plate in place of any artwork. |

`preview` is checked before `image` and `video`, because it is a claim about the work rather than
about the assets: a screenshot sitting where a not-yet-released notice belongs would contradict it.

## React in Markdown

- `next-mdx-remote` compiles content into React elements, with `remark-gfm` for GitHub Flavored
  Markdown and `rehype-highlight` for server-side syntax highlighting. `mdx-options.ts` also defines
  `remarkCodeMeta`, which extracts `title="..."` metadata from fenced code blocks.
- `mdx-config.tsx` maps standard elements to site components. Links render through `LinkText`,
  images through `ZoomableImage`, and Markdown tables through the shared table primitives.
- The component mapping also exposes `Callout`, `Steps`, `Tabs`, `ProjectDemo`, `AsideTOC`,
  `SocialShare`, component showcases and code blocks to MDX content.

## Table of Contents

- The custom `h1`–`h6` renderers use an explicit `id` when supplied; otherwise they generate one
  from plain-string heading children and render a clickable hash anchor.
- The sidebar table of contents extracts levels 2 through 4 and highlights the active section while
  the reader scrolls.
