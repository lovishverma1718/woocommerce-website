import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Sparkles } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useRecentlyViewedStore } from '../../store/useRecentlyViewedStore';
import { useProducts } from '../../hooks/useProducts';
import { formatCurrency, getDeliveryProgress, calculateDeliveryFee } from '../../lib/utils';
import { GlassButton } from '../common/GlassButton';
import { Product } from '../../types';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { items, isCartOpen, closeCart, updateQuantity, removeFromCart, getSubtotal } = useCartStore();
  const { recentlyViewed } = useRecentlyViewedStore();
  const { data: popularProducts = [] } = useProducts({ featuredOnly: true } as any);

  const subtotal = getSubtotal();
  const deliveryFee = calculateDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;
  const progress = getDeliveryProgress(subtotal);

  const recommendations = recentlyViewed.length > 0
    ? recentlyViewed.filter((p: Product) => !items.some(i => i.productId === p.id))
    : popularProducts.filter((p: Product) => !items.some(i => i.productId === p.id)).slice(0, 3);

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-md transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-screen max-w-md bg-white border-l border-border shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-border flex items-center justify-between bg-surface">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-forest flex items-center justify-center text-gold shadow-md">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-forest">Your Reserve Cart</h2>
                    <p className="text-xs text-charcoal-muted">{items.length} items selected</p>
                  </div>
                </div>

                <button
                  onClick={closeCart}
                  className="p-2 text-charcoal-muted hover:text-charcoal hover:bg-white rounded-full transition-colors cursor-pointer"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Meter */}
              <div className="px-6 py-4 bg-forest/5 border-b border-border space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-forest">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-gold" />
                    {progress.remaining === 0
                      ? 'You unlocked FREE Same-Day Local Delivery!'
                      : `Add ${formatCurrency(progress.remaining)} for FREE Delivery`}
                  </span>
                  <span>{progress.percent}%</span>
                </div>
                <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-forest to-gold transition-all duration-500 rounded-full"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              </div>

              {/* Cart Items & Cross-sell List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="w-16 h-16 rounded-full bg-surface-secondary flex items-center justify-center text-charcoal-muted">
                      <ShoppingBag className="w-8 h-8 text-gold" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-charcoal">Your cart is empty</h3>
                      <p className="text-xs text-charcoal-muted max-w-xs">
                        Browse craft flower, cold cured live rosin, and artisanal gummies.
                      </p>
                    </div>
                    <Link to="/shop" onClick={closeCart}>
                      <GlassButton variant="primary" size="md">
                        Explore Reserve Catalog
                      </GlassButton>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl border border-border bg-surface/50 flex gap-4 items-center justify-between shadow-xs hover:border-forest/30 transition-all"
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-16 h-16 rounded-xl object-cover bg-white shrink-0 border border-border"
                          />

                          <div className="flex-1 min-w-0 space-y-1">
                            <h4 className="text-sm font-bold text-charcoal truncate">
                              {item.product.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-charcoal-muted">
                              <span className="font-semibold text-forest">{item.selectedWeight}</span>
                              <span>•</span>
                              <span>{formatCurrency(item.selectedPrice)}</span>
                            </div>

                            {/* Quantity Stepper */}
                            <div className="flex items-center gap-3 pt-1">
                              <div className="flex items-center border border-border rounded-lg bg-white overflow-hidden">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-1 hover:bg-surface text-charcoal transition-colors cursor-pointer"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="px-3 text-xs font-bold text-charcoal">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-1 hover:bg-surface text-charcoal transition-colors cursor-pointer"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-charcoal-muted hover:text-accent-danger text-xs p-1 transition-colors cursor-pointer"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-sm font-bold text-forest block">
                              {formatCurrency(item.selectedPrice * item.quantity)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cross-Sell Recommendations */}
                    {recommendations.length > 0 && (
                      <div className="pt-6 border-t border-border space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-forest block">
                          You May Also Like:
                        </span>
                        <div className="space-y-2">
                          {recommendations.slice(0, 2).map((rec: Product) => (
                            <Link
                              key={rec.id}
                              to={`/product/${rec.slug}`}
                              onClick={closeCart}
                              className="p-3 rounded-xl border border-border bg-white flex items-center justify-between hover:border-forest/40 transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <img src={rec.images[0]} alt={rec.name} className="w-10 h-10 rounded-lg object-cover bg-surface" />
                                <div>
                                  <h5 className="text-xs font-bold text-charcoal group-hover:text-forest transition-colors truncate max-w-[160px]">
                                    {rec.name}
                                  </h5>
                                  <span className="text-[11px] text-forest font-semibold">
                                    {formatCurrency(rec.price)}
                                  </span>
                                </div>
                              </div>
                              <span className="text-xs font-semibold text-gold group-hover:underline">
                                View →
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Drawer Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-border bg-surface space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-charcoal-muted">
                      <span>Subtotal</span>
                      <span className="font-medium text-charcoal">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-charcoal-muted">
                      <span>Estimated Delivery</span>
                      <span className="font-medium text-forest">
                        {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-forest pt-2 border-t border-border">
                      <span>Total Estimated</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <GlassButton
                    variant="primary"
                    size="lg"
                    className="w-full font-bold"
                    icon={<ArrowRight className="w-5 h-5 text-gold" />}
                    onClick={handleCheckoutClick}
                  >
                    Proceed to Checkout
                  </GlassButton>

                  <div className="text-[11px] text-center text-charcoal-muted flex items-center justify-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span>Same-Day Dispatch • Interac E-Transfer & COD</span>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
