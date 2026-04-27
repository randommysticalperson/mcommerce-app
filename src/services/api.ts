/**
 * Base API Service
 * ────────────────
 * Automatically switches between:
 *   - Mock server (http://localhost:3001) when EXPO_PUBLIC_APP_ENV=mock
 *   - Real backend (EXPO_PUBLIC_API_BASE_URL) in production/staging
 *
 * No code changes needed to switch environments — just change .env
 */

import axios, { AxiosInstance } from 'axios';

const IS_MOCK =
  process.env.EXPO_PUBLIC_APP_ENV === 'mock' ||
  process.env.APP_ENV === 'mock';

const REAL_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  'https://api.mcommerce.terrasept.com/v1';

const MOCK_BASE_URL =
  process.env.EXPO_PUBLIC_MOCK_API_URL || 'http://localhost:3001';

const BASE_URL = IS_MOCK ? MOCK_BASE_URL : REAL_BASE_URL;

if (__DEV__) {
  console.log(`[API] Mode: ${IS_MOCK ? 'MOCK' : 'REAL'} → ${BASE_URL}`);
}

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor — Attach auth token ───────────────────────────────────
api.interceptors.request.use(
  async (config) => {
    try {
      if (IS_MOCK) {
        // In mock mode, token is stored in a simple in-memory map
        const { mockSecureStore } = await import('./mockInterceptor');
        const token = await mockSecureStore.getItem('auth_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
      } else {
        // In production, use Expo SecureStore
        // const SecureStore = await import('expo-secure-store');
        // const token = await SecureStore.getItemAsync('auth_token');
        // if (token) config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (_) {
      // Silently fail — request proceeds without auth header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor — Handle global errors ───────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('[API] 401 Unauthorized — token may have expired');
    }
    return Promise.reject(
      error.response?.data?.message || error.message || 'An error occurred'
    );
  }
);

export default api;
