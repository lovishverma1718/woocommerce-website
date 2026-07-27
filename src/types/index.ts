// Domain Models & WooCommerce Headless REST API Contracts

export type StrainType = 'Indica' | 'Sativa' | 'Hybrid' | 'High CBD' | 'N/A';

export interface WeightOption {
  label: string; // e.g., "3.5g", "7g", "14g", "28g"
  grams: number;
  price: number;
  salePrice?: number;
  inStock: boolean;
}

export interface ProductAttribute {
  name: string; // e.g., "THC", "CBD", "Aroma", "Effects", "Strain"
  options: string[];
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number; // 1-5
  date: string;
  comment: string;
  verifiedBuyer: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  category: string; // e.g., "Flower", "Concentrates", "THC Pens", "Edibles & Gummies", "Pre Rolls", "Mushrooms"
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
  effects: string[]; // e.g., ["Euphoric", "Relaxed", "Creative"]
  aroma: string[];   // e.g., ["Pine", "Citrus", "Earthy"]
  weightOptions: WeightOption[];
  defaultWeight: string;
  shortDescription: string;
  description: string;
  images: string[];
  attributes: ProductAttribute[];
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  badge?: 'Bestseller' | 'Staff Pick' | 'New Release' | 'Sale' | 'Limited Batch';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  count: number;
  featured?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedWeight: string;
  selectedPrice: number;
  quantity: number;
}

export interface DeliveryZone {
  name: string;
  city: string;
  estimatedTime: string;
  minOrder: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  available: boolean;
  postalCodes: string[];
}

export type PaymentMethodType = 'interac_etransfer' | 'cash_on_delivery';

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
  paymentMethod: PaymentMethodType;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  payload: CheckoutPayload;
  estimatedDeliveryWindow: string;
}

export interface FAQItem {
  id: string;
  category: 'Delivery' | 'Products' | 'Payments' | 'Hours' | 'Promotions';
  question: string;
  answer: string;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  strainType: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
}
