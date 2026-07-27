import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterBar } from '../components/ecommerce/FilterBar';
import { ProductGrid } from '../components/ecommerce/ProductGrid';
import { useProducts } from '../hooks/useProducts';
import { useFilterStore } from '../store/useFilterStore';
import { GlassBadge } from '../components/common/GlassBadge';
import { RotateCcw } from 'lucide-react';

export const Shop: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');
  const urlSearch = searchParams.get('search');

  const {
    searchQuery,
    category,
    strainType,
    minPrice,
    maxPrice,
    inStockOnly,
    sortBy,
    setCategory,
    setSearchQuery,
    resetFilters,
  } = useFilterStore();

  useEffect(() => {
    if (urlCategory) {
      setCategory(urlCategory);
    }
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [urlCategory, urlSearch, setCategory, setSearchQuery]);

  const { data: products = [], isLoading } = useProducts({
    searchQuery,
    category,
    strainType,
    minPrice,
    maxPrice,
    inStockOnly,
    sortBy,
  });

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-border">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-hover block">
          EliteBud Online Dispensary
        </span>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-forest tracking-tight">
            Craft Product Catalog
          </h1>
          <span className="text-sm font-semibold text-charcoal-muted">
            Showing <strong className="text-forest font-bold">{products.length}</strong> products
          </span>
        </div>
      </div>

      {/* Active Filter Pills */}
      {(category !== 'all' || strainType !== 'all' || searchQuery || inStockOnly) && (
        <div className="flex flex-wrap items-center gap-2 pb-2">
          <span className="text-xs font-semibold text-charcoal-muted">Active Filters:</span>
          {category !== 'all' && (
            <GlassBadge variant="forest">Category: {category}</GlassBadge>
          )}
          {strainType !== 'all' && (
            <GlassBadge variant="strain">Strain: {strainType}</GlassBadge>
          )}
          {searchQuery && (
            <GlassBadge variant="emerald">Query: "{searchQuery}"</GlassBadge>
          )}
          {inStockOnly && (
            <GlassBadge variant="gold">In Stock Only</GlassBadge>
          )}
          <button
            onClick={resetFilters}
            className="text-xs text-forest hover:underline font-semibold flex items-center gap-1 ml-2 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All
          </button>
        </div>
      )}

      {/* Main Layout: Filter Sidebar + Product Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <FilterBar />
        <div className="flex-1 w-full">
          <ProductGrid products={products} isLoading={isLoading} />
        </div>
      </div>

    </div>
  );
};
