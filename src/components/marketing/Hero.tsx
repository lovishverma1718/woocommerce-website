import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, CreditCard, Clock, ArrowRight, Sparkles, Mail } from 'lucide-react';
import { GlassButton } from '../common/GlassButton';
import { BRAND } from '../../lib/constants';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-surface via-white to-white">
      {/* Background Subtle Luxury Light Shapes */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute top-1/2 left-0 -z-10 w-96 h-96 bg-forest/5 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Typography & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-8 text-left"
          >
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-badge-gold text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Abbotsford's Premier Delivery Brand</span>
              </div>

              {/* HIGHLIGHTED OFFICIAL E-TRANSFER EMAIL */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest text-gold border border-gold/40 text-xs font-bold shadow-md">
                <Mail className="w-3.5 h-3.5 text-gold shrink-0 animate-pulse" />
                <span>Official E-Transfer Email:</span>
                <strong className="text-white font-mono underline decoration-gold underline-offset-2">{BRAND.email}</strong>
              </div>
            </div>

            {/* Headline with Instrument Serif Emphasis */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-forest leading-[1.08]">
              Premium Same-Day <br />
              <span className="font-serif italic font-normal text-gold-hover">Cannabis Delivery</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-charcoal-muted max-w-2xl font-light leading-relaxed">
              Ultra-premium craft flower, solventless live rosin, and artisanal gummies delivered directly across Abbotsford and Fraser Valley within <strong className="text-forest font-semibold">1–3 hours</strong>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/shop">
                <GlassButton
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5 text-gold" />}
                >
                  Shop Now
                </GlassButton>
              </Link>
              <a href="#categories">
                <GlassButton variant="glass" size="lg">
                  Browse Categories
                </GlassButton>
              </a>
            </div>

            {/* Utility Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-border/80 text-xs text-charcoal">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-forest/5 text-forest">
                  <ShieldCheck className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <span className="font-bold block text-forest">Free Delivery</span>
                  <span className="text-charcoal-muted">Over $50 CAD</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-forest/5 text-forest">
                  <Truck className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <span className="font-bold block text-forest">1–3 Hours</span>
                  <span className="text-charcoal-muted">Fast Fulfillment</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-forest/5 text-forest">
                  <CreditCard className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <span className="font-bold block text-forest">Interac & COD</span>
                  <span className="text-charcoal-muted">Flexible Payment</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-forest/5 text-forest">
                  <Clock className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <span className="font-bold block text-forest">Open Daily</span>
                  <span className="text-charcoal-muted">{BRAND.hours}</span>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Right Hero Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl glass-card overflow-hidden border border-border shadow-floating p-3 bg-white">
              <div className="aspect-[4/5] rounded-xl overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&w=1200&q=80"
                  alt="EliteBud Luxury Craft Cannabis"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-1000"
                />

                {/* Floating Glass Pill */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/85 backdrop-blur-md border border-white/60 shadow-xl space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-forest uppercase tracking-wider">Featured Reserve</span>
                    <span className="font-semibold text-gold-hover">31.5% THC</span>
                  </div>
                  <h4 className="text-base font-bold text-charcoal">Velvet Kush Reserve</h4>
                  <p className="text-xs text-charcoal-muted">Cured for 45 days in dark glass cellars</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
