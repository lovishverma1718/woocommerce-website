import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, ShoppingBag, Check, Heart } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { GlassBadge } from '../common/GlassBadge';
import { Rating } from '../common/Rating';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';
import { useWishlistStore } from '../../store/useWishlistStore';

export interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCartStore();
  const { openQuickView, addToast } = useUIStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const [selectedWeight, setSelectedWeight] = useState(product.defaultWeight || '3.5g');
  const [added, setAdded] = useState(false);

  const isFavorite = isInWishlist(product.id);

  // Find active weight option price
  const weightOpt = product.weightOptions.find(w => w.label === selectedWeight);
  const currentPrice = weightOpt ? (weightOpt.salePrice || weightOpt.price) : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedWeight, 1);
    setAdded(true);
    addToast(`Added ${product.name} (${selectedWeight}) to your cart`, 'success');
    setTimeout(() => setAdded(false), 2000);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    addToast(isFavorite ? `Removed ${product.name} from wishlist` : `Saved ${product.name} to wishlist`, 'info');
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl glass-card overflow-hidden border border-border flex flex-col h-full bg-white shadow-xs hover:shadow-card-hover"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-surface-secondary">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Top Left Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {product.badge && (
            <GlassBadge variant="gold">{product.badge}</GlassBadge>
          )}
          {product.onSale && (
            <GlassBadge variant="emerald">Sale</GlassBadge>
          )}
        </div>

        {/* Strain Profile pill */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <GlassBadge variant="strain">
            {product.strainType}
          </GlassBadge>
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute bottom-3 right-3 z-20 p-2.5 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
            isFavorite
              ? 'bg-red-500 text-white border-red-500 shadow-md scale-105'
              : 'bg-white/80 text-charcoal-muted hover:text-red-500 border-white/60 hover:bg-white'
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
        </button>

        {/* Quick View Floating Overlay Button */}
        <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-4 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={handleQuickView}
            className="px-4 py-2.5 bg-white text-forest font-semibold text-xs rounded-full shadow-xl hover:scale-105 transition-transform cursor-pointer flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-gold" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-gold-hover font-semibold tracking-wider uppercase">
              {product.category}
            </span>
            <Rating rating={product.rating} count={product.reviewCount} size="sm" />
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-base font-bold text-charcoal group-hover:text-forest transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Tagline */}
          <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed font-light">
            {product.tagline || product.shortDescription}
          </p>
        </div>

        {/* Weight Option Selector (Only shown for Flower, Concentrates, and Mushrooms) */}
        {(() => {
          const cat = (product.categorySlug || product.category || '').toLowerCase();
          const showWeight = cat.includes('flower') || cat.includes('concentrate') || cat.includes('rosin') || cat.includes('mushroom') || cat.includes('micro');
          if (!showWeight || !product.weightOptions || product.weightOptions.length <= 1) return null;

          return (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
              {product.weightOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedWeight(opt.label);
                  }}
                  className={`px-2.5 py-1 text-[11px] rounded-lg border font-medium transition-all cursor-pointer ${
                    selectedWeight === opt.label
                      ? 'bg-forest text-white border-forest shadow-xs font-bold'
                      : 'bg-surface text-charcoal-muted border-border hover:border-forest/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          );
        })()}

        {/* Bottom Price & Add to Cart Action */}
        <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-charcoal-muted uppercase tracking-wider block">Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-forest">
                {formatCurrency(currentPrice)}
              </span>
              {weightOpt?.salePrice && (
                <span className="text-xs text-charcoal-muted line-through">
                  {formatCurrency(weightOpt.price)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              added
                ? 'bg-emerald text-white shadow-md'
                : 'bg-forest text-white hover:bg-forest-hover shadow-md hover:shadow-forest/20 active:scale-95'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-gold" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
