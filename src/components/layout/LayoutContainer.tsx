import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { DeliveryBanner } from './DeliveryBanner';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from '../ecommerce/CartDrawer';
import { QuickViewModal } from '../ecommerce/QuickViewModal';
import { SearchPopover } from '../ecommerce/SearchPopover';
import { ToastContainer } from '../common/Toast';
import { AgeGateModal } from './AgeGateModal';

export const LayoutContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const lastPathname = useRef(pathname);

  // Scroll to top on route changes only. Not on the first mount: the visitor may already
  // have scrolled the prerendered page before the app loaded.
  useEffect(() => {
    if (pathname === lastPathname.current) return;
    lastPathname.current = pathname;
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-charcoal selection:bg-forest selection:text-white">
      <DeliveryBanner />
      <Navbar />
      
      <main className="flex-1">
        {children}
      </main>

      <Footer />

      {/* Global Drawers & Modals */}
      <CartDrawer />
      <QuickViewModal />
      <SearchPopover />
      <ToastContainer />
      <AgeGateModal />
    </div>
  );
};
