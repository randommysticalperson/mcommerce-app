import api from './api';
import { Product, Category, PaginatedResponse } from '../types';

export const productService = {
  /**
   * Fetch a paginated list of products, optionally filtered by category.
   */
  getProducts: async (params: {
    page?: number;
    limit?: number;
    category?: string;
    sortBy?: string;
  } = {}): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>('/products', {
      params: { page: 1, limit: 20, ...params },
    });
    return response.data;
  },

  /**
   * Fetch a curated list of featured products for the home screen.
   */
  getFeaturedProducts: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/featured');
    return response.data;
  },

  /**
   * Fetch a single product by its ID.
   */
  getProductById: async (productId: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${productId}`);
    return response.data;
  },

  /**
   * Fetch all available product categories.
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  /**
   * Search products by a text query.
   */
  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/search', {
      params: { q: query },
    });
    return response.data;
  },

  /**
   * Fetch products belonging to a specific vendor.
   */
  getVendorProducts: async (vendorId: string): Promise<Product[]> => {
    const response = await api.get<Product[]>(`/vendors/${vendorId}/products`);
    return response.data;
  },
};
