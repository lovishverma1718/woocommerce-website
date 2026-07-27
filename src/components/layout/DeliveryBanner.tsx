import React from 'react';
import { Truck, ShieldCheck, Clock, Phone } from 'lucide-react';
import { BRAND } from '../../lib/constants';
import { isStoreOpen } from '../../lib/utils';

export const DeliveryBanner: React.FC = () => {
  const storeStatus = isStoreOpen();

  return (
    <div className="glass-banner text-white text-xs sm:text-sm py-2.5 px-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Highlight metrics */}
        <div className="flex items-center gap-4 sm:gap-6 mx-auto md:mx-0 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1.5 shrink-0">
            <Truck className="w-4 h-4 text-gold" />
            <span className="font-medium">Same-Day Delivery in 1–3 Hours</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <ShieldCheck className="w-4 h-4 text-gold" />
            <span>FREE Shipping Over $50</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Clock className="w-4 h-4 text-gold" />
            <span className="font-semibold text-gold-light">{storeStatus.text}</span>
          </div>
        </div>

        {/* Right: Phone CTA */}
        <div className="hidden md:flex items-center gap-4 font-medium">
          <a
            href={`tel:${BRAND.phoneRaw}`}
            className="inline-flex items-center gap-1.5 hover:text-gold transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-gold" />
            <span>Dispatch: {BRAND.phoneFormatted}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
