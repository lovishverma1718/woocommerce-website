import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useUIStore } from '../../store/useUIStore';
import { useCartStore } from '../../store/useCartStore';
import { GlassBadge } from '../common/GlassBadge';
import { Rating } from '../common/Rating';
import { GlassButton } from '../common/GlassButton';
import { formatCurrency } from '../../lib/utils';
import { ShoppingBag, Check, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, isQuickViewOpen, closeQuickView, addToast } = useUIStore();
  const { addToCart } = useCartStore();
  const [selectedWeight, setSelectedWeight] = useState<string>('');
  const [added, setAdded] = useState(false);

  if (!quickViewProduct) return null;

  const activeWeight = selectedWeight || quickViewProduct.defaultWeight || '3.5g';
  const weightOpt = quickViewProduct.weightOptions.find(w => w.label === activeWeight);
  const currentPrice = weightOpt ? (weightOpt.salePrice || weightOpt.price) : quickViewProduct.price;

  const handleAddToCart = () => {
    addToCart(quickViewProduct, activeWeight, 1);
    setAdded(true);
    addToast(`Added ${quickViewProduct.name} to cart`, 'success');
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Modal isOpen={isQuickViewOpen} onClose={closeQuickView} maxWidth="2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Product Image */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-surface border border-border">
          <img
            src={quickViewProduct.images[0]}
            alt={quickViewProduct.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 flex gap-1.5">
            {quickViewProduct.badge && <GlassBadge variant="gold">{quickViewProduct.badge}</GlassBadge>}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gold-hover font-semibold tracking-wider uppercase">
                {quickViewProduct.category}
              </span>
              <Rating rating={quickViewProduct.rating} count={quickViewProduct.reviewCount} />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-forest tracking-tight">
              {quickViewProduct.name}
            </h2>

            <div className="flex items-center gap-2">
              <GlassBadge variant="strain">
                {quickViewProduct.strainType}
              </GlassBadge>
            </div>

            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              {quickViewProduct.shortDescription}
            </p>

            {/* Weight selector (Only shown for Flower, Concentrates, and Mushrooms) */}
            {(() => {
              const cat = (quickViewProduct.categorySlug || quickViewProduct.category || '').toLowerCase();
              const showWeight = cat.includes('flower') || cat.includes('concentrate') || cat.includes('rosin') || cat.includes('mushroom') || cat.includes('micro');
              if (!showWeight || !quickViewProduct.weightOptions || quickViewProduct.weightOptions.length <= 1) return null;

              return (
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-semibold text-charcoal block">Select Weight / Quantity:</span>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.weightOptions.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => setSelectedWeight(opt.label)}
                        className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-all ${
                          activeWeight === opt.label
                            ? 'bg-forest text-white border-forest shadow-xs'
                            : 'bg-surface text-charcoal-muted border-border hover:border-forest/40'
                        }`}
                      >
                        {opt.label} ({formatCurrency(opt.salePrice || opt.price)})
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-forest">
                {formatCurrency(currentPrice)}
              </span>
              {weightOpt?.salePrice && (
                <span className="text-sm text-charcoal-muted line-through">
                  {formatCurrency(weightOpt.price)}
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <GlassButton
                variant="primary"
                size="md"
                className="flex-1 font-bold"
                icon={added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4 text-gold" />}
                onClick={handleAddToCart}
              >
                {added ? 'Added to Cart' : 'Add to Cart'}
              </GlassButton>
            </div>

            <div className="flex items-center justify-between text-xs text-charcoal-muted pt-2 border-t border-border/50">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gold" />
                1–3 Hour Dispatch
              </span>
              <Link
                to={`/product/${quickViewProduct.slug}`}
                onClick={closeQuickView}
                className="text-forest font-semibold hover:underline"
              >
                View Full Details →
              </Link>
            </div>
          </div>

        </div>

      </div>
    </Modal>
  );
};
