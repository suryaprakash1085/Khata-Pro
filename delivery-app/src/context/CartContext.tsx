
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  restaurantId: string;
  restaurantName: string;
  gst_rate?: number; // ✅ Added GST rate support
}

interface Restaurant {
  id: string;
  name: string;
}

interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (item: CartItem, restaurant: Restaurant) => void;
  removeFromCart: (itemId: string, restaurantId: string) => void;
  updateQuantity: (itemId: string, restaurantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  refreshCart: () => Promise<void>;
  isLoading: boolean;
  forceRefresh: () => Promise<void>;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getTotalPrice: () => 0,
  getTotalItems: () => 0,
  refreshCart: async () => {},
  isLoading: true,
  forceRefresh: async () => {},
});

interface CartProviderProps {
  children: ReactNode;
}

// export function CartProvider({ children }: CartProviderProps):Element {
export function CartProvider({ children }: CartProviderProps): React.ReactElement {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('🔄 CartProvider mounted - loading cart...');
    loadCart();
  }, []);

  const loadCart = async (): Promise<void> => {
    try {
      console.log('🔄 Loading cart from AsyncStorage...');
      const savedCart = await AsyncStorage.getItem('cartItems');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        setCartItems(parsed);
        console.log('✅ Cart loaded successfully:', parsed.length, 'items');
      } else {
        console.log('📦 No cart found in storage');
        setCartItems([]);
      }
    } catch (error) {
      console.error('❌ Failed to load cart:', error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCart = async (): Promise<void> => {
    console.log('🔄 Refreshing cart...');
    await loadCart();
  };

  const forceRefresh = async (): Promise<void> => {
    console.log('🔄 Force refreshing cart...');
    setIsLoading(true);
    await loadCart();
  };

  const saveCart = async (items: CartItem[]): Promise<void> => {
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(items));
      console.log('💾 Cart saved to storage:', items.length, 'items');
    } catch (error) {
      console.error('❌ Failed to save cart:', error);
    }
  };

  // ✅ FIXED: Add to cart WITHOUT clearing previous items
  const addToCart = (item: CartItem, restaurant: Restaurant): void => {
    console.log('➕ Adding to cart:', item.name, 'from restaurant:', restaurant.name);
    
    setCartItems(prevItems => {
      let newItems: CartItem[];
      
      // Check if item already exists in cart (by id AND restaurantId)
      const existingItemIndex = prevItems.findIndex(
        i => i.id === item.id && i.restaurantId === restaurant.id
      );

      if (existingItemIndex !== -1) {
        // ✅ Item exists, update quantity
        console.log('📦 Item already in cart, updating quantity');
        newItems = prevItems.map((i, index) =>
          index === existingItemIndex
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        // ✅ Item doesn't exist, add new item (keep all existing items)
        console.log('🆕 New item, adding to cart');
        newItems = [
          ...prevItems,
          {
            ...item,
            quantity: 1,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            gst_rate: item.gst_rate || 0, // ✅ Store GST rate
          }
        ];
      }
      
      saveCart(newItems);
      return newItems;
    });
  };

  const removeFromCart = (itemId: string, restaurantId: string): void => {
    console.log('➖ Removing from cart:', itemId);
    setCartItems(prevItems => {
      const newItems = prevItems.filter(
        i => !(i.id === itemId && i.restaurantId === restaurantId)
      );
      saveCart(newItems);
      return newItems;
    });
  };

  const updateQuantity = (itemId: string, restaurantId: string, quantity: number): void => {
    console.log('🔄 Updating quantity:', itemId, quantity);
    setCartItems(prevItems => {
      const newItems = prevItems.map(i =>
        i.id === itemId && i.restaurantId === restaurantId
          ? { ...i, quantity: Math.max(0, quantity) }
          : i
      ).filter(i => i.quantity > 0);
      saveCart(newItems);
      return newItems;
    });
  };

  const clearCart = (): void => {
    console.log('🗑️ Clearing cart');
    setCartItems([]);
    saveCart([]);
  };

  const getTotalPrice = (): number => {
    const total = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    return total;
  };

  const getTotalItems = (): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate totalItems and totalPrice from cartItems
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <CartContext.Provider value={{
      cartItems,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems,
      refreshCart,
      isLoading,
      forceRefresh,
    }}>
      {children}
    </CartContext.Provider>
  );
}