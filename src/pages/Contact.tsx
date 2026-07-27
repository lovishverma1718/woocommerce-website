import React, { useState } from 'react';
import { Phone, Mail, Clock, MapPin, Send, CheckCircle2, ShieldCheck, Navigation } from 'lucide-react';
import { BRAND, DELIVERY_ZONES } from '../lib/constants';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { SEOHelper } from '../components/common/SEOHelper';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', phone: '', email: '', message: '' });
  };

  return (
    <>
      <SEOHelper
        title="Contact Abbotsford Dispatch — EliteBud"
        description="Contact EliteBud Abbotsford delivery dispatch line at +1 (236) 883-6014 or safepayabby@gmail.com for direct order status and delivery updates."
        type="local"
      />

      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-3 pb-6 border-b border-border text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-hover block">
            Local Dispatch Support
          </span>
          <h1 className="text-4xl font-bold text-forest tracking-tight">Contact EliteBud Dispatch</h1>
          <p className="text-sm text-charcoal-muted leading-relaxed">
            Have a question about delivery timing, custom orders, or Interac E-Transfers? Connect directly with our Abbotsford team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Methods */}
          <div className="lg:col-span-5 space-y-6">
            
            <GlassCard className="p-6 space-y-4 bg-white border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest/5 flex items-center justify-center text-forest">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-charcoal-muted uppercase block">Phone Dispatch Line</span>
                  <a href={`tel:${BRAND.phoneRaw}`} className="text-lg font-bold text-forest hover:underline">
                    {BRAND.phoneFormatted}
                  </a>
                </div>
              </div>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Call or text for immediate order status updates and phone orders (Average response: &lt; 15 mins).
              </p>
            </GlassCard>

            <GlassCard className="p-6 space-y-4 bg-white border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest/5 flex items-center justify-center text-forest">
                  <Mail className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-charcoal-muted uppercase block">Interac & Support Email</span>
                  <a href={`mailto:${BRAND.email}`} className="text-base font-bold text-forest hover:underline break-all">
                    {BRAND.email}
                  </a>
                </div>
              </div>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Send Interac E-Transfer payments and general inquiry messages.
              </p>
            </GlassCard>

            <GlassCard className="p-6 space-y-4 bg-white border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest/5 flex items-center justify-center text-forest">
                  <Clock className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-charcoal-muted uppercase block">Dispatch Operating Hours</span>
                  <span className="text-base font-bold text-charcoal">{BRAND.hours} Daily</span>
                </div>
              </div>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Drivers on road 7 days a week across Abbotsford and Fraser Valley.
              </p>
            </GlassCard>

            {/* Active Service Regions List */}
            <GlassCard className="p-6 space-y-3 bg-surface border border-border">
              <h3 className="text-sm font-bold text-forest uppercase tracking-wider">Active Service Regions</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-charcoal font-medium">
                {DELIVERY_ZONES.map(z => (
                  <div key={z.name} className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span>{z.city}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

          </div>

          {/* Right Column: Dispatch Form & Google Maps Hub Visual */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="rounded-2xl glass-card p-8 border border-border bg-white space-y-6">
              <h2 className="text-2xl font-bold text-forest">Send Dispatch a Message</h2>

              {submitted ? (
                <div className="p-8 text-center space-y-3 bg-emerald/10 border border-emerald/20 rounded-2xl text-emerald">
                  <CheckCircle2 className="w-10 h-10 mx-auto" />
                  <h3 className="text-lg font-bold">Message Received!</h3>
                  <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
                    Thank you for reaching out. Our dispatch team will respond via phone/email shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-charcoal block mb-1">Your Full Name *</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Marcus Vance"
                      className="w-full p-3 text-sm rounded-xl border border-border bg-surface text-charcoal focus:ring-2 focus:ring-forest/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">Phone Number *</label>
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="(236) 000-0000"
                        className="w-full p-3 text-sm rounded-xl border border-border bg-surface text-charcoal focus:ring-2 focus:ring-forest/20"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">Email Address *</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="marcus@example.com"
                        className="w-full p-3 text-sm rounded-xl border border-border bg-surface text-charcoal focus:ring-2 focus:ring-forest/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-charcoal block mb-1">Your Inquiry / Delivery Note *</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="How can we assist your delivery today?"
                      className="w-full p-3 text-sm rounded-xl border border-border bg-surface text-charcoal focus:ring-2 focus:ring-forest/20"
                    />
                  </div>

                  <GlassButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full font-bold"
                    icon={<Send className="w-4 h-4 text-gold" />}
                  >
                    Send Message to Dispatch
                  </GlassButton>
                </form>
              )}
            </div>

            {/* Interactive Google Map Dispatch Hub Visualization */}
            <div className="rounded-2xl glass-card overflow-hidden border border-border p-6 bg-surface space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-forest font-bold text-sm">
                  <Navigation className="w-4 h-4 text-gold" />
                  <span>Abbotsford Central Dispatch Hub</span>
                </div>
                <span className="text-xs text-emerald font-semibold">Active Dispatch Zone</span>
              </div>
              
              <div className="aspect-[16/7] w-full rounded-xl bg-forest/10 border border-forest/20 flex flex-col items-center justify-center p-6 text-center space-y-2 relative overflow-hidden">
                <MapPin className="w-8 h-8 text-gold animate-bounce" />
                <span className="text-sm font-bold text-forest">Abbotsford, BC (V2S / V2T / V3G / V4X)</span>
                <span className="text-xs text-charcoal-muted max-w-md">
                  Drivers stationed across Sumas Way, South Fraser Way & Fraser Highway for 1–3 hour direct dispatch.
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};
