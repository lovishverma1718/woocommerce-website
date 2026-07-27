import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartStoreState {
  items: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, selectedWeight?: string, quantity?: number) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      addToCart: (product: Product, selectedWeight?: string, quantity = 1) => {
        const weightLabel = selectedWeight || product.defaultWeight || '3.5g';
        const weightOpt = product.weightOptions.find(w => w.label === weightLabel);
        const itemPrice = weightOpt ? (weightOpt.salePrice || weightOpt.price) : product.price;

        const cartItemId = `${product.id}-${weightLabel}`;
        const existingItems = get().items;
        const existingIndex = existingItems.findIndex(i => i.id === cartItemId);

        if (existingIndex > -1) {
          const updatedItems = [...existingItems];
          updatedItems[existingIndex].quantity += quantity;
          set({ items: updatedItems, isCartOpen: true });
        } else {
          const newItem: CartItem = {
            id: cartItemId,
            productId: product.id,
            product,
            selectedWeight: weightLabel,
            selectedPrice: itemPrice,
            quantity,
          };
          set({ items: [...existingItems, newItem], isCartOpen: true });
        }
      },

      updateQuantity: (cartItemId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
          get().removeFromCart(cartItemId);
          return;
        }
        set({
          items: get().items.map(item =>
            item.id === cartItemId ? { ...item, quantity: newQuantity } : item
          )
        });
      },

      removeFromCart: (cartItemId: string) => {
        set({
          items: get().items.filter(item => item.id !== cartItemId)
        });
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + (item.selectedPrice * item.quantity), 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'elitebud-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
