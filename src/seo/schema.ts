import { MOCK_FAQS } from '../api/mockData';
import {
  ROUTE_META,
  breadcrumbSchema,
  faqPageSchema,
  localBusinessSchema,
  websiteSchema,
} from './config';

const BREADCRUMB_NAMES: Record<string, string> = {
  '/shop': 'Shop',
  '/about': 'About',
  '/faq': 'FAQ',
  '/contact': 'Contact',
  '/privacy-policy': 'Privacy Policy',
  '/terms': 'Terms of Service',
};

/** JSON-LD blocks for a static route. */
export const routeSchema = (path: string): object[] => {
  // Home shows the first 4 FAQs (FAQPreview), so its FAQ schema lists exactly those.
  if (path === '/') return [localBusinessSchema(), websiteSchema(), faqPageSchema(MOCK_FAQS.slice(0, 4))];

  const blocks: object[] = [];
  if (BREADCRUMB_NAMES[path]) {
    blocks.push(
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: BREADCRUMB_NAMES[path], path },
      ])
    );
  }
  if (path === '/faq') blocks.push(faqPageSchema(MOCK_FAQS));
  if (path === '/contact') blocks.push(localBusinessSchema());
  return blocks;
};

export const routeMeta = (path: string) => ROUTE_META[path];
