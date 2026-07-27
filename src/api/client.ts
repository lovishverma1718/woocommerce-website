import axios from 'axios';

const WOOCOMMERCE_URL = import.meta.env.VITE_WOOCOMMERCE_API_URL || '/wp-json/wc/v3';
const CK = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_KEY || '';
const CS = import.meta.env.VITE_WOOCOMMERCE_CONSUMER_SECRET || '';

export const isLiveApiConfigured = Boolean(WOOCOMMERCE_URL && CK && CS);

export const apiClient = axios.create({
  baseURL: WOOCOMMERCE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  params: {
    consumer_key: CK,
    consumer_secret: CS,
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('WooCommerce REST API Warning:', error.message);
    return Promise.reject(error);
  }
);
