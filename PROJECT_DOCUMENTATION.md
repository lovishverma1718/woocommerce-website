# EliteBud - Master Project & Code-Level Architectural Documentation

> **Brand Name**: EliteBud  
> **Tagline**: Best Bud In Town  
> **Location**: Abbotsford, British Columbia, Canada  
> **Coverage Regions**: Abbotsford Central & East, Abbotsford Airport (YXX), Mission, Chilliwack, Aldergrove, Langley Township  
> **Fulfillment Model**: Same-Day Direct Delivery (1–3 Hours) | 10:00 AM – 11:00 PM Daily  
> **Dispatch Phone**: `+1 (236) 883-6014`  
> **Dispatch / E-Transfer Email**: `safepayabby@gmail.com`  
> **Accepted Payments**: Interac E-Transfer & Cash On Delivery  
> **Free Delivery Minimum**: $50 CAD ($10 CAD standard fee below $50)  
> **Legal Compliance**: 19+ British Columbia Provincial Cannabis Regulations  
> **Tech Stack**: React 18, Vite 5, TypeScript 5, Tailwind CSS 3, Framer Motion 11, TanStack Query v5, Zustand 5, Lucide React, Axios  

---

## Table of Contents

1. [Architectural Overview & Headless Commerce Strategy](#1-architectural-overview--headless-commerce-strategy)
2. [Complete Project Directory Structure & File Map](#2-complete-project-directory-structure--file-map)
3. [Design System, Typography & Liquid Glass Specifications](#3-design-system-typography--liquid-glass-specifications)
4. [Exhaustive Page-by-Page Content & Section Breakdown](#4-exhaustive-page-by-page-content--section-breakdown)
   - [Page 1: Home Page (`/`)](#page-1-home-page-)
   - [Page 2: Shop Catalog Page (`/shop`)](#page-2-shop-catalog-page-shop)
   - [Page 3: Product Details Page (`/product/:slug`)](#page-3-product-details-page-productslug)
   - [Page 4: Shopping Cart Page (`/cart`)](#page-4-shopping-cart-page-cart)
   - [Page 5: Express Guest Checkout Page (`/checkout`)](#page-5-express-guest-checkout-page-checkout)
   - [Page 6: About Us Page (`/about`)](#page-6-about-us-page-about)
   - [Page 7: FAQ Page (`/faq`)](#page-7-faq-page-faq)
   - [Page 8: Contact Dispatch Page (`/contact`)](#page-8-contact-dispatch-page-contact)
   - [Page 9: Privacy Policy Page (`/privacy-policy`)](#page-9-privacy-policy-page-privacy-policy)
   - [Page 10: Terms of Service Page (`/terms`)](#page-10-terms-of-service-page-terms)
   - [Page 11: 404 Not Found Page (`*`)](#page-11-404-not-found-page-)
5. [Global Overlay Systems & Modal Pipelines](#5-global-overlay-systems--modal-pipelines)
6. [Master Interactive Button & Click Handler Technical Matrix](#6-master-interactive-button--click-handler-technical-matrix)
7. [Step-by-Step Interactive Execution Flow Traces](#7-step-by-step-interactive-execution-flow-traces)
8. [Data Models, API Schemas & Service Layer Contracts](#8-data-models-api-schemas--service-layer-contracts)
9. [Local Development, Build & Deployment Guide](#9-local-development-build--deployment-guide)

---

## 1. Architectural Overview & Headless Commerce Strategy

EliteBud is engineered as a **decoupled, headless frontend application**. Unlike traditional WordPress themes or WooCommerce PHP templates, WooCommerce functions strictly as a headless commerce backend API provider, while the frontend handles 100% of the UI, state management, animations, search, and routing.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ELITEBUD FRONTEND APP                              │
│                      (React 18 + Vite + TypeScript)                         │
│                                                                             │
│  ┌───────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐ │
│  │   Pages & Routes      │  │  Liquid Glass System │  │  Framer Motion   │ │
│  │  (React Router v6)    │  │  (Tailwind Utility)  │  │   (Animations)   │ │
│  └───────────┬───────────┘  └──────────┬───────────┘  └────────┬─────────┘ │
│              │                         │                       │           │
│              └─────────────────────────┼───────────────────────┘           │
│                                        │                                   │
│                                        ▼                                   │
│                      ┌────────────────────────────────────┐                │
│                      │    Zustand Stores & TanStack Query  │                │
│                      │ (useCartStore, useFilterStore, etc)│                │
│                      └─────────────────┬──────────────────┘                │
└────────────────────────────────────────┼───────────────────────────────────┘
                                         │
                                         ▼
                     ┌──────────────────────────────────────┐
                     │    CommerceService Abstraction Layer │
                     │   (src/services/commerceService.ts)  │
                     └───────────────────┬──────────────────┘
                                         │
                    ┌────────────────────┴────────────────────┐
                    │                                         │
         If Live Credentials Set                    If No Credentials Set
                    ▼                                         ▼
      ┌───────────────────────────┐             ┌───────────────────────────┐
      │  WooCommerce REST API v3  │             │   High-Res Curated Mock   │
      │   (https://.../wc/v3/)    │             │   Dataset (Local Fallback)│
      └───────────────────────────┘             └───────────────────────────┘
```

### Key Architectural Benefits
- **Zero WooCommerce PHP Dependency**: No slow WordPress template rendering.
- **Lightning Instant UI**: Instant state updates, instant filter reactions, zero full-page reloads.
- **Fail-Safe Resilience**: If WooCommerce REST API endpoints are offline or unconfigured, the app seamlessly runs on a curated high-resolution mock dataset without breaking.

---

## 2. Complete Project Directory Structure & File Map

```
c:\Users\MSI\Desktop\woocommerece website/
├── package.json                        # Node dependencies & build scripts
├── tsconfig.json                       # TypeScript configuration & path aliases (@/*)
├── tailwind.config.js                  # Tailwind theme, custom color tokens, font families
├── postcss.config.js                   # PostCSS plugins (Tailwind CSS + Autoprefixer)
├── vite.config.ts                      # Vite compiler plugin configuration
├── index.html                          # HTML5 shell, Google Fonts (Inter + Instrument Serif), meta tags
├── public/
│   └── favicon.svg                     # Luxury brand SVG favicon emblem
├── src/
│   ├── main.tsx                        # Entry point mounting React DOM root
│   ├── App.tsx                         # Providers wrapper (QueryClientProvider + BrowserRouter)
│   ├── vite-env.d.ts                   # TypeScript environment definitions (import.meta.env)
│   ├── api/
│   │   ├── client.ts                   # Axios HTTP client configured for WooCommerce REST API
│   │   └── mockData.ts                 # Realistic high-res products, categories, reviews & FAQs
│   ├── types/
│   │   └── index.ts                    # Domain models & TypeScript API interfaces
│   ├── lib/
│   │   ├── constants.ts                # Brand parameters, phone, email, delivery zones
│   │   └── utils.ts                    # Class merger (clsx+twMerge), currency & time formatters
│   ├── services/
│   │   └── commerceService.ts          # API service layer mapping REST JSON <-> UI Models
│   ├── store/
│   │   ├── useCartStore.ts             # Cart state with localStorage persistence
│   │   ├── useFilterStore.ts           # Catalog search, filter, and sorting state
│   │   ├── useUIStore.ts               # QuickView, Search, and Toast notifications state
│   │   └── useAgeGateStore.ts          # 19+ BC legal age gate persistence
│   ├── hooks/
│   │   ├── useProducts.ts              # TanStack Query hooks for products & categories
│   │   └── useCheckout.ts              # Checkout mutation & postal code zone validator
│   ├── styles/
│   │   └── index.css                   # Custom Liquid Glass utility classes & custom scrollbars
│   ├── routes/
│   │   └── AppRouter.tsx               # App router mapping URL paths to page components
│   ├── components/
│   │   ├── common/
│   │   │   ├── GlassButton.tsx         # Framer Motion animated action button
│   │   │   ├── GlassBadge.tsx          # Status, strain, and gold highlights badge
│   │   │   ├── GlassCard.tsx           # Liquid glass container with 24px corner radius
│   │   │   ├── Modal.tsx               # Animated popup dialog with backdrop blur
│   │   │   ├── Toast.tsx               # Floating notification alert container
│   │   │   ├── Accordion.tsx           # Expandable FAQ accordion
│   │   │   ├── Rating.tsx              # Luxury gold star rating display
│   │   │   └── LoadingSkeleton.tsx     # Skeleton loaders for async data
│   │   ├── layout/
│   │   │   ├── DeliveryBanner.tsx      # Top announcement banner with live store status
│   │   │   ├── Navbar.tsx              # Translucent sticky floating header navigation
│   │   │   ├── Footer.tsx              # Multi-column footer with contact & delivery info
│   │   │   ├── AgeGateModal.tsx        # 19+ legal age verification overlay
│   │   │   └── LayoutContainer.tsx     # Root layout wrapping header, footer & global overlays
│   │   ├── ecommerce/
│   │   │   ├── ProductCard.tsx         # Interactive product card with weight selector & buy actions
│   │   │   ├── ProductGrid.tsx         # Grid wrapper with skeleton fallbacks
│   │   │   ├── CategoryCard.tsx        # Category card with hover zoom & product count
│   │   │   ├── CartDrawer.tsx          # Slide-over shopping cart drawer
│   │   │   ├── QuickViewModal.tsx      # Fast product inspection popup modal
│   │   │   ├── FilterBar.tsx           # Sticky catalog sidebar with price slider & filters
│   │   │   └── SearchPopover.tsx       # Live search popover modal
│   │   └── marketing/
│   │       ├── Hero.tsx                # High-impact luxury hero section
│   │       ├── DeliveryHighlights.tsx  # 6 feature cards highlighting delivery promise
│   │       ├── GoogleReviewPromo.tsx   # FREE 7g Weed Google review reward banner
│   │       ├── DeliveryAreasGrid.tsx   # Interactive Fraser Valley service area cards
│   │       └── FAQPreview.tsx          # Homepage accordion preview section
│   └── pages/
│       ├── Home.tsx                    # Main landing page
│       ├── Shop.tsx                    # Full catalog catalog page
│       ├── ProductDetails.tsx          # Detailed product view (PDP)
│       ├── Cart.tsx                    # Standalone cart page
│       ├── Checkout.tsx                # Express guest checkout page
│       ├── About.tsx                   # Brand story & craft quality page
│       ├── FAQ.tsx                     # Searchable FAQ page
│       ├── Contact.tsx                 # Direct dispatch contact page
│       ├── PrivacyPolicy.tsx           # Privacy policy legal document
│       ├── Terms.tsx                   # Terms of service legal document
│       └── NotFound.tsx                # 404 error page
```

---

## 3. Design System, Typography & Liquid Glass Specifications

### Color Palette Tokens
| Token | Hex Code | Purpose |
|-------|----------|---------|
| `forest` | `#1D4D3A` | Primary brand color, headers, primary CTA buttons |
| `forest-hover` | `#153C2D` | Hover state for primary buttons |
| `emerald` | `#2D7A57` | Secondary accent, success indicators, strain badges |
| `gold` | `#C8A65A` | Luxury gold highlights, star ratings, promo badges |
| `gold-hover` | `#B59347` | Hover color for gold elements |
| `surface` | `#F8F8F7` | Warm secondary background surface |
| `surface-secondary` | `#F3F4F5` | Alternate section background surface |
| `charcoal` | `#202124` | Primary body text |
| `charcoal-muted` | `#666666` | Secondary body text & subheadings |
| `border` | `#E9ECEF` | Subtle container & card borders |

### Typography System
- **Primary Body & Interface Font**: `Inter` (sans-serif, weights: 300, 400, 500, 600, 700)
- **Secondary Luxury Display Font**: `Instrument Serif` (serif, italic emphasis for luxury phrasing)
- **Size Hierarchy**:
  - Hero Headline: 48px – 72px (Bold, leading 1.08)
  - Section Titles: 32px – 44px (Bold, tracking tight)
  - Card Titles: 18px – 24px (Bold)
  - Body Text: 14px – 16px (Regular/Light, leading relaxed)
  - Small / Badges: 11px – 12px (Medium/SemiBold, tracking wider)

### Liquid Glass Utilities (`src/styles/index.css`)
1. `.glass-nav`: `rgba(255, 255, 255, 0.78)` background with `blur(16px) saturate(180%)`.
2. `.glass-banner`: `linear-gradient(135deg, rgba(29,77,58,0.94), rgba(45,122,87,0.92))` with `blur(12px)`.
3. `.glass-card`: `rgba(255, 255, 255, 0.85)` background with `blur(12px)` and 1px border. Hover state lifts `-3px` and deepens shadow.
4. `.glass-badge`: Translucent forest green background with fine border.
5. `.glass-badge-gold`: Translucent luxury gold background with gold border.
6. `.glass-button`: Glass button with subtle backdrop blur and hover border glow.

---

## 4. Exhaustive Page-by-Page Content & Section Breakdown

### Page 1: Home Page (`/`)
- **Top Delivery Banner**:
  - Left content: Truck icon + "Same-Day Delivery in 1–3 Hours", Shield icon + "FREE Shipping Over $50", Clock icon + "Open Now (10am–11pm)".
  - Right content: Phone icon + "Dispatch: +1 (236) 883-6014".
- **Navbar**:
  - Logo: Forest green tile with gold sparkle icon + text "EliteBud" and subtext "BEST BUD IN TOWN".
  - Navigation Links: `Home`, `Shop Catalog`, `About Us`, `FAQ`, `Contact & Delivery`.
  - Actions: Search icon button, Cart bag button with item badge counter, "Call Now" button.
- **Hero Section**:
  - Pill badge: Sparkles icon + "Abbotsford's Premier Delivery Brand".
  - Main Title: "Premium Same-Day *Cannabis Delivery*" (italics rendered in Instrument Serif Gold).
  - Subtitle: "Ultra-premium craft flower, solventless live rosin, and artisanal gummies delivered directly across Abbotsford and Fraser Valley within 1–3 hours."
  - Buttons: "Shop Now" (navigates to `/shop`) and "Browse Categories" (anchors to `#categories`).
  - Spec Badges Grid: Free Delivery over $50, 1–3 Hours fulfillment, Interac & COD payments, Open daily 10:00 AM – 11:00 PM.
  - Hero Card Image: *Velvet Kush Reserve* preview with 31.5% THC badge.
- **Delivery Highlights Section**:
  - 6 Glass Feature Cards:
    1. *1–3 Hour Local Delivery*: Rapid dispatch drivers deliver directly to your doorstep in Abbotsford & surrounding areas.
    2. *Ultra-Premium Craft Buds*: Hand-trimmed, small-batch flower cured in micro-climate greenhouse facilities.
    3. *Fresh Daily Inventory*: Strict terpene preservation and temperature-controlled storage environment.
    4. *Fast Headless Checkout*: Seamless API-driven checkout experience without traditional WooCommerce delay.
    5. *Secure Payments*: Instant Interac E-Transfer auto-deposit or exact Cash On Delivery options.
    6. *Professional Service*: Direct phone dispatch support and real-time driver arrival notifications.
- **Featured Categories Section (`#categories`)**:
  - Section Header: "Curated Menu" / "Featured Craft Categories".
  - 6 Category Cards: Craft Flower (24 products), Concentrates & Rosin (16 products), THC Vapes & Pens (18 products), Edibles & Artisanal Gummies (20 products), Pre-Rolls & Accessories (14 products), Microdose Mushrooms (8 products).
- **Trending Reserve Selections Section**:
  - Section Header: "Hand-Picked Batches" / "Trending Reserve Selections".
  - Product Grid showcasing 6 top reserve products.
- **Why Choose EliteBud Section**:
  - Section Header: "Luxury Standard" / "Why Choose EliteBud Delivery?".
  - 3 Cards: *Cold-Cured Craft Flower*, *Discreet Doorstep Fulfillment*, *Direct Dispatch Line*.
- **Google Review Promotion Banner**:
  - Title: "Love EliteBud? Leave a 5-Star Google Review."
  - Subtitle: "Receive a complimentary FREE 7g Craft Weed on your next delivery!"
  - Button: "Leave a Google Review" (opens review URL in new tab).
- **Delivery Areas Grid**:
  - 6 Interactive Region Cards showing estimated delivery times (45–90 mins up to 90–150 mins) for Abbotsford, Abbotsford Airport, Mission, Chilliwack, Aldergrove, Langley Township.
- **FAQ Preview Accordion**:
  - Displays top 4 questions with expandable answers.
- **Contact Dispatch CTA**:
  - Banner: "Ready for Same-Day Delivery in Abbotsford?" with "Order Online Now" and "Call Dispatch: +1 (236) 883-6014".

---

### Page 2: Shop Catalog Page (`/shop`)
- **Page Header**: "EliteBud Online Dispensary" / "Craft Product Catalog" with live product count indicator.
- **Active Filter Badges Bar**: Displays active filters as removable pills with a "Clear All" button.
- **Sticky Filter Sidebar (`FilterBar.tsx`)**:
  - *Instant Search Input*: Real-time search by keyword.
  - *Category List*: All Categories, Craft Flower, Concentrates, THC Pens, Edibles, Pre-Rolls, Mushrooms.
  - *Strain Profile Selector*: All Strains, Indica, Sativa, Hybrid, High CBD.
  - *Max Price Range Slider*: $10 to $300 CAD.
  - *In-Stock Only Checkbox*: Hides out-of-stock items.
  - *Sort Dropdown*: Featured, Price: Low to High, Price: High to Low, Highest Rated, Newest Batches.
- **Product Grid (`ProductGrid.tsx`)**:
  - Responsive 3-column layout displaying filtered products.

---

### Page 3: Product Details Page (`/product/:slug`)
- **Breadcrumb Navigation**: "Back to Craft Catalog" link.
- **Left Column - Gallery**:
  - Main high-resolution image view.
  - Interactive thumbnail selector.
- **Right Column - Buy Box**:
  - Category, star rating, product title, tagline, strain type pill (Indica/Sativa/Hybrid), THC % and CBD % pills.
  - Short description.
  - *Expected Effects Pills*: e.g. "Euphoric", "Relaxed", "Nighttime Calm".
  - *Terpene Aroma Pills*: e.g. "Pine Needle", "Vanilla Terpenes", "Earth Musk".
  - *Weight Selector Buttons*: 3.5g, 7g, 14g, 28g (1 oz) showing price breakdown.
  - *Quantity Stepper*: `-` / `+` control buttons.
  - *Add to Cart Action Button*: Displays total price dynamically.
  - *Delivery Clock & Badges*: 1–3 Hour Dispatch, Free Shipping Over $50.
- **Specifications Accordion**:
  - Full Cultivation Breakdown, Technical Terpene Specs, Abbotsford Delivery Terms.
- **Verified Customer Reviews**: Review cards with verified buyer badges.
- **Related Products Grid**: 3 related items from the same category.

---

### Page 4: Shopping Cart Page (`/cart`)
- **Header**: "Shopping Cart" with total item summary.
- **Free Delivery Progress Meter**: Visual progress bar indicating progress towards $50 CAD free shipping.
- **Cart Items List**:
  - Product thumbnail, name, selected weight, unit price, quantity stepper (`-`/`+`), total price, and remove trash button.
- **Order Summary Box**:
  - Subtotal, Estimated Delivery Fee ($0 if subtotal >= $50, else $10), Total.
  - "Proceed to Checkout" button (`/checkout`).

---

### Page 5: Express Guest Checkout Page (`/checkout`)
- **Step 1: Customer Information**: First Name, Last Name, Phone, Email, 19+ BC Age Confirmation Checkbox.
- **Step 2: Local Delivery Address**: Street Address, City (Abbotsford), Province (BC), Postal Code (with auto-zone verification feedback), Delivery Notes.
- **Step 3: Dispatch Window & Payment**:
  - *Fulfillment Window Radios*: ASAP (1–3 Hours), Afternoon (2pm–5pm), Evening (6pm–9pm).
  - *Payment Method Radios*: Interac E-Transfer or Cash On Delivery.
- **Right Column - Order Overview**: Line items breakdown, subtotal, delivery fee, order total, and "Place Order" submit button.
- **Order Confirmation Screen (Post-Submit)**:
  - Order Reference Number (`EB-XXXXXX`), delivery window notification, Interac E-Transfer instructions with an interactive **"Copy Email"** button (`safepayabby@gmail.com`).

---

### Page 6: About Us Page (`/about`)
- **Hero Header**: "Redefining Same-Day *Luxury Cannabis Delivery*".
- **Story Content**: Editorial breakdown of BC micro-cultivator flower curation and cold-cured extracts.
- **Visual Image Card**: High-res craft rosin photo.
- **4 Pillars Grid**: Craft Integrity, 1–3 Hour Dispatch, 19+ Legal Compliance, Local Trust.

---

### Page 7: FAQ Page (`/faq`)
- **Search Bar**: Instant keyword search through questions and answers.
- **Category Tabs**: `All`, `Delivery`, `Products`, `Payments`, `Promotions`, `Hours`.
- **FAQ Accordion**: Expandable Q&A items.
- **Direct Dispatch Callout**: Card with clickable phone dispatch link `+1 (236) 883-6014`.

---

### Page 8: Contact Dispatch Page (`/contact`)
- **Contact Info Cards**: Phone Dispatch (`+1 236 883-6014`), Email (`safepayabby@gmail.com`), Hours (`10:00 AM – 11:00 PM`), Active Service Regions list.
- **Message Dispatch Form**: Name, Phone, Email, Message inputs with instant success message state.

---

### Page 9: Privacy Policy (`/privacy-policy`) & Page 10: Terms of Service (`/terms`)
- Complete legal documentation covering BC 19+ regulations, data encryption, and local delivery policies.

---

### Page 11: 404 Not Found Page (`*`)
- Clean error page with "Return to Homepage" button.

---

## 5. Global Overlay Systems & Modal Pipelines

### 1. CartDrawer (`src/components/ecommerce/CartDrawer.tsx`)
- Slide-over panel triggered by clicking the shopping bag icon.
- Features item quantity adjustments, free delivery meter, and quick checkout navigation.

### 2. QuickViewModal (`src/components/ecommerce/QuickViewModal.tsx`)
- Triggered by clicking the eye icon on any product card.
- Allows immediate weight selection and adding to cart without navigating away from the current page.

### 3. SearchPopover (`src/components/ecommerce/SearchPopover.tsx`)
- Triggered by clicking the search glass icon in the header.
- Provides real-time matching results as you type with thumbnail, category, and price.

### 4. AgeGateModal (`src/components/layout/AgeGateModal.tsx`)
- Mounts automatically on initial visit if legal age verification is not present in `localStorage`.
- Stores `isAgeVerified: true` upon user confirmation.

### 5. ToastContainer (`src/components/common/Toast.tsx`)
- Floating notification alert appearing in the bottom right corner when actions occur (e.g., adding to cart or copying email).

---

## 6. Master Interactive Button & Click Handler Technical Matrix

This section documents **every interactive button, link, and input element** across the application:

| # | UI Element | Page / Component | Target / Action | Exact Technical Mechanics & Handler |
|---|------------|------------------|-----------------|--------------------------------------|
| 1 | **Brand Logo Tile** | Navbar | `/` (Home) | React Router `<Link to="/">` |
| 2 | **Nav Link: Home** | Navbar | `/` | React Router `<Link to="/">` |
| 3 | **Nav Link: Shop Catalog** | Navbar | `/shop` | React Router `<Link to="/shop">` |
| 4 | **Nav Link: About Us** | Navbar | `/about` | React Router `<Link to="/about">` |
| 5 | **Nav Link: FAQ** | Navbar | `/faq` | React Router `<Link to="/faq">` |
| 6 | **Nav Link: Contact & Delivery** | Navbar | `/contact` | React Router `<Link to="/contact">` |
| 7 | **Search Button** | Navbar | Open Search Popover | Calls `openSearch()` in `useUIStore` |
| 8 | **Cart Bag Button** | Navbar | Open Cart Drawer | Calls `openCart()` in `useCartStore` |
| 9 | **Call Now Button** | Navbar | `tel:12368836014` | Native `tel:` href call trigger |
| 10 | **Mobile Menu Hamburger** | Navbar (Mobile) | Toggle Mobile Drawer | Toggles local state `mobileMenuOpen` |
| 11 | **Hero: Shop Now CTA** | Hero | `/shop` | React Router `<Link to="/shop">` |
| 12 | **Hero: Browse Categories**| Hero | `#categories` | Smooth anchor scroll to categories section |
| 13 | **Category Cards (x6)** | Home / Shop | `/shop?category={slug}` | Navigates to shop page with URL category parameter |
| 14 | **Product Card: Image/Title**| Product Card | `/product/{slug}` | Navigates to PDP route |
| 15 | **Product Card: Quick View** | Product Card | Open QuickView Modal | Calls `openQuickView(product)` in `useUIStore` |
| 16 | **Product Card: Weight Option**| Product Card | Select Weight Option | Updates `selectedWeight` local state |
| 17 | **Product Card: Add to Cart** | Product Card | Add Item to Cart | Calls `addToCart(...)` in `useCartStore` + triggers Toast |
| 18 | **Google Review CTA Button**| GoogleReviewPromo | Google Review URL | Opens external review link in new browser tab |
| 19 | **FilterBar: Search Input** | Shop Sidebar | Filter Products | Updates `searchQuery` in `useFilterStore` |
| 20 | **FilterBar: Category Items**| Shop Sidebar | Filter by Category | Updates `category` in `useFilterStore` |
| 21 | **FilterBar: Strain Pills** | Shop Sidebar | Filter by Strain | Updates `strainType` in `useFilterStore` |
| 22 | **FilterBar: Price Slider** | Shop Sidebar | Filter by Price | Updates `maxPrice` in `useFilterStore` |
| 23 | **FilterBar: In Stock Toggle**| Shop Sidebar | Filter Stock Status | Updates `inStockOnly` in `useFilterStore` |
| 24 | **FilterBar: Sort Dropdown** | Shop Sidebar | Sort Array | Updates `sortBy` in `useFilterStore` |
| 25 | **FilterBar: Reset Button** | Shop Sidebar | Reset All Filters | Calls `resetFilters()` in `useFilterStore` |
| 26 | **PDP: Thumbnail Photo** | Product Details | Switch Main Image | Updates `activeImageIndex` state |
| 27 | **PDP: Weight Option Buttons**| Product Details | Select Weight | Updates `selectedWeight` state & recalculates price |
| 28 | **PDP: Quantity (-) Button** | Product Details | Decrease Quantity | `setQuantity(Math.max(1, q - 1))` |
| 29 | **PDP: Quantity (+) Button** | Product Details | Increase Quantity | `setQuantity(q + 1)` |
| 30 | **PDP: Add to Cart CTA** | Product Details | Add Item to Cart | Calls `addToCart(...)` + triggers Toast |
| 31 | **PDP: Accordion Buttons** | Product Details | Expand / Collapse Specs | Toggles `openId` state |
| 32 | **Cart: Item (-) Button** | Cart Drawer / Cart | Decrease Item Qty | Calls `updateQuantity(itemId, qty - 1)` |
| 33 | **Cart: Item (+) Button** | Cart Drawer / Cart | Increase Item Qty | Calls `updateQuantity(itemId, qty + 1)` |
| 34 | **Cart: Remove Trash Icon** | Cart Drawer / Cart | Remove Item from Cart | Calls `removeFromCart(itemId)` |
| 35 | **Cart: Checkout CTA** | Cart Drawer / Cart | `/checkout` | Navigates to checkout route |
| 36 | **Checkout: Postal Input** | Checkout Form | Validate Zone | `onBlur` executes `validateDeliveryPostalCode()` |
| 37 | **Checkout: Delivery Window**| Checkout Form | Select Dispatch Slot | Radio field selection (`deliveryTimeSlot`) |
| 38 | **Checkout: Payment Radios** | Checkout Form | Select Payment Method | Radio field selection (`paymentMethod`) |
| 39 | **Checkout: Place Order CTA**| Checkout Form | Submit Order | Zod validation, calls `processOrder()`, clears cart |
| 40 | **Confirmation: Copy Email** | Checkout Confirmation| Copy E-Transfer Email | `navigator.clipboard.writeText('safepayabby@gmail.com')` |
| 41 | **Age Gate: Verify Button** | Age Gate Modal | Confirm 19+ Age | Calls `verifyAge()` in `useAgeGateStore` |
| 42 | **Age Gate: Exit Button** | Age Gate Modal | Exit Website | Redirects window to `https://www.google.com` |
| 43 | **Contact: Submit Message** | Contact Page | Send Message | Form handler sets `submitted: true` state |
| 44 | **FAQ: Search & Category Tabs**| FAQ Page | Filter FAQs | Updates `searchQuery` and `activeTab` states |

---

## 7. Step-by-Step Interactive Execution Flow Traces

### Trace 1: Adding a Product to Cart
```
[User clicks "Add to Cart" on ProductCard / PDP / QuickViewModal]
                       │
                       ▼
1. Handler calls `addToCart(product, selectedWeight, quantity)` in `useCartStore`.
                       │
                       ▼
2. Store searches `items` array for matching `id` (`${productId}-${weight}`).
   - If found: Increments existing `quantity`.
   - If new: Appends item object to `items` array.
                       │
                       ▼
3. Zustand updates state & automatically synchronizes with `localStorage` (key: `elitebud-cart-storage`).
                       │
                       ▼
4. Store sets `isCartOpen: true` -> `CartDrawer` animates slide-in with Framer Motion.
                       │
                       ▼
5. Calls `addToast("Added item to cart", "success")` in `useUIStore`.
                       │
                       ▼
6. `ToastContainer` renders floating glass toast card with a 4-second auto-dismiss timer.
                       │
                       ▼
7. `CartDrawer` recalculates subtotal and updates the Free Shipping progress bar.
```

### Trace 2: Completing Checkout Submission
```
[User clicks "Place Order" on Checkout Page]
                       │
                       ▼
1. React Hook Form executes Zod schema validation (`checkoutSchema`).
                       │
                       ▼
2. Form collects customer details, delivery address, time window & payment choice.
                       │
                       ▼
3. Calls `checkoutMutation.mutateAsync(payload)` -> triggers `CommerceService.processOrder(payload)`.
                       │
                       ▼
4. If REST API configured: Sends `POST /orders` via Axios.
   If Standalone Mock: Generates order object with reference number (e.g. `EB-849201`).
                       │
                       ▼
5. `setCompletedOrder(order)` updates local state.
                       │
                       ▼
6. Calls `clearCart()` in `useCartStore` to empty shopping cart.
                       │
                       ▼
7. Renders Order Confirmation Screen displaying delivery window and Interac E-Transfer copy button.
```

---

## 8. Data Models, API Schemas & Service Layer Contracts

Full TypeScript interfaces defined in [`src/types/index.ts`](file:///c:/Users/MSI/Desktop/woocommerece%20website/src/types/index.ts):

```ts
export type StrainType = 'Indica' | 'Sativa' | 'Hybrid' | 'High CBD' | 'N/A';

export interface WeightOption {
  label: string;      // e.g., "3.5g", "7g", "14g", "28g"
  grams: number;
  price: number;
  salePrice?: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  category: string;
  categorySlug: string;
  price: number;
  regularPrice: number;
  salePrice?: number;
  onSale: boolean;
  featured: boolean;
  inStock: boolean;
  stockQuantity: number;
  strainType: StrainType;
  thcPercentage: number;
  cbdPercentage: number;
  effects: string[];
  aroma: string[];
  weightOptions: WeightOption[];
  defaultWeight: string;
  shortDescription: string;
  description: string;
  images: string[];
  attributes: { name: string; options: string[] }[];
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  badge?: 'Bestseller' | 'Staff Pick' | 'New Release' | 'Sale' | 'Limited Batch';
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedWeight: string;
  selectedPrice: number;
  quantity: number;
}

export interface CheckoutPayload {
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    ageConfirmed: boolean;
  };
  shipping: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    province: string;
    postalCode: string;
    deliveryNotes?: string;
  };
  deliveryTimeSlot: 'asap' | 'scheduled_afternoon' | 'scheduled_evening';
  paymentMethod: 'interac_etransfer' | 'cash_on_delivery';
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}
```

---

## 9. Local Development, Build & Deployment Guide

### Prerequisites
- Node.js version 18.0 or higher.
- npm version 9.0 or higher.

### Command Execution
```bash
# 1. Install project dependencies
npm install

# 2. Run local development server (runs on http://localhost:5173/)
npm run dev

# 3. Type check & build production bundle
npm run build

# 4. Preview local production bundle
npm run preview
```

### Environment Variables (`.env`)
To connect the application to a live WooCommerce REST API instance, create a `.env` file in the root directory:

```env
VITE_WOOCOMMERCE_API_URL=https://your-domain.com/wp-json/wc/v3
VITE_WOOCOMMERCE_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx────────
VITE_WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx────────
```

*If these variables are omitted, EliteBud automatically runs in standalone mode using its curated high-resolution mock dataset.*

---

*Master Project Documentation for EliteBud Headless Commerce Frontend. Abbotsford, BC, Canada.*
