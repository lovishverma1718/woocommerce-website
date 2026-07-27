import React from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';
import { useFilterStore } from '../../store/useFilterStore';
import { useCategories } from '../../hooks/useProducts';

export const FilterBar: React.FC = () => {
  const {
    searchQuery,
    category,
    strainType,
    maxPrice,
    inStockOnly,
    sortBy,
    setSearchQuery,
    setCategory,
    setStrainType,
    setPriceRange,
    setInStockOnly,
    setSortBy,
    resetFilters,
  } = useFilterStore();

  const { data: categories = [] } = useCategories();

  const strainOptions = ['all', 'Indica', 'Sativa', 'Hybrid', 'High CBD'];

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6 rounded-2xl glass-card p-6 border border-border h-fit sticky top-28">
      
      {/* Title Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2 text-forest font-bold">
          <Filter className="w-4 h-4 text-gold" />
          <h3 className="text-base tracking-tight">Filter & Sort</h3>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs text-charcoal-muted hover:text-forest flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Instant Search Input */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-forest block">
          Search
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flower, resin..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-forest/20 text-charcoal placeholder:text-charcoal-muted"
          />
        </div>
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-forest block">
          Category
        </label>
        <div className="space-y-1">
          <button
            onClick={() => setCategory('all')}
            className={`w-full text-left px-3 py-2 text-xs rounded-lg font-medium transition-colors ${
              category === 'all'
                ? 'bg-forest text-white shadow-xs font-semibold'
                : 'text-charcoal-muted hover:bg-surface'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.slug)}
              className={`w-full text-left px-3 py-2 text-xs rounded-lg font-medium flex items-center justify-between transition-colors ${
                category === cat.slug
                  ? 'bg-forest text-white shadow-xs font-semibold'
                  : 'text-charcoal-muted hover:bg-surface'
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] opacity-70">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Strain Type Filter */}
      <div className="space-y-2 pt-2 border-t border-border">
        <label className="text-xs font-bold uppercase tracking-wider text-forest block">
          Strain Profile
        </label>
        <div className="flex flex-wrap gap-1.5">
          {strainOptions.map((st) => (
            <button
              key={st}
              onClick={() => setStrainType(st)}
              className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-all ${
                strainType === st
                  ? 'bg-forest text-white border-forest shadow-xs'
                  : 'bg-surface text-charcoal-muted border-border hover:border-forest/40'
              }`}
            >
              {st === 'all' ? 'All Strains' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Max Price Slider */}
      <div className="space-y-2 pt-2 border-t border-border">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-forest">
          <span>Max Price</span>
          <span className="text-forest font-bold">${maxPrice} CAD</span>
        </div>
        <input
          type="range"
          min="10"
          max="300"
          step="10"
          value={maxPrice}
          onChange={(e) => setPriceRange(0, Number(e.target.value))}
          className="w-full accent-forest cursor-pointer"
        />
      </div>

      {/* In-Stock Toggle */}
      <div className="pt-2 border-t border-border flex items-center justify-between">
        <label htmlFor="instock-toggle" className="text-xs font-medium text-charcoal cursor-pointer">
          In Stock Only
        </label>
        <input
          id="instock-toggle"
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="w-4 h-4 accent-forest rounded cursor-pointer"
        />
      </div>

      {/* Sort By Dropdown */}
      <div className="space-y-2 pt-2 border-t border-border">
        <label className="text-xs font-bold uppercase tracking-wider text-forest block">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="w-full p-2.5 text-xs rounded-xl border border-border bg-surface text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-forest/20 cursor-pointer"
        >
          <option value="featured">Featured Selections</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Newest Batches</option>
        </select>
      </div>

    </aside>
  );
};
