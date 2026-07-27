import React from 'react';
import { motion } from 'framer-motion';
import { Star, Gift, ExternalLink, Sparkles } from 'lucide-react';
import { GlassButton } from '../common/GlassButton';
import { BRAND } from '../../lib/constants';

export const GoogleReviewPromo: React.FC = () => {
  return (
    <section className="py-16 my-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl glass-banner p-8 sm:p-12 overflow-hidden shadow-floating border border-gold/40 text-white"
      >
        {/* Background Decorative Element */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-gold/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-gold">
              <Gift className="w-4 h-4 text-gold" />
              <span>Complimentary Reward Offer</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              Love EliteBud? <br className="hidden sm:block" />
              Leave a 5-Star Google Review.
            </h2>

            <p className="text-base text-white/90 max-w-2xl font-light leading-relaxed">
              We take pride in delivering the highest quality craft cannabis in Abbotsford. Share your experience on Google and receive a complimentary <strong className="text-gold font-bold">FREE 7g Craft Weed</strong> on your next delivery!
            </p>

            <div className="flex items-center gap-2 pt-1 text-gold">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-gold" />
              ))}
              <span className="text-sm font-bold text-white ml-2">Over 500+ Verified 5-Star Reviews</span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center space-y-4">
            <a
              href={BRAND.googleReviewOffer.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <GlassButton
                variant="gold"
                size="lg"
                className="w-full font-bold shadow-xl"
                icon={<ExternalLink className="w-5 h-5 text-forest" />}
              >
                Leave a Google Review
              </GlassButton>
            </a>

            <span className="text-xs text-white/70 text-center lg:text-right">
              Show driver review confirmation or enter Google name in checkout order notes.
            </span>
          </div>

        </div>
      </motion.div>
    </section>
  );
};
