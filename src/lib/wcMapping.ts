/**
 * Pure WooCommerce -> domain mapping, shared by the browser (commerceService.ts) and the
 * server (netlify/functions/api.mts), so prices shown on the site and prices charged on an
 * order are computed by exactly the same code.
 *
 * Moved verbatim from commerceService.ts. Do not change behaviour here without checking
 * both the shop display and order pricing.
 */
import { Product, StrainType, WeightOption } from '../types';

export function mapWCVariation(v: any): WeightOption {
  const attrOption = v.attributes?.[0]?.option || v.name || `${v.id}`;
  const priceVal = parseFloat(v.price || v.regular_price || '0');
  const saleVal = v.sale_price ? parseFloat(v.sale_price) : undefined;
  const parsedGrams = parseFloat(String(attrOption).replace(/[^0-9.]/g, '')) || 0;

  return {
    id: v.id,
    label: String(attrOption).trim(),
    grams: parsedGrams,
    price: priceVal,
    salePrice: saleVal,
    inStock: v.stock_status === 'instock',
  };
}

export function mapWCProductToDomain(wc: any): Product {
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

  // Parse weight options dynamically from WooCommerce Attributes
  let weightOptions: WeightOption[] = [];

  const weightAttr = wc.attributes?.find((a: any) => 
    a.name?.toLowerCase().includes('weight') || 
    a.name?.toLowerCase().includes('size') ||
    a.name?.toLowerCase().includes('quantity')
  ) || wc.attributes?.[0];

  if (weightAttr && Array.isArray(weightAttr.options) && weightAttr.options.length > 0) {
    weightOptions = weightAttr.options.map((optStr: string, idx: number) => {
      const label = String(optStr).trim();
      const parsedGrams = parseFloat(label.replace(/[^0-9.]/g, '')) || 0;
      let price = finalPrice;
      if (idx > 0 && weightOptions[0]?.grams > 0 && parsedGrams > 0) {
        price = Math.round(finalPrice * (parsedGrams / weightOptions[0].grams) * 0.88 * 100) / 100;
      }

      return {
        label: label,
        grams: parsedGrams,
        price: price,
        inStock: true,
      };
    });
  }

  if (weightOptions.length === 0) {
    const titleMatch = wc.name.match(/(\d+(?:\.\d+)?\s*(?:g|gram|oz|mg))/i);
    const singleWeight = titleMatch ? titleMatch[1].toUpperCase() : '';
    if (singleWeight) {
      weightOptions = [{ label: singleWeight, grams: parseFloat(singleWeight) || 1, price: finalPrice, inStock: true }];
    } else {
      weightOptions = [
        { label: '3.5g', grams: 3.5, price: finalPrice, inStock: true },
        { label: '7g', grams: 7, price: Math.round(finalPrice * 1.9 * 100) / 100, inStock: true },
        { label: '14g', grams: 14, price: Math.round(finalPrice * 3.6 * 100) / 100, inStock: true },
        { label: '28g (1 oz)', grams: 28, price: Math.round(finalPrice * 6.5 * 100) / 100, inStock: true },
      ];
    }
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
    defaultWeight: weightOptions[0]?.label || '3.5g',
    weightOptions: weightOptions,
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

/** True when WooCommerce returns separate variations for this product. */
export function hasVariations(wc: any): boolean {
  return wc.type === 'variable' || (Array.isArray(wc.variations) && wc.variations.length > 0);
}

/**
 * Domain product including live variations. Same logic that commerceService.ts used inline:
 * variations, when present, replace the weight options and set price and default weight.
 */
export function buildProduct(wc: any, rawVariations: any[] | undefined): Product {
  const domainProduct = mapWCProductToDomain(wc);
  if (hasVariations(wc)) {
    const liveVariations = (rawVariations || []).map(mapWCVariation);
    if (liveVariations.length > 0) {
      domainProduct.weightOptions = liveVariations;
      domainProduct.price = liveVariations[0].salePrice || liveVariations[0].price;
      domainProduct.defaultWeight = liveVariations[0].label;
    }
  }
  return domainProduct;
}

/**
 * Unit price and weight option for a cart line, exactly as useCartStore.addToCart computes it.
 */
export function resolveCartLine(product: Product, selectedWeight?: string) {
  const weightLabel = selectedWeight || product.defaultWeight || '3.5g';
  const weightOpt = product.weightOptions.find(w => w.label === weightLabel);
  const unitPrice = weightOpt ? (weightOpt.salePrice || weightOpt.price) : product.price;
  return { weightLabel, weightOpt, unitPrice };
}
