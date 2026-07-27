import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { BRAND } from '../lib/constants';
import { Sparkles, ShieldCheck, Truck, Award, HeartHandshake, CheckCircle2, Clock, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassButton } from '../components/common/GlassButton';
import { SEOHelper } from '../components/common/SEOHelper';

export const About: React.FC = () => {
  const timeline = [
    { year: '2023', title: 'Abbotsford Foundation', description: 'Established as Abbotsford’s first dedicated direct-to-door luxury craft cannabis delivery dispatch.' },
    { year: '2024', title: 'Fraser Valley Expansion', description: 'Expanded direct fulfillment coverage to Mission, Chilliwack, Aldergrove, and Langley Township.' },
    { year: '2025', title: 'Solventless Rosin Vault', description: 'Partnered with BC micro-cultivators to offer exclusive small-batch ice water hash rosin cellars.' },
    { year: '2026', title: 'Headless API Pipeline', description: 'Launched a world-class headless commerce architecture delivering 1–3 hour direct dispatch.' },
  ];

  const statistics = [
    { label: 'Verified 5-Star Reviews', value: '500+' },
    { label: 'Average Delivery Time', value: '45–90m' },
    { label: 'Craft BC Farm Partners', value: '18+' },
    { label: 'On-Time Dispatch Rate', value: '99.4%' },
  ];

  return (
    <>
      <SEOHelper
        title="About EliteBud — Luxury Craft Cannabis Delivery"
        description="Learn about EliteBud's Abbotsford craft cannabis heritage, 1-3 hour same-day dispatch commitment, and micro-climate curing standards."
      />

      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Editorial Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-hover block">
            Our Heritage & Craft Commitment
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold text-forest tracking-tight leading-tight">
            Redefining Same-Day <br />
            <span className="font-serif italic text-gold-hover font-normal">Luxury Cannabis Delivery</span>
          </h1>
          <p className="text-lg text-charcoal-muted font-light leading-relaxed">
            EliteBud was founded in Abbotsford, British Columbia with a single mission: to replace traditional brick-and-mortar dispensary headaches with a world-class, 1–3 hour luxury delivery service.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-2xl glass-card border border-border bg-forest text-white shadow-floating">
          {statistics.map(s => (
            <div key={s.label} className="text-center space-y-1">
              <span className="text-3xl sm:text-4xl font-bold text-gold block">{s.value}</span>
              <span className="text-xs text-white/80 font-medium">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 text-charcoal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/5 text-forest text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4 text-gold" />
              <span>Small-Batch Craft Curing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-forest tracking-tight">
              Curated Coastal BC Harvests
            </h2>
            <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed font-light">
              We believe cannabis should be treated with the same reverence as fine wine or artisan espresso. Every strain on our menu is hand-selected from micro-cultivators across coastal BC, cured in temperature-regulated dark cellars, and packaged in frosted matte glass.
            </p>
            <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed font-light">
              Whether you are ordering cold-cured solventless live rosin, fast-acting chef-crafted gummies, or 30%+ THC reserve flower, EliteBud guarantees freshness, potency, and speed.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link to="/shop">
                <GlassButton variant="primary" size="md">
                  Explore Reserve Menu
                </GlassButton>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <GlassCard className="p-3 bg-white border border-border shadow-floating">
              <img
                src="https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=1000&q=80"
                alt="Craft Rosin Curing"
                className="rounded-xl w-full h-96 object-cover"
              />
            </GlassCard>
          </div>
        </div>

        {/* Company Timeline */}
        <div className="space-y-10 pt-8 border-t border-border">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-hover block">
              Evolution of Excellence
            </span>
            <h2 className="text-3xl font-bold text-forest">EliteBud Timeline</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {timeline.map(t => (
              <GlassCard key={t.year} className="p-6 space-y-3 bg-surface border border-border">
                <span className="text-2xl font-bold text-gold block">{t.year}</span>
                <h4 className="text-base font-bold text-forest">{t.title}</h4>
                <p className="text-xs text-charcoal-muted leading-relaxed font-light">{t.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="p-6 space-y-3 bg-white border border-border">
            <Sparkles className="w-8 h-8 text-gold" />
            <h3 className="text-lg font-bold text-forest">Craft Integrity</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Zero low-grade trim or machine-tumbled flower. Only 100% whole craft buds.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3 bg-white border border-border">
            <Truck className="w-8 h-8 text-gold" />
            <h3 className="text-lg font-bold text-forest">1–3 Hour Dispatch</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Our drivers operate across Abbotsford, Mission, Chilliwack & Langley daily.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3 bg-white border border-border">
            <ShieldCheck className="w-8 h-8 text-gold" />
            <h3 className="text-lg font-bold text-forest">19+ Legal Compliance</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Full compliance with BC provincial cannabis distribution regulations.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3 bg-white border border-border">
            <HeartHandshake className="w-8 h-8 text-gold" />
            <h3 className="text-lg font-bold text-forest">Local Trust</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Over 500+ verified 5-star customer reviews across Abbotsford.
            </p>
          </GlassCard>
        </div>

      </div>
    </>
  );
};
