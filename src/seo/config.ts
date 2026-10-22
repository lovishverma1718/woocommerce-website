import { BRAND, DELIVERY_ZONES } from '../lib/constants';

/**
 * Single source of truth for SEO.
 * Used at runtime by <SEOHelper />, and at build time by scripts/prerender.mjs
 * and scripts/sitemap.mjs, so titles, canonicals and schema never drift apart.
 */

export const SITE_URL = 'https://elitebud.ca';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  /** Excluded from search results and from the sitemap. */
  noindex?: boolean;
  /** Rendered to static HTML at build time. */
  prerender?: boolean;
  /** Sitemap hints. */
  changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority?: number;
}

export const AREAS_SERVED = Array.from(
  new Set(
    DELIVERY_ZONES.map((z) => z.city).filter((c) => c !== 'Abbotsford Airport')
  )
);

export const ROUTE_META: Record<string, RouteMeta> = {
  '/': {
    path: '/',
    title: 'Weed Delivery Abbotsford BC | 1 to 3 Hour Delivery | EliteBud',
    description:
      'Same day weed delivery in Abbotsford, Mission, Chilliwack, Aldergrove and Langley Township. Delivered in 1 to 3 hours, free over $50. Pay by Interac e-Transfer or cash.',
    prerender: true,
    changefreq: 'daily',
    priority: 1.0,
  },
  '/shop': {
    path: '/shop',
    title: 'Shop Weed Online Abbotsford | Flower, Edibles, Vapes | EliteBud',
    description:
      'Browse premium flower, pre rolls, edibles, THC vapes, concentrates and more. Order online for same day delivery across Abbotsford and the Fraser Valley.',
    prerender: true,
    changefreq: 'daily',
    priority: 0.9,
  },
  '/about': {
    path: '/about',
    title: 'About EliteBud | Abbotsford Cannabis Delivery Service',
    description:
      'EliteBud is an Abbotsford based cannabis delivery service offering 1 to 3 hour same day delivery to Mission, Chilliwack, Aldergrove and Langley Township.',
    prerender: true,
    changefreq: 'monthly',
    priority: 0.6,
  },
  '/faq': {
    path: '/faq',
    title: 'Weed Delivery FAQ | Hours, Payment and Delivery Areas | EliteBud',
    description:
      'Answers about EliteBud delivery times, delivery areas, minimum orders, Interac e-Transfer and cash payments, and age requirements in Abbotsford, BC.',
    prerender: true,
    changefreq: 'monthly',
    priority: 0.7,
  },
  '/contact': {
    path: '/contact',
    title: 'Contact EliteBud | Abbotsford Weed Delivery Dispatch',
    description: `Call or text EliteBud dispatch at ${BRAND.phoneFormatted} for orders and delivery updates. Open ${BRAND.hours} daily across Abbotsford and the Fraser Valley.`,
    prerender: true,
    changefreq: 'monthly',
    priority: 0.6,
  },
  '/privacy-policy': {
    path: '/privacy-policy',
    title: 'Privacy Policy | EliteBud',
    description: 'How EliteBud collects, uses and protects your personal information.',
    prerender: true,
    changefreq: 'yearly',
    priority: 0.2,
  },
  '/terms': {
    path: '/terms',
    title: 'Terms of Service | EliteBud',
    description: 'Terms and conditions for ordering from EliteBud cannabis delivery.',
    prerender: true,
    changefreq: 'yearly',
    priority: 0.2,
  },
  '/cart': {
    path: '/cart',
    title: 'Your Cart | EliteBud',
    description: 'Review the items in your EliteBud cart.',
    noindex: true,
  },
  '/checkout': {
    path: '/checkout',
    title: 'Checkout | EliteBud',
    description: 'Complete your EliteBud order.',
    noindex: true,
  },
};

export const NOT_FOUND_META: RouteMeta = {
  path: '/404',
  title: 'Page Not Found | EliteBud',
  description: 'The page you are looking for could not be found.',
  noindex: true,
};

export const canonicalUrl = (path: string) =>
  path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path.replace(/\/+$/, '')}`;

/* ---------------------------- Structured data ---------------------------- */

export const localBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#business`,
  name: BRAND.name,
  slogan: BRAND.tagline,
  url: `${SITE_URL}/`,
  logo: DEFAULT_OG_IMAGE,
  image: DEFAULT_OG_IMAGE,
  telephone: BRAND.phoneFormatted,
  email: BRAND.email,
  priceRange: '$$',
  paymentAccepted: 'Interac e-Transfer, Cash',
  currenciesAccepted: 'CAD',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Abbotsford',
    addressRegion: 'BC',
    addressCountry: 'CA',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: `${String(BRAND.hoursOpen).padStart(2, '0')}:00`,
      closes: `${String(BRAND.hoursClose).padStart(2, '0')}:00`,
    },
  ],
  areaServed: AREAS_SERVED.map((name) => ({ '@type': 'City', name: `${name}, BC` })),
});

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: BRAND.name,
  url: `${SITE_URL}/`,
  publisher: { '@id': `${SITE_URL}/#business` },
});

export const faqPageSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
});

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: canonicalUrl(item.path),
  })),
});
