import React from 'react';
import { Hero } from '../components/marketing/Hero';
import { DeliveryHighlights } from '../components/marketing/DeliveryHighlights';
import { CategoryCard } from '../components/ecommerce/CategoryCard';
import { ProductCard } from '../components/ecommerce/ProductCard';
import { GoogleReviewPromo } from '../components/marketing/GoogleReviewPromo';
import { DeliveryAreasGrid } from '../components/marketing/DeliveryAreasGrid';
import { FAQPreview } from '../components/marketing/FAQPreview';
import { useCategories, useProducts } from '../hooks/useProducts';
import { GlassButton } from '../components/common/GlassButton';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Phone, ShieldCheck } from 'lucide-react';
import { BRAND } from '../lib/constants';
import { GlassCard } from '../components/common/GlassCard';

export const Home: React.FC = () => {
  const { data: categories = [] } = useCategories();
  const { data: products = [], isLoading: isProductsLoading } = useProducts({ featuredOnly: true } as any);

  return (
    <div className="space-y-12">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Delivery Highlights */}
      <DeliveryHighlights />

      {/* 3. Featured Categories */}
      <section id="categories" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-hover block">
              Curated Menu
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-forest tracking-tight">
              Featured Craft Categories
            </h2>
          </div>
          <Link to="/shop">
            <GlassButton variant="outline" size="sm" icon={<ArrowRight className="w-4 h-4 text-forest" />}>
              View Full Menu
            </GlassButton>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* 4. Featured Products Showcase */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-gold-hover block">
                Hand-Picked Batches
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-forest tracking-tight">
                Trending Reserve Selections
              </h2>
            </div>
            <Link to="/shop">
              <GlassButton variant="primary" size="sm">
                Shop All Selections
              </GlassButton>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.slice(0, 6).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Choose EliteBud Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl glass-card p-8 sm:p-14 border border-border bg-white space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-hover block">
              Luxury Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-forest tracking-tight">
              Why Choose EliteBud Delivery?
            </h2>
            <p className="text-charcoal-muted text-sm sm:text-base leading-relaxed">
              Elevating Abbotsford cannabis delivery into a world-class luxury ecommerce experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-forest/5 flex items-center justify-center text-forest mx-auto sm:mx-0">
                <Sparkles className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-lg font-bold text-charcoal">Cold-Cured Craft Flower</h3>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed font-light">
                Cured under lab-monitored humidity and temperature to preserve maximum terpene profiles.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-forest/5 flex items-center justify-center text-forest mx-auto sm:mx-0">
                <ShieldCheck className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-lg font-bold text-charcoal">Discreet Doorstep Fulfillment</h3>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed font-light">
                Delivered in odorless frosted matte black glass packaging by courteous professional drivers.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-forest/5 flex items-center justify-center text-forest mx-auto sm:mx-0">
                <Phone className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-lg font-bold text-charcoal">Direct Dispatch Line</h3>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed font-light">
                Call our Abbotsford dispatch anytime at {BRAND.phoneFormatted} for real-time tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Google Review Promotion Banner */}
      <GoogleReviewPromo />

      {/* 7. Delivery Areas */}
      <DeliveryAreasGrid />

      {/* 8. FAQ Preview */}
      <FAQPreview />

      {/* 9. Contact Banner CTA */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-forest text-white p-8 sm:p-12 text-center space-y-6 shadow-floating relative overflow-hidden">
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Ready for Same-Day Delivery in Abbotsford?
            </h2>
            <p className="text-white/80 text-sm sm:text-base font-light">
              Place your order online in seconds or speak directly with our fulfillment dispatchers.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/shop">
              <GlassButton variant="gold" size="lg" className="font-bold">
                Order Online Now
              </GlassButton>
            </Link>
            <a href={`tel:${BRAND.phoneRaw}`}>
              <GlassButton variant="glass" size="lg" className="text-white border-white/30 hover:bg-white/10" icon={<Phone className="w-5 h-5 text-gold" />}>
                Call Dispatch: {BRAND.phoneFormatted}
              </GlassButton>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
