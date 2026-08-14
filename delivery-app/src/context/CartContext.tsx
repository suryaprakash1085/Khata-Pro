// // // // import React, { createContext, useState, useEffect, ReactNode } from 'react';
// // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // import { CartItem, Restaurant } from '../types';

// // // // interface CartContextType {
// // // //   cartItems: CartItem[];
// // // //   addToCart: (item: CartItem, restaurant: Restaurant) => void;
// // // //   removeFromCart: (itemId: string, restaurantId: string) => void;
// // // //   updateQuantity: (itemId: string, restaurantId: string, quantity: number) => void;
// // // //   clearCart: () => void;
// // // //   getTotalPrice: () => number;
// // // //   getTotalItems: () => number;
// // // // }

// // // // export const CartContext = createContext<CartContextType>({
// // // //   cartItems: [],
// // // //   addToCart: () => {},
// // // //   removeFromCart: () => {},
// // // //   updateQuantity: () => {},
// // // //   clearCart: () => {},
// // // //   getTotalPrice: () => 0,
// // // //   getTotalItems: () => 0,
// // // // });

// // // // interface CartProviderProps {
// // // //   children: ReactNode;
// // // // }

// // // // // export function CartProvider({ children }: CartProviderProps): JSX.Element {
// // // // export function CartProvider({ children }: CartProviderProps) {
// // // //   const [cartItems, setCartItems] = useState<CartItem[]>([]);

// // // //   useEffect(() => {
// // // //     loadCart();
// // // //   }, []);

// // // //   const loadCart = async (): Promise<void> => {
// // // //     try {
// // // //       const savedCart = await AsyncStorage.getItem('cartItems');
// // // //       if (savedCart) {
// // // //         setCartItems(JSON.parse(savedCart));
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('Failed to load cart:', error);
// // // //     }
// // // //   };

// // // //   const saveCart = async (items: CartItem[]): Promise<void> => {
// // // //     try {
// // // //       await AsyncStorage.setItem('cartItems', JSON.stringify(items));
// // // //     } catch (error) {
// // // //       console.error('Failed to save cart:', error);
// // // //     }
// // // //   };

// // // //   const addToCart = (item: CartItem, restaurant: Restaurant): void => {
// // // //     setCartItems(prevItems => {
// // // //       const existingItem = prevItems.find(i => i.id === item.id && i.restaurantId === restaurant.id);
// // // //       let newItems: CartItem[];
// // // //       if (existingItem) {
// // // //         newItems = prevItems.map(i =>
// // // //           i.id === item.id && i.restaurantId === restaurant.id 
// // // //             ? { ...i, quantity: i.quantity + 1 } 
// // // //             : i
// // // //         );
// // // //       } else {
// // // //         newItems = [...prevItems, { 
// // // //           ...item, 
// // // //           quantity: 1, 
// // // //           restaurantId: restaurant.id,
// // // //           restaurantName: restaurant.name 
// // // //         }];
// // // //       }
// // // //       saveCart(newItems);
// // // //       return newItems;
// // // //     });
// // // //   };

// // // //   const removeFromCart = (itemId: string, restaurantId: string): void => {
// // // //     setCartItems(prevItems => {
// // // //       const newItems = prevItems.filter(i => 
// // // //         !(i.id === itemId && i.restaurantId === restaurantId)
// // // //       );
// // // //       saveCart(newItems);
// // // //       return newItems;
// // // //     });
// // // //   };

// // // //   const updateQuantity = (itemId: string, restaurantId: string, quantity: number): void => {
// // // //     setCartItems(prevItems => {
// // // //       const newItems = prevItems.map(i =>
// // // //         i.id === itemId && i.restaurantId === restaurantId 
// // // //           ? { ...i, quantity: Math.max(0, quantity) } 
// // // //           : i
// // // //       ).filter(i => i.quantity > 0);
// // // //       saveCart(newItems);
// // // //       return newItems;
// // // //     });
// // // //   };

// // // //   const clearCart = (): void => {
// // // //     setCartItems([]);
// // // //     saveCart([]);
// // // //   };

// // // //   const getTotalPrice = (): number => {
// // // //     return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
// // // //   };

// // // //   const getTotalItems = (): number => {
// // // //     return cartItems.reduce((total, item) => total + item.quantity, 0);
// // // //   };

// // // //   return (
// // // //     <CartContext.Provider value={{
// // // //       cartItems,
// // // //       addToCart,
// // // //       removeFromCart,
// // // //       updateQuantity,
// // // //       clearCart,
// // // //       getTotalPrice,
// // // //       getTotalItems,
      
// // // //     }}>
// // // //       {children}
// // // //     </CartContext.Provider>
// // // //   );
// // // // }
// // // import React, { createContext, useState, useEffect, ReactNode } from 'react';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';

// // // interface CartItem {
// // //   id: number;
// // //   name: string;
// // //   price: number;
// // //   quantity: number;
// // //   image?: string;
// // //   restaurantId: number;
// // //   restaurantName: string;
// // // }

// // // interface Restaurant {
// // //   id: number;
// // //   name: string;
// // // }

// // // interface CartContextType {
// // //   cartItems: CartItem[];
// // //   addToCart: (item: CartItem, restaurant: Restaurant) => void;
// // //   removeFromCart: (itemId: number, restaurantId: number) => void;
// // //   updateQuantity: (itemId: number, restaurantId: number, quantity: number) => void;
// // //   clearCart: () => void;
// // //   getTotalPrice: () => number;
// // //   getTotalItems: () => number;
// // // }

// // // export const CartContext = createContext<CartContextType>({
// // //   cartItems: [],
// // //   addToCart: () => {},
// // //   removeFromCart: () => {},
// // //   updateQuantity: () => {},
// // //   clearCart: () => {},
// // //   getTotalPrice: () => 0,
// // //   getTotalItems: () => 0,
// // // });

// // // interface CartProviderProps {
// // //   children: ReactNode;
// // // }

// // // export function CartProvider({ children }: CartProviderProps): JSX.Element {
// // //   const [cartItems, setCartItems] = useState<CartItem[]>([]);

// // //   useEffect(() => {
// // //     loadCart();
// // //   }, []);

// // //   const loadCart = async (): Promise<void> => {
// // //     try {
// // //       const savedCart = await AsyncStorage.getItem('cartItems');
// // //       if (savedCart) {
// // //         setCartItems(JSON.parse(savedCart));
// // //       }
// // //     } catch (error) {
// // //       console.error('Failed to load cart:', error);
// // //     }
// // //   };

// // //   const saveCart = async (items: CartItem[]): Promise<void> => {
// // //     try {
// // //       await AsyncStorage.setItem('cartItems', JSON.stringify(items));
// // //     } catch (error) {
// // //       console.error('Failed to save cart:', error);
// // //     }
// // //   };

// // //   const addToCart = (item: CartItem, restaurant: Restaurant): void => {
// // //     setCartItems(prevItems => {
// // //       // Check if cart has items from different restaurant
// // //       if (prevItems.length > 0 && prevItems[0].restaurantId !== restaurant.id) {
// // //         const newItems = [{
// // //           ...item,
// // //           quantity: 1,
// // //           restaurantId: restaurant.id,
// // //           restaurantName: restaurant.name
// // //         }];
// // //         saveCart(newItems);
// // //         return newItems;
// // //       }

// // //       const existingItem = prevItems.find(
// // //         i => i.id === item.id && i.restaurantId === restaurant.id
// // //       );

// // //       let newItems: CartItem[];
// // //       if (existingItem) {
// // //         newItems = prevItems.map(i =>
// // //           i.id === item.id && i.restaurantId === restaurant.id
// // //             ? { ...i, quantity: i.quantity + 1 }
// // //             : i
// // //         );
// // //       } else {
// // //         newItems = [...prevItems, {
// // //           ...item,
// // //           quantity: 1,
// // //           restaurantId: restaurant.id,
// // //           restaurantName: restaurant.name
// // //         }];
// // //       }
// // //       saveCart(newItems);
// // //       return newItems;
// // //     });
// // //   };

// // //   const removeFromCart = (itemId: number, restaurantId: number): void => {
// // //     setCartItems(prevItems => {
// // //       const newItems = prevItems.filter(
// // //         i => !(i.id === itemId && i.restaurantId === restaurantId)
// // //       );
// // //       saveCart(newItems);
// // //       return newItems;
// // //     });
// // //   };

// // //   const updateQuantity = (itemId: number, restaurantId: number, quantity: number): void => {
// // //     setCartItems(prevItems => {
// // //       const newItems = prevItems.map(i =>
// // //         i.id === itemId && i.restaurantId === restaurantId
// // //           ? { ...i, quantity: Math.max(0, quantity) }
// // //           : i
// // //       ).filter(i => i.quantity > 0);
// // //       saveCart(newItems);
// // //       return newItems;
// // //     });
// // //   };

// // //   const clearCart = (): void => {
// // //     setCartItems([]);
// // //     saveCart([]);
// // //   };

// // //   const getTotalPrice = (): number => {
// // //     return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
// // //   };

// // //   const getTotalItems = (): number => {
// // //     return cartItems.reduce((total, item) => total + item.quantity, 0);
// // //   };

// // //   return (
// // //     <CartContext.Provider value={{
// // //       cartItems,
// // //       addToCart,
// // //       removeFromCart,
// // //       updateQuantity,
// // //       clearCart,
// // //       getTotalPrice,
// // //       getTotalItems,
// // //     }}>
// // //       {children}
// // //     </CartContext.Provider>
// // //   );
// // // }
// // // import React, { createContext, useState, useEffect, ReactNode } from 'react';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';

// // // interface CartItem {
// // //   id: number;
// // //   name: string;
// // //   price: number;
// // //   quantity: number;
// // //   image?: string;
// // //   restaurantId: number;
// // //   restaurantName: string;
// // // }

// // // interface Restaurant {
// // //   id: number;
// // //   name: string;
// // // }

// // // interface CartContextType {
// // //   cartItems: CartItem[];
// // //   addToCart: (item: CartItem, restaurant: Restaurant) => void;
// // //   removeFromCart: (itemId: number, restaurantId: number) => void;
// // //   updateQuantity: (itemId: number, restaurantId: number, quantity: number) => void;
// // //   clearCart: () => void;
// // //   getTotalPrice: () => number;
// // //   getTotalItems: () => number;
// // // }

// // // export const CartContext = createContext<CartContextType>({
// // //   cartItems: [],
// // //   addToCart: () => {},
// // //   removeFromCart: () => {},
// // //   updateQuantity: () => {},
// // //   clearCart: () => {},
// // //   getTotalPrice: () => 0,
// // //   getTotalItems: () => 0,
// // // });

// // // interface CartProviderProps {
// // //   children: ReactNode;
// // // }

// // // export function CartProvider({ children }: CartProviderProps): JSX.Element {
// // //   const [cartItems, setCartItems] = useState<CartItem[]>([]);

// // //   useEffect(() => {
// // //     loadCart();
// // //   }, []);

// // //   const loadCart = async (): Promise<void> => {
// // //     try {
// // //       const savedCart = await AsyncStorage.getItem('cartItems');
// // //       if (savedCart) {
// // //         setCartItems(JSON.parse(savedCart));
// // //       }
// // //     } catch (error) {
// // //       console.error('Failed to load cart:', error);
// // //     }
// // //   };

// // //   const saveCart = async (items: CartItem[]): Promise<void> => {
// // //     try {
// // //       await AsyncStorage.setItem('cartItems', JSON.stringify(items));
// // //     } catch (error) {
// // //       console.error('Failed to save cart:', error);
// // //     }
// // //   };

// // //   const addToCart = (item: CartItem, restaurant: Restaurant): void => {
// // //     setCartItems(prevItems => {
// // //       if (prevItems.length > 0 && prevItems[0].restaurantId !== restaurant.id) {
// // //         const newItems = [{
// // //           ...item,
// // //           quantity: 1,
// // //           restaurantId: restaurant.id,
// // //           restaurantName: restaurant.name
// // //         }];
// // //         saveCart(newItems);
// // //         return newItems;
// // //       }

// // //       const existingItem = prevItems.find(
// // //         i => i.id === item.id && i.restaurantId === restaurant.id
// // //       );

// // //       let newItems: CartItem[];
// // //       if (existingItem) {
// // //         newItems = prevItems.map(i =>
// // //           i.id === item.id && i.restaurantId === restaurant.id
// // //             ? { ...i, quantity: i.quantity + 1 }
// // //             : i
// // //         );
// // //       } else {
// // //         newItems = [...prevItems, {
// // //           ...item,
// // //           quantity: 1,
// // //           restaurantId: restaurant.id,
// // //           restaurantName: restaurant.name
// // //         }];
// // //       }
// // //       saveCart(newItems);
// // //       return newItems;
// // //     });
// // //   };

// // //   const removeFromCart = (itemId: number, restaurantId: number): void => {
// // //     setCartItems(prevItems => {
// // //       const newItems = prevItems.filter(
// // //         i => !(i.id === itemId && i.restaurantId === restaurantId)
// // //       );
// // //       saveCart(newItems);
// // //       return newItems;
// // //     });
// // //   };

// // //   const updateQuantity = (itemId: number, restaurantId: number, quantity: number): void => {
// // //     setCartItems(prevItems => {
// // //       const newItems = prevItems.map(i =>
// // //         i.id === itemId && i.restaurantId === restaurantId
// // //           ? { ...i, quantity: Math.max(0, quantity) }
// // //           : i
// // //       ).filter(i => i.quantity > 0);
// // //       saveCart(newItems);
// // //       return newItems;
// // //     });
// // //   };

// // //   const clearCart = (): void => {
// // //     setCartItems([]);
// // //     saveCart([]);
// // //   };

// // //   const getTotalPrice = (): number => {
// // //     return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
// // //   };

// // //   const getTotalItems = (): number => {
// // //     return cartItems.reduce((total, item) => total + item.quantity, 0);
// // //   };

// // //   return (
// // //     <CartContext.Provider value={{
// // //       cartItems,
// // //       addToCart,
// // //       removeFromCart,
// // //       updateQuantity,
// // //       clearCart,
// // //       getTotalPrice,
// // //       getTotalItems,
// // //     }}>
// // //       {children}
// // //     </CartContext.Provider>
// // //   );
// // // }
// // // import React, { createContext, useState, useEffect, ReactNode } from 'react';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';

// // // interface CartItem {
// // //   id: string;  // Changed to string
// // //   name: string;
// // //   price: number;
// // //   quantity: number;
// // //   image?: string;
// // //   restaurantId: string;  // Changed to string
// // //   restaurantName: string;
// // // }

// // // interface Restaurant {
// // //   id: string;  // Changed to string
// // //   name: string;
// // // }

// // // interface CartContextType {
// // //   cartItems: CartItem[];
// // //   addToCart: (item: CartItem, restaurant: Restaurant) => void;
// // //   removeFromCart: (itemId: string, restaurantId: string) => void;
// // //   updateQuantity: (itemId: string, restaurantId: string, quantity: number) => void;
// // //   clearCart: () => void;
// // //   getTotalPrice: () => number;
// // //   getTotalItems: () => number;
// // // }

// // // export const CartContext = createContext<CartContextType>({
// // //   cartItems: [],
// // //   addToCart: () => {},
// // //   removeFromCart: () => {},
// // //   updateQuantity: () => {},
// // //   clearCart: () => {},
// // //   getTotalPrice: () => 0,
// // //   getTotalItems: () => 0,
// // // });

// // // interface CartProviderProps {
// // //   children: ReactNode;
// // // }

// // // export function CartProvider({ children }: CartProviderProps): JSX.Element {
// // //   const [cartItems, setCartItems] = useState<CartItem[]>([]);

// // //   useEffect(() => {
// // //     loadCart();
// // //   }, []);

// // //   const loadCart = async (): Promise<void> => {
// // //     try {
// // //       const savedCart = await AsyncStorage.getItem('cartItems');
// // //       if (savedCart) {
// // //         setCartItems(JSON.parse(savedCart));
// // //       }
// // //     } catch (error) {
// // //       console.error('Failed to load cart:', error);
// // //     }
// // //   };

// // //   const saveCart = async (items: CartItem[]): Promise<void> => {
// // //     try {
// // //       await AsyncStorage.setItem('cartItems', JSON.stringify(items));
// // //     } catch (error) {
// // //       console.error('Failed to save cart:', error);
// // //     }
// // //   };

// // //   const addToCart = (item: CartItem, restaurant: Restaurant): void => {
// // //     setCartItems(prevItems => {
// // //       // Check if cart has items from different restaurant
// // //       if (prevItems.length > 0 && prevItems[0].restaurantId !== restaurant.id) {
// // //         const newItems = [{
// // //           ...item,
// // //           quantity: 1,
// // //           restaurantId: restaurant.id,
// // //           restaurantName: restaurant.name
// // //         }];
// // //         saveCart(newItems);
// // //         return newItems;
// // //       }

// // //       const existingItem = prevItems.find(
// // //         i => i.id === item.id && i.restaurantId === restaurant.id
// // //       );

// // //       let newItems: CartItem[];
// // //       if (existingItem) {
// // //         newItems = prevItems.map(i =>
// // //           i.id === item.id && i.restaurantId === restaurant.id
// // //             ? { ...i, quantity: i.quantity + 1 }
// // //             : i
// // //         );
// // //       } else {
// // //         newItems = [...prevItems, {
// // //           ...item,
// // //           quantity: 1,
// // //           restaurantId: restaurant.id,
// // //           restaurantName: restaurant.name
// // //         }];
// // //       }
// // //       saveCart(newItems);
// // //       return newItems;
// // //     });
// // //   };

// // //   const removeFromCart = (itemId: string, restaurantId: string): void => {
// // //     setCartItems(prevItems => {
// // //       const newItems = prevItems.filter(
// // //         i => !(i.id === itemId && i.restaurantId === restaurantId)
// // //       );
// // //       saveCart(newItems);
// // //       return newItems;
// // //     });
// // //   };

// // //   const updateQuantity = (itemId: string, restaurantId: string, quantity: number): void => {
// // //     setCartItems(prevItems => {
// // //       const newItems = prevItems.map(i =>
// // //         i.id === itemId && i.restaurantId === restaurantId
// // //           ? { ...i, quantity: Math.max(0, quantity) }
// // //           : i
// // //       ).filter(i => i.quantity > 0);
// // //       saveCart(newItems);
// // //       return newItems;
// // //     });
// // //   };

// // //   const clearCart = (): void => {
// // //     setCartItems([]);
// // //     saveCart([]);
// // //   };

// // //   const getTotalPrice = (): number => {
// // //     return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
// // //   };

// // //   const getTotalItems = (): number => {
// // //     return cartItems.reduce((total, item) => total + item.quantity, 0);
// // //   };

// // //   return (
// // //     <CartContext.Provider value={{
// // //       cartItems,
// // //       addToCart,
// // //       removeFromCart,
// // //       updateQuantity,
// // //       clearCart,
// // //       getTotalPrice,
// // //       getTotalItems,
// // //     }}>
// // //       {children}
// // //     </CartContext.Provider>
// // //   );
// // // }
// // import React, { createContext, useState, useEffect, ReactNode } from 'react';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // interface CartItem {
// //   id: string;
// //   name: string;
// //   price: number;
// //   quantity: number;
// //   image?: string;
// //   restaurantId: string;
// //   restaurantName: string;
// // }

// // interface Restaurant {
// //   id: string;
// //   name: string;
// // }

// // interface CartContextType {
// //   cartItems: CartItem[];
  
// //   addToCart: (item: CartItem, restaurant: Restaurant) => void;
// //   removeFromCart: (itemId: string, restaurantId: string) => void;
// //   updateQuantity: (itemId: string, restaurantId: string, quantity: number) => void;
// //   clearCart: () => void;
// //   getTotalPrice: () => number;
// //   getTotalItems: () => number;
// //   refreshCart: () => Promise<void>;
// //   isLoading: boolean;
// //   forceRefresh: () => Promise<void>;
// // }

// // export const CartContext = createContext<CartContextType>({
// //   cartItems: [],
// //   addToCart: () => {},
// //   removeFromCart: () => {},
// //   updateQuantity: () => {},
// //   clearCart: () => {},
// //   getTotalPrice: () => 0,
// //   getTotalItems: () => 0,
// //   refreshCart: async () => {},
// //   isLoading: true,
// //   forceRefresh: async () => {},
// // });

// // interface CartProviderProps {
// //   children: ReactNode;
// // }

// // export function CartProvider({ children }: CartProviderProps): JSX.Element {
// //   const [cartItems, setCartItems] = useState<CartItem[]>([]);
// //   const [isLoading, setIsLoading] = useState<boolean>(true);

// //   useEffect(() => {
// //     console.log('🔄 CartProvider mounted - loading cart...');
// //     loadCart();
// //   }, []);

// //   const loadCart = async (): Promise<void> => {
// //     try {
// //       console.log('🔄 Loading cart from AsyncStorage...');
// //       const savedCart = await AsyncStorage.getItem('cartItems');
// //       if (savedCart) {
// //         const parsed = JSON.parse(savedCart);
// //         setCartItems(parsed);
// //         console.log('✅ Cart loaded successfully:', parsed.length, 'items');
// //         console.log('📦 Cart items:', JSON.stringify(parsed, null, 2));
// //       } else {
// //         console.log('📦 No cart found in storage');
// //         setCartItems([]);
// //       }
// //     } catch (error) {
// //       console.error('❌ Failed to load cart:', error);
// //       setCartItems([]);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const refreshCart = async (): Promise<void> => {
// //     console.log('🔄 Refreshing cart...');
// //     await loadCart();
// //   };

// //   const forceRefresh = async (): Promise<void> => {
// //     console.log('🔄 Force refreshing cart...');
// //     setIsLoading(true);
// //     await loadCart();
// //   };

// //   const saveCart = async (items: CartItem[]): Promise<void> => {
// //     try {
// //       await AsyncStorage.setItem('cartItems', JSON.stringify(items));
// //       console.log('💾 Cart saved to storage:', items.length, 'items');
// //     } catch (error) {
// //       console.error('❌ Failed to save cart:', error);
// //     }
// //   };

// //   const addToCart = (item: CartItem, restaurant: Restaurant): void => {
// //     console.log('➕ Adding to cart:', item.name);
// //     setCartItems(prevItems => {
// //       let newItems: CartItem[];
      
// //       // Check if cart has items from different restaurant
// //       if (prevItems.length > 0 && prevItems[0].restaurantId !== restaurant.id) {
// //         newItems = [{
// //           ...item,
// //           quantity: 1,
// //           restaurantId: restaurant.id,
// //           restaurantName: restaurant.name
// //         }];
// //       } else {
// //         const existingItem = prevItems.find(
// //           i => i.id === item.id && i.restaurantId === restaurant.id
// //         );

// //         if (existingItem) {
// //           newItems = prevItems.map(i =>
// //             i.id === item.id && i.restaurantId === restaurant.id
// //               ? { ...i, quantity: i.quantity + 1 }
// //               : i
// //           );
// //         } else {
// //           newItems = [...prevItems, {
// //             ...item,
// //             quantity: 1,
// //             restaurantId: restaurant.id,
// //             restaurantName: restaurant.name
// //           }];
// //         }
// //       }
// //       saveCart(newItems);
// //       return newItems;
// //     });
// //   };

// //   const removeFromCart = (itemId: string, restaurantId: string): void => {
// //     console.log('➖ Removing from cart:', itemId);
// //     setCartItems(prevItems => {
// //       const newItems = prevItems.filter(
// //         i => !(i.id === itemId && i.restaurantId === restaurantId)
// //       );
// //       saveCart(newItems);
// //       return newItems;
// //     });
// //   };

// //   const updateQuantity = (itemId: string, restaurantId: string, quantity: number): void => {
// //     console.log('🔄 Updating quantity:', itemId, quantity);
// //     setCartItems(prevItems => {
// //       const newItems = prevItems.map(i =>
// //         i.id === itemId && i.restaurantId === restaurantId
// //           ? { ...i, quantity: Math.max(0, quantity) }
// //           : i
// //       ).filter(i => i.quantity > 0);
// //       saveCart(newItems);
// //       return newItems;
// //     });
// //   };

// //   const clearCart = (): void => {
// //     console.log('🗑️ Clearing cart');
// //     setCartItems([]);
// //     saveCart([]);
// //   };

// //   const getTotalPrice = (): number => {
// //     const total = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
// //     return total;
// //   };

// //   const getTotalItems = (): number => {
// //     return cartItems.reduce((total, item) => total + item.quantity, 0);
// //   };

// //   return (
// //     <CartContext.Provider value={{
// //       cartItems,
// //       addToCart,
// //       removeFromCart,
// //       updateQuantity,
// //       clearCart,
// //       getTotalPrice,
// //       getTotalItems,
// //       refreshCart,
// //       isLoading,
// //       forceRefresh,
// //     }}>
// //       {children}
// //     </CartContext.Provider>
// //   );
// // }
// // delivery-app/src/context/CartContext.tsx
// import React, { createContext, useState, useEffect, ReactNode } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image?: string;
//   restaurantId: string;
//   restaurantName: string;
// }

// interface Restaurant {
//   id: string;
//   name: string;
// }

// interface CartContextType {
//   cartItems: CartItem[];
//   totalItems: number;  // ✅ ADD THIS
//   totalPrice: number;  // ✅ ADD THIS
//   addToCart: (item: CartItem, restaurant: Restaurant) => void;
//   removeFromCart: (itemId: string, restaurantId: string) => void;
//   updateQuantity: (itemId: string, restaurantId: string, quantity: number) => void;
//   clearCart: () => void;
//   getTotalPrice: () => number;
//   getTotalItems: () => number;
//   refreshCart: () => Promise<void>;
//   isLoading: boolean;
//   forceRefresh: () => Promise<void>;
// }

// export const CartContext = createContext<CartContextType>({
//   cartItems: [],
//   totalItems: 0,  // ✅ ADD THIS
//   totalPrice: 0,  // ✅ ADD THIS
//   addToCart: () => {},
//   removeFromCart: () => {},
//   updateQuantity: () => {},
//   clearCart: () => {},
//   getTotalPrice: () => 0,
//   getTotalItems: () => 0,
//   refreshCart: async () => {},
//   isLoading: true,
//   forceRefresh: async () => {},
// });

// interface CartProviderProps {
//   children: ReactNode;
// }

// export function CartProvider({ children }: CartProviderProps): JSX.Element {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   useEffect(() => {
//     console.log('🔄 CartProvider mounted - loading cart...');
//     loadCart();
//   }, []);

//   const loadCart = async (): Promise<void> => {
//     try {
//       console.log('🔄 Loading cart from AsyncStorage...');
//       const savedCart = await AsyncStorage.getItem('cartItems');
//       if (savedCart) {
//         const parsed = JSON.parse(savedCart);
//         setCartItems(parsed);
//         console.log('✅ Cart loaded successfully:', parsed.length, 'items');
//       } else {
//         console.log('📦 No cart found in storage');
//         setCartItems([]);
//       }
//     } catch (error) {
//       console.error('❌ Failed to load cart:', error);
//       setCartItems([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const refreshCart = async (): Promise<void> => {
//     console.log('🔄 Refreshing cart...');
//     await loadCart();
//   };

//   const forceRefresh = async (): Promise<void> => {
//     console.log('🔄 Force refreshing cart...');
//     setIsLoading(true);
//     await loadCart();
//   };

//   const saveCart = async (items: CartItem[]): Promise<void> => {
//     try {
//       await AsyncStorage.setItem('cartItems', JSON.stringify(items));
//       console.log('💾 Cart saved to storage:', items.length, 'items');
//     } catch (error) {
//       console.error('❌ Failed to save cart:', error);
//     }
//   };

//   const addToCart = (item: CartItem, restaurant: Restaurant): void => {
//     console.log('➕ Adding to cart:', item.name);
//     setCartItems(prevItems => {
//       let newItems: CartItem[];
      
//       if (prevItems.length > 0 && prevItems[0].restaurantId !== restaurant.id) {
//         newItems = [{
//           ...item,
//           quantity: 1,
//           restaurantId: restaurant.id,
//           restaurantName: restaurant.name
//         }];
//       } else {
//         const existingItem = prevItems.find(
//           i => i.id === item.id && i.restaurantId === restaurant.id
//         );

//         if (existingItem) {
//           newItems = prevItems.map(i =>
//             i.id === item.id && i.restaurantId === restaurant.id
//               ? { ...i, quantity: i.quantity + 1 }
//               : i
//           );
//         } else {
//           newItems = [...prevItems, {
//             ...item,
//             quantity: 1,
//             restaurantId: restaurant.id,
//             restaurantName: restaurant.name
//           }];
//         }
//       }
//       saveCart(newItems);
//       return newItems;
//     });
//   };

//   const removeFromCart = (itemId: string, restaurantId: string): void => {
//     console.log('➖ Removing from cart:', itemId);
//     setCartItems(prevItems => {
//       const newItems = prevItems.filter(
//         i => !(i.id === itemId && i.restaurantId === restaurantId)
//       );
//       saveCart(newItems);
//       return newItems;
//     });
//   };

//   const updateQuantity = (itemId: string, restaurantId: string, quantity: number): void => {
//     console.log('🔄 Updating quantity:', itemId, quantity);
//     setCartItems(prevItems => {
//       const newItems = prevItems.map(i =>
//         i.id === itemId && i.restaurantId === restaurantId
//           ? { ...i, quantity: Math.max(0, quantity) }
//           : i
//       ).filter(i => i.quantity > 0);
//       saveCart(newItems);
//       return newItems;
//     });
//   };

//   const clearCart = (): void => {
//     console.log('🗑️ Clearing cart');
//     setCartItems([]);
//     saveCart([]);
//   };

//   const getTotalPrice = (): number => {
//     const total = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
//     return total;
//   };

//   const getTotalItems = (): number => {
//     return cartItems.reduce((total, item) => total + item.quantity, 0);
//   };

//   // ✅ Calculate totalItems and totalPrice from cartItems
//   const totalItems = getTotalItems();
//   const totalPrice = getTotalPrice();

//   return (
//     <CartContext.Provider value={{
//       cartItems,
//       totalItems,  // ✅ ADD THIS
//       totalPrice,  // ✅ ADD THIS
//       addToCart,
//       removeFromCart,
//       updateQuantity,
//       clearCart,
//       getTotalPrice,
//       getTotalItems,
//       refreshCart,
//       isLoading,
//       forceRefresh,
//     }}>
//       {children}
//     </CartContext.Provider>
//   );
// }
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

export function CartProvider({ children }: CartProviderProps): JSX.Element {
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
            restaurantName: restaurant.name
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