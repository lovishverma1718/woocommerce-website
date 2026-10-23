/**
 * Post-build sitemap generator -> dist/sitemap.xml
 *
 * Always includes the indexable static routes from src/seo/config.ts.
 * Adds published product pages from WooCommerce when the API is reachable at
 * build time. If the API call fails for any reason, the build still succeeds
 * with static routes only, and a warning is printed.
 *
 * Product URLs are refreshed on every deploy, so a new product appears in the
 * sitemap after the next deploy.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const { ROUTE_META, canonicalUrl } = await import(
  pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href
);

const today = new Date().toISOString().slice(0, 10);
const xmlEscape = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const entries = Object.values(ROUTE_META)
  .filter((r) => !r.noindex)
  .map((r) => ({
    loc: canonicalUrl(r.path),
    lastmod: today,
    changefreq: r.changefreq || 'weekly',
    priority: (r.priority ?? 0.5).toFixed(1),
  }));

async function fetchProductEntries() {
  const base = (process.env.VITE_WOOCOMMERCE_API_URL || '').replace(/\/+$/, '');
  const ck = (process.env.VITE_WOOCOMMERCE_CONSUMER_KEY || '').trim();
  const cs = (process.env.VITE_WOOCOMMERCE_CONSUMER_SECRET || '').trim();
  if (!base.startsWith('http')) {
    console.warn('  sitemap: WooCommerce API URL not set, skipping product URLs.');
    return [];
  }

  const headers = { Accept: 'application/json' };
  if (ck && cs) headers.Authorization = `Basic ${Buffer.from(`${ck}:${cs}`).toString('base64')}`;

  const products = [];
  for (let page = 1; page <= 20; page++) {
    const url = `${base}/products?status=publish&per_page=100&page=${page}&_fields=slug,date_modified_gmt`;
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status} on page ${page}`);
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    products.push(...batch);
    if (batch.length < 100) break;
  }

  return products
    .filter((p) => p && p.slug)
    .map((p) => ({
      loc: canonicalUrl(`/product/${p.slug}`),
      lastmod: (p.date_modified_gmt || today).slice(0, 10),
      changefreq: 'weekly',
      priority: '0.8',
    }));
}

try {
  const productEntries = await fetchProductEntries();
  entries.push(...productEntries);
  console.log(`  sitemap: added ${productEntries.length} product URLs.`);
} catch (err) {
  console.warn(`  sitemap: could not load products (${err.message}). Static routes only.`);
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${xmlEscape(e.loc)}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

await fs.writeFile(path.join(distDir, 'sitemap.xml'), xml);
console.log(`Sitemap written with ${entries.length} URLs.`);
