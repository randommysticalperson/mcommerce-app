import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Product, Category } from '../../types';
import { productService } from '../../services/productService';

interface ProductsState {
  products: Product[];
  featuredProducts: Product[];
  categories: Category[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  searchResults: Product[];
  searchQuery: string;
  page: number;
  hasMore: boolean;
}

const initialState: ProductsState = {
  products: [],
  featuredProducts: [],
  categories: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  searchResults: [],
  searchQuery: '',
  page: 1,
  hasMore: true,
};

// Async Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params: { page?: number; category?: string } = {}, { rejectWithValue }) => {
    try {
      return await productService.getProducts(params);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      return await productService.getFeaturedProducts();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await productService.getCategories();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (productId: string, { rejectWithValue }) => {
    try {
      return await productService.getProductById(productId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/search',
  async (query: string, { rejectWithValue }) => {
    try {
      return await productService.searchProducts(query);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      });
  },
});

export const { setSearchQuery, clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
