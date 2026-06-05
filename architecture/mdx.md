# MDX & Content Parsing

All blogs, projects, and component docs are authored in MDX (Markdown with embedded React components). Files live under `docs/`, grouped by type (`docs/blogs`, `docs/projects`, `docs/components`).

## Reading Content

- `mdx-manager.ts` exposes a `createMdxManager` factory that builds a strongly-typed manager for each content type, so blogs, projects, and components all reuse the same read, parse, and sort logic.
- Files are read asynchronously with `fs.readFile`, and each read is wrapped in React's `cache()`. If several components request the same post during a single server render, the disk is only touched once.
- Frontmatter (title, date, etc.) is validated on read so typos and missing fields fail fast instead of rendering a broken page.

## React in Markdown

- We use `next-mdx-remote` to compile Markdown into React elements, with `remark-gfm` for GitHub Flavored Markdown and `rehype-highlight` for server-side syntax highlighting.
- In `mdx-config.tsx`, standard HTML tags are swapped for custom Tailwind components — for example `<a>` renders as our `LinkText`, and Markdown tables (`<table>`, `<thead>`, `<tr>`, `<th>`, `<td>`) render through our own `Table` components.
- The same mapping lets us drop richer components — `Callout`, `Steps`, `Tabs`, `ZoomableImage`, and code blocks — directly into a `.mdx` file.

## Table of Contents

- While parsing, every heading (`<h1>` through `<h6>`) is given a generated id and a clickable anchor link.
- The sidebar reads those headings and highlights whichever section is currently in view as you scroll.
