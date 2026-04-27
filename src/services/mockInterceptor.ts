/**
 * Mock API Interceptor
 * ────────────────────
 * When APP_ENV=mock, this interceptor routes all Axios requests
 * to the local mock server instead of real external APIs.
 *
 * This means:
 *  - No M-Pesa consumer key/secret needed
 *  - No Stripe publishable key needed
 *  - No backend server needed
 *  - Works fully offline
 */

import axios, { AxiosInstance } from "axios";

const IS_MOCK = process.env.APP_ENV === "mock" || process.env.EXPO_PUBLIC_APP_ENV === "mock";

export const MOCK_BASE_URL = process.env.EXPO_PUBLIC_MOCK_API_URL || "http://localhost:3001";

/**
 * Creates an Axios instance pre-configured for the mock server.
 * Used in development when APP_ENV=mock.
 */
export const createMockApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: MOCK_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor — log all mock requests
  client.interceptors.request.use((config) => {
    if (__DEV__) {
      console.log(`[MOCK API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  });

  // Response interceptor — normalize mock responses
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (__DEV__) {
        console.warn("[MOCK API] Error:", error.response?.data || error.message);
      }
      return Promise.reject(error);
    }
  );

  return client;
};

/**
 * Returns true if the app is running in mock mode.
 * Use this to conditionally skip real API calls.
 */
export const isMockMode = (): boolean => IS_MOCK;

/**
 * Mock token storage — simulates Expo SecureStore in mock mode.
 * In production, use Expo SecureStore instead.
 */
const mockTokenStore: Record<string, string> = {};

export const mockSecureStore = {
  setItem: async (key: string, value: string): Promise<void> => {
    mockTokenStore[key] = value;
  },
  getItem: async (key: string): Promise<string | null> => {
    return mockTokenStore[key] || null;
  },
  deleteItem: async (key: string): Promise<void> => {
    delete mockTokenStore[key];
  },
};
