import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { formatCurrency, getDeliveryProgress, calculateDeliveryFee } from '../lib/utils';
import { GlassButton } from '../components/common/GlassButton';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Truck, ShieldCheck, Sparkles } from 'lucide-react';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, getSubtotal } = useCartStore();

  const subtotal = getSubtotal();
  const deliveryFee = calculateDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;
  const progress = getDeliveryProgress(subtotal);

  if (items.length === 0) {
    return (
      <div className="py-24 max-w-md mx-auto px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-forest/5 flex items-center justify-center text-forest mx-auto">
          <ShoppingBag className="w-10 h-10 text-gold" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-forest">Your Cart is Empty</h1>
          <p className="text-charcoal-muted text-sm leading-relaxed">
            Discover craft flower, cold cured live rosin, and fast-acting artisanal edibles.
          </p>
        </div>
        <Link to="/shop">
          <GlassButton variant="primary" size="lg" className="w-full">
            Explore Craft Catalog
          </GlassButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-border">
        <h1 className="text-4xl font-bold text-forest tracking-tight">Shopping Cart</h1>
        <p className="text-sm text-charcoal-muted">Review your reserve items before same-day dispatch</p>
      </div>

      {/* Free Delivery Bar */}
      <div className="p-6 rounded-2xl glass-card border border-border bg-forest/5 space-y-3">
        <div className="flex justify-between items-center text-sm font-semibold text-forest">
          <span className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-gold" />
            {progress.remaining === 0
              ? 'You unlocked FREE Same-Day Local Delivery!'
              : `Add ${formatCurrency(progress.remaining)} more for FREE Delivery`}
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart Item List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl glass-card border border-border bg-white flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover border border-border bg-surface shrink-0"
                />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-charcoal">{item.product.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-charcoal-muted">
                    <span className="font-semibold text-forest">{item.selectedWeight}</span>
                    <span>•</span>
                    <span>{formatCurrency(item.selectedPrice)} each</span>
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Price */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-border">
                <div className="flex items-center border border-border rounded-xl bg-surface p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 text-charcoal hover:text-forest transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-xs font-bold text-charcoal">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 text-charcoal hover:text-forest transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right min-w-[80px]">
                  <span className="text-base font-bold text-forest block">
                    {formatCurrency(item.selectedPrice * item.quantity)}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-charcoal-muted hover:text-accent-danger p-2 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Box */}
        <div className="lg:col-span-4 rounded-2xl glass-card p-6 border border-border bg-surface space-y-6 sticky top-28">
          <h3 className="text-lg font-bold text-forest pb-4 border-b border-border">Order Summary</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-charcoal-muted">
              <span>Items Subtotal</span>
              <span className="font-semibold text-charcoal">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-charcoal-muted">
              <span>Estimated Delivery Fee</span>
              <span className="font-semibold text-forest">
                {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold text-forest pt-3 border-t border-border">
              <span>Estimated Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <GlassButton
            variant="primary"
            size="lg"
            className="w-full font-bold"
            icon={<ArrowRight className="w-5 h-5 text-gold" />}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </GlassButton>

          <div className="space-y-2 pt-2 border-t border-border text-xs text-charcoal-muted">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
              <span>Government 19+ Photo ID Verified on Arrival</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold shrink-0" />
              <span>Interac E-Transfer & Cash On Delivery</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
