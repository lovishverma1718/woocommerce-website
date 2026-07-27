import React from 'react';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Sparkles, Zap, Lock, Headset } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

export const DeliveryHighlights: React.FC = () => {
  const highlights = [
    {
      icon: <Truck className="w-6 h-6 text-gold" />,
      title: '1–3 Hour Local Delivery',
      description: 'Rapid dispatch drivers deliver directly to your doorstep in Abbotsford & surrounding areas.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-gold" />,
      title: 'Ultra-Premium Craft Buds',
      description: 'Hand-trimmed, small-batch flower cured in micro-climate greenhouse facilities.',
    },
    {
      icon: <Zap className="w-6 h-6 text-gold" />,
      title: 'Fresh Daily Inventory',
      description: 'Strict terpene preservation and temperature-controlled storage environment.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-gold" />,
      title: 'Fast Headless Checkout',
      description: 'Seamless API-driven checkout experience without traditional WooCommerce delay.',
    },
    {
      icon: <Lock className="w-6 h-6 text-gold" />,
      title: 'Secure Payments',
      description: 'Instant Interac E-Transfer auto-deposit or exact Cash On Delivery options.',
    },
    {
      icon: <Headset className="w-6 h-6 text-gold" />,
      title: 'Professional Service',
      description: 'Direct phone dispatch support and real-time SMS driver arrival notifications.',
    },
  ];

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-hover block">
            Enterprise Standard
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-forest tracking-tight">
            The EliteBud Delivery Promise
          </h2>
          <p className="text-charcoal-muted text-sm sm:text-base leading-relaxed">
            Combining luxury craft quality with speed, security, and exceptional customer service.
          </p>
        </div>

        {/* 6 Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <GlassCard interactive className="h-full space-y-4 border border-border bg-white">
                <div className="w-12 h-12 rounded-xl bg-forest/5 flex items-center justify-center border border-forest/10">
                  {item.icon}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-charcoal">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
