import api from './api';
import { User } from '../types';

interface LoginResponse {
  user: User;
  token: string;
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
   */
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Register a new user account.
   */
  register: async (userData: RegisterData): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/register', userData);
    return response.data;
  },

  /**
   * Log out the current user and clear the session.
   */
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  /**
   * Request a password reset email.
   */
  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },

  /**
   * Reset the user's password using a token.
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, newPassword });
  },

  /**
   * Fetch the currently authenticated user's profile.
   */
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },
};
