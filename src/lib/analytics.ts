/**
 * Google Analytics 4 helpers. GA4 loads only when GA4_MEASUREMENT_ID is set in Netlify
 * (see scripts/prerender.mjs). Without it every function here does nothing, and a tracking
 * error can never break the page.
 */
type Gtag = (...args: unknown[]) => void;

function gtag(...args: unknown[]) {
  try {
    const fn = (window as unknown as { gtag?: Gtag }).gtag;
    if (typeof fn === 'function') fn(...args);
  } catch {
    // Analytics must never affect the site.
  }
}

/** Page view for client side route changes (the first page view is sent by the GA4 snippet). */
export function trackPageView(path: string) {
  gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/** Completed order (GA4 "purchase" key event). */
export function trackPurchase(order: { id: string; total: number; items: { productId: string; name: string; quantity: number; price: number; variant?: string }[] }) {
  gtag('event', 'purchase', {
    transaction_id: order.id,
    currency: 'CAD',
    value: order.total,
    items: order.items.map(i => ({
      item_id: i.productId,
      item_name: i.name,
      item_variant: i.variant,
      quantity: i.quantity,
      price: i.price,
    })),
  });
}

/** Phone call and text clicks anywhere on the site (tel: and sms: links). */
export function installContactClickTracking() {
  document.addEventListener(
    'click',
    (e) => {
      const link = (e.target as Element | null)?.closest?.('a[href^="tel:"], a[href^="sms:"]');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      gtag('event', href.startsWith('sms:') ? 'text_click' : 'phone_call_click', { link_url: href });
    },
    { capture: true, passive: true }
  );
}
