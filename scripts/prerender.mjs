/**
 * Post-build prerender.
 *
 * 1. Renders every static route (see src/seo/config.ts, prerender: true) to real
 *    HTML with its own <title>, description, canonical, Open Graph tags and JSON-LD.
 *    Output: dist/<route>/index.html (Netlify serves these directly).
 * 2. Writes dist/app.html: a neutral SPA shell (no canonical) used by Netlify
 *    rewrites for /product/*, /cart and /checkout. Each page sets its own SEO tags
 *    in the browser via <SEOHelper />.
 * 3. Writes dist/404.html (noindex). Netlify returns it with a real 404 status for
 *    any URL that has no file and no rewrite.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const ssr = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);
const { render, ROUTE_META, NOT_FOUND_META, DEFAULT_OG_IMAGE, canonicalUrl, routeSchema } = ssr;

const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf8');

const escapeAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Safe JSON inside <script>: never allow "</script>" to close the tag early.
const safeJson = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');

/** Remove every tag we manage, so each page gets exactly one of each. */
function stripManagedHead(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<link rel="canonical"[^>]*>\s*/gi, '')
    .replace(/<meta (?:name|property)="(?:title|description|robots|og:[a-z:_]+|twitter:[a-z:_]+)"[^>]*>\s*/gi, '');
}

function buildHead({ title, description, path: routePath, noindex, schema = [] }) {
  const tags = [
    `<title>${escapeText(title)}</title>`,
    `<meta name="title" content="${escapeAttr(title)}" />`,
    `<meta name="description" content="${escapeAttr(description)}" />`,
    `<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="EliteBud" />`,
    `<meta property="og:locale" content="en_CA" />`,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
    `<meta property="og:description" content="${escapeAttr(description)}" />`,
    `<meta property="og:image" content="${DEFAULT_OG_IMAGE}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(description)}" />`,
    `<meta name="twitter:image" content="${DEFAULT_OG_IMAGE}" />`,
  ];
  if (routePath && !noindex) {
    const url = canonicalUrl(routePath);
    tags.push(`<link rel="canonical" href="${url}" />`, `<meta property="og:url" content="${url}" />`);
  }
  for (const block of schema) {
    tags.push(`<script type="application/ld+json" data-seo-schema>${safeJson(block)}</script>`);
  }
  return tags.map((t) => `    ${t}`).join('\n');
}

/**
 * Framer Motion renders entrance animations with an inline opacity:0 starting style.
 * In a static snapshot that would leave text invisible to crawlers, so we drop it.
 * The live app re-renders on load and animates as usual.
 */
const revealMotion = (html) => html.replace(/opacity:\s*0(?:\.0+)?(?:;|(?="))/g, '');

function page({ head, body }) {
  const base = stripManagedHead(template);
  return base
    .replace('</head>', `${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

async function write(relPath, html) {
  const file = path.join(distDir, relPath);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, html);
  const size = (Buffer.byteLength(html) / 1024).toFixed(1);
  console.log(`  prerender  ${relPath.padEnd(30)} ${size} kB`);
}

console.log('Prerendering static routes...');

// SPA shell first, from the untouched template (before index.html is replaced).
await write(
  'app.html',
  page({
    head: buildHead({
      title: 'EliteBud | Same Day Weed Delivery Abbotsford',
      description: ROUTE_META['/'].description,
    }),
    body: '',
  })
);

const routes = Object.values(ROUTE_META).filter((r) => r.prerender);
for (const meta of routes) {
  const body = revealMotion(render(meta.path));
  const html = page({
    head: buildHead({ ...meta, schema: routeSchema(meta.path) }),
    body,
  });
  await write(meta.path === '/' ? 'index.html' : path.join(meta.path.slice(1), 'index.html'), html);
}

await write(
  '404.html',
  page({
    head: buildHead({ ...NOT_FOUND_META, path: undefined }),
    body: revealMotion(render('/__page-not-found__')),
  })
);

// The SSR bundle is build-only; never publish it.
await fs.rm(ssrDir, { recursive: true, force: true });
console.log(`Prerendered ${routes.length} routes + app shell + 404.`);
