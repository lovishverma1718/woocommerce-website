/**
 * EliteBud server side API (Netlify Function).
 *
 * The browser talks only to /api/*. WooCommerce keys live here, in server side
 * environment variables, and never reach the visitor's browser.
 *
 *   GET  /api/catalog       Products + variations + categories in one response, cached at the CDN.
 *   POST /api/order         Creates the WooCommerce order. Prices and the delivery fee are
 *                           recomputed here from live WooCommerce data.
 *   POST /api/order-status  Marks an order "payment-sent". Needs the token returned by /api/order.
 *
 * Nothing else is exposed: no reading orders, no customers, no product edits.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import { buildProduct, hasVariations, resolveCartLine } from '../../src/lib/wcMapping';
import { calculateDeliveryFee } from '../../src/lib/utils';

export const config = { path: '/api/*' };

/* --------------------------------- Config --------------------------------- */

// New server only names first, then the old VITE_ names so the switch needs no config change.
const env = (name: string, legacy: string) =>
  (process.env[name] || process.env[legacy] || '').trim();

const WC_URL = () => env('WC_API_URL', 'VITE_WOOCOMMERCE_API_URL').replace(/\/+$/, '');
const WC_KEY = () => env('WC_CONSUMER_KEY', 'VITE_WOOCOMMERCE_CONSUMER_KEY');
const WC_SECRET = () => env('WC_CONSUMER_SECRET', 'VITE_WOOCOMMERCE_CONSUMER_SECRET');

// Netlify allows synchronous functions 60 s. Per request we allow 15 s, the same timeout the
// site always used in the browser; the whole catalog build stops starting new work at 25 s.
const CATALOG_DEADLINE_MS = 25000;
const REQUEST_TIMEOUT_MS = 15000;
const VARIATION_CONCURRENCY = 6;

// Fields the shared mapper (src/lib/wcMapping.ts) reads. Nothing else is needed by the site.
const PRODUCT_FIELDS = [
  'id', 'slug', 'name', 'type', 'variations', 'price', 'regular_price', 'sale_price', 'on_sale',
  'featured', 'stock_status', 'stock_quantity', 'categories', 'images', 'attributes', 'meta_data',
  'short_description', 'description', 'average_rating', 'rating_count',
].join(',');
const VARIATION_FIELDS = 'id,name,attributes,price,regular_price,sale_price,stock_status';
const CATEGORY_FIELDS = 'id,name,slug,description,image';

/* ------------------------------ WooCommerce IO ----------------------------- */

class UpstreamError extends Error {}

async function wc(path: string, init: { method?: string; params?: Record<string, string>; body?: unknown; timeoutMs?: number } = {}) {
  const base = WC_URL();
  const key = WC_KEY();
  const secret = WC_SECRET();
  if (!base.startsWith('http') || !key || !secret) throw new UpstreamError('Store API is not configured');

  const url = new URL(`${base}${path}`);
  // Same auth as the site always used: header plus query params (some hosts strip the header).
  url.searchParams.set('consumer_key', key);
  url.searchParams.set('consumer_secret', secret);
  for (const [k, v] of Object.entries(init.params || {})) url.searchParams.set(k, v);

  const res = await fetch(url, {
    method: init.method || 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}`,
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    signal: AbortSignal.timeout(init.timeoutMs ?? REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new UpstreamError(`WooCommerce ${init.method || 'GET'} ${path} returned ${res.status}`);
  return res.json();
}

/** Runs tasks with limited parallelism; stops starting new ones after the deadline. */
async function pool<T>(items: T[], limit: number, deadline: number, task: (item: T) => Promise<void>) {
  let next = 0;
  const worker = async () => {
    while (next < items.length && Date.now() < deadline) {
      const item = items[next++];
      await task(item).catch(() => undefined);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
}

/* --------------------------------- Helpers -------------------------------- */

const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });

const fail = (status: number, message: string) => json({ error: message }, status);

const orderToken = (orderId: number | string) =>
  createHmac('sha256', `elitebud-order:${WC_SECRET()}`).update(String(orderId)).digest('hex');

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const money = (n: number) => (Math.round(n * 100) / 100).toFixed(2);

/* --------------------------------- Catalog -------------------------------- */

async function catalog() {
  const deadline = Date.now() + CATALOG_DEADLINE_MS;

  // Same query the site always made: first 100 products, WooCommerce default status filter.
  const [products, categories] = await Promise.all([
    wc('/products', { params: { per_page: '100', _fields: PRODUCT_FIELDS } }),
    wc('/products/categories', { params: { per_page: '100', _fields: CATEGORY_FIELDS } }).catch(() => null),
  ]);
  if (!Array.isArray(products)) throw new UpstreamError('Unexpected products response');

  const variable = products.filter(hasVariations);
  const variations: Record<string, any[]> = {};
  await pool(variable, VARIATION_CONCURRENCY, deadline, async (p: any) => {
    const list = await wc(`/products/${p.id}/variations`, {
      params: { per_page: '50', _fields: VARIATION_FIELDS },
      timeoutMs: Math.min(REQUEST_TIMEOUT_MS, Math.max(1000, deadline - Date.now())),
    });
    if (Array.isArray(list)) variations[String(p.id)] = list;
  });

  const complete = variable.every((p: any) => variations[String(p.id)]) && Array.isArray(categories);
  return { products, variations, categories: Array.isArray(categories) ? categories : null, complete };
}

async function handleCatalog() {
  try {
    const data = await catalog();
    // A complete catalog is cached at Netlify's CDN for 2 minutes and served stale while it
    // refreshes, so WooCommerce sees about one catalog load per 2 minutes instead of ~100
    // requests per visitor. A partial one is cached only briefly.
    const cdn = data.complete
      ? 'public, durable, s-maxage=120, stale-while-revalidate=600'
      : 'public, s-maxage=15';
    return json(data, 200, { 'Cache-Control': 'public, max-age=0, must-revalidate', 'Netlify-CDN-Cache-Control': cdn });
  } catch (err) {
    console.error('catalog failed:', (err as Error).message);
    return fail(502, 'Products are temporarily unavailable.');
  }
}

/* ---------------------------------- Order --------------------------------- */

interface OrderItemIn {
  productId: string;
  selectedWeight?: string;
  quantity: number;
  unitPrice: number;
}

async function handleOrder(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return fail(400, 'Invalid request.');
  }

  const items: OrderItemIn[] = Array.isArray(body?.items) ? body.items : [];
  if (items.length === 0 || items.length > 50) return fail(400, 'Your cart is empty.');
  for (const it of items) {
    if (!/^\d+$/.test(String(it?.productId)) || !Number.isInteger(it?.quantity) || it.quantity < 1 || it.quantity > 100 || typeof it.unitPrice !== 'number') {
      return fail(400, 'Invalid cart item.');
    }
  }

  const payment = body?.paymentMethod === 'cash_on_delivery' ? 'cash_on_delivery' : body?.paymentMethod === 'interac_etransfer' ? 'interac_etransfer' : null;
  if (!payment) return fail(400, 'Invalid payment method.');

  const c = body?.customer || {};
  const s = body?.shipping || {};
  const customer = {
    first_name: str(c.firstName, 80), last_name: str(c.lastName, 80),
    email: str(c.email, 120), phone: str(c.phone, 40),
  };
  const address = {
    address_1: str(s.addressLine1), address_2: str(s.addressLine2),
    city: str(s.city, 80), state: str(s.province, 40), postcode: str(s.postalCode, 12),
  };
  if (!customer.first_name || !customer.email || !customer.phone || !address.address_1 || !address.postcode) {
    return fail(400, 'Please complete your contact and delivery details.');
  }

  // Live product data, fresh (not the cached catalog), so prices are current.
  const ids = [...new Set(items.map(i => String(i.productId)))];
  let rawProducts: any[];
  try {
    rawProducts = await wc('/products', { timeoutMs: 12000, params: { include: ids.join(','), per_page: String(ids.length), _fields: PRODUCT_FIELDS } });
  } catch (err) {
    console.error('order: product lookup failed:', (err as Error).message);
    return fail(503, 'We could not reach the store to confirm prices. Please try again in a minute.');
  }
  const byId = new Map<string, any>((Array.isArray(rawProducts) ? rawProducts : []).map(p => [String(p.id), p]));

  const variationsById: Record<string, any[]> = {};
  try {
    await Promise.all(
      ids.filter(id => byId.get(id) && hasVariations(byId.get(id))).map(async id => {
        variationsById[id] = await wc(`/products/${id}/variations`, { timeoutMs: 12000, params: { per_page: '50', _fields: VARIATION_FIELDS } });
      })
    );
  } catch (err) {
    console.error('order: variation lookup failed:', (err as Error).message);
    return fail(503, 'We could not reach the store to confirm prices. Please try again in a minute.');
  }

  // Recompute every line with the same code the site uses to display prices.
  const lineItems: any[] = [];
  let subtotal = 0;
  for (const it of items) {
    const raw = byId.get(String(it.productId));
    if (!raw) return fail(409, 'An item in your cart is no longer available. Please remove it and try again.');
    const product = buildProduct(raw, variationsById[String(it.productId)]);
    const { weightLabel, weightOpt, unitPrice } = resolveCartLine(product, it.selectedWeight);

    if (Math.abs(unitPrice - it.unitPrice) > 0.005) {
      return fail(409, `The price of ${product.name} (${weightLabel}) has changed. Please remove it from your cart and add it again.`);
    }

    const lineTotal = unitPrice * it.quantity;
    subtotal += lineTotal;
    const line: any = {
      product_id: Number(it.productId),
      quantity: it.quantity,
      subtotal: money(lineTotal),
      total: money(lineTotal),
    };
    if (weightOpt?.id !== undefined && weightOpt?.id !== null) line.variation_id = Number(weightOpt.id);
    if (it.selectedWeight) line.meta_data = [{ key: 'Weight', value: it.selectedWeight }];
    lineItems.push(line);
  }

  const deliveryFee = calculateDeliveryFee(subtotal);
  const isInterac = payment === 'interac_etransfer';

  let created: any;
  try {
    created = await wc('/orders', {
      method: 'POST',
      timeoutMs: 20000,
      body: {
        payment_method: payment,
        payment_method_title: isInterac ? 'Interac E-Transfer' : 'Cash On Delivery',
        status: 'pending',
        set_paid: false,
        billing: { ...customer, ...address },
        shipping: { first_name: customer.first_name, last_name: customer.last_name, ...address },
        line_items: lineItems,
        shipping_lines: deliveryFee > 0
          ? [{ method_id: 'flat_rate', method_title: 'Local Delivery', total: money(deliveryFee) }]
          : [],
      },
    });
  } catch (err) {
    console.error('order: create failed:', (err as Error).message);
    return fail(502, 'We could not confirm your order. Please call or text dispatch before trying again, so you are not charged twice.');
  }

  const orderId = created?.id;
  if (!orderId) return fail(502, 'We could not confirm your order. Please call or text dispatch before trying again, so you are not charged twice.');

  // pending -> processing fires WooCommerce's admin and customer emails (as before).
  try {
    // Order timing budget (Netlify limit 60 s): lookups 12 + 12, create 20, this 8 = 52 s max.
    await wc(`/orders/${orderId}`, { method: 'PUT', timeoutMs: 8000, body: { status: 'processing' } });
  } catch (err) {
    console.warn('order: status transition failed:', (err as Error).message);
  }

  return json({
    id: String(orderId),
    orderNumber: `EB-${orderId}`,
    status: 'processing',
    token: orderToken(orderId),
    subtotal: Number(money(subtotal)),
    deliveryFee,
    total: Number(money(subtotal + deliveryFee)),
    wooTotal: created?.total ?? null,
  });
}

async function handleOrderStatus(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return fail(400, 'Invalid request.');
  }
  const id = String(body?.orderId || '');
  const token = String(body?.token || '');
  if (!/^\d+$/.test(id) || !/^[a-f0-9]{64}$/.test(token)) return fail(400, 'Invalid request.');

  const expected = Buffer.from(orderToken(id), 'hex');
  if (!timingSafeEqual(expected, Buffer.from(token, 'hex'))) return fail(403, 'Not allowed.');

  try {
    await wc(`/orders/${id}`, { method: 'PUT', body: { status: 'payment-sent' } });
    return json({ ok: true });
  } catch (err) {
    console.error('order-status failed:', (err as Error).message);
    return fail(502, 'Could not update the order.');
  }
}

/* --------------------------------- Router --------------------------------- */

export default async (req: Request) => {
  const path = new URL(req.url).pathname.replace(/\/+$/, '');

  if (path === '/api/catalog' && req.method === 'GET') return handleCatalog();
  if (path === '/api/order' && req.method === 'POST') return handleOrder(req);
  if (path === '/api/order-status' && req.method === 'POST') return handleOrderStatus(req);

  return fail(404, 'Not found.');
};
