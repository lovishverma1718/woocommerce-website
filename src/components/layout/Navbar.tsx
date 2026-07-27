import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Phone, Menu, X } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';
import { BRAND } from '../../lib/constants';
import { GlassButton } from '../common/GlassButton';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { getItemCount, openCart } = useCartStore();
  const { openSearch } = useUIStore();
  const itemCount = getItemCount();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop Catalog', path: '/shop' },
    { name: 'About Us', path: '/about' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact & Delivery', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-[37px] z-30 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28 sm:h-32">
          
          {/* Left: Official Brand Logo (2.5x Larger) */}
          <Link to="/" className="flex items-center group py-2">
            <img
              src="/logo.png"
              alt="EliteBud - Best Bud In Town"
              className="h-24 sm:h-28 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors relative py-1 ${
                  isActive(link.path)
                    ? 'text-forest font-semibold'
                    : 'text-charcoal-muted hover:text-forest'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-forest rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right: Actions (Search, Cart, Phone CTA) */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Live Search Trigger */}
            <button
              onClick={openSearch}
              className="p-2.5 rounded-full text-charcoal-muted hover:text-forest hover:bg-forest/5 transition-colors cursor-pointer"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full text-charcoal-muted hover:text-forest hover:bg-forest/5 transition-colors cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-forest font-bold text-[11px] rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Phone Button CTA */}
            <a href={`tel:${BRAND.phoneRaw}`} className="hidden sm:block">
              <GlassButton variant="primary" size="sm" icon={<Phone className="w-3.5 h-3.5 text-gold" />}>
                Call Now
              </GlassButton>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-charcoal-muted hover:text-forest focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-white/95 backdrop-blur-xl px-6 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium py-2 border-b border-border/50 ${
                  isActive(link.path) ? 'text-forest font-bold' : 'text-charcoal-muted'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <a href={`tel:${BRAND.phoneRaw}`} className="w-full">
              <GlassButton variant="primary" size="md" className="w-full" icon={<Phone className="w-4 h-4 text-gold" />}>
                Call Dispatch: {BRAND.phoneFormatted}
              </GlassButton>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
