import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface RecentlyViewedStoreState {
  recentlyViewed: Product[];
  addRecentlyViewed: (product: Product) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStoreState>()(
  persist(
    (set, get) => ({
      recentlyViewed: [],
      addRecentlyViewed: (product: Product) => {
        const current = get().recentlyViewed.filter(p => p.id !== product.id);
        set({ recentlyViewed: [product, ...current].slice(0, 6) });
      },
    }),
    {
      name: 'elitebud-recently-viewed',
    }
  )
);
