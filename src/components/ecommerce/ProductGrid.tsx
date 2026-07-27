import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from '../common/LoadingSkeleton';

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading = false }) => {
  if (isLoading) {
    return <ProductGridSkeleton count={6} />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-16 text-center rounded-2xl glass-card border border-border space-y-4">
        <h3 className="text-xl font-bold text-forest">No Products Found</h3>
        <p className="text-charcoal-muted max-w-md mx-auto text-sm">
          No items match your active filters. Try adjusting your strain selection or price range.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
