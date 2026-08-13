import { Product, Category, FAQItem, CheckoutPayload, Order, FilterState, StrainType } from '../types';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_FAQS } from '../api/mockData';
import { apiClient, isLiveApiConfigured } from '../api/client';

export class CommerceService {
  /**
   * Helper to flexibly match a category slug/name against a filter string
   */
  private static matchCategory(prodCatName: string, prodCatSlug: string, filterTarget: string): boolean {
    const target = filterTarget.toLowerCase().trim();
    const cName = prodCatName.toLowerCase().trim();
    const cSlug = prodCatSlug.toLowerCase().trim();

    if (target === 'all') return true;
    if (cSlug === target || cName === target) return true;

    if (target.includes('flower') && (cSlug.includes('flower') || cName.includes('flower'))) return true;
    if ((target.includes('thc') || target.includes('pen') || target.includes('vape')) && 
        (cSlug.includes('thc') || cSlug.includes('pen') || cSlug.includes('vape') || cName.includes('thc') || cName.includes('pen') || cName.includes('vape'))) return true;
    if ((target.includes('edible') || target.includes('gummi')) && 
        (cSlug.includes('edible') || cSlug.includes('gummi') || cName.includes('edible') || cName.includes('gummi'))) return true;
    if ((target.includes('concentrate') || target.includes('rosin')) && 
        (cSlug.includes('concentrate') || cSlug.includes('rosin') || cName.includes('concentrate') || cName.includes('rosin'))) return true;
    if ((target.includes('roll') || target.includes('pre')) && 
        (cSlug.includes('roll') || cSlug.includes('pre') || cName.includes('roll') || cName.includes('pre'))) return true;
    if ((target.includes('mushroom') || target.includes('micro')) && 
        (cSlug.includes('mushroom') || cSlug.includes('micro') || cName.includes('mushroom') || cName.includes('micro'))) return true;

    return cSlug.includes(target) || target.includes(cSlug);
  }

  /**
   * Fetch all products from WooCommerce REST API (100% Live DB products, zero mock fallback)
   */
  static async getProducts(filters?: Partial<FilterState>): Promise<Product[]> {
    if (isLiveApiConfigured) {
      try {
        // Fetch all published products from WooCommerce without passing unmapped string category params
        const response = await apiClient.get('/products', {
          params: {
            per_page: 100,
          }
        });

        if (Array.isArray(response.data)) {
          let liveProducts = response.data.map(CommerceService.mapWCProductToDomain);

          // Apply client-side search query
          if (filters?.searchQuery) {
            const q = filters.searchQuery.toLowerCase();
            liveProducts = liveProducts.filter(
              p => p.name.toLowerCase().includes(q) || 
                   p.category.toLowerCase().includes(q) ||
                   p.shortDescription.toLowerCase().includes(q) ||
                   p.effects.some(e => e.toLowerCase().includes(q))
            );
          }

          // Apply client-side category filter with flexible slug matching
          if (filters?.category && filters.category !== 'all') {
            liveProducts = liveProducts.filter(p => 
              CommerceService.matchCategory(p.category, p.categorySlug, filters.category!)
            );
          }

          // Apply strain profile filter with smart title & strain matching
          if (filters?.strainType && filters.strainType !== 'all') {
            const targetStrain = filters.strainType.toLowerCase();
            liveProducts = liveProducts.filter(p => {
              const sType = p.strainType.toLowerCase();
              const pName = p.name.toLowerCase();
              const pDesc = p.shortDescription.toLowerCase();

              if (targetStrain === 'sativa') return sType === 'sativa' || pName.includes('sativa') || pDesc.includes('sativa');
              if (targetStrain === 'indica') return sType === 'indica' || pName.includes('indica') || pDesc.includes('indica');
              if (targetStrain === 'hybrid') return sType === 'hybrid' || pName.includes('hybrid') || pDesc.includes('hybrid');
              if (targetStrain.includes('cbd')) return sType.includes('cbd') || pName.includes('cbd') || pDesc.includes('cbd');
              return sType === targetStrain;
            });
          }

          // Apply stock filter
          if (filters?.inStockOnly) {
            liveProducts = liveProducts.filter(p => p.inStock);
          }

          // Apply price range filter
          if (filters?.minPrice !== undefined && filters?.maxPrice !== undefined) {
            liveProducts = liveProducts.filter(p => p.price >= (filters.minPrice ?? 0) && p.price <= (filters.maxPrice ?? 1000));
          }

          // Sorting
          if (filters?.sortBy === 'price-low') {
            liveProducts.sort((a, b) => a.price - b.price);
          } else if (filters?.sortBy === 'price-high') {
            liveProducts.sort((a, b) => b.price - a.price);
          } else if (filters?.sortBy === 'rating') {
            liveProducts.sort((a, b) => b.rating - a.rating);
          } else if (filters?.sortBy === 'newest') {
            liveProducts.sort((a, b) => b.id.localeCompare(a.id));
          }

          // ALWAYS return live products (never leak mock products into production)
          return liveProducts;
        }
      } catch (err: any) {
        console.warn('WooCommerce REST API fetch fallback:', err?.message || err);
      }
    }

    // Fallback ONLY used if API configuration is missing completely
    return [];
  }

  /**
   * Fetch single product by slug or ID from Live WooCommerce API
   */
  static async getProductBySlug(slug: string): Promise<Product | null> {
    if (isLiveApiConfigured) {
      try {
        const response = await apiClient.get('/products', { params: { per_page: 100 } });
        if (Array.isArray(response.data)) {
          const liveProducts = response.data.map(CommerceService.mapWCProductToDomain);
          const found = liveProducts.find(p => p.slug === slug || p.id === slug);
          if (found) return found;
        }
      } catch (err) {
        console.warn('Fallback lookup for slug:', slug);
      }
    }

    return null;
  }

  /**
   * Fetch all product categories (dynamically computes exact product counts from live products)
   */
  static async getCategories(): Promise<Category[]> {
    const getOrderIndex = (slug: string, name: string): number => {
      const s = slug.toLowerCase();
      const n = name.toLowerCase();
      if (s.includes('flower') || n.includes('flower')) return 0;
      if (s.includes('thc') || s.includes('pen') || s.includes('vape') || n.includes('thc') || n.includes('pen') || n.includes('vape')) return 1;
      if (s.includes('edible') || s.includes('gummi') || n.includes('edible') || n.includes('gummi')) return 2;
      if (s.includes('concentrate') || s.includes('rosin') || n.includes('concentrate') || n.includes('rosin')) return 3;
      if (s.includes('roll') || s.includes('pre') || n.includes('roll') || n.includes('pre')) return 4;
      if (s.includes('mushroom') || s.includes('micro') || n.includes('mushroom') || n.includes('micro')) return 5;
      return 99;
    };

    if (isLiveApiConfigured) {
      try {
        // Get all live products to calculate accurate category counts
        const allLiveProducts = await CommerceService.getProducts();

        const response = await apiClient.get('/products/categories');
        if (Array.isArray(response.data) && response.data.length > 0) {
          const filtered = response.data.filter((c: any) => c.slug !== 'uncategorized' && c.name.toLowerCase() !== 'uncategorized');
          const mapped: Category[] = filtered.map((c: any) => {
            const matchMock = MOCK_CATEGORIES.find(m => m.slug === c.slug || c.slug.includes(m.slug) || c.name.toLowerCase().includes(m.slug));
            
            // Calculate accurate count based on actual live products in database
            const liveCount = allLiveProducts.filter(p => 
              CommerceService.matchCategory(p.category, p.categorySlug, c.slug) ||
              CommerceService.matchCategory(p.category, p.categorySlug, c.name)
            ).length;

            return {
              id: String(c.id),
              name: c.name,
              slug: c.slug,
              description: c.description ? c.description.replace(/<[^>]*>?/gm, '').trim() : '',
              image: matchMock ? matchMock.image : (c.image?.src || MOCK_CATEGORIES[0].image),
              count: liveCount,
            };
          });

          // Sort according to strict client 2x3 matrix order
          mapped.sort((a, b) => getOrderIndex(a.slug, a.name) - getOrderIndex(b.slug, b.name));
          return mapped;
        }
      } catch (err) {
        console.warn('Fallback to local categories:', err);
      }
    }

    const localList = [...MOCK_CATEGORIES];
    localList.sort((a, b) => getOrderIndex(a.slug, a.name) - getOrderIndex(b.slug, b.name));
    return localList;
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

  // Helper to map WooCommerce API product payload to domain model
  private static mapWCProductToDomain(wc: any): Product {
    const defaultCraftImg = 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&w=1000&q=80';
    const images = (wc.images && wc.images.length > 0 && wc.images[0].src)
      ? wc.images.map((img: any) => img.src)
      : [defaultCraftImg];

    const priceVal = parseFloat(wc.price || wc.regular_price || '0');
    const regPriceVal = parseFloat(wc.regular_price || wc.price || '0');
    const salePriceVal = wc.sale_price ? parseFloat(wc.sale_price) : undefined;
    const finalPrice = priceVal > 0 ? priceVal : 45.00;

    const catName = wc.categories?.[0]?.name || 'Craft Flower';
    const catSlug = wc.categories?.[0]?.slug || 'flower';

    // Smart strain detection from meta_data, product title, or product description
    const rawStrain = String(wc.meta_data?.find((m: any) => m.key === 'strain_type' || m.key === 'strain')?.value || '');
    const nameAndDesc = `${wc.name || ''} ${wc.short_description || ''} ${wc.description || ''}`.toLowerCase();
    
    let strainType: StrainType = 'Hybrid';
    if (rawStrain && ['indica', 'sativa', 'hybrid', 'high cbd'].includes(rawStrain.toLowerCase())) {
      const lower = rawStrain.toLowerCase();
      if (lower === 'sativa') strainType = 'Sativa';
      else if (lower === 'indica') strainType = 'Indica';
      else if (lower.includes('cbd')) strainType = 'High CBD';
      else strainType = 'Hybrid';
    } else if (nameAndDesc.includes('sativa')) {
      strainType = 'Sativa';
    } else if (nameAndDesc.includes('indica')) {
      strainType = 'Indica';
    } else if (nameAndDesc.includes('cbd')) {
      strainType = 'High CBD';
    } else {
      strainType = 'Hybrid';
    }

    return {
      id: String(wc.id),
      slug: wc.slug || `product-${wc.id}`,
      name: wc.name,
      tagline: wc.short_description ? wc.short_description.replace(/<[^>]*>?/gm, '').trim() : 'Private Reserve Small Batch Craft Flower',
      category: catName,
      categorySlug: catSlug,
      price: finalPrice,
      regularPrice: regPriceVal > 0 ? regPriceVal : finalPrice,
      salePrice: salePriceVal,
      onSale: Boolean(wc.on_sale),
      featured: Boolean(wc.featured || true),
      inStock: wc.stock_status === 'instock',
      stockQuantity: wc.stock_quantity || 30,
      strainType: strainType,
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
