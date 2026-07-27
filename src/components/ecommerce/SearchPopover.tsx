import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/useUIStore';
import { useProducts, useCategories } from '../../hooks/useProducts';
import { Search, X, Sparkles, ArrowRight, Clock, Trash2, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../lib/utils';
import { GlassBadge } from '../common/GlassBadge';

export const SearchPopover: React.FC = () => {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('elitebud-recent-searches');
      return saved ? JSON.parse(saved) : ['Velvet Kush', 'Live Rosin', 'Artisanal Gummies'];
    } catch {
      return ['Velvet Kush', 'Live Rosin', 'Artisanal Gummies'];
    }
  });

  const { data: products = [] } = useProducts({ searchQuery: query });
  const { data: categories = [] } = useCategories();

  // Keyboard shortcut listener (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('elitebud-recent-searches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('elitebud-recent-searches');
  };

  if (!isSearchOpen) return null;

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex flex-col">
          {/* Fullscreen Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="fixed inset-0 bg-charcoal/80 backdrop-blur-2xl transition-opacity"
          />

          {/* Fullscreen Content Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 flex flex-col h-full max-h-screen text-white"
          >
            {/* Top Search Input Bar */}
            <div className="flex items-center gap-4 pb-6 border-b border-white/20">
              <div className="relative flex-1">
                <Search className="w-6 h-6 text-gold absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && query.trim()) {
                      saveRecentSearch(query.trim());
                    }
                  }}
                  placeholder="Search craft flower, live rosin, THC pens, artisanal gummies..."
                  className="w-full pl-14 pr-12 py-4 text-lg sm:text-2xl font-light rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold/50 backdrop-blur-md"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Close ESC Button */}
              <button
                onClick={closeSearch}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center gap-2 text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer shrink-0"
              >
                <span>ESC</span>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto py-8 no-scrollbar space-y-8">
              
              {query.trim() === '' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Recent Searches
                        </span>
                        <button
                          onClick={clearRecentSearches}
                          className="text-xs text-white/50 hover:text-accent-danger flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => setQuery(term)}
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-gold/20 border border-white/15 text-xs font-medium transition-colors flex items-center gap-2"
                          >
                            <span>{term}</span>
                            <ArrowRight className="w-3 h-3 text-gold opacity-60" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  <div className="space-y-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Popular Menu Queries
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['Velvet Kush Reserve', 'Solventless Rosin', 'Pomegranate Gummies', 'THC Cartridge', 'Microdose'].map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-gold/20 border border-white/15 text-xs font-medium transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Pills */}
                  <div className="md:col-span-2 space-y-4 pt-4 border-t border-white/10">
                    <span className="text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Browse by Category
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/shop?category=${cat.slug}`}
                          onClick={closeSearch}
                          className="p-3 rounded-xl bg-white/10 hover:bg-forest border border-white/15 text-center transition-colors group"
                        >
                          <span className="text-xs font-bold block text-white group-hover:text-gold">
                            {cat.name}
                          </span>
                          <span className="text-[10px] text-white/60 block mt-0.5">
                            {cat.count} items
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                </div>
              ) : products.length === 0 ? (
                <div className="py-16 text-center text-white/70 space-y-2">
                  <Sparkles className="w-10 h-10 text-gold mx-auto" />
                  <h3 className="text-lg font-bold text-white">No products found for "{query}"</h3>
                  <p className="text-xs max-w-sm mx-auto">
                    Try searching for strain names like "Velvet Kush" or product types like "Rosin" or "Gummies".
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-white/70">
                    <span>Search Results ({products.length})</span>
                    <Link
                      to={`/shop?search=${encodeURIComponent(query)}`}
                      onClick={closeSearch}
                      className="text-gold hover:underline flex items-center gap-1"
                    >
                      View all in Shop →
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.slug}`}
                        onClick={() => {
                          saveRecentSearch(query);
                          closeSearch();
                        }}
                        className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center gap-4 transition-all group backdrop-blur-md"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 rounded-xl object-cover bg-white shrink-0 border border-white/20"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gold uppercase tracking-wider">
                              {product.category}
                            </span>
                            <GlassBadge variant="strain" className="bg-white/10 text-white border-white/20 text-[9px] py-0 px-1.5">
                              {product.thcPercentage}% THC
                            </GlassBadge>
                          </div>
                          <h4 className="text-sm font-bold text-white group-hover:text-gold transition-colors truncate">
                            {product.name}
                          </h4>
                          <span className="text-xs font-bold text-gold-light block">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-gold group-hover:translate-x-1 transition-all shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
