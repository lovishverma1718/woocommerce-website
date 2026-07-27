import React, { useState } from 'react';
import { Accordion } from '../components/common/Accordion';
import { useFAQs } from '../hooks/useProducts';
import { Search, HelpCircle } from 'lucide-react';
import { BRAND } from '../lib/constants';

export const FAQ: React.FC = () => {
  const { data: faqs = [] } = useFAQs();
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Delivery', 'Products', 'Payments', 'Promotions', 'Hours'];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeTab === 'All' || faq.category === activeTab;
    const matchesQuery = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const accordionItems = filteredFaqs.map(f => ({
    id: f.id,
    title: f.question,
    content: f.answer,
  }));

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-hover block">
          Help & Customer Support
        </span>
        <h1 className="text-4xl font-bold text-forest tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-charcoal-muted text-sm sm:text-base max-w-xl mx-auto">
          Find instant answers regarding Abbotsford delivery times, payment methods, and product curing.
        </p>
      </div>

      {/* Search & Category Filter Tabs */}
      <div className="space-y-4">
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-charcoal-muted absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-border bg-surface text-charcoal focus:ring-2 focus:ring-forest/20"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 text-xs rounded-xl border font-medium transition-all ${
                activeTab === cat
                  ? 'bg-forest text-white border-forest shadow-xs'
                  : 'bg-surface text-charcoal-muted border-border hover:border-forest/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion Component */}
      {accordionItems.length > 0 ? (
        <Accordion items={accordionItems} />
      ) : (
        <div className="py-12 text-center text-charcoal-muted space-y-2">
          <HelpCircle className="w-8 h-8 text-gold mx-auto" />
          <p className="text-sm">No matching questions found for "{searchQuery}".</p>
        </div>
      )}

      {/* Direct Phone Dispatch Callout */}
      <div className="p-8 rounded-2xl glass-card border border-border bg-surface text-center space-y-3">
        <h3 className="text-lg font-bold text-forest">Need Direct Order Assistance?</h3>
        <p className="text-xs text-charcoal-muted max-w-md mx-auto">
          Our Abbotsford dispatch line is open daily 10:00 AM – 11:00 PM PST.
        </p>
        <a
          href={`tel:${BRAND.phoneRaw}`}
          className="inline-block text-sm font-bold text-forest hover:underline"
        >
          Call Dispatch Now: {BRAND.phoneFormatted}
        </a>
      </div>

    </div>
  );
};
