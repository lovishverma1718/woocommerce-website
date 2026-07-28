import { Product, Category, FAQItem, CheckoutPayload, Order, FilterState } from '../types';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_FAQS } from '../api/mockData';
import { apiClient, isLiveApiConfigured } from '../api/client';

export class CommerceService {
  /**
   * Fetch all products from WooCommerce REST API
   */
  static async getProducts(filters?: Partial<FilterState>): Promise<Product[]> {
    if (isLiveApiConfigured) {
      try {
        const response = await apiClient.get('/products', {
          params: {
            per_page: 50,
            search: filters?.searchQuery || undefined,
            category: filters?.category !== 'all' ? filters?.category : undefined,
          }
        });

        if (Array.isArray(response.data) && response.data.length > 0) {
          const liveProducts = response.data.map(CommerceService.mapWCProductToDomain);
          return liveProducts;
        }
      } catch (err: any) {
        console.warn('WooCommerce REST API fetch fallback:', err?.message || err);
      }
    }

    // Local filter simulation fallback
    let result = [...MOCK_PRODUCTS];

    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) || 
             p.category.toLowerCase().includes(q) ||
             p.shortDescription.toLowerCase().includes(q) ||
             p.effects.some(e => e.toLowerCase().includes(q))
      );
    }

    if (filters?.category && filters.category !== 'all') {
      result = result.filter(p => p.categorySlug === filters.category);
    }

    if (filters?.strainType && filters.strainType !== 'all') {
      result = result.filter(p => p.strainType === filters.strainType);
    }

    if (filters?.inStockOnly) {
      result = result.filter(p => p.inStock);
    }

    if (filters?.minPrice !== undefined && filters?.maxPrice !== undefined) {
      result = result.filter(p => p.price >= (filters.minPrice ?? 0) && p.price <= (filters.maxPrice ?? 1000));
    }

    // Sorting
    if (filters?.sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters?.sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters?.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters?.sortBy === 'newest') {
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }

  /**
   * Fetch single product by slug or ID
   */
  static async getProductBySlug(slug: string): Promise<Product | null> {
    if (isLiveApiConfigured) {
      try {
        const response = await apiClient.get('/products', { params: { slug } });
        if (response.data && response.data.length > 0) {
          return CommerceService.mapWCProductToDomain(response.data[0]);
        }
      } catch (err) {
        console.warn('Fallback lookup for slug:', slug);
      }
    }

    const found = MOCK_PRODUCTS.find(p => p.slug === slug || p.id === slug);
    return found || null;
  }

  /**
   * Fetch all product categories (filters out 'uncategorized' and assigns custom images)
   */
  static async getCategories(): Promise<Category[]> {
    if (isLiveApiConfigured) {
      try {
        const response = await apiClient.get('/products/categories');
        if (Array.isArray(response.data) && response.data.length > 0) {
          const filtered = response.data.filter((c: any) => c.slug !== 'uncategorized' && c.name.toLowerCase() !== 'uncategorized');
          return filtered.map((c: any) => {
            const matchMock = MOCK_CATEGORIES.find(m => m.slug === c.slug || c.slug.includes(m.slug) || c.name.toLowerCase().includes(m.slug));
            return {
              id: String(c.id),
              name: c.name,
              slug: c.slug,
              description: c.description ? c.description.replace(/<[^>]*>?/gm, '').trim() : '',
              image: matchMock ? matchMock.image : (c.image?.src || MOCK_CATEGORIES[0].image),
              count: c.count || 0,
            };
          });
        }
      } catch (err) {
        console.warn('Fallback to local categories:', err);
      }
    }
    return MOCK_CATEGORIES;
  }

  /**
   * Fetch FAQs
   */
  static async getFAQs(): Promise<FAQItem[]> {
    return MOCK_FAQS;
  }

  /**
   * Process Checkout order submission in WooCommerce REST API
   */
  static async processOrder(payload: CheckoutPayload): Promise<Order> {
    const isInterac = payload.paymentMethod === 'interac_etransfer';
    const initialStatus = isInterac ? 'pending' : 'processing';

    if (isLiveApiConfigured) {
      try {
        const response = await apiClient.post('/orders', {
          payment_method: payload.paymentMethod,
          payment_method_title: isInterac ? 'Interac E-Transfer' : 'Cash On Delivery',
          status: initialStatus,
          set_paid: false,
          billing: {
            first_name: payload.customer.firstName,
            last_name: payload.customer.lastName,
            email: payload.customer.email,
            phone: payload.customer.phone,
            address_1: payload.shipping.addressLine1,
            address_2: payload.shipping.addressLine2 || '',
            city: payload.shipping.city,
            state: payload.shipping.province,
            postcode: payload.shipping.postalCode,
          },
          line_items: payload.items.map(item => ({
            product_id: item.productId,
            quantity: item.quantity,
          })),
        });

        return {
          id: String(response.data.id),
          orderNumber: `EB-${response.data.id}`,
          createdAt: new Date().toISOString(),
          status: response.data.status || initialStatus,
          payload,
          estimatedDeliveryWindow: '1–3 Hours (Same Day Dispatch)',
        };
      } catch (err) {
        console.warn('Using simulation order generation fallback:', err);
      }
    }

    // Local order simulation
    const randomId = Math.floor(100000 + Math.random() * 900000);
    return {
      id: `ord-${randomId}`,
      orderNumber: `EB-${randomId}`,
      createdAt: new Date().toISOString(),
      status: initialStatus,
      payload,
      estimatedDeliveryWindow: '1–3 Hours (Same Day Dispatch)',
    };
  }

  /**
   * Update WooCommerce Order Status (e.g. to 'payment-sent')
   */
  static async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    if (isLiveApiConfigured && !orderId.startsWith('ord-')) {
      try {
        await apiClient.put(`/orders/${orderId}`, {
          status: status,
        });
        return true;
      } catch (err) {
        console.warn('WooCommerce order status update fallback:', err);
      }
    }
    return true;
  }

  // Private helper to map WooCommerce API product payload to domain model
  private static mapWCProductToDomain(wc: any): Product {
    const defaultCraftImg = 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&w=1000&q=80';
    const images = (wc.images && wc.images.length > 0 && wc.images[0].src)
      ? wc.images.map((img: any) => img.src)
      : [defaultCraftImg];

    const priceVal = parseFloat(wc.price || wc.regular_price || '0');
    const regPriceVal = parseFloat(wc.regular_price || wc.price || '0');
    const salePriceVal = wc.sale_price ? parseFloat(wc.sale_price) : undefined;
    const finalPrice = priceVal > 0 ? priceVal : 45.00;

    return {
      id: String(wc.id),
      slug: wc.slug || `product-${wc.id}`,
      name: wc.name,
      tagline: wc.short_description ? wc.short_description.replace(/<[^>]*>?/gm, '').trim() : 'Private Reserve Small Batch Craft Flower',
      category: wc.categories?.[0]?.name || 'Craft Flower',
      categorySlug: wc.categories?.[0]?.slug || 'flower',
      price: finalPrice,
      regularPrice: regPriceVal > 0 ? regPriceVal : finalPrice,
      salePrice: salePriceVal,
      onSale: Boolean(wc.on_sale),
      featured: Boolean(wc.featured || true),
      inStock: wc.stock_status === 'instock',
      stockQuantity: wc.stock_quantity || 30,
      strainType: (wc.meta_data?.find((m: any) => m.key === 'strain_type')?.value) || 'Indica',
      thcPercentage: parseFloat(wc.meta_data?.find((m: any) => m.key === 'thc_percentage')?.value || '32.0'),
      cbdPercentage: parseFloat(wc.meta_data?.find((m: any) => m.key === 'cbd_percentage')?.value || '0.1'),
      effects: ['Deep Relaxation', 'Euphoric', 'Nighttime Calm'],
      aroma: ['Pungent Gas', 'Vanilla Terps', 'Earth'],
      defaultWeight: '3.5g',
      weightOptions: [
        { label: '3.5g', grams: 3.5, price: finalPrice, inStock: true },
        { label: '7g', grams: 7, price: Math.round(finalPrice * 1.9 * 100) / 100, inStock: true },
        { label: '14g', grams: 14, price: Math.round(finalPrice * 3.6 * 100) / 100, inStock: true },
        { label: '28g (1 oz)', grams: 28, price: Math.round(finalPrice * 6.5 * 100) / 100, inStock: true },
      ],
      shortDescription: wc.short_description ? wc.short_description.replace(/<[^>]*>?/gm, '').trim() : 'Cold-cured AAA+ craft flower delivered same-day across Abbotsford within 1–3 hours.',
      description: wc.description ? wc.description.replace(/<[^>]*>?/gm, '').trim() : 'Cultivated in BC micro-climate greenhouses, hand-trimmed and cured in frosted matte glass cellars.',
      images: images,
      attributes: wc.attributes || [],
      rating: parseFloat(wc.average_rating || '5.0'),
      reviewCount: wc.rating_count || 18,
      reviews: [],
      badge: 'Bestseller',
    };
  }
}
