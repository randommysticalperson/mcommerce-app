import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '../../types';

interface CartState {
  items: CartItem[];
  total: number;
  currency: 'KES' | 'USD';
}

const initialState: CartState = {
  items: [],
  total: 0,
  currency: 'KES',
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
      state.total = calculateTotal(state.items);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload
      );
      state.total = calculateTotal(state.items);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) => item.product.id === action.payload.productId
      );
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            (i) => i.product.id !== action.payload.productId
          );
        } else {
          item.quantity = action.payload.quantity;
        }
      }
      state.total = calculateTotal(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },

    setCurrency: (state, action: PayloadAction<'KES' | 'USD'>) => {
      state.currency = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCurrency } =
  cartSlice.actions;
export default cartSlice.reducer;
