import React from 'react';
import { Link } from 'react-router-dom';
import { Accordion } from '../common/Accordion';
import { useFAQs } from '../../hooks/useProducts';
import { GlassButton } from '../common/GlassButton';

export const FAQPreview: React.FC = () => {
  const { data: faqs = [] } = useFAQs();

  const accordionItems = faqs.slice(0, 4).map(f => ({
    id: f.id,
    title: f.question,
    content: f.answer,
  }));

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-hover block">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-forest tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-charcoal-muted text-sm sm:text-base leading-relaxed">
            Everything you need to know about our same-day Abbotsford delivery process.
          </p>
        </div>

        {/* Accordion List */}
        <Accordion items={accordionItems} defaultOpenId="faq-1" />

        {/* View All FAQ CTA */}
        <div className="text-center pt-4">
          <Link to="/faq">
            <GlassButton variant="outline" size="md">
              View All Frequently Asked Questions
            </GlassButton>
          </Link>
        </div>

      </div>
    </section>
  );
};
