import axios from 'axios';

/**
 * The browser only talks to EliteBud's own server side API (netlify/functions/api.mts).
 * WooCommerce keys stay on the server and are never part of this bundle.
 */
export const isLiveApiConfigured = true;

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('Store API Warning:', error.message);
    return Promise.reject(error);
  }
);
