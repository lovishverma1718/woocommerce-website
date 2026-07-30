import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductBySlug, useProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/useCartStore';
import { useUIStore } from '../store/useUIStore';
import { useRecentlyViewedStore } from '../store/useRecentlyViewedStore';
import { GlassBadge } from '../components/common/GlassBadge';
import { Rating } from '../components/common/Rating';
import { GlassButton } from '../components/common/GlassButton';
import { ProductCard } from '../components/ecommerce/ProductCard';
import { Accordion } from '../components/common/Accordion';
import { Modal } from '../components/common/Modal';
import { SEOHelper } from '../components/common/SEOHelper';
import { formatCurrency } from '../lib/utils';
import { ShoppingBag, Check, ShieldCheck, Clock, Truck, Plus, Minus, ArrowLeft, Star, Maximize2, Award, Zap } from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProductBySlug(slug);
  const { data: relatedProducts = [] } = useProducts({ category: product?.categorySlug });
  const { addToCart } = useCartStore();
  const { addToast } = useUIStore();
  const { addRecentlyViewed, recentlyViewed } = useRecentlyViewedStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
    }
  }, [product, addRecentlyViewed]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-4 text-center">
        <div className="w-12 h-12 border-4 border-forest border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-charcoal-muted font-medium">Loading Reserve Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 max-w-xl mx-auto px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-forest">Reserve Selection Unavailable</h2>
        <p className="text-charcoal-muted text-sm">
          The requested product is currently rotated out of stock.
        </p>
        <Link to="/shop">
          <GlassButton variant="primary" size="md">
            Return to Shop Catalog
          </GlassButton>
        </Link>
      </div>
    );
  }

  const activeWeightLabel = selectedWeight || product.defaultWeight || '3.5g';
  const weightOpt = product.weightOptions.find(w => w.label === activeWeightLabel);
  const currentUnitPrice = weightOpt ? (weightOpt.salePrice || weightOpt.price) : product.price;

  const handleAddToCart = () => {
    addToCart(product, activeWeightLabel, quantity);
    setAdded(true);
    addToast(`Added ${quantity}x ${product.name} (${activeWeightLabel}) to cart`, 'success');
    setTimeout(() => setAdded(false), 2000);
  };

  const specsAccordion = [
    {
      id: 'desc',
      title: 'Full Cultivation Breakdown & Craft Process',
      content: <p className="leading-relaxed font-light">{product.description}</p>,
    },
    {
      id: 'attrs',
      title: 'Terpene Profile & Certified Laboratory Analysis',
      content: (
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-1.5 border-b border-border">
            <span className="font-semibold text-charcoal">Strain Classification:</span>
            <span className="text-forest font-bold">{product.strainType}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-border">
            <span className="font-semibold text-charcoal">THC Potency:</span>
            <span className="text-forest font-bold">{product.thcPercentage}% THC</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-border">
            <span className="font-semibold text-charcoal">CBD Potency:</span>
            <span className="text-forest font-bold">{product.cbdPercentage}% CBD</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-border">
            <span className="font-semibold text-charcoal">Lab Verification:</span>
            <span className="text-emerald font-semibold flex items-center gap-1">
              <Award className="w-4 h-4" /> Passed 100% Micro-Contaminant Test
            </span>
          </div>
          {product.attributes.map(attr => (
            <div key={attr.name} className="flex justify-between py-1.5 border-b border-border">
              <span className="font-semibold text-charcoal">{attr.name}:</span>
              <span className="text-charcoal-muted">{attr.options.join(', ')}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'delivery-info',
      title: 'Abbotsford Direct Dispatch Guarantee',
      content: (
        <p className="leading-relaxed font-light">
          Orders confirmed before 10:30 PM are dispatched immediately from our central Abbotsford hub. Typical arrival time is 1 to 3 hours. Driver identification verified upon arrival. Free delivery over $50 CAD.
        </p>
      ),
    }
  ];

  return (
    <>
      <SEOHelper
        title={product.name}
        description={product.shortDescription}
        type="product"
        schemaData={{
          '@context': 'https://schema.org/',
          '@type': 'Product',
          name: product.name,
          image: product.images,
          description: product.shortDescription,
          sku: product.id,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'CAD',
            price: currentUnitPrice,
            availability: 'https://schema.org/InStock',
          },
        }}
      />

      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Back Link */}
        <div>
          <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal-muted hover:text-forest transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Craft Catalog</span>
          </Link>
        </div>

        {/* Main PDP Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Multi-Angle Gallery */}
          <div className="lg:col-span-6 space-y-4 sticky top-28">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden glass-card border border-border bg-surface shadow-xl group">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
              />
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <GlassBadge variant="gold">{product.badge}</GlassBadge>
                </div>
              )}

              {/* Lightbox Expand Button */}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-4 right-4 p-3 rounded-full bg-white/80 backdrop-blur-md text-forest hover:bg-white transition-all shadow-md cursor-pointer"
                title="Expand Gallery"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto py-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === i
                        ? 'border-forest shadow-md scale-105'
                        : 'border-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Buy Box & Specifications */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3 pb-6 border-b border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gold-hover font-bold uppercase tracking-wider">
                  {product.category}
                </span>
                <div className="flex items-center gap-2">
                  <Rating rating={product.rating} count={product.reviewCount} size="md" />
                  <span className="text-[11px] bg-gold/10 text-gold-hover px-2 py-0.5 rounded font-bold">
                    5.0 ★ Google Score
                  </span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-forest tracking-tight">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <GlassBadge variant="strain">
                  {product.strainType} • {product.thcPercentage}% THC
                </GlassBadge>
                {product.cbdPercentage > 0 && (
                  <GlassBadge variant="emerald">{product.cbdPercentage}% CBD</GlassBadge>
                )}
                <span className="inline-flex items-center gap-1 text-xs bg-emerald/10 text-emerald px-2.5 py-1 rounded-full font-semibold">
                  <Zap className="w-3.5 h-3.5" />
                  In Stock - Ready for 1–3 Hr Dispatch
                </span>
              </div>

              <p className="text-sm text-charcoal-muted leading-relaxed font-light pt-2">
                {product.shortDescription}
              </p>
            </div>

            {/* Effects & Terpene Aroma Tags */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-surface border border-border text-xs">
              <div>
                <span className="font-bold text-forest block mb-1">Expected Effects</span>
                <div className="flex flex-wrap gap-1">
                  {product.effects.map(eff => (
                    <span key={eff} className="bg-white px-2 py-0.5 rounded border border-border text-charcoal font-medium">
                      {eff}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-forest block mb-1">Terpene Aroma</span>
                <div className="flex flex-wrap gap-1">
                  {product.aroma.map(arm => (
                    <span key={arm} className="bg-white px-2 py-0.5 rounded border border-border text-charcoal font-medium">
                      {arm}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Weight Option Selector (Only shown for Flower, Concentrates, and Mushrooms) */}
            {(() => {
              const cat = (product.categorySlug || product.category || '').toLowerCase();
              const showWeight = cat.includes('flower') || cat.includes('concentrate') || cat.includes('rosin') || cat.includes('mushroom') || cat.includes('micro');
              if (!showWeight || !product.weightOptions || product.weightOptions.length <= 1) return null;

              return (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-forest block">
                    Select Weight / Quantity Option:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {product.weightOptions.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => setSelectedWeight(opt.label)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedWeight === opt.label
                            ? 'border-forest bg-forest/5 ring-2 ring-forest/20 font-bold'
                            : 'border-border bg-white hover:border-forest/40'
                        }`}
                      >
                        <span className="block text-xs font-bold text-charcoal">{opt.label}</span>
                        <span className="block text-[11px] text-forest mt-0.5 font-semibold">
                          {formatCurrency(opt.salePrice || opt.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Purchase Action Box */}
            <div className="p-6 rounded-2xl glass-card border border-border space-y-6 bg-white shadow-luxury">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-charcoal-muted block">Selected Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-forest">
                      {formatCurrency(currentUnitPrice * quantity)}
                    </span>
                    {weightOpt?.salePrice && (
                      <span className="text-sm text-charcoal-muted line-through">
                        {formatCurrency(weightOpt.price * quantity)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center border border-border rounded-xl bg-surface p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-charcoal hover:text-forest transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-charcoal">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-charcoal hover:text-forest transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <GlassButton
                variant="primary"
                size="lg"
                className="w-full font-bold shadow-xl"
                icon={added ? <Check className="w-5 h-5 text-white" /> : <ShoppingBag className="w-5 h-5 text-gold" />}
                onClick={handleAddToCart}
              >
                {added ? 'Added to Reserve Cart' : `Add ${quantity}x to Cart • ${formatCurrency(currentUnitPrice * quantity)}`}
              </GlassButton>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-charcoal-muted border-t border-border">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-gold shrink-0" />
                  <span>1–3 Hour Dispatch</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                  <span>Free Shipping Over $50</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Apple-Style Specifications Breakdown */}
        <div className="pt-12 border-t border-border space-y-6">
          <h3 className="text-2xl font-bold text-forest">Craft Cultivation & Terpene Breakdown</h3>
          <Accordion items={specsAccordion} defaultOpenId="desc" />
        </div>

        {/* Customer Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="pt-12 border-t border-border space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-forest">Verified Customer Reviews</h3>
              <Rating rating={product.rating} count={product.reviewCount} size="md" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.reviews.map(rev => (
                <div key={rev.id} className="p-6 rounded-2xl glass-card border border-border space-y-3 bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-charcoal text-sm">{rev.author}</h4>
                      <span className="text-xs text-emerald font-semibold">Verified Abbotsford Buyer</span>
                    </div>
                    <Rating rating={rev.rating} showText={false} />
                  </div>
                  <p className="text-xs sm:text-sm text-charcoal-muted italic">"{rev.comment}"</p>
                  <span className="text-[11px] text-charcoal-muted block">{rev.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Products */}
        {recentlyViewed.length > 1 && (
          <div className="pt-12 border-t border-border space-y-6">
            <h3 className="text-2xl font-bold text-forest">Recently Viewed Selections</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewed
                .filter(p => p.id !== product.id)
                .slice(0, 4)
                .map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 1 && (
          <div className="pt-12 border-t border-border space-y-8">
            <h3 className="text-2xl font-bold text-forest">You May Also Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedProducts
                .filter(p => p.id !== product.id)
                .slice(0, 3)
                .map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
            </div>
          </div>
        )}

      </div>

      {/* Lightbox Image Preview Modal */}
      <Modal isOpen={isLightboxOpen} onClose={() => setIsLightboxOpen(false)} maxWidth="2xl">
        <div className="space-y-4 text-center">
          <img
            src={product.images[activeImageIndex] || product.images[0]}
            alt={product.name}
            className="w-full max-h-[75vh] object-contain rounded-xl"
          />
          <span className="text-xs text-charcoal-muted font-medium block">
            {product.name} — Image {activeImageIndex + 1} of {product.images.length}
          </span>
        </div>
      </Modal>

      {/* Apple-Style Sticky Bottom Purchase Bar */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-border p-4 shadow-2xl transition-all duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={product.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover border border-border" />
              <div className="hidden sm:block">
                <h4 className="text-sm font-bold text-charcoal">{product.name}</h4>
                <span className="text-xs text-forest font-semibold">{activeWeightLabel} • {formatCurrency(currentUnitPrice)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-forest sm:hidden">
                {formatCurrency(currentUnitPrice)}
              </span>
              <GlassButton variant="primary" size="sm" icon={<ShoppingBag className="w-4 h-4 text-gold" />} onClick={handleAddToCart}>
                Add to Cart
              </GlassButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
