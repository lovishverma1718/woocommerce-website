import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LayoutContainer } from '../components/layout/LayoutContainer';
import { Home } from '../pages/Home';
import { Shop } from '../pages/Shop';
import { ProductDetails } from '../pages/ProductDetails';
import { Cart } from '../pages/Cart';
import { Checkout } from '../pages/Checkout';
import { About } from '../pages/About';
import { FAQ } from '../pages/FAQ';
import { Contact } from '../pages/Contact';
import { PrivacyPolicy, Terms } from '../pages/PrivacyPolicy';
import { NotFound } from '../pages/NotFound';

export const AppRouter: React.FC = () => {
  return (
    <LayoutContainer>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </LayoutContainer>
  );
};
