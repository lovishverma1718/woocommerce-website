import { Product, Category, FAQItem, CheckoutPayload, Order, FilterState, WeightOption } from '../types';
import { MOCK_CATEGORIES, MOCK_FAQS } from '../api/mockData';
import { apiClient, isLiveApiConfigured } from '../api/client';
import { buildProduct, mapWCVariation } from '../lib/wcMapping';

/**
 * One shared catalog request (products + variations + categories) served by /api/catalog,
 * which is cached at the CDN. Every list, product page and category view reuses it, so a
 * visit makes one request instead of ~100 direct WooCommerce calls.
 */
interface CatalogResponse {
  products: any[];
  variations: Record<string, any[]>;
  categories: any[] | null;
}
const CATALOG_TTL_MS = 60 * 1000;
let catalogCache: { at: number; promise: Promise<CatalogResponse> } | null = null;

/** Tokens issued by /api/order, needed to mark that order as payment sent. */
const orderTokens = new Map<string, string>();

function loadCatalog(): Promise<CatalogResponse> {
  if (catalogCache && Date.now() - catalogCache.at < CATALOG_TTL_MS) return catalogCache.promise;
  const promise = apiClient.get('/catalog', { timeout: 40000 }).then(r => r.data as CatalogResponse);
  catalogCache = { at: Date.now(), promise };
  // Never keep a failed request around: the next call retries.
  promise.catch(() => { if (catalogCache?.promise === promise) catalogCache = null; });
  return promise;
}

/** All catalog products mapped to the domain model (same mapping as before). */
async function loadDomainProducts(): Promise<Product[]> {
  const data = await loadCatalog();
  if (!Array.isArray(data?.products)) throw new Error('Invalid catalog response');
  return data.products.map((wc: any) => buildProduct(wc, data.variations?.[String(wc.id)]));
}

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
        // Products + variations come from the shared, CDN cached catalog (/api/catalog)
        {
          let liveProducts = await loadDomainProducts();

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
        const data = await loadCatalog();
        if (Array.isArray(data?.products)) {
          const rawFound = data.products.find((wc: any) => wc.slug === slug || String(wc.id) === slug);
          if (rawFound) {
            return buildProduct(rawFound, data.variations?.[String(rawFound.id)]);
          }
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

        const { categories } = await loadCatalog();
        if (Array.isArray(categories) && categories.length > 0) {
          const filtered = categories.filter((c: any) => c.slug !== 'uncategorized' && c.name.toLowerCase() !== 'uncategorized');
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
   * Create the order through /api/order. The server recomputes every price and the delivery
   * fee from live WooCommerce data, creates the order and moves it to "processing" (which sends
   * the WooCommerce emails). If anything fails this THROWS, so the checkout shows an error
   * instead of a confirmation for an order that does not exist.
   */
  static async processOrder(payload: CheckoutPayload): Promise<Order> {
    const response = await apiClient
      .post('/order', {
        paymentMethod: payload.paymentMethod,
        customer: payload.customer,
        shipping: payload.shipping,
        items: payload.items.map(item => ({
          productId: item.productId,
          selectedWeight: item.selectedWeight,
          quantity: item.quantity,
          unitPrice: item.selectedPrice,
        })),
      }, { timeout: 55000 })
      .catch((err: any) => {
        const serverMessage = err?.response?.data?.error;
        throw new Error(
          serverMessage ||
          'We could not confirm your order. Please call or text dispatch before trying again, so you are not charged twice.'
        );
      });

    const data = response.data;
    if (!data?.id || !data?.token) {
      throw new Error('We could not confirm your order. Please call or text dispatch before trying again, so you are not charged twice.');
    }
    orderTokens.set(String(data.id), data.token);

    return {
      id: String(data.id),
      orderNumber: data.orderNumber || `EB-${data.id}`,
      createdAt: new Date().toISOString(),
      status: 'processing',
      payload,
      estimatedDeliveryWindow: '1–3 Hours (Same Day Dispatch)',
    };
  }

  /**
   * Mark the order as "payment-sent" (the only status the browser may set), using the
   * one-time token the server issued when the order was created.
   */
  static async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    const token = orderTokens.get(String(orderId));
    if (status !== 'payment-sent' || !token) return false;
    try {
      await apiClient.post('/order-status', { orderId, token });
      return true;
    } catch (err) {
      console.warn('Order status update failed:', err);
      return false;
    }
  }

  /**
   * Fetch exact product variations from WooCommerce REST API for variable products
   */
  static async fetchProductVariations(productId: string | number): Promise<WeightOption[]> {
    if (!isLiveApiConfigured) return [];
    try {
      const data = await loadCatalog();
      const list = data?.variations?.[String(productId)];
      if (Array.isArray(list) && list.length > 0) {
        return list.map(mapWCVariation);
      }
    } catch (err) {
      console.warn(`Could not fetch variations for product ${productId}:`, err);
    }
    return [];
  }
}
