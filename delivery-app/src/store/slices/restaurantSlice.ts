import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RestaurantState, Restaurant, Category } from '../../types';

const initialState: RestaurantState = {
  restaurants: [],
  categories: [],
  selectedRestaurant: null,
  loading: false,
  error: null,
};

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setRestaurants: (state, action: PayloadAction<Restaurant[]>) => {
      state.restaurants = action.payload;
      state.loading = false;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setSelectedRestaurant: (state, action: PayloadAction<Restaurant | null>) => {
      state.selectedRestaurant = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setRestaurants,
  setCategories,
  setSelectedRestaurant,
  setError,
  clearError,
} = restaurantSlice.actions;

export default restaurantSlice.reducer;