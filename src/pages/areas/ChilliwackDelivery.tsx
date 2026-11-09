import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Truck, CreditCard, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassButton } from '../../components/common/GlassButton';
import { BRAND, DELIVERY_ZONES } from '../../lib/constants';
import { CHILLIWACK_FAQS } from '../../seo/areaContent';

const zone = DELIVERY_ZONES.find(z => z.city === 'Chilliwack')!;

const NEIGHBOURHOODS = [
  'Downtown Chilliwack', 'Sardis', 'Vedder Crossing', 'Promontory', 'Garrison Crossing',
  'Fairfield Island', 'Greendale', 'Rosedale', 'Yarrow', 'Ryder Lake',
];

export const ChilliwackDelivery: React.FC = () => (
  <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
    <div className="text-center space-y-4 max-w-3xl mx-auto">
      <span className="text-xs font-bold uppercase tracking-widest text-gold-hover block">
        Chilliwack, Sardis &amp; Vedder
      </span>
      <h1 className="text-4xl sm:text-5xl font-bold text-forest tracking-tight leading-tight">
        Weed Delivery in Chilliwack, BC
      </h1>
      <p className="text-lg text-charcoal-muted font-light leading-relaxed">
        Order flower, pre rolls, edibles, THC vapes and concentrates online and get same day delivery
        anywhere in Chilliwack, including Sardis and Vedder Crossing. Most Chilliwack orders arrive
        in {zone.estimatedTime.replace(/\s+/g, ' ')}.
      </p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Link to="/shop"><GlassButton variant="primary">Shop the Menu</GlassButton></Link>
        <a href={`tel:${BRAND.phone}`}><GlassButton variant="secondary">Call {BRAND.phoneFormatted}</GlassButton></a>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { icon: Clock, title: 'Delivery time', text: zone.estimatedTime.replace(/\s+/g, ' ') },
        { icon: Truck, title: 'Minimum order', text: `$${zone.minOrder}, free delivery over $${zone.freeDeliveryThreshold}` },
        { icon: CreditCard, title: 'Payment', text: 'Interac e-Transfer or cash on delivery' },
        { icon: ShieldCheck, title: 'Age', text: '19+ with valid photo ID' },
      ].map(({ icon: Icon, title, text }) => (
        <GlassCard key={title} className="p-5 space-y-2">
          <Icon className="w-5 h-5 text-gold" />
          <h2 className="text-sm font-bold text-forest">{title}</h2>
          <p className="text-sm text-charcoal-muted">{text}</p>
        </GlassCard>
      ))}
    </div>

    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-forest">Chilliwack areas we deliver to</h2>
      <p className="text-charcoal-muted leading-relaxed">
        We deliver across the City of Chilliwack and the Sardis and Vedder area, from downtown to the
        Promontory hillside. Postal codes starting with {zone.postalCodes.join(' and ')} are covered.
      </p>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {NEIGHBOURHOODS.map(n => (
          <li key={n} className="flex items-center gap-2 text-sm text-charcoal">
            <MapPin className="w-4 h-4 text-gold shrink-0" /> {n}
          </li>
        ))}
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-forest">How to order weed online in Chilliwack</h2>
      <ol className="list-decimal pl-5 space-y-2 text-charcoal-muted">
        <li>Browse the <Link to="/shop" className="text-forest underline">online menu</Link> and add products to your cart.</li>
        <li>Enter your Chilliwack delivery address at checkout.</li>
        <li>Pay by Interac e-Transfer or choose cash on delivery.</li>
        <li>Your driver arrives the same day. Have your photo ID ready.</li>
      </ol>
    </section>

    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-forest">Chilliwack weed delivery FAQ</h2>
      <div className="space-y-3">
        {CHILLIWACK_FAQS.map(f => (
          <GlassCard key={f.question} className="p-5 space-y-1">
            <h3 className="font-semibold text-forest">{f.question}</h3>
            <p className="text-sm text-charcoal-muted leading-relaxed">{f.answer}</p>
          </GlassCard>
        ))}
      </div>
    </section>

    <p className="text-sm text-charcoal-muted text-center">
      Also delivering to <Link to="/" className="text-forest underline">Abbotsford</Link>, Mission, Aldergrove and Langley Township.
    </p>
  </div>
);
