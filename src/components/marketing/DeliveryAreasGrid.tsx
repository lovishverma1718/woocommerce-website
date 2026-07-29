import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
              <GlassCard className="space-y-4 border border-border bg-surface/50 h-full flex flex-col justify-between p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-forest font-bold text-lg">
                      <MapPin className="w-5 h-5 text-gold shrink-0" />
                      <span>{zone.city}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] bg-emerald/10 text-emerald px-2.5 py-1 rounded-full font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      Active Zone
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-charcoal">{zone.name}</h4>

                  <div className="space-y-2 text-xs text-charcoal-muted pt-2 border-t border-border/60">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gold" />
                        Estimated Time:
                      </span>
                      <span className="font-bold text-forest">{zone.estimatedTime}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                        Free Delivery Threshold:
                      </span>
                      <span className="font-bold text-charcoal">${zone.freeDeliveryThreshold} CAD</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border text-[11px] text-charcoal-muted font-mono">
                  Postal Prefix: {zone.postalCodes.join(', ')}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
