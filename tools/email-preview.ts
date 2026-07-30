/**
 * A local preview server for the transactional email templates, so a change can be seen without
 * sending anything. Templates are discovered from disk, rendered with their own PreviewProps and
 * served in a shell that reloads on save.
 *
 * Run with npm run email.
 */

import { watch } from 'node:fs'
import fs from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { render } from '@react-email/components'
import { type ComponentType, createElement } from 'react'

type EmailTemplateComponent = ComponentType<Record<string, unknown>> & {
  PreviewProps?: Record<string, unknown>
}
type EmailTemplateExports = Record<string, unknown>

interface CachedTemplateModule {
  templateExports: EmailTemplateExports
  mtimeMs: number
}

interface TemplateDefinition {
  slug: string
  label: string
  filePath: string
  exportName: string
}

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const templatesDir = path.join(rootDir, 'src', 'components', 'emails')
const moduleCache = new Map<string, CachedTemplateModule>()

function toLabel(slug: string): string {
  return slug
    .replace(/-template$/, '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function toExportName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

/** Reads the templates off disk each time, so a new file needs no registration here */
async function discoverTemplates(): Promise<TemplateDefinition[]> {
  const entries = await fs.readdir(templatesDir)
  return entries
    .filter((name) => name.endsWith('-template.tsx'))
    .sort()
    .map((name) => {
      const slug = name.replace(/\.tsx$/, '')
      return {
        slug,
        label: toLabel(slug),
        filePath: path.join(templatesDir, name),
        exportName: toExportName(slug),
      }
    })
}

const reloadClients = new Set<http.ServerResponse>()

function broadcastReload() {
  for (const client of reloadClients) {
    client.write('event: reload\ndata: {}\n\n')
  }
}

/** Server sent events drive the reload, which avoids a socket library for a dev only tool */
function watchTemplates() {
  let debounce: NodeJS.Timeout | undefined

  try {
    watch(templatesDir, { recursive: true }, () => {
      clearTimeout(debounce)
      debounce = setTimeout(broadcastReload, 120)
    })
  } catch {
    console.warn('File watching is unavailable; live reload is disabled.')
  }
}

function getCliValue(name: string): string | undefined {
  const exact = process.argv.find((arg) => arg.startsWith(`${name}=`))
  if (exact) return exact.slice(name.length + 1)

  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

function getPort() {
  const value = getCliValue('--port') ?? getCliValue('-p') ?? process.env.PORT ?? '3001'
  const port = Number(value)
  return Number.isInteger(port) && port > 0 ? port : 3001
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

const globalsCssPath = path.join(rootDir, 'src', 'app', 'globals.css')
let themeTokensCache: string | null = null

/**
 * Lifts the :root custom properties out of the app's stylesheet so the shell around the preview
 * matches the site. Cached because it cannot change without restarting this server.
 */
async function getThemeTokens(): Promise<string> {
  if (themeTokensCache === null) {
    const css = await fs.readFile(globalsCssPath, 'utf8')
    themeTokensCache = css.match(/:root\s*\{[^}]*\}/)?.[0] ?? ':root {}'
  }

  return themeTokensCache
}

/**
 * Imports a template, keyed by its modification time. ES module imports are cached permanently by
 * the runtime, so the timestamp in the URL is what makes a saved edit load at all.
 */
async function importTemplateModule(filePath: string): Promise<EmailTemplateExports> {
  const { mtimeMs } = await fs.stat(filePath)
  const cachedModule = moduleCache.get(filePath)

  if (cachedModule?.mtimeMs === mtimeMs) {
    return cachedModule.templateExports
  }

  const moduleUrl = `${pathToFileURL(filePath).href}?mtime=${mtimeMs}`
  const templateExports = (await import(moduleUrl)) as EmailTemplateExports
  moduleCache.set(filePath, { templateExports, mtimeMs })

  return templateExports
}

async function renderTemplate(template: TemplateDefinition): Promise<string> {
  const templateExports = await importTemplateModule(template.filePath)
  const Template = templateExports[template.exportName] ?? templateExports.default

  if (typeof Template !== 'function') {
    throw new Error(`${template.slug} has no ${template.exportName} or default component export.`)
  }

  const TemplateComponent = Template as EmailTemplateComponent
  const html = await render(createElement(TemplateComponent, TemplateComponent.PreviewProps ?? {}))

  /**
   * The email is its own document inside the iframe, so the shell's scrollbar styling cannot reach
   * it. This injects the site's thin scrollbar, toned for the light email background.
   */
  return html.replace(
    '</head>',
    '<style>*{scrollbar-width:thin;scrollbar-color:#c7c7cc transparent}</style></head>',
  )
}

function renderShell(
  activeTemplate: TemplateDefinition,
  templates: TemplateDefinition[],
  themeTokens: string,
) {
  const links = templates
    .map((template, index) => {
      const active = template.slug === activeTemplate.slug
      return `<a class="nav-item${active ? ' active' : ''}" href="/preview/${template.slug}" data-slug="${escapeHtml(template.slug)}" aria-current="${active ? 'page' : 'false'}" style="animation-delay:${180 + index * 70}ms">${escapeHtml(template.label.toLowerCase())}</a>`
    })
    .join('')

  const templatesJson = JSON.stringify(
    templates.map((template) => ({
      slug: template.slug,
      label: template.label,
    })),
  ).replace(/</g, '\\u003c')

  const activeRawPath = `/raw/${activeTemplate.slug}`

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(activeTemplate.label)} · email preview</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&family=Inter:wght@400;500;600&family=PT+Serif:ital,wght@0,400;1,400;1,700&display=swap" rel="stylesheet">
    <style>
      ${themeTokens}

      :root {
        color-scheme: dark;
        --panel: color-mix(in oklab, var(--muted) 10%, var(--background));
        --ease: cubic-bezier(0.22, 1, 0.36, 1);
        --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        --font-serif: "PT Serif", Georgia, "Times New Roman", serif;
        --font-mono: "Geist Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;
        font-family: var(--font-sans);
      }

      * {
        box-sizing: border-box;
        scrollbar-width: thin;
        scrollbar-color: var(--border) transparent;
      }
      ::selection { background: var(--primary); color: var(--primary-foreground); }
      html, body { height: 100%; }
      html { background: var(--background); }
      body {
        margin: 0;
        color: var(--foreground);
        font-feature-settings: 'rlig' 1, 'calt' 1;
        -webkit-font-smoothing: antialiased;
      }

      a { color: inherit; text-decoration: none; }
      a:focus-visible {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
        border-radius: 2px;
      }

      .shell {
        display: grid;
        grid-template-columns: 272px minmax(0, 1fr);
        height: 100vh;
      }

      .sidebar {
        display: flex;
        flex-direction: column;
        gap: 34px;
        height: 100vh;
        overflow: auto;
        padding: 40px 28px 40px 34px;
        transform: translateX(-16px);
        opacity: 0;
        animation: sidebar-in 600ms var(--ease) both;
      }

      .brand {
        display: flex;
        flex-direction: column;
        gap: 8px;
        animation: rise 600ms var(--ease) both;
        animation-delay: 80ms;
      }

      h1 {
        margin: 0;
        width: fit-content;
        color: var(--primary);
        font-family: var(--font-serif);
        font-size: 20px;
        font-style: italic;
        font-weight: 500;
        line-height: 1.375;
      }

      .subtitle {
        margin: 0;
        color: var(--muted-foreground);
        font-family: var(--font-serif);
        font-size: 14px;
        font-style: italic;
        line-height: 1.6;
      }

      .nav {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .nav-head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px;
        padding: 0 2px;
        color: var(--muted-foreground);
        font-family: var(--font-mono);
        font-size: 11px;
        line-height: 16px;
        animation: rise 600ms var(--ease) both;
        animation-delay: 140ms;
      }

      .nav-label {
        letter-spacing: 0.04em;
        text-transform: lowercase;
      }

      .nav-count {
        opacity: 0.55;
      }

      .nav-items {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .nav-indicator {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        border: 1px solid var(--accent-border);
        border-radius: 7px;
        background: var(--accent);
        opacity: 0;
        pointer-events: none;
        z-index: 0;
        transition: transform 360ms var(--ease), width 360ms var(--ease), height 360ms var(--ease);
      }

      .nav-item {
        position: relative;
        z-index: 1;
        border-radius: 7px;
        padding: 9px 12px;
        color: var(--secondary);
        font-family: var(--font-mono);
        font-size: 13px;
        line-height: 18px;
        text-transform: lowercase;
        transition: color 220ms ease, background-color 220ms ease;
        animation: rise 600ms var(--ease) both;
      }

      .nav-item:hover { color: var(--primary); }
      .nav-item:hover:not(.active) { background: var(--surface-20); }
      .nav-item.active { color: var(--primary); }

      .sidebar-foot {
        margin-top: auto;
        animation: rise 600ms var(--ease) both;
        animation-delay: 360ms;
      }

      .loadtime {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: var(--font-mono);
        font-size: 11px;
        line-height: 16px;
      }

      .loadtime-label {
        color: var(--muted-foreground);
        text-transform: lowercase;
      }

      .loadtime-value {
        color: var(--primary);
        font-variant-numeric: tabular-nums;
      }

      .canvas {
        display: flex;
        justify-content: center;
        min-width: 0;
        min-height: 0;
        margin: 8px;
        padding: 28px;
        border: 1px solid var(--border);
        border-radius: 14px;
        background:
          radial-gradient(color-mix(in oklab, var(--muted-foreground) 20%, transparent) 1px, transparent 0) 0 0 / 16px 16px,
          var(--panel);
        animation: rise 700ms var(--ease) both;
        animation-delay: 120ms;
      }

      .stage {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 700px;
        min-height: 0;
        overflow: hidden;
        border: 1px solid var(--border);
        border-radius: 12px;
        background: var(--surface-20);
      }

      .stage-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        border-bottom: 1px solid var(--border);
        background: color-mix(in oklab, var(--background) 88%, transparent);
        padding: 9px 10px 9px 16px;
        font-family: var(--font-mono);
        font-size: 11px;
        line-height: 16px;
      }

      .stage-bar .name {
        overflow: hidden;
        color: var(--secondary);
        text-overflow: ellipsis;
        white-space: nowrap;
        text-transform: lowercase;
      }

      .stage-bar .raw {
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        border-radius: 6px;
        padding: 6px 11px;
        background: var(--primary);
        color: var(--primary-foreground);
        font-size: 11px;
        line-height: 16px;
        transition: opacity 200ms ease, transform 200ms ease;
      }

      .stage-bar .raw:hover { opacity: 0.88; }
      .stage-bar .raw:active { transform: translateY(1px); }

      iframe {
        display: block;
        flex: 1;
        width: 100%;
        min-height: 0;
        border: 0;
        background: #f5f5f7;
        transition: opacity 280ms ease;
      }

      iframe.is-loading { opacity: 0.25; }

      @keyframes sidebar-in {
        from { opacity: 0; transform: translateX(-16px); }
        to { opacity: 1; transform: translateX(0); }
      }

      @keyframes rise {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @media (max-width: 780px) {
        .shell { grid-template-columns: 1fr; height: auto; min-height: 100vh; }
        .sidebar {
          height: auto;
          gap: 24px;
          padding: 30px 22px 10px;
        }
        .nav-items { flex-direction: row; flex-wrap: wrap; gap: 6px; }
        .sidebar-foot { margin-top: 6px; }
        .canvas {
          margin: 8px 14px 16px;
          padding: 18px;
          min-height: 72vh;
        }
        .stage { max-width: none; }
      }

      @media (prefers-reduced-motion: reduce) {
        .sidebar, .brand, .nav-head, .nav-item, .sidebar-foot, .canvas {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
        .nav-indicator, iframe { transition: none !important; }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <aside class="sidebar">
        <div class="brand">
          <h1>email preview</h1>
          <p class="subtitle">A local look at the emails that go out from akasewang.me.</p>
        </div>

        <nav class="nav" aria-label="Email templates">
          <div class="nav-head">
            <span class="nav-label">templates</span>
            <span class="nav-count">${templates.length}</span>
          </div>
          <div class="nav-items">
            <span class="nav-indicator" aria-hidden="true"></span>
            ${links}
          </div>
        </nav>

        <div class="sidebar-foot">
          <div class="loadtime" title="Time to load the current preview">
            <span class="loadtime-label">load time</span>
            <span class="loadtime-value" id="load-ms">&mdash;</span>
          </div>
        </div>
      </aside>

      <section class="canvas">
        <div class="stage" aria-label="${escapeHtml(activeTemplate.label)} preview">
          <div class="stage-bar">
            <span class="name" id="template-name">${escapeHtml(activeTemplate.label)}</span>
            <a class="raw" id="raw-link" href="${activeRawPath}" target="_blank" rel="noreferrer">raw html</a>
          </div>
          <script>window.__frameStart = performance.now();</script>
          <iframe id="frame" title="${escapeHtml(activeTemplate.label)} preview" src="${activeRawPath}"></iframe>
        </div>
      </section>
    </main>

    <script>
      (function () {
        var TEMPLATES = ${templatesJson};
        var indicator = document.querySelector('.nav-indicator');
        var items = Array.prototype.slice.call(document.querySelectorAll('.nav-item'));
        var frame = document.getElementById('frame');
        var nameEl = document.getElementById('template-name');
        var rawLink = document.getElementById('raw-link');
        var stage = document.querySelector('.stage');
        var loadEl = document.getElementById('load-ms');
        var frameStart = window.__frameStart || performance.now();

        function infoFor(slug) {
          for (var i = 0; i < TEMPLATES.length; i++) {
            if (TEMPLATES[i].slug === slug) return TEMPLATES[i];
          }
          return null;
        }

        function setLoading(on) {
          if (frame) frame.classList.toggle('is-loading', on);
        }

        function loadFrame(src) {
          if (!frame) return;
          setLoading(true);
          frameStart = performance.now();
          frame.src = src;
        }

        function currentSlug() {
          var active = document.querySelector('.nav-item.active');
          return active ? active.dataset.slug : null;
        }

        function reload() {
          var slug = currentSlug();
          if (slug) loadFrame('/raw/' + slug + '?t=' + Date.now());
        }

        function placeIndicator(el, animate) {
          if (!el || !indicator) return;
          if (!animate) indicator.style.transition = 'none';
          indicator.style.transform = 'translate(' + el.offsetLeft + 'px, ' + el.offsetTop + 'px)';
          indicator.style.width = el.offsetWidth + 'px';
          indicator.style.height = el.offsetHeight + 'px';
          indicator.style.opacity = '1';
          if (!animate) {
            void indicator.offsetWidth;
            indicator.style.transition = '';
          }
        }

        function select(slug, push) {
          var info = infoFor(slug);
          var target = null;
          for (var i = 0; i < items.length; i++) {
            var on = items[i].dataset.slug === slug;
            if (on) target = items[i];
            items[i].classList.toggle('active', on);
            items[i].setAttribute('aria-current', on ? 'page' : 'false');
          }
          if (!target || !info) return;
          placeIndicator(target, true);
          loadFrame('/raw/' + slug);
          if (nameEl) nameEl.textContent = info.label;
          if (rawLink) rawLink.href = '/raw/' + slug;
          if (stage) stage.setAttribute('aria-label', info.label + ' preview');
          document.title = info.label + ' · email preview';
          if (push && window.history && window.history.pushState) {
            window.history.pushState({ slug: slug }, '', '/preview/' + slug);
          }
        }

        items.forEach(function (item) {
          item.addEventListener('click', function (event) {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
            event.preventDefault();
            select(item.dataset.slug, true);
          });
        });

        if (frame) {
          frame.addEventListener('load', function () {
            if (loadEl) loadEl.textContent = Math.max(0, Math.round(performance.now() - frameStart)) + 'ms';
            setLoading(false);
          });
        }

        if (window.EventSource) {
          var live = new EventSource('/events');
          live.addEventListener('reload', reload);
        }

        window.addEventListener('popstate', function (event) {
          var slug = (event.state && event.state.slug) || location.pathname.split('/').pop();
          select(slug, false);
        });

        function syncIndicator() {
          placeIndicator(document.querySelector('.nav-item.active') || items[0], false);
        }

        syncIndicator();
        window.addEventListener('load', syncIndicator);

        var resizeTimer;
        window.addEventListener('resize', function () {
          window.clearTimeout(resizeTimer);
          resizeTimer = window.setTimeout(syncIndicator, 90);
        });
      })();
    </script>
  </body>
</html>`
}

function sendHtml(response: http.ServerResponse, html: string, statusCode = 200) {
  response.writeHead(statusCode, {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'no-store',
  })
  response.end(html)
}

function redirect(response: http.ServerResponse, location: string) {
  response.writeHead(302, { location })
  response.end()
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`)
  const [, route, slug] = url.pathname.split('/')

  if (url.pathname === '/events') {
    response.writeHead(200, {
      'content-type': 'text/event-stream',
      'cache-control': 'no-store',
      connection: 'keep-alive',
    })
    response.write('retry: 1000\n\n')
    reloadClients.add(response)
    request.on('close', () => reloadClients.delete(response))
    return
  }

  const templates = await discoverTemplates()

  if (url.pathname === '/') {
    const firstTemplate = templates[0]
    if (!firstTemplate) {
      sendHtml(response, '<h1>No templates found</h1>', 404)
      return
    }
    redirect(response, `/preview/${firstTemplate.slug}`)
    return
  }

  const template = slug ? templates.find((entry) => entry.slug === slug) : undefined

  if (!template || (route !== 'preview' && route !== 'raw')) {
    sendHtml(response, '<h1>Not found</h1>', 404)
    return
  }

  try {
    if (route === 'raw') {
      sendHtml(response, await renderTemplate(template))
    } else {
      sendHtml(response, renderShell(template, templates, await getThemeTokens()))
    }
  } catch (error) {
    const message = error instanceof Error ? error.stack || error.message : String(error)
    sendHtml(response, `<pre>${escapeHtml(message)}</pre>`, 500)
  }
})

server.on('error', (error) => {
  if ('code' in error && error.code === 'EADDRINUSE') {
    console.error(
      `Port ${getPort()} is already in use. Stop the existing server or pass -p <port>.`,
    )
    process.exit(1)
  }

  throw error
})

server.listen(getPort(), () => {
  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : getPort()
  watchTemplates()
  console.log(`Email preview running at http://localhost:${port}`)
})
