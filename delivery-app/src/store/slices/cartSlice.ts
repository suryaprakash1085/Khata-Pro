import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartState, CartItem } from '../../types';

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  restaurantId: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<{ item: CartItem; restaurantId: string }>) => {
      const { item, restaurantId } = action.payload;
      const existingItem = state.items.find(
        (i) => i.id === item.id && i.restaurantId === restaurantId
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...item,
          quantity: 1,
          restaurantId,
        });
      }

      // state.totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.totalItems = state.items.reduce(
  (sum: number, i: CartItem) => sum + i.quantity,
  0
);
      // state.totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      state.totalPrice = state.items.reduce(
  (sum: number, i: CartItem) => sum + i.price * i.quantity,
  0
);
      state.restaurantId = restaurantId;
    },
    removeItem: (state, action: PayloadAction<{ itemId: string; restaurantId: string }>) => {
      const { itemId, restaurantId } = action.payload;
      state.items = state.items.filter(
        (i) => !(i.id === itemId && i.restaurantId === restaurantId)
      );
      state.totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      if (state.items.length === 0) {
        state.restaurantId = null;
      }
    },
    updateQuantity: (state, action: PayloadAction<{ itemId: string; restaurantId: string; quantity: number }>) => {
      const { itemId, restaurantId, quantity } = action.payload;
      const item = state.items.find(
        (i) => i.id === itemId && i.restaurantId === restaurantId
      );
      if (item) {
        item.quantity = Math.max(0, quantity);
        if (item.quantity === 0) {
          state.items = state.items.filter(
            (i) => !(i.id === itemId && i.restaurantId === restaurantId)
          );
        }
      }
      state.totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      if (state.items.length === 0) {
        state.restaurantId = null;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      state.restaurantId = null;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;