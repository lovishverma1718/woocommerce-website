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
import { RouteSEO, SEOHelper } from '../components/common/SEOHelper';
import { NOT_FOUND_META } from '../seo/config';

/** Wraps a static page with its title, description, canonical and schema from src/seo/config.ts. */
const withSEO = (path: string, page: React.ReactNode) => (
  <>
    <RouteSEO path={path} />
    {page}
  </>
);

export const AppRouter: React.FC = () => {
  return (
    <LayoutContainer>
      <Routes>
        <Route path="/" element={withSEO('/', <Home />)} />
        <Route path="/shop" element={withSEO('/shop', <Shop />)} />
        {/* Product pages set their own SEO once the product has loaded. */}
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/cart" element={withSEO('/cart', <Cart />)} />
        <Route path="/checkout" element={withSEO('/checkout', <Checkout />)} />
        <Route path="/about" element={withSEO('/about', <About />)} />
        <Route path="/faq" element={withSEO('/faq', <FAQ />)} />
        <Route path="/contact" element={withSEO('/contact', <Contact />)} />
        <Route path="/privacy-policy" element={withSEO('/privacy-policy', <PrivacyPolicy />)} />
        <Route path="/terms" element={withSEO('/terms', <Terms />)} />
        <Route
          path="*"
          element={
            <>
              <SEOHelper title={NOT_FOUND_META.title} description={NOT_FOUND_META.description} noindex />
              <NotFound />
            </>
          }
        />
      </Routes>
    </LayoutContainer>
  );
};
