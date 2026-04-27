// ============================================================
// Core Domain Types
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'buyer' | 'vendor' | 'admin';
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: 'KES' | 'USD';
  images: string[];
  category: Category;
  vendorId: string;
  vendorName: string;
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  parentId?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  currency: 'KES' | 'USD';
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  currency: 'KES' | 'USD';
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: Address;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'mpesa' | 'card' | 'cash_on_delivery';

export interface Address {
  street: string;
  city: string;
  county: string;
  country: string;
  postalCode?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// ============================================================
// Navigation Types
// ============================================================

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  ProductDetail: { productId: string };
  CategoryProducts: { categoryId: string; categoryName: string };
  VendorProfile: { vendorId: string };
};

export type CartStackParamList = {
  CartScreen: undefined;
  Checkout: undefined;
  OrderConfirmation: { orderId: string };
};

export type OrderStackParamList = {
  OrderList: undefined;
  OrderDetail: { orderId: string };
};

// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
