import React, { useEffect } from 'react';
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

  useEffect(() => {
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
