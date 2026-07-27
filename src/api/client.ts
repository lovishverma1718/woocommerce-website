import axios from 'axios';

const WOOCOMMERCE_URL = (import.meta.env.VITE_WOOCOMMERCE_API_URL || '/wp-json/wc/v3').replace(/\/+$/, '');
const CK = (import.meta.env.VITE_WOOCOMMERCE_CONSUMER_KEY || '').trim();
const CS = (import.meta.env.VITE_WOOCOMMERCE_CONSUMER_SECRET || '').trim();

export const isLiveApiConfigured = Boolean(WOOCOMMERCE_URL);

// Create Basic Auth token if keys are present
const basicAuthHeader = (CK && CS) 
  ? `Basic ${btoa(`${CK}:${CS}`)}`
  : undefined;

const headers: Record<string, string> = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

if (basicAuthHeader) {
  headers['Authorization'] = basicAuthHeader;
}

const params: Record<string, string> = {};
if (CK) params['consumer_key'] = CK;
if (CS) params['consumer_secret'] = CS;

export const apiClient = axios.create({
  baseURL: WOOCOMMERCE_URL,
  timeout: 15000,
  headers,
  params: Object.keys(params).length > 0 ? params : undefined,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('WooCommerce REST API Warning:', error.message);
    return Promise.reject(error);
  }
);
