import { useEffect, useState } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { MOCK_FAQS } from '../api/mockData';

/**
 * Static pages arrive prerendered (scripts/prerender.mjs) and main.tsx hydrates them. The first
 * client render must match the static HTML exactly, otherwise React throws it away and renders
 * from scratch, and anything that differs becomes a visible glitch. So during that first mount
 * components render exactly what the static HTML shows. Later mounts (client side navigation)
 * behave as normal.
 *
 * True during SSR, so the static HTML is rendered in its final, visible state.
 */
export let isFirstPrerenderedLoad: boolean = import.meta.env.SSR;

/** Called once in main.tsx, before hydrateRoot. */
export function setFirstPrerenderedLoad(value: boolean) {
  isFirstPrerenderedLoad = value;
}

/** Called by App once its first commit has painted. */
export function endFirstPrerenderedLoad() {
  isFirstPrerenderedLoad = false;
}

/**
 * True if this component mounted as part of taking over a prerendered page.
 * The value is fixed for the component's lifetime.
 *
 * Use it to skip entrance animations: initial={isFirst ? false : { opacity: 0 }}
 */
export function useFirstPrerenderedLoad(): boolean {
  const [isFirst] = useState(() => import.meta.env.SSR || isFirstPrerenderedLoad);
  return isFirst;
}

/**
 * False during SSR and the first prerendered mount, true right after.
 * For UI that depends on the browser (localStorage, the visitor's clock), which the static
 * HTML cannot know: render nothing until this is true, so it appears instead of changing.
 */
export function useClientReady(): boolean {
  const isFirst = useFirstPrerenderedLoad();
  const [ready, setReady] = useState(!isFirst);
  useEffect(() => {
    if (!ready) setReady(true);
  }, [ready]);
  return ready;
}

/**
 * Query data that is static site content (not from WooCommerce). Seeded the same way at build
 * time (entry-server.tsx) and in the browser (App.tsx), so both renders show the same content.
 */
export function seedStaticQueryData(queryClient: QueryClient) {
  queryClient.setQueryData(['faqs'], MOCK_FAQS);
}
