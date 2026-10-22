/**
 * Build-time only. scripts/prerender.mjs imports this to turn static routes
 * into real HTML, so search engines see page content without running JavaScript.
 * The browser app still mounts with createRoot and replaces this markup.
 *
 * Product data is NOT fetched here on purpose: if the API were down during a
 * build we must never bake placeholder products into the HTML.
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './routes/AppRouter';
import { seedStaticQueryData } from './lib/prerender';

export { ROUTE_META, NOT_FOUND_META, SITE_URL, DEFAULT_OG_IMAGE, canonicalUrl } from './seo/config';
export { routeSchema } from './seo/schema';

export function render(url: string): string {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  // Static site content only (FAQs). The browser seeds the same data in App.tsx.
  seedStaticQueryData(queryClient);

  return renderToString(
    <QueryClientProvider client={queryClient}>
      <StaticRouter location={url}>
        <AppRouter />
      </StaticRouter>
    </QueryClientProvider>
  );
}
