import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useAgeGateStore } from '../../store/useAgeGateStore';
import { GlassButton } from '../common/GlassButton';

export const AgeGateModal: React.FC = () => {
  const { isAgeVerified, verifyAge } = useAgeGateStore();

  if (isAgeVerified) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-lg w-full rounded-2xl glass-modal p-8 sm:p-10 border border-border shadow-floating text-center space-y-6 bg-white/95"
        >
          {/* Brand Logo (2.5x Larger) */}
          <div className="flex justify-center">
            <img
              src="/logo.png"
              alt="EliteBud - Best Bud In Town"
              className="h-32 sm:h-36 w-auto object-contain"
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-hover block">
              Age Verification Required
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-forest tracking-tight">
              Welcome to EliteBud
            </h2>
            <p className="text-charcoal-muted text-sm leading-relaxed font-light">
              In accordance with British Columbia provincial regulations, you must be 19 years of age or older to enter.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <GlassButton
              variant="primary"
              size="lg"
              className="w-full font-bold"
              icon={<ShieldCheck className="w-5 h-5 text-gold" />}
              onClick={verifyAge}
            >
              I am 19 Years or Older
            </GlassButton>

            <button
              onClick={() => {
                window.location.href = 'https://www.google.com';
              }}
              className="text-xs text-charcoal-muted hover:text-accent-danger transition-colors py-2 block w-full cursor-pointer"
            >
              I am Under 19 Years Old (Exit)
            </button>
          </div>

          <div className="pt-4 border-t border-border/60 text-[11px] text-charcoal-muted">
            <p>Government issued photo ID verified upon delivery. Abbotsford, BC.</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
