import axios from 'axios';

// Replace with your actual backend API URL
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.mcommerce.terrasept.com/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor — Attach auth token
api.interceptors.request.use(
  (config) => {
    // Token will be injected from SecureStore in a real implementation
    // import * as SecureStore from 'expo-secure-store';
    // const token = await SecureStore.getItemAsync('auth_token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor — Handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized — dispatch logout action
      console.warn('Unauthorized. Redirecting to login...');
    }
    return Promise.reject(
      error.response?.data?.message || error.message || 'An error occurred'
    );
  }
);

export default api;
