/**
 * Auth Service
 * ────────────
 * Handles login, register, logout, and token management.
 * Works in both mock mode (local server) and production (real backend).
 *
 * Mock credentials:
 *   Email:    michael@terrasept.com
 *   Password: password123
 */

import api from './api';
import { User } from '../types';
import { isMockMode, mockSecureStore } from './mockInterceptor';

const IS_MOCK = isMockMode();
const TOKEN_KEY = 'auth_token';

// ── Token Storage ─────────────────────────────────────────────────────────────

const saveToken = async (token: string): Promise<void> => {
  if (IS_MOCK) {
    await mockSecureStore.setItem(TOKEN_KEY, token);
  }
  // Production: await SecureStore.setItemAsync(TOKEN_KEY, token);
};

const getToken = async (): Promise<string | null> => {
  if (IS_MOCK) return mockSecureStore.getItem(TOKEN_KEY);
  // Production: return SecureStore.getItemAsync(TOKEN_KEY);
  return null;
};

const deleteToken = async (): Promise<void> => {
  if (IS_MOCK) {
    await mockSecureStore.deleteItem(TOKEN_KEY);
  }
  // Production: await SecureStore.deleteItemAsync(TOKEN_KEY);
};

// ── Auth API ──────────────────────────────────────────────────────────────────

interface LoginResponse {
  success: boolean;
  user: User;
  token: string;
  expiresIn?: string;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export const authService = {
  /**
   * Authenticate a user with email and password.
   * Mock credentials: michael@terrasept.com / password123
   */
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    const data = response.data;
    if (data.success && data.token) {
      await saveToken(data.token);
      if (__DEV__) console.log('[Auth] Login:', data.user.email);
    }
    return data;
  },

  /**
   * Register a new user account.
   */
  register: async (userData: RegisterData): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/register', userData);
    const data = response.data;
    if (data.success && data.token) {
      await saveToken(data.token);
      if (__DEV__) console.log('[Auth] Register:', data.user.email);
    }
    return data;
  },

  /**
   * Log out the current user and clear the stored token.
   */
  logout: async (): Promise<void> => {
    await deleteToken();
    if (__DEV__) console.log('[Auth] Logged out');
  },

  /**
   * Fetch the currently authenticated user's profile.
   */
  getProfile: async (): Promise<User> => {
    const response = await api.get<{ success: boolean; user: User }>('/auth/me');
    return response.data.user;
  },

  /**
   * Check if a user is currently authenticated.
   */
  isAuthenticated: async (): Promise<boolean> => {
    const token = await getToken();
    return !!token;
  },

  /**
   * Request a password reset email. (Mock: always succeeds)
   */
  forgotPassword: async (email: string): Promise<void> => {
    if (IS_MOCK) {
      if (__DEV__) console.log('[Auth] Mock: password reset email sent to', email);
      return;
    }
    await api.post('/auth/forgot-password', { email });
  },

  /**
   * Reset the user's password using a token.
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    if (IS_MOCK) {
      if (__DEV__) console.log('[Auth] Mock: password reset for token', token);
      return;
    }
    await api.post('/auth/reset-password', { token, newPassword });
  },
};
