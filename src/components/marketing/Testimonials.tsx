import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle2, User } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  product: string;
  comment: string;
}

const REVIEWS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Marcus V.',
    location: 'East Abbotsford',
    rating: 5,
    date: '2 Days Ago',
    product: 'Velvet Kush Reserve',
    comment: 'Ordered at 2:15 PM and the driver arrived at 2:50 PM! The flower is cold-cured to absolute perfection, sticky trichomes, and super pungent aroma. Interac E-Transfer was auto-deposited seamlessly.',
  },
  {
    id: 't-2',
    name: 'Elena R.',
    location: 'Mission District',
    rating: 5,
    date: '3 Days Ago',
    product: 'Gold Tier Live Rosin',
    comment: 'Hands down the cleanest solventless live rosin in the Fraser Valley. The frosted glass packaging is completely odorless and discreet. Drivers are super friendly and polite.',
  },
  {
    id: 't-3',
    name: 'David K.',
    location: 'Sardis, Chilliwack',
    rating: 5,
    date: '1 Week Ago',
    product: 'Artisanal Pomegranate Gummies',
    comment: 'The 15-minute fast-acting nano gummies are unmatched. Free delivery over $50 to Chilliwack made it super convenient. Will definitely be a regular customer!',
  },
  {
    id: 't-4',
    name: 'Sarah M.',
    location: 'Langley Township',
    rating: 5,
    date: '1 Week Ago',
    product: 'Diamond Infused Pre-Rolls',
    comment: 'Incredible burn quality on the diamond pre-rolls! Glass tips are a super classy touch. EliteBud customer service and phone dispatch answered all my tracking questions immediately.',
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-hover block">
            Verified Customer Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-forest tracking-tight">
            What Our Abbotsford Community Says
          </h2>
          <p className="text-charcoal-muted text-sm sm:text-base leading-relaxed font-light">
            Over 500+ verified 5-star reviews from local customers across Fraser Valley.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <GlassCard className="p-8 border border-border bg-white h-full flex flex-col justify-between space-y-6 shadow-xs">
                <div className="space-y-4">
                  
                  {/* Rating Stars & Quote Icon */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 text-gold fill-gold" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-gold/30" />
                  </div>

                  {/* Comment */}
                  <p className="text-charcoal text-sm leading-relaxed italic font-serif text-base">
                    "{review.comment}"
                  </p>
                </div>

                {/* Footer Info */}
                <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-forest/10 text-forest flex items-center justify-center font-bold">
                      <User className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <span className="font-bold text-forest block">{review.name}</span>
                      <span className="text-charcoal-muted block">{review.location}</span>
                    </div>
                  </div>

                  <div className="text-right space-y-0.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald bg-emerald/10 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified Buyer
                    </span>
                    <span className="text-[11px] text-charcoal-muted block">{review.product}</span>
                  </div>
                </div>

              </GlassCard>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
