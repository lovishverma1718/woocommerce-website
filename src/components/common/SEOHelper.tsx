import React, { useEffect } from 'react';
import { BRAND } from '../../lib/constants';

export interface SEOProps {
  title?: string;
  description?: string;
  type?: 'website' | 'product' | 'faq' | 'local';
  schemaData?: any;
}

export const SEOHelper: React.FC<SEOProps> = ({
  title,
  description,
  schemaData,
}) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | EliteBud Luxury Same-Day Cannabis Delivery`;
    }

    // Default LocalBusiness Schema
    const localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: BRAND.name,
      image: 'https://elitebud.ca/favicon.svg',
      telephone: BRAND.phoneFormatted,
      email: BRAND.email,
      priceRange: '$$$',
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
          opens: '10:00',
          closes: '23:00',
        },
      ],
      areaServed: [
        'Abbotsford',
        'Abbotsford Airport',
        'Mission',
        'Chilliwack',
        'Aldergrove',
        'Langley Township',
      ],
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData || localBusinessSchema);
    script.id = 'json-ld-schema';

    const existingScript = document.getElementById('json-ld-schema');
    if (existingScript) {
      existingScript.remove();
    }
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('json-ld-schema');
      if (el) el.remove();
    };
  }, [title, description, schemaData]);

  return null;
};
