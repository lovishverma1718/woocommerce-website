import React, { useEffect } from 'react';
import { DEFAULT_OG_IMAGE, ROUTE_META, canonicalUrl } from '../../seo/config';
import { routeSchema } from '../../seo/schema';

export interface SEOProps {
  /** Full page title, used exactly as given. */
  title?: string;
  description?: string;
  /** Path used for the canonical URL, e.g. "/shop". */
  path?: string;
  /** Keep the page out of search results. */
  noindex?: boolean;
  /** Open Graph type. */
  type?: 'website' | 'product';
  image?: string;
  /** One or more JSON-LD blocks. */
  schemaData?: object | object[];
}

const SCHEMA_ATTR = 'data-seo-schema';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Keeps <head> in sync with the current page in the browser.
 * The same values are written into the static HTML at build time by
 * scripts/prerender.mjs, so crawlers see them without running JavaScript.
 */
export const SEOHelper: React.FC<SEOProps> = ({
  title,
  description,
  path,
  noindex,
  type = 'website',
  image = DEFAULT_OG_IMAGE,
  schemaData,
}) => {
  // Serialise once so a new array with the same content does not re-run the effect.
  const schemaJson = JSON.stringify(
    schemaData ? (Array.isArray(schemaData) ? schemaData : [schemaData]) : []
  );

  useEffect(() => {
    if (title) {
      document.title = title;
      setMeta('name', 'title', title);
      setMeta('property', 'og:title', title);
      setMeta('name', 'twitter:title', title);
    }
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }
    if (path) {
      const url = canonicalUrl(path);
      setCanonical(url);
      setMeta('property', 'og:url', url);
    }
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:image', image);
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');

    // Replace JSON-LD blocks owned by this component.
    document.head.querySelectorAll(`script[${SCHEMA_ATTR}]`).forEach((el) => el.remove());
    (JSON.parse(schemaJson) as object[]).forEach((block) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute(SCHEMA_ATTR, '');
      script.text = JSON.stringify(block);
      document.head.appendChild(script);
    });
  }, [title, description, path, noindex, type, image, schemaJson]);

  return null;
};

/** SEO tags for a static route defined in src/seo/config.ts. */
export const RouteSEO: React.FC<{ path: keyof typeof ROUTE_META }> = ({ path }) => {
  const meta = ROUTE_META[path];
  return (
    <SEOHelper
      title={meta.title}
      description={meta.description}
      path={meta.path}
      noindex={meta.noindex}
      schemaData={routeSchema(meta.path)}
    />
  );
};
