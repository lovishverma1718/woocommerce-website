import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface WishlistStoreState {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStoreState>()(
  persist(
    (set, get) => ({
      wishlistIds: [],
      toggleWishlist: (productId: string) => {
        const current = get().wishlistIds;
        if (current.includes(productId)) {
          set({ wishlistIds: current.filter(id => id !== productId) });
        } else {
          set({ wishlistIds: [...current, productId] });
        }
      },
      isInWishlist: (productId: string) => get().wishlistIds.includes(productId),
    }),
    {
      name: 'elitebud-wishlist-storage',
    }
  )
);

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
