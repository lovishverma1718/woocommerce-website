import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle2 } from 'lucide-react';
import { DELIVERY_ZONES } from '../../lib/constants';
import { GlassCard } from '../common/GlassCard';

export const DeliveryAreasGrid: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-hover block">
            Fraser Valley Coverage
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-forest tracking-tight">
            Same-Day Local Delivery Regions
          </h2>
          <p className="text-charcoal-muted text-sm sm:text-base leading-relaxed">
            We dispatch dedicated local delivery drivers 7 days a week from 10:00 AM to 11:00 PM.
          </p>
        </div>

        {/* Zone Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {DELIVERY_ZONES.map((zone, i) => (
            <motion.div
              key={zone.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <GlassCard className="p-6 border border-border bg-surface/50 h-full flex items-center justify-between">
                <div className="flex items-center gap-3 text-forest font-bold text-lg">
                  <MapPin className="w-5 h-5 text-gold shrink-0" />
                  <div>
                    <span className="block text-base">{zone.city}</span>
                    <span className="text-xs font-normal text-charcoal-muted block">{zone.name}</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] bg-emerald/10 text-emerald px-3 py-1 rounded-full font-semibold shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active Zone
                </span>
              </GlassCard>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
