// // // // // import React, { createContext, useState, useEffect, ReactNode } from 'react';
// // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // import { Order } from '../types';

// // // // // interface OrderContextType {
// // // // //   orders: Order[];
// // // // //   currentOrder: Order | null;
// // // // //   loading: boolean;
// // // // //   createOrder: (orderData: Partial<Order>) => Promise<Order | null>;
// // // // //   updateOrderStatus: (orderId: string, status: Order['status']) => Promise<boolean>;
// // // // //   cancelOrder: (orderId: string) => Promise<boolean>;
// // // // //   getOrderById: (orderId: string) => Order | undefined;
// // // // //   clearOrders: () => Promise<void>;
// // // // //   setCurrentOrder: (order: Order | null) => void;
// // // // // }

// // // // // export const OrderContext = createContext<OrderContextType>({
// // // // //   orders: [],
// // // // //   currentOrder: null,
// // // // //   loading: false,
// // // // //   createOrder: async () => null,
// // // // //   updateOrderStatus: async () => false,
// // // // //   cancelOrder: async () => false,
// // // // //   getOrderById: () => undefined,
// // // // //   clearOrders: async () => {},
// // // // //   setCurrentOrder: () => {},
// // // // // });

// // // // // interface OrderProviderProps {
// // // // //   children: ReactNode;
// // // // // }

// // // // // // export function OrderProvider({ children }: OrderProviderProps): JSX.Element {
// // // // // export function OrderProvider({ children }: OrderProviderProps) {
// // // // //   const [orders, setOrders] = useState<Order[]>([]);
// // // // //   const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
// // // // //   const [loading, setLoading] = useState<boolean>(false);

// // // // //   useEffect(() => {
// // // // //     loadOrders();
// // // // //   }, []);

// // // // //   const loadOrders = async (): Promise<void> => {
// // // // //     try {
// // // // //       const savedOrders = await AsyncStorage.getItem('orders');
// // // // //       if (savedOrders) {
// // // // //         setOrders(JSON.parse(savedOrders));
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('Failed to load orders:', error);
// // // // //     }
// // // // //   };

// // // // //   const saveOrders = async (orderData: Order[]): Promise<void> => {
// // // // //     try {
// // // // //       await AsyncStorage.setItem('orders', JSON.stringify(orderData));
// // // // //     } catch (error) {
// // // // //       console.error('Failed to save orders:', error);
// // // // //     }
// // // // //   };

// // // // //   const createOrder = async (orderData: Partial<Order>): Promise<Order | null> => {
// // // // //     setLoading(true);
// // // // //     try {
// // // // //       const newOrder: Order = {
// // // // //         id: 'ORD' + Date.now().toString(36).toUpperCase(),
// // // // //         restaurantId: orderData.restaurantId || '',
// // // // //         restaurantName: orderData.restaurantName || '',
// // // // //         items: orderData.items || [],
// // // // //         total: orderData.total || 0,
// // // // //         status: 'Preparing',
// // // // //         deliveryAddress: orderData.deliveryAddress || { id: '', type: 'Home', address: '', city: '', state: '', pincode: '', isDefault: false },
// // // // //         paymentMethod: orderData.paymentMethod || '',
// // // // //         createdAt: new Date().toISOString(),
// // // // //         ...orderData,
// // // // //       };
      
// // // // //       const updatedOrders = [newOrder, ...orders];
// // // // //       setOrders(updatedOrders);
// // // // //       await saveOrders(updatedOrders);
// // // // //       setCurrentOrder(newOrder);
// // // // //       return newOrder;
// // // // //     } catch (error) {
// // // // //       console.error('Failed to create order:', error);
// // // // //       return null;
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<boolean> => {
// // // // //     try {
// // // // //       const updatedOrders = orders.map(order => {
// // // // //         if (order.id === orderId) {
// // // // //           return { ...order, status };
// // // // //         }
// // // // //         return order;
// // // // //       });
// // // // //       setOrders(updatedOrders);
// // // // //       await saveOrders(updatedOrders);
      
// // // // //       if (currentOrder && currentOrder.id === orderId) {
// // // // //         setCurrentOrder({ ...currentOrder, status });
// // // // //       }
// // // // //       return true;
// // // // //     } catch (error) {
// // // // //       console.error('Failed to update order:', error);
// // // // //       return false;
// // // // //     }
// // // // //   };

// // // // //   const cancelOrder = async (orderId: string): Promise<boolean> => {
// // // // //     return updateOrderStatus(orderId, 'Cancelled');
// // // // //   };

// // // // //   const getOrderById = (orderId: string): Order | undefined => {
// // // // //     return orders.find(order => order.id === orderId);
// // // // //   };

// // // // //   const clearOrders = async (): Promise<void> => {
// // // // //     try {
// // // // //       await AsyncStorage.removeItem('orders');
// // // // //       setOrders([]);
// // // // //       setCurrentOrder(null);
// // // // //     } catch (error) {
// // // // //       console.error('Failed to clear orders:', error);
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <OrderContext.Provider value={{
// // // // //       orders,
// // // // //       currentOrder,
// // // // //       loading,
// // // // //       createOrder,
// // // // //       updateOrderStatus,
// // // // //       cancelOrder,
// // // // //       getOrderById,
// // // // //       clearOrders,
// // // // //       setCurrentOrder,
// // // // //     }}>
// // // // //       {children}
// // // // //     </OrderContext.Provider>
// // // // //   );
// // // // // }
// // // // import React, { createContext, useState, ReactNode } from 'react';

// // // // interface Order {
// // // //   id: string;
// // // //   restaurantName: string;
// // // //   items: any[];
// // // //   total: number;
// // // //   status: 'Placed' | 'Preparing' | 'Ready' | 'On the way' | 'Delivered' | 'Cancelled';
// // // //   createdAt: string;
// // // // }

// // // // interface OrderContextType {
// // // //   orders: Order[];
// // // //   addOrder: (order: Order) => void;
// // // //   updateOrderStatus: (id: string, status: Order['status']) => void;
// // // //   getOrderCount: () => number;
// // // //   getDeliveredCount: () => number;
// // // //   getCancelledCount: () => number;
// // // //   getTotalSpent: () => number;
// // // // }

// // // // export const OrderContext = createContext<OrderContextType>({
// // // //   orders: [],
// // // //   addOrder: () => {},
// // // //   updateOrderStatus: () => {},
// // // //   getOrderCount: () => 0,
// // // //   getDeliveredCount: () => 0,
// // // //   getCancelledCount: () => 0,
// // // //   getTotalSpent: () => 0,
// // // // });

// // // // interface OrderProviderProps {
// // // //   children: ReactNode;
// // // // }

// // // // export function OrderProvider({ children }: OrderProviderProps): JSX.Element {
// // // //   const [orders, setOrders] = useState<Order[]>([
// // // //     // Sample orders for demo
// // // //     {
// // // //       id: '1',
// // // //       restaurantName: 'Pizza Hut',
// // // //       items: [{ name: 'Margherita Pizza', quantity: 2, price: 369 }],
// // // //       total: 738,
// // // //       status: 'Delivered',
// // // //       createdAt: new Date().toISOString(),
// // // //     },
// // // //     {
// // // //       id: '2',
// // // //       restaurantName: 'Chinese Wok',
// // // //       items: [{ name: 'Chicken Noodles', quantity: 1, price: 299 }],
// // // //       total: 299,
// // // //       status: 'Delivered',
// // // //       createdAt: new Date(Date.now() - 86400000).toISOString(),
// // // //     },
// // // //     {
// // // //       id: '3',
// // // //       restaurantName: 'Burger King',
// // // //       items: [{ name: 'Whopper', quantity: 1, price: 249 }],
// // // //       total: 249,
// // // //       status: 'Cancelled',
// // // //       createdAt: new Date(Date.now() - 172800000).toISOString(),
// // // //     },
// // // //   ]);

// // // //   const addOrder = (order: Order) => {
// // // //     setOrders(prev => [order, ...prev]);
// // // //   };

// // // //   const updateOrderStatus = (id: string, status: Order['status']) => {
// // // //     setOrders(prev => 
// // // //       prev.map(order => 
// // // //         order.id === id ? { ...order, status } : order
// // // //       )
// // // //     );
// // // //   };

// // // //   const getOrderCount = () => orders.length;

// // // //   const getDeliveredCount = () => 
// // // //     orders.filter(order => order.status === 'Delivered').length;

// // // //   const getCancelledCount = () => 
// // // //     orders.filter(order => order.status === 'Cancelled').length;

// // // //   const getTotalSpent = () => 
// // // //     orders.reduce((sum, order) => {
// // // //       if (order.status !== 'Cancelled') {
// // // //         return sum + order.total;
// // // //       }
// // // //       return sum;
// // // //     }, 0);

// // // //   return (
// // // //     <OrderContext.Provider value={{
// // // //       orders,
// // // //       addOrder,
// // // //       updateOrderStatus,
// // // //       getOrderCount,
// // // //       getDeliveredCount,
// // // //       getCancelledCount,
// // // //       getTotalSpent,
// // // //     }}>
// // // //       {children}
// // // //     </OrderContext.Provider>
// // // //   );
// // // // }
// // // import React, { createContext, useState, ReactNode } from 'react';

// // // interface Order {
// // //   id: string;
// // //   restaurantName: string;
// // //   items: any[];
// // //   total: number;
// // //   status: 'Placed' | 'Preparing' | 'Ready' | 'On the way' | 'Delivered' | 'Cancelled';
// // //   createdAt: string;
// // // }

// // // interface OrderContextType {
// // //   orders: Order[];
// // //   addOrder: (order: Order) => void;
// // //   updateOrderStatus: (id: string, status: Order['status']) => void;
// // //   getOrderCount: () => number;
// // //   getDeliveredCount: () => number;
// // //   getCancelledCount: () => number;
// // //   getTotalSpent: () => number;
// // // }

// // // export const OrderContext = createContext<OrderContextType>({
// // //   orders: [],
// // //   addOrder: () => {},
// // //   updateOrderStatus: () => {},
// // //   getOrderCount: () => 0,
// // //   getDeliveredCount: () => 0,
// // //   getCancelledCount: () => 0,
// // //   getTotalSpent: () => 0,
// // // });

// // // interface OrderProviderProps {
// // //   children: ReactNode;
// // // }

// // // export function OrderProvider({ children }: OrderProviderProps) {
// // //   const [orders, setOrders] = useState<Order[]>([
// // //     // Sample orders for demo
// // //     {
// // //       id: '1',
// // //       restaurantName: 'Pizza Hut',
// // //       items: [{ name: 'Margherita Pizza', quantity: 2, price: 369 }],
// // //       total: 738,
// // //       status: 'Delivered',
// // //       createdAt: new Date().toISOString(),
// // //     },
// // //     {
// // //       id: '2',
// // //       restaurantName: 'Chinese Wok',
// // //       items: [{ name: 'Chicken Noodles', quantity: 1, price: 299 }],
// // //       total: 299,
// // //       status: 'Delivered',
// // //       createdAt: new Date(Date.now() - 86400000).toISOString(),
// // //     },
// // //     {
// // //       id: '3',
// // //       restaurantName: 'Burger King',
// // //       items: [{ name: 'Whopper', quantity: 1, price: 249 }],
// // //       total: 249,
// // //       status: 'Cancelled',
// // //       createdAt: new Date(Date.now() - 172800000).toISOString(),
// // //     },
// // //   ]);

// // //   const addOrder = (order: Order) => {
// // //     setOrders(prev => [order, ...prev]);
// // //   };

// // //   const updateOrderStatus = (id: string, status: Order['status']) => {
// // //     setOrders(prev => 
// // //       prev.map(order => 
// // //         order.id === id ? { ...order, status } : order
// // //       )
// // //     );
// // //   };

// // //   const getOrderCount = () => orders.length;

// // //   const getDeliveredCount = () => 
// // //     orders.filter(order => order.status === 'Delivered').length;

// // //   const getCancelledCount = () => 
// // //     orders.filter(order => order.status === 'Cancelled').length;

// // //   const getTotalSpent = () => 
// // //     orders.reduce((sum, order) => {
// // //       if (order.status !== 'Cancelled') {
// // //         return sum + order.total;
// // //       }
// // //       return sum;
// // //     }, 0);

// // //   return (
// // //     <OrderContext.Provider value={{
// // //       orders,
// // //       addOrder,
// // //       updateOrderStatus,
// // //       getOrderCount,
// // //       getDeliveredCount,
// // //       getCancelledCount,
// // //       getTotalSpent,
// // //     }}>
// // //       {children}
// // //     </OrderContext.Provider>
// // //   );
// // // }
// // import React, { createContext, useState, ReactNode } from 'react';

// // interface OrderItem {
// //   name: string;
// //   quantity: number;
// //   price: number;
// // }

// // interface Order {
// //   id: string;
// //   restaurantName: string;
// //   items: OrderItem[];
// //   total: number;
// //   status: 'Placed' | 'Preparing' | 'Ready' | 'On the way' | 'Delivered' | 'Cancelled';
// //   createdAt: string;
// // }

// // interface OrderContextType {
// //   orders: Order[];
// //   addOrder: (order: Order) => void;
// //   updateOrderStatus: (id: string, status: Order['status']) => void;
// // }

// // export const OrderContext = createContext<OrderContextType>({
// //   orders: [],
// //   addOrder: () => {},
// //   updateOrderStatus: () => {},
// // });

// // interface OrderProviderProps {
// //   children: ReactNode;
// // }

// // export function OrderProvider({ children }: OrderProviderProps) {
// //   const [orders, setOrders] = useState<Order[]>([
// //     {
// //       id: '1',
// //       restaurantName: 'Pizza Hut',
// //       items: [{ name: 'Margherita Pizza', quantity: 2, price: 369 }],
// //       total: 738,
// //       status: 'Delivered',
// //       createdAt: new Date().toISOString(),
// //     },
// //     {
// //       id: '2',
// //       restaurantName: 'Chinese Wok',
// //       items: [{ name: 'Chicken Noodles', quantity: 1, price: 299 }],
// //       total: 299,
// //       status: 'Delivered',
// //       createdAt: new Date(Date.now() - 86400000).toISOString(),
// //     },
// //     {
// //       id: '3',
// //       restaurantName: 'Burger King',
// //       items: [{ name: 'Whopper', quantity: 1, price: 249 }],
// //       total: 249,
// //       status: 'Cancelled',
// //       createdAt: new Date(Date.now() - 172800000).toISOString(),
// //     },
// //   ]);

// //   const addOrder = (order: Order) => {
// //     setOrders(prev => [order, ...prev]);
// //   };

// //   const updateOrderStatus = (id: string, status: Order['status']) => {
// //     setOrders(prev =>
// //       prev.map(order =>
// //         order.id === id ? { ...order, status } : order
// //       )
// //     );
// //   };

// //   return (
// //     <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
// //       {children}
// //     </OrderContext.Provider>
// //   );
// // }
// import React, { createContext, useState, ReactNode } from 'react';

// interface Order {
//   id: string;
//   restaurantName: string;
//   items: any[];
//   total: number;
//   status: 'Placed' | 'Preparing' | 'Ready' | 'On the way' | 'Delivered' | 'Cancelled';
//   createdAt: string;
// }

// interface OrderContextType {
//   orders: Order[];
//   addOrder: (order: Order) => void;
//   updateOrderStatus: (id: string, status: Order['status']) => void;
// }

// export const OrderContext = createContext<OrderContextType>({
//   orders: [],
//   addOrder: () => {},
//   updateOrderStatus: () => {},
// });

// interface OrderProviderProps {
//   children: ReactNode;
// }

// export function OrderProvider({ children }: OrderProviderProps): JSX.Element {
//   const [orders, setOrders] = useState<Order[]>([]);

//   const addOrder = (order: Order) => {
//     setOrders(prev => [order, ...prev]);
//   };

//   const updateOrderStatus = (id: string, status: Order['status']) => {
//     setOrders(prev =>
//       prev.map(order =>
//         order.id === id ? { ...order, status } : order
//       )
//     );
//   };

//   return (
//     <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
//       {children}
//     </OrderContext.Provider>
//   );
// }
import React, { createContext, useState, ReactNode } from 'react';

interface Order {
  id: string;
  restaurantName: string;
  items: any[];
  total: number;
  status: 'Placed' | 'Preparing' | 'Ready' | 'On the way' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  getOrders: () => Order[];
}

export const OrderContext = createContext<OrderContextType>({
  orders: [],
  addOrder: () => {},
  updateOrderStatus: () => {},
  getOrders: () => [],
});

interface OrderProviderProps {
  children: ReactNode;
}

export function OrderProvider({ children }: OrderProviderProps): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD1',
      restaurantName: 'Pizza Hut',
      items: [{ name: 'Margherita Pizza', quantity: 2, price: 369 }],
      total: 738,
      status: 'Delivered',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'ORD2',
      restaurantName: 'Chinese Wok',
      items: [{ name: 'Chicken Noodles', quantity: 1, price: 299 }],
      total: 299,
      status: 'On the way',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ]);

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, status } : order
      )
    );
  };

  const getOrders = () => orders;

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, getOrders }}>
      {children}
    </OrderContext.Provider>
  );
}