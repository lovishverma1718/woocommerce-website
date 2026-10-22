# SEO build pipeline

The site is a React SPA, so search engines used to receive an empty `<div id="root">`
with the homepage title and canonical on every URL. The build now produces real HTML.

## What `npm run build` does

1. `vite build` builds the browser app into `dist/`.
2. `vite build --ssr src/entry-server.tsx` builds a Node-only render bundle into `dist-ssr/`.
3. `scripts/sitemap.mjs` writes `dist/sitemap.xml` (static routes plus published WooCommerce
   products if the API is reachable during the build; static routes only if not).
4. `scripts/prerender.mjs` writes static HTML for each route, then deletes `dist-ssr/`:
   - `dist/index.html`, `dist/shop/index.html`, `dist/about/index.html`, `dist/faq/index.html`,
     `dist/contact/index.html`, `dist/privacy-policy/index.html`, `dist/terms/index.html`
   - `dist/app.html`: neutral SPA shell used for `/product/*`, `/cart`, `/checkout`
   - `dist/404.html`: served by Netlify with a real 404 status for unknown URLs

## Where to change SEO text

All titles, descriptions, canonicals and schema live in `src/seo/config.ts` and `src/seo/schema.ts`.
The browser (`<SEOHelper />`) and the build scripts both read from there.

To add a new static page (for example a city landing page):

1. Create the page component and add its `<Route>` in `src/routes/AppRouter.tsx` with `withSEO(path, <Page />)`.
2. Add an entry to `ROUTE_META` in `src/seo/config.ts` with `prerender: true`.
3. Build. The page is prerendered and added to the sitemap automatically.

## Test locally before deploying (Netlify credits)

```bash
npm run build
npx serve dist          # or any static server
curl -s localhost:3000/shop | grep -E "<title>|canonical"
```

Push to a branch and check the free Netlify deploy preview before merging to `main`.
Each production deploy uses Netlify credits, so batch changes into one deploy.

## Notes

- Product pages are not prerendered: they would need a rebuild for every product change.
  They set title, description, canonical and Product schema in the browser.
- No WooCommerce product data is fetched during prerender, so placeholder products can never
  end up in the static HTML.
