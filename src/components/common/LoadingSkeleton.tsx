import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl glass-card p-4 space-y-4 animate-pulse border border-border">
      <div className="w-full h-56 bg-surface-secondary rounded-xl" />
      <div className="space-y-2">
        <div className="w-1/3 h-4 bg-surface-secondary rounded" />
        <div className="w-3/4 h-5 bg-surface-secondary rounded" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="w-1/4 h-6 bg-surface-secondary rounded" />
        <div className="w-1/3 h-9 bg-surface-secondary rounded-xl" />
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
