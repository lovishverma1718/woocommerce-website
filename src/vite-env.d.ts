/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WOOCOMMERCE_API_URL: string;
  readonly VITE_WOOCOMMERCE_CONSUMER_KEY: string;
  readonly VITE_WOOCOMMERCE_CONSUMER_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
