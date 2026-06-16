# MDX & Content Parsing

All blogs and projects are authored in MDX (Markdown with embedded React components). Files live under `docs/`, grouped by type (`docs/blogs`, `docs/projects`).

## Reading Content

- `mdx-manager.ts` exposes a `createMdxManager` factory, generic over the frontmatter type, that builds a strongly typed manager for each content type. Blogs and projects reuse the same read, parse and sort logic and each get `getSlugs`, `getPost` and `getAll` (sorted newest first).
- Files are read asynchronously with `fs.readFile` and each read is wrapped in React's `cache()`. If several components request the same post during a single server render, the disk is only touched once.
- Frontmatter (title, date and so on) is validated on read, so typos and missing fields fail fast instead of rendering a broken page.

## React in Markdown

- We use `next-mdx-remote` to compile Markdown into React elements, with `remark-gfm` for GitHub Flavored Markdown and `rehype-highlight` for server side syntax highlighting. Plugin configuration lives in `mdx-options.ts`, which also defines `remarkCodeMeta`, a custom remark plugin that extracts `title="..."` from fenced code block meta strings and passes it as a prop to the rendered code block component.
- In `mdx-config.tsx`, standard HTML tags are swapped for custom Tailwind components. For example `<a>` renders as our `LinkText` and Markdown tables (`<table>`, `<thead>`, `<tr>`, `<th>`, `<td>`) render through our own `Table` components.
- The same mapping lets us drop richer components (`Callout`, `Steps`, `Tabs`, `ZoomableImage` and code blocks) directly into a `.mdx` file.

## Table of Contents

- While parsing, every heading (`<h1>` through `<h6>`) is given a generated id and a clickable anchor link.
- The sidebar reads those headings and highlights whichever section is currently in view as you scroll.
