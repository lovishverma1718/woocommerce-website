import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Clock, MapPin, ShieldCheck } from 'lucide-react';
import { BRAND, DELIVERY_ZONES } from '../../lib/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-border pt-16 pb-12 mt-24 text-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-border">
          
          {/* Column 1: Official Logo (Extra Large 2.5x Scale) & Description */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="inline-block">
              <img
                src="/logo.png"
                alt="EliteBud - Best Bud In Town"
                className="h-56 sm:h-64 lg:h-72 w-auto max-w-full object-contain"
              />
            </Link>

            <p className="text-charcoal-muted text-sm leading-relaxed max-w-sm font-light">
              Abbotsford’s premier luxury same-day cannabis delivery service. Dedicated to delivering cold-cured small-batch craft flower, live resin, and artisanal edibles within 1–3 hours.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-forest font-semibold">
              <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
              <span>19+ BC Cannabis Compliance Verified</span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-forest">Navigation</h4>
            <ul className="space-y-2.5 text-sm text-charcoal-muted font-light">
              <li><Link to="/" className="hover:text-forest transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-forest transition-colors">Shop Catalog</Link></li>
              <li><Link to="/about" className="hover:text-forest transition-colors">About EliteBud</Link></li>
              <li><Link to="/faq" className="hover:text-forest transition-colors">FAQ & Delivery Info</Link></li>
              <li><Link to="/contact" className="hover:text-forest transition-colors">Contact Dispatch</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-forest transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-forest transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Column 3: Service Areas */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-forest">Delivery Coverage</h4>
            <ul className="space-y-2.5 text-sm text-charcoal-muted font-light">
              {DELIVERY_ZONES.map((zone) => (
                <li key={zone.name} className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>{zone.city}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Dispatch */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-forest">Dispatch Contact</h4>
            <ul className="space-y-3 text-sm text-charcoal-muted">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-medium text-charcoal-muted">Phone Dispatch</span>
                  <a href={`tel:${BRAND.phoneRaw}`} className="font-semibold text-forest hover:underline">
                    {BRAND.phoneFormatted}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-medium text-charcoal-muted">Interac & Support</span>
                  <a href={`mailto:${BRAND.email}`} className="font-medium text-charcoal hover:underline break-all">
                    {BRAND.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-medium text-charcoal-muted">Fulfillment Hours</span>
                  <span className="font-semibold text-charcoal">{BRAND.hours} Daily</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & payment methods */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-muted">
          <p>© {new Date().getFullYear()} EliteBud Delivery. All Rights Reserved. Abbotsford, BC, Canada.</p>
          <div className="flex items-center gap-4 font-medium">
            <span className="bg-white px-3 py-1.5 rounded-lg border border-border">Interac E-Transfer</span>
            <span className="bg-white px-3 py-1.5 rounded-lg border border-border">Cash On Delivery</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
