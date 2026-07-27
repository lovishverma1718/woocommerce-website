import { create } from 'zustand';
import { FilterState } from '../types';

interface FilterStoreState extends FilterState {
  setSearchQuery: (query: string) => void;
  setCategory: (categorySlug: string) => void;
  setStrainType: (strainType: string) => void;
  setPriceRange: (min: number, max: number) => void;
  setInStockOnly: (inStock: boolean) => void;
  setSortBy: (sort: FilterState['sortBy']) => void;
  resetFilters: () => void;
}

const initialFilters: FilterState = {
  searchQuery: '',
  category: 'all',
  strainType: 'all',
  minPrice: 0,
  maxPrice: 300,
  inStockOnly: false,
  sortBy: 'featured',
};

export const useFilterStore = create<FilterStoreState>((set) => ({
  ...initialFilters,
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCategory: (category) => set({ category }),
  setStrainType: (strainType) => set({ strainType }),
  setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice }),
  setInStockOnly: (inStockOnly) => set({ inStockOnly }),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () => set(initialFilters),
}));
