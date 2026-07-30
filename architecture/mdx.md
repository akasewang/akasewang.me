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
- YAML frontmatter is parsed with `js-yaml`. A missing date falls back to the current timestamp;
  other fields are represented by TypeScript types but are not runtime-schema validated. Malformed
  files are omitted or return `null` through the manager's error handling.

## React in Markdown

- `next-mdx-remote` compiles content into React elements, with `remark-gfm` for GitHub Flavored
  Markdown and `rehype-highlight` for server-side syntax highlighting. `mdx-options.ts` also defines
  `remarkCodeMeta`, which extracts `title="..."` metadata from fenced code blocks.
- `mdx-config.tsx` maps standard elements to site components. Links render through `LinkText`,
  images through `ZoomableImage`, and Markdown tables through the shared table primitives.
- The component mapping also exposes `Callout`, `Steps`, `Tabs`, `ProjectDemo`, `AsideTOC`,
  `SocialShare`, component showcases and code blocks to MDX content.

## Table of Contents

- While parsing, every heading (`<h1>` through `<h6>`) is given a generated id and a clickable anchor link.
- The sidebar table of contents extracts levels 2 through 4 and highlights the active section while
  the reader scrolls.
